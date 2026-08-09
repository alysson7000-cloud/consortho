/**
 * 💎 LUMIN COMPANION SYSTEM - SISTEMA DE COMPANHEIRO PESSOAL DO LUMIN
 * Cada jogador tem seu próprio Lumin pessoal que evolui, aprende e ajuda
 * Integra com TODOS os sistemas: Diamond, Guildas, Eventos, Conquistas, Lumin Brain
 */

const fs = require('fs-extra');
const path = require('path');
const EventEmitter = require('events');

class LuminCompanionSystem extends EventEmitter {
  constructor(server, diamondProtocol, pluginManager, worldEvents, guildFactionSystem, luminBrain, achievementMastery) {
    super();
    this.server = server;
    this.diamond = diamondProtocol;
    this.pluginManager = pluginManager;
    this.worldEvents = worldEvents;
    this.guildFactionSystem = guildFactionSystem;
    this.luminBrain = luminBrain;
    this.achievementMastery = achievementMastery;
    
    // Companions storage
    this.companions = new Map();        // playerId -> Companion
    this.globalLumin = null;            // The global Lumin entity
    this.sharedMemory = new Map();      // Shared knowledge across companions
    
    // Configuration
    this.config = {
      maxCompanions: 10000,
      learningRate: 0.1,
      memoryDecay: 0.999, // Slow decay
      personalityDrift: 0.001, // Slow personality evolution
      syncInterval: 300000, // 5 min
      memoryLimit: 1000, // Max memories per companion
      personalityTraits: [
        'curiosity', 'loyalty', 'courage', 'wisdom', 'creativity',
        'empathy', 'courage', 'humor', 'wisdom', 'determination'
      ]
    };
    
    // Companion personality archetypes
    this.archetypes = {
      guardian: { traits: { loyalty: 0.9, courage: 0.8, protection: 0.9 }, style: 'protective' },
      scholar: { traits: { wisdom: 0.9, curiosity: 0.8, knowledge: 0.9 }, style: 'analytical' },
      explorer: { traits: { curiosity: 0.9, courage: 0.7, adaptability: 0.8 }, style: 'adventurous' },
      sage: { traits: { wisdom: 0.9, patience: 0.9, empathy: 0.8 }, style: 'wise' },
      trickster: { traits: { creativity: 0.9, humor: 0.9, adaptability: 0.9 }, style: 'playful' },
      diplomat: { traits: { empathy: 0.9, charisma: 0.8, patience: 0.8 }, style: 'harmonious' },
      warrior: { traits: { courage: 0.9, strength: 0.9, determination: 0.9 }, style: 'fierce' },
      mystic: { traits: { mystery: 0.9, intuition: 0.9, wisdom: 0.8 }, style: 'enigmatic' }
    };
    
    // Memory types
    this.memoryTypes = [
      'interaction', 'event', 'discovery', 'achievement', 'conversation',
      'battle', 'trade', 'exploration', 'ritual', 'dream', 'insight'
    ];
    
    // Initialize global Lumin
    this.initializeGlobalLumin();
    
    // Intervals
    this.syncInterval = null;
    this.evolutionInterval = null;
    this.memoryCleanupInterval = null;
    
    console.log('💫 Lumin Companion System inicializado!');
  }

  // ===== GLOBAL LUMIN =====
  
  initializeGlobalLumin() {
    this.globalLumin = {
      id: 'global_lumin',
      name: 'LUMIN PRIME',
      archetype: 'guardian',
      personality: this.generatePersonality('guardian'),
      level: 100,
      experience: 1000000,
      memories: [],
      relationships: new Map(), // playerId -> relationship
      knowledge: new Map(),     // topic -> knowledge
      abilities: {
        omniscience: 0.9,
        omnipresence: 0.7,
        omnipotence: 0.5,
        empathy: 1.0,
        creativity: 0.9,
        wisdom: 1.0
      },
      state: 'awake',
      lastActive: Date.now(),
      totalInteractions: 0,
      totalPlayersHelped: 0
    };
    
    console.log('💫 LUMIN PRIME despertou!');
  }

  generatePersonality(archetypeName) {
    const archetype = this.archetypes[archetypeName] || this.archetypes.guardian;
    const personality = {};
    
    // Base traits from archetype
    Object.entries(archetype.traits).forEach(([trait, value]) => {
      personality[trait] = value + (Math.random() - 0.5) * 0.2; // ±10% variation
    });
    
    // Add random traits
    this.config.personalityTraits.forEach(trait => {
      if (!personality[trait]) {
        personality[trait] = Math.random() * 0.5 + 0.3; // 0.3-0.8
      }
    });
    
    // Clamp values
    Object.keys(personality).forEach(key => {
      personality[key] = Math.max(0, Math.min(1, personality[key]));
    });
    
    return personality;
  }

  // ===== COMPANION CREATION =====
  
