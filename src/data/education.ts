import type { ContentItem } from "./types";

/** PLACEHOLDER CONTENT — swap in real institutions and dates. */
export const education: ContentItem[] = [
  {
    id: "edu-engineering",
    title: "B.Sc. Engineering",
    organization: "Placeholder University",
    dateRange: { start: "2021", end: "2025" },
    category: "education",
    summary:
      "Engineering degree with a focus on computation and systems, " +
      "complemented by coursework in finance and strategy.",
    locationId: "istanbul",
    chapterId: "learn",
    priority: 1,
  },
  {
    id: "edu-exchange",
    title: "Exchange & Fellowships",
    organization: "Placeholder Programs",
    dateRange: { start: "2023", end: "2024" },
    category: "education",
    summary:
      "International programs that turned global thinking from an idea " +
      "into a habit.",
    locationId: "cambridge",
    chapterId: "learn",
    priority: 4,
  },
];
