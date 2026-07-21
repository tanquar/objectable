import { FC } from "hono/jsx";
import { Layout } from "../routes/layout.tsx";
import { createRouter } from "../lib/create-app.ts";
import { AuthType } from "../lib/auth.ts";

const GuestHome: FC = () => (
  <section>
    <p>home</p>
    <p>login required</p>
  </section>
);

const UserHome: FC<{ user: AuthType["user"] }> = ({ user }) => (
  <section>
    <p>home</p>
    <p>
      user: {user?.name} ({user?.email})
    </p>
    <a href="/protected">/protected</a>
  </section>
);

const router = createRouter()
  .get("/", (c) => {
    const session = c.get("session");
    const signInCallbackURL = c.req.query("callbackURL") ?? "/";

    return c.html(
      <Layout
        session={session}
        signInCallbackURL={signInCallbackURL}
        signOutCallbackURL="/"
      >
        {session ? <UserHome user={session.user} /> : <GuestHome />}
      </Layout>,
    );
  });

export default router;
