import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { patterns } from "../db/schema";
import { Bindings } from "../bindings";

const patternRouter = new Hono<{ Bindings: Bindings }>();

patternRouter.get("/patterns", async (c) => {
  // return c.text("HoncHonc! 🪿");
  console.log("DATABASE_URL:", c.env.DATABASE_URL);
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const allPatterns = await db.select().from(patterns).execute();
  return c.json(allPatterns);
});

patternRouter.get("/patterns/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const allPatterns = await db.select().from(patterns);
  return c.json({ patterns: allPatterns });
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

  const allPatterns = await db.select().from(patterns);
  return c.json({ patterns: allPatterns });
});

patternRouter.delete("/patterns/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const allPatterns = await db.select().from(patterns);
  return c.json({ patterns: allPatterns });
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

  const allPatterns = await db.select().from(patterns);
  return c.json({ patterns: allPatterns });
});

export default patternRouter;
