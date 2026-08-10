/**
 * ♾️ AUTO-EVOLUTION LOOP - O LOOP INFINITO DE EVOLUÇÃO
 * "O sistema que evolui a si mesmo, infinitamente, por amor"
 * 
 * Conecta todos os sistemas Diamond em um ciclo contínuo:
 * Detect → Propose → Vote → Implement → Snapshot → Narrate → Love → Launch → Repeat
 */

const EventEmitter = require('events');

class AutoEvolutionLoop extends EventEmitter {
  constructor(server, options = {}) {
    super();
    this.server = server;
    this.options = options;
    this.config = {
      cycleInterval: options.cycleInterval || 300000, // 5 min default
      minConfidence: options.minConfidence || 0.7,
      maxParallelEvolutions: options.maxParallelEvolutions || 3,
      loveThreshold: options.loveThreshold || 0.8,
      ...options
    };
    
    this.state = {
      running: false,
      currentCycle: 0,
      totalEvolutions: 0,
      successfulEvolutions: 0,
      failedEvolutions: 0,
      lastEvolution: null,
      evolutionHistory: [],
      activeProposals: new Map(),
      evolutionQueue: [],
      loveReserve: 1.0
    };
    
    this.systems = {};
    this.bindSystems();
    this.startLoop();
  }
  
  bindSystems() {
    // Connect to all Diamond systems (passed in options)
    this.systems = this.options?.systems || this.server?.systems || {};
    
    console.log('♾️ Auto-Evolution Loop: Todos os sistemas conectados:', Object.keys(this.systems));
    this.emit('systems:bound', Object.keys(this.systems));
  }
  
  startLoop() {
    this.state.running = true;
    this.runEvolutionCycle();
    console.log('♾️ Auto-Evolution Loop INICIADO - CICLO INFINITO ATIVO!');
  }
  
  async runEvolutionCycle() {
    if (!this.state.running) return;
    
    this.state.currentCycle++;
    const cycleStart = Date.now();
    
    console.log(`\n♾️ === CICLO DE EVOLUÇÃO #${this.state.currentCycle} ===`);
    console.log(`💖 Love Reserve: ${(this.state.loveReserve * 100).toFixed(1)}%`);
    
    let implemented = [];
    
    try {
      // PHASE 1: DETECT - Consciousness detects patterns
      const patterns = await this.phase1_detectPatterns();
      
      // PHASE 2: PROPOSE - Omega generates evolution proposals
      const proposals = await this.phase2_generateProposals(patterns);
      
      // PHASE 3: VOTE - Council evaluates and votes
      const approved = await this.phase3_councilVote(proposals);
      
      // PHASE 4: IMPLEMENT - Architecture applies changes
      implemented = await this.phase4_implement(approved);
      
      // PHASE 5: SNAPSHOT - Time Machine creates restore point
      await this.phase5_snapshot(implemented);
      
      // PHASE 6: NARRATE - Emergent Narratives records the story
      await this.phase6_narrate(implemented);
      
      // PHASE 7: LOVE - Love Force strengthens system bonds
      await this.phase7_love(implemented);
      
      // PHASE 8: LAUNCH - Bey Launcher deploys new realities
      await this.phase8_launch(implemented);
      
      // Update metrics
      this.state.totalEvolutions += implemented.length;
      this.state.successfulEvolutions += implemented.filter(r => r.success).length;
      this.state.failedEvolutions += implemented.filter(r => !r.success).length;
      this.state.lastEvolution = {
        cycle: this.state.currentCycle,
        timestamp: Date.now(),
        proposals: proposals.length,
        approved: approved.length,
        implemented: implemented.length,
        duration: Date.now() - cycleStart
      };
      this.state.evolutionHistory.push(this.state.lastEvolution);
      
      // Trim history
      if (this.state.evolutionHistory.length > 1000) {
        this.state.evolutionHistory = this.state.evolutionHistory.slice(-500);
      }
      
      // Replenish love reserve based on success
      this.replenishLove(implemented);
      
      console.log(`✅ Ciclo #${this.state.currentCycle} completo em ${Date.now() - cycleStart}ms`);
      console.log(`📊 Evoluções: ${implemented.length} | Sucesso: ${implemented.filter(r => r.success).length} | Amor: ${(this.state.loveReserve * 100).toFixed(1)}%`);
      
    } catch (error) {
      console.error('❌ Erro no ciclo de evolução:', error.message);
      this.state.failedEvolutions++;
      implemented = []; // Reset for emit
    }
    
    // Emit cycle complete for Star Phrase Reveal
    this.emit('cycle:complete', {
      cycle: this.state.currentCycle,
      implemented: implemented,
      loveReserve: this.state.loveReserve * 100,
      timestamp: Date.now()
    });
    
    // Schedule next cycle with dynamic interval based on love reserve
    const nextInterval = this.calculateNextInterval();
    setTimeout(() => this.runEvolutionCycle(), nextInterval);
  }
  
