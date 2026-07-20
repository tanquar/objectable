import { expandGlob } from "@std/fs/expand-glob";

const repoRoot = new URL("../", import.meta.url);

const outDir = "static";
const clientRootDir = "app";

function toLocalPath(url: URL): string {
  return decodeURIComponent(url.pathname);
}

function toBundleOutputName(entryPath: string): string {
  const fileName = entryPath.split("/").at(-1) ?? entryPath;
  return fileName.replace(/\.ts$/, ".js");
}

function toGeneratedOutputName(bundleOutputName: string): string {
  if (bundleOutputName.endsWith(".client.js")) {
    return bundleOutputName.replace(/\.client\.js$/, ".gen.js");
  }

  return bundleOutputName.replace(/\.js$/, ".gen.js");
}

export async function buildClient(): Promise<void> {
  await Deno.mkdir(new URL(outDir, repoRoot), { recursive: true });

  const basePath = toLocalPath(repoRoot);
  const entries: string[] = [];
  for await (
    const entry of expandGlob(`${clientRootDir}/**/*.client.ts`, {
      root: basePath,
      includeDirs: false,
    })
  ) {
    entries.push(entry.path);
  }

  if (entries.length === 0) {
    console.warn(`No client entry files found under ${clientRootDir}/`);
    return;
  }

  entries.sort();

  for (const entryPath of entries) {
    const bundleCommand = new Deno.Command(Deno.execPath(), {
      args: ["bundle", "--outdir", outDir, entryPath],
      cwd: basePath,
      stdout: "inherit",
      stderr: "inherit",
    });

    const bundleResult = await bundleCommand.output();
    if (bundleResult.code !== 0) {
      throw new Error(
        `Client bundle failed for ${entryPath} with exit code ${bundleResult.code}`,
      );
    }

    const bundleOutputName = toBundleOutputName(entryPath);
    const generatedOutputName = toGeneratedOutputName(bundleOutputName);
    const bundledOutput = new URL(`${outDir}/${bundleOutputName}`, repoRoot);
    const generatedOutput = new URL(
      `${outDir}/${generatedOutputName}`,
      repoRoot,
    );

    try {
      await Deno.stat(bundledOutput);
    } catch {
      throw new Error(
        `Expected bundle output was not found: ${bundledOutput.pathname}`,
      );
    }

    try {
      await Deno.remove(generatedOutput);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }

    await Deno.rename(bundledOutput, generatedOutput);
    console.log(`Generated ${generatedOutput.pathname}`);
  }
}

if (import.meta.main) {
  try {
    await buildClient();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}
