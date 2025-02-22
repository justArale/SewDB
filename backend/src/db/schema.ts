import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type NewUser = typeof users.$inferInsert;
export type NewPattern = typeof patterns.$inferInsert;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  likes: jsonb("likes"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const patterns = pgTable("patterns", {
  id: serial("id").primaryKey(),
  name: text("name"),
  image: text("image"),
  category: jsonb("category"),
  sizes: jsonb("sizes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
