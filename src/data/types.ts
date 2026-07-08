/**
 * CANONICAL CONTENT MODEL.
 *
 * Every piece of personal content flows from these types. The DOM UI and
 * the WebGL globe render from the same records — no duplicated sources.
 * Editing content never requires touching layout or animation code.
 */

export type Category =
  | "engineering"
  | "ai"
  | "finance"
  | "consulting"
  | "entrepreneurship"
  | "leadership"
  | "education"
  | "community";

export type ChapterId = "lead" | "build" | "learn" | "connect";

export interface Location {
  id: string;
  /** Human label, e.g. "Istanbul" */
  label: string;
  country: string;
  lat: number;
  lng: number;
  /** What this place means in the story — drives globe node treatment. */
  kind: "home" | "study" | "work" | "impact";
}

/** A single content record: role, project, degree, board seat, talk… */
export interface ContentItem {
  id: string;
  title: string;
  organization?: string;
  dateRange?: { start: string; end?: string };
  category: Category;
  /** One editorial sentence. Long-form copy belongs to chapters. */
  summary: string;
  /** Quantified outcomes, rendered as emphasis, never invented by UI. */
  metrics?: string[];
  tags?: string[];
  /** Foreign keys — how the item joins the globe and the narrative. */
  locationId?: Location["id"];
  chapterId?: ChapterId;
  /** Lower renders first within a chapter. */
  priority: number;
}

export interface Chapter {
  id: ChapterId;
  index: number;
  title: string;
  /** Short kicker shown above the title. */
  kicker: string;
  /** Editorial narrative for the chapter intro. */
  narrative: string;
  /** Which categories this chapter aggregates by default. */
  categories: Category[];
  /** Hook for per-chapter visual treatment (scene + palette variant). */
  treatment: "horizon" | "grid" | "orbit" | "signal";
}

export interface ContactChannel {
  id: string;
  label: string;
  /** mailto:, https:, or /path for downloads. */
  href: string;
  kind: "email" | "linkedin" | "resume" | "scheduling" | "other";
  primary?: boolean;
}

export interface Profile {
  name: string;
  headline: string;
  /** The one-breath introduction used in the hero. */
  statement: string;
  domains: string[];
  baseLocationId: Location["id"];
}
