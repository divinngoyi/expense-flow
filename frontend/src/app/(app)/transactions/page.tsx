"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil, AlertCircle, RefreshCw, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useApi, TransactionDto } from "@/lib/api";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import { useToast } from "@/components/Toast";

type Filter = "All" | "MoneyIn" | "MoneyOut" | "Pending";

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function fmtAmt(tx: TransactionDto) {
  const prefix = tx.transactionType === "MoneyIn" ? "+" : "-";
  return `${prefix}R ${Math.abs(tx.amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
}

function TableSkeleton() {
  return (
    <div className="glass overflow-hidden">
      <div className="p-5 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const api = useApi();
  const toast = useToast();
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [viewTx, setViewTx] = useState<TransactionDto | null>(null);
  const [editTx, setEditTx] = useState<TransactionDto | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function load() {
    setError(false);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openEdit(tx: TransactionDto) {
    setEditTx(tx);
    setEditOpen(true);
  }

  function initiateDelete(id: string) {
    clearTimeout(deleteTimerRef.current);
    setPendingDeleteId(id);
    deleteTimerRef.current = setTimeout(() => setPendingDeleteId(null), 3000);
  }

  async function confirmDelete(id: string) {
    clearTimeout(deleteTimerRef.current);
    setPendingDeleteId(null);
    await api.deleteTransaction(id).catch(() => {});
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (viewTx?.id === id) setViewTx(null);
    toast("Transaction deleted", "info");
  }

  async function handleConfirm(id: string) {
    const updated = await api.confirmTransaction(id).catch(() => null);
    if (updated) {
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
      toast("Transaction confirmed");
    }
  }

  async function handleSkip(id: string) {
    const updated = await api.skipTransaction(id).catch(() => null);
    if (updated) {
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
      toast("Transaction skipped", "info");
    }
  }

  function handleTransactionCreated() {
    load();
    toast("Transaction added");
  }

  function handleTransactionUpdated(updated: TransactionDto) {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditOpen(false);
    setEditTx(null);
    toast("Transaction updated");
  }

  function handleDetailDeleted(id: string) {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setViewTx(null);
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

  const statusColor: Record<string, string> = {
    Confirmed: "var(--status-confirmed)",
    Pending: "var(--status-pending)",
    Skipped: "var(--status-skipped)",
  };

  return (
    <>
      <AddTransactionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={handleTransactionCreated}
      />

      <AddTransactionModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditTx(null); }}
        onUpdated={handleTransactionUpdated}
        transaction={editTx ?? undefined}
      />

      <TransactionDetailModal
        transaction={viewTx}
        onClose={() => setViewTx(null)}
        onEdit={openEdit}
        onDeleted={handleDetailDeleted}
      />

      <div className="space-y-5 max-w-5xl page-enter">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl">Transactions</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Everything that moved this month.
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-brand-gradient text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 active:scale-[0.97] transition"
          >
            <Plus size={16} />
            Add transaction
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === f.key
                  ? "bg-brand-gradient text-white shadow-md"
                  : "glass-subtle hover:bg-white/70"
              }`}
              style={filter === f.key ? undefined : { color: "var(--foreground)" }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="glass p-10 text-center space-y-3" style={{ color: "var(--muted-foreground)" }}>
            <AlertCircle size={28} className="mx-auto" style={{ color: "var(--destructive)" }} />
            <p className="text-sm font-medium">Couldn&apos;t load your transactions.</p>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 glass-subtle px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/70 transition"
              style={{ color: "var(--foreground)" }}
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass p-10 text-center space-y-2 fade-in">
            <ArrowDownLeft size={32} className="mx-auto opacity-20" />
            <p className="font-medium">
              {filter === "All" ? "No transactions this month" : `No ${filter === "MoneyIn" ? "money in" : filter === "MoneyOut" ? "money out" : "pending"} transactions`}
            </p>
            {filter === "All" && (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Add your first transaction to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="glass overflow-hidden">
            {/* Mobile card list */}
            <div className="lg:hidden divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map((tx, i) => (
                <div
                  key={tx.id}
                  onClick={() => setViewTx(tx)}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/30 transition-colors stagger-item cursor-pointer"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div
                    className="size-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: tx.transactionType === "MoneyIn"
                        ? "oklch(96% .05 150)"
                        : "oklch(96% .02 250)",
                    }}
                  >
                    {tx.transactionType === "MoneyIn"
                      ? <ArrowDownLeft size={14} style={{ color: "var(--status-confirmed)" }} />
                      : <ArrowUpRight size={14} style={{ color: "var(--muted-foreground)" }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{tx.description || tx.categoryName || "—"}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {fmtDate(tx.transactionDate)} · {tx.transactionSourceName}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <span
                      className="text-sm font-semibold tabular-nums mr-1"
                      style={{ color: tx.transactionType === "MoneyIn" ? "var(--status-confirmed)" : "var(--foreground)" }}
                    >
                      {fmtAmt(tx)}
                    </span>
                    <button
                      onClick={() => openEdit(tx)}
                      className="p-1 rounded hover:bg-white/60 transition"
                      style={{ color: "var(--muted-foreground)" }}
                      aria-label="Edit transaction"
                    >
                      <Pencil size={13} />
                    </button>
                    {pendingDeleteId === tx.id ? (
                      <button
                        onClick={() => confirmDelete(tx.id)}
                        className="text-xs px-2 py-1 rounded-lg font-medium transition"
                        style={{ background: "var(--destructive)", color: "white" }}
                      >
                        Delete?
                      </button>
                    ) : (
                      <button
                        onClick={() => initiateDelete(tx.id)}
                        className="p-1 rounded hover:bg-red-50 transition"
                        style={{ color: "var(--destructive)" }}
                        aria-label="Delete transaction"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <table className="hidden lg:table w-full text-sm">
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
                {filtered.map((tx, i) => (
                  <tr
                    key={tx.id}
                    onClick={() => setViewTx(tx)}
                    className="border-b last:border-0 hover:bg-white/30 transition-colors stagger-item cursor-pointer"
                    style={{
                      borderColor: "var(--border)",
                      "--i": i,
                    } as React.CSSProperties}
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                          color: statusColor[tx.transactionStatus],
                          background: tx.transactionStatus === "Confirmed"
                            ? "oklch(96% .05 150)"
                            : tx.transactionStatus === "Pending"
                            ? "oklch(97% .05 75)"
                            : "var(--muted)",
                        }}>
                          {tx.transactionStatus}
                        </span>
                        {tx.transactionStatus === "Pending" && (
                          <>
                            <button
                              onClick={e => { e.stopPropagation(); handleConfirm(tx.id); }}
                              className="text-xs glass-subtle px-2 py-0.5 rounded-lg hover:bg-white/70 transition font-medium"
                              style={{ color: "var(--status-confirmed)" }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleSkip(tx.id); }}
                              className="text-xs glass-subtle px-2 py-0.5 rounded-lg hover:bg-white/70 transition font-medium"
                              style={{ color: "var(--muted-foreground)" }}
                            >
                              Skip
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-5 py-3.5 text-right font-semibold tabular-nums"
                      style={{ color: tx.transactionType === "MoneyIn" ? "var(--status-confirmed)" : "var(--foreground)" }}
                    >
                      {fmtAmt(tx)}
                    </td>
                    <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                      {pendingDeleteId === tx.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => confirmDelete(tx.id)}
                            className="text-xs px-2 py-1 rounded-lg font-medium transition"
                            style={{ background: "var(--destructive)", color: "white" }}
                          >
                            Delete?
                          </button>
                          <button
                            onClick={() => setPendingDeleteId(null)}
                            className="text-xs glass-subtle px-2 py-1 rounded-lg hover:bg-white/70 transition"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openEdit(tx)}
                            className="p-1.5 rounded-lg hover:bg-white/60 transition"
                            style={{ color: "var(--muted-foreground)" }}
                            aria-label="Edit transaction"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => initiateDelete(tx.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition"
                            style={{ color: "var(--destructive)" }}
                            aria-label="Delete transaction"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
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
