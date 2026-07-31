"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DayPoint } from "@/lib/types";
import { compact, money } from "@/lib/format";

export default function DailyTrendChart({
  data,
  currency,
}: {
  data: DayPoint[];
  currency: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.25} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={46} tickFormatter={(v) => compact(Number(v))} />
        <Tooltip
          formatter={(value) => money(Number(value ?? 0), currency)}
          labelFormatter={(day) => `Day ${day}`}
          contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 12px 32px -12px rgba(79,70,229,0.3)", fontSize: 12, fontWeight: 600 }}
          cursor={{ stroke: "#6366f1", strokeOpacity: 0.3, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          name="Spend"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#trendFill)"
          activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}