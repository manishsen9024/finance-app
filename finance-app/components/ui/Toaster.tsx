"use client";

import { useEffect, useState } from "react";
import type { ToastKind } from "@/lib/toast";

type Item = { id: number; message: string; kind: ToastKind };

const EMOJI: Record<ToastKind, string> = {
  success: "✅",
  error: "⚠️",
  info: "💡",
};

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const on = (e: Event) => {
      const detail = (e as CustomEvent<{ message: string; kind: ToastKind }>).detail;
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, message: detail.message, kind: detail.kind }]);
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 2600);
    };
    window.addEventListener("app-toast", on);
    return () => window.removeEventListener("app-toast", on);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex flex-col items-center gap-2 px-4">
      {items.map((i) => (
        <div
          key={i.id}
          className="animate-pop-in pointer-events-auto flex max-w-full items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-2.5 text-sm font-semibold text-white shadow-xl backdrop-blur"
        >
          <span>{EMOJI[i.kind]}</span>
          <span className="truncate">{i.message}</span>
        </div>
      ))}
    </div>
  );
}