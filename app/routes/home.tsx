import { FC } from "hono/jsx";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod/v4";
import { Layout } from "../routes/layout.tsx";
import { createRouter } from "../lib/create-app.ts";
import { AuthType } from "../lib/auth.ts";

const QuerySchema = z.object({
  callbackURL: z
    .string()
    .optional()
    .default("/")
    .refine((url) => {
      if (!url.startsWith("/")) return false;
      if (url.startsWith("//")) return false;
      if (/[\r\n]/.test(url)) return false;

      return true;
    }, {
      message: "Invalid callback URL",
    }),
});

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
  .get("/", zValidator("query", QuerySchema), (c) => {
    const session = c.get("session");
    const { callbackURL: signInCallbackURL } = c.req.valid("query");

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
