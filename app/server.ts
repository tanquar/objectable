import { serveStatic } from "hono/deno";
import authRoute from "./routes/auth.ts";
import protectedRoute from "./routes/protected.tsx";
import homeRoute from "./routes/home.tsx";
import { createRouter } from "./lib/create-app.ts";
import { sessionFromRequest } from "./lib/auth.ts";

const router = createRouter()
  .use("/static/*", serveStatic({ root: "./" }))
  .use("*", async (c, next) => {
    const path = c.req.path;
    const isApiRoute = path === "/api" || path.startsWith("/api/");
    if (isApiRoute) {
      return await next();
    }

    const session = await sessionFromRequest(c.req);
    c.set("session", session);

    await next();
  })
  .route("/api", authRoute)
  .route("/protected", protectedRoute)
  .route("/", homeRoute);

export default router;
