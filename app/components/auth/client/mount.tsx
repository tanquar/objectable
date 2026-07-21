import { render } from "hono/jsx/dom";
import type { JSX } from "hono/jsx/dom/jsx-runtime";

type IslandComponent = (props: { container: HTMLElement }) => JSX.Element;

// Mounts each registry component into its data-island container rendered by
// the server marker twins (../components/auth/island.tsx), replacing the SSR
// placeholder. The component runs INSIDE render() so its hooks are valid, and
// receives the container so it can read per-container data-* config. Unknown
// names throw so a stale bundle against a newer page fails loudly.
export const mountIslands = (
  islands: Record<string, IslandComponent | undefined>,
): void => {
  const containers = globalThis.document.querySelectorAll<HTMLElement>(
    "[data-island]",
  );
  for (const container of containers) {
    const name = container.dataset.island ?? "";
    const Island = islands[name];
    if (Island === undefined) throw new Error(`unknown island: ${name}`);
    container.replaceChildren();
    render(<Island container={container} />, container);
  }
};
