"use client";

import { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowUpRight, LayoutDashboard, List, CalendarDays, Tag } from "lucide-react";

const INTERVAL = 4500;
const EXIT_MS = 260;

/* ── Nav items ─────────────────────────────────────────────────────────── */
const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Transactions", icon: List },
  { label: "Calendar", icon: CalendarDays },
  { label: "Categories", icon: Tag },
];

/* ── Slide 1: Dashboard ─────────────────────────────────────────────────── */
function DashboardContent() {
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="font-display font-bold text-sm">June 2026</div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Confirmed transactions only.</div>
        </div>
        <div className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "var(--gradient-brand)" }}>
          + Add
        </div>
      </div>

      {/* Net flow */}
      <div className="glass p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, oklch(70% .18 150), transparent 70%)" }} />
        <div className="text-xs font-semibold tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>NET FLOW</div>
        <div className="font-display font-bold text-3xl" style={{ color: "var(--status-confirmed)" }}>+R 12,430</div>
        <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
          <span style={{ color: "var(--status-confirmed)" }}>+R 3,210</span> vs last month
        </div>
      </div>

      {/* In / Out */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "MONEY IN", amount: "R 24,800", delta: "+12%", positive: true },
          { label: "MONEY OUT", amount: "R 12,370", delta: "-5%", positive: true },
        ].map(c => (
          <div key={c.label} className="glass p-3">
            <div className="text-xs font-semibold tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>{c.label}</div>
            <div className="font-display font-bold text-base">{c.amount}</div>
            <div className="text-xs font-medium" style={{ color: c.positive ? "var(--status-confirmed)" : "var(--destructive)" }}>{c.delta} vs last month</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="glass p-4 space-y-2">
        <div className="font-display font-semibold text-xs">Top categories</div>
        {[
          { name: "Groceries", amount: "R 4,200", pct: 70 },
          { name: "Transport", amount: "R 1,800", pct: 45 },
          { name: "Entertainment", amount: "R 980", pct: 25 },
        ].map(c => (
          <div key={c.name}>
            <div className="flex justify-between text-xs mb-1">
              <span>{c.name}</span>
              <span style={{ color: "var(--muted-foreground)" }}>{c.amount}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(91% .05 230)" }}>
              <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: "var(--gradient-brand)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 2: Transactions ──────────────────────────────────────────────── */
function TransactionsContent() {
  const rows = [
    { name: "Salary", cat: "Income", amount: "+R 15,000", type: "in", status: "Confirmed" },
    { name: "Woolworths", cat: "Groceries", amount: "-R 890", type: "out", status: "Confirmed" },
    { name: "Spotify", cat: "Entertainment", amount: "-R 99", type: "out", status: "Pending" },
    { name: "Freelance", cat: "Income", amount: "+R 3,500", type: "in", status: "Confirmed" },
    { name: "Takealot", cat: "Shopping", amount: "-R 450", type: "out", status: "Confirmed" },
  ];

  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-display font-bold text-sm">Transactions</div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>June 2026</div>
        </div>
        <div className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "var(--gradient-brand)" }}>
          + Add
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {["All", "Money In", "Money Out"].map((f, i) => (
          <div
            key={f}
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={i === 0 ? { background: "var(--gradient-brand)", color: "white" } : { background: "rgba(255,255,255,0.6)", color: "var(--muted-foreground)" }}
          >
            {f}
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {rows.map((tx, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.6)" }}
          >
            <div
              className="size-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: tx.type === "in" ? "oklch(88% .1 150 / 0.45)" : "oklch(88% .1 25 / 0.45)" }}
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
              <div className="text-xs font-bold" style={{ color: tx.type === "in" ? "var(--status-confirmed)" : "var(--destructive)" }}>
                {tx.amount}
              </div>
              <div className="text-[9px] font-medium" style={{ color: tx.status === "Confirmed" ? "var(--status-confirmed)" : "var(--status-pending)" }}>
                {tx.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 3: Calendar ──────────────────────────────────────────────────── */
function CalendarContent() {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const grid = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, null, null, null, null, null],
  ];
  const hasIn: number[] = [1, 5, 14, 15, 22, 26];
  const hasOut: number[] = [3, 5, 7, 10, 12, 17, 19, 21, 24];
  const selected = 15;

  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div className="font-display font-bold text-sm">Calendar</div>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
          <span>‹</span>
          <span className="font-medium" style={{ color: "var(--foreground)" }}>June 2026</span>
          <span>›</span>
        </div>
      </div>

      <div className="glass p-3">
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "4px" }}>
          {weekDays.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium py-1" style={{ color: "var(--muted-foreground)" }}>{d}</div>
          ))}
        </div>

        {/* Days */}
        {grid.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {week.map((day, di) => (
              <div
                key={di}
                className="flex flex-col items-center py-1 rounded-lg"
                style={day === selected ? { background: "var(--gradient-brand)" } : {}}
              >
                {day !== null && (
                  <>
                    <span
                      className="text-xs"
                      style={{
                        color: day === selected ? "white" : "var(--foreground)",
                        fontWeight: day === selected ? 700 : 400,
                      }}
                    >
                      {day}
                    </span>
                    <div style={{ display: "flex", gap: "1.5px", marginTop: "1px", height: "4px", alignItems: "center" }}>
                      {hasIn.includes(day) && <div style={{ width: "3px", height: "3px", borderRadius: "9999px", background: "var(--status-confirmed)" }} />}
                      {hasOut.includes(day) && <div style={{ width: "3px", height: "3px", borderRadius: "9999px", background: "var(--destructive)" }} />}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Selected day */}
      <div className="glass p-3 space-y-1.5">
        <div className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>June 15</div>
        {[
          { name: "Salary", amount: "+R 15,000", type: "in" },
          { name: "Groceries", amount: "-R 890", type: "out" },
        ].map(tx => (
          <div key={tx.name} className="flex justify-between items-center">
            <span className="text-xs">{tx.name}</span>
            <span className="text-xs font-semibold" style={{ color: tx.type === "in" ? "var(--status-confirmed)" : "var(--destructive)" }}>
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slide 4: Categories ────────────────────────────────────────────────── */
function CategoriesContent() {
  const cats = [
    { name: "Income", type: "Money In", txCount: 3 },
    { name: "Groceries", type: "Money Out", txCount: 8 },
    { name: "Transport", type: "Money Out", txCount: 5 },
    { name: "Entertainment", type: "Money Out", txCount: 4 },
    { name: "Savings", type: "Both", txCount: 2 },
  ];

  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-display font-bold text-sm">Categories</div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Organise your spending</div>
        </div>
        <div className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "var(--gradient-brand)" }}>
          + Add
        </div>
      </div>

      <div className="space-y-1.5">
        {cats.map((cat, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.6)" }}
          >
            <div>
              <div className="text-xs font-medium">{cat.name}</div>
              <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{cat.txCount} transactions</div>
            </div>
            <div
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: cat.type === "Money In"
                  ? "oklch(88% .1 150 / 0.35)"
                  : cat.type === "Money Out"
                  ? "oklch(88% .1 25 / 0.35)"
                  : "oklch(91% .04 250 / 0.5)",
                color: cat.type === "Money In"
                  ? "var(--status-confirmed)"
                  : cat.type === "Money Out"
                  ? "var(--destructive)"
                  : "var(--muted-foreground)",
              }}
            >
              {cat.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Preview shell ──────────────────────────────────────────────────────── */
const SLIDES = [
  { nav: NAV[0], content: DashboardContent },
  { nav: NAV[1], content: TransactionsContent },
  { nav: NAV[2], content: CalendarContent },
  { nav: NAV[3], content: CategoriesContent },
];

export default function LandingPreviewSlides() {
  const [idx, setIdx] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [exiting, setExiting] = useState(false);

  function goTo(newIdx: number) {
    if (newIdx === idx || exiting) return;
    setExiting(true);
    const t = setTimeout(() => {
      setIdx(newIdx);
      setSlideKey(k => k + 1);
      setExiting(false);
    }, EXIT_MS + 20);
    return () => clearTimeout(t);
  }

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setExiting(true);
      swap = setTimeout(() => {
        setIdx(i => (i + 1) % SLIDES.length);
        setSlideKey(k => k + 1);
        setExiting(false);
      }, EXIT_MS + 20);
    }, INTERVAL);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
    };
  }, []);

  const SlideContent = SLIDES[idx].content;

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-2xl">
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ background: "rgba(255,255,255,0.65)", borderColor: "rgba(255,255,255,0.5)" }}
      >
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full" style={{ background: "oklch(70% .18 25 / 0.65)" }} />
          <div className="size-3 rounded-full" style={{ background: "oklch(75% .15 80 / 0.65)" }} />
          <div className="size-3 rounded-full" style={{ background: "oklch(65% .18 150 / 0.65)" }} />
        </div>
        <div
          className="flex-1 rounded-md text-center text-[11px] py-1"
          style={{ background: "rgba(255,255,255,0.65)", color: "var(--muted-foreground)" }}
        >
          expenseflow.app/{SLIDES[idx].nav.label.toLowerCase()}
        </div>
        <div className="w-14" />
      </div>

      {/* App shell */}
      <div className="flex" style={{ background: "oklch(97% .018 230)" }}>
        {/* Sidebar */}
        <div
          className="hidden sm:flex flex-col gap-0.5 p-2 w-36 flex-shrink-0 border-r"
          style={{ borderColor: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.4)" }}
        >
          {/* Logo */}
          <div className="px-2 py-3 flex items-center gap-2 mb-1">
            <div className="size-6 rounded-lg grid place-items-center text-white flex-shrink-0" style={{ background: "var(--gradient-brand)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
            </div>
            <span className="font-display font-semibold text-xs">Expense Flow</span>
          </div>

          {NAV.map((item, i) => {
            const active = i === idx;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => goTo(i)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs font-medium w-full transition-colors"
                style={{
                  background: active ? "var(--gradient-brand)" : "transparent",
                  color: active ? "white" : "oklch(22% .04 250 / 0.6)",
                }}
              >
                <Icon size={12} style={{ opacity: active ? 1 : 0.7 }} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden" style={{ maxHeight: "360px", overflowY: "auto" }}>
          <div
            key={slideKey}
            style={{
              animation: exiting ? "none" : "slide-panel-enter 380ms var(--ease-out-quint) both",
              opacity: exiting ? 0 : undefined,
              transition: exiting ? `opacity ${EXIT_MS}ms ease-out` : undefined,
            }}
          >
            <SlideContent />
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div
        className="flex items-center justify-center gap-2 py-3 border-t"
        style={{ background: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.5)" }}
      >
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={s.nav.label}
            className="text-[10px] font-medium px-2.5 py-1 rounded-full transition-all"
            style={{
              background: i === idx ? "var(--gradient-brand)" : "rgba(0,0,0,0.06)",
              color: i === idx ? "white" : "var(--muted-foreground)",
              transition: "background 280ms, color 280ms",
            }}
          >
            {s.nav.label}
          </button>
        ))}
      </div>
    </div>
  );
}
