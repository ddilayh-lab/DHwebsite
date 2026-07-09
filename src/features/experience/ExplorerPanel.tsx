"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { globeNodes, timelineItems, type ContentItem } from "@/data";
import { useStore } from "@/lib/store";
import {
  experienceStore,
  focusEntity,
  setExplorerOpen,
} from "./experience-store";

/**
 * EXPLORER PANEL — multi-path navigation over the SAME canonical
 * entities. Four lenses (timeline, places, themes, organizations) are
 * four indexes over one graph; every entry resolves to the same card
 * via graph traversal. This is stage-four density: full professional
 * depth, on request only.
 */
type Lens = "timeline" | "places" | "themes" | "organizations";

const LENSES: Array<{ id: Lens; label: string }> = [
  { id: "timeline", label: "Timeline" },
  { id: "places", label: "Places" },
  { id: "themes", label: "Themes" },
  { id: "organizations", label: "Organizations" },
];

interface LensGroup {
  heading: string;
  items: ContentItem[];
}

function groupBy(items: ContentItem[], key: (i: ContentItem) => string): LensGroup[] {
  const map = new Map<string, ContentItem[]>();
  for (const item of items) {
    const k = key(item);
    (map.get(k) ?? map.set(k, []).get(k))!.push(item);
  }
  return [...map.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([heading, groupItems]) => ({ heading, items: groupItems }));
}

export function ExplorerPanel() {
  const open = useStore(experienceStore, (s) => s.explorerOpen);
  const [lens, setLens] = useState<Lens>("timeline");
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  const items = useMemo(timelineItems, []);

  const groups = useMemo<LensGroup[]>(() => {
    switch (lens) {
      case "timeline":
        return [{ heading: "Most recent first", items }];
      case "places":
        return globeNodes().map((n) => ({
          heading: `${n.location.label}, ${n.location.country}`,
          items: n.items,
        }));
      case "themes":
        return groupBy(items, (i) => i.category);
      case "organizations":
        return groupBy(items, (i) => i.organization ?? "Independent");
    }
  }, [lens, items]);

  // Dialog behavior: focus on open, Escape closes, focus returns.
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      panelRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setExplorerOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    (openerRef.current as HTMLElement | null)?.focus?.();
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="explorer-trigger"
        data-cursor="link"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setExplorerOpen(!open)}
      >
        Index
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Explore everything"
          tabIndex={-1}
          className="explorer-panel"
        >
          <div className="explorer-head">
            <p className="explorer-title">Everything, four ways</p>
            <button
              type="button"
              data-cursor="link"
              onClick={() => setExplorerOpen(false)}
              aria-label="Close index"
            >
              ✕
            </button>
          </div>

          <div role="tablist" aria-label="Explore by" className="explorer-lenses">
            {LENSES.map((l) => (
              <button
                key={l.id}
                role="tab"
                aria-selected={lens === l.id}
                data-cursor="link"
                onClick={() => setLens(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="explorer-groups">
            {groups.map((group) => (
              <section key={group.heading} aria-label={group.heading}>
                <p className="explorer-group-heading">{group.heading}</p>
                <ul role="list">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        data-cursor="link"
                        onClick={() =>
                          focusEntity(item.id, { reason: `Found via ${lens}` })
                        }
                      >
                        <span>{item.title}</span>
                        <span className="explorer-item-meta">
                          {item.organization ?? item.locationLabel ?? item.category}
                          {item.dateRange ? ` · ${item.dateRange.start}` : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
