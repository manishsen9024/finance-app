"use client";

import { money } from "@/lib/format";
import type { Summary } from "@/lib/types";

export default function SummaryCards({ summary }: { summary: Summary }) {
  const { profile, totalIncome, totalExpense, netSaved } = summary;
  const c = profile.currency;

  const tiles = [
    { label: "Income", emoji: "💵", value: money(totalIncome, c) },
    { label: "Spent", emoji: "💸", value: money(totalExpense, c) },
    { label: "Saved", emoji: "🐷", value: money(netSaved, c), negative: netSaved < 0 },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {tiles.map((t) => (
        <div key={t.label} className="tile p-3">
          <span className="text-xl">{t.emoji}</span>
          <p className="mt-1 text-[11px] font-bold text-slate-400">{t.label}</p>
          <p
            className={`mt-0.5 truncate text-sm font-extrabold tabular-nums ${
              t.negative ? "text-rose-600" : "text-slate-800"
            }`}
          >
            {t.value}
          </p>
        </div>
      ))}
    </div>
  );
}