import type { FC } from "hono/jsx";
import { AuthType } from "../../lib/auth.ts";
import { GuestControl } from "./guest-control.tsx";
import { UserControl } from "./user-control.tsx";

type AuthControlsProps = {
  session: AuthType | null;
  signInCallbackURL: string;
  signOutCallbackURL: string;
};

export const AuthControls: FC<AuthControlsProps> = ({
  session,
  signInCallbackURL,
  signOutCallbackURL,
}) =>
  session
    ? <UserControl session={session} signOutCallbackURL={signOutCallbackURL} />
    : <GuestControl signInCallbackURL={signInCallbackURL} />;
