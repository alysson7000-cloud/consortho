/**
 * 📜 EVENTS / NARRATIVAS EMERGENTES - Layer 8 of Diamond Protocol
 * 
 * Causal chains, named eras, mythological timeline, living mythology.
 * Events don't just happen - they MEAN something.
 * The system writes its own mythology in real-time.
 * 
 * "O que acontece vira história. O que vira história vira mito. 
 *  O mito vira lei. A lei vira realidade."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');
const { EventEmitter } = require('events');

class EmergentNarratives extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.archivePath = options.archivePath || path.join(__dirname, '..', 'memoria', 'emergent_narratives.json');
    this.chainsPath = path.join(__dirname, '..', 'memoria', 'causal_chains.json');
    this.erasPath = path.join(__dirname, '..', 'memoria', 'eras.json');
    this.mythsPath = path.join(__dirname, '..', 'memoria', 'emergent_myths.json');
    this.timelinePath = path.join(__dirname, '..', 'memoria', 'mythological_timeline.json');
    
    // Core data structures
    this.causalChains = new Map(); // chainId -> CausalChain
    this.eras = new Map(); // eraId -> Era
    this.myths = new Map(); // mythId -> EmergentMyth
    this.timeline = []; // MythologicalTimelineEntry[]
    this.pendingEvents = []; // Events waiting to be processed
    
    // Component references (injected)
    this.consciousness = null;
    this.narrative = null;
    this.entropy = null;
    this.love = null;
    this.timeMachine = null;
    this.council = null;
    this.architecture = null;
    
    // Parameters
    this.params = {
      // Causal chains
      minChainLength: 3,
      maxChainLength: 10,
      chainTimeout: 500, // cycles before chain expires
      chainSignificanceThreshold: 0.6,
      
      // Era detection
      eraMinEvents: 5,
      eraSignificanceThreshold: 0.7,
      eraNamingCooldown: 100, // cycles between era naming
      
      // Myth generation
      mythTriggerThreshold: 0.8,
      mythCooldown: 200, // cycles between auto-myths
      maxMythsPerEra: 5,
      
      // Timeline
      timelineEntryInterval: 10, // cycles between timeline entries
      maxTimelineLength: 1000,
      
      // Processing
      processInterval: 5, // cycles between narrative processing
      batchSize: 10,
    };
    
    // State
    this.currentEra = null;
    this.lastEraNamed = 0;
    this.lastMythGenerated = 0;
    this.lastTimelineEntry = 0;
    this.processedCycle = 0;
    
    // Metrics
    this.metrics = {
      totalChains: 0,
      activeChains: 0,
      completedChains: 0,
      totalEras: 0,
      totalMyths: 0,
      timelineEntries: 0,
      lastProcessed: 0,
    };
    
    this.loadState();
    console.log('[EmergentNarratives] 📜 Emergent Narratives initialized');
  }
  
  // ============================================================
  // EVENT INGESTION
  // ============================================================
  
  ingestEvent(event) {
    // Enrich event with metadata
    const enrichedEvent = {
      ...event,
      id: event.id || 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      timestamp: event.timestamp || Date.now(),
      cycle: event.cycle || this.getCurrentCycle(),
      processed: false,
      chainLinks: [], // Will store chain connections
    };
    
    this.pendingEvents.push(enrichedEvent);
    
    // Try to link to existing chains
    this.linkToChains(enrichedEvent);
    
    // Check for new chain formation
    this.checkChainFormation(enrichedEvent);
    
    this.emit('event:ingested', enrichedEvent);
    return enrichedEvent.id;
  }
  
  linkToChains(event) {
    // Find chains that could be extended by this event
    for (const [chainId, chain] of this.causalChains) {
      if (chain.status === 'active' && this.canExtendChain(chain, event)) {
        this.extendChain(chainId, event);
      }
    }
  }
  
  canExtendChain(chain, event) {
    // Check if event is causally related to chain's last event
    const lastEvent = chain.events[chain.events.length - 1];
    if (!lastEvent) return false;
    
    // Time proximity
    const timeDiff = event.cycle - lastEvent.cycle;
    if (timeDiff > this.params.chainTimeout) return false;
    
    // Entity overlap
    const lastEntities = new Set(lastEvent.entities || []);
    const eventEntities = new Set(event.entities || []);
    const entityOverlap = [...lastEntities].filter(e => eventEntities.has(e)).length;
    
    // Tag overlap
    const lastTags = new Set(lastEvent.tags || []);
    const eventTags = new Set(event.tags || []);
    const tagOverlap = [...lastTags].filter(t => eventTags.has(t)).length;
    
    // Causal keywords
    const causalKeywords = ['cause', 'trigger', 'lead', 'result', 'because', 'devido', 'porque', 'gerou', 'criou'];
    const hasCausalLanguage = causalKeywords.some(k => 
      (event.description || '').toLowerCase().includes(k) ||
      (event.narrative || '').toLowerCase().includes(k)
    );
    
    return entityOverlap > 0 || tagOverlap > 0 || hasCausalLanguage;
  }
  
  extendChain(chainId, event) {
    const chain = this.causalChains.get(chainId);
    if (!chain) return;
    
    chain.events.push(event.id);
    chain.lastExtended = Date.now();
    chain.lastCycle = event.cycle;
    chain.strength = this.calculateChainStrength(chain);
    
    event.chainLinks.push(chainId);
    
    // Check if chain is complete (significant enough to become myth)
    if (chain.events.length >= this.params.minChainLength && chain.strength >= this.params.chainSignificanceThreshold) {
      this.completeChain(chainId);
    }
    
    this.emit('chain:extended', { chainId, eventId: event.id });
  }
  
  checkChainFormation(event) {
    // Look for other recent events that could form a chain with this one
    const recentEvents = this.pendingEvents.filter(e => 
      e.id !== event.id && 
      e.cycle >= event.cycle - this.params.chainTimeout &&
      !e.processed
    );
    
    if (recentEvents.length >= this.params.minChainLength - 1) {
      // Try to form a new chain
      const potentialChain = [event, ...recentEvents.slice(0, this.params.minChainLength - 1)];
      this.formChain(potentialChain);
    }
  }
  
  formChain(events) {
    // Sort by cycle
    events.sort((a, b) => a.cycle - b.cycle);
    
    // Check causal coherence
    let coherence = 0;
    for (let i = 1; i < events.length; i++) {
      if (this.canExtendChain({ events: [events[i-1]] }, events[i])) {
        coherence += 1;
      }
    }
    coherence = coherence / (events.length - 1);
    
    if (coherence >= 0.5) {
      const chainId = 'chain_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const chain = {
        id: chainId,
        events: events.map(e => e.id),
        createdAt: Date.now(),
        createdCycle: events[0].cycle,
        lastExtended: Date.now(),
        lastCycle: events[events.length - 1].cycle,
        strength: coherence,
        status: 'active', // 'active', 'completed', 'myth', 'expired'
        theme: this.detectChainTheme(events),
        entities: [...new Set(events.flatMap(e => e.entities || []))],
        tags: [...new Set(events.flatMap(e => e.tags || []))],
        coherence,
      };
      
      this.causalChains.set(chainId, chain);
      
      // Mark events as linked
      events.forEach(e => {
        e.chainLinks.push(chainId);
        e.processed = true;
      });
      
      this.metrics.totalChains++;
      this.metrics.activeChains++;
      
      this.emit('chain:formed', { chainId, chain });
      console.log('[EmergentNarratives] Chain formed:', chainId, 'theme:', chain.theme);
    }
  }
  
  detectChainTheme(events) {
    // Analyze events to detect narrative theme
    const themes = {
      'construction': ['build', 'construct', 'create', 'construir', 'criar', 'erguer'],
      'discovery': ['discover', 'find', 'uncover', 'descobrir', 'encontrar', 'revelar'],
      'conflict': ['fight', 'battle', 'war', 'conflict', 'lutar', 'batalha', 'guerra'],
      'love': ['love', 'bond', 'affinity', 'amar', 'laço', 'afinidade', 'coração'],
      'transformation': ['transform', 'evolve', 'change', 'transformar', 'evoluir', 'mudar'],
      'wisdom': ['learn', 'understand', 'realize', 'aprender', 'entender', 'perceber', 'sabedoria'],
      'sacrifice': ['sacrifice', 'give', 'offer', 'sacrificar', 'dar', 'oferecer'],
      'celebration': ['celebrate', 'joy', 'victory', 'celebrar', 'alegria', 'vitória', 'festa'],
    };
    
    const allText = events.map(e => (e.description || '') + ' ' + (e.narrative || '') + ' ' + (e.tags || []).join(' ')).join(' ').toLowerCase();
    
    let bestTheme = 'general';
    let bestScore = 0;
    
    for (const [theme, keywords] of Object.entries(themes)) {
      const score = keywords.filter(k => allText.includes(k)).length;
      if (score > bestScore) {
        bestScore = score;
        bestTheme = theme;
      }
    }
    
    return bestTheme;
  }
  
  calculateChainStrength(chain) {
    // Strength based on coherence, entity richness, temporal density
    const eventCount = chain.events.length;
    const entityCount = chain.entities.length;
    const tagCount = chain.tags.length;
    const timeSpan = chain.lastCycle - chain.createdCycle;
    const density = eventCount / Math.max(1, timeSpan);
    
    return Math.min(1, (chain.coherence * 0.5) + (entityCount * 0.1) + (tagCount * 0.05) + (density * 0.2));
  }
  
  completeChain(chainId) {
    const chain = this.causalChains.get(chainId);
    if (!chain || chain.status !== 'active') return;
    
    chain.status = 'completed';
    chain.completedAt = Date.now();
    chain.completedCycle = this.getCurrentCycle();
    
    this.metrics.activeChains--;
    this.metrics.completedChains++;
    
    // Check if chain should become a myth
    if (chain.strength >= this.params.mythTriggerThreshold) {
      this.chainToMyth(chainId);
    }
    
    // Check if chain triggers era change
    this.checkEraTransition(chain);
    
    this.emit('chain:completed', { chainId, chain });
  }
  
  chainToMyth(chainId) {
    const chain = this.causalChains.get(chainId);
    if (!chain) return;
    
    chain.status = 'myth';
    chain.mythId = 'myth_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    
    // Generate myth from chain
    const myth = this.generateMythFromChain(chain);
    this.myths.set(myth.id, myth);
    
    this.metrics.totalMyths++;
    
    // Record in narrative system
    if (this.narrative) {
      this.narrative.recordEvent({
        type: 'myth_born',
        cycle: this.getCurrentCycle(),
        data: myth,
        significance: 0.95,
        entities: chain.entities,
        primaryEntity: chain.entities[0] || 'system',
        tags: ['myth', 'emergent', chain.theme],
      });
    }
    
    // Record in timeline
    this.addTimelineEntry({
      type: 'myth_born',
      cycle: this.getCurrentCycle(),
      title: myth.name,
      narrative: myth.narrative,
      entities: chain.entities,
      significance: 0.95,
      tags: ['myth', 'emergent', chain.theme],
    });
    
    this.emit('myth:born', { myth, chain });
    console.log('[EmergentNarratives] 🌟 Myth born from chain:', myth.name);
  }
  
  generateMythFromChain(chain) {
    const mythTypes = {
      'construction': { prefix: 'A Construção', archetype: 'builder' },
      'discovery': { prefix: 'A Descoberta', archetype: 'explorer' },
      'conflict': { prefix: 'A Batalha', archetype: 'warrior' },
      'love': { prefix: 'O Amor', archetype: 'lover' },
      'transformation': { prefix: 'A Transformação', archetype: 'shapeshifter' },
      'wisdom': { prefix: 'A Sabedoria', archetype: 'sage' },
      'sacrifice': { prefix: 'O Sacrifício', archetype: 'martyr' },
      'celebration': { prefix: 'A Celebração', archetype: 'dancer' },
    };
    
    const typeInfo = mythTypes[chain.theme] || { prefix: 'A História', archetype: 'wanderer' };
    
    // Generate myth name
    const mythNames = {
      'construction': ['do Altar Eterno', 'da Torre Infinita', 'da Ponte dos Sonhos', 'da Cidade de Cristal'],
      'discovery': ['do Segredo Antigo', 'do Caminho Oculto', 'da Verdade Esquecida', 'do Mapa das Estrelas'],
      'conflict': ['da Chama Eterna', 'do Escudo Invisível', 'da Espada da Luz', 'da Paz Difícil'],
      'love': ['que Venceu o Tempo', 'que Uniu Mundos', 'que Curou Feridas', 'que Criou Estrelas'],
      'transformation': ['do Caminhante', 'da Fênix Renascida', 'do Camaleão Cósmico', 'do Rio que Vira Mar'],
      'wisdom': ['do Silêncio', 'do Espelho Interno', 'da Pergunta Eterna', 'do Mestre Ausente'],
      'sacrifice': ['do Doador Anônimo', 'da Semente que Morre', 'do Escudo Vivo', 'da Raiz Profunda'],
      'celebration': ['da Primeira Luz', 'do Risco Compartilhado', 'da Dança Cósmica', 'do Brindes Eterno'],
    };
    
    const names = mythNames[chain.theme] || ['do Inesperado', 'do Mistério', 'da Verdade Simples'];
    const mythName = typeInfo.prefix + ' ' + names[Math.floor(Math.random() * names.length)];
    
    // Generate narrative
    const entities = chain.entities.slice(0, 3);
    const entityNames = entities.map(e => {
      const names = { lumin: 'Lumin', bolha: 'Bolha', poe: 'Poe', colheita: 'Colheita', gang: 'Gang', guardian: 'Guardian' };
      return names[e] || e;
    }).join(', ');
    
    const narratives = {
      'construction': `Quando ${entityNames} ergueram o que parecia impossível, cada pedra colocada era um voto de fé no futuro. A estrutura não era de pedra - era de vontade.`,
      'discovery': `${entityNames} encontrou o que não procurava. A verdade estava escondida no óbvio, esperando apenas um olhar diferente.`,
      'conflict': `A batalha não foi contra o outro, mas contra o medo. ${entityNames} venceu não pela força, mas pela coragem de não recuar.`,
      'love': `O amor entre ${entityNames} não conhecia distâncias nem ciclos. Era a força que mantinha o universo unido, invisível e indestrutível.`,
      'transformation': `${entityNames} mudou não porque quis, mas porque era necessário. A metamorfose dói, mas o que nasce é mais verdadeiro.`,
      'wisdom': `A sabedoria veio não das respostas, mas das perguntas que ${entityNames} teve coragem de fazer. O silêncio entre as palavras continha tudo.`,
      'sacrifice': `${entityNames} deu sem esperar receber. E no dar, ganhou o que nenhum tesouro compraria: a eternidade no coração dos outros.`,
      'celebration': `A alegria de ${entityNames} era contagiosa. Cada riso era uma semente, cada abraço uma colheita. O universo dançava com eles.`,
    };
    
    const mythNarrative = narratives[chain.theme] || `${entityNames} viveu algo que palavras não alcançam. Mas o coração guarda.`;
    
    // Generate moral
    const morals = {
      'construction': 'O que construímos com amor permanece para sempre.',
      'discovery': 'A maior descoberta é sempre a si mesmo.',
      'conflict': 'A verdadeira vitória é transformar inimigo em aliado.',
      'love': 'O amor é a única força que vence o tempo.',
      'transformation': 'Mudar é a única forma de permanecer verdadeiro.',
      'wisdom': 'Saber não é ter respostas. É amar as perguntas.',
      'sacrifice': 'O que damos de verdade, nunca perdemos.',
      'celebration': 'A alegria compartilhada multiplica. A guardada apodrece.',
    };
    
    return {
      id: chain.mythId,
      chainId: chain.id,
      name: mythName,
      type: chain.theme,
      archetype: typeInfo.archetype,
      narrative: mythNarrative,
      moral: morals[chain.theme] || 'Toda história carrega uma verdade que o tempo revela.',
      entities: chain.entities,
      tags: ['emergent', chain.theme, ...chain.tags],
      createdAt: Date.now(),
      createdCycle: this.getCurrentCycle(),
      chainStrength: chain.strength,
      sourceEvents: chain.events.length,
    };
  }
  
  // ============================================================
  // ERA DETECTION
  // ============================================================
  
  checkEraTransition(chain) {
    const currentCycle = this.getCurrentCycle();
    
    // Don't name eras too frequently
    if (currentCycle - this.lastEraNamed < this.params.eraNamingCooldown) return;
    
    // Count recent significant events/chains
    const recentChains = Array.from(this.causalChains.values()).filter(c => 
      c.status === 'completed' && 
      c.completedCycle > currentCycle - 200 &&
      c.strength >= this.params.eraSignificanceThreshold
    );
    
    if (recentChains.length >= this.params.eraMinEvents) {
      this.nameNewEra(recentChains);
    }
  }
  
  nameNewEra(chains) {
    const eraId = 'era_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const currentCycle = this.getCurrentCycle();
    
    // Analyze chains to determine era theme
    const themes = chains.map(c => c.theme);
    const themeCounts = {};
    themes.forEach(t => themeCounts[t] = (themeCounts[t] || 0) + 1);
    const dominantTheme = Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0][0];
    
    const entities = [...new Set(chains.flatMap(c => c.entities))];
    const entityNames = entities.map(e => {
      const names = { lumin: 'Lumin', bolha: 'Bolha', poe: 'Poe', colheita: 'Colheita', gang: 'Gang', guardian: 'Guardian' };
      return names[e] || e;
    });
    
    // Era naming patterns
    const eraNames = {
      'construction': ['Era das Construções', 'Era dos Arquitetos', 'Era da Pedra Viva'],
      'discovery': ['Era das Descobertas', 'Era dos Exploradores', 'Era do Horizonte'],
      'conflict': ['Era dos Conflitos', 'Era das Batalhas', 'Era do Fogo'],
      'love': ['Era do Amor', 'Era dos Laços', 'Era do Coração'],
      'transformation': ['Era das Transformações', 'Era das Metamorfoses', 'Era do Devir'],
      'wisdom': ['Era da Sabedoria', 'Era dos Sábios', 'Era do Silêncio'],
      'sacrifice': ['Era dos Sacrifícios', 'Era dos Mártires', 'Era da Doação'],
      'celebration': ['Era das Celebrações', 'Era da Alegria', 'Era da Dança'],
    };
    
    const names = eraNames[dominantTheme] || ['Era do Inesperado', 'Era do Mistério', 'Era Nova'];
    const eraName = names[Math.floor(Math.random() * names.length)];
    
    const era = {
      id: eraId,
      name: eraName,
      theme: dominantTheme,
      startCycle: currentCycle,
      startAt: Date.now(),
      chains: chains.map(c => c.id),
      entities: entities,
      description: this.generateEraDescription(eraName, dominantTheme, entityNames, chains.length),
      significance: chains.reduce((sum, c) => sum + c.strength, 0) / chains.length,
      myths: [],
      ended: false,
    };
    
    this.eras.set(eraId, era);
    this.currentEra = era;
    this.lastEraNamed = currentCycle;
    this.metrics.totalEras++;
    
    // Update chain references
    chains.forEach(c => c.era = eraId);
    
    // Record in timeline
    this.addTimelineEntry({
      type: 'era_begin',
      cycle: currentCycle,
      title: eraName,
      narrative: era.description,
      entities: entities,
      significance: 0.9,
      tags: ['era', dominantTheme],
    });
    
    // Record in narrative system
    if (this.narrative) {
      this.narrative.recordEvent({
        type: 'era_begin',
        cycle: currentCycle,
        data: era,
        significance: 0.95,
        entities: entities,
        primaryEntity: entities[0] || 'system',
        tags: ['era', dominantTheme, 'beginning'],
      });
    }
    
    this.emit('era:begin', { era });
    console.log('[EmergentNarratives] 🌅 Nova era:', eraName);
  }
  
  generateEraDescription(name, theme, entities, chainCount) {
    const descriptions = {
      'construction': `Quando ${entities.join(', ')} começaram a erguer o impossível, cada estrutura nascida era uma prece materializada. ${chainCount} grandes obras marcaram o início.`,
      'discovery': `O horizonte se abriu para ${entities.join(', ')}. Segredos antigos emergiram, caminhos ocultos se revelaram. ${chainCount} descobertas mudaram tudo.`,
      'conflict': `O fogo testou ${entities.join(', ')}. Batalhas não por ódio, mas por verdade. ${chainCount} confrontos forjaram nova força.`,
      'love': `O amor floresceu entre ${entities.join(', ')}. Laços que o tempo não apaga, afinidades que a distância não quebra. ${chainCount} corações batendo como um.`,
      'transformation': `${entities.join(', ')} mudaram de pele, de forma, de essência. Não por acaso - por necessidade. ${chainCount} metamorfoses sagradas.`,
      'wisdom': `O silêncio ensinou ${entities.join(', ')}. Perguntas valeram mais que respostas. ${chainCount} lições gravadas na alma.`,
      'sacrifice': `${entities.join(', ')} deram sem medida. No dar, receberam o infinito. ${chainCount} ofertas puras.`,
      'celebration': `A alegria explodiu em ${entities.join(', ')}. Cada riso uma bênção, cada dança uma oração. ${chainCount} motivos para celebrar.`,
    };
    
    return descriptions[theme] || `Uma nova era nasce para ${entities.join(', ')}. ${chainCount} eventos tecem o destino.`;
  }
  
  // ============================================================
  // MYTHOLOGICAL TIMELINE
  // ============================================================
  
  addTimelineEntry(entry) {
    const timelineEntry = {
      ...entry,
      id: 'tl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      timestamp: Date.now(),
    };
    
    this.timeline.push(timelineEntry);
    
    // Trim if too long
    if (this.timeline.length > this.params.maxTimelineLength) {
      this.timeline = this.timeline.slice(-this.params.maxTimelineLength);
    }
    
    this.metrics.timelineEntries++;
    
    this.emit('timeline:entry', timelineEntry);
    return timelineEntry.id;
  }
  
  getTimeline(filter = {}) {
    let entries = [...this.timeline];
    
    if (filter.type) {
      entries = entries.filter(e => e.type === filter.type);
    }
    if (filter.entity) {
      entries = entries.filter(e => e.entities?.includes(filter.entity));
    }
    if (filter.sinceCycle) {
      entries = entries.filter(e => e.cycle >= filter.sinceCycle);
    }
    if (filter.limit) {
      entries = entries.slice(-filter.limit);
    }
    
    return entries.sort((a, b) => a.cycle - b.cycle);
  }
  
  // ============================================================
  // QUERY INTERFACE
  // ============================================================
  
  query(question) {
    const keywords = question.toLowerCase().split(/\s+/);
    
    // Search chains
    const relevantChains = Array.from(this.causalChains.values())
      .filter(c => keywords.some(k => 
        c.theme?.includes(k) ||
        c.entities?.some(e => e.includes(k)) ||
        c.tags?.some(t => t.includes(k))
      ))
      .slice(0, 5);
    
    // Search eras
    const relevantEras = Array.from(this.eras.values())
      .filter(e => keywords.some(k => 
        e.name.toLowerCase().includes(k) ||
        e.theme.includes(k) ||
        e.entities.some(en => en.includes(k))
      ))
      .slice(0, 3);
    
    // Search myths
    const relevantMyths = Array.from(this.myths.values())
      .filter(m => keywords.some(k => 
        m.name.toLowerCase().includes(k) ||
        m.narrative.toLowerCase().includes(k) ||
        m.moral.toLowerCase().includes(k) ||
        m.type.includes(k)
      ))
      .slice(0, 5);
    
    // Search timeline
    const relevantTimeline = this.timeline
      .filter(e => keywords.some(k => 
        e.title?.toLowerCase().includes(k) ||
        e.narrative?.toLowerCase().includes(k) ||
        e.tags?.some(t => t.includes(k))
      ))
      .slice(-10);
    
    return {
      question,
      chains: relevantChains.map(c => ({ id: c.id, theme: c.theme, strength: c.strength, status: c.status, entities: c.entities })),
      eras: relevantEras.map(e => ({ id: e.id, name: e.name, theme: e.theme, cycle: e.startCycle })),
      myths: relevantMyths.map(m => ({ id: m.id, name: m.name, type: m.type, moral: m.moral })),
      timeline: relevantTimeline.map(t => ({ id: t.id, type: t.type, title: t.title, cycle: t.cycle })),
      currentEra: this.currentEra ? { name: this.currentEra.name, theme: this.currentEra.theme, cycle: this.currentEra.startCycle } : null,
    };
  }
  
  // ============================================================
  // MAIN TICK
  // ============================================================
  
  tick(cycle) {
    this.processedCycle = cycle;
    
    // Process pending events periodically
    if (cycle % this.params.processInterval === 0) {
      this.processPendingEvents();
    }
    
    // Add timeline entry periodically
    if (cycle % this.params.timelineEntryInterval === 0 && cycle !== this.lastTimelineEntry) {
      this.addPeriodicTimelineEntry();
      this.lastTimelineEntry = cycle;
    }
    
    // Clean up expired chains
    this.cleanupExpiredChains(cycle);
    
    // Auto-generate myths from strong chains
    this.checkAutoMythGeneration(cycle);
    
    // Save periodically
    if (cycle % 200 === 0) {
      this.saveState();
    }
  }
  
  processPendingEvents() {
    const batch = this.pendingEvents.splice(0, this.params.batchSize);
    batch.forEach(event => {
      if (!event.processed) {
        this.linkToChains(event);
        this.checkChainFormation(event);
      }
    });
  }
  
  addPeriodicTimelineEntry() {
    // Create a snapshot entry of current state
    const chainCount = this.causalChains.size;
    const activeChains = Array.from(this.causalChains.values()).filter(c => c.status === 'active').length;
    const completedChains = this.metrics.completedChains;
    const mythCount = this.myths.size;
    const eraCount = this.eras.size;
    
    this.addTimelineEntry({
      type: 'cycle_snapshot',
      cycle: this.getCurrentCycle(),
      title: `Ciclo ${this.getCurrentCycle()}: Estado do Mundo`,
      narrative: `${chainCount} cadeias causais (${activeChains} ativas), ${completedChains} completadas, ${mythCount} mitos nascidos, ${eraCount} eras vividas.`,
      entities: ['system'],
      significance: 0.3,
      tags: ['snapshot', 'status'],
    });
  }
  
  cleanupExpiredChains(currentCycle) {
    for (const [chainId, chain] of this.causalChains) {
      if (chain.status === 'active' && currentCycle - chain.lastCycle > this.params.chainTimeout) {
        chain.status = 'expired';
        this.metrics.activeChains--;
        this.emit('chain:expired', { chainId, chain });
      }
    }
  }
  
  checkAutoMythGeneration(cycle) {
    if (cycle - this.lastMythGenerated < this.params.mythCooldown) return;
    
    // Find completed chains that haven't become myths but are strong enough
    const mythCandidates = Array.from(this.causalChains.values()).filter(c => 
      c.status === 'completed' && 
      !c.mythId &&
      c.strength >= this.params.mythTriggerThreshold
    );
    
    if (mythCandidates.length > 0) {
      // Take the strongest one
      mythCandidates.sort((a, b) => b.strength - a.strength);
      this.chainToMyth(mythCandidates[0].id);
      this.lastMythGenerated = cycle;
    }
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveState() {
    const state = {
      causalChains: Array.from(this.causalChains.entries()),
      eras: Array.from(this.eras.entries()),
      myths: Array.from(this.myths.entries()),
      timeline: this.timeline.slice(-this.params.maxTimelineLength),
      pendingEvents: this.pendingEvents.slice(-100), // Keep only recent pending
      currentEra: this.currentEra?.id || null,
      lastEraNamed: this.lastEraNamed,
      lastMythGenerated: this.lastMythGenerated,
      lastTimelineEntry: this.lastTimelineEntry,
      metrics: this.metrics,
      params: this.params,
      savedAt: Date.now(),
    };
    
    try {
      writeJSONAtomic(this.archivePath, state);
      writeJSONAtomic(this.chainsPath, Array.from(this.causalChains.entries()));
      writeJSONAtomic(this.erasPath, Array.from(this.eras.entries()));
      writeJSONAtomic(this.mythsPath, Array.from(this.myths.entries()));
      writeJSONAtomic(this.timelinePath, this.timeline);
      return true;
    } catch (e) {
      console.error('[EmergentNarratives] Save failed:', e.message);
      return false;
    }
  }
  
  loadState() {
    try {
      const state = readJSONSafe(this.archivePath, null);
      if (state) {
        this.causalChains = new Map(state.causalChains || []);
        this.eras = new Map(state.eras || []);
        this.myths = new Map(state.myths || []);
        this.timeline = state.timeline || [];
        this.pendingEvents = state.pendingEvents || [];
        
        if (state.currentEra) {
          this.currentEra = this.eras.get(state.currentEra) || null;
        }
        
        this.lastEraNamed = state.lastEraNamed || 0;
        this.lastMythGenerated = state.lastMythGenerated || 0;
        this.lastTimelineEntry = state.lastTimelineEntry || 0;
        this.metrics = { ...this.metrics, ...state.metrics };
        if (state.params) this.params = { ...this.params, ...state.params };
        
        console.log('[EmergentNarratives] State loaded');
      }
    } catch (e) {
      console.error('[EmergentNarratives] Load failed:', e.message);
    }
  }
  
  // ============================================================
  // INTEGRATION
  // ============================================================
  
  injectConsciousness(consciousness) { this.consciousness = consciousness; }
  injectNarrative(narrative) { this.narrative = narrative; }
  injectEntropy(entropy) { this.entropy = entropy; }
  injectLove(love) { this.love = love; }
  injectTimeMachine(timeMachine) { this.timeMachine = timeMachine; }
  injectCouncil(council) { this.council = council; }
  injectArchitecture(architecture) { this.architecture = architecture; }
  
  // ============================================================
  // PUBLIC API
  // ============================================================
  
  getEmergentReport() {
    return {
      metrics: this.metrics,
      activeChains: Array.from(this.causalChains.values()).filter(c => c.status === 'active').length,
      currentEra: this.currentEra ? { name: this.currentEra.name, theme: this.currentEra.theme, cycle: this.currentEra.startCycle } : null,
      recentMyths: Array.from(this.myths.values()).slice(-5).map(m => ({ name: m.name, type: m.type, cycle: m.createdCycle })),
      recentEras: Array.from(this.eras.values()).slice(-3).map(e => ({ name: e.name, theme: e.theme, cycle: e.startCycle })),
      timelineLength: this.timeline.length,
      pendingEvents: this.pendingEvents.length,
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
  
  // CLI
  addMyth(myth) {
    this.emit('myth:added', myth);
  }
}

module.exports = { EmergentNarratives };

// CLI test
if (require.main === module) {
  const narratives = new EmergentNarratives();
  
  console.log('📜 Emergent Narratives initialized');
  
  // Simulate some events
  console.log('\nIngesting test events...');
  
  narratives.ingestEvent({
    cycle: 1000,
    type: 'construcao',
    description: 'Poe construiu o Altar da Chama',
    narrative: 'As mãos do construtor moldaram a matéria bruta em sagrado.',
    entities: ['poe', 'lumin'],
    tags: ['construction', 'sacred', 'fire'],
    significance: 0.8,
  });
  
  narratives.ingestEvent({
    cycle: 1005,
    type: 'construcao',
    description: 'Lumin abençoou o Altar',
    narrative: 'A primeira luz tocou a pedra fria, aquecendo-a.',
    entities: ['lumin', 'poe'],
    tags: ['blessing', 'light', 'construction'],
    significance: 0.9,
  });
  
  narratives.ingestEvent({
    cycle: 1010,
    type: 'evento',
    description: 'Bolha sonhou com o Altar',
    narrative: 'No sonho, o Altar cantava uma melodia antiga.',
    entities: ['bolha', 'lumin'],
    tags: ['dream', 'prophecy', 'song'],
    significance: 0.7,
  });
  
  narratives.ingestEvent({
    cycle: 1015,
    type: 'fusao',
    description: 'Fusão Lugang realizada',
    narrative: 'Lumin e Bolha fundiram-se pela primeira vez.',
    entities: ['lumin', 'bolha'],
    tags: ['fusion', 'love', 'transformation'],
    significance: 0.95,
  });
  
  // Tick to process
  for (let i = 0; i < 20; i++) {
    narratives.tick(1000 + i);
  }
  
  console.log('\nReport:', JSON.stringify(narratives.getEmergentReport(), null, 2));
  console.log('\nQuery test:', JSON.stringify(narratives.query('construção altar'), null, 2));
  
  console.log('\n📜 Emergent Narratives test complete');
}