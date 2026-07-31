import { cookies } from "next/headers";
import { supabase } from "./supabase";

export const SESSION_COOKIE = "finance_session";
export const USER_COOKIE = "finance_user";

export interface AuthUser {
  id: string;
  username: string;
}

export interface UserRecord {
  id: string;
  username: string;
  passwordHash: string;
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function findUserByUsername(
  username: string
): Promise<UserRecord | null> {
  const { data, error } = await supabase()
    .from("users")
    .select("id, username, password_hash")
    .eq("username", username)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: String(data.id),
    username: String(data.username ?? ""),
    passwordHash: String(data.password_hash ?? ""),
  };
}

export function userSessionToken(user: UserRecord): Promise<string> {
  return sha256Hex(`finance-app:${user.id}:${user.username}:${user.passwordHash}`);
}

export async function resolveSession(
  username: string,
  token: string
): Promise<AuthUser | null> {
  if (!username || !token) return null;
  const user = await findUserByUsername(username);
  if (!user) return null;
  if ((await userSessionToken(user)) !== token) return null;
  return { id: user.id, username: user.username };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  return resolveSession(
    store.get(USER_COOKIE)?.value ?? "",
    store.get(SESSION_COOKIE)?.value ?? ""
  );
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}
