import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { getSavingsGoal, setSavingsGoal } from "@/lib/db";

const GoalInput = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  targetAmount: z.number().min(0),
  notes: z.string().max(300).optional().default(""),
});

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const month = req.nextUrl.searchParams.get("month");
  if (!month) return NextResponse.json({ error: "Missing month" }, { status: 400 });
  const goal = await getSavingsGoal(month);
  return NextResponse.json(goal ?? { goal: null });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = GoalInput.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid goal" }, { status: 400 });
  }
  const goal = await setSavingsGoal(body.data);
  return NextResponse.json(goal, { status: 201 });
}
