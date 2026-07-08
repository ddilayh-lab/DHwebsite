import { chapters } from "@/data";
import { ChapterNav } from "@/components/navigation/ChapterNav";
import { Hero } from "@/components/sections/Hero";
import { ChapterSection } from "@/components/sections/ChapterSection";
import { GlobeSection } from "@/components/sections/GlobeSection";
import { ContactSection } from "@/components/sections/ContactSection";

/**
 * The experience is one continuous scroll timeline composed of
 * chapters generated from the resume knowledge graph. Every chapter
 * renders its cards as real HTML; the globe and contact surfaces then
 * complete the Connect chapter as its visual and product instruments.
 */
export default function Page() {
  return (
    <>
      <ChapterNav />
      <main id="content">
        <Hero />
        {chapters.map((chapter) => (
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
