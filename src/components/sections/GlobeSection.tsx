import { globeNodes } from "@/data";
import { ActiveNodeReadout } from "@/features/globe/ActiveNodeReadout";
import { GlobeCanvas } from "@/features/globe/GlobeCanvas";
import { GlobeNodeList } from "@/features/globe/GlobeNodeList";
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
            Global experience
          </h2>
          <ActiveNodeReadout />
        </Reveal>

        <Reveal>
          <GlobeNodeList nodes={nodes} />
        </Reveal>
      </div>
    </section>
  );
}
