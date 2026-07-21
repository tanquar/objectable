import type { FC } from "hono/jsx";
import { AuthType } from "../lib/auth.ts";
import { AuthControls } from "./auth/auth-controls.tsx";

type StandardHeaderProps = {
  session: AuthType | null;
  signInCallbackURL: string;
  signOutCallbackURL: string;
};

export const StandardHeader: FC<StandardHeaderProps> = ({
  session,
  signInCallbackURL,
  signOutCallbackURL,
}) => (
  <header>
    <a href="/">Objectable</a>
    <AuthControls
      session={session}
      signInCallbackURL={signInCallbackURL}
      signOutCallbackURL={signOutCallbackURL}
    />
  </header>
);
