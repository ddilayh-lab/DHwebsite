/**
 * MOTION TOKEN SYSTEM — the single vocabulary for all animation.
 *
 * No component invents its own values. DOM tweens, scroll choreography,
 * cursor physics and camera damping all read from this file, so hover,
 * transition, scroll and camera motion feel like one system with
 * different characters.
 */

/** Durations in seconds (GSAP convention). */
export const duration = {
  /** state feedback that must feel immediate (cursor swap, press) */
  instant: 0.12,
  /** hover / focus feedback */
  fast: 0.25,
  /** standard UI motion */
  base: 0.6,
  /** editorial reveals (text, cards) */
  reveal: 0.9,
  /** cinematic moments (chapter transitions, camera flights) */
  cinematic: 1.4,
} as const;

/** Stagger intervals in seconds. */
export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.15,
} as const;

/** Easing — GSAP names plus CSS equivalents for non-GSAP consumers. */
export const ease = {
  out: "power4.out",
  inOut: "power3.inOut",
  expo: "expo.out",
  gentle: "power2.out",
  css: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  },
} as const;

/**
 * Frame-rate-independent damping coefficients (λ for `damp()` in lib/math).
 * Higher = snappier. Continuous signals use damping, never tweens.
 */
export const damping = {
  cursorDot: 28,
  cursorRing: 10,
  magnet: 12,
  camera: 4,
  parallax: 5,
  globeVelocity: 3,
} as const;

/** Scroll system tuning. */
export const scroll = {
  /** Lenis interpolation factor */
  lerp: 0.1,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
  /** default ScrollTrigger start for reveals */
  revealStart: "top 82%",
  /** velocity (px/frame) above which "fast scroll" effects engage */
  velocityThreshold: 12,
} as const;

/** Cursor / magnetic interaction tuning. */
export const cursor = {
  dotSize: 8,
  ringSize: 40,
  /** how far a magnetic element chases the pointer (0..1 of its size) */
  magnetStrength: 0.35,
  /** hover scale applied to the ring on interactive targets */
  ringHoverScale: 1.6,
} as const;

/**
 * Spring parameters, reserved for physical gestures (globe release,
 * magnet snap-back). Implemented via GSAP elastic/inertia-style tweens.
 */
export const spring = {
  soft: { stiffness: 120, damping: 18, mass: 1 },
  snappy: { stiffness: 260, damping: 22, mass: 0.8 },
} as const;
