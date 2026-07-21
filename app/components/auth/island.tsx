import type { Child } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";

// A marker also carries typed data-* attributes so islands can read per-
// container config (callback URLs) from the client without string concat.
type IslandProps =
  & { id?: string; class?: string; children?: Child }
  & { [key: `data-${string}`]: string | undefined };

type IslandMarker = (props: IslandProps) => JSX.Element;

// Server-side marker factory for client islands: a marker renders only the
// data-island container the client registry mounts the real component into,
// with children as the static pre-hydration placeholder. Bind it to the app's
// registry key union (a type-only import, so no browser code runs server-side)
// to keep marker names compile-checked:
//
//   import type { IslandName } from "./client/islands.tsx";
//   const island = islandFactory<IslandName>();
//   const Login = island("login-auth-dialogs");
export function islandFactory<Name extends string>(): (
  name: Name,
  tag?: "div" | "aside",
) => IslandMarker {
  return (name: Name, Tag: "div" | "aside" = "div"): IslandMarker =>
  ({ id, class: klass, children, ...dataAttrs }: IslandProps): JSX.Element => (
    <Tag id={id} class={klass} data-island={name} {...dataAttrs}>
      {children}
    </Tag>
  );
}
