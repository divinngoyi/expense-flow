import FloatingHeader from "@/components/FloatingHeader";
import { TrendingUp, List, CalendarDays } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Expense Flow — See where your money goes" };

const features = [
  {
    icon: TrendingUp,
    title: "Monthly dashboard",
    body: "Totals, top categories and net flow at a glance.",
  },
  {
    icon: List,
    title: "Money in & out",
    body: "Capture every transaction with category and source.",
  },
  {
    icon: CalendarDays,
    title: "Calendar view",
    body: "Tap any day to see the entries behind the number.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingHeader />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="glass-subtle inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6" style={{ color: "var(--sky-700)" }}>
          <TrendingUp size={12} />
          Personal money, simplified
        </div>
        <h1
          className="font-display font-bold text-6xl lg:text-7xl max-w-3xl mb-6 leading-none"
          style={{ letterSpacing: "-1.8px" }}
        >
          See where every{" "}
          <span className="text-gradient-brand">rand</span> goes.
        </h1>
        <p className="text-lg max-w-xl mb-10" style={{ color: "var(--muted-foreground)" }}>
          Track money in and money out, organise by category, and read your
          month at a glance — without the spreadsheet.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
          >
            Start free
          </Link>
          <Link
            href="/login"
            className="glass-subtle px-6 py-3 rounded-xl font-medium hover:bg-white/70 transition"
            style={{ color: "var(--foreground)" }}
          >
            I have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="glass p-6 space-y-3">
              <div className="bg-brand-gradient size-10 rounded-xl grid place-items-center text-white shadow-md">
                <Icon size={18} />
              </div>
              <h3 className="font-display font-semibold">{title}</h3>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm pb-8" style={{ color: "var(--muted-foreground)" }}>
        © 2026 Expense Flow
      </footer>
    </div>
  );
}
