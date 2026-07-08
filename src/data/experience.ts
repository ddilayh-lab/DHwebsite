import type { ContentItem } from "./types";

/**
 * PLACEHOLDER CONTENT — replace with real experience without touching UI.
 * Every field the UI can render is structured; nothing is hardcoded in
 * components.
 */
export const experience: ContentItem[] = [
  {
    id: "exp-ai-platform",
    title: "AI Platform Engineering",
    organization: "Placeholder Co.",
    dateRange: { start: "2024" },
    category: "ai",
    summary:
      "Designing and shipping applied AI systems — from model evaluation " +
      "pipelines to production inference services.",
    metrics: ["3 products shipped", "Latency cut 40%"],
    tags: ["TypeScript", "Python", "LLMs"],
    locationId: "london",
    chapterId: "build",
    priority: 1,
  },
  {
    id: "exp-strategy",
    title: "Strategy & Consulting",
    organization: "Placeholder Advisory",
    dateRange: { start: "2023", end: "2024" },
    category: "consulting",
    summary:
      "Advised leadership teams on technology strategy, translating " +
      "engineering realities into financial decisions.",
    metrics: ["6 engagements"],
    tags: ["Strategy", "Due diligence"],
    locationId: "berlin",
    chapterId: "learn",
    priority: 2,
  },
  {
    id: "exp-finance",
    title: "Finance & Markets",
    organization: "Placeholder Capital",
    dateRange: { start: "2022", end: "2023" },
    category: "finance",
    summary:
      "Worked at the meeting point of capital and technology — analysis, " +
      "models and conviction under uncertainty.",
    tags: ["Valuation", "Markets"],
    locationId: "singapore",
    chapterId: "learn",
    priority: 3,
  },
];

export const leadership: ContentItem[] = [
  {
    id: "lead-society",
    title: "Founding President",
    organization: "Placeholder Society",
    dateRange: { start: "2022" },
    category: "leadership",
    summary:
      "Built a student organization from zero to a self-sustaining team, " +
      "with programs spanning three countries.",
    metrics: ["120+ members", "3 countries"],
    locationId: "istanbul",
    chapterId: "lead",
    priority: 1,
  },
  {
    id: "lead-board",
    title: "Advisory Board Member",
    organization: "Placeholder Initiative",
    dateRange: { start: "2024" },
    category: "community",
    summary:
      "Serving on the board of a cross-border initiative connecting young " +
      "engineers with global mentors.",
    locationId: "san-francisco",
    chapterId: "lead",
    priority: 2,
  },
];

export const conferences: ContentItem[] = [
  {
    id: "conf-global",
    title: "Speaker & Delegate",
    organization: "Placeholder Global Summit",
    dateRange: { start: "2025" },
    category: "community",
    summary:
      "Represented emerging technology perspectives at international " +
      "summits and delegations.",
    locationId: "singapore",
    chapterId: "connect",
    priority: 1,
  },
];
