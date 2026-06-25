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
    <div className="w-full bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-sm">
      <span className="text-amber-800">
        Please verify your email address to secure your Expense Flow account. Check your inbox.
      </span>
      <button
        onClick={handleResend}
        className="text-amber-700 font-medium underline underline-offset-2 hover:text-amber-900 transition-colors"
      >
        Resend verification
      </button>
    </div>
  );
}
