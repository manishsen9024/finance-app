import { DEFAULT_CATEGORIES } from "./constants";
import { supabase } from "./supabase";
import { daysInMonth } from "./calculations";
import type {
  Category,
  ExpenseRow,
  FixedExpense,
  IncomeRow,
  Profile,
  SavingsGoal,
} from "./types";

function toNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toDate(value: unknown): string {
  return String(value ?? "").slice(0, 10);
}

// ---------------- Profile ----------------

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase()
    .from("profile")
    .select("name, currency, base_monthly_salary")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return { name: "", currency: "INR", baseMonthlySalary: 0 };
  return {
    name: data.name ?? "",
    currency: data.currency || "INR",
    baseMonthlySalary: toNum(data.base_monthly_salary),
  };
}

export async function setProfile(
  userId: string,
  profile: Partial<Profile>
): Promise<Profile> {
  const current = await getProfile(userId);
  const next = { ...current, ...profile };
  const { error } = await supabase()
    .from("profile")
    .upsert(
      {
        user_id: userId,
        name: next.name,
        currency: next.currency,
        base_monthly_salary: next.baseMonthlySalary,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  if (error) throw new Error(error.message);
  return next;
}

// ---------------- Income ----------------

export async function getIncome(
  userId: string,
  month?: string
): Promise<IncomeRow[]> {
  let query = supabase()
    .from("income")
    .select("id, date, type, source, amount, notes")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (month) {
    const start = `${month}-01`;
    const end = `${month}-31`;
    query = query.gte("date", start).lte("date", end);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: toNum(r.id),
    date: toDate(r.date),
    type: (r.type === "Extra" ? "Extra" : "Salary") as IncomeRow["type"],
    source: r.source ?? "",
    amount: toNum(r.amount),
    notes: r.notes ?? "",
  }));
}

export async function addIncome(
  userId: string,
  input: Omit<IncomeRow, "id">
): Promise<IncomeRow> {
  const { data, error } = await supabase()
    .from("income")
    .insert({
      user_id: userId,
      date: input.date,
      type: input.type,
      source: input.source,
      amount: input.amount,
      notes: input.notes ?? "",
    })
    .select("id, date, type, source, amount, notes")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: toNum(data.id),
    date: toDate(data.date),
    type: (data.type === "Extra" ? "Extra" : "Salary") as IncomeRow["type"],
    source: data.source ?? "",
    amount: toNum(data.amount),
    notes: data.notes ?? "",
  };
}

export async function deleteIncome(
  userId: string,
  id: number
): Promise<boolean> {
  const { error, count } = await supabase()
    .from("income")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

// ---------------- Expenses ----------------

export async function getExpenses(
  userId: string,
  month?: string
): Promise<ExpenseRow[]> {
  let query = supabase()
    .from("expenses")
    .select("id, date, category, description, amount, type")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (month) {
    const start = `${month}-01`;
    const end = `${month}-31`;
    query = query.gte("date", start).lte("date", end);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: toNum(r.id),
    date: toDate(r.date),
    category: r.category ?? "",
    description: r.description ?? "",
    amount: toNum(r.amount),
    type: (r.type === "Fixed" ? "Fixed" : "Variable") as ExpenseRow["type"],
  }));
}

export async function addExpense(
  userId: string,
  input: Omit<ExpenseRow, "id">
): Promise<ExpenseRow> {
  const { data, error } = await supabase()
    .from("expenses")
    .insert({
      user_id: userId,
      date: input.date,
      category: input.category,
      description: input.description,
      amount: input.amount,
      type: input.type,
    })
    .select("id, date, category, description, amount, type")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: toNum(data.id),
    date: toDate(data.date),
    category: data.category ?? "",
    description: data.description ?? "",
    amount: toNum(data.amount),
    type: (data.type === "Fixed" ? "Fixed" : "Variable") as ExpenseRow["type"],
  };
}

