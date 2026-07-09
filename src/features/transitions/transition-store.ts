import { createMachine } from "@/lib/state-machine";
import { createStore } from "@/lib/store";

/**
 * TRANSITION STATE DOMAIN.
 *
 * Chapter/navigation transitions run through an explicit machine so an
 * interrupted transition resolves gracefully instead of fighting the
 * next one. The interaction manager gives "transitioning" priority
 * over drag/hover/scroll, which is how transition timelines (when they
 * run) suppress competing motion.
 */
export type TransitionPhase = "idle" | "leaving" | "entering" | "interrupted";

type TransitionEvent = "start" | "midpoint" | "complete" | "interrupt" | "reset";

export const transitionMachine = createMachine<TransitionPhase, TransitionEvent>({
  initial: "idle",
  transitions: {
    idle: { start: "leaving" },
    leaving: { midpoint: "entering", interrupt: "interrupted" },
    entering: { complete: "idle", interrupt: "interrupted" },
    interrupted: { reset: "idle", start: "leaving" },
  },
});

export interface TransitionState {
  phase: TransitionPhase;
}

export const transitionStore = createStore<TransitionState>({ phase: "idle" });

transitionMachine.onTransition((_from, to) => {
  transitionStore.set({ phase: to });
});
