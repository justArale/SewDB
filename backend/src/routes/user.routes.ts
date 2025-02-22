import { Hono } from "hono";
import { Bindings } from "../bindings";
import { users } from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const userRouter = new Hono<{ Bindings: Bindings }>();

userRouter.get("/users", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const allUsers = await db.select().from(users);
  return c.json({ users: allUsers });
});

userRouter.get("/users/:id", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const { id } = c.params;

  const user = await db.select().from(users).where(users.id.eq(id)).limit(1);

  if (user.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }
  return c.json({ users: user[0] });
});

export default userRouter;
