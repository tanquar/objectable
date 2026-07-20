type LoginAuthDialogsProps = {
  signInCallbackURL: string;
};

export function LoginAuthDialogs({ signInCallbackURL }: LoginAuthDialogsProps) {
  const signInAction = "/api/auth/sign-in/email";
  const signUpAction = "/api/auth/sign-up/email";

  return (
    <>
      <dialog id="login-dialog">
        <form method="post" action={signInAction} data-auth-form="signin">
          <h2>login</h2>

          <label>
            <span>email</span>
            <input type="email" name="email" autocomplete="email" required />
          </label>

          <label>
            <span>password</span>
            <input
              type="password"
              name="password"
              autocomplete="current-password"
              required
              minLength={8}
            />
          </label>

          <input type="hidden" name="callbackURL" value={signInCallbackURL} />
          <p data-auth-error="signin"></p>

          <button type="button" data-dialog-switch="signup-dialog">
            signup
          </button>
          <button type="button" data-dialog-close>cancel</button>
          <button type="submit">login</button>
        </form>
      </dialog>

      <dialog id="signup-dialog">
        <form method="post" action={signUpAction} data-auth-form="signup">
          <h2>signup</h2>

          <label>
            <span>name</span>
            <input name="name" autocomplete="name" required />
          </label>

          <label>
            <span>email</span>
            <input type="email" name="email" autocomplete="email" required />
          </label>

          <label>
            <span>password</span>
            <input
              type="password"
              name="password"
              autocomplete="new-password"
              required
              minLength={8}
            />
          </label>

          <input type="hidden" name="callbackURL" value={signInCallbackURL} />
          <p data-auth-error="signup"></p>

          <button type="button" data-dialog-switch="login-dialog">login</button>
          <button type="button" data-dialog-close>cancel</button>
          <button type="submit">signup</button>
        </form>
      </dialog>
    </>
  );
}
