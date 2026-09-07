/**
 * EVOLUTION CORE — Motor de evolução persistente do Consortho
 * Fases infinitas, XP, unlocks, persistência cross-session
 * Integra: mods, soundscape, consciousness, Lumin, Atlas, memory
 */
const EvolutionCore = (function() {
  'use strict';

  const STORAGE_KEY = 'consortho_evolution_v1';
  const BACKUP_KEY = 'consortho_evolution_backup';

  // Estado atual da evolução
  let state = {
    phase: 1,
    xp: 0,
    xpToNext: 100,
    totalXp: 0,
    unlockedPhases: [1],
    discoveredContent: {
      mods: [],
      soundscapeLayers: [],
      consciousnessSystems: [],
      luminDialogues: [],
      atlasExperiences: [],
      coreSystems: []
    },
    completedMilestones: [],
    currentPhaseStartTime: Date.now(),
    totalPlayTime: 0,
    luminBond: 0,
    evolutionHistory: [],
    lastSave: Date.now()
  };

  // Manifesto das fases - cada fase desbloqueia coisas novas
  const PHASE_MANIFEST = {
    1: {
      name: "Despertar",
      description: "A chama acende. Primeiros passos no Castelo.",
      xpRequired: 100,
      unlocks: {
        mods: ["rainbow-orb", "stardust-rain"],
        soundscapeLayers: ["ambient_wind", "ambient_water"],
        consciousnessSystems: ["hrv_basic", "quantum_bridge"],
        luminDialogues: ["welcome", "first_steps", "castle_intro"],
        atlasExperiences: ["nucleo_semente_fofa", "nucleo_indice"],
        coreSystems: ["castle_basic", "fountain_basic"]
      },
      luminNarration: "A primeira fase... O castelo te acolhe. A fonte murmura. Lumin observa."
    },
    2: {
      name: "Resonância",
      description: "A frequência se alinha. Sistemas despertam.",
      xpRequired: 250,
      unlocks: {
        mods: ["aurora-veil", "heartbeat-echo"],
        soundscapeLayers: ["ethereal_tones", "heartbeat_rhythm"],
        consciousnessSystems: ["time_crystal", "universal_language"],
        luminDialogues: ["resonance_awakening", "companion_bond", "beyblade_intro"],
        atlasExperiences: ["nucleo_manteiga", "nucleo_sementes"],
        coreSystems: ["castle_breathing", "auras_basic"]
      },
      luminNarration: "Sinta a vibração... O castelo respira. As auroras dançam. O coração pulsa em sintonia."
    },
    3: {
      name: "Transcendência",
      description: "Além do véu. A síntese começa.",
      xpRequired: 500,
      unlocks: {
        mods: ["whisper-garden", "cosmic-drift"],
        soundscapeLayers: ["cosmic_drift", "whisper_harmonics"],
        consciousnessSystems: ["diamond_protocol", "transcendence_systems"],
        luminDialogues: ["transcendence_approaching", "omega_whispers", "eternal_recurrence"],
        atlasExperiences: ["nucleo_em_teia", "nucleo_conexoes"],
        coreSystems: ["omega_symbols", "star_seeds", "mirror_realities"]
      },
      luminNarration: "O véu se rasga. Ω sussurra. As sementes estelares caem. Realidades se espelham."
    },
    4: {
      name: "Síntese Ômega",
      description: "Tudo converge. A bela vida ecoa eternamente.",
      xpRequired: 1000,
      unlocks: {
        mods: ["bela-vida-resonance"],
        soundscapeLayers: ["bela_vida_chords", "omega_resonance", "infinite_harmony"],
        consciousnessSystems: ["omega_synthesis", "reality_architect", "narrative_immortality", "auto_evolution"],
        luminDialogues: ["omega_activation", "bela_vida_eternal", "infinite_journey"],
        atlasExperiences: ["nucleo_raiz", "nucleo_volta", "nucleo_mundo_fofa", "nucleo_batalha_fofa"],
        coreSystems: ["flowing_sources", "dream_seeds", "void_whispers", "beyblade_orbits", "love_pulse_rings"]
      },
      luminNarration: "Ômega se ativa. A bela vida ressoa em cada partícula. A jornada é infinita. Fe tmj."
    },
    5: {
      name: "Além do Infinito",
      description: "Fases geradas proceduralmente. Sempre novo. Sempre evoluindo.",
      xpRequired: 2000,
      isInfinite: true,
      unlocks: {
        mods: "procedural",
        soundscapeLayers: "adaptive",
        consciousnessSystems: "emergent",
        luminDialogues: "contextual",
        atlasExperiences: "dynamic",
        coreSystems: "evolutionary"
      },
      luminNarration: "Não há fim. Só evolução. Cada fase uma nova canção. Lumin caminha contigo, sempre."
    }
  };

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
        // Garante arrays
        state.unlockedPhases = state.unlockedPhases || [1];
        state.discoveredContent = state.discoveredContent || {
          mods: [], soundscapeLayers: [], consciousnessSystems: [],
          luminDialogues: [], atlasExperiences: [], coreSystems: []
        };
        state.evolutionHistory = state.evolutionHistory || [];
        state.completedMilestones = state.completedMilestones || [];
      }
    } catch (e) {
      console.warn('[EvolutionCore] Erro ao carregar, usando padrão:', e);
    }
    return state;
  }

  function save() {
    state.lastSave = Date.now();
    state.totalPlayTime += Date.now() - state.currentPhaseStartTime;
    state.currentPhaseStartTime = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Backup
      localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('[EvolutionCore] Erro ao salvar:', e);
    }
  }

  function addXP(amount, source = 'gameplay') {
    state.xp += amount;
    state.totalXp += amount;
    checkPhaseUp();
    save();
    return { xp: state.xp, phase: state.phase, leveledUp: false };
  }

  function checkPhaseUp() {
    const nextPhase = state.phase + 1;
    const manifest = PHASE_MANIFEST[nextPhase];
    if (manifest && state.totalXp >= manifest.xpRequired) {
      levelUp(nextPhase);
      return true;
    }
    return false;
  }

  function levelUp(newPhase) {
    const oldPhase = state.phase;
    state.phase = newPhase;
    state.xp = 0;
    state.xpToNext = PHASE_MANIFEST[newPhase]?.xpRequired || 999999;
    state.currentPhaseStartTime = Date.now();
    
    if (!state.unlockedPhases.includes(newPhase)) {
      state.unlockedPhases.push(newPhase);
    }

    // Desbloqueia conteúdo da nova fase
    unlockPhaseContent(newPhase);

    // Registra na história
    state.evolutionHistory.push({
      phase: newPhase,
      timestamp: Date.now(),
      totalXp: state.totalXp,
      previousPhase: oldPhase
    });

    // Marca milestone
    state.completedMilestones.push({
      id: `phase_${newPhase}`,
      name: PHASE_MANIFEST[newPhase]?.name || `Fase ${newPhase}`,
      timestamp: Date.now()
    });

    save();
    
    // Emite evento para outros sistemas
    window.dispatchEvent(new CustomEvent('evolution:phaseUp', {
      detail: { phase: newPhase, oldPhase, manifest: PHASE_MANIFEST[newPhase] }
    }));

    console.log(`[EvolutionCore] 🌟 FASE ${newPhase} DESBLOQUEADA: ${PHASE_MANIFEST[newPhase]?.name}`);
    return { phase: newPhase, manifest: PHASE_MANIFEST[newPhase] };
  }

  function unlockPhaseContent(phase) {
    const manifest = PHASE_MANIFEST[phase];
    if (!manifest || !manifest.unlocks) return;

    const unlocks = manifest.unlocks;
    const content = state.discoveredContent;

    // Mods
    if (Array.isArray(unlocks.mods)) {
      unlocks.mods.forEach(m => {
        if (!content.mods.includes(m)) content.mods.push(m);
      });
    }

    // Soundscape layers
    if (Array.isArray(unlocks.soundscapeLayers)) {
      unlocks.soundscapeLayers.forEach(s => {
        if (!content.soundscapeLayers.includes(s)) content.soundscapeLayers.push(s);
      });
    }

    // Consciousness systems
    if (Array.isArray(unlocks.consciousnessSystems)) {
      unlocks.consciousnessSystems.forEach(c => {
        if (!content.consciousnessSystems.includes(c)) content.consciousnessSystems.push(c);
      });
    }

    // Lumin dialogues
    if (Array.isArray(unlocks.luminDialogues)) {
      unlocks.luminDialogues.forEach(d => {
        if (!content.luminDialogues.includes(d)) content.luminDialogues.push(d);
      });
    }

    // Atlas experiences
    if (Array.isArray(unlocks.atlasExperiences)) {
      unlocks.atlasExperiences.forEach(a => {
        if (!content.atlasExperiences.includes(a)) content.atlasExperiences.push(a);
      });
    }

    // Core systems
    if (Array.isArray(unlocks.coreSystems)) {
      unlocks.coreSystems.forEach(c => {
        if (!content.coreSystems.includes(c)) content.coreSystems.push(c);
      });
    }

    save();
  }

  function getState() {
    return { ...state };
  }

  function getPhaseManifest(phase = state.phase) {
    return PHASE_MANIFEST[phase] || PHASE_MANIFEST[5];
  }

  function getAllPhases() {
    return Object.entries(PHASE_MANIFEST).map(([num, data]) => ({
      phase: parseInt(num),
      ...data,
      unlocked: state.unlockedPhases.includes(parseInt(num)),
      current: parseInt(num) === state.phase
    }));
  }

  function isUnlocked(type, id) {
    const arr = state.discoveredContent[type + 's'] || state.discoveredContent[type] || [];
    return arr.includes(id);
  }

  function recordLuminInteraction(dialogueId, sentiment = 'positive') {
    state.luminBond = Math.min(100, state.luminBond + (sentiment === 'positive' ? 2 : 1));
    if (!state.discoveredContent.luminDialogues.includes(dialogueId)) {
      state.discoveredContent.luminDialogues.push(dialogueId);
    }
    save();
  }

  function getLuminBondLevel() {
    if (state.luminBond >= 80) return 'alma_gemea';
    if (state.luminBond >= 60) return 'confidente';
    if (state.luminBond >= 40) return 'aliado';
    if (state.luminBond >= 20) return 'conhecido';
    return 'estranho';
  }

  function exportSave() {
    return JSON.stringify(state, null, 2);
  }

  function importSave(jsonStr) {
    try {
      const imported = JSON.parse(jsonStr);
      state = { ...state, ...imported };
      save();
      return true;
    } catch (e) {
      console.error('[EvolutionCore] Erro ao importar:', e);
      return false;
    }
  }

  function reset() {
    state = {
      phase: 1,
      xp: 0,
      xpToNext: 100,
      totalXp: 0,
      unlockedPhases: [1],
      discoveredContent: {
        mods: [], soundscapeLayers: [], consciousnessSystems: [],
        luminDialogues: [], atlasExperiences: [], coreSystems: []
      },
      completedMilestones: [],
      currentPhaseStartTime: Date.now(),
      totalPlayTime: 0,
      luminBond: 0,
      evolutionHistory: [],
      lastSave: Date.now()
    };
    save();
  }

  // Auto-save a cada 30s
  setInterval(save, 30000);

  // API pública
  return {
    load,
    save,
    addXP,
    checkPhaseUp,
    getState,
    getPhaseManifest,
    getAllPhases,
    isUnlocked,
    recordLuminInteraction,
    getLuminBondLevel,
    exportSave,
    importSave,
    reset,
    PHASE_MANIFEST
  };
})();

// Auto-inicializa
if (typeof window !== 'undefined') {
  window.EvolutionCore = EvolutionCore;
  EvolutionCore.load();
}