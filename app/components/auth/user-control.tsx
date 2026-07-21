import type { FC } from "hono/jsx";
import { AuthType } from "../../lib/auth.ts";
import { LogoutAuthDialog } from "./logout-auth-dialog.tsx";

export type UserControlProps = {
  session: AuthType;
  signOutCallbackURL: string;
};

export const UserControl: FC<UserControlProps> = ({
  session,
  signOutCallbackURL,
}) => (
  <span>
    {session.user?.name} / {session.user?.email}
    <LogoutAuthDialog signOutCallbackURL={signOutCallbackURL} />
  </span>
);
