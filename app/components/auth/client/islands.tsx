import type { JSX } from "hono/jsx/dom/jsx-runtime";
import { LoginAuthDialogs } from "./login-auth-dialogs.tsx";
import { LogoutAuthDialog } from "./logout-auth-dialog.tsx";

// The hydration map: a server marker tags a container with
// data-island="<name>" and mountIslands mounts the matching component into it.
// Server markers import IslandName (type-only, so no browser code runs on the
// server) to keep marker names compile-checked against this registry.
export const ISLANDS = {
  "login-auth-dialogs": LoginAuthDialogs,
  "logout-auth-dialog": LogoutAuthDialog,
} satisfies Record<
  string,
  (props: { container: HTMLElement }) => JSX.Element
>;

export type IslandName = keyof typeof ISLANDS;
