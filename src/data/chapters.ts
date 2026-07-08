import type { Chapter } from "./types";

/**
 * CHAPTER ARCHITECTURE — the site is chapters, not pages.
 * Adding a chapter here (plus its items) extends the site without
 * rewriting layout, scroll choreography or the globe.
 */
export const chapters: Chapter[] = [
  {
    id: "lead",
    index: 1,
    title: "Lead",
    kicker: "Direction",
    narrative:
      "Leadership as a system: setting direction, building teams, and " +
      "carrying responsibility from student initiatives to boardrooms.",
    categories: ["leadership", "community"],
    treatment: "horizon",
  },
  {
    id: "build",
    index: 2,
    title: "Build",
    kicker: "Execution",
    narrative:
      "Ideas only count when they ship. Ventures, products and engineering " +
      "work — from first commit to first customer.",
    categories: ["engineering", "entrepreneurship", "ai"],
    treatment: "grid",
  },
  {
    id: "learn",
    index: 3,
    title: "Learn",
    kicker: "Foundations",
    narrative:
      "A foundation built across disciplines — engineering, finance and " +
      "strategy — and across institutions and countries.",
    categories: ["education", "finance", "consulting"],
    treatment: "orbit",
  },
  {
    id: "connect",
    index: 4,
    title: "Connect",
    kicker: "Signal",
    narrative:
      "Global thinking is a practice: conferences, communities and " +
      "collaborations across borders. Start a conversation.",
    categories: ["community", "leadership"],
    treatment: "signal",
  },
];

export const chapterById = new Map(chapters.map((c) => [c.id, c]));
