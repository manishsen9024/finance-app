"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useSyncExternalStore, useState } from "react";
import Sheet from "@/components/ui/Sheet";
import AddExpenseForm from "@/components/forms/AddExpenseForm";
import AddIncomeForm from "@/components/forms/AddIncomeForm";
import { api } from "@/lib/api";
import type { Category, Profile } from "@/lib/types";

export default function QuickAdd({ onChanged }: { onChanged?: () => void }) {
  const [open, setOpen] = useState<"income" | "expense" | null>(null);
  const [fab, setFab] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  // true after hydration, false on the server — avoids portal hydration mismatches
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const [cats, prof] = await Promise.all([
          api<Category[]>("/api/categories"),
          api<Profile>("/api/profile"),
        ]);
        if (cancelled) return;
        setCategories(cats.map((c) => c.name));
        setProfile(prof);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const changed = useCallback(() => {
    setOpen(null);
    onChanged?.();
    window.dispatchEvent(new CustomEvent("data-changed"));
  }, [onChanged]);

  if (!mounted) return null;

  return createPortal(
    <>
      {fab && (
        <div className="fixed bottom-36 right-5 z-[55] flex flex-col items-end gap-2">
          <button
            onClick={() => {
              setFab(false);
              setOpen("income");
            }}
            className="animate-pop-in flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xl"
          >
            💰 Income
          </button>
          <button
            onClick={() => {
              setFab(false);
              setOpen("expense");
            }}
            className="animate-pop-in flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xl"
          >
            🧾 Expense
          </button>
        </div>
      )}

      <button
        onClick={() => setFab((o) => !o)}
        aria-label="Add"
        className={`fixed bottom-36 right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-indigo-600 to-fuchsia-600 text-2xl font-bold text-white shadow-xl shadow-indigo-600/40 transition-transform duration-200 active:scale-90 ${
          fab ? "rotate-45" : ""
        }`}
      >
        {fab ? "✕" : "＋"}
      </button>

      <Sheet open={open === "expense"} onClose={() => setOpen(null)} title="🧾 Add expense">
        <AddExpenseForm categories={categories} onAdded={changed} />
      </Sheet>
      <Sheet open={open === "income"} onClose={() => setOpen(null)} title="💰 Add income">
        <AddIncomeForm profile={profile ?? undefined} onAdded={changed} />
      </Sheet>
    </>,
    document.body
  );
}