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
        background: "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.65))",
        backdropFilter: "blur(16px)",
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
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors"
              style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
