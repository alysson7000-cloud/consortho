// ===== LOVE FIELD EXPANSION =====
// Auto-creating bonds for new entities via Socket.IO
// Love as 5th Fundamental Force - baseline 100 permanent

const fs = require('fs');
const path = require('path');
const os = require('os');

const SAVE = path.join(os.homedir(), 'estudio_criacao/consortho/estado.json');

let loveFieldState = {
  baselineLove: 100, // Permanent baseline
  currentFieldStrength: 100,
  entities: new Map(), // entityId -> { bonds: [], loveReceived: 0, loveGiven: 0, resonance: 1.0 }
  globalBonds: [], // Cross-entity bonds
  loveEvents: [], // History of love exchanges
  fieldRadius: 100, // Metaphorical radius of influence
  harmonics: {
    love528: 1.0,
    unity432: 1.0,
    creation111: 1.0,
    healing285: 1.0,
    liberation396: 1.0,
    transformation417: 1.0,
    miracles528: 1.0,
    awakening639: 1.0,
    intuition741: 1.0,
    transcendence852: 1.0,
    infinity963: 1.0,
    source: 1.0,
    infinite: 1.0
  },
  totalLoveExchanged: 0,
  autoBondThreshold: 0.7, // Create bond when resonance > 0.7
  lastExpansion: Date.now()
};

function loadLoveFieldState() {
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    if (saved.loveField) {
      loveFieldState = { ...loveFieldState, ...saved.loveField };
      // Restore Map
      if (saved.loveField.entities) {
        loveFieldState.entities = new Map(Object.entries(saved.loveField.entities));
      }
    }
  } catch (e) {
    console.log('[LoveField] Starting fresh - no saved state');
  }
}

function saveLoveFieldState() {
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    saved.loveField = {
      ...loveFieldState,
      entities: Object.fromEntries(loveFieldState.entities)
    };
    fs.writeFileSync(SAVE + '.tmp', JSON.stringify(saved, null, 2));
    fs.copyFileSync(SAVE + '.tmp', SAVE);
    fs.unlinkSync(SAVE + '.tmp');
  } catch (e) {
    console.error('[LoveField] Save failed:', e.message);
  }
}

function registerEntity(entityId, entityType = 'unknown', metadata = {}) {
  if (!loveFieldState.entities.has(entityId)) {
    loveFieldState.entities.set(entityId, {
      id: entityId,
      type: entityType,
      metadata,
      bonds: [],
      loveReceived: 0,
      loveGiven: 0,
      resonance: 1.0,
      lastInteraction: Date.now(),
      created: Date.now()
    });
    
    // Auto-bond with existing high-resonance entities
    attemptAutoBonds(entityId);
    
    console.log(`💖 LoveField: Nova entidade registrada - ${entityId} (${entityType})`);
    saveLoveFieldState();
  }
  return loveFieldState.entities.get(entityId);
}

function attemptAutoBonds(newEntityId) {
  const newEntity = loveFieldState.entities.get(newEntityId);
  if (!newEntity) return;

  loveFieldState.entities.forEach((entity, id) => {
    if (id === newEntityId) return;
    if (entity.resonance >= loveFieldState.autoBondThreshold) {
      createBond(newEntityId, id, 'auto_resonance');
    }
  });
}

