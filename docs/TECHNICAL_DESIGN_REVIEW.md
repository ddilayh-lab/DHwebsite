# DILAY HEYBELI — Flagship Interactive Personal Website

## Phase 1 Deliverable: Technical Design Review

**Role:** Technical Owner (Principal Frontend / Graphics / Motion / UX / Product, Creative Technologist, Tech Lead)
**Status:** Design review complete — precedes all implementation planning
**Date:** 2026-07-08

---

## 0. Methodology & Evidence Confidence

This review reverse-engineers two production experiences from publicly observable
signals. Each claim below is tagged with a confidence level:

- **[CONFIRMED]** — verified via URL structure, published stack listings
  (Awwwards / landing.love / land-book metadata), or the vendor's own
  engineering write-ups (Shopify Engineering blog).
- **[HIGH]** — the only reasonable implementation given confirmed facts.
- **[INFERRED]** — professional judgment from observable behavior; alternative
  implementations exist but would be unusual in production.

Reference 02 is unusually well-documented: Shopify published two engineering
deep-dives on the BFCM globe ("How We Built the BFCM 2023 Globe" and
"A World Rendered Beautifully"), which this review draws on directly. This is
better than DOM inspection — it is the actual engineering record.

---

# 1. Engineering Observations — Reference 01 (lukebaffait.fr)

## 1.1 Frontend Architecture

**Confirmed stack:** Lenis (smooth scroll), Barba.js (page transitions),
Three.js / WebGL, GSAP, Blender-authored 3D assets. **[CONFIRMED]**

**The single most important architectural fingerprint:** the site routes to
`/info.html` and `/contact.html` — literal `.html` documents. **[CONFIRMED]**

This tells us the entire rendering model:

- **Not** a React/Vue/Next SPA. There is no client-side router framework, no
  hydration step, no virtual DOM. It is a **static multi-page application**
  (almost certainly a Vite vanilla-TS or vanilla-JS build) where each route is
  a real HTML document. **[HIGH]**
- **Barba.js provides the SPA illusion.** Barba intercepts link clicks,
  fetches the next `.html` document, and swaps a container while a GSAP
  transition timeline plays. The `<head>`, the WebGL canvas, the Lenis
  instance, and the cursor engine all live **outside** the Barba container and
  therefore **persist across navigation**. This is why page transitions feel
  seamless: the expensive systems are never torn down. **[HIGH]**
- **Rendering model:** fully static pre-rendered HTML (SSG in the purest
  sense), progressively enhanced by JS. First paint requires zero framework
  boot. "Hydration strategy" is simply: none needed — the enhancement layer
  attaches after `DOMContentLoaded`. **[HIGH]**
- **Application organization (inferred module topology):** a small app core
  that owns singletons — `App { renderer, scroll, cursor, transitions }` —
  plus per-page controllers registered against Barba namespaces
  (`home`, `info`, `contact`). Each controller owns its ScrollTriggers and
  WebGL scene section and exposes `mount()/unmount()` for transition
  lifecycle. **[INFERRED]**
- **State management:** none in the framework sense. Shared mutable state is
  a handful of module-scope singletons (scroll position, pointer position,
  reduced-motion flag, page namespace). This is appropriate — the app has
  interaction state, not data state. **[HIGH]**
- **DOM structure:** semantic sections inside a `data-barba="container"`
  wrapper; fixed-position full-viewport `<canvas>` behind or above the DOM
  with `pointer-events: none`; text split into spans (GSAP SplitText or
  equivalent) for staggered reveals. **[INFERRED]**

## 1.2 Motion Architecture

- **Philosophy:** *choreography over decoration*. Nothing animates "because it
  can" — every motion either reveals hierarchy (staggered text), gives
  affordance feedback (magnetic hover), or maintains continuity (page
  transitions). Cinematic pacing: slow, confident, wide easings. **[INFERRED]**
- **Single motion authority:** GSAP owns *all* time. Scroll-linked motion goes
  through ScrollTrigger scrubbing; discrete motion goes through timelines;
  the WebGL scene reads the same normalized progress values. One clock, one
  easing vocabulary → the consistency you can feel. **[HIGH]**
- **Timing & easing strategy:** entrance reveals in the 0.8–1.4 s range with
  `expo.out` / `power4.out` family curves (fast start, long settle — the
  signature "editorial" feel); hover feedback under 300 ms; transitions
  ~1 s with an overlap between out- and in-timelines so the screen is never
  static. **[INFERRED]**
