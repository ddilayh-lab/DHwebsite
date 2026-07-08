"use client";

import { scrollStore, type ScrollState } from "@/features/scroll/scroll-store";
import { useStore } from "@/lib/store";

/**
 * Subscribe to a coarse slice of scroll state. Per-frame consumers should
 * read `scrollStore.get()` inside a ticker instead (see lib/store contract).
 */
export function useScrollProgress<S>(selector: (s: ScrollState) => S): S {
  return useStore(scrollStore, selector);
}