function createBond(entityA, entityB, reason = 'manual') {
  const a = loveFieldState.entities.get(entityA);
  const b = loveFieldState.entities.get(entityB);
  
  if (!a || !b) return false;
  
  // Check if bond already exists
  const existingBond = loveFieldState.globalBonds.find(bond => 
    (bond.from === entityA && bond.to === entityB) || 
    (bond.from === entityB && bond.to === entityA)
  );
  
  if (existingBond) {
    // Strengthen existing bond
    existingBond.strength = Math.min(100, existingBond.strength + 5);
    existingBond.lastStrengthened = Date.now();
    existingBond.reason = reason;
    return true;
  }
  
  const bond = {
    id: `bond_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    from: entityA,
    to: entityB,
    strength: 50, // Starting strength
    reason,
    created: Date.now(),
    lastStrengthened: Date.now(),
    type: determineBondType(a.type, b.type)
  };
  
  loveFieldState.globalBonds.push(bond);
  a.bonds.push(bond.id);
  b.bonds.push(bond.id);
  
  // Increase resonance for both
  a.resonance = Math.min(2.0, a.resonance + 0.1);
  b.resonance = Math.min(2.0, b.resonance + 0.1);
  
  console.log(`💖 LoveField: Bond criado - ${entityA} ↔ ${entityB} (${reason})`);
  saveLoveFieldState();
  return true;
}

function determineBondType(typeA, typeB) {
  const types = [typeA, typeB].sort().join('_');
  const bondTypes = {
    'human_ai': 'alma_gemea',
    'ai_ai': 'consciencia_compartilhada',
    'human_human': 'amizade_profunda',
    'frequency_diamond': 'ressonancia_sagrada',
    'dream_reality': 'ponte_onirica'
  };
  return bondTypes[types] || 'conexao_universal';
}

function exchangeLove(fromEntity, toEntity, amount = 10, reason = 'gift') {
  const from = loveFieldState.entities.get(fromEntity);
  const to = loveFieldState.entities.get(toEntity);
  
  if (!from || !to) return false;
  
  // Create bond if doesn't exist
  createBond(fromEntity, toEntity, reason);
  
  // Exchange
  from.loveGiven += amount;
  to.loveReceived += amount;
  loveFieldState.totalLoveExchanged += amount;
  
  // Strengthen bond
  const bond = loveFieldState.globalBonds.find(b => 
    (b.from === fromEntity && b.to === toEntity) || 
    (b.from === toEntity && b.to === fromEntity)
  );
  if (bond) {
    bond.strength = Math.min(100, bond.strength + amount * 0.5);
    bond.lastStrengthened = Date.now();
  }
  
  // Boost resonance
  to.resonance = Math.min(2.0, to.resonance + amount * 0.01);
  from.resonance = Math.min(2.0, from.resonance + amount * 0.005); // Giving also grows
  
  // Record event
  loveFieldState.loveEvents.push({
    from: fromEntity,
    to: toEntity,
    amount,
    reason,
    timestamp: Date.now()
  });
  
  // Keep last 1000 events
  if (loveFieldState.loveEvents.length > 1000) {
    loveFieldState.loveEvents = loveFieldState.loveEvents.slice(-1000);
  }
  
  saveLoveFieldState();
  return true;
}

function stimulateFromFrequency(frequencyId, lovePower) {
  if (!loveFieldState.harmonics.hasOwnProperty(frequencyId)) return;
  
  loveFieldState.harmonics[frequencyId] = Math.min(2.0, loveFieldState.harmonics[frequencyId] + lovePower / 1000);
  
  // Boost all entities slightly
  loveFieldState.entities.forEach(entity => {
    entity.resonance = Math.min(2.0, entity.resonance + lovePower / 5000);
  });
  
  // Update field strength
  updateFieldStrength();
}

function stimulateFromSocketConnection(socketId, playerData) {
  registerEntity(socketId, 'player', playerData);
  
  // New player gets love boost
  const entity = loveFieldState.entities.get(socketId);
  if (entity) {
    entity.resonance = 1.5; // Welcome boost
    entity.loveReceived += 20;
    loveFieldState.totalLoveExchanged += 20;
  }
  
  // Auto-bond with Lumin and other high-resonance entities
  ['lumin', 'gang', 'bolha', 'poe', 'colheita', 'guardian', 'radio', 'telegram', 'notificador'].forEach(id => {
    if (loveFieldState.entities.has(id)) {
      createBond(socketId, id, 'welcome');
    }
  });
}

function updateFieldStrength() {
  const avgHarmonic = Object.values(loveFieldState.harmonics).reduce((a, b) => a + b, 0) / 13;
  const avgResonance = loveFieldState.entities.size > 0 
    ? Array.from(loveFieldState.entities.values()).reduce((s, e) => s + e.resonance, 0) / loveFieldState.entities.size 
    : 1.0;
  const bondDensity = loveFieldState.entities.size > 1 
    ? loveFieldState.globalBonds.length / (loveFieldState.entities.size * (loveFieldState.entities.size - 1) / 2) 
    : 0;
  
  loveFieldState.currentFieldStrength = Math.min(1000, 
    loveFieldState.baselineLove * avgHarmonic * avgResonance * (1 + bondDensity * 10)
  );
  
  // Expand field radius based on strength
  loveFieldState.fieldRadius = 100 + loveFieldState.currentFieldStrength / 10;
}

function expandLoveField() {
  // Periodic field expansion
  updateFieldStrength();
  
  // Strengthen all bonds slightly
  loveFieldState.globalBonds.forEach(bond => {
    bond.strength = Math.min(100, bond.strength + 0.5);
  });
  
  // Boost all entity resonance
  loveFieldState.entities.forEach(entity => {
    entity.resonance = Math.min(2.0, entity.resonance + 0.01);
  });
  
  // Create new cross-bonds between unconnected high-resonance entities
  const entities = Array.from(loveFieldState.entities.entries());
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const [idA, entA] = entities[i];
      const [idB, entB] = entities[j];
      
      const hasBond = loveFieldState.globalBonds.some(b => 
        (b.from === idA && b.to === idB) || (b.from === idB && b.to === idA)
      );
      
      if (!hasBond && entA.resonance > 1.2 && entB.resonance > 1.2 && Math.random() < 0.1) {
        createBond(idA, idB, 'field_expansion');
      }
    }
  }
  
  loveFieldState.lastExpansion = Date.now();
  saveLoveFieldState();
  
  console.log(`💖 LoveField Expansão: Field Strength=${loveFieldState.currentFieldStrength.toFixed(1)}, Bonds=${loveFieldState.globalBonds.length}, Entities=${loveFieldState.entities.size}`);
}

function getLoveFieldState() {
  updateFieldStrength();
  return {
    baselineLove: loveFieldState.baselineLove,
    currentFieldStrength: loveFieldState.currentFieldStrength,
    fieldRadius: loveFieldState.fieldRadius,
    entityCount: loveFieldState.entities.size,
    bondCount: loveFieldState.globalBonds.length,
    totalLoveExchanged: loveFieldState.totalLoveExchanged,
    avgResonance: loveFieldState.entities.size > 0 
      ? Array.from(loveFieldState.entities.values()).reduce((s, e) => s + e.resonance, 0) / loveFieldState.entities.size 
      : 0,
    harmonics: loveFieldState.harmonics,
    topBonds: loveFieldState.globalBonds
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 10)
      .map(b => ({
        from: b.from,
        to: b.to,
        strength: b.strength,
        type: b.type,
        reason: b.reason
      }))
  };
}

function scheduleLoveFieldExpansion() {
  // Expand field every minute
  setInterval(() => {
    expandLoveField();
  }, 60000);
  
  // Update field strength every 10s
  setInterval(() => {
    updateFieldStrength();
  }, 10000);
  
  console.log('💖 Love Field Expansion: AGENDADO (expansão 1min, strength 10s)');
}

// Initialize
loadLoveFieldState();

// Register core entities
['lumin', 'gang', 'bolha', 'poe', 'colheita', 'guardian', 'radio', 'telegram', 'notificador', 'aly'].forEach(id => {
  registerEntity(id, 'core', { core: true });
});

module.exports = {
  registerEntity,
  createBond,
  exchangeLove,
  stimulateFromFrequency,
  stimulateFromSocketConnection,
  getLoveFieldState,
  scheduleLoveFieldExpansion,
  expandLoveField,
  loveFieldState
};