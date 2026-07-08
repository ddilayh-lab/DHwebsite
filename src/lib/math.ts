/** Pure math utilities shared by DOM motion and the WebGL scene. */

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Frame-rate-independent exponential damping.
 * `lambda` comes from motion tokens (`damping.*`); `dt` in seconds.
 */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);

export const normalize = (v: number, min: number, max: number) =>
  clamp((v - min) / (max - min), 0, 1);
