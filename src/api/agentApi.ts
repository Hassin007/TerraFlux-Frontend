// ── TerraFlux AI Climate Assistant Analysis Engine (Native SSE Transport) ────

import { API_BASE } from './client';
import { AgentSSEEvent, RateLimit429Response } from '../types';
import { getAnonymousId } from '../utils/anonymousId';

export interface AnalyzePayload {
  prompt: string;
  conversation_id?: string | null;
  region_name?: string;
  variable?: string;
  coordinates?: { lat: number; lon: number };
}

export async function streamAgentAnalysis(
  payload: AnalyzePayload,
  onEvent: (event: AgentSSEEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  // Format query with internal WebGIS context (only when a map region is actively selected)
  let formattedQuery = payload.prompt.trim();
  if (payload.region_name) {
    const contextParts: string[] = [];
    contextParts.push(`Selected Region="${payload.region_name}"`);
    if (payload.coordinates) {
      contextParts.push(
        `Coordinates=${payload.coordinates.lat.toFixed(4)},${payload.coordinates.lon.toFixed(4)}`
      );
    }
    if (payload.variable) {
      contextParts.push(`Active Variable="${payload.variable}"`);
    }
    formattedQuery = `[Context: ${contextParts.join(', ')}]\nUser Query: ${payload.prompt.trim()}`;
  }

  const anonymousId = getAnonymousId();
  const url = `${API_BASE}/api/agent/analyze`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      query: formattedQuery,
      anonymous_id: anonymousId,
      conversation_id: payload.conversation_id || null,
    }),
    signal,
  });

  // Handle HTTP 429 IP Rate Limit / Daily Quota Exceeded
  if (response.status === 429) {
    let rateLimitData: RateLimit429Response | null = null;
    try {
      rateLimitData = await response.json();
    } catch {
      const retryHeader = response.headers.get('retry-after');
      const retrySec = retryHeader ? parseInt(retryHeader, 10) : 300;
      rateLimitData = {
        error: 'rate_limited',
        message: 'Request rate limit reached. Please wait before submitting a new query.',
        retry_after: new Date(Date.now() + retrySec * 1000).toISOString(),
      };
    }
    throw { status: 429, data: rateLimitData };
  }

  if (!response.ok) {
    let errDetail = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) errDetail = errJson.detail;
      else if (errJson.message) errDetail = errJson.message;
    } catch {
      // ignore json parse error
    }
    throw new Error(errDetail);
  }

  if (!response.body) {
    throw new Error('ReadableStream is not supported or response body is empty.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep trailing unparsed fragment in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data:')) {
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const event: AgentSSEEvent = JSON.parse(jsonStr);
            onEvent(event);
          } catch (jsonErr) {
            console.warn('[agentApi] Malformed SSE data JSON line:', jsonStr, jsonErr);
          }
        }
      }
    }

    // Flush any remaining buffer if complete
    if (buffer.trim().startsWith('data:')) {
      const jsonStr = buffer.trim().slice(5).trim();
      if (jsonStr) {
        try {
          const event: AgentSSEEvent = JSON.parse(jsonStr);
          onEvent(event);
        } catch {
          // ignore
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
