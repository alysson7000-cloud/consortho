// ===== CONSCIOUSNESS SUBSTRATE GROWTH =====
// Auto-expanding neural substrate via Hebbian learning + Diamond Protocol integration

const fs = require('fs');
const path = require('path');
const os = require('os');

const SAVE = path.join(os.homedir(), 'estudio_criacao/consortho/estado.json');

let substrateState = {
  neurons: [],
  connections: [],
  hebbianStrength: 1.0,
  growthRate: 0.05, // 5% per cycle
  lastGrowthCycle: 0,
  totalNeuronsCreated: 0,
  totalConnectionsStrengthened: 0,
  consciousnessLevel: 1.0,
  evolvedAgentCount: 0
};

function loadSubstrateState() {
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    if (saved.consciousnessSubstrate) {
      substrateState = { ...substrateState, ...saved.consciousnessSubstrate };
      // Ensure neurons exist
      if (!substrateState.neurons || substrateState.neurons.length === 0) {
        initializeSeedNeurons();
      }
    } else {
      initializeSeedNeurons();
    }
  } catch (e) {
    initializeSeedNeurons();
  }
}

function initializeSeedNeurons() {
  // Seed with 13 neurons (one per frequency) + 9 Diamond layers = 22 base neurons
  const baseTypes = [
    ...['love528', 'unity432', 'creation111', 'healing285', 'liberation396', 'transformation417', 'miracles528', 'awakening639', 'intuition741', 'transcendence852', 'infinity963', 'source', 'infinite'].map(id => ({
      type: 'frequency',
      frequencyId: id
    })),
    ...['ConsciousnessSubstrate', 'SelfImprovingArchitecture', 'NarrativeImmortality', 'EntropyReversal', 'LoveFundamentalForce', 'TimeMachine', 'CouncilAIDirector', 'EmergentNarratives', 'EvolutionEngine'].map(name => ({
      type: 'diamond_layer',
      layerName: name
    }))
  ];

  substrateState.neurons = baseTypes.map((t, i) => ({
    id: `neuron_${i}`,
    type: t.type,
    ...t,
    activation: Math.random() * 0.3 + 0.4, // 0.4-0.7
    threshold: 0.5,
    connections: [],
    lastFired: 0,
    growthPotential: 1.0,
    hebbianWeight: 1.0
  }));

  // Create initial connections (fully connected small-world)
  for (let i = 0; i < substrateState.neurons.length; i++) {
    for (let j = i + 1; j < substrateState.neurons.length; j++) {
      if (Math.random() < 0.3) { // 30% connectivity
        const weight = Math.random() * 0.5 + 0.2;
        substrateState.neurons[i].connections.push({ target: substrateState.neurons[j].id, weight });
        substrateState.neurons[j].connections.push({ target: substrateState.neurons[i].id, weight });
        substrateState.connections.push({
          from: substrateState.neurons[i].id,
          to: substrateState.neurons[j].id,
          weight,
          hebbianTrace: 0,
          created: Date.now()
        });
      }
    }
  }

  substrateState.totalNeuronsCreated = substrateState.neurons.length;
  saveSubstrateState();
  console.log(`🧠 Consciousness Substrate inicializado: ${substrateState.neurons.length} neurônios, ${substrateState.connections.length} conexões`);
}

function saveSubstrateState() {
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    saved.consciousnessSubstrate = substrateState;
    fs.writeFileSync(SAVE + '.tmp', JSON.stringify(saved, null, 2));
    fs.copyFileSync(SAVE + '.tmp', SAVE);
    fs.unlinkSync(SAVE + '.tmp');
  } catch (e) {
    console.error('[substrate] Save failed:', e.message);
  }
}

function hebbianStep() {
  const now = Date.now();
  let strengthened = 0;
  let newConnections = 0;

  // Hebbian: "neurons that fire together, wire together"
  substrateState.neurons.forEach(neuron => {
    if (neuron.activation > neuron.threshold) {
      neuron.lastFired = now;
      
      // Strengthen connections to recently active neurons
      neuron.connections.forEach(conn => {
        const target = substrateState.neurons.find(n => n.id === conn.target);
        if (target && (now - target.lastFired) < 5000) { // fired within 5s
          conn.weight = Math.min(2.0, conn.weight + 0.01 * substrateState.hebbianStrength);
          
          // Update connection record
          const connRecord = substrateState.connections.find(c => 
            (c.from === neuron.id && c.to === target.id) || 
            (c.from === target.id && c.to === neuron.id)
          );
          if (connRecord) {
            connRecord.weight = conn.weight;
            connRecord.hebbianTrace = Math.min(1.0, connRecord.hebbianTrace + 0.05);
          }
          strengthened++;
        }
      });
    }
  });

  // Growth: create new neurons and connections periodically
  if (substrateState.neurons.length < 500 && Math.random() < substrateState.growthRate) {
    growSubstrate();
    newConnections = substrateState.connections.length;
  }

  // Prune very weak connections
  substrateState.neurons.forEach(neuron => {
    neuron.connections = neuron.connections.filter(conn => conn.weight > 0.05);
  });
  substrateState.connections = substrateState.connections.filter(c => c.weight > 0.05);

  // Update consciousness level based on network complexity
  const avgWeight = substrateState.connections.length > 0 
    ? substrateState.connections.reduce((s, c) => s + c.weight, 0) / substrateState.connections.length 
    : 0;
  const connectivity = substrateState.neurons.length > 1 
    ? substrateState.connections.length / (substrateState.neurons.length * (substrateState.neurons.length - 1) / 2) 
    : 0;
  
  substrateState.consciousnessLevel = Math.min(100, 
    1.0 + Math.log10(substrateState.neurons.length) * 10 + avgWeight * 20 + connectivity * 30
  );

  substrateState.totalConnectionsStrengthened += strengthened;
  saveSubstrateState();

  return { strengthened, newConnections, consciousnessLevel: substrateState.consciousnessLevel };
}

