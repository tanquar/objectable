import { LoginAuthDialogs } from "./login-auth-dialogs.tsx";
import { LogoutAuthDialog } from "./logout-auth-dialog.tsx";

type AuthControlsProps = {
  user: {
    name: string;
  } | null;
  signInCallbackURL: string;
  signOutCallbackURL: string;
};

export function AuthControls({
  user,
  signInCallbackURL,
  signOutCallbackURL,
}: AuthControlsProps) {
  return (
    <>
      <div>
        {user
          ? (
            <>
              <span>{user.name}</span>
              <button type="button" data-dialog-open="logout-dialog">
                logout
              </button>
            </>
          )
          : (
            <button type="button" data-dialog-open="login-dialog">
              login
            </button>
          )}
      </div>

      {!user
        ? <LoginAuthDialogs signInCallbackURL={signInCallbackURL} />
        : <LogoutAuthDialog signOutCallbackURL={signOutCallbackURL} />}
    </>
  );
}