- **Interpolation model:** two kinds coexist. (a) *Tween-based* — GSAP curves
  for discrete events. (b) *Frame-based lerp/damping* — continuous targets
  (cursor, camera offset, scroll velocity effects) chase their goal each rAF
  via exponential smoothing (`value += (target − value) × k`, frame-rate
  corrected). Springs/inertia come from Lenis's own velocity model and from
  lerp coefficients, not a physics library. **[HIGH]**
- **Interaction latency:** input is sampled raw (native event listeners),
  smoothing is applied on the *output* side only. Feedback begins on the very
  next frame even though the visible element eases into place — this is why
  it feels responsive *and* smooth rather than laggy. **[INFERRED]**

## 1.3 Scroll Engine

- **Lenis** virtualizes scrolling: native wheel/touch input is intercepted,
  integrated with exponential smoothing, and written to the document (or a
  transform). **[CONFIRMED]**
- **Synchronization:** the canonical pattern (and near-certainly used here) is
  a single rAF loop where `lenis.raf(time)` runs, then
  `ScrollTrigger.update()` is driven off Lenis's `scroll` event, then the
  WebGL frame renders. One loop, strict ordering: **input → scroll → DOM
  motion → GPU**. This eliminates the one-frame lag that plagues naive
  smooth-scroll + ScrollTrigger integrations. **[HIGH]**
- **Section orchestration:** ScrollTrigger instances with `scrub` map section
  progress (0→1) onto GSAP timelines; pinning holds key moments while
  progress continues (scroll-as-timeline, "camera choreography" through
  content). Scroll *velocity* is exposed by Lenis and mapped to secondary
  effects — skew/stretch on text, particle turbulence, camera drift —
  making speed itself an expressive input. **[HIGH]**

## 1.4 Cursor Engine

- **Custom cursor:** a fixed-position element (or WebGL quad) whose position
  chases the raw pointer with per-frame lerp; trailing ring/dot pairs use two
  different smoothing constants to create the "physics" feel. **[INFERRED]**
- **Hover hierarchy:** interactive elements declare their cursor behavior via
  data attributes (`data-cursor="link" | "drag" | "view"`); the cursor engine
  is a subscriber, not a hard-coded list — this is what makes cursor states
  maintainable at scale. **[INFERRED]**
- **Magnetic interactions:** on pointerenter of a magnetic target, the
  element's transform chases `(pointer − center) × strength` with a lerp, and
  releases with an elastic/spring-flavored tween on leave. The cursor itself
  can snap toward the target center — two-way magnetism. **[INFERRED]**
- **Camera offset influence:** normalized pointer position (−1..1) feeds a
  damped parallax offset on the WebGL camera and on DOM layers (different
  coefficients per depth), giving the whole page a subtle look-at-me
  dimensionality. **[INFERRED]**

## 1.5 Rendering Pipeline

- Raw **Three.js without React Three Fiber** — with no React in the stack
  (Barba MPA), R3F is impossible; scenes are hand-assembled. **[HIGH]**
- **Blender-authored assets** exported as glTF/GLB (Draco/meshopt compressed),
  with baked lighting where possible — hero visuals are asset-driven rather
  than procedurally lit, keeping runtime lighting cheap. **[CONFIRMED asset
  pipeline / INFERRED compression]**
- **Custom shaders** for the signature effects (distortion, reveal masks,
  film grain); post-processing is either minimal or folded into materials —
  full-screen post chains are expensive and portfolios of this quality tend
  to fake bloom/grain in-material. **[INFERRED]**
- **One persistent renderer** for the whole site, `powerPreference:
  "high-performance"`, capped `devicePixelRatio` (≤2), scenes swapped per
  Barba namespace rather than canvas teardown. **[HIGH]**

## 1.6 Typography & Layout System

- Monochrome editorial palette — `#f0f0f0` on `#0a0a0a`. **[CONFIRMED]**
- Oversized display type as *image* (hero words at viewport scale), small
  utilitarian labels/metadata as *system* — a two-voice typographic system
  with almost nothing in between. Fluid scale via `clamp()` on viewport
  units. **[INFERRED]**
- Layout is negative-space-first: sparse grid (12-col or simple flex axes),
  content islands separated by scroll distance rather than boxes/cards.
  Breakpoints reduce choreography, not just reflow content. **[INFERRED]**

## 1.7 UX

