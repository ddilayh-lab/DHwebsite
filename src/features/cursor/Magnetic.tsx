"use client";

import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cursor as cursorTokens, damping, duration, ease } from "@/config/motion";
import { prefersReducedMotion } from "@/lib/accessibility";
import { ensureGsap } from "@/lib/animation";
import { damp } from "@/lib/math";

interface MagneticProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** 0..1 — how strongly the element chases the pointer. */
  strength?: number;
}

/**
 * Magnetic interaction wrapper — the ONLY sanctioned way to make an
 * element magnetic. Chases the pointer with damped motion while
 * hovered; releases with an elastic settle. Inert under reduced motion
 * and on touch devices (pointerenter never fires meaningfully).
 */
export function Magnetic({
  children,
  strength = cursorTokens.magnetStrength,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = ensureGsap();

    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let hovering = false;

    const tick = (_t: number, dtMs: number) => {
      if (!hovering) return;
      const dt = dtMs / 1000;
      pos.x = damp(pos.x, target.x, damping.magnet, dt);
      pos.y = damp(pos.y, target.y, damping.magnet, dt);
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };

    const onEnter = () => {
      hovering = true;
      gsap.killTweensOf(pos);
    };
    const onMove = (e: PointerEvent) => {
      if (!hovering) return;
      const rect = el.getBoundingClientRect();
      target.x = (e.clientX - rect.left - rect.width / 2) * strength;
      target.y = (e.clientY - rect.top - rect.height / 2) * strength;
    };
    const onLeave = () => {
      hovering = false;
      gsap.to(pos, {
        x: 0,
        y: 0,
        duration: duration.base,
        ease: "elastic.out(1, 0.4)",
        onUpdate: () => {
          el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        },
      });
    };

    gsap.ticker.add(tick);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      gsap.ticker.remove(tick);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(pos);
    };
  }, [strength]);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
