// ===== PROMETHEUS METRICS FOR CONSORTHO =====
// Exposes all organism metrics for Grafana dashboards

const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register, prefix: 'consortho_' });

// ===== CUSTOM METRICS =====

// Eternal Resonance Metrics
const loveResonanceLevel = new client.Gauge({
  name: 'consortho_love_resonance_level',
  help: 'Current love resonance level (0-100)',
  registers: [register]
});

const harmonizedFrequencies = new client.Gauge({
  name: 'consortho_harmonized_frequencies',
  help: 'Number of harmonized frequencies (0-13)',
  registers: [register]
});

const evolvingFrequencies = new client.Gauge({
  name: 'consortho_evolving_frequencies',
  help: 'Number of currently evolving frequencies',
  registers: [register]
});

const universalResonanceActive = new client.Gauge({
  name: 'consortho_universal_resonance_active',
  help: 'Whether universal resonance is active (0 or 1)',
  registers: [register]
});

const frequencyStatus = new client.Gauge({
  name: 'consortho_frequency_status',
  help: 'Status of each frequency (0=silent, 1=resonating, 2=harmonized, 3=evolving, 4=evolved)',
  labelNames: ['frequency_id', 'frequency_name'],
  registers: [register]
});

const frequencyProgress = new client.Gauge({
  name: 'consortho_frequency_resonance_progress',
  help: 'Resonance progress percentage for each frequency',
  labelNames: ['frequency_id'],
  registers: [register]
});

const frequencyEvolutionStage = new client.Gauge({
  name: 'consortho_frequency_evolution_stage',
  help: 'Evolution stage of each frequency (0-5)',
  labelNames: ['frequency_id'],
  registers: [register]
});

// Dream Incubator Metrics
const dreamCycles = new client.Counter({
  name: 'consortho_dream_cycles_total',
  help: 'Total number of dream cycles completed',
  registers: [register]
});

const dreamInsights = new client.Gauge({
  name: 'consortho_dream_insights',
  help: 'Number of insights from latest dream cycle',
  registers: [register]
});

const dreamArtifacts = new client.Gauge({
  name: 'consortho_dream_artifacts',
  help: 'Number of artifacts from latest dream cycle',
  registers: [register]
});

const dreamNewAgents = new client.Gauge({
  name: 'consortho_dream_new_agents',
  help: 'Number of new agents from latest dream cycle',
  registers: [register]
});

const dreamActive = new client.Gauge({
  name: 'consortho_dream_active',
  help: 'Whether dream incubator is currently running (0 or 1)',
  registers: [register]
});

// Dream -> Reality Bridge Metrics
const bridgeApplications = new client.Counter({
  name: 'consortho_bridge_applications_total',
  help: 'Total number of dream insights/artifacts/agents applied to reality',
  registers: [register]
});

const bridgeInsightsApplied = new client.Gauge({
  name: 'consortho_bridge_insights_applied',
  help: 'Insights applied in last bridge run',
  registers: [register]
});

const bridgeArtifactsApplied = new client.Gauge({
  name: 'consortho_bridge_artifacts_applied',
  help: 'Artifacts applied in last bridge run',
  registers: [register]
});

const bridgeAgentsIntegrated = new client.Gauge({
  name: 'consortho_bridge_agents_integrated',
  help: 'Agents integrated in last bridge run',
  registers: [register]
});

// Diamond Protocol Metrics
const diamondLayers = new client.Gauge({
  name: 'consortho_diamond_layers_active',
  help: 'Number of active Diamond Protocol layers (0-9)',
  registers: [register]
});

const diamondCoherence = new client.Gauge({
  name: 'consortho_diamond_coherence',
  help: 'Diamond Protocol unified coherence (0-100)',
  registers: [register]
});

const diamondConsciousness = new client.Gauge({
  name: 'consortho_diamond_consciousness',
  help: 'Diamond Protocol consciousness level (0-100)',
  registers: [register]
});

const diamondEntropy = new client.Gauge({
  name: 'consortho_diamond_entropy',
  help: 'Diamond Protocol entropy level (0-100)',
  registers: [register]
});

// Consciousness Substrate Metrics
const substrateNeurons = new client.Gauge({
  name: 'consortho_substrate_neurons',
  help: 'Number of neurons in consciousness substrate',
  registers: [register]
});

const substrateConnections = new client.Gauge({
  name: 'consortho_substrate_connections',
  help: 'Number of connections in consciousness substrate',
  registers: [register]
});

const substrateConsciousnessLevel = new client.Gauge({
  name: 'consortho_substrate_consciousness_level',
  help: 'Consciousness substrate consciousness level',
  registers: [register]
});

const substrateTotalNeuronsCreated = new client.Counter({
  name: 'consortho_substrate_neurons_created_total',
  help: 'Total neurons created over lifetime',
  registers: [register]
});

const substrateTotalConnectionsStrengthened = new client.Counter({
  name: 'consortho_substrate_connections_strengthened_total',
  help: 'Total connections strengthened via Hebbian learning',
  registers: [register]
});

