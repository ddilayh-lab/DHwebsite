import { entities } from "./entities";
import type { Relationship, RelationshipType } from "./types";

/**
 * RELATIONSHIP RESOLVER.
 *
 * Two edge sources, one deduplicated output:
 * 1. Seed edges — narrative facts that cannot be inferred (extends,
 *    led_to, supports).
 * 2. Derived edges — computed from entity fields (belongs_to,
 *    located_in, shares_theme, shares_location, shares_organization,
 *    demonstrates), so they can never drift from the entities.
 *
 * Edges are product infrastructure: the globe payloads, "related"
 * views and ranking all traverse them.
 */

const seedEdges: Array<
  [string, string, RelationshipType, number, string, boolean]
> = [
  ["exp-zerox", "exp-exventure", "extends", 0.9, "ZERO-X is EX Venture's subsidiary; the roles ran together", true],
  ["proj-teaching", "exp-exventure", "shares_location", 0.6, "Bali connects the teaching project and EX Venture tenure", true],
  ["lead-usg", "gov-boards", "led_to", 0.7, "Vice presidency drives the board and committee appointments", true],
  ["proj-leaf", "lead-pmt", "supports", 0.5, "Women-in-finance mission aligns with investment-org leadership", true],
  ["edu-cambridge", "exp-flowcode", "shares_theme", 0.5, "AI runs through both the study and the partnerships work", true],
  ["conf-osqf", "lead-pmt", "shares_theme", 0.6, "Quantitative finance links the conference and the investment org", true],
];

function derivedEdges(): Relationship[] {
  const edges: Relationship[] = [];

  for (const e of entities) {
    if (e.organizationId) {
      edges.push({
        id: `belongs:${e.id}`,
        fromEntity: e.id,
        toEntity: e.organizationId,
        relationshipType: "belongs_to",
        strength: 1,
        reason: "Entity belongs to its organization",
        displayable: false,
      });
    }
    if (e.locationId) {
      edges.push({
        id: `located:${e.id}`,
        fromEntity: e.id,
        toEntity: e.locationId,
        relationshipType: "located_in",
        strength: 1,
        reason: "Entity occurred at this location",
        displayable: false,
      });
    }
    for (const metricId of e.metricIds) {
      edges.push({
        id: `demo:${e.id}:${metricId}`,
        fromEntity: e.id,
        toEntity: metricId,
        relationshipType: "demonstrates",
        strength: 1,
        reason: "Metric proves this entity's impact",
        displayable: true,
      });
    }
  }

  // Pairwise shares_location between content entities (ranking signal).
  const byLocation = new Map<string, string[]>();
  for (const e of entities) {
    if (!e.locationId || e.type === "person") continue;
    (byLocation.get(e.locationId) ?? byLocation.set(e.locationId, []).get(e.locationId))!.push(e.id);
  }
  for (const [loc, ids] of byLocation) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        edges.push({
          id: `shloc:${ids[i]}:${ids[j]}`,
          fromEntity: ids[i],
          toEntity: ids[j],
          relationshipType: "shares_location",
          strength: 0.4,
          reason: `Both occurred in ${loc}`,
          displayable: false,
        });
      }
    }
  }

  return edges;
}

/** Deduplicated, direction-normalized edge set. */
export function resolveRelationships(): Relationship[] {
  const all: Relationship[] = [
    ...seedEdges.map(([from, to, type, strength, reason, displayable]) => ({
      id: `seed:${type}:${from}:${to}`,
      fromEntity: from,
      toEntity: to,
      relationshipType: type,
      strength,
      reason,
      displayable,
    })),
    ...derivedEdges(),
  ];

  const seen = new Set<string>();
  return all.filter((edge) => {
    const [a, b] = [edge.fromEntity, edge.toEntity].sort();
    const key = `${edge.relationshipType}:${a}:${b}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
