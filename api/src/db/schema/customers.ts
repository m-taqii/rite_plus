import {
  pgTable, uuid, text, timestamp,
} from "drizzle-orm/pg-core";

const ts = (name: string) =>
  timestamp(name, { withTimezone: true }).notNull().defaultNow();

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").notNull().unique(),
  name: text("name"),
  email: text("email").unique(),
  address: text("address"),
  passwordHash: text("password_hash"),
  createdAt: ts("created_at"),
});