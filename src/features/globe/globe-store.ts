import { createStore } from "@/lib/store";
import { createMachine } from "@/lib/state-machine";

/**
 * GLOBE INTERACTION STATE DOMAIN.
 * The globe reads navigation intent from the transition layer and
 * publishes only its own interaction state here — it never owns
 * navigation.
 */
export interface GlobeState {
  interaction: "idle" | "hover" | "dragging";
  /** id of the hovered/focused node's location, if any */
  activeNodeId: string | null;
  /** true once the intro animation has settled */
  introComplete: boolean;
}

export const globeStore = createStore<GlobeState>({
  interaction: "idle",
  activeNodeId: null,
  introComplete: false,
});

/**
 * ANIMATION STATE MACHINE for the globe lifecycle. Rig and layers key
 * their per-frame behavior off `globeMachine.state`, so competing
 * animations on the same properties are structurally impossible —
 * interrupts transition, they never snap.
 */
export type GlobePhase =
  | "intro"
  | "idle"
  | "hover"
  | "dragging"
  | "focused"
  | "reduced-motion";

type GlobeEvent =
  | "intro-complete"
  | "pointer-enter"
  | "pointer-leave"
  | "drag-start"
  | "drag-end"
  | "focus"
  | "blur"
  | "reduce";

export const globeMachine = createMachine<GlobePhase, GlobeEvent>({
  initial: "intro",
  transitions: {
    intro: { "intro-complete": "idle", reduce: "reduced-motion" },
    idle: {
      "pointer-enter": "hover",
      "drag-start": "dragging",
      focus: "focused",
      reduce: "reduced-motion",
    },
    hover: {
      "pointer-leave": "idle",
      "drag-start": "dragging",
      focus: "focused",
      reduce: "reduced-motion",
    },
    dragging: {
      "drag-end": "idle",
      reduce: "reduced-motion",
    },
    focused: {
      blur: "idle",
      "drag-start": "dragging",
      reduce: "reduced-motion",
    },
    "reduced-motion": {},
  },
});
