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
    <div className="flex min-h-dvh flex-col">
      <FloatingHeader />

      {/* ── Hero ── */}
      <section className="flex min-h-[calc(100svh-5.5rem)] flex-col items-center justify-center px-5 py-20 text-center sm:min-h-0 sm:flex-1 sm:px-6 sm:py-24">
        {/* Badge */}
        <div
          className="glass-subtle mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:mb-6 sm:px-4"
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
          className="font-display mb-6 max-w-3xl text-5xl font-bold leading-[0.94] text-balance sm:text-6xl lg:text-7xl"
          style={{
            letterSpacing: "-0.04em",
            animationName: "hero-enter",
            animationDuration: "480ms",
            animationTimingFunction: "var(--ease-out-quint)",
            animationFillMode: "both",
            animationDelay: "80ms",
          }}
        >
          <span className="block sm:inline">See where</span>{" "}
          <span className="block sm:inline">
            every <span style={{ color: "var(--primary)" }}>rand</span>
          </span>{" "}
          <span className="block sm:inline">goes.</span>
        </h1>

        {/* Subhead */}
        <p
          className="mb-8 max-w-xl text-base leading-7 text-pretty sm:mb-10 sm:text-lg"
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
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
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
            className="bg-brand-gradient inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md sm:px-6"
          >
            Start free
          </Link>
          <Link
            href="/login"
            className="glass-subtle inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium sm:px-6"
            style={{ color: "var(--foreground)" }}
          >
            <span className="sm:hidden">Log in</span>
            <span className="hidden sm:inline">I have an account</span>
          </Link>
        </div>
      </section>

      {/* ── Preview ── */}
      <section id="preview" className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6 sm:pb-24">
        <ScrollReveal className="text-center mb-10">
          <h2 className="font-display mb-3 text-2xl font-bold sm:text-3xl" style={{ letterSpacing: "-0.5px" }}>
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
      <section id="features" className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6 sm:pb-28">
        <ScrollReveal className="text-center mb-10">
          <h2 className="font-display mb-3 text-2xl font-bold sm:text-3xl" style={{ letterSpacing: "-0.5px" }}>
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

      <footer className="px-4 pb-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
        © 2026 Expense Flow
      </footer>
    </div>
  );
}
