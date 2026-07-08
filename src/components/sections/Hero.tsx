import { profile } from "@/data";
import { Reveal } from "@/components/motion/Reveal";

/** Server component: static content; motion applied via Reveal wrapper. */
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
          {profile.domains.join(" · ")}
        </p>
        <h1
          className="font-display font-semibold"
          style={{
            fontSize: "var(--text-display)",
            lineHeight: "var(--leading-tight)",
            maxWidth: "12ch",
          }}
        >
          {profile.name}
        </h1>
        <p
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--text-muted)",
            maxWidth: "44ch",
            marginTop: "var(--space-6)",
          }}
        >
          {profile.statement}
        </p>
      </Reveal>
    </header>
  );
}
