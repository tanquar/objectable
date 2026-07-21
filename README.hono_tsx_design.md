# hono TSX app design — objectable

Conventions for this hono TSX app. Adapted from a reference design ("two JSX
worlds, no hydration"); deviations from the reference are called out explicitly.

## Big picture

The app is a server-rendered hono site plus a single client bundle that mounts
interactive "islands" into marked containers. Today the only islands are the
auth controls (login/signup dialogs, logout dialog) rendered in the header of
every page.

```
main.ts                     Deno.serve entry
app/
  server.ts                 static serving, session middleware, route mounts
  routes/                   pages (home, protected) + layout.tsx (SSR shell)
  lib/                      SERVER-ONLY code: better-auth, Mongo client
  components/               server JSX components (hono/jsx)
    standard-header.tsx     header: brand link + <AuthControls>
    auth/
      island.tsx            islandFactory — typed marker components
      auth-controls.tsx     session ? <UserControl> : <GuestControl>
      login-auth-dialogs.tsx  server marker twin (guest)
      logout-auth-dialog.tsx  server marker twin (signed-in)
      client/               browser code (hono/jsx/dom) — own workspace member
        deno.json           jsx react-jsx, jsxImportSource hono/jsx/dom, DOM libs
        main.ts             entry: mountIslands(ISLANDS)
        islands.tsx         registry: island name → component; exports IslandName
        mount.tsx           mountIslands (shared infra; see "Adding" below)
        login-auth-dialogs.tsx / logout-auth-dialog.tsx   island components
scripts/
  build-client.ts           deno bundle --platform=browser → static/auth.client.gen.js
  watch-client.ts           rebuilds the bundle on app/ changes
  dev.ts                    spawns server (--watch) + client watcher
static/
  auth.client.gen.js        generated; excluded via deno.json "exclude"
```

## Two JSX worlds, no hydration

- Server code renders **strings** with `hono/jsx` (`"jsx": "precompile"`,
  `"jsxImportSource": "hono/jsx"` in the root `deno.json`). It never imports
  browser code. Components return JSX, **never raw HTML strings** — hono/jsx
  escapes strings returned from components, so a string-returning component
  renders as visible `&lt;tags&gt;`.
- Client code renders **DOM** with `hono/jsx/dom` (`"jsx": "react-jsx"`,
  configured in `app/components/auth/client/deno.json`). The client dir is a
  workspace member listed in the root `deno.json` `workspace` — per-directory
  config is required because `deno check` ignores `@jsxImportSource` pragmas.
- hono has no real hydration: `hydrateRoot` in `hono/jsx/dom/client` is
  documented as "equivalent to render" (verified against the hono 4.12.31
  source). The client therefore **replaces** each island container's SSR
  placeholder via `render()`; keep placeholders minimal (a disabled button) —
  they exist only to avoid dead space before the bundle mounts.
- The only server→client link is a **type-only** import of `IslandName` from
  `client/islands.tsx`, so marker names are compile-checked against the registry
  without pulling browser code into the server graph.

## Islands

Server side — marker twins via `islandFactory`:

```tsx
import { islandFactory } from "./island.tsx";
import type { IslandName } from "./client/islands.tsx";

const island = islandFactory<IslandName>();
const LoginMarker = island("login-auth-dialogs");

export const LoginAuthDialogs: FC<{ signInCallbackURL: string }> = (
  { signInCallbackURL },
) => (
  <LoginMarker
    id="login-auth-dialogs"
    data-sign-in-callback-url={signInCallbackURL}
  >
    <button type="button" disabled>login</button> {/* placeholder */}
  </LoginMarker>
);
```

Deviation from the reference: the reference passes config globally via
`<body data-api-url>`; our islands need per-instance values (callback URLs), so
markers accept typed `data-*` props and each marker is wrapped in an exported
server component that converts a typed prop (`signInCallbackURL: string`) into
the data-attribute contract. The stringly `data-*` names live in exactly one
file per island. The "twin" naming holds on the module boundary: server
`LoginAuthDialogs` ↔ registry key `"login-auth-dialogs"` ↔ client
`LoginAuthDialogs`.

Client side — registry + mount:

```tsx
// client/islands.tsx
export const ISLANDS = {
  "login-auth-dialogs": LoginAuthDialogs,
  "logout-auth-dialog": LogoutAuthDialog,
} satisfies Record<string, (props: { container: HTMLElement }) => JSX.Element>;
export type IslandName = keyof typeof ISLANDS;

// client/main.ts
mountIslands(ISLANDS);
```

`mountIslands` (`client/mount.tsx`) scans `[data-island]`, clears the
placeholder, and renders `<Island container={container} />` — the component
function must run **inside** the render context (calling it as a plain function
before `render()` breaks hooks; deviation from the reference, whose islands take
no props). Components read their config from `container.dataset`. Unknown island
names throw, so a stale bundle against a newer page fails loudly. Adding an
island = one registry entry + one marker. No element ids for wiring, no
`getElementById`, no manual listeners in `main.ts`.

## State

- **Pending/error UI is `useState`**, rendered declaratively (`{errors.signin}`,
  `disabled={pending === "signin"}`). Never write `textContent` / `.disabled`
  through refs — that mutates DOM behind the renderer's back.
- **Refs are for imperative platform handles only**: `<dialog>` `showModal()` /
  `close()`.
- Immutable updates (`setErrors((prev) => ({ ...prev, [kind]: msg }))`).
- No store/query layer yet: the auth islands own no shared or server-cached
  state (a successful auth call ends in `location.href = …`, which resets the
  world). Introduce the reference's `state/` (createStore) and `data/` (query
  cache) layers only when an island actually needs cross-island or cached server
  state.

