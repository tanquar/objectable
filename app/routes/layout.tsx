import { FC, PropsWithChildren } from "hono/jsx";
import { AuthType } from "../lib/auth.ts";
import { StandardHeader } from "../components/standard-header.tsx";

export const Layout: FC<
  & {
    session: AuthType | null;
    signInCallbackURL: string;
    signOutCallbackURL: string;
  }
  & PropsWithChildren
> = ({ session, signInCallbackURL, signOutCallbackURL, ...props }) => (
  <html>
    <body>
      <StandardHeader
        session={session}
        signInCallbackURL={signInCallbackURL}
        signOutCallbackURL={signOutCallbackURL}
      />
      {props.children}
    </body>
  </html>
);
