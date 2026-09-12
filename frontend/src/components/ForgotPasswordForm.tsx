"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setSubmitting(false);
      return;
    }

    setSent(true);
    setSubmitting(false);
  }

  return (
    <div className="glass w-full max-w-sm space-y-6 p-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold">Reset your password</h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          We&apos;ll email you a secure link to choose a new password.
        </p>
      </div>

      {sent ? (
        <div
          className="rounded-xl px-4 py-3 text-sm leading-5"
          style={{ background: "oklch(94% .055 150)", color: "oklch(35% .11 150)" }}
          role="status"
        >
          If an account exists for {email}, a reset link is on its way.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
              placeholder="you@example.com"
              className="input-focus w-full rounded-xl px-3 py-2.5 text-sm outline-none transition disabled:opacity-60"
              style={{ background: "var(--input)", border: "1px solid var(--border)" }}
            />
          </div>

          {error && (
            <p
              className="rounded-xl px-3 py-2.5 text-sm"
              style={{ background: "oklch(96% .04 25)", color: "var(--destructive)" }}
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-gradient btn-press w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-65"
          >
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-2"
          style={{ color: "var(--foreground)" }}
        >
          Back to log in
        </Link>
      </p>
    </div>
  );
}
