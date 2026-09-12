"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

const inputClassName =
  "input-focus w-full rounded-xl px-3 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60";

export default function AuthForm({
  mode,
  initialError = null,
  nextPath = "/dashboard",
}: {
  mode: AuthMode;
  initialError?: string | null;
  nextPath?: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (isRegister && password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    if (isRegister) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setSubmitting(false);
        return;
      }

      if (data.session) {
        router.replace(nextPath);
        router.refresh();
        return;
      }

      setMessage(`We sent a confirmation link to ${email}.`);
      setSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message === "Invalid login credentials"
        ? "The email or password is incorrect."
        : signInError.message);
      setSubmitting(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <div className="glass w-full max-w-sm p-8">
      <div className="mb-6 space-y-1">
        <h1 className="font-display text-2xl font-bold">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          {isRegister
            ? "Start building a clearer picture of your money."
            : "Log in to continue to Expense Flow."}
        </p>
      </div>

      {message ? (
        <div
          className="rounded-xl px-4 py-3 text-sm leading-5"
          style={{
            background: "oklch(94% .055 150)",
            color: "oklch(35% .11 150)",
          }}
          role="status"
        >
          {message} Open the email on this device to finish creating your account.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="full-name">
                Full name
              </label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                disabled={submitting}
                className={inputClassName}
                style={{ background: "var(--input)", border: "1px solid var(--border)" }}
              />
            </div>
          )}

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
              className={inputClassName}
              style={{ background: "var(--input)", border: "1px solid var(--border)" }}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              {!isRegister && (
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium underline underline-offset-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
              className={inputClassName}
              style={{ background: "var(--input)", border: "1px solid var(--border)" }}
            />
            {isRegister && (
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Use at least 8 characters.
              </p>
            )}
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="confirm-password">
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={submitting}
                className={inputClassName}
                style={{ background: "var(--input)", border: "1px solid var(--border)" }}
              />
            </div>
          )}

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
            {submitting
              ? isRegister ? "Creating account…" : "Logging in…"
              : isRegister ? "Create account" : "Log in"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
        {isRegister ? "Already have an account?" : "New to Expense Flow?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-medium underline underline-offset-2"
          style={{ color: "var(--foreground)" }}
        >
          {isRegister ? "Log in" : "Create account"}
        </Link>
      </p>
    </div>
  );
}
