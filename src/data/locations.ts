import type { Location } from "./types";

/**
 * The globe's node set — every content item can join one via
 * `locationId`. Coordinates are real; `kind` drives node treatment.
 * (Cambridge is Cambridge, MA — edit lat/lng if the UK one is meant.)
 */
export const locations: Location[] = [
  { id: "chicago", label: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298, kind: "work" },
  { id: "new-york", label: "New York", country: "United States", lat: 40.7128, lng: -74.006, kind: "impact" },
  { id: "cambridge", label: "Cambridge", country: "United States", lat: 42.3736, lng: -71.1097, kind: "study" },
  { id: "london", label: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, kind: "work" },
  { id: "dubai", label: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708, kind: "work" },
  { id: "istanbul", label: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784, kind: "home" },
  { id: "bali", label: "Bali", country: "Indonesia", lat: -8.6705, lng: 115.2126, kind: "impact" },
  { id: "seoul", label: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978, kind: "impact" },
];

export const locationById = new Map(locations.map((l) => [l.id, l]));
