import { chapterById } from "@/data";
import { createStore } from "@/lib/store";
import { scrollStore } from "@/features/scroll/scroll-store";

/**
 * EXPERIENCE ENGINE STATE — the coordination layer for progressive
 * disclosure and graph traversal.
 *
 * - `expanded` drives card density: collapsed cards are stage-one
 *   information; expansion is a visitor-requested density increase.
 * - `focusedEntityId` is a graph-traversal command: the FocusController
 *   scrolls to the card, expands it and moves keyboard focus.
 * - `returnAnchor` preserves context across jumps: after following a
 *   relationship into another chapter, one action returns the visitor
 *   to where they came from.
 * - `announcement` feeds the HUD's aria-live region so non-visual
 *   users get the same "what changed" answer.
 */
export interface ExperienceState {
  expanded: Record<string, boolean>;
  focusedEntityId: string | null;
  returnAnchor: { label: string; target: string } | null;
  announcement: string;
  explorerOpen: boolean;
}

export const experienceStore = createStore<ExperienceState>({
  expanded: {},
  focusedEntityId: null,
  returnAnchor: null,
  announcement: "",
  explorerOpen: false,
});

export function toggleExpanded(id: string) {
  const { expanded } = experienceStore.get();
  experienceStore.set({ expanded: { ...expanded, [id]: !expanded[id] } });
}

/**
 * Graph traversal: focus an entity's card anywhere on the page.
 * Captures the current chapter as the return anchor (context
 * preservation) and expands the target (requested density).
 */
export function focusEntity(id: string, options?: { reason?: string }) {
  const state = experienceStore.get();
  const fromChapter = scrollStore.get().activeChapter;
  const anchor =
    fromChapter && chapterById.has(fromChapter)
      ? {
          label: chapterById.get(fromChapter)!.title,
          target: `#chapter-${fromChapter}`,
        }
      : null;

  experienceStore.set({
    focusedEntityId: id,
    expanded: { ...state.expanded, [id]: true },
    returnAnchor: anchor,
    announcement: options?.reason
      ? `Jumped to related item. ${options.reason}.`
      : "Jumped to item.",
    explorerOpen: false,
  });
}

export function returnToAnchor() {
  experienceStore.set({
    focusedEntityId: null,
    returnAnchor: null,
    announcement: "Returned to previous chapter.",
  });
}

export function setExplorerOpen(open: boolean) {
  experienceStore.set({ explorerOpen: open });
}
