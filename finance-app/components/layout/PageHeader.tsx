"use client";

import MonthPicker from "./MonthPicker";

export default function PageHeader({
  title,
  subtitle,
  month,
  onMonthChange,
  action,
  emoji,
}: {
  title: string;
  subtitle?: string;
  month?: string;
  onMonthChange?: (month: string) => void;
  action?: React.ReactNode;
  emoji?: string;
}) {
  return (
    <div className="mb-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {emoji && <span>{emoji}</span>}
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {month && onMonthChange ? <MonthPicker month={month} onChange={onMonthChange} /> : null}
    </div>
  );
}