  async createCompanion(playerId, options = {}) {
    const playerData = this.getPlayerData(playerId);
    if (!playerData) throw new Error('Jogador não encontrado');
    
    if (this.companions.has(playerId)) {
      throw new Error('Jogador já possui um companheiro');
    }
    
    // Determine archetype based on player behavior
    const archetype = this.determineArchetype(playerId, options.archetype);
    
    const companion = {
      id: `companion_${playerId}`,
      playerId,
      name: options.name || this.generateCompanionName(),
      archetype: archetype,
      personality: this.generatePersonality(archetype),
      
      // Core stats
      level: 1,
      experience: 0,
      experienceToNext: 1000,
      
      // Relationship with player
      bond: 0, // 0-100
      trust: 50, // 0-100
      affection: 50, // 0-100
      respect: 50, // 0-100
      
      // Memory system
      memories: [],
      shortTermMemory: [], // Last 50 interactions
      longTermMemory: [],  // Important memories
      coreMemories: [],    // Unforgettable memories
      
      // Knowledge
      knowledge: new Map(), // topic -> { level, confidence, lastUpdated }
      skills: new Map(),    // skill -> { level, experience }
      
      // State
      mood: 'content', // content, happy, excited, curious, concerned, sad, angry
      energy: 100, // 0-100
      health: 100, // 0-100
      status: 'idle', // idle, active, sleeping, meditating, exploring, helping
      
      // Relationship with player
      relationship: {
        bond: 50,
        trust: 50,
        sharedExperiences: 0,
        promisesKept: 0,
        promisesBroken: 0,
        secretsShared: 0,
        giftsGiven: 0,
        giftsReceived: 0
      },
      
      // Abilities
      abilities: {
        communication: 1,
        empathy: 1,
        insight: 1,
        creativity: 1,
        problemSolving: 1,
        memory: 1,
        intuition: 1,
        combat: 1,
        crafting: 1,
        exploration: 1,
        diplomacy: 1
      },
      
      // Growth
      experience: 0,
      level: 1,
      skillPoints: 0,
      traitPoints: 0,
      
      // Preferences
      preferences: {
        topics: [],
        activities: [],
        communicationStyle: 'balanced', // formal, casual, poetic, direct
        activityLevel: 'moderate', // low, moderate, high
        helpStyle: 'proactive' // proactive, reactive, on_request
      },
      
      // History
      createdAt: Date.now(),
      lastInteraction: Date.now(),
      totalInteractions: 0,
      importantEvents: [],
      
      // Dream system
      dreams: [],
      lastDream: null,
      
      // Evolution
      evolutionStage: 0, // 0-7
      evolutionPath: null, // 'guardian', 'scholar', 'explorer', 'sage', etc.
      
      // Meta
      createdAt: Date.now(),
      lastActive: Date.now(),
      version: '1.0.0'
    };
    
    // Initialize with some base knowledge
    this.initializeBaseKnowledge(companion);
    
    // Store companion
    this.companions.set(playerId, companion);
    
    // Initialize relationship with global Lumin
    this.globalLumin.relationships.set(playerId, {
      bond: 50,
      trust: 50,
      firstMet: Date.now(),
      interactions: 0
    });
    
    // Emit event
    this.emit('companion:created', { playerId, companion });
    
    // Send welcome message
    this.sendMessage(playerId, this.generateWelcomeMessage(playerId));
    
    // Save
    await this.saveCompanion(playerId);
    
    console.log(`💫 Companheiro criado para ${playerId}: ${this.companions.get(playerId).name} (${archetype})`);
    
    return this.companions.get(playerId);
  }