- **Storytelling pacing:** the site meters information through scroll — one
  idea per viewport, discoverability through motion cues (marquees, hover
  states, arrows) instead of persistent chrome. Navigation is minimal (3
  routes) so the *scroll journey* is the primary navigation. Cognitive load
  stays low because interaction density is high but information density per
  moment is low. **[INFERRED]**

## 1.8 Performance

- Static HTML = instant TTFB/FCP; JS is an enhancement layer, so the
  perceived-performance floor is excellent even before the WebGL boot.
  A loader/preloader masks asset fetch (fonts, GLB, textures) and doubles as
  a choreographed intro — loading time converted into brand time. **[HIGH]**
- Transform/opacity-only animation (compositor-friendly), `will-change`
  hygiene, lazy-loaded media, font `preload` + `font-display` strategy.
  The main risk in this architecture is main-thread contention between
  Lenis + ScrollTrigger + render loop, managed by keeping per-frame work
  allocation-free. **[INFERRED]**
- Accessibility is the known weak point of this genre: custom cursors,
  virtualized scroll, and text split into spans all degrade AT/keyboard
  usage unless deliberately mitigated. Treat this as a gap **we must beat**,
  not a pattern to copy. **[INFERRED]**

---

# 2. Engineering Observations — Reference 02 (bfcm.shopify.com — globe only)

Scope discipline: everything except the globe is ignored, per spec.
Primary sources: Shopify Engineering — "How We Built the BFCM 2023 Globe"
and "A World Rendered Beautifully: The Making of the BFCM 3D Data
Visualization". These are the builders' own records. **[CONFIRMED throughout
unless noted]**

## 2.1 Rendering Architecture

- **Stack:** Three.js + **React Three Fiber** — the scene graph is expressed
  as a React component tree, but per-frame work bypasses React state
  entirely (refs + `useFrame`), so React reconciles structure, not frames.
- **Layered scene architecture:** each concern (earth, atmosphere, city dots,
  arcs, sky, effects) is an encapsulated "layer" — analogous to a component
  with minimal shared state. This is the key structural idea: the globe is a
  *composition of independent systems* sharing one scene, camera and clock.
- **Earth material:** physically based (`MeshStandardMaterial` /
  `MeshPhysicalMaterial`) lit by a **32-bit EXR environment map** — image-based
  lighting instead of a rig of analytic lights. Smooth, art-directable, cheap.
- **City dots:** instanced particles rendered as **`gl.POINTS`** with
  `BufferGeometry` custom attributes + `ShaderMaterial` — chosen specifically
  because points produce a nicer glow on the horizon than quads.
- **Order arcs — the crown jewel:** each arc is a cubic Bézier evaluated **in
  the vertex shader**. Instances share one tube/ribbon geometry; per-instance
  data is only **17 floats** (P0–P3 control points ×3 + start time) uploaded
  as instanced buffer attributes. The CPU never computes curves; thousands of
  live arcs cost one draw call.
- **Fireworks:** procedural — `IcosahedronGeometry` as the base with triangle
  strips connected center-to-vertex, animated in-shader.
- **Shader discipline:** custom materials were rewritten down to ~100 lines
  (vs thousands in stock PBR shaders), with work deliberately moved from
  **fragment → vertex** stage. Bloom sources are authored by multiplying
  emissive color by an intensity factor, so the post bloom pass has authored,
  selective inputs; the starry sky is a few-line shader whose stars bloom the
  same way. Tone mapping (filmic/ACES-style) unifies the HDR pipeline.
  **[bloom pass specifics INFERRED; intensity-authoring CONFIRMED]**

## 2.2 Camera System

- Camera lives in **spherical coordinates** (radius, phi, theta ≙ zoom,
  latitude, longitude). Transitions — e.g. "fly to city" — interpolate in
  spherical space so the camera sweeps *around* the globe, never through it.
- Orbit interaction is damped (velocity decays exponentially after release);
  constraints clamp radius and phi so the globe can't be lost or flipped.
  Idle state hands control back to a slow ambient rotation; pointer input
  blends the two rather than toggling. **[HIGH — standard for this stack,
  matches observed behavior]**
- Narrow-ish FOV (~35–45°) for low distortion; pointer-driven parallax adds
  a small damped offset on top of the orbit. **[INFERRED]**

## 2.3 Interaction & Motion

- **Drag with momentum:** pointer delta → angular velocity; on release the
  velocity integrates with friction (inertia), then eases back into idle
  rotation. All smoothing is frame-based damping, not tweens — continuous
  input deserves continuous filters.
