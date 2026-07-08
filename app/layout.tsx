import type { ReactNode } from "react";
import { metadata, personJsonLd, viewport } from "@/config/seo";
import { site } from "@/config/site";
import { SkipLink } from "@/components/primitives/SkipLink";
import { AppProviders } from "./providers";
import "./globals.css";

export { metadata, viewport };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.locale}>
      <body>
        <SkipLink />
        <AppProviders>{children}</AppProviders>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </body>
    </html>
  );
}
