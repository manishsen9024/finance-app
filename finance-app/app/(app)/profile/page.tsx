"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ProfileForm from "@/components/forms/ProfileForm";
import InstallButton from "@/components/InstallButton";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    api<{ user: { username: string } | null }>("/api/auth")
      .then((d) => setUsername(d.user?.username ?? null))
      .catch(() => {});
  }, []);

  const logout = async () => {
    if (!window.confirm("Log out of Paisa?")) return;
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Your details & settings" emoji="👤" />
      <div className="space-y-4">
        {username && (
          <p className="text-center text-sm text-slate-400">
            Signed in as{" "}
            <span className="font-bold text-indigo-600">@{username}</span>
          </p>
        )}
        <ProfileForm />
        <InstallButton />
        <button
          onClick={logout}
          className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-600 shadow-sm transition active:scale-[0.98]"
        >
          🚪 Log out
        </button>
      </div>
    </>
  );
}
