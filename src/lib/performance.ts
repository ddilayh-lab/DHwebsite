/**
 * PERFORMANCE SYSTEM — device tiering and budgets.
 * The scene reads a tier once and scales particle counts, DPR and
 * effects; nothing is unbounded.
 */

export type DeviceTier = "high" | "medium" | "low";

interface NavigatorExtras extends Navigator {
  deviceMemory?: number;
}

export function getDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as NavigatorExtras;
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (memory <= 4 || cores <= 4 || coarse) return coarse && memory > 4 ? "medium" : "low";
  if (memory >= 8 && cores >= 8) return "high";
  return "medium";
}

/** DPR cap per tier — retina where it pays, never above 2. */
export function getMaxDpr(tier: DeviceTier): number {
  switch (tier) {
    case "high":
      return 2;
    case "medium":
      return 1.5;
    case "low":
      return 1;
  }
}

/** Particle budgets per tier (globe field density). */
export function getParticleBudget(tier: DeviceTier): number {
  switch (tier) {
    case "high":
      return 4000;
    case "medium":
      return 2200;
    case "low":
      return 1200;
  }
}
