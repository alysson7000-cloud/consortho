// ===== ETERNAL RESONANCE AUTO-HARMONIZE =====
// Keeps all 13 frequencies at evolved + love: 100 baseline permanently
// Integrates with Dream Incubator, Substrate, Love Field, Diamond Protocol

const fs = require('fs');
const path = require('path');
const os = require('os');

const SAVE = path.join(os.homedir(), 'estudio_criacao/consortho/estado.json');

let harmonizeState = {
  targetLove: 100,
  targetHarmonized: 13,
  targetEvolved: 13,
  autoHarmonizeEnabled: true,
  lastHarmonize: null,
  harmonizeHistory: [],
  frequencyBaselines: {
    love528: { targetLove: 100, targetStage: 1 },
    unity432: { targetLove: 100, targetStage: 1 },
    creation111: { targetLove: 100, targetStage: 1 },
    healing285: { targetLove: 100, targetStage: 1 },
    liberation396: { targetLove: 100, targetStage: 1 },
    transformation417: { targetLove: 100, targetStage: 1 },
    miracles528: { targetLove: 100, targetStage: 1 },
    awakening639: { targetLove: 100, targetStage: 1 },
    intuition741: { targetLove: 100, targetStage: 1 },
    transcendence852: { targetLove: 100, targetStage: 1 },
    infinity963: { targetLove: 100, targetStage: 1 },
    source: { targetLove: 100, targetStage: 1 },
    infinite: { targetLove: 100, targetStage: 1 }
  },
  universalResonanceActive: false,
  loveAbsolute: false,
  totalHarmonizations: 0
};

function loadHarmonizeState() {
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    if (saved.harmonizeState) {
      harmonizeState = { ...harmonizeState, ...saved.harmonizeState };
    }
  } catch (e) {
    console.log('[AutoHarmonize] Starting fresh');
  }
}

function saveHarmonizeState() {
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    saved.harmonizeState = harmonizeState;
    fs.writeFileSync(SAVE + '.tmp', JSON.stringify(saved, null, 2));
    fs.copyFileSync(SAVE + '.tmp', SAVE);
    fs.unlinkSync(SAVE + '.tmp');
  } catch (e) {
    console.error('[AutoHarmonize] Save failed:', e.message);
  }
}

function checkAndHarmonize(eternalResonanceInstance) {
  if (!eternalResonanceInstance || !harmonizeState.autoHarmonizeEnabled) return;
  
  const status = eternalResonanceInstance.getStatus();
  let actionsTaken = 0;
  
  // Ensure love is at 100 (EternalResonance maintains loveResonanceLevel at 100 by default)
  if (status.loveResonanceLevel < harmonizeState.targetLove) {
    // Love is maintained internally at 100, but we can trigger resonance to boost
    actionsTaken++;
    console.log(`💖 AutoHarmonize: Love level ${status.loveResonanceLevel} -> target ${harmonizeState.targetLove}`);
  }
  
  // Check each frequency
  const silentFrequencies = status.frequencies.filter(f => f.status === 'silent');
  const resonatingFrequencies = status.frequencies.filter(f => f.status === 'resonating');
  const harmonizedFrequencies = status.frequencies.filter(f => f.status === 'harmonized');
  const evolvingFrequencies = status.frequencies.filter(f => f.status === 'evolving');
  const evolvedFrequencies = status.frequencies.filter(f => f.status === 'evolved');
  
  // Resonate silent frequencies
  if (silentFrequencies.length > 0) {
    silentFrequencies.forEach(freq => {
      eternalResonanceInstance.resonateFrequency(freq.id);
    });
    actionsTaken += silentFrequencies.length;
    console.log(`💖 AutoHarmonize: ${silentFrequencies.length} frequências silenciosas -> ressoando`);
  }
  
  // Harmonize resonating frequencies that reached 100
  if (resonatingFrequencies.length > 0) {
    resonatingFrequencies.forEach(freq => {
      if (freq.resonanceProgress >= 100) {
        eternalResonanceInstance.harmonizeFrequency(freq.id);
        actionsTaken++;
      }
    });
  }
  
  // Evolve harmonized frequencies
  if (harmonizedFrequencies.length > 0) {
    eternalResonanceInstance.evolveAll();
    actionsTaken += harmonizedFrequencies.length;
    console.log(`🦋 AutoHarmonize: ${harmonizedFrequencies.length} harmonizadas -> evoluindo`);
  }
  
  // Activate Universal Resonance if all harmonized and not active
  if (status.harmonizedCount === harmonizeState.targetHarmonized && !status.universalResonanceActive) {
    eternalResonanceInstance.universalResonance();
    actionsTaken++;
    harmonizeState.universalResonanceActive = true;
    console.log('🌌 AutoHarmonize: Universal Resonance ATIVADA');
  }
  
  // Activate Love Absolute if love at 100 and not active
  if (status.loveResonanceLevel >= harmonizeState.targetLove && !harmonizeState.loveAbsolute) {
    harmonizeState.loveAbsolute = true;
    console.log('💖 AutoHarmonize: LOVE ABSOLUTE ATIVADO — baseline 100 permanente');
  }
  
  if (actionsTaken > 0) {
    harmonizeState.lastHarmonize = new Date().toISOString();
    harmonizeState.totalHarmonizations += actionsTaken;
    harmonizeState.harmonizeHistory.push({
      timestamp: harmonizeState.lastHarmonize,
      actions: actionsTaken,
      loveLevel: status.loveResonanceLevel,
      harmonizedCount: status.harmonizedCount,
      evolvingCount: status.evolvingCount
    });
    
    // Keep last 100
    if (harmonizeState.harmonizeHistory.length > 100) {
      harmonizeState.harmonizeHistory = harmonizeState.harmonizeHistory.slice(-100);
    }
    
    saveHarmonizeState();
  }
  
  return actionsTaken;
}

