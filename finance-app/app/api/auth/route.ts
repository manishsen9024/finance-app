import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  USER_COOKIE,
  findUserByUsername,
  getCurrentUser,
  sha256Hex,
  userSessionToken,
} from "@/lib/auth";

const MAX_AGE = 60 * 60 * 24 * 30;

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function clearAuthCookies(res: NextResponse) {
  for (const name of [SESSION_COOKIE, USER_COOKIE]) {
    res.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const username =
    typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = body?.password;
  if (!username || typeof password !== "string") {
    return NextResponse.json({ error: "Wrong username or password" }, { status: 401 });
  }
  const user = await findUserByUsername(username);
  if (!user || !safeEqual(await sha256Hex(password), user.passwordHash)) {
    return NextResponse.json({ error: "Wrong username or password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, username: user.username });
  res.cookies.set(SESSION_COOKIE, await userSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  res.cookies.set(USER_COOKIE, user.username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
