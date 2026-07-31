"use client";

import MonthPicker from "./MonthPicker";

export default function PageHeader({
  title,
  subtitle,
  month,
  onMonthChange,
  action,
}: {
  title: string;
  subtitle?: string;
  month?: string;
  onMonthChange?: (month: string) => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {month && onMonthChange ? <MonthPicker month={month} onChange={onMonthChange} /> : null}
    </div>
  );
}
