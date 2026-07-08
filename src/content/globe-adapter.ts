import { graph } from "./graph";
import { chapterFor, type ChapterId } from "./ia";
import { locationIndex } from "./indexes";
import type { LocationEntity, MetricEntity, ResumeEntity, Theme } from "./types";

/**
 * GLOBE DATA ADAPTER.
 *
 * Knowledge Graph → Location Index → relevance scoring → globe nodes.
 * A location becomes a node ONLY if resume-backed entities occurred
 * there (no manual nodes, no tourism). The Three.js system consumes
 * this payload and nothing else.
 */
export interface GlobeNodePayload {
  id: string;
  location: LocationEntity;
  coordinates: { lat: number; lng: number };
  relatedEntities: ResumeEntity[];
  primaryTheme: Theme;
  secondaryThemes: Theme[];
  displayPriority: number;
  /** Chapter the node navigates to (its strongest entity's chapter). */
  chapterLink: ChapterId;
  /** One editorial line for overlays/readouts. */
  summary: string;
  metrics: MetricEntity[];
}

/** Narrative value score: entity weight + metric strength + recency. */
function relevance(entities: ResumeEntity[]): number {
  return entities.reduce((score, e) => {
    const metricBonus = e.metricIds.length * 0.25;
    const currentBonus = e.status === "current" ? 0.2 : 0;
    return score + e.displayWeight + metricBonus + currentBonus;
  }, 0);
}

function dominantThemes(entities: ResumeEntity[]): Theme[] {
  const counts = new Map<Theme, number>();
  for (const e of entities) {
    for (const t of e.themes) counts.set(t, (counts.get(t) ?? 0) + e.displayWeight);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

export function buildGlobeNodes(): GlobeNodePayload[] {
  const nodes: GlobeNodePayload[] = [];

  for (const [location, all] of locationIndex()) {
    const related = all.filter((e) => e.globeEligible);
    if (related.length === 0) continue; // no narrative value → no node

    const themes = dominantThemes(related);
    const top = related[0];
    nodes.push({
      id: location.id,
      location,
      coordinates: { lat: location.lat, lng: location.lng },
      relatedEntities: related,
      primaryTheme: themes[0],
      secondaryThemes: themes.slice(1, 4),
      displayPriority: relevance(related),
      chapterLink: chapterFor(top),
      summary: top.summary,
      metrics: related.flatMap((e) => graph.metricsOf(e.id)).slice(0, 3),
    });
  }

  return nodes.sort((a, b) => b.displayPriority - a.displayPriority);
}
