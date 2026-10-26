"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { Input } from "@/components/ui/input";

type Status =
  | "idle"
  | "sending"
  | "sent"
  | "rateLimited"
  | "failed"
  | "google"
  | "googleFailed"
  | "verifying"
  | "codeInvalid"
  | "codeTooManyAttempts";

// Posts straight to Better Auth's public endpoints (not a Server Action), so
// the requests go through its rate limit and origin check. Every address gets
// the same "check your inbox": the email itself says whether it is a member's.
// The email carries a link and a code: the code is typed here, for a phone
// whose mail app opens links in another browser (an installed app on iOS).
export function LoginForm({ googleEnabled, next }: { googleEnabled: boolean; next: string }) {
  const [status, setStatus] = useState<Status>("idle");
  // The address the link and code went to; null until a request went out.
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setStatus("sending");
    try {
      const response = await fetch("/api/auth/sign-in/magic-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, callbackURL: next, errorCallbackURL: "/login?error=LinkInvalid" }),
      });
      if (response.ok) setSentTo(email);
      setStatus(response.ok ? "sent" : response.status === 429 ? "rateLimited" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  async function onCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const otp = String(new FormData(event.currentTarget).get("code") ?? "").replace(/\D/g, "");
    setStatus("verifying");
    try {
      const response = await fetch("/api/auth/sign-in/email-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: sentTo, otp }),
      });
      if (response.ok) {
        window.location.assign(next);
        return;
      }
      const failure: Partial<Record<number, Status>> = { 400: "codeInvalid", 403: "codeTooManyAttempts", 429: "rateLimited" };
      setStatus(failure[response.status] ?? "failed");
    } catch {
      setStatus("failed");
    }
  }

  function onChangeEmail() {
    setSentTo(null);
    setStatus("idle");
  }

  async function onGoogle() {
    setStatus("google");
    try {
      const response = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ provider: "google", callbackURL: next, errorCallbackURL: "/login" }),
      });
      const url = response.ok ? ((await response.json()) as { url?: unknown }).url : null;
      if (typeof url === "string") {
        window.location.assign(url);
        return;
      }
      setStatus(response.status === 429 ? "rateLimited" : "googleFailed");
    } catch {
      setStatus("googleFailed");
    }
  }

  const notices: Partial<Record<Status, string>> = {
    sent: t.login.sent,
    rateLimited: t.login.rateLimited,
    failed: t.login.failed,
    googleFailed: t.login.failed,
    codeInvalid: t.login.codeInvalid,
    codeTooManyAttempts: t.login.codeTooManyAttempts,
  };
  const notice = notices[status] ?? null;
  const busy = status === "sending" || status === "google" || status === "verifying";

  return (
    <div className="space-y-3">
      {/* Distinct keys: the two forms share a shape, and React would otherwise
          reuse the email <input> for the code, typed address included. */}
      {sentTo ? (
        <form key="code" className="space-y-2" onSubmit={onCode}>
          <label htmlFor="code" className="block text-sm font-medium text-foreground">
            {t.login.codeLabel}
          </label>
          <Input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            required
            placeholder="123456"
            className="text-center text-lg tabular-nums tracking-[0.3em]"
          />
          <Button type="submit" variant="brand" block disabled={busy}>
            {status === "verifying" ? t.login.codeVerifying : t.login.codeButton}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {sentTo} ·{" "}
            <button type="button" onClick={onChangeEmail} className="text-primary-text underline">
              {t.login.changeEmail}
            </button>
          </p>
        </form>
      ) : (
        <form key="email" className="space-y-2" onSubmit={onSubmit}>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            {t.login.emailLabel}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t.login.emailPlaceholder}
            className="text-sm"
          />
          <Button type="submit" variant="brand" block disabled={busy}>
            {status === "sending" ? t.login.sending : t.login.sendLink}
          </Button>
        </form>
      )}
      {googleEnabled && (
        <>
          <p className="text-center text-xs text-muted-foreground">{t.login.or}</p>
          <Button type="button" variant="outline" block onClick={onGoogle} disabled={busy} className="gap-2">
            <GoogleIcon />
            {status === "google" ? t.login.googleRedirecting : t.login.googleLogin}
          </Button>
        </>
      )}
      {notice && (
        <p role="status" className="rounded-md border border-border bg-background p-2 text-sm text-foreground">
          {notice}
        </p>
      )}
    </div>
  );
}

// Google's multicolour "G", as Google's sign-in branding guidelines ask for.
function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-[18px] shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
