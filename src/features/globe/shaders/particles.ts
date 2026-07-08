import { simplexNoise3d } from "./noise";

/**
 * PARTICLE SYSTEM SHADER — one material for every particle role.
 *
 * Responsibility: orbital dust around the globe. The same shader
 * serves idle drift, hover response and scroll response through
 * uniforms — no per-effect particle materials.
 *
 * Uniforms:
 *  uTime                 seconds, frozen under reduced motion
 *  uScrollProgress       0..1 → orbit tightening + brightness
 *  uInteractionIntensity 0..1 pointer energy → outward agitation
 *  uColor                dust color (design token)
 *  uIntro                0..1 reveal
 *  uPixelRatio           DPR compensation
 * Attributes:
 *  aSeed    per-particle randomness
 *  aRadius  orbit radius
 *  aSpeed   angular speed
 */
export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform float uScrollProgress;
uniform float uInteractionIntensity;
uniform float uIntro;
uniform float uPixelRatio;

attribute float aSeed;
attribute float aRadius;
attribute float aSpeed;

varying float vAlpha;

${simplexNoise3d}

void main() {
  // Orbit in the particle's own tilted plane, derived from its seed.
  float angle = uTime * aSpeed + aSeed * 6.2831;
  float tilt = (aSeed - 0.5) * 1.4;

  float radius = aRadius * (1.0 - uScrollProgress * 0.12);
  vec3 p = vec3(cos(angle) * radius, sin(angle * 0.7 + tilt) * radius * 0.35, sin(angle) * radius);

  // Interaction energy pushes particles gently off their orbits.
  float n = snoise(p * 1.5 + uTime * 0.1);
  p += normalize(p) * n * uInteractionIntensity * 0.15;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // 3.4 = CameraRig BASE_DISTANCE; depth range is tuned against it.
  gl_PointSize = (1.0 + aSeed * 1.6) * uPixelRatio * (3.2 / -mvPosition.z);
  float depth = smoothstep(-1.5, 0.5, mvPosition.z + 3.4);
  vAlpha = depth * uIntro * (0.25 + uScrollProgress * 0.25 + uInteractionIntensity * 0.3);
}
`;

export const particlesFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.1, d));
}
`;
