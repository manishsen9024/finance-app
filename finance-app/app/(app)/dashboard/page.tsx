"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import SummaryCards from "@/components/SummaryCards";
import AnimatedNumber from "@/components/AnimatedNumber";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import DailyTrendChart from "@/components/charts/DailyTrendChart";
import SavingsGauge from "@/components/charts/SavingsGauge";
import { useSummary } from "@/hooks/useSummary";
import { currentMonth, monthLabel } from "@/lib/calculations";
import { categoryEmoji } from "@/lib/constants";
import { money } from "@/lib/format";

export default function DashboardPage() {
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
        title="Dashboard"
        subtitle={monthLabel(month)}
        month={month}
        onMonthChange={setMonth}
        emoji="🏠"
      />

      {loading && <p className="py-16 text-center text-sm text-slate-400">Loading…</p>}
      {error && <p className="py-16 text-center text-sm text-red-500">{error}</p>}

      {summary && (
        <div className="space-y-4">
          <div className="relative animate-fade-up overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-xl shadow-indigo-600/25">
            <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-12 -left-6 h-36 w-36 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute right-10 top-8 h-4 w-4 rounded-full bg-white/20" />
            <p className="text-xs font-semibold text-white/70">
              Net saved · {monthLabel(month)}
            </p>
            <AnimatedNumber
              value={summary.netSaved}
              currency={summary.profile.currency}
              className="mt-1 block text-3xl font-extrabold tracking-tight"
            />
            <div className="mt-3 flex gap-4 text-xs font-medium text-white/85">
              <span>💵 In {money(summary.totalIncome, summary.profile.currency)}</span>
              <span>💸 Out {money(summary.totalExpense, summary.profile.currency)}</span>
            </div>
          </div>

          <SummaryCards summary={summary} />

          <div className="card">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">🐷 Savings goal</h2>
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
            <h2 className="mb-2 text-sm font-bold text-slate-800">📊 Income vs expenses</h2>
            <MonthlyBarChart data={summary.series} currency={summary.profile.currency} />
          </div>

          <div className="card">
            <h2 className="mb-2 text-sm font-bold text-slate-800">
              📈 Daily spend · {monthLabel(month)}
            </h2>
            <DailyTrendChart data={summary.daily} currency={summary.profile.currency} />
          </div>

          <div className="card">
            <h2 className="mb-2 text-sm font-bold text-slate-800">🍕 Where it went</h2>
            {summary.categories.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No expenses yet this month</p>
            ) : (
              <>
                <CategoryPieChart data={summary.categories} currency={summary.profile.currency} />
                <ul className="mt-3 space-y-2.5">
                  {summary.categories.map((cat) => {
                    const over = cat.budget !== null && cat.amount > cat.budget;
                    const barPct =
                      cat.budget && cat.budget > 0
                        ? Math.min(100, (cat.amount / cat.budget) * 100)
                        : 100;
                    return (
                      <li key={cat.name} className="flex items-center gap-2 text-sm">
                        <span className="flex w-6 justify-center text-base">
                          {categoryEmoji(cat.name)}
                        </span>
                        <span className="w-20 truncate text-slate-600">{cat.name}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              over
                                ? "bg-gradient-to-r from-rose-500 to-red-500"
                                : "bg-gradient-to-r from-indigo-500 to-violet-500"
                            }`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                        <span
                          className={`w-24 text-right font-semibold ${
                            over ? "text-red-500" : "text-slate-700"
                          }`}
                        >
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