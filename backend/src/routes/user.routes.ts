import { Hono } from "hono";
import { Bindings } from "../bindings";
import { users } from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

const userRouter = new Hono<{ Bindings: Bindings }>();

userRouter.get("/users", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const allUsers = await db.select().from(users);
  return c.json({ users: allUsers });
});

// GET /users/:id
userRouter.get("/users/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const id = Number(c.req.param("id"));

  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (user.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ user: user[0] });
});

// PUT /users/:id
userRouter.put("/users/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const id = Number(c.req.param("id"));
  const { name, email, password, likes } = await c.req.json();

  // User exists?
  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (userExists.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  // Update user
  const updatedUser = await db
    .update(users)
    .set({
      name,
      email,
      password,
      likes,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id));

  return c.json({ user: updatedUser });
});

// DELETE /users/:id
userRouter.delete("/users/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const id = Number(c.req.param("id"));

  // User exists?
  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (userExists.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  // Delete the user
  await db.delete(users).where(eq(users.id, id));

  return c.json({ message: "User deleted successfully" });
});

export default userRouter;
