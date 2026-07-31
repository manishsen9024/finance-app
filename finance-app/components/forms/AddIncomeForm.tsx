"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { todayKey } from "@/lib/calculations";
import { toast } from "@/lib/toast";
import type { Profile } from "@/lib/types";

export default function AddIncomeForm({
  profile,
  onAdded,
}: {
  profile?: Profile;
  onAdded: () => void;
}) {
  const [date, setDate] = useState(todayKey());
  const [type, setType] = useState<"Salary" | "Extra">("Salary");
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/income", {
        method: "POST",
        body: JSON.stringify({
          date,
          type,
          source: source.trim() || (type === "Salary" ? "Monthly salary" : "Extra income"),
          amount: Number(amount),
          notes: notes.trim(),
        }),
      });
      setSource("");
      setAmount("");
      setNotes("");
      toast(type === "Salary" ? "Salary recorded 💼" : "Extra income added ✨");
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add income");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
        💰 Add income
      </h2>

      <div>
        <span className="label">Type</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("Salary")}
            className={`rounded-2xl border px-3 py-2.5 text-sm font-bold transition active:scale-95 ${
              type === "Salary"
                ? "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            💼 Salary
          </button>
          <button
            type="button"
            onClick={() => setType("Extra")}
            className={`rounded-2xl border px-3 py-2.5 text-sm font-bold transition active:scale-95 ${
              type === "Extra"
                ? "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            ✨ Extra
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="inc-date">Date</label>
          <input
            id="inc-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="inc-amount">Amount</label>
          <input
            id="inc-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            required
            placeholder={type === "Salary" ? String(profile?.baseMonthlySalary ?? 0) : "0"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />
          {type === "Salary" && !amount && profile?.baseMonthlySalary ? (
            <p className="mt-1 text-[11px] text-slate-400">
              Base salary is {profile.baseMonthlySalary.toLocaleString("en-IN")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="inc-source">Source</label>
          <input
            id="inc-source"
            type="text"
            placeholder={type === "Salary" ? "Monthly salary" : "Freelance, gift…"}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="inc-notes">Notes</label>
          <input
            id="inc-notes"
            type="text"
            placeholder="Optional"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? "Adding…" : "Add income"}
      </button>
    </form>
  );
}