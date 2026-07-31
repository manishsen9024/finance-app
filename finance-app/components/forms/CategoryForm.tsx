"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function CategoryForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/categories", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          monthlyBudget: budget ? Number(budget) : null,
        }),
      });
      setName("");
      setBudget("");
      toast("Category added 🗂️");
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
        🗂️ Add category
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="cat-name">Name</label>
          <input
            id="cat-name"
            type="text"
            required
            placeholder="e.g. Gifts"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="cat-budget">Monthly budget (optional)</label>
          <input
            id="cat-budget"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="input"
          />
        </div>
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}