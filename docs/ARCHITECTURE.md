# Architecture — Phase 2A (Core Systems)

The site is a platform of eight systems; pages emerge from them.

## Systems map

| System | Location | Role |
|---|---|---|
| Rendering | `app/` (RSC) + `src/features/globe` (R3F, code-split, `ssr:false`) | Server components by default; client only for interaction/WebGL |
| Layout | `src/components/layout`, `src/styles/tokens.css` | Semantic `Section` primitive, container grid, fluid type scale |
| Motion | `src/config/motion.ts`, `src/lib/animation.ts`, `src/components/motion/Reveal.tsx` | GSAP is the single motion authority; all values are tokens |
| Interaction | `src/features/cursor`, `src/lib/state-machine.ts`, `src/features/transitions` | Cursor engine (`data-cursor` contract), magnetic wrapper, explicit FSMs |
| Content | `src/data/*` | Canonical typed model; DOM and globe render from the same records |
| Scene | `src/features/globe` | Layered R3F scene reading cursor/scroll stores imperatively |
| Accessibility | `src/lib/accessibility.ts`, hooks, skip link, HTML globe equivalents | Reduced-motion is a state, not a patch |
| Performance | `src/lib/performance.ts`, dynamic imports, device tiers | DPR caps, particle budgets, zero per-frame React renders |

## Load-bearing decisions

- **Framer Motion dropped.** GSAP + ScrollTrigger covers timeline and
  component transitions; two runtimes on one clock would violate the
  single-motion-authority rule. shadcn/ui deferred until a component
  needs accessible primitives.
- **State = `createStore` on `useSyncExternalStore`** (`src/lib/store.ts`),
  one store per domain (scroll / cursor / globe / transition). Contract:
  React subscribes to *coarse* values; per-frame consumers call `get()`
  inside the GSAP ticker so 60 fps values never trigger renders.
- **One rAF pipeline.** `gsap.ticker` drives Lenis, ScrollTrigger updates
  on Lenis scroll, R3F renders on the same frame — input → scroll →
  DOM motion → GPU.
- **Navigation never lives in the globe.** `features/transitions`
  mediates (`focusChapter`): navigation writes intent, globe reads it.
- **Data joins in one place** (`src/data/index.ts`): `itemsForChapter()`
  for sections, `globeNodes()` for the scene — no duplicated content.
- **Content is placeholder, structure is final** — every record in
  `src/data/*` is editable without touching layout or animation code.

## Phase 2B — WebGL scene graph, physics, shaders

```
SceneRoot (features/globe/Scene.tsx)
├── FrameDirector      sole writer of shared frame uniforms (1×/frame)
├── CameraRig          exclusive camera owner; damped targets only
├── Environment        fog; BackgroundGradient is DOM (doubles as WebGL
│                      fallback); HDRI deliberately omitted (emissive
│                      scene — analytic lights are the art direction)
├── LightingRig        key / rim / ambient / cursor-following accent
├── GlobeSystem        core · surface · atmosphere · nodes · arcs ·
│                      interaction targets (rotation physics lives here)
├── ParticleSystem     one budgeted orbital system, all roles via uniforms
├── PostProcessing     bloom + output, HIGH TIER ONLY; disposes targets
└── DebugTools         dev-only ?debug stats
```

- **Physics:** `config/physics.ts` (springs, friction, limits, coupling)
  + `lib/physics.ts` (`Spring`, `Inertia`). Drag → angular impulses →
  friction decay → ambient spin blend. Overshoot globally clamped.
- **Interaction manager** (`features/interaction`): one priority ladder
  (reduced-motion → transitioning → dragging → focused → hover →
  scrolling → idle); rigs branch on a single mode per frame.
- **Shaders** (`features/globe/shaders/`): one file per responsibility
  (surface, atmosphere, nodes, arcs, particles + shared noise); all
  animation on the GPU from shared uniforms; depth cueing in-shader
  instead of a depth pass; arcs are ONE LineSegments draw call.
- **Camera/rotation separation:** the camera never orbits — yaw/pitch
  live on the globe group, so drag physics and camera motion can't
  fight over a property.
- **Budgets:** tier-scaled particle counts (surface shell + 25% dust),
  DPR caps, ~8 draw calls, bloom gated to high tier, `frameloop:
  "demand"` under reduced motion.
- **Error handling:** `lib/webgl.ts` detection → static gradient
  fallback; the DOM node list is always the content.
- Verified headless (Playwright + bundled Chromium): scene boots with
  zero console errors; screenshot-reviewed framing.
