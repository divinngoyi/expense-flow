"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Plus, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";
import { useApi, DashboardSummaryDto, CategoryBreakdownItemDto } from "@/lib/api";
import AddTransactionModal from "@/components/AddTransactionModal";
import { useToast } from "@/components/Toast";
import { useCountUp } from "@/hooks/useCountUp";

function fmt(n: number) {
  return "R " + n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1).toLocaleString("en-ZA", { month: "long", year: "numeric" });
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-36 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="skeleton h-52" />
        <div className="skeleton h-52" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isLoaded } = useAuth();
  const api = useApi();
  const toast = useToast();
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdownItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setError(false);
    setLoading(true);
    try {
      const [s, cats] = await Promise.all([
        api.getDashboardSummary(),
        api.getCategoryBreakdown(),
      ]);
      setSummary(s);
      setCategories(cats);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoaded) return;
    load();
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTransactionCreated() {
    load();
    toast("Transaction added");
  }

  const netPositive = summary ? summary.netFlow >= 0 : true;
  const dataLoaded = !loading && !!summary;
  const animNetFlow = useCountUp(summary?.netFlow ?? 0, { active: dataLoaded });
  const animMoneyIn = useCountUp(summary?.totalMoneyIn ?? 0, { active: dataLoaded });
  const animMoneyOut = useCountUp(summary?.totalMoneyOut ?? 0, { active: dataLoaded });

  return (
    <>
      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleTransactionCreated}
      />

      <div className="space-y-5 max-w-5xl page-enter">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">
              {summary ? monthLabel(summary.year, summary.month) : "Dashboard"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Confirmed transactions only.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-brand-gradient text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 active:scale-[0.97] transition"
          >
            <Plus size={16} />
            Add transaction
          </button>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div
            className="glass p-10 text-center space-y-3"
            style={{ color: "var(--muted-foreground)" }}
          >
            <AlertCircle size={28} className="mx-auto" style={{ color: "var(--destructive)" }} />
            <p className="text-sm font-medium">Couldn&apos;t load your data.</p>
<button
              onClick={load}
              className="inline-flex items-center gap-2 glass-subtle px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/70 transition"
              style={{ color: "var(--foreground)" }}
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        ) : !summary ? (
          <div className="glass p-10 text-center space-y-3">
            <TrendingUp size={32} className="mx-auto opacity-20" />
            <p className="font-display font-semibold text-lg">Nothing here yet</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Add your first transaction to see your month take shape.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-brand-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition"
            >
              Add transaction
            </button>
          </div>
        ) : (
          <>
            {/* Net Flow — hero card */}
            <div
              className="glass glass-lift p-6 relative overflow-hidden stagger-item"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background: netPositive
                    ? "radial-gradient(ellipse at 80% 50%, oklch(70% .18 150), transparent 70%)"
                    : "radial-gradient(ellipse at 80% 50%, oklch(70% .22 25), transparent 70%)",
                }}
              />
              <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-wide mb-1" style={{ color: "var(--muted-foreground)" }}>
                    NET FLOW
                  </p>
                  <div
                    className="font-display font-bold text-5xl leading-none tabular-nums number-in"
                    style={{ color: netPositive ? "var(--status-confirmed)" : "var(--destructive)" }}
                  >
                    {fmt(animNetFlow)}
                  </div>
                  {summary.netFlowVsLastMonth != null && (
                    <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>
                      <span style={{ color: summary.netFlowVsLastMonth >= 0 ? "var(--status-confirmed)" : "var(--destructive)" }}>
                        {summary.netFlowVsLastMonth >= 0 ? "+" : ""}{fmt(summary.netFlowVsLastMonth)}
                      </span>
                      {" "}vs last month
                    </p>
                  )}
                </div>
                <div className="sm:text-right">
                  <p className="text-2xl font-display font-semibold" style={{ color: "var(--muted-foreground)" }}>
                    {monthLabel(summary.year, summary.month)}
                  </p>
                </div>
              </div>
            </div>

            {/* Money In + Money Out — supporting cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Money In",
                  amount: fmt(animMoneyIn),
                  delta: summary.moneyInChangePercent != null
                    ? `${summary.moneyInChangePercent > 0 ? "+" : ""}${summary.moneyInChangePercent}% vs last month`
                    : "No prior month",
                  positive: (summary.moneyInChangePercent ?? 0) >= 0,
                  icon: TrendingUp,
                  i: 1,
                },
                {
                  label: "Money Out",
                  amount: fmt(animMoneyOut),
                  delta: summary.moneyOutChangePercent != null
                    ? `${summary.moneyOutChangePercent > 0 ? "+" : ""}${summary.moneyOutChangePercent}% vs last month`
                    : "No prior month",
                  positive: (summary.moneyOutChangePercent ?? 0) <= 0,
                  icon: TrendingDown,
                  i: 2,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="glass glass-lift p-5 space-y-2 stagger-item"
                  style={{ "--i": card.i } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                      {card.label.toUpperCase()}
                    </span>
                    <card.icon size={14} style={{ color: "var(--muted-foreground)" }} />
                  </div>
                  <div className="font-display font-bold text-xl tabular-nums number-in">{card.amount}</div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: card.positive ? "var(--status-confirmed)" : "var(--destructive)" }}
                  >
                    {card.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                className="glass p-6 space-y-4 stagger-item"
                style={{ "--i": 3 } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <div className="font-display font-semibold">Top categories</div>
                </div>
                {categories.length === 0 ? (
                  <p className="text-sm py-4 text-center" style={{ color: "var(--muted-foreground)" }}>
                    No spending recorded this month.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {categories.slice(0, 5).map((cat, i) => (
                      <div key={cat.categoryId} className="flex items-center gap-3">
                        <div
                          className="flex-1 flex items-center justify-between"
                        >
                          <span className="text-sm">{cat.categoryName}</span>
                          <span className="text-sm font-semibold tabular-nums">{fmt(cat.total)}</span>
                        </div>
                        {i < categories.slice(0, 5).length - 1 && (
                          <span />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="glass p-6 space-y-3 stagger-item"
                style={{ "--i": 4 } as React.CSSProperties}
              >
                <div className="font-display font-semibold">Quick summary</div>
                <div className="space-y-2.5">
                  {[
                    { label: "Total confirmed in", value: fmt(summary.totalMoneyIn), color: "var(--status-confirmed)" },
                    { label: "Total confirmed out", value: fmt(summary.totalMoneyOut), color: "var(--foreground)" },
                    { label: "Net position", value: fmt(summary.netFlow), color: netPositive ? "var(--status-confirmed)" : "var(--destructive)" },
                  ].map(row => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2.5 border-b last:border-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{row.label}</span>
                      <span className="text-sm font-semibold tabular-nums" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
