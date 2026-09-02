// ── TerraFlux WebGIS Boundary Resolution API Service ───────────────────────

import { apiClient } from './client';
import { BoundaryRequest, BoundaryResponse } from '../types';

export async function fetchBoundaryGeoJson(
  req: BoundaryRequest,
  signal?: AbortSignal
): Promise<BoundaryResponse> {
  const payload: BoundaryRequest = {
    region_name: req.region_name.trim(),
    country_code: req.country_code || 'WLD',
    admin_level: req.admin_level ?? 1,
    clip: req.clip ?? true,
    osm_id: req.osm_id,
    osm_type: req.osm_type,
    parent_chain: req.parent_chain || [],
  };

  return apiClient<BoundaryResponse>('/api/boundary/geojson', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal,
  });
}
