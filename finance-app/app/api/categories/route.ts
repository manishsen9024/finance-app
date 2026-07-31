import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { addCategory, getCategories } from "@/lib/db";

const CategoryInput = z.object({
  name: z.string().min(1).max(60),
  monthlyBudget: z.number().min(0).nullable().optional(),
});

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const list = await getCategories();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = CategoryInput.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const category = await addCategory({
    name: body.data.name,
    monthlyBudget: body.data.monthlyBudget ?? null,
  });
  return NextResponse.json(category, { status: 201 });
}
