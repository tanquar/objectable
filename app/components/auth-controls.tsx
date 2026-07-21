import { AuthType } from "../lib/auth.ts";
import { LoginAuthDialogs } from "./login-auth-dialogs.tsx";
import { LogoutAuthDialog } from "./logout-auth-dialog.tsx";
import { FC } from "hono/jsx";

type AuthControlsProps = {
  session: AuthType | null;
  signInCallbackURL: string;
  signOutCallbackURL: string;
};

const GuestControl: FC<{ signInCallbackURL: string }> = (
  { signInCallbackURL },
) => (
  <>
    <div>
      <button type="button" data-dialog-open="login-dialog">
        login
      </button>
    </div>
    <LoginAuthDialogs signInCallbackURL={signInCallbackURL} />
  </>
);

const UserControl: FC<{ session: AuthType; signOutCallbackURL: string }> = (
  { session, signOutCallbackURL },
) => (
  <>
    <span>
      {session.user?.name} / {session.user?.email}
    </span>
    <button type="button" data-dialog-open="logout-dialog">
      logout
    </button>
    <LogoutAuthDialog signOutCallbackURL={signOutCallbackURL} />
  </>
);

export function AuthControls({
  session,
  signInCallbackURL,
  signOutCallbackURL,
}: AuthControlsProps) {
  return session
    ? <UserControl session={session} signOutCallbackURL={signOutCallbackURL} />
    : <GuestControl signInCallbackURL={signInCallbackURL} />;
}
