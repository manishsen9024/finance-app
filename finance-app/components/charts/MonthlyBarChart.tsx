"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthPoint } from "@/lib/types";
import { compact, money } from "@/lib/format";

export default function MonthlyBarChart({
  data,
  currency,
}: {
  data: MonthPoint[];
  currency: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barCategoryGap="28%">
        <defs>
          <linearGradient id="barIn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="barOut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.25} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={46} tickFormatter={(v) => compact(Number(v))} />
        <Tooltip
          formatter={(value, name) => [money(Number(value ?? 0), currency), String(name)]}
          contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 12px 32px -12px rgba(79,70,229,0.3)", fontSize: 12, fontWeight: 600 }}
          cursor={{ fill: "rgba(99,102,241,0.08)", radius: 8 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="income" name="Income 💵" fill="url(#barIn)" radius={[8, 8, 2, 2]} maxBarSize={22} />
        <Bar dataKey="expense" name="Expense 💸" fill="url(#barOut)" radius={[8, 8, 2, 2]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}