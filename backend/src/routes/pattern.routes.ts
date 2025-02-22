import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { patterns } from "../db/schema";
import { Bindings } from "../bindings";
import { eq } from "drizzle-orm";

const patternRouter = new Hono<{ Bindings: Bindings }>();

patternRouter.get("/patterns", async (c) => {
  console.log("DATABASE_URL:", c.env.DATABASE_URL);
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const allPatterns = await db.select().from(patterns).execute();
  return c.json(allPatterns);
});

patternRouter.get("/patterns/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const id = Number(c.req.param("id"));

  const pattern = await db
    .select()
    .from(patterns)
    .where(eq(patterns.id, id))
    .limit(1);

  if (pattern.length === 0) {
    return c.json({ error: "Pattern not found" }, 404);
  }
  return c.json({ patterns: pattern[0] });
});

patternRouter.post("/patterns", async (c) => {
  const { name, image, category, sizes } = await c.req.json();

  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const newPattern = await db
    .insert(patterns)
    .values({ name, image, category, sizes })
    .returning();

  return c.json(newPattern[0]);
});

patternRouter.put("/patterns/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const id = Number(c.req.param("id"));
  const { name, image, category, sizes } = await c.req.json();

  //Pattern exists?
  const patternExists = await db
    .select()
    .from(patterns)
    .where(eq(patterns.id, id))
    .limit(1);
  if (patternExists.length === 0) {
    return c.json({ error: "Pattern not found" }, 404);
  }

  //Update pattern
  const updatedPattern = await db
    .update(patterns)
    .set({
      name,
      image,
      category,
      sizes,
      updatedAt: new Date(),
    })
    .where(eq(patterns.id, id));

  return c.json({ pattern: updatedPattern });
});

patternRouter.delete("/patterns/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const id = Number(c.req.param("id"));

  // Pattern exists?
  const userExists = await db
    .select()
    .from(patterns)
    .where(eq(patterns.id, id))
    .limit(1);
  if (userExists.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  // Delete the pattern
  await db.delete(patterns).where(eq(patterns.id, id));

  return c.json({ message: "Pattern deleted successfully" });
});

patternRouter.post("/patterns/:id/like", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const allPatterns = await db.select().from(patterns);
  return c.json({ patterns: allPatterns });
});

patternRouter.delete("/patterns/:id/like", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const id = Number(c.req.param("id"));

  // Pattern exists?
  const userExists = await db
    .select()
    .from(patterns)
    .where(eq(patterns.id, id))
    .limit(1);
  if (userExists.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  // Delete the pattern
  await db.delete(patterns).where(eq(patterns.id, id));

  return c.json({ message: "Pattern deleted successfully" });
});

export default patternRouter;
