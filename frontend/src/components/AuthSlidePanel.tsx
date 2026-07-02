"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react";

const INTERVAL = 4800;
const EXIT_MS = 260;

/* ── Slide 1: Dashboard ───────────────────────────────────────────────── */
function DashboardSlide() {
  const cats = [
    { name: "Groceries", amount: "R 4,200", pct: 72 },
    { name: "Transport", amount: "R 1,800", pct: 48 },
    { name: "Entertainment", amount: "R 980", pct: 28 },
  ];

  return (
    <div className="space-y-3">
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Dashboard
      </div>
      <h3 style={{ color: "white", fontSize: "22px", fontWeight: 700, lineHeight: 1.25, marginBottom: "16px" }}>
        Your month,<br />at a glance
      </h3>

      {/* Net flow card */}
      <div style={{
        background: "rgba(255,255,255,0.14)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "16px",
        padding: "16px",
      }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", marginBottom: "4px" }}>Net flow · June 2026</div>
        <div style={{ color: "white", fontSize: "30px", fontWeight: 800, fontFamily: "var(--font-jakarta), system-ui", letterSpacing: "-0.5px", marginBottom: "12px" }}>
          +R 12,430
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
          {[
            { label: "Money In", value: "R 24,800", color: "rgba(134,239,172,0.9)" },
            { label: "Money Out", value: "R 12,370", color: "rgba(252,165,165,0.9)" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.09)", borderRadius: "10px", padding: "10px" }}>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", marginBottom: "4px" }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: "13px", fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", fontWeight: 500, marginBottom: "8px" }}>
          TOP CATEGORIES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {cats.map(c => (
            <div key={c.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px" }}>{c.name}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{c.amount}</span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${c.pct}%`, background: "rgba(255,255,255,0.45)", borderRadius: "9999px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Slide 2: Calendar ────────────────────────────────────────────────── */
function CalendarSlide() {
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
    <div className="space-y-3">
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Calendar
      </div>
      <h3 style={{ color: "white", fontSize: "22px", fontWeight: 700, lineHeight: 1.25, marginBottom: "16px" }}>
        Every day,<br />clearly
      </h3>

      <div style={{
        background: "rgba(255,255,255,0.14)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "16px",
        padding: "14px",
      }}>
        <div style={{ color: "white", fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>June 2026</div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "4px" }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "10px", padding: "2px 0" }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        {grid.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {week.map((day, di) => (
              <div
                key={di}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "3px 0",
                  borderRadius: "8px",
                  background: day === selected ? "rgba(255,255,255,0.2)" : "transparent",
                }}
              >
                {day !== null && (
                  <>
                    <span style={{
                      fontSize: "11px",
                      color: day === selected ? "white" : "rgba(255,255,255,0.65)",
                      fontWeight: day === selected ? 700 : 400,
                    }}>
                      {day}
                    </span>
                    <div style={{ display: "flex", gap: "1.5px", marginTop: "1px", height: "5px", alignItems: "center" }}>
                      {hasIn.includes(day) && <div style={{ width: "3px", height: "3px", borderRadius: "9999px", background: "#86efac" }} />}
                      {hasOut.includes(day) && <div style={{ width: "3px", height: "3px", borderRadius: "9999px", background: "#fca5a5" }} />}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Selected day */}
        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", marginBottom: "6px" }}>June 15</div>
          {[
            { name: "Salary", amount: "+R 15,000", color: "#86efac" },
            { name: "Groceries", amount: "-R 890", color: "#fca5a5" },
          ].map(tx => (
            <div key={tx.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}>{tx.name}</span>
              <span style={{ color: tx.color, fontSize: "11px", fontWeight: 600 }}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Slide 3: Transactions ────────────────────────────────────────────── */
function TransactionsSlide() {
  const txns = [
    { name: "Salary", category: "Income", amount: "+R 15,000", type: "in", status: "Confirmed" },
    { name: "Woolworths", category: "Groceries", amount: "-R 890", type: "out", status: "Confirmed" },
    { name: "Spotify", category: "Entertainment", amount: "-R 99", type: "out", status: "Pending" },
    { name: "Freelance", category: "Income", amount: "+R 3,500", type: "in", status: "Confirmed" },
  ];

  return (
    <div className="space-y-3">
      <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Transactions
      </div>
      <h3 style={{ color: "white", fontSize: "22px", fontWeight: 700, lineHeight: 1.25, marginBottom: "16px" }}>
        Every rand,<br />accounted for
      </h3>

      <div style={{
        background: "rgba(255,255,255,0.14)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "16px",
        padding: "12px",
      }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 500, padding: "2px 4px 8px" }}>
          Today · June 26
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {txns.map((tx, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "9px 11px",
              }}
            >
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: tx.type === "in" ? "rgba(134,239,172,0.18)" : "rgba(252,165,165,0.18)",
              }}>
                {tx.type === "in"
                  ? <ArrowDownLeft size={12} style={{ color: "#86efac" }} />
                  : <ArrowUpRight size={12} style={{ color: "#fca5a5" }} />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "12px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {tx.name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>{tx.category}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: tx.type === "in" ? "#86efac" : "#fca5a5" }}>
                  {tx.amount}
                </div>
                <div style={{
                  fontSize: "9px",
                  color: tx.status === "Confirmed" ? "rgba(134,239,172,0.65)" : "rgba(251,191,36,0.65)",
                }}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Panel ────────────────────────────────────────────────────────────── */
const SLIDES = [
  { component: DashboardSlide },
  { component: CalendarSlide },
  { component: TransactionsSlide },
];

export default function AuthSlidePanel() {
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

  const SlideContent = SLIDES[idx].component;

  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-brand-gradient relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 size-56 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 relative z-10">
        <div className="bg-white/20 size-11 rounded-xl grid place-items-center text-white shadow-md">
          <TrendingUp size={22} />
        </div>
        <span className="font-display font-semibold text-lg text-white">Expense Flow</span>
      </Link>

      {/* Slide */}
      <div className="relative z-10">
        <div
          key={slideKey}
          style={{
            animation: exiting
              ? "none"
              : "slide-panel-enter 400ms var(--ease-out-quint) both",
            opacity: exiting ? 0 : undefined,
            transform: exiting ? "translateY(-8px)" : undefined,
            transition: exiting
              ? `opacity ${EXIT_MS}ms ease-out, transform ${EXIT_MS}ms ease-out`
              : undefined,
          }}
        >
          <SlideContent />
        </div>
      </div>

      {/* Dot indicators + footer */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                height: "6px",
                width: i === idx ? "22px" : "6px",
                borderRadius: "9999px",
                background: i === idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 320ms var(--ease-out-quint), background 320ms",
              }}
            />
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>© 2026 Expense Flow</p>
      </div>
    </div>
  );
}