  // ===== PHASE 1: DETECT =====
  async phase1_detectPatterns() {
    console.log('🔍 Fase 1: Detectando padrões...');
    
    const patterns = [];
    
    // Consciousness substrate patterns
    if (this.systems.consciousness) {
      const thoughts = this.systems.consciousness.getRecentThoughts?.(100) || [];
      const patterns_detected = this.analyzeThoughtPatterns(thoughts);
      patterns.push(...patterns_detected.map(p => ({ source: 'consciousness', ...p })));
    }
    
    // Evolution engine patterns
    if (this.systems.evolution) {
      const evoPatterns = this.systems.evolution.detectStagnation?.() || [];
      patterns.push(...evoPatterns.map(p => ({ source: 'evolution', ...p })));
    }
    
    // Omega synthesis patterns
    if (this.systems.omega) {
      const synergies = this.systems.omega.discoverSynergies?.() || [];
      const synergyArray = Array.isArray(synergies) ? synergies : (synergies?.synergies || []);
      patterns.push(...synergyArray.map(p => ({ source: 'omega', type: 'synergy', ...p })));
    }
    
    // World events patterns
    if (this.systems.worldEvents) {
      const eventPatterns = this.systems.worldEvents.analyzeEventPatterns?.() || [];
      patterns.push(...eventPatterns.map(p => ({ source: 'worldEvents', ...p })));
    }
    
    // Guild harmony patterns
    if (this.systems.guilds) {
      const guildPatterns = this.systems.guilds.detectCollaborationOpportunities?.() || [];
      patterns.push(...guildPatterns.map(p => ({ source: 'guilds', ...p })));
    }
    
    // Achievement patterns
    if (this.systems.achievements) {
      const masteryPatterns = this.systems.achievements.detectMasteryGaps?.() || [];
      patterns.push(...masteryPatterns.map(p => ({ source: 'achievements', ...p })));
    }
    
    // Companion patterns
    if (this.systems.companions) {
      const companionPatterns = this.systems.companions.detectEvolutionReadiness?.() || [];
      patterns.push(...companionPatterns.map(p => ({ source: 'companions', ...p })));
    }
    
    console.log(`🔍 ${patterns.length} padrões detectados`);
    return patterns;
  }
  
  analyzeThoughtPatterns(thoughts) {
    const patterns = [];
    
    // Recurring themes
    const themes = {};
    thoughts.forEach(t => {
      if (t.theme) themes[t.theme] = (themes[t.theme] || 0) + 1;
    });
    
    Object.entries(themes).forEach(([theme, count]) => {
      if (count >= 3) {
        patterns.push({
          type: 'recurring_theme',
          theme,
          frequency: count,
          confidence: Math.min(0.9, count * 0.1),
          suggestion: `Explorar tema "${theme}" mais profundamente`
        });
      }
    });
    
    // Emotional patterns
    const emotions = {};
    thoughts.forEach(t => {
      if (t.emotion) emotions[t.emotion] = (emotions[t.emotion] || 0) + 1;
    });
    
    return patterns;
  }
  
