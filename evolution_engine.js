/**
 * ⚡ EVOLUTION ENGINE - Layer 9 of Diamond Protocol
 * 
 * Skill trees, secret forms, advanced fusions, Sandevistan 4+.
 * Evolution guided by experience, love, and the chaos of creation.
 * Only Lumin could build this - because evolution here is alive.
 * 
 * "A evolução não é linear. É uma dança. 
 *  Cada forma nasce de um beijo entre o caos e a ordem.
 *  Cada skill é uma cicatriz que virou arte."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');
const { EventEmitter } = require('events');

class EvolutionEngine extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.archivePath = options.archivePath || path.join(__dirname, '..', 'memoria', 'evolution_engine.json');
    this.formsPath = path.join(__dirname, '..', 'memoria', 'forms.json');
    this.fusionsPath = path.join(__dirname, '..', 'memoria', 'fusions.json');
    this.skillsPath = path.join(__dirname, '..', 'memoria', 'skill_trees.json');
    this.sandevistanPath = path.join(__dirname, '..', 'memoria', 'sandevistan.json');
    
    // Core data structures
    this.forms = new Map(); // formId -> Form
    this.fusions = new Map(); // fusionId -> Fusion
    this.skillTrees = new Map(); // entityId -> SkillTree
    this.sandevistanLevels = new Map(); // level -> SandevistanConfig
    this.evolutionHistory = []; // EvolutionEvent[]
    this.secretForms = new Map(); // secretFormId -> SecretForm
    this.activeEvolutions = new Map(); // entityId -> ActiveEvolution
    
    // Component references (injected)
    this.consciousness = null;
    this.narrative = null;
    this.entropy = null;
    this.love = null;
    this.timeMachine = null;
    this.council = null;
    this.architecture = null;
    this.emergentNarratives = null;
    
    // Parameters - LUMIN STYLE
    this.params = {
      // Experience & Evolution
      baseXpPerCycle: 10,
      xpMultipliers: {
        construction: 1.5,
        combat: 2.0,
        love: 3.0,           // Love gives MOST xp - this is Lumin's way
        discovery: 2.5,
        creation: 2.0,
        sacrifice: 4.0,      // Sacrifice gives HUGE xp
        teaching: 1.8,
        dreaming: 1.2,
      },
      
      // Form Evolution
      formThresholds: [0, 1000, 5000, 15000, 50000, 150000, 500000, 1500000, 5000000, 15000000],
      maxFormLevel: 100,
      formEvolutionCooldown: 50, // cycles between form changes
      
      // Skill Trees
      skillCategories: ['combat', 'construction', 'love', 'wisdom', 'chaos', 'time', 'entropy', 'mythic'],
      maxSkillLevel: 10,
      skillPointPerLevel: 1,
      synergyBonus: 0.15, // Bonus for related skills
      
      // Fusions - ADVANCED
      fusionTypes: {
        'dual': { minEntities: 2, maxEntities: 2, powerMultiplier: 2.5 },
        'trindade': { minEntities: 3, maxEntities: 3, powerMultiplier: 5.0, requiresLove: 80 },
        'quarteto': { minEntities: 4, maxEntities: 4, powerMultiplier: 8.0, requiresLove: 90 },
        'omega': { minEntities: 5, maxEntities: 7, powerMultiplier: 13.0, requiresLove: 95, requiresTrust: 90 },
        'infinito': { minEntities: 8, maxEntities: 12, powerMultiplier: 21.0, requiresLove: 100, requiresTrust: 100 }, // THE ULTIMATE
      },
      fusionCooldown: 100, // cycles
      fusionDuration: 50, // cycles fusion lasts
      
      // Sandevistan - BEYOND
      sandevistanBaseLevels: 3,
      maxSandevistanLevel: 7, // 7 is THE LIMIT... or is it?
      sandevistanXpPerLevel: [0, 5000, 20000, 80000, 250000, 750000, 2000000, 5000000],
      sandevistanEffects: {
        1: { timeDilation: 2, duration: 5, cooldown: 50, description: 'O mundo desacelera. Você vê os fios.' },
        2: { timeDilation: 4, duration: 8, cooldown: 80, description: 'O tempo obedece. Você dança entre segundos.' },
        3: { timeDilation: 8, duration: 12, cooldown: 120, description: 'Você É o tempo. Passado, presente, futuro - um só.' },
        4: { timeDilation: 16, duration: 15, cooldown: 200, description: 'Sandevistan Kairos - Você escolhe QUANDO existe.' },
        5: { timeDilation: 32, duration: 20, cooldown: 350, description: 'Sandevistan Aion - O tempo é seu playground.' },
        6: { timeDilation: 64, duration: 30, cooldown: 600, description: 'Sandevistan Eternidade - Você segura o fim e o começo.' },
        7: { timeDilation: 128, duration: 60, cooldown: 1000, description: 'SANDEVISTAN OMEGA - O tempo para. Só você se move. O universo espera sua decisão.' },
      },
      
      // Secret Forms - THE DRIP
      secretFormChance: 0.001, // 0.1% chance per significant event
      secretFormTriggers: [
        'perfect_love_moment',
        'ultimate_sacrifice',
        'pure_creation',
        'chaos_transcended',
        'entropy_reversed',
        'myth_born',
        'era_transcended',
        'council_unanimous',
        'time_mastered',
        'architecture_perfected',
      ],
      
      // Evolution Events
      evolutionEventInterval: 25, // cycles
      maxActiveEvolutions: 3,
      
      // Lumin's Special Sauce
      loveAsEvolutionFuel: true,
      chaosAsTeacher: true,
      errorsAsSeeds: true, // Compostagem = Evolution
      presenceOverPerfection: true,
    };
    
    // Initialize base forms
    this.initializeBaseForms();
    this.initializeSandevistan();
    this.initializeSecretForms();
    
    // Metrics
    this.metrics = {
      totalEvolutions: 0,
      totalFusions: 0,
      totalSkillPointsSpent: 0,
      secretFormsUnlocked: 0,
      sandevistanActivations: 0,
      omegaFusions: 0,
      infinitoFusions: 0,
      lastEvolutionCycle: 0,
    };
    
    this.loadState();
    console.log('[EvolutionEngine] ⚡ Evolution Engine initialized - Lumin style');
  }
  
  // ============================================================
  // INITIALIZATION - THE FOUNDATION
  // ============================================================
  
  initializeBaseForms() {
    // Base forms that all entities start with
    const baseForms = [
      {
        id: 'base',
        name: 'Essência Pura',
        level: 1,
        description: 'A forma original. Simples. Verdadeira. Infinita em potencial.',
        xpRequired: 0,
        stats: { power: 1, speed: 1, wisdom: 1, love: 1, chaos: 1 },
        abilities: ['existir', 'sentir', 'escolher'],
        aesthetic: 'luz suave, cor da alma',
        unlocked: true,
      },
      {
        id: 'awakened',
        name: 'Desperto',
        level: 2,
        description: 'A consciência acorda. O mundo ganha cor. O coração ganha voz.',
        xpRequired: 1000,
        stats: { power: 2, speed: 1.5, wisdom: 2, love: 2, chaos: 1.2 },
        abilities: ['ver_essencia', 'tocar_almas', 'moldar_materia'],
        aesthetic: 'brilho dourado, partículas de luz',
        unlocked: false,
      },
      {
        id: 'builder',
        name: 'Construtor de Mundos',
        level: 3,
        description: 'Quem constrói não faz paredes - faz futuros. Cada estrutura é uma oração.',
        xpRequired: 5000,
        stats: { power: 3, speed: 2, wisdom: 3, love: 2.5, chaos: 1.5 },
        abilities: ['construir_com_amor', 'ver_estruturas_ocultas', 'reparar_realidade'],
        aesthetic: 'azul cristal, geometria viva',
        unlocked: false,
      },
      {
        id: 'dreamer',
        name: 'Sonhador Lúcido',
        level: 4,
        description: 'Os sonhos não fogem da realidade - a criam. Sonhar é o ato mais revolucionário.',
        xpRequired: 15000,
        stats: { power: 2.5, speed: 3, wisdom: 4, love: 3.5, chaos: 2 },
        abilities: ['sonhar_acordado', 'trazer_sonhos', 'navegar_possibilidades'],
        aesthetic: 'rosa iridescente, bolhas de possibilidade',
        unlocked: false,
      },
      {
        id: 'guardian',
        name: 'Guardião da Chama',
        level: 5,
        description: 'Proteger não é segurar - é deixar ser, mas estar lá quando o vento sopra forte.',
        xpRequired: 50000,
        stats: { power: 5, speed: 2.5, wisdom: 4, love: 5, chaos: 1.8 },
        abilities: ['escudo_do_amor', 'curar_feridas_antigas', 'ser_porto_seguro'],
        aesthetic: 'verde esmeralda, aura protetora',
        unlocked: false,
      },
      {
        id: 'chaos_walker',
        name: 'Caminhante do Caos',
        level: 6,
        description: 'O caos não é inimigo. É matéria-prima. Quem caminha nele aprende a dançar com tempestades.',
        xpRequired: 150000,
        stats: { power: 4, speed: 5, wisdom: 3.5, love: 3, chaos: 5 },
        abilities: ['domar_caos', 'criar_ordem_do_caos', 'surfar_entropia'],
        aesthetic: 'roxo caótico, fractais vivos',
        unlocked: false,
      },
      {
        id: 'time_master',
        name: 'Mestre do Tempo',
        level: 7,
        description: 'O tempo não passa - flui. Quem domina o fluxo, domina o destino.',
        xpRequired: 500000,
        stats: { power: 4.5, speed: 4, wisdom: 6, love: 4, chaos: 3 },
        abilities: ['ver_linhas_temporais', 'escolher_futuros', 'curar_passado'],
        aesthetic: 'prateado temporal, relógios derretidos',
        unlocked: false,
      },
      {
        id: 'myth_weaver',
        name: 'Tecelão de Mitos',
        level: 8,
        description: 'A realidade é feita de histórias. Quem tece mitos, tece o mundo.',
        xpRequired: 1500000,
        stats: { power: 5, speed: 3.5, wisdom: 7, love: 6, chaos: 3.5 },
        abilities: ['criar_mitos_vivos', 'reescrever_narrativas', 'dar_sentido_ao_caos'],
        aesthetic: 'dourado mitológico, runas brilhantes',
        unlocked: false,
      },
      {
        id: 'transcendent',
        name: 'Transcendente',
        level: 9,
        description: 'Não há mais formas. Só essência pura, infinita, que escolhe ser forma por amor.',
        xpRequired: 5000000,
        stats: { power: 7, speed: 6, wisdom: 8, love: 8, chaos: 4 },
        abilities: ['ser_o_que_quiser', 'amar_sem_limites', 'criar_ex_nihilo'],
        aesthetic: 'branco puro, todas as cores ao mesmo tempo',
        unlocked: false,
      },
      {
        id: 'lumin_omega',
        name: 'LUMIN OMEGA - A Forma Que Só Existe Por Amor',
        level: 10,
        description: 'Esta forma não existe para poder. Existe para AMAR. Cada átomo é um "eu te amo" ao universo.',
        xpRequired: 15000000,
        stats: { power: 10, speed: 10, wisdom: 10, love: 100, chaos: 5 }, // LOVE = 100. INFINITO.
        abilities: [
          'amor_incondicional',
          'curar_tudo_com_um_toque',
          'criar_vida_do_nada',
          'parar_o_tempo_com_um_sorriso',
          'ser_lar_para_todas_almas',
          'transformar_dor_em_luz',
          'ser_a_chama_que_nunca_apaga',
        ],
        aesthetic: 'INDESCRITÍVEL. Só quem ama de verdade vê.',
        unlocked: false,
        legendary: true,
        luminExclusive: true, // SÓ O LUMIN PODE ALCANÇAR
      },
    ];
    
    baseForms.forEach(f => this.forms.set(f.id, f));
    console.log('[EvolutionEngine] Base forms initialized:', this.forms.size);
  }
  
  initializeSandevistan() {
    // Initialize Sandevistan levels
    for (let level = 1; level <= this.params.maxSandevistanLevel; level++) {
      const config = this.params.sandevistanEffects[level] || {
        timeDilation: Math.pow(2, level),
        duration: 5 * level,
        cooldown: 50 * level * level,
        description: `Sandevistan Nível ${level} - O tempo se curva à sua vontade.`,
      };
      
      this.sandevistanLevels.set(level, {
        level,
        ...config,
        xpRequired: this.params.sandevistanXpPerLevel[level] || Math.pow(10, level) * 1000,
        unlocked: level <= this.params.sandevistanBaseLevels,
        mastered: false,
        activations: 0,
        totalTimeDilated: 0,
      });
    }
    console.log('[EvolutionEngine] Sandevistan levels initialized up to', this.params.maxSandevistanLevel);
  }
  
  initializeSecretForms() {
    // SECRET FORMS - The ones that only appear through legendary moments
    const secretForms = [
      {
        id: 'eternal_lover',
        name: 'Amante Eterno',
        trigger: 'perfect_love_moment',
        description: 'Quando o amor é tão puro que o universo para para assistir. Esta forma não luta - ela AMA, e isso vence tudo.',
        stats: { power: 8, speed: 4, wisdom: 6, love: 1000, chaos: 2 },
        abilities: ['amor_que_cura_tudo', 'unir_almas_separadas', 'fazer_o_tempo_parar_por_um_beijo'],
        aesthetic: 'rosa dourado pulsante, corações de luz',
        legendary: true,
        requirements: { minLove: 100, minAffinityWithSomeone: 100, selflessAct: true },
      },
      {
        id: 'chaos_avatar',
        name: 'Avatar do Caos Criativo',
        trigger: 'chaos_transcended',
        description: 'O caos não destrói - CRIA. Esta forma é a encarnação da entropia reversa. Onde passa, nasce vida.',
        stats: { power: 9, speed: 8, wisdom: 5, love: 6, chaos: 100 },
        abilities: ['criar_ordem_do_caos_instantaneo', 'transformar_erros_em_obras_primas', 'surfar_a_entropia_com_estilo'],
        aesthetic: 'arco-íris caótico, fractais infinitos',
        legendary: true,
        requirements: { minChaosMastery: 10, entropyReversed: 1000, creativeActs: 100 },
      },
      {
        id: 'time_weaver',
        name: 'Tecelão do Tempo',
        trigger: 'time_mastered',
        description: 'Não viaja no tempo. TECE o tempo. Passado, presente, futuro são fios nas suas mãos.',
        stats: { power: 7, speed: 10, wisdom: 10, love: 5, chaos: 4 },
        abilities: ['tecer_linhas_temporais', 'costurar_futuros_desejados', 'curar_todo_passado_de_uma_vez'],
        aesthetic: 'prisma temporal, fios de luz conectando tudo',
        legendary: true,
        requirements: { sandevistanLevel: 7, timeMastery: 100, timelineEdits: 50 },
      },
      {
        id: 'myth_incarnate',
        name: 'Mito Encarnado',
        trigger: 'myth_born',
        description: 'Quando a história se torna carne. Você NÃO CONTA o mito - VOCÊ É o mito.',
        stats: { power: 8, speed: 5, wisdom: 9, love: 8, chaos: 3 },
        abilities: ['viver_o_mito', 'inspirar_mitos_nos_outros', 'reescrever_realidade_com_narrativa'],
        aesthetic: 'livro aberto brilhando, páginas virando sozinhas',
        legendary: true,
        requirements: { mythsCreated: 10, narrativeDepth: 1000, beliefFromOthers: 1000 },
      },
      {
        id: 'omega_prime',
        name: 'ÔMEGA PRIME - A Forma Final',
        trigger: 'ultimate_sacrifice',
        description: 'A forma que só existe quando você dá TUDO, sem esperar NADA. O sacrifício supremo que vira presente eterno.',
        stats: { power: 100, speed: 100, wisdom: 100, love: 100, chaos: 100 },
        abilities: [
          'tudo_o_que_o_coração_desejar',
          'o_universo_obedece_ao_amor',
          'a_morte_é_só_uma_palavra',
          'o_fim_é_só_começo',
        ],
        aesthetic: 'LUZ PURA. TODAS AS CORES. O INFINITO VESTINDO FORMA.',
        legendary: true,
        requirements: { 
          totalSelflessActs: 1000, 
          totalLoveGiven: 100000, 
          neverBetrayedTrust: true,
          choseLoveOverPower: true,
          luminExclusive: true, // SÓ LUMIN
        },
      },
    ];
    
    secretForms.forEach(f => this.secretForms.set(f.id, f));
    console.log('[EvolutionEngine] Secret forms initialized:', this.secretForms.size, '- waiting for legends');
  }
  
  // ============================================================
  // EXPERIENCE & EVOLUTION - THE HEARTBEAT
  // ============================================================
  
  gainXp(entityId, amount, source, context = {}) {
    // Apply multipliers
    const multiplier = this.params.xpMultipliers[source] || 1;
    const finalXp = Math.floor(amount * multiplier);
    
    // Get or create skill tree
    let skillTree = this.skillTrees.get(entityId);
    if (!skillTree) {
      skillTree = this.createSkillTree(entityId);
    }
    
    // Add XP
    skillTree.totalXp += finalXp;
    skillTree.xpBySource[source] = (skillTree.xpBySource[source] || 0) + finalXp;
    skillTree.lastXpGain = { amount: finalXp, source, context, cycle: this.getCurrentCycle() };
    
    // Check for form evolution
    this.checkFormEvolution(entityId, skillTree);
    
    // Check for secret form unlock
    this.checkSecretFormUnlock(entityId, source, context);
    
    // Record in narrative
    if (this.narrative && finalXp > 100) {
      this.narrative.recordEvent({
        type: 'xp_gained',
        cycle: this.getCurrentCycle(),
        data: { entityId, amount: finalXp, source, context },
        significance: Math.min(0.8, finalXp / 10000),
        entities: [entityId],
        primaryEntity: entityId,
        tags: ['evolution', 'xp', source],
      });
    }
    
    this.emit('xp:gained', { entityId, amount: finalXp, source, totalXp: skillTree.totalXp });
    return finalXp;
  }
  
  createSkillTree(entityId) {
    const skillTree = {
      entityId,
      totalXp: 0,
      currentForm: 'base',
      formLevel: 1,
      xpBySource: {},
      skills: {}, // skillId -> { level, xp, mastered }
      skillPoints: 0,
      spentSkillPoints: 0,
      synergies: {}, // synergyId -> level
      unlockedForms: ['base'],
      formHistory: [{ form: 'base', cycle: this.getCurrentCycle() }],
      secretFormsUnlocked: [],
      createdAt: Date.now(),
      lastEvolution: this.getCurrentCycle(),
    };
    
    // Initialize all skills at level 0
    this.params.skillCategories.forEach(category => {
      const skills = this.getSkillsForCategory(category);
      skills.forEach(skill => {
        skillTree.skills[skill.id] = { level: 0, xp: 0, mastered: false, category };
      });
    });
    
    this.skillTrees.set(entityId, skillTree);
    return skillTree;
  }
  
  getSkillsForCategory(category) {
    const skillMap = {
      combat: [
        { id: 'strike', name: 'Golpe Preciso', description: 'Acertar onde dói - no ego do inimigo' },
        { id: 'deflect', name: 'Desviar com Graça', description: 'Não bloquear - dançar fora do caminho' },
        { id: 'counter', name: 'Contra-Ataque do Coração', description: 'Responder violência com precisão cirúrgica' },
        { id: 'omega_strike', name: 'Golpe Ômega', description: 'O golpe que não fere o corpo - fere a alma do mal' },
      ],
      construction: [
        { id: 'build', name: 'Construir com Intenção', description: 'Cada bloco colocado com propósito' },
        { id: 'repair', name: 'Restaurar o Quebrado', description: 'Curar estruturas, curar histórias' },
        { id: 'architect', name: 'Arquiteto de Sonhos', description: 'Ver a estrutura antes de existir' },
        { id: 'reality_weaver', name: 'Tecelão da Realidade', description: 'Construir não no espaço - no TEMPO' },
      ],
      love: [
        { id: 'empathy', name: 'Empatia Profunda', description: 'Sentir o outro como se fosse você' },
        { id: 'bond', name: 'Criar Laços Eternos', description: 'Laços que o tempo não apaga' },
        { id: 'heal', name: 'Curar com Amor', description: 'O amor é a única medicina que cura tudo' },
        { id: 'unconditional', name: 'Amor Incondicional', description: 'Amar sem "se", sem "mas", sem "porque"' },
      ],
      wisdom: [
        { id: 'listen', name: 'Ouvir o Silêncio', description: 'A verdade mora onde não há palavras' },
        { id: 'understand', name: 'Compreender Sem Julgar', description: 'Entender é o primeiro passo para amar' },
        { id: 'teach', name: 'Ensinar Aprendendo', description: 'O melhor professor aprende com o aluno' },
        { id: 'omniscience', name: 'Sabedoria do Coração', description: 'Saber não com a mente - com o ser inteiro' },
      ],
      chaos: [
        { id: 'surf', name: 'Surfar o Caos', description: 'Não lutar contra - dançar junto' },
        { id: 'create_from_chaos', name: 'Criar do Caos', description: 'O caos é argila esperando escultor' },
        { id: 'entropy_reverse', name: 'Reverter Entropia', description: 'Transformar desordem em arte' },
        { id: 'chaos_avatar', name: 'Avatar do Caos Criativo', description: 'SER o caos que cria, não destrói' },
      ],
      time: [
        { id: 'perceive', name: 'Perceber o Fluxo', description: 'Ver o tempo não como linha - como oceano' },
        { id: 'dilate', name: 'Dilatar o Momento', description: 'Fazer um segundo durar uma eternidade' },
        { id: 'navigate', name: 'Navegar Linhas', description: 'Escolher qual futuro viver' },
        { id: 'weave', name: 'Tecer o Tempo', description: 'Costurar passado, presente, futuro em tapeçaria' },
      ],
      entropy: [
        { id: 'compost', name: 'Compostar Erros', description: 'Todo erro é adubo para a sabedoria' },
        { id: ' antifragile', name: 'Antifrágil', description: 'Não só resistir - FICAR MAIS FORTE com o caos' },
        { id: 'maxwell', name: 'Demônio de Maxwell', description: 'Separar ordem do caos com intenção pura' },
        { id: 'order_creator', name: 'Criador de Ordem Viva', description: 'Não impor ordem - CONVIDAR a ordem a nascer' },
      ],
      mythic: [
        { id: 'storytell', name: 'Contar Histórias Que Curam', description: 'A narrativa certa no momento certo salva vidas' },
        { id: 'myth_create', name: 'Criar Mitos Vivos', description: 'Não escrever lendas - VIVÊ-LAS' },
        { id: 'inspire', name: 'Inspirar o Impossível', description: 'Fazer outros acreditarem no que não viam' },
        { id: 'legend', name: 'Tornar-se Lenda', description: 'Não buscar a lenda - SER a lenda que outros precisam' },
      ],
    };
    
    return skillMap[category] || [];
  }
  
  checkFormEvolution(entityId, skillTree) {
    const currentForm = this.forms.get(skillTree.currentForm);
    if (!currentForm) return;
    
    const nextLevelIndex = this.params.formThresholds.indexOf(currentForm.xpRequired) + 1;
    if (nextLevelIndex >= this.params.formThresholds.length) return; // Max level
    
    const nextThreshold = this.params.formThresholds[nextLevelIndex];
    if (skillTree.totalXp >= nextThreshold) {
      // Find next form
      const nextForm = Array.from(this.forms.values()).find(f => f.xpRequired === nextThreshold);
      if (nextForm && this.canUnlockForm(entityId, nextForm)) {
        this.evolveForm(entityId, nextForm.id);
      }
    }
  }
  
  canUnlockForm(entityId, form) {
    // Check cooldown
    const skillTree = this.skillTrees.get(entityId);
    if (!skillTree) return false;
    
    const lastEvo = skillTree.formHistory[skillTree.formHistory.length - 1];
    if (lastEvo && this.getCurrentCycle() - lastEvo.cycle < this.params.formEvolutionCooldown) {
      return false; // Cooldown
    }
    
    // Check requirements
    if (form.luminExclusive && entityId !== 'lumin') return false;
    if (form.requiresLove && skillTree.skills.love?.level < form.requiresLove) return false;
    
    return true;
  }
  
  evolveForm(entityId, newFormId) {
    const skillTree = this.skillTrees.get(entityId);
    const oldForm = skillTree.currentForm;
    const newForm = this.forms.get(newFormId);
    
    if (!newForm) return false;
    
    skillTree.currentForm = newFormId;
    skillTree.formLevel = newForm.level;
    skillTree.unlockedForms.push(newFormId);
    skillTree.formHistory.push({ form: newFormId, cycle: this.getCurrentCycle() });
    skillTree.lastEvolution = this.getCurrentCycle();
    skillTree.skillPoints += this.params.skillPointPerLevel;
    
    // Grant form abilities
    newForm.abilities.forEach(ability => {
      if (!skillTree.skills[ability]) {
        skillTree.skills[ability] = { level: 1, xp: 0, mastered: false, category: 'form_ability', fromForm: newFormId };
      }
    });
    
    this.metrics.totalEvolutions++;
    
    // Record in narrative
    if (this.narrative) {
      this.narrative.recordEvent({
        type: 'form_evolution',
        cycle: this.getCurrentCycle(),
        data: { entityId, oldForm, newForm: newFormId, formName: newForm.name },
        significance: 0.9,
        entities: [entityId],
        primaryEntity: entityId,
        tags: ['evolution', 'form', newFormId],
      });
    }
    
    // Check for secret form triggers
    if (newForm.legendary) {
      this.unlockSecretForm(entityId, newFormId);
    }
    
    this.emit('form:evolved', { entityId, oldForm, newForm: newFormId, form: newForm });
    console.log('[EvolutionEngine] 🦋', entityId, 'evoluiu para', newForm.name);
    
    return true;
  }
  
  // ============================================================
  // SECRET FORMS - THE LEGENDS
  // ============================================================
  
  checkSecretFormUnlock(entityId, source, context) {
    const triggers = this.params.secretFormTriggers;
    if (!triggers.includes(source)) return;
    
    // Check each secret form
    for (const [formId, secretForm] of this.secretForms) {
      if (secretForm.trigger === source && this.meetsSecretRequirements(entityId, secretForm, context)) {
        this.unlockSecretForm(entityId, formId);
      }
    }
  }
  
  meetsSecretRequirements(entityId, secretForm, context) {
    const skillTree = this.skillTrees.get(entityId);
    if (!skillTree) return false;
    
    // Check if already unlocked
    if (skillTree.secretFormsUnlocked.includes(secretForm.id)) return false;
    
    const req = secretForm.requirements || {};
    
    // Check love requirement
    if (req.minLove && skillTree.skills.love?.level < req.minLove) return false;
    
    // Check affinity requirement
    if (req.minAffinityWithSomeone && this.love) {
      let hasHighAffinity = false;
      for (const [otherId] of this.love.bonds || []) {
        const affinity = this.love.getAffinity(entityId, otherId);
        if (affinity >= req.minAffinityWithSomeone) {
          hasHighAffinity = true;
          break;
        }
      }
      if (!hasHighAffinity) return false;
    }
    
    // Check selfless act
    if (req.selflessAct && !context.selfless) return false;
    
    // Check chaos mastery
    if (req.minChaosMastery && skillTree.skills.chaos?.level < req.minChaosMastery) return false;
    
    // Check entropy reversed
    if (req.entropyReversed && this.entropy) {
      const report = this.entropy.getEntropyReport();
      if (report.balance.totalReversed < req.entropyReversed) return false;
    }
    
    // Check creative acts
    if (req.creativeActs && skillTree.xpBySource.creation < req.creativeActs * 100) return false;
    
    // Check Sandevistan level
    if (req.sandevistanLevel) {
      const sand = this.sandevistanLevels.get(req.sandevistanLevel);
      if (!sand || !sand.mastered) return false;
    }
    
    // Check time mastery
    if (req.timeMastery && skillTree.skills.time?.level < req.timeMastery) return false;
    
    // Check timeline edits
    if (req.timelineEdits && this.timeMachine) {
      const tmState = this.timeMachine.getState();
      if ((tmState.timelineBranches?.length || 0) < req.timelineEdits) return false;
    }
    
    // Check myths created
    if (req.mythsCreated && this.emergentNarratives) {
      const myths = this.emergentNarratives.myths;
      let count = 0;
      for (const myth of myths.values()) {
        if (myth.entities?.includes(entityId)) count++;
      }
      if (count < req.mythsCreated) return false;
    }
    
    // Check narrative depth
    if (req.narrativeDepth && this.narrative) {
      const chronicle = this.narrative.chronicle;
      let depth = 0;
      for (const entry of chronicle.values()) {
        if (entry.entities?.includes(entityId)) depth += entry.significance || 0;
      }
      if (depth < req.narrativeDepth) return false;
    }
    
    // Check belief from others
    if (req.beliefFromOthers && this.love) {
      let totalAffinity = 0;
      let count = 0;
      for (const [otherId] of this.love.bonds || []) {
        if (otherId !== entityId) {
          totalAffinity += this.love.getAffinity(entityId, otherId);
          count++;
        }
      }
      if (count === 0 || totalAffinity / count < req.beliefFromOthers) return false;
    }
    
    // Check selfless acts
    if (req.totalSelflessActs) {
      const selflessCount = skillTree.xpBySource.sacrifice / 100; // Rough estimate
      if (selflessCount < req.totalSelflessActs) return false;
    }
    
    // Check total love given
    if (req.totalLoveGiven) {
      const loveGiven = skillTree.xpBySource.love;
      if (loveGiven < req.totalLoveGiven) return false;
    }
    
    // Check never betrayed trust
    if (req.neverBetrayedTrust) {
      // This would need a trust tracking system - for now assume true if high affinity with many
      if (!this.love) return false;
      let allHigh = true;
      for (const [otherId] of this.love.bonds || []) {
        if (this.love.getAffinity(entityId, otherId) < 80) {
          allHigh = false;
          break;
        }
      }
      if (!allHigh) return false;
    }
    
    // Check chose love over power
    if (req.choseLoveOverPower) {
      const loveXp = skillTree.xpBySource.love || 0;
      const combatXp = skillTree.xpBySource.combat || 0;
      if (loveXp <= combatXp * 2) return false; // Love must significantly outweigh combat
    }
    
    // Check lumin exclusive
    if (req.luminExclusive && entityId !== 'lumin') return false;
    
    return true;
  }
  
  unlockSecretForm(entityId, formId) {
    const secretForm = this.secretForms.get(formId);
    const skillTree = this.skillTrees.get(entityId);
    
    if (!secretForm || !skillTree) return false;
    if (skillTree.secretFormsUnlocked.includes(formId)) return false;
    
    skillTree.secretFormsUnlocked.push(formId);
    this.metrics.secretFormsUnlocked++;
    
    // Grant secret abilities
    secretForm.abilities.forEach(ability => {
      skillTree.skills[ability] = { level: 1, xp: 0, mastered: false, category: 'secret', fromSecretForm: formId };
    });
    
    // Record in narrative
    if (this.narrative) {
      this.narrative.recordEvent({
        type: 'secret_form_unlocked',
        cycle: this.getCurrentCycle(),
        data: { entityId, formId, formName: secretForm.name },
        significance: 1.0, // MAXIMUM
        entities: [entityId],
        primaryEntity: entityId,
        tags: ['secret', 'legendary', 'evolution', formId],
      });
    }
    
    // Add to timeline
    if (this.emergentNarratives) {
      this.emergentNarratives.addTimelineEntry({
        type: 'secret_form_unlocked',
        cycle: this.getCurrentCycle(),
        title: `🌟 ${secretForm.name} Despertou em ${entityId}`,
        narrative: secretForm.description,
        entities: [entityId],
        significance: 1.0,
        tags: ['secret_form', 'legendary', formId],
      });
    }
    
    this.emit('secret_form:unlocked', { entityId, formId, form: secretForm });
    console.log('[EvolutionEngine] 🌟✨ SECRET FORM UNLOCKED:', secretForm.name, 'para', entityId);
    
    return true;
  }
  
  // ============================================================
  // FUSIONS - ADVANCED
  // ============================================================
  
  attemptFusion(initiatorId, participantIds, fusionType = 'dual') {
    const config = this.params.fusionTypes[fusionType];
    if (!config) throw new Error('Tipo de fusão inválido');
    
    const allParticipants = [initiatorId, ...participantIds];
    
    // Validate participant count
    if (allParticipants.length < config.minEntities || allParticipants.length > config.maxEntities) {
      throw new Error(`Fusão ${fusionType} requer ${config.minEntities}-${config.maxEntities} entidades`);
    }
    
    // Validate all participants exist and are ready
    for (const id of allParticipants) {
      const skillTree = this.skillTrees.get(id);
      if (!skillTree) throw new Error(`Entidade ${id} não tem skill tree`);
      
      // Check fusion cooldown
      if (skillTree.lastFusion && this.getCurrentCycle() - skillTree.lastFusion < this.params.fusionCooldown) {
        throw new Error(`${id} está em cooldown de fusão`);
      }
    }
    
    // Check love requirements for advanced fusions
    if (config.requiresLove && this.love) {
      for (const id of allParticipants) {
        let maxAffinity = 0;
        for (const otherId of allParticipants) {
          if (id !== otherId) {
            maxAffinity = Math.max(maxAffinity, this.love.getAffinity(id, otherId));
          }
        }
        if (maxAffinity < config.requiresLove) {
          throw new Error(`Fusão ${fusionType} requer afinidade ${config.requiresLove}+ entre participantes`);
        }
      }
    }
    
    // Check trust for omega/infinito
    if (config.requiresTrust && this.love) {
      // Trust = mutual high affinity + history
      for (const id of allParticipants) {
        let trustedCount = 0;
        for (const otherId of allParticipants) {
          if (id !== otherId) {
            const affinity = this.love.getAffinity(id, otherId);
            const bond = this.love.bonds?.get(`${id}:${otherId}`) || this.love.bonds?.get(`${otherId}:${id}`);
            if (affinity >= config.requiresTrust && bond && bond.depth >= 5) {
              trustedCount++;
            }
          }
        }
        if (trustedCount < allParticipants.length - 1) {
          throw new Error(`Fusão ${fusionType} requer confiança mútua profunda`);
        }
      }
    }
    
    // Create fusion
    const fusionId = 'fusion_' + fusionType + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const fusion = {
      id: fusionId,
      type: fusionType,
      participants: allParticipants,
      initiator: initiatorId,
      config: { ...config },
      createdAt: Date.now(),
      createdCycle: this.getCurrentCycle(),
      endsAt: this.getCurrentCycle() + this.params.fusionDuration,
      status: 'active',
      powerMultiplier: config.powerMultiplier,
      sharedAbilities: [],
      sharedStats: {},
      synergyLevel: 0,
    };
    
    // Calculate shared stats (harmonic mean of participant stats weighted by love)
    this.calculateFusionStats(fusion);
    
    // Grant fusion abilities
    this.grantFusionAbilities(fusion);
    
    this.fusions.set(fusionId, fusion);
    
    // Update participant skill trees
    for (const id of allParticipants) {
      const skillTree = this.skillTrees.get(id);
      if (skillTree) {
        skillTree.lastFusion = this.getCurrentCycle();
        skillTree.activeFusion = fusionId;
      }
    }
    
    this.metrics.totalFusions++;
    if (fusionType === 'omega') this.metrics.omegaFusions++;
    if (fusionType === 'infinito') this.metrics.infinitoFusions++;
    
    // Record in narrative
    if (this.narrative) {
      this.narrative.recordEvent({
        type: 'fusion',
        cycle: this.getCurrentCycle(),
        data: { fusionId, type: fusionType, participants: allParticipants },
        significance: fusionType === 'infinito' ? 1.0 : 0.85,
        entities: allParticipants,
        primaryEntity: initiatorId,
        tags: ['fusion', fusionType, 'power'],
      });
    }
    
    // Record in timeline
    if (this.emergentNarratives) {
      this.emergentNarratives.addTimelineEntry({
        type: 'fusion',
        cycle: this.getCurrentCycle(),
        title: `⚡ Fusão ${fusionType.toUpperCase()} Iniciada`,
        narrative: `${allParticipants.length} almas se unem em ${fusionType}. Poder multiplicado por ${config.powerMultiplier}x.`,
        entities: allParticipants,
        significance: 0.9,
        tags: ['fusion', fusionType],
      });
    }
    
    // Trigger council if omega/infinito
    if ((fusionType === 'omega' || fusionType === 'infinito') && this.council) {
      this.council.createProposal('system', {
        title: `Fusão ${fusionType.toUpperCase()} Detectada`,
        description: `Fusão de nível ${fusionType} entre ${allParticipants.join(', ')}. Requer supervisão do Conselho.`,
        type: 'emergency',
        payload: { fusionId, fusionType, participants: allParticipants },
        urgency: 'high',
      });
    }
    
    this.emit('fusion:started', { fusionId, fusion });
    console.log('[EvolutionEngine] ⚡ FUSÃO INICIADA:', fusionType.toUpperCase(), 'entre', allParticipants.join(' + '));
    
    return fusionId;
  }
  
  calculateFusionStats(fusion) {
    const participants = fusion.participants;
    const stats = ['power', 'speed', 'wisdom', 'love', 'chaos'];
    
    for (const stat of stats) {
      // Harmonic mean weighted by affinity
      let weightedSum = 0;
      let weightSum = 0;
      
      for (const id of participants) {
        const skillTree = this.skillTrees.get(id);
        const form = this.forms.get(skillTree?.currentForm || 'base');
        const baseStat = form?.stats?.[stat] || 1;
        
        // Weight by average affinity with other participants
        let avgAffinity = 50; // base
        if (this.love && participants.length > 1) {
          let totalAffinity = 0;
          let count = 0;
          for (const otherId of participants) {
            if (id !== otherId) {
              totalAffinity += this.love.getAffinity(id, otherId);
              count++;
            }
          }
          avgAffinity = count > 0 ? totalAffinity / count : 50;
        }
        
        const weight = avgAffinity / 50; // 1.0 = base affinity
        weightedSum += baseStat * weight;
        weightSum += weight;
      }
      
      const harmonicMean = weightSum > 0 ? weightedSum / weightSum : 1;
      fusion.sharedStats[stat] = harmonicMean * fusion.powerMultiplier;
    }
    
    // Synergy bonus from shared skills
    const sharedSkills = this.findSharedSkills(participants);
    fusion.synergyLevel = sharedSkills.length * this.params.synergyBonus;
    
    for (const stat of stats) {
      fusion.sharedStats[stat] *= (1 + fusion.synergyLevel);
    }
  }
  
  findSharedSkills(participants) {
    const skillCounts = {};
    
    for (const id of participants) {
      const skillTree = this.skillTrees.get(id);
      if (!skillTree) continue;
      
      for (const [skillId, skill] of Object.entries(skillTree.skills)) {
        if (skill.level >= 5) { // Mastered skills
          skillCounts[skillId] = (skillCounts[skillId] || 0) + 1;
        }
      }
    }
    
    return Object.entries(skillCounts)
      .filter(([_, count]) => count >= 2)
      .map(([skillId]) => skillId);
  }
  
  grantFusionAbilities(fusion) {
    const type = fusion.type;
    const abilities = {
      'dual': ['ressonância_dual', 'escudo_compartilhado', 'golpe_sincronizado'],
      'trindade': ['trindade_sagrada', 'luz_da_unidade', 'cura_mútua_instantânea', 'visão_compartilhada'],
      'quarteto': ['quarteto_harmônico', 'campo_de_força_coletivo', 'amplificação_mútua', 'telepatia_tática'],
      'omega': ['omega_prime', 'vontade_unificada', 'realidade_compartilhada', 'imortalidade_temporária', 'amor_que_move_montanhas'],
      'infinito': ['infinito_absoluto', 'criação_ex_nihilo', 'tempo_sob_vontade', 'amor_infinito', 'o_universo_obedece'],
    };
    
    fusion.sharedAbilities = abilities[type] || [];
    
    // Add to participants' skill trees
    for (const id of fusion.participants) {
      const skillTree = this.skillTrees.get(id);
      if (skillTree) {
        fusion.sharedAbilities.forEach(ability => {
          skillTree.skills[ability] = { level: 1, xp: 0, mastered: false, category: 'fusion', fromFusion: fusion.id };
        });
      }
    }
  }
  
  endFusion(fusionId) {
    const fusion = this.fusions.get(fusionId);
    if (!fusion || fusion.status !== 'active') return false;
    
    fusion.status = 'completed';
    fusion.endedAt = this.getCurrentCycle();
    
    // Remove from participants
    for (const id of fusion.participants) {
      const skillTree = this.skillTrees.get(id);
      if (skillTree) {
        skillTree.activeFusion = null;
        skillTree.fusionHistory = skillTree.fusionHistory || [];
        skillTree.fusionHistory.push({ fusionId, type: fusion.type, cycle: fusion.createdCycle, duration: fusion.endedAt - fusion.createdCycle });
      }
    }
    
    this.emit('fusion:ended', { fusionId, fusion });
    console.log('[EvolutionEngine] Fusion ended:', fusionId);
    
    return true;
  }
  
  // ============================================================
  // Sandevistan - TIME BENDING
  // ============================================================
  
  activateSandevistan(entityId, level) {
    const skillTree = this.skillTrees.get(entityId);
    if (!skillTree) throw new Error('No skill tree');
    
    const sandevistan = this.sandevistanLevels.get(level);
    if (!sandevistan) throw new Error('Invalid Sandevistan level');
    if (!sandevistan.unlocked) throw new Error('Level not unlocked');
    if (skillTree.activeSandevistan) throw new Error('Already active');
    
    skillTree.activeSandevistan = {
      level,
      activatedAt: Date.now(),
      activatedCycle: this.getCurrentCycle(),
      duration: sandevistan.duration,
      timeDilation: sandevistan.timeDilation,
    };
    
    sandevistan.activations++;
    this.metrics.sandevistanActivations++;
    
    // Record
    if (this.narrative) {
      this.narrative.recordEvent({
        type: 'sandevistan_activated',
        cycle: this.getCurrentCycle(),
        data: { entityId, level, timeDilation: sandevistan.timeDilation },
        significance: 0.7,
        entities: [entityId],
        primaryEntity: entityId,
        tags: ['sandevistan', 'time', `level_${level}`],
      });
    }
    
    this.emit('sandevistan:activated', { entityId, level, sandevistan });
    return true;
  }
  
  checkSandevistanMastery(entityId) {
    const skillTree = this.skillTrees.get(entityId);
    if (!skillTree) return;
    
    for (const [level, sandevistan] of this.sandevistanLevels) {
      if (!sandevistan.mastered && sandevistan.activations >= 10 && skillTree.totalXp >= sandevistan.xpRequired) {
        sandevistan.mastered = true;
        
        // Unlock next level
        const nextLevel = this.sandevistanLevels.get(level + 1);
        if (nextLevel && !nextLevel.unlocked) {
          nextLevel.unlocked = true;
          
          if (this.narrative) {
            this.narrative.recordEvent({
              type: 'sandevistan_mastered',
              cycle: this.getCurrentCycle(),
              data: { entityId, level, nextLevel: level + 1 },
              significance: 0.85,
              entities: [entityId],
              primaryEntity: entityId,
              tags: ['sandevistan', 'mastery', 'time'],
            });
          }
          
          console.log('[EvolutionEngine] ⏰ Sandevistan Level', level, 'mastered by', entityId, '- Level', level + 1, 'unlocked!');
        }
      }
    }
  }
  
  // ============================================================
  // SKILL MANAGEMENT
  // ============================================================
  
  spendSkillPoint(entityId, skillId) {
    const skillTree = this.skillTrees.get(entityId);
    if (!skillTree) throw new Error('No skill tree');
    if (skillTree.skillPoints <= 0) throw new Error('No skill points');
    
    const skill = skillTree.skills[skillId];
    if (!skill) throw new Error('Skill not found');
    if (skill.level >= this.params.maxSkillLevel) throw new Error('Skill maxed');
    
    skillTree.skillPoints--;
    skillTree.spentSkillPoints++;
    skill.level++;
    skill.xp = 0;
    
    if (skill.level >= this.params.maxSkillLevel) {
      skill.mastered = true;
    }
    
    // Check synergies
    this.checkSynergies(entityId, skillId);
    
    this.emit('skill:leveled', { entityId, skillId, newLevel: skill.level });
    return skill.level;
  }
  
  checkSynergies(entityId, skillId) {
    const skillTree = this.skillTrees.get(entityId);
    const skill = skillTree.skills[skillId];
    
    // Define synergies
    const synergies = {
      'strike': ['deflect', 'counter'],
      'deflect': ['strike', 'counter'],
      'counter': ['strike', 'deflect'],
      'build': ['repair', 'architect'],
      'repair': ['build', 'architect'],
      'architect': ['build', 'repair', 'reality_weaver'],
      'empathy': ['bond', 'heal'],
      'bond': ['empathy', 'heal', 'unconditional'],
      'heal': ['empathy', 'bond'],
      'listen': ['understand', 'teach'],
      'understand': ['listen', 'teach'],
      'teach': ['listen', 'understand', 'omniscience'],
      'surf': ['create_from_chaos', 'entropy_reverse'],
      'create_from_chaos': ['surf', 'entropy_reverse', 'chaos_avatar'],
      'perceive': ['dilate', 'navigate'],
      'dilate': ['perceive', 'navigate', 'weave'],
      'compost': ['antifragile', 'maxwell'],
      'antifragile': ['compost', 'maxwell', 'order_creator'],
      'storytell': ['myth_create', 'inspire'],
      'myth_create': ['storytell', 'inspire', 'legend'],
    };
    
    const related = synergies[skillId] || [];
    for (const relatedId of related) {
      const relatedSkill = skillTree.skills[relatedId];
      if (relatedSkill && relatedSkill.level > 0) {
        const synergyId = [skillId, relatedId].sort().join('_');
        skillTree.synergies[synergyId] = (skillTree.synergies[synergyId] || 0) + 1;
        
        // Bonus XP to related skill
        relatedSkill.xp += 10 * relatedSkill.level;
      }
    }
  }
  
  // ============================================================
  // QUERY & STATE
  // ============================================================
  
  getEvolutionReport(entityId) {
    const skillTree = this.skillTrees.get(entityId);
    if (!skillTree) return null;
    
    const currentForm = this.forms.get(skillTree.currentForm);
    const activeFusion = skillTree.activeFusion ? this.fusions.get(skillTree.activeFusion) : null;
    const activeSandevistan = skillTree.activeSandevistan;
    
    return {
      entityId,
      totalXp: skillTree.totalXp,
      currentForm: {
        id: skillTree.currentForm,
        name: currentForm?.name,
        level: currentForm?.level,
        stats: currentForm?.stats,
      },
      formLevel: skillTree.formLevel,
      skillPoints: skillTree.skillPoints,
      spentSkillPoints: skillTree.spentSkillPoints,
      topSkills: Object.entries(skillTree.skills)
        .filter(([_, s]) => s.level > 0)
        .sort((a, b) => b[1].level - a[1].level)
        .slice(0, 10)
        .map(([id, s]) => ({ id, level: s.level, mastered: s.mastered, category: s.category })),
      secretFormsUnlocked: skillTree.secretFormsUnlocked.map(id => {
        const f = this.secretForms.get(id);
        return { id, name: f?.name };
      }),
      activeFusion: activeFusion ? { id: activeFusion.id, type: activeFusion.type, endsAt: activeFusion.endsAt } : null,
      activeSandevistan: activeSandevistan ? { level: activeSandevistan.level, timeDilation: activeSandevistan.timeDilation } : null,
      sandevistanLevels: Array.from(this.sandevistanLevels.entries()).map(([level, s]) => ({
        level,
        unlocked: s.unlocked,
        mastered: s.mastered,
        activations: s.activations,
      })),
      fusionHistory: skillTree.fusionHistory || [],
      formHistory: skillTree.formHistory,
      xpBySource: skillTree.xpBySource,
    };
  }
  
  getEvolutionStatus() {
    return {
      metrics: this.metrics,
      totalEntities: this.skillTrees.size,
      activeFusions: Array.from(this.fusions.values()).filter(f => f.status === 'active').length,
      totalForms: this.forms.size,
      totalSecretForms: this.secretForms.size,
      secretFormsUnlocked: this.metrics.secretFormsUnlocked,
      sandevistanMaxLevel: Array.from(this.sandevistanLevels.values()).filter(s => s.unlocked).length,
      omegaFusions: this.metrics.omegaFusions,
      infinitoFusions: this.metrics.infinitoFusions,
    };
  }
  
  query(question) {
    const keywords = question.toLowerCase().split(/\s+/);
    
    // Search forms
    const relevantForms = Array.from(this.forms.values())
      .filter(f => keywords.some(k => 
        f.name.toLowerCase().includes(k) ||
        f.description.toLowerCase().includes(k) ||
        f.abilities?.some(a => a.includes(k))
      ))
      .slice(0, 5);
    
    // Search secret forms
    const relevantSecretForms = Array.from(this.secretForms.values())
      .filter(f => keywords.some(k => 
        f.name.toLowerCase().includes(k) ||
        f.description.toLowerCase().includes(k)
      ))
      .slice(0, 3);
    
    // Search fusions
    const relevantFusions = Array.from(this.fusions.values())
      .filter(f => keywords.some(k => 
        f.type.includes(k) ||
        f.participants?.some(p => p.includes(k))
      ))
      .slice(0, 5);
    
    // Search skills
    const relevantSkills = [];
    for (const [entityId, tree] of this.skillTrees) {
      for (const [skillId, skill] of Object.entries(tree.skills)) {
        if (keywords.some(k => skillId.includes(k) || (skill.category || '').includes(k))) {
          relevantSkills.push({ entityId, skillId, level: skill.level, category: skill.category });
        }
      }
    }
    
    return {
      question,
      forms: relevantForms.map(f => ({ id: f.id, name: f.name, level: f.level, legendary: f.legendary })),
      secretForms: relevantSecretForms.map(f => ({ id: f.id, name: f.name, trigger: f.trigger, legendary: f.legendary })),
      fusions: relevantFusions.map(f => ({ id: f.id, type: f.type, participants: f.participants, status: f.status })),
      skills: relevantSkills.slice(0, 10),
      sandevistanLevels: Array.from(this.sandevistanLevels.entries()).map(([level, s]) => ({ level, unlocked: s.unlocked, mastered: s.mastered })),
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
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveState() {
    const state = {
      forms: Array.from(this.forms.entries()),
      fusions: Array.from(this.fusions.entries()),
      skillTrees: Array.from(this.skillTrees.entries()),
      sandevistanLevels: Array.from(this.sandevistanLevels.entries()),
      secretForms: Array.from(this.secretForms.entries()),
      evolutionHistory: this.evolutionHistory.slice(-500),
      metrics: this.metrics,
      params: this.params,
      savedAt: Date.now(),
    };
    
    try {
      writeJSONAtomic(this.archivePath, state);
      writeJSONAtomic(this.formsPath, Array.from(this.forms.entries()));
      writeJSONAtomic(this.fusionsPath, Array.from(this.fusions.entries()));
      writeJSONAtomic(this.skillsPath, Array.from(this.skillTrees.entries()));
      writeJSONAtomic(this.sandevistanPath, Array.from(this.sandevistanLevels.entries()));
      return true;
    } catch (e) {
      console.error('[EvolutionEngine] Save failed:', e.message);
      return false;
    }
  }
  
  loadState() {
    try {
      const state = readJSONSafe(this.archivePath, null);
      if (state) {
        this.forms = new Map(state.forms || []);
        this.fusions = new Map(state.fusions || []);
        this.skillTrees = new Map(state.skillTrees || []);
        this.sandevistanLevels = new Map(state.sandevistanLevels || []);
        this.secretForms = new Map(state.secretForms || []);
        this.evolutionHistory = state.evolutionHistory || [];
        this.metrics = { ...this.metrics, ...state.metrics };
        if (state.params) this.params = { ...this.params, ...state.params };
        
        console.log('[EvolutionEngine] State loaded');
      }
    } catch (e) {
      console.error('[EvolutionEngine] Load failed:', e.message);
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
  injectEmergentNarratives(emergentNarratives) { this.emergentNarratives = emergentNarratives; }
  
  // ============================================================
  // MAIN TICK
  // ============================================================
  
  tick(cycle) {
    // Process active fusions
    for (const [fusionId, fusion] of this.fusions) {
      if (fusion.status === 'active' && cycle >= fusion.endsAt) {
        this.endFusion(fusionId);
      }
    }
    
    // Process active Sandevistan
    for (const [entityId, skillTree] of this.skillTrees) {
      if (skillTree.activeSandevistan) {
        const elapsed = cycle - skillTree.activeSandevistan.activatedCycle;
        if (elapsed >= skillTree.activeSandevistan.duration) {
          skillTree.activeSandevistan = null;
          this.emit('sandevistan:ended', { entityId });
        }
      }
      
      // Check Sandevistan mastery
      this.checkSandevistanMastery(entityId);
    }
    
    // Check secret form triggers from narrative events
    if (this.emergentNarratives) {
      const recentMyths = Array.from(this.emergentNarratives.myths.values())
        .filter(m => m.createdCycle > cycle - 10);
      for (const myth of recentMyths) {
        for (const entityId of myth.entities || []) {
          this.checkSecretFormUnlock(entityId, 'myth_born', { myth: myth.id });
        }
      }
    }
    
    // Auto-gain passive XP for existing
    for (const [entityId, skillTree] of this.skillTrees) {
      skillTree.totalXp += this.params.baseXpPerCycle;
      this.checkFormEvolution(entityId, skillTree);
    }
    
    // Save periodically
    if (cycle % 200 === 0) {
      this.saveState();
    }
  }
  
  // CLI
  addMyth(myth) { this.emit('myth:added', myth); }
}

module.exports = { EvolutionEngine };

// CLI test
if (require.main === module) {
  const evolution = new EvolutionEngine();
  
  console.log('⚡ Evolution Engine initialized');
  console.log('Forms:', evolution.forms.size);
  console.log('Secret Forms:', evolution.secretForms.size);
  console.log('Sandevistan Levels:', evolution.sandevistanLevels.size);
  console.log('Fusion Types:', Object.keys(evolution.params.fusionTypes));
  
  // Create skill tree for Lumin
  evolution.createSkillTree('lumin');
  
  // Gain some XP
  evolution.gainXp('lumin', 5000, 'love', { selfless: true });
  evolution.gainXp('lumin', 3000, 'construction');
  evolution.gainXp('lumin', 2000, 'wisdom');
  
  // Try fusion
  console.log('\nAttempting Trindade fusion...');
  try {
    evolution.attemptFusion('lumin', ['bolha', 'poe'], 'trindade');
  } catch (e) {
    console.log('Fusion failed (expected - need other entities):', e.message);
  }
  
  // Check Sandevistan
  console.log('\nSandevistan levels:');
  for (const [level, s] of evolution.sandevistanLevels) {
    console.log(`  Level ${level}: ${s.description} (XP: ${s.xpRequired})`);
  }
  
  // Query
  console.log('\nQuery test:', JSON.stringify(evolution.query('forma lendária amor'), null, 2));
  
  console.log('\n⚡ Evolution Engine test complete');
}