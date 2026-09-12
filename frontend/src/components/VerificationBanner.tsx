"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function VerificationBanner() {
  const { user, isLoaded } = useAuth();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!isLoaded || !user || user.email_confirmed_at) return null;

  async function handleResend() {
    if (!user?.email || status === "sending") return;

    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <div
      className="flex w-full items-center justify-between gap-4 border-b px-6 py-2.5 text-sm"
      style={{
        background: "oklch(97% .06 80 / 0.7)",
        borderColor: "oklch(85% .1 75)",
      }}
    >
      <span style={{ color: "oklch(35% .1 75)" }} role="status">
        {status === "sent"
          ? "A new verification email is on its way."
          : status === "error"
            ? "We couldn’t resend the email. Please try again."
            : "Please verify your email address to secure your Expense Flow account."}
      </span>
      <button
        type="button"
        onClick={handleResend}
        disabled={status === "sending" || status === "sent"}
        className="shrink-0 font-medium underline underline-offset-2 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ color: "oklch(35% .12 75)" }}
      >
        {status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Resend verification"}
      </button>
    </div>
  );
}
