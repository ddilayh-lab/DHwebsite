import { simplexNoise3d } from "./noise";

/**
 * SURFACE LAYER SHADER — the globe's stylized "living" shell.
 *
 * Responsibility: render the point shell that gives the globe its
 * procedural surface. Noise displaces radius (breathing terrain of
 * data, not geography); scroll deepens the displacement so the globe
 * evolves as the story progresses.
 *
 * Uniforms:
 *  uTime                 seconds, frozen under reduced motion
 *  uScrollProgress       0..1 page progress → displacement + brightness
 *  uIntro                0..1 intro reveal (scale + alpha)
 *  uInteractionIntensity 0..1 pointer energy → shimmer
 *  uColor                base point color (design token)
 *  uPixelRatio           for size attenuation across DPRs
 */
export const surfaceVertex = /* glsl */ `
uniform float uTime;
uniform float uScrollProgress;
uniform float uIntro;
uniform float uInteractionIntensity;
uniform float uPixelRatio;

attribute float aSeed;

varying float vAlpha;

${simplexNoise3d}

void main() {
  vec3 p = position;

  // Organic displacement: slow noise field + scroll-driven amplitude.
  float amp = 0.02 + uScrollProgress * 0.05 + uInteractionIntensity * 0.02;
  float n = snoise(p * 2.5 + vec3(uTime * 0.06, 0.0, aSeed));
  p += normalize(p) * n * amp;

  // Intro: points converge from a slightly larger shell.
  p *= mix(1.15, 1.0, uIntro);

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float twinkle = 0.65 + 0.35 * sin(uTime * 0.8 + aSeed * 6.2831);
  // 3.4 = CameraRig BASE_DISTANCE; depth ranges are tuned against it.
  gl_PointSize = (1.8 + n * 1.4) * twinkle * uPixelRatio * (3.2 / -mvPosition.z);

  // Depth cue: fade points on the far side instead of a post pass.
  vAlpha = smoothstep(-1.2, 0.6, mvPosition.z + 3.4) * uIntro * twinkle;
}
`;

export const surfaceFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  // Round sprite with soft edge; discard keeps overdraw cheap.
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float edge = smoothstep(0.5, 0.15, d);
  gl_FragColor = vec4(uColor, vAlpha * edge);
}
`;