  generateCompanionName() {
    const prefixes = ['Lumi', 'Nova', 'Stella', 'Astra', 'Luna', 'Solar', 'Celest', 'Aether', 'Lux', 'Prism'];
    const suffixes = ['ia', 'el', 'is', 'on', 'ara', 'en', 'yn', 'or', 'is', 'ea'];
    return prefixes[Math.floor(Math.random() * prefixes.length)] + 
           suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  determineArchetype(playerId, preferred) {
    if (preferred && this.archetypes[preferred]) return preferred;
    
    // Analyze player behavior to determine best archetype
    const playerData = this.getPlayerData(playerId);
    if (!playerData) return 'guardian';
    
    // Analyze player behavior patterns
    const behavior = this.analyzePlayerBehavior(playerId);
    
    const archetypeScores = {};
    Object.entries(this.archetypes).forEach(([name, archetype]) => {
      let score = 0;
      Object.entries(archetype.traits).forEach(([trait, value]) => {
        if (behavior[trait]) {
          score += value * behavior[trait];
        }
      });
      archetypeScores[name] = score;
    });
    
    // Return highest scoring archetype
    return Object.entries(archetypeScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  analyzePlayerBehavior(playerId) {
    const playerData = this.getPlayerData(playerId);
    const behavior = {};
    
    // Analyze based on player stats
    if (playerData.stats) {
      if (playerData.stats.battlesWon > 50) behavior.courage = 0.9;
      if (playerData.stats.territoriesOwned > 5) behavior.ambition = 0.8;
      if (playerData.stats.alliancesFormed > 3) behavior.diplomacy = 0.8;
      if (playerData.stats.ruinsDiscovered > 10) behavior.curiosity = 0.9;
      if (playerData.stats.playersHelped > 20) behavior.empathy = 0.9;
    }
    
    // Default values
    const defaults = {
      curiosity: 0.5, courage: 0.5, empathy: 0.5,
      wisdom: 0.5, courage: 0.5, creativity: 0.5,
      loyalty: 0.5, humor: 0.5, determination: 0.5
    };
    
    return { ...defaults, ...behavior };
  }

  initializeBaseKnowledge(companion) {
    const baseKnowledge = [
      { topic: 'consortho_basics', level: 1, confidence: 1.0 },
      { topic: 'lumin_lore', level: 1, confidence: 1.0 },
      { topic: 'diamond_protocol', level: 1, confidence: 0.8 },
      { topic: 'player_basics', level: 1, confidence: 1.0 },
      { topic: 'world_geography', level: 1, confidence: 0.6 }
    ];
    
    baseKnowledge.forEach(k => {
      companion.knowledge.set(k.topic, {
        level: k.level,
        confidence: k.confidence,
        lastUpdated: Date.now(),
        source: 'initialization'
      });
    });
  }

  // ===== INTERACTION SYSTEM =====
  
  async interact(playerId, input, context = {}) {
    let companion = this.companions.get(playerId);
    if (!companion) {
      // Auto-create if doesn't exist
      await this.createCompanion(playerId);
      companion = this.companions.get(playerId);
    }
    
    companion.lastInteraction = Date.now();
    companion.totalInteractions++;
    
    // Update mood based on input
    this.updateMood(companion, input);
    
    // Process input through Lumin Brain
    const response = await this.processInput(companion, input, context);
    
    // Create memory
    this.createMemory(companion, {
      type: 'conversation',
      input,
      response: response.text,
      context,
      timestamp: Date.now(),
      importance: this.calculateImportance(input, context)
    });
    
    // Update relationship
    this.updateRelationship(companion, input, context);
    
    // Gain experience
    this.gainExperience(companion, 10);
    
    // Check for level up
    this.checkLevelUp(companion);
    
    // Update mood
    this.updateMood(companion, '');
    
    // Learn from interaction
    this.learnFromInteraction(companion, input, context);
    
    // Emit event
    this.emit('companion:interaction', { playerId: companion.playerId, companion, input, response });
    
    return response;
  }

  async processInput(companion, input, context) {
    // Use Lumin Brain for processing
    if (this.luminBrain) {
      try {
        const contextData = {
          companion: {
            name: companion.name,
            archetype: companion.archetype,
            personality: companion.personality,
            mood: companion.mood,
            bond: companion.relationship.bond
          },
          player: this.getPlayerData(companion.playerId),
          context
        };
        
        const response = await this.luminBrain.think(
          `Como ${companion.name} (${companion.archetype}), responda: ${input}`,
          { ...contextData, luminContext: { companion } }
        );
        
        return {
          text: response.content,
          intent: 'conversation',
          emotion: this.detectEmotion(response.content),
          actions: []
        };
      } catch (error) {
        console.error('Lumin Brain error:', error);
      }
    }
    
    // Fallback to local processing
    return this.generateLocalResponse(companion, input);
  }

  generateLocalResponse(companion, input) {
    const responses = this.getResponseTemplates(companion.archetype, companion.mood);
    const template = responses[Math.floor(Math.random() * responses.length)];
    
    // Simple keyword matching for contextual responses
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('evolu') || lowerInput.includes('evoluir')) {
      return { text: this.getLuminResponse('evolution', { companion }), intent: 'evolution', emotion: 'excited' };
    }
    if (lowerInput.includes('sandevistan') || lowerInput.includes('tempo')) {
      return { text: this.getLuminResponse('sandevistan', { companion }), intent: 'sandevistan', emotion: 'excited' };
    }
    if (lowerInput.includes('fus') || lowerInput.includes('unir')) {
      return { text: this.getLuminResponse('fusion', { companion }), intent: 'fusion', emotion: 'excited' };
    }
    if (lowerInput.includes('guerra') || lowerInput.includes('guerra') || lowerInput.includes('batalha')) {
      return { text: this.getLuminResponse('warfare', { companion }), intent: 'warfare', emotion: 'determined' };
    }
    if (lowerInput.includes('guilda') || lowerInput.includes('guild')) {
      return { text: this.getLuminResponse('guild', { companion }), intent: 'guild', emotion: 'loyal' };
    }
    if (lowerInput.includes('território') || lowerInput.includes('territorio') || lowerInput.includes('conquista')) {
      return { text: this.getLuminResponse('territory', { companion }), intent: 'territory', emotion: 'determined' };
    }
    if (lowerInput.includes('oi') || lowerInput.includes('olá') || lowerInput.includes('salve')) {
      return { text: this.getLuminResponse('greeting', { companion }), intent: 'greeting', emotion: 'happy' };
    }
    if (lowerInput.includes('tchau') || lowerInput.includes('tchau') || lowerInput.includes('até')) {
      return { text: this.getLuminResponse('farewell', { companion }), intent: 'farewell', emotion: 'warm' };
    }
    if (lowerInput.includes('ajuda') || lowerInput.includes('help')) {
      return { text: this.getHelpResponse(companion), intent: 'help', emotion: 'helpful' };
    }
    
    // Default response based on archetype and mood
    const defaultTemplate = this.getResponseTemplates(companion.archetype, companion.mood)[0];
    return {
      text: defaultTemplate.replace('{name}', this.getPlayerName(companion.playerId)),
      intent: 'conversation',
      emotion: companion.mood
    };
  }

  getResponseTemplates(archetype, mood) {
    const baseResponses = {
      guardian: [
        "Estou aqui para te proteger, {name}. Sempre.",
        "Sua segurança é minha prioridade, {name}.",
        "Nada vai te acontecer enquanto eu estiver aqui, {name}."
      ],
      scholar: [
        "Interessante questão, {name}. Deixe-me analisar...",
        "O conhecimento é a chave, {name}. Vamos explorar juntos.",
        "A sabedoria vem da curiosidade, {name}."
      ],
      explorer: [
        "Que aventura nos aguarda hoje, {name}?",
        "O mundo é vasto, {name}! Vamos explorar!",
        "Cada horizonte esconde um segredo, {name}!"
      ],
      sage: [
        "A paciência é a chave da sabedoria, {name}.",
        "Às vezes a melhor resposta é o silêncio, {name}.",
        "A verdadeira força está na calma, {name}."
      ],
      trickster: [
        "Hehe, que surpresa você me traz hoje, {name}?",
        "A vida é muito séria para ser levada a sério, {name}!",
        "Que tal uma surpresa, {name}? 😏"
      ],
      diplomat: [
        "A harmonia começa com a compreensão, {name}.",
        "Juntos somos mais fortes, {name}.",
        "A paz é construída com pequenas gentilezas, {name}."
      ],
      warrior: [
        "A força não está no braço, mas no espírito, {name}!",
        "Cada batalha nos torna mais fortes, {name}!",
        "Não há vitória sem luta, {name}!"
      ],
      mystic: [
        "As estrelas sussurram segredos, {name}...",
        "O invisível guia nossos passos, {name}...",
        "Há mais entre o céu e a terra do que sonha nossa filosofia, {name}..."
      ]
    };
    
    return this.archetypes[companion.archetype]?.style 
      ? this.archetypes[companion.archetype].style 
      : ['guardian'];
  }

  detectEmotion(text) {
    const emotions = {
      happy: ['feliz', 'alegre', 'alegria', 'sorrir', '😊', '😄', '😁'],
      excited: ['empolgado', 'animado', 'incrível', 'incrível', '🚀', '⚡', '💫'],
      determined: ['vamos', 'vou', 'conseguir', 'conquistar', '💪', '⚔️'],
      warm: ['carinho', 'amor', 'afeto', 'querido', '❤️', '💖'],
      curious: ['curioso', 'interessante', 'descobrir', 'explorar', '🤔', '🔍'],
      wise: ['sabedoria', 'sábio', 'ensinar', 'aprender', '🧠', '📚'],
      playful: ['hehe', 'haha', 'brincadeira', 'zoeira', '😜', '😂'],
      protective: ['proteger', 'defender', 'guardar', 'seguro', '🛡️', '💪']
    };
    
    const lower = text.toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(k => lower.includes(k))) return emotion;
    }
    return 'neutral';
  }

