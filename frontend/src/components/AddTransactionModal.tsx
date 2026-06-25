"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronDown } from "lucide-react";
import { useApi, CategoryDto, TransactionSourceDto, CreateTransactionRequest } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddTransactionModal({ open, onClose, onCreated }: Props) {
  const api = useApi();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [sources, setSources] = useState<TransactionSourceDto[]>([]);

  const [type, setType] = useState<"MoneyIn" | "MoneyOut">("MoneyOut");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [status, setStatus] = useState<"Confirmed" | "Pending">("Confirmed");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onClose();
    }, 160);
  }, [exiting, onClose]);

  useEffect(() => {
    if (!open) return;
    setExiting(false);
    Promise.all([api.getCategories(), api.getSources()])
      .then(([cats, srcs]) => {
        setCategories(cats);
        setSources(srcs);
        if (srcs.length > 0) setSourceId(srcs.find(s => s.isDefault)?.id ?? srcs[0].id);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !sourceId) { setError("Amount and source are required."); return; }

    setSaving(true);
    setError("");

    const req: CreateTransactionRequest = {
      transactionType: type,
      amount: parseFloat(amount),
      description: description || undefined,
      transactionDate: date,
      transactionStatus: status,
      categoryId: categoryId || undefined,
      transactionSourceId: sourceId,
    };

    try {
      await api.createTransaction(req);
      onCreated();
      handleClose();
      // Reset form
      setAmount("");
      setDescription("");
      setStatus("Confirmed");
      setShowAdvanced(false);
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!open && !exiting) return null;

  const filteredCategories = categories.filter(
    c => c.categoryType === type || c.categoryType === "Both"
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 ${exiting ? "modal-exiting" : "modal-entering"}`}>
      <div
        className="modal-backdrop absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="modal-panel glass relative w-full sm:max-w-md p-6 space-y-5 z-10 rounded-b-none sm:rounded-[22px] max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Add transaction</h2>
          <button
            onClick={handleClose}
            className="glass-subtle p-1.5 rounded-lg hover:bg-white/70 transition"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type toggle */}
          <div className="flex gap-2">
            {(["MoneyOut", "MoneyIn"] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setCategoryId(""); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                  type === t ? "bg-brand-gradient text-white shadow-md" : "glass-subtle hover:bg-white/70"
                }`}
              >
                {t === "MoneyIn" ? "Money In" : "Money Out"}
              </button>
            ))}
          </div>

          {/* Group 1: What */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                AMOUNT (R)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none input-focus font-semibold tabular-nums"
                required
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                DESCRIPTION
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What was this for?"
                className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none input-focus"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: "var(--border)" }} />

          {/* Group 2: Context */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                DATE
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none input-focus"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                  CATEGORY
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none input-focus"
                >
                  <option value="">None</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                  SOURCE
                </label>
                <select
                  value={sourceId}
                  onChange={e => setSourceId(e.target.value)}
                  className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none input-focus"
                  required
                >
                  <option value="">Select…</option>
                  {sources.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Advanced: Status */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide hover:opacity-70 transition"
              style={{ color: "var(--muted-foreground)" }}
            >
              <ChevronDown
                size={14}
                style={{ transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 220ms var(--ease-out-quint)" }}
              />
              ADVANCED
            </button>

            <div className={`accordion-grid ${showAdvanced ? "open" : ""}`}>
              <div>
                <div className="mt-3 space-y-1">
                  <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                    STATUS
                  </label>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)", opacity: 0.8 }}>
                    Confirmed transactions count in your totals. Use Pending for future or uncertain items.
                  </p>
                  <div className="flex gap-2 mt-2">
                    {(["Confirmed", "Pending"] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                          status === s ? "bg-brand-gradient text-white shadow-sm" : "glass-subtle hover:bg-white/70"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-xl" style={{ color: "var(--destructive)", background: "oklch(98% .02 25)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-gradient text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}
