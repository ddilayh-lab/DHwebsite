"use client";

import { useState, type FormEvent } from "react";
import { submitMessage } from "./submit";

type ComposerState = "idle" | "sending" | "sent" | "error";

/**
 * Note-style message composer. Fully keyboard-accessible; degrades to a
 * plain mailto: draft (no backend dependency).
 */
export function NoteComposer() {
  const [state, setState] = useState<ComposerState>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    const result = await submitMessage({
      from: String(form.get("from") ?? ""),
      body: String(form.get("body") ?? ""),
    });
    setState(result.ok ? "sent" : "error");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4"
      aria-label="Send a note"
      style={{ maxWidth: "36rem" }}
    >
      <label className="grid gap-2">
        <span className="u-label u-label-muted">
          Your email
        </span>
        <input
          required
          type="email"
          name="from"
          autoComplete="email"
          className="rounded-md border bg-transparent px-4 py-3"
          style={{ borderColor: "var(--border-subtle)" }}
        />
      </label>

      <label className="grid gap-2">
        <span className="u-label u-label-muted">
          Note
        </span>
        <textarea
          required
          name="body"
          rows={5}
          className="rounded-md border bg-transparent px-4 py-3"
          style={{ borderColor: "var(--border-subtle)" }}
        />
      </label>

      <button
        type="submit"
        data-cursor="link"
        disabled={state === "sending"}
        className="justify-self-start rounded-full px-8 py-3 font-medium transition-colors"
        style={{
          background: "var(--accent-active)",
          color: "var(--background-primary)",
          transitionDuration: "var(--duration-fast)",
        }}
      >
        {state === "sending" ? "Opening…" : state === "sent" ? "Draft opened" : "Send note"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className="u-label"
        style={{
          color: state === "error" ? "var(--text-primary)" : "var(--text-muted)",
          minHeight: "1.5em",
        }}
      >
        {state === "sent" ? "Your email draft is ready to send." : ""}
        {state === "error" ? "Something went wrong — use the email link above instead." : ""}
      </p>
    </form>
  );
}
