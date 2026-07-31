import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE,
  USER_COOKIE,
  findUserByUsername,
  sha256Hex,
  userSessionToken,
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const MAX_AGE = 60 * 60 * 24 * 30;

const RegisterInput = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "letters, numbers and underscores only"),
  password: z.string().min(4).max(200),
});

export async function POST(req: NextRequest) {
  const body = RegisterInput.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json(
      {
        error:
          "Invalid details — username: 3+ characters (letters, numbers, underscores); password: 4+ characters",
      },
      { status: 400 }
    );
  }

  const username = body.data.username.toLowerCase();
  const existing = await findUserByUsername(username);
  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const passwordHash = await sha256Hex(body.data.password);
  const { data, error } = await supabase()
    .from("users")
    .insert({ username, password_hash: passwordHash })
    .select("id, username, password_hash")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const user = {
    id: String(data.id),
    username: String(data.username ?? ""),
    passwordHash: String(data.password_hash ?? ""),
  };
  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(SESSION_COOKIE, await userSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  res.cookies.set(USER_COOKIE, username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}
