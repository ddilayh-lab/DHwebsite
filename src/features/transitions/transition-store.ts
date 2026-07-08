import { createMachine } from "@/lib/state-machine";
import { createStore } from "@/lib/store";
import type { ChapterId } from "@/data/types";

/**
 * TRANSITION STATE DOMAIN.
 *
 * Chapter/navigation transitions run through an explicit machine so an
 * interrupted transition resolves gracefully instead of fighting the
 * next one. The globe listens to `focusedChapter` through this layer —
 * navigation notifies the globe; the globe never owns navigation state.
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
  /** Chapter the experience is focused on (navigation intent). */
  focusedChapter: ChapterId | null;
}

export const transitionStore = createStore<TransitionState>({
  phase: "idle",
  focusedChapter: null,
});

transitionMachine.onTransition((_from, to) => {
  transitionStore.set({ phase: to });
});

/** The controlled interaction layer: navigation → (store) → globe/UI. */
export function focusChapter(chapter: ChapterId | null) {
  transitionStore.set({ focusedChapter: chapter });
}
