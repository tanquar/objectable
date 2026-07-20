import { buildClient } from "./build-client.ts";

const watcher = Deno.watchFs(["app"]);

let isBuilding = false;
let rebuildQueued = false;

async function runBuild(trigger: string): Promise<void> {
  if (isBuilding) {
    rebuildQueued = true;
    return;
  }

  isBuilding = true;
  try {
    console.log(`[watch-client] change detected (${trigger})`);
    await buildClient();
  } catch (error) {
    console.error(
      `[watch-client] build failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } finally {
    isBuilding = false;
  }

  if (rebuildQueued) {
    rebuildQueued = false;
    await runBuild("queued");
  }
}

console.log("[watch-client] watching app/**/*.ts and app/**/*.tsx");

for await (const event of watcher) {
  const changedPath = event.paths.find((path) =>
    path.includes("/app/") && (path.endsWith(".ts") || path.endsWith(".tsx"))
  );

  if (!changedPath) {
    continue;
  }

  await runBuild(changedPath);
}
