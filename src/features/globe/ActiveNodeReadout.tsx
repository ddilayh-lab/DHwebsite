"use client";

import { useMemo } from "react";
import { globeNodes } from "@/data";
import { useStore } from "@/lib/store";
import { globeStore } from "./globe-store";

/**
 * DOM readout for the hovered globe node — hover is enhancement, never
 * the only path (the full node list sits beside it). Subscribes to the
 * coarse activeNodeId only; renders on hover change, not per frame.
 * aria-live announces the hovered city to screen readers using the
 * pointer alongside a sighted colleague.
 */
export function ActiveNodeReadout() {
  const activeNodeId = useStore(globeStore, (s) => s.activeNodeId);
  const byId = useMemo(
    () => new Map(globeNodes().map((n) => [n.location.id, n])),
    [],
  );
  const node = activeNodeId ? byId.get(activeNodeId) : null;

  return (
    <p
      role="status"
      aria-live="polite"
      className="u-label u-label-accent"
      style={{ fontSize: "var(--text-sm)", minHeight: "1.5em" }}
    >
      {node
        ? `${node.location.label}, ${node.location.country} — ${node.items.length} ${
            node.items.length === 1 ? "entry" : "entries"
          }`
        : ""}
    </p>
  );
}
