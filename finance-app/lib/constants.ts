import type { ExpenseType, IncomeType } from "./types";

export const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Rent",
  "Subscriptions",
];

export const INCOME_TYPES = ["Salary", "Extra"] as const;
export const EXPENSE_TYPES = ["Fixed", "Variable"] as const;

export const CATEGORY_EMOJI: Record<string, string> = {
  Food: "🍔",
  Transport: "🚗",
  Entertainment: "🎬",
  Bills: "🧾",
  Shopping: "🛍️",
  Rent: "🏠",
  Subscriptions: "📺",
  Health: "💊",
  Education: "📚",
  Travel: "✈️",
  Gifts: "🎁",
  Other: "📦",
};

export const INCOME_EMOJI: Record<IncomeType, string> = {
  Salary: "💵",
  Extra: "🎉",
};

export const EXPENSE_TYPE_EMOJI: Record<ExpenseType, string> = {
  Fixed: "🔁",
  Variable: "✨",
};

export function categoryEmoji(name: string): string {
  return CATEGORY_EMOJI[name] ?? "📦";
}