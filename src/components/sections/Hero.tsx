import { heroContent } from "@/data";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Server component. Renders compiled hero content: identity, editorial
 * statement, and metric proof points straight from the graph.
 */
export function Hero() {
  return (
    <header
      id="hero"
      className="container-grid relative flex min-h-svh flex-col justify-center"
      style={{ zIndex: "var(--z-content)" }}
    >
      <Reveal cascade>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "var(--text-sm)",
            letterSpacing: "var(--tracking-wide)",
            color: "var(--accent-active)",
          }}
        >
          {heroContent.domains.join(" · ")}
        </p>
        <h1
          className="font-display font-semibold"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: "var(--leading-tight)",
            maxWidth: "12ch",
          }}
        >
          {heroContent.name}
        </h1>
        <p
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--text-muted)",
            maxWidth: "44ch",
            marginTop: "var(--space-6)",
          }}
        >
          {heroContent.statement}
        </p>

        <dl
          className="flex flex-wrap gap-x-12 gap-y-4"
          style={{ marginTop: "var(--space-12)" }}
          aria-label="Proof points"
        >
          {heroContent.proofPoints.map((point) => (
            <div key={point.label} className="flex flex-col">
              <dt
                className="order-2 font-mono uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  letterSpacing: "var(--tracking-wide)",
                  color: "var(--text-muted)",
                }}
              >
                {point.label}
              </dt>
              <dd
                className="order-1 font-display font-semibold"
                style={{ fontSize: "var(--text-xl)", lineHeight: 1.1 }}
              >
                {point.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </header>
  );
}
