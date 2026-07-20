import { assert, assertEquals } from "@std/assert";
import { renderToString } from "hono/jsx/dom/server";
import { StandardHeader } from "./standard-header.tsx";
import { LoginAuthDialogs } from "./login-auth-dialogs.tsx";
import { LogoutAuthDialog } from "./logout-auth-dialog.tsx";

Deno.test("StandardHeader renders login dialogs for guest users", () => {
  const html = renderToString(
    <StandardHeader
      user={null}
      signInCallbackURL="/protected"
      signOutCallbackURL="/"
    />,
  );

  assert(html.includes('id="auth-client-root"'));
  assert(html.includes('data-dialog-open="login-dialog"'));
  assert(html.includes('id="login-dialog"'));
  assert(html.includes('id="signup-dialog"'));
  assert(!html.includes('id="logout-dialog"'));
});

Deno.test("LoginAuthDialogs injects callbackURL into signin and signup forms", () => {
  const html = renderToString(
    <LoginAuthDialogs signInCallbackURL="/protected" />,
  );

  const callbackField = 'name="callbackURL" value="/protected"';
  assertEquals(html.split(callbackField).length - 1, 2);
  assert(html.includes('data-auth-form="signin"'));
  assert(html.includes('data-auth-form="signup"'));
});

Deno.test("LogoutAuthDialog renders expected form wiring", () => {
  const html = renderToString(
    <LogoutAuthDialog signOutCallbackURL="/" />,
  );

  assert(html.includes('id="logout-dialog"'));
  assert(html.includes('action="/api/auth/sign-out"'));
  assert(html.includes('data-auth-form="signout"'));
  assert(html.includes('name="callbackURL" value="/"'));
});
