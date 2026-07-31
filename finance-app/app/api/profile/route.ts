import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { getProfile, setProfile } from "@/lib/db";

const ProfileUpdate = z.object({
  name: z.string().max(80).optional(),
  currency: z.string().max(10).optional(),
  baseMonthlySalary: z.number().min(0).optional(),
});

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = ProfileUpdate.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
  }
  const profile = await setProfile(body.data);
  return NextResponse.json(profile);
}
