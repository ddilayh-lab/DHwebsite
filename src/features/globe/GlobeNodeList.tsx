"use client";

import type { GlobeNode } from "@/data";
import { focusEntity } from "@/features/experience/experience-store";
import { globeStore } from "./globe-store";

/**
 * Accessible node list — the HTML equivalent of the globe's markers,
 * and an input to it: hovering an entry lights the node and its
 * chapter arc (same store the raycaster writes); activating one is
 * graph traversal to that city's strongest entity card. Keyboard and
 * touch users get exactly the pointer experience.
 */
export function GlobeNodeList({ nodes }: { nodes: GlobeNode[] }) {
  return (
    <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3" role="list">
      {nodes.map(({ location, items }) => (
        <li key={location.id}>
          <button
            type="button"
            data-cursor="link"
            className="u-label"
            style={{ color: "var(--text-primary)" }}
            onPointerEnter={() => globeStore.set({ activeNodeId: location.id })}
            onPointerLeave={() => {
              if (globeStore.get().activeNodeId === location.id) {
                globeStore.set({ activeNodeId: null });
              }
            }}
            onFocus={() => globeStore.set({ activeNodeId: location.id })}
            onBlur={() => {
              if (globeStore.get().activeNodeId === location.id) {
                globeStore.set({ activeNodeId: null });
              }
            }}
            onClick={() =>
              items[0] &&
              focusEntity(items[0].id, {
                reason: `From ${location.label}`,
              })
            }
          >
            {location.label}
            <span style={{ color: "var(--text-muted)" }}>
              {" "}
              · {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
