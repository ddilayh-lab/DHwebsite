import { BufferAttribute, BufferGeometry, CubicBezierCurve3, Vector3 } from "three";
import type { ChapterId } from "@/data/types";
import { GLOBE_RADIUS, positionedNodes, type PositionedNode } from "./nodes";

/**
 * ARC MODEL — connections are DERIVED FROM CONTENT, not drawn by hand:
 * nodes whose items share a chapter get linked in sequence. The globe
 * literally renders the structure of the story (systems thinking, not
 * travel routes).
 */
export interface ArcDefinition {
  index: number;
  chapterId: ChapterId;
  fromId: string;
  toId: string;
}

const SEGMENTS_PER_ARC = 48;

function chaptersOf(node: PositionedNode): ChapterId[] {
  return [...new Set(node.items.map((i) => i.chapterId).filter(Boolean))] as ChapterId[];
}

export function buildArcDefinitions(nodes: PositionedNode[]): ArcDefinition[] {
  const byChapter = new Map<ChapterId, PositionedNode[]>();
  for (const node of nodes) {
    for (const chapter of chaptersOf(node)) {
      const list = byChapter.get(chapter) ?? [];
      list.push(node);
      byChapter.set(chapter, list);
    }
  }

  const defs: ArcDefinition[] = [];
  let index = 0;
  for (const [chapterId, group] of byChapter) {
    for (let i = 0; i < group.length - 1; i++) {
      defs.push({
        index: index++,
        chapterId,
        fromId: group[i].location.id,
        toId: group[i + 1].location.id,
      });
    }
  }
  return defs;
}

/**
 * Bake every arc into ONE LineSegments geometry (single draw call).
 * Curves are computed once here; all animation is GPU-side (see
 * shaders/arcs.ts for the trade-off note).
 */
export function buildArcGeometry(
  nodes: PositionedNode[],
  defs: ArcDefinition[],
): BufferGeometry {
  const byId = new Map(nodes.map((n) => [n.location.id, n]));
  const vertsPerArc = SEGMENTS_PER_ARC * 2; // line segment pairs
  const positions = new Float32Array(defs.length * vertsPerArc * 3);
  const progress = new Float32Array(defs.length * vertsPerArc);
  const arcIndex = new Float32Array(defs.length * vertsPerArc);
  const seed = new Float32Array(defs.length * vertsPerArc);

  let v = 0;
  for (const def of defs) {
    const from = byId.get(def.fromId)!.position;
    const to = byId.get(def.toId)!.position;

    // Lift control points above the sphere, higher for longer arcs.
    const distance = from.distanceTo(to);
    const lift = GLOBE_RADIUS * (0.25 + distance * 0.3);
    const c1 = from.clone().lerp(to, 0.33).normalize().multiplyScalar(GLOBE_RADIUS + lift);
    const c2 = from.clone().lerp(to, 0.66).normalize().multiplyScalar(GLOBE_RADIUS + lift);
    const curve = new CubicBezierCurve3(from, c1, c2, to);
    const points = curve.getPoints(SEGMENTS_PER_ARC);
    const arcSeed = (def.index * 0.618034) % 1; // golden-ratio phase spread

    for (let i = 0; i < SEGMENTS_PER_ARC; i++) {
      for (const [pt, t] of [
        [points[i], i / SEGMENTS_PER_ARC],
        [points[i + 1], (i + 1) / SEGMENTS_PER_ARC],
      ] as [Vector3, number][]) {
        positions[v * 3] = pt.x;
        positions[v * 3 + 1] = pt.y;
        positions[v * 3 + 2] = pt.z;
        progress[v] = t;
        arcIndex[v] = def.index;
        seed[v] = arcSeed;
        v++;
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aProgress", new BufferAttribute(progress, 1));
  geometry.setAttribute("aArc", new BufferAttribute(arcIndex, 1));
  geometry.setAttribute("aSeed", new BufferAttribute(seed, 1));
  return geometry;
}

/** Convenience: everything the ArcPaths layer needs, derived once. */
export function buildArcs() {
  const nodes = positionedNodes();
  const defs = buildArcDefinitions(nodes);
  return { nodes, defs, geometry: buildArcGeometry(nodes, defs) };
}