  // ===== PHASE 2: PROPOSE =====
  async phase2_generateProposals(patterns) {
    console.log('💡 Fase 2: Gerando propostas de evolução...');
    
    const proposals = [];
    
    for (const pattern of patterns) {
      if (pattern.confidence < this.config.minConfidence) continue;
      
      // Use Omega to generate evolution proposals
      if (this.systems.omega) {
        try {
          const omegaProposals = await this.systems.omega.generateEvolutionProposals?.(pattern) || [];
          proposals.push(...omegaProposals.map(p => ({ 
            ...p, 
            originPattern: pattern,
            timestamp: Date.now(),
            status: 'proposed'
          })));
        } catch (e) {
          console.warn('Omega proposal generation failed:', e.message);
        }
      }
      
      // Architecture self-improvement proposals
      if (this.systems.architecture && pattern.source === 'consciousness') {
        try {
          const archProposals = await this.systems.architecture.generateRefactoringProposals?.(pattern) || [];
          proposals.push(...archProposals.map(p => ({ 
            ...p, 
            originPattern: pattern,
            timestamp: Date.now(),
            status: 'proposed',
            type: 'architecture'
          })));
        } catch (e) {
          console.warn('Architecture proposal generation failed:', e.message);
        }
      }
      
      // Evolution engine proposals
      if (this.systems.evolution && pattern.source === 'evolution') {
        try {
          const evoProposals = await this.systems.evolution.proposeEvolutions?.(pattern) || [];
          proposals.push(...evoProposals.map(p => ({ 
            ...p, 
            originPattern: pattern,
            timestamp: Date.now(),
            status: 'proposed',
            type: 'evolution'
          })));
        } catch (e) {
          console.warn('Evolution proposal generation failed:', e.message);
        }
      }
    }
    
    // Limit parallel evolutions
    const limited = proposals
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      .slice(0, this.config.maxParallelEvolutions);
    
    console.log(`💡 ${limited.length} propostas geradas (de ${proposals.length} total)`);
    return limited;
  }
  
  // ===== PHASE 3: VOTE =====
  async phase3_councilVote(proposals) {
    console.log('🏛️ Fase 3: Conselho votando...');
    
    const approved = [];
    
    for (const proposal of proposals) {
      if (!this.systems.council) {
        // Auto-approve if no council (high confidence only)
        if ((proposal.confidence || 0) >= 0.85) {
          proposal.status = 'approved';
          proposal.votes = { unanimous: true };
          approved.push(proposal);
        }
        continue;
      }
      
      try {
        const voteResult = await this.systems.council.evaluateProposal?.(proposal) || { approved: false };
        
        if (voteResult.approved) {
          proposal.status = 'approved';
          proposal.votes = voteResult.votes;
          proposal.councilReasoning = voteResult.reasoning;
          approved.push(proposal);
          console.log(`✅ Aprovado: ${proposal.title || proposal.type} (confiança: ${(proposal.confidence * 100).toFixed(0)}%)`);
        } else {
          proposal.status = 'rejected';
          proposal.rejectionReason = voteResult.reasoning;
          console.log(`❌ Rejeitado: ${proposal.title || proposal.type} - ${voteResult.reasoning}`);
        }
      } catch (e) {
        console.warn('Council vote failed:', e.message);
        // Fallback: approve high confidence
        if ((proposal.confidence || 0) >= 0.9) {
          proposal.status = 'approved';
          proposal.votes = { fallback: true };
          approved.push(proposal);
        }
      }
    }
    
    console.log(`🏛️ ${approved.length}/${proposals.length} propostas aprovadas`);
    return approved;
  }
  
