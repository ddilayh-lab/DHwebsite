import type { Metadata, Viewport } from "next";
import { site } from "./site";
import { profile } from "@/data/profile";

const description =
  "Dilay Heybeli — an interactive portrait of leadership, engineering, " +
  "artificial intelligence, finance and entrepreneurship, told through " +
  "chapters rather than pages.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description,
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
    name: site.name,
    url: site.url,
    jobTitle: profile.headline,
    knowsAbout: profile.domains,
  };
}
