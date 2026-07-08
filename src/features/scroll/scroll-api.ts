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

export function scrollToTarget(selector: string) {
  if (lenisInstance) {
    lenisInstance.scrollTo(selector, { offset: 0 });
    return;
  }
  document.querySelector(selector)?.scrollIntoView({ behavior: "auto" });
}
