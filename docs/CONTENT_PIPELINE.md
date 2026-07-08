# Resume Intelligence Pipeline — Phase 3A

Raw resume → parser/normalizer → metrics → themes → relationships →
knowledge graph → indexes → IA generator → compiler → UI data layer.
Implemented in `src/content/*`; the UI consumes only `src/data/*`.

## 1. Normalized entity model
`src/content/types.ts` + `entities.ts`: 16 entities (person, 2×
education, 5× professionalExperience, 4× leadershipRole, 1×
governanceRole, 1× conference, 2× project) + 7 locations + 13
organizations. Every entity: themes, metrics, skills, priority,
displayWeight, interactionProfile, globe/chapter eligibility, and a
`sourceRef` tracing to verbatim resume text in `source.ts`.

## 2. Domain map
Identity → person entity · Education → education entities · Career →
professionalExperience · Leadership → leadershipRole · Governance →
governanceRole (boards) · Project/Conference → respective types ·
Global Experience → location entities + `globalExecution` theme ·
Community Impact → theme · Organization → organizationEntities ·
Metrics → `metrics.ts` · Communication → `data/contact.ts`.
No domain owns another's responsibility (globe parses nothing;
communication duplicates no identity data).

## 3. Metric extraction map
14 first-class metrics (`metrics.ts`): 36,000+ students · $140,000
budget · 460+ orgs · 50,000+ policy reach · 60 members · 100%+ growth ·
2,000+ agencies · 25 speakers · 100+ guests · 500+ members · 9 sites ·
100+ students taught · 7 boards (derived) · 4 countries (derived).
Explicit vs. derived confidence is recorded; derived metrics are
computed only from stated facts.

## 4. Theme classification map
17 themes; multi-theme entities (e.g. Flowcode = partnerships, sales,
ai, technology, strategy). Themes are internal metadata driving chapter
scoring, ordering and globe priority — not visible labels.

## 5. Relationship graph
`relationships.ts`: seed edges (extends: ZERO-X→EX Venture; led_to:
USG→boards; supports: LEAF→PMT; …) + derived edges (belongs_to,
located_in, demonstrates, shares_location), direction-normalized and
deduplicated.

## 6. Graph indexes
`indexes.ts`: timeline, theme, location, organization, leadership,
education, project, conference, metric, priority — all resolving to the
same canonical entities; nothing copied.

## 7. Information architecture
`ia.ts` scores each entity against theme-affinity weights (+ small type
priors). The graph confirmed **Lead / Build / Learn / Connect**:
- **Lead** — USG VP, Flames Force, PMT CPO, university boards
- **Build** — Flowcode, EX Venture, ZERO-X
- **Learn** — UIC Engineering Management (+4 honors), Cambridge AI ethics
- **Connect** — MyTripTurkey, Al Mak Allamea, osQF, teaching projects,
  LEAF, Business Hours podcast
Assignments are computed, not hand-placed; adding an entity re-derives
its chapter.

## 8. Globe node strategy
`globe-adapter.ts`: location index → relevance score (display weight +
metric strength + recency) → payloads (coordinates, related entities,
primary/secondary themes, chapter link, summary, metrics).
Resume-backed nodes only: **Chicago, New York, Cambridge (UK), Istanbul,
Dubai, Bali, Cape Town**. (London/Seoul from the Phase 2B sketch had no
resume backing and were removed; Cambridge corrected from MA to UK.)

## 9. Interaction profile map
person → hero · USG VP → metricHighlight · experiences/education/
projects/conference → expandableCard · boards → secondaryDetail ·
locations → globeNode · channels → contactPrompt. Profiles are entity
fields, consumed by the compiler for placement and weight.

## 10. UI data layer shape
`src/data/`: `chapters` (compiled, with headline metrics),
`itemsForChapter()`, `timelineItems()`, `heroContent` (statement +
proof points), `globeNodes()`, `metricHighlights`, `seoContent`,
`contactChannels` (placeholder hrefs flagged TODO — the resume lists no
contact details and facts are never invented).

## Integrity guarantees
No UI component imports raw resume text (only `content/source.ts` holds
it). No hardcoded resume facts in components. Globe nodes and navigation
resolve to graph nodes. All globe content has HTML equivalents.
