import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  categoryBreakdown,
  currentMonth,
  dailySpendForMonth,
  monthlySeries,
  savingsView,
  sum,
} from "@/lib/calculations";
import {
  getCategories,
  getExpenses,
  getIncome,
  getProfile,
  getSavingsGoal,
  syncFixedExpensesForMonth,
} from "@/lib/db";
import type { Summary } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const month = req.nextUrl.searchParams.get("month") || currentMonth();
  if (month === currentMonth()) {
    await syncFixedExpensesForMonth(month);
  }

  const [profile, incomeAll, expensesAll, goal, categories] = await Promise.all([
    getProfile(),
    getIncome(),
    getExpenses(),
    getSavingsGoal(month),
    getCategories(),
  ]);

  const income = incomeAll.filter((i) => i.date.startsWith(month));
  const expenses = expensesAll.filter((e) => e.date.startsWith(month));

  const breakdown = categoryBreakdown(expenses).map((c) => ({
    ...c,
    budget: categories.find((cat) => cat.name === c.name)?.monthlyBudget ?? null,
  }));

  const summary: Summary = {
    month,
    profile,
    totalIncome: sum(income),
    totalExpense: sum(expenses),
    netSaved: sum(income) - sum(expenses),
    salary: sum(income.filter((i) => i.type === "Salary")),
    extra: sum(income.filter((i) => i.type === "Extra")),
    fixed: sum(expenses.filter((e) => e.type === "Fixed")),
    variable: sum(expenses.filter((e) => e.type === "Variable")),
    categories: breakdown,
    daily: dailySpendForMonth(expenses, month),
    savings: savingsView(income, expenses, goal, month),
    series: monthlySeries(incomeAll, expensesAll, month),
    expenseCount: expenses.length,
    incomeCount: income.length,
  };

  return NextResponse.json(summary);
}
