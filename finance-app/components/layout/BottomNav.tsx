"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: Array<{ href: string; label: string; emoji: string }> = [
  { href: "/dashboard", label: "Home", emoji: "🏠" },
  { href: "/income", label: "Income", emoji: "💰" },
  { href: "/expenses", label: "Spend", emoji: "🛒" },
  { href: "/savings", label: "Save", emoji: "🐷" },
  { href: "/reports", label: "Stats", emoji: "📊" },
  { href: "/profile", label: "Me", emoji: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="flex items-stretch justify-between rounded-3xl border border-white/70 bg-white/85 px-1.5 py-1.5 shadow-[0_16px_40px_-12px_rgba(79,70,229,0.4)] backdrop-blur-xl">
        {LINKS.map(({ href, label, emoji }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-14 flex-1 flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span
                className={`text-xl leading-none transition-transform duration-300 ${
                  active ? "scale-110" : ""
                }`}
              >
                {emoji}
              </span>
              <span
                className={`mt-1 text-[10px] font-bold leading-none ${
                  active ? "text-indigo-600" : ""
                }`}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-indigo-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}