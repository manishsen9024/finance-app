"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import AddExpenseForm from "@/components/forms/AddExpenseForm";
import FixedExpenseForm from "@/components/forms/FixedExpenseForm";
import CategoryForm from "@/components/forms/CategoryForm";
import { api } from "@/lib/api";
import { currentMonth, monthLabel } from "@/lib/calculations";
import { money } from "@/lib/format";
import type { Category, ExpenseRow, FixedExpense } from "@/lib/types";

export default function ExpensesPage() {
  const [month, setMonth] = useState(currentMonth());
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fixed, setFixed] = useState<FixedExpense[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [expenses, cats, fixedList] = await Promise.all([
          api<ExpenseRow[]>(`/api/expenses?month=${month}`),
          api<Category[]>("/api/categories"),
          api<FixedExpense[]>("/api/fixed-expenses"),
        ]);
        if (cancelled) return;
        setRows(expenses.sort((a, b) => b.date.localeCompare(a.date)));
        setCategories(cats);
        setFixed(fixedList);
      } finally {
        if (!cancelled) setLoadedFor(month);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [month, tick]);

  const loading = loadedFor !== month;
  const load = () => setTick((t) => t + 1);

  const removeExpense = async (id: number) => {
    if (!window.confirm("Delete this expense?")) return;
    await api(`/api/expenses?id=${id}`, { method: "DELETE" });
    load();
  };

  const removeFixed = async (id: number) => {
    if (!window.confirm("Delete this fixed expense?")) return;
    await api(`/api/fixed-expenses?id=${id}`, { method: "DELETE" });
    load();
  };

  const total = rows.reduce((acc, r) => acc + r.amount, 0);
  const categoryNames = categories.map((c) => c.name);

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle={monthLabel(month)}
        month={month}
        onMonthChange={setMonth}
      />

      <div className="space-y-4">
        <AddExpenseForm categories={categoryNames} onAdded={load} />

        <div className="card">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Entries</h2>
            <span className="text-sm font-bold text-red-600">
              {money(total)}
            </span>
          </div>
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No expenses this month</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {r.description}
                      </p>
                      {r.type === "Fixed" && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                          Fixed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {r.date} · {r.category}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {money(r.amount)}
                  </span>
                  <button
                    onClick={() => removeExpense(r.id)}
                    aria-label="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                      <path d="M4 7h16M9 7V4h6v3m-9 0l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Fixed expenses
            </h2>
            <span className="text-xs text-slate-400">
              {fixed.filter((f) => f.active).length} active
            </span>
          </div>
          <FixedExpenseForm categories={categoryNames} onChanged={load} />
          {fixed.length > 0 && (
            <ul className="mt-3 space-y-2">
              {fixed.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      f.active ? "bg-green-500" : "bg-slate-300"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {f.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Day {f.dueDay} · {f.category}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {money(f.amount)}
                  </span>
                  <button
                    onClick={() => removeFixed(f.id)}
                    aria-label="Delete fixed expense"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                      <path d="M4 7h16M9 7V4h6v3m-9 0l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
          </div>
          <CategoryForm onAdded={load} />
          {categories.length > 0 && (
            <ul className="mt-3 space-y-2">
              {categories.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                >
                  <span className="font-medium text-slate-700">{c.name}</span>
                  <span className="text-xs text-slate-400">
                    {c.monthlyBudget !== null ? `Budget ${money(c.monthlyBudget)}` : "No budget"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
