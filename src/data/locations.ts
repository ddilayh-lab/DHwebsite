import type { Location } from "./types";

/**
 * PLACEHOLDER CONTENT — coordinates are real, the set is editable.
 * These are the nodes the globe renders; each content item can join
 * one via `locationId`.
 */
export const locations: Location[] = [
  { id: "istanbul", label: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784, kind: "home" },
  { id: "london", label: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, kind: "work" },
  { id: "san-francisco", label: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, kind: "impact" },
  { id: "berlin", label: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, kind: "study" },
  { id: "singapore", label: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, kind: "impact" },
];

export const locationById = new Map(locations.map((l) => [l.id, l]));
