import { itemsForChapter, type Chapter } from "@/data";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ContentCard } from "@/components/content/ContentCard";

/**
 * Server component: a chapter rendered entirely from data.
 * Adding a chapter in data/chapters.ts adds a section here — no layout
 * or animation code changes.
 */
export function ChapterSection({ chapter }: { chapter: Chapter }) {
  const items = itemsForChapter(chapter.id);
  const headingId = `chapter-${chapter.id}-title`;

  return (
    <Section
      id={`chapter-${chapter.id}`}
      labelledBy={headingId}
      chapterId={chapter.id}
      className="grid gap-12 lg:grid-cols-[1fr_2fr]"
    >
      <Reveal>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-wide)",
            color: "var(--accent-active)",
          }}
        >
          {String(chapter.index).padStart(2, "0")} — {chapter.kicker}
        </p>
        <h2
          id={headingId}
          className="font-display font-semibold"
          style={{ fontSize: "var(--text-xl)", lineHeight: "var(--leading-tight)" }}
        >
          {chapter.title}
        </h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "36ch", marginTop: "var(--space-4)" }}>
          {chapter.narrative}
        </p>
        {chapter.headlineMetric ? (
          <p style={{ marginTop: "var(--space-8)" }}>
            <span
              className="font-display font-semibold block"
              style={{ fontSize: "var(--text-xl)", color: "var(--accent-active)" }}
            >
              {chapter.headlineMetric.value}
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "var(--tracking-wide)",
                color: "var(--text-muted)",
              }}
            >
              {chapter.headlineMetric.label}
            </span>
          </p>
        ) : null}
      </Reveal>

      <Reveal cascade>
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </Reveal>
    </Section>
  );
}
