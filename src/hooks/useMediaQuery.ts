"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
