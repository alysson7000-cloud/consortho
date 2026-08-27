// Session Memory — persists player state across sessions
// Stub: awaiting full implementation

export function saveSession(key, data) {
  console.log('[SessionMemory] Saved:', key);
}

export function loadSession(key) {
  console.log('[SessionMemory] Loaded:', key);
  return null;
}

export function clearSession(key) {
  console.log('[SessionMemory] Cleared:', key);
}
