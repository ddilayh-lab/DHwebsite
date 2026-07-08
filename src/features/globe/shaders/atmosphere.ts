/**
 * ATMOSPHERE LAYER SHADER — subtle rim glow around the globe.
 *
 * Responsibility: a back-side sphere slightly larger than the core;
 * fresnel falloff produces the halo. Cursor position tilts the glow
 * toward the pointer (lighting responds to attention), accent color
 * intensifies with interaction.
 *
 * Uniforms:
 *  uColorAccent        glow color (design token)
 *  uAtmosphereStrength overall intensity (tier + reduced-motion scaled)
 *  uCursor             pointer in NDC (-1..1), damped upstream
 *  uIntro              0..1 reveal
 */
export const atmosphereVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const atmosphereFragment = /* glsl */ `
uniform vec3 uColorAccent;
uniform float uAtmosphereStrength;
uniform vec2 uCursor;
uniform float uIntro;

varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  // Fresnel: strongest at the silhouette, zero facing the camera.
  // High exponent keeps the glow hugging the rim instead of banding.
  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 4.5);

  // Bias the halo toward the cursor's side of the screen.
  vec2 dir = normalize(vWorldPos.xy + vec2(0.0001));
  float cursorBias = 0.5 + 0.5 * dot(dir, normalize(uCursor + vec2(0.0001)));
  float bias = mix(0.75, 1.25, cursorBias);

  float intensity = fresnel * uAtmosphereStrength * bias * uIntro;
  gl_FragColor = vec4(uColorAccent, intensity);
}
`;
