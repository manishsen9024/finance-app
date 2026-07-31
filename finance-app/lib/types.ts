export interface Profile {
  name: string;
  currency: string;
  baseMonthlySalary: number;
}

export type IncomeType = "Salary" | "Extra";
export type ExpenseType = "Fixed" | "Variable";

export interface IncomeRow {
  id: number;
  date: string; // YYYY-MM-DD
  type: IncomeType;
  source: string;
  amount: number;
  notes: string;
}

export interface ExpenseRow {
  id: number;
  date: string; // YYYY-MM-DD
  category: string;
  description: string;
  amount: number;
  type: ExpenseType;
}

export interface Category {
  name: string;
  monthlyBudget: number | null;
}

export interface SavingsGoal {
  month: string; // YYYY-MM
  targetAmount: number;
  notes: string;
}

export interface FixedExpense {
  id: number;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  active: boolean;
}

export interface CategorySlice {
  name: string;
  amount: number;
  budget: number | null;
  pct: number;
}

export interface DayPoint {
  day: number;
  label: string;
  amount: number;
}

export interface MonthPoint {
  month: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export type SavingsStatus = "no-goal" | "exceeded" | "on-track" | "at-risk";

export interface SavingsView {
  goal: SavingsGoal | null;
  saved: number;
  target: number;
  pct: number;
  status: SavingsStatus;
}

export interface Summary {
  month: string;
  profile: Profile;
  totalIncome: number;
  totalExpense: number;
  netSaved: number;
  salary: number;
  extra: number;
  fixed: number;
  variable: number;
  categories: CategorySlice[];
  daily: DayPoint[];
  savings: SavingsView;
  series: MonthPoint[];
  expenseCount: number;
  incomeCount: number;
}
