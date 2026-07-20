import { Hono } from "hono";
import { auth } from "../lib/auth.ts";
import { StandardHeader } from "../components/standard-header.tsx";

const router = new Hono()
  .get("/", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    const signInCallbackURL = c.req.query("callbackURL") ?? "/";

    return c.render(
      <main>
        <StandardHeader
          user={session?.user ?? null}
          signInCallbackURL={signInCallbackURL}
          signOutCallbackURL="/"
        />

        <section>
          <p>home</p>
          {session ? <p>username: {session.user.name}</p> : null}
          {signInCallbackURL !== "/" ? <p>login required</p> : null}
          <a href="/protected">/protected</a>
        </section>
      </main>,
    );
  });

export default router;
