"use client";

import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  ShaderMaterial,
} from "three";
import { coupling, friction, limits } from "@/config/physics";
import { damping } from "@/config/motion";
import { damp } from "@/lib/math";
import { Inertia } from "@/lib/physics";
import { getParticleBudget } from "@/lib/performance";
import { fibonacciSphere } from "@/lib/three-utils";
import { scrollStore } from "@/features/scroll/scroll-store";
import { scrollToTarget } from "@/features/scroll/scroll-api";
import { focusChapter, transitionStore } from "@/features/transitions/transition-store";
import { resolveInteractionMode } from "@/features/interaction/interaction-manager";
import { buildArcs } from "../arcs";
import { colorUniforms } from "../frame-uniforms";
import { globeMachine, globeStore } from "../globe-store";
import { GLOBE_RADIUS, positionedNodes, type PositionedNode } from "../nodes";
import { useScene } from "../scene-context";
import { atmosphereFragment, atmosphereVertex } from "../shaders/atmosphere";
import { arcsFragment, arcsVertex } from "../shaders/arcs";
import { nodesFragment, nodesVertex } from "../shaders/nodes";
import { surfaceFragment, surfaceVertex } from "../shaders/surface";

/**
 * GLOBE SYSTEM — the signature feature, composed of single-purpose
 * layers sharing one rotating group:
 *
 *   GlobeCore          matte lit sphere (receives the LightingRig)
 *   SurfaceLayer       procedural point shell (shaders/surface)
 *   AtmosphereLayer    fresnel halo (shaders/atmosphere)
 *   LocationNodes      pulsing city markers (shaders/nodes)
 *   ArcPaths           chapter connections (shaders/arcs, 1 draw call)
 *   InteractionTargets invisible raycast spheres (hover/click/drag)
 *
 * Rotation physics lives HERE (yaw/pitch on the group): drag applies
 * impulses to an Inertia integrator, release decays with friction,
 * idle blends back to ambient spin, focus damps yaw toward the active
 * node. The camera never rotates around the globe — so drag and camera
 * motion cannot compete over one property.
 */
