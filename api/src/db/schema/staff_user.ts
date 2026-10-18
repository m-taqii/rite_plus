import {
  pgTable, pgEnum, uuid, text, boolean, timestamp,
} from "drizzle-orm/pg-core";

const ts = (name: string) =>
  timestamp(name, { withTimezone: true }).notNull().defaultNow();

export const staffRole = pgEnum("staff_role", ["admin", "staff", "maintainer"]);
export const actorType = pgEnum("actor_type", ["customer", "staff"]);

export const staffUsers = pgTable("staff_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: staffRole("role").notNull().default('staff'),
  active: boolean("active").notNull().default(true),
  sensitiveAccessUntil: timestamp("sensitive_access_until", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: ts("created_at"),
});
