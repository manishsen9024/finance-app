"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import SummaryCards from "@/components/SummaryCards";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import { useSummary } from "@/hooks/useSummary";
import { currentMonth, monthLabel } from "@/lib/calculations";
import { categoryEmoji } from "@/lib/constants";
import { money } from "@/lib/format";

export default function ReportsPage() {
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
        title="Reports"
        subtitle={monthLabel(month)}
        month={month}
        onMonthChange={setMonth}
        emoji="📊"
      />

      {loading && <p className="py-16 text-center text-sm text-slate-400">Loading…</p>}
      {error && <p className="py-16 text-center text-sm text-red-500">{error}</p>}

      {summary && (
        <div className="space-y-4">
          <SummaryCards summary={summary} />

          <div className="card">
            <h2 className="mb-2 text-sm font-bold text-slate-800">📆 Last 6 months</h2>
            <MonthlyBarChart data={summary.series} currency={summary.profile.currency} />
          </div>

          <div className="card">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">🗂️ Category breakdown</h2>
              <span className="text-xs text-slate-400">{monthLabel(month)}</span>
            </div>
            {summary.categories.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No expenses this month</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {summary.categories.map((cat) => {
                  const over = cat.budget !== null && cat.amount > cat.budget;
                  return (
                    <li key={cat.name} className="flex items-center justify-between py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 truncate text-sm font-medium text-slate-800">
                          <span className="text-base">{categoryEmoji(cat.name)}</span>
                          {cat.name}
                          <span className="text-xs text-slate-400">{cat.pct.toFixed(0)}%</span>
                        </p>
                        {cat.budget !== null && (
                          <p className={`pl-7 text-xs ${over ? "font-medium text-red-500" : "text-slate-400"}`}>
                            {over ? "Over budget · " : "Budget "}
                            {money(cat.budget, summary.profile.currency)}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {money(cat.amount, summary.profile.currency)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="card">
            <h2 className="mb-2 text-sm font-bold text-slate-800">🧮 Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 text-slate-400">💼 Salary</dt>
                <dd className="font-semibold text-emerald-600">
                  {money(summary.salary, summary.profile.currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 text-slate-400">✨ Extra income</dt>
                <dd className="font-semibold text-emerald-600">
                  {money(summary.extra, summary.profile.currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 text-slate-400">🔁 Fixed expenses</dt>
                <dd className="font-semibold text-rose-600">
                  {money(summary.fixed, summary.profile.currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 text-slate-400">🎯 Variable expenses</dt>
                <dd className="font-semibold text-rose-600">
                  {money(summary.variable, summary.profile.currency)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <dt className="flex items-center gap-2 font-medium text-slate-600">🐷 Net saved</dt>
                <dd
                  className={`font-bold ${
                    summary.netSaved >= 0 ? "text-indigo-600" : "text-red-600"
                  }`}
                >
                  {money(summary.netSaved, summary.profile.currency)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </>
  );
}