/**
 * Physics primitives — the only motion integrators in the codebase.
 * Consumers configure them from config/physics tokens; nobody hand-rolls
 * spring math in components.
 */
import { limits } from "@/config/physics";
import { clamp } from "./math";

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

/**
 * Semi-implicit Euler spring. Frame-rate independent enough at UI time
 * steps; overshoot is clamped to the global limit so premium motion
 * never turns bouncy.
 */
export class Spring {
  position: number;
  velocity = 0;
  private cfg: SpringConfig;

  constructor(cfg: SpringConfig, initial = 0) {
    this.cfg = cfg;
    this.position = initial;
  }

  update(target: number, dt: number): number {
    const { stiffness, damping, mass } = this.cfg;
    const step = Math.min(dt, 1 / 30); // never integrate a huge frame
    const accel = (-stiffness * (this.position - target) - damping * this.velocity) / mass;
    this.velocity += accel * step;
    this.position += this.velocity * step;

    const overshoot = limits.maxOvershoot * Math.max(1, Math.abs(target));
    if (this.position > target + overshoot) this.position = target + overshoot;
    if (this.position < target - overshoot && target < this.position + overshoot)
      this.position = Math.max(this.position, target - overshoot);
    return this.position;
  }

  reset(value: number) {
    this.position = value;
    this.velocity = 0;
  }
}

/**
 * 1D inertia: accumulate impulses (drag deltas), decay with friction.
 * Used for globe spin release and any thrown motion.
 */
export class Inertia {
  velocity = 0;

  constructor(private frictionLambda: number, private maxVelocity = Infinity) {}

  impulse(v: number) {
    this.velocity = clamp(this.velocity + v, -this.maxVelocity, this.maxVelocity);
  }

  set(v: number) {
    this.velocity = clamp(v, -this.maxVelocity, this.maxVelocity);
  }

  update(dt: number): number {
    this.velocity *= Math.exp(-this.frictionLambda * dt);
    if (Math.abs(this.velocity) < 1e-4) this.velocity = 0;
    return this.velocity;
  }
}
