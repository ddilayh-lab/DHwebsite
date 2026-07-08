import type { ContactChannel } from "./types";

/**
 * COMMUNICATION SYSTEM DATA — channels render in the Connect chapter.
 * The message composer falls back to `mailto:` until a backend exists;
 * swapping in an API route only changes the submit adapter, not the UI.
 */
export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    href: "mailto:hello@dilayheybeli.com",
    kind: "email",
    primary: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dilayheybeli",
    kind: "linkedin",
  },
  {
    id: "resume",
    label: "Résumé",
    href: "/resume.pdf",
    kind: "resume",
  },
];

export const primaryEmail =
  contactChannels.find((c) => c.kind === "email")?.href ?? "mailto:";
