"use client";

import { money } from "@/lib/format";
import type { SavingsStatus } from "@/lib/types";

const STATUS: Record<SavingsStatus, { label: string; emoji: string; color: string; hint: string }> = {
  "no-goal": { label: "No goal", emoji: "🎯", color: "#94a3b8", hint: "Set a savings target for this month" },
  exceeded: { label: "Goal exceeded!", emoji: "🎉", color: "#22c55e", hint: "You beat your savings target 🎉" },
  "on-track": { label: "On track", emoji: "✅", color: "#22c55e", hint: "Your savings pace meets the goal" },
  "at-risk": { label: "At risk", emoji: "⚠️", color: "#f59e0b", hint: "Spending pace may miss the goal" },
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
  const { label, emoji, color, hint } = STATUS[status];
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r={radius} fill="none" strokeWidth="16" className="stroke-slate-200" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="16"
            strokeLinecap="round"
            stroke={status === "no-goal" ? color : "url(#gaugeGrad)"}
            strokeDasharray={`${dash} ${circumference - dash}`}
            transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.22, 0.68, 0.36, 1)" }}
          />
          <text x="100" y="94" textAnchor="middle" className="fill-slate-900 text-4xl font-extrabold">
            {Math.round(pct)}%
          </text>
          <text x="100" y="120" textAnchor="middle" className="fill-slate-500 text-sm font-semibold">
            {emoji} {label}
          </text>
        </svg>
      </div>
      <p className="text-sm font-bold text-slate-700">
        {money(saved, currency)}{" "}
        <span className="font-normal text-slate-400">of {money(target, currency)} saved</span>
      </p>
      <p className="text-center text-xs text-slate-500">{hint}</p>
    </div>
  );
}