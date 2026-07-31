import { cookies } from "next/headers";
import { supabase } from "./supabase";

export const SESSION_COOKIE = "finance_session";

let cachedHash: { value: string; at: number } | null = null;
const CACHE_TTL_MS = 30_000;

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getPasswordHash(): Promise<string> {
  if (cachedHash && Date.now() - cachedHash.at < CACHE_TTL_MS) {
    return cachedHash.value;
  }
  const { data, error } = await supabase()
    .from("app_config")
    .select("password_hash")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const value = String(data?.password_hash ?? "");
  cachedHash = { value, at: Date.now() };
  return value;
}

export async function sessionToken(): Promise<string> {
  return sha256Hex(`finance-app:${await getPasswordHash()}`);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return !!token && token === (await sessionToken());
}
