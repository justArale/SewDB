import { relations } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export type NewUser = typeof users.$inferInsert;
export type NewPattern = typeof patterns.$inferInsert;
export type NewUserLike = typeof usersToPatterns.$inferInsert;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  isVerified: boolean("is_verified").default(false),
  verificationToken: text("verification_token"),
  verificationTokenExpires: timestamp("verification_token_expires"),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToPatterns: many(usersToPatterns),
}));

export const patterns = pgTable("patterns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: jsonb("image").default([]),
  intendedFor: jsonb("intended_for").notNull(),
  category: jsonb("category").notNull(),
  sizes: jsonb("sizes").notNull(),
  source: jsonb("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const patternRelations = relations(patterns, ({ many }) => ({
  usersToPatterns: many(usersToPatterns),
}));

export const usersToPatterns = pgTable(
  "usersToPatterns",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    patternId: integer("pattern_id")
      .notNull()
      .references(() => patterns.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.patternId] })]
);
