import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { format, subMonths } from "date-fns";
import {
  addCategory,
  addExpense,
  addFixedExpense,
  addIncome,
  getExpenses,
  getIncome,
  setProfile,
  setSavingsGoal,
  syncFixedExpensesForMonth,
} from "../lib/db";
import { currentMonth, daysInMonth } from "../lib/calculations";

const EXPENSE_PATTERNS: Array<[number, string, string, number]> = [
  [1, "Bills", "Rent", 6000],
  [3, "Food", "Groceries", 420],
  [5, "Subscriptions", "Netflix", 199],
  [7, "Food", "Dinner out", 480],
  [9, "Transport", "Fuel", 350],
  [12, "Shopping", "New clothes", 950],
  [14, "Bills", "Electricity", 880],
  [16, "Food", "Groceries", 410],
  [19, "Entertainment", "Movie night", 300],
  [22, "Transport", "Metro pass", 200],
  [25, "Food", "Brunch", 380],
  [27, "Subscriptions", "Spotify", 119],
];

async function main() {
  console.log("Seeding…");

  await setProfile({ name: "Me", currency: "INR", baseMonthlySalary: 15000 });
  console.log("Profile set: Me / INR / 15000");

  const existingIncome = await getIncome();
  if (existingIncome.length === 0) {
    for (let i = 2; i >= 0; i--) {
      const m = format(subMonths(new Date(), i), "yyyy-MM");
      await addIncome({ date: `${m}-01`, type: "Salary", source: "Monthly salary", amount: 15000, notes: "" });
      if (i === 1) {
        await addIncome({ date: `${m}-12`, type: "Extra", source: "Freelance design", amount: 3000, notes: "One-off project" });
      }
      if (i === 0) {
        await addIncome({ date: `${m}-05`, type: "Extra", source: "Cashback refund", amount: 800, notes: "" });
      }
    }
    console.log("Seeded income for the last 3 months");
  } else {
    console.log("Income already present, skipping");
  }

  const existingExpenses = await getExpenses();
  if (existingExpenses.length === 0) {
    for (let i = 2; i >= 0; i--) {
      const m = format(subMonths(new Date(), i), "yyyy-MM");
      const maxDay = daysInMonth(m);
      for (const [day, category, description, amount] of EXPENSE_PATTERNS) {
        if (day > maxDay) continue;
        if (i === 0 && day > new Date().getDate()) continue;
        await addExpense({
          date: `${m}-${String(day).padStart(2, "0")}`,
          category,
          description,
          amount,
          type: category === "Bills" || category === "Subscriptions" || category === "Rent" ? "Fixed" : "Variable",
        });
      }
    }
    console.log("Seeded expenses for the last 3 months");
  } else {
    console.log("Expenses already present, skipping");
  }

  const categories = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Rent", "Subscriptions"];
  const budgets: Array<[string, number]> = [
    ["Food", 5000],
    ["Transport", 1500],
    ["Entertainment", 1000],
    ["Bills", 2500],
    ["Shopping", 2000],
    ["Rent", 6000],
    ["Subscriptions", 500],
  ];
  for (const name of categories) await addCategory({ name, monthlyBudget: budgets.find(([n]) => n === name)?.[1] ?? null });
  console.log("Categories seeded");

  for (let i = 2; i >= 0; i--) {
    const m = format(subMonths(new Date(), i), "yyyy-MM");
    await setSavingsGoal({ month: m, targetAmount: 5000, notes: "Emergency fund" });
  }
  console.log("Savings goals seeded");

  await addFixedExpense({ name: "Rent", amount: 6000, dueDay: 1, category: "Rent", active: true });
  await addFixedExpense({ name: "Netflix", amount: 199, dueDay: 5, category: "Subscriptions", active: true });
  await addFixedExpense({ name: "Spotify", amount: 119, dueDay: 10, category: "Subscriptions", active: true });
  await addFixedExpense({ name: "Electricity", amount: 880, dueDay: 15, category: "Bills", active: true });
  console.log("Fixed expenses seeded");

  const added = await syncFixedExpensesForMonth(currentMonth());
  console.log(`Synced ${added} fixed expenses into the current month`);

  const income = await getIncome();
  const expenses = await getExpenses();
  const incomeTotal = income.reduce((a, r) => a + r.amount, 0);
  const expenseTotal = expenses.reduce((a, r) => a + r.amount, 0);
  console.log(
    `Done. ${income.length} income rows (${incomeTotal}), ${expenses.length} expense rows (${expenseTotal})`
  );
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
