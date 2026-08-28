/**
 * SESSION MEMORY — Memória de sessão para Consortho
 * Persiste em localStorage, não inteligente — só belo acervo de presença
 * 
 * Features:
 * - Log de eventos: stack, mods, sistemas, momentos
 * - Export TXT/JSON
 * - Histórico cross-session
 */
const SessionMemory = (function() {
  'use strict';

  const STORAGE_KEY = 'consortho_session_memory_v1';
  const MAX_EVENTS = 500;
  const MAX_MOMENTS = 50;

  let state = {
    sessionId: 'session_' + Date.now().toString(36),
    startTime: Date.now(),
    events: [],
    moments: [],
    modsUsed: new Set(),
    systemsTriggered: new Set(),
    stackPeaks: [],
    phaseHistory: [],
    luminInteractions: 0,
    totalPlayTime: 0
  };

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
        state.modsUsed = new Set(parsed.modsUsed || []);
        state.systemsTriggered = new Set(parsed.systemsTriggered || []);
      }
    } catch (e) {
      console.warn('[SessionMemory] Erro ao carregar:', e);
    }
    console.log('[SessionMemory] 🧠 Iniciado — sessão:', state.sessionId);
    return state;
  }

  function save() {
    state.totalPlayTime = Date.now() - state.startTime;
    try {
      const toSave = {
        ...state,
        modsUsed: Array.from(state.modsUsed),
        systemsTriggered: Array.from(state.systemsTriggered)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('[SessionMemory] Erro ao salvar:', e);
    }
  }

  function addEvent(type, data) {
    const event = {
      id: 'evt_' + Date.now().toString(36),
      type,
      timestamp: Date.now(),
      sessionTime: Date.now() - state.startTime,
      data
    };
    state.events.push(event);
    if (state.events.length > MAX_EVENTS) state.events.shift();
    save();
    return event;
  }

  function logStackChange(stack, hrv) {
    addEvent('stack_change', { stack, hrv });
    if (stack > 0) {
      state.stackPeaks.push({ stack, hrv, time: Date.now() });
      if (state.stackPeaks.length > 20) state.stackPeaks.shift();
    }
  }

  function logModActivated(modId) {
    state.modsUsed.add(modId);
    addEvent('mod_activated', { modId });
    save();
  }

  function logSystemTriggered(systemId, details = {}) {
    state.systemsTriggered.add(systemId);
    addEvent('system_triggered', { systemId, ...details });
    save();
  }

  function logPhaseUp(phase, oldPhase) {
    state.phaseHistory.push({ phase, oldPhase, timestamp: Date.now() });
    addEvent('phase_up', { phase, oldPhase });
    save();
  }

  function logLuminInteraction(dialogueId, sentiment) {
    state.luminInteractions++;
    addEvent('lumin_interaction', { dialogueId, sentiment });
    save();
  }

  function addMoment(title, description, type = 'moment') {
    const moment = {
      id: 'mom_' + Date.now().toString(36),
      title,
      description,
      type,
      timestamp: Date.now(),
      sessionTime: Date.now() - state.startTime
    };
    state.moments.push(moment);
    if (state.moments.length > MAX_MOMENTS) state.moments.shift();
    save();
    return moment;
  }

  function markMoment(title, description) {
    return addMoment(title, description, 'marked');
  }

  function getEvents(filter = {}) {
    let events = state.events;
    if (filter.type) events = events.filter(e => e.type === filter.type);
    if (filter.since) events = events.filter(e => e.timestamp >= filter.since);
    if (filter.limit) events = events.slice(-filter.limit);
    return events;
  }

  function getMoments() {
    return state.moments;
  }

  function getSummary() {
    return {
      sessionId: state.sessionId,
      duration: Date.now() - state.startTime,
      totalEvents: state.events.length,
      modsUsed: Array.from(state.modsUsed),
      systemsTriggered: Array.from(state.systemsTriggered),
      stackPeaks: state.stackPeaks.slice(-5),
      phaseHistory: state.phaseHistory,
      luminInteractions: state.luminInteractions,
      moments: state.moments.length
    };
  }

  function exportTXT() {
    const s = getSummary();
    let txt = `=== CONSORTHO SESSION MEMORY ===\n`;
    txt += `Sessão: ${s.sessionId}\n`;
    txt += `Duração: ${Math.round(s.duration / 60000)}min\n`;
    txt += `Eventos: ${s.totalEvents}\n`;
    txt += `Mods usados: ${s.modsUsed.join(', ') || 'nenhum'}\n`;
    txt += `Sistemas: ${s.systemsTriggered.join(', ') || 'nenhum'}\n`;
    txt += `Interações Lumin: ${s.luminInteractions}\n`;
    txt += `Momentos: ${s.moments}\n\n`;
    txt += `--- MOMENTOS ---\n`;
    state.moments.forEach(m => {
      txt += `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.title}: ${m.description}\n`;
    });
    txt += `\n--- EVENTOS RECENTES ---\n`;
    state.events.slice(-20).forEach(e => {
      txt += `[${new Date(e.timestamp).toLocaleTimeString()}] ${e.type}: ${JSON.stringify(e.data)}\n`;
    });
    return txt;
  }

  function exportJSON() {
    return JSON.stringify({
      ...state,
      modsUsed: Array.from(state.modsUsed),
      systemsTriggered: Array.from(state.systemsTriggered)
    }, null, 2);
  }

  function downloadExport(format = 'txt') {
    const content = format === 'json' ? exportJSON() : exportTXT();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consortho_memory_${state.sessionId}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getAllSessions() {
    // Para futuro: múltiplas sessões salvas
    return [state.sessionId];
  }

  // Auto-save
  setInterval(save, 10000);

  // Auto-init
  if (typeof window !== 'undefined') {
    window.SessionMemory = {
      load,
      save,
      logStackChange,
      logModActivated,
      logSystemTriggered,
      logPhaseUp,
      logLuminInteraction,
      addMoment,
      markMoment,
      getEvents,
      getMoments,
      getSummary,
      exportTXT,
      exportJSON,
      downloadExport,
      getState: () => ({ ...state, modsUsed: Array.from(state.modsUsed), systemsTriggered: Array.from(state.systemsTriggered) })
    };
    load();
  }

  return { load, save, logStackChange, logModActivated, logSystemTriggered, logPhaseUp, logLuminInteraction, addMoment, markMoment, getEvents, getMoments, getSummary, exportTXT, exportJSON, downloadExport };
})();