/**
 * UI DATA LAYER TYPES — the view models components render.
 * These are the compiler's outputs (see src/content/compiler.ts);
 * the knowledge-graph entity types never reach components.
 */
export type ChapterId = "lead" | "build" | "learn" | "connect";

export interface Chapter {
  id: ChapterId;
  index: number;
  title: string;
  kicker: string;
  narrative: string;
  treatment: "horizon" | "grid" | "orbit" | "signal";
  themes: string[];
  headlineMetric?: { value: string; label: string };
}

export interface ContentItem {
  id: string;
  title: string;
  organization?: string;
  dateRange?: { start: string; end?: string };
  category: string;
  summary: string;
  metrics: string[];
  tags: string[];
  locationId?: string;
  chapterId: ChapterId;
  priority: number;
}

export interface Location {
  id: string;
  label: string;
  country: string;
  lat: number;
  lng: number;
  kind: "home" | "study" | "work" | "impact";
}

export interface ContactChannel {
  id: string;
  label: string;
  href: string;
  kind: "email" | "linkedin" | "resume" | "scheduling" | "other";
  primary?: boolean;
}

export interface Profile {
  name: string;
  headline: string;
  statement: string;
  domains: string[];
  proofPoints: Array<{ value: string; label: string }>;
}
