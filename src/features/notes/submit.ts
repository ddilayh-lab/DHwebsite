import { primaryEmail } from "@/data/contact";

/**
 * COMMUNICATION SYSTEM — submit adapter.
 *
 * The note composer calls `submitMessage` and nothing else. Today the
 * adapter composes a mailto: draft (no backend required); replacing it
 * with an API route / form service later changes only this file.
 */
export interface OutgoingMessage {
  from: string;
  body: string;
}

export type SubmitResult =
  | { ok: true; transport: "mailto" | "api" }
  | { ok: false; error: string };

export async function submitMessage(message: OutgoingMessage): Promise<SubmitResult> {
  const subject = encodeURIComponent("Hello from your website");
  const body = encodeURIComponent(`${message.body}\n\n— ${message.from}`);
  const href = `${primaryEmail}?subject=${subject}&body=${body}`;

  if (typeof window === "undefined") {
    return { ok: false, error: "client-only" };
  }
  window.location.href = href;
  return { ok: true, transport: "mailto" };
}
