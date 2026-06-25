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
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.7))",
        backdropFilter: "blur(20px)",
        borderColor: "oklch(100% 0 0 / 0.5)",
      }}
    >
      <div className="flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-0.5 pt-2.5 pb-3 px-1"
              style={{
                color: active ? "var(--primary)" : "var(--muted-foreground)",
                transition: "color 160ms var(--ease-out-quart)",
              }}
            >
              {/* Icon with relative container for the dot */}
              <div className="relative mb-0.5">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.75}
                  style={{ transition: "stroke-width 160ms, color 160ms" }}
                />
                {/* Active dot below the icon */}
                {active && <span className="nav-dot" />}
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
