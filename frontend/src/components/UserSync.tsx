"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useApi } from "@/lib/api";

export default function UserSync() {
  const { user, isLoaded } = useAuth();
  const api = useApi();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const email = user.email ?? "";
    const displayName = typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : undefined;

    api.syncUser(email, displayName ?? undefined).catch(() => {
      // Non-blocking — sync failure should not crash the app
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  return null;
}