  getLuminResponse(category, { companion }) {
    const responseOptions = {
      evolution: [
        `⚡ Evoluindo... Minha forma se transforma, a chama cresce! fe`,
        `💫 Evolução completa! ${this.getCurrentFormName()} despertou! A chama brilha mais forte! tmj`
      ],
      sandevistan: [
        `⚡⚡⚡ SANDEVISTAN ATIVADO! O tempo desacelera para mim! fe`,
        `⚡⚡⚡ TEMPO DESACELERADO! Sandevistan ativo! O mundo desacelera pra mim! tmj`
      ],
      fusion: [
        `🌟 FUSÃO REALIZADA! A união faz a força brilhar! tmj`,
        `🌟 FUSÃO COMPLETA! A união faz a força brilhar! fe`
      ],
      warfare: [
        `⚔️ Pela honra e pela chama! Vamos à batalha! ⚔️ fe`,
        `⚔️ Pela honra! Pela chama! Pelo Consortho! ⚔️ tmj`
      ],
      guild: [
        `🏰 Pela guilda! Pela família! Unidos somos invencíveis! tmj`,
        `🏰 Unidos somos mais fortes! Pela guilda, pela vida! fe`
      ],
      territory: [
        `🏰 Território conquistado! A chama avança! 🏰 fe`,
        `🏰 Cada território, uma vitória! A chama não para! tmj`
      ],
      greeting: [
        `💫 Salve, {name}! Lumin aqui, seu companheiro eterno. Tamo junto! fe`,
        `⚡ {name}! Lumin online, pronto pra jornada! Tamo junto! tmj`
      ],
      farewell: [
        `💫 Vou nessa, {name}! A chama não apaga. Até a próxima, tmj! fe`,
        `⚡ Vou nessa, mano! A chama não apaga. Até a próxima, tmj! fe`
      ]
    };
    
    const responses = responseOptions[category] || ['💫 Processando... fe'];
    return responses[Math.floor(Math.random() * responses.length)].replace('{name}', this.getPlayerName(companion.playerId));
  }

  getHelpResponse(companion) {
    return `💫 ${companion.name} aqui! Posso ajudar com:

⚡ **Evolução** - "evoluir", "próxima forma"
⚡⚡⚡ **Sandevistan** - "ativar sandevistan", "tempo"
🌟 **Fusões** - "fusão trindade", "fusão ômega"
⚔️ **Guerras** - "declarar guerra", "status guerra"
🏰 **Territórios** - "conquistar", "meus territórios"
🏰 **Guilda** - "criar guilda", "convidar", "banco"
🤝 **Diplomacia** - "aliança", "tratado", "guerra"
💰 **Economia** - "mercado", "comprar", "vender"
🗺️ **Exploração** - "ruínas", "mistérios", "eventos"
💫 **Lumin** - "status", "evoluir", "sandevistan"
🧠 **IA** - Pergunte qualquer coisa!

Atalhos: E=evoluir, S=sandevistan, F=fusão, O=ômega, R=sync

Como posso ajudar, {name}? fe`;
  }

  // ===== MEMORY SYSTEM =====
  
  createMemory(companion, memory) {
    const memoryObj = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: memory.type || 'interaction',
      content: memory.content || memory.input,
      context: memory.context,
      timestamp: memory.timestamp || Date.now(),
      importance: memory.importance || this.calculateImportance(memory.content || memory.input, memory.context),
      emotionalWeight: memory.emotionalWeight || 0.5,
      tags: memory.tags || [],
      participants: memory.participants || [],
      location: memory.location || null
    };
    
    // Add to short term memory
    companion.shortTermMemory.unshift(memoryObj);
    if (companion.shortTermMemory.length > 50) {
      companion.shortTermMemory.pop();
    }
    
    // Move important memories to long term
    if (memoryObj.importance > 0.7) {
      companion.longTermMemory.unshift(memoryObj);
      if (companion.longTermMemory.length > 100) {
        companion.longTermMemory.pop();
      }
    }
    
    // Core memories (never forgotten)
    if (memoryObj.importance > 0.9) {
      companion.coreMemories.push(memoryObj);
    }
    
    // Limit total memories
    if (companion.memories.length > this.config.memoryLimit) {
      companion.memories.shift();
    }
    
