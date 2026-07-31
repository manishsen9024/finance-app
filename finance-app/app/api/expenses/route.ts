import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { currentMonth } from "@/lib/calculations";
import { addExpense, deleteExpense, getExpenses, syncFixedExpensesForMonth } from "@/lib/db";

const ExpenseInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().min(1).max(60),
  description: z.string().max(200).optional().default(""),
  amount: z.number().positive(),
  type: z.enum(["Fixed", "Variable"]).default("Variable"),
});

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const month = req.nextUrl.searchParams.get("month") ?? undefined;
  if (month && month === currentMonth()) {
    await syncFixedExpensesForMonth(month);
  }
  const list = await getExpenses(month);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = ExpenseInput.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid expense entry" }, { status: 400 });
  }
  const row = await addExpense(body.data);
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const ok = await deleteExpense(id);
  return NextResponse.json({ ok });
}
