// ── TerraFlux Scientific Figure Studio API Service ─────────────────────────

import { apiClient, API_BASE } from './client';
import { FigureRequest, FigureCatalog } from '../types';

export interface PreviewResponse {
  status: string;
  image_base64: string;
  metadata: any;
}

export async function fetchFigureCatalog(): Promise<FigureCatalog> {
  return apiClient<FigureCatalog>('/api/figure/catalog');
}

export async function previewFigure(
  req: FigureRequest,
  signal?: AbortSignal
): Promise<PreviewResponse> {
  return apiClient<PreviewResponse>('/api/figure/preview', {
    method: 'POST',
    body: JSON.stringify(req),
    signal,
  });
}

export async function exportFigure(req: FigureRequest): Promise<string> {
  const url = `${API_BASE}/api/figure/export`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    throw new Error(`Export failed (HTTP ${response.status})`);
  }

  // Get filename from Content-Disposition header if present
  let filename = `TerraFlux_${req.region_name.replace(/[^a-zA-Z0-9]/g, '_')}_${req.figure_type}.${req.format || 'png'}`;
  const disposition = response.headers.get('content-disposition');
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);

  return filename;
}
