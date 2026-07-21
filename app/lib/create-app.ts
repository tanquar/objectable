import { Hono } from "hono";
import { type AuthType } from "./auth.ts";

type Env = {
  Variables: {
    session: AuthType | null;
  };
};

export function createRouter() {
  return new Hono<Env>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();

  return app;
}
