import { Hono } from "hono";
import { auth } from "../lib/auth.ts";

const router = new Hono()
  .get("/", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.redirect("/signin?callbackURL=%2Fprotected");
    }

    return c.json({ message: `Welcome, ${session.user.email}!` });
  });

export default router;
