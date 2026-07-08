import { chapters } from "@/data";
import { ChapterNav } from "@/components/navigation/ChapterNav";
import { Hero } from "@/components/sections/Hero";
import { ChapterSection } from "@/components/sections/ChapterSection";
import { GlobeSection } from "@/components/sections/GlobeSection";
import { ContactSection } from "@/components/sections/ContactSection";

/**
 * The experience is one continuous scroll timeline composed of
 * chapters. Everything renders from data; this file only declares
 * order. (The Connect chapter is realized by the globe + contact
 * surfaces rather than a card list.)
 */
export default function Page() {
  const narrativeChapters = chapters.filter((c) => c.id !== "connect");

  return (
    <>
      <ChapterNav />
      <main id="content">
        <Hero />
        {narrativeChapters.map((chapter) => (
          <ChapterSection key={chapter.id} chapter={chapter} />
        ))}
        <GlobeSection />
        <ContactSection />
      </main>
      <footer
        className="container-grid flex flex-wrap justify-between gap-4"
        style={{ paddingBlock: "var(--space-12)", color: "var(--text-muted)" }}
      >
        <p style={{ fontSize: "var(--text-sm)" }}>
          © {new Date().getFullYear()} Dilay Heybeli
        </p>
        <p className="font-mono" style={{ fontSize: "var(--text-xs)" }}>
          Designed & engineered as one system
        </p>
      </footer>
    </>
  );
}
