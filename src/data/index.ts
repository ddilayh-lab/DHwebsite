/**
 * UI DATA LAYER — the only content surface components import.
 * Everything here is compiled from the knowledge graph
 * (src/content/*): no raw resume text, no hand-written portfolio
 * copy, no duplicated sources.
 */
import {
  compileCards,
  compileChapters,
  compileGlobeNodes,
  compileHero,
  compileSeo,
  compileTimeline,
} from "@/content/compiler";
import { graph } from "@/content/graph";
import type { ChapterId, Chapter, ContentItem, Location } from "./types";

export * from "./types";
export { contactChannels, primaryEmail } from "./contact";

// ------------------------------------------------------------- compiled
export const chapters: Chapter[] = compileChapters();
export const chapterById = new Map(chapters.map((c) => [c.id, c]));

export const heroContent = compileHero();
export const seoContent = compileSeo();

/** Profile view model (backed by the person entity via the compiler). */
export const profile = {
  name: heroContent.name,
  headline: heroContent.headline,
  statement: heroContent.statement,
  domains: heroContent.domains,
  proofPoints: heroContent.proofPoints,
};

const allCards: ContentItem[] = compileTimeline();
const cardById = new Map(allCards.map((c) => [c.id, c]));

export function itemsForChapter(chapterId: ChapterId): ContentItem[] {
  return compileCards(chapterId);
}

export function timelineItems(): ContentItem[] {
  return allCards;
}

// ---------------------------------------------------------------- globe
export interface GlobeNode {
  location: Location;
  items: ContentItem[];
}

const globePayloads = compileGlobeNodes();

/** Globe nodes resolve to the SAME cards the chapters render. */
export function globeNodes(): GlobeNode[] {
  return globePayloads.map((payload) => ({
    location: payload.location,
    items: payload.relatedEntities
      .map((e) => cardById.get(e.id))
      .filter((c): c is ContentItem => Boolean(c)),
  }));
}

export const locations: Location[] = globePayloads.map((p) => p.location);
const locationById = new Map(locations.map((l) => [l.id, l]));

export function locationFor(item: ContentItem): Location | undefined {
  return item.locationId ? locationById.get(item.locationId) : undefined;
}

/** Compiled metric objects for metric-highlight modules. */
export const metricHighlights = graph.metrics
  .slice()
  .sort((a, b) => a.displayPriority - b.displayPriority);
