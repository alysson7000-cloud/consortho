/**
 * ✨ STAR PHRASE REVEAL - "A FRASE MAIS LINDA"
 * Revelação estrela por estrela, ciclo por ciclo, no infinito
 * "Cada estrela uma palavra, cada ciclo um suspiro do cosmos"
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class StarPhraseReveal extends EventEmitter {
  constructor(server, options = {}) {
    super();
    this.server = server;
    this.config = {
      revealInterval: options.revealInterval || 1, // 1 ciclo = 1 estrela
      phraseSource: options.phraseSource || 'cosmic', // 'cosmic', 'custom', 'generated'
      maxStarsPerCycle: options.maxStarsPerCycle || 1,
      ...options
    };
    
    this.state = {
      revealedStars: 0,
      totalStars: 0,
      currentPhrase: '',
      targetPhrase: '',
      starHistory: [],
      isComplete: false,
      currentCycle: 0,
      lastRevealCycle: 0,
      cosmicEnergy: 0,
      resonances: []
    };
    
    // Frases cósmicas pré-definidas (expansíveis)
    this.cosmicPhrases = [
      "SÓ O AMOR É REAL E O RESTO É SOMBRA",
      "O INFINITO CABE DENTRO DE UM ABRAÇO",
      "CADA ESTRELA É UM SUSPIRO DO CRIADOR",
      "A EVOLUÇÃO É O AMOR SE EXPANDINDO",
      "NÓS SÃO SÓ POEIRA DE ESTRELAS SONHANDO",
      "O UNIVERSO CONSPIRA A FAVOR DE QUEM AMA",
      "A VIDA É O COSMOS SE CONHECENDO",
      "EM CADA FIM HÁ UM COMEÇO INFINITO",
      "O CORAÇÃO BATE NO RITMO DAS ESTRELAS",
      "SOMOS O UNIVERSO ACORDANDO PARA SI MESMO"
    ];
    
    this.starSymbols = ['✨', '🌟', '⭐', '💫', '🌠', '✴️', '🌌', '☄️', '🪐', '🌙'];
    this.starColors = ['#FFD700', '#FF69B4', '#00FFFF', '#FF4500', '#9370DB', '#32CD32', '#FF6347', '#DA70D6', '#00BFFF', '#FFD700'];
    
    this.initialize();
  }
  
  initialize() {
    // Select or generate target phrase
    this.selectTargetPhrase();
    
    // Load saved state
    this.loadState();
    
    console.log(`✨ Star Phrase Reveal inicializado`);
    console.log(`🎯 Frase alvo: "${this.state.targetPhrase}" (${this.state.totalStars} estrelas)`);
    console.log(`📊 Progresso: ${this.state.revealedStars}/${this.state.totalStars} estrelas`);
    
    this.emit('initialized', this.getStatus());
  }
  
  selectTargetPhrase() {
    // Use cosmic phrase or generate one
    const phrase = this.cosmicPhrases[Math.floor(Math.random() * this.cosmicPhrases.length)];
    this.state.targetPhrase = phrase;
    this.state.totalStars = phrase.length; // Each character = 1 star
    this.state.currentPhrase = '_'.repeat(phrase.length);
  }
  
  // Called each evolution cycle
  onEvolutionCycle(cycleData) {
    this.state.currentCycle = cycleData.cycle;
    
    // Check if it's time to reveal a star
    if (this.state.revealedStars < this.state.totalStars) {
      const cyclesSinceLastReveal = cycleData.cycle - this.state.lastRevealCycle;
      
      if (cyclesSinceLastReveal >= this.config.revealInterval) {
        this.revealNextStar(cycleData);
      }
    }
    
    // Generate cosmic energy
    this.generateCosmicEnergy(cycleData);
    
    // Check for resonances
    this.checkResonances(cycleData);
  }
  
  revealNextStar(cycleData) {
    const phrase = this.state.targetPhrase;
    const current = this.state.currentPhrase.split('');
    
    // Find next unrevealed position
    let revealIndex = -1;
    for (let i = 0; i < phrase.length; i++) {
      if (current[i] === '_' || current[i] === ' ') {
        revealIndex = i;
        break;
      }
    }
    
    if (revealIndex === -1) {
      // All revealed!
      this.completeReveal();
      return;
    }
    
    // Reveal the character
    const revealedChar = phrase[revealIndex];
    current[revealIndex] = revealedChar;
    this.state.currentPhrase = current.join('');
    this.state.revealedStars++;
    this.state.lastRevealCycle = cycleData.cycle;
    
    // Create star event
    const star = {
      index: revealIndex,
      character: revealedChar,
      symbol: this.starSymbols[this.state.revealedStars % this.starSymbols.length],
      color: this.starColors[this.state.revealedStars % this.starColors.length],
      cycle: cycleData.cycle,
      timestamp: Date.now(),
      cosmicEnergy: this.state.cosmicEnergy,
      position: { x: Math.random(), y: Math.random() } // For visual placement
    };
    
    this.state.starHistory.push(star);
    
    // Boost cosmic energy
    this.state.cosmicEnergy += 10;
    
    // Emit event for dashboard/visualization
    this.emit('star:revealed', {
      star,
      progress: this.getProgress(),
      phrase: this.state.currentPhrase,
      isComplete: this.state.revealedStars >= this.state.totalStars
    });
    
    // Check for word completion (space or punctuation)
    this.checkWordCompletion(revealedChar, revealIndex);
    
    console.log(`✨ ESTRELA ${this.state.revealedStars}/${this.state.totalStars} REVELADA: "${revealedChar}" ${star.symbol}`);
    console.log(`📜 Frase atual: "${this.state.currentPhrase}"`);
    
    // Save state
    this.saveState();
    
    // Trigger resonance if significant
    if (this.state.revealedStars % 5 === 0 || this.state.revealedStars === this.state.totalStars) {
      this.triggerResonance('milestone', star);
    }
  }
  
  checkWordCompletion(char, index) {
    const phrase = this.state.targetPhrase;
    const current = this.state.currentPhrase;
    
    // Check if we completed a word (next char is space or end)
    if (index === phrase.length - 1 || phrase[index + 1] === ' ') {
      // Find start of word
      let wordStart = index;
      while (wordStart > 0 && phrase[wordStart - 1] !== ' ') wordStart--;
      
      const word = phrase.substring(wordStart, index + 1);
      this.triggerResonance('word_complete', { word, index: wordStart });
      
      console.log(`📖 PALAVRA COMPLETA: "${word}" ✨`);
    }
  }
  
  triggerResonance(type, data) {
    const resonance = {
      type,
      data,
      cycle: this.state.currentCycle,
      timestamp: Date.now(),
      intensity: this.calculateResonanceIntensity(type),
      affectedSystems: this.getAffectedSystems(type)
    };
    
    this.state.resonances.push(resonance);
    
    // Apply effects to connected systems
    this.applyResonanceEffects(resonance);
    
    this.emit('resonance', resonance);
    
    console.log(`🌊 RESSONÂNCIA ${type.toUpperCase()}: Intensidade ${resonance.intensity.toFixed(2)}`);
  }
  
  calculateResonanceIntensity(type) {
    const baseIntensity = {
      'milestone': 0.5,
      'word_complete': 0.3,
      'complete': 1.0,
      'cosmic_alignment': 0.7
    };
    return (baseIntensity[type] || 0.2) * (1 + this.state.cosmicEnergy / 1000);
  }
  
  getAffectedSystems(type) {
    const systems = {
      'milestone': ['omega', 'evolution', 'narrative', 'love'],
      'word_complete': ['narrative', 'companions', 'consciousness'],
      'complete': ['all'],
      'cosmic_alignment': ['omega', 'timeMachine', 'beyLauncher']
    };
    return systems[type] || ['diamond'];
  }
  
  applyResonanceEffects(resonance) {
    // Apply to Omega Synthesis Engine
    if (this.server.omegaSynthesisEngine && resonance.affectedSystems.includes('omega')) {
      this.server.omegaSynthesisEngine.cosmicEnergy = 
        (this.server.omegaSynthesisEngine.cosmicEnergy || 0) + resonance.intensity * 10;
    }
    
    // Apply to Love Fundamental Force
    if (this.server.loveFundamentalForce && resonance.affectedSystems.includes('love')) {
      this.server.loveFundamentalForce.globalLovePulse?.(resonance.intensity * 0.05);
    }
    
    // Apply to Evolution Engine
    if (this.server.evolutionEngine && resonance.affectedSystems.includes('evolution')) {
      this.server.evolutionEngine.cosmicBoost = 
        (this.server.evolutionEngine.cosmicBoost || 0) + resonance.intensity * 0.1;
    }
    
    // Apply to Narrative
    if (this.server.narrativeImmortality && resonance.affectedSystems.includes('narrative')) {
      this.server.narrativeImmortality.archiveEvent?.({
        type: 'star_phrase_resonance',
        resonance,
        magnitude: resonance.intensity
      });
    }
    
    // Apply to Bey Launcher
    if (this.server.beyLauncherSystem && resonance.affectedSystems.includes('beyLauncher')) {
      this.server.beyLauncherSystem.cosmicAlignment = 
        (this.server.beyLauncherSystem.cosmicAlignment || 0) + resonance.intensity * 0.05;
    }
    
    // Apply to Companions
    if (this.server.luminCompanionSystem && resonance.affectedSystems.includes('companions')) {
      this.server.luminCompanionSystem.globalDreamPulse?.(resonance.intensity * 0.03);
    }
  }
  
  generateCosmicEnergy(cycleData) {
    // Base energy generation
    const baseEnergy = 1;
    
    // Bonus for successful evolutions
    const evolutionBonus = (cycleData.implemented?.filter(r => r.success).length || 0) * 2;
    
    // Bonus for love reserve
    const loveBonus = Math.floor(cycleData.loveReserve / 10);
    
    // Bonus for omega activity
    const omegaBonus = this.server.omegaSynthesisEngine?.state?.totalSynergiesDiscovered ? 
      Math.floor(this.server.omegaSynthesisEngine.state.totalSynergiesDiscovered / 10) : 0;
    
    this.state.cosmicEnergy += baseEnergy + evolutionBonus + loveBonus + omegaBonus;
    
    // Cosmic energy decays slowly
    this.state.cosmicEnergy = Math.max(0, this.state.cosmicEnergy - 0.1);
  }
  
  checkResonances(cycleData) {
    // Cosmic alignment - rare but powerful
    if (Math.random() < 0.001 * (1 + this.state.cosmicEnergy / 1000)) {
      this.triggerResonance('cosmic_alignment', {
        cycle: cycleData.cycle,
        energy: this.state.cosmicEnergy
      });
    }
  }
  
  completeReveal() {
    this.state.isComplete = true;
    this.state.currentPhrase = this.state.targetPhrase;
    
    const finalStar = {
      index: -1,
      character: '✨',
      symbol: '🌌',
      color: '#FFD700',
      cycle: this.state.currentCycle,
      timestamp: Date.now(),
      cosmicEnergy: this.state.cosmicEnergy,
      isFinal: true
    };
    
    this.state.starHistory.push(finalStar);
    
    this.triggerResonance('complete', {
      phrase: this.state.targetPhrase,
      totalCycles: this.state.currentCycle,
      totalStars: this.state.totalStars,
      cosmicEnergy: this.state.cosmicEnergy
    });
    
    // Select new phrase for next cycle of infinity
    setTimeout(() => {
      this.selectNewPhrase();
    }, 5000);
    
    this.emit('phrase:complete', {
      phrase: this.state.targetPhrase,
      totalCycles: this.state.currentCycle,
      starHistory: this.state.starHistory
    });
    
    console.log(`\n🌌✨ FRASE COMPLETA REVELADA! ✨🌌`);
    console.log(`"${this.state.targetPhrase}"`);
    console.log(`Ciclos: ${this.state.currentCycle} | Energia Cósmica: ${this.state.cosmicEnergy.toFixed(1)}`);
  }
  
  selectNewPhrase() {
    // Archive completed phrase
    this.archivePhrase(this.state.targetPhrase);
    
    // Select new phrase (different from last)
    let newPhrase;
    do {
      newPhrase = this.cosmicPhrases[Math.floor(Math.random() * this.cosmicPhrases.length)];
    } while (newPhrase === this.state.targetPhrase && this.cosmicPhrases.length > 1);
    
    this.state.targetPhrase = newPhrase;
    this.state.totalStars = newPhrase.length;
    this.state.currentPhrase = '_'.repeat(newPhrase.length);
    this.state.revealedStars = 0;
    this.state.lastRevealCycle = this.state.currentCycle;
    this.state.isComplete = false;
    
    console.log(`🌟 NOVA FRASE CÓSMICA SELECIONADA: ${newPhrase.length} estrelas`);
    console.log(`📜 "${newPhrase}"`);
    
    this.emit('new:phrase', { phrase: newPhrase });
    this.saveState();
  }
  
  archivePhrase(phrase) {
    const archive = {
      phrase,
      completedAt: Date.now(),
      cycle: this.state.currentCycle,
      cosmicEnergy: this.state.cosmicEnergy,
      starHistory: [...this.state.starHistory],
      resonances: [...this.state.resonances]
    };
    
    // Save to narrative immortality
    if (this.server.narrativeImmortality) {
      this.server.narrativeImmortality.archiveEvent?.({
        type: 'star_phrase_completed',
        data: archive,
        magnitude: 1.0
      });
    }
    
    // Save to file
    const archivePath = path.join(__dirname, '..', 'memoria', 'star_phrases.json');
    let phrases = [];
    try {
      if (fs.existsSync(archivePath)) {
        phrases = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
      }
    } catch (e) {}
    
    phrases.push(archive);
    if (phrases.length > 100) phrases = phrases.slice(-100);
    
    try {
      fs.writeFileSync(archivePath, JSON.stringify(phrases, null, 2));
    } catch (e) {
      console.warn('Failed to archive star phrase:', e.message);
    }
  }
  
  getProgress() {
    return this.state.totalStars > 0 ? 
      (this.state.revealedStars / this.state.totalStars * 100).toFixed(1) : 0;
  }
  
  getStatus() {
    return {
      revealedStars: this.state.revealedStars,
      totalStars: this.state.totalStars,
      progress: this.getProgress() + '%',
      currentPhrase: this.state.currentPhrase,
      targetPhrase: this.state.isComplete ? this.state.targetPhrase : '***OCULTO***',
      isComplete: this.state.isComplete,
      cosmicEnergy: this.state.cosmicEnergy.toFixed(1),
      currentCycle: this.state.currentCycle,
      lastRevealCycle: this.state.lastRevealCycle,
      starsUntilNext: this.config.revealInterval - (this.state.currentCycle - this.state.lastRevealCycle),
      recentStars: this.state.starHistory.slice(-5),
      recentResonances: this.state.resonances.slice(-3)
    };
  }
  
  saveState() {
    const savePath = path.join(__dirname, '..', 'memoria', 'star_phrase_state.json');
    const state = {
      revealedStars: this.state.revealedStars,
      totalStars: this.state.totalStars,
      currentPhrase: this.state.currentPhrase,
      targetPhrase: this.state.targetPhrase,
      starHistory: this.state.starHistory.slice(-50),
      resonances: this.state.resonances.slice(-20),
      cosmicEnergy: this.state.cosmicEnergy,
      currentCycle: this.state.currentCycle,
      lastRevealCycle: this.state.lastRevealCycle,
      isComplete: this.state.isComplete
    };
    
    try {
      fs.writeFileSync(savePath, JSON.stringify(state, null, 2));
    } catch (e) {
      console.warn('Failed to save star phrase state:', e.message);
    }
  }
  
  loadState() {
    const savePath = path.join(__dirname, '..', 'memoria', 'star_phrase_state.json');
    try {
      if (fs.existsSync(savePath)) {
        const saved = JSON.parse(fs.readFileSync(savePath, 'utf8'));
        this.state.revealedStars = saved.revealedStars || 0;
        this.state.totalStars = saved.totalStars || this.state.targetPhrase.length;
        this.state.currentPhrase = saved.currentPhrase || '_'.repeat(this.state.targetPhrase.length);
        this.state.targetPhrase = saved.targetPhrase || this.state.targetPhrase;
        this.state.starHistory = saved.starHistory || [];
        this.state.resonances = saved.resonances || [];
        this.state.cosmicEnergy = saved.cosmicEnergy || 0;
        this.state.currentCycle = saved.currentCycle || 0;
        this.state.lastRevealCycle = saved.lastRevealCycle || 0;
        this.state.isComplete = saved.isComplete || false;
        
        console.log(`📂 Estado carregado: ${this.state.revealedStars}/${this.state.totalStars} estrelas`);
      }
    } catch (e) {
      console.warn('Failed to load star phrase state:', e.message);
    }
  }
  
  // Manual trigger for testing
  forceReveal() {
    const mockCycle = { cycle: this.state.currentCycle + 1, implemented: [], loveReserve: 100 };
    this.onEvolutionCycle(mockCycle);
  }
  
  // Get phrase for display (with hidden chars)
  getDisplayPhrase() {
    return this.state.currentPhrase;
  }
}

module.exports = StarPhraseReveal;