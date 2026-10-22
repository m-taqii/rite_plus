import { db } from "../../db/index.ts";
import { products, categories } from "../../db/schema/products.ts";
import { eq, and, or, ilike, sql, desc, asc, gte, lte, inArray } from "drizzle-orm";

// Inferred Drizzle Schema Types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

// Flexible input type for creating products
export type CreateProductInput = {
    code?: string;
    name: string;
    price: number | string;
    description?: string | null;
    image?: string | null;
    genericName?: string | null;
    brand?: string | null;
    strength?: string | null;
    form?: string | null;
    packSize?: string | null;
    stock?: number;
    requiresRx?: boolean;
    categoryId?: string | null;
    active?: boolean;
    searchText?: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductFilterParams = {
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    requiresRx?: boolean;
    activeOnly?: boolean;
    inStockOnly?: boolean;
    minPrice?: number | string;
    maxPrice?: number | string;
    brand?: string;
    sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
    limit?: number;
    offset?: number;
};

/**
 * Generate a clean, unique product code / SKU if one is not provided.
 */
export function generateProductCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PRD-${timestamp}-${random}`;
}

/**
 * Build normalized search text indexing name, generic name, brand, code, and description.
 */
export function buildSearchText(item: {
    name?: string | null;
    genericName?: string | null;
    brand?: string | null;
    code?: string | null;
    description?: string | null;
}): string {
    return [
        item.name,
        item.genericName,
        item.brand,
        item.code,
        item.description,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .trim();
}

/**
 * Add / Create a product.
 * Supports both an input object: addProduct({ name, price, ... })
 * and individual positional arguments: addProduct(name, description, price)
 */
export async function addProduct(
    inputOrName: CreateProductInput | string,
    description?: string,
    price?: number | string
): Promise<Product> {
    let payload: CreateProductInput;

    if (typeof inputOrName === "string") {
        payload = {
            name: inputOrName,
            description: description ?? null,
            price: price ?? 0,
        };
    } else {
        payload = inputOrName;
    }

    const code = payload.code?.trim() || generateProductCode();
    const computedSearch = payload.searchText || buildSearchText({ ...payload, code });

    const [created] = await db
        .insert(products)
        .values({
            code,
            name: payload.name.trim(),
            price: payload.price.toString(),
            description: payload.description ?? null,
            image: payload.image ?? null,
            genericName: payload.genericName ?? null,
            brand: payload.brand ?? null,
            strength: payload.strength ?? null,
            form: payload.form ?? null,
            packSize: payload.packSize ?? null,
            stock: payload.stock ?? 0,
            requiresRx: payload.requiresRx ?? false,
            categoryId: payload.categoryId ?? null,
            active: payload.active ?? true,
            searchText: computedSearch,
        })
        .returning();

    if (!created) {
        throw new Error("Failed to create product");
    }

    return created;
}

// Alias for addProduct
export const createProduct = addProduct;

/**
 * Get product by its UUID.
 */
export async function getProductById(id: string): Promise<Product | null> {
    const rows = await db
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);

    return rows[0] ?? null;
}

/**
 * Get product by unique POS code / SKU.
 */
export async function getProductByCode(code: string): Promise<Product | null> {
    const rows = await db
        .select()
        .from(products)
        .where(eq(products.code, code))
        .limit(1);

    return rows[0] ?? null;
}

/**
 * Get products with rich filtering, full-text / like search, pagination, and sorting.
 */
export async function getProducts(filters: ProductFilterParams = {}): Promise<{
    items: Product[];
    total: number;
    limit: number;
    offset: number;
}> {
    const conditions = [];

    // Active status filter (default to active only unless explicitly disabled)
    if (filters.activeOnly !== false) {
        conditions.push(eq(products.active, true));
    }

    // Category filter (supports hierarchical categories: matches category OR its subcategories)
    let targetCatId = filters.categoryId;
    if (!targetCatId && filters.categorySlug) {
        const cat = await getCategoryBySlug(filters.categorySlug);
        if (cat) targetCatId = cat.id;
    }

    if (targetCatId) {
        const subCats = await db
            .select({ id: categories.id })
            .from(categories)
            .where(eq(categories.parentId, targetCatId));
        const catIds = [targetCatId, ...subCats.map((c) => c.id)];
        conditions.push(inArray(products.categoryId, catIds));
    }

    // Prescription filter
    if (typeof filters.requiresRx === "boolean") {
        conditions.push(eq(products.requiresRx, filters.requiresRx));
    }

    // In-stock filter
    if (filters.inStockOnly) {
        conditions.push(sql`${products.stock} > 0`);
    }

    // Brand filter
    if (filters.brand) {
        conditions.push(ilike(products.brand, `%${filters.brand}%`));
    }

    // Price range filters
    if (filters.minPrice !== undefined && filters.minPrice !== "") {
        conditions.push(gte(products.price, filters.minPrice.toString()));
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
        conditions.push(lte(products.price, filters.maxPrice.toString()));
    }

    // Search query matching against searchText, name, genericName, brand, or code
    if (filters.search && filters.search.trim()) {
        const query = `%${filters.search.trim().toLowerCase()}%`;
        conditions.push(
            or(
                ilike(products.searchText, query),
                ilike(products.name, query),
                ilike(products.genericName, query),
                ilike(products.brand, query),
                ilike(products.code, query)
            )
        );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Determine sorting
    let orderByClause;
    switch (filters.sortBy) {
        case "price_asc":
            orderByClause = asc(products.price);
            break;
        case "price_desc":
            orderByClause = desc(products.price);
            break;
        case "name_asc":
            orderByClause = asc(products.name);
            break;
        case "name_desc":
            orderByClause = desc(products.name);
            break;
        case "newest":
        default:
            orderByClause = desc(products.updatedAt);
            break;
    }

    const limit = Math.max(1, filters.limit ?? 20);
    const offset = Math.max(0, filters.offset ?? 0);

    // Run item query and count query in parallel
    const [items, countResult] = await Promise.all([
        db
            .select()
            .from(products)
            .where(whereClause)
            .orderBy(orderByClause)
            .limit(limit)
            .offset(offset),
        db
            .select({ count: sql<number>`count(*)::int` })
            .from(products)
            .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;

    return {
        items,
        total,
        limit,
        offset,
    };
}

/**
 * Get all products (convenience helper).
 */
export async function getAllProducts(options: { activeOnly?: boolean } = {}): Promise<Product[]> {
    const conditions = [];
    if (options.activeOnly !== false) {
        conditions.push(eq(products.active, true));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return db
        .select()
        .from(products)
        .where(whereClause)
        .orderBy(desc(products.updatedAt));
}

/**
 * Fast search helper for autocomplete, instant search, or dropdowns.
 */
export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
    if (!query || !query.trim()) return [];
    const term = `%${query.trim().toLowerCase()}%`;

    return db
        .select()
        .from(products)
        .where(
            and(
                eq(products.active, true),
                or(
                    ilike(products.searchText, term),
                    ilike(products.name, term),
                    ilike(products.genericName, term),
                    ilike(products.brand, term),
                    ilike(products.code, term)
                )
            )
        )
        .limit(limit);
}

/**
 * Update product by ID. Automatically updates searchText and updatedAt.
 */
export async function updateProduct(
    id: string,
    data: UpdateProductInput
): Promise<Product | null> {
    const existing = await getProductById(id);
    if (!existing) return null;

    const updatedData: Record<string, any> = {
        updatedAt: new Date(),
    };

    if (data.code !== undefined) updatedData.code = data.code;
    if (data.name !== undefined) updatedData.name = data.name.trim();
    if (data.price !== undefined) updatedData.price = data.price.toString();
    if (data.description !== undefined) updatedData.description = data.description;
    if (data.image !== undefined) updatedData.image = data.image;
    if (data.genericName !== undefined) updatedData.genericName = data.genericName;
    if (data.brand !== undefined) updatedData.brand = data.brand;
    if (data.strength !== undefined) updatedData.strength = data.strength;
    if (data.form !== undefined) updatedData.form = data.form;
    if (data.packSize !== undefined) updatedData.packSize = data.packSize;
    if (data.stock !== undefined) updatedData.stock = data.stock;
    if (data.requiresRx !== undefined) updatedData.requiresRx = data.requiresRx;
    if (data.categoryId !== undefined) updatedData.categoryId = data.categoryId;
    if (data.active !== undefined) updatedData.active = data.active;

    // Recalculate search text if relevant fields changed
    const searchSource = {
        name: updatedData.name ?? existing.name,
        genericName: updatedData.genericName ?? existing.genericName,
        brand: updatedData.brand ?? existing.brand,
        code: updatedData.code ?? existing.code,
        description: updatedData.description ?? existing.description,
    };
    updatedData.searchText = data.searchText || buildSearchText(searchSource);

    const [updated] = await db
        .update(products)
        .set(updatedData)
        .where(eq(products.id, id))
        .returning();

    return updated ?? null;
}

/**
 * Adjust product stock level (atomic delta, prevents negative stock).
 */
export async function updateStock(id: string, delta: number): Promise<Product | null> {
    const [updated] = await db
        .update(products)
        .set({
            stock: sql`GREATEST(0, ${products.stock} + ${delta})`,
            updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

    return updated ?? null;
}

/**
 * Soft delete product (sets active = false).
 */
export async function softDeleteProduct(id: string): Promise<Product | null> {
    const [updated] = await db
        .update(products)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();

    return updated ?? null;
}

/**
 * Hard delete product.
 */
export async function deleteProduct(id: string): Promise<boolean> {
    const result = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

    return result.length > 0;
}

// -------------------------------------------------------------
// Category Helpers
// -------------------------------------------------------------

export async function getAllCategories(): Promise<Category[]> {
    return db
        .select()
        .from(categories)
        .orderBy(asc(categories.name));
}

export async function getCategoryById(id: string): Promise<Category | null> {
    const rows = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

    return rows[0] ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const rows = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

    return rows[0] ?? null;
}

export async function createCategory(data: {
    name: string;
    slug?: string;
    parentId?: string | null;
    description?: string | null;
    image?: string | null;
}): Promise<Category> {
    const slug = data.slug || data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const [created] = await db
        .insert(categories)
        .values({
            name: data.name.trim(),
            slug,
            parentId: data.parentId || null,
            description: data.description || null,
            image: data.image || null,
        })
        .returning();

    if (!created) {
        throw new Error("Failed to create category");
    }

    return created;
}

export async function updateCategory(
    id: string,
    data: {
        name?: string;
        slug?: string;
        parentId?: string | null;
        description?: string | null;
        image?: string | null;
    }
): Promise<Category | null> {
    const updateData: Record<string, any> = {
        updatedAt: new Date(),
    };
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.slug !== undefined) updateData.slug = data.slug.trim();
    if (data.parentId !== undefined) updateData.parentId = data.parentId || null;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;

    const [updated] = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();

    return updated ?? null;
}

export async function deleteCategory(id: string): Promise<boolean> {
    const result = await db
        .delete(categories)
        .where(eq(categories.id, id))
        .returning();

    return result.length > 0;
}
