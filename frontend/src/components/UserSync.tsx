"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useApi, type AppUserDto } from "@/lib/api";

const activeSyncs = new Map<string, Promise<AppUserDto>>();

function SyncSkeleton() {
  return (
    <main
      className="app-content flex-1"
      role="status"
      aria-label="Setting up your account"
    >
      <div className="max-w-5xl space-y-5" aria-hidden="true">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-36 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
        </div>
      </div>
      <span className="sr-only">Setting up your Expense Flow account.</span>
    </main>
  );
}

export default function UserSync({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useAuth();
  const api = useApi();
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  const [failedUserId, setFailedUserId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isLoaded || !user) return;

    let active = true;
    const email = user.email ?? "";
    const displayName = typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : undefined;

    let sync = activeSyncs.get(user.id);
    if (!sync) {
      sync = api.syncUser(email, displayName);
      activeSyncs.set(user.id, sync);
      void sync.then(
        () => activeSyncs.delete(user.id),
        () => activeSyncs.delete(user.id),
      );
    }

    sync
      .then(() => {
        if (!active) return;
        setFailedUserId(null);
        setSyncedUserId(user.id);
      })
      .catch(() => {
        if (!active) return;
        setFailedUserId(user.id);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id, retryCount]);

  if (!isLoaded || !user || syncedUserId !== user.id) {
    if (user && failedUserId === user.id) {
      return (
        <main className="app-content flex-1">
          <div className="max-w-xl space-y-4 py-12" role="alert">
            <AlertCircle size={28} style={{ color: "var(--destructive)" }} />
            <div className="space-y-1.5">
              <h1 className="font-display text-xl font-semibold">
                We couldn&apos;t finish setting up your account
              </h1>
              <p className="text-sm leading-6" style={{ color: "var(--muted-foreground)" }}>
                Your sign-in is safe. Retry the account setup before loading your dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFailedUserId(null);
                setRetryCount((count) => count + 1);
              }}
              className="bg-brand-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw size={15} />
              Retry setup
            </button>
          </div>
        </main>
      );
    }

    return <SyncSkeleton />;
  }

  return children;
}
