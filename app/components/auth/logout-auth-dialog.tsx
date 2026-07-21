import type { FC } from "hono/jsx";
import { islandFactory } from "./island.tsx";
import type { IslandName } from "./client/islands.tsx";

const island = islandFactory<IslandName>();
const LogoutMarker = island("logout-auth-dialog");

export const LogoutAuthDialog: FC<{ signOutCallbackURL: string }> = ({
  signOutCallbackURL,
}) => (
  <LogoutMarker
    id="logout-auth-dialog"
    data-sign-out-callback-url={signOutCallbackURL}
  >
    <button type="button" disabled>logout</button>
  </LogoutMarker>
);
