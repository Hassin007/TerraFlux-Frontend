// ── TerraFlux Geocoding & Nominatim Search API Service ──────────────────────

import { apiClient } from './client';
import { RegionCandidate } from '../types';

export interface SearchResponse {
  results: RegionCandidate[];
}

export async function searchRegions(
  query: string,
  signal?: AbortSignal
): Promise<RegionCandidate[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const endpoint = `/api/search?q=${encodeURIComponent(trimmed)}`;
  const data = await apiClient<SearchResponse>(endpoint, { signal });
  return data.results || [];
}
