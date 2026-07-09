"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { scrollToTarget } from "@/features/scroll/scroll-api";
import { experienceStore } from "./experience-store";

/**
 * FOCUS CONTROLLER — executes graph-traversal commands.
 * When focusedEntityId changes: smooth-scroll to the card, then move
 * keyboard focus to its toggle so screen-reader and keyboard users
 * land exactly where sighted users do. Context is preserved by the
 * HUD's return anchor; orientation is announced via aria-live.
 */
export function FocusController() {
  const focusedId = useStore(experienceStore, (s) => s.focusedEntityId);
  const lastHandled = useRef<string | null>(null);

  useEffect(() => {
    if (!focusedId || focusedId === lastHandled.current) return;
    lastHandled.current = focusedId;

    const selector = `[data-entity-card="${focusedId}"]`;
    scrollToTarget(selector, {
      offset: -120,
      onComplete: () => {
        document
          .querySelector<HTMLButtonElement>(`${selector} .card-toggle`)
          ?.focus({ preventScroll: true });
      },
    });
  }, [focusedId]);

  useEffect(() => {
    if (!focusedId) lastHandled.current = null;
  }, [focusedId]);

  return null;
}
