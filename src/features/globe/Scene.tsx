"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { ACESFilmicToneMapping } from "three";
import { damping } from "@/config/motion";
import { coupling } from "@/config/physics";
import { prefersReducedMotion } from "@/lib/accessibility";
import { clamp, damp } from "@/lib/math";
import { getDeviceTier, getMaxDpr } from "@/lib/performance";
import { cursorStore } from "@/features/cursor/cursor-store";
import { scrollStore } from "@/features/scroll/scroll-store";
import { buildArcDefinitions } from "./arcs";
import { createFrameUniforms } from "./frame-uniforms";
import { globeMachine, globeStore } from "./globe-store";
import { positionedNodes } from "./nodes";
import { SceneContext, type SceneContextValue } from "./scene-context";
import { CameraRig } from "./layers/CameraRig";
import { DebugTools } from "./layers/DebugTools";
import { Environment } from "./layers/Environment";
import { GlobeSystem } from "./layers/GlobeSystem";
import { LightingRig } from "./layers/LightingRig";
import { ParticleSystem } from "./layers/ParticleSystem";
import { PostProcessing } from "./layers/PostProcessing";

/**
 * SCENE ROOT.
 *
 * SceneRoot
 * ├── CameraRig            (owns the camera exclusively)
 * ├── Environment          (fog; gradient is DOM — see layer note)
 * ├── LightingRig          (key / rim / ambient / interaction)
 * ├── GlobeSystem          (core, surface, atmosphere, nodes, arcs, targets)
 * ├── ParticleSystem       (orbital dust, budgeted)
 * ├── PostProcessing       (bloom + output, high tier only)
 * ├── DebugTools           (dev-only stats)
 * └── FrameDirector        (updates shared uniforms ONCE per frame)
 *
 * Render-loop discipline: R3F's frameloop is the single rAF for GL.
 * FrameDirector is the only writer of the shared uniforms; every layer
 * references the same uniform objects, so all shaders read identical
 * per-frame signals. No React state is touched at frame rate.
 */

/** Updates shared frame uniforms; owns the intro state transition. */
function FrameDirector({
  scene,
}: {
  scene: SceneContextValue;
}) {
  const gl = useThree((s) => s.gl);
  const { uniforms, reducedMotion } = scene;

  useEffect(() => {
    uniforms.uPixelRatio.value = gl.getPixelRatio();
  }, [gl, uniforms]);

  useFrame((state, dt) => {
    const u = uniforms;

    if (reducedMotion) {
      // Frozen clock, full reveal: a calm, complete still image.
      u.uIntro.value = 1;
      u.uScrollProgress.value = scrollStore.get().progress;
      return;
    }

    u.uTime.value = state.clock.elapsedTime;
    u.uScrollProgress.value = damp(
      u.uScrollProgress.value,
      scrollStore.get().progress,
      damping.parallax,
      dt,
    );

    const cursor = cursorStore.get();
    u.uCursor.value.set(cursor.nx, -cursor.ny);
    u.uInteractionIntensity.value = damp(
      u.uInteractionIntensity.value,
      clamp(cursor.speed * coupling.speedToIntensity, 0, 1),
      4,
      dt,
    );

    // Intro: damp toward 1 once mounted; machine gets one clean event.
    if (u.uIntro.value < 1) {
      u.uIntro.value = Math.min(1, damp(u.uIntro.value, 1.02, 1.6, dt));
      if (u.uIntro.value >= 0.995 && !globeStore.get().introComplete) {
        globeStore.set({ introComplete: true });
        globeMachine.send("intro-complete");
      }
    }
  });

  return null;
}

export default function GlobeScene() {
  const tier = useMemo(getDeviceTier, []);
  const [reducedMotion] = useState(prefersReducedMotion);

  const sceneValue = useMemo<SceneContextValue>(
    () => ({ uniforms: createFrameUniforms(), tier, reducedMotion }),
    [tier, reducedMotion],
  );

  // Publish hover → active arc: the hovered node's chapter lights its
  // arcs. Subscribed coarsely (store), applied to a uniform (no renders).
  useEffect(() => {
    const nodes = positionedNodes();
    const defs = buildArcDefinitions(nodes);
    return globeStore.subscribe(() => {
      const id = globeStore.get().activeNodeId;
      if (!id) {
        sceneValue.uniforms.uActiveArc.value = -1;
        return;
      }
      const def = defs.find((d) => d.fromId === id || d.toId === id);
      sceneValue.uniforms.uActiveArc.value = def?.index ?? -1;
    });
  }, [sceneValue]);

  useEffect(() => {
    if (reducedMotion) globeMachine.send("reduce");
  }, [reducedMotion]);

  return (
    <Canvas
      dpr={[1, getMaxDpr(tier)]}
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      gl={{
        antialias: tier !== "low",
        powerPreference: "high-performance",
        alpha: true,
        toneMapping: ACESFilmicToneMapping,
      }}
      frameloop={reducedMotion ? "demand" : "always"}
      aria-hidden="true"
    >
      <SceneContext.Provider value={sceneValue}>
        <FrameDirector scene={sceneValue} />
        <CameraRig />
        <Environment />
        <LightingRig />
        <GlobeSystem />
        <ParticleSystem />
        <PostProcessing />
        <DebugTools />
      </SceneContext.Provider>
    </Canvas>
  );
}
