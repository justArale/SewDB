import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";
import { Hono } from "hono";
import { Bindings } from "./bindings";
import patternRouter from "./routes/pattern.routes";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import imageRouter from "./routes/image.routes";
import likeRouter from "./routes/like.routes";
import emailRouter from "./routes/email.routes";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

const app = new Hono<{ Bindings: Bindings }>();

// Middleware to add CORS headers
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", c.env.ORIGIN);
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  c.header("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS preflight requests properly
  if (c.req.method === "OPTIONS") {
    return c.text("OK", 200);
  }

  await next();
});

app.use("/api/*", async (c, next) => {
  const authToken = getCookie(c, "authToken");
  const route = c.req.path;

  const publicRoutes = ["/api/email/sendVerification"];
  console.log("Route: ", route);
  // Allow unauthenticated access to the email router
  if (publicRoutes.includes(route)) {
    console.log("Public route, skipping authentication");
    await next();
    return;
  }
  if (!authToken) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(authToken, c.env.TOKEN_SECRET);

    await next();
  } catch (error) {
    return c.json({ message: "Token invalid or expired" }, 401);
  }
});

app.get("/", (c) => {
  return c.text("Honc! 🪿");
});

app.route("/auth", authRouter);
app.route("/api", patternRouter);
app.route("/api", userRouter);
app.route("/api", imageRouter);
app.route("/api", likeRouter);
app.route("/api", emailRouter);

/**
 * Serve a simplified api specification for your API
 * As of writing, this is just the list of routes and their methods.
 */
/* '@ts-expect-error - @fiberplane/hono is in beta and still not typed correctly*/
app.get("/openapi.json", (c) => {
  return c.json(
    createOpenAPISpec(app as any, {
      info: {
        title: "Honc D1 App",
        version: "1.0.0",
      },
    })
  );
});
/**
 * Mount the Fiberplane api explorer to be able to make requests against your API.
 *
 * Visit the explorer at `/fp`
 */

app.use(
  "/fp/*",
  createFiberplane({
    openapi: { url: "/openapi.json" },
  })
);

export default app;

// Export the instrumented app if you've wired up a Fiberplane-Hono-OpenTelemetry trace collector
//
// export default instrument(app);
