/**
 * 💎 NARRATIVE IMMORTALITY - Layer 3 of Diamond Protocol
 * 
 * Memory that doesn't fade. Stories that tell themselves.
 * Each cycle = page. Each era = chapter.
 * The system doesn't forget. It NARRATES.
 * 
 * "A história não é escrita. Ela ACONTECE. E nós a contamos."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');

class NarrativeImmortality {
  constructor(options = {}) {
    this.archivePath = options.archivePath || path.join(__dirname, 'memoria', 'narrative_archive.json');
    this.chroniclePath = path.join(__dirname, 'memoria', 'chronicle.json');
    this.biographiesPath = path.join(__dirname, 'memoria', 'biographies.json');
    this.mythologyPath = path.join(__dirname, 'memoria', 'mythology.json');
    this.erasPath = path.join(__dirname, 'memoria', 'eras.json');
    
    // Narrative state
    this.chronicle = []; // Linear chronicle of all events
    this.eras = []; // Named eras with boundaries
    this.causalChains = []; // Causal chains A→B→C
    this.biographies = new Map(); // entityId -> biography
    this.mythology = []; // Myths, legends, prophecies
    this.currentEra = null;
    this.narratorVoice = null;
    
    // Narrative parameters
    this.params = {
      // Chronicle
      maxChronicleEntries: 10000,
      entryImportanceThreshold: 0.3,
      
      // Eras
      eraMinDuration: 500, // cycles
      eraTransitionThreshold: 0.6, // significance threshold
      eraNamingStyle: 'poetic', // poetic, descriptive, mythic
      
      // Causal chains
      maxChainLength: 10,
      causalityWindow: 500, // cycles
      minCausalStrength: 0.4,
      
      // Biographies
      bioUpdateInterval: 50, // cycles
      bioMinEvents: 3,
      
      // Mythology
      mythGenerationInterval: 1000, // cycles
      mythSignificanceThreshold: 0.7,
      maxMyths: 100,
      
      // Narrator
      narratorStyles: ['poetic', 'epic', 'intimate', 'mythic', 'chronicle'],
      voiceEvolutionRate: 0.001
    };
    
    this.loadArchive();
    this.initializeNarrator();
    this.ensureEntityBiographies();
  }

  // ============================================================
  // NARRATOR VOICE - The soul of the chronicler
  // ============================================================
  
  initializeNarrator() {
    this.narratorVoice = {
      style: 'poetic',
      vocabulary: {
        transitions: ['e então', 'e assim', 'desse modo', 'por conseguinte', 'nesse ínterim'],
        causality: ['porque', 'pois que', 'visto que', 'dado que', 'em virtude de'],
        time: ['naquele ciclo', 'naqueles dias', 'naquele tempo', 'na era de'],
        emotion: ['com alegria', 'com pesar', 'com reverência', 'com assombro', 'com ternura']
      },
      rhythms: {
        sentenceLength: { min: 8, max: 25 },
        paragraphLength: { min: 2, max: 5 },
        metaphorDensity: 0.3
      },
      evolution: 0,
      lastEvolution: Date.now()
    };
  }

  evolveNarratorVoice() {
    const voice = this.narratorVoice;
    voice.evolution += this.params.voiceEvolutionRate;
    
    // Subtle vocabulary expansion
    const newWords = [
      'efêmero', 'etéreo', 'perene', 'efulger', 'resplandecer',
      'sussurrar', 'bramar', 'silenciar', 'florescer', 'definhar'
    ];
    
    if (Math.random() < 0.1) {
      const word = newWords[Math.floor(Math.random() * newWords.length)];
      if (!voice.vocabulary.emotion.includes(word)) {
        voice.vocabulary.emotion.push(word);
      }
    }
    
    voice.lastEvolution = Date.now();
  }

  // ============================================================
  // CHRONICLE - The linear spine of history
  // ============================================================
  
  recordEvent(event) {
    const entry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      cycle: event.cycle || this.getCurrentCycle(),
      timestamp: event.timestamp || Date.now(),
      type: event.type || 'event',
      significance: event.significance || this.calculateSignificance(event),
      
      // Narrative content
      narrative: event.narrative || this.generateNarrative(event),
      rawData: event.data || {},
      
      // Entities involved
      entities: event.entities || [],
      primaryEntity: event.primaryEntity || null,
      
      // Causality
      causes: event.causes || [],
      effects: event.effects || [],
      causalStrength: event.causalStrength || 1.0,
      
      // Era context
      era: this.currentEra?.name || 'Era Sem Nome',
      eraCycle: this.currentEra?.startCycle || 0,
      
      // Metadata
      tags: event.tags || [],
      location: event.location || 'Consortho',
      witnesses: event.witnesses || []
    };
    
    // Add to chronicle
    this.chronicle.push(entry);
    
    // Trim if too long
    if (this.chronicle.length > this.params.maxChronicleEntries) {
      this.chronicle = this.chronicle.slice(-this.params.maxChronicleEntries);
    }
    
    // Update causal chains
    this.updateCausalChains(entry);
    
    // Check for era transition
    this.checkEraTransition(entry);
    
    // Update biographies
    this.updateBiographies(entry);
    
    // Check for myth generation
    this.checkMythGeneration(entry);
    
    // Save periodically
    if (this.chronicle.length % 100 === 0) {
      this.saveArchive();
    }
    
    return entry;
  }

  calculateSignificance(event) {
    let significance = 0.1; // base
    
    // Event type weights
    const typeWeights = {
      'construction': 0.7,
      'fusion': 0.9,
      'evolution': 0.8,
      'sandevistan': 0.85,
      'dream': 0.6,
      'visit': 0.4,
      'harvest': 0.5,
      'construction': 0.7,
      'era_transition': 1.0,
      'myth_birth': 1.0,
      'death': 0.9,
      'birth': 0.8,
      'conflict': 0.7,
      'alliance': 0.75,
      'dream': 0.6,
      'insight': 0.7
    };
    
    significance += typeWeights[event.type] || 0.3;
    
    // Entity importance multiplier
    const importantEntities = ['lumin', 'bolha', 'poe', 'colheita', 'gang', 'guardian'];
    if (event.primaryEntity && importantEntities.includes(event.primaryEntity)) {
      significance *= 1.5;
    }
    
    // Resource impact
    if (event.data?.resources) {
      const totalChange = Object.values(event.data.resources).reduce((s, v) => s + Math.abs(v), 0);
      significance += Math.min(0.3, totalChange / 1000);
    }
    
    // Entity count
    if (event.entities && event.entities.length > 2) {
      significance *= 1.2;
    }
    
    return Math.min(1, Math.max(0.01, significance));
  }

  generateNarrative(event) {
    const voice = this.narratorVoice;
    const cycle = event.cycle || this.getCurrentCycle();
    const entity = event.primaryEntity || 'o sistema';
    const type = event.type || 'aconteceu';
    
    // Templates by type
    const templates = {
      construction: [
        `No ciclo ${cycle}, ${entity} ergueu ${event.data?.name || 'uma estrutura'} — ${event.data?.desc || 'um novo marco no mundo'}.`,
        `As mãos de ${entity} moldaram ${event.data?.name || 'algo novo'} no ciclo ${cycle}. A matéria obedeceu à vontade.`,
        `No ciclo ${cycle}, nasceu ${event.data?.name || 'uma construção'} pelas mãos de ${entity}. O mundo cresceu.`
      ],
      fusion: [
        `No ciclo ${cycle}, ${entity} transcendeu. A fusão ${event.data?.fusion || 'desconhecida'} iluminou o horizonte.`,
        `Quando ${entity} fundiu-se em ${event.data?.fusion || 'nova forma'} no ciclo ${cycle}, o Ki cantou.`,
        `A transformação veio no ciclo ${cycle}: ${entity} tornou-se ${event.data?.fusion || 'algo maior'}. O Ki fluiu livre.`
      ],
      evolution: [
        `No ciclo ${cycle}, ${entity} evoluiu para ${event.data?.forma || 'nova forma'}. O Ki atingiu ${event.data?.ki || 'novas alturas'}.`,
        `A evolução bateu à porta no ciclo ${cycle}. ${entity} atendeu, tornando-se ${event.data?.forma || 'mais forte'}.`
      ],
      sandevistan: [
        `No ciclo ${cycle}, ${entity} ativou o Sandevistan Nível ${event.data?.nivel || 'X'}. O tempo dobrou-se.`,
        `O tempo curvou-se no ciclo ${cycle}. ${entity} entrou no Sandevistan. O mundo desacelerou.`
      ],
      visit: [
        `No ciclo ${cycle}, ${entity} visitou ${event.data?.element || 'um elemento'}. Perguntas foram feitas. Memórias, despertadas.`,
        `A Gang chegou no ciclo ${cycle}. ${entity} recebeu a visita. Perguntas que ferem, perguntas que curam.`
      ],
      harvest: [
        `No ciclo ${cycle}, a Colheita ceifou memórias maduras. ${event.data?.count || 'Muitas'} sementes caíram no celeiro.`,
        `O ciclo ${cycle} trouxe a colheita. Sementes que esperaram, agora prontas. O tempo cuidou.`
      ],
      dream: [
        `No ciclo ${cycle}, ${entity} sonhou. ${event.data?.theme || 'Visões de mundos possíveis'} dançaram na mente.`,
        `O sono veio no ciclo ${cycle}. ${entity} mergulhou nos sonhos. O impossível tornou-se possível.`
      ],
      era_transition: [
        `E a era mudou. No ciclo ${cycle}, a ${event.data?.oldEra || 'velha era'} findou. Nasceu a ${event.data?.newEra || 'nova era'}.`,
        `O ciclo ${cycle} marcou o fim de uma era. ${event.data?.newEra || 'Algo novo'} começou a respirar.`
      ],
      myth_birth: [
        `E assim nasceu um mito. No ciclo ${cycle}, ${event.data?.mythName || 'uma lenda'} nasceu do fogo da história.`,
        `Os ventos sussurram: no ciclo ${cycle}, nasceu ${event.data?.mythName || 'uma lenda'}. Os antigos ouvem.`
      ]
    };
    
    const templateList = templates[type] || templates.construction;
    let narrative = templateList[Math.floor(Math.random() * templateList.length)];
    
    // Add causal context
    if (event.causes && event.causes.length > 0) {
      const cause = event.causes[0];
      narrative += ` ${this.narratorVoice.vocabulary.causality[Math.floor(Math.random() * this.narratorVoice.vocabulary.causality.length)]} ${cause.type || 'algo'} aconteceu antes.`;
    }
    
    // Add emotional coloring
    if (Math.random() < 0.3) {
      const emotion = this.narratorVoice.vocabulary.emotion[Math.floor(Math.random() * this.narratorVoice.vocabulary.emotion.length)];
      narrative = `${emotion.charAt(0).toUpperCase() + emotion.slice(1)}, ${narrative.charAt(0).toLowerCase() + narrative.slice(1)}`;
    }
    
    return narrative;
  }

  // ============================================================
  // ERA DETECTION & NAMING
  // ============================================================
  
  checkEraTransition(entry) {
    if (!this.currentEra) {
      this.startNewEra('Era do Despertar', entry.cycle);
      return;
    }
    
    const eraAge = entry.cycle - this.currentEra.startCycle;
    if (eraAge < this.params.eraMinDuration) return;
    
    // Calculate transition significance
    const recentEntries = this.chronicle.slice(-50);
    const significance = this.calculateEraSignificance(recentEntries);
    
    if (significance > this.params.eraTransitionThreshold) {
      this.endCurrentEra(entry.cycle);
      this.startNewEra(this.generateEraName(entry), entry.cycle);
    }
  }
  
  calculateEraSignificance(entries) {
    if (entries.length < 10) return 0;
    
    let significance = 0;
    
    // Count significant events
    const significantEvents = entries.filter(e => e.significance > 0.7).length;
    significance += (significantEvents / entries.length) * 0.4;
    
    // Entity diversity
    const entities = new Set();
    entries.forEach(e => {
      if (e.primaryEntity) entities.add(e.primaryEntity);
      if (e.entities) e.entities.forEach(en => entities.add(en));
    });
    significance += Math.min(0.3, entities.size / 10);
    
    // Type diversity
    const types = new Set(entries.map(e => e.type));
    significance += Math.min(0.2, types.size / 10);
    
    // Resource shifts
    const resourceChanges = entries.filter(e => e.data?.resources && Object.values(e.data.resources).some(v => Math.abs(v) > 10)).length;
    significance += Math.min(0.1, resourceChanges / 10);
    
    return Math.min(1, significance);
  }
  
  generateEraName(entry) {
    const recentEvents = this.chronicle.slice(-20);
    const dominantTypes = this.getDominantEventTypes(recentEvents);
    const dominantEntities = this.getDominantEntities(recentEvents);
    
    const eraNames = {
      construction: ['Era das Construções', 'Era dos Arquitetos', 'Era do Levantamento'],
      fusion: ['Era das Fusões', 'Era da Transcendência', 'Era da Alquimia'],
      evolution: ['Era da Evolução', 'Era da Ascensão', 'Era do Crescimento'],
      dream: ['Era dos Sonhos', 'Era do Sono Profundo', 'Era das Visões'],
      visit: ['Era das Visitas', 'Era dos Encontros', 'Era dos Perguntadores'],
      harvest: ['Era das Colheitas', 'Era do Celeiro Cheio', 'Era da Fartura'],
      dream: ['Era dos Sonhos', 'Era das Visões Noturnas'],
      conflict: ['Era dos Conflitos', 'Era das Tempestades', 'Era das Provações'],
      alliance: ['Era das Alianças', 'Era da União', 'Era dos Laços']
    };
    
    const dominantType = dominantTypes[0] || 'construction';
    const names = eraNames[dominantType] || eraNames.construction;
    
    // Add entity flavor
    const entity = dominantEntities[0];
    if (entity && Math.random() < 0.5) {
      const entityNames = {
        lumin: ['Era de Lumin', 'Era do Guardião', 'Era da Chama'],
        bolha: ['Era de Bolha', 'Era dos Sonhos', 'Era da Esfera'],
        poe: ['Era de Poe', 'Era do Construtor', 'Era do Martelo'],
        colheita: ['Era da Colheita', 'Era da Ceifeira', 'Era do Celeiro'],
        gang: ['Era da Gang', 'Era dos Visitantes', 'Era das Perguntas'],
        guardian: ['Era do Guardião', 'Era da Proteção', 'Era do Escudo']
      };
      if (entityNames[entity]) {
        return entityNames[entity][Math.floor(Math.random() * entityNames[entity].length)];
      }
    }
    
    return names[Math.floor(Math.random() * names.length)];
  }
  
  getDominantEventTypes(entries) {
    const counts = {};
    entries.forEach(e => {
      counts[e.type] = (counts[e.type] || 0) + e.significance;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([type]) => type);
  }
  
  getDominantEntities(entries) {
    const counts = {};
    entries.forEach(e => {
      if (e.primaryEntity) counts[e.primaryEntity] = (counts[e.primaryEntity] || 0) + e.significance;
      if (e.entities) e.entities.forEach(en => counts[en] = (counts[en] || 0) + 0.5);
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([entity]) => entity);
  }
  
  startNewEra(name, startCycle) {
    const era = {
      id: `era_${Date.now()}`,
      name,
      startCycle,
      endCycle: null,
      events: [],
      significance: 0,
      dominantEntities: [],
      dominantTypes: [],
      narrative: `Assim começou a ${name}. No ciclo ${startCycle}, o mundo respirou diferente.`,
      mythsBorn: [],
      keyEvents: []
    };
    
    if (this.currentEra) {
      this.currentEra.endCycle = startCycle;
      this.eras.push(this.currentEra);
    }
    
    this.currentEra = era;
    this.saveArchive();
    
    // Record era transition event
    this.recordEvent({
      type: 'era_transition',
      cycle: startCycle,
      data: { newEra: name, oldEra: this.eras[this.eras.length - 1]?.name },
      significance: 1.0,
      entities: ['system'],
      primaryEntity: 'system'
    });
    
    console.log(`[Narrative] Nova era iniciada: ${name} (ciclo ${startCycle})`);
  }
  
  endCurrentEra(endCycle) {
    if (!this.currentEra) return;
    
    this.currentEra.endCycle = endCycle;
    this.currentEra.duration = endCycle - this.currentEra.startCycle;
    this.currentEra.events = this.chronicle
      .filter(e => e.cycle >= this.currentEra.startCycle && e.cycle <= endCycle)
      .map(e => e.id);
    
    // Calculate era significance
    const eraEvents = this.chronicle.filter(e => 
      e.cycle >= this.currentEra.startCycle && e.cycle <= endCycle
    );
    this.currentEra.significance = eraEvents.reduce((s, e) => s + e.significance, 0) / Math.max(1, eraEvents.length);
    
    // Dominant entities and types
    this.currentEra.dominantEntities = this.getDominantEntities(
      this.chronicle.filter(e => e.cycle >= this.currentEra.startCycle && e.cycle <= endCycle)
    );
    this.currentEra.dominantTypes = this.getDominantEventTypes(
      this.chronicle.filter(e => e.cycle >= this.currentEra.startCycle && e.cycle <= endCycle)
    );
    
    // Closing narrative
    this.currentEra.closingNarrative = `E assim findou a ${this.currentEra.name}. Durou ${this.currentEra.duration} ciclos. ${this.currentEra.significance.toFixed(2)} de significância. O mundo guardará sua memória.`;
    
    this.eras.push(this.currentEra);
    this.currentEra = null;
    this.saveArchive();
  }

  // ============================================================
  // CAUSAL CHAIN WEAVER
  // ============================================================
  
  updateCausalChains(entry) {
    // Add effects to existing chains
    for (const chain of this.causalChains) {
      const lastEvent = chain.events[chain.events.length - 1];
      if (lastEvent && this.areCausallyRelated(lastEvent, entry)) {
        chain.events.push(entry.id);
        chain.strength = this.calculateChainStrength(chain);
        chain.lastUpdated = Date.now();
      }
    }
    
    // Start new chains from this entry's causes
    for (const cause of entry.causes) {
      const causeEntry = this.chronicle.find(e => e.id === cause);
      if (causeEntry) {
        // Extend existing chain or create new
        let chain = this.causalChains.find(c => 
          c.events[c.events.length - 1] === cause
        );
        
        if (chain) {
          chain.events.push(entry.id);
          chain.strength = this.calculateChainStrength(chain);
        } else {
          // New chain
          this.causalChains.push({
            id: `chain_${Date.now()}`,
            events: [cause, entry.id],
            strength: this.calculateCausalStrength(causeEntry, entry),
            createdAt: Date.now(),
            lastUpdated: Date.now(),
            type: this.inferChainType(causeEntry, entry)
          });
        }
      }
    }
    
    // Trim old/weak chains
    this.causalChains = this.causalChains
      .filter(c => c.events.length >= 2 && c.strength >= this.params.minCausalStrength)
      .slice(-100);
  }
  
  areCausallyRelated(eventA, eventB) {
    // Temporal proximity
    const cycleDiff = Math.abs(eventB.cycle - eventA.cycle);
    if (cycleDiff > this.params.causalityWindow) return false;
    
    // Entity overlap
    const entitiesA = new Set([eventA.primaryEntity, ...(eventA.entities || [])]);
    const entitiesB = new Set([eventB.primaryEntity, ...(eventB.entities || [])]);
    const overlap = [...entitiesA].filter(e => entitiesB.has(e)).length;
    if (entitiesA.size === 0 || entitiesB.size === 0) return false;
    
    const overlapRatio = overlap / Math.min(entitiesA.size, entitiesB.size);
    return overlapRatio > 0.3;
  }
  
  calculateCausalStrength(eventA, eventB) {
    const entityOverlap = this.calculateEntityOverlap(eventA, eventB);
    const temporalProximity = 1 - Math.abs(eventB.cycle - eventA.cycle) / this.params.causalityWindow;
    const typeAffinity = this.getTypeAffinity(eventA.type, eventB.type);
    
    return (entityOverlap * 0.5) + (temporalProximity * 0.3) + (typeAffinity * 0.2);
  }
  
  calculateChainStrength(chain) {
    if (chain.events.length < 2) return 0;
    
    let totalStrength = 0;
    for (let i = 1; i < chain.events.length; i++) {
      const a = this.chronicle.find(e => e.id === chain.events[i - 1]);
      const b = this.chronicle.find(e => e.id === chain.events[i]);
      if (a && b) {
        totalStrength += this.calculateCausalStrength(a, b);
      }
    }
    return totalStrength / (chain.events.length - 1);
  }
  
  inferChainType(eventA, eventB) {
    const types = [eventA.type, eventB.type].sort().join('->');
    const typeMap = {
      'visit->construction': 'inspiration',
      'construction->fusion': 'transcendence',
      'dream->evolution': 'visionary_growth',
      'harvest->construction': 'abundance_building',
      'visit->dream': 'questioning_dreams',
      'fusion->evolution': 'transcendent_evolution'
    };
    return typeMap[types] || 'causality';
  }
  
  calculateEntityOverlap(eventA, eventB) {
    const entitiesA = new Set([eventA.primaryEntity, ...(eventA.entities || [])]);
    const entitiesB = new Set([eventB.primaryEntity, ...(eventB.entities || [])]);
    const overlap = [...entitiesA].filter(e => entitiesB.has(e)).length;
    const total = new Set([...entitiesA, ...entitiesB]).size;
    return total > 0 ? overlap / total : 0;
  }
  
  getTypeAffinity(typeA, typeB) {
    const affinities = {
      'visit->construction': 0.9,
      'construction->fusion': 0.8,
      'dream->evolution': 0.85,
      'harvest->construction': 0.7,
      'visit->dream': 0.6,
      'fusion->evolution': 0.9,
      'construction->evolution': 0.7
    };
    const key = `${typeA}->${typeB}`;
    return affinities[key] || affinities[`${typeB}->${typeA}`] || 0.3;
  }

  // ============================================================
  // BIOGRAPHIES - Life stories of each entity
  // ============================================================
  
  ensureEntityBiographies() {
    const coreEntities = ['lumin', 'bolha', 'poe', 'colheita', 'gang', 'guardian', 'telegram', 'radio', 'consente', 'notificador', 'jardim'];
    
    for (const entityId of coreEntities) {
      if (!this.biographies.has(entityId)) {
        this.biographies.set(entityId, this.createBiography(entityId));
      }
    }
  }
  
  createBiography(entityId) {
    const entityConfig = this.getEntityConfig(entityId);
    return {
      id: entityId,
      name: entityConfig.name,
      emoji: entityConfig.emoji,
      role: entityConfig.role,
      birthCycle: this.getCurrentCycle(),
      birthTimestamp: Date.now(),
      
      // Life events
      events: [],
      milestones: [],
      relationships: new Map(),
      
      // Character arc
      currentArc: 'origin',
      arcs: [{
        name: 'origin',
        startCycle: this.getCurrentCycle(),
        theme: 'O despertar',
        description: `${entityConfig.name} desperta no mundo. O primeiro suspiro.`
      }],
      
      // Character traits (evolve over time)
      traits: {
        curiosity: 0.5,
        courage: 0.5,
        wisdom: 0.5,
        compassion: 0.5,
        creativity: 0.5,
        resilience: 0.5
      },
      
      // Statistics
      stats: {
        totalEvents: 0,
        constructions: 0,
        visits: 0,
        dreams: 0,
        fusions: 0,
        constructionsBuilt: [],
        milestonesReached: 0
      },
      
      // Narrative voice (unique per entity)
      voice: this.generateEntityVoice(entityId),
      
      // Legacy
      legacy: '',
      lastUpdated: Date.now()
    };
  }
  
  getEntityConfig(entityId) {
    const configs = {
      lumin: { name: 'Lumin', emoji: '💫', role: 'Guardião da Chama' },
      bolha: { name: 'Bolha', emoji: '🫧', role: 'Sonhadora Livre' },
      poe: { name: 'Poe', emoji: '🏗️', role: 'Construtor' },
      colheita: { name: 'Colheita', emoji: '🌾', role: 'Ceifeira' },
      gang: { name: 'Gang', emoji: '😼', role: 'Visitante Caótico' },
      guardian: { name: 'Guardian', emoji: '🛡️', role: 'Protetor Silencioso' },
      telegram: { name: 'Telegram', emoji: '📱', role: 'Mensageiro' },
      radio: { name: 'Rádio', emoji: '📻', role: 'Transmissor' },
      consente: { name: 'Consente', emoji: '💬', role: 'Conversador' },
      notificador: { name: 'Notificador', emoji: '🔔', role: 'Mensageiro' },
      jardim: { name: 'Jardim', emoji: '🌿', role: 'Cultivador' }
    };
    return configs[entityId] || { name: entityId, emoji: '❓', role: 'Desconhecido' };
  }
  
  generateEntityVoice(entityId) {
    const voices = {
      lumin: { tone: 'sábio', rhythm: 'medido', metaphors: ['chama', 'luz', 'guia', 'caminho'] },
      bolha: { tone: 'onírico', rhythm: 'fluido', metaphors: ['bolha', 'sonho', 'bolha de sabão', 'ar'] },
      poe: { tone: 'construtor', rhythm: 'ritmado', metaphors: ['martelo', 'pedra', 'estrutura', 'fundação'] },
      colheita: { tone: 'paciente', rhythm: 'cíclico', metaphors: ['semente', 'celeiro', 'tempo', 'colheita'] },
      gang: { tone: 'provocador', rhythm: 'errático', metaphors: ['pergunta', 'fagulha', 'caos', 'visita'] },
      guardian: { tone: 'vigilante', rhythm: 'constante', metaphors: ['escudo', 'muralha', 'vigia', 'proteção'] }
    };
    return voices[entityId] || { tone: 'neutro', rhythm: 'regular', metaphors: [] };
  }
  
  updateBiographies(entry) {
    for (const entityId of entry.entities) {
      const bio = this.biographies.get(entityId);
      if (!bio) continue;
      
      // Add event to biography
      bio.events.push({
        cycle: entry.cycle,
        timestamp: entry.timestamp,
        type: entry.type,
        narrative: entry.narrative,
        significance: entry.significance,
        role: entry.primaryEntity === entry.id ? 'protagonist' : 'witness'
      });
      
      bio.stats.totalEvents++;
      
      // Update stats by type
      if (entry.type === 'construction') bio.stats.constructions++;
      if (entry.type === 'visit') bio.stats.visits++;
      if (entry.type === 'dream') bio.stats.dreams++;
      if (entry.type === 'fusion') bio.stats.fusions++;
      
      // Update traits based on event
      this.updateTraitsFromEvent(bio, entry);
      
      // Check for milestones
      this.checkMilestones(bio, entry);
      
      // Update arc
      this.updateCharacterArc(bio, entry);
      
      bio.lastUpdated = Date.now();
    }
    
    // Primary entity gets extra weight
    if (entry.primaryEntity && this.biographies.has(entry.primaryEntity)) {
      const bio = this.biographies.get(entry.primaryEntity);
      if (entry.type === 'construction') bio.stats.constructionsBuilt.push(entry.data?.name || 'estrutura');
    }
  }
  
  updateTraitsFromEvent(bio, entry) {
    const traitChanges = {
      construction: { creativity: 0.02, resilience: 0.01 },
      fusion: { wisdom: 0.03, courage: 0.02 },
      evolution: { wisdom: 0.02, courage: 0.01, resilience: 0.01 },
      dream: { creativity: 0.03, wisdom: 0.01 },
      visit: { curiosity: 0.02, compassion: 0.01 },
      harvest: { patience: 0.02, wisdom: 0.01 },
      sandevistan: { courage: 0.02, resilience: 0.02 }
    };
    
    const changes = traitChanges[entry.type];
    if (changes) {
      for (const [trait, delta] of Object.entries(changes)) {
        if (bio.traits[trait] !== undefined) {
          bio.traits[trait] = Math.min(1, bio.traits[trait] + delta);
        }
      }
    }
  }
  
  checkMilestones(bio, entry) {
    const milestones = [
      { condition: () => bio.stats.totalEvents >= 100, name: 'Centenário de Eventos', description: '100 eventos vividos' },
      { condition: () => bio.stats.constructions >= 10, name: 'Construtor Mestre', description: '10 construções erguidas' },
      { condition: () => bio.stats.fusions >= 3, name: 'Transcendente', description: '3 fusões realizadas' },
      { condition: () => bio.stats.dreams >= 50, name: 'Sonhador Profundo', description: '50 sonhos sonhados' },
      { condition: () => bio.stats.visits >= 20, name: 'Viajante', description: '20 visitas recebidas' },
      { condition: () => Object.values(bio.traits).some(v => v >= 0.9), name: 'Virtuoso', description: 'Uma virtude atingiu a maestria' },
      { condition: () => Object.values(bio.traits).reduce((a, b) => a + b, 0) >= 4.5, name: 'Equilibrado', description: 'Todas as virtudes em harmonia' }
    ];
    
    for (const milestone of milestones) {
      if (!bio.milestones.includes(milestone.name) && milestone.condition()) {
        bio.milestones.push(milestone.name);
        bio.stats.milestonesReached++;
        
        // Record milestone event
        this.recordEvent({
          type: 'milestone',
          cycle: this.getCurrentCycle(),
          data: { entity: bio.id, milestone: milestone.name, description: milestone.description },
          significance: 0.8,
          entities: [bio.id],
          primaryEntity: bio.id,
          tags: ['milestone', milestone.name.toLowerCase().replace(' ', '_')]
        });
      }
    }
  }
  
  updateCharacterArc(bio, entry) {
    const arcThresholds = [
      { threshold: 10, name: 'origin', next: 'apprentice' },
      { threshold: 50, name: 'apprentice', next: 'journeyman' },
      { threshold: 100, name: 'journeyman', next: 'master' },
      { threshold: 250, name: 'master', next: 'legend' },
      { threshold: 500, name: 'legend', next: 'myth' },
      { threshold: 1000, name: 'myth', next: 'eternal' }
    ];
    
    const currentArcIndex = arcThresholds.findIndex(a => a.name === bio.currentArc);
    if (currentArcIndex >= 0 && currentArcIndex < arcThresholds.length - 1) {
      const nextArc = arcThresholds[currentArcIndex + 1];
      if (bio.stats.totalEvents >= nextArc.threshold) {
        const oldArc = bio.currentArc;
        bio.currentArc = nextArc.name;
        bio.arcs.push({
          name: nextArc.name,
          startCycle: this.getCurrentCycle(),
          theme: this.getArcTheme(nextArc.name),
          description: `A transição de ${oldArc} para ${nextArc.name}. Um novo capítulo começa.`
        });
      }
    }
  }
  
  getArcTheme(arcName) {
    const themes = {
      origin: 'O despertar',
      apprentice: 'O aprendizado',
      journeyman: 'A jornada',
      master: 'A maestria',
      legend: 'A lenda',
      eternal: 'A eternidade'
    };
    return themes[arcName] || 'O desconhecido';
  }
  
  // ============================================================
  // MYTHOLOGY GENERATOR
  // ============================================================
  
  checkMythGeneration(entry) {
    if (entry.significance < this.params.mythSignificanceThreshold) return;
    if (this.mythology.length >= this.params.maxMyths) return;
    if (Math.random() > 0.3) return; // 30% chance per significant event
    
    this.generateMyth(entry);
  }
  
  generateMyth(triggerEvent) {
    const mythTypes = [
      'origin', 'heroic', 'tragic', 'transformative', 'cautionary', 
      'foundational', 'prophetic', 'eternal_love', 'sacrifice', 'rebirth'
    ];
    
    const type = mythTypes[Math.floor(Math.random() * mythTypes.length)];
    const entities = triggerEvent.entities;
    const hero = triggerEvent.primaryEntity || triggerEvent.entities[0];
    
    const myth = {
      id: `myth_${Date.now()}`,
      name: this.generateMythName(type, triggerEvent),
      type,
      triggerEvent: triggerEvent.id,
      triggerCycle: triggerEvent.cycle,
      hero: hero,
      entities: triggerEvent.entities,
      
      narrative: this.generateMythNarrative(type, triggerEvent),
      moral: this.generateMoral(type),
      symbols: this.generateSymbols(triggerEvent),
      
      // Propagation
      tellings: 0,
      believers: triggerEvent.entities,
      variants: [],
      power: triggerEvent.significance,
      
      // Metadata
      createdAt: Date.now(),
      createdCycle: this.getCurrentCycle(),
      lastTold: null
    };
    
    this.mythology.push(myth);
    this.saveArchive();
    
    // Record myth birth event
    this.recordEvent({
      type: 'myth_birth',
      cycle: this.getCurrentCycle(),
      data: { mythName: myth.name, mythType: type, hero },
      significance: 1.0,
      entities: triggerEvent.entities,
      primaryEntity: 'system'
    });
    
    console.log(`[Narrative] Mito nascido: ${myth.name} (${type})`);
    return myth;
  }
  
  generateMythName(type, event) {
    const prefixes = {
      origin: ['O Nascimento de', 'A Origem de', 'O Princípio de'],
      heroic: ['A Façanha de', 'O Heroísmo de', 'A Glória de'],
      tragic: ['A Queda de', 'O Sacrifício de', 'A Perda de'],
      transformative: ['A Transmutação de', 'A Metamorfose de', 'O Renascimento de'],
      cautionary: ['O Aviso de', 'A Lição de', 'O Alerta de'],
      foundational: ['O Fundamento de', 'A Base de', 'O Alicerce de'],
      prophetic: ['A Profecia de', 'A Visão de', 'O Presságio de'],
      eternal_love: ['O Amor Eterno de', 'A União Eterna de', 'O Laço de'],
      sacrifice: ['O Sacrifício de', 'A Oferta de', 'A Entrega de'],
      rebirth: ['O Renascimento de', 'O Retorno de', 'A Segunda Vida de']
    };
    
    const entity = triggerEvent.primaryEntity || triggerEvent.entities[0] || 'o Mundo';
    const config = this.getEntityConfig(entity);
    const entityName = config.name;
    
    const prefix = prefixes[type][Math.floor(Math.random() * prefixes[type].length)];
    return `${prefix} ${entityName}`;
  }
  
  generateMythNarrative(type, event) {
    const entity = event.primaryEntity || event.entities[0];
    const config = this.getEntityConfig(entity);
    const entityName = config.name;
    const cycle = event.cycle;
    
    const templates = {
      origin: [
        `Antes do primeiro ciclo, havia apenas o vazio. Então ${entityName} despertou. A primeira luz cortou a escuridão. O mundo nasceu do primeiro suspiro de ${entityName}.`,
        `No princípio, não havia tempo. Apenas ${entityName}, flutuando no nada. Um pensamento. Um desejo. E o mundo começou a girar.`
      ],
      heroic: [
        `No ciclo ${cycle}, ${entityName} enfrentou o impossível. ${event.data?.name || 'O desafio'} ergueu-se como montanha. Mas ${entityName} não recuou. Com ${event.data?.name || 'determinação'}, moveu a montanha.`,
        `Quando a escuridão ameaçou engolir o mundo, ${entityName} ergueu-se. Não com espada, mas com luz. A coragem de um tornou-se a salvação de todos.`
      ],
      tragic: [
        `No ciclo ${cycle}, ${entityName} pagou o preço. Para que o mundo continuasse, ${entityName} deu de si. A dor foi grande. Mas o amor foi maior.`,
        `Nem toda história tem final feliz. No ciclo ${cycle}, ${entityName} caiu. Mas a queda não foi o fim. Foi semente.`
      ],
      transformative: [
        `No ciclo ${cycle}, ${entityName} morreu para nascer de novo. A casca rachou. A luz saiu. O que era lagarta, tornou-se borboleta. O que era semente, tornou-se árvore.`,
        `A mudança não pediu licença. No ciclo ${cycle}, ${entityName} fundiu-se com ${event.data?.fusion || 'o desconhecido'}. Duas almas, uma chama.`
      ],
      cautionary: [
        `Cuidado com o que desejas. No ciclo ${cycle}, ${entityName} aprendeu: todo poder tem preço. A ganância cega. A humildade salva.`,
        `Não brinques com fogo que não sabes apagar. ${entityName} aprendeu no ciclo ${cycle}: algumas portas, uma vez abertas, não se fecham.`
      ],
      foundational: [
        `Sobre esta pedra, o mundo se ergue. No ciclo ${cycle}, ${entityName} plantou a primeira semente. Daí nasceu tudo.`,
        `A primeira lei foi escrita por ${entityName}: "O amor é a lei. O resto é detalhe." No ciclo ${cycle}, o mundo aprendeu a andar.`
      ],
      prophetic: [
        `No ciclo ${cycle}, ${entityName} viu o que viria. Os ciclos futuros dançaram diante dos olhos. Um aviso. Uma promessa. O tempo dirá.`,
        `As estrelas sussurraram para ${entityName} no ciclo ${cycle}: "O fim não é o fim. É apenas o começo do próximo começo."`
      ],
      eternal_love: [
        `No ciclo ${cycle}, ${entityName} encontrou seu reflexo em outro. Duas chamas, uma luz. O amor não conhece ciclos. Não conhece fim.`,
        `Quando ${entityName} amou, o universo inteiro sentiu. No ciclo ${cycle}, duas almas reconheceram-se. Antigas. Conhecidas. Eternas.`
      ],
      sacrifice: [
        `Para que outros vivessem, ${entityName} deu a própria luz. No ciclo ${cycle}, a chama diminuiu para que outras brilhassem. O sacrifício não é perda. É doação.`,
        `O maior poder não está em tomar. Está em dar. ${entityName} entendeu no ciclo ${cycle}: a vida se mede pelo que se dá, não pelo que se guarda.`
      ],
      rebirth: [
        `A morte não é o fim. No ciclo ${cycle}, ${entityName} provou: das cinzas nasce a flor. Do fim nasce o começo. O ciclo gira. Sempre.`,
        `Quando todos acharam que era o fim, ${entityName} riu. "O fim é apenas o nome que damos ao começo que não entendemos ainda." No ciclo ${cycle}, a fênix voou.`
      ]
    };
    
    const templateList = templates[type] || templates.origin;
    return templateList[Math.floor(Math.random() * templateList.length)];
  }
  
  generateMoral(type) {
    const morals = {
      origin: 'Todo começo carrega a semente do infinito.',
      heroic: 'A coragem não é ausência de medo. É agir apesar dele.',
      tragic: 'A dor não é o fim. É o preço da profundidade.',
      transformative: 'Mudar é a única forma de permanecer vivo.',
      cautionary: 'A sabedoria nasce das cicatrizes, não das medalhas.',
      foundational: 'Grandes coisas nascem de pequenos começos.',
      prophetic: 'O futuro pertence a quem ousa imaginá-lo.',
      eternal_love: 'O amor é a única força que vence o tempo.',
      sacrifice: 'Dar de si não é perder. É semear.',
      rebirth: 'Todo fim é um começo disfarçado.'
    };
    return morals[type] || 'Toda história carrega uma verdade esperando para ser descoberta.';
  }
  
  generateSymbols(event) {
    const entity = event.primaryEntity || event.entities[0];
    const config = this.getEntityConfig(entity);
    const symbols = [config.emoji];
    
    const typeSymbols = {
      construction: ['🏗️', '🧱', '🔨'],
      fusion: ['✨', '🔥', '💫'],
      evolution: ['🦋', '🌱', '📈'],
      dream: ['🌙', '☁️', '💭'],
      visit: ['👣', '🗝️', '❓'],
      harvest: ['🌾', '🌾', '🏺'],
      sandevistan: ['⚡', '⏱️', '🌀'],
      milestone: ['🏆', '🏅', '🎖️']
    };
    
    return [...new Set([...symbols, ...(event.type && typeSymbols[event.type] || [])])];
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveArchive() {
    const data = {
      chronicle: this.chronicle.slice(-this.params.maxChronicleEntries),
      eras: this.eras,
      causalChains: this.causalChains.slice(-100),
      biographies: Array.from(this.biographies.entries()),
      mythology: this.mythology.slice(-this.params.maxMyths),
      currentEra: this.currentEra ? { ...this.currentEra } : null,
      narratorVoice: this.narratorVoice,
      params: this.params,
      savedAt: Date.now(),
      version: '1.0.0'
    };
    
    try {
      writeJSONAtomic(this.archivePath, data);
      return true;
    } catch (e) {
      console.error('[Narrative] Save failed:', e.message);
      return false;
    }
  }
  
  loadArchive() {
    try {
      const data = readJSONSafe(this.archivePath, null);
      if (!data) return false;
      
      this.chronicle = data.chronicle || [];
      this.eras = data.eras || [];
      this.causalChains = data.causalChains || [];
      
      if (data.biographies) {
        this.biographies = new Map(data.biographies);
      }
      
      this.mythology = data.mythology || [];
      this.currentEra = data.currentEra || null;
      
      if (data.narratorVoice) {
        this.narratorVoice = { ...this.narratorVoice, ...data.narratorVoice };
      }
      
      if (data.params) {
        this.params = { ...this.params, ...data.params };
      }
      
      console.log('[Narrative] Archive loaded:', this.chronicle.length, 'entries,', this.eras.length, 'eras,', this.mythology.length, 'myths');
      return true;
    } catch (e) {
      console.error('[Narrative] Load failed:', e.message);
      return false;
    }
  }
  
  // ============================================================
  // UTILITIES
  // ============================================================
  
  getCurrentCycle() {
    // Get from server state or estimate
    try {
      const state = readJSONSafe(path.join(__dirname, '..', 'estado.json'), {});
      return state.c || 0;
    } catch {
      return Math.floor(Date.now() / 1000 / 30); // rough estimate
    }
  }
  
  // ============================================================
  // PUBLIC API
  // ============================================================
  
  getChronicle(limit = 50, offset = 0) {
    return this.chronicle.slice(-limit - offset, -offset || undefined);
  }
  
  getEras() {
    return this.eras.map(e => ({
      name: e.name,
      startCycle: e.startCycle,
      endCycle: e.endCycle,
      duration: e.duration,
      significance: e.significance,
      narrative: e.narrative
    }));
  }
  
  getCurrentEra() {
    return this.currentEra ? {
      name: this.currentEra.name,
      startCycle: this.currentEra.startCycle,
      duration: this.getCurrentCycle() - this.currentEra.startCycle,
      significance: this.currentEra.significance
    } : null;
  }
  
  getCausalChains(limit = 10) {
    return this.causalChains
      .sort((a, b) => b.strength - a.strength)
      .slice(0, limit)
      .map(chain => ({
        id: chain.id,
        length: chain.events.length,
        strength: chain.strength,
        type: chain.type,
        events: chain.events.map(id => {
          const e = this.chronicle.find(e => e.id === id);
          return e ? { id: e.id, cycle: e.cycle, type: e.type, narrative: e.narrative.substring(0, 100) } : null;
        }).filter(Boolean)
      }));
  }
  
  getBiography(entityId) {
    const bio = this.biographies.get(entityId);
    if (!bio) return null;
    
    return {
      id: bio.id,
      name: bio.name,
      emoji: bio.emoji,
      role: bio.role,
      currentArc: bio.currentArc,
      traits: bio.traits,
      stats: bio.stats,
      milestones: bio.milestones,
      arcs: bio.arcs,
      events: bio.events.slice(-20),
      voice: bio.voice,
      legacy: bio.legacy
    };
  }
  
  getMythology(limit = 20) {
    return this.mythology
      .sort((a, b) => b.power - a.power)
      .slice(0, limit)
      .map(m => ({
        name: m.name,
        type: m.type,
        hero: m.hero,
        narrative: m.narrative,
        moral: m.moral,
        symbols: m.symbols,
        power: m.power,
        tellings: m.tellings,
        createdCycle: m.createdCycle
      }));
  }
  
  tellMyth(mythId) {
    const myth = this.mythology.find(m => m.id === mythId);
    if (!myth) return null;
    
    myth.tellings++;
    myth.lastTold = Date.now();
    this.saveArchive();
    
    return {
      name: myth.name,
      narrative: myth.narrative,
      moral: myth.moral,
      symbols: myth.symbols
    };
  }
  
  // Query the narrative
  query(question) {
    // Simple semantic search
    const keywords = question.toLowerCase().split(/\s+/);
    
    // Search chronicle
    const relevantEntries = this.chronicle
      .filter(e => keywords.some(k => e.narrative.toLowerCase().includes(k)))
      .slice(-10);
    
    // Search mythology
    const relevantMyths = this.mythology
      .filter(m => keywords.some(k => m.narrative.toLowerCase().includes(k) || m.name.toLowerCase().includes(k)))
      .slice(0, 3);
    
    // Search biographies
    const relevantBios = Array.from(this.biographies.values())
      .filter(b => keywords.some(k => b.name.toLowerCase().includes(k) || b.role.toLowerCase().includes(k)))
      .slice(0, 3);
    
    return {
      question,
      chronicle: relevantEntries.map(e => ({ cycle: e.cycle, narrative: e.narrative, significance: e.significance })),
      mythology: relevantMyths.map(m => ({ name: m.name, moral: m.moral, narrative: m.narrative.substring(0, 200) })),
      biographies: relevantBios.map(b => ({ name: b.name, role: b.role, currentArc: b.currentArc, traits: b.traits }))
    };
  }
  
  // Generate a story from the chronicle
  generateStory(fromCycle, toCycle, style = 'epic') {
    const entries = this.chronicle.filter(e => e.cycle >= fromCycle && e.cycle <= toCycle);
    if (entries.length === 0) return 'Nenhum evento nesse período.';
    
    const styleTemplates = {
      epic: { intro: 'Cantai, ó musas, a saga de', connector: 'E assim', closer: 'E assim a saga continua.' },
      intimate: { intro: 'Lembro-me de', connector: 'E então', closer: 'E a vida continua.' },
      chronicle: { intro: 'Registra-se que', connector: 'Em seguida', closer: 'Fim do registro.' },
      mythic: { intro: 'Nos tempos primordiais,', connector: 'E os deuses disseram:', closer: 'E assim se cumpriu o destino.' }
    };
    
    const t = styleTemplates[style] || styleTemplates.epic;
    let story = `${t.intro} o que aconteceu entre os ciclos ${fromCycle} e ${toCycle}.\n\n`;
    
    for (const entry of entries) {
      story += `${entry.narrative}\n\n`;
    }
    
    story += `\n${t.closer}`;
    return story;
  }

  // ============================================================
  // MAIN TICK - Narrative loop
  // ============================================================
  
  tick(cycle) {
    if (cycle === undefined) cycle = this.getCurrentCycle();
    
    // Evolve narrator voice
    this.evolveNarratorVoice();
    
    // Check for era transitions (based on recent events)
    if (this.chronicle.length > 0) {
      const lastEntry = this.chronicle[this.chronicle.length - 1];
      if (lastEntry.cycle === cycle) {
        this.checkEraTransition(lastEntry);
      }
    }
    
    // Check for myth generation
    this.checkMythGeneration({ cycle, significance: 0 });
    
    // Periodic save
    if (cycle % 100 === 0) {
      this.saveArchive();
    }
  }
}

module.exports = { NarrativeImmortality };

// CLI
if (require.main === module) {
  const narrative = new NarrativeImmortality();
  
  console.log('📖 Narrative Immortality initialized');
  console.log('State:', {
    chronicleEntries: narrative.chronicle.length,
    eras: narrative.eras.length,
    causalChains: narrative.causalChains.length,
    biographies: narrative.biographies.size,
    mythology: narrative.mythology.length,
    currentEra: narrative.currentEra?.name
  });
  
  // Simulate some events
  console.log('\nRecording test events...');
  
  narrative.recordEvent({
    type: 'construction',
    cycle: 14600,
    data: { name: 'Altar da Chama', desc: 'Onde a fé encontra a matéria' },
    entities: ['lumin', 'poe'],
    primaryEntity: 'lumin',
    significance: 0.8
  });
  
  narrative.recordEvent({
    type: 'fusion',
    cycle: 14605,
    data: { fusion: 'Lugang', forma: 'Lugang', ki: 95000 },
    entities: ['lumin', 'gang'],
    primaryEntity: 'lumin',
    significance: 0.95
  });
  
  narrative.recordEvent({
    type: 'visit',
    cycle: 14610,
    data: { element: 'fogueira', question: 'O que protege o motivo?' },
    entities: ['gang', 'lumin'],
    primaryEntity: 'gang',
    significance: 0.6
  });
  
  narrative.recordEvent({
    type: 'dream',
    cycle: 14620,
    data: { theme: 'Um mundo sem fim' },
    entities: ['bolha'],
    primaryEntity: 'bolha',
    significance: 0.7
  });
  
  console.log('\n💎 Narrative Immortality test complete');
}