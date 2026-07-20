import { createRoot } from "hono/jsx/dom/client";

function findDialog(dialogKey: string): HTMLDialogElement | null {
  const dialog = document.getElementById(dialogKey);
  return dialog instanceof HTMLDialogElement ? dialog : null;
}

function initAuthHeaderInteractions() {
  const body = document.body;
  if (body.dataset.authHeaderBound === "1") {
    return;
  }
  body.dataset.authHeaderBound = "1";

  document.querySelectorAll("[data-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialogId = button.getAttribute("data-dialog-open");
      if (!dialogId) return;

      const dialog = findDialog(dialogId);
      dialog?.showModal();
    });
  });

  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog");
      if (dialog instanceof HTMLDialogElement) {
        dialog.close();
      }
    });
  });

  document.querySelectorAll("[data-dialog-switch]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextDialogId = button.getAttribute("data-dialog-switch");
      if (!nextDialogId) return;

      const currentDialog = button.closest("dialog");
      if (currentDialog instanceof HTMLDialogElement) {
        currentDialog.close();
      }

      const nextDialog = findDialog(nextDialogId);
      nextDialog?.showModal();
    });
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });

  document.querySelectorAll<HTMLFormElement>("form[data-auth-form]").forEach(
    (form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const authKind = form.getAttribute("data-auth-form");
        const action = form.getAttribute("action");
        if (!authKind || !action) return;

        const formData = new FormData(form);
        const callbackURL = String(formData.get("callbackURL") || "/");
        const errorEl = document.querySelector(
          '[data-auth-error="' + authKind + '"]',
        );
        if (errorEl) {
          errorEl.textContent = "";
        }

        const submitButton = form.querySelector("button[type='submit']");
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = true;
        }

        let body = {};
        if (authKind === "signin") {
          body = {
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
            callbackURL,
          };
        } else if (authKind === "signup") {
          body = {
            name: String(formData.get("name") || ""),
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
            callbackURL,
          };
        }

        try {
          const response = await fetch(action, {
            method: "POST",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const payload = await response.json().catch(() => null);
          if (!response.ok) {
            const message = payload?.message || "Authentication failed.";
            if (errorEl) {
              errorEl.textContent = message;
            }
            return;
          }

          const redirectTo =
            typeof payload?.url === "string" && payload.url.startsWith("/")
              ? payload.url
              : callbackURL;
          globalThis.location.href = redirectTo;
        } catch {
          if (errorEl) {
            errorEl.textContent = "Network error.";
          }
        } finally {
          if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = false;
          }
        }
      });
    },
  );
}

const root = document.getElementById("auth-client-root");
if (root instanceof HTMLElement) {
  createRoot(root).render(" ");
  initAuthHeaderInteractions();
}
