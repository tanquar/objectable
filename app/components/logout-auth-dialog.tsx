type LogoutAuthDialogProps = {
  signOutCallbackURL: string;
};

export function LogoutAuthDialog({
  signOutCallbackURL,
}: LogoutAuthDialogProps) {
  const signOutAction = "/api/auth/sign-out";

  return (
    <dialog id="logout-dialog">
      <form method="post" action={signOutAction} data-auth-form="signout">
        <input type="hidden" name="callbackURL" value={signOutCallbackURL} />
        <h2>logout</h2>
        <button type="button" data-dialog-close>cancel</button>
        <button type="submit">logout</button>
      </form>
    </dialog>
  );
}
