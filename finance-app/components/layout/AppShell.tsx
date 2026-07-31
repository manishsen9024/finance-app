"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <main key={pathname} className="flex-1 animate-fade-up px-4 pb-36 pt-5">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}