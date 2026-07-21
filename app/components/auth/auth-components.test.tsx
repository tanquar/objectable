import { assert } from "@std/assert";
import { AuthType } from "../../lib/auth.ts";
import { StandardHeader } from "../standard-header.tsx";
import { Layout } from "../../routes/layout.tsx";
import { LoginAuthDialogs } from "./login-auth-dialogs.tsx";
import { LogoutAuthDialog } from "./logout-auth-dialog.tsx";

// hono/jsx element .toString() yields the SSR HTML (sometimes a Promise).
const renderToString = async (element: unknown): Promise<string> =>
  await (element as { toString(): string | Promise<string> }).toString();

const signedIn = {
  user: { name: "tanquar", email: "tanquar@example.com" },
  session: null,
} as unknown as AuthType;

Deno.test("StandardHeader renders login island for guest users", async () => {
  const html = await renderToString(
    <StandardHeader
      session={null}
      signInCallbackURL="/protected"
      signOutCallbackURL="/"
    />,
  );

  assert(html.includes('data-island="login-auth-dialogs"'));
  assert(html.includes('id="login-auth-dialogs"'));
  assert(html.includes('data-sign-in-callback-url="/protected"'));
  assert(!html.includes('data-island="logout-auth-dialog"'));
});

Deno.test("StandardHeader renders logout island for signed-in users", async () => {
  const html = await renderToString(
    <StandardHeader
      session={signedIn}
      signInCallbackURL="/"
      signOutCallbackURL="/"
    />,
  );

  assert(html.includes('data-island="logout-auth-dialog"'));
  assert(html.includes('id="logout-auth-dialog"'));
  assert(html.includes("tanquar"));
  assert(!html.includes('data-island="login-auth-dialogs"'));
});

Deno.test("LoginAuthDialogs marker carries island name and callback attr", async () => {
  const html = await renderToString(
    <LoginAuthDialogs signInCallbackURL="/protected" />,
  );

  assert(html.includes('data-island="login-auth-dialogs"'));
  assert(html.includes('data-sign-in-callback-url="/protected"'));
});

Deno.test("LogoutAuthDialog marker carries island name and callback attr", async () => {
  const html = await renderToString(
    <LogoutAuthDialog signOutCallbackURL="/" />,
  );

  assert(html.includes('data-island="logout-auth-dialog"'));
  assert(html.includes('data-sign-out-callback-url="/"'));
});

Deno.test("Layout renders bundle script and children un-escaped", async () => {
  const html = await renderToString(
    <Layout session={null} signInCallbackURL="/" signOutCallbackURL="/">
      <p>hi</p>
    </Layout>,
  );

  assert(html.includes('src="/static/auth.client.gen.js"'));
  // The regression this fix addresses: header and children must be real HTML.
  assert(html.includes("<header>"));
  assert(!html.includes("&lt;header&gt;"));
  assert(html.includes("<p>hi</p>"));
});
