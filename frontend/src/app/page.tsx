import FloatingHeader from "@/components/FloatingHeader";
import ScrollReveal from "@/components/ScrollReveal";
import LandingPreviewSlides from "@/components/LandingPreviewSlides";
import { TrendingUp, List, CalendarDays } from "lucide-react";
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
          <LandingPreviewSlides />
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
