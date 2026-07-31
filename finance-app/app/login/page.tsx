"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FLOATERS = [
  { e: "💸", cls: "left-[8%] top-[14%] text-2xl ad-75" },
  { e: "💰", cls: "right-[10%] top-[22%] text-3xl ad-150" },
  { e: "🍔", cls: "left-[16%] bottom-[18%] text-3xl ad-300" },
  { e: "🏦", cls: "right-[16%] bottom-[24%] text-2xl ad-500" },
  { e: "📈", cls: "left-[28%] top-[10%] text-xl ad-700" },
  { e: "🛒", cls: "right-[28%] top-[12%] text-xl ad-300" },
];

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Login failed");
        return;
      }
      const from = new URLSearchParams(window.location.search).get("from");
      router.push(from && from.startsWith("/") ? from : "/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center overflow-hidden px-6">
      {FLOATERS.map((f, i) => (
        <span key={i} className={`animate-float-y pointer-events-none absolute select-none opacity-70 ${f.cls}`}>
          {f.e}
        </span>
      ))}

      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 animate-pop-in items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-600/40">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-8 w-8">
            <circle cx="12" cy="12" r="8.5" />
            <path
              d="M12 7.5v9M9.5 9.5h3a1.5 1.5 0 0 1 0 3h-1a1.5 1.5 0 0 0 0 3h3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Paisa 💸
        </h1>
        <p className="text-sm text-slate-400">Your money, at a glance</p>
      </div>

      <form onSubmit={submit} className="card w-full space-y-3">
        <div>
          <label className="label" htmlFor="password">
            🔐 Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input py-3"
          />
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "Unlocking…" : "Unlock ✨"}
        </button>
      </form>
    </div>
  );
}