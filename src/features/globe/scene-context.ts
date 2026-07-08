"use client";

import { createContext, useContext } from "react";
import type { DeviceTier } from "@/lib/performance";
import type { FrameUniforms } from "./frame-uniforms";

/**
 * Scene-wide context: the shared frame uniforms (updated once per frame
 * by SceneRoot) and the device tier every layer budgets against.
 */
export interface SceneContextValue {
  uniforms: FrameUniforms;
  tier: DeviceTier;
  reducedMotion: boolean;
}

export const SceneContext = createContext<SceneContextValue | null>(null);

export function useScene(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used inside SceneRoot");
  return ctx;
}