## Auth specifics

- better-auth handles `/api/auth/**` (mounted in `app/server.ts`); the session
  middleware puts `AuthType | null` on the context for non-API routes.
- Islands POST JSON with `credentials: "include"` to `/api/auth/sign-in/email`,
  `/api/auth/sign-up/email`, `/api/auth/sign-out`; on success they redirect to
  `payload.url` when it starts with `/`, else to the form's `callbackURL`.
- `callbackURL` is validated server-side (`/`-prefixed, no `//`, no CR/LF) in
  the home route's query schema before it ever reaches a form.
- better-auth's Mongo adapter uses **transactions**: MongoDB must be a replica
  set (single-node `--replSet rs0` + `replSetInitiate` is fine for dev;
  standalone mongod fails with "Transaction numbers are only allowed on a
  replica set member").

## Delivery

- `deno task build:client` bundles the single entry
  `app/components/auth/client/main.ts` with `deno bundle --platform=browser` to
  `static/auth.client.gen.js`. No `--config` flag — the workspace member's
  `deno.json` supplies the client JSX config.
- `deno task dev` = build once, then server `--watch` + `watch-client.ts`
  (rebuilds on any `app/**/*.ts(x)` change).
- The page loads the bundle with one `<script type="module">` in
  `app/routes/layout.tsx`; `app/server.ts` serves `/static/*` via `serveStatic`.

## Platform standards first

Prefer what the browser owns over reimplementing it:

- **Modals**: native `<dialog>` opened with `showModal()` through a ref;
  backdrop click = `e.target === dialog`; Esc is native.
- **Refs over ids** for focus and imperative handles; ids on island containers
  are document anchors, not wiring.

## Conventions

- ~250 lines max per file; split by responsibility, not by size alone.
- Comments in English, minimal — state constraints the code can't show.
- `.ts` files never import `.tsx` — sole exception: `client/main.ts` importing
  the registry. This keeps logic testable without a renderer.
- `globalThis.document` / `globalThis.location` etc. (deno lint `no-undef`
  rejects bare browser globals; bare `fetch` / `FormData` are allowed).
- Buttons without behavior appear only as marker placeholders (`disabled`),
  never as silent no-ops in live UI.

## Adding a new island (checklist)

Another auth island:

1. Component in `app/components/auth/client/<name>.tsx` taking
   `{ container: HTMLElement }`; config via `container.dataset`.
2. Registry entry in `client/islands.tsx`.
3. Marker twin in `app/components/auth/` via `islandFactory` (typed `data-*`
   props + minimal placeholder), rendered from a server component.
4. `deno check . && deno lint && deno fmt --check && deno test`, then
   `deno task build:client`.

A whole new island _app_: create `app/components/<app>/client/` with its own
`deno.json` (copy the auth one), add it to the root `workspace`, give it its own
bundle entry in `scripts/build-client.ts` (`static/<app>.client.gen.js`), and
extract `mount.tsx` into a shared client workspace member (e.g.
`app/utils/client/` — the reference's `utils/client` role) instead of
duplicating it. Do **not** put browser code in `app/lib` (server world;
`app/lib/client.ts` is the Mongo client).

## Planned additions (near-term)

- **store/query layer**: port the reference's `utils/client` pieces — `store.ts`
  (createStore/useStore via `useSyncExternalStore`) and `query.ts` (thin
  TanStack **query-core** adapter). Do **not** use `@tanstack/react-query`: it
  hard-imports real React, which cannot run under hono/jsx/dom (null hook
  dispatcher — verified in the reference). query-core is for reads only;
  mutations stay plain `fetch` + invalidate, pending/error stays `useState`.
- **Tailwind**: a CSS build alongside the client bundle (`--watch` in dev,
  `--minify` in build) emitting `static/styles.gen.css`, loaded from
  `layout.tsx`; covered by the existing `static/**/*.gen.*` exclude.
- Both land in a shared client workspace member (e.g. `app/utils/client/`) — the
  same moment `mount.tsx` moves there (see the checklist above).

## Known runtime gotchas

- hono `useEffect` flushes via `requestAnimationFrame`: in a hidden tab, effects
  don't run until the tab is fronted. Prefer platform-owned open/close state
  (`showModal()`) over effect-driven plumbing.
- hono/jsx/dom does not re-apply a `value` prop to an input the user has edited
  — reset input values imperatively through a ref.
- `hydrateRoot` exists but is a `render` alias (no DOM reuse) — do not design
  around React-style hydration.
