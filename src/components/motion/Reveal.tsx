"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { duration, ease, scroll as scrollTokens, stagger } from "@/config/motion";
import { ensureGsap } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealProps {
  children: ReactNode;
  /** Stagger over direct children instead of animating the wrapper. */
  cascade?: boolean;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * ANIMATED WRAPPER — the sanctioned way to scroll-reveal DOM content.
 * Consumes motion tokens only; under reduced motion, content is simply
 * visible (no fade, no translate — nothing to miss).
 */
export function Reveal({ children, cascade = false, delay = 0, y = 40, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const { gsap } = ensureGsap();

    const targets = cascade ? Array.from(el.children) : el;
    const tween = gsap.fromTo(
      targets,
      { autoAlpha: 0, y },
      {
        autoAlpha: 1,
        y: 0,
        duration: duration.reveal,
        ease: ease.out,
        delay,
        stagger: cascade ? stagger.base : 0,
        scrollTrigger: {
          trigger: el,
          start: scrollTokens.revealStart,
          once: true,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [cascade, delay, y, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
