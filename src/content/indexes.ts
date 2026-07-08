import { graph } from "./graph";
import type { LocationEntity, MetricEntity, ResumeEntity, Theme } from "./types";

/**
 * GRAPH INDEXES — multiple views over the SAME canonical nodes.
 * Every index returns references to graph entities; nothing is copied.
 */

const content = graph.entities.filter((e) => e.type !== "person");

/** Timeline Index — most recent start first; undated items last. */
export function timelineIndex(): ResumeEntity[] {
  return [...content].sort((a, b) =>
    (b.startDate ?? "0000").localeCompare(a.startDate ?? "0000"),
  );
}

/** Theme Index — theme → entities, strongest priority first. */
export function themeIndex(): Map<Theme, ResumeEntity[]> {
  const map = new Map<Theme, ResumeEntity[]>();
  for (const e of content) {
    for (const theme of e.themes) {
      (map.get(theme) ?? map.set(theme, []).get(theme))!.push(e);
    }
  }
  for (const list of map.values()) list.sort((a, b) => a.priority - b.priority);
  return map;
}

/** Location Index — location → entities that occurred there. */
export function locationIndex(): Map<LocationEntity, ResumeEntity[]> {
  const map = new Map<LocationEntity, ResumeEntity[]>();
  for (const location of graph.locations) {
    map.set(
      location,
      graph.entitiesAt(location.id).sort((a, b) => a.priority - b.priority),
    );
  }
  return map;
}

/** Organization Index — organization name → entities. */
export function organizationIndex(): Map<string, ResumeEntity[]> {
  const map = new Map<string, ResumeEntity[]>();
  for (const e of content) {
    const name = graph.organizationName(e.organizationId);
    if (!name) continue;
    (map.get(name) ?? map.set(name, []).get(name))!.push(e);
  }
  return map;
}

/** Type-scoped indexes. */
export const leadershipIndex = () =>
  content.filter((e) => e.type === "leadershipRole" || e.type === "governanceRole");
export const educationIndex = () => content.filter((e) => e.type === "education");
export const projectIndex = () => content.filter((e) => e.type === "project");
export const conferenceIndex = () => content.filter((e) => e.type === "conference");

/** Metric Index — all metrics by display priority. */
export function metricIndex(): MetricEntity[] {
  return [...graph.metrics].sort((a, b) => a.displayPriority - b.displayPriority);
}

/** Priority Index — everything by story value (priority, then weight). */
export function priorityIndex(): ResumeEntity[] {
  return [...content].sort(
    (a, b) => a.priority - b.priority || b.displayWeight - a.displayWeight,
  );
}
