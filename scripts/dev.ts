const serverArgs = [
  "run",
  "--watch",
  "-A",
  "--unstable-no-legacy-abort",
  "main.ts",
];
const clientWatcherArgs = ["run", "-A", "scripts/watch-client.ts"];

const serverProcess = new Deno.Command(Deno.execPath(), {
  args: serverArgs,
  stdout: "inherit",
  stderr: "inherit",
}).spawn();

const clientWatcherProcess = new Deno.Command(Deno.execPath(), {
  args: clientWatcherArgs,
  stdout: "inherit",
  stderr: "inherit",
}).spawn();

const stopChildProcesses = () => {
  try {
    serverProcess.kill("SIGTERM");
  } catch {
    // Process may already be closed.
  }

  try {
    clientWatcherProcess.kill("SIGTERM");
  } catch {
    // Process may already be closed.
  }
};

Deno.addSignalListener("SIGINT", stopChildProcesses);
Deno.addSignalListener("SIGTERM", stopChildProcesses);

const [serverStatus, watcherStatus] = await Promise.all([
  serverProcess.status,
  clientWatcherProcess.status,
]);

const exitCode = serverStatus.code !== 0
  ? serverStatus.code
  : watcherStatus.code;
Deno.exit(exitCode);
