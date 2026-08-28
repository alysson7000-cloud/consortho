// Mod Shepherd — manages mod lifecycle and orchestration
// Stub: awaiting full implementation

window.ModShepherd = {
  registerMod(id, mod) {
    console.log('[ModShepherd] Registered mod:', id);
  },
  startMod(id) {
    console.log('[ModShepherd] Starting mod:', id);
  },
  stopMod(id) {
    console.log('[ModShepherd] Stopping mod:', id);
  },
  getStatus() {
    return { active: [] };
  },
  renderAll(ctx, w, h, STATE, dt) {
    // Stub: no-op until mods are implemented
  }
};
