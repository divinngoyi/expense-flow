"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useApi } from "@/lib/api";

export default function UserSync() {
  const { user, isLoaded } = useUser();
  const api = useApi();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const email = user.primaryEmailAddress?.emailAddress ?? "";
    const displayName = user.fullName ?? user.username ?? undefined;

    api.syncUser(email, displayName ?? undefined).catch(() => {
      // Non-blocking — sync failure should not crash the app
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  return null;
}
