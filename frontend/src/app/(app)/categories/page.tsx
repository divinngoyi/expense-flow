"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useApi, CategoryDto, CategoryType } from "@/lib/api";

export default function CategoriesPage() {
  const api = useApi();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<CategoryType>("MoneyOut");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setCategories(await api.getCategories());
    } catch {
      // ignore
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
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Archive this category?")) return;
    await api.deleteCategory(id).catch(() => {});
    setCategories(prev => prev.filter(c => c.id !== id));
  }

  const typeColor = (t: string) =>
    t === "MoneyIn" ? "oklch(55% .18 150)" : t === "MoneyOut" ? "var(--primary)" : "var(--muted-foreground)";

  const typeLabel = (t: string) =>
    t === "MoneyIn" ? "Money In" : t === "MoneyOut" ? "Money Out" : "Both";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Categories</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Make them your own — money in or money out.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading…
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass px-5 py-4 flex items-center justify-between hover:bg-white/60 transition-colors"
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
                  className="glass-subtle text-xs font-medium px-2.5 py-1"
                  style={{ color: typeColor(cat.categoryType) }}
                >
                  {typeLabel(cat.categoryType)}
                </span>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1 rounded hover:bg-red-100 transition"
                  style={{ color: "var(--destructive)" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {adding ? (
            <form onSubmit={handleAdd} className="glass px-5 py-4 space-y-3">
              <div className="flex gap-3">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 glass-subtle px-3 py-2 rounded-xl text-sm outline-none"
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
                  className="bg-brand-gradient text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition disabled:opacity-60"
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
              className="glass-subtle w-full px-5 py-4 flex items-center gap-2 text-sm font-medium hover:bg-white/70 transition"
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
