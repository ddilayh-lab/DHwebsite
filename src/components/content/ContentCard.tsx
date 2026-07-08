import { locationFor, type ContentItem } from "@/data";

/**
 * DATA-RENDERING COMPONENT — renders one canonical ContentItem.
 * No data fetching, no animation, no business logic: give it a record,
 * it renders. Motion is applied by wrapping in <Reveal>.
 */
export function ContentCard({ item }: { item: ContentItem }) {
  const location = locationFor(item);
  return (
    <article
      className="grid gap-3 border-t py-8"
      style={{ borderColor: "var(--border-subtle)" }}
      data-category={item.category}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display" style={{ fontSize: "var(--text-lg)" }}>
          {item.title}
          {item.organization ? (
            <span style={{ color: "var(--text-muted)" }}> — {item.organization}</span>
          ) : null}
        </h3>
        {item.dateRange ? (
          <p
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "var(--tracking-wide)",
              color: "var(--text-muted)",
            }}
          >
            {item.dateRange.start}
            {item.dateRange.end ? `–${item.dateRange.end}` : "–now"}
          </p>
        ) : null}
      </div>

      <p style={{ color: "var(--text-muted)", maxWidth: "56ch" }}>{item.summary}</p>

      {(item.metrics?.length || location) && (
        <ul className="flex flex-wrap gap-x-6 gap-y-1" role="list">
          {item.metrics?.map((metric) => (
            <li
              key={metric}
              className="font-mono"
              style={{ fontSize: "var(--text-sm)", color: "var(--accent-active)" }}
            >
              {metric}
            </li>
          ))}
          {location ? (
            <li
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "var(--tracking-wide)",
                color: "var(--text-muted)",
              }}
            >
              {location.label}, {location.country}
            </li>
          ) : null}
        </ul>
      )}
    </article>
  );
}
