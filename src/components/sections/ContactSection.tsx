import { contactChannels } from "@/data";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/features/cursor/Magnetic";
import { NoteComposer } from "@/features/notes/NoteComposer";

/**
 * COMMUNICATION SYSTEM — the Connect chapter's product surface.
 * Channels render from data; the composer works without a backend.
 */
export function ContactSection() {
  return (
    <Section
      id="contact"
      labelledBy="contact-title"
      chapterId="connect"
      className="grid gap-12 lg:grid-cols-[1fr_2fr]"
    >
      <Reveal>
        <h2
          id="contact-title"
          className="font-display font-semibold"
          style={{ fontSize: "var(--text-xl)", lineHeight: "var(--leading-tight)" }}
        >
          Leave a note
        </h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "36ch", marginTop: "var(--space-4)" }}>
          The fastest way to reach me — or use a channel directly.
        </p>
        <ul className="mt-8 flex flex-wrap gap-4" role="list">
          {contactChannels.map((channel) => (
            <li key={channel.id}>
              <Magnetic className="inline-block">
                <a
                  href={channel.href}
                  data-cursor="link"
                  {...(channel.kind === "resume" ? { download: true } : {})}
                  {...(channel.href.startsWith("https")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-block rounded-full border px-6 py-2"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  {channel.label}
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1}>
        <NoteComposer />
      </Reveal>
    </Section>
  );
}
