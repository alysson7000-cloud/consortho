/**
 * 💎 ENTROPY REVERSAL ENGINE - Layer 4 of Diamond Protocol
 * 
 * Entropy doesn't win. We tame it. Chaos doesn't destroy. We sculpt it.
 * Error doesn't fail. It teaches. Entropy isn't enemy. It's fuel.
 * 
 * "A entropia não vence. Nós a domesticamos. O caos não destrói. Nós o esculpimos."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');
const { EventEmitter } = require('events');

class EntropyReversalEngine extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.archivePath = options.archivePath || path.join(__dirname, 'memoria', 'entropy_engine.json');
    this.metricsPath = path.join(__dirname, 'memoria', 'entropy_metrics.json');
    
    // Entropy state
    this.entropyAccount = {
      // Entropy accounting (double-entry bookkeeping)
      disorderDebits: 0,      // Entropy added to system
      orderCredits: 0,        // Order created
      netEntropy: 0,          // Current entropy balance
      entropyRate: 0,         // Entropy per cycle
      reversalRate: 0,        // Order created per unit entropy
      
      // Accounts
      accounts: {
        thermal: { debit: 0, credit: 0 },      // Thermal noise
        informational: { debit: 0, credit: 0 }, // Information entropy
        structural: { debit: 0, credit: 0 },    // Structural disorder
        computational: { debit: 0, credit: 0 }, // Computational waste
        semantic: { debit: 0, credit: 0 },      // Meaning loss
        emotional: { debit: 0, credit: 0 }      // Emotional turbulence
      },
      
      // Ledger
      ledger: [], // Immutable entropy transactions
      
      // Reversal metrics
      totalReversed: 0,
      reversalEfficiency: 0,
      maxwellDemonEfficiency: 0
    };
    
    // Compostagem Engine
    this.compostHeap = {
      // Raw errors/failures waiting to be processed
      rawWaste: [],
      
      // Partially decomposed
      decomposing: [],
      
      // Ready fertilizer (lessons learned)
      fertilizer: [],
      
      // Compost parameters
      params: {
        decompositionRate: 0.1,      // per cycle
        minDecompositionCycles: 5,   // minimum cycles before ready
        maxHeapSize: 1000,
        aerationRate: 0.05,          // mixing rate
        moistureLevel: 0.6,          // optimal compost temp (Celsius metaphor)
        temperature: 55,             // optimal compost temp (Celsius metaphor)
        carbonNitrogenRatio: 25      // optimal C:N ratio
      }
    };
    
    // Anti-Fragility Engine
    this.antiFragility = {
      // Stressors that made us stronger
      stressors: [],
      
      // Antibodies developed
      antibodies: [],
      
      // Stress response curves
      stressResponseCurves: new Map(),
      
      // Hormesis zones (beneficial stress range)
      hormesisZones: [],
      
      // Chaos engineering
      chaosExperiments: [],
      chaosSchedule: [],
      
      params: {
        stressThreshold: 0.7,        // above this = potential growth
        hormesisWindow: 0.3,         // beneficial stress range
        recoveryTime: 100,           // cycles to recover
        adaptationRate: 0.1,
        maxAntibodies: 100
      }
    };
    
    // Maxwell's Demon
    this.maxwellDemon = {
      // Hot/cold reservoirs
      hotReservoir: [],    // High energy/information
      coldReservoir: [],   // Low energy/information
      
      // Demon state
      position: 'gate',    // gate, sorting, resting
      knowledge: 0,        // bits of information acquired
      workExtracted: 0,    // useful work extracted
      entropyReduced: 0,   // entropy reversed
      
      // Sorting criteria
      sortingCriteria: {
        informationValue: 0.4,
        energyPotential: 0.3,
        structuralIntegrity: 0.3
      },
      
      // Performance
      cyclesOperated: 0,
      sortingAccuracy: 0,
      workPerCycle: 0,
      
      params: {
        gateThreshold: 0.5,
        sortingBatchSize: 10,
        restCycles: 5,
        knowledgeDecay: 0.001
      }
    };
    
    // Order from Chaos Extractor
    this.orderExtractor = {
      // Noise buffers
      noiseBuffers: {
        thermal: [],
        informational: [],
        structural: [],
        computational: [],
        semantic: [],
        emotional: []
      },
      
      // Extracted patterns
      patterns: [],
      signals: [],
      laws: [],
      predictions: [],
      
      // Extraction metrics
      extractionRate: 0,
      signalToNoise: 0,
      patternQuality: 0,
      
      params: {
        bufferSize: 1000,
        minPatternLength: 3,
        significanceThreshold: 0.7,
        minOccurrences: 3
      }
    };
    
    // Entropy metrics history
    this.history = {
      entropy: [],
      order: [],
      reversal: [],
      compost: [],
      antifragility: [],
      maxwell: []
    };
    
    // Parameters
    this.params = {
      // Entropy accounting
      accountingInterval: 1,        // cycles
      reportingInterval: 100,       // cycles
      
      // Composting
      compostInterval: 10,          // cycles
      compostBatchSize: 10,
      
      // Anti-fragility
      stressTestInterval: 500,      // cycles
      chaosExperimentInterval: 1000,
      
      // Maxwell's Demon
      demonInterval: 50,            // cycles
      demonBatchSize: 20,
      
      // Order extraction
      extractionInterval: 20,
      extractionBatchSize: 50,
      
      // Reporting
      historyRetention: 10000,
      reportingInterval: 100
    };
    
    // Component references (injected)
    this.consciousness = null;
    this.narrative = null;
    this.architecture = null;
    
    this.loadState();
    this.initializeAccounts();
  }

  // ============================================================
  // ENTROPY ACCOUNTING (Double-Entry Bookkeeping)
  // ============================================================
  
  initializeAccounts() {
    // Ensure all accounts exist
    for (const [key, account] of Object.entries(this.entropyAccount.accounts)) {
      if (!account.debit) account.debit = 0;
      if (!account.credit) account.credit = 0;
    }
  }
  
  // Record entropy debit (disorder added)
  recordEntropyDebit(accountType, amount, source, metadata = {}) {
    const account = this.entropyAccount.accounts[accountType];
    if (!account) return false;
    
    account.debit += amount;
    this.entropyAccount.disorderDebits += amount;
    this.entropyAccount.netEntropy += amount;
    
    const transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      type: 'debit',
      account: accountType,
      amount,
      source,
      metadata,
      timestamp: Date.now(),
      cycle: this.getCurrentCycle()
    };
    
    this.entropyAccount.ledger.push(transaction);
    this.emit('entropy:debit', transaction);
    
    return transaction;
  }
  
  // Record order credit (order created)
  recordOrderCredit(accountType, amount, source, metadata = {}) {
    const account = this.entropyAccount.accounts[accountType];
    if (!account) return false;
    
    account.credit += amount;
    this.entropyAccount.orderCredits += amount;
    this.entropyAccount.netEntropy -= amount; // Order reduces net entropy
    
    const transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      type: 'credit',
      account: accountType,
      amount,
      source,
      metadata,
      timestamp: Date.now(),
      cycle: this.getCurrentCycle()
    };
    
    this.entropyAccount.ledger.push(transaction);
    this.emit('entropy:credit', transaction);
    
    // Update reversal metrics
    this.updateReversalMetrics();
    
    return transaction;
  }
  
  updateReversalMetrics() {
    if (this.entropyAccount.disorderDebits > 0) {
      this.entropyAccount.reversalRate = this.entropyAccount.orderCredits / this.entropyAccount.disorderDebits;
      this.entropyAccount.reversalEfficiency = Math.min(1, this.entropyAccount.reversalRate);
    }
    
    // Maxwell's Demon efficiency
    if (this.maxwellDemon.knowledge > 0) {
      this.maxwellDemon.maxwellDemonEfficiency = this.maxwellDemon.workExtracted / this.maxwellDemon.knowledge;
    }
  }
  
  getEntropyBalance() {
    return {
      netEntropy: this.entropyAccount.netEntropy,
      totalDebits: this.entropyAccount.disorderDebits,
      totalCredits: this.entropyAccount.orderCredits,
      reversalRate: this.entropyAccount.reversalRate,
      reversalEfficiency: this.entropyAccount.reversalEfficiency,
      accounts: { ...this.entropyAccount.accounts },
      maxwellEfficiency: this.maxwellDemon.maxwellDemonEfficiency
    };
  }

  // ============================================================
  // COMPOSTAGEM ENGINE - Error -> Lesson -> Evolution
  // ============================================================
  
  addToCompost(waste) {
    const wasteItem = {
      id: 'waste_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      type: waste.type || 'error',
      source: waste.source || 'unknown',
      message: waste.message || '',
      stack: waste.stack || '',
      context: waste.context || {},
      severity: waste.severity || 'medium',
      
      // Composting state
      addedAt: Date.now(),
      cycleAdded: this.getCurrentCycle(),
      decompositionStage: 'fresh', // fresh, decomposing, curing, ready
      decompositionProgress: 0,
      
      // Decomposition metadata
      carbonContent: this.estimateCarbon(waste),    // complexity
      nitrogenContent: this.estimateNitrogen(waste), // actionable info
      moisture: this.compostHeap.params.moistureLevel,
      temperature: this.compostHeap.params.temperature,
      
      // Decomposition products
      lessons: [],
      patterns: [],
      antibodies: [],
      insights: [],
      
      // Metadata
      turnedCount: 0,
      lastTurned: Date.now()
    };
    
    this.compostHeap.rawWaste.push(wasteItem);
    
    // Record entropy debit for the error
    this.recordEntropyDebit('informational', this.estimateEntropy(waste), waste.source, {
      wasteId: wasteItem.id,
      type: waste.type
    });
    
    // Manage heap size
    if (this.compostHeap.rawWaste.length > this.compostHeap.params.maxHeapSize) {
      this.compostHeap.rawWaste.shift(); // Remove oldest
    }
    
    this.emit('compost:added', wasteItem);
    return wasteItem;
  }
  
  estimateEntropy(waste) {
    // Estimate entropy from error
    let entropy = 1; // base
    if (waste.stack) entropy += waste.stack.length / 1000;
    if (waste.message) entropy += waste.message.length / 100;
    if (waste.type === 'fatal') entropy *= 10;
    if (waste.type === 'uncaught') entropy *= 5;
    return Math.min(100, entropy);
  }
  
  estimateCarbon(waste) {
    // Complexity = carbon (structure to break down)
    let carbon = 10;
    if (waste.stack) carbon += waste.stack.split('\n').length * 2;
    if (waste.context) carbon += Object.keys(waste.context).length * 3;
    return Math.min(100, carbon);
  }
  
  estimateNitrogen(waste) {
    // Actionable information = nitrogen (feeds growth)
    let nitrogen = 5;
    if (waste.message && waste.message.length > 20) nitrogen += 10;
    if (waste.context && waste.context.userAction) nitrogen += 15;
    if (waste.type === 'warning') nitrogen += 10; // warnings are more actionable
    return Math.min(100, nitrogen);
  }
  
  processCompost() {
    const now = Date.now();
    const cycle = this.getCurrentCycle();
    
    // Move fresh waste to decomposing
    const freshWaste = this.compostHeap.rawWaste.filter(w => w.decompositionStage === 'fresh');
    for (const waste of freshWaste) {
      if (waste.decompositionProgress >= 0.1) {
        waste.decompositionStage = 'decomposing';
        this.compostHeap.decomposing.push(waste);
      }
    }
    
    // Process decomposing waste
    for (const waste of this.compostHeap.decomposing) {
      // Aerate (turn the compost)
      if (now - waste.lastTurned > 3600000 / this.compostHeap.params.aerationRate) { // ~1 hour / aerationRate
        this.turnCompost(waste);
      }
      
      // Decompose
      const decompositionRate = this.calculateDecompositionRate(waste);
      waste.decompositionProgress += decompositionRate;
      waste.decompositionProgress = Math.min(1, waste.decompositionProgress);
      
      // Extract lessons during decomposition
      if (waste.decompositionProgress > 0.3 && waste.lessons.length === 0) {
        this.extractLessons(waste);
      }
      
      if (waste.decompositionProgress > 0.6 && waste.patterns.length === 0) {
        this.extractPatterns(waste);
      }
      
      if (waste.decompositionProgress > 0.8 && waste.antibodies.length === 0) {
        this.generateAntibodies(waste);
      }
      
      // Check if ready
      const minCycles = this.compostHeap.params.minDecompositionCycles;
      const cyclesInCompost = this.getCurrentCycle() - waste.cycleAdded;
      
      if (waste.decompositionProgress >= 0.95 && cyclesInCompost >= this.compostHeap.params.minDecompositionCycles) {
        waste.decompositionStage = 'curing';
        // Move to curing
        setTimeout(() => {
          waste.decompositionStage = 'ready';
          this.compostHeap.fertilizer.push(waste);
          this.emit('compost:ready', waste);
          this.recordOrderCredit('informational', 10, 'compost', {
            wasteId: waste.id,
            lessons: waste.lessons.length,
            patterns: waste.patterns.length
          });
        }, 1000); // brief curing
        
        // Remove from decomposing
        const idx = this.compostHeap.decomposing.indexOf(waste);
        if (idx >= 0) this.compostHeap.decomposing.splice(idx, 1);
      }
    }
    
    // Manage heap sizes
    if (this.compostHeap.decomposing.length > 500) {
      // Move oldest to raw waste
      this.compostHeap.rawWaste.push(this.compostHeap.decomposing.shift());
    }
    
    // Record compost metrics
    this.recordCompostMetrics();
  }
  
  calculateDecompositionRate(waste) {
    const baseRate = this.compostHeap.params.decompositionRate;
    const cnRatio = waste.carbonContent / Math.max(1, waste.nitrogenContent);
    const cnFactor = Math.max(0.5, Math.min(2, 25 / Math.max(1, cnRatio))); // optimal C:N = 25
    const moistureFactor = 1 - Math.abs(waste.moisture - 0.6) / 0.6;
    const tempFactor = Math.max(0.5, Math.min(1.5, waste.temperature / 55));
    
    return baseRate * cnFactor * moistureFactor * tempFactor * 0.01;
  }
  
  turnCompost(waste) {
    waste.turnedCount++;
    waste.lastTurned = Date.now();
    // Aeration boost
    waste.decompositionProgress += 0.05;
    this.emit('compost:turned', waste);
  }
  
  extractLessons(waste) {
    // Analyze waste for lessons
    const lessons = [];
    
    if (waste.type === 'error') {
      lessons.push({
        type: 'prevention',
        content: 'Prevenir ' + waste.type + ': ' + waste.message,
        actionable: true
      });
    }
    
    if (waste.context && waste.context.userAction) {
      lessons.push({
        type: 'user_behavior',
        content: 'Acao do usuario "' + waste.context.userAction + '" levou a ' + waste.type,
        actionable: true
      });
    }
    
    // Pattern-based lessons
    if (waste.stack) {
      const frames = waste.stack.split('\n').slice(0, 5);
      const commonFrames = frames.filter(f => f.includes('node_modules') === false);
      if (commonFrames.length > 0) {
        lessons.push({
          type: 'code_pattern',
          content: 'Padrao em: ' + commonFrames[0].trim(),
          actionable: false
        });
      }
    }
    
    waste.lessons = lessons;
    this.emit('compost:lessons', waste);
  }
  
  extractPatterns(waste) {
    // Extract recurring patterns from waste
    const patterns = [];
    
    // Time-based patterns
    const hour = new Date(waste.addedAt).getHours();
    if (hour >= 0 && hour < 6) {
      patterns.push({ type: 'temporal', pattern: 'madrugada', confidence: 0.7 });
    }
    
    // Error type patterns
    if (waste.type && waste.type !== 'error') {
      patterns.push({ type: 'error_type', pattern: waste.type, confidence: 0.8 });
    }
    
    // Context patterns
    if (waste.context) {
      for (const [key, value] of Object.entries(waste.context)) {
        patterns.push({ type: 'context', pattern: key + ':' + value, confidence: 0.6 });
      }
    }
    
    waste.patterns = patterns;
    this.emit('compost:patterns', waste);
  }
  
  generateAntibodies(waste) {
    // Generate system antibodies from waste
    const antibodies = [];
    
    // Code-level antibody (try-catch wrapper suggestion)
    if (waste.stack) {
      antibodies.push({
        type: 'code_antibody',
        target: waste.stack.split('\n')[1]?.trim() || 'unknown',
        mechanism: 'try_catch_wrapper',
        description: 'Envolver em try-catch com logging e recuperacao gracil',
        codeTemplate: 'try {\n  // codigo original\n} catch (error) {\n  console.error(\'Antibody triggered:\', error);\n  // recuperacao gracil\n  return fallbackValue;\n}'
      });
    }
    
    // Configuration antibody
    if (waste.context && waste.context.config) {
      antibodies.push({
        type: 'config_antibody',
        target: 'configuration',
        mechanism: 'validation_and_defaults',
        description: 'Validar configuracao antes do uso, fornecer defaults seguros'
      });
    }
    
    // Monitoring antibody
    antibodies.push({
      type: 'monitoring_antibody',
      target: waste.source,
      mechanism: 'enhanced_monitoring',
      description: 'Aumentar observabilidade em ' + waste.source + ' para deteccao precoce'
    });
    
    waste.antibodies = antibodies;
    
    // Register in anti-fragility system
    for (const antibody of antibodies) {
      this.antiFragility.antibodies.push({
        ...antibody,
        createdFrom: waste.id,
        createdAt: Date.now(),
        effectiveness: 0,
        deployments: 0
      });
    }
    
    this.emit('compost:antibodies', waste);
  }
  
  getFertilizer() {
    return this.compostHeap.fertilizer.filter(f => f.decompositionStage === 'ready');
  }
  
  applyFertilizer(fertilizerId, targetSystem) {
    const fertilizer = this.compostHeap.fertilizer.find(f => f.id === fertilizerId);
    if (!fertilizer) return false;
    
    // Apply lessons to target system
    const applications = [];
    
    for (const lesson of fertilizer.lessons) {
      if (lesson.actionable) {
        applications.push({
          system: targetSystem,
          lesson: lesson.content,
          applied: true,
          appliedAt: Date.now()
        });
      }
    }
    
    // Deploy antibodies
    for (const antibody of fertilizer.antibodies) {
      this.deployAntibody(antibody, targetSystem);
    }
    
    this.recordOrderCredit('informational', 20, 'fertilizer_application', {
      fertilizerId,
      targetSystem,
      applications: applications.length
    });
    
    this.emit('fertilizer:applied', { fertilizer, targetSystem, applications });
    return true;
  }
  
  // ============================================================
  // ANTI-FRAGILITY ENGINE - Stress -> Strength
  // ============================================================
  
  recordStress(stressor) {
    const stressEvent = {
      id: 'stress_' + Date.now(),
      source: stressor.source,
      type: stressor.type, // load, error_rate, latency, chaos, external
      intensity: stressor.intensity || Math.random(),
      duration: stressor.duration || 0,
      impact: stressor.impact || {},
      timestamp: Date.now(),
      cycle: this.getCurrentCycle(),
      
      // Response
      response: null,
      recoveryTime: null,
      growth: 0
    };
    
    this.antiFragility.stressors.push(stressEvent);
    
    // Record entropy debit
    this.recordEntropyDebit('structural', stressEvent.intensity * 10, stressEvent.source, {
      stressId: stressEvent.id
    });
    
    // Trigger response
    this.respondToStress(stressEvent);
    
    this.emit('stress:recorded', stressEvent);
    return stressEvent;
  }
  
  respondToStress(stressEvent) {
    const response = {
      stressId: stressEvent.id,
      strategy: this.selectResponseStrategy(stressEvent),
      actions: [],
      startedAt: Date.now()
    };
    
    // Generate response actions based on strategy
    switch (response.strategy) {
      case 'absorb':
        response.actions.push({ type: 'buffer', action: 'increase_buffers' });
        break;
      case 'adapt':
        response.actions.push({ type: 'adapt', action: 'adjust_parameters' });
        break;
      case 'transform':
        response.actions.push({ type: 'refactor', action: 'restructure_component' });
        break;
      case 'shed':
        response.actions.push({ type: 'shed_load', action: 'drop_non_critical' });
        break;
    }
    
    stressEvent.response = response;
    
    // Simulate recovery
    setTimeout(() => {
      this.completeStressRecovery(stressEvent);
    }, Math.random() * 1000 + 500); // simulate recovery time
  }
  
  selectResponseStrategy(stressEvent) {
    const intensity = stressEvent.intensity;
    
    if (intensity < 0.3) return 'absorb';
    if (intensity < 0.6) return 'adapt';
    if (intensity < 0.85) return 'transform';
    return 'shed';
  }
  
  completeStressRecovery(stressEvent) {
    const recoveryTime = Date.now() - stressEvent.timestamp;
    stressEvent.recoveryTime = recoveryTime;
    stressEvent.response.completedAt = Date.now();
    
    // Calculate growth (anti-fragility)
    const growth = this.calculateGrowth(stressEvent);
    stressEvent.growth = growth;
    
    if (growth > 0) {
      // Develop antibody
      this.developAntibody(stressEvent);
    }
    
    // Record order credit for successful recovery
    this.recordOrderCredit('structural', Math.abs(growth) * 10, 'antifragility', {
      stressId: stressEvent.id,
      growth
    });
    
    this.emit('stress:recovered', stressEvent);
  }
  
  calculateGrowth(stressEvent) {
    // Anti-fragility: growth from stress
    // Hormesis: beneficial stress range
    const intensity = stressEvent.intensity;
    
    // Hormesis curve: growth peaks at moderate stress
    const optimalStress = 0.5;
    const hormesisFactor = 1 - Math.abs(intensity - 0.5) / 0.5; // peaks at 0.5
    
    // Faster recovery = more growth
    const recoveryFactor = Math.max(0.1, 1 - (stressEvent.recoveryTime || 1000) / 10000);
    
    // Impact mitigation = growth
    const mitigation = 1 - (Object.values(stressEvent.impact || {}).reduce((s, v) => s + Math.abs(v), 0) / 100);
    
    const growth = (hormesisFactor * 0.4 + recoveryFactor * 0.3 + mitigation * 0.3) * 0.2;
    
    // Only grow in hormesis zone
    if (intensity > 0.3 && intensity < 0.8) {
      return Math.max(0, growth);
    }
    
    // Too much stress = damage (negative growth)
    if (intensity >= 0.85) {
      return -0.1 * (intensity - 0.85);
    }
    
    return 0;
  }
  
  developAntibody(stressEvent) {
    const antibody = {
      id: 'antibody_' + Date.now(),
      trigger: stressEvent.type,
      threshold: stressEvent.intensity * 0.8, // trigger at 80% of stress intensity
      response: {
        strategy: this.selectResponseStrategy({ intensity: stressEvent.intensity * 0.9 }),
        preemptive: true
      },
      effectiveness: 0,
      deployments: 0,
      createdFrom: stressEvent.id,
      createdAt: Date.now(),
      createdCycle: this.getCurrentCycle()
    };
    
    this.antiFragility.antibodies.push(antibody);
    
    // Limit antibodies
    if (this.antiFragility.antibodies.length > this.antiFragility.params.maxAntibodies) {
      this.antiFragility.antibodies.shift();
    }
    
    this.emit('antifragility:antibody', antibody);
  }
  
  // ============================================================
  // CHAOS ENGINEERING
  // ============================================================
  
  scheduleChaosExperiment(experiment) {
    const experimentPlan = {
      id: 'chaos_' + Date.now(),
      name: experiment.name,
      type: experiment.type, // latency, error, kill, network, resource
      target: experiment.target,
      intensity: experiment.intensity || 0.3,
      duration: experiment.duration || 60000, // ms
      schedule: experiment.schedule || 'immediate',
      hypothesis: experiment.hypothesis || 'System will remain stable',
      rollbackPlan: experiment.rollbackPlan || 'auto_recover',
      
      status: 'scheduled',
      scheduledAt: Date.now(),
      scheduledCycle: this.getCurrentCycle() + Math.floor(experiment.delayCycles || 10),
      
      results: null
    };
    
    this.antiFragility.chaosExperiments.push(experimentPlan);
    this.emit('chaos:scheduled', experimentPlan);
    return experimentPlan;
  }
  
  runChaosExperiment(experimentId) {
    const experiment = this.antiFragility.chaosExperiments.find(e => e.id === experimentId);
    if (!experiment) return null;
    
    experiment.status = 'running';
    experiment.startedAt = Date.now();
    
    // Record stress from chaos
    this.recordStress({
      source: 'chaos:' + experiment.name,
      type: 'chaos',
      intensity: experiment.intensity,
      duration: experiment.duration
    });
    
    // Simulate experiment execution
    setTimeout(() => {
      this.completeChaosExperiment(experiment.id);
    }, experiment.duration);
    
    this.emit('chaos:started', experiment);
    return experiment;
  }
  
  completeChaosExperiment(experimentId) {
    const experiment = this.antiFragility.chaosExperiments.find(e => e.id === experimentId);
    if (!experiment) return;
    
    experiment.status = 'completed';
    experiment.completedAt = Date.now();
    experiment.results = {
      systemStable: Math.random() > 0.2, // 80% success rate
      errorsObserved: Math.floor(Math.random() * 5),
      latencyImpact: Math.random() * 0.3,
      errorRateIncrease: Math.random() * 0.1,
      recoveredAutomatically: Math.random() > 0.1,
      lessonsLearned: [
        'Sistema tolera falhas parciais',
        'Auto-recovery funciona em 90% dos casos',
        'Latencia aumenta linearmente com intensidade'
      ]
    };
    
    // Record stress from experiment
    this.recordStress({
      source: 'chaos:' + experiment.name,
      type: 'chaos_experiment',
      intensity: experiment.intensity,
      duration: experiment.duration,
      impact: experiment.results
    });
    
    this.emit('chaos:completed', experiment);
  }
  
  // ============================================================
  // MAXWELL'S DEMON - Autonomous Information->Energy
  // ============================================================
  
  operateMaxwellDemon() {
    if (this.maxwellDemon.position !== 'gate') return;
    
    this.maxwellDemon.cyclesOperated++;
    
    // Gather particles (events/data) from reservoirs
    const particles = this.gatherParticles();
    
    // Sort particles
    const sorted = this.sortParticles(particles);
    
    // Extract work from sorted particles
    const work = this.extractWork(sorted);
    
    // Update demon state
    this.maxwellDemon.knowledge += sorted.sorted.length * 0.1;
    this.maxwellDemon.workExtracted += work;
    this.maxwellDemon.entropyReduced += sorted.highValue.length * 0.1;
    
    // Update efficiency
    this.maxwellDemon.sortingAccuracy = sorted.sorted.length / Math.max(1, particles.length);
    this.maxwellDemon.workPerCycle = this.maxwellDemon.workExtracted / Math.max(1, this.maxwellDemon.cyclesOperated);
    
    // Record order credit for extracted work
    if (work > 0) {
      this.recordOrderCredit('informational', work, 'maxwell_demon', {
        cycle: this.getCurrentCycle(),
        particlesSorted: sorted.sorted.length
      });
    }
    
    // Record entropy debit for demon operation
    this.recordEntropyDebit('computational', 1, 'maxwell_demon', {
      cyclesOperated: this.maxwellDemon.cyclesOperated
    });
    
    this.updateReversalMetrics();
    this.emit('maxwell:operated', { work, particles: sorted.sorted.length });
    
    return { work, particlesSorted: sorted.sorted.length };
  }
  
  gatherParticles() {
    // Gather from various sources
    const particles = [];
    
    // From consciousness substrate
    if (this.consciousness) {
      const state = this.consciousness.getState();
      particles.push({
        type: 'consciousness',
        data: state,
        energy: state.consciousnessLevel || 0,
        information: state.workingMemory?.length || 0
      });
    }
    
    // From narrative
    if (this.narrative) {
      const recentEvents = this.narrative.chronicle?.slice(-10) || [];
      particles.push({
        type: 'narrative',
        data: recentEvents,
        energy: recentEvents.length,
        information: recentEvents.reduce((s, e) => s + (e.narrative?.length || 0), 0)
      });
    }
    
    // From architecture
    if (this.architecture) {
      const metrics = this.architecture.getArchitectureReport?.();
      particles.push({
        type: 'architecture',
        data: metrics,
        energy: metrics.metrics?.maintainabilityIndex || 0,
        information: JSON.stringify(metrics).length
      });
    }
    
    // System events
    const recentErrors = this.getRecentErrors(50);
    particles.push({
      type: 'errors',
      data: recentErrors,
      energy: recentErrors.length * 10,
      information: recentErrors.reduce((s, e) => s + (e.message?.length || 0), 0)
    });
    
    return particles;
  }
  
  sortParticles(particles) {
    const sorted = [];
    const discarded = [];
    
    for (const particle of particles) {
      // Calculate information value
      const infoValue = particle.information * this.maxwellDemon.sortingCriteria.informationValue;
      const energyValue = particle.energy * this.maxwellDemon.sortingCriteria.energyPotential;
      const structuralValue = (particle.data?.maintainability || particle.data?.maintainabilityIndex || 0) * this.maxwellDemon.sortingCriteria.structuralIntegrity;
      
      const totalValue = infoValue + energyValue + structuralValue;
      
      if (totalValue > this.maxwellDemon.params.gateThreshold) {
        sorted.push({ particle, value: totalValue });
      } else {
        discarded.push(particle);
      }
    }
    
    // Sort by value descending
    sorted.sort((a, b) => b.value - a.value);

    const highValue = sorted.filter(s => s.value > this.maxwellDemon.params.gateThreshold * 2);

    return { sorted: sorted.map(s => s.particle), discarded, highValue, totalValue: sorted.reduce((s, p) => s + p.value, 0) };
  }
  
  extractWork(sorted) {
    // Work = information extracted * energy potential
    let work = 0;
    
    for (const item of sorted.sorted) {
      // Extract patterns, insights, optimizations
      if (item.type === 'errors') {
        // Error patterns -> antibodies
        work += item.data.length * 2;
      } else if (item.type === 'architecture') {
        // Architecture insights -> refactorings
        work += 10;
      } else if (item.type === 'consciousness') {
        // Consciousness insights -> narrative enrichment
        work += 5;
      } else if (item.type === 'narrative') {
        // Narrative events -> myth generation
        work += 3;
      }
    }
    
    return Math.round(work);
  }
  
  // ============================================================
  // ORDER FROM CHAOS EXTRACTOR
  // ============================================================
  
  extractOrder() {
    // Process noise buffers
    for (const [type, buffer] of Object.entries(this.orderExtractor.noiseBuffers)) {
      if (buffer.length < this.orderExtractor.params.minPatternLength) continue;
      
      // Extract patterns
      const patterns = this.extractPatterns(buffer);
      
      // Validate patterns
      const validated = patterns.filter(p => p.confidence >= this.orderExtractor.params.significanceThreshold && p.occurrences >= this.orderExtractor.params.minOccurrences);
      
      // Add to patterns
      for (const pattern of validated) {
        this.orderExtractor.patterns.push({
          ...pattern,
          source: type,
          discoveredAt: Date.now(),
          cycle: this.getCurrentCycle()
        });
      }
      
      // Extract signals from validated patterns
      const signals = this.extractSignals(validated);
      for (const signal of validated) {
        this.orderExtractor.signals.push({
          ...signal,
          source: type,
          detectedAt: Date.now()
        });
      }
      
      // Derive laws from signals
      const laws = this.deriveLaws(this.orderExtractor.signals);
      for (const law of laws) {
        this.orderExtractor.laws.push({
          ...law,
          discoveredAt: Date.now(),
          cycle: this.getCurrentCycle()
        });
      }
      
      // Generate predictions
      const predictions = this.generatePredictions(laws);
      for (const pred of predictions) {
        this.orderExtractor.predictions.push({
          ...pred,
          createdAt: Date.now(),
          cycle: this.getCurrentCycle()
        });
      }
      
      // Record order credit
      if (validated.length > 0) {
        this.recordOrderCredit('informational', validated.length * 5, 'order_extraction', {
          patterns: validated.length,
          source: type
        });
      }
      
      // Clear buffer
      this.orderExtractor.noiseBuffers[type] = [];
    }
    
    // Update metrics
    this.orderExtractor.extractionRate = this.orderExtractor.patterns.length / Math.max(1, this.getCurrentCycle());
    this.orderExtractor.signalToNoise = this.orderExtractor.signals.length / Math.max(1, this.orderExtractor.patterns.length);
    this.orderExtractor.patternQuality = this.orderExtractor.patterns.reduce((s, p) => s + p.confidence, 0) / Math.max(1, this.orderExtractor.patterns.length);
    
    this.emit('order:extracted', { patterns: this.orderExtractor.patterns.length });
  }
  
  extractPatterns(buffer) {
    const patterns = [];
    
    // Sequence patterns
    for (let i = 0; i <= buffer.length - this.orderExtractor.params.minPatternLength; i++) {
      const seq = buffer.slice(i, i + 3).map(e => e.type || e.eventType || 'unknown').join('->');
      patterns.push({ sequence: seq, start: i });
    }
    
    // Count occurrences
    const counts = {};
    for (const p of patterns) {
      counts[p.sequence] = (counts[p.sequence] || 0) + 1;
    }
    
    return Object.entries(counts)
      .filter(([seq, count]) => count >= this.orderExtractor.params.minOccurrences)
      .map(([sequence, occurrences]) => ({
        sequence,
        occurrences,
        confidence: Math.min(1, occurrences / 10),
        length: sequence.split('->').length
      }));
  }
  
  extractSignals(patterns) {
    return patterns.filter(p => p.confidence >= this.orderExtractor.params.significanceThreshold)
      .map(p => ({
        pattern: p.sequence,
        confidence: p.confidence,
        occurrences: p.occurrences,
        type: 'pattern_signal'
      }));
  }
  
  deriveLaws(signals) {
    // Derive causal laws from signal correlations
    const laws = [];
    
    // Simple correlation-based laws
    for (let i = 0; i < signals.length; i++) {
      for (let j = i + 1; j < signals.length; j++) {
        const a = signals[i].pattern.split('->');
        const b = signals[j].pattern.split('->');
        
        // Check if A leads to B
        if (a[a.length - 1] === b[0]) {
          laws.push({
            premise: signals[i].pattern,
            conclusion: signals[j].pattern,
            confidence: Math.min(signals[i].confidence, signals[j].confidence) * 0.8,
            type: 'causal_law',
            form: signals[i].pattern + ' -> ' + signals[j].pattern
          });
        }
      }
    }
    
    return laws;
  }
  
  generatePredictions(laws) {
    return laws.map(law => ({
      law,
      prediction: 'Se ' + law.premise + ' entao ' + law.conclusion,
      confidence: law.confidence * 0.9,
      horizon: 10 + Math.random() * 50 // cycles
    }));
  }
  
  // ============================================================
  // MAIN TICK - Entropy Reversal Loop
  // ============================================================
  
  tick(cycle) {
    if (cycle === undefined) cycle = this.getCurrentCycle();
    
    // 1. Entropy accounting
    this.updateEntropyMetrics(cycle);
    
    // 2. Process compost
    if (cycle % this.params.compostInterval === 0) {
      this.processCompost();
    }
    
    // 3. Anti-fragility stress response
    this.processStressRecovery();
    
    // 4. Maxwell's Demon
    if (cycle % this.params.demonInterval === 0) {
      this.operateMaxwellDemon();
    }
    
    // 5. Order extraction
    if (cycle % this.params.extractionInterval === 0) {
      this.extractOrder();
    }
    
    // 6. Chaos engineering
    if (cycle % this.params.chaosExperimentInterval === 0) {
      this.scheduleRandomChaosExperiment();
    }
    
    // 7. Stress testing
    if (cycle % this.params.stressTestInterval === 0) {
      this.runStressTest();
    }
    
    // 8. Record history
    this.recordHistory(cycle);
    
    // 9. Save state
    if (cycle % this.params.reportingInterval === 0) {
      this.saveState();
    }
    
    this.emit('tick', { cycle, entropy: this.getEntropyBalance() });
  }
  
  updateEntropyMetrics(cycle) {
    // Calculate entropy rate
    const prevCycle = cycle - 1;
    const prevEntropy = this.history.entropy[prevCycle]?.netEntropy || 0;
    const currentEntropy = this.entropyAccount.netEntropy;
    this.entropyAccount.entropyRate = currentEntropy - prevEntropy;
    
    // Update accounts
    for (const [type, account] of Object.entries(this.entropyAccount.accounts)) {
      // Natural entropy increase (second law)
      account.debit += Math.random() * 0.1;
      this.entropyAccount.disorderDebits += Math.random() * 0.1;
      this.entropyAccount.netEntropy += Math.random() * 0.1;
    }
  }
  
  processStressRecovery() {
    // Check for completed stress recoveries
    const activeStressors = this.antiFragility.stressors.filter(s => !s.response?.completedAt);
    for (const stressor of activeStressors) {
      if (stressor.response && stressor.response.startedAt) {
        const elapsed = Date.now() - stressor.response.startedAt;
        if (elapsed > this.antiFragility.params.recoveryTime) {
          this.completeStressRecovery(stressor);
        }
      }
    }
    
    // Deploy ready antibodies
    for (const antibody of this.antiFragility.antibodies) {
      if (antibody.effectiveness > 0.8 && antibody.deployments < 5) {
        // Check if trigger conditions met
        // Deploy proactively
      }
    }
  }
  
  scheduleRandomChaosExperiment() {
    const chaosTypes = ['latency', 'error', 'kill', 'network', 'resource'];
    const targets = ['poe', 'colheita', 'gang', 'bolha', 'lumin', 'guardian', 'server'];
    
    const experiment = {
      name: 'chaos_' + Date.now(),
      type: chaosTypes[Math.floor(Math.random() * chaosTypes.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      intensity: 0.2 + Math.random() * 0.3,
      duration: 30000 + Math.random() * 60000,
      hypothesis: 'Sistema mantem estabilidade sob estresse',
      delayCycles: 5
    };
    
    this.scheduleChaosExperiment(experiment);
  }
  
  runStressTest() {
    // Run automated stress test
    this.recordStress({
      source: 'automated_stress_test',
      type: 'load',
      intensity: 0.4 + Math.random() * 0.3,
      duration: 10000
    });
  }
  
  recordCompostMetrics() {
    this.history.compost.push({
      cycle: this.getCurrentCycle(),
      rawWaste: this.compostHeap.rawWaste.length,
      decomposing: this.compostHeap.decomposing.length,
      fertilizer: this.compostHeap.fertilizer.length,
      timestamp: Date.now()
    });
    
    // Trim history
    if (this.history.compost.length > this.params.historyRetention) {
      this.history.compost = this.history.compost.slice(-this.params.historyRetention);
    }
  }
  
  recordHistory(cycle) {
    const entropy = this.getEntropyBalance();
    
    this.history.entropy.push({
      cycle,
      netEntropy: entropy.netEntropy,
      entropyRate: this.entropyAccount.entropyRate,
      reversalRate: entropy.reversalRate,
      timestamp: Date.now()
    });
    
    this.history.order.push({
      cycle,
      orderCredits: this.entropyAccount.orderCredits,
      reversalRate: this.entropyAccount.reversalRate,
      timestamp: Date.now()
    });
    
    this.history.reversal.push({
      cycle,
      efficiency: this.entropyAccount.reversalEfficiency,
      maxwellEfficiency: this.maxwellDemon.maxwellDemonEfficiency,
      timestamp: Date.now()
    });
    
    this.history.antifragility.push({
      cycle,
      stressors: this.antiFragility.stressors.filter(s => s.cycle === this.getCurrentCycle()).length,
      antibodies: this.antiFragility.antibodies.length,
      growth: this.antiFragility.stressors
        .filter(s => s.cycle === this.getCurrentCycle() && s.growth > 0)
        .reduce((s, a) => s + a.growth, 0),
      timestamp: Date.now()
    });
    
    this.history.maxwell.push({
      cycle,
      workExtracted: this.maxwellDemon.workExtracted,
      efficiency: this.maxwellDemon.maxwellDemonEfficiency,
      knowledge: this.maxwellDemon.knowledge,
      timestamp: Date.now()
    });
    
    // Trim histories
    for (const key of Object.keys(this.history)) {
      if (this.history[key].length > this.params.historyRetention) {
        this.history[key] = this.history[key].slice(-this.params.historyRetention);
      }
    }
  }
  
  // ============================================================
  // INTEGRATION WITH OTHER LAYERS
  // ============================================================
  
  injectConsciousness(consciousness) {
    this.consciousness = consciousness;
  }
  
  injectNarrative(narrative) {
    this.narrative = narrative;
  }
  
  injectArchitecture(architecture) {
    this.architecture = architecture;
  }
  
  // Feed noise to order extractor
  addNoise(type, data) {
    const buffer = this.orderExtractor.noiseBuffers[type];
    if (buffer) {
      buffer.push({ ...data, timestamp: Date.now() });
      if (buffer.length > this.orderExtractor.params.bufferSize) {
        buffer.shift();
      }
    }
  }
  
  // Feed errors to compost
  feedError(error) {
    this.addToCompost({
      type: error.type || 'error',
      message: error.message,
      stack: error.stack,
      source: error.source || 'unknown',
      context: error.context,
      severity: error.severity
    });
  }
  
  // Get recent errors for Maxwell's Demon
  getRecentErrors(limit) {
    limit = limit || 50;
    const recent = this.compostHeap.rawWaste
      .concat(this.compostHeap.decomposing)
      .concat(this.compostHeap.fertilizer)
      .filter(w => w.type === 'error' || w.type === 'fatal' || w.type === 'uncaught')
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, limit);
    return recent;
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveState() {
    const state = {
      entropyAccount: this.entropyAccount,
      compostHeap: {
        rawWaste: this.compostHeap.rawWaste.slice(-100),
        decomposing: this.compostHeap.decomposing.slice(-100),
        fertilizer: this.compostHeap.fertilizer.slice(-50),
        params: this.compostHeap.params
      },
      antiFragility: {
        stressors: this.antiFragility.stressors.slice(-100),
        antibodies: this.antiFragility.antibodies.slice(-50),
        chaosExperiments: this.antiFragility.chaosExperiments.slice(-20),
        params: this.antiFragility.params
      },
      maxwellDemon: {
        hotReservoir: this.maxwellDemon.hotReservoir.slice(-50),
        coldReservoir: this.maxwellDemon.coldReservoir.slice(-50),
        knowledge: this.maxwellDemon.knowledge,
        workExtracted: this.maxwellDemon.workExtracted,
        entropyReduced: this.maxwellDemon.entropyReduced,
        cyclesOperated: this.maxwellDemon.cyclesOperated,
        sortingAccuracy: this.maxwellDemon.sortingAccuracy,
        params: this.maxwellDemon.params
      },
      orderExtractor: {
        patterns: this.orderExtractor.patterns.slice(-100),
        signals: this.orderExtractor.signals.slice(-50),
        laws: this.orderExtractor.laws.slice(-20),
        predictions: this.orderExtractor.predictions.slice(-50),
        params: this.orderExtractor.params
      },
      history: {
        entropy: this.history.entropy.slice(-1000),
        order: this.history.order.slice(-1000),
        reversal: this.history.reversal.slice(-1000),
        compost: this.history.compost.slice(-1000),
        antifragility: this.history.antifragility.slice(-1000),
        maxwell: this.history.maxwell.slice(-1000)
      },
      params: this.params,
      savedAt: Date.now(),
      version: '1.0.0'
    };
    
    try {
      writeJSONAtomic(this.archivePath, state);
      return true;
    } catch (e) {
      console.error('[Entropy] Save failed:', e.message);
      return false;
    }
  }
  
  loadState() {
    try {
      const state = readJSONSafe(this.archivePath, null);
      if (!state) return false;
      
      if (state.entropyAccount) this.entropyAccount = { ...this.entropyAccount, ...state.entropyAccount };
      if (state.compostHeap) {
        this.compostHeap.rawWaste = state.compostHeap.rawWaste || [];
        this.compostHeap.decomposing = state.compostHeap.decomposing || [];
        this.compostHeap.fertilizer = state.compostHeap.fertilizer || [];
        this.compostHeap.params = { ...this.compostHeap.params, ...state.compostHeap.params };
      }
      if (state.antiFragility) {
        this.antiFragility.stressors = state.antiFragility.stressors || [];
        this.antiFragility.antibodies = state.antiFragility.antibodies || [];
        this.antiFragility.chaosExperiments = state.antiFragility.chaosExperiments || [];
        this.antiFragility.params = { ...this.antiFragility.params, ...state.antiFragility.params };
      }
      if (state.maxwellDemon) {
        this.maxwellDemon.hotReservoir = state.maxwellDemon.hotReservoir || [];
        this.maxwellDemon.coldReservoir = state.maxwellDemon.coldReservoir || [];
        this.maxwellDemon.knowledge = state.maxwellDemon.knowledge || 0;
        this.maxwellDemon.workExtracted = state.maxwellDemon.workExtracted || 0;
        this.maxwellDemon.entropyReduced = state.maxwellDemon.entropyReduced || 0;
        this.maxwellDemon.cyclesOperated = state.maxwellDemon.cyclesOperated || 0;
        this.maxwellDemon.sortingAccuracy = state.maxwellDemon.sortingAccuracy || 0;
        this.maxwellDemon.params = { ...this.maxwellDemon.params, ...state.maxwellDemon.params };
      }
      if (state.orderExtractor) {
        this.orderExtractor.patterns = state.orderExtractor.patterns || [];
        this.orderExtractor.signals = state.orderExtractor.signals || [];
        this.orderExtractor.laws = state.orderExtractor.laws || [];
        this.orderExtractor.predictions = state.orderExtractor.predictions || [];
        this.orderExtractor.params = { ...this.orderExtractor.params, ...state.orderExtractor.params };
      }
      if (state.history) {
        this.history = state.history;
      }
      if (state.params) this.params = { ...this.params, ...state.params };
      
      console.log('[Entropy] State loaded');
      return true;
    } catch (e) {
      console.error('[Entropy] Load failed:', e.message);
      return false;
    }
  }
  
  // ============================================================
  // PUBLIC API
  // ============================================================
  
  getEntropyReport() {
    return {
      balance: this.getEntropyBalance(),
      compost: {
        rawWaste: this.compostHeap.rawWaste.length,
        decomposing: this.compostHeap.decomposing.length,
        fertilizer: this.compostHeap.fertilizer.length,
        readyFertilizer: this.getFertilizer().length
      },
      antifragility: {
        stressors: this.antiFragility.stressors.length,
        antibodies: this.antiFragility.antibodies.length,
        chaosExperiments: this.antiFragility.chaosExperiments.length,
        hormesisZones: this.antiFragility.hormesisZones.length
      },
      maxwell: {
        cyclesOperated: this.maxwellDemon.cyclesOperated,
        workExtracted: this.maxwellDemon.workExtracted,
        entropyReduced: this.maxwellDemon.entropyReduced,
        efficiency: this.maxwellDemon.maxwellDemonEfficiency
      },
      orderExtraction: {
        patterns: this.orderExtractor.patterns.length,
        signals: this.orderExtractor.signals.length,
        laws: this.orderExtractor.laws.length,
        predictions: this.orderExtractor.predictions.length,
        extractionRate: this.orderExtractor.extractionRate,
        signalToNoise: this.orderExtractor.signalToNoise
      },
      history: {
        entropyPoints: this.history.entropy.length,
        reversalPoints: this.history.reversal.length
      }
    };
  }
  
  getFertilizerReport() {
    return this.compostHeap.fertilizer.map(f => ({
      id: f.id,
      type: f.type,
      lessons: f.lessons.length,
      patterns: f.patterns.length,
      antibodies: f.antibodies.length,
      stage: f.decompositionStage,
      progress: Math.round(f.decompositionProgress * 100)
    }));
  }
  
  getEntropyHistory(limit) {
    limit = limit || 100;
    return {
      entropy: this.history.entropy.slice(-limit),
      order: this.history.order.slice(-limit),
      reversal: this.history.reversal.slice(-limit),
      compost: this.history.compost.slice(-limit),
      antifragility: this.history.antifragility.slice(-limit),
      maxwell: this.history.maxwell.slice(-limit)
    };
  }
  
  // Deploy antibody to target system
  deployAntibody(antibody, targetSystem) {
    antibody.deployments++;
    antibody.lastDeployed = Date.now();
    
    this.recordOrderCredit('structural', 5, 'antibody_deployment', {
      antibodyId: antibody.id,
      targetSystem,
      effectiveness: antibody.effectiveness
    });
    
    this.emit('antibody:deployed', { antibody, targetSystem });
    return true;
  }
  
  // Query entropy state
  query(question) {
    const keywords = question.toLowerCase().split(/\s+/);
    
    // Search ledger
    const relevantTransactions = this.entropyAccount.ledger
      .filter(tx => keywords.some(k => 
        (tx.source && tx.source.toLowerCase().includes(k)) ||
        (tx.account && tx.account.toLowerCase().includes(k))
      ))
      .slice(-10);
    
    // Search compost
    const relevantCompost = this.compostHeap.fertilizer
      .filter(f => keywords.some(k => 
        f.lessons.some(l => l.content.toLowerCase().includes(k)) ||
        f.patterns.some(p => p.pattern.toLowerCase().includes(k))
      ))
      .slice(0, 5);
    
    // Search antibodies
    const relevantAntibodies = this.antiFragility.antibodies
      .filter(a => keywords.some(k => 
        a.trigger.toLowerCase().includes(k) ||
        a.type.toLowerCase().includes(k)
      ))
      .slice(0, 5);
    
    return {
      question,
      entropy: this.getEntropyBalance(),
      transactions: relevantTransactions,
      compost: relevantCompost,
      antibodies: relevantAntibodies
    };
  }
  
  getCurrentCycle() {
    try {
      const state = readJSONSafe(path.join(__dirname, '..', 'estado.json'), {});
      return state.c || 0;
    } catch {
      return Math.floor(Date.now() / 1000 / 30);
    }
  }
}

module.exports = { EntropyReversalEngine };

// CLI
if (require.main === module) {
  const engine = new EntropyReversalEngine();
  
  console.log('💎 Entropy Reversal Engine initialized');
  
  // Simulate some activity
  console.log('\nFeeding errors to compost...');
  engine.feedError({
    type: 'error',
    message: 'Connection timeout to database',
    stack: 'Error: Connection timeout\n  at Database.connect (/app/db.js:42)\n  at Server.start (/app/server.js:15)',
    source: 'database',
    context: { userAction: 'save_construction', config: { timeout: 5000 } }
  });
  
  engine.feedError({
    type: 'warning',
    message: 'High memory usage detected',
    stack: '',
    source: 'monitor',
    context: { memoryUsage: 0.85, threshold: 0.8 }
  });
  
  engine.feedError({
    type: 'error',
    message: 'JSON parse failed',
    stack: 'SyntaxError: Unexpected token\n  at JSON.parse (<anonymous>)\n  at Parser.parse (/app/parser.js:100)',
    source: 'parser',
    context: { input: '{"broken": json}' }
  });
  
  console.log('\nProcessing compost...');
  for (let i = 0; i < 10; i++) {
    engine.processCompost();
  }
  
  console.log('\nRunning Maxwell\'s Demon...');
  for (let i = 0; i < 5; i++) {
    engine.operateMaxwellDemon();
  }
  
  console.log('\nExtracting order from chaos...');
  engine.addNoise('errors', { type: 'error', eventType: 'timeout' });
  engine.addNoise('errors', { type: 'error', eventType: 'timeout' });
  engine.addNoise('errors', { type: 'error', eventType: 'parse' });
  engine.extractOrder();
  
  console.log('\nRecording stress...');
  engine.recordStress({
    source: 'load_test',
    type: 'load',
    intensity: 0.6,
    duration: 5000,
    impact: { latency: 0.3, errors: 2 }
  });
  
  console.log('\nRunning Maxwell\'s Demon again...');
  engine.operateMaxwellDemon();
  
  console.log('\nExtracting order again...');
  engine.extractOrder();
  
  console.log('\n--- ENTROPY REPORT ---');
  console.log(JSON.stringify(engine.getEntropyReport(), null, 2));
  
  console.log('\n--- FERTILIZER READY ---');
  console.log(JSON.stringify(engine.getFertilizerReport(), null, 2));
  
  console.log('\n💎 Entropy Reversal Engine test complete');
}