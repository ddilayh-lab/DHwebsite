import type { ContentItem } from "./types";

/** PLACEHOLDER CONTENT — ventures and projects, editable without code. */
export const projects: ContentItem[] = [
  {
    id: "proj-venture",
    title: "Founder",
    organization: "Placeholder Venture",
    dateRange: { start: "2024" },
    category: "entrepreneurship",
    summary:
      "Founded a product studio exploring AI-native tools for finance — " +
      "from prototype to paying users.",
    metrics: ["0 → 1", "First revenue in 4 months"],
    tags: ["Product", "AI", "Fintech"],
    locationId: "istanbul",
    chapterId: "build",
    priority: 2,
  },
  {
    id: "proj-open",
    title: "Open Engineering Work",
    category: "engineering",
    summary:
      "Systems, experiments and open tools — engineering as a craft " +
      "practiced in public.",
    tags: ["Open source", "Web", "Graphics"],
    locationId: "london",
    chapterId: "build",
    priority: 3,
  },
];
