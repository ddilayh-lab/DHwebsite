"use client";

import { Stats } from "@react-three/drei";
import { useMemo } from "react";

/**
 * DEVELOPMENT-ONLY CONTROLS — FPS meter, enabled with `?debug` in dev
 * builds. Ships nothing to production (dead-code eliminated by the
 * NODE_ENV check and tree-shaken import).
 */
export function DebugTools() {
  const enabled = useMemo(
    () =>
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      window.location.search.includes("debug"),
    [],
  );

  if (!enabled) return null;
  return <Stats />;
}
