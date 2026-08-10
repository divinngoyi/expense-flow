"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TransactionDto, useApi } from "@/lib/api";
import { useToast } from "@/components/Toast";

interface Props {
  transaction: TransactionDto | null;
  onClose: () => void;
  onEdit: (tx: TransactionDto) => void;
  onDeleted: (id: string) => void;
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtAmt(tx: TransactionDto) {
  const prefix = tx.transactionType === "MoneyIn" ? "+" : "−";
  return `${prefix}R ${Math.abs(tx.amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
}

const STATUS_COLOR: Record<string, string> = {
  Confirmed: "var(--status-confirmed)",
  Pending: "var(--status-pending)",
  Skipped: "var(--status-skipped)",
};

const STATUS_BG: Record<string, string> = {
  Confirmed: "oklch(93% .07 150)",
  Pending: "oklch(96% .06 75)",
  Skipped: "var(--muted)",
};

export default function TransactionDetailModal({ transaction, onClose, onEdit, onDeleted }: Props) {
  const api = useApi();
  const toast = useToast();
  const [exiting, setExiting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = transaction !== null;

  const handleClose = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onClose();
    }, 160);
  }, [exiting, onClose]);

  useEffect(() => {
    if (open) {
      setExiting(false);
      setPendingDelete(false);
    }
  }, [open, transaction?.id]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  function initiateDelete() {
    clearTimeout(deleteTimerRef.current);
    setPendingDelete(true);
    deleteTimerRef.current = setTimeout(() => setPendingDelete(false), 3000);
  }

  async function confirmDelete() {
    if (!transaction) return;
    clearTimeout(deleteTimerRef.current);
    setDeleting(true);
    await api.deleteTransaction(transaction.id).catch(() => {});
    setDeleting(false);
    toast("Transaction deleted", "info");
    onDeleted(transaction.id);
    handleClose();
  }

  function handleEdit() {
    if (!transaction) return;
    onEdit(transaction);
    handleClose();
  }

  if (!open && !exiting) return null;

  const tx = transaction!;
  const isIn = tx.transactionType === "MoneyIn";

  const rows: { label: string; value: string }[] = [
    { label: "Date", value: fmtDate(tx.transactionDate) },
    { label: "Category", value: tx.categoryName || "—" },
    { label: "Source", value: `${tx.transactionSourceName} · ${tx.transactionSourceType}` },
    { label: "Added via", value: tx.entrySource },
    {
      label: "Created",
      value: new Date(tx.createdAt).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 ${
        exiting ? "modal-exiting" : "modal-entering"
      }`}
    >
      <div
        className="modal-backdrop absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="modal-panel glass relative w-full sm:max-w-sm p-6 space-y-5 z-10 rounded-b-none sm:rounded-[22px] max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Transaction</h2>
          <button
            onClick={handleClose}
            className="glass-subtle p-1.5 rounded-lg hover:bg-white/70 transition"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Amount hero */}
        <div className="text-center py-1">
          <div
            className="inline-flex items-center justify-center size-12 rounded-2xl mb-3"
            style={{
              background: isIn ? "oklch(93% .07 150)" : "oklch(95% .03 250)",
            }}
          >
            {isIn ? (
              <ArrowDownLeft size={22} style={{ color: "var(--status-confirmed)" }} />
            ) : (
              <ArrowUpRight size={22} style={{ color: "var(--muted-foreground)" }} />
            )}
          </div>

          <div
            className="font-display font-bold text-3xl tracking-tight number-in"
            style={{ color: isIn ? "var(--status-confirmed)" : "var(--foreground)" }}
          >
            {fmtAmt(tx)}
          </div>

          {tx.description && (
            <div className="text-sm mt-1.5" style={{ color: "var(--muted-foreground)" }}>
              {tx.description}
            </div>
          )}

          <div className="mt-3 inline-flex">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                color: STATUS_COLOR[tx.transactionStatus],
                background: STATUS_BG[tx.transactionStatus],
              }}
            >
              {tx.transactionStatus}
            </span>
          </div>
        </div>

        {/* Detail rows */}
        <div
          className="rounded-2xl overflow-hidden divide-y"
          style={{
            background: "rgba(255,255,255,0.45)",
            border: "1px solid oklch(100% 0 0 / 0.45)",
            borderColor: "var(--border)",
          }}
        >
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between px-4 py-3 gap-4">
              <span
                className="text-xs font-semibold tracking-wide shrink-0"
                style={{ color: "var(--muted-foreground)" }}
              >
                {r.label.toUpperCase()}
              </span>
              <span className="text-sm font-medium text-right">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-gradient text-white py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 active:scale-[0.97] transition"
          >
            <Pencil size={14} />
            Edit
          </button>

          {pendingDelete ? (
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60"
                style={{ background: "var(--destructive)", color: "white" }}
              >
                {deleting ? "Deleting…" : "Confirm?"}
              </button>
              <button
                onClick={() => { clearTimeout(deleteTimerRef.current); setPendingDelete(false); }}
                className="px-3 py-2.5 rounded-xl text-sm glass-subtle hover:bg-white/70 transition"
                style={{ color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={initiateDelete}
              className="px-3 py-2.5 rounded-xl text-sm font-medium glass-subtle hover:bg-red-50 transition flex items-center gap-2 shrink-0"
              style={{ color: "var(--destructive)" }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
