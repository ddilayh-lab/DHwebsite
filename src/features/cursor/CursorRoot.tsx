"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/hooks/useCursor";
import { CursorEngine } from "./cursor-engine";

/**
 * Mounts the two cursor layers (dot + trailing ring) and boots the
 * engine. Renders nothing for touch-primary / reduced-motion users.
 * `aria-hidden` + `pointer-events: none`: purely presentational.
 */
export function CursorRoot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const variant = useCursor((s) => s.variant);
  const label = useCursor((s) => s.label);
  const enabled = useCursor((s) => s.enabled);

  useEffect(() => {
    if (!CursorEngine.isSupported()) return;
    if (!dotRef.current || !ringRef.current) return;
    const engine = new CursorEngine(dotRef.current, ringRef.current);
    engine.start();
    return () => engine.destroy();
  }, []);

  return (
    <div aria-hidden="true" data-cursor-root data-enabled={enabled}>
      <div ref={dotRef} className="cursor-dot" data-variant={variant} />
      <div ref={ringRef} className="cursor-ring" data-variant={variant}>
        {label ? <span className="cursor-label">{label}</span> : null}
      </div>
    </div>
  );
}
