/**
 * LOCATION NODES SHADER — the animated city markers.
 *
 * Responsibility: render every location node as a pulsing point.
 * Per-node phase offsets desynchronize the pulses; the hovered node
 * (uHoverNode = its index) grows and brightens. Animation is evaluated
 * on the GPU from one clock — no CPU timelines per node.
 *
 * Uniforms:
 *  uTime        seconds, frozen under reduced motion
 *  uHoverNode   index of hovered node, -1 for none
 *  uColor       accent color (design token)
 *  uIntro       0..1 reveal
 *  uPixelRatio  DPR compensation
 * Attributes:
 *  aPhase  per-node pulse phase
 *  aIndex  node index for hover comparison
 */
export const nodesVertex = /* glsl */ `
uniform float uTime;
uniform float uHoverNode;
uniform float uIntro;
uniform float uPixelRatio;

attribute float aPhase;
attribute float aIndex;

varying float vGlow;
varying float vHover;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float pulse = 0.75 + 0.25 * sin(uTime * 1.6 + aPhase * 6.2831);
  vHover = step(0.5, 1.0 - abs(uHoverNode - aIndex)); // 1 when hovered
  float size = mix(11.0, 18.0, vHover) * pulse;

  // 3.4 = CameraRig BASE_DISTANCE; depth ranges are tuned against it.
  gl_PointSize = size * uPixelRatio * (3.2 / -mvPosition.z);

  // Far-side nodes dim but stay visible — the network wraps the sphere.
  vGlow = (0.35 + 0.65 * smoothstep(-1.0, 0.8, mvPosition.z + 3.4)) * pulse * uIntro;
}
`;

export const nodesFragment = /* glsl */ `
uniform vec3 uColor;
varying float vGlow;
varying float vHover;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  // Bright core + soft halo in one sprite (no extra glow geometry).
  float core = smoothstep(0.18, 0.05, d);
  float halo = smoothstep(0.5, 0.12, d) * 0.5;
  float a = (core + halo) * vGlow;

  vec3 color = mix(uColor, vec3(1.0), core * 0.45 + vHover * 0.2);
  gl_FragColor = vec4(color, a);
}
`;
