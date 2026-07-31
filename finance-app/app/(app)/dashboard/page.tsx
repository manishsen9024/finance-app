"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import SummaryCards from "@/components/SummaryCards";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import DailyTrendChart from "@/components/charts/DailyTrendChart";
import SavingsGauge from "@/components/charts/SavingsGauge";
import { useSummary } from "@/hooks/useSummary";
import { currentMonth, monthLabel } from "@/lib/calculations";
import { money } from "@/lib/format";

export default function DashboardPage() {
  const [month, setMonth] = useState(currentMonth());
  const { summary, loading, error } = useSummary(month);

  return (
    <>
      <PageHeader title="Overview" subtitle={monthLabel(month)} month={month} onMonthChange={setMonth} />

      {loading && <p className="py-16 text-center text-sm text-slate-400">Loading…</p>}
      {error && <p className="py-16 text-center text-sm text-red-500">{error}</p>}

      {summary && (
        <div className="space-y-4">
          <SummaryCards summary={summary} />

          <div className="card">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Savings goal</h2>
              <span className="text-xs text-slate-400">{monthLabel(month)}</span>
            </div>
            <SavingsGauge
              saved={summary.savings.saved}
              target={summary.savings.target}
              pct={summary.savings.pct}
              status={summary.savings.status}
              currency={summary.profile.currency}
            />
          </div>

          <div className="card">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">
              Income vs expenses
            </h2>
            <MonthlyBarChart data={summary.series} currency={summary.profile.currency} />
          </div>

          <div className="card">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">
              Daily spend · {monthLabel(month)}
            </h2>
            <DailyTrendChart data={summary.daily} currency={summary.profile.currency} />
          </div>

          <div className="card">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">
              Where it went
            </h2>
            {summary.categories.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No expenses yet this month</p>
            ) : (
              <>
                <CategoryPieChart data={summary.categories} currency={summary.profile.currency} />
                <ul className="mt-3 space-y-2.5">
                  {summary.categories.map((cat) => {
                    const over = cat.budget !== null && cat.amount > cat.budget;
                    const barPct = cat.budget && cat.budget > 0 ? Math.min(100, (cat.amount / cat.budget) * 100) : 100;
                    return (
                      <li key={cat.name} className="flex items-center gap-2 text-sm">
                        <span className="w-28 truncate text-slate-600">{cat.name}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              over ? "bg-red-500" : "bg-indigo-500"
                            }`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                        <span className={`w-24 text-right font-semibold ${over ? "text-red-500" : "text-slate-700"}`}>
                          {money(cat.amount, summary.profile.currency)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
