import { createStore } from "@/lib/store";

/**
 * GLOBE INTERACTION STATE DOMAIN.
 * The globe reads navigation intent from the transition layer and
 * publishes only its own interaction state here. It never owns
 * navigation.
 */
export interface GlobeState {
  interaction: "idle" | "hover" | "dragging";
  /** id of the hovered/focused node's location, if any */
  activeNodeId: string | null;
  /** current angular velocity around Y (rad/s) — ambient + inertia */
  spinVelocity: number;
}

export const globeStore = createStore<GlobeState>({
  interaction: "idle",
  activeNodeId: null,
  spinVelocity: 0.05,
});
