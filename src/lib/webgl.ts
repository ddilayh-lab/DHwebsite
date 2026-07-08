/**
 * WebGL capability detection — the globe must never be a single point
 * of failure. If this returns false, the experience renders its static
 * fallback and all content remains reachable through HTML.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}
