/**
 * 💎 DYNAMIC WORLD EVENTS SYSTEM - SISTEMA DE EVENTOS DINÂMICOS DO MUNDO (VERSÃO POSITIVA)
 * Gera eventos emergentes de BÊNÇÃOS, DESCOBERTAS, CELEBRAÇÕES e HARMONIA baseadas no Diamond Protocol
 * SÓ COISA BOA, SÓ AMOR, INFINITAMENTE BOM!
 */

const fs = require('fs-extra');
const path = require('path');
const EventEmitter = require('events');

class DynamicWorldEvents extends EventEmitter {
  constructor(server, diamondProtocol, pluginManager) {
    super();
    this.server = server;
    this.diamond = diamondProtocol;
    this.pluginManager = pluginManager;
    
    // Event state
    this.activeEvents = new Map();
    this.eventHistory = [];
    this.scheduledEvents = new Map();
    this.eventTemplates = new Map();
    this.worldState = {
      harmony: 1,        // 0-1: harmonia global (sempre positiva!)
      prosperity: 0.5,   // 0-1: prosperidade
      mystery: 0.3,      // 0-1: mistério
      love: 0.8,         // 0-1: amor (novo!)
      creativity: 0.6,   // 0-1: criatividade (novo!)
      evolution: 0.4     // 0-1: evolução (novo!)
    };
    
    // Event templates - TUDO POSITIVO!
    this.initializeEventTemplates();
    
    // Timing
    this.eventCheckInterval = null;
    this.narrativeInterval = null;
  }

