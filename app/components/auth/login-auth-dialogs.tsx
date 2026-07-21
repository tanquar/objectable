import type { FC } from "hono/jsx";
import { islandFactory } from "./island.tsx";
import type { IslandName } from "./client/islands.tsx";

const island = islandFactory<IslandName>();
const LoginMarker = island("login-auth-dialogs");

export const LoginAuthDialogs: FC<{ signInCallbackURL: string }> = ({
  signInCallbackURL,
}) => (
  <LoginMarker
    id="login-auth-dialogs"
    data-sign-in-callback-url={signInCallbackURL}
  >
    <button type="button" disabled>login</button>
  </LoginMarker>
);
