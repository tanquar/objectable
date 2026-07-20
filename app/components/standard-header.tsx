import { AuthControls } from "./auth-controls.tsx";

type StandardHeaderProps = {
  user: {
    name: string;
  } | null;
  signInCallbackURL: string;
  signOutCallbackURL: string;
};

export function StandardHeader({
  user,
  signInCallbackURL,
  signOutCallbackURL,
}: StandardHeaderProps) {
  return (
    <>
      <header>
        <a href="/">Objectable</a>
        <AuthControls
          user={user}
          signInCallbackURL={signInCallbackURL}
          signOutCallbackURL={signOutCallbackURL}
        />
      </header>

      <div id="auth-client-root"></div>
      <script type="module" src="/static/auth-header.gen.js"></script>
    </>
  );
}