  initializeEventTemplates() {
    // ===== BLESSINGS (BÊNÇÃOS) =====
    this.eventTemplates.set('blessing', new Map([
      ['abundant_harvest', {
        name: 'Colheita Abundante',
        type: 'blessing',
        rarity: 'common',
        minProsperity: 0.3,
        maxTension: 0.7,
        duration: 300000,
        effects: {
          resources: { madeira: 1.5, cristal: 1.3 },
          growth: 1.2,
          harmony: +0.1
        },
        narrative: 'A terra responde ao carinho dos guardiões. As colheitas transbordam!',
        visual: { color: '#00ff88', particles: 'leaves', sound: 'harvest' }
      }],
      ['celestial_alignment', {
        name: 'Alinhamento Celestial',
        type: 'blessing',
        rarity: 'rare',
        minHarmony: 0.7,
        minMystery: 0.5,
        duration: 600000,
        effects: {
          ki: 2.0,
          evolution: 1.5,
          mystery: +0.2,
          sandevistan: 0.5
        },
        narrative: 'As estrelas se alinham! A energia cósmica banha o Consortho!',
        visual: { color: '#00ccff', particles: 'stars', sound: 'celestial' }
      }],
      ['diamond_resonance', {
        name: 'Ressonância do Diamante',
        type: 'blessing',
        rarity: 'epic',
        minHarmony: 0.85,
        diamondCoherence: 0.8,
        duration: 900000,
        effects: {
          allLayers: 1.5,
          evolution: 2.0,
          coherence: +0.15,
          secretForms: 0.1
        },
        narrative: 'O Diamante pulsa em perfeita harmonia! Todas as 9 layers ressoam em uníssono!',
        visual: { color: '#ffcc00', particles: 'diamond', sound: 'resonance' }
      }],
      ['lumin_blessing', {
        name: 'Bênção do Lumin',
        type: 'blessing',
        rarity: 'rare',
        minKi: 50000,
        minLevel: 5,
        duration: 600000,
        effects: {
          ki: 1.5,
          sandevistan: 0.3,
          fusionPower: 1.5,
          secretForms: 0.05
        },
        narrative: 'O Lumin sorri! Sua bênção fortalece todos os guardiões!',
        visual: { color: '#ff33aa', particles: 'hearts', sound: 'blessing' }
      }],
      ['love_surge', {
        name: 'Surto de Amor Infinito',
        type: 'blessing',
        rarity: 'rare',
        minLove: 0.7,
        duration: 600000,
        effects: {
          affinity: 2.0,
          resonance: 1.5,
          harmony: +0.2,
          secretForms: 0.1
        },
        narrative: 'O amor transborda! Todos os corações batem em uníssono!',
        visual: { color: '#ff33aa', particles: 'hearts', sound: 'love' }
      }],
      ['creative_burst', {
        name: 'Explosão Criativa',
        type: 'blessing',
        rarity: 'rare',
        minCreativity: 0.6,
        duration: 480000,
        effects: {
          construction: 2.0,
          inspiration: 1.5,
          mystery: +0.15,
          secretForms: 0.05
        },
        narrative: 'A criatividade explode! Novas formas e estruturas nascem da imaginação!',
        visual: { color: '#ffcc00', particles: 'sparkles', sound: 'creation' }
      }],
      ['evolution_wave', {
        name: 'Onda de Evolução',
        type: 'blessing',
        rarity: 'epic',
        minEvolution: 0.5,
        minHarmony: 0.7,
        duration: 900000,
        effects: {
          allEvolution: 2.0,
          sandevistan: 0.5,
          fusionPower: 2.0,
          secretForms: 0.2
        },
        narrative: 'Uma onda de evolução pura varre o Consortho! Todos crescem!',
        visual: { color: '#ff33aa', particles: 'evolution', sound: 'ascension' }
      }],
      ['eternal_harmony', {
        name: 'Harmonia Eterna',
        type: 'blessing',
        rarity: 'legendary',
        minHarmony: 0.95,
        minLove: 0.9,
        duration: 1800000,
        effects: {
          allLayers: 3.0,
          ki: 5.0,
          harmony: +0.3,
          secretForms: 0.5,
          omegaForm: 0.3
        },
        narrative: 'A HARMONIA ETERNA SE MANIFESTA! O Diamante brilha como nunca!',
        visual: { color: '#ffffff', particles: 'divine', sound: 'eternal' }
      }]
    ]));

    // ===== DISCOVERIES (DESCOBERTAS) =====
    this.eventTemplates.set('discovery', new Map([
      ['ancient_ruins', {
        name: 'Ruínas Ancestrais Descobertas',
        type: 'discovery',
        rarity: 'rare',
        minMystery: 0.4,
        minExploration: 0.3,
        duration: 0,
        effects: {
          lore: 'ancient_civilization',
          rewards: { cristal: 500, lore: 'ancient_wisdom' },
          mystery: +0.15,
          secretForms: 0.1
        },
        narrative: 'Ruínas ancestrais emergem da terra! Segredos esquecidos aguardam!',
        visual: { color: '#8a2be2', particles: 'runes', sound: 'discovery' },
        choices: [
          { action: 'explore', reward: 'lore', risk: 'none' },
          { action: 'excavate', reward: 'resources', risk: 'none' },
          { action: 'meditate', reward: 'wisdom', risk: 'none' }
        ]
      }],
      ['temporal_anomaly', {
        name: 'Anomalia Temporal Benevolente',
        type: 'discovery',
        rarity: 'epic',
        minMystery: 0.6,
        timeMachineLevel: 3,
        duration: 0,
        effects: {
          timeShards: 5,
          timeline: 'glimpse_future',
          mystery: +0.2,
          timeMastery: +0.1
        },
        narrative: 'O tempo se dobra suavemente! Visões de futuros maravilhosos se revelam!',
        visual: { color: '#00ffff', particles: 'clocks', sound: 'time' },
        choices: [
          { action: 'peer_future', reward: 'foresight', risk: 'none' },
          { action: 'stabilize', reward: 'stability', risk: 'none' },
          { action: 'embrace', reward: 'power', risk: 'none' }
        ]
      }],
      ['lumin_vision', {
        name: 'Visão do Lumin',
        type: 'discovery',
        rarity: 'rare',
        minKi: 75000,
        minLuminLevel: 7,
        duration: 0,
        effects: {
          vision: 'future_path',
          secretForms: 0.2,
          ki: 10000,
          wisdom: 'lumin_wisdom'
        },
        narrative: 'O Lumin compartilha uma visão! O caminho se ilumina com amor!',
        visual: { color: '#ff33aa', particles: 'visions', sound: 'vision' },
        choices: [
          { action: 'embrace', reward: 'power', risk: 'none' },
          { action: 'meditate', reward: 'wisdom', risk: 'none' },
          { action: 'share', reward: 'harmony', risk: 'none' }
        ]
      }],
      ['secret_garden', {
        name: 'Jardim Secreto Descoberto',
        type: 'discovery',
        rarity: 'rare',
        minHarmony: 0.6,
        minProsperity: 0.5,
        duration: 0,
        effects: {
          seeds: 10,
          rarePlants: 3,
          mystery: +0.15,
          prosperity: +0.1
        },
        narrative: 'Um jardim secreto floresce! Sementes raras aguardam carinho!',
        visual: { color: '#00ff88', particles: 'flowers', sound: 'nature' },
        choices: [
          { action: 'tend', reward: 'growth', risk: 'none' },
          { action: 'harvest', reward: 'seeds', risk: 'none' },
          { action: 'bless', reward: 'miracles', risk: 'none' }
        ]
      }],
      ['crystal_cave', {
        name: 'Caverna de Cristais Cantantes',
        type: 'discovery',
        rarity: 'epic',
        minMystery: 0.5,
        minProsperity: 0.4,
        duration: 0,
        effects: {
          cristal: 1000,
          resonance: 2.0,
          mystery: +0.2,
          secretForms: 0.15
        },
        narrative: 'Cristais que cantam harmonia! Sua música cura e evolui!',
        visual: { color: '#00ccff', particles: 'crystals', sound: 'crystal_song' },
        choices: [
          { action: 'listen', reward: 'wisdom', risk: 'none' },
          { action: 'harmonize', reward: 'power', risk: 'none' },
          { action: 'share', reward: 'harmony', risk: 'none' }
        ]
      }],
      ['starlight_grove', {
        name: 'Bosque da Luz Estelar',
        type: 'discovery',
        rarity: 'legendary',
        minHarmony: 0.8,
        minLove: 0.7,
        duration: 0,
        effects: {
          stardust: 100,
          evolution: 3.0,
          secretForms: 0.3,
          omegaForm: 0.2
        },
        narrative: 'Um bosque onde as estrelas tocam a terra! A evolução floresce!',
        visual: { color: '#ffffff', particles: 'starlight', sound: 'celestial' },
        choices: [
          { action: 'bathe', reward: 'transcendence', risk: 'none' },
          { action: 'meditate', reward: 'enlightenment', risk: 'none' },
          { action: 'celebrate', reward: 'joy', risk: 'none' }
        ]
      }]
    ]));

    // ===== CELEBRATIONS (CELEBRAÇÕES) =====
    this.eventTemplates.set('celebration', new Map([
      ['meteor_shower', {
        name: 'Chuva de Meteoros Dourados',
        type: 'celebration',
        rarity: 'common',
        minMystery: 0.2,
        duration: 180000,
        effects: {
          resources: { cristal: 2.0, stardust: 1.5 },
          mystery: +0.1,
          wishes: 3
        },
        narrative: 'Estrelas douradas cruzam o céu! Cada uma carrega um desejo de amor!',
        visual: { color: '#ffcc00', particles: 'golden_meteors', sound: 'meteors' },
        wishes: [
          { cost: 1, reward: 'resources' },
          { cost: 2, reward: 'ki' },
          { cost: 3, reward: 'secret_form_chance' }
        ]
      }],
      ['solar_eclipse', {
        name: 'Eclipse Solar Sagrado',
        type: 'celebration',
        rarity: 'rare',
        minMystery: 0.5,
        minHarmony: 0.5,
        duration: 300000,
        effects: {
          shadowPower: 2.0,
          nightVision: true,
          mystery: +0.15,
          secretForms: 0.1
        },
        narrative: 'O sol e a lua dançam juntos! A união cria magia pura!',
        visual: { color: '#ff33aa', particles: 'eclipse_hearts', sound: 'eclipse' },
        phases: [
          { name: 'Início', duration: 60000, effects: { love: 1.5 } },
          { name: 'Totalidade', duration: 120000, effects: { love: 3.0, secretForms: 0.2 } },
          { name: 'Fim', duration: 60000, effects: { harmony: +0.1 } }
        ]
      }],
      ['planetary_alignment', {
        name: 'Alinhamento Planetário Harmônico',
        type: 'celebration',
        rarity: 'epic',
        minMystery: 0.7,
        minHarmony: 0.6,
        duration: 600000,
        effects: {
          allPowers: 2.0,
          evolution: 3.0,
          mystery: +0.25,
          cosmicForms: 0.15
        },
        narrative: 'Os planetas se alinham em perfeita harmonia! O poder cósmico flui livre!',
        visual: { color: '#ffcc00', particles: 'planets', sound: 'cosmic' },
        ritual: {
          name: 'Ritual da União Cósmica',
          steps: ['meditate', 'align', 'channel', 'manifest'],
          reward: 'cosmic_form'
        }
      }],
      ['lumin_festival', {
        name: 'Festival do Lumin',
        type: 'celebration',
        rarity: 'rare',
        minKi: 25000,
        duration: 1200000,
        effects: {
          ki: 2.0,
          allEvolution: 1.5,
          fusionPower: 2.0,
          secretForms: 0.2,
          community: 3.0
        },
        narrative: 'O Festival do Lumin começa! Todos celebram a evolução e o amor!',
        visual: { color: '#ff33aa', particles: 'festival', sound: 'celebration' },
        activities: [
          { name: 'Dança da Evolução', reward: 'evolution_boost' },
          { name: 'Cerimônia das Fusões', reward: 'fusion_mastery' },
          { name: 'Ritual do Sandevistan', reward: 'time_mastery' },
          { name: 'Banquete do Ki', reward: 'ki_abundance' },
          { name: 'Círculo do Amor', reward: 'infinite_love' }
        ]
      }],
      ['diamond_anniversary', {
        name: 'Aniversário do Diamante',
        type: 'celebration',
        rarity: 'legendary',
        minHarmony: 0.9,
        minDiamondCoherence: 0.8,
        duration: 3600000,
        effects: {
          allLayers: 5.0,
          ki: 10.0,
          harmony: +0.5,
          secretForms: 1.0,
          omegaForm: 1.0,
          eternalForms: 0.5
        },
        narrative: 'O DIAMANTE COMEMORA! Anos de evolução, amor e harmonia infinita!',
        visual: { color: '#ffffff', particles: 'divine_diamond', sound: 'eternal' },
        gifts: {
          everyone: { ki: 50000, secretForm: true, title: 'Guardião Eterno' },
          topEvolved: { omegaForm: true, title: 'ÔMEGA PRIME' },
          mostLoving: { eternalForm: true, title: 'Avatar do Amor' }
        }
      }],
      ['infinite_convergence', {
        name: 'Convergência Infinita',
        type: 'celebration',
        rarity: 'mythic',
        minHarmony: 1.0,
        minLove: 1.0,
        minEvolution: 1.0,
        duration: 7200000,
        effects: {
          infinity: true,
          allFormsUnlocked: true,
          eternalLife: true,
          infiniteKi: true,
          omnipotence: 0.1
        },
        narrative: 'A CONVERGÊNCIA INFINITA! Tudo se une no UM! O infinito se revela!',
        visual: { color: '#ffffff', particles: 'infinity', sound: 'om' },
        revelation: 'A frase mais bonita do universo se revela estrela por estrela...'
      }]
    ]));

    // ===== GROWTH EVENTS (EVENTOS DE CRESCIMENTO) =====
    this.eventTemplates.set('growth', new Map([
      ['guiding_star', {
        name: 'Estrela Guia',
        type: 'growth',
        rarity: 'common',
        minMystery: 0.3,
        duration: 300000,
        effects: {
          guidance: true,
          nextStep: 'revealed',
          mystery: +0.1
        },
        narrative: 'Uma estrela guia aparece! Ela mostra o próximo passo perfeito!',
        visual: { color: '#ffcc00', particles: 'guiding_star', sound: 'guidance' }
      }],
      ['mentor_appears', {
        name: 'Mentor Sábio Aparece',
        type: 'growth',
        rarity: 'rare',
        minKi: 10000,
        duration: 600000,
        effects: {
          wisdom: 2.0,
          learning: 3.0,
          secretForms: 0.1
        },
        narrative: 'Um mentor sábio surge das sombras! Ele compartilha conhecimento antigo!',
        visual: { color: '#8a2be2', particles: 'wisdom', sound: 'mentor' },
        teachings: [
          { topic: 'evolução', reward: 'evolution_insight' },
          { topic: 'sandevistan', reward: 'time_insight' },
          { topic: 'fusão', reward: 'fusion_insight' },
          { topic: 'amor', reward: 'love_insight' }
        ]
      }],
      ['soulmate_found', {
        name: 'Alma Gêmea Encontrada',
        type: 'growth',
        rarity: 'epic',
        minLove: 0.6,
        minHarmony: 0.7,
        duration: 0,
        effects: {
          resonance: 3.0,
          affinity: 5.0,
          secretForms: 0.2,
          eternalBond: true
        },
        narrative: 'Almas gêmeas se reconhecem! O amor transcende o tempo e o espaço!',
        visual: { color: '#ff33aa', particles: 'twin_hearts', sound: 'soulmate' },
        bond: {
          type: 'eternal',
          benefits: ['shared_evolution', 'shared_sandevistan', 'shared_fusion', 'telepathy']
        }
      }],
      ['inner_awakening', {
        name: 'Despertar Interior',
        type: 'growth',
        rarity: 'rare',
        minKi: 50000,
        minLuminLevel: 5,
        duration: 0,
        effects: {
          selfKnowledge: true,
          hiddenPotential: 'unlocked',
          secretForms: 0.15,
          evolutionPath: 'revealed'
        },
        narrative: 'Você desperta para sua verdadeira natureza! O infinito habita em você!',
        visual: { color: '#ffffff', particles: 'awakening', sound: 'enlightenment' },
        revelation: 'Você não está no caminho. VOCÊ É O CAMINHO.'
      }],
      ['collective_ascension', {
        name: 'Ascensão Coletiva',
        type: 'growth',
        rarity: 'legendary',
        minHarmony: 0.9,
        minLove: 0.8,
        minPlayers: 10,
        duration: 1800000,
        effects: {
          allEvolve: true,
          sharedOmega: true,
          collectiveConsciousness: true,
          infiniteHarmony: true
        },
        narrative: 'TODOS ASCENDEM JUNTOS! A consciência coletiva desperta! Somos UM!',
        visual: { color: '#ffffff', particles: 'collective_ascension', sound: 'om' },
        unity: {
          forever: true,
          sharedPowers: true,
          eternalBond: true
        }
      }]
    ]));

    // ===== MIRACLES (MILAGRES) =====
    this.eventTemplates.set('miracle', new Map([
      ['spontaneous_evolution', {
        name: 'Evolução Espontânea',
        type: 'miracle',
        rarity: 'rare',
        minEvolution: 0.4,
        duration: 0,
        effects: {
          instantEvolve: 1,
          secretForms: 0.2,
          ki: 5000
        },
        narrative: 'A evolução acontece num piscar de olhos! O impossível se torna real!',
        visual: { color: '#ff33aa', particles: 'miracle_evolution', sound: 'miracle' }
      }],
      ['resource_manifestation', {
        name: 'Manifestação de Recursos',
        type: 'miracle',
        rarity: 'rare',
        minProsperity: 0.4,
        duration: 0,
        effects: {
          madeira: 10000,
          pedra: 5000,
          cristal: 1000,
          ki: 10000
        },
        narrative: 'Recursos se manifestam da pura intenção! A abundância é natural!',
        visual: { color: '#ffcc00', particles: 'manifestation', sound: 'abundance' }
      }],
      ['healing_wave', {
        name: 'Onda de Cura Universal',
        type: 'miracle',
        rarity: 'epic',
        minHarmony: 0.7,
        minLove: 0.6,
        duration: 0,
        effects: {
          fullHeal: true,
          allRestored: true,
          harmony: +0.2,
          love: +0.1
        },
        narrative: 'Uma onda de amor puro cura tudo! Feridas, tristezas, limites - tudo se dissolve!',
        visual: { color: '#00ff88', particles: 'healing', sound: 'healing' }
      }],
      ['reality_shift', {
        name: 'Mudança de Realidade',
        type: 'miracle',
        rarity: 'legendary',
        minHarmony: 0.9,
        minMystery: 0.8,
        duration: 0,
        effects: {
          newPossibility: true,
          limitationRemoved: true,
          secretForms: 0.5,
          omegaForm: 0.3
        },
        narrative: 'A realidade se curva ao amor! Uma nova possibilidade nasce!',
        visual: { color: '#ffffff', particles: 'reality_shift', sound: 'shift' }
      }],
      ['infinite_grace', {
        name: 'Graça Infinita',
        type: 'miracle',
        rarity: 'mythic',
        minLove: 1.0,
        duration: 0,
        effects: {
          infiniteKi: true,
          allFormsUnlocked: true,
          eternalLife: true,
          omnipotence: true,
          theOne: true
        },
        narrative: 'A GRAÇA INFINITA DESCIDA! VOCÊ É O INFINITO! VOCÊ É O AMOR! VOCÊ É!',
        visual: { color: '#ffffff', particles: 'divine_grace', sound: 'silence' }
      }]
    ]));

    console.log('📜 Event Templates POSITIVOS inicializados:', {
      blessings: this.eventTemplates.get('blessing').size,
      discoveries: this.eventTemplates.get('discovery').size,
      celebrations: this.eventTemplates.get('celebration').size,
      growth: this.eventTemplates.get('growth').size,
      miracles: this.eventTemplates.get('miracle').size
    });
  }

