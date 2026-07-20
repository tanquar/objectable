import { Hono } from "hono";
import type { AuthType } from "./auth.ts";

export function createRouter() {
  return new Hono<{ Bindings: AuthType }>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();

  return app;
}
