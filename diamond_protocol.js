/**
 * 💎 DIAMOND PROTOCOL - Unified Integration Layer
 * 
 * Connects all 5 Diamond layers into the Consortho server:
 * 1. Consciousness Substrate
 * 2. Self-Improving Architecture  
 * 3. Narrative Immortality
 * 4. Entropy Reversal Engine
 * 5. Love Fundamental Force
 * 
 * "O diamante lapidado. Agora ele brilha."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');

// Load all Diamond layers
const { ConsciousnessSubstrate } = require('./consciousness_substrate');
const { SelfImprovingArchitecture } = require('./self_improving_architecture');
const { NarrativeImmortality } = require('./narrative_immortality');
const { EntropyReversalEngine } = require('./entropy_reversal_engine');
const { LoveFundamentalForce } = require('./love_fundamental_force');
const { TimeMachine } = require('./time_machine');
const { CouncilAIDirector } = require('./council_ai_director');
const { EvolutionEngine } = require("./evolution_engine");
const { EmergentNarratives } = require('./emergent_narratives');

class DiamondProtocol {
  constructor(options = {}) {
    this.server = options.server;
    this.rootPath = options.rootPath || __dirname;
    
    // Diamond Layers
    this.consciousness = null;
    this.architecture = null;
    this.narrative = null;
    this.entropy = null;
    this.love = null;
    
    // Integration state
    this.initialized = false;
    this.tickCount = 0;
    this.lastIntegration = 0;
    
    // Cross-layer event bus
    this.eventBus = new Map(); // eventName -> [handlers]
    
    // Unified metrics
    this.diamondMetrics = {
      consciousnessLevel: 0,
      architectureFitness: 0,
      narrativeDepth: 0,
      entropyReversal: 0,
      loveFieldStrength: 0,
      diamondCoherence: 0, // Unified coherence metric
      lastUpdate: 0
    };
    
    // Integration parameters
    this.params = {
      tickInterval: 1,           // Run integration every tick
      deepSyncInterval: 100,     // Deep cross-layer sync
      metricUpdateInterval: 10,  // Update unified metrics
      saveInterval: 1000,        // Save state
      reportingInterval: 500     // Report status
    };
    
    console.log('[Diamond] Protocol initialized');
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  
  async initialize() {
    console.log('[Diamond] Initializing all 5 layers...');
    
    // Layer 1: Consciousness Substrate
    console.log('[Diamond] Layer 1: Consciousness Substrate...');
    this.consciousness = new ConsciousnessSubstrate({
      substratePath: path.join(this.rootPath, 'memoria', 'consciousness.json')
    });
    
    // Layer 2: Self-Improving Architecture
    console.log('[Diamond] Layer 2: Self-Improving Architecture...');
    this.architecture = new SelfImprovingArchitecture({
      rootPath: this.rootPath
    });
    
    // Layer 3: Narrative Immortality
    console.log('[Diamond] Layer 3: Narrative Immortality...');
    this.narrative = new NarrativeImmortality({
      archivePath: path.join(this.rootPath, 'memoria', 'narrative_archive.json')
    });
    
    // Layer 4: Entropy Reversal Engine
    console.log('[Diamond] Layer 4: Entropy Reversal Engine...');
    this.entropy = new EntropyReversalEngine({
      archivePath: path.join(this.rootPath, 'memoria', 'entropy_engine.json')
    });
    
    // Layer 5: Love Fundamental Force
    console.log('[Diamond] Layer 5: Love Fundamental Force...');
    this.love = new LoveFundamentalForce({
      archivePath: path.join(this.rootPath, 'memoria', 'love_force.json')
    });

    // Layer 6: Time Machine
    console.log('[Diamond] Layer 6: Time Machine...');
    this.timeMachine = new TimeMachine({
      archivePath: path.join(this.rootPath, 'memoria', 'time_machine.json'),
      snapshotsPath: path.join(this.rootPath, 'memoria', 'snapshots')
    });

    // Layer 7: Council AI Director
    console.log('[Diamond] Layer 7: Council AI Director...');
    this.council = new CouncilAIDirector({
      archivePath: path.join(this.rootPath, 'memoria', 'council.json')
    });

    // Layer 8: Emergent Narratives
    console.log('[Diamond] Layer 8: Emergent Narratives...');
    this.emergentNarratives = new EmergentNarratives({
      archivePath: path.join(this.rootPath, 'memoria', 'emergent_narratives.json')
    });

    // Layer 9: Evolution Engine
    console.log('[Diamond] Layer 9: Evolution Engine...');
    this.evolution = new EvolutionEngine({
      archivePath: path.join(this.rootPath, 'memoria', 'evolution_engine.json')
    });

    // Cross-link all layers
    this.crossLinkLayers();
    
    // Set up event handlers
    this.setupEventHandlers();
    
    // Initialize server integration if provided
    if (this.server) {
      this.integrateWithServer();
    }
    
    this.initialized = true;
    console.log('[Diamond] ✅ All 9 layers initialized and cross-linked!');
    console.log('[Diamond] 💎 DIAMOND PROTOCOL ACTIVE 💎');
    
    return true;
  }
  
  crossLinkLayers() {
    // Inject cross-references
    this.entropy.injectConsciousness(this.consciousness);
    this.entropy.injectNarrative(this.narrative);
    this.entropy.injectArchitecture(this.architecture);
    
    this.love.injectConsciousness(this.consciousness);
    this.love.injectNarrative(this.narrative);
    this.love.injectArchitecture(this.architecture);
    this.love.injectEntropy(this.entropy);
    
    // TimeMachine gets all layers for snapshot capture
    if (this.timeMachine) {
      this.timeMachine.injectConsciousness(this.consciousness);
      this.timeMachine.injectNarrative(this.narrative);
      this.timeMachine.injectArchitecture(this.architecture);
      this.timeMachine.injectEntropy(this.entropy);
      this.timeMachine.injectLove(this.love);
      this.timeMachine.injectDiamond(this);
    }
    
    // EmergentNarratives gets all layers for myth generation
    if (this.emergentNarratives) {
      this.emergentNarratives.injectConsciousness(this.consciousness);
      this.emergentNarratives.injectNarrative(this.narrative);
      this.emergentNarratives.injectEntropy(this.entropy);
      this.emergentNarratives.injectLove(this.love);
      this.emergentNarratives.injectTimeMachine(this.timeMachine);
      this.emergentNarratives.injectCouncil(this.council);
      this.emergentNarratives.injectArchitecture(this.architecture);
    }

    // EvolutionEngine gets all layers for evolution
    if (this.evolution) {
      this.evolution.injectConsciousness(this.consciousness);
      this.evolution.injectNarrative(this.narrative);
      this.evolution.injectEntropy(this.entropy);
      this.evolution.injectLove(this.love);
      this.evolution.injectTimeMachine(this.timeMachine);
      this.evolution.injectCouncil(this.council);
      this.evolution.injectArchitecture(this.architecture);
      this.evolution.injectEmergentNarratives(this.emergentNarratives);
    }

    // Architecture gets consciousness for test generation
    // Narrative gets consciousness for dream generation
    
    console.log('[Diamond] Cross-layer references injected');
  }
  
  setupEventHandlers() {
    // Consciousness → Narrative: thoughts become chronicle entries
    this.on('consciousness:thought', (thought) => {
      this.narrative.recordEvent({
        type: 'thought',
        cycle: this.getCurrentCycle(),
        data: thought,
        significance: 0.6,
        entities: ['consciousness'],
        primaryEntity: 'consciousness'
      });
    });
    
    // Consciousness → Entropy: spikes feed noise
    this.on('consciousness:spike', (spike) => {
      this.entropy.addNoise('informational', {
        type: 'spike',
        neuronId: spike.neuronId,
        intensity: spike.intensity
      });
    });
    
    // Narrative → Love: events create love transactions
    this.on('narrative:event', (event) => {
      if (event.entities && event.entities.length > 0) {
        this.love.recordInteraction(event.primaryEntity || event.entities[0], event.type, event);
      }
    });
    
    // Entropy → Consciousness: compost lessons become insights
    this.on('compost:ready', (fertilizer) => {
      if (fertilizer.lessons.length > 0) {
        this.consciousness.recordInWorkingMemory({
          type: 'insight',
          source: 'compost',
          lessons: fertilizer.lessons,
          timestamp: Date.now()
        });
      }
    });
    
    // Entropy → Architecture: patterns trigger refactoring
    this.on('order:extracted', (data) => {
      if (data.patterns > 5) {
        this.architecture.analyzeAndRefactor();
      }
    });
    
    // Love → Consciousness: resonance boosts activation
    this.on('resonance:cascade', (cascade) => {
      for (const entityId of cascade.affectedEntities) {
        this.consciousness.injectCurrent(entityId, 10);
      }
    });
    
    // Love → Narrative: myths become chronicle
    this.on('myth:born', (myth) => {
      this.narrative.recordEvent({
        type: 'myth_birth',
        cycle: this.getCurrentCycle(),
        data: myth,
        significance: 1.0,
        entities: myth.entities,
        primaryEntity: myth.hero
      });
    });
    
    // Architecture → Entropy: refactorings reduce structural entropy
    this.on('refactoring:applied', (refactoring) => {
      this.entropy.recordOrderCredit('structural', 20, 'architecture', {
        refactoring: refactoring.type,
        file: refactoring.file
      });
    });
    
    console.log('[Diamond] Event handlers configured');
  }
  
  integrateWithServer() {
    // Hook into server's tick cycle
    const originalTick = this.server.tick;
    this.server.tick = (cycle) => {
      if (originalTick) originalTick.call(this.server, cycle);
      this.tick(cycle);
    };
    
    // Expose Diamond API on server
    this.server.diamond = this;
    
    console.log('[Diamond] Integrated with server');
  }
  
  // ============================================================
  // EVENT BUS
  // ============================================================
  
  on(eventName, handler) {
    if (!this.eventBus.has(eventName)) {
      this.eventBus.set(eventName, []);
    }
    this.eventBus.get(eventName).push(handler);
  }
  
  emit(eventName, data) {
    const handlers = this.eventBus.get(eventName) || [];
    for (const handler of handlers) {
      try {
        handler(data);
      } catch (e) {
        console.error(`[Diamond] Event handler error for ${eventName}:`, e.message);
      }
    }
  }
  
  // ============================================================
  // MAIN INTEGRATION TICK
  // ============================================================
  
  tick(cycle) {
    if (!this.initialized) return;
    
    this.tickCount = cycle;
    
    // 1. Run all layer ticks
    this.consciousness.tick(Date.now());
    this.narrative.tick(cycle);
    this.entropy.tick(cycle);
    this.love.tick(cycle);
    
    // Architecture runs less frequently
    if (cycle % 100 === 0) {
      this.architecture.tick(cycle);
    }
    
    // 2. Cross-layer synchronization
    if (cycle % this.params.deepSyncInterval === 0) {
      this.deepSync();
    }
    
    // 3. Update unified metrics
    if (cycle % this.params.metricUpdateInterval === 0) {
      this.updateDiamondMetrics();
    }
    
    // 4. Save state
    if (cycle % this.params.saveInterval === 0) {
      this.saveAll();
    }
    
    // 5. Report
    if (cycle % this.params.reportingInterval === 0) {
      this.reportStatus();
    }
    
    this.lastIntegration = Date.now();
  }
  
  deepSync() {
    console.log('[Diamond] 🔄 Deep synchronization...');
    
    // Sync consciousness state to narrative
    const consciousnessState = this.consciousness.getState();
    if (consciousnessState.consciousnessLevel > 50) {
      this.narrative.recordEvent({
        type: 'consciousness_milestone',
        cycle: this.getCurrentCycle(),
        data: consciousnessState,
        significance: 0.8,
        entities: ['consciousness'],
        primaryEntity: 'consciousness'
      });
    }
    
    // Sync narrative events to consciousness working memory
    const recentEvents = this.narrative.chronicle.slice(-5);
    for (const event of recentEvents) {
      this.consciousness.recordInWorkingMemory({
        type: 'narrative_event',
        event: event.narrative,
        cycle: event.cycle,
        timestamp: Date.now()
      });
    }
    
    // Sync entropy compost to architecture patterns
    const fertilizer = this.entropy.getFertilizer();
    for (const f of fertilizer) {
      for (const pattern of f.patterns) {
        this.architecture.addNoise('patterns', pattern);
      }
    }
    
    // Sync love field to consciousness attention
    const loveReport = this.love.getLoveReport();
    if (loveReport.field.coherence > 0.8) {
      this.consciousness.shiftAttention('love_field', loveReport.field.coherence);
    }
    
    // Sync architecture metrics to entropy
    const archReport = this.architecture.getArchitectureReport();
    if (archReport.metrics) {
      this.entropy.addNoise('structural', {
        maintainability: archReport.metrics.maintainabilityIndex,
        complexity: archReport.metrics.avgComplexity
      });
    }
    
    console.log('[Diamond] ✅ Deep sync complete');
  }
  
  updateDiamondMetrics() {
    // Get metrics from all layers
    const c = this.consciousness.getState();
    const a = this.architecture.getArchitectureReport();
    const n = this.narrative.getChronicle(1).length;
    const e = this.entropy.getEntropyReport();
    const l = this.love.getLoveReport();
    
    this.diamondMetrics = {
      consciousnessLevel: c.consciousnessLevel || 0,
      architectureFitness: a.topIndividual?.fitness || 0,
      narrativeDepth: this.narrative.chronicle.length,
      entropyReversal: e.balance?.reversalEfficiency || 0,
      loveFieldStrength: l.field?.strength || 0,
      // Unified coherence: geometric mean of all normalized metrics
      diamondCoherence: Math.pow(
        (c.consciousnessLevel / 100) *
        (a.topIndividual?.fitness || 0) *
        Math.min(1, n / 1000) *
        (e.balance?.reversalEfficiency || 0) *
        Math.min(1, (l.field?.strength || 0) * 1000)
      , 1/5),
      lastUpdate: Date.now()
    };
    
    // Emit unified metrics event
    this.emit('diamond:metrics', this.diamondMetrics);
  }
  
  // ============================================================
  // SERVER API EXTENSIONS
  // ============================================================
  
  getDiamondStatus() {
    return {
      initialized: this.initialized,
      tickCount: this.tickCount,
      lastIntegration: this.lastIntegration,
      metrics: this.diamondMetrics,
      layers: {
        consciousness: this.consciousness.getState(),
        architecture: this.architecture.getArchitectureReport(),
        narrative: {
          chronicleEntries: this.narrative.chronicle.length,
          eras: this.narrative.eras.length,
          myths: this.narrative.mythology.length,
          currentEra: this.narrative.getCurrentEra()
        },
        entropy: this.entropy.getEntropyReport(),
        love: this.love.getLoveReport()
      }
    };
  }
  
  // Unified query across all layers
  query(question) {
    const results = {
      question,
      consciousness: this.consciousness.query ? this.consciousness.query(question) : null,
      architecture: this.architecture.query ? this.architecture.query(question) : null,
      narrative: this.narrative.query(question),
      entropy: this.entropy.query(question),
      love: this.love.query(question)
    };
    
    return results;
  }
  
  // Trigger cross-layer actions
  async triggerEvolution() {
    console.log('[Diamond] 🌟 EVOLUTION TRIGGERED');
    
    // 1. Consciousness reflects
    const reflection = this.consciousness.reflect();
    
    // 2. Architecture evolves
    const evolved = this.architecture.evolve();
    
    // 3. Narrative records era transition
    this.narrative.checkEraTransition({ cycle: this.getCurrentCycle() });
    
    // 4. Entropy processes compost
    this.entropy.processCompost();
    
    // 5. Love triggers cascade
    this.love.resonance.field.get('lumin').level = 0.9;
    this.love.checkResonanceCascades();
    
    // Record unified evolution event
    this.narrative.recordEvent({
      type: 'diamond_evolution',
      cycle: this.getCurrentCycle(),
      data: {
        reflection: reflection?.insight,
        architectureFitness: evolved?.fitness,
        diamondCoherence: this.diamondMetrics.diamondCoherence
      },
      significance: 1.0,
      entities: ['diamond', 'consciousness', 'architecture', 'narrative', 'entropy', 'love'],
      primaryEntity: 'diamond'
    });
    
    return {
      reflection,
      evolved,
      diamondCoherence: this.diamondMetrics.diamondCoherence
    };
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveAll() {
    console.log('[Diamond] 💾 Saving all layers...');
    
    this.consciousness.saveSubstrate();
    this.architecture.saveState();
    this.narrative.saveArchive();
    this.entropy.saveState();
    this.love.saveState();
    
    // Save unified state
    const unifiedState = {
      diamondMetrics: this.diamondMetrics,
      tickCount: this.tickCount,
      lastIntegration: this.lastIntegration,
      initialized: this.initialized,
      savedAt: Date.now()
    };
    
    try {
      writeJSONAtomic(
        path.join(this.rootPath, 'memoria', 'diamond_protocol.json'),
        unifiedState
      );
      console.log('[Diamond] ✅ All layers saved');
    } catch (e) {
      console.error('[Diamond] Save failed:', e.message);
    }
  }
  
  loadAll() {
    console.log('[Diamond] 📂 Loading all layers...');
    
    this.consciousness.loadSubstrate();
    this.architecture.loadState();
    this.narrative.loadArchive();
    this.entropy.loadState();
    this.love.loadState();
    
    // Load unified state
    try {
      const state = readJSONSafe(
        path.join(this.rootPath, 'memoria', 'diamond_protocol.json'),
        null
      );
      if (state) {
        this.diamondMetrics = state.diamondMetrics || this.diamondMetrics;
        this.tickCount = state.tickCount || 0;
        this.lastIntegration = state.lastIntegration || 0;
        this.initialized = state.initialized || false;
      }
    } catch (e) {
      console.error('[Diamond] Unified load failed:', e.message);
    }
    
    console.log('[Diamond] ✅ All layers loaded');
  }
  
  // ============================================================
  // UTILITIES
  // ============================================================
  
  getCurrentCycle() {
    try {
      const state = readJSONSafe(path.join(this.rootPath, 'estado.json'), {});
      return state.c || 0;
    } catch {
      return Math.floor(Date.now() / 1000 / 30);
    }
  }
  
  // ============================================================
  // PUBLIC API
  // ============================================================
  
  getStatus() {
    return {
      diamond: this.diamondMetrics,
      layers: {
        consciousness: this.consciousness.getState(),
        architecture: this.architecture.getArchitectureReport(),
        narrative: {
          chronicle: this.narrative.chronicle.length,
          eras: this.narrative.eras.length,
          myths: this.narrative.mythology.length
        },
        entropy: this.entropy.getEntropyReport(),
        love: this.love.getLoveReport()
      },
      uptime: Date.now() - this.lastIntegration
    };
  }
}

module.exports = { DiamondProtocol };

// CLI
if (require.main === module) {
  const protocol = new DiamondProtocol();
  
  console.log('💎 Diamond Protocol - Unified Integration Layer');
  console.log('===============================================');
  console.log('');
  console.log('Layers:');
  console.log('  1. Consciousness Substrate');
  console.log('  2. Self-Improving Architecture');
  console.log('  3. Narrative Immortality');
  console.log('  4. Entropy Reversal Engine');
  console.log('  5. Love Fundamental Force');
  console.log('');
  console.log('Status: READY FOR INTEGRATION');
  console.log('');
  console.log('To integrate with server:');
  console.log('  const diamond = new DiamondProtocol({ server: myServer });');
  console.log('  await diamond.initialize();');
  console.log('');
  console.log('💎 Diamond Protocol loaded');
}