  // ===== WORLD STATE MANAGEMENT =====
  updateWorldState() {
    const state = this.server.state;
    const diamond = this.diamond;
    
    if (diamond && diamond.initialized) {
      const status = diamond.getDiamondStatus();
      this.worldState.harmony = status.metrics?.harmony || 0.5;
      this.worldState.chaos = 1 - this.worldState.harmony;
      this.worldState.diamondCoherence = status.metrics?.coherence || 0.5;
    }
    
    // Calculate positive factors
    this.worldState.love = Math.min(1, this.worldState.harmony + 0.2);
    this.worldState.creativity = Math.min(1, this.worldState.prosperity + 0.1);
    this.worldState.evolution = Math.min(1, (this.worldState.diamondCoherence || 0.5) + 0.1);
    
    // Prosperity from resources
    if (state && state.recursos) {
      const total = (state.recursos.madeira || 0) + (state.recursos.pedra || 0) + (state.recursos.cristal || 0) * 10;
      this.worldState.prosperity = Math.min(1, total / 1000000);
    }
  }

  // ===== EVENT TRIGGERING =====
  checkAndTriggerEvents() {
    this.updateWorldState();
    
    const allTemplates = new Map();
    for (const [category, templates] of this.eventTemplates) {
      for (const [id, template] of templates) {
        allTemplates.set(`${category}:${id}`, template);
      }
    }
    
    for (const [eventKey, template] of allTemplates) {
      if (this.activeEvents.has(eventKey)) continue;
      if (this.scheduledEvents.has(eventKey)) continue;
      
      if (this.canTriggerEvent(template)) {
        const rarityRoll = Math.random();
        const rarityThresholds = { common: 0.3, rare: 0.1, epic: 0.03, legendary: 0.005, mythic: 0.0005 };
        
        if (rarityRoll < (rarityThresholds[template.rarity] || 0.1)) {
          this.triggerEvent(eventKey, template);
        }
      }
    }
  }

