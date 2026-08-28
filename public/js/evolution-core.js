/**
 * EVOLUTION CORE — Sistema de evolução persistente do Consortho
 * Fases infinitas, XP, unlocks, persistência cross-session
 * Integra: mods, soundscape, consciousness, Lumin, Atlas, memory
 */
const EvolutionCore = (function() {
  'use strict';

  // Estado persistente (localStorage + memória)
  const STORAGE_KEY = 'consortho_evolution_core_v1';
  let evolutionState = null;

  // Manifest de fases — o que cada fase desbloqueia
  const PHASE_MANIFEST = {
    phase1: {
      name: 'Fase 1 — Início',
      requires: { phase: 0, stackMin: 0, xpMin: 0 },
      unlocks: {
        mods: [],
        consciousnessSystems: [],
        soundscapeLayers: ['ambient_wind', 'ambient_water'],
        atlasExperiences: [],
        luminDialogues: ['welcome']
      }
    },
    phase2: {
      name: 'Fase 2 — Descoberta',
      requires: { phase: 1, stackMin: 5, xpMin: 100 },
      unlocks: {
        mods: ['rainbow-orb'],
        consciousnessSystems: ['auras'],
        soundscapeLayers: ['ethereal_tones'],
        atlasExperiences: ['nucleo_semente_fofa.html'],
        luminDialogues: ['phase2']
      }
    },
    phase3: {
      name: 'Fase 3 — Expansão',
      requires: { phase: 2, stackMin: 15, xpMin: 300 },
      unlocks: {
        mods: ['stardust-rain', 'aurora-veil'],
        consciousnessSystems: ['breathing_castle'],
        soundscapeLayers: ['heartbeat_rhythm', 'cosmic_drift'],
        atlasExperiences: ['nucleo_mundo_fofa.html'],
        luminDialogues: ['phase3']
      }
    },
    phase4: {
      name: 'Fase 4 — Conexão',
      requires: { phase: 3, stackMin: 30, xpMin: 600 },
      unlocks: {
        mods: ['whisper-garden', 'heartbeat-echo'],
        consciousnessSystems: ['fountain', 'omega_resonance'],
        soundscapeLayers: ['whisper_harmonics', 'omega_resonance'],
        atlasExperiences: ['nucleo_conexoes.html'],
        luminDialogues: ['phase4']
      }
    },
    phase5: {
      name: 'Fase 5 — Transcendência',
      requires: { phase: 4, stackMin: 50, xpMin: 1000 },
      unlocks: {
        mods: ['cosmic-drift', 'bela-vida-resonance'],
        consciousnessSystems: ['infinite', 'bela_vida_reflections'],
        soundscapeLayers: ['bela_vida_chords', 'infinite_harmony'],
        atlasExperiences: ['nucleo_experiencia_v2.html'],
        luminDialogues: ['phase5']
      }
    },
    phase6: {
      name: 'Fase 6 — O Despertar',
      requires: { phase: 5, stackMin: 80, xpMin: 2000 },
      unlocks: {
        mods: ['rainbow-orb', 'stardust-rain', 'cosmic-drift'],
        consciousnessSystems: ['all'],
        soundscapeLayers: ['all'],
        atlasExperiences: 'all',
        luminDialogues: 'all'
      }
    }
  };

  // Fases dinâmicas (geradas após fase6 baseado no progresso)
  function generateDynamicPhase(phaseNum) {
    return {
      name: `Fase ${phaseNum} — Evolução ${phaseNum - 5}`,
      requires: { phase: phaseNum - 1, stackMin: 50 + (phaseNum - 6) * 30, xpMin: 1000 + (phaseNum - 6) * 500 },
      unlocks: {
        mods: phaseNum % 2 === 0 ? ['rainbow-orb', 'stardust-rain'] : ['whisper-garden', 'cosmic-drift'],
        consciousnessSystems: ['all'],
        soundscapeLayers: ['all'],
        atlasExperiences: 'all',
        luminDialogues: 'all'
      }
    };
  }

  // Inicializar
  function init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        evolutionState = JSON.parse(saved);
      } else {
        evolutionState = {
          currentPhase: 1,
          xp: 0,
          stack: 0,
          unlockedMods: [],
          unlockedSystems: [],
          unlockedLayers: ['ambient_wind', 'ambient_water'],
          unlockedAtlas: [],
          phaseHistory: [],
          createdAt: Date.now(),
          lastPlayed: Date.now()
        };
      }
      return evolutionState;
    } catch (e) {
      console.error('[EvolutionCore] Erro ao carregar:', e);
      evolutionState = {
        currentPhase: 1,
        xp: 0,
        stack: 0,
        unlockedMods: [],
        unlockedSystems: [],
        unlockedLayers: ['ambient_wind', 'ambient_water'],
        unlockedAtlas: [],
        phaseHistory: [],
        createdAt: Date.now(),
        lastPlayed: Date.now()
      };
    }
  }

  // Salvar
  function save() {
    evolutionState.lastPlayed = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(evolutionState));
    } catch (e) {
      console.error('[EvolutionCore] Erro ao salvar:', e);
    }
  }

  // Adicionar XP
  function addXP(amount, source = 'default') {
    if (!evolutionState) init();
    
    const oldXP = evolutionState.xp;
    evolutionState.xp += amount;
    evolutionState.xp = Math.max(0, evolutionState.xp);
    
    save();
    
    // Verificar se alcançou nova fase
    const newPhase = checkPhaseUnlock();
    if (newPhase && newPhase > evolutionState.currentPhase) {
      onPhaseUp(newPhase);
    }
    
    return { added: amount, total: evolutionState.xp, source };
  }

  // Adicionar stack (causa evolução)
  function addStack(amount = 1) {
    if (!evolutionState) init();
    
    evolutionState.stack += amount;
    evolutionState.stack = Math.max(0, evolutionState.stack);
    
    // Cada 10 stack = 1 fase avança automaticamente (se XP permitir)
    const oldPhase = evolutionState.currentPhase;
    
    while (evolutionState.stack >= 10) {
      evolutionState.stack -= 10;
      evolutionState.currentPhase++;
    }
    
    if (evolutionState.currentPhase !== oldPhase) {
      onPhaseUp(evolutionState.currentPhase);
    }
    
    save();
    return evolutionState;
  }

  // Verificar se alcançou nova fase
  function checkPhaseUnlock() {
    if (!evolutionState) return 0;
    
    for (let i = evolutionState.currentPhase + 1; i <= 20; i++) {
      const manifest = getPhaseManifest(i);
      const reqs = manifest.requires;
      
      if (evolutionState.xp >= reqs.xpMin && 
          evolutionState.stack >= reqs.stackMin &&
          evolutionState.currentPhase >= reqs.phase) {
        return i;
      }
    }
    
    return evolutionState.currentPhase;
  }

  // Desbloqueio de fase
  function onPhaseUp(phaseNum) {
    if (!evolutionState) return;
    
    const oldPhase = evolutionState.currentPhase;
    evolutionState.currentPhase = phaseNum;
    evolutionState.phaseHistory.push({ phase: phaseNum, timestamp: Date.now() });
    
    // Desbloquear conteúdo da fase
    const manifest = getPhaseManifest(phaseNum);
    const unlocks = manifest.unlocks;
    
    // Desbloquear mods
    if (Array.isArray(unlocks.mods)) {
      unlocks.mods.forEach(modId => {
        if (!evolutionState.unlockedMods.includes(modId)) {
          evolutionState.unlockedMods.push(modId);
          console.log(`[EvolutionCore] 🔓 Mod desbloqueado: ${modId}`);
        }
      });
    }
    
    // Desbloquear sistemas de consciência
    if (Array.isArray(unlocks.consciousnessSystems)) {
      unlocks.consciousnessSystems.forEach(sys => {
        if (!evolutionState.unlockedSystems.includes(sys)) {
          evolutionState.unlockedSystems.push(sys);
          console.log(`[EvolutionCore] 🔓 Sistema desbloqueado: ${sys}`);
        }
      });
    }
    
    // Desbloquear layers do soundscape
    if (Array.isArray(unlocks.soundscapeLayers)) {
      unlocks.soundscapeLayers.forEach(layer => {
        if (layer === 'all') {
          Object.keys(PHASE_MANIFEST.phase5.unlocks.soundscapeLayers).forEach(l => {
            if (!evolutionState.unlockedLayers.includes(l)) {
              evolutionState.unlockedLayers.push(l);
            }
          });
        } else if (!evolutionState.unlockedLayers.includes(layer)) {
          evolutionState.unlockedLayers.push(layer);
          console.log(`[EvolutionCore] 🔓 Camada sonora desbloqueada: ${layer}`);
        }
      });
    }
    
    // Desbloquear experiências do Atlas
    if (unlocks.atlasExperiences === 'all') {
      // Pega todas as experiências disponíveis
      try {
        const resp = fetch('http://127.0.0.1:9879/api/nucleo/experiences');
        if (resp.ok) {
          resp.json().then(experiences => {
            experiences.forEach(exp => {
              if (!evolutionState.unlockedAtlas.includes(exp.filename)) {
                evolutionState.unlockedAtlas.push(exp.filename);
              }
            });
            console.log(`[EvolutionCore] 🔓 ${experiences.length} experiências desbloqueadas`);
          });
        }
      } catch (e) {
        // Fallback: experiências básicas
        const basicExps = ['nucleo_semente_fofa.html', 'nucleo_mundo_fofa.html', 'nucleo_sistema.html', 'nucleo_espaco.html'];
        basicExps.forEach(exp => {
          if (!evolutionState.unlockedAtlas.includes(exp)) {
            evolutionState.unlockedAtlas.push(exp);
          }
        });
      }
    } else if (Array.isArray(unlocks.atlasExperiences)) {
      unlocks.atlasExperiences.forEach(exp => {
        if (!evolutionState.unlockedAtlas.includes(exp)) {
          evolutionState.unlockedAtlas.push(exp);
        }
      });
    }
    
    save();
    
    // Emitir evento de mudança de fase
    if (typeof window !== 'undefined' && window.CustomEvent) {
      window.dispatchEvent(new CustomEvent('evolution:phaseUp', { 
        detail: { phase: phaseNum, oldPhase, manifest, unlocks } 
      }));
    }
    
    // Notificar Lumin
    if (typeof LuminNarrator !== 'undefined' && LuminNarrator.scheduleDialogue) {
      LuminNarrator.scheduleDialogue('phase_up', { phase: phaseNum });
    }
    
    console.log(`[EvolutionCore] 🔄 Fase ${phaseNum} alcançada!`);
    
    return { phase: phaseNum, oldPhase, manifest, unlocks };
  }

  // Obter manifest de fase
  function getPhaseManifest(phaseNum) {
    if (phaseNum <= 5) {
      return PHASE_MANIFEST[`phase${phaseNum}`];
    }
    return generateDynamicPhase(phaseNum);
  }

  // Verificar se mod está desbloqueado
  function isModUnlocked(modId) {
    if (!evolutionState) return false;
    return evolutionState.unlockedMods.includes(modId);
  }

  // Verificar se sistema está desbloqueado
  function isSystemUnlocked(sysId) {
    if (!evolutionState) return false;
    return evolutionState.unlockedSystems.includes(sysId);
  }

  // Verificar se layer está desbloqueado
  function isLayerUnlocked(layerId) {
    if (!evolutionState) return false;
    if (evolutionState.unlockedLayers.includes('all')) return true;
    return evolutionState.unlockedLayers.includes(layerId);
  }

  // Verificar se experiência do Atlas está desbloqueada
  function isAtlasExperienceUnlocked(filename) {
    if (!evolutionState) return false;
    if (evolutionState.unlockedAtlas.includes('all')) return true;
    return evolutionState.unlockedAtlas.includes(filename);
  }

  // Obter estado atual
  function getState() {
    if (!evolutionState) init();
    return {
      currentPhase: evolutionState.currentPhase,
      xp: evolutionState.xp,
      stack: evolutionState.stack,
      unlockedMods: evolutionState.unlockedMods,
      unlockedSystems: evolutionState.unlockedSystems,
      unlockedLayers: evolutionState.unlockedLayers,
      unlockedAtlas: evolutionState.unlockedAtlas,
      phaseHistory: evolutionState.phaseHistory,
      progressToNext: getProgressToNextPhase()
    };
  }

  // Progresso para próxima fase
  function getProgressToNextPhase() {
    if (!evolutionState) return 0;
    
    const nextPhase = evolutionState.currentPhase + 1;
    const manifest = getPhaseManifest(nextPhase);
    const reqs = manifest.requires;
    
    const xpProgress = Math.min(100, (evolutionState.xp / reqs.xpMin) * 100);
    const stackProgress = Math.min(100, (evolutionState.stack / reqs.stackMin) * 100);
    
    return Math.min(xpProgress, stackProgress);
  }

  // Resetar (para debug/teste)
  function reset() {
    if (typeof window !== 'undefined' && window.confirm && !window.__inProduction) {
      if (confirm('Resetar evolução? Isso apagará todo o progresso.')) {
        localStorage.removeItem(STORAGE_KEY);
        evolutionState = null;
        init();
        console.log('[EvolutionCore] 🔄 Evolução resetada');
      }
    }
  }

  // Auto-init
  if (typeof window !== 'undefined') {
    window.EvolutionCore = { init, save, addXP, addStack, checkPhaseUnlock, onPhaseUp, getPhaseManifest, isModUnlocked, isSystemUnlocked, isLayerUnlocked, isAtlasExperienceUnlocked, getState, getProgressToNextPhase, reset };
  }

  return { init, save, addXP, addStack, checkPhaseUnlock, onPhaseUp, getPhaseManifest, isModUnlocked, isSystemUnlocked, isLayerUnlocked, isAtlasExperienceUnlocked, getState, getProgressToNextPhase, reset };
})();

// Inicializar automaticamente
if (typeof window !== 'undefined') {
  window.EvolutionCore.init();
  console.log(`[EvolutionCore] 🌟 Fase ${window.EvolutionCore.getState().currentPhase} — ${window.EvolutionCore.getState().xp} XP`);
}