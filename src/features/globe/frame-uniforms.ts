import { Color, Vector2, type IUniform } from "three";
import { colors } from "@/config/design-tokens";

/**
 * SHARED FRAME UNIFORMS — one uniform object per signal, referenced by
 * every material that needs it. SceneRoot updates these ONCE per frame;
 * materials receive the same instance, so there is no duplicated
 * update logic and no drift between layers.
 */
export interface FrameUniforms {
  uTime: IUniform<number>;
  uScrollProgress: IUniform<number>;
  uInteractionIntensity: IUniform<number>;
  uCursor: IUniform<Vector2>;
  uIntro: IUniform<number>;
  uPixelRatio: IUniform<number>;
  uHoverNode: IUniform<number>;
  uActiveArc: IUniform<number>;
}

export function createFrameUniforms(): FrameUniforms {
  return {
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uInteractionIntensity: { value: 0 },
    uCursor: { value: new Vector2(0, 0) },
    uIntro: { value: 0 },
    uPixelRatio: { value: 1 },
    uHoverNode: { value: -1 },
    uActiveArc: { value: -1 },
  };
}

/** Static color uniforms from design tokens (GL-side semantic tokens). */
export const colorUniforms = {
  accent: () => ({ value: new Color(colors.accentActive) }),
  muted: () => ({ value: new Color(colors.textMuted) }),
  glow: () => ({ value: new Color(colors.glowPrimary) }),
};
