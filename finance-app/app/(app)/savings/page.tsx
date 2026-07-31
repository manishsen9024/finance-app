"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import GoalForm from "@/components/forms/GoalForm";
import SavingsGauge from "@/components/charts/SavingsGauge";
import { useSummary } from "@/hooks/useSummary";
import { currentMonth, monthLabel } from "@/lib/calculations";
import { money } from "@/lib/format";
import type { SavingsGoal } from "@/lib/types";

export default function SavingsPage() {
  const [month, setMonth] = useState(currentMonth());
  const { summary, loading, error, refresh } = useSummary(month);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("data-changed", handler);
    return () => window.removeEventListener("data-changed", handler);
  }, [refresh]);

  return (
    <>
      <PageHeader
        title="Savings"
        subtitle={monthLabel(month)}
        month={month}
        onMonthChange={setMonth}
        emoji="🐷"
      />

      {loading && <p className="py-16 text-center text-sm text-slate-400">Loading…</p>}
      {error && <p className="py-16 text-center text-sm text-red-500">{error}</p>}

      {summary && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-5 text-white shadow-xl shadow-emerald-600/25">
            <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-12 -left-6 h-36 w-36 rounded-full bg-white/10" />
            <p className="text-xs font-semibold text-white/70">This month</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">
              🐷 {money(summary.savings.saved, summary.profile.currency)} saved
            </p>
            <p className="mt-1 text-xs font-medium text-white/80">
              of {money(summary.savings.target, summary.profile.currency)} goal ·{" "}
              {Math.round(summary.savings.pct)}%
            </p>
          </div>

          <div className="card">
            <SavingsGauge
              saved={summary.savings.saved}
              target={summary.savings.target}
              pct={summary.savings.pct}
              status={summary.savings.status}
              currency={summary.profile.currency}
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="tile p-3 text-center">
              <span className="text-xl">💵</span>
              <p className="text-[11px] font-bold text-slate-400">In</p>
              <p className="text-sm font-extrabold text-emerald-600">
                {money(summary.totalIncome, summary.profile.currency)}
              </p>
            </div>
            <div className="tile p-3 text-center">
              <span className="text-xl">💸</span>
              <p className="text-[11px] font-bold text-slate-400">Out</p>
              <p className="text-sm font-extrabold text-rose-600">
                {money(summary.totalExpense, summary.profile.currency)}
              </p>
            </div>
            <div className="tile p-3 text-center">
              <span className="text-xl">🎯</span>
              <p className="text-[11px] font-bold text-slate-400">Saved</p>
              <p className="text-sm font-extrabold text-indigo-600">
                {money(summary.savings.saved, summary.profile.currency)}
              </p>
            </div>
          </div>

          <GoalForm
            month={month}
            initial={(summary.savings.goal as SavingsGoal) ?? null}
            onSaved={refresh}
          />
        </div>
      )}
    </>
  );
}