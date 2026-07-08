"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { scroll as scrollTokens } from "@/config/motion";
import { ensureGsap } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { registerLenis } from "./scroll-api";
import { scrollStore } from "./scroll-store";

/**
 * SCROLL ORCHESTRATION LAYER.
 *
 * One rAF pipeline with strict ordering — input → Lenis integration →
 * ScrollTrigger update → (GL renders on the same GSAP ticker). This is
 * what keeps DOM motion and the WebGL camera frame-locked.
 *
 * Reduced motion: Lenis is not instantiated at all — native scrolling
 * remains, ScrollTrigger still tracks progress (without scrubbing lag),
 * and reveal animations collapse to opacity-only or none.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();

    const updateFromNative = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollStore.set({
        progress: max > 0 ? window.scrollY / max : 0,
      });
    };

    if (reducedMotion) {
      window.addEventListener("scroll", updateFromNative, { passive: true });
      updateFromNative();
      return () => window.removeEventListener("scroll", updateFromNative);
    }

    const lenis = new Lenis({
      lerp: scrollTokens.lerp,
      wheelMultiplier: scrollTokens.wheelMultiplier,
      touchMultiplier: scrollTokens.touchMultiplier,
    });
    registerLenis(lenis);

    let scrollStopTimer: ReturnType<typeof setTimeout> | undefined;

    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      scrollStore.set({
        progress: e.progress,
        velocity: e.velocity,
        direction: e.direction as 1 | -1 | 0,
        isScrolling: true,
      });
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(
        () => scrollStore.set({ isScrolling: false, velocity: 0 }),
        120,
      );
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(scrollStopTimer);
      registerLenis(null);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
