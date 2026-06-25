"use client";

import { useUser } from "@clerk/nextjs";

export default function VerificationBanner() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  // Google and other OAuth users have verified email by default
  const isOAuth = user.externalAccounts.length > 0;
  const isVerified =
    isOAuth || user.primaryEmailAddress?.verification?.status === "verified";

  if (isVerified) return null;

  async function handleResend() {
    await user?.primaryEmailAddress?.prepareVerification({ strategy: "email_code" });
  }

  return (
    <div
      className="w-full px-6 py-2.5 flex items-center justify-between text-sm border-b"
      style={{
        background: "oklch(97% .06 80 / 0.7)",
        borderColor: "oklch(85% .1 75)",
      }}
    >
      <span style={{ color: "oklch(35% .1 75)" }}>
        Please verify your email address to secure your Expense Flow account. Check your inbox.
      </span>
      <button
        onClick={handleResend}
        className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
        style={{ color: "oklch(35% .12 75)" }}
      >
        Resend verification
      </button>
    </div>
  );
}