- **Event choreography:** every data event (order → arc) carries a start time
  into the shader, so animation timing is evaluated on the GPU from a single
  uniform clock — thousands of staggered animations with zero CPU timeline
  cost. A single hero object (the non-instanced "Shopify airplane") flies
  between 6 orbits, interpolating between them, banking on transitions and
  swaying on sinusoidal waves — one bespoke actor on top of instanced crowds.
- **Easing hierarchy:** camera moves are slow/cinematic; data events are
  quick pulses; idle motion is near-linear. Distinct time scales per layer is
  what keeps a busy scene legible. **[INFERRED]**

## 2.4 Performance Engineering

- Instancing everywhere (arcs, dots, planes) → draw calls in the tens, not
  thousands.
- Per-instance data minimized to what the vertex shader needs (the 17-float
  discipline).
- Fragment cost aggressively shifted to vertex stage; custom minimal shaders
  instead of uber-shaders.
- Texture/lighting cost centralized in a single environment map; the visual
  richness comes from shading + bloom, not texture count.
- Memory strategy: fixed-size instance pools, recycled slots for new events
  — no per-event allocation. **[HIGH]**

---

# 3. Motion Architecture Findings (Cross-Reference Synthesis)

1. **One clock.** A single rAF loop owns ordering: input sampling → scroll
   integration → timeline updates → render. All subsystems read time from it.
2. **Two interpolation families, used deliberately.** Tweens (GSAP curves)
   for discrete, authored moments; exponential damping/lerp for continuous
   signals (pointer, scroll velocity, camera). Never tween a continuous input.
3. **Raw input, smoothed output.** Sample events unfiltered; apply smoothing
   at presentation. Responsiveness and smoothness are then not a trade-off.
4. **A motion vocabulary, not per-element choices.** A small set of named
   durations and easings (e.g. `instant 120ms`, `feedback 250ms`,
   `reveal 900ms expo.out`, `cinematic 1400ms`) reused everywhere.
5. **Velocity is an input.** Scroll and pointer velocity modulate secondary
   effects — the experience responds to *how* you move, not just where.
6. **GPU-timed crowd animation.** For many simultaneous animated entities,
   push start-times into instanced attributes and evaluate against a uniform
   clock in the shader.

# 4. Rendering Architecture Findings

1. **Layered scene graph:** independent, encapsulated systems (earth /
   atmosphere / dots / arcs / sky) composing one scene — each owns its
   geometry, material, and update logic.
2. **IBL over light rigs:** one HDR/EXR environment map for PBR lighting —
   consistent, art-directable, cheap.
3. **Minimal custom shaders** (or `onBeforeCompile` extension of stock
   materials) rather than uber-shaders; move work to the vertex stage.
4. **Authored bloom:** emissive intensity defines what glows; post chain
   stays short (bloom + tone mapping only).
5. **One persistent renderer** across route changes; capped DPR; scenes
   mount/unmount, the canvas never does.
6. **Asset pipeline:** Blender → glTF + Draco/meshopt, baked where possible,
   loaded behind a choreographed preloader.

# 5. Interaction Architecture Findings

1. **Cursor as a subsystem** with a declarative contract (`data-cursor="…"`),
   dual-constant lerp trails, and magnetic targets — never per-component
   one-offs.
2. **Scroll as the primary navigation instrument:** Lenis-virtualized,
   ScrollTrigger-orchestrated, progress-mapped into both DOM and WebGL.
3. **Drag physics:** delta → velocity → friction integration → blend back to
   idle. Constraints always clamp the result.
4. **Pointer parallax everywhere, damped, depth-coefficient per layer.**
5. **Interaction priority:** explicit user input (drag, hover) always
   overrides ambient/idle motion, and ambient motion resumes by blending,
   not snapping.

# 6. UX Findings

1. **One idea per viewport; scroll meters the story.** High interaction
   density, low simultaneous information density.
2. **Continuity is the brand:** persistent canvas/cursor/scroll across
   transitions makes the site feel like one continuous space, not pages.
3. **Loading is narrative:** the preloader is the first scene, not a spinner.
4. **Discoverability through motion affordances** (magnetic hover, cursor
   labels like "drag" / "view") instead of persistent chrome.
5. **Minimal routes, deep scenes.** 3–4 destinations max; depth lives inside
   each scene.

# 7. Performance Findings

