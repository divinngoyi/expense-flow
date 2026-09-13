"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, CalendarDays, Tag, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/categories", label: "Categories", icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-bottom-nav lg:hidden fixed bottom-0 inset-x-0 z-40 border-t"
      aria-label="Primary navigation"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.7))",
        backdropFilter: "blur(20px)",
        borderColor: "oklch(100% 0 0 / 0.5)",
      }}
    >
      <div className="flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex min-h-14 min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5"
              style={{
                color: active ? "var(--primary)" : "var(--muted-foreground)",
                background: active ? "oklch(92% .055 235 / .72)" : "transparent",
                transition: "color 160ms var(--ease-out-quart), background 160ms var(--ease-out-quart)",
              }}
            >
              {/* Icon with relative container for the dot */}
              <div className="relative mb-0.5">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.75}
                  style={{ transition: "stroke-width 160ms, color 160ms" }}
                />
              </div>
              <span
                className="text-[10px] font-medium leading-tight"
                style={{ transition: "color 160ms, font-weight 160ms" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
