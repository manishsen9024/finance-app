"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Profile } from "@/lib/types";

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [salary, setSalary] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api<Profile>("/api/profile")
      .then((p) => {
        setProfile(p);
        setName(p.name);
        setCurrency(p.currency);
        setSalary(String(p.baseMonthlySalary));
      })
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const next = await api<Profile>("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim(),
          currency: currency.trim().toUpperCase() || "INR",
          baseMonthlySalary: Number(salary) || 0,
        }),
      });
      setProfile(next);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setBusy(false);
    }
  };

  if (!profile) return <p className="py-10 text-center text-sm text-slate-400">Loading…</p>;

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="text-sm font-semibold text-slate-700">Your details</h2>
      <div>
        <label className="label" htmlFor="pf-name">Name</label>
        <input
          id="pf-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Your name"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="pf-currency">Currency code</label>
          <input
            id="pf-currency"
            type="text"
            maxLength={3}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input"
            placeholder="INR"
          />
        </div>
        <div>
          <label className="label" htmlFor="pf-salary">Base monthly salary</label>
          <input
            id="pf-salary"
            type="number"
            inputMode="decimal"
            min="0"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="input"
          />
        </div>
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      {saved && <p className="text-xs font-medium text-green-600">Profile saved</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
