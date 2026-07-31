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
    <div className="flex items-center gap-2">
      <button
        onClick={() => shift(-1)}
        aria-label="Previous month"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <input
        type="month"
        value={month}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="h-9 rounded-full border border-slate-200 bg-white px-2 text-sm font-medium text-slate-700"
      />
      <button
        onClick={() => shift(1)}
        aria-label="Next month"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {!isCurrent && (
        <button
          onClick={() => onChange(format(new Date(), "yyyy-MM"))}
          className="h-9 rounded-full bg-indigo-600 px-3 text-xs font-semibold text-white active:scale-95"
        >
          Today
        </button>
      )}
    </div>
  );
}
