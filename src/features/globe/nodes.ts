import { globeNodes, type GlobeNode } from "@/data";
import { latLngToVec3 } from "@/lib/three-utils";
import type { Vector3 } from "three";

export interface PositionedNode extends GlobeNode {
  position: Vector3;
}

export const GLOBE_RADIUS = 1;

/**
 * Adapter between the content data layer and the scene: same records as
 * the DOM, projected onto the sphere. Business logic ends here — the
 * scene consumes positions and counts only.
 */
export function positionedNodes(): PositionedNode[] {
  return globeNodes().map((node) => ({
    ...node,
    position: latLngToVec3(node.location.lat, node.location.lng, GLOBE_RADIUS),
  }));
}
