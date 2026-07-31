import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  addFixedExpense,
  deleteFixedExpense,
  getFixedExpenses,
} from "@/lib/db";

const FixedInput = z.object({
  name: z.string().min(1).max(80),
  amount: z.number().positive(),
  dueDay: z.number().int().min(1).max(31),
  category: z.string().min(1).max(60),
  active: z.boolean().optional().default(true),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const list = await getFixedExpenses(user.id);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = FixedInput.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid fixed expense" }, { status: 400 });
  }
  const row = await addFixedExpense(user.id, body.data);
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const ok = await deleteFixedExpense(user.id, id);
  return NextResponse.json({ ok });
}
