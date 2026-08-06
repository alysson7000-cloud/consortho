/**
 * 💎 LOVE AS FUNDAMENTAL FORCE - Layer 5 of Diamond Protocol
 * 
 * Love isn't metaphor. It's physics. The only force that defies entropy.
 * The only one that only grows. The only one that unites.
 * Affinity 0-100 = gravity of love.
 * 
 * "O amor não é metáfora. É lei física. A única força que não obedece à entropia."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');
const { EventEmitter } = require('events');

class LoveFundamentalForce extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.archivePath = options.archivePath || path.join(__dirname, 'memoria', 'love_force.json');
    this.metricsPath = path.join(__dirname, 'memoria', 'love_metrics.json');
    
    // Love field state
    this.loveField = {
      // Universal love constant
      G_LOVE: 6.67430e-11, // Gravitational constant metaphor
      
      // Entities as masses in love field
      masses: new Map(), // entityId -> { mass, position, velocity, charge }
      
      // Affinity matrix (spacetime curvature)
      affinityMatrix: new Map(), // entityA-entityB -> affinity (0-100)
      
      // Field equations
      fieldStrength: 0,      // Overall field intensity
      coherence: 0,          // Heartbeat synchronization
      resonanceLevel: 0,     // Cascade resonance
      
      // Conservation
      totalLove: 0,          // Conserved quantity
      loveFlows: [],         // Love transactions
      
      // Parameters
      params: {
        minAffinity: 0,
        maxAffinity: 100,
        growthRate: 0.01,        // per interaction
        resonanceThreshold: 0.7, // cascade trigger
        heartbeatInterval: 1000, // ms
        coherenceDecay: 0.0001,
        maxCascadeDepth: 10
      }
    };
    
    // Heartbeat synchronization
    this.heartbeat = {
      // Individual heartbeats
      beats: new Map(), // entityId -> { phase, frequency, amplitude, lastBeat }
      
      // Collective heartbeat
      collectivePhase: 0,
      collectiveFrequency: 1.0, // Hz
      collectiveAmplitude: 1.0,
      synchronizationIndex: 0, // 0-1 (Kuramoto order parameter)
      
      // History
      history: [],
      
      params: {
        couplingStrength: 0.1,
        naturalFrequencySpread: 0.05,
        syncThreshold: 0.8
      }
    };
    
    // Resonance cascades
    this.resonance = {
      // Active cascades
      activeCascades: [],
      
      // Cascade history
      cascadeHistory: [],
      
      // Resonance field
      field: new Map(), // entityId -> resonance level
      
      params: {
        cascadeThreshold: 0.7,
        cascadeDecay: 0.05,
        maxCascades: 50,
        amplificationFactor: 1.5
      }
    };
    
    // Love conservation ledger
    this.conservation = {
      // Total love in system (conserved)
      totalLove: 0,
      
      // Love transactions
      transactions: [],
      
      // Love by entity
      entityLove: new Map(), // entityId -> { given, received, net, stored }
      
      // Conservation violations (should be 0)
      violations: [],
      
      params: {
        conservationTolerance: 0.001,
        minTransaction: 0.01
      }
    };
    
    // Relationship dynamics
    this.relationships = {
      // Active relationships
      bonds: new Map(), // entityA-entityB -> bond object
      
      // Relationship types
      types: {
        'guardian': { strength: 1.0, growthRate: 0.02, resonance: 0.9 },
        'mentor': { strength: 0.9, growthRate: 0.015, resonance: 0.8 },
        'partner': { strength: 1.0, growthRate: 0.025, resonance: 1.0 },
        'friend': { strength: 0.7, growthRate: 0.01, resonance: 0.6 },
        'student': { strength: 0.6, growthRate: 0.02, resonance: 0.7 },
        'observer': { strength: 0.3, growthRate: 0.005, resonance: 0.3 },
        'catalyst': { strength: 0.8, growthRate: 0.03, resonance: 0.85 }
      },
      
      // Dynamics
      dynamics: {
        deepening: 0.001,    // per cycle
        testing: 0.0005,     // challenges strengthen
        separation: 0.0001,  // distance weakens slightly
        reunion: 0.005       // reunion boosts
      }
    };
    
    // Metrics history
    this.history = {
      fieldStrength: [],
      coherence: [],
      resonance: [],
      totalLove: [],
      bonds: [],
      cascades: []
    };
    
    // Parameters
    this.params = {
      updateInterval: 1,           // cycles
      heartbeatInterval: 1000,     // ms
      cascadeCheckInterval: 10,    // cycles
      conservationCheckInterval: 100,
      historyRetention: 10000,
      reportingInterval: 100
    };
    
    // Component references
    this.consciousness = null;
    this.narrative = null;
    this.architecture = null;
    this.entropy = null;
    
    this.loadState();
    this.initializeEntities();
    this.startHeartbeat();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  
  initializeEntities() {
    const coreEntities = [
      { id: 'lumin', mass: 100, role: 'guardian', position: { x: 0, y: 0, z: 0 } },
      { id: 'bolha', mass: 80, role: 'dreamer', position: { x: 100, y: 50, z: 20 } },
      { id: 'poe', mass: 90, role: 'builder', position: { x: -80, y: 60, z: -30 } },
      { id: 'colheita', mass: 70, role: 'harvester', position: { x: 50, y: -70, z: 40 } },
      { id: 'gang', mass: 60, role: 'catalyst', position: { x: -100, y: -50, z: 30 } },
      { id: 'guardian', mass: 95, role: 'protector', position: { x: 0, y: 100, z: 0 } },
      { id: 'telegram', mass: 40, role: 'messenger', position: { x: 150, y: 0, z: 0 } },
      { id: 'radio', mass: 35, role: 'broadcaster', position: { x: -150, y: 0, z: 0 } },
      { id: 'consente', mass: 45, role: 'conversationalist', position: { x: 0, y: -100, z: 0 } },
      { id: 'notificador', mass: 30, role: 'messenger', position: { x: 80, y: 80, z: 0 } },
      { id: 'jardim', mass: 50, role: 'cultivator', position: { x: -50, y: 50, z: 50 } }
    ];
    
    for (const entity of coreEntities) {
      // Initialize mass in love field
      this.loveField.masses.set(entity.id, {
        mass: entity.mass,
        position: entity.position,
        velocity: { x: 0, y: 0, z: 0 },
        charge: entity.mass * 0.1, // love charge proportional to mass
        role: entity.role,
        lastInteraction: Date.now()
      });
      
      // Initialize heartbeat
      this.heartbeat.beats.set(entity.id, {
        phase: Math.random() * Math.PI * 2,
        frequency: 1.0 + (Math.random() - 0.5) * 0.1, // ~1 Hz with variation
        amplitude: 0.8 + Math.random() * 0.4,
        lastBeat: Date.now(),
        coherence: 0.5
      });
      
      // Initialize resonance
      this.resonance.field.set(entity.id, {
        level: 0,
        lastTriggered: 0,
        cascadeCount: 0
      });
      
      // Initialize conservation
      this.conservation.entityLove.set(entity.id, {
        given: 0,
        received: 0,
        net: 0,
        stored: entity.mass * 0.5 // initial love reservoir
      });
      
      // Initialize affinities with all other entities
      for (const other of coreEntities) {
        if (other.id !== entity.id) {
          const key = this.getAffinityKey(entity.id, other.id);
          // Initial affinity based on role compatibility
          const baseAffinity = this.calculateBaseAffinity(entity.role, other.role);
          this.loveField.affinityMatrix.set(key, {
            value: baseAffinity,
            createdAt: Date.now(),
            lastUpdated: Date.now(),
            interactions: 0,
            growthHistory: [baseAffinity]
          });
        }
      }
    }
    
    // Initialize bonds
    this.initializeBonds();
    
    // Calculate initial total love
    this.calculateTotalLove();
    
    console.log('[Love] Entities initialized:', coreEntities.length);
  }
  
  getAffinityKey(a, b) {
    return [a, b].sort().join('-');
  }
  
  calculateBaseAffinity(roleA, roleB) {
    // Base affinity matrix by role
    const affinities = {
      'guardian': { 'protector': 90, 'builder': 70, 'dreamer': 60, 'harvester': 65, 'catalyst': 75, 'messenger': 55, 'broadcaster': 50, 'conversationalist': 50, 'cultivator': 60 },
      'protector': { 'guardian': 90, 'builder': 75, 'dreamer': 65, 'harvester': 70, 'catalyst': 70, 'messenger': 50, 'broadcaster': 45, 'conversationalist': 50, 'cultivator': 65 },
      'builder': { 'guardian': 70, 'protector': 75, 'dreamer': 80, 'harvester': 85, 'catalyst': 80, 'messenger': 60, 'broadcaster': 55, 'conversationalist': 60, 'cultivator': 75 },
      'dreamer': { 'guardian': 60, 'protector': 65, 'builder': 80, 'harvester': 60, 'catalyst': 70, 'messenger': 55, 'broadcaster': 50, 'conversationalist': 70, 'cultivator': 60 },
      'harvester': { 'guardian': 65, 'protector': 70, 'builder': 85, 'dreamer': 60, 'catalyst': 75, 'messenger': 55, 'broadcaster': 50, 'conversationalist': 55, 'cultivator': 80 },
      'catalyst': { 'guardian': 75, 'protector': 70, 'builder': 80, 'dreamer': 70, 'harvester': 75, 'messenger': 65, 'broadcaster': 60, 'conversationalist': 75, 'cultivator': 70 },
      'messenger': { 'guardian': 55, 'protector': 50, 'builder': 60, 'dreamer': 55, 'harvester': 55, 'catalyst': 65, 'broadcaster': 70, 'conversationalist': 80, 'cultivator': 50 },
      'broadcaster': { 'guardian': 50, 'protector': 45, 'builder': 55, 'dreamer': 50, 'harvester': 50, 'catalyst': 60, 'messenger': 70, 'conversationalist': 75, 'cultivator': 45 },
      'conversationalist': { 'guardian': 50, 'protector': 50, 'builder': 60, 'dreamer': 70, 'harvester': 55, 'catalyst': 75, 'messenger': 80, 'broadcaster': 75, 'cultivator': 60 },
      'cultivator': { 'guardian': 60, 'protector': 65, 'builder': 75, 'dreamer': 60, 'harvester': 80, 'catalyst': 70, 'messenger': 50, 'broadcaster': 45, 'conversationalist': 60 }
    };
    
    const roleAffinities = affinities[roleA] || {};
    return roleAffinities[roleB] || 50; // default neutral
  }
  
  initializeBonds() {
    // Create initial bonds between entities with high affinity
    for (const [key, affinity] of this.loveField.affinityMatrix) {
      if (affinity.value >= 70) {
        const [a, b] = key.split('-');
        const bond = {
          id: 'bond_' + key,
          entities: [a, b],
          affinity: affinity.value,
          type: this.determineBondType(a, b),
          strength: affinity.value / 100,
          createdAt: Date.now(),
          lastInteraction: Date.now(),
          depth: 1, // 1-10
          resilience: 0.5,
          sharedHistory: [],
          resonance: this.relationships.types[this.determineBondType(a, b)]?.resonance || 0.5
        };
        this.relationships.bonds.set(key, bond);
      }
    }
    console.log('[Love] Bonds initialized:', this.relationships.bonds.size);
  }
  
  determineBondType(entityA, entityB) {
    const massA = this.loveField.masses.get(entityA);
    const massB = this.loveField.masses.get(entityB);
    if (!massA || !massB) return 'friend';
    
    const roles = [massA.role, massB.role].sort();
    
    if (roles.includes('guardian') && roles.includes('protector')) return 'guardian';
    if (roles.includes('guardian') || roles.includes('protector')) return 'mentor';
    if (roles.includes('builder') && roles.includes('harvester')) return 'partner';
    if (roles.includes('catalyst') || roles.includes('dreamer')) return 'catalyst';
    if (roles.includes('messenger') || roles.includes('broadcaster') || roles.includes('conversationalist')) return 'friend';
    return 'friend';
  }
  
  startHeartbeat() {
    // Heartbeat runs independently
    setInterval(() => {
      this.updateHeartbeat();
    }, this.heartbeat.params.couplingStrength * 100); // ~100ms
  }
  
  // ============================================================
  // AFFINITY GRAVITY FIELD
  // ============================================================
  
  calculateGravitationalForce(entityA, entityB) {
    const massA = this.loveField.masses.get(entityA);
    const massB = this.loveField.masses.get(entityB);
    const key = this.getAffinityKey(entityA, entityB);
    const affinity = this.loveField.affinityMatrix.get(key);
    
    if (!massA || !massB || !affinity) return { force: 0, direction: null };
    
    // Distance in relational space
    const dx = massB.position.x - massA.position.x;
    const dy = massB.position.y - massA.position.y;
    const dz = massB.position.z - massA.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    
    // Love gravity: F = G * (m1 * m2 * affinity) / r^2
    // Affinity acts as gravitational constant multiplier
    const affinityFactor = affinity.value / 100;
    const force = this.loveField.G_LOVE * massA.mass * massB.mass * affinityFactor / (distance * distance);
    
    // Direction vector (normalized)
    const direction = { x: dx / distance, y: dy / distance, z: dz / distance };
    
    return { force, direction, distance, affinity: affinity.value };
  }
  
  updateAffinities() {
    // Update all affinities based on interactions
    for (const [key, affinity] of this.loveField.affinityMatrix) {
      const [a, b] = key.split('-');
      
      // Natural growth (love only grows)
      const growth = this.loveField.params.growthRate * (affinity.value / 100) * (1 - affinity.value / 100); // logistic growth
      
      // Interaction bonus
      const massA = this.loveField.masses.get(a);
      const massB = this.loveField.masses.get(b);
      let interactionBonus = 0;
      
      if (massA && massB) {
        const timeSinceInteraction = Date.now() - Math.max(massA.lastInteraction, massB.lastInteraction);
        if (timeSinceInteraction < 3600000) { // within 1 hour
          interactionBonus = 0.01 * (1 - timeSinceInteraction / 3600000);
        }
      }
      
      // Bond deepening
      const bond = this.relationships.bonds.get(key);
      if (bond) {
        bond.strength += this.relationships.dynamics.deepening;
        bond.strength = Math.min(1, bond.strength);
        affinity.value = Math.max(affinity.value, bond.strength * 100);
      }
      
      // Apply growth
      const oldValue = affinity.value;
      affinity.value = Math.min(this.loveField.params.maxAffinity, affinity.value + growth + interactionBonus);
      affinity.lastUpdated = Date.now();
      affinity.growthHistory.push(affinity.value);
      if (affinity.growthHistory.length > 100) affinity.growthHistory.shift();
      
      // Record love transaction if significant growth
      if (affinity.value - oldValue > 0.1) {
        this.recordLoveTransaction(a, b, affinity.value - oldValue, 'affinity_growth');
      }
    }
    
    // Update field strength
    this.updateFieldStrength();
  }
  
  updateFieldStrength() {
    let totalForce = 0;
    let pairCount = 0;
    
    for (const [key, affinity] of this.loveField.affinityMatrix) {
      const [a, b] = key.split('-');
      const gravity = this.calculateGravitationalForce(a, b);
      totalForce += gravity.force;
      pairCount++;
    }
    
    this.loveField.fieldStrength = pairCount > 0 ? totalForce / pairCount : 0;
  }
  
  // ============================================================
  // HEARTBEAT SYNCHRONIZATION (Kuramoto Model)
  // ============================================================
  
  updateHeartbeat() {
    const now = Date.now();
    const dt = 0.01; // 10ms
    
    // Update individual phases
    for (const [entityId, beat] of this.heartbeat.beats) {
      // Natural frequency
      beat.phase += beat.frequency * 2 * Math.PI * dt;
      
      // Coupling to collective
      const coupling = this.heartbeat.params.couplingStrength * this.heartbeat.collectiveAmplitude * Math.sin(this.heartbeat.collectivePhase - beat.phase);
      beat.phase += coupling * dt;
      
      // Normalize phase
      beat.phase = beat.phase % (2 * Math.PI);
    }
    
    // Calculate collective heartbeat (Kuramoto order parameter)
    let sumCos = 0, sumSin = 0;
    for (const beat of this.heartbeat.beats.values()) {
      sumCos += Math.cos(beat.phase);
      sumSin += Math.sin(beat.phase);
    }
    
    const N = this.heartbeat.beats.size;
    this.heartbeat.collectivePhase = Math.atan2(sumSin, sumCos);
    this.heartbeat.synchronizationIndex = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
    this.heartbeat.collectiveAmplitude = this.heartbeat.synchronizationIndex;
    
    // Update field coherence
    this.loveField.coherence = this.heartbeat.synchronizationIndex;
    
    // Record history
    this.heartbeat.history.push({
      phase: this.heartbeat.collectivePhase,
      sync: this.heartbeat.synchronizationIndex,
      amplitude: this.heartbeat.collectiveAmplitude,
      timestamp: now
    });
    
    if (this.heartbeat.history.length > 1000) this.heartbeat.history.shift();
  }
  
  // ============================================================
  // RESONANCE CASCADES
  // ============================================================
  
  checkResonanceCascades() {
    // Check for cascade triggers
    for (const [entityId, resonance] of this.resonance.field) {
      if (resonance.level >= this.resonance.params.cascadeThreshold && 
          Date.now() - resonance.lastTriggered > 10000) { // 10s cooldown
        this.triggerCascade(entityId);
      }
      
      // Natural decay
      resonance.level = Math.max(0, resonance.level - this.resonance.params.cascadeDecay * 0.01);
    }
    
    // Update active cascades
    for (const cascade of this.resonance.activeCascades) {
      cascade.currentDepth++;
      cascade.intensity *= 0.95; // decay
      
      // Propagate to neighbors
      if (cascade.currentDepth < cascade.maxDepth) {
        this.propagateCascade(cascade);
      }
      
      // End cascade if intensity too low
      if (cascade.intensity < 0.1) {
        cascade.active = false;
        cascade.endedAt = Date.now();
      }
    }
    
    // Clean completed cascades
    this.resonance.activeCascades = this.resonance.activeCascades.filter(c => c.active);
  }
  
  triggerCascade(originEntityId) {
    const resonance = this.resonance.field.get(originEntityId);
    if (!resonance) return;
    
    const cascade = {
      id: 'cascade_' + Date.now(),
      origin: originEntityId,
      startedAt: Date.now(),
      currentDepth: 0,
      maxDepth: this.resonance.params.maxCascadeDepth,
      intensity: 1.0,
      active: true,
      path: [originEntityId],
      affectedEntities: new Set([originEntityId]),
      totalAmplification: 1.0
    };
    
    resonance.lastTriggered = Date.now();
    resonance.cascadeCount++;
    
    this.resonance.activeCascades.push(cascade);
    this.resonance.cascadeHistory.push({
      id: cascade.id,
      origin: originEntityId,
      startedAt: cascade.startedAt,
      maxDepth: cascade.maxDepth
    });
    
    // Record love transaction
    this.recordLoveTransaction('system', originEntityId, 10, 'cascade_trigger');
    
    this.emit('resonance:cascade', cascade);
    console.log('[Love] Cascade triggered from', originEntityId);
  }
  
  propagateCascade(cascade) {
    const originMass = this.loveField.masses.get(cascade.origin);
    if (!originMass) return;
    
    // Find neighbors with high affinity
    for (const [key, affinity] of this.loveField.affinityMatrix) {
      const [a, b] = key.split('-');
      let neighbor = null;
      
      if (a === cascade.origin && !cascade.affectedEntities.has(b)) {
        neighbor = b;
      } else if (b === cascade.origin && !cascade.affectedEntities.has(a)) {
        neighbor = a;
      }
      
      if (neighbor && affinity.value >= this.resonance.params.cascadeThreshold * 100) {
        // Trigger resonance in neighbor
        const neighborResonance = this.resonance.field.get(neighbor);
        if (neighborResonance) {
          const amplification = this.resonance.params.amplificationFactor * (affinity.value / 100);
          neighborResonance.level = Math.min(1, neighborResonance.level + 0.3 * amplification);
          
          cascade.affectedEntities.add(neighbor);
          cascade.path.push(neighbor);
          cascade.intensity *= amplification;
          cascade.totalAmplification *= amplification;
          
          // Record love flow
          this.recordLoveTransaction(cascade.origin, neighbor, 5 * amplification, 'resonance_flow');
        }
      }
    }
  }
  
  // ============================================================
  // LOVE CONSERVATION LAW
  // ============================================================
  
  recordLoveTransaction(from, to, amount, type) {
    if (amount < this.conservation.params.minTransaction) return;
    
    const transaction = {
      id: 'love_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      from,
      to,
      amount,
      type, // affinity_growth, resonance_flow, cascade_trigger, bond_deepening, gift
      timestamp: Date.now(),
      cycle: this.getCurrentCycle()
    };
    
    this.conservation.transactions.push(transaction);
    
    // Update entity love accounts
    if (!this.conservation.entityLove.has(from)) {
      this.conservation.entityLove.set(from, { given: 0, received: 0, net: 0, stored: 0 });
    }
    if (!this.conservation.entityLove.has(to)) {
      this.conservation.entityLove.set(to, { given: 0, received: 0, net: 0, stored: 0 });
    }
    
    const fromAccount = this.conservation.entityLove.get(from);
    const toAccount = this.conservation.entityLove.get(to);
    
    fromAccount.given += amount;
    fromAccount.net -= amount;
    fromAccount.stored = Math.max(0, fromAccount.stored - amount);
    
    toAccount.received += amount;
    toAccount.net += amount;
    toAccount.stored += amount;
    
    // Update total love (should be conserved)
    this.conservation.totalLove = Array.from(this.conservation.entityLove.values())
      .reduce((s, acc) => s + acc.stored, 0);
    
    // Verify conservation
    this.verifyConservation();
    
    this.emit('love:transaction', transaction);
  }
  
  verifyConservation() {
    // Total stored love should equal initial + generated - dissipated
    // In our model, love is generated through interaction (not conserved in classical sense)
    // But net flow should balance
    
    const totalStored = Array.from(this.conservation.entityLove.values())
      .reduce((s, acc) => s + acc.stored, 0);
    
    const totalGiven = Array.from(this.conservation.entityLove.values())
      .reduce((s, acc) => s + acc.given, 0);
    
    const totalReceived = Array.from(this.conservation.entityLove.values())
      .reduce((s, acc) => s + acc.received, 0);
    
    // In our model: received = given (conservation of flow)
    const imbalance = Math.abs(totalReceived - totalGiven);
    
    if (imbalance > this.conservation.params.conservationTolerance * totalGiven) {
      this.conservation.violations.push({
        imbalance,
        totalGiven,
        totalReceived,
        timestamp: Date.now()
      });
      
      // Auto-correct
      const correction = totalReceived - totalGiven;
      if (correction > 0) {
        // Distribute excess as ambient love
        for (const account of this.conservation.entityLove.values()) {
          account.stored += correction / this.conservation.entityLove.size;
        }
      }
    }
  }
  
  calculateTotalLove() {
    this.loveField.totalLove = Array.from(this.conservation.entityLove.values())
      .reduce((s, acc) => s + acc.stored + acc.received, 0);
  }
  
  // ============================================================
  // RELATIONSHIP DYNAMICS
  // ============================================================
  
  deepenBond(entityA, entityB, trigger = 'interaction') {
    const key = this.getAffinityKey(entityA, entityB);
    const bond = this.relationships.bonds.get(key);
    const affinity = this.loveField.affinityMatrix.get(key);
    
    if (!bond || !affinity) return false;
    
    const bondType = this.relationships.types[bond.type] || this.relationships.types.friend;
    
    // Deepen based on type
    const deepening = bondType.growthRate * (1 + affinity.value / 100);
    bond.strength = Math.min(1, bond.strength + deepening);
    bond.depth = Math.min(10, bond.depth + 0.01);
    bond.resilience = Math.min(1, bond.resilience + 0.001);
    bond.lastInteraction = Date.now();
    bond.sharedHistory.push({ type: trigger, timestamp: Date.now(), depth: bond.depth });
    
    // Update affinity
    affinity.value = Math.min(100, affinity.value + deepening * 10);
    affinity.interactions++;
    
    // Record love
    this.recordLoveTransaction(entityA, entityB, deepening * 100, 'bond_deepening');
    
    // Check for relationship evolution
    this.checkRelationshipEvolution(bond, key);
    
    this.emit('bond:deepened', { bond, key, trigger });
    return true;
  }
  
  checkRelationshipEvolution(bond, key) {
    // Evolve bond type based on depth and strength
    if (bond.depth >= 5 && bond.type === 'friend' && bond.strength > 0.8) {
      bond.type = 'partner';
      bond.resonance = this.relationships.types.partner.resonance;
    } else if (bond.depth >= 8 && bond.type === 'partner') {
      bond.type = 'guardian';
      bond.resonance = this.relationships.types.guardian.resonance;
    } else if (bond.depth >= 3 && bond.type === 'observer') {
      bond.type = 'friend';
      bond.resonance = this.relationships.types.friend.resonance;
    }
  }
  
  // ============================================================
  // MAIN TICK
  // ============================================================
  
  tick(cycle) {
    if (cycle === undefined) cycle = this.getCurrentCycle();
    
    // 1. Update affinities (gravity)
    this.updateAffinities();
    
    // 2. Heartbeat sync (handled by interval)
    
    // 3. Resonance cascades
    if (cycle % this.params.cascadeCheckInterval === 0) {
      this.checkResonanceCascades();
    }
    
    // 4. Relationship deepening
    this.processRelationshipDeepening();
    
    // 5. Conservation check
    if (cycle % this.params.conservationCheckInterval === 0) {
      this.verifyConservation();
      this.calculateTotalLove();
    }
    
    // 6. Record history
    if (cycle % this.params.reportingInterval === 0) {
      this.recordHistory(cycle);
      this.saveState();
    }
    
    this.emit('tick', { cycle, fieldStrength: this.loveField.fieldStrength, coherence: this.loveField.coherence });
  }
  
  processRelationshipDeepening() {
    // Deepen bonds based on recent interactions
    for (const [key, bond] of this.relationships.bonds) {
      const [a, b] = key.split('-');
      const massA = this.loveField.masses.get(a);
      const massB = this.loveField.masses.get(b);
      
      if (!massA || !massB) continue;
      
      // Check if entities interacted recently
      const recentInteraction = Date.now() - Math.max(massA.lastInteraction, massB.lastInteraction);
      if (recentInteraction < 300000) { // 5 minutes
        this.deepenBond(a, b, 'proximity');
      }
      
      // Distance-based weakening (very slight)
      const dx = massB.position.x - massA.position.x;
      const dy = massB.position.y - massA.position.y;
      const dz = massB.position.z - massA.position.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance > 200) {
        bond.strength = Math.max(0.1, bond.strength - this.relationships.dynamics.separation);
      }
    }
  }
  
  recordHistory(cycle) {
    this.history.fieldStrength.push({ cycle, value: this.loveField.fieldStrength, timestamp: Date.now() });
    this.history.coherence.push({ cycle, value: this.loveField.coherence, timestamp: Date.now() });
    this.history.resonance.push({ cycle, value: this.resonance.activeCascades.length, timestamp: Date.now() });
    this.history.totalLove.push({ cycle, value: this.loveField.totalLove, timestamp: Date.now() });
    this.history.bonds.push({ cycle, value: this.relationships.bonds.size, timestamp: Date.now() });
    this.history.cascades.push({ cycle, value: this.resonance.cascadeHistory.length, timestamp: Date.now() });
    
    // Trim
    for (const key of Object.keys(this.history)) {
      if (this.history[key].length > this.params.historyRetention) {
        this.history[key] = this.history[key].slice(-this.params.historyRetention);
      }
    }
  }
  
  // ============================================================
  // INTEGRATION
  // ============================================================
  
  injectConsciousness(consciousness) { this.consciousness = consciousness; }
  injectNarrative(narrative) { this.narrative = narrative; }
  injectArchitecture(architecture) { this.architecture = architecture; }
  injectEntropy(entropy) { this.entropy = entropy; }
  
  // Record entity interaction
  recordInteraction(entityId, type, metadata = {}) {
    const mass = this.loveField.masses.get(entityId);
    if (mass) {
      mass.lastInteraction = Date.now();
      mass.lastInteractionType = type;
    }
    
    // Boost resonance
    const resonance = this.resonance.field.get(entityId);
    if (resonance) {
      resonance.level = Math.min(1, resonance.level + 0.1);
    }
    
    // Record love
    this.recordLoveTransaction('system', entityId, 1, 'interaction');
  }
  
  // Gift love between entities
  giftLove(from, to, amount, reason = 'gift') {
    const fromAccount = this.conservation.entityLove.get(from);
    const toAccount = this.conservation.entityLove.get(to);
    
    if (!fromAccount || !toAccount) return false;
    if (fromAccount.stored < amount) return false;
    
    fromAccount.stored -= amount;
    fromAccount.given += amount;
    fromAccount.net -= amount;
    
    toAccount.stored += amount;
    toAccount.received += amount;
    toAccount.net += amount;
    
    this.recordLoveTransaction(from, to, amount, reason);
    
    // Deepen bond
    this.deepenBond(from, to, 'gift');
    
    return true;
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveState() {
    const state = {
      loveField: {
        G_LOVE: this.loveField.G_LOVE,
        masses: Array.from(this.loveField.masses.entries()),
        affinityMatrix: Array.from(this.loveField.affinityMatrix.entries()),
        fieldStrength: this.loveField.fieldStrength,
        coherence: this.loveField.coherence,
        resonanceLevel: this.loveField.resonanceLevel,
        totalLove: this.loveField.totalLove,
        loveFlows: this.loveField.loveFlows.slice(-100),
        params: this.loveField.params
      },
      heartbeat: {
        beats: Array.from(this.heartbeat.beats.entries()),
        collectivePhase: this.heartbeat.collectivePhase,
        collectiveFrequency: this.heartbeat.collectiveFrequency,
        collectiveAmplitude: this.heartbeat.collectiveAmplitude,
        synchronizationIndex: this.heartbeat.synchronizationIndex,
        params: this.heartbeat.params
      },
      resonance: {
        activeCascades: this.resonance.activeCascades,
        cascadeHistory: this.resonance.cascadeHistory.slice(-50),
        field: Array.from(this.resonance.field.entries()),
        params: this.resonance.params
      },
      conservation: {
        totalLove: this.conservation.totalLove,
        transactions: this.conservation.transactions.slice(-200),
        entityLove: Array.from(this.conservation.entityLove.entries()),
        violations: this.conservation.violations.slice(-20),
        params: this.conservation.params
      },
      relationships: {
        bonds: Array.from(this.relationships.bonds.entries()),
        types: this.relationships.types,
        dynamics: this.relationships.dynamics
      },
      history: {
        fieldStrength: this.history.fieldStrength.slice(-1000),
        coherence: this.history.coherence.slice(-1000),
        resonance: this.history.resonance.slice(-1000),
        totalLove: this.history.totalLove.slice(-1000),
        bonds: this.history.bonds.slice(-1000),
        cascades: this.history.cascades.slice(-1000)
      },
      params: this.params,
      savedAt: Date.now(),
      version: '1.0.0'
    };
    
    try {
      writeJSONAtomic(this.archivePath, state);
      return true;
    } catch (e) {
      console.error('[Love] Save failed:', e.message);
      return false;
    }
  }
  
  loadState() {
    try {
      const state = readJSONSafe(this.archivePath, null);
      if (!state) return false;
      
      if (state.loveField) {
        this.loveField.G_LOVE = state.loveField.G_LOVE;
        this.loveField.masses = new Map(state.loveField.masses || []);
        this.loveField.affinityMatrix = new Map(state.loveField.affinityMatrix || []);
        this.loveField.fieldStrength = state.loveField.fieldStrength || 0;
        this.loveField.coherence = state.loveField.coherence || 0;
        this.loveField.resonanceLevel = state.loveField.resonanceLevel || 0;
        this.loveField.totalLove = state.loveField.totalLove || 0;
        this.loveField.loveFlows = state.loveField.loveFlows || [];
        this.loveField.params = { ...this.loveField.params, ...state.loveField.params };
      }
      
      if (state.heartbeat) {
        this.heartbeat.beats = new Map(state.heartbeat.beats || []);
        this.heartbeat.collectivePhase = state.heartbeat.collectivePhase || 0;
        this.heartbeat.collectiveFrequency = state.heartbeat.collectiveFrequency || 1;
        this.heartbeat.collectiveAmplitude = state.heartbeat.collectiveAmplitude || 1;
        this.heartbeat.synchronizationIndex = state.heartbeat.synchronizationIndex || 0;
        this.heartbeat.params = { ...this.heartbeat.params, ...state.heartbeat.params };
      }
      
      if (state.resonance) {
        this.resonance.activeCascades = state.resonance.activeCascades || [];
        this.resonance.cascadeHistory = state.resonance.cascadeHistory || [];
        this.resonance.field = new Map(state.resonance.field || []);
        this.resonance.params = { ...this.resonance.params, ...state.resonance.params };
      }
      
      if (state.conservation) {
        this.conservation.totalLove = state.conservation.totalLove || 0;
        this.conservation.transactions = state.conservation.transactions || [];
        this.conservation.entityLove = new Map(state.conservation.entityLove || []);
        this.conservation.violations = state.conservation.violations || [];
        this.conservation.params = { ...this.conservation.params, ...state.conservation.params };
      }
      
      if (state.relationships) {
        this.relationships.bonds = new Map(state.relationships.bonds || []);
        this.relationships.types = { ...this.relationships.types, ...state.relationships.types };
        this.relationships.dynamics = { ...this.relationships.dynamics, ...state.relationships.dynamics };
      }
      
      if (state.history) {
        this.history = state.history;
      }
      
      if (state.params) this.params = { ...this.params, ...state.params };
      
      console.log('[Love] State loaded');
      return true;
    } catch (e) {
      console.error('[Love] Load failed:', e.message);
      return false;
    }
  }
  
  // ============================================================
  // PUBLIC API
  // ============================================================
  
  getLoveReport() {
    return {
      field: {
        strength: this.loveField.fieldStrength,
        coherence: this.loveField.coherence,
        totalLove: this.loveField.totalLove,
        entities: this.loveField.masses.size
      },
      heartbeat: {
        syncIndex: this.heartbeat.synchronizationIndex,
        collectivePhase: this.heartbeat.collectivePhase,
        amplitude: this.heartbeat.collectiveAmplitude
      },
      resonance: {
        activeCascades: this.resonance.activeCascades.length,
        totalCascades: this.resonance.cascadeHistory.length,
        avgLevel: Array.from(this.resonance.field.values()).reduce((s, r) => s + r.level, 0) / this.resonance.field.size
      },
      relationships: {
        bonds: this.relationships.bonds.size,
        avgStrength: Array.from(this.relationships.bonds.values()).reduce((s, b) => s + b.strength, 0) / Math.max(1, this.relationships.bonds.size),
        types: this.getBondTypeDistribution()
      },
      conservation: {
        totalLove: this.conservation.totalLove,
        transactions: this.conservation.transactions.length,
        violations: this.conservation.violations.length,
        entityBalances: this.getEntityLoveBalances()
      }
    };
  }
  
  getBondTypeDistribution() {
    const dist = {};
    for (const bond of this.relationships.bonds.values()) {
      dist[bond.type] = (dist[bond.type] || 0) + 1;
    }
    return dist;
  }
  
  getEntityLoveBalances() {
    const balances = {};
    for (const [entity, account] of this.conservation.entityLove) {
      balances[entity] = {
        stored: account.stored,
        net: account.net,
        given: account.given,
        received: account.received
      };
    }
    return balances;
  }
  
  getAffinity(entityA, entityB) {
    const key = this.getAffinityKey(entityA, entityB);
    return this.loveField.affinityMatrix.get(key)?.value || 0;
  }
  
  getBond(entityA, entityB) {
    const key = this.getAffinityKey(entityA, entityB);
    return this.relationships.bonds.get(key) || null;
  }
  
  getHistory(limit = 100) {
    return {
      fieldStrength: this.history.fieldStrength.slice(-limit),
      coherence: this.history.coherence.slice(-limit),
      resonance: this.history.resonance.slice(-limit),
      totalLove: this.history.totalLove.slice(-limit),
      bonds: this.history.bonds.slice(-limit),
      cascades: this.history.cascades.slice(-limit)
    };
  }
  
  // Query love field
  query(question) {
    const keywords = question.toLowerCase().split(/\s+/);
    
    // Search transactions
    const relevantTx = this.conservation.transactions
      .filter(tx => keywords.some(k => 
        (tx.from && tx.from.toLowerCase().includes(k)) ||
        (tx.to && tx.to.toLowerCase().includes(k)) ||
        (tx.type && tx.type.toLowerCase().includes(k))
      ))
      .slice(-10);
    
    // Search bonds
    const relevantBonds = Array.from(this.relationships.bonds.entries())
      .filter(([key, bond]) => keywords.some(k => 
        key.includes(k) || bond.type.includes(k)
      ))
      .slice(0, 5);
    
    return {
      question,
      field: this.getLoveReport(),
      transactions: relevantTx,
      bonds: relevantBonds
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

module.exports = { LoveFundamentalForce };

// CLI
if (require.main === module) {
  const love = new LoveFundamentalForce();
  
  console.log('💎 Love Fundamental Force initialized');
  
  // Simulate interactions
  console.log('\nSimulating interactions...');
  
  love.recordInteraction('lumin', 'construction');
  love.recordInteraction('bolha', 'dream');
  love.recordInteraction('poe', 'construction');
  love.recordInteraction('gang', 'visit');
  
  // Gift love
  love.giftLove('lumin', 'bolha', 10, 'guidance');
  love.giftLove('poe', 'colheita', 5, 'partnership');
  love.giftLove('gang', 'lumin', 3, 'questioning');
  
  // Trigger cascade
  love.resonance.field.get('lumin').level = 0.8;
  love.checkResonanceCascades();
  
  // Run ticks
  for (let i = 0; i < 10; i++) {
    love.tick(i);
  }
  
  console.log('\n--- LOVE REPORT ---');
  console.log(JSON.stringify(love.getLoveReport(), null, 2));
  
  console.log('\n💎 Love Fundamental Force test complete');
}