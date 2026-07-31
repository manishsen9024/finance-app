"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategorySlice } from "@/lib/types";
import { money } from "@/lib/format";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
  "#a855f7",
  "#84cc16",
  "#fb923c",
  "#e11d48",
  "#0ea5e9",
];

export default function CategoryPieChart({
  data,
  currency,
}: {
  data: CategorySlice[];
  currency: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={3}
          stroke="none"
          cornerRadius={6}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [money(Number(value ?? 0), currency), String(name)]}
          contentStyle={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 12px 32px -12px rgba(79,70,229,0.3)", fontSize: 12, fontWeight: 600 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}