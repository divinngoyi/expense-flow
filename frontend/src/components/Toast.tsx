"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  exiting: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext).toast;
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const toastColors: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: {
    bg: "oklch(98% .02 150)",
    icon: "oklch(55% .18 150)",
    border: "oklch(90% .08 150)",
  },
  error: {
    bg: "oklch(98% .02 25)",
    icon: "oklch(62% .22 25)",
    border: "oklch(92% .06 25)",
  },
  info: {
    bg: "oklch(98% .02 230)",
    icon: "oklch(58% .17 245)",
    border: "oklch(91% .05 230)",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 220);
  }, []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    const timer = setTimeout(() => dismiss(id), 3200);
    timers.current.set(id, timer);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map(t => {
          const Icon = icons[t.type];
          const colors = toastColors[t.type];
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium max-w-[320px] ${
                t.exiting ? "toast-exiting" : "toast-entering"
              }`}
              style={{
                background: colors.bg,
                borderColor: colors.border,
                color: "var(--foreground)",
              }}
            >
              <Icon size={16} style={{ color: colors.icon, flexShrink: 0 }} />
              <span className="flex-1 leading-snug">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="rounded p-0.5 hover:bg-black/8 transition-colors"
                aria-label="Dismiss"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
