"use client";

import { useMediaQuery } from "./useMediaQuery";

export function usePrefersContrast(): boolean {
  return useMediaQuery("(prefers-contrast: more)");
}