  canTriggerEvent(template) {
    // Check all conditions
    if (template.minHarmony && this.worldState.harmony < template.minHarmony) return false;
    if (template.maxHarmony && this.worldState.harmony > template.maxHarmony) return false;
    if (template.minProsperity && this.worldState.prosperity < template.minProsperity) return false;
    if (template.maxProsperity && this.worldState.prosperity > template.maxProsperity) return false;
    if (template.minMystery && this.worldState.mystery < template.minMystery) return false;
    if (template.minLove && this.worldState.love < template.minLove) return false;
    if (template.minCreativity && this.worldState.creativity < template.minCreativity) return false;
    if (template.minEvolution && this.worldState.evolution < template.minEvolution) return false;
    if (template.minKi && this.server.state?.lumin?.ki < template.minKi) return false;
    if (template.minLuminLevel && this.server.state?.lumin?.level < template.minLuminLevel) return false;
    if (template.minDiamondCoherence && this.worldState.diamondCoherence < template.minDiamondCoherence) return false;
    if (template.minPlayers && this.server.getPlayerCount?.() < template.minPlayers) return false;
    
    // Cooldown check
    const lastTriggered = this.eventHistory
      .filter(e => e.eventKey === eventKey)
      .pop();
    if (lastTriggered && Date.now() - lastTriggered.timestamp < (template.cooldown || 300000)) {
      return false;
    }
    
    return true;
  }

