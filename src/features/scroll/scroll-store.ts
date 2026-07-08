import { createStore } from "@/lib/store";
import type { ChapterId } from "@/data/types";

/**
 * SCROLL STATE DOMAIN — one normalized timeline for the whole site.
 * Everything scroll can drive (typography, camera, lighting, particles,
 * navigation, chapter progress) reads from here.
 */
export interface ScrollState {
  /** 0..1 across the full document */
  progress: number;
  /** Lenis velocity (px/frame, signed) */
  velocity: number;
  direction: 1 | -1 | 0;
  isScrolling: boolean;
  /** chapter currently in view (threshold events set this) */
  activeChapter: ChapterId | null;
  /** 0..1 within the active chapter */
  chapterProgress: number;
}

export const scrollStore = createStore<ScrollState>({
  progress: 0,
  velocity: 0,
  direction: 0,
  isScrolling: false,
  activeChapter: null,
  chapterProgress: 0,
});
