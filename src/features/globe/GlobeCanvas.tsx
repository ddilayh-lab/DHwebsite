"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary for the WebGL scene. The three.js bundle is
 * code-split and never server-rendered; the surrounding section
 * (server component) provides the accessible HTML equivalent.
 */
const GlobeScene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <div className="globe-placeholder" aria-hidden="true" />,
});

export function GlobeCanvas() {
  return (
    <div className="globe-canvas" data-cursor="drag" data-cursor-label="drag">
      <GlobeScene />
    </div>
  );
}
