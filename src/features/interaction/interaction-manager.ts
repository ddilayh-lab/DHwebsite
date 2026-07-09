/**
 * INTERACTION MANAGER — the arbiter between systems.
 *
 * Cursor, scroll, globe, chapter and transition state all publish to
 * their own stores; this module decides which system owns motion at any
 * moment, in strict priority order. Consumers (camera rig, globe rig,
 * particles) branch on ONE mode per frame instead of inspecting five
 * stores — that is what prevents competing animations.
 *
 * Priority (highest first):
 *   reduced-motion → transitioning → dragging → focused → hover →
 *   scrolling → idle
 */
import { prefersReducedMotion } from "@/lib/accessibility";
import { cursorStore } from "@/features/cursor/cursor-store";
import { globeStore } from "@/features/globe/globe-store";
import { scrollStore } from "@/features/scroll/scroll-store";
import { transitionStore } from "@/features/transitions/transition-store";

export type InteractionMode =
  | "reduced-motion"
  | "transitioning"
  | "dragging"
  | "focused"
  | "hover"
  | "scrolling"
  | "idle";

let reduced = prefersReducedMotion();
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (e) => (reduced = e.matches));
}

/** Pure read — call once per frame; never caches across frames. */
export function resolveInteractionMode(): InteractionMode {
  if (reduced) return "reduced-motion";
  if (transitionStore.get().phase !== "idle") return "transitioning";

  const globe = globeStore.get();
  if (globe.interaction === "dragging") return "dragging";
  if (globe.activeNodeId) return "focused";
  if (globe.interaction === "hover" || cursorStore.get().variant !== "default")
    return "hover";
  if (scrollStore.get().isScrolling) return "scrolling";
  return "idle";
}
