import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import authRoute from "./routes/auth.ts";
import protectedRoute from "./routes/protected.tsx";
import homeRoute from "./routes/home.tsx";

const router = new Hono()
  .use("/static/*", serveStatic({ root: "./" }))
  .route("/", homeRoute)
  .route("/api", authRoute)
  .route("/protected", protectedRoute);

export default router;
