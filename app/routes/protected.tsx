import { Hono } from "hono";
import { auth } from "../lib/auth.ts";
import { StandardHeader } from "../components/standard-header.tsx";

const router = new Hono()
  .get("/", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.redirect("/?callbackURL=%2Fprotected");
    }

    return c.render(
      <main>
        <StandardHeader
          user={session.user}
          signInCallbackURL="/protected"
          signOutCallbackURL="/"
        />

        <section>
          <p>Welcome to the protected page!</p>
        </section>
      </main>,
    );
  });

export default router;
