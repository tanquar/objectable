import { auth } from "../lib/auth.ts";
import { createRouter } from "../lib/create-app.ts";

const router = createRouter();

router.on(["POST", "GET"], "/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

export default router;