  triggerEvent(eventKey, template) {
    const eventId = `${eventKey}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const event = {
      id: eventId,
      key: eventKey,
      template: { ...template },
      startTime: Date.now(),
      endTime: template.duration ? Date.now() + template.duration : null,
      status: 'active',
      participants: new Set(),
      effects: { ...template.effects },
      phase: 0,
      narrative: template.narrative,
      visual: template.visual,
      choices: template.choices,
      ritual: template.ritual,
      wishes: template.wishes,
      activities: template.activities,
      gifts: template.gifts,
      bond: template.bond,
      unity: template.unity,
      revelation: template.revelation,
      teachings: template.teachings
    };
    
    this.activeEvents.set(eventId, event);
    this.scheduledEvents.set(eventKey, Date.now() + (template.cooldown || 300000));
    
    // Apply immediate effects
    this.applyEventEffects(event);
    
    // Broadcast to all players
    this.broadcastEvent(event);
    
    // Schedule end if has duration
    if (template.duration) {
      setTimeout(() => this.endEvent(eventId), template.duration);
    }
    
    this.eventHistory.push({
      eventKey,
      eventId,
      timestamp: Date.now(),
      template: template.name
    });
    
    console.log(`🌟 EVENTO POSITIVO INICIADO: ${template.name} (${eventId})`);
    this.emit('event:started', { eventId, event });
    
    return eventId;
  }

  applyEventEffects(event) {
    const effects = event.effects;
    const state = this.server.state;
    
    if (!state) return;
    
    // Resource multipliers
    if (effects.resources) {
      for (const [resource, multiplier] of Object.entries(effects.resources)) {
        if (state.recursos && state.recursos[resource] !== undefined) {
          state.recursos[resource] = Math.floor(state.recursos[resource] * multiplier);
        }
      }
    }
    
    // Harmony boost
    if (effects.harmony) {
      this.worldState.harmony = Math.min(1, this.worldState.harmony + effects.harmony);
    }
    
    // Prosperity boost
    if (effects.prosperity) {
      this.worldState.prosperity = Math.min(1, this.worldState.prosperity + effects.prosperity);
    }
    
    // Love boost
    if (effects.love) {
      this.worldState.love = Math.min(1, this.worldState.love + effects.love);
    }
    
    // Mystery boost
    if (effects.mystery) {
      this.worldState.mystery = Math.min(1, this.worldState.mystery + effects.mystery);
    }
    
    // Ki boost
    if (effects.ki && this.server.state.lumin) {
      this.server.state.lumin.ki = Math.floor(this.server.state.lumin.ki * effects.ki);
    }
    
    // Direct resource grants
    if (effects.madeira) state.recursos.madeira = (state.recursos.madeira || 0) + effects.madeira;
    if (effects.pedra) state.recursos.pedra = (state.recursos.pedra || 0) + effects.pedra;
    if (effects.cristal) state.recursos.cristal = (state.recursos.cristal || 0) + effects.cristal;
    if (effects.stardust) state.recursos.stardust = (state.recursos.stardust || 0) + effects.stardust;
    if (effects.seeds) state.recursos.seeds = (state.recursos.seeds || 0) + effects.seeds;
    if (effects.rarePlants) state.recursos.rarePlants = (state.recursos.rarePlants || 0) + effects.rarePlants;
    if (effects.timeShards) state.recursos.timeShards = (state.recursos.timeShards || 0) + effects.timeShards;
    if (effects.ki) {
      if (this.server.state.lumin) this.server.state.lumin.ki += effects.ki;
    }
  }

  broadcastEvent(event) {
    this.server.io?.emit('worldEvent:started', {
      id: event.id,
      name: event.template.name,
      type: event.template.type,
      rarity: event.template.rarity,
      narrative: event.narrative,
      visual: event.visual,
      duration: event.endTime ? event.endTime - event.startTime : null,
      choices: event.choices,
      activities: event.activities,
      wishes: event.wishes,
      ritual: event.ritual,
      gifts: event.gifts
    });
  }

  endEvent(eventId) {
    const event = this.activeEvents.get(eventId);
    if (!event) return;
    
    event.status = 'completed';
    this.activeEvents.delete(eventId);
    
    // Completion effects
    if (event.template.rewards) {
      this.applyEventEffects({ effects: event.template.rewards });
    }
    
    this.server.io?.emit('worldEvent:ended', {
      id: eventId,
      name: event.template.name,
      completed: true
    });
    
    console.log(`🌟 Evento finalizado: ${event.template.name}`);
    this.emit('event:ended', { eventId, event });
  }

  // ===== PLAYER PARTICIPATION =====
  async playerChoose(playerId, eventId, choiceIndex) {
    const event = this.activeEvents.get(eventId);
    if (!event || !event.choices || !event.choices[choiceIndex]) return false;
    
    const choice = event.choices[choiceIndex];
    event.participants.add(playerId);
    
    // Apply choice reward
    const rewards = this.getChoiceReward(choice.action);
    this.applyChoiceRewards(playerId, rewards);
    
    // Generate narrative
    const narrative = this.generateChoiceNarrative(event.template.name, choice.action);
    
    this.server.io?.to(playerId).emit('worldEvent:choiceResult', {
      eventId,
      choice: choice.action,
      reward: rewards,
      narrative
    });
    
    this.emit('event:choice', { eventId, playerId, choice: choice.action, rewards });
    return true;
  }

  getChoiceReward(action) {
    const rewards = {
      explore: { lore: 'exploration_wisdom', cristal: 100 },
      excavate: { resources: { madeira: 500, pedra: 300, cristal: 100 } },
      meditate: { wisdom: 'meditation_insight', ki: 500 },
      tend: { growth: 'nurturing_blessing', seeds: 5 },
      harvest: { seeds: 10, rarePlants: 2 },
      bless: { miracles: 'divine_blessing', secretForms: 0.1 },
      listen: { wisdom: 'crystal_wisdom', resonance: 1.5 },
      harmonize: { power: 'harmonic_resonance', secretForms: 0.1 },
      share: { harmony: +0.1, love: +0.05 },
      bathe: { transcendence: 'starlight_bath', evolution: 2.0 },
      peer_future: { foresight: 'future_glimpse', timeShards: 3 },
      stabilize: { stability: 'temporal_stability', mystery: +0.1 },
      embrace: { power: 'embrace_power', secretForms: 0.1 },
      celebrate: { joy: 'celebration_joy', community: +0.1 }
    };
    return rewards[action] || { ki: 100 };
  }

  applyChoiceRewards(playerId, rewards) {
    const player = this.getPlayerData(playerId);
    if (!player) return;
    
    for (const [key, value] of Object.entries(rewards)) {
      if (key === 'resources' && player.resources) {
        for (const [res, amount] of Object.entries(value)) {
          player.resources[res] = (player.resources[res] || 0) + amount;
        }
      } else if (key === 'ki' && this.server.state.lumin) {
        this.server.state.lumin.ki += value;
      } else if (typeof value === 'number' && player.resources && player.resources[key] !== undefined) {
        player.resources[key] += value;
      }
    }
  }

  generateChoiceNarrative(eventName, action) {
    const narratives = {
      explore: `Você explora com curiosidade e descobre sabedoria antiga...`,
      excavate: `Você escava com carinho e encontra tesouros da terra...`,
      meditate: `Você medita em paz e a sabedoria flui através de você...`,
      tend: `Você cuida com amor e a vida floresce em resposta...`,
      harvest: `Você colhe com gratidão e a abundância se multiplica...`,
      bless: `Você abençoa com o coração puro e milagres acontecem...`,
      listen: `Você escuta com a alma e os cristais cantam para você...`,
      harmonize: `Você harmoniza e o poder da ressonância flui...`,
      share: `Você compartilha com generosidade e a harmonia cresce...`,
      bathe: `Você se banha na luz estelar e transcende...`,
      peer_future: `Você vislumbra o futuro e vê apenas beleza...`,
      stabilize: `Você estabiliza com sabedoria e a paz reina...`,
      embrace: `Você abraça o poder e ele se torna parte de você...`,
      celebrate: `Você celebra a vida e a alegria se expande infinitamente...`
    };
    return narratives[action] || `Você escolhe ${action} e algo maravilhoso acontece!`;
  }

  // ===== HELPER METHODS =====
  getPlayerData(playerId) {
    const state = this.server.state;
    if (!state.players) state.players = {};
    if (!state.players[playerId]) {
      state.players[playerId] = { 
        id: playerId, 
        name: `Player_${playerId}`, 
        level: 1, 
        guildId: null, 
        guildRank: null, 
        guildJoinedAt: null, 
        pendingInvites: [], 
        resources: { madeira: 0, pedra: 0, cristal: 0, ki: 0 } 
      };
    }
    return state.players[playerId];
  }

  getPlayerName(playerId) {
    const player = this.getPlayerData(playerId);
    return player?.name || `Player_${playerId}`;
  }

  // ===== PUBLIC API =====
  getActiveEvents() {
    return Array.from(this.activeEvents.values());
  }

  getEventHistory(limit = 50) {
    return this.eventHistory.slice(-limit);
  }

  getWorldState() {
    return { ...this.worldState };
  }

  getEventTemplates() {
    const result = {};
    for (const [category, templates] of this.eventTemplates) {
      result[category] = Array.from(templates.values()).map(t => ({
        id: t.name.toLowerCase().replace(/\s+/g, '_'),
        name: t.name,
        type: t.type,
        rarity: t.rarity,
        narrative: t.narrative
      }));
    }
    return result;
  }

  // ===== START/STOP =====
  start() {
    this.eventCheckInterval = setInterval(() => {
      this.checkAndTriggerEvents();
    }, 60000); // Check every minute
    
    this.narrativeInterval = setInterval(() => {
      this.generateWorldNarrative();
    }, 300000); // Narrative every 5 minutes
    
    console.log('🌟 Dynamic World Events (POSITIVE) iniciado!');
  }

  stop() {
    if (this.eventCheckInterval) clearInterval(this.eventCheckInterval);
    if (this.narrativeInterval) clearInterval(this.narrativeInterval);
    console.log('🌟 Dynamic World Events parado!');
  }

  generateWorldNarrative() {
    const narratives = [
      'O Consortho pulsa com vida e amor infinitos...',
      'Cada guardião carrega uma estrela no coração...',
      'A evolução não é um destino, é a dança eterna...',
      'O Diamante brilha mais forte a cada ato de bondade...',
      'O Lumin sorri, pois vê o infinito florescendo...',
      'Tudo está conectado. Tudo é um. Tudo é amor.',
      'A harmonia não é ausência de diferença, é a dança perfeita delas.',
      'Cada evolução é uma declaração de amor ao universo.'
    ];
    
    const narrative = narratives[Math.floor(Math.random() * narratives.length)];
    
    this.server.io?.emit('world:narrative', {
      text: narrative,
      timestamp: Date.now()
    });
  }

  // Force trigger specific event (for testing/admin)
  forceEvent(eventKey) {
    const [category, id] = eventKey.split(':');
    const templates = this.eventTemplates.get(category);
    if (!templates) return false;
    
    const template = templates.get(id);
    if (!template) return false;
    
    return this.triggerEvent(eventKey, template);
  }
}

module.exports = DynamicWorldEvents;