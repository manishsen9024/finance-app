import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDaysInMonth,
  startOfMonth,
} from "date-fns";
import type {
  CategorySlice,
  DayPoint,
  ExpenseRow,
  IncomeRow,
  MonthPoint,
  SavingsGoal,
  SavingsStatus,
  SavingsView,
} from "./types";

export function currentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

export function monthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

export function daysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return getDaysInMonth(new Date(y, m - 1, 1));
}

export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return format(new Date(y, m - 1, 1), "MMM yyyy");
}

export function todayKey(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function sum(rows: Array<{ amount: number }>): number {
  return rows.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
}

export function lastMonths(month: string, count = 6): string[] {
  const [y, m] = month.split("-").map(Number);
  const base = new Date(y, m - 1, 1);
  return Array.from({ length: count }, (_, i) => monthKey(addMonths(base, i - (count - 1))));
}

export function categoryBreakdown(expenses: ExpenseRow[]): CategorySlice[] {
  const map = new Map<string, number>();
  for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  const total = sum(expenses);
  return Array.from(map.entries())
    .map(([name, amount]) => ({
      name,
      amount,
      budget: null,
      pct: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function dailySpendForMonth(expenses: ExpenseRow[], month: string): DayPoint[] {
  const [y, m] = month.split("-").map(Number);
  const start = startOfMonth(new Date(y, m - 1, 1));
  const end = endOfMonth(new Date(y, m - 1, 1));
  const byDay = new Map<string, number>();
  for (const e of expenses) byDay.set(e.date, (byDay.get(e.date) ?? 0) + e.amount);
  return eachDayOfInterval({ start, end }).map((d) => {
    const key = format(d, "yyyy-MM-dd");
    return { day: d.getDate(), label: format(d, "d"), amount: byDay.get(key) ?? 0 };
  });
}

export function monthlySeries(
  income: IncomeRow[],
  expenses: ExpenseRow[],
  month: string,
  count = 6
): MonthPoint[] {
  return lastMonths(month, count).map((m) => {
    const inc = sum(income.filter((i) => i.date.startsWith(m)));
    const exp = sum(expenses.filter((e) => e.date.startsWith(m)));
    return { month: m, label: monthLabel(m), income: inc, expense: exp, net: inc - exp };
  });
}

export function savingsView(
  income: IncomeRow[],
  expenses: ExpenseRow[],
  goal: SavingsGoal | null,
  month: string
): SavingsView {
  const saved = sum(income) - sum(expenses);
  const target = goal?.targetAmount ?? 0;
  const pct = target > 0 ? (saved / target) * 100 : 0;
  let status: SavingsStatus = "no-goal";
  if (goal && target > 0) {
    if (saved >= target) status = "exceeded";
    else {
      const totalDays = daysInMonth(month);
      const elapsed = Math.min(new Date().getDate(), totalDays);
      const elapsedRatio = elapsed / totalDays;
      const progressRatio = Math.max(0, saved) / target;
      status = progressRatio >= elapsedRatio ? "on-track" : "at-risk";
    }
  }
  return { goal: goal ?? null, saved, target, pct, status };
}
