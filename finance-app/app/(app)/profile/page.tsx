"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ProfileForm from "@/components/forms/ProfileForm";

export default function ProfilePage() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <>
      <PageHeader title="Profile" />
      <div className="space-y-4">
        <ProfileForm />
        <button onClick={logout} className="btn-ghost text-red-600">
          Log out
        </button>
      </div>
    </>
  );
}
