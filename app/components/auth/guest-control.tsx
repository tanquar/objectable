import type { FC } from "hono/jsx";
import { LoginAuthDialogs } from "./login-auth-dialogs.tsx";

export type GuestControlProps = {
  signInCallbackURL: string;
};

export const GuestControl: FC<GuestControlProps> = ({ signInCallbackURL }) => (
  <LoginAuthDialogs signInCallbackURL={signInCallbackURL} />
);
