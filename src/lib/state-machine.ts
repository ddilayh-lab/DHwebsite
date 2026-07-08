/**
 * INTERACTION STATE MACHINE.
 *
 * Every interactive system declares its states and legal transitions —
 * no ad-hoc booleans, no stuck states. Illegal events are ignored
 * (interrupted animations resolve by transitioning, never by jumping).
 */

export const INTERACTION_STATES = [
  "idle",
  "hover",
  "focus",
  "active",
  "dragging",
  "scrolling",
  "transitioning",
  "completed",
  "interrupted",
  "reduced-motion",
] as const;

export type InteractionState = (typeof INTERACTION_STATES)[number];

export interface Machine<S extends string, E extends string> {
  readonly state: S;
  send: (event: E) => S;
  onTransition: (fn: (from: S, to: S, event: E) => void) => () => void;
  can: (event: E) => boolean;
}

export function createMachine<S extends string, E extends string>(config: {
  initial: S;
  transitions: Record<S, Partial<Record<E, S>>>;
}): Machine<S, E> {
  let current = config.initial;
  const observers = new Set<(from: S, to: S, event: E) => void>();

  return {
    get state() {
      return current;
    },
    can(event) {
      return config.transitions[current]?.[event] !== undefined;
    },
    send(event) {
      const next = config.transitions[current]?.[event];
      if (next !== undefined && next !== current) {
        const from = current;
        current = next;
        observers.forEach((fn) => fn(from, next, event));
      }
      return current;
    },
    onTransition(fn) {
      observers.add(fn);
      return () => observers.delete(fn);
    },
  };
}
