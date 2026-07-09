"use client";

import type { ReactNode } from "react";
import { ScrollProvider } from "@/features/scroll/ScrollProvider";
import { ChapterTracker } from "@/features/scroll/ChapterTracker";
import { CursorRoot } from "@/features/cursor/CursorRoot";
import { FocusController } from "@/features/experience/FocusController";
import { ContextHud } from "@/features/experience/ContextHud";
import { ExplorerPanel } from "@/features/experience/ExplorerPanel";

/**
 * The single client boundary for site-wide systems. Everything below
 * stays a server component unless it is interaction-critical.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ScrollProvider>
      <ChapterTracker />
      <FocusController />
      <ExplorerPanel />
      {children}
      <ContextHud />
      <CursorRoot />
    </ScrollProvider>
  );
}
