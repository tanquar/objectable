import { Hono } from "hono";

const router = new Hono()
  .get("/", (c) => {
    const callbackURL = c.req.query("callbackURL") ?? "/";

    return c.render(
      <main>
        <section>
          <p>
            Better Auth setup
          </p>
          <h1>
            Create your account
          </h1>
          <form
            method="post"
            action="/api/auth/sign-up/email"
          >
            <label>
              <span>Name</span>
              <input
                name="name"
                autocomplete="name"
                required
              />
            </label>
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
                autocomplete="new-password"
                required
                minLength={8}
              />
            </label>
            <input type="hidden" name="callbackURL" value={callbackURL} />
            <button type="submit">
              Sign up
            </button>
          </form>
          <p>
            Already have an account? <a href={`/signin?callbackURL=${encodeURIComponent(callbackURL)}`}>Sign in</a>
          </p>
        </section>
      </main>,
    );
  });

export default router;
