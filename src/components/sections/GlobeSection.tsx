import { globeNodes } from "@/data";
import { ActiveNodeReadout } from "@/features/globe/ActiveNodeReadout";
import { GlobeCanvas } from "@/features/globe/GlobeCanvas";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Server component shell for the globe. The canvas is decorative and
 * code-split; every node has this accessible HTML equivalent, so the
 * WebGL scene is never the only path to content.
 */
export function GlobeSection() {
  const nodes = globeNodes();

  return (
    <section
      id="globe"
      aria-labelledby="globe-title"
      className="relative"
      style={{ minHeight: "100svh" }}
    >
      <GlobeCanvas />

      <div
        className="container-grid relative flex min-h-svh flex-col justify-end"
        style={{ zIndex: "var(--z-content)", paddingBlock: "var(--space-16)" }}
      >
        <Reveal>
          <h2
            id="globe-title"
            className="font-display font-semibold"
            style={{ fontSize: "var(--text-xl)", lineHeight: "var(--leading-tight)" }}
          >
            A network, not a map
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "44ch", marginTop: "var(--space-4)" }}>
            Disciplines and places, connected. Every node below is real,
            navigable content — the globe is one lens on it.
          </p>
          <ActiveNodeReadout />
        </Reveal>

        <Reveal cascade>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3" role="list">
            {nodes.map(({ location, items }) => (
              <li key={location.id}>
                <a
                  href={items[0]?.chapterId ? `#chapter-${items[0].chapterId}` : "#content"}
                  data-cursor="link"
                  className="font-mono uppercase"
                  style={{
                    fontSize: "var(--text-sm)",
                    letterSpacing: "var(--tracking-wide)",
                  }}
                >
                  {location.label}
                  <span style={{ color: "var(--text-muted)" }}>
                    {" "}
                    · {items.length} {items.length === 1 ? "entry" : "entries"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
