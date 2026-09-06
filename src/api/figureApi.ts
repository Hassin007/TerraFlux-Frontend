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

/**
 * Directly downloads a base64 image string as a file on the client (zero network latency).
 */
export function downloadBase64Image(base64Data: string, filename: string): void {
  const dataUri = base64Data.startsWith('data:')
    ? base64Data
    : `data:image/png;base64,${base64Data}`;
  const link = document.createElement('a');
  link.href = dataUri;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Requests a publication-grade rendered figure (PNG, SVG, PDF) from the backend server.
 */
export async function exportFigure(req: FigureRequest): Promise<string> {
  const url = `${API_BASE}/api/figure/export`;
  const format = req.format || 'png';
  const cleanRegion = (req.region_name || 'Region').replace(/[^a-zA-Z0-9]/g, '_');
  let filename = `TerraFlux_${cleanRegion}_${req.figure_type}.${format}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
  } catch (netErr: any) {
    throw new Error(
      `Network error connecting to backend (${netErr?.message || 'Failed to fetch'}). Please check backend connection.`
    );
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson?.message || errorJson?.detail || '';
    } catch {
      // Ignored
    }
    throw new Error(
      `Export failed (HTTP ${response.status}${errorDetail ? `: ${errorDetail}` : ''})`
    );
  }

  // Guard against SPA catch-all returning HTML in case of missing proxy
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error(
      'Backend returned HTML instead of a binary figure. Please verify the API server endpoint.'
    );
  }

  // Get filename from Content-Disposition header if present
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
