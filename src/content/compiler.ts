import { buildGlobeNodes, type GlobeNodePayload } from "./globe-adapter";
import { graph } from "./graph";
import { generateChapters, type ChapterId, type GeneratedChapter } from "./ia";
import { metricIndex, timelineIndex } from "./indexes";
import type { MetricEntity, ResumeEntity } from "./types";

/**
 * CONTENT COMPILER — the last pipeline stage before the UI data layer.
 * Turns graph entities into concise, editorial view models. Components
 * consume ONLY these outputs (via src/data); entities never leak into
 * the render tree.
 */

// ------------------------------------------------------------ view models
export interface CardContent {
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

export interface CompiledChapter {
  id: ChapterId;
  index: number;
  title: string;
  kicker: string;
  narrative: string;
  treatment: GeneratedChapter["treatment"];
  themes: string[];
  /** Chapter-level proof point, when its entities carry a strong metric. */
  headlineMetric?: { value: string; label: string };
}

export interface HeroContent {
  name: string;
  headline: string;
  statement: string;
  domains: string[];
  proofPoints: Array<{ value: string; label: string }>;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string[];
}

// -------------------------------------------------------------- formatting
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const [year, month] = iso.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

function formatMetric(m: MetricEntity): string {
  return `${m.value} ${m.label}`;
}

function toCard(e: ResumeEntity, chapterId: ChapterId): CardContent {
  return {
    id: e.id,
    title: e.title,
    organization: graph.organizationName(e.organizationId),
    dateRange: e.startDate
      ? {
          start: formatDate(e.startDate)!,
          end: e.status === "current" ? undefined : formatDate(e.endDate),
        }
      : undefined,
    category: e.themes[0],
    summary: e.summary,
    metrics: graph.metricsOf(e.id).slice(0, 3).map(formatMetric),
    tags: e.skills.slice(0, 4),
    locationId: e.locationId,
    chapterId,
    priority: e.priority,
  };
}

// ---------------------------------------------------------------- compile
const chapters = generateChapters();

export function compileChapters(): CompiledChapter[] {
  return chapters.map((c) => {
    const strongest = c.entities
      .flatMap((e) => graph.metricsOf(e.id))
      .sort((a, b) => a.displayPriority - b.displayPriority)[0];
    return {
      id: c.id,
      index: c.index,
      title: c.title,
      kicker: c.kicker,
      narrative: c.narrative,
      treatment: c.treatment,
      themes: c.themes,
      headlineMetric: strongest
        ? { value: strongest.value, label: strongest.label }
        : undefined,
    };
  });
}

export function compileCards(chapterId: ChapterId): CardContent[] {
  const chapter = chapters.find((c) => c.id === chapterId);
  return (chapter?.entities ?? []).map((e) => toCard(e, chapterId));
}

export function compileHero(): HeroContent {
  const person = graph.entities.find((e) => e.type === "person")!;
  const proof = person.metricIds
    .map((id) => graph.metric(id))
    .filter((m): m is MetricEntity => Boolean(m))
    .sort((a, b) => a.displayPriority - b.displayPriority)
    .slice(0, 4)
    .map((m) => ({ value: m.value, label: m.label }));

  return {
    name: person.title,
    headline: "Engineering, leadership and global execution — one system.",
    statement: person.summary,
    domains: ["Leadership", "Engineering", "AI", "Finance", "Partnerships"],
    proofPoints: proof,
  };
}

export function compileTimeline(): CardContent[] {
  return timelineIndex().map((e) => toCard(e, chapterForId(e.id)));
}

function chapterForId(id: string): ChapterId {
  for (const c of chapters) if (c.entities.some((e) => e.id === id)) return c.id;
  return "connect";
}

export function compileMetrics(): MetricEntity[] {
  return metricIndex();
}

export function compileGlobeNodes(): GlobeNodePayload[] {
  return buildGlobeNodes();
}

export function compileSeo(): SeoContent {
  const person = graph.entities.find((e) => e.type === "person")!;
  return {
    title: person.seoLabel ?? person.title,
    description:
      "Dilay Heybeli — UIC engineering management student and Student " +
      "Body Vice President representing 36,000+ students, with experience " +
      "across AI partnerships, venture strategy, operations and consulting " +
      "in New York, Bali, Dubai and Istanbul.",
    keywords: [
      "Dilay Heybeli",
      "engineering management",
      "student body vice president",
      "AI partnerships",
      "quantitative finance",
      "global leadership",
    ],
  };
}
