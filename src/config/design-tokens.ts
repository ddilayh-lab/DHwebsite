/**
 * Design tokens mirrored from styles/tokens.css for TypeScript consumers
 * (the WebGL scene cannot read CSS custom properties cheaply per frame).
 * CSS remains the source of truth for DOM; this file is the bridge for GL.
 */
export const colors = {
  backgroundPrimary: "#0a0a0b",
  backgroundElevated: "#131316",
  textPrimary: "#f2f1ed",
  textMuted: "#8f8e88",
  borderSubtle: "#26262b",
  accentActive: "#d8fb4e",
  accentInteraction: "#b7d63e",
  glowPrimary: "#d8fb4e",
} as const;

export const zIndex = {
  canvas: 0,
  content: 10,
  navigation: 40,
  overlay: 50,
  cursor: 100,
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** Depth coefficients for pointer parallax, per visual layer. */
export const layerDepth = {
  background: 0.02,
  scene: 0.05,
  content: 0,
  floating: 0.1,
} as const;
