"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import AddIncomeForm from "@/components/forms/AddIncomeForm";
import { api } from "@/lib/api";
import { currentMonth, monthLabel } from "@/lib/calculations";
import { money } from "@/lib/format";
import type { IncomeRow, Profile } from "@/lib/types";

export default function IncomePage() {
  const [month, setMonth] = useState(currentMonth());
  const [rows, setRows] = useState<IncomeRow[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [income, prof] = await Promise.all([
          api<IncomeRow[]>(`/api/income?month=${month}`),
          api<Profile>("/api/profile"),
        ]);
        if (cancelled) return;
        setRows(income.sort((a, b) => b.date.localeCompare(a.date)));
        setProfile(prof);
      } finally {
        if (!cancelled) setLoadedFor(month);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [month, tick]);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("data-changed", handler);
    return () => window.removeEventListener("data-changed", handler);
  }, []);

  const loading = loadedFor !== month;
  const load = () => setTick((t) => t + 1);

  const remove = async (id: number) => {
    if (!window.confirm("Delete this income entry?")) return;
    await api(`/api/income?id=${id}`, { method: "DELETE" });
    load();
  };

  const total = rows.reduce((acc, r) => acc + r.amount, 0);

  return (
    <>
      <PageHeader
        title="Income"
        subtitle={monthLabel(month)}
        month={month}
        onMonthChange={setMonth}
        emoji="💰"
      />

      <div className="space-y-4">
        <AddIncomeForm profile={profile ?? undefined} onAdded={load} />

        <div className="card">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">📋 Entries</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
              {money(total, profile?.currency)}
            </span>
          </div>
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No income recorded this month</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-lg shadow-sm">
                    {r.type === "Salary" ? "💼" : "✨"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{r.source}</p>
                    <p className="text-xs text-slate-400">
                      {r.date} {r.type === "Extra" ? "· Extra" : ""}
                      {r.notes ? ` · ${r.notes}` : ""}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    +{money(r.amount, profile?.currency)}
                  </span>
                  <button
                    onClick={() => remove(r.id)}
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
      </div>
    </>
  );
}