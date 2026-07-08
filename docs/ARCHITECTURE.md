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

## Phase 2B surface (already stubbed)

Globe layers (arcs, custom shaders, environment), chapter visual
treatments (`Chapter.treatment`), transition timelines on the FSM,
self-hosted fonts, and the drag/inertia globe interaction on
`globeStore.spinVelocity`.
