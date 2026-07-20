import { Hono } from "hono";

const router = new Hono()
  .get("/", (c) => {
    const callbackURL = c.req.query("callbackURL") ?? "/protected";

    return c.render(
      <main>
        <section>
          <p>
            Better Auth setup
          </p>
          <h1>
            Sign in
          </h1>
          <form
            method="post"
            action="/api/auth/sign-in/email"
          >
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                autocomplete="email"
                required
              />
            </label>
            <label>
              <span>
                Password
              </span>
              <input
                type="password"
                name="password"
                autocomplete="current-password"
                required
                minLength={8}
              />
            </label>
            <input type="hidden" name="callbackURL" value={callbackURL} />
            <button type="submit">
              Sign in
            </button>
          </form>
          <p>
            Need an account? <a href="/signup">Sign up</a>
          </p>
        </section>
      </main>,
    );
  });

export default router;
