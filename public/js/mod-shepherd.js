// Mod Shepherd — manages mod lifecycle and orchestration
// Stub: awaiting full implementation

export function registerMod(id, mod) {
  console.log('[ModShepherd] Registered mod:', id);
}

export function startMod(id) {
  console.log('[ModShepherd] Starting mod:', id);
}

export function stopMod(id) {
  console.log('[ModShepherd] Stopping mod:', id);
}

export function getStatus() {
  return { active: [] };
}
