"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
} from "three";
import { colors } from "@/config/design-tokens";
import { damping } from "@/config/motion";
import { prefersReducedMotion } from "@/lib/accessibility";
import { damp } from "@/lib/math";
import {
  getDeviceTier,
  getMaxDpr,
  getParticleBudget,
} from "@/lib/performance";
import { fibonacciSphere } from "@/lib/three-utils";
import { cursorStore } from "@/features/cursor/cursor-store";
import { scrollStore } from "@/features/scroll/scroll-store";
import { globeStore } from "./globe-store";
import { GLOBE_RADIUS, positionedNodes } from "./nodes";

/**
 * GLOBE SCENE — Phase 2A scaffold.
 *
 * Architecture is final: layered scene (particle field + data nodes),
 * per-frame values read imperatively from the cursor/scroll stores
 * (never via React state), damped rotation, device-tier budgets.
 * Custom shaders, arcs and environment lighting land in Phase 2B on
 * top of these layers.
 */

function ParticleField() {
  const tier = useMemo(getDeviceTier, []);
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new Float32BufferAttribute(
        fibonacciSphere(getParticleBudget(tier), GLOBE_RADIUS),
        3,
      ),
    );
    return g;
  }, [tier]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.008}
        color={new Color(colors.textMuted)}
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function DataNodes() {
  const nodes = useMemo(positionedNodes, []);
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const positions = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => n.position.toArray(positions, i * 3));
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return g;
  }, [nodes]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.045}
        color={new Color(colors.accentActive)}
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function GlobeRig() {
  const group = useRef<Group>(null);
  const reduced = useMemo(prefersReducedMotion, []);

  useFrame((_state, dt) => {
    const g = group.current;
    if (!g) return;

    if (reduced) return; // static globe under reduced motion

    // Ambient spin + scroll-linked pitch + damped cursor parallax —
    // all read imperatively; zero React renders per frame.
    const { spinVelocity } = globeStore.get();
    const { nx, ny } = cursorStore.get();
    const { progress } = scrollStore.get();

    g.rotation.y += spinVelocity * dt;
    g.rotation.x = damp(g.rotation.x, ny * 0.15 + progress * 0.4, damping.parallax, dt);
    g.rotation.z = damp(g.rotation.z, nx * -0.05, damping.parallax, dt);
  });

  return (
    <group ref={group}>
      <ParticleField />
      <DataNodes />
    </group>
  );
}

export default function GlobeScene() {
  const tier = useMemo(getDeviceTier, []);

  return (
    <Canvas
      dpr={[1, getMaxDpr(tier)]}
      camera={{ position: [0, 0, 2.6], fov: 40 }}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance" }}
      // The canvas is presentational; content lives in accessible HTML.
      aria-hidden="true"
      frameloop="always"
    >
      <AdaptiveDpr pixelated />
      <GlobeRig />
    </Canvas>
  );
}
