import { FC } from "hono/jsx";
import { Layout } from "../routes/layout.tsx";
import { createRouter } from "../lib/create-app.ts";
import { AuthType } from "../lib/auth.ts";

const GuestProtected: FC = () => {
  return (
    <section>
      <p>login required</p>
    </section>
  );
};

const UserProtected: FC<{ session: AuthType }> = ({ session }) => {
  return (
    <section>
      <p>Welcome to the protected page! You are {session?.user?.name}.</p>
    </section>
  );
};

const router = createRouter()
  .get("/", (c) => {
    const session = c.get("session");

    if (!session) {
      return c.redirect("/?callbackURL=%2Fprotected");
    }

    const signInCallbackURL = c.req.query("callbackURL") ?? "/";
    return c.html(
      <Layout
        session={session}
        signInCallbackURL={signInCallbackURL}
        signOutCallbackURL="/"
      >
        {session ? <UserProtected session={session} /> : <GuestProtected />}
      </Layout>,
    );
  });

export default router;
