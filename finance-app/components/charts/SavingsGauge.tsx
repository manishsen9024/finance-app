"use client";

import { money } from "@/lib/format";
import type { SavingsStatus } from "@/lib/types";

const STATUS: Record<SavingsStatus, { label: string; color: string; hint: string }> = {
  "no-goal": { label: "No goal", color: "#94a3b8", hint: "Set a savings target for this month" },
  exceeded: { label: "Goal exceeded!", color: "#22c55e", hint: "You beat your savings target" },
  "on-track": { label: "On track", color: "#22c55e", hint: "Your savings pace meets the goal" },
  "at-risk": { label: "At risk", color: "#f59e0b", hint: "Spending pace may miss the goal" },
};

export default function SavingsGauge({
  saved,
  target,
  pct,
  status,
  currency,
}: {
  saved: number;
  target: number;
  pct: number;
  status: SavingsStatus;
  currency: string;
}) {
  const { label, color, hint } = STATUS[status];
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="190" height="190" viewBox="0 0 190 190">
          <circle
            cx="95"
            cy="95"
            r={radius}
            fill="none"
            strokeWidth="14"
            className="stroke-slate-200"
          />
          <circle
            cx="95"
            cy="95"
            r={radius}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            stroke={color}
            strokeDasharray={`${dash} ${circumference - dash}`}
            transform="rotate(-90 95 95)"
          />
          <text
            x="95"
            y="90"
            textAnchor="middle"
            className="fill-slate-900 text-3xl font-bold"
          >
            {Math.round(pct)}%
          </text>
          <text
            x="95"
            y="112"
            textAnchor="middle"
            className="fill-slate-500 text-xs"
          >
            {label}
          </text>
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-700">
        {money(saved, currency)}{" "}
        <span className="font-normal text-slate-400">of {money(target, currency)} saved</span>
      </p>
      <p className="text-center text-xs text-slate-500">{hint}</p>
    </div>
  );
}
