import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";
import { Hono } from "hono";
import { Bindings } from "./bindings";
import patternRouter from "./routes/pattern.routes";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
// import imageRouter from "./routes/image.routes";

const app = new Hono<{ Bindings: Bindings }>();

// Middleware to add CORS headers
app.use("*", (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return next();
});

app.get("/", (c) => {
  return c.text("Honc! 🪿");
});

app.route("/auth", authRouter);
app.route("/api", patternRouter);
app.route("/api", userRouter);
// app.route("/api", imageRouter);

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
