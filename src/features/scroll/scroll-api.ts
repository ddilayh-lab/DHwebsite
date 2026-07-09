"use client";

/**
 * Imperative scroll API. The ScrollProvider registers its Lenis
 * instance here; consumers (nav, globe nodes) call `scrollToTarget`
 * and get smooth scrolling when Lenis is active, native scrolling
 * otherwise — no component ever touches Lenis directly.
 */
import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function scrollToTarget(
  selector: string,
  options?: { offset?: number; onComplete?: () => void },
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(selector, {
      offset: options?.offset ?? 0,
      onComplete: options?.onComplete,
    });
    return;
  }
  document.querySelector(selector)?.scrollIntoView({ behavior: "auto" });
  options?.onComplete?.();
}
