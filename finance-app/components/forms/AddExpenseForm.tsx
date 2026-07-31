"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { todayKey } from "@/lib/calculations";
import type { ExpenseType } from "@/lib/types";

export default function AddExpenseForm({
  categories,
  onAdded,
}: {
  categories: string[];
  onAdded: () => void;
}) {
  const [date, setDate] = useState(todayKey());
  const [category, setCategory] = useState(categories[0] ?? "");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<ExpenseType>("Variable");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/expenses", {
        method: "POST",
        body: JSON.stringify({
          date,
          category: category.trim() || "Other",
          description: description.trim() || "Expense",
          amount: Number(amount),
          type,
        }),
      });
      setDescription("");
      setAmount("");
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="text-sm font-semibold text-slate-700">Add expense</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="exp-date">Date</label>
          <input
            id="exp-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="exp-amount">Amount</label>
          <input
            id="exp-amount"
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

      <div>
        <label className="label" htmlFor="exp-category">Category</label>
        <input
          id="exp-category"
          type="text"
          list="category-list"
          required
          placeholder="Pick or type a category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
        />
        <datalist id="category-list">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="label" htmlFor="exp-desc">What was it?</label>
        <input
          id="exp-desc"
          type="text"
          placeholder="e.g. Dinner with friends"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
      </div>

      <div>
        <span className="label">Type</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("Variable")}
            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
              type === "Variable"
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-slate-200 text-slate-500"
            }`}
          >
            One-off
          </button>
          <button
            type="button"
            onClick={() => setType("Fixed")}
            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
              type === "Fixed"
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-slate-200 text-slate-500"
            }`}
          >
            Fixed
          </button>
        </div>
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? "Adding…" : "Add expense"}
      </button>
    </form>
  );
}
