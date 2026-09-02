// ── TerraFlux Spatial Climate Sampling API Service ─────────────────────────

import { apiClient } from './client';
import { ClimateRequest, ClimateGridResponse, GEETileRequest, GEETileResponse } from '../types';

export async function fetchClimateGridData(
  req: ClimateRequest,
  signal?: AbortSignal
): Promise<ClimateGridResponse> {
  const payload: ClimateRequest = {
    region_name: req.region_name.trim(),
    country_code: req.country_code || 'WLD',
    admin_level: req.admin_level ?? 1,
    osm_id: req.osm_id,
    osm_type: req.osm_type,
    parent_chain: req.parent_chain || [],
    clip: req.clip ?? true,
    variable: req.variable || 'temperature_2m_mean',
    start_date: req.start_date,
    end_date: req.end_date,
    grid_size: req.grid_size ?? 8,
    aggregation_mode: req.aggregation_mode || 'mean',
  };

  return apiClient<ClimateGridResponse>('/api/climate/data', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal,
  });
}

export async function fetchGeeTileUrl(
  req: GEETileRequest,
  signal?: AbortSignal
): Promise<GEETileResponse> {
  const payload: GEETileRequest = {
    region_name: req.region_name.trim(),
    country_code: req.country_code || 'WLD',
    admin_level: req.admin_level ?? 1,
    osm_id: req.osm_id,
    osm_type: req.osm_type,
    parent_chain: req.parent_chain || [],
    variable: req.variable || 'temperature_2m_mean',
    start_date: req.start_date,
    end_date: req.end_date,
    aggregation_mode: req.aggregation_mode || 'mean',
    vis_min: req.vis_min,
    vis_max: req.vis_max,
  };

  return apiClient<GEETileResponse>('/api/gee/climate/tiles', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal,
  });
}