1. Static-first delivery: real HTML at first paint, JS as enhancement.
2. Instance + batch anything countable; fixed pools, no per-event allocation.
3. Transform/opacity-only DOM animation; zero layout thrash in the rAF loop.
4. Capped DPR, narrow FOV, short post chain; quality tiers by device class.
5. Lazy-load the heavy 3D behind the intro; code-split per scene.
6. **Accessibility is a first-class perf metric here:** `prefers-reduced-motion`
   must switch off virtualized scroll, cursor replacement, and autoplaying
   WebGL motion; all content must exist as real, focusable, semantic DOM.
   Both references are weak here — we will not be.

---

# 8. Engineering Principles Carried Into the Dilay Heybeli Project

**P1 — Single Motion Authority.** One rAF loop, one time source, one easing
vocabulary shared by DOM and WebGL. No component animates on its own clock.

**P2 — Systems, not effects.** Scroll engine, cursor engine, transition
engine, render engine — four singletons with clean interfaces. Every visual
moment is expressed *through* them, never beside them.

**P3 — Layered WebGL scene.** The signature globe (and any 3D scene) is a
composition of independent layers with instanced crowds, GPU-evaluated
animation (Bézier-in-vertex-shader, uniform clock), one EXR environment,
authored emissive bloom, short post chain.

**P4 — Continuous signals get damping; discrete moments get tweens.**

**P5 — Raw input, smoothed output.** Latency budget: feedback begins next
frame, settles on the easing.

**P6 — Persistent core, swappable scenes.** Canvas, scroll, and cursor
survive navigation; pages mount/unmount into them.

**P7 — Static-first, enhance upward.** Semantic HTML renders meaningfully
with JS off; the experience layer attaches on top. SSG/ISR, no client-only
content.

**P8 — Performance budgets as requirements:** ≤ 2.0 DPR, 60 fps target with
frame budget instrumentation, draw calls < 100, main bundle code-split per
scene, fixed-size GPU pools.

**P9 — Accessibility is not negotiable:** `prefers-reduced-motion` tier that
disables scroll virtualization / custom cursor / ambient WebGL motion;
keyboard-complete navigation; real text (visual splitting must keep
`aria-label` on the parent); WCAG-AA contrast within the monochrome system.

**P10 — The globe means globality, not travel.** Our original globe will
visualize *networks of thinking* — nodes for domains (engineering, AI,
finance, consulting, entrepreneurship) and animated arcs as connections
between disciplines and geographies — a systems-thinking instrument, not a
map of trips. Original geometry, palette, and data model; only the
engineering concepts (instanced arcs, spherical camera, layered scene) carry
over.

---

# 9. Resulting Stack Direction (for Phase 2 planning — not yet implemented)

The references prove two different architectures work. For *this* project the
spec weights **scalability and maintainability** alongside interaction
quality, which tips the decision away from Reference 01's Barba MPA:

| Concern | Decision | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSG-first delivery (P7) with component scalability the Barba/vanilla approach lacks |
| 3D | **React Three Fiber + drei + custom GLSL** | Reference 02's proven model: React for scene structure, refs/`useFrame` for frames |
| Motion | **GSAP + ScrollTrigger** (single registered instance) | The de-facto motion authority in both references |
| Scroll | **Lenis**, driven inside the unified rAF loop | Reference 01's confirmed engine; best-in-class feel |
| Cursor | **Custom engine** (dual-lerp, `data-cursor` contract, magnetic targets) | Per §5.1 |
| Post | Bloom + tone mapping only, authored emissive inputs | Per §4.4 |
| Styling | CSS custom properties + fluid `clamp()` type scale, monochrome-plus-one-accent system | Per §1.6, original palette to be defined in the design phase |
| Quality tiers | Device-class + `prefers-reduced-motion` render tiers | Per §7.6 |

**Phase 1 is complete.** Implementation planning (information architecture,
scene storyboard, motion spec, and component contracts) begins on the next
prompt.

---

### Sources

- [lukebaffait.fr](https://lukebaffait.fr/) — routes `/info.html`, `/contact.html`
- [Awwwards — Luke Baffait (Honorable Mention)](https://www.awwwards.com/sites/luke-baffait)
- [landing.love — Luke Baffait](https://www.landing.love/sites/lukebaffait/)
- [Shopify Engineering — How We Built the BFCM 2023 Globe](https://shopify.engineering/how-we-built-shopifys-bfcm-2023-globe)
- [Shopify Engineering — A World Rendered Beautifully](https://shopify.engineering/bfcm-3d-data-visualization)
- [Shopify Engineering — Behind the build: 2025's BFCM live globe](https://shopify.engineering/2025-bfcm-live-globe)
