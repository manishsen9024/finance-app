"use client";

import { money } from "@/lib/format";
import type { Summary } from "@/lib/types";

export default function SummaryCards({ summary }: { summary: Summary }) {
  const { profile, totalIncome, totalExpense, netSaved } = summary;
  const c = profile.currency;

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="text-[11px] font-medium text-slate-400">Income</p>
        <p className="mt-0.5 truncate text-base font-bold text-green-600">
          {money(totalIncome, c)}
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="text-[11px] font-medium text-slate-400">Spent</p>
        <p className="mt-0.5 truncate text-base font-bold text-red-600">
          {money(totalExpense, c)}
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="text-[11px] font-medium text-slate-400">Saved</p>
        <p
          className={`mt-0.5 truncate text-base font-bold ${
            netSaved >= 0
              ? "text-indigo-600"
              : "text-red-600"
          }`}
        >
          {money(netSaved, c)}
        </p>
      </div>
    </div>
  );
}
