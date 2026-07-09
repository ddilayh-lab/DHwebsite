"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { isWebGLAvailable } from "@/lib/webgl";

/**
 * Client boundary for the WebGL scene with ERROR HANDLING and
 * VISIBILITY GATING built in:
 * - WebGL unavailable → static gradient fallback (the DOM node list in
 *   GlobeSection remains the content; the page still feels complete).
 * - Offscreen → the frameloop stops entirely (no GPU/CPU cost while
 *   the visitor reads chapters); it resumes the moment the section
 *   re-enters the viewport.
 * - three.js is code-split and never server-rendered.
 * The DOM-side radial gradient doubles as the Environment's
 * BackgroundGradient (see layers/Environment.tsx) and as the fallback.
 */
const GlobeScene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

export function GlobeCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setSupported(isWebGLAvailable());
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="globe-canvas globe-gradient"
      data-cursor="drag"
      data-cursor-label="drag"
      data-webgl={supported === false ? "unavailable" : "active"}
    >
      {supported ? <GlobeScene active={inView} /> : null}
    </div>
  );
}
