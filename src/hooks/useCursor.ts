"use client";

import { cursorStore, type CursorState } from "@/features/cursor/cursor-store";
import { useStore } from "@/lib/store";

/** Coarse cursor state (variant, label, enabled) for React consumers. */
export function useCursor<S>(selector: (s: CursorState) => S): S {
  return useStore(cursorStore, selector);
}
