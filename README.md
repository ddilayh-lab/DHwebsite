# Dilay Heybeli — Flagship Interactive Personal Website

An interactive personal site engineered as a reusable platform:
chapter-based storytelling (Lead · Build · Learn · Connect), a
data-driven WebGL globe, and a unified motion system.

- `docs/TECHNICAL_DESIGN_REVIEW.md` — Phase 1 reference analysis
- `docs/ARCHITECTURE.md` — Phase 2A system design

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · React Three
Fiber + drei · GSAP (ScrollTrigger) · Lenis

## Develop

```bash
npm install
npm run dev        # local dev
npm run build      # production build (static)
npm run typecheck  # strict TS
```

All personal content lives in `src/data/` and is editable without
touching components. All animation values live in `src/config/motion.ts`.
