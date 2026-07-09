"use client";

import { chapterById } from "@/data";
import { useStore } from "@/lib/store";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { experienceStore, returnToAnchor } from "./experience-store";
import { scrollToTarget } from "@/features/scroll/scroll-api";

/**
 * CONTEXT HUD — answers "where am I / what changed / how do I return".
 * Bottom-left, always present once scrolling begins:
 * - current chapter (position in the story),
 * - a return control after a graph jump (context preservation),
 * - an aria-live region announcing traversals for non-visual users.
 * Subscribes to coarse values only — renders on chapter/focus change.
 */
export function ContextHud() {
  const activeChapter = useScrollProgress((s) => s.activeChapter);
  const returnAnchor = useStore(experienceStore, (s) => s.returnAnchor);
  const focusedId = useStore(experienceStore, (s) => s.focusedEntityId);
  const announcement = useStore(experienceStore, (s) => s.announcement);

  const chapter = activeChapter ? chapterById.get(activeChapter) : null;
  const showReturn = Boolean(returnAnchor && focusedId);

  return (
    <aside className="context-hud" aria-label="Your position">
      {chapter ? (
        <p className="hud-chapter">
          <span style={{ color: "var(--accent-active)" }}>
            {String(chapter.index).padStart(2, "0")}
          </span>{" "}
          {chapter.title}
          <span style={{ color: "var(--text-muted)" }}> · {chapter.kicker}</span>
        </p>
      ) : (
        <p className="hud-chapter" style={{ color: "var(--text-muted)" }}>
          Scroll to begin
        </p>
      )}

      {showReturn && returnAnchor ? (
        <button
          type="button"
          className="hud-return"
          data-cursor="link"
          onClick={() => {
            const target = returnAnchor.target;
            returnToAnchor();
            scrollToTarget(target);
          }}
        >
          ← Back to {returnAnchor.label}
        </button>
      ) : null}

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </aside>
  );
}
