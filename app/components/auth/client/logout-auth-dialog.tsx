import { useRef, useState } from "hono/jsx/dom";
import type { JSX } from "hono/jsx/dom/jsx-runtime";

export const LogoutAuthDialog = (
  { container }: { container: HTMLElement },
): JSX.Element => {
  const signOutCallbackURL = container.dataset.signOutCallbackUrl ?? "/";

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submitAuthForm = async (event: Event): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const action = form.getAttribute("action");
    if (action === null) return;

    const formData = new FormData(form);
    const callbackURL = String(formData.get("callbackURL") ?? "/");
    setError("");
    setPending(true);

    try {
      const response = await fetch(action, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ callbackURL }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.message ?? "Authentication failed.");
        return;
      }
      const redirectTo =
        typeof payload?.url === "string" && payload.url.startsWith("/")
          ? payload.url
          : callbackURL;
      globalThis.location.href = redirectTo;
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        data-dialog-open="logout-dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        logout
      </button>

      <dialog
        id="logout-dialog"
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <form
          method="post"
          action="/api/auth/sign-out"
          data-auth-form="signout"
          onSubmit={submitAuthForm}
        >
          <h2>logout</h2>
          <input type="hidden" name="callbackURL" value={signOutCallbackURL} />
          <p data-auth-error="signout">{error}</p>
          <button
            type="button"
            data-dialog-close
            onClick={() => dialogRef.current?.close()}
          >
            cancel
          </button>
          <button type="submit" disabled={pending}>logout</button>
        </form>
      </dialog>
    </>
  );
};