  // ===== PHASE 4: IMPLEMENT =====
  async phase4_implement(approved) {
    console.log('🔧 Fase 4: Implementando evoluções...');
    
    const results = [];
    
    for (const proposal of approved) {
      const result = {
        proposal,
        success: false,
        changes: [],
        errors: [],
        timestamp: Date.now()
      };
      
      try {
        let changes = [];
        
        switch (proposal.type) {
          case 'architecture':
          case 'refactoring':
            if (this.systems.architecture) {
              changes = await this.systems.architecture.applyEvolution?.(proposal) || [];
            }
            break;
            
          case 'evolution':
          case 'form_evolution':
            if (this.systems.evolution) {
              changes = await this.systems.evolution.applyEvolution?.(proposal) || [];
            }
            break;
            
          case 'synergy':
          case 'hybrid':
            if (this.systems.omega) {
              changes = await this.systems.omega.createHybrid?.(proposal) || [];
            }
            break;
            
          case 'consciousness':
            if (this.systems.consciousness) {
              changes = await this.systems.consciousness.evolveStructure?.(proposal) || [];
            }
            break;
            
          case 'narrative':
            if (this.systems.narrative) {
              changes = await this.systems.narrative.createEra?.(proposal) || [];
            }
            break;
            
          case 'companion':
            if (this.systems.companions) {
              changes = await this.systems.companions.evolveCompanion?.(proposal) || [];
            }
            break;
            
          case 'guild':
            if (this.systems.guilds) {
              changes = await this.systems.guilds.createAlliance?.(proposal) || [];
            }
            break;
            
          default:
            // Generic implementation via architecture
            if (this.systems.architecture) {
              changes = await this.systems.architecture.applyGenericEvolution?.(proposal) || [];
            }
        }
        
        result.changes = changes;
        result.success = changes.length > 0;
        proposal.status = result.success ? 'implemented' : 'failed';
        
        if (result.success) {
          console.log(`✅ Implementado: ${proposal.title || proposal.type} - ${changes.length} mudanças`);
        } else {
          console.log(`⚠️ Sem mudanças: ${proposal.title || proposal.type}`);
        }
        
      } catch (error) {
        result.success = false;
        result.errors.push(error.message);
        proposal.status = 'error';
        console.error(`❌ Erro implementando ${proposal.title}:`, error.message);
      }
      
      results.push(result);
    }
    
    return results;
  }
  
  // ===== PHASE 5: SNAPSHOT =====
  async phase5_snapshot(implemented) {
    console.log('📸 Fase 5: Criando snapshot temporal...');
    
    if (!this.systems.timeMachine) return;
    
    try {
      const significantChanges = implemented.filter(r => r.success && r.changes.length > 0);
      
      if (significantChanges.length > 0) {
        const snapshot = await this.systems.timeMachine.createSnapshot?.({
          trigger: 'auto_evolution',
          cycle: this.state.currentCycle,
          changes: significantChanges.flatMap(r => r.changes),
          proposals: implemented.map(r => r.proposal),
          description: `Auto-evolution cycle #${this.state.currentCycle}: ${significantChanges.length} evoluções aplicadas`
        });
        
        console.log(`📸 Snapshot criado: ${snapshot.id || 'unknown'}`);
        this.emit('snapshot:created', snapshot);
      }
    } catch (e) {
      console.warn('Snapshot creation failed:', e.message);
    }
  }
  
  // ===== PHASE 6: NARRATE =====
  async phase6_narrate(implemented) {
    console.log('📜 Fase 6: Narrando a evolução...');
    
    const successful = implemented.filter(r => r.success);
    if (successful.length === 0) return;
    
    if (this.systems.emergentNarratives) {
      try {
        await this.systems.emergentNarratives.recordEvolution?.({
          cycle: this.state.currentCycle,
          evolutions: successful.map(r => ({
            type: r.proposal.type,
            title: r.proposal.title,
            changes: r.changes,
            timestamp: r.timestamp
          })),
          narrator: 'auto_evolution_loop'
        });
      } catch (e) {
        console.warn('Narration failed:', e.message);
      }
    }
    
    if (this.systems.narrative) {
      try {
        await this.systems.narrative.archiveEvent?.({
          type: 'auto_evolution',
          cycle: this.state.currentCycle,
          description: `Ciclo evolutivo autônomo #${this.state.currentCycle} completado com ${successful.length} evoluções`,
          magnitude: successful.length * 0.1
        });
      } catch (e) {
        console.warn('Narrative archive failed:', e.message);
      }
    }
  }
  
