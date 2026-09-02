// ── TerraFlux Persistent Anonymous Identity Utility ──────────────────────────
// Generates and persists a unique UUID v4 in localStorage to serve as the
// client component of the composite user fingerprint (client_ip:anonymous_id).

const STORAGE_KEY = 'terraflux_anonymous_id';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback if browser security context restricts crypto.randomUUID
    }
  }

  // RFC4122 compliant fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getAnonymousId(): string {
  if (typeof window === 'undefined') {
    return 'anon_server_render';
  }

  try {
    let anonId = localStorage.getItem(STORAGE_KEY);
    if (!anonId || anonId.trim().length < 8) {
      anonId = generateUUID();
      localStorage.setItem(STORAGE_KEY, anonId);
    }
    return anonId;
  } catch (e) {
    // If localStorage is blocked (e.g. strict private browsing mode), generate session-scoped ID
    console.warn('[anonymousId] localStorage inaccessible, using memory fallback:', e);
    return generateUUID();
  }
}
