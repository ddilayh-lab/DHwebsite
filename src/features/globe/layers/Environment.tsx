"use client";

/**
 * ENVIRONMENT.
 *
 * Responsibility: depth atmosphere for the scene.
 * - Fog: depth cue for lit meshes (the core sphere) — cheaper and more
 *   controllable than a depth post pass at this scene scale.
 * - BackgroundGradient: intentionally DOM-side (a CSS radial gradient
 *   behind the transparent canvas) — zero GPU cost, resolution
 *   independent, and it survives a WebGL failure as the static
 *   fallback visual.
 * - HDRI: deliberately NOT used. The scene is emissive points/lines +
 *   one matte core sphere; image-based lighting would add a texture
 *   fetch and decode cost with no visible payoff. The LightingRig's
 *   analytic lights are the art direction.
 */
import { colors } from "@/config/design-tokens";

export function Environment() {
  return <fog attach="fog" args={[colors.backgroundPrimary, 3.2, 6.5]} />;
}
