import { Hono } from "hono";
import { Bindings } from "../bindings";
import { users } from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { logger } from "hono/logger";
import { z } from "zod";
import { sign } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import bcrypt from "bcryptjs";

const authRouter = new Hono<{ Bindings: Bindings }>();

authRouter.use(logger());

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

authRouter.post("/signup", async (c) => {
  const { email, password, name } = signupSchema.parse(await c.req.json());

  if (!email || !password || !name) {
    return c.json({ message: "Provide email, password and name" }, 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return c.json({ message: "Provide a valid email address." }, 400);
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return c.json(
      {
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      },
      400
    );
  }
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const foundUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute();

  if (foundUser.length > 0) {
    return c.json({ message: "User already exists." }, 400);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const createdUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
      })
      .returning();

    return c.json({ user: createdUser[0] }, 201);
  } catch (err) {
    console.error("Error during signup:", err);
    return c.json({ message: "Server error" }, 500);
  }
});

authRouter.post("/login", async (c) => {
  try {
    const { email, password } = loginSchema.parse(await c.req.json());

    if (!email || !password) {
      return c.json({ message: "Provide email and password." }, 400);
    }

    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);

    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (foundUser.length === 0) {
      return c.json({ message: "User not found." }, 401);
    }

    const user = foundUser[0];

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (passwordCorrect) {
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + 6 * 60,
      };

      const authToken = await sign(payload, c.env.TOKEN_SECRET);
      setCookie(c, "authToken", authToken);

      return c.json({ authToken });
    } else {
      return c.json({ message: "Unable to authenticate the user" }, 401);
    }
  } catch (err) {
    console.error("Error during login:", err);
    return c.json({ message: "Server error" }, 500);
  }
});

// 🚀 Verify Route mit Auth Middleware
// authRouter.get("/verify", isAuthenticated, async (c) => {
//   const payload = c.get("payload");
//   if (!payload) {
//     return c.json({ message: "Unauthorized" }, 401);
//   }
//   return c.json(payload);
// });

export default authRouter;
