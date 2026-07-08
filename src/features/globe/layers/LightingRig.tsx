"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import { colors } from "@/config/design-tokens";
import { damping } from "@/config/motion";
import { damp } from "@/lib/math";
import { cursorStore } from "@/features/cursor/cursor-store";

/**
 * LIGHTING RIG — analytic lights only (see Environment for the no-HDRI
 * rationale). Affects the matte core sphere; emissive layers ignore it.
 *
 * - KeyLight: main form light, upper left.
 * - RimLight: cool separation from behind-right.
 * - AmbientLight: floor so the dark side never crushes to black.
 * - InteractionLight: accent point light that FOLLOWS THE CURSOR
 *   (damped) — the surface visibly responds to attention.
 */
export function LightingRig() {
  const interaction = useRef<PointLight>(null);

  useFrame((_state, dt) => {
    const light = interaction.current;
    if (!light) return;
    const { nx, ny, speed } = cursorStore.get();
    light.position.x = damp(light.position.x, nx * 2.2, damping.parallax, dt);
    light.position.y = damp(light.position.y, -ny * 1.6, damping.parallax, dt);
    // Pointer energy brightens the accent light, gently.
    light.intensity = damp(light.intensity, 0.4 + Math.min(speed / 3000, 1) * 0.8, 4, dt);
  });

  return (
    <>
      <directionalLight position={[-2.5, 2, 2]} intensity={1.7} color="#ffffff" />
      <directionalLight position={[2.5, -0.5, -2]} intensity={0.5} color="#8aa0ff" />
      <ambientLight intensity={0.18} />
      <pointLight
        ref={interaction}
        position={[0, 0, 2.4]}
        intensity={0.4}
        distance={5}
        color={colors.accentActive}
      />
    </>
  );
}
