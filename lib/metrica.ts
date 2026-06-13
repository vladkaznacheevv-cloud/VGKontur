"use client";

declare global {
  interface Window {
    ym?: (counterId: number, method: "reachGoal", goal: string) => void;
  }
}

export function reachGoal(goal: string) {
  const rawId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
  const counterId = rawId ? Number(rawId) : Number.NaN;

  if (!Number.isFinite(counterId) || typeof window === "undefined" || !window.ym) {
    return;
  }

  window.ym(counterId, "reachGoal", goal);
}
