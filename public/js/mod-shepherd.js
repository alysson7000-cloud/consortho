/**
 * MOD SHEPHERD — Sistema de mods para Consortho
 * 
 * API mínima para mods:
 *   api.draw(ctx, w, h, STATE, dt)        — render por frame
 *   api.update(dt)                         — lógica por frame
 *   api.onClick(x, y)                      — clique do mouse
 *   api.onKey(key)                         — tecla pressionada
 *   api.getState()                         — estado do mod
 *   api.audio()                            — acesso ao Soundscape (opcional)
 */
const ModShepherd = (function() {
  'use strict';

  const mods = new Map();
  const activeMods = new Set();
  let isRunning = false;

  function registerMod(id, modFn) {
    if (mods.has(id)) {
      console.warn(`[ModShepherd] Mod "${id}" já registrado, sobrescrevendo`);
    }
    const api = {
      draw: (ctx, w, h, STATE, dt) => {},
      update: (dt) => {},
      onClick: (x, y) => {},
      onKey: (key) => {},
      getState: () => ({}),
      audio: () => window.Soundscape
    };
    const mod = modFn(api);
    mods.set(id, { id, mod, api, enabled: true });
    console.log(`[ModShepherd] ✅ Mod registrado: "${id}"`);
  }

  function startMod(id) {
    const entry = mods.get(id);
    if (!entry) {
      console.warn(`[ModShepherd] Mod "${id}" não encontrado`);
      return false;
    }
    if (entry.enabled) {
      console.log(`[ModShepherd] Mod "${id}" já ativo`);
      return true;
    }
    entry.enabled = true;
    activeMods.add(id);
    if (entry.mod.onEnable) entry.mod.onEnable();
    console.log(`[ModShepherd] ▶️ Mod iniciado: "${id}"`);
    return true;
  }

  function stopMod(id) {
    const entry = mods.get(id);
    if (!entry) return false;
    entry.enabled = false;
    activeMods.delete(id);
    if (entry.mod.onDisable) entry.mod.onDisable();
    console.log(`[ModShepherd] ⏹️ Mod parado: "${id}"`);
    return true;
  }

  function toggleMod(id) {
    const entry = mods.get(id);
    if (!entry) return false;
    return entry.enabled ? stopMod(id) : startMod(id);
  }

  function startAll() {
    mods.forEach((_, id) => startMod(id));
    isRunning = true;
    console.log(`[ModShepherd] 🚀 Todos os mods iniciados (${activeMods.size} ativos)`);
  }

  function stopAll() {
    activeMods.forEach(id => stopMod(id));
    isRunning = false;
    console.log(`[ModShepherd] 🛑 Todos os mods parados`);
  }

  function updateAll(dt) {
    activeMods.forEach(id => {
      const entry = mods.get(id);
      if (entry && entry.mod.update) {
        try { entry.mod.update(dt); } catch (e) { console.error(`[ModShepherd] Erro update "${id}":`, e); }
      }
    });
  }

  function renderAll(ctx, w, h, STATE, dt) {
    activeMods.forEach(id => {
      const entry = mods.get(id);
      if (entry && entry.mod.draw) {
        try { entry.mod.draw(ctx, w, h, STATE, dt); } catch (e) { console.error(`[ModShepherd] Erro draw "${id}":`, e); }
      }
    });
  }

  function handleClick(x, y) {
    activeMods.forEach(id => {
      const entry = mods.get(id);
      if (entry && entry.mod.onClick) {
        try { entry.mod.onClick(x, y); } catch (e) { console.error(`[ModShepherd] Erro click "${id}":`, e); }
      }
    });
  }

  function handleKey(key) {
    activeMods.forEach(id => {
      const entry = mods.get(id);
      if (entry && entry.mod.onKey) {
        try { entry.mod.onKey(key); } catch (e) { console.error(`[ModShepherd] Erro key "${id}":`, e); }
      }
    });
  }

  function getActiveMods() {
    return Array.from(activeMods);
  }

  function getMod(id) {
    return mods.get(id);
  }

  function isRunningMods() {
    return isRunning;
  }

  function getAllMods() {
    return Array.from(mods.keys());
  }

  function startMods() { return startAll(); }
  function stopMods() { return stopAll(); }

  // Auto-start mods registrados após carregamento
  setTimeout(() => {
    if (mods.size > 0 && !isRunning) {
      startAll();
    }
  }, 100);

  // API pública
  const publicAPI = {
    registerMod,
    startMod,
    stopMod,
    toggleMod,
    startAll,
    stopAll,
    updateAll,
    renderAll,
    handleClick,
    handleKey,
    getActiveMods,
    getMod,
    isRunning: isRunningMods,
    getAllMods
  };

  // Exponho globalmente
  if (typeof window !== 'undefined') {
    window.ModShepherd = publicAPI;
  }

  return publicAPI;
})();