"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  LayoutDashboard,
  List,
  CalendarDays,
  Tag,
  Settings,
  LogOut,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/categories", label: "Categories", icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col p-4 gap-2 sticky top-0 h-screen">
      {/* Logo */}
      <div className="glass p-4 flex items-center gap-3">
        <div className="bg-brand-gradient size-10 rounded-xl grid place-items-center text-white shadow-md">
          <TrendingUp size={20} />
        </div>
        <div>
          <div className="font-display font-semibold leading-tight">Expense Flow</div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Personal money
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="glass p-2 flex flex-col gap-0.5 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium relative"
              style={{
                color: active ? "white" : "oklch(22% .04 250 / 0.65)",
                background: active ? "var(--gradient-brand)" : "transparent",
                boxShadow: active ? "0 4px 16px -4px oklch(55% .18 245 / .4), inset 0 1px 0 0 oklch(100% 0 0 / .25)" : "none",
                transition: "color 160ms var(--ease-out-quart), background 160ms var(--ease-out-quart), box-shadow 160ms var(--ease-out-quart)",
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.55)";
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <Icon
                size={16}
                style={{
                  opacity: active ? 1 : 0.7,
                  transition: "opacity 160ms",
                }}
              />
              {label}
            </Link>
          );
        })}

        <div className="flex-1" />

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left"
          style={{
            color: "oklch(22% .04 250 / 0.55)",
            background: "transparent",
            transition: "color 160ms, background 160ms",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.55)";
            (e.currentTarget as HTMLElement).style.color = "oklch(22% .04 250 / 0.8)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "oklch(22% .04 250 / 0.55)";
          }}
        >
          <LogOut size={16} style={{ opacity: 0.6 }} />
          Sign out
        </button>
      </nav>
    </aside>
  );
}
