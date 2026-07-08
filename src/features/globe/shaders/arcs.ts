/**
 * ARC PATHS SHADER — connections between nodes that share a chapter.
 *
 * Responsibility: glowing pulses traveling along pre-sampled Bézier
 * arcs. Geometry is built once on the CPU (static routes, merged into
 * ONE LineSegments draw call); all animation happens here on the GPU:
 * a pulse window moves along each arc's 0..1 progress, offset per arc.
 *
 * (Trade-off vs. Shopify-style vertex-shader Bézier instancing: our arc
 *  count is tiny and static, so baked polylines + GPU pulse animation
 *  give the same runtime cost with far less complexity.)
 *
 * Uniforms:
 *  uTime        seconds, frozen under reduced motion
 *  uColor       accent (design token)
 *  uIntro       0..1 draws arcs in along their length
 *  uActiveArc   arc index tied to hovered node's chapter, -1 none
 * Attributes:
 *  aProgress  0..1 along the arc
 *  aArc       arc index
 *  aSeed      per-arc phase offset
 */
export const arcsVertex = /* glsl */ `
attribute float aProgress;
attribute float aArc;
attribute float aSeed;

varying float vProgress;
varying float vArc;
varying float vSeed;
varying float vDepth;

void main() {
  vProgress = aProgress;
  vArc = aArc;
  vSeed = aSeed;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // 3.4 = CameraRig BASE_DISTANCE; depth range is tuned against it.
  vDepth = smoothstep(-1.0, 0.8, mvPosition.z + 3.4);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const arcsFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform float uIntro;
uniform float uActiveArc;

varying float vProgress;
varying float vArc;
varying float vSeed;
varying float vDepth;

void main() {
  // Reveal arcs from their origin during intro.
  if (vProgress > uIntro * 1.05) discard;

  // A soft pulse travels the arc; each arc runs on its own phase.
  float t = fract(uTime * 0.12 + vSeed);
  float pulse = smoothstep(0.18, 0.0, abs(vProgress - t));

  // "active" is a reserved word in GLSL — hence "highlight".
  float highlight = step(0.5, 1.0 - abs(uActiveArc - vArc));
  float base = 0.05 + highlight * 0.15;

  float a = (base + pulse * (0.5 + highlight * 0.4)) * vDepth;
  gl_FragColor = vec4(uColor, a);
}
`;
