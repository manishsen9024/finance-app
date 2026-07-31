"use client";

import { addMonths, format, parse } from "date-fns";

export default function MonthPicker({
  month,
  onChange,
}: {
  month: string;
  onChange: (month: string) => void;
}) {
  const shift = (delta: number) => {
    const parsed = parse(month, "yyyy-MM", new Date());
    onChange(format(addMonths(parsed, delta), "yyyy-MM"));
  };
  const isCurrent = month === format(new Date(), "yyyy-MM");

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/85 p-1 shadow-sm backdrop-blur">
      <button
        onClick={() => shift(-1)}
        aria-label="Previous month"
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-500 transition hover:bg-slate-100 active:scale-90"
      >
        ‹
      </button>
      <input
        type="month"
        value={month}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="h-8 w-32 rounded-full bg-transparent text-center text-xs font-bold text-slate-700"
      />
      <button
        onClick={() => shift(1)}
        aria-label="Next month"
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-500 transition hover:bg-slate-100 active:scale-90"
      >
        ›
      </button>
      {!isCurrent && (
        <button
          onClick={() => onChange(format(new Date(), "yyyy-MM"))}
          className="h-8 rounded-full bg-indigo-600 px-3 text-xs font-bold text-white active:scale-90"
        >
          Today
        </button>
      )}
    </div>
  );
}