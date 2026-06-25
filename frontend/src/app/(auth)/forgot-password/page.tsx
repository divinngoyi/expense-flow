import Link from "next/link";

export const metadata = { title: "Reset password — Expense Flow" };

export default function ForgotPasswordPage() {
  return (
    <div className="glass p-8 w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="font-display font-bold text-2xl">Reset your password</h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          We&apos;ll email you a link to set a new password.
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] transition"
            style={{ background: "var(--input)", border: "1px solid var(--border)" }}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-gradient text-white py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition"
        >
          Send reset link
        </button>
      </form>

      <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
        Remembered it?{" "}
        <Link href="/login" className="font-medium underline underline-offset-2" style={{ color: "var(--foreground)" }}>
          Back to log in
        </Link>
      </p>
    </div>
  );
}