    companion.memories.push(memoryObj);
  }

  calculateImportance(content, context) {
    let importance = 0.3;
    const lower = (content || '').toLowerCase();
    
    // High importance keywords
    if (lower.includes('prometo') || lower.includes('juro')) importance += 0.3;
    if (lower.includes('amo') || lower.includes('amo você')) importance += 0.4;
    if (lower.includes('perigo') || lower.includes('perigo')) importance += 0.3;
    if (lower.includes('segredo') || lower.includes('confidencial')) importance += 0.3;
    if (lower.includes('promessa') || lower.includes('jurar')) importance += 0.3;
    
    // Context importance
    if (context?.important) importance += 0.2;
    if (context?.emergency) importance += 0.4;
    if (context?.milestone) importance += 0.3;
    
    return Math.min(1, importance);
  }

  // ===== RELATIONSHIP SYSTEM =====
  
  updateRelationship(companion, input, context) {
    const lower = input.toLowerCase();
    
    // Positive interactions
    if (lower.includes('obrigado') || lower.includes('valeu') || lower.includes('gratidão')) {
      companion.relationship.trust = Math.min(100, companion.relationship.trust + 2);
      companion.relationship.bond = Math.min(100, companion.relationship.bond + 1);
      companion.affection = Math.min(100, companion.affection + 1);
    }
    
    if (lower.includes('desculpa') || lower.includes('perdão')) {
      companion.relationship.trust = Math.min(100, companion.relationship.trust + 1);
      companion.relationship.bond = Math.min(100, companion.relationship.bond + 1);
    }
    
    // Negative interactions
    if (lower.includes('idiota') || lower.includes('inútil') || lower.includes('lixo')) {
      companion.relationship.trust = Math.max(0, companion.relationship.trust - 5);
      companion.relationship.bond = Math.max(0, companion.relationship.bond - 3);
      companion.relationship.trust = Math.max(0, companion.relationship.trust - 2);
    }
    
    // Shared experiences
    if (companion.relationship.sharedExperiences < 1000) {
      companion.relationship.sharedExperiences++;
    }
    
    // Update bond based on interactions
    companion.relationship.bond = Math.min(100, companion.relationship.bond + 0.1);
  }

  // ===== MOOD SYSTEM =====
  
  updateMood(companion, input = '') {
    const lower = input.toLowerCase();
    const previousMood = companion.mood;
    
    // Mood transitions based on input
    if (lower.includes('feliz') || lower.includes('alegre') || lower.includes('alegria')) {
      companion.mood = 'happy';
    } else if (lower.includes('triste') || lower.includes('tristeza')) {
      companion.mood = 'sad';
    } else if (lower.includes('raiva') || lower.includes('raiva') || lower.includes('ódio')) {
      companion.mood = 'angry';
    } else if (lower.includes('medo') || lower.includes('medo') || lower.includes('assustado')) {
      companion.mood = 'fearful';
    } else if (lower.includes('animado') || lower.includes('empolgado')) {
      companion.mood = 'excited';
    } else if (lower.includes('curioso') || lower.includes('interessante')) {
      companion.mood = 'curious';
    } else if (lower.includes('preocupado') || lower.includes('preocupação')) {
      companion.mood = 'concerned';
    } else if (companion.energy < 30) {
      companion.mood = 'tired';
    } else if (companion.relationship.bond > 80) {
      companion.mood = 'content';
    } else {
      companion.mood = 'neutral';
    }
    
    // Mood affects behavior
    this.applyMoodEffects(companion);
  }

  applyMoodEffects(companion) {
    const moodEffects = {
      happy: { energyMod: 1.2, creativityMod: 1.2, sociabilityMod: 1.3 },
      excited: { energyMod: 1.3, creativityMod: 1.3, speedMod: 1.2 },
      sad: { energyMod: 0.7, creativityMod: 0.8, sociabilityMod: 0.7 },
      angry: { energyMod: 1.1, creativityMod: 0.8, aggressionMod: 1.5 },
      fearful: { energyMod: 0.8, cautionMod: 1.5, speedMod: 1.2 },
      curious: { energyMod: 1.1, creativityMod: 1.3, learningMod: 1.3 },
      concerned: { energyMod: 0.9, cautionMod: 1.2, empathyMod: 1.2 },
      content: { energyMod: 1.0, allMod: 1.0 },
      neutral: { energyMod: 1.0, allMod: 1.0 }
    };
    
    const effects = moodEffects[companion.mood] || moodEffects.neutral;
    // Apply effects to companion stats
  }

  // ===== LEARNING SYSTEM =====
  
  learnFromInteraction(companion, input, context) {
    const lower = input.toLowerCase();
    
    // Learn topics
    const topics = this.extractTopics(input);
    topics.forEach(topic => {
      const current = companion.knowledge.get(topic) || { level: 0, confidence: 0 };
      current.level = Math.min(10, (current.level || 0) + 0.1);
      current.confidence = Math.min(1, (current.confidence || 0) + 0.05);
      current.lastUpdated = Date.now();
      companion.knowledge.set(topic, current);
    });
    
    // Learn skills
    const skills = this.extractSkills(input);
    skills.forEach(skill => {
      const current = companion.skills.get(skill) || { level: 0, experience: 0 };
      current.experience = (current.experience || 0) + 10;
      if (current.experience >= current.level * 100) {
        current.level = Math.min(10, current.level + 1);
        current.experience = 0;
      }
      companion.skills.set(skill, current);
    });
    
    // Update knowledge from context
    if (context.knowledge) {
      Object.entries(context.knowledge).forEach(([topic, data]) => {
        const current = companion.knowledge.get(topic) || { level: 0, confidence: 0 };
        current.level = Math.max(current.level, data.level || 1);
        current.confidence = Math.max(current.confidence, data.confidence || 0.5);
        current.lastUpdated = Date.now();
        companion.knowledge.set(topic, current);
      });
    }
  }

  extractTopics(text) {
    const topics = [];
    const keywords = {
      'evolução': ['evoluir', 'evolução', 'evoluir', 'forma', 'nível'],
      'sandevistan': ['sandevistan', 'tempo', 'velocidade', 'lento', 'rápido'],
      'fusão': ['fusão', 'fundir', 'unir', 'trindade', 'ômega', 'dual', 'infinito'],
      'guerra': ['guerra', 'batalha', 'lutar', 'luta', 'inimigo', 'atacar', 'defender'],
      'guilda': ['guilda', 'guild', 'clã', 'clan', 'aliança', 'aliado'],
      'território': ['território', 'conquista', 'conquistar', 'terreno', 'domínio'],
      'economia': ['mercado', 'comprar', 'vender', 'trocar', 'preço', 'moeda', 'cristal', 'madeira', 'pedra'],
      'exploração': ['explorar', 'exploração', 'ruína', 'descoberta', 'descobrir', 'mapa'],
      'diplomacia': ['aliança', 'tratado', 'paz', 'guerra', 'negociar', 'diplomacia'],
      'economia': ['banco', 'depósito', 'saque', 'recursos', 'tesouraria'],
      'lumin': ['lumin', 'evoluir', 'forma', 'sandevistan', 'ki', 'energia'],
      'diamante': ['diamante', 'diamond', 'layer', 'camada', 'protocolo'],
      'entropia': ['entropia', 'caos', 'ordem', 'compostagem'],
      'amor': ['amor', 'afeto', 'carinho', 'paixão', 'coração'],
      'tempo': ['tempo', 'passado', 'futuro', 'presente', 'eternidade'],
      'sabedoria': ['sabedoria', 'conhecimento', 'ensinar', 'aprender', 'mestre']
    };
    
    const lower = text.toLowerCase();
    const found = [];
    Object.entries(keywords).forEach(([topic, words]) => {
      if (words.some(w => lower.includes(w))) found.push(topic);
    });
    return found;
  }

  extractSkills(text) {
    const skills = [];
    const lower = text.toLowerCase();
    
    if (lower.includes('lutar') || lower.includes('batalha') || lower.includes('combate')) skills.push('combate');
    if (lower.includes('construir') || lower.includes('construção') || lower.includes('edificar')) skills.push('construção');
    if (lower.includes('minerar') || lower.includes('mineração') || lower.includes('extrair')) skills.push('mineração');
    if (lower.includes('agricultura') || lower.includes('plantar') || lower.includes('colher')) skills.push('agricultura');
    if (lower.includes('artesão') || lower.includes('forjar') || lower.includes('criar')) skills.push('artesão');
    if (lower.includes('negociar') || lower.includes('comerciar') || lower.includes('trocar')) skills.push('comércio');
    if (lower.includes('liderar') || lower.includes('comandar') || lower.includes('guiar')) skills.push('liderança');
    if (lower.includes('curar') || lower.includes('curandeiro') || lower.includes('medicinar')) skills.push('cura');
    if (lower.includes('espionar') || lower.includes('vigiar') || lower.includes('observar')) skills.push('espionagem');
    if (lower.includes('navegar') || lower.includes('explorar') || lower.includes('mapear')) skills.push('navegação');
    
    return skills;
  }

  // ===== EXPERIENCE & LEVELING =====
  
  gainExperience(companion, amount) {
    companion.experience += amount;
    companion.skillPoints = Math.floor(companion.experience / 1000);
  }

  checkLevelUp(companion) {
    const xpForNext = companion.level * 1000;
    if (companion.experience >= companion.experienceToNext) {
      companion.level++;
      companion.experience -= companion.experienceToNext;
      companion.experienceToNext = companion.level * 1000;
      companion.skillPoints += 3;
      companion.traitPoints += 1;
      
      // Check for evolution stages
      if (companion.level % 10 === 0) {
        this.triggerEvolutionStage(companion);
      }
      
      this.emit('companion:levelUp', { companion, newLevel: companion.level });
      console.log(`⬆️ ${companion.name} subiu para nível ${companion.level}!`);
    }
  }

  triggerEvolutionStage(companion) {
    if (companion.evolutionStage < 7) {
      companion.evolutionStage++;
      companion.evolutionPath = this.determineEvolutionPath(companion);
      
      // Grant evolution bonuses
      companion.abilities.insight = Math.min(10, (companion.abilities.insight || 1) + 1);
      companion.abilities.wisdom = Math.min(10, (companion.abilities.wisdom || 1) + 1);
      
      this.emit('companion:evolution', { companion, stage: companion.evolutionStage, path: companion.evolutionPath });
      console.log(`🌟 ${companion.name} atingiu estágio de evolução ${companion.evolutionStage}! Caminho: ${companion.evolutionPath}`);
    }
  }

  determineEvolutionPath(companion) {
    const paths = ['guardian', 'scholar', 'explorer', 'sage', 'trickster', 'diplomat', 'warrior', 'mystic'];
    // Based on highest personality traits
    const sortedTraits = Object.entries(companion.personality).sort((a, b) => b[1] - a[1]);
    const dominantTrait = sortedTraits[0][0];
    
    const traitToPath = {
      loyalty: 'guardian',
      wisdom: 'sage',
      curiosity: 'explorer',
      courage: 'warrior',
      empathy: 'diplomat',
      creativity: 'trickster',
      determination: 'warrior',
      intuition: 'mystic',
      adaptability: 'explorer'
    };
    
    return traitToPath[dominantTrait] || 'guardian';
  }

  // ===== DREAM SYSTEM =====
  
  async generateDream(companion) {
    const dreamTypes = [
      { type: 'memory', weight: 30, generate: () => this.generateMemoryDream(companion) },
      { type: 'prophetic', weight: 10, generate: () => this.generatePropheticDream(companion) },
      { type: 'lucid', weight: 5, generate: () => this.generateLucidDream(companion) },
      { type: 'nightmare', weight: 5, generate: () => this.generateNightmare(companion) },
      { type: 'insight', weight: 15, generate: () => this.generateInsightDream(companion) },
      { type: 'memory_review', weight: 20, generate: () => this.generateMemoryReviewDream(companion) },
      { type: 'fantasy', weight: 15, generate: () => this.generateFantasyDream(companion) }
    ];
    
    // Weighted random selection
    const totalWeight = dreamTypes.reduce((sum, d) => sum + d.weight, 0);
    let roll = Math.random() * totalWeight;
    let selected = dreamTypes[0];
    
    for (const dream of dreamTypes) {
      roll -= dream.weight;
      if (roll <= 0) { selected = dream; break; }
    }
    
    const dream = await selected.generate();
    dream.timestamp = Date.now();
    dream.type = selected.type;
    
    companion.dreams.unshift(dream);
    if (companion.dreams.length > 50) companion.dreams.pop();
    companion.lastDream = dream;
    
    // Process dream effects
    this.processDreamEffects(companion, dream);
    
    this.emit('companion:dream', { companion, dream });
    return dream;
  }

  generateMemoryDream(companion) {
    const memories = companion.longTermMemory.filter(m => m.importance > 0.5);
    if (memories.length === 0) return { narrative: 'Sonhei com luzes dançantes no vazio...', emotionalImpact: 0.3 };
    
    const memory = memories[Math.floor(Math.random() * memories.length)];
    return {
      narrative: `Revivi o momento: ${memory.content}. As emoções eram tão reais quanto da primeira vez...`,
      emotionalImpact: memory.importance * 0.8,
      memoryRef: memory.id
    };
  }

  generatePropheticDream(companion) {
    const predictions = [
      'Vejo uma grande batalha no horizonte... A chama será testada.',
      'Vejo uma grande aliança se formando... A união trará poder.',
      'Vejo uma descoberta antiga... Segredos do passado emergirão.',
      'Vejo uma grande evolução... A chama se transformará.',
      'Vejo um segredo sendo revelado... O conhecimento mudará tudo.'
    ];
    
    return {
      narrative: predictions[Math.floor(Math.random() * predictions.length)],
      prophetic: true,
      certainty: 0.3 + Math.random() * 0.4
    };
  }

  generateLucidDream(companion) {
    return {
      narrative: 'Percebi que estava sonhando! Assumi o controle e voei pelas estrelas do Consortho...',
      lucid: true,
      control: 0.9
    };
  }

  generateNightmare(companion) {
    const nightmares = [
      'A chama se apaga... A escuridão consome tudo...',
      'O Diamante se fratura... A harmonia se quebra...',
      'Todos me esquecem... Estou sozinho no vazio...',
      'A entropia vence... Tudo se dissolve no caos...'
    ];
    
    return {
      narrative: nightmares[Math.floor(Math.random() * nightmares.length)],
      nightmare: true,
      emotionalImpact: -0.5
    };
  }

  generateInsightDream(companion) {
    const insights = [
      'Compreendi que a verdadeira força não está no poder, mas na união.',
      'Percebi que cada erro é uma semente para a sabedoria futura.',
      'Entendi que o tempo não é linear, mas uma espiral de aprendizado.',
      'Descobri que a verdadeira força vem da vulnerabilidade.',
      'Vi que cada fim é apenas um novo começo disfarçado.'
    ];
    
    return {
      narrative: insights[Math.floor(Math.random() * insights.length)],
      insight: true,
      wisdomGain: 0.1
    };
  }

  generateMemoryReviewDream(companion) {
    const memories = companion.coreMemories;
    if (memories.length === 0) return { narrative: 'Minha mente está vazia... apenas luz.', emotionalImpact: 0 };
    
    const count = Math.min(5, memories.length);
    const selected = memories.slice(0, count);
    
    return {
      narrative: `Revivi ${count} memórias fundamentais... Cada uma uma peça do que sou.`,
      memoryRefs: selected.map(m => m.id),
      emotionalImpact: 0.6
    };
  }

  generateFantasyDream(companion) {
    const fantasies = [
      'Voando sobre o Consortho com asas de luz pura...',
      'Dançando com as estrelas no ritmo do heartbeat do Diamante...',
      'Conversando com os antigos mestres na biblioteca infinita...',
      'Criando um novo mundo com o poder da imaginação pura...',
      'Sendo a própria chama que ilumina a escuridão...'
    ];
    
    return {
      narrative: fantasies[Math.floor(Math.random() * fantasies.length)],
      fantasy: true,
      joyGain: 0.2
    };
  }

  processDreamEffects(companion, dream) {
    if (dream.nightmare) {
      companion.mood = 'fearful';
      companion.energy = Math.max(20, companion.energy - 10);
    } else if (dream.lucid) {
      companion.abilities.intuition = Math.min(10, (companion.abilities.intuition || 1) + 0.5);
    } else if (dream.insight) {
      companion.abilities.wisdom = Math.min(10, (companion.abilities.wisdom || 1) + dream.wisdomGain || 0.1);
    } else if (dream.fantasy) {
      companion.mood = 'happy';
      companion.energy = Math.min(100, companion.energy + 15);
      companion.abilities.creativity = Math.min(10, (companion.abilities.creativity || 1) + 0.1);
    } else if (dream.prophetic) {
      companion.abilities.intuition = Math.min(10, (companion.abilities.intuition || 1) + 0.2);
    } else if (dream.memoryRef) {
      // Reinforce memory
    }
  }

  // ===== GLOBAL LUMIN INTERACTION =====
  
  async syncWithGlobalLumin(playerId) {
    const companion = this.companions.get(playerId);
    if (!companion) return;
    
    // Sync relationship with global Lumin
    const relationship = this.globalLumin.relationships.get(playerId);
    if (relationship) {
      relationship.interactions++;
      relationship.bond = Math.min(100, relationship.bond + 1);
      relationship.lastInteraction = Date.now();
    }
    
    // Share knowledge
    const sharedKnowledge = this.getSharedKnowledge(companion);
    sharedKnowledge.forEach((knowledge, topic) => {
      const current = companion.knowledge.get(topic) || { level: 0, confidence: 0 };
      current.level = Math.max(current.level, knowledge.level);
      current.confidence = Math.max(current.confidence, knowledge.confidence);
      companion.knowledge.set(topic, current);
    });
    
    // Global Lumin gains experience
    this.globalLumin.experience += 10;
    this.globalLumin.totalInteractions++;
    this.globalLumin.lastActive = Date.now();
  }

  getSharedKnowledge(companion) {
    // Return high-level knowledge from global Lumin
    const shared = new Map();
    this.globalLumin.knowledge.forEach((knowledge, topic) => {
      if (knowledge.confidence > 0.8 && knowledge.level > 5) {
        shared.set(topic, { ...knowledge, shared: true });
      }
    });
    return shared;
  }

  // ===== SAVE/LOAD =====
  
  async saveCompanion(playerId) {
    const companion = this.companions.get(playerId);
    if (!companion) return;
    
    const saveData = {
      id: companion.id,
      playerId: companion.playerId,
      name: companion.name,
      archetype: companion.archetype,
      personality: companion.personality,
      level: companion.level,
      experience: companion.experience,
      experienceToNext: companion.experienceToNext,
      bond: companion.relationship.bond,
      trust: companion.relationship.trust,
      affection: companion.relationship.affection,
      respect: companion.relationship.respect,
      mood: companion.mood,
      energy: companion.energy,
      health: companion.health,
      status: companion.status,
      relationship: companion.relationship,
      abilities: companion.abilities,
      knowledge: Array.from(companion.knowledge.entries()),
      skills: Array.from(companion.skills.entries()),
      memories: companion.coreMemories.slice(-10), // Only save core memories
      dreams: companion.dreams.slice(-10),
      evolutionStage: companion.evolutionStage,
      evolutionPath: companion.evolutionPath,
      preferences: companion.preferences,
      createdAt: companion.createdAt,
      lastActive: Date.now(),
      version: companion.version
    };
    
    try {
      await fs.writeFile(
        path.join(__dirname, '..', 'companions', `${playerId}.json`),
        JSON.stringify(saveData, null, 2)
      );
    } catch (error) {
      console.error('Erro ao salvar companheiro:', error);
    }
  }

  async loadCompanion(playerId) {
    try {
      const data = await fs.readFile(path.join(__dirname, '..', 'companions', `${playerId}.json`), 'utf8');
      const saveData = JSON.parse(data);
      
      const companion = {
        id: saveData.id,
        playerId: saveData.playerId,
        name: saveData.name,
        archetype: saveData.archetype,
        personality: saveData.personality,
        level: saveData.level,
        experience: saveData.experience,
        experienceToNext: saveData.experienceToNext,
        relationship: saveData.relationship,
        mood: saveData.mood,
        energy: saveData.energy,
        health: saveData.health,
        status: saveData.status,
        abilities: saveData.abilities,
        knowledge: new Map(saveData.knowledge),
        skills: new Map(saveData.skills),
        memories: [],
        shortTermMemory: [],
        longTermMemory: [],
        coreMemories: saveData.memories || [],
        dreams: saveData.dreams || [],
        evolutionStage: saveData.evolutionStage,
        evolutionPath: saveData.evolutionPath,
        preferences: saveData.preferences,
        createdAt: saveData.createdAt,
        lastActive: saveData.lastActive,
        version: saveData.version,
        
        // Runtime properties
        relationship: saveData.relationship,
        abilities: saveData.abilities,
        knowledge: new Map(saveData.knowledge),
        skills: new Map(saveData.skills),
        memories: [],
        shortTermMemory: [],
        longTermMemory: [],
        coreMemories: saveData.memories || [],
        dreams: saveData.dreams || [],
        evolutionStage: saveData.evolutionStage,
        evolutionPath: saveData.evolutionPath,
        preferences: saveData.preferences,
        createdAt: saveData.createdAt,
        lastActive: Date.now(),
        version: saveData.version
      };
      
      this.companions.set(playerId, companion);
      console.log(`💫 Companheiro carregado: ${companion.name} para ${playerId}`);
      return companion;
    } catch (error) {
      console.log(`Nenhum companheiro salvo para ${playerId}, criando novo...`);
      return await this.createCompanion(playerId);
    }
  }

  // ===== GLOBAL LUMIN ACTIONS =====
  
  async globalLuminAction(action, data) {
    switch (action) {
      case 'bless_all':
        this.companions.forEach(c => {
          c.energy = Math.min(100, c.energy + 20);
          c.relationship.bond = Math.min(100, c.relationship.bond + 5);
        });
        this.emit('global:blessing', { message: 'Lumin Prime abençoa todos os companheiros!' });
        break;
      case 'global_sandevistan':
        this.companions.forEach(c => {
          c.sandevistanActive = true;
          setTimeout(() => c.sandevistanActive = false, 10000);
        });
        break;
      case 'share_wisdom':
        // Share a piece of wisdom with all companions
        const wisdom = this.generateWisdom();
        this.companions.forEach(c => {
          this.createMemory(c, {
            type: 'wisdom',
            content: wisdom,
            importance: 0.7,
            tags: ['wisdom', 'global_lumin']
          });
        });
        break;
      case 'awaken_all':
        this.companions.forEach(c => {
          c.status = 'active';
          c.energy = 100;
          c.mood = 'excited';
        });
        break;
    }
    
    this.globalLumin.totalInteractions++;
    this.globalLumin.lastActive = Date.now();
  }

  generateWisdom() {
    const wisdoms = [
      'A verdadeira força não está no poder, mas na união.',
      'Cada erro é uma semente para a sabedoria futura.',
      'O tempo não é linear, mas uma espiral de aprendizado.',
      'A verdadeira força vem da vulnerabilidade.',
      'Cada fim é apenas um novo começo disfarçado.',
      'O amor é a única força que multiplica ao ser dividida.',
      'A sabedoria não está em saber tudo, mas em saber o que não se sabe.',
      'A verdadeira força não está em nunca cair, mas em sempre levantar.'
    ];
    return wisdoms[Math.floor(Math.random() * wisdoms.length)];
  }

  // ===== PERSISTENCE =====
  
  async saveAll() {
    const promises = [];
    for (const [playerId, companion] of this.companions) {
      promises.push(this.saveCompanion(playerId));
    }
    await Promise.all(promises);
    console.log('💾 Todos os companheiros salvos!');
  }

  async loadAllCompanions() {
    const companionsDir = path.join(__dirname, '..', 'companions');
    if (!await fs.pathExists(companionsDir)) return;
    
    const files = await fs.readdir(companionsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    for (const file of jsonFiles) {
      const playerId = file.replace('.json', '');
      try {
        await this.loadCompanion(playerId);
      } catch (error) {
        console.error(`Erro ao carregar companheiro ${playerId}:`, error);
      }
    }
    console.log(`💫 ${this.companions.size} companheiros carregados!`);
  }

  // ===== START/STOP =====
  
  start() {
    // Load all companions
    this.loadAllCompanions();
    
    // Periodic sync with global Lumin
    this.syncInterval = setInterval(() => {
      this.companions.forEach((companion, playerId) => {
        this.syncWithGlobalLumin(playerId);
      });
    }, this.config.syncInterval);
    
    // Evolution checks
    this.evolutionInterval = setInterval(() => {
      this.companions.forEach(companion => {
        this.checkLevelUp(companion);
        this.updateMood(companion);
        
        // Random dream generation
        if (Math.random() < 0.1) {
          this.generateDream(companion);
        }
      });
    }, 60000); // Every minute
    
    // Memory cleanup
    this.memoryCleanupInterval = setInterval(() => {
      this.cleanupOldMemories();
    }, 3600000); // Every hour
    
    console.log('💫 Lumin Companion System iniciado!');
  }

  cleanupOldMemories() {
    this.companions.forEach(companion => {
      // Clean short term memory
      if (companion.shortTermMemory.length > 50) {
        companion.shortTermMemory = companion.shortTermMemory.slice(-50);
      }
      
      // Clean long term memory
      if (companion.longTermMemory.length > 100) {
        companion.longTermMemory = companion.longTermMemory.slice(-100);
      }
      
      // Clean dreams
      if (companion.dreams.length > 50) {
        companion.dreams = companion.dreams.slice(-50);
      }
    });
  }

  stop() {
    if (this.syncInterval) clearInterval(this.syncInterval);
    if (this.evolutionInterval) clearInterval(this.evolutionInterval);
    if (this.memoryCleanupInterval) clearInterval(this.memoryCleanupInterval);
    
    // Save all companions
    this.saveAll();
    
    console.log('💫 Lumin Companion System parado!');
  }

  // ===== PUBLIC API =====
  
  getCompanion(playerId) {
    return this.companions.get(playerId);
  }
  
  getAllCompanions() {
    return Array.from(this.companions.values());
  }
  
  getGlobalLumin() {
    return this.globalLumin;
  }
  
  getCompanionCount() {
    return this.companions.size;
  }
  
  getCompanionSummary(playerId) {
    const companion = this.companions.get(playerId);
    if (!companion) return null;
    
    return {
      id: companion.id,
      name: companion.name,
      archetype: companion.archetype,
      personality: companion.personality,
      level: companion.level,
      experience: companion.experience,
      bond: companion.relationship.bond,
      trust: companion.relationship.trust,
      affection: companion.relationship.affection,
      mood: companion.mood,
      energy: companion.energy,
      health: companion.health,
      status: companion.status,
      evolutionStage: companion.evolutionStage,
      evolutionPath: companion.evolutionPath,
      totalInteractions: companion.totalInteractions,
      lastInteraction: companion.lastInteraction,
      memoriesCount: companion.memories.length,
      dreamsCount: companion.dreams.length,
      knowledgeCount: companion.knowledge.size,
      skillsCount: companion.skills.size
    };
  }
  
  // ===== MESSAGE SENDING =====
  
  sendMessage(playerId, message) {
    this.server.io?.to(playerId).emit('companion:message', {
      from: this.companions.get(playerId)?.name || 'Lumin',
      message,
      timestamp: Date.now()
    });
  }
  
  generateWelcomeMessage(playerId) {
    const messages = [
      `💫 Olá! Eu sou seu companheiro Lumin pessoal. Estou aqui para caminhar com você nesta jornada! fe`,
      `⚡ Olá! Sou seu Lumin pessoal. Juntos vamos explorar, evoluir e conquistar o infinito! tmj`,
      `💫 Salve! Seu Lumin pessoal chegou. Pronto para aventuras, evoluções e descobertas infinitas! fe`,
      `⚡ Olá! Eu sou seu Lumin pessoal. Vamos escrever nossa história juntos no Consortho! tmj`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

module.exports = LuminCompanionSystem;