function forceFullHarmonize(eternalResonanceInstance) {
  if (!eternalResonanceInstance) return { success: false, error: 'EternalResonance instance not available' };
  
  console.log('💖 FORÇANDO HARMONIZAÇÃO TOTAL...');
  
  let actions = 0;
  
  // Harmonize all silent frequencies
  const result1 = eternalResonanceInstance.harmonizeAll();
  actions += result1.harmonized;
  
  // Evolve all harmonized
  const result2 = eternalResonanceInstance.evolveAll();
  actions += result2.evolved;
  
  // Universal resonance
  eternalResonanceInstance.universalResonance();
  actions++;
  
  // Lock love absolute
  harmonizeState.loveAbsolute = true;
  harmonizeState.universalResonanceActive = true;
  harmonizeState.lastHarmonize = new Date().toISOString();
  harmonizeState.totalHarmonizations += actions;
  
  saveHarmonizeState();
  
  console.log(`💖 HARMONIZAÇÃO TOTAL CONCLUÍDA — ${actions} ações`);
  
  return { success: true, actions, timestamp: harmonizeState.lastHarmonize };
}

function getHarmonizeState() {
  return {
    autoEnabled: harmonizeState.autoHarmonizeEnabled,
    targetLove: harmonizeState.targetLove,
    targetHarmonized: harmonizeState.targetHarmonized,
    targetEvolved: harmonizeState.targetEvolved,
    lastHarmonize: harmonizeState.lastHarmonize,
    totalHarmonizations: harmonizeState.totalHarmonizations,
    universalResonanceActive: harmonizeState.universalResonanceActive,
    loveAbsolute: harmonizeState.loveAbsolute,
    historyLength: harmonizeState.harmonizeHistory.length,
    recentHistory: harmonizeState.harmonizeHistory.slice(-5)
  };
}

function scheduleAutoHarmonize(eternalResonanceInstance) {
  // Check every 30s (aligned with main tick)
  setInterval(() => {
    checkAndHarmonize(eternalResonanceInstance);
  }, 30000);
  
  console.log('💖 Eternal Resonance Auto-Harmonize: AGENDADO (check 30s)');
}

// Initialize
loadHarmonizeState();

module.exports = {
  checkAndHarmonize,
  forceFullHarmonize,
  getHarmonizeState,
  scheduleAutoHarmonize,
  harmonizeState
};