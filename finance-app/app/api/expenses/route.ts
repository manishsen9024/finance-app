import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
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
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const month = req.nextUrl.searchParams.get("month") ?? undefined;
  if (month && month === currentMonth()) {
    await syncFixedExpensesForMonth(user.id, month);
  }
  const list = await getExpenses(user.id, month);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = ExpenseInput.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid expense entry" }, { status: 400 });
  }
  const row = await addExpense(user.id, body.data);
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const ok = await deleteExpense(user.id, id);
  return NextResponse.json({ ok });
}
