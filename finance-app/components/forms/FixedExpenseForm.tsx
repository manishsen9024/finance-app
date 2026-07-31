"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { categoryEmoji } from "@/lib/constants";
import { toast } from "@/lib/toast";

export default function FixedExpenseForm({
  categories,
  onChanged,
}: {
  categories: string[];
  onChanged: () => void;
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("1");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/fixed-expenses", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          amount: Number(amount),
          dueDay: Number(dueDay),
          category: category.trim() || "Other",
          active: true,
        }),
      });
      setName("");
      setAmount("");
      setDueDay("1");
      toast("Fixed expense added 🔁");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add fixed expense");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
        🔁 Add fixed expense
      </h2>
      <p className="rounded-2xl bg-indigo-50 px-3 py-2 text-xs text-indigo-500">
        Rent, subscriptions, bills — these auto-fill into expenses on their due day each month.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="fx-name">Name</label>
          <input
            id="fx-name"
            type="text"
            required
            placeholder="e.g. Rent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="fx-amount">Amount</label>
          <input
            id="fx-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            required
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="fx-day">Due day (1–31)</label>
          <input
            id="fx-day"
            type="number"
            inputMode="numeric"
            min="1"
            max="31"
            required
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <span className="label">Category</span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {categories.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`chip ${category === c ? "chip-active" : "chip-idle"}`}
              >
                {categoryEmoji(c)} {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? "Adding…" : "Add fixed expense"}
      </button>
    </form>
  );
}