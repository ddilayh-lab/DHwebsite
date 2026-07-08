import {
  entities,
  entityById,
  locationEntities,
  locationEntityById,
  organizationById,
  organizationEntities,
} from "./entities";
import { metricById, metrics } from "./metrics";
import { resolveRelationships } from "./relationships";
import type {
  LocationEntity,
  MetricEntity,
  Relationship,
  ResumeEntity,
  Theme,
} from "./types";

/**
 * KNOWLEDGE GRAPH — the single canonical store the whole product reads.
 * Nodes: entities + locations + organizations + metrics.
 * Edges: resolved relationships.
 * Navigation, chapters, globe nodes and metrics all resolve to these
 * same nodes — no copied content anywhere downstream.
 */
class KnowledgeGraph {
  readonly entities = entities;
  readonly locations = locationEntities;
  readonly organizations = organizationEntities;
  readonly metrics = metrics;
  readonly edges: Relationship[] = resolveRelationships();

  private edgesByNode = new Map<string, Relationship[]>();

  constructor() {
    for (const edge of this.edges) {
      for (const id of [edge.fromEntity, edge.toEntity]) {
        const list = this.edgesByNode.get(id) ?? [];
        list.push(edge);
        this.edgesByNode.set(id, list);
      }
    }
  }

  entity(id: string): ResumeEntity | undefined {
    return entityById.get(id);
  }

  location(id: string): LocationEntity | undefined {
    return locationEntityById.get(id);
  }

  metric(id: string): MetricEntity | undefined {
    return metricById.get(id);
  }

  organizationName(id: string | undefined): string | undefined {
    return id ? organizationById.get(id)?.name : undefined;
  }

  edgesOf(id: string, type?: Relationship["relationshipType"]): Relationship[] {
    const list = this.edgesByNode.get(id) ?? [];
    return type ? list.filter((e) => e.relationshipType === type) : list;
  }

  /** Content entities related to `id` through any edge, by strength. */
  related(id: string): ResumeEntity[] {
    return this.edgesOf(id)
      .map((e) => (e.fromEntity === id ? e.toEntity : e.fromEntity))
      .map((other) => entityById.get(other))
      .filter((e): e is ResumeEntity => Boolean(e));
  }

  entitiesAt(locationId: string): ResumeEntity[] {
    return this.entities.filter((e) => e.locationId === locationId && e.type !== "person");
  }

  byTheme(theme: Theme): ResumeEntity[] {
    return this.entities.filter((e) => e.themes.includes(theme));
  }

  metricsOf(entityId: string): MetricEntity[] {
    return (this.entity(entityId)?.metricIds ?? [])
      .map((id) => metricById.get(id))
      .filter((m): m is MetricEntity => Boolean(m))
      .sort((a, b) => a.displayPriority - b.displayPriority);
  }
}

/** Module-level singleton — the graph is static content, built once. */
export const graph = new KnowledgeGraph();
