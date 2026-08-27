// Session Memory — persists player state across sessions
// Stub: awaiting full implementation

window.SessionMemory = {
  saveSession(key, data) {
    console.log('[SessionMemory] Saved:', key);
  },
  loadSession(key) {
    console.log('[SessionMemory] Loaded:', key);
    return null;
  },
  clearSession(key) {
    console.log('[SessionMemory] Cleared:', key);
  }
};
