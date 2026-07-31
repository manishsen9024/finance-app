import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, sessionToken } from "@/lib/auth";

export default async function Home() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const authed = !!token && token === (await sessionToken());
  redirect(authed ? "/dashboard" : "/login");
}
