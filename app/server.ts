import { Hono } from "hono";
import authRoute from "./routes/auth.ts";
import protectedRoute from "./routes/protected.ts";
import signupRoute from "./routes/signup.tsx";
import signinRoute from "./routes/signin.tsx";
import signoutRoute from "./routes/signout.tsx";

const router = new Hono()
  .route("/api", authRoute)
  .route("/protected", protectedRoute)
  .route("/signup", signupRoute)
  .route("/signin", signinRoute)
  .route("/signout", signoutRoute)
  .get("/", (c) => c.text("Hello, World!"));

export default router;
