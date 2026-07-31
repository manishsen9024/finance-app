import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { addIncome, deleteIncome, getIncome } from "@/lib/db";

const IncomeInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["Salary", "Extra"]),
  source: z.string().min(1).max(80),
  amount: z.number().positive(),
  notes: z.string().max(300).optional().default(""),
});

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const month = req.nextUrl.searchParams.get("month") ?? undefined;
  const list = await getIncome(month);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = IncomeInput.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid income entry" }, { status: 400 });
  }
  const row = await addIncome(body.data);
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const ok = await deleteIncome(id);
  return NextResponse.json({ ok });
}