export function GlobeSystem() {
  const group = useRef<Group>(null);
  const { reducedMotion } = useScene();

  const nodes = useMemo(positionedNodes, []);
  const arcs = useMemo(buildArcs, []);

  // --- rotation physics state (refs: never React state per frame) ---
  const yawInertia = useMemo(
    () => new Inertia(friction.globeSpin, limits.maxSpinVelocity),
    [],
  );
  const pitchInertia = useMemo(
    () => new Inertia(friction.globeSpin, limits.maxSpinVelocity),
    [],
  );
  const rotation = useRef({ yaw: 0, pitch: 0 });

  // Focus targets: the yaw/pitch that bring a node to face the camera.
  const nodeYawTargets = useMemo(() => {
    const map = new Map<string, { yaw: number; pitch: number }>();
    for (const node of nodes) {
      const p = node.position;
      map.set(node.location.id, {
        yaw: -Math.atan2(p.x, p.z),
        // Half-strength pitch keeps high-latitude nodes visible without
        // tipping the globe on its side.
        pitch: Math.atan2(p.y, Math.hypot(p.x, p.z)) * 0.5,
      });
    }
    return map;
  }, [nodes]);

  const chapterFirstNode = useMemo(() => {
    const map = new Map<string, string>();
    for (const node of nodes) {
      for (const item of node.items) {
        if (item.chapterId && !map.has(item.chapterId)) {
          map.set(item.chapterId, node.location.id);
        }
      }
    }
    return map;
  }, [nodes]);

  useFrame((_state, dt) => {
    const g = group.current;
    if (!g) return;
    const mode = resolveInteractionMode();
    const r = rotation.current;

    if (mode === "reduced-motion") {
      g.rotation.set(0.1, 0.5, 0);
      return;
    }

    if (mode === "dragging") {
      r.yaw += yawInertia.velocity * dt;
      r.pitch += pitchInertia.velocity * dt;
    } else if (mode === "focused") {
      const focusedId =
        globeStore.get().activeNodeId ??
        chapterFirstNode.get(transitionStore.get().focusedChapter ?? "") ??
        null;
      const target = focusedId ? nodeYawTargets.get(focusedId) : undefined;
      if (target) {
        // Shortest-path yaw approach (yaw accumulates unwrapped).
        const twoPi = Math.PI * 2;
        const delta =
          ((((target.yaw - r.yaw + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI;
        r.yaw = damp(r.yaw, r.yaw + delta, damping.camera, dt);
        r.pitch = damp(r.pitch, target.pitch, damping.camera, dt);
      }
      yawInertia.update(dt);
      pitchInertia.update(dt);
    } else {
      // idle / hover / scrolling: released momentum + ambient spin.
      const released = yawInertia.update(dt);
      const ambient =
        mode === "hover" ? coupling.ambientSpin * 0.4 : coupling.ambientSpin;
      r.yaw += (released + ambient) * dt;
      r.pitch = damp(
        r.pitch + pitchInertia.update(dt) * dt,
        scrollStore.get().progress * 0.25 - 0.05,
        damping.parallax,
        dt,
      );
    }

    r.pitch = Math.max(-limits.maxPitch, Math.min(limits.maxPitch, r.pitch));
    g.rotation.y = r.yaw;
    g.rotation.x = r.pitch;
  });

  return (
    <group ref={group}>
      <GlobeCore />
      <SurfaceLayer />
      <AtmosphereLayer />
      <LocationNodes nodes={nodes} />
      <ArcPaths geometry={arcs.geometry} />
      <InteractionTargets
        nodes={nodes}
        yawInertia={yawInertia}
        pitchInertia={pitchInertia}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

/** Matte lit sphere: the body the LightingRig plays across. */
function GlobeCore() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 0.985, 48, 48]} />
      <meshStandardMaterial color="#141419" roughness={0.85} metalness={0.15} />
    </mesh>
  );
}

/** Procedural point shell — the globe's stylized, breathing surface. */
function SurfaceLayer() {
  const { uniforms, tier } = useScene();
  const count = getParticleBudget(tier);

  const { geometry, material } = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new BufferAttribute(fibonacciSphere(count, GLOBE_RADIUS), 3),
    );
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();
    geo.setAttribute("aSeed", new BufferAttribute(seeds, 1));

    const mat = new ShaderMaterial({
      vertexShader: surfaceVertex,
      fragmentShader: surfaceFragment,
      uniforms: {
        uTime: uniforms.uTime,
        uScrollProgress: uniforms.uScrollProgress,
        uIntro: uniforms.uIntro,
        uInteractionIntensity: uniforms.uInteractionIntensity,
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

  return <points geometry={geometry} material={material} />;
}

/** Fresnel halo, biased toward the cursor (see shaders/atmosphere). */
function AtmosphereLayer() {
  const { uniforms, tier } = useScene();
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uColorAccent: colorUniforms.glow(),
          uAtmosphereStrength: { value: tier === "low" ? 0.3 : 0.45 },
          uCursor: uniforms.uCursor,
          uIntro: uniforms.uIntro,
        },
        transparent: true,
        depthWrite: false,
        side: BackSide,
        blending: AdditiveBlending,
      }),
    [uniforms, tier],
  );
  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh material={material} scale={1.06}>
      <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
    </mesh>
  );
}

