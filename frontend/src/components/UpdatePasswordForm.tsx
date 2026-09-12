"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div className="glass w-full max-w-sm space-y-6 p-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold">Choose a new password</h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Use at least 8 characters and keep it unique to Expense Flow.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
            className="input-focus w-full rounded-xl px-3 py-2.5 text-sm outline-none transition disabled:opacity-60"
            style={{ background: "var(--input)", border: "1px solid var(--border)" }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={submitting}
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
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
