const repoRoot = new URL("../", import.meta.url);

const entry = "app/components/auth/client/main.ts";
const output = "static/auth.client.gen.js";

// The client bundle is built from the single auth client entry. No --config
// flag: app/components/auth/client is a workspace member whose deno.json
// supplies the hono/jsx/dom JSX config.
export async function buildClient(): Promise<void> {
  const basePath = decodeURIComponent(repoRoot.pathname);
  await Deno.mkdir(new URL("static", repoRoot), { recursive: true });

  const bundleCommand = new Deno.Command(Deno.execPath(), {
    args: ["bundle", "--platform=browser", "-o", output, entry],
    cwd: basePath,
    stdout: "inherit",
    stderr: "inherit",
  });

  const bundleResult = await bundleCommand.output();
  if (bundleResult.code !== 0) {
    throw new Error(
      `Client bundle failed with exit code ${bundleResult.code}`,
    );
  }

  console.log(`Generated ${output}`);
}

if (import.meta.main) {
  try {
    await buildClient();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}
