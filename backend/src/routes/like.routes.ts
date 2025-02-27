import { Hono } from "hono";
import { Bindings } from "../bindings";
import { users } from "../db/schema";
import { patterns } from "../db/schema";
import { usersToPatterns } from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";

const likeRouter = new Hono<{ Bindings: Bindings }>();

// GET user liked patterns
likeRouter.get("/likes/:userId/patterns", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const userId = Number(c.req.param("userId"));

  if (isNaN(userId)) {
    return c.json({ error: "Invalid user ID" }, 400);
  }

  const likedPatterns = await db
    .select({
      id: patterns.id,
      name: patterns.name,
      image: patterns.image,
    })
    .from(usersToPatterns)
    .innerJoin(patterns, eq(usersToPatterns.patternId, patterns.id))
    .where(eq(usersToPatterns.userId, userId));

  if (likedPatterns.length === 0) {
    return c.json({ message: "No liked patterns found for this user" }, 404);
  }

  return c.json(likedPatterns);
});

// GET pattern with all liked users
likeRouter.get("/likes/:patternId/users", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const patternId = Number(c.req.param("patternId"));

  if (isNaN(patternId)) {
    return c.json({ error: "Invalid pattern ID" }, 400);
  }

  const likedPatterns = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(usersToPatterns)
    .innerJoin(users, eq(usersToPatterns.userId, users.id))
    .where(eq(usersToPatterns.patternId, patternId));

  if (likedPatterns.length === 0) {
    return c.json({ message: "No user liked this pattern" }, 404);
  }

  return c.json(likedPatterns);
});

// POST Like and unlike pattern
likeRouter.post("/likes/:patternId/:userId", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const userId = Number(c.req.param("userId"));
  const patternId = Number(c.req.param("patternId"));

  if (isNaN(userId) || isNaN(patternId)) {
    return c.json({ error: "Invalid user ID or pattern ID" }, 400);
  }

  // Check if the user has already liked the pattern
  const userLikedPattern = await db
    .select()
    .from(usersToPatterns)
    .where(
      and(
        eq(usersToPatterns.userId, userId),
        eq(usersToPatterns.patternId, patternId)
      )
    )
    .limit(1);

  if (userLikedPattern.length === 0) {
    const likedPatterns = await db
      .insert(usersToPatterns)
      .values({ userId, patternId })
      .returning();
    return c.json(likedPatterns);
  } else {
    await db
      .delete(usersToPatterns)
      .where(
        and(
          eq(usersToPatterns.userId, userId),
          eq(usersToPatterns.patternId, patternId)
        )
      );
    return c.json({ message: "Pattern unliked successfully" });
  }
});

export default likeRouter;
