"use client";

/**
 * GSAP bootstrap — the single motion authority.
 * All plugin registration happens here; consumers import `gsap` from
 * this module so registration is guaranteed and SSR-safe.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // The scroll system owns update timing; avoid double-smoothing.
    gsap.ticker.lagSmoothing(0);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };
