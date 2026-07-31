"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { SavingsGoal } from "@/lib/types";

export default function GoalForm({
  month,
  initial,
  onSaved,
}: {
  month: string;
  initial: SavingsGoal | null;
  onSaved: () => void;
}) {
  const [target, setTarget] = useState(initial ? String(initial.targetAmount) : "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/savings", {
        method: "POST",
        body: JSON.stringify({ month, targetAmount: Number(target), notes: notes.trim() }),
      });
      toast(initial ? "Goal updated 🎯" : "Goal set 🎯");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
        🐷 {initial ? "Update savings goal" : "Set savings goal"}
      </h2>
      <div>
        <label className="label" htmlFor="goal-amount">Target to save this month</label>
        <input
          id="goal-amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          required
          placeholder="e.g. 5000"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="goal-notes">Notes</label>
        <input
          id="goal-notes"
          type="text"
          placeholder="e.g. Emergency fund"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input"
        />
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? "Saving…" : "Save goal"}
      </button>
    </form>
  );
}