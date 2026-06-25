import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-brand-gradient relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 size-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="bg-white/20 size-11 rounded-xl grid place-items-center text-white shadow-md">
            <TrendingUp size={22} />
          </div>
          <span className="font-display font-semibold text-lg text-white">
            Expense Flow
          </span>
        </Link>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-4xl font-bold leading-tight text-white">
            See where every{" "}
            <span className="text-white/80">rand</span> goes.
          </h2>
          <p className="text-white/70 text-lg">
            Track money in and money out, organise by category, and read your
            month at a glance.
          </p>

          {/* Mini stat preview card */}
          <div className="glass p-5 max-w-xs">
            <div className="text-xs font-medium mb-3" style={{ color: "var(--muted-foreground)" }}>
              This month
            </div>
            <div className="font-display font-semibold text-sm mb-1">Net flow</div>
            <div className="text-3xl font-bold font-display mb-1">R 12,430</div>
            <div className="text-sm font-medium" style={{ color: "oklch(55% .18 150)" }}>
              +R 3,210
            </div>
          </div>
        </div>

        <p className="text-white/40 text-sm relative z-10">© 2026 Expense Flow</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        {children}
      </div>
    </div>
  );
}
