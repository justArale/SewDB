import { Hono } from "hono";
import { Bindings } from "../bindings";
import { users } from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { logger } from "hono/logger";
import { z } from "zod";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import bcrypt from "bcryptjs";

const authRouter = new Hono<{ Bindings: Bindings }>();

authRouter.use(logger());

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  isAdmin: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  exp: z.number(),
  isAdmin: z.boolean(),
});

// Signup Route
authRouter.post("/signup", async (c) => {
  const { email, password, name, isAdmin } = signupSchema.parse(
    await c.req.json()
  );

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
  const verifyToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

  try {
    const createdUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        isAdmin: isAdmin || false,
        verificationToken: verifyToken,
        verificationTokenExpires: expires,
      })
      .returning();

    return c.json({ user: createdUser[0] }, 201);
  } catch (err) {
    console.error("Error during signup:", err);
    return c.json({ message: "Server error" }, 500);
  }
});

// Login Route
authRouter.post("/login", async (c) => {
  try {
    const { email, password } = loginSchema.parse(await c.req.json());
    const isProduction = c.env.ENVIRONMENT === "production";

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
    } else if (foundUser[0].isVerified === false) {
      return c.json(
        {
          message:
            "User not verified. Please check your email for verification.",
        },
        401
      );
    }

    const user = foundUser[0];

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (passwordCorrect) {
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 1 week in seconds
        isAdmin: user.isAdmin,
      };

      const authToken = await sign(payload, c.env.TOKEN_SECRET);
      setCookie(c, "authToken", authToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Lax",
        path: "/",
        maxAge: 600 * 600,
      });

      return c.json({ authToken });
    } else {
      return c.json({ message: "Unable to authenticate the user" }, 401);
    }
  } catch (err) {
    console.error("Error during login:", err);
    return c.json({ message: "Server error" }, 500);
  }
});

// Verify Route
authRouter.get("/verify", async (c) => {
  const authToken = getCookie(c, "authToken");
  if (!authToken) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(authToken, c.env.TOKEN_SECRET);
    const validatedUser = userSchema.safeParse(payload);

    return c.json(validatedUser.data);
  } catch (error) {
    return c.json({ message: "Token invalid or expired" }, 401);
  }
});

// Verify Token Route
authRouter.get("/verifyToken", async (c) => {
  const verifyToken = c.req.query("token");
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  if (!verifyToken) {
    return c.json({ message: "Token is invalid" }, 401);
  }
  try {
    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, verifyToken))
      .execute();

    if (foundUser.length === 0) {
      return c.json({ message: "User not found." }, 401);
    }

    const user = foundUser[0];
    const isExpired = user.verificationTokenExpires
      ? new Date(user.verificationTokenExpires) < new Date()
      : true;

    if (isExpired) {
      return c.json({ message: "Token is expired" }, 401);
    }

    const updatedUser = await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      })
      .where(eq(users.id, user.id))
      .execute();

    return c.json(
      { message: "Your email has been successfully verified!" },
      200
    );
  } catch (error) {
    return c.json({ message: "Token invalid or expired" }, 401);
  }
});

// Logout Route
authRouter.post("/logout", (c) => {
  setCookie(c, "authToken", "", { path: "/", maxAge: -1 });

  return c.json({ message: "Logged out successfully" });
});

export default authRouter;
