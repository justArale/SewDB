import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { patterns } from "../db/schema";
import { Bindings } from "../bindings";
import { eq, and, arrayContains } from "drizzle-orm";

const patternRouter = new Hono<{ Bindings: Bindings }>();

// GET all patterns
patternRouter.get("/patterns", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const allPatterns = await db.select().from(patterns).execute();
  return c.json(allPatterns);
});

// GET pattern by ID
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

// GET patterns by search params
patternRouter.get(
  "/patterns/:primaryParam/:primaryValue/:secondaryParam?/:secondaryValue?",
  async (c) => {
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    const primaryParam = c.req.param("primaryParam");
    const primaryValue = c.req.param("primaryValue");
    const secondaryParam = c.req.param("secondaryParam");
    const secondaryValue = c.req.param("secondaryValue");

    const patternsBySearchParams = await db
      .select()
      .from(patterns)
      .where(
        and(
          arrayContains(
            patterns[primaryParam as keyof typeof patterns] as any,
            primaryValue
          ),
          secondaryParam && secondaryValue
            ? arrayContains(
                patterns[secondaryParam as keyof typeof patterns] as any,
                secondaryValue
              )
            : undefined
        )
      );

    if (patternsBySearchParams.length === 0) {
      return c.json({ message: "No patterns found for this search" }, 404);
    }

    return c.json(patternsBySearchParams);
  }
);

// POST new pattern
patternRouter.post("/patterns", async (c) => {
  const { name, image, category, sizes, source, intendedFor } =
    await c.req.json();

  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const newPattern = await db
    .insert(patterns)
    .values({ name, image, category, sizes, source, intendedFor })
    .returning();

  return c.json(newPattern[0]);
});

// PUT pattern by ID
patternRouter.put("/patterns/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const id = Number(c.req.param("id"));
  const { name, image, category, sizes, source, intendedFor } =
    await c.req.json();

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
      source,
      intendedFor,
    })
    .where(eq(patterns.id, id));

  return c.json({ pattern: updatedPattern });
});

// DELETE pattern by ID
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
    return c.json({ error: "Pattern not found" }, 404);
  }

  // Delete the pattern
  await db.delete(patterns).where(eq(patterns.id, id));

  return c.json({ message: "Pattern deleted successfully" });
});

export default patternRouter;
