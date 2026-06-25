"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !isLoaded) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display font-bold text-2xl">Settings</h1>
        </div>
        <div className="glass p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading…
        </div>
      </div>
    );
  }

  const profileFields = [
    { label: "Full name", value: user?.fullName || user?.username || "—" },
    { label: "Email", value: user?.primaryEmailAddress?.emailAddress || "—" },
  ];

  async function handleSignOut() {
    await signOut(() => {
      router.push("/");
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl">Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Account, preferences, and defaults.
        </p>
      </div>

      <div className="glass p-6 space-y-4">
        <div className="font-display font-semibold">Profile</div>
        <div className="space-y-3">
          {profileFields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between py-3 border-b last:border-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {field.label}
                </div>
                <div className="text-sm font-medium mt-0.5">{field.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <div className="font-display font-semibold">Session</div>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Sign out of your account on this device.
        </p>
        <button
          onClick={handleSignOut}
          className="glass-subtle px-4 py-2.5 text-sm font-medium hover:bg-white/70 transition"
        >
          Sign out
        </button>
      </div>

      <div className="glass p-6 space-y-4">
        <div className="font-display font-semibold">Danger zone</div>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Delete your account and all data. This cannot be undone.
        </p>
        <button
          className="px-4 py-2.5 text-sm font-medium rounded-xl border transition hover:bg-red-50"
          style={{ color: "var(--destructive)", borderColor: "var(--destructive)" }}
          onClick={() => alert("Account deletion is not yet available. Please contact support.")}
        >
          Delete account
        </button>
      </div>
    </div>
  );
}
