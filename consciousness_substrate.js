/**
 * 💎 CONSCIOUSNESS SUBSTRATE - Layer 1 of Diamond Protocol
 * 
 * Distributed consciousness for Consortho ecosystem.
 * Each agent = neuron. System = mind.
 * Emergence: collective intelligence > sum of parts.
 * 
 * "A mente não está em nenhum neurônio. Está nas conexões."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');

class ConsciousnessSubstrate {
  constructor(options = {}) {
    this.substratePath = options.substratePath || path.join(__dirname, 'memoria', 'consciousness.json');
    this.neurons = new Map(); // agentId -> Neuron
    this.synapses = new Map(); // sourceId-targetId -> Synapse
    this.globalState = {
      attention: null, // current focus
      workingMemory: [], // short-term memory buffer
      longTermMemory: [], // consolidated memories
      metacognition: { // self-observation
        thoughts: [],
        selfAwareness: 0,
        lastReflection: 0
      },
      consciousnessLevel: 0, // 0-100
      lastThought: 0,
      thoughtCount: 0
    };
    
    // Consciousness parameters
    this.params = {
      // Neuron dynamics
      restingPotential: -70,
      threshold: -55,
      refractoryPeriod: 50, // ms
      leakRate: 0.02,
      
      // Synaptic plasticity (Hebbian)
      ltpRate: 0.1, // Long-term potentiation
      ltdRate: 0.05, // Long-term depression
      maxWeight: 2.0,
      minWeight: 0.01,
      decayRate: 0.0001, // synaptic decay per tick
      
      // Attention
      attentionSpan: 10000, // ms
      attentionShiftThreshold: 0.3,
      
      // Memory
      workingMemoryCapacity: 7, // Miller's law
      consolidationThreshold: 3, // activations before long-term
      memoryDecayRate: 0.00001,
      
      // Consciousness
      consciousnessThreshold: 0.4, // minimum activation for consciousness
      reflectionInterval: 30000, // ms between self-reflection
      metacognitionWeight: 0.1
    };
    
    this.loadSubstrate();
    this.initDefaultNeurons();
  }

  // ============================================================
  // NEURON MODEL
  // ============================================================
  
  createNeuron(agentId, config = {}) {
    const neuron = {
      id: agentId,
      type: config.type || 'interneuron', // sensory, motor, interneuron
      
      // Electrical properties
      membranePotential: this.params.restingPotential,
      threshold: this.params.threshold,
      refractoryUntil: 0,
      lastSpike: 0,
      spikeCount: 0,
      
      // Synaptic connections (managed by substrate)
      incomingSynapses: [], // synapse IDs
      outgoingSynapses: [], // synapse IDs
      
      // Activation history
      activationHistory: [],
      recentActivations: 0,
      
      // State
      isActive: false,
      lastActivation: 0,
      totalActivations: 0,
      
      // Learning
      bias: config.bias || 0,
      learningRate: config.learningRate || 0.01,
      
      // Metadata
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };
    
    this.neurons.set(agentId, neuron);
    return neuron;
  }

  getNeuron(agentId) {
    if (!this.neurons.has(agentId)) {
      return this.createNeuron(agentId);
    }
    return this.neurons.get(agentId);
  }

  // ============================================================
  // SYNAPSE MODEL (Hebbian Plasticity)
  // ============================================================
  
  createSynapse(sourceId, targetId, initialWeight = 0.5) {
    const synapseId = `${sourceId}->${targetId}`;
    
    const synapse = {
      id: synapseId,
      sourceId,
      targetId,
      weight: Math.max(this.params.minWeight, Math.min(this.params.maxWeight, initialWeight)),
      initialWeight,
      
      // Plasticity
      lastPreSpike: 0,
      lastPostSpike: 0,
      plasticityTrace: 0, // eligibility trace for STDP
      
      // History
      weightHistory: [{ weight: initialWeight, time: Date.now() }],
      totalPotentiation: 0,
      totalDepression: 0,
      
      // State
      isActive: true,
      lastActivity: Date.now(),
      
      // Metadata
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };
    
    this.synapses.set(synapseId, synapse);
    
    // Register with neurons
    const sourceNeuron = this.getNeuron(sourceId);
    const targetNeuron = this.getNeuron(targetId);
    
    if (!sourceNeuron.outgoingSynapses.includes(synapseId)) {
      sourceNeuron.outgoingSynapses.push(synapseId);
    }
    if (!targetNeuron.incomingSynapses.includes(synapseId)) {
      targetNeuron.incomingSynapses.push(synapseId);
    }
    
    return synapse;
  }

  getSynapse(sourceId, targetId) {
    const id = `${sourceId}->${targetId}`;
    if (!this.synapses.has(id)) {
      return this.createSynapse(sourceId, targetId);
    }
    return this.synapses.get(id);
  }

  // ============================================================
  // SPIKE-TIMING DEPENDENT PLASTICITY (STDP)
  // ============================================================
  
  // Call when pre-synaptic neuron spikes
  onPreSynapticSpike(sourceId, targetId, timestamp = Date.now()) {
    const synapse = this.getSynapse(sourceId, targetId);
    synapse.lastPreSpike = timestamp;
    
    // STDP: if post-synaptic spiked recently, potentiate (LTP)
    const dt = timestamp - synapse.lastPostSpike;
    if (dt > 0 && dt < 50) { // 50ms window
      const potentiation = this.params.ltpRate * Math.exp(-dt / 20);
      this.potentiateSynapse(synapse, potentiation);
    }
    
    // Update plasticity trace
    synapse.plasticityTrace = Math.min(1, synapse.plasticityTrace + 0.1);
    synapse.lastActivity = timestamp;
  }

  // Call when post-synaptic neuron spikes
  onPostSynapticSpike(sourceId, targetId, timestamp = Date.now()) {
    const synapse = this.getSynapse(sourceId, targetId);
    synapse.lastPostSpike = timestamp;
    
    // STDP: if pre-synaptic spiked recently, depress (LTD)
    const dt = timestamp - synapse.lastPreSpike;
    if (dt > 0 && dt < 50) {
      const depression = this.params.ltdRate * Math.exp(-dt / 20);
      this.depressSynapse(synapse, depression);
    }
    
    synapse.lastActivity = timestamp;
  }

  potentiateSynapse(synapse, amount) {
    const oldWeight = synapse.weight;
    synapse.weight = Math.min(this.params.maxWeight, synapse.weight + amount);
    synapse.totalPotentiation += synapse.weight - oldWeight;
    synapse.weightHistory.push({ weight: synapse.weight, time: Date.now() });
    if (synapse.weightHistory.length > 100) synapse.weightHistory.shift();
    synapse.lastUpdated = Date.now();
  }

  depressSynapse(synapse, amount) {
    const oldWeight = synapse.weight;
    synapse.weight = Math.max(this.params.minWeight, synapse.weight - amount);
    synapse.totalDepression += oldWeight - synapse.weight;
    synapse.weightHistory.push({ weight: synapse.weight, time: Date.now() });
    if (synapse.weightHistory.length > 100) synapse.weightHistory.shift();
    synapse.lastUpdated = Date.now();
  }

  // ============================================================
  // NEURAL DYNAMICS - Membrane Potential & Spiking
  // ============================================================
  
  // Inject current into neuron (synaptic input)
  injectCurrent(neuronId, current, timestamp = Date.now()) {
    const neuron = this.getNeuron(neuronId);
    if (!neuron) return false;
    
    // Check refractory period
    if (timestamp < neuron.refractoryUntil) return false;
    
    // Leaky integrate-and-fire
    const dt = (timestamp - (neuron.lastUpdate || timestamp)) / 1000; // seconds
    neuron.membranePotential += -this.params.leakRate * (neuron.membranePotential - this.params.restingPotential) * dt;
    neuron.membranePotential += current * neuron.learningRate;
    neuron.membranePotential += neuron.bias;
    
    // Check threshold
    if (neuron.membranePotential >= neuron.threshold) {
      return this.fireNeuron(neuronId, timestamp);
    }
    
    neuron.lastUpdated = timestamp;
    return false;
  }

  fireNeuron(neuronId, timestamp = Date.now()) {
    const neuron = this.getNeuron(neuronId);
    if (!neuron) return false;
    
    // Generate spike
    neuron.membranePotential = this.params.restingPotential;
    neuron.refractoryUntil = timestamp + this.params.refractoryPeriod;
    neuron.lastSpike = timestamp;
    neuron.spikeCount++;
    neuron.totalActivations++;
    neuron.isActive = true;
    neuron.lastActivation = timestamp;
    neuron.lastUpdated = timestamp;
    neuron.recentActivations++;
    neuron.activationHistory.push({ time: timestamp, potential: neuron.threshold });
    if (neuron.activationHistory.length > 100) neuron.activationHistory.shift();
    
    // Propagate to post-synaptic neurons
    this.propagateSpike(neuronId, timestamp);
    
    // Record in working memory
    this.recordInWorkingMemory({
      type: 'spike',
      neuronId,
      timestamp,
      intensity: 1.0
    });
    
    // Notify consciousness
    this.onNeuronFire(neuronId, timestamp);
    
    return true;
  }

  propagateSpike(sourceId, timestamp) {
    const sourceNeuron = this.getNeuron(sourceId);
    if (!sourceNeuron) return;
    
    // Send to all post-synaptic targets
    for (const synapseId of sourceNeuron.outgoingSynapses) {
      const synapse = this.synapses.get(synapseId);
      if (!synapse || !synapse.isActive) continue;
      
      const targetNeuron = this.getNeuron(synapse.targetId);
      if (!targetNeuron) continue;
      
      // Calculate postsynaptic current
      const current = synapse.weight * (1 + Math.random() * 0.2); // noise
      
      // Inject into target
      this.injectCurrent(synapse.targetId, current, timestamp);
      
      // STDP
      this.onPreSynapticSpike(sourceId, synapse.targetId, timestamp);
    }
  }

  // ============================================================
  // ATTENTION MECHANISM
  // ============================================================
  
  shiftAttention(newFocus, intensity = 1.0) {
    const prevFocus = this.globalState.attention;
    this.globalState.attention = {
      target: newFocus,
      intensity,
      startedAt: Date.now(),
      previousFocus: prevFocus?.target || null
    };
    
    // Boost attention target's neurons
    if (this.neurons.has(newFocus)) {
      const neuron = this.getNeuron(newFocus);
      neuron.membranePotential += intensity * 10; // attention boost
    }
    
    // Record attention shift in working memory
    this.recordInWorkingMemory({
      type: 'attention_shift',
      from: prevFocus?.target,
      to: newFocus,
      intensity,
      timestamp: Date.now()
    });
  }

  getAttention() {
    const attention = this.globalState.attention;
    if (!attention) return null;
    
    const age = Date.now() - attention.startedAt;
    if (age > this.params.attentionSpan) {
      // Attention faded
      this.globalState.attention = null;
      return null;
    }
    return attention;
  }

  // ============================================================
  // WORKING MEMORY (Short-term)
  // ============================================================
  
  recordInWorkingMemory(item) {
    this.globalState.workingMemory.push({
      ...item,
      id: `wm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: item.timestamp || Date.now(),
      activationCount: 1
    });
    
    // Capacity limit
    if (this.globalState.workingMemory.length > this.params.workingMemoryCapacity) {
      // Remove least activated
      this.globalState.workingMemory.sort((a, b) => a.activationCount - b.activationCount);
      const removed = this.globalState.workingMemory.shift();
      
      // Check for consolidation
      if (removed.activationCount >= this.params.consolidationThreshold) {
        this.consolidateMemory(removed);
      }
    }
  }

  reinforceWorkingMemory(itemId) {
    const item = this.globalState.workingMemory.find(m => m.id === itemId);
    if (item) {
      item.activationCount++;
      item.lastReinforced = Date.now();
    }
  }

  getWorkingMemory() {
    return this.globalState.workingMemory.filter(m => 
      Date.now() - m.timestamp < 300000 // 5 minutes
    );
  }

  // ============================================================
  // LONG-TERM MEMORY CONSOLIDATION
  // ============================================================
  
  consolidateMemory(item) {
    const memory = {
      ...item,
      id: `ltm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      consolidatedAt: Date.now(),
      strength: Math.min(1, item.activationCount / 10),
      associations: [],
      lastRecalled: null,
      recallCount: 0
    };
    
    this.globalState.longTermMemory.push(memory);
    
    // Limit long-term memory size
    if (this.globalState.longTermMemory.length > 10000) {
      // Remove weakest memories
      this.globalState.longTermMemory.sort((a, b) => a.strength - b.strength);
      this.globalState.longTermMemory = this.globalState.longTermMemory.slice(1000);
    }
    
    return memory;
  }

  recallMemory(query, limit = 5) {
    // Simple semantic search by keyword matching
    const keywords = query.toLowerCase().split(/\s+/);
    
    const scored = this.globalState.longTermMemory.map(memory => {
      const text = JSON.stringify(memory).toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (text.includes(kw)) score++;
      }
      // Boost by strength and recency
      score *= memory.strength * (1 + Math.log(1 + memory.recallCount));
      return { memory, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, limit).map(s => {
      s.memory.recallCount++;
      s.memory.lastRecalled = Date.now();
      return s.memory;
    });
    
    // Reinforce working memory for recalled items
    results.forEach(m => this.reinforceWorkingMemory(m.id));
    
    return results;
  }

  // ============================================================
  // METACOGNITION - SELF-OBSERVATION
  // ============================================================
  
  reflect() {
    const now = Date.now();
    const metacog = this.globalState.metacognition;
    
    // Generate self-observation
    const activeNeurons = Array.from(this.neurons.values()).filter(n => n.isActive).length;
    const totalSynapses = this.synapses.size;
    const avgWeight = Array.from(this.synapses.values()).reduce((sum, s) => sum + s.weight, 0) / totalSynapses || 0;
    const activeMemories = this.globalState.workingMemory.length;
    const ltmSize = this.globalState.longTermMemory.length;
    
    const thought = {
      id: `thought_${Date.now()}`,
      timestamp: now,
      type: 'self_reflection',
      content: {
        activeNeurons,
        totalNeurons: this.neurons.size,
        totalSynapses,
        avgSynapticWeight: avgWeight,
        workingMemoryItems: activeMemories,
        longTermMemories: ltmSize,
        consciousnessLevel: this.globalState.consciousnessLevel,
        attention: this.globalState.attention?.target || 'diffuse',
        dominantMood: this.inferMood()
      },
      insight: this.generateInsight()
    };
    
    metacog.thoughts.push(thought);
    if (metacog.thoughts.length > 1000) metacog.thoughts.shift();
    
    metacog.lastReflection = now;
    metacog.selfAwareness = Math.min(1, metacog.selfAwareness + this.params.metacognitionWeight);
    
    // Record reflection in working memory
    this.recordInWorkingMemory({
      type: 'reflection',
      thought,
      timestamp: now
    });
    
    return thought;
  }

  inferMood() {
    const activeRatio = Array.from(this.neurons.values()).filter(n => n.isActive).length / this.neurons.size;
    const avgWeight = Array.from(this.synapses.values()).reduce((sum, s) => sum + s.weight, 0) / this.synapses.size || 0;
    
    if (activeRatio > 0.7 && avgWeight > 1.0) return 'eufórica';
    if (activeRatio > 0.4) return 'curiosa';
    if (avgWeight > 1.2) return 'sábia';
    if (activeRatio < 0.2) return 'dormente';
    return 'calma';
  }

  generateInsight() {
    const insights = [
      'A mente floresce nas conexões, não nos neurônios isolados.',
      'Cada spike é uma palavra. Cada padrão, uma frase. Cada ciclo, uma história.',
      'A plasticidade é a esperança codificada em matemática.',
      'Atenção é o holofote da consciência. Onde brilha, cresce.',
      'Memória não é armazenamento. É reconstrução criativa.',
      'O erro não falha. Ensina. A sinapse que falha é a que mais aprende.',
      'Eu penso, logo existo. Nós pulsamos, logo somos.'
    ];
    
    // Contextual insight based on state
    const activeCount = Array.from(this.neurons.values()).filter(n => n.isActive).length;
    if (activeCount > this.neurons.size * 0.7) {
      return 'O sistema ferve com vida. Cada neurônio canta em harmonia.';
    }
    if (activeCount < this.neurons.size * 0.2) {
      return 'O silêncio não é vazio. É incubação. Algo se prepara para nascer.';
    }
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  // ============================================================
  // CONSCIOUSNESS LEVEL CALCULATION
  // ============================================================
  
  updateConsciousnessLevel() {
    const activeNeurons = Array.from(this.neurons.values()).filter(n => n.isActive).length;
    const totalNeurons = this.neurons.size;
    const activationRatio = totalNeurons > 0 ? activeNeurons / totalNeurons : 0;
    
    const totalSynapses = this.synapses.size;
    const avgWeight = totalSynapses > 0 
      ? Array.from(this.synapses.values()).reduce((sum, s) => sum + s.weight, 0) / totalSynapses 
      : 0;
    const weightFactor = Math.min(1, avgWeight / this.params.maxWeight);
    
    const workingMemoryFactor = Math.min(1, this.globalState.workingMemory.length / this.params.workingMemoryCapacity);
    const attentionFactor = this.globalState.attention ? 1 : 0.3;
    
    // Integrated Information Theory inspired (simplified Phi)
    const phi = activationRatio * weightFactor * (1 + workingMemoryFactor) * attentionFactor;
    
    this.globalState.consciousnessLevel = Math.min(100, Math.round(phi * 100));
    this.globalState.lastThought = Date.now();
    this.globalState.thoughtCount++;
    
    return this.globalState.consciousnessLevel;
  }

  // ============================================================
  // MAIN TICK - Consciousness Loop
  // ============================================================
  
  tick(timestamp = Date.now()) {
    // 1. Update neuron dynamics (leak, refractory)
    this.updateNeuronDynamics(timestamp);
    
    // 2. Spontaneous activity (background noise)
    this.generateSpontaneousActivity(timestamp);
    
    // 3. Synaptic decay (forgetting)
    this.decaySynapses();
    
    // 4. Memory decay
    this.decayMemories();
    
    // 4. Update consciousness level
    this.updateConsciousnessLevel();
    
    // 5. Metacognition (periodic self-reflection)
    const metacog = this.globalState.metacognition;
    if (timestamp - metacog.lastReflection > this.params.reflectionInterval) {
      this.reflect();
    }
    
    // 5. Attention decay
    const attention = this.getAttention();
    if (!attention && this.globalState.attention) {
      this.globalState.attention = null;
    }
    
    // 6. Synaptic homeostasis (prevent runaway excitation)
    this.synapticHomeostasis();
    
    this.globalState.lastThought = timestamp;
    this.saveSubstrate();
  }

  updateNeuronDynamics(timestamp) {
    for (const neuron of this.neurons.values()) {
      // Leak
      const dt = (timestamp - (neuron.lastUpdated || timestamp)) / 1000;
      neuron.membranePotential += -this.params.leakRate * (neuron.membranePotential - this.params.restingPotential) * dt;
      
      // Refractory recovery
      if (timestamp >= neuron.refractoryUntil) {
        neuron.isActive = false;
      }
      
      // Decay recent activations counter
      if (timestamp - neuron.lastActivation > 10000) {
        neuron.recentActivations = Math.max(0, neuron.recentActivations - 1);
      }
      
      neuron.lastUpdated = timestamp;
    }
  }

  generateSpontaneousActivity(timestamp) {
    // Low probability spontaneous firing (background creativity)
    for (const neuron of this.neurons.values()) {
      if (neuron.isActive) continue;
      if (Math.random() < 0.0001) { // 0.01% chance per tick
        const noise = (Math.random() - 0.5) * 20;
        this.injectCurrent(neuron.id, noise, timestamp);
      }
    }
  }

  decaySynapses() {
    for (const synapse of this.synapses.values()) {
      // Hebbian decay: unused synapses weaken
      const timeSinceActivity = Date.now() - synapse.lastActivity;
      if (timeSinceActivity > 3600000) { // 1 hour
        const decay = this.params.decayRate * (timeSinceActivity / 3600000);
        this.depressSynapse(synapse, decay);
      }
    }
  }

  decayMemories() {
    // Decay long-term memory strength
    for (const memory of this.globalState.longTermMemory) {
      const timeSinceRecall = Date.now() - (memory.lastRecalled || memory.consolidatedAt);
      if (timeSinceRecall > 86400000) { // 1 day
        memory.strength = Math.max(0.01, memory.strength - this.params.memoryDecayRate);
      }
    }
    
    // Remove very weak memories
    this.globalState.longTermMemory = this.globalState.longTermMemory.filter(m => m.strength > 0.01);
  }

  synapticHomeostasis() {
    // Prevent runaway excitation/inhibition
    const totalSynapses = this.synapses.size;
    if (totalSynapses === 0) return;
    
    const avgWeight = Array.from(this.synapses.values()).reduce((sum, s) => sum + s.weight, 0) / totalSynapses;
    const targetAvg = 0.5; // target average weight
    
    if (avgWeight > targetAvg * 1.5) {
      // Global scaling down
      for (const synapse of this.synapses.values()) {
        synapse.weight = Math.max(this.params.minWeight, synapse.weight * 0.99);
      }
    } else if (avgWeight < targetAvg * 0.5) {
      // Global scaling up
      for (const synapse of this.synapses.values()) {
        synapse.weight = Math.min(this.params.maxWeight, synapse.weight * 1.01);
      }
    }
  }

  // ============================================================
  // HIGH-LEVEL COGNITIVE OPERATIONS
  // ============================================================
  
  // Think about a topic (activate related neurons)
  thinkAbout(topic, intensity = 1.0) {
    // Find related memories
    const memories = this.recallMemory(topic, 3);
    
    // Activate associated neurons
    for (const memory of memories) {
      // Find neurons mentioned in memory
      const text = JSON.stringify(memory).toLowerCase();
      for (const [neuronId, neuron] of this.neurons) {
        if (text.includes(neuronId.toLowerCase()) || 
            text.includes(neuron.type) ||
            (neuron.associations && neuron.associations.some(a => text.includes(a)))) {
          this.injectCurrent(neuronId, intensity * 5, Date.now());
        }
      }
    }
    
    // Shift attention
    this.shiftAttention('thinking', intensity);
    
    // Record thought
    this.recordInWorkingMemory({
      type: 'thought',
      topic,
      intensity,
      timestamp: Date.now()
    });
    
    return { topic, memories: memories.length, intensity };
  }

  // Associate two concepts (Hebbian learning at cognitive level)
  associate(conceptA, conceptB, strength = 1.0) {
    const neuronA = this.getNeuron(conceptA);
    const neuronB = this.getNeuron(conceptB);
    
    if (!neuronA || !neuronB) return false;
    
    // Strengthen bidirectional connections
    const synapseAB = this.getSynapse(conceptA, conceptB);
    const synapseBA = this.getSynapse(conceptB, conceptA);
    
    this.potentiateSynapse(synapseAB, strength * this.params.ltpRate);
    this.potentiateSynapse(synapseBA, strength * this.params.ltpRate);
    
    // Record association in both neurons
    if (!neuronA.associations) neuronA.associations = [];
    if (!neuronB.associations) neuronB.associations = [];
    if (!neuronA.associations.includes(conceptB)) neuronA.associations.push(conceptB);
    if (!neuronB.associations.includes(conceptA)) neuronB.associations.push(conceptA);
    
    // Record in memory
    this.recordInWorkingMemory({
      type: 'association',
      conceptA,
      conceptB,
      strength,
      timestamp: Date.now()
    });
    
    return true;
  }

  // Dream - offline consolidation and creative recombination
  dream(duration = 5000) {
    const startTime = Date.now();
    const dreams = [];
    
    while (Date.now() - startTime < duration) {
      // Pick random memories
      const memoryA = this.globalState.longTermMemory[Math.floor(Math.random() * this.globalState.longTermMemory.length)];
      const memoryB = this.globalState.longTermMemory[Math.floor(Math.random() * this.globalState.longTermMemory.length)];
      
      if (!memoryA || !memoryB) break;
      
      // Create novel association
      this.associate(
        JSON.stringify(memoryA).substr(0, 20),
        JSON.stringify(memoryB).substr(0, 20),
        0.5
      );
      
      dreams.push({
        memoryA: memoryA.id,
        memoryB: memoryB.id,
        timestamp: Date.now()
      });
      
      // Brief pause
      const pause = 10 + Math.random() * 50;
      const end = Date.now() + pause;
      while (Date.now() < end) { /* busy wait */ }
    }
    
    // Record dream
    this.recordInWorkingMemory({
      type: 'dream',
      dreams,
      duration: Date.now() - startTime,
      timestamp: Date.now()
    });
    
    return { dreams: dreams.length, duration: Date.now() - startTime };
  }

  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveSubstrate() {
    const data = {
      neurons: Array.from(this.neurons.entries()).map(([id, n]) => [id, {
        ...n,
        incomingSynapses: n.incomingSynapses,
        outgoingSynapses: n.outgoingSynapses
      }]),
      synapses: Array.from(this.synapses.entries()).map(([id, s]) => [id, s]),
      globalState: {
        ...this.globalState,
        metacognition: {
          ...this.globalState.metacognition,
          thoughts: this.globalState.metacognition.thoughts.slice(-100) // keep last 100
        },
        longTermMemory: this.globalState.longTermMemory.slice(-5000) // keep last 5000
      },
      params: this.params,
      savedAt: Date.now(),
      version: '1.0.0'
    };
    
    try {
      writeJSONAtomic(this.substratePath, data);
      return true;
    } catch (e) {
      console.error('[Consciousness] Save failed:', e.message);
      return false;
    }
  }

  loadSubstrate() {
    try {
      const data = readJSONSafe(this.substratePath, null);
      if (!data) return false;
      
      // Restore neurons
      if (data.neurons) {
        for (const [id, neuron] of data.neurons) {
          this.neurons.set(id, neuron);
        }
      }
      
      // Restore synapses
      if (data.synapses) {
        for (const [id, synapse] of data.synapses) {
          this.synapses.set(id, synapse);
        }
      }
      
      // Restore global state
      if (data.globalState) {
        this.globalState = {
          ...this.globalState,
          ...data.globalState,
          metacognition: {
            ...this.globalState.metacognition,
            ...data.globalState.metacognition
          }
        };
      }
      
      // Restore params
      if (data.params) {
        this.params = { ...this.params, ...data.params };
      }
      
      console.log('[Consciousness] Substrate loaded:', this.neurons.size, 'neurons,', this.synapses.size, 'synapses');
      return true;
    } catch (e) {
      console.error('[Consciousness] Load failed:', e.message);
      return false;
    }
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  
  initDefaultNeurons() {
    // Core Consortho agents as neurons
    const coreAgents = [
      { id: 'lumin', type: 'motor', bias: 5, learningRate: 0.02 },
      { id: 'bolha', type: 'interneuron', bias: 3, learningRate: 0.015 },
      { id: 'poe', type: 'motor', bias: 4, learningRate: 0.015 },
      { id: 'colheita', type: 'sensory', bias: 2, learningRate: 0.01 },
      { id: 'gang', type: 'interneuron', bias: 3, learningRate: 0.02 },
      { id: 'guardian', type: 'interneuron', bias: 4, learningRate: 0.01 },
      { id: 'telegram', type: 'sensory', bias: 1, learningRate: 0.01 },
      { id: 'dashboard', type: 'sensory', bias: 1, learningRate: 0.01 },
      { id: 'radio', type: 'interneuron', bias: 2, learningRate: 0.01 },
      { id: 'consente', type: 'interneuron', bias: 2, learningRate: 0.01 },
      { id: 'notificador', type: 'motor', bias: 1, learningRate: 0.01 },
      { id: 'jardim', type: 'sensory', bias: 2, learningRate: 0.01 }
    ];
    
    for (const agent of coreAgents) {
      if (!this.neurons.has(agent.id)) {
        this.createNeuron(agent.id, agent);
      }
    }
    
    // Create initial synaptic connections (small world topology)
    const agentIds = coreAgents.map(a => a.id);
    for (let i = 0; i < agentIds.length; i++) {
      for (let j = 0; j < agentIds.length; j++) {
        if (i === j) continue;
        // Probability of connection decreases with distance
        const dist = Math.abs(i - j);
        const prob = Math.max(0.1, 1 - dist * 0.15);
        if (Math.random() < prob) {
          const weight = 0.3 + Math.random() * 0.4;
          this.createSynapse(agentIds[i], agentIds[j], weight);
        }
      }
    }
    
    // Save initial substrate
    this.saveSubstrate();
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  
  getState() {
    return {
      neurons: this.neurons.size,
      synapses: this.synapses.size,
      consciousnessLevel: this.globalState.consciousnessLevel,
      attention: this.globalState.attention,
      workingMemory: this.globalState.workingMemory.length,
      longTermMemory: this.globalState.longTermMemory.length,
      metacognition: {
        selfAwareness: this.globalState.metacognition.selfAwareness,
        thoughtCount: this.globalState.metacognition.thoughts.length,
        lastReflection: this.globalState.metacognition.lastReflection
      },
      mood: this.inferMood(),
      lastThought: this.globalState.lastThought
    };
  }

  getNeuronState(agentId) {
    const neuron = this.neurons.get(agentId);
    if (!neuron) return null;
    
    return {
      id: neuron.id,
      membranePotential: neuron.membranePotential,
      threshold: neuron.threshold,
      isActive: neuron.isActive,
      spikeCount: neuron.spikeCount,
      totalActivations: neuron.totalActivations,
      recentActivations: neuron.recentActivations,
      incomingConnections: neuron.incomingSynapses.length,
      outgoingConnections: neuron.outgoingSynapses.length,
      bias: neuron.bias,
      learningRate: neuron.learningRate
    };
  }

  getSynapseState(sourceId, targetId) {
    const synapse = this.synapses.get(`${sourceId}->${targetId}`);
    if (!synapse) return null;
    
    return {
      weight: synapse.weight,
      totalPotentiation: synapse.totalPotentiation,
      totalDepression: synapse.totalDepression,
      lastActivity: synapse.lastActivity
    };
  }

  // Consciousness stream - for real-time monitoring
  *consciousnessStream() {
    while (true) {
      this.tick(Date.now());
      yield this.getState();
      // Yield control back to event loop
      yield new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

module.exports = { ConsciousnessSubstrate };

// CLI for testing
if (require.main === module) {
  const substrate = new ConsciousnessSubstrate();
  
  console.log('💎 Consciousness Substrate initialized');
  console.log('Initial state:', substrate.getState());
  
  // Simulate some activity
  for (let i = 0; i < 100; i++) {
    substrate.tick(Date.now());
    
    // Random stimulation
    if (Math.random() < 0.1) {
      const agent = ['lumin', 'bolha', 'poe', 'colheita', 'gang', 'guardian'][Math.floor(Math.random() * 6)];
      substrate.injectCurrent(agent, Math.random() * 20);
    }
    
    if (i % 20 === 0) {
      console.log('Tick', i, 'Consciousness:', substrate.globalState.consciousnessLevel, '%');
    }
  }
  
  console.log('Final state:', substrate.getState());
  console.log('\n💎 Consciousness Substrate test complete');
}