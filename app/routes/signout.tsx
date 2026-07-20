import { Hono } from "hono";
import { auth } from "../lib/auth.ts";

const router = new Hono()
  .get("/", (c) => {
    const callbackURL = c.req.query("callbackURL") ?? "/signin";

    return c.render(
      <main>
        <section>
          <p>
            Better Auth setup
          </p>
          <h1>
            Sign out
          </h1>
          <p>
            You will be signed out of this session and redirected after
            confirmation.
          </p>
          <form
            method="post"
            action={`/signout?callbackURL=${encodeURIComponent(callbackURL)}`}
          >
            <button type="submit">
              Sign out
            </button>
          </form>
          <p>
            <a href="/protected">Back to protected route</a>
          </p>
        </section>
      </main>,
    );
  })
  .post("/", async (c) => {
    const callbackURL = c.req.query("callbackURL") ?? "/signin";
    const authResponse = await auth.handler(
      new Request(new URL("/api/auth/sign-out", c.req.url), {
        method: "POST",
        headers: c.req.raw.headers,
      }),
    );

    const headers = new Headers(authResponse.headers);
    headers.set("Location", callbackURL);

    return new Response(null, {
      status: 302,
      headers,
    });
  });

export default router;
