import { useRef, useState } from "hono/jsx/dom";
import type { JSX } from "hono/jsx/dom/jsx-runtime";

type AuthKind = "signin" | "signup";

const buildBody = (
  kind: AuthKind,
  formData: FormData,
  callbackURL: string,
): Record<string, string> => {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (kind === "signin") return { email, password, callbackURL };
  return {
    name: String(formData.get("name") ?? ""),
    email,
    password,
    callbackURL,
  };
};

export const LoginAuthDialogs = (
  { container }: { container: HTMLElement },
): JSX.Element => {
  const signInCallbackURL = container.dataset.signInCallbackUrl ?? "/";

  const loginDialogRef = useRef<HTMLDialogElement>(null);
  const signupDialogRef = useRef<HTMLDialogElement>(null);
  const [errors, setErrors] = useState<Record<AuthKind, string>>({
    signin: "",
    signup: "",
  });
  const [pending, setPending] = useState<AuthKind | null>(null);

  const submitAuthForm = async (
    event: Event,
    kind: AuthKind,
  ): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const action = form.getAttribute("action");
    if (action === null) return;

    const formData = new FormData(form);
    const callbackURL = String(formData.get("callbackURL") ?? "/");
    setErrors((prev) => ({ ...prev, [kind]: "" }));
    setPending(kind);

    try {
      const response = await fetch(action, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(buildBody(kind, formData, callbackURL)),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          [kind]: payload?.message ?? "Authentication failed.",
        }));
        return;
      }
      const redirectTo =
        typeof payload?.url === "string" && payload.url.startsWith("/")
          ? payload.url
          : callbackURL;
      globalThis.location.href = redirectTo;
    } catch {
      setErrors((prev) => ({ ...prev, [kind]: "Network error." }));
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      <button
        type="button"
        data-dialog-open="login-dialog"
        onClick={() => loginDialogRef.current?.showModal()}
      >
        login
      </button>

      <dialog
        id="login-dialog"
        ref={loginDialogRef}
        onClick={(event) => {
          if (event.target === loginDialogRef.current) {
            loginDialogRef.current
              ?.close();
          }
        }}
      >
        <form
          method="post"
          action="/api/auth/sign-in/email"
          data-auth-form="signin"
          onSubmit={(event) => submitAuthForm(event, "signin")}
        >
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
          <p data-auth-error="signin">{errors.signin}</p>
          <button
            type="button"
            data-dialog-switch="signup-dialog"
            onClick={() => {
              loginDialogRef.current?.close();
              signupDialogRef.current?.showModal();
            }}
          >
            signup
          </button>
          <button
            type="button"
            data-dialog-close
            onClick={() => loginDialogRef.current?.close()}
          >
            cancel
          </button>
          <button type="submit" disabled={pending === "signin"}>login</button>
        </form>
      </dialog>

      <dialog
        id="signup-dialog"
        ref={signupDialogRef}
        onClick={(event) => {
          if (event.target === signupDialogRef.current) {
            signupDialogRef.current?.close();
          }
        }}
      >
        <form
          method="post"
          action="/api/auth/sign-up/email"
          data-auth-form="signup"
          onSubmit={(event) => submitAuthForm(event, "signup")}
        >
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
          <p data-auth-error="signup">{errors.signup}</p>
          <button
            type="button"
            data-dialog-switch="login-dialog"
            onClick={() => {
              signupDialogRef.current?.close();
              loginDialogRef.current?.showModal();
            }}
          >
            login
          </button>
          <button
            type="button"
            data-dialog-close
            onClick={() => signupDialogRef.current?.close()}
          >
            cancel
          </button>
          <button type="submit" disabled={pending === "signup"}>signup</button>
        </form>
      </dialog>
    </>
  );
};
