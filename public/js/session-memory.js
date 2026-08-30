/**
 * SESSION MEMORY — Persistência de sessão para Consortho
 * Salva eventos, momentos, mudanças de estado no localStorage
 */
const SessionMemory = (function() {
  'use strict';

  const STORAGE_KEY = 'consortho_session_memory_v1';
  let state = null;

  function init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = JSON.parse(saved);
      } else {
        state = {
          events: [],
          moments: [],
          phaseHistory: [],
          modsUsed: {},
          systemsTriggered: {},
          luminInteractions: 0,
          stackPeaks: [],
          startTime: Date.now(),
          sessionId: `session_${Math.random().toString(36).substr(2, 8)}`
        };
      }
      console.log(`[SessionMemory] 🧠 Sessão carregada: ${state.events.length} eventos, ${state.moments.length} momentos`);
    } catch (e) {
      console.error('[SessionMemory] Erro ao carregar:', e);
      state = createFreshState();
    }
  }

  function createFreshState() {
    return {
      events: [],
      moments: [],
      phaseHistory: [],
      modsUsed: {},
      systemsTriggered: {},
      luminInteractions: 0,
      stackPeaks: [],
      startTime: Date.now(),
      sessionId: `session_${Math.random().toString(36).substr(2, 8)}`
    };
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('[SessionMemory] Erro ao salvar:', e);
    }
  }

  function update() {
    // Atualiza tempo total de jogo
    if (state) {
      const elapsed = Date.now() - state.startTime;
      state.totalPlayTime = elapsed;
      save();
    }
  }

  function logEvent(event) {
    if (!state) init();
    const entry = {
      type: event.type || 'generic',
      timestamp: Date.now(),
      data: event.data || {},
      message: event.message || ''
    };
    state.events.push(entry);

    // Limitar a últimos 1000 eventos
    if (state.events.length > 1000) {
      state.events = state.events.slice(-500);
    }

    save();
    return entry;
  }

  function logStackChange(oldStack, newStack) {
    logEvent({
      type: 'stack_change',
      data: { old: oldStack, new: newStack, delta: newStack - oldStack },
      message: `Stack: ${oldStack} → ${newStack}`
    });

    // Registrar pico de stack
    if (newStack > 0 && (!state.stackPeaks.length || newStack > state.stackPeaks[0])) {
      state.stackPeaks.unshift({ value: newStack, timestamp: Date.now() });
      if (state.stackPeaks.length > 10) state.stackPeaks.pop();
      save();
    }
  }

  function logPhaseUp(phaseNum, oldPhase) {
    const entry = logEvent({
      type: 'phase_up',
      data: { phase: phaseNum, oldPhase, timestamp: Date.now() },
      message: `Fase ${oldPhase} → ${phaseNum}`
    });

    state.phaseHistory.push({ phase: phaseNum, timestamp: Date.now() });
    save();
  }

  function logModActivated(modId) {
    if (!state) init();
    if (!state.modsUsed[modId]) {
      state.modsUsed[modId] = { firstUsed: Date.now(), count: 0 };
    }
    state.modsUsed[modId].count++;
    save();
    logEvent({ type: 'mod_activated', data: { modId }, message: `Mod ativado: ${modId}` });
  }

  function logModDeactivated(modId) {
    if (!state) return;
    logEvent({ type: 'mod_deactivated', data: { modId }, message: `Mod desativado: ${modId}` });
  }

  function logSystemTriggered(systemId, details) {
    if (!state) init();
    if (!state.systemsTriggered[systemId]) {
      state.systemsTriggered[systemId] = [];
    }
    state.systemsTriggered[systemId].push({ timestamp: Date.now(), details });
    save();
    logEvent({ type: 'system_triggered', data: { systemId, details }, message: `Sistema: ${systemId}` });
  }

  function logLuminInteraction(interaction) {
    if (!state) init();
    state.luminInteractions++;
    logEvent({
      type: 'lumin_interaction',
      data: { interaction, timestamp: Date.now() },
      message: `Lumin: ${interaction}`
    });
    save();
  }

  function markMoment(title, description, tags) {
    if (!state) init();
    const moment = {
      id: `moment_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      description: description || '',
      tags: tags || [],
      timestamp: Date.now(),
      phase: window.EvolutionCore ? window.EvolutionCore.getState().currentPhase : null,
      stack: window.STATE ? window.STATE.stack : null
    };
    state.moments.push(moment);
    save();
    logEvent({
      type: 'moment_marked',
      data: { moment },
      message: `Momento: "${title}"`
    });
    return moment;
  }

  function getEvents(limit) {
    if (!state) return [];
    return state.events.slice(-(limit || 50));
  }

  function getMoments() {
    if (!state) return [];
    return state.moments;
  }

  function getState() {
    if (!state) return null;
    return {
      sessionId: state.sessionId,
      startTime: state.startTime,
      totalPlayTime: state.totalPlayTime || 0,
      eventCount: state.events.length,
      momentCount: state.moments.length,
      phaseHistory: state.phaseHistory,
      modsUsed: state.modsUsed,
      systemsTriggered: state.systemsTriggered,
      luminInteractions: state.luminInteractions,
      stackPeaks: state.stackPeaks.slice(0, 5)
    };
  }

  function getSummary() {
    if (!state) return 'Sem dados de sessão';
    const elapsed = state.totalPlayTime || (Date.now() - state.startTime);
    const mins = Math.floor(elapsed / 60000);
    const secs = Math.floor((elapsed % 60000) / 1000);

    let summary = `═══ Sessão ${state.sessionId} ═══\n`;
    summary += `⏱  ${mins}m ${secs}s de jogo\n`;
    summary += `📊 ${state.events.length} eventos registrados\n`;
    summary += `🌟 ${state.moments.length} momentos marcados\n`;
    summary += `🔓 ${Object.keys(state.modsUsed).length} mods usados\n`;
    summary += `🎵 ${Object.keys(state.systemsTriggered).length} sistemas ativados\n`;
    summary += `💬 ${state.luminInteractions} interações com Lumin\n`;

    if (state.phaseHistory.length > 0) {
      summary += `🌙 Fases: ${state.phaseHistory.map(p => p.phase).join(' → ')}\n`;
    }

    if (state.stackPeaks.length > 0) {
      summary += `🏔️  Pico de stack: ${state.stackPeaks[0].value}\n`;
    }

    return summary;
  }

  function exportJSON() {
    if (!state) return null;
    return JSON.stringify({
      sessionId: state.sessionId,
      startTime: state.startTime,
      totalPlayTime: state.totalPlayTime,
      events: state.events,
      moments: state.moments,
      phaseHistory: state.phaseHistory,
      modsUsed: state.modsUsed,
      systemsTriggered: state.systemsTriggered,
      luminInteractions: state.luminInteractions,
      stackPeaks: state.stackPeaks
    }, null, 2);
  }

  function exportTXT() {
    return getSummary() + '\n\n═══ Eventos Recentes ═══\n' +
      getEvents(20).map(e => 
        `[${new Date(e.timestamp).toLocaleTimeString()}] ${e.message}${e.data ? ' — ' + JSON.stringify(e.data) : ''}`
      ).join('\n') +
      '\n\n═══ Momentos ═══\n' +
      (state.moments.length > 0 ? state.moments.map(m => 
        `[${new Date(m.timestamp).toLocaleString()}] "${m.title}"${m.description ? ' — ' + m.description : ''}`
      ).join('\n') : 'Nenhum momento marcado') +
      '\n';
  }

  function downloadExport(format) {
    const data = format === 'json' ? exportJSON() : exportTXT();
    const mime = format === 'json' ? 'application/json' : 'text/plain';
    const ext = format === 'json' ? 'json' : 'txt';
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.sessionId}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function reset() {
    state = createFreshState();
    save();
    console.log('[SessionMemory] 🔄 Memória resetada');
  }

  // Auto-inicializar
  if (typeof window !== 'undefined') {
    init();
    window.SessionMemory = {
      init,
      update,
      logEvent,
      logStackChange,
      logPhaseUp,
      logModActivated,
      logModDeactivated,
      logSystemTriggered,
      logLuminInteraction,
      markMoment,
      getEvents,
      getMoments,
      getState,
      getSummary,
      exportJSON,
      exportTXT,
      downloadExport,
      reset
    };
  }

  return {
    init,
    update,
    logEvent,
    logStackChange,
    logPhaseUp,
    logModActivated,
    logModDeactivated,
    logSystemTriggered,
    logLuminInteraction,
    markMoment,
    getEvents,
    getMoments,
    getState,
    getSummary,
    exportJSON,
    exportTXT,
    downloadExport,
    reset
  };
})();