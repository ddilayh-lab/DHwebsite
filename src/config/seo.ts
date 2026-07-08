import type { Metadata, Viewport } from "next";
import { site } from "./site";
import { heroContent, seoContent } from "@/data";

/** SEO ARCHITECTURE — metadata compiled from the knowledge graph. */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seoContent.title,
    template: `%s — ${site.name}`,
  },
  description: seoContent.description,
  keywords: seoContent.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: site.url,
    siteName: site.name,
    title: seoContent.title,
    description: seoContent.description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: seoContent.title,
    description: seoContent.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: "device-width",
  initialScale: 1,
};

/** JSON-LD Person entity, rendered once in the root layout. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: heroContent.name,
    url: site.url,
    description: seoContent.description,
    knowsAbout: heroContent.domains,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "University of Illinois Chicago",
    },
  };
}
