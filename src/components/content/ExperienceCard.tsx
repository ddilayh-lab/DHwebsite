"use client";

import { useCallback } from "react";
import type { ContentItem } from "@/data/types";
import { useStore } from "@/lib/store";
import { globeStore } from "@/features/globe/globe-store";
import {
  experienceStore,
  focusEntity,
  toggleExpanded,
} from "@/features/experience/experience-store";

/**
 * EXPERIENCE CARD — the progressive-disclosure unit.
 *
 * Interaction contract: idle → hover/focus (globe node lights up, ring
 * cursor) → intent (button focus) → activation (expand) → feedback
 * (density animates in) → completion (aria-expanded) → recovery
 * (collapse resolves the same transition in reverse; CSS transitions
 * are interruptible by construction, so mid-animation reversals never
 * snap).
 *
 * Collapsed = stage-one density: role, organization, date, one metric.
 * Expanded = full summary, all metrics, skills, place, and graph
 * relationships — each related item is a traversal, not a link to a
 * page.
 */
export function ExperienceCard({ item }: { item: ContentItem }) {
  const open = useStore(experienceStore, (s) => Boolean(s.expanded[item.id]));
  const focused = useStore(experienceStore, (s) => s.focusedEntityId === item.id);

  // UI → globe: attention on a card lights its node (and chapter arc).
  const onEnter = useCallback(() => {
    if (item.locationId) globeStore.set({ activeNodeId: item.locationId });
  }, [item.locationId]);
  const onLeave = useCallback(() => {
    if (globeStore.get().activeNodeId === item.locationId) {
      globeStore.set({ activeNodeId: null });
    }
  }, [item.locationId]);

  return (
    <article
      data-entity-card={item.id}
      data-category={item.category}
      data-focused={focused || undefined}
      className="experience-card"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <h3 className="contents">
        <button
          type="button"
          className="card-toggle"
          aria-expanded={open}
          aria-controls={`card-body-${item.id}`}
          data-cursor="view"
          data-cursor-label={open ? "close" : "open"}
          onClick={() => toggleExpanded(item.id)}
        >
          <span className="card-heading">
            <span className="font-display" style={{ fontSize: "var(--text-lg)" }}>
              {item.title}
            </span>
            {item.organization ? (
              <span style={{ color: "var(--text-muted)", fontSize: "var(--text-lg)" }}>
                {" "}
                — {item.organization}
              </span>
            ) : null}
          </span>

          <span className="card-meta">
            {item.metrics[0] ? (
              <span className="card-chip">{item.metrics[0]}</span>
            ) : null}
            {item.dateRange ? (
              <span className="card-date">
                {item.dateRange.start}
                {item.dateRange.end ? ` – ${item.dateRange.end}` : " – now"}
              </span>
            ) : null}
            <span className="card-indicator" aria-hidden="true" data-open={open}>
              +
            </span>
          </span>
        </button>
      </h3>

      <div className="card-body" data-open={open} id={`card-body-${item.id}`}>
        <div className="card-body-inner">
          <p style={{ color: "var(--text-muted)", maxWidth: "56ch" }}>{item.summary}</p>

          {item.metrics.length > 1 && (
            <ul className="card-metrics" role="list">
              {item.metrics.slice(1).map((metric) => (
                <li key={metric} className="card-chip">
                  {metric}
                </li>
              ))}
            </ul>
          )}

          <p className="card-facts">
            {item.locationLabel ? <span>{item.locationLabel}</span> : null}
            {item.tags.length > 0 ? <span>{item.tags.join(" · ")}</span> : null}
          </p>

          {item.related.length > 0 && (
            <nav aria-label={`Related to ${item.title}`} className="card-related">
              <p className="card-related-label">Connected</p>
              <ul role="list">
                {item.related.map((ref) => (
                  <li key={ref.id}>
                    <button
                      type="button"
                      data-cursor="link"
                      onClick={() => focusEntity(ref.id, { reason: ref.reason })}
                      title={ref.reason}
                    >
                      {ref.title}
                      {ref.organization ? ` · ${ref.organization}` : ""}
                      <span aria-hidden="true"> ↗</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </article>
  );
}
