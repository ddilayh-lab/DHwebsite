/**
 * RESUME INTELLIGENCE PIPELINE — type system.
 *
 * Pipeline: source → entities (normalizer) → metrics → themes →
 * relationships (resolver) → graph → indexes → IA generator →
 * compiler → UI data layer (src/data). UI components never see these
 * types; they consume the compiled view models in src/data/types.
 */

// ---------------------------------------------------------------- domains
export type EntityType =
  | "person"
  | "education"
  | "professionalExperience"
  | "leadershipRole"
  | "governanceRole"
  | "project"
  | "conference"
  | "organization"
  | "location"
  | "communicationMethod";

/** Themes are derived from the resume; primarily internal metadata. */
export type Theme =
  | "leadership"
  | "governance"
  | "ai"
  | "technology"
  | "engineering"
  | "finance"
  | "strategy"
  | "consulting"
  | "sales"
  | "partnerships"
  | "entrepreneurship"
  | "sportsBusiness"
  | "publicSpeaking"
  | "globalExecution"
  | "education"
  | "communityImpact"
  | "womenInSTEM";

export type InteractionProfile =
  | "hero"
  | "chapter"
  | "globeNode"
  | "expandableCard"
  | "metricHighlight"
  | "timelineEvent"
  | "relationshipNode"
  | "contactPrompt"
  | "secondaryDetail";

// ---------------------------------------------------------------- entities
export interface ResumeEntity {
  id: string;
  type: EntityType;
  /** Editorial display title (role or item name). */
  title: string;
  /** Organization id (joins the Organization domain). */
  organizationId?: string;
  role?: string;
  locationId?: string;
  /** ISO-ish "YYYY-MM"; omitted when the resume gives none. */
  startDate?: string;
  endDate?: string;
  status: "current" | "completed";
  /** Editorial rewrite — concise, factual, interface-sized. */
  summary: string;
  /** Key into source.ts — every entity traces to resume text. */
  sourceRef: string;
  metricIds: string[];
  skills: string[];
  themes: Theme[];
  /** 1 = strongest story value within its group. */
  priority: number;
  /** 0..1 — visual weight budget across the interface. */
  displayWeight: number;
  interactionProfile: InteractionProfile;
  globeEligible: boolean;
  seoLabel?: string;
}

export interface MetricEntity {
  id: string;
  /** Display value, e.g. "36,000+", "$140,000", "9". */
  value: string;
  unit?: string;
  /** Short label, e.g. "students represented". */
  label: string;
  /** One-line context sentence. */
  context: string;
  sourceEntityId: string;
  /** explicit = stated in resume; derived = computed from stated facts */
  confidence: "explicit" | "derived";
  displayPriority: number;
}

export interface LocationEntity {
  id: string;
  label: string;
  country: string;
  lat: number;
  lng: number;
  kind: "home" | "study" | "work" | "impact";
}

export interface OrganizationEntity {
  id: string;
  name: string;
  kind: "university" | "company" | "studentOrg" | "conference" | "initiative";
}

// ----------------------------------------------------------- relationships
export type RelationshipType =
  | "belongs_to"
  | "located_in"
  | "occurred_during"
  | "contributed_to"
  | "led_to"
  | "supports"
  | "extends"
  | "shares_theme"
  | "shares_skill"
  | "shares_location"
  | "shares_organization"
  | "demonstrates"
  | "represents"
  | "connected_with"
  | "derived_from";

export interface Relationship {
  id: string;
  fromEntity: string;
  toEntity: string;
  relationshipType: RelationshipType;
  /** 0..1 — traversal/ranking weight. */
  strength: number;
  reason: string;
  /** May this edge surface in the UI (vs. internal ranking only)? */
  displayable: boolean;
}
