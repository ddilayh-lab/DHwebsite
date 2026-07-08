"use client";

import { useMediaQuery } from "./useMediaQuery";

/** Reduced-motion is a first-class state, not an afterthought. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
