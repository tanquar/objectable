import { Hono } from "hono";
import appRoute from "./app/server.ts";

const app = new Hono()
  .route("/", appRoute);

const PORT = Number(Deno.env.get("PORT") || 8000);

if (import.meta.main) {
  Deno.serve({ port: PORT }, app.fetch);
}
