"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ProfileForm from "@/components/forms/ProfileForm";
import InstallButton from "@/components/InstallButton";

export default function ProfilePage() {
  const router = useRouter();

  const logout = async () => {
    if (!window.confirm("Log out of Paisa?")) return;
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Your details & settings" emoji="👤" />
      <div className="space-y-4">
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