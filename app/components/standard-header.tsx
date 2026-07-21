import { AuthType } from "../lib/auth.ts";
import { AuthControls } from "./auth-controls.tsx";

type StandardHeaderProps = {
  session: AuthType | null;
  signInCallbackURL: string;
  signOutCallbackURL: string;
};

export function StandardHeader({
  session,
  signInCallbackURL,
  signOutCallbackURL,
}: StandardHeaderProps) {
  return (
    <>
      <header>
        <a href="/">Objectable</a>
        <AuthControls
          session={session}
          signInCallbackURL={signInCallbackURL}
          signOutCallbackURL={signOutCallbackURL}
        />
      </header>

      <div id="auth-client-root"></div>
      <script type="module" src="/static/auth-header.gen.js"></script>
    </>
  );
}
