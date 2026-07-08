/**
 * DATA LAYER SELECTORS — the only place content sources are joined.
 * UI sections and the globe both consume these, guaranteeing a single
 * source of truth.
 */
import { chapters } from "./chapters";
import { contactChannels } from "./contact";
import { education } from "./education";
import { conferences, experience, leadership } from "./experience";
import { locationById, locations } from "./locations";
import { profile } from "./profile";
import { projects } from "./projects";
import type { ChapterId, ContentItem, Location } from "./types";

export { chapters, contactChannels, education, experience, leadership, conferences, locations, profile, projects };
export * from "./types";

const allItems: ContentItem[] = [
  ...experience,
  ...leadership,
  ...conferences,
  ...education,
  ...projects,
];

export function itemsForChapter(chapterId: ChapterId): ContentItem[] {
  return allItems
    .filter((item) => item.chapterId === chapterId)
    .sort((a, b) => a.priority - b.priority);
}

export interface GlobeNode {
  location: Location;
  items: ContentItem[];
}

/** Globe nodes derive from the same records as the DOM — never duplicated. */
export function globeNodes(): GlobeNode[] {
  return locations.map((location) => ({
    location,
    items: allItems
      .filter((item) => item.locationId === location.id)
      .sort((a, b) => a.priority - b.priority),
  }));
}

export function locationFor(item: ContentItem): Location | undefined {
  return item.locationId ? locationById.get(item.locationId) : undefined;
}
