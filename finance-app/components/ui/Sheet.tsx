"use client";

import { createPortal } from "react-dom";
import { useEffect, useSyncExternalStore } from "react";

export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  // true after hydration, false on the server — avoids portal hydration mismatches
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-[2px]"
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md animate-sheet-up rounded-t-3xl border-t border-white/60 bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
        {title && (
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close sheet"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 active:scale-90"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}