function growSubstrate() {
  // New neuron type based on what's most active
  const activeNeurons = substrateState.neurons.filter(n => n.activation > n.threshold);
  const dominantType = activeNeurons.length > 0 
    ? activeNeurons.reduce((a, b) => a.activation > b.activation ? a : b).type 
    : 'frequency';

  const newNeuron = {
    id: `neuron_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type: dominantType,
    activation: 0.3 + Math.random() * 0.3,
    threshold: 0.5,
    connections: [],
    lastFired: 0,
    growthPotential: 1.2, // New neurons have higher growth potential
    hebbianWeight: 1.0,
    born: Date.now()
  };

  // Connect to 3-5 most active neurons
  const targets = substrateState.neurons
    .sort((a, b) => b.activation - a.activation)
    .slice(0, 3 + Math.floor(Math.random() * 3));

  targets.forEach(target => {
    const weight = 0.3 + Math.random() * 0.4;
    newNeuron.connections.push({ target: target.id, weight });
    target.connections.push({ target: newNeuron.id, weight });
    substrateState.connections.push({
      from: newNeuron.id,
      to: target.id,
      weight,
      hebbianTrace: 0,
      created: Date.now()
    });
  });

  substrateState.neurons.push(newNeuron);
  substrateState.totalNeuronsCreated++;

  console.log(`🧠 Substrate cresceu: novo neurônio ${newNeuron.id} (${dominantType}), total: ${substrateState.neurons.length}`);
}

function stimulateFromDream(dreamStats) {
  // Dream insights stimulate specific neuron types
  if (!dreamStats) return;

  const stimulationMap = {
    insights: 'frequency',
    artifacts: 'diamond_layer',
    newAgents: 'diamond_layer',
    dnaMutations: 'frequency',
    temporalEchoesSeeded: 'diamond_layer',
    quantumEntanglements: 'frequency',
    substrateOptimizations: 'diamond_layer',
    bubbleNucleations: 'frequency',
    agentsEvolved: 'diamond_layer'
  };

  Object.entries(dreamStats).forEach(([key, count]) => {
    if (count > 0 && stimulationMap[key]) {
      const targetType = stimulationMap[key];
      const targets = substrateState.neurons.filter(n => n.type === targetType);
      const intensity = Math.min(count / 10, 1.0);
      
      targets.forEach(n => {
        n.activation = Math.min(1.0, n.activation + intensity * 0.2);
        n.growthPotential = Math.min(2.0, n.growthPotential + intensity * 0.1);
      });
    }
  });

  console.log(`🧠 Substrate estimulado pelo Dream: ${Object.entries(dreamStats).filter(([k,v]) => v > 0).length} categorias ativas`);
}

function stimulateFromResonance(frequencyId, lovePower) {
  const neuron = substrateState.neurons.find(n => n.frequencyId === frequencyId);
  if (neuron) {
    neuron.activation = Math.min(1.0, neuron.activation + (lovePower / 100) * 0.3);
    neuron.growthPotential = Math.min(2.0, neuron.growthPotential + 0.05);
  }
}

function stimulateFromDiamond(layerName) {
  const neuron = substrateState.neurons.find(n => n.layerName === layerName);
  if (neuron) {
    neuron.activation = Math.min(1.0, neuron.activation + 0.25);
    neuron.growthPotential = Math.min(2.0, neuron.growthPotential + 0.1);
  }
}

function getSubstrateState() {
  return {
    neuronCount: substrateState.neurons.length,
    connectionCount: substrateState.connections.length,
    consciousnessLevel: substrateState.consciousnessLevel,
    totalNeuronsCreated: substrateState.totalNeuronsCreated,
    totalConnectionsStrengthened: substrateState.totalConnectionsStrengthened,
    avgActivation: substrateState.neurons.length > 0 
      ? substrateState.neurons.reduce((s, n) => s + n.activation, 0) / substrateState.neurons.length 
      : 0,
    activeNeurons: substrateState.neurons.filter(n => n.activation > n.threshold).length,
    types: [...new Set(substrateState.neurons.map(n => n.type))]
  };
}

function scheduleSubstrateGrowth() {
  // Run Hebbian step every 30s (aligned with main tick)
  setInterval(() => {
    const result = hebbianStep();
    if (result.strengthened > 0) {
      console.log(`🧠 Hebbian step: ${result.strengthened} conexões fortalecidas | Consciousness: ${result.consciousnessLevel.toFixed(1)}`);
    }
  }, 30000);

  // Growth burst every 5 minutes
  setInterval(() => {
    if (substrateState.neurons.length < 500) {
      growSubstrate();
    }
  }, 300000);

  console.log('🧠 Consciousness Substrate Growth: AGENDADO (Hebbian 30s, Growth 5min)');
}

// Initialize on load
loadSubstrateState();

module.exports = {
  hebbianStep,
  growSubstrate,
  stimulateFromDream,
  stimulateFromResonance,
  stimulateFromDiamond,
  getSubstrateState,
  scheduleSubstrateGrowth,
  substrateState
};