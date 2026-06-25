"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
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
  const { signOut } = useClerk();
  const router = useRouter();

  async function handleSignOut() {
    await signOut(() => {
      router.push("/");
    });
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
      <nav className="glass p-2 flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-gradient text-white shadow-md"
                  : "hover:bg-white/50"
              }`}
              style={active ? undefined : { color: "oklch(22% .04 250 / 0.7)" }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        <div className="flex-1" />

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/50 w-full text-left"
          style={{ color: "oklch(22% .04 250 / 0.7)" }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </nav>
    </aside>
  );
}
