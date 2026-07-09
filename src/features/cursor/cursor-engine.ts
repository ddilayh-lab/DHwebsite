"use client";

/**
 * CURSOR ENGINE — one system, zero per-component pointer logic.
 *
 * Contract: interactive elements declare behavior declaratively via
 * `data-cursor="link | drag | view"` and optional `data-cursor-label`.
 * The engine discovers targets through event delegation, so components
 * never attach their own pointer listeners for cursor behavior.
 *
 * Raw input is sampled unfiltered; smoothing is applied on the output
 * side only (dot and ring chase with different damping constants),
 * so feedback starts next frame while motion stays fluid.
 *
 * Touch-primary and reduced-motion users keep the native cursor and
 * receive non-hover-dependent affordances instead.
 */
import { damping } from "@/config/motion";
import { isTouchPrimary, prefersReducedMotion } from "@/lib/accessibility";
import { ensureGsap } from "@/lib/animation";
import { damp } from "@/lib/math";
import { cursorStore, type CursorVariant } from "./cursor-store";

const VARIANTS: ReadonlySet<string> = new Set(["link", "drag", "view"]);
const IDLE_AFTER_MS = 2000;

export class CursorEngine {
  private dot: HTMLElement;
  private ring: HTMLElement;
  private raw = { x: -100, y: -100 };
  private dotPos = { x: -100, y: -100 };
  private ringPos = { x: -100, y: -100 };
  private lastMove = 0;
  private lastSample = { x: -100, y: -100, t: 0 };
  private tick: (time: number, dt: number) => void;
  private destroyed = false;

  constructor(dot: HTMLElement, ring: HTMLElement) {
    this.dot = dot;
    this.ring = ring;
    this.tick = (_t, dtMs) => this.update(dtMs / 1000);
  }

  static isSupported(): boolean {
    return !isTouchPrimary() && !prefersReducedMotion();
  }

  start() {
    const { gsap } = ensureGsap();
    window.addEventListener("pointermove", this.onMove, { passive: true });
    document.addEventListener("pointerover", this.onOver);
    document.addEventListener("pointerout", this.onOut);
    // Re-read the target after clicks: toggles swap their label
    // (open ⇄ close) without a pointerover firing.
    document.addEventListener("click", this.onOver);
    gsap.ticker.add(this.tick);
    document.documentElement.classList.add("has-custom-cursor");
    cursorStore.set({ enabled: true });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    const { gsap } = ensureGsap();
    window.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerover", this.onOver);
    document.removeEventListener("pointerout", this.onOut);
    document.removeEventListener("click", this.onOver);
    gsap.ticker.remove(this.tick);
    document.documentElement.classList.remove("has-custom-cursor");
    cursorStore.set({ enabled: false });
  }

  private onMove = (e: PointerEvent) => {
    this.raw.x = e.clientX;
    this.raw.y = e.clientY;
    this.lastMove = performance.now();
    cursorStore.set({
      nx: (e.clientX / window.innerWidth) * 2 - 1,
      ny: (e.clientY / window.innerHeight) * 2 - 1,
      idle: false,
    });
  };

  private onOver = (e: PointerEvent) => {
    const target = (e.target as Element).closest<HTMLElement>("[data-cursor]");
    if (!target) return;
    const variant = target.dataset.cursor ?? "";
    if (VARIANTS.has(variant)) {
      cursorStore.set({
        variant: variant as CursorVariant,
        label: target.dataset.cursorLabel ?? null,
      });
    }
  };

  private onOut = (e: PointerEvent) => {
    const from = (e.target as Element).closest?.("[data-cursor]");
    const to = (e.relatedTarget as Element | null)?.closest?.("[data-cursor]");
    if (from && from !== to) {
      cursorStore.set({ variant: "default", label: null });
    }
  };

  private update(dt: number) {
    // Velocity from raw samples (px/s), lightly smoothed for consumers.
    const now = performance.now();
    const sampleDt = (now - this.lastSample.t) / 1000;
    if (sampleDt > 0.05) {
      const dx = this.raw.x - this.lastSample.x;
      const dy = this.raw.y - this.lastSample.y;
      const speed = Math.hypot(dx, dy) / sampleDt;
      cursorStore.set({
        speed: damp(cursorStore.get().speed, speed, 8, sampleDt),
      });
      this.lastSample = { x: this.raw.x, y: this.raw.y, t: now };
    }

    if (!cursorStore.get().idle && now - this.lastMove > IDLE_AFTER_MS) {
      cursorStore.set({ idle: true, speed: 0 });
    }

    this.dotPos.x = damp(this.dotPos.x, this.raw.x, damping.cursorDot, dt);
    this.dotPos.y = damp(this.dotPos.y, this.raw.y, damping.cursorDot, dt);
    this.ringPos.x = damp(this.ringPos.x, this.raw.x, damping.cursorRing, dt);
    this.ringPos.y = damp(this.ringPos.y, this.raw.y, damping.cursorRing, dt);

    this.dot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0) translate(-50%, -50%)`;
    this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0) translate(-50%, -50%)`;
  }
}
