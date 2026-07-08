import { createStore } from "@/lib/store";

export type CursorVariant = "default" | "link" | "drag" | "view" | "hidden";

/**
 * CURSOR STATE DOMAIN.
 * Coarse fields (variant, label, enabled) drive React renders; the
 * per-frame kinematics (x, y, velocity) are read imperatively by other
 * engines (globe rotation, lighting, parallax) — never subscribed to.
 */
export interface CursorState {
  enabled: boolean;
  variant: CursorVariant;
  /** optional text shown inside the ring (e.g. "drag", "view") */
  label: string | null;
  /** raw pointer, normalized to -1..1 around viewport center */
  nx: number;
  ny: number;
  /** smoothed pointer speed, px/s */
  speed: number;
  idle: boolean;
}

export const cursorStore = createStore<CursorState>({
  enabled: false,
  variant: "default",
  label: null,
  nx: 0,
  ny: 0,
  speed: 0,
  idle: true,
});
