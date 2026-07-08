"use client";

import { useEffect, useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial } from "three";
import { getParticleBudget } from "@/lib/performance";
import { colorUniforms } from "../frame-uniforms";
import { useScene } from "../scene-context";
import { particlesFragment, particlesVertex } from "../shaders/particles";

/**
 * PARTICLE SYSTEM — one reusable, budgeted system for every particle
 * role. Orbital drift, hover response and scroll response are all the
 * SAME points + SAME shader, modulated by shared frame uniforms
 * (uInteractionIntensity, uScrollProgress) — no per-effect particle
 * logic anywhere else in the app.
 *
 * Budget: ~25% of the tier's particle budget (the surface shell uses
 * the rest); one draw call; positions computed entirely on the GPU.
 */
export function ParticleSystem() {
  const { uniforms, tier } = useScene();
  const count = Math.floor(getParticleBudget(tier) * 0.25);

  const { geometry, material } = useMemo(() => {
    const geo = new BufferGeometry();
    // Positions are procedural in the vertex shader; the attribute only
    // needs to exist so WebGL has a vertex count to draw.
    geo.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));

    const seeds = new Float32Array(count);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds[i] = Math.random();
      radii[i] = 1.5 + Math.random() * 1.3;
      speeds[i] = 0.02 + Math.random() * 0.08;
    }
    geo.setAttribute("aSeed", new BufferAttribute(seeds, 1));
    geo.setAttribute("aRadius", new BufferAttribute(radii, 1));
    geo.setAttribute("aSpeed", new BufferAttribute(speeds, 1));
    // Procedural positions escape three's bounding-sphere culling math.
    geo.boundingSphere = null;

    const mat = new ShaderMaterial({
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      uniforms: {
        uTime: uniforms.uTime,
        uScrollProgress: uniforms.uScrollProgress,
        uInteractionIntensity: uniforms.uInteractionIntensity,
        uIntro: uniforms.uIntro,
        uPixelRatio: uniforms.uPixelRatio,
        uColor: colorUniforms.muted(),
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, [count, uniforms]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
