"use client";

import { useEffect } from "react";
import type { ChapterId } from "@/data/types";
import { ensureGsap } from "@/lib/animation";
import { scrollStore } from "./scroll-store";

/**
 * Threshold events for the scroll timeline: watches every
 * `[data-chapter]` landmark and publishes active chapter + progress to
 * the scroll store. DOM nav, the globe and lighting all read from
 * there — no isolated scroll effects.
 */
export function ChapterTracker() {
  useEffect(() => {
    const { ScrollTrigger } = ensureGsap();

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter]"),
    );

    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) {
            scrollStore.set({
              activeChapter: el.dataset.chapter as ChapterId,
            });
          }
        },
        onUpdate: (self) => {
          if (self.isActive) {
            scrollStore.set({ chapterProgress: self.progress });
          }
        },
      }),
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
}
