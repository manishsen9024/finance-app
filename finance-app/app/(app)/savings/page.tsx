"use client";

import { useState } from "react";
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

  return (
    <>
      <PageHeader title="Savings" subtitle={monthLabel(month)} month={month} onMonthChange={setMonth} />

      {loading && <p className="py-16 text-center text-sm text-slate-400">Loading…</p>}
      {error && <p className="py-16 text-center text-sm text-red-500">{error}</p>}

      {summary && (
        <div className="space-y-4">
          <div className="card">
            <SavingsGauge
              saved={summary.savings.saved}
              target={summary.savings.target}
              pct={summary.savings.pct}
              status={summary.savings.status}
              currency={summary.profile.currency}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-[11px] font-medium text-slate-400">In</p>
              <p className="text-sm font-bold text-green-600">
                {money(summary.totalIncome, summary.profile.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-[11px] font-medium text-slate-400">Out</p>
              <p className="text-sm font-bold text-red-600">
                {money(summary.totalExpense, summary.profile.currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-[11px] font-medium text-slate-400">Saved</p>
              <p className="text-sm font-bold text-indigo-600">
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