/** Pulsing city markers, GPU-animated from one clock. */
function LocationNodes({ nodes }: { nodes: PositionedNode[] }) {
  const { uniforms } = useScene();

  const { geometry, material } = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(nodes.length * 3);
    const phases = new Float32Array(nodes.length);
    const indices = new Float32Array(nodes.length);
    nodes.forEach((node, i) => {
      node.position.clone().multiplyScalar(1.01).toArray(positions, i * 3);
      phases[i] = (i * 0.618034) % 1;
      indices[i] = i;
    });
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new BufferAttribute(phases, 1));
    geo.setAttribute("aIndex", new BufferAttribute(indices, 1));

    const mat = new ShaderMaterial({
      vertexShader: nodesVertex,
      fragmentShader: nodesFragment,
      uniforms: {
        uTime: uniforms.uTime,
        uHoverNode: uniforms.uHoverNode,
        uIntro: uniforms.uIntro,
        uPixelRatio: uniforms.uPixelRatio,
        uColor: colorUniforms.accent(),
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, [nodes, uniforms]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <points geometry={geometry} material={material} />;
}

/** All chapter connections in ONE LineSegments draw call. */
function ArcPaths({ geometry }: { geometry: BufferGeometry }) {
  const { uniforms } = useScene();
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: arcsVertex,
        fragmentShader: arcsFragment,
        uniforms: {
          uTime: uniforms.uTime,
          uColor: colorUniforms.accent(),
          uIntro: uniforms.uIntro,
          uActiveArc: uniforms.uActiveArc,
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [uniforms],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <lineSegments geometry={geometry} material={material} />;
}

/**
 * INTERACTION TARGETS — the only pointer-aware scene objects.
 * An invisible instanced mesh (one instance per node) gives reliable
 * raycast hit areas for hover/click; an invisible full-globe sphere
 * receives drag gestures and feeds the inertia integrators.
 */
function InteractionTargets({
  nodes,
  yawInertia,
  pitchInertia,
  reducedMotion,
}: {
  nodes: PositionedNode[];
  yawInertia: Inertia;
  pitchInertia: Inertia;
  reducedMotion: boolean;
}) {
  const { uniforms } = useScene();
  const instanced = useRef<InstancedMesh>(null);
  const dragState = useRef({ dragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const mesh = instanced.current;
    if (!mesh) return;
    const m = new Matrix4();
    nodes.forEach((node, i) => {
      m.setPosition(node.position);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  const setHover = (index: number | null) => {
    uniforms.uHoverNode.value = index ?? -1;
    globeStore.set({
      activeNodeId: index === null ? null : nodes[index].location.id,
      interaction: index === null ? "idle" : "hover",
    });
    globeMachine.send(index === null ? "pointer-leave" : "pointer-enter");
  };

  const onNodeClick = (index: number) => {
    const node = nodes[index];
    const chapterId = node.items[0]?.chapterId;
    if (!chapterId) return;
    focusChapter(chapterId);
    scrollToTarget(`#chapter-${chapterId}`);
    // Release focus once the scroll settles so the camera returns to
    // scroll-driven behavior instead of staying locked forever.
    const unsubscribe = scrollStore.subscribe(() => {
      if (!scrollStore.get().isScrolling) {
        focusChapter(null);
        unsubscribe();
      }
    });
  };

  // --- drag physics: pointer deltas → angular impulses ---
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (reducedMotion) return;
    dragState.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
    globeStore.set({ interaction: "dragging" });
    globeMachine.send("drag-start");
    yawInertia.set(0);
    pitchInertia.set(0);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const s = dragState.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    // Velocity-based: momentum carries into release (inertia + friction).
    yawInertia.set(dx * coupling.dragToYaw * 60);
    pitchInertia.set(dy * coupling.dragToPitch * 60);
  };

  const endDrag = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    globeStore.set({ interaction: "idle" });
    globeMachine.send("drag-end");
  };

  return (
    <>
      <instancedMesh
        ref={instanced}
        args={[undefined, undefined, nodes.length]}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) setHover(e.instanceId);
        }}
        onPointerOut={() => setHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) onNodeClick(e.instanceId);
        }}
      >
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </instancedMesh>

      <mesh
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <sphereGeometry args={[GLOBE_RADIUS * 1.05, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
}