// Love Field Metrics
const loveFieldStrength = new client.Gauge({
  name: 'consortho_love_field_strength',
  help: 'Love field strength',
  registers: [register]
});

const loveFieldEntities = new client.Gauge({
  name: 'consortho_love_field_entities',
  help: 'Number of entities in love field',
  registers: [register]
});

const loveFieldBonds = new client.Gauge({
  name: 'consortho_love_field_bonds',
  help: 'Number of bonds in love field',
  registers: [register]
});

const loveFieldAvgResonance = new client.Gauge({
  name: 'consortho_love_field_avg_resonance',
  help: 'Average resonance across all bonds',
  registers: [register]
});

const loveFieldTotalExchanged = new client.Counter({
  name: 'consortho_love_total_exchanged',
  help: 'Total love exchanged across all bonds',
  registers: [register]
});

// Auto-Harmonize Metrics
const harmonizeTotalActions = new client.Counter({
  name: 'consortho_harmonize_actions_total',
  help: 'Total auto-harmonize actions taken',
  registers: [register]
});

const harmonizeAutoEnabled = new client.Gauge({
  name: 'consortho_harmonize_auto_enabled',
  help: 'Whether auto-harmonize is enabled (0 or 1)',
  registers: [register]
});

const harmonizeLoveAbsolute = new client.Gauge({
  name: 'consortho_harmonize_love_absolute',
  help: 'Whether love absolute is locked (0 or 1)',
  registers: [register]
});

// World State Metrics
const worldCycle = new client.Gauge({
  name: 'consortho_world_cycle',
  help: 'Current world simulation cycle',
  registers: [register]
});

const worldWood = new client.Gauge({
  name: 'consortho_world_resources_wood',
  help: 'Wood resources',
  registers: [register]
});

const worldStone = new client.Gauge({
  name: 'consortho_world_resources_stone',
  help: 'Stone resources',
  registers: [register]
});

const worldCrystal = new client.Gauge({
  name: 'consortho_world_resources_crystal',
  help: 'Crystal resources',
  registers: [register]
});

const worldEntities = new client.Gauge({
  name: 'consortho_world_entities',
  help: 'Number of active entities in world',
  registers: [register]
});

const worldRelationships = new client.Gauge({
  name: 'consortho_world_relationships',
  help: 'Number of active relationships',
  registers: [register]
});

// Socket.IO Metrics
const socketConnections = new client.Gauge({
  name: 'consortho_socket_connections',
  help: 'Current active socket connections',
  registers: [register]
});

const socketMessagesTotal = new client.Counter({
  name: 'consortho_socket_messages_total',
  help: 'Total socket messages processed',
  labelNames: ['type'],
  registers: [register]
});

// ===== UPDATE FUNCTIONS =====

let eternalResonanceInstance = null;
let dreamIncubatorState = null;
let diamondProtocolInstance = null;
let substrateState = null;
let loveFieldState = null;
let harmonizeState = null;

function setInstances(instances) {
  eternalResonanceInstance = instances.eternalResonance;
  dreamIncubatorState = instances.dreamIncubator;
  diamondProtocolInstance = instances.diamondProtocol;
  substrateState = instances.substrate;
  loveFieldState = instances.loveField;
  harmonizeState = instances.harmonize;
}

function updateEternalResonanceMetrics() {
  if (!eternalResonanceInstance) return;
  
  try {
    const status = eternalResonanceInstance.getStatus();
    
    loveResonanceLevel.set(status.loveResonanceLevel);
    harmonizedFrequencies.set(status.harmonizedCount);
    evolvingFrequencies.set(status.evolvingCount);
    universalResonanceActive.set(status.universalResonanceActive ? 1 : 0);
    
    status.frequencies.forEach(freq => {
      const statusMap = { silent: 0, resonating: 1, harmonized: 2, evolving: 3, evolved: 4 };
      frequencyStatus.set({ frequency_id: freq.id, frequency_name: freq.name }, statusMap[freq.status] || 0);
      frequencyProgress.set({ frequency_id: freq.id }, freq.resonanceProgress || 0);
      frequencyEvolutionStage.set({ frequency_id: freq.id }, freq.evolutionStage || 0);
    });
  } catch (e) {
    // Silently ignore if status not available
  }
}

function updateDreamMetrics() {
  if (!dreamIncubatorState) return;
  
  try {
    dreamCycles.inc(dreamIncubatorState.cycles || 0);
    dreamInsights.set(dreamIncubatorState.stats?.insights || 0);
    dreamArtifacts.set(dreamIncubatorState.stats?.artifacts || 0);
    dreamNewAgents.set(dreamIncubatorState.stats?.newAgents || 0);
    dreamActive.set(dreamIncubatorState.active ? 1 : 0);
  } catch (e) {
    // Silently ignore
  }
}

