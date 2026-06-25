"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useApi, DashboardSummaryDto, CategoryBreakdownItemDto } from "@/lib/api";
import AddTransactionModal from "@/components/AddTransactionModal";

function fmt(n: number) {
  return "R " + n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1).toLocaleString("en-ZA", { month: "long", year: "numeric" });
}

export default function DashboardPage() {
  const api = useApi();
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdownItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    try {
      const [s, cats] = await Promise.all([
        api.getDashboardSummary(),
        api.getCategoryBreakdown(),
      ]);
      setSummary(s);
      setCategories(cats);
    } catch {
      // ignore — user may not have synced yet
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const summaryCards = summary
    ? [
        {
          label: "Money In",
          amount: fmt(summary.totalMoneyIn),
          delta: summary.moneyInChangePercent != null
            ? `${summary.moneyInChangePercent > 0 ? "+" : ""}${summary.moneyInChangePercent}% vs last month`
            : "No data last month",
          positive: (summary.moneyInChangePercent ?? 0) >= 0,
          icon: TrendingUp,
        },
        {
          label: "Money Out",
          amount: fmt(summary.totalMoneyOut),
          delta: summary.moneyOutChangePercent != null
            ? `${summary.moneyOutChangePercent > 0 ? "+" : ""}${summary.moneyOutChangePercent}% vs last month`
            : "No data last month",
          positive: (summary.moneyOutChangePercent ?? 0) <= 0,
          icon: TrendingDown,
        },
        {
          label: "Net Flow",
          amount: fmt(summary.netFlow),
          delta: summary.netFlowVsLastMonth != null
            ? `${summary.netFlowVsLastMonth >= 0 ? "+" : ""}${fmt(summary.netFlowVsLastMonth)} vs last month`
            : "No data last month",
          positive: summary.netFlow >= 0,
          icon: Minus,
        },
      ]
    : [];

  return (
    <>
      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={load} />

      <div className="space-y-6 max-w-5xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">
              {summary ? monthLabel(summary.year, summary.month) : "Dashboard"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              A snapshot of your confirmed transactions this month.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-brand-gradient text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition"
          >
            <Plus size={16} />
            Add transaction
          </button>
        </div>

        {loading ? (
          <div className="glass p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            Loading…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="glass p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                      {card.label}
                    </span>
                    <card.icon size={16} style={{ color: "var(--muted-foreground)" }} />
                  </div>
                  <div className="font-display font-bold text-3xl">{card.amount}</div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: card.positive ? "oklch(55% .18 150)" : "var(--destructive)" }}
                  >
                    {card.delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-display font-semibold">Daily spending</div>
                  <span className="text-xs glass-subtle px-2.5 py-1" style={{ color: "var(--muted-foreground)" }}>
                    Coming soon
                  </span>
                </div>
                <div
                  className="h-40 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                >
                  Chart coming soon
                </div>
              </div>

              <div className="glass p-6 space-y-4">
                <div className="font-display font-semibold">Top categories</div>
                {categories.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    No spending this month yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {categories.slice(0, 5).map((cat) => (
                      <div key={cat.categoryId} className="flex items-center justify-between">
                        <span className="text-sm">{cat.categoryName}</span>
                        <span className="text-sm font-semibold">{fmt(cat.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
