"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import { damping } from "@/config/motion";
import { damp } from "@/lib/math";
import { prefersReducedMotion } from "@/lib/accessibility";
import { cursorStore } from "@/features/cursor/cursor-store";
import { scrollStore } from "@/features/scroll/scroll-store";
import { resolveInteractionMode } from "@/features/interaction/interaction-manager";

/**
 * CAMERA RIG.
 *
 * Owns the camera exclusively — no other node writes camera transforms.
 * Every parameter converges on a target via damping, so any change of
 * intent (scroll, cursor, focus, viewport) is interruptible by
 * construction: targets move, the camera follows, nothing ever jumps.
 *
 * Inputs: scroll progress, cursor position, interaction mode (focus),
 * reduced-motion, viewport aspect. Globe yaw/pitch live on the globe
 * group (GlobeSystem) so drag physics and camera never fight over the
 * same property.
 */
const BASE_DISTANCE = 3.4;
const FOCUS_DISTANCE = 2.95;
const FOV = 40;

export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const target = useRef(new Vector3(0, 0, 0));
  const reduced = useRef(prefersReducedMotion());

  useEffect(() => {
    camera.fov = FOV;
    // Narrow viewports need more distance to keep the globe framed.
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((_state, dt) => {
    const mode = resolveInteractionMode();
    if (reduced.current || mode === "reduced-motion") {
      camera.position.set(0, 0, BASE_DISTANCE * aspectCompensation(size));
      camera.lookAt(target.current);
      return;
    }

    const { nx, ny } = cursorStore.get();
    const { progress } = scrollStore.get();

    const focus = mode === "focused";
    const distance =
      (focus ? FOCUS_DISTANCE : BASE_DISTANCE + progress * 0.25) *
      aspectCompensation(size);

    // Cursor parallax: a small, damped orbit offset — attention, not control.
    const targetX = nx * 0.18;
    const targetY = -ny * 0.12 + progress * 0.1;

    camera.position.x = damp(camera.position.x, targetX, damping.camera, dt);
    camera.position.y = damp(camera.position.y, targetY, damping.camera, dt);
    camera.position.z = damp(camera.position.z, distance, damping.camera, dt);
    camera.lookAt(target.current);
  });

  return null;
}

function aspectCompensation(size: { width: number; height: number }) {
  const aspect = size.width / Math.max(size.height, 1);
  // Below square aspect, back off so the sphere never clips the frame.
  return aspect < 1 ? 1 + (1 - aspect) * 0.9 : 1;
}
