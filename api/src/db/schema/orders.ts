import {
  pgTable, pgEnum, uuid, text, timestamp, numeric, integer, serial, index, check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { customers } from "./customers";
import { products } from "./products";

export const orderStatus = pgEnum("order_status", [
  "pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled",
]);
export const paymentMethod = pgEnum("payment_method", ["cod", "online"]);

const ts = (name: string) =>
  timestamp(name, { withTimezone: true }).notNull().defaultNow();

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNo: serial("order_no").notNull().unique(),
  customerId: uuid("customer_id").references(() => customers.id),
  status: orderStatus("status").notNull().default("pending"),
  paymentMethod: paymentMethod("payment_method").notNull().default("cod"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  deliveryName: text("delivery_name").notNull(),   // snapshot, not a live link
  deliveryPhone: text("delivery_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  notes: text("notes"),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at"),
}, (t) => [index("orders_customer_idx").on(t.customerId, t.createdAt)]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  name: text("name").notNull(),                    // product name at order time
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  qty: integer("qty").notNull(),
}, (t) => [check("qty_positive", sql`${t.qty} > 0`)]);