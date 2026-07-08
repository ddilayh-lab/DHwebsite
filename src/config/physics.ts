/**
 * PHYSICS MODEL — reusable, named physical values.
 *
 * Motion across the site is physics-inspired, never arbitrary:
 * continuous signals integrate velocity with friction/drag; discrete
 * settles use springs. Bounce is deliberately scarce — premium motion
 * is controlled, not playful (overshoot limits enforce this).
 */

/** Spring presets consumed by lib/physics.Spring. */
export const springs = {
  /** camera + large scene bodies: heavy, no visible overshoot */
  cinematic: { stiffness: 60, damping: 16, mass: 1.4 },
  /** UI elements returning to rest (magnetic release) */
  settle: { stiffness: 170, damping: 24, mass: 1 },
  /** small, quick reactions (node pulse scale) */
  reactive: { stiffness: 320, damping: 28, mass: 0.7 },
} as const;

/** Friction/drag as exponential decay rates (λ per second). */
export const friction = {
  /** globe free-spin decay after a drag release */
  globeSpin: 0.9,
  /** particle burst energy decay */
  particleBurst: 2.4,
  /** cursor speed signal decay */
  pointer: 8,
} as const;

/** Velocity and overshoot constraints — no motion escapes its budget. */
export const limits = {
  /** rad/s — globe can never spin faster than this */
  maxSpinVelocity: 1.6,
  /** rad — max pitch away from equator while dragging */
  maxPitch: 0.6,
  /** fraction of target distance a spring may overshoot */
  maxOvershoot: 0.08,
} as const;

/** Input → physics coupling factors. */
export const coupling = {
  /** px of pointer drag → rad of globe yaw */
  dragToYaw: 0.005,
  /** px of pointer drag → rad of globe pitch */
  dragToPitch: 0.003,
  /** pointer speed (px/s) → interaction intensity 0..1 */
  speedToIntensity: 1 / 2400,
  /** ambient spin (rad/s) the globe returns to at idle */
  ambientSpin: 0.05,
} as const;
