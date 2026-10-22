import type { Request, Response } from "express";
import {
    addProduct,
    getProducts,
    getProductById,
    getProductByCode,
    searchProducts,
    updateProduct,
    deleteProduct,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    updateStock,
} from "./products.repo.ts";
import { uploadProductImage } from "../../services/imagekit.service.ts";


//  PRODUCTS
/**
 * POST /product/upload-image
 * Upload a product image to ImageKit. Staff only.
 */
export async function uploadProductImageHandler(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const result = await uploadProductImage(
            req.file.buffer,
            req.file.originalname,
            "/products"
        );

        return res.json({
            success: true,
            message: "Image uploaded successfully",
            data: result,
        });
    } catch (err: any) {
        console.error("[uploadProductImage]", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to upload image",
        });
    }
}

/**
 * POST /product/create
 * Create a new product. Staff only.
 * Supports JSON or multipart/form-data (with attached image file).
 */
export async function createProductHandler(req: Request, res: Response) {
    try {
        const { name, price, description, image, genericName, brand, strength, form, packSize, stock, requiresRx, categoryId, code, active } = req.body;
        
        // Required fields
        if (!name || price === undefined) {
            return res.status(400).json({ success: false, message: "Name and price are required" });
        }

        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice < 0) {
            return res.status(400).json({ success: false, message: "Price must be a valid non-negative number" });
        }

        // Handle image: either from uploaded file via ImageKit or direct URL
        let finalImageUrl = image ?? null;
        if (req.file) {
            const uploadResult = await uploadProductImage(
                req.file.buffer,
                req.file.originalname,
                "/products"
            );
            finalImageUrl = uploadResult.url;
        }

        const product = await addProduct({
            name,
            price: numPrice,
            description,
            image: finalImageUrl,
            genericName,
            brand,
            strength,
            form,
            packSize,
            stock: stock !== undefined ? Number(stock) : 0,
            requiresRx: requiresRx === true || requiresRx === "true",
            categoryId: categoryId && String(categoryId).trim() !== "" ? categoryId : null,
            code,
            active: active !== undefined ? (active === true || active === "true") : true,
        });

        return res.status(201).json({ success: true, message: "Product created successfully", data: product });
    } catch (err) {
        console.error("[createProduct]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * GET /product/list
 * Get a paginated, filtered list of products. Public.
 * Query params: search, categoryId, requiresRx, inStockOnly, minPrice, maxPrice, brand, sortBy, limit, offset
 */
export async function listProductsHandler(req: Request, res: Response) {
    try {
        const { search, categoryId, category, categorySlug, requiresRx, inStockOnly, minPrice, maxPrice, brand, sortBy, limit, offset, activeOnly } = req.query as Record<string, string>;

        const result = await getProducts({
            search,
            categoryId,
            categorySlug: categorySlug || category,
            requiresRx: requiresRx !== undefined ? requiresRx === "true" : undefined,
            inStockOnly: inStockOnly === "true",
            minPrice,
            maxPrice,
            brand,
            sortBy: sortBy as any,
            limit: limit ? parseInt(limit) : 20,
            offset: offset ? parseInt(offset) : 0,
            activeOnly: activeOnly !== "false", // default true
        });

        return res.json({ success: true, ...result });
    } catch (err) {
        console.error("[listProducts]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * GET /product/search
 * Quick search for autocomplete / dropdowns. Public.
 * Query params: q (search term), limit
 */
export async function searchProductsHandler(req: Request, res: Response) {
    try {
        const { q, limit } = req.query as Record<string, string | undefined>;
        const queryStr = typeof q === "string" ? q.trim() : "";

        if (!queryStr) {
            return res.status(400).json({ success: false, message: "Search query 'q' is required" });
        }

        const results = await searchProducts(queryStr, limit ? parseInt(limit) : 10);
        return res.json({ success: true, data: results });
    } catch (err) {
        console.error("[searchProducts]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * GET /product/:id
 * Get a single product by ID. Public.
 */
export async function getProductHandler(req: Request, res: Response) {
    try {
        const id = req.params["id"] as string;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const product = isUuid ? await getProductById(id) : await getProductByCode(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, data: product });
    } catch (err) {
        console.error("[getProduct]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * PATCH /product/:id
 * Update a product's details. Staff only.
 * Supports JSON or multipart/form-data (with new attached image file).
 */
export async function updateProductHandler(req: Request, res: Response) {
    try {
        const id = req.params["id"] as string;
        const updateData = { ...req.body };

        // Reject if price is explicitly set to an invalid value
        if (updateData.price !== undefined) {
            const numPrice = Number(updateData.price);
            if (isNaN(numPrice) || numPrice < 0) {
                return res.status(400).json({ success: false, message: "Price must be a valid non-negative number" });
            }
            updateData.price = numPrice;
        }

        // Handle numeric stock if passed in multipart form
        if (updateData.stock !== undefined) {
            updateData.stock = Number(updateData.stock);
        }

        // Handle boolean requiresRx if passed in multipart form
        if (updateData.requiresRx !== undefined) {
            updateData.requiresRx = updateData.requiresRx === true || updateData.requiresRx === "true";
        }

        // Handle boolean active if passed in multipart form
        if (updateData.active !== undefined) {
            updateData.active = updateData.active === true || updateData.active === "true";
        }

        // Sanitize categoryId if provided as empty string
        if (updateData.categoryId !== undefined) {
            updateData.categoryId = updateData.categoryId && String(updateData.categoryId).trim() !== "" ? updateData.categoryId : null;
        }

        // Upload new image if file is attached
        if (req.file) {
            const uploadResult = await uploadProductImage(
                req.file.buffer,
                req.file.originalname,
                "/products"
            );
            updateData.image = uploadResult.url;
        }

        const updated = await updateProduct(id, updateData);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, message: "Product updated successfully", data: updated });
    } catch (err) {
        console.error("[updateProduct]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * PATCH /product/:id/stock
 * Adjust stock by a delta (positive = add, negative = subtract). Staff only.
 * Body: { delta: number }
 */
export async function adjustStockHandler(req: Request, res: Response) {
    try {
        const id = req.params["id"] as string;
        const { delta } = req.body;

        if (delta === undefined || isNaN(Number(delta))) {
            return res.status(400).json({ success: false, message: "'delta' must be a number" });
        }

        const updated = await updateStock(id, Number(delta));
        if (!updated) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, message: "Stock updated", data: updated });
    } catch (err) {
        console.error("[adjustStock]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * DELETE /product/:id
 * Delete a product from the database. Staff / Admin only.
 */
export async function deleteProductHandler(req: Request, res: Response) {
    try {
        const id = req.params["id"] as string;

        const wasDeleted = await deleteProduct(id);
        if (!wasDeleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        console.error("[deleteProduct]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// CATEGORIES
/**
 * GET /product/categories
 * List all categories. Public.
 */
export async function listCategoriesHandler(req: Request, res: Response) {
    try {
        const categories = await getAllCategories();
        return res.json({ success: true, data: categories });
    } catch (err) {
        console.error("[listCategories]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * GET /product/categories/:id
 * Get a single category by ID. Public.
 */
export async function getCategoryHandler(req: Request, res: Response) {
    try {
        const id = req.params["id"] as string;

        const category = await getCategoryById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.json({ success: true, data: category });
    } catch (err) {
        console.error("[getCategory]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * POST /product/categories
 * Create a new category. Staff/Admin.
 * Body: { name: string, slug?: string, parentId?: string, description?: string, image?: string }
 */
export async function createCategoryHandler(req: Request, res: Response) {
    try {
        const { name, slug, parentId, description, image } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }

        const category = await createCategory({
            name,
            slug,
            parentId: parentId && String(parentId).trim() !== "" ? parentId : null,
            description,
            image,
        });
        return res.status(201).json({ success: true, message: "Category created", data: category });
    } catch (err) {
        console.error("[createCategory]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * PATCH /product/categories/:id
 * Update an existing category. Staff/Admin.
 */
export async function updateCategoryHandler(req: Request, res: Response) {
    try {
        const id = req.params["id"] as string;
        const { name, slug, parentId, description, image } = req.body;

        const updated = await updateCategory(id, {
            name,
            slug,
            parentId: parentId !== undefined ? (parentId && String(parentId).trim() !== "" ? parentId : null) : undefined,
            description,
            image,
        });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.json({ success: true, message: "Category updated", data: updated });
    } catch (err) {
        console.error("[updateCategory]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * DELETE /product/categories/:id
 * Delete a category. Staff/Admin.
 */
export async function deleteCategoryHandler(req: Request, res: Response) {
    try {
        const id = req.params["id"] as string;

        const deleted = await deleteCategory(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.json({ success: true, message: "Category deleted" });
    } catch (err) {
        console.error("[deleteCategory]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
