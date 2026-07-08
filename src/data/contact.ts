import type { ContactChannel } from "./types";

/**
 * COMMUNICATION DOMAIN — channels for the Connect chapter.
 *
 * NOTE: the resume contains no contact details, and the integrity
 * rules forbid invented facts — these hrefs are PLACEHOLDERS to be
 * replaced with Dilay's real email / LinkedIn / resume file before
 * launch. The UI renders whatever is listed here.
 */
export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    href: "mailto:hello@dilayheybeli.com", // TODO: real address
    kind: "email",
    primary: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dilayheybeli", // TODO: real profile
    kind: "linkedin",
  },
  {
    id: "resume",
    label: "Résumé",
    href: "/resume.pdf", // TODO: place the PDF in /public
    kind: "resume",
  },
];

export const primaryEmail =
  contactChannels.find((c) => c.kind === "email")?.href ?? "mailto:";
