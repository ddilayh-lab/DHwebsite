"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isWebGLAvailable } from "@/lib/webgl";

/**
 * Client boundary for the WebGL scene with ERROR HANDLING built in:
 * - WebGL unavailable → static gradient fallback (the DOM node list in
 *   GlobeSection remains the content; the page still feels complete).
 * - three.js bundle is code-split and never server-rendered.
 * The DOM-side radial gradient doubles as the Environment's
 * BackgroundGradient (see layers/Environment.tsx) and as the fallback.
 */
const GlobeScene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

export function GlobeCanvas() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(isWebGLAvailable());
  }, []);

  return (
    <div
      className="globe-canvas globe-gradient"
      data-cursor="drag"
      data-cursor-label="drag"
      data-webgl={supported === false ? "unavailable" : "active"}
    >
      {supported ? <GlobeScene /> : null}
    </div>
  );
}
