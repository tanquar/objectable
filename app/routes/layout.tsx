import type { FC, PropsWithChildren } from "hono/jsx";
import { AuthType } from "../lib/auth.ts";
import { StandardHeader } from "../components/standard-header.tsx";

type LayoutProps = PropsWithChildren<{
  session: AuthType | null;
  signInCallbackURL: string;
  signOutCallbackURL: string;
}>;

export const Layout: FC<LayoutProps> = ({
  session,
  signInCallbackURL,
  signOutCallbackURL,
  children,
}) => (
  <html>
    <head>
      <script type="module" src="/static/auth.client.gen.js"></script>
    </head>
    <body>
      <StandardHeader
        session={session}
        signInCallbackURL={signInCallbackURL}
        signOutCallbackURL={signOutCallbackURL}
      />
      {children}
    </body>
  </html>
);