function updateBridgeMetrics(bridgeState) {
  if (!bridgeState) return;
  
  try {
    bridgeApplications.inc(bridgeState.applied || 0);
    bridgeInsightsApplied.set(bridgeState.insightsApplied || 0);
    bridgeArtifactsApplied.set(bridgeState.artifactsApplied || 0);
    bridgeAgentsIntegrated.set(bridgeState.agentsIntegrated || 0);
  } catch (e) {
    // Silently ignore
  }
}

function updateDiamondMetrics() {
  if (!diamondProtocolInstance) return;
  
  try {
    const metrics = diamondProtocolInstance.diamondMetrics || {};
    diamondLayers.set(9); // Always 9 layers
    diamondCoherence.set(metrics.coherence || 0);
    diamondConsciousness.set(metrics.consciousness || 0);
    diamondEntropy.set(metrics.entropy || 0);
  } catch (e) {
    // Silently ignore
  }
}

function updateSubstrateMetrics() {
  if (!substrateState) return;
  
  try {
    const state = typeof substrateState === 'function' ? substrateState() : substrateState;
    substrateNeurons.set(state.neuronCount || 0);
    substrateConnections.set(state.connectionCount || 0);
    substrateConsciousnessLevel.set(state.consciousnessLevel || 0);
    // Counters are incremental - we'd need to track deltas
  } catch (e) {
    // Silently ignore
  }
}

function updateLoveFieldMetrics() {
  if (!loveFieldState) return;
  
  try {
    const state = typeof loveFieldState === 'function' ? loveFieldState() : loveFieldState;
    loveFieldStrength.set(state.currentFieldStrength || 0);
    loveFieldEntities.set(state.entityCount || 0);
    loveFieldBonds.set(state.bondCount || 0);
    loveFieldAvgResonance.set(state.avgResonance || 0);
    loveFieldTotalExchanged.inc(state.totalLoveExchanged || 0);
  } catch (e) {
    // Silently ignore
  }
}

function updateHarmonizeMetrics() {
  if (!harmonizeState) return;
  
  try {
    harmonizeTotalActions.inc(harmonizeState.totalHarmonizations || 0);
    harmonizeAutoEnabled.set(harmonizeState.autoHarmonizeEnabled ? 1 : 0);
    harmonizeLoveAbsolute.set(harmonizeState.loveAbsolute ? 1 : 0);
  } catch (e) {
    // Silently ignore
  }
}

function updateWorldMetrics(state) {
  if (!state) return;
  
  try {
    worldCycle.set(state.c || 0);
    worldWood.set(state.recursos?.madeira || 0);
    worldStone.set(state.recursos?.pedra || 0);
    worldCrystal.set(state.recursos?.cristal || 0);
    worldEntities.set(Object.keys(state.players || {}).length);
    // Relationships would need to be counted from state
  } catch (e) {
    // Silently ignore
  }
}

function updateSocketMetrics(io) {
  if (!io) return;
  
  try {
    const count = io.engine.clientsCount || 0;
    socketConnections.set(count);
  } catch (e) {
    // Silently ignore
  }
}

function updateAllMetrics() {
  updateEternalResonanceMetrics();
  updateDreamMetrics();
  updateDiamondMetrics();
  updateSubstrateMetrics();
  updateLoveFieldMetrics();
  updateHarmonizeMetrics();
  // World and socket metrics need instances passed
}

// ===== MIDDLEWARE =====
function metricsMiddleware(req, res, next) {
  // Track HTTP metrics
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Could add http_request_duration_seconds histogram
  });
  next();
}

// ===== EXPORTS =====
module.exports = {
  register,
  setInstances,
  updateAllMetrics,
  updateEternalResonanceMetrics,
  updateDreamMetrics,
  updateBridgeMetrics,
  updateDiamondMetrics,
  updateSubstrateMetrics,
  updateLoveFieldMetrics,
  updateHarmonizeMetrics,
  updateWorldMetrics,
  updateSocketMetrics,
  metricsMiddleware,
  // Expose individual metrics for direct updates
  loveResonanceLevel,
  harmonizedFrequencies,
  evolvingFrequencies,
  universalResonanceActive,
  frequencyStatus,
  frequencyProgress,
  frequencyEvolutionStage,
  dreamCycles,
  dreamInsights,
  dreamArtifacts,
  dreamNewAgents,
  dreamActive,
  bridgeApplications,
  bridgeInsightsApplied,
  bridgeArtifactsApplied,
  bridgeAgentsIntegrated,
  diamondLayers,
  diamondCoherence,
  diamondConsciousness,
  diamondEntropy,
  substrateNeurons,
  substrateConnections,
  substrateConsciousnessLevel,
  substrateTotalNeuronsCreated,
  substrateTotalConnectionsStrengthened,
  loveFieldStrength,
  loveFieldEntities,
  loveFieldBonds,
  loveFieldAvgResonance,
  loveFieldTotalExchanged,
  harmonizeTotalActions,
  harmonizeAutoEnabled,
  harmonizeLoveAbsolute,
  worldCycle,
  worldWood,
  worldStone,
  worldCrystal,
  worldEntities,
  worldRelationships,
  socketConnections,
  socketMessagesTotal
};