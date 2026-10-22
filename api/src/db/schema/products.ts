import { sql } from "drizzle-orm";
import { pgTable, uuid, text, numeric, integer, boolean, timestamp, index, check } from "drizzle-orm/pg-core";

const ts = (name: string) =>
    timestamp(name, { withTimezone: true }).notNull().defaultNow();

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),        // e.g. "beauty-product", "skin-care"
  name: text("name").notNull(),               // user-facing name
  parentId: uuid("parent_id").references((): any => categories.id, { onDelete: 'cascade' }),
  description: text("description"),
  image: text("image"),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at"),
});


export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),          // POS code, the import key
  image: text("image"),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  brand: text("brand"),
  strength: text("strength"),
  form: text("form"),
  packSize: text("pack_size"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  requiresRx: boolean("requires_rx").notNull().default(false),
  categoryId: uuid("category_id").references(() => categories.id),
  active: boolean("active").notNull().default(true),
  description: text("description"),
  searchText: text("search_text").notNull().default(""),
  updatedAt: ts("updated_at"),
}, (t) => [
  index("products_category_idx").on(t.categoryId),
  check("stock_non_negative", sql`${t.stock} >= 0`),
  // trigram + tsvector GIN indexes go in a custom SQL migration
]);