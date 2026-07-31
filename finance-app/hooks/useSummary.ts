"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Summary } from "@/lib/types";

export function useSummary(month: string) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api<Summary>(`/api/summary?month=${month}`);
        if (cancelled) return;
        setSummary(data);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoadedFor(month);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [month, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  const loading = loadedFor !== month;

  return { summary, loading, error, refresh };
}