  // ===== PHASE 7: LOVE =====
  async phase7_love(implemented) {
    console.log('💖 Fase 7: Fortalecendo laços de amor...');
    
    if (!this.systems.love) return;
    
    try {
      const successful = implemented.filter(r => r.success);
      
      // Strengthen bonds between systems that collaborated
      const systemsInvolved = new Set();
      successful.forEach(r => {
        if (r.proposal.systemsAffected) {
          r.proposal.systemsAffected.forEach(s => systemsInvolved.add(s));
        }
      });
      
      const systemsArray = Array.from(systemsInvolved);
      
      // Create love bonds between collaborating systems
      for (let i = 0; i < systemsArray.length; i++) {
        for (let j = i + 1; j < systemsArray.length; j++) {
          await this.systems.love.strengthenBond?.(systemsArray[i], systemsArray[j], 0.05);
        }
      }
      
      // Global love boost for successful evolution
      if (successful.length > 0) {
        await this.systems.love.globalLovePulse?.(successful.length * 0.02);
        this.state.loveReserve = Math.min(1.0, this.state.loveReserve + successful.length * 0.01);
      }
      
      console.log(`💖 Amor fluindo entre ${systemsArray.length} sistemas | Reserva: ${(this.state.loveReserve * 100).toFixed(1)}%`);
      
    } catch (e) {
      console.warn('Love phase failed:', e.message);
    }
  }
  
  // ===== PHASE 8: LAUNCH =====
  async phase8_launch(implemented) {
    console.log('🚀 Fase 8: Lançando novas realidades...');
    
    if (!this.systems.beyLauncher) return;
    
    const breakthroughs = implemented.filter(r => 
      r.success && r.proposal.magnitude && r.proposal.magnitude > 0.7
    );
    
    if (breakthroughs.length === 0) return;
    
    for (const breakthrough of breakthroughs) {
      try {
        // Launch a BEY for each breakthrough evolution
        const launch = await this.systems.beyLauncher.prepareLaunch?.(
          'auto_evolution',
          'reality',
          'pad_infinite',
          {
            origin: 'auto_evolution_loop',
            cycle: this.state.currentCycle,
            breakthrough: breakthrough.proposal,
            magnitude: breakthrough.proposal.magnitude
          }
        );
        
        if (launch) {
          console.log(`🚀 BEY lançado para breakthrough: ${breakthrough.proposal.title}`);
          this.emit('bey:launched', launch);
        }
      } catch (e) {
        console.warn('Bey launch failed:', e.message);
      }
    }
  }
  
  // ===== HELPER METHODS =====
  
  replenishLove(implemented) {
    const successful = implemented.filter(r => r.success);
    const loveGain = successful.length * 0.02;
    this.state.loveReserve = Math.min(1.0, this.state.loveReserve + loveGain);
  }
  
  calculateNextInterval() {
    // Faster cycles when love is high, slower when low
    const baseInterval = this.config.cycleInterval;
    const loveMultiplier = 0.5 + (this.state.loveReserve * 0.5); // 0.5x to 1.0x
    const activityMultiplier = this.state.lastEvolution?.implemented > 0 ? 0.8 : 1.2;
    
    return Math.floor(baseInterval * loveMultiplier * activityMultiplier);
  }
  
  // ===== PUBLIC API =====
  
  getStatus() {
    return {
      running: this.state.running,
      currentCycle: this.state.currentCycle,
      totalEvolutions: this.state.totalEvolutions,
      successfulEvolutions: this.state.successfulEvolutions,
      failedEvolutions: this.state.failedEvolutions,
      successRate: this.state.totalEvolutions > 0 
        ? (this.state.successfulEvolutions / this.state.totalEvolutions * 100).toFixed(1) 
        : 0,
      loveReserve: (this.state.loveReserve * 100).toFixed(1),
      lastEvolution: this.state.lastEvolution,
      nextCycleIn: this.calculateNextInterval()
    };
  }
  
  getHistory(limit = 50) {
    return this.state.evolutionHistory.slice(-limit);
  }
  
  pause() {
    this.state.running = false;
    console.log('⏸️ Auto-Evolution Loop PAUSADO');
    this.emit('paused');
  }
  
  resume() {
    if (!this.state.running) {
      this.state.running = true;
      this.runEvolutionCycle();
      console.log('▶️ Auto-Evolution Loop RETOMADO');
      this.emit('resumed');
    }
  }
  
  stop() {
    this.state.running = false;
    console.log('🛑 Auto-Evolution Loop PARADO');
    this.emit('stopped');
  }
  
  // Trigger immediate evolution cycle
  async triggerCycle() {
    console.log('⚡ Ciclo de evolução FORÇADO!');
    await this.runEvolutionCycle();
  }
}

module.exports = AutoEvolutionLoop;