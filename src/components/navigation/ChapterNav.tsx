"use client";

import { chapters } from "@/data/chapters";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * Chapter navigation — subscribes only to the coarse `activeChapter`
 * value (renders on chapter change, not per frame).
 */
export function ChapterNav() {
  const activeChapter = useScrollProgress((s) => s.activeChapter);

  return (
    <nav
      aria-label="Chapters"
      className="fixed right-0 top-1/2 hidden -translate-y-1/2 md:block"
      style={{ zIndex: "var(--z-navigation)", paddingRight: "var(--grid-gutter)" }}
    >
      <ul className="grid gap-3 text-right" role="list">
        {chapters.map((chapter) => {
          const active = activeChapter === chapter.id;
          return (
            <li key={chapter.id}>
              <a
                href={`#chapter-${chapter.id}`}
                data-cursor="link"
                aria-current={active ? "true" : undefined}
                className="font-mono uppercase transition-colors"
                style={{
                  fontSize: "var(--text-xs)",
                  letterSpacing: "var(--tracking-wide)",
                  color: active ? "var(--accent-active)" : "var(--text-muted)",
                  transitionDuration: "var(--duration-fast)",
                }}
              >
                {chapter.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
