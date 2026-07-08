import { graph } from "./graph";
import type { ResumeEntity, Theme } from "./types";

/**
 * INFORMATION ARCHITECTURE GENERATOR.
 *
 * Chapters are not hand-assigned: each entity's chapter falls out of a
 * theme-affinity score (+ small type priors), so the IA is literally
 * derived from the resume's theme structure. The graph confirmed the
 * Lead / Build / Learn / Connect hypothesis: leadership & governance
 * mass (USG, Flames Force, PMT, boards), a building cluster (Flowcode,
 * EX Venture/ZERO-X, podcast), an education spine (UIC, Cambridge) and
 * a global/connection cluster (Istanbul, Dubai, osQF, teaching, LEAF).
 */

export type ChapterId = "lead" | "build" | "learn" | "connect";

export interface GeneratedChapter {
  id: ChapterId;
  index: number;
  title: string;
  kicker: string;
  narrative: string;
  treatment: "horizon" | "grid" | "orbit" | "signal";
  themes: Theme[];
  entities: ResumeEntity[];
}

/** Theme→chapter affinity weights (the scoring model). */
const affinity: Record<ChapterId, Partial<Record<Theme, number>>> = {
  lead: { leadership: 3, governance: 3, sportsBusiness: 2 },
  build: {
    entrepreneurship: 3,
    ai: 2.5,
    technology: 2,
    partnerships: 1.5,
    sales: 1.5,
    strategy: 1.5,
    finance: 1,
  },
  learn: { education: 3, engineering: 2, finance: 1.5 },
  connect: {
    globalExecution: 2.5,
    communityImpact: 3,
    consulting: 1.5,
    publicSpeaking: 1.5,
    partnerships: 1,
    womenInSTEM: 2,
  },
};

/** Type priors: entity kinds with an inherent chapter pull. */
const typePrior: Partial<Record<ResumeEntity["type"], Partial<Record<ChapterId, number>>>> = {
  education: { learn: 3 },
  conference: { connect: 2 },
  governanceRole: { lead: 2 },
};

export function chapterFor(entity: ResumeEntity): ChapterId {
  let best: ChapterId = "connect";
  let bestScore = -1;
  for (const id of Object.keys(affinity) as ChapterId[]) {
    let score = typePrior[entity.type]?.[id] ?? 0;
    for (const theme of entity.themes) score += affinity[id][theme] ?? 0;
    if (score > bestScore) {
      bestScore = score;
      best = id;
    }
  }
  return best;
}

/** Editorial chapter framing (copy references graph facts only). */
const chapterMeta: Record<
  ChapterId,
  { index: number; title: string; kicker: string; narrative: string; treatment: GeneratedChapter["treatment"] }
> = {
  lead: {
    index: 1,
    title: "Lead",
    kicker: "Direction",
    narrative:
      "Elected twice to represent 36,000+ students — directing budgets, " +
      "boards and a campus-wide community. Leadership here is an " +
      "operating system, not a title.",
    treatment: "horizon",
  },
  build: {
    index: 2,
    title: "Build",
    kicker: "Execution",
    narrative:
      "From S&P 500 partnerships in New York to venture strategy in " +
      "Bali — turning data, AI tooling and technical ideas into things " +
      "that ship.",
    treatment: "grid",
  },
  learn: {
    index: 3,
    title: "Learn",
    kicker: "Foundations",
    narrative:
      "Engineering management at UIC, AI ethics at Cambridge — a " +
      "foundation built across disciplines and honored four times over.",
    treatment: "orbit",
  },
  connect: {
    index: 4,
    title: "Connect",
    kicker: "Signal",
    narrative:
      "Istanbul agencies, Dubai job sites, Chicago trading floors, " +
      "classrooms in Cape Town and Bali — a working network across four " +
      "continents.",
    treatment: "signal",
  },
};

/** The generated IA: chapters populated from the graph, by score. */
export function generateChapters(): GeneratedChapter[] {
  const buckets = new Map<ChapterId, ResumeEntity[]>();
  for (const e of graph.entities) {
    if (e.type === "person") continue;
    const chapter = chapterFor(e);
    (buckets.get(chapter) ?? buckets.set(chapter, []).get(chapter))!.push(e);
  }

  return (Object.keys(chapterMeta) as ChapterId[]).map((id) => ({
    id,
    ...chapterMeta[id],
    themes: Object.keys(affinity[id]) as Theme[],
    entities: (buckets.get(id) ?? []).sort(
      (a, b) => a.priority - b.priority || b.displayWeight - a.displayWeight,
    ),
  }));
}