export async function deleteExpense(
  userId: string,
  id: number
): Promise<boolean> {
  const { error, count } = await supabase()
    .from("expenses")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

// ---------------- Categories ----------------

export async function getCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase()
    .from("categories")
    .select("name, monthly_budget")
    .eq("user_id", userId)
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  let list = (data ?? [])
    .map((r) => ({
      name: String(r.name ?? ""),
      monthlyBudget: r.monthly_budget === null ? null : toNum(r.monthly_budget),
    }))
    .filter((c) => c.name);
  if (list.length === 0) {
    for (const name of DEFAULT_CATEGORIES) {
      await addCategory(userId, { name, monthlyBudget: null });
    }
    const { data: seeded } = await supabase()
      .from("categories")
      .select("name, monthly_budget")
      .eq("user_id", userId)
      .order("name", { ascending: true });
    list = (seeded ?? [])
      .map((r) => ({
        name: String(r.name ?? ""),
        monthlyBudget: r.monthly_budget === null ? null : toNum(r.monthly_budget),
      }))
      .filter((c) => c.name);
  }
  return list;
}

export async function addCategory(
  userId: string,
  input: {
    name: string;
    monthlyBudget: number | null;
  }
): Promise<Category> {
  const { error } = await supabase()
    .from("categories")
    .upsert(
      { user_id: userId, name: input.name, monthly_budget: input.monthlyBudget },
      { onConflict: "user_id,name" }
    );
  if (error) throw new Error(error.message);
  return { name: input.name, monthlyBudget: input.monthlyBudget };
}

// ---------------- Savings goals ----------------

export async function getSavingsGoal(
  userId: string,
  month: string
): Promise<SavingsGoal | null> {
  const { data, error } = await supabase()
    .from("savings_goals")
    .select("month, target_amount, notes")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    month,
    targetAmount: toNum(data.target_amount),
    notes: data.notes ?? "",
  };
}

export async function setSavingsGoal(
  userId: string,
  goal: {
    month: string;
    targetAmount: number;
    notes?: string;
  }
): Promise<SavingsGoal> {
  const { error } = await supabase()
    .from("savings_goals")
    .upsert(
      {
        user_id: userId,
        month: goal.month,
        target_amount: goal.targetAmount,
        notes: goal.notes ?? "",
      },
      { onConflict: "user_id,month" }
    );
  if (error) throw new Error(error.message);
  return { month: goal.month, targetAmount: goal.targetAmount, notes: goal.notes ?? "" };
}

// ---------------- Fixed expenses ----------------

export async function getFixedExpenses(
  userId: string
): Promise<FixedExpense[]> {
  const { data, error } = await supabase()
    .from("fixed_expenses")
    .select("id, name, amount, due_day, category, active")
    .eq("user_id", userId)
    .order("due_day", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? [])
    .map((r) => ({
      id: toNum(r.id),
      name: r.name ?? "",
      amount: toNum(r.amount),
      dueDay: Math.max(1, Math.min(31, Math.round(toNum(r.due_day) || 1))),
      category: r.category ?? "",
      active: r.active !== false,
    }))
    .filter((f) => f.name);
}

export async function addFixedExpense(
  userId: string,
  input: Omit<FixedExpense, "id">
): Promise<FixedExpense> {
  const { data, error } = await supabase()
    .from("fixed_expenses")
    .insert({
      user_id: userId,
      name: input.name,
      amount: input.amount,
      due_day: input.dueDay,
      category: input.category,
      active: input.active,
    })
    .select("id, name, amount, due_day, category, active")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: toNum(data.id),
    name: data.name ?? "",
    amount: toNum(data.amount),
    dueDay: Math.max(1, Math.min(31, Math.round(toNum(data.due_day) || 1))),
    category: data.category ?? "",
    active: data.active !== false,
  };
}

export async function deleteFixedExpense(
  userId: string,
  id: number
): Promise<boolean> {
  const { error, count } = await supabase()
    .from("fixed_expenses")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

// ---------------- Fixed → monthly sync ----------------

export async function syncFixedExpensesForMonth(
  userId: string,
  month: string
): Promise<number> {
  const fixed = await getFixedExpenses(userId);
  const active = fixed.filter((f) => f.active);
  if (active.length === 0) return 0;
  const expenses = await getExpenses(userId, month);
  const existing = new Set(expenses.map((e) => `${e.category}::${e.description}`));
  let added = 0;
  for (const f of active) {
    const key = `${f.category}::${f.name}`;
    if (existing.has(key)) continue;
    const day = Math.min(f.dueDay, daysInMonth(month));
    await addExpense(userId, {
      date: `${month}-${String(day).padStart(2, "0")}`,
      category: f.category,
      description: f.name,
      amount: f.amount,
      type: "Fixed",
    });
    added += 1;
  }
  return added;
}
