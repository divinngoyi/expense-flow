import FloatingHeader from "@/components/FloatingHeader";
import ScrollReveal from "@/components/ScrollReveal";
import {
  TrendingUp,
  List,
  CalendarDays,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Expense Flow — See where your money goes" };

const features = [
  {
    icon: TrendingUp,
    title: "Monthly dashboard",
    body: "Net flow, top categories, and money in vs out — your full month on one screen.",
  },
  {
    icon: List,
    title: "Money in & out",
    body: "Capture every transaction with a category, source, and status. Manual and intentional.",
  },
  {
    icon: CalendarDays,
    title: "Calendar view",
    body: "See activity across every day of the month. Tap any day to see what sits behind the number.",
  },
];

/* ── Mini dashboard preview (static mockup) ─────────────────────────── */
function AppPreview() {
  const txns = [
    { name: "Salary", cat: "Income", amount: "+R 15,000", type: "in", status: "Confirmed" },
    { name: "Woolworths", cat: "Groceries", amount: "-R 890", type: "out", status: "Confirmed" },
    { name: "Spotify", cat: "Entertainment", amount: "-R 99", type: "out", status: "Pending" },
    { name: "Freelance", cat: "Income", amount: "+R 3,500", type: "in", status: "Confirmed" },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-2xl">
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ background: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.5)" }}
      >
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full" style={{ background: "oklch(70% .18 25 / 0.7)" }} />
          <div className="size-3 rounded-full" style={{ background: "oklch(75% .15 80 / 0.7)" }} />
          <div className="size-3 rounded-full" style={{ background: "oklch(65% .18 150 / 0.7)" }} />
        </div>
        <div
          className="flex-1 rounded-md text-center text-xs py-1"
          style={{ background: "rgba(255,255,255,0.6)", color: "var(--muted-foreground)" }}
        >
          expenseflow.app/dashboard
        </div>
        <div className="w-14" />
      </div>

      {/* App shell */}
      <div className="flex" style={{ background: "rgba(255,255,255,0.15)", minHeight: "340px" }}>
        {/* Sidebar */}
        <div
          className="hidden md:flex flex-col gap-1 p-3 w-44 flex-shrink-0 border-r"
          style={{ borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.25)" }}
        >
          {[
            { label: "Dashboard", active: false },
            { label: "Transactions", active: true },
            { label: "Calendar", active: false },
            { label: "Categories", active: false },
          ].map(item => (
            <div
              key={item.label}
              className="px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                background: item.active ? "var(--gradient-brand)" : "transparent",
                color: item.active ? "white" : "oklch(22% .04 250 / 0.55)",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Content: transaction list */}
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-display font-bold text-sm">Transactions</div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>June 2026</div>
            </div>
            <div
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              + Add
            </div>
          </div>

          <div className="space-y-2">
            {txns.map((tx, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.55)" }}
              >
                <div
                  className="size-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: tx.type === "in"
                      ? "oklch(88% .1 150 / 0.5)"
                      : "oklch(88% .1 25 / 0.5)",
                  }}
                >
                  {tx.type === "in"
                    ? <ArrowDownLeft size={11} style={{ color: "var(--status-confirmed)" }} />
                    : <ArrowUpRight size={11} style={{ color: "var(--destructive)" }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{tx.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{tx.cat}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-xs font-bold"
                    style={{ color: tx.type === "in" ? "var(--status-confirmed)" : "var(--destructive)" }}
                  >
                    {tx.amount}
                  </div>
                  <div
                    className="text-[9px] font-medium"
                    style={{
                      color: tx.status === "Confirmed"
                        ? "var(--status-confirmed)"
                        : "var(--status-pending)",
                    }}
                  >
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingHeader />

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        {/* Badge */}
        <div
          className="glass-subtle inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{
            color: "var(--sky-700)",
            animationName: "hero-enter",
            animationDuration: "480ms",
            animationTimingFunction: "var(--ease-out-quint)",
            animationFillMode: "both",
            animationDelay: "0ms",
          }}
        >
          <TrendingUp size={12} />
          Personal money, simplified
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold text-6xl lg:text-7xl max-w-3xl mb-6 leading-none"
          style={{
            letterSpacing: "-1.8px",
            animationName: "hero-enter",
            animationDuration: "480ms",
            animationTimingFunction: "var(--ease-out-quint)",
            animationFillMode: "both",
            animationDelay: "80ms",
          }}
        >
          See where every{" "}
          <span className="text-gradient-brand">rand</span> goes.
        </h1>

        {/* Subhead */}
        <p
          className="text-lg max-w-xl mb-10"
          style={{
            color: "var(--muted-foreground)",
            animationName: "hero-enter",
            animationDuration: "480ms",
            animationTimingFunction: "var(--ease-out-quint)",
            animationFillMode: "both",
            animationDelay: "160ms",
          }}
        >
          Track money in and money out, organise by category, and read your
          month at a glance — without the spreadsheet.
        </p>

        {/* CTA buttons */}
        <div
          className="flex items-center gap-4"
          style={{
            animationName: "hero-enter",
            animationDuration: "480ms",
            animationTimingFunction: "var(--ease-out-quint)",
            animationFillMode: "both",
            animationDelay: "240ms",
          }}
        >
          <Link
            href="/register"
            className="bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold shadow-md"
          >
            Start free
          </Link>
          <Link
            href="/login"
            className="glass-subtle px-6 py-3 rounded-xl font-medium"
            style={{ color: "var(--foreground)" }}
          >
            I have an account
          </Link>
        </div>
      </section>

      {/* ── Preview ── */}
      <section id="preview" className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <ScrollReveal className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl mb-3" style={{ letterSpacing: "-0.5px" }}>
            See it in action
          </h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            A clean, focused interface built around how you actually think about money.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <AppPreview />
        </ScrollReveal>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 pb-28 max-w-5xl mx-auto w-full">
        <ScrollReveal className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl mb-3" style={{ letterSpacing: "-0.5px" }}>
            Everything you need
          </h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            No noise, no subscriptions, no bank access required.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, body }, i) => (
            <ScrollReveal key={title} delay={i * 80}>
              <div className="glass glass-lift p-6 space-y-3 h-full">
                <div className="bg-brand-gradient size-10 rounded-xl grid place-items-center text-white shadow-md">
                  <Icon size={18} />
                </div>
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm pb-8" style={{ color: "var(--muted-foreground)" }}>
        © 2026 Expense Flow
      </footer>
    </div>
  );
}
