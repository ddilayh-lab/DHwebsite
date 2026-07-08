import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  labelledBy: string;
  /** data hook for the scroll system's chapter tracking */
  chapterId?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Structural section primitive — semantic landmark + scroll-system hook.
 * Server component; carries no behavior of its own.
 */
export function Section({ id, labelledBy, chapterId, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-chapter={chapterId}
      className={`relative container-grid ${className ?? ""}`}
      style={{ paddingBlock: "var(--space-section)" }}
    >
      {children}
    </section>
  );
}
