"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Tag, AlertCircle, RefreshCw } from "lucide-react";
import { useApi, CategoryDto, CategoryType } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function CategoriesPage() {
  const api = useApi();
  const toast = useToast();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<CategoryType>("MoneyOut");
  const [saving, setSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function load() {
    setError(false);
    try {
      setCategories(await api.getCategories());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const created = await api.createCategory({ name: newName.trim(), categoryType: newType });
      setCategories(prev => [...prev, created]);
      setNewName("");
      setAdding(false);
      toast("Category created");
    } catch {
      toast("Failed to create category.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete(id: string) {
    setPendingDeleteId(null);
    await api.deleteCategory(id).catch(() => {});
    setCategories(prev => prev.filter(c => c.id !== id));
    toast("Category removed", "info");
  }

  const typeColor = (t: string) =>
    t === "MoneyIn" ? "var(--status-confirmed)" : t === "MoneyOut" ? "var(--primary)" : "var(--muted-foreground)";

  const typeLabel = (t: string) =>
    t === "MoneyIn" ? "Money In" : t === "MoneyOut" ? "Money Out" : "Both";

  return (
    <div className="space-y-5 max-w-3xl page-enter">
      <div>
        <h1 className="font-display font-bold text-2xl">Categories</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Make them your own — money in or money out.
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="glass p-10 text-center space-y-3" style={{ color: "var(--muted-foreground)" }}>
          <AlertCircle size={28} className="mx-auto" style={{ color: "var(--destructive)" }} />
          <p className="text-sm font-medium">Couldn&apos;t load your categories.</p>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 glass-subtle px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/70 transition"
            style={{ color: "var(--foreground)" }}
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.length === 0 && !adding && (
            <div className="glass p-10 text-center space-y-3 fade-in">
              <Tag size={32} className="mx-auto opacity-25" />
              <p className="font-display font-semibold">No categories yet</p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Create categories to organise your transactions by type.
              </p>
            </div>
          )}

          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="glass px-5 py-4 flex items-center justify-between hover:bg-white/60 transition-colors stagger-item"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div>
                <div className="font-medium">{cat.name}</div>
                {cat.description && (
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {cat.description}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="glass-subtle text-xs font-semibold px-2.5 py-1"
                  style={{ color: typeColor(cat.categoryType) }}
                >
                  {typeLabel(cat.categoryType)}
                </span>
                {pendingDeleteId === cat.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => confirmDelete(cat.id)}
                      className="text-xs px-2 py-1 rounded-lg font-medium transition"
                      style={{ background: "var(--destructive)", color: "white" }}
                    >
                      Remove?
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
                  <button
                    onClick={() => setPendingDeleteId(cat.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition"
                    style={{ color: "var(--destructive)" }}
                    aria-label="Remove category"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {adding ? (
            <form
              onSubmit={handleAdd}
              className="glass px-5 py-4 space-y-3 fade-in"
            >
              <div className="flex gap-3">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 glass-subtle px-3 py-2 rounded-xl text-sm input-focus outline-none"
                  required
                />
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as CategoryType)}
                  className="glass-subtle px-3 py-2 rounded-xl text-sm outline-none"
                >
                  <option value="MoneyOut">Money Out</option>
                  <option value="MoneyIn">Money In</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-gradient text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 active:scale-[0.97] transition disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => { setAdding(false); setNewName(""); }}
                  className="glass-subtle px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/70 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="glass-subtle w-full px-5 py-4 flex items-center gap-2 text-sm font-medium hover:bg-white/70 transition rounded-[22px]"
              style={{ color: "var(--muted-foreground)" }}
            >
              <Plus size={16} />
              New category
            </button>
          )}
        </div>
      )}
    </div>
  );
}
