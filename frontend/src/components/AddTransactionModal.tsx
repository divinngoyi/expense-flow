"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
  const [status, setStatus] = useState<"Confirmed" | "Pending">("Confirmed");
  const [categoryId, setCategoryId] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    Promise.all([api.getCategories(), api.getSources()])
      .then(([cats, srcs]) => {
        setCategories(cats);
        setSources(srcs);
        if (srcs.length > 0) setSourceId(srcs.find(s => s.isDefault)?.id ?? srcs[0].id);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
      onClose();
      setAmount("");
      setDescription("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const filteredCategories = categories.filter(
    c => c.categoryType === type || c.categoryType === "Both"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative w-full max-w-md p-6 space-y-5 z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Add transaction</h2>
          <button onClick={onClose} className="glass-subtle p-1.5 rounded-lg hover:bg-white/70 transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            {(["MoneyOut", "MoneyIn"] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                  type === t ? "bg-brand-gradient text-white shadow-md" : "glass-subtle"
                }`}
              >
                {t === "MoneyIn" ? "Money In" : "Money Out"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
              style={{ ringColor: "var(--primary)" } as React.CSSProperties}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Category (optional)</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none"
            >
              <option value="">No category</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Source</label>
            <select
              value={sourceId}
              onChange={e => setSourceId(e.target.value)}
              className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none"
              required
            >
              <option value="">Select source…</option>
              {sources.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.sourceType})</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as "Confirmed" | "Pending")}
              className="w-full glass-subtle px-3 py-2.5 rounded-xl text-sm outline-none"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {error && <p className="text-xs" style={{ color: "var(--destructive)" }}>{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-gradient text-white py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}
