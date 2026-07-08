"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Vector2 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { useScene } from "../scene-context";

/**
 * POST-PROCESSING — deliberately short chain: soft bloom + output
 * (tone mapping/color space). Depth cueing is handled in-shader
 * (cheaper than a depth pass); vignette is omitted — the DOM gradient
 * already frames the scene.
 *
 * Tier gating: composer exists ONLY on the high tier. Medium/low render
 * straight to screen with the renderer's tone mapping — graceful
 * degradation with zero extra passes. Bloom inputs are authored:
 * emissive layers push alpha/brightness, so a LOW threshold isn't needed.
 */
export function PostProcessing() {
  const { tier } = useScene();
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const enabled = tier === "high";

  const composer = useMemo(() => {
    if (!enabled) return null;
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new Vector2(size.width, size.height),
      /* strength */ 0.35,
      /* radius */ 0.6,
      /* threshold */ 0.72,
    );
    c.addPass(bloom);
    c.addPass(new OutputPass());
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, gl, scene, camera]);

  useEffect(() => {
    if (!composer) return;
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(gl.getPixelRatio());
  }, [composer, size, gl]);

  useEffect(() => {
    if (!composer) return;
    return () => {
      // Dispose passes and render targets — no leaked framebuffers.
      composer.passes.forEach((pass) => pass.dispose?.());
      composer.dispose();
    };
  }, [composer]);

  // Priority 1: takes over R3F's default render when the composer runs.
  useFrame(() => {
    composer?.render();
  }, enabled ? 1 : 0);

  return null;
}
