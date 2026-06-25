"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useApi, TransactionDto } from "@/lib/api";
import AddTransactionModal from "@/components/AddTransactionModal";

const statusColor: Record<string, string> = {
  Confirmed: "oklch(55% .18 150)",
  Pending: "oklch(65% .15 75)",
  Skipped: "var(--muted-foreground)",
};

type Filter = "All" | "MoneyIn" | "MoneyOut" | "Pending";

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function fmtAmt(tx: TransactionDto) {
  const prefix = tx.transactionType === "MoneyIn" ? "+" : "-";
  return `${prefix}R ${Math.abs(tx.amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
}

export default function TransactionsPage() {
  const api = useApi();
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id: string) {
    if (!confirm("Delete this transaction?")) return;
    await api.deleteTransaction(id).catch(() => {});
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  async function handleConfirm(id: string) {
    const updated = await api.confirmTransaction(id).catch(() => null);
    if (updated) setTransactions(prev => prev.map(t => t.id === id ? updated : t));
  }

  async function handleSkip(id: string) {
    const updated = await api.skipTransaction(id).catch(() => null);
    if (updated) setTransactions(prev => prev.map(t => t.id === id ? updated : t));
  }

  const filtered = transactions.filter(tx => {
    if (filter === "All") return true;
    if (filter === "MoneyIn") return tx.transactionType === "MoneyIn";
    if (filter === "MoneyOut") return tx.transactionType === "MoneyOut";
    if (filter === "Pending") return tx.transactionStatus === "Pending";
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "All", label: "All" },
    { key: "MoneyIn", label: "Money in" },
    { key: "MoneyOut", label: "Money out" },
    { key: "Pending", label: "Pending" },
  ];

  return (
    <>
      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={load} />

      <div className="space-y-6 max-w-5xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Transactions</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Everything that moved this month.
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

        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === f.key ? "bg-brand-gradient text-white shadow-md" : "glass-subtle hover:bg-white/70"
              }`}
              style={filter === f.key ? undefined : { color: "var(--foreground)" }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="glass p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            No transactions found. Add one to get started.
          </div>
        ) : (
          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  {["DATE", "DESCRIPTION", "CATEGORY", "SOURCE", "STATUS", "AMOUNT", ""].map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-5 py-3 text-xs font-semibold tracking-wide"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b last:border-0 hover:bg-white/30 transition-colors"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>
                      {fmtDate(tx.transactionDate)}
                    </td>
                    <td className="px-5 py-3.5 font-medium">{tx.description || "—"}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)" }}>
                      {tx.categoryName || "—"}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)" }}>
                      {tx.transactionSourceName}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: statusColor[tx.transactionStatus] }}>
                          {tx.transactionStatus}
                        </span>
                        {tx.transactionStatus === "Pending" && (
                          <button
                            onClick={() => handleConfirm(tx.id)}
                            className="text-xs glass-subtle px-1.5 py-0.5 rounded hover:bg-white/70 transition"
                            style={{ color: "oklch(55% .18 150)" }}
                          >
                            Confirm
                          </button>
                        )}
                        {tx.transactionStatus !== "Skipped" && tx.transactionStatus === "Pending" && (
                          <button
                            onClick={() => handleSkip(tx.id)}
                            className="text-xs glass-subtle px-1.5 py-0.5 rounded hover:bg-white/70 transition"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            Skip
                          </button>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-5 py-3.5 text-right font-semibold tabular-nums"
                      style={{ color: tx.transactionType === "MoneyIn" ? "oklch(55% .18 150)" : "var(--foreground)" }}
                    >
                      {fmtAmt(tx)}
                    </td>
                    <td className="px-3 py-3.5">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1 rounded hover:bg-red-100 transition"
                        style={{ color: "var(--destructive)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
