"use client";

import { useSyncExternalStore } from "react";

/**
 * Minimal external store — the shared-state backbone for cross-system
 * coordination (scroll, cursor, globe, transitions) without adding a
 * state-management dependency.
 *
 * Contract:
 * - React components subscribe via `useStore` with a *primitive* selector
 *   (coarse values: active chapter, hover variant).
 * - Per-frame consumers (cursor engine, camera) call `get()` inside their
 *   own ticker instead of subscribing — 60 fps values never cause renders.
 */
export type Listener = () => void;

export interface Store<T extends object> {
  get: () => T;
  set: (partial: Partial<T>) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set(partial) {
      let changed = false;
      for (const key in partial) {
        if (!Object.is(state[key], partial[key])) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      state = { ...state, ...partial };
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T extends object, S>(
  store: Store<T>,
  selector: (state: T) => S,
): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.get()),
  );
}
