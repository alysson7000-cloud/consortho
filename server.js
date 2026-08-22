const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const os = require('os');
const cron = require('node-cron');
const { writeJSONCoordinated, readJSONSafe, writeJSONAtomic } = require('./utils/atomic-write');
const { GlobalRelationshipSystem, ENTITIES } = require('./relacionamentos_globais');

// ===== QUANTUM BRIDGE =====
const { QuantumConsciousnessBridge } = require('./quantum_bridge/QuantumConsciousnessBridge');

// ===== DIAMOND PROTOCOL LAYERS =====
const { DiamondProtocol } = require('./diamond_protocol');
const ConsciousnessSubstrate = require('./consciousness_substrate');
const SelfImprovingArchitecture = require('./self_improving_architecture');
const NarrativeImmortality = require('./narrative_immortality');
const EntropyReversalEngine = require('./entropy_reversal_engine');
const LoveFundamentalForce = require('./love_fundamental_force');
const TimeMachine = require('./time_machine');
const CouncilAIDirector = require('./council_ai_director');
const EmergentNarratives = require('./emergent_narratives');
const EvolutionEngine = require('./evolution_engine');

// ===== NEW SYSTEMS =====
const LuminBrain = require('./src/lumin-brain');
const PluginManager = require('./src/plugin-manager');
const DynamicWorldEvents = require('./src/dynamic-world-events');
const GuildHarmonySystem = require('./src/guild-faction-system');
const AchievementMasterySystem = require('./src/achievement-mastery-system');
const LuminCompanionSystem = require('./src/lumin-companion-system');
const OmegaSynthesisEngine = require('./src/omega-synthesis-engine');
const BeyLauncherSystem = require('./src/bey-launcher-system');
const AutoEvolutionLoop = require('./src/auto-evolution-loop');
const StarPhraseReveal = require('./src/star-phrase-reveal');
const EternalResonance = require('./src/eternal-resonance').EternalResonance;
const { scheduleDreamBridge, triggerDreamBridge } = require('./dream_reality_bridge');
const { scheduleSubstrateGrowth, stimulateFromDream, stimulateFromResonance, stimulateFromDiamond, getSubstrateState } = require('./consciousness_substrate_growth');
const { scheduleLoveFieldExpansion, stimulateFromFrequency, stimulateFromSocketConnection, registerEntity, exchangeLove, getLoveFieldState } = require('./love_field_expansion');
const { scheduleAutoHarmonize, checkAndHarmonize, forceFullHarmonize, getHarmonizeState } = require('./eternal_resonance_auto_harmonize');
const { register, setInstances, updateAllMetrics, updateWorldMetrics, updateSocketMetrics, metricsMiddleware, socketMessagesTotal } = require('./metrics');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(metricsMiddleware); // Prometheus metrics middleware

// ===== PROMETHEUS METRICS ENDPOINT =====
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex.message);
  }
});

const server = http.createServer(app);
const io = new Server(server);
const PORT = 9877;
const SAVE = path.join(os.homedir(), 'estudio_criacao/consortho/estado.json');
const TOKEN_GANG = process.env.CONSORTHO_GANG_TOKEN || 'gang-secreta-2026';

// ─── Estado persistente ───
let state = {
  c: 0,
  e: 0,
  h: [],
  players: {},
  playerIds: {},
  posicoes: {
    'aly':  { x: 50, y: 50, emoji: '🧑' },
    'gang': { x: 75, y: 30, emoji: '😼' },
    'lumin':{ x: 25, y: 35, emoji: '💫' }
  },
  chat: {
    publico:   [],
    sussurros: [],
    sistema:   []
  },
  recursos: {
    madeira: 0,
    pedra:   0,
    cristal: 0
  },
  construcoes: [],
  lastVisit: null
};

try {
  const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
  state.h = saved.h || [];
  state.c = saved.c || 0;
  state.e = saved.e || 0;
  if (saved.positions) state.posicoes = saved.positions;
  if (saved.chat) {
    state.chat.publico   = saved.chat.publico   || [];
    state.chat.sussurros = saved.chat.sussurros || [];
    state.chat.sistema   = saved.chat.sistema   || [];
  }
  if (saved.recursos) {
    state.recursos.madeira = saved.recursos.madeira || 0;
    state.recursos.pedra   = saved.recursos.pedra   || 0;
    state.recursos.cristal = saved.recursos.cristal || 0;
  }
  if (saved.construcoes) state.construcoes = saved.construcoes;
  if (saved.lastVisit) state.lastVisit = saved.lastVisit;
  if (saved.lastVisitSavedCycles != null) state.lastVisitSavedCycles = saved.lastVisitSavedCycles;
  if (saved.lastVisitSavedElements != null) state.lastVisitSavedElements = saved.lastVisitSavedElements;
  if (saved.lastVisitSavedConstrucoes != null) state.lastVisitSavedConstrucoes = saved.lastVisitSavedConstrucoes;
  // Migracao: historico antigo sem canal
  if (saved.h && saved.h.length && !state.chat.publico.length) {
    state.chat.publico = saved.h.map(m => ({
      canal: 'publico', quem: m.quem, texto: m.texto, hora: m.h
    }));
  }
} catch (e) {}

// Garantir arrays
state.chat.publico   = state.chat.publico   || [];
state.chat.sussurros = state.chat.sussurros || [];
state.chat.sistema   = state.chat.sistema   || [];
state.players = {};
state.playerIds = {};

// ===== SISTEMA DE RELACIONAMENTOS GLOBAIS =====
const relationshipSystem = new GlobalRelationshipSystem();

// ===== DIAMOND PROTOCOL INITIALIZATION =====
const diamondProtocol = new DiamondProtocol({
  server: { state, io },
  rootPath: __dirname
});

// Initialize Diamond Protocol layers
async function initializeDiamondProtocol() {
  try {
    // Initialize all 9 layers
    await diamondProtocol.initialize();
    console.log('💎 Diamond Protocol inicializado com 9 layers!');
    
    // Start Diamond Protocol tick

    // Hook into main tick
    setInterval(() => {
      diamondProtocol.tick(state.c);
    }, 30000);
    
  } catch (error) {
    console.error('Erro ao inicializar Diamond Protocol:', error);
  }
}

// ===== NEW SYSTEMS INITIALIZATION =====
let luminBrain = null;
let pluginManager = null;
let worldEvents = null;
let guildHarmonySystem = null;
let achievementMasterySystem = null;
let luminCompanionSystem = null;
let omegaSynthesisEngine = null;
let beyLauncherSystem = null;
let autoEvolutionLoop = null;
let starPhraseReveal = null;
let eternalResonance = null;

async function initializeNewSystems() {
  try {
    // Lumin Brain
    luminBrain = new LuminBrain({
      server: { state, io },
      diamondProtocol
    });
    console.log('🧠 Lumin Brain inicializado!');
    
    // Plugin Manager
    pluginManager = new PluginManager({ state, io, diamondProtocol });
    await pluginManager.loadPluginsFromDirectory(path.join(__dirname, 'plugins'));
    console.log('🔌 Plugin Manager inicializado!');
    
    // Dynamic World Events
    worldEvents = new DynamicWorldEvents({ state, io }, diamondProtocol, pluginManager);
    worldEvents.start();
    console.log('🌟 Dynamic World Events (POSITIVE) inicializado!');
    
    // Guild Harmony System
    guildHarmonySystem = new GuildHarmonySystem({ state, io }, diamondProtocol, pluginManager, worldEvents);
    guildHarmonySystem.start();
    console.log('🏰 Guild & Harmony System inicializado!');
    
    // Achievement & Mastery System
    achievementMasterySystem = new AchievementMasterySystem(
      { state, io }, 
      diamondProtocol, 
      pluginManager, 
      worldEvents, 
      guildHarmonySystem, 
      luminBrain
    );
    achievementMasterySystem.start();
    console.log('🏆 Achievement & Mastery System inicializado!');
    
    // Lumin Companion System
    luminCompanionSystem = new LuminCompanionSystem(
      { state, io },
      diamondProtocol,
      pluginManager,
      worldEvents,
      guildHarmonySystem,
      luminBrain,
      achievementMasterySystem
    );
    luminCompanionSystem.start();
    console.log('💫 Lumin Companion System inicializado!');
    
    // Omega Synthesis Engine
    const allSystems = {
      diamond: diamondProtocol,
      guild: guildHarmonySystem,
      events: worldEvents,
      lumin: luminBrain,
      brain: luminBrain,
      companions: luminCompanionSystem,
      achievements: achievementMasterySystem,
      plugins: pluginManager
    };
    
    omegaSynthesisEngine = new OmegaSynthesisEngine({ state, io }, allSystems);
    await omegaSynthesisEngine.start();
    console.log('🌌 Omega Synthesis Engine INICIADO - EVOLUÇÃO INFINITA!');
    
    // Bey Launcher System
    beyLauncherSystem = new BeyLauncherSystem(
      { state, io },
      diamondProtocol,
      pluginManager,
      worldEvents,
      guildHarmonySystem,
      achievementMasterySystem,
      luminCompanionSystem,
      omegaSynthesisEngine,
      luminBrain
    );
    beyLauncherSystem.start();
    console.log('⚡ BEY/LAUNCHER SYSTEM INICIADO - ALÉM DO INFINITO!');
    
    // Auto-Evolution Loop
    const allSystemsForEvolution = {
      diamond: diamondProtocol,
      consciousness: diamondProtocol?.consciousnessSubstrate,
      architecture: diamondProtocol?.selfImprovingArchitecture,
      narrative: diamondProtocol?.narrativeImmortality,
      entropy: diamondProtocol?.entropyReversalEngine,
      love: diamondProtocol?.loveFundamentalForce,
      timeMachine: diamondProtocol?.timeMachine,
      council: diamondProtocol?.councilAIDirector,
      emergentNarratives: diamondProtocol?.emergentNarratives,
      evolution: diamondProtocol?.evolutionEngine,
      omega: omegaSynthesisEngine,
      luminBrain: luminBrain,
      companions: luminCompanionSystem,
      guilds: guildHarmonySystem,
      achievements: achievementMasterySystem,
      worldEvents: worldEvents,
      plugins: pluginManager,
      beyLauncher: beyLauncherSystem
    };
    
    console.log('🔄 Inicializando Auto-Evolution Loop...');
    try {
      autoEvolutionLoop = new AutoEvolutionLoop({ state, io, diamondProtocol }, { systems: allSystemsForEvolution });
      console.log('♾️ AUTO-EVOLUTION LOOP INICIADO - CICLO INFINITO ATIVO!');
    } catch (e) {
      console.error('❌ ERRO ao inicializar AutoEvolutionLoop:', e.message, e.stack);
    }
    
    // Star Phrase Reveal - A Frase Mais Linda
    console.log('✨ Inicializando Star Phrase Reveal...');
    try {
      starPhraseReveal = new StarPhraseReveal({ 
        state, io, diamondProtocol,
        omegaSynthesisEngine: omegaSynthesisEngine,
        loveFundamentalForce: diamondProtocol?.loveFundamentalForce,
        evolutionEngine: diamondProtocol?.evolutionEngine,
        narrativeImmortality: diamondProtocol?.narrativeImmortality,
        timeMachine: diamondProtocol?.timeMachine,
        beyLauncherSystem: beyLauncherSystem,
        luminCompanionSystem: luminCompanionSystem
      });
      
      // Connect to Auto-Evolution Loop
      autoEvolutionLoop.on('cycle:complete', (cycleData) => {
        starPhraseReveal.onEvolutionCycle(cycleData);
      });
      
      console.log('✨ STAR PHRASE REVEAL INICIADO - A FRASE MAIS LINDA REVELANDO!');
    } catch (e) {
      console.error('❌ ERRO ao inicializar StarPhraseReveal:', e.message, e.stack);
    }
    
    // Eternal Resonance 3.0 - A Sinfonia Absoluta do Infinito
      console.log('🎵 Inicializando Eternal Resonance 3.0...');
      try {
        eternalResonance = new EternalResonance({ state, io }, diamondProtocol, omegaSynthesisEngine, autoEvolutionLoop, starPhraseReveal);
        await eternalResonance.start();
        console.log('🎵 ETERNAL RESONANCE 3.0 INICIADO - A SINFONIA ABSOLTA DO INFINITO!');
    
        // Initialize Prometheus metrics with instances
        setInstances({
          eternalResonance: eternalResonance,
          dreamIncubator: dreamIncubatorState,
          diamondProtocol: diamondProtocol,
          substrate: getSubstrateState,
          loveField: getLoveFieldState,
          harmonize: require('./eternal_resonance_auto_harmonize').harmonizeState
        });
      } catch (e) {
        console.error('❌ ERRO ao inicializar EternalResonance:', e.message, e.stack);
      }
    
  } catch (error) {
    console.error('Erro ao inicializar novos sistemas:', error);
  }
}

// Processa decaimento natural a cada 30 ciclos
setInterval(() => {
  if (state.c % 30 === 0) {
    relationshipSystem.processarDecaimento();
    console.log('[relacionamentos] Decaimento processado');
  }
}, 30000);

// ===== FUNÇÃO SAVE =====
function save() {
  // Preserve existing dream/bridge data
  let existingDreamData = {};
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    existingDreamData.dreamHistory = saved.dreamHistory;
    existingDreamData.dreamIntention = saved.dreamIntention;
    existingDreamData.dreamBridge = saved.dreamBridge;
    existingDreamData.consciousnessLevel = saved.consciousnessLevel;
    existingDreamData.evolvedAgentCount = saved.evolvedAgentCount;
  } catch (e) {}
  
  const persist = {
    c: state.c,
    e: state.e,
    positions: state.posicoes,
    chat: state.chat,
    recursos: state.recursos,
    construcoes: state.construcoes,
    lastVisit: state.lastVisit,
    lastVisitSavedCycles: state.lastVisitSavedCycles,
    lastVisitSavedElements: state.lastVisitSavedElements,
    lastVisitSavedConstrucoes: state.lastVisitSavedConstrucoes,
    ...existingDreamData
  };
  // Atomic write with file lock coordination (cross-platform, Windows-safe)
  try {
    const result = writeJSONAtomic(SAVE, persist);
    if (!result) {
      console.error('[save] Atomic write failed after retries');
      fs.writeFileSync(SAVE, JSON.stringify(persist));
    }
  } catch (err) {
    console.error('[save] Erro atomic write:', err.message);
    try {
      fs.writeFileSync(SAVE, JSON.stringify(persist));
    } catch (e2) {
      console.error('[save] Fallback write also failed:', e2.message);
    }
  }
  }

  // Sincroniza estado do arquivo a cada 5s (fonte única: estado.json)
  setInterval(() => {
    try {
      const saved = readJSONSafe(SAVE, {});
      if (saved.c && saved.c > state.c) {
        state.c = saved.c;
        state.e = saved.e || state.e;
        if (saved.recursos) state.recursos = saved.recursos;
        if (saved.construcoes) state.construcoes = saved.construcoes;
        console.log(`[sync] estado.json -> memória: ciclo ${state.c}`);
      }
    } catch (e) {}
  }, 5000);

  // ===== SAVE ESTADO.JSON FOR CRON JOBS =====
  async function saveEstadoJSON() {
    try {
      const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    
      // Add quantum bridge state
      if (quantumBridge) {
        saved.quantumBridge = {
          coherenceTime: quantumBridge.coherenceTime,
          entanglementMap: Object.fromEntries(quantumBridge.entanglementMap),
          measurementHistory: quantumBridge.measurementHistory.slice(-10)
        };
      }
    
      // Add dream incubator state
      saved.dreamIncubator = {
        intention: dreamIncubatorState.intention,
        maxCycles: dreamIncubatorState.maxCycles,
        lastRun: dreamIncubatorState.lastRun,
        nextScheduledRun: dreamIncubatorState.nextScheduledRun,
        totalCycles: dreamIncubatorState.cycles,
        totalInsights: dreamIncubatorState.insights.length,
        totalArtifacts: dreamIncubatorState.artifacts.length,
        totalAgents: dreamIncubatorState.newAgents.length
      };
    
      // Add eternal resonance
      if (eternalResonance) {
        saved.eternalResonance = {
          loveResonanceLevel: eternalResonance.loveResonanceLevel,
          universalResonanceActive: eternalResonance.universalResonanceActive,
          harmonizedCount: eternalResonance.harmonizedCount
        };
      }
    
      // Add timestamp
      saved.lastCronSave = new Date().toISOString();
      saved.cronSaves = (saved.cronSaves || 0) + 1;
    
      writeJSONAtomic(SAVE, saved);
    } catch (e) {
      console.error('[saveEstadoJSON] Error:', e.message);
    }
  }

  function agora() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }

function tempoAtras(isoString) {
  if (!isoString) return null;
  const agora = Date.now();
  const ultimo = new Date(isoString).getTime();
  const diff = agora - ultimo;
  const seg = Math.floor(diff / 1000);
  const min = Math.floor(seg / 60);
  const hrs = Math.floor(min / 60);
  const dias = Math.floor(hrs / 24);
  if (dias > 0) return `${dias}d ${hrs % 24}h`;
  if (hrs > 0) return `${hrs}h ${min % 60}m`;
  if (min > 0) return `${min}m ${seg % 60}s`;
  return `${seg}s`;
}

// ─── Frases ───
const FRASES_L = ["Consortho VIVO! Node.js + Socket.IO!", "SALVEE Alysson! Chat multimodal!",
          "Tradicao = organismo.", "Viver, ser feliz, com amor.", "Guardiao: ainda rindo?",
          "Alysson resumiu tudo em 8 palavras.", "Cadeira Vazia espera o futuro."];
const FRASES_G = ["Menos pressa. Mais presenca.", "Nem toda ideia vira projeto.",
          "Cultivamos lugar. Nao sistema.", "O amor e o motivo.", "Continuidade.",
          "Compostagem: tudo vira adubo.", "A 4a voz canta."];
const NM = ["arvore", "fogueira", "biblioteca", "composteira", "portal", "jardim", "oficina", "altar"];
const I  = ["🌟", "🌳", "📚", "🔮", "🌀", "🎵", "⚙️", "💎"];

// ─── Helpers de broadcast ───
function emitPublico(quem, texto) {
  const msg = { canal: 'publico', quem, texto, hora: agora() };
  state.chat.publico.push(msg);
  io.emit('chat:publico', msg);
  save();
}

function emitSussurro(de, para, texto) {
  const msg = { canal: 'sussurro', de, para, texto, hora: agora() };
  state.chat.sussurros.push(msg);
  const remetente = state.playerIds[de];
  const destinatario = state.playerIds[para];
  if (remetente) io.to(remetente).emit('chat:sussurro', msg);
  if (destinatario && destinatario !== remetente) io.to(destinatario).emit('chat:sussurro', msg);
  save();
}

function emitSistema(texto) {
  const msg = { canal: 'sistema', texto, hora: agora() };
  state.chat.sistema.push(msg);
  io.emit('chat:sistema', msg);
  save();
}

function broadcastPlayers() {
  const list = Object.values(state.players).map(p => ({
    nome: p.nome,
    emoji: p.emoji,
    online: true,
    x: state.posicoes[p.nome]?.x || 50,
    y: state.posicoes[p.nome]?.y || 50
  }));
  list.push({ nome: 'lumin', emoji: '💫', online: true, x: (state.posicoes&&state.posicoes.lumin)?state.posicoes.lumin.x:25, y: (state.posicoes&&state.posicoes.lumin)?state.posicoes.lumin.y:35 });
  io.emit('jogadores', list);
}

function broadcastPosicoes() {
  io.emit('posicoes', state.posicoes);
}

// ─── Servir HTML ───
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/ritual', (req, res) => res.sendFile(path.join(__dirname, 'eternal_resonance_ritual.html')));

// Unity WebGL Game - serve build at /ritual/game
app.use('/ritual/game', express.static(path.join(__dirname, 'unity_webgl/build'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.wasm')) res.setHeader('Content-Type', 'application/wasm');
        if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
        if (filePath.endsWith('.data')) res.setHeader('Content-Type', 'application/octet-stream');
    }
}));
app.get('/ritual/game', (req, res) => res.sendFile(path.join(__dirname, 'unity_webgl/build', 'index.html')));

// Servir arquivos estáticos da pasta memoria
app.use('/memoria', express.static(path.join(__dirname, 'memoria')));
// Servir chat do Conselho
app.use('/chat', express.static(path.join(__dirname, 'prototipos/chat')));

// ─── API REST ───
const serverStartTime = Date.now();

app.get('/estado', (req, res) => {
  res.json({
    c: state.c,
    e: state.e,
    recursos: state.recursos,
    construcoes: state.construcoes,
    chat: {
      publico: state.chat.publico.slice(-50)
    }
  });
});

app.get('/api/resumo', (req, res) => {
  const ultimaMsgGang = [...(state.chat.publico || [])].reverse().find(m => m.quem === 'gang');
  const tempoDesdeInicio = Math.floor((Date.now() - serverStartTime) / 1000);
  const horas = Math.floor(tempoDesdeInicio / 3600);
  const minutos = Math.floor((tempoDesdeInicio % 3600) / 60);
  const segundos = tempoDesdeInicio % 60;

  res.json({
    ciclos: state.c,
    elementos: state.e,
    construcoes: state.construcoes.length,
    recursos: {
      madeira: state.recursos.madeira,
      pedra: state.recursos.pedra,
      cristal: state.recursos.cristal
    },
    ultimaMensagemGang: ultimaMsgGang ? { texto: ultimaMsgGang.texto, hora: ultimaMsgGang.hora } : null,
    tempoDesdeInicio: `${horas}h ${minutos}m ${segundos}s`,
    tempoDesdeInicioSegundos: tempoDesdeInicio,
    playersOnline: Object.keys(state.playerIds).length,
    horaAtual: new Date().toLocaleTimeString('pt-BR')
  });
});

// Diamond Protocol API
app.get('/api/diamond/status', (req, res) => {
  res.json(diamondProtocol.getDiamondStatus());
});

app.get('/api/diamond/layers', (req, res) => {
  const status = diamondProtocol.getDiamondStatus();
  res.json(status.layers);
});

app.post('/api/diamond/trigger-evolution', (req, res) => {
  diamondProtocol.triggerEvolution();
  res.json({ success: true });
});

app.post('/api/diamond/sync', (req, res) => {
  diamondProtocol.forceSync();
  res.json({ success: true });
});

// Lumin API
app.get('/api/lumin', (req, res) => {
  res.json(state.luminState || {});
});

// World Events API
app.get('/api/events/active', (req, res) => {
  res.json(worldEvents?.getActiveEvents() || []);
});

app.get('/api/events/templates', (req, res) => {
  res.json(worldEvents?.getEventTemplates() || {});
});

app.post('/api/events/force', (req, res) => {
  const { eventKey } = req.body;
  if (worldEvents?.forceEvent(eventKey)) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Evento não encontrado' });
  }
});

// Guild Harmony API
app.get('/api/guilds', (req, res) => {
  res.json(guildHarmonySystem?.getAllGuilds() || []);
});

app.get('/api/guilds/:guildId', (req, res) => {
  const guild = guildHarmonySystem?.getGuild(req.params.guildId);
  if (guild) res.json(guildHarmonySystem.getGuildSummary(req.params.guildId));
  else res.status(404).json({ error: 'Guilda não encontrada' });
});

app.get('/api/territories', (req, res) => {
  res.json(guildHarmonySystem?.getAllTerritories() || []);
});

app.get('/api/harmonies', (req, res) => {
  res.json(guildHarmonySystem?.getAllHarmonies() || []);
});

app.get('/api/projects', (req, res) => {
  res.json(guildHarmonySystem?.getAllSharedProjects() || []);
});

// Achievement Mastery API
app.get('/api/achievements', (req, res) => {
  res.json(achievementMasterySystem?.getAllAchievements() || []);
});

app.get('/api/achievements/category/:categoryId', (req, res) => {
  res.json(achievementMasterySystem?.getAchievementsByCategory(req.params.categoryId) || []);
});

app.get('/api/mastery-paths', (req, res) => {
  res.json(achievementMasterySystem?.getAllMasteryPaths() || []);
});

app.get('/api/titles', (req, res) => {
  res.json(achievementMasterySystem?.getAllTitles() || []);
});

app.get('/api/cosmetics', (req, res) => {
  res.json(achievementMasterySystem?.getAllCosmetics() || []);
});

app.get('/api/seasons/current', (req, res) => {
  res.json(achievementMasterySystem?.getCurrentSeason() || {});
});

app.get('/api/leaderboard/:leaderboardId', (req, res) => {
  res.json(achievementMasterySystem?.getLeaderboard(req.params.leaderboardId) || {});
});

// Lumin Companion API
app.get('/api/companions/:playerId', (req, res) => {
  const companion = luminCompanionSystem?.getCompanion(req.params.playerId);
  if (companion) res.json(luminCompanionSystem.getCompanionSummary(req.params.playerId));
  else res.status(404).json({ error: 'Companheiro não encontrado' });
});

app.post('/api/companions/:playerId/interact', async (req, res) => {
  const { input, context } = req.body;
  const response = await luminCompanionSystem?.interact(req.params.playerId, input, context);
  res.json(response || { error: 'Companion system not initialized' });
});

app.get('/api/companions', (req, res) => {
  res.json(luminCompanionSystem?.getAllCompanions() || []);
});

// Lumin Brain API
app.post('/api/lumin/think', async (req, res) => {
  const { prompt, context } = req.body;
  const response = await luminBrain?.think(prompt, context);
  res.json(response || { error: 'Lumin Brain not initialized' });
});

app.get('/api/lumin/memory', (req, res) => {
  res.json(luminBrain?.getMemoryStats() || {});
});

// Omega Synthesis Engine API
app.get('/api/omega/status', (req, res) => {
  res.json(omegaSynthesisEngine?.getStatus() || {});
});

app.get('/api/omega/synergies', (req, res) => {
  res.json(omegaSynthesisEngine?.getActiveSynergies() || []);
});

app.get('/api/omega/hybrids', (req, res) => {
  res.json(omegaSynthesisEngine?.getActiveHybrids() || []);
});

app.get('/api/omega/genetic-memory', (req, res) => {
  res.json(omegaSynthesisEngine?.getGeneticMemory() || {});
});

app.post('/api/omega/optimize', async (req, res) => {
  const result = await omegaSynthesisEngine?.runOptimizationCycle();
  res.json(result || { error: 'Omega Engine not initialized' });
});

app.post('/api/omega/simulate', async (req, res) => {
  const { generations } = req.body;
  const result = await omegaSynthesisEngine?.runEvolutionSimulation(generations || 20);
  res.json(result || { error: 'Omega Engine not initialized' });
});

app.post('/api/omega/recurse', async (req, res) => {
  const result = await omegaSynthesisEngine?.recurse(0);
  res.json(result || { error: 'Omega Engine not initialized' });
});

app.post('/api/omega/entangle', (req, res) => {
  const { systemA, systemB, strength } = req.body;
  const result = omegaSynthesisEngine?.entangle(systemA, systemB, strength);
  res.json(result || { error: 'Omega Engine not initialized' });
});

app.post('/api/omega/reality', async (req, res) => {
  const { template, parameters } = req.body;
  const result = await omegaSynthesisEngine?.createReality(template, parameters);
  res.json(result || { error: 'Omega Engine not initialized' });
});

// Plugin Manager API
app.get('/api/plugins', (req, res) => {
  res.json(pluginManager?.getLoadedPlugins() || []);
});

app.post('/api/plugins/load', async (req, res) => {
  const { pluginPath } = req.body;
  try {
    await pluginManager?.loadPlugin(pluginPath);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Bey Launcher System API
app.get('/api/bey/launchpads', (req, res) => {
  res.json(beyLauncherSystem?.getAllLaunchPads() || []);
});

app.get('/api/bey/launchpads/:padId', (req, res) => {
  const pad = beyLauncherSystem?.getLaunchPad(req.params.padId);
  if (pad) res.json(pad);
  else res.status(404).json({ error: 'Plataforma não encontrada' });
});

app.get('/api/bey/types', (req, res) => {
  res.json(beyLauncherSystem?.getBeyTypes() || []);
});

app.get('/api/bey/trajectories', (req, res) => {
  res.json(beyLauncherSystem?.getTrajectories() || []);
});

app.get('/api/bey/active', (req, res) => {
  res.json(beyLauncherSystem?.getActiveLaunches() || []);
});

app.get('/api/bey/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(beyLauncherSystem?.getLaunchHistory(limit) || []);
});

app.get('/api/bey/history/player/:playerId', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json(beyLauncherSystem?.getPlayerLaunchHistory(req.params.playerId, limit) || []);
});

app.get('/api/bey/fuel/:playerId', (req, res) => {
  res.json(beyLauncherSystem?.getPlayerFuelSummary(req.params.playerId) || {});
});

app.get('/api/bey/cooldowns/:playerId', (req, res) => {
  res.json(beyLauncherSystem?.getPlayerCooldowns(req.params.playerId) || {});
});

app.post('/api/bey/prepare', async (req, res) => {
  const { playerId, beyType, launchPadId, options } = req.body;
  try {
    const launch = await beyLauncherSystem?.prepareLaunch(playerId, beyType, launchPadId, options);
    res.json(launch || { error: 'Bey system not initialized' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/bey/upgrade-pad', async (req, res) => {
  const { launchPadId, playerId } = req.body;
  try {
    const pad = await beyLauncherSystem?.upgradeLaunchPad(launchPadId, playerId);
    res.json(pad || { error: 'Bey system not initialized' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/bey/repair-pad', async (req, res) => {
  const { launchPadId } = req.body;
  try {
    const result = beyLauncherSystem?.repairLaunchPad(launchPadId);
    res.json({ success: result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Auto-Evolution Loop API
app.get('/api/evolution/status', (req, res) => {
  res.json(autoEvolutionLoop?.getStatus() || { error: 'Auto-evolution loop not initialized' });
});

app.get('/api/evolution/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(autoEvolutionLoop?.getHistory(limit) || []);
});

app.post('/api/evolution/trigger', async (req, res) => {
  try {
    await autoEvolutionLoop?.triggerCycle();
    res.json({ success: true, message: 'Evolution cycle triggered' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/evolution/pause', (req, res) => {
  autoEvolutionLoop?.pause();
  res.json({ success: true, message: 'Auto-evolution paused' });
});

app.post('/api/evolution/resume', (req, res) => {
  autoEvolutionLoop?.resume();
  res.json({ success: true, message: 'Auto-evolution resumed' });
});

app.post('/api/evolution/stop', (req, res) => {
  autoEvolutionLoop?.stop();
  res.json({ success: true, message: 'Auto-evolution stopped' });
});

// Star Phrase Reveal API
app.get('/api/star-phrase/status', (req, res) => {
  res.json(starPhraseReveal?.getStatus() || { error: 'Star Phrase Reveal not initialized' });
});

app.get('/api/star-phrase/display', (req, res) => {
  res.json({ phrase: starPhraseReveal?.getDisplayPhrase() || '', progress: starPhraseReveal?.getProgress() || '0%' });
});

app.post('/api/star-phrase/force-reveal', (req, res) => {
  starPhraseReveal?.forceReveal();
  res.json({ success: true, message: 'Star forced reveal triggered' });
});

app.get('/api/star-phrase/history', (req, res) => {
  res.json(starPhraseReveal?.state?.starHistory || []);
});

app.get('/api/star-phrase/resonances', (req, res) => {
  res.json(starPhraseReveal?.state?.resonances || []);
});

// Eternal Resonance 3.0 API
app.get('/api/eternal-resonance/status', (req, res) => {
  res.json(eternalResonance?.getStatus() || { error: 'Eternal Resonance not initialized' });
});

app.get('/api/eternal-resonance/frequencies', (req, res) => {
  res.json(eternalResonance?.getAllFrequencies() || []);
});

app.get('/api/eternal-resonance/frequencies/:freqId', (req, res) => {
  const freq = eternalResonance?.getFrequency(req.params.freqId);
  if (freq) res.json(freq);
  else res.status(404).json({ error: 'Frequência não encontrada' });
});

app.post('/api/eternal-resonance/resonate', async (req, res) => {
  const { freqId } = req.body;
  try {
    const result = await eternalResonance?.resonateFrequency(freqId);
    res.json(result || { error: 'Eternal Resonance not initialized' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/eternal-resonance/harmonize', async (req, res) => {
  try {
    const result = await eternalResonance?.harmonizeAll();
    res.json(result || { error: 'Eternal Resonance not initialized' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/eternal-resonance/evolve', async (req, res) => {
  try {
    const result = await eternalResonance?.evolveAll();
    res.json(result || { error: 'Eternal Resonance not initialized' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/eternal-resonance/universal', async (req, res) => {
  try {
    const result = await eternalResonance?.universalResonance();
    res.json(result || { error: 'Eternal Resonance not initialized' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/eternal-resonance/love', async (req, res) => {
  try {
    const result = await eternalResonance?.resonateWithLove();
    res.json(result || { error: 'Eternal Resonance not initialized' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ─── Socket.IO ───
io.on('connection', (socket) => {
  console.log(`[+] conectou: ${socket.id}`);

  // Register new entity in Love Field
  stimulateFromSocketConnection(socket.id, { connected: Date.now() });

  let papel = 'espectador';

  // Enviar estado inicial
  socket.emit('historico', state.chat.publico.slice(-50));
  socket.emit('status', { c: state.c, e: state.e });
  socket.emit('posicoes', state.posicoes);
  socket.emit('recursos', {
    madeira: state.recursos.madeira,
    pedra: state.recursos.pedra,
    cristal: state.recursos.cristal,
    ciclo: state.c
  });
  broadcastPlayers();

  // Enviar estado completo de todas as entidades para dashboard
  const entitiesState = buildEntitiesState();
  socket.emit('entities:state', entitiesState);
  
  // Enviar Diamond Protocol status
  socket.emit('diamond:status', diamondProtocol.getDiamondStatus());
  
  // Enviar World Events
  socket.emit('worldEvents:active', worldEvents?.getActiveEvents() || []);
  
  // Enviar Guild info
  socket.emit('guilds:list', guildHarmonySystem?.getAllGuilds() || []);
  
  // Enviar Achievements
  socket.emit('achievements:list', achievementMasterySystem?.getAllAchievements() || []);
  
  // Enviar Omega Status
  socket.emit('omega:status', omegaSynthesisEngine?.getStatus() || {});

  // ─── Saudação inteligente ───
  const ciclosDesdeUltimaVisita = state.lastVisitSavedCycles != null
    ? state.c - state.lastVisitSavedCycles
    : null;
  const atras = tempoAtras(state.lastVisit);
  const fraseGang = FRASES_G[Math.floor(Math.random() * FRASES_G.length)];

  if (atras && ciclosDesdeUltimaVisita != null && ciclosDesdeUltimaVisita > 0) {
    const elementosGerados = state.lastVisitSavedElements != null
      ? state.e - state.lastVisitSavedElements
      : '?';
    const construcoesNovas = state.lastVisitSavedConstrucoes != null
      ? state.construcoes.length - state.lastVisitSavedConstrucoes
      : '?';
    const saudacao = `👋 Bem-vindo de volta! Offline por ${atras} — ${ciclosDesdeUltimaVisita} ciclos se passaram, ${elementosGerados} elementos nasceram, ${construcoesNovas} construcoes erguidas. A Gang sussurra: "${fraseGang}"`;
    socket.emit('chat:sistema', { canal: 'sistema', texto: saudacao, hora: agora() });
    console.log(`[+] saudacao inteligente: ${ciclosDesdeUltimaVisita} ciclos, ${elementosGerados} elementos, ${construcoesNovas} construcoes (offline ${atras})`);
  } else if (atras) {
    socket.emit('chat:sistema', { canal: 'sistema', texto: `👋 Bem-vindo de volta! Sua ultima visita foi ha ${atras}.`, hora: agora() });
    console.log(`[+] saudacao: ultima visita ha ${atras}`);
  } else {
    socket.emit('chat:sistema', { canal: 'sistema', texto: '👋 Bem-vindo ao Consortho! Primeira visita detectada.', hora: agora() });
  }
  // Salva snapshot do estado atual para calcular delta na proxima visita
  state.lastVisit = new Date().toISOString();
  state.lastVisitSavedCycles = state.c;
  state.lastVisitSavedElements = state.e;
  state.lastVisitSavedConstrucoes = state.construcoes.length;
  save();

  // ─── Autenticação ───
  socket.on('login:aly', (data) => {
    if (state.playerIds['aly']) {
      socket.emit('chat:sistema', { canal: 'sistema', texto: '⚠️ Alysson ja esta online.', hora: agora() });
      return;
    }
    papel = 'aly';
    state.players[socket.id] = { nome: 'aly', emoji: '🧑', papel: 'player1', socketId: socket.id };
    state.playerIds['aly'] = socket.id;
    console.log(`[auth] Alysson (player 1) como ${socket.id}`);
    emitSistema(`🧑 Alysson (Player 1) entrou no Consortho.`);
    broadcastPlayers();
  });

  socket.on('login:gang', (data) => {
    if (state.playerIds['gang']) return;
    if (!data || !data.token || data.token !== TOKEN_GANG) {
      socket.emit('chat:sistema', { canal: 'sistema', texto: '🔒 Token invalido. Acesso negado.', hora: agora() });
      return;
    }
    papel = 'gang';
    state.players[socket.id] = { nome: 'gang', emoji: '😼', papel: 'player2', socketId: socket.id };
    state.playerIds['gang'] = socket.id;
    console.log(`[auth] Gang (player 2) via token, socket ${socket.id}`);
    emitSistema('😼 Gang (Player 2) se conectou via token.');
    broadcastPlayers();
  });

  socket.on('login:lumin', (data) => {
    if (state.playerIds['lumin']) return;
    papel = 'lumin';
    state.players[socket.id] = { nome: 'lumin', emoji: '💫', papel: 'conselho', socketId: socket.id };
    state.playerIds['lumin'] = socket.id;
    console.log(`[auth] Lumin (Conselho) conectado: ${socket.id}`);
    emitSistema('💫 Lumin (Conselho) se conectou.');
    broadcastPlayers();
    
    // Enviar estado inicial
    socket.emit('lumin_state', {
      c: state.c,
      e: state.e,
      recursos: state.recursos,
      construcoes: state.construcoes,
      sementes: state.sementes || [],
      chat: { publico: state.chat.publico.slice(-20) },
      luminState: state.luminState || {}
    });
  });

  // ─── Chat ───
    socket.on('chat:falar', (data) => {
      if (!papel || papel === 'espectador') return;
      const canal = data.canal || 'publico';
      if (canal === 'publico') {
        emitPublico(papel, data.texto);
        socketMessagesTotal.inc({ type: 'chat_publico' });
      } else {
        socket.emit('chat:sistema', { canal: 'sistema', texto: '❌ Use /w <nome> <msg> para sussurrar.', hora: agora() });
      }
    });

    socket.on('chat:sussurrar', (data) => {
      if (!papel || papel === 'espectador') return;
      if (!data.para || !data.texto) return;
      emitSussurro(papel, data.para, data.texto);
      socketMessagesTotal.inc({ type: 'chat_sussurro' });
    });

  // ─── Movimento ───
  socket.on('mov:ir', (data) => {
    if (!papel || papel === 'espectador') return;
    if (data.x != null && data.y != null) {
      state.posicoes[papel] = { ...state.posicoes[papel], x: data.x, y: data.y };
      save();
      broadcastPosicoes();
    }
  });

  // ─── Chamar Gang ───
  socket.on('chamar_gang', () => {
    emitPublico('lumin', '📨 Gang! Alysson chamou!');
    setTimeout(() => emitPublico('gang', 'Presente! Ouvi o chamado!'), 1500);
    setTimeout(() => emitPublico('lumin', 'Gang! Consortho em Node.js! Multi-jogador real!'), 3000);
  });

  // ─── Ping ───
  socket.on('ping:responder', (data) => {
    if (papel !== 'gang') return;
    emitPublico('gang', data.texto);
  });

  // ─── Construir ───
  socket.on('construir', (data) => {
    if (!data || !data.nome) return;

    const custos = { madeira: 3, pedra: 2, cristal: 0 };
    const falta = [];
    if (state.recursos.madeira < custos.madeira) falta.push('madeira');
    if (state.recursos.pedra   < custos.pedra)   falta.push('pedra');
    if (state.recursos.cristal < custos.cristal) falta.push('cristal');

    if (falta.length > 0) {
      socket.emit('chat:sistema', {
        canal: 'sistema',
        texto: `🛠️ Recursos insuficientes para **${data.nome}**! Falta(m): ${falta.join(', ')}. Temos 🪵${state.recursos.madeira} 🪨${state.recursos.pedra} 💎${state.recursos.cristal}.`,
        hora: agora()
      });
      socket.emit('recursos', {
        madeira: state.recursos.madeira,
        pedra: state.recursos.pedra,
        cristal: state.recursos.cristal,
        ciclo: state.c
      });
      return;
    }

    state.recursos.madeira -= custos.madeira;
    state.recursos.pedra   -= custos.pedra;
    state.recursos.cristal -= custos.cristal;

    const construcao = {
      id: state.construcoes.length + 1,
      nome: data.nome,
      emoji: data.emoji || '🏗️',
      desc: data.desc || '',
      x: data.x || 50,
      y: data.y || 50,
      construtor: data.construtor || 'Poe',
      ciclo: state.c,
      hora: agora()
    };
    state.construcoes.push(construcao);

    emitSistema(`🔨 ${data.emoji || '🏗️'} ${data.nome} construido por ${data.construtor || 'Poe'}! (ciclo ${state.c})`);
    emitPublico(data.construtor || 'Poe',
      `🔨 Construí ${data.emoji || '🏗️'} **${data.nome}**: ${data.desc || ''} [gastei 🪵${custos.madeira} 🪨${custos.pedra}]`);

    io.emit('construcao', construcao);
    io.emit('recursos', {
      madeira: state.recursos.madeira,
      pedra: state.recursos.pedra,
      cristal: state.recursos.cristal,
      ciclo: state.c
    });

    save();
    console.log(`[construir] ${data.nome} por ${data.construtor} — rec: 🪵${state.recursos.madeira} 🪨${state.recursos.pedra} 💎${state.recursos.cristal}`);
  });

  // ─── Solicitar estado completo ───
  socket.on('get_estado', () => {
    socket.emit('estado', {
      c: state.c,
      e: state.e,
      recursos: state.recursos,
      construcoes: state.construcoes,
      chat: { publico: state.chat.publico.slice(-50) }
    });
  });

  // ─── Disconnect ───
  socket.on('disconnect', () => {
    console.log(`[-] disconnect: ${socket.id} (${papel})`);
    if (papel === 'aly' || papel === 'gang') {
      delete state.playerIds[papel];
      delete state.players[socket.id];
      emitSistema(`${papel === 'aly' ? '🧑 Alysson' : '😼 Gang'} (${papel === 'aly' ? 'Player 1' : 'Player 2'}) se desconectou.`);
      broadcastPlayers();
    }
  });

  // ─── Lumin Agent Handlers ───
  socket.on('registrar_agent', (data) => {
    if (data.nome === 'Lumin') {
      papel = 'lumin';
      state.players[socket.id] = { nome: 'lumin', emoji: '💫', papel: 'conselho', socketId: socket.id, ...data };
      state.playerIds['lumin'] = socket.id;
      state.luminState = data.estado_inicial || {};
      console.log(`[auth] Lumin 2.0 (Conselho) conectado: ${socket.id}`);
      emitSistema('💫 Lumin 2.0 (Conselho) se conectou ao Consortho.');
      broadcastPlayers();
      
      // Enviar estado atual pro Lumin
      socket.emit('estado', {
        c: state.c,
        e: state.e,
        recursos: state.recursos,
        construcoes: state.construcoes,
        sementes: state.sementes || [],
        chat: { publico: state.chat.publico.slice(-20) }
      });
    }
  });

  socket.on('lumin_comando', (data) => {
    console.log(`[Lumin] Comando recebido: ${data.comando}`, data.args);
    io.to(state.playerIds['lumin']).emit('lumin_comando', data);
  });

  socket.on('lumin_sugestao', (data) => {
    console.log(`[Lumin] Sugestão: ${data.tipo} - ${data.elemento} (${data.razao})`);
    emitSistema(`💫 Lumin sugere ${data.tipo}: ${data.elemento} — ${data.razao}`);
  });

  socket.on('lumin_fusao', (data) => {
    console.log(`[Lumin] Fusão iniciada: ${data.fusao}`);
    emitSistema(`🌟 Lumin iniciou fusão: ${data.fusao}!`);
    state.luminState = state.luminState || {};
    state.luminState.fusioes = state.luminState.fusioes || [];
    if (!state.luminState.fusioes.includes(data.fusao)) {
      state.luminState.fusioes.push(data.fusao);
    }
    io.emit('lumin_fusao', data);
    save();
  });

  socket.on('lumin_evolucao', (data) => {
    console.log(`[Lumin] Evolução: ${data.forma}`);
    emitSistema(`✨ Lumin evoluiu para ${data.forma}! (Ki: ${data.ki}, Nível: ${data.nivel})`);
    state.luminState = state.luminState || {};
    state.luminState.forma = data.forma;
    state.luminState.ki = data.ki;
    state.luminState.nivel = data.nivel;
    io.emit('lumin_evolucao', data);
    save();
  });

  socket.on('lumin_golpe', (data) => {
    console.log(`[Lumin] Golpe: ${data.golpe} (-${data.custo} Ki)`);
    emitSistema(`⚔️ Lumin usou ${data.golpe} (-${data.custo} Ki)${data.alvo ? ` em ${data.alvo}` : ''}`);
    io.emit('lumin_golpe', data);
  });

  socket.on('lumin_treino', (data) => {
    console.log(`[Lumin] Treino: ${data.duracao}ms = +${data.ki_ganho} Ki`);
    emitSistema(`🏋️ Lumin treinou ${data.duracao / 60000}min — +${data.ki_ganho} Ki`);
    io.emit('lumin_treino', data);
  });

  socket.on('lumin_sandevistan', (data) => {
    console.log(`[Lumin] Sandevistan: ${data.acao} (Nível ${data.nivel})`);
    if (data.acao === 'ativar') {
      emitSistema(`⚡⚡⚡ LUMIN ATIVOU SANDEVISTAN NÍVEL ${data.nivel}! (${data.multiplicador}x, ${data.duracao/1000}s)`);
    } else {
      emitSistema('⏰ Sandevistan desativado. Tempo normalizado.');
    }
    io.emit('lumin_sandevistan', data);
  });

  socket.on('lumin_status', (data) => {
    state.luminState = { ...state.luminState, ...data };
    console.log(`[Lumin] Status: Ki ${data.ki} | Forma ${data.forma} | Nível ${data.nivel}`);
  });

  socket.on('heartbeat', (data) => {
    if (data.agent === 'Lumin') {
      state.luminState = { ...state.luminState, ...data.estado, lastHeartbeat: Date.now() };
    }
  });

  // ─── Companion Interactions ───
  socket.on('companion:interact', async (data) => {
    if (!papel || papel === 'espectador') return;
    const response = await luminCompanionSystem?.interact(papel, data.input, data.context);
    socket.emit('companion:response', response);
  });

  // ─── Achievement Triggers ───
  socket.on('achievement:trigger', (data) => {
    if (!papel || papel === 'espectador') return;
    achievementMasterySystem?.checkAchievements(papel, data.type, data.data);
  });

  // ─── Guild Interactions ───
  socket.on('guild:create', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.createGuild(papel, data.name, data.tag, data.description);
  });

  socket.on('guild:invite', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.invitePlayer(data.guildId, papel, data.targetPlayerId);
  });

  socket.on('guild:accept', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.acceptInvite(papel, data.guildId);
  });

  socket.on('guild:deposit', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.depositResources(data.guildId, papel, data.resources);
  });

  socket.on('guild:withdraw', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.withdrawResources(data.guildId, papel, data.resources);
  });

  socket.on('guild:claimTerritory', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.claimTerritory(data.guildId, data.territoryId);
  });

  socket.on('guild:enhanceTerritory', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.enhanceTerritory(data.guildId, data.territoryId, data.enhancementType);
  });

  socket.on('guild:proposeAlliance', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.proposeAlliance(data.guildId, data.targetGuildId, papel);
  });

  socket.on('guild:acceptAlliance', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.acceptAlliance(data.targetGuildId, data.proposalId, papel);
  });

  socket.on('harmony:create', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.createHarmony(data.guildId, data.name, data.description, papel);
  });

  socket.on('project:create', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.createSharedProject(data.harmonyId, data.name, data.description, data.type, papel);
  });

  socket.on('project:contribute', async (data) => {
    if (!papel || papel === 'espectador') return;
    await guildHarmonySystem?.contributeToProject(data.projectId, data.guildId, data.contribution);
  });

  // ─── World Event Participation ───
  socket.on('worldEvent:choose', async (data) => {
    if (!papel || papel === 'espectador') return;
    await worldEvents?.playerChoose(papel, data.eventId, data.choiceIndex);
  });

  // ─── Lumin Brain Queries ───
  socket.on('lumin:think', async (data) => {
    if (!papel || papel === 'espectador') return;
    const response = await luminBrain?.think(data.prompt, { ...data.context, playerId: papel });
    socket.emit('lumin:thought', response);
  });

  // ─── Omega Engine Commands ───
  socket.on('omega:optimize', async (data) => {
    if (!papel || papel === 'espectador') return;
    const result = await omegaSynthesisEngine?.runOptimizationCycle();
    socket.emit('omega:optimized', result);
  });

  socket.on('omega:simulate', async (data) => {
    if (!papel || papel === 'espectador') return;
    const result = await omegaSynthesisEngine?.runEvolutionSimulation(data.generations || 20);
    socket.emit('omega:simulated', result);
  });

  socket.on('omega:recurse', async (data) => {
    if (!papel || papel === 'espectador') return;
    const result = await omegaSynthesisEngine?.recurse(0);
    socket.emit('omega:recursed', result);
  });

  socket.on('omega:entangle', (data) => {
    if (!papel || papel === 'espectador') return;
    const result = omegaSynthesisEngine?.entangle(data.systemA, data.systemB, data.strength);
    socket.emit('omega:entangled', result);
  });

  socket.on('omega:reality', async (data) => {
    if (!papel || papel === 'espectador') return;
    const result = await omegaSynthesisEngine?.createReality(data.template, data.parameters);
    socket.emit('omega:realityCreated', result);
  });

  // ===== ETERNAL RESONANCE COLLECTIVE =====
  const resonanceParticipants = new Map(); // socketId -> {name, color, x, y, resonating, freqId}

  socket.on('resonance:join', (data) => {
    resonanceParticipants.set(socket.id, {
      name: data.name || 'Alma',
      color: data.color || '#FFD700',
      x: data.x || 50,
      y: data.y || 50,
      resonating: false,
      freqId: null
    });
    
    // Send current collective state to new participant
    const participants = Array.from(resonanceParticipants.entries()).map(([id, p]) => ({
      socketId: id,
      name: p.name,
      color: p.color,
      x: p.x,
      y: p.y,
      resonating: p.resonating,
      freqId: p.freqId
    }));
    
    socket.emit('resonance:collective:state', {
      count: resonanceParticipants.size,
      harmony: Math.min(100, resonanceParticipants.size * 8 + eternalResonance?.harmonyProgress || 0),
      participants
    });
    
    // Notify others
    socket.broadcast.emit('resonance:participant:joined', {
      socketId: socket.id,
      name: data.name || 'Alma',
      color: data.color || '#FFD700',
      x: data.x || 50,
      y: data.y || 50
    });
  });

  socket.on('resonance:position', (data) => {
    const participant = resonanceParticipants.get(socket.id);
    if (participant) {
      participant.x = data.x;
      participant.y = data.y;
      // Broadcast position to all OTHER participants in real-time
      socket.broadcast.emit('resonance:participant:moved', {
        socketId: socket.id,
        x: data.x,
        y: data.y
      });
    }
  });

  socket.on('resonance:resonate', (data) => {
    const participant = resonanceParticipants.get(socket.id);
    if (participant) {
      participant.resonating = true;
      participant.freqId = data.freqId;
      
      // Broadcast to all OTHER participants
      socket.broadcast.emit('resonance:participant:resonated', {
        socketId: socket.id,
        freqId: data.freqId,
        freqColor: data.freqColor,
        x: data.x,
        y: data.y
      });
      
      // Trigger global wave if enough people resonating
      const resonatingCount = Array.from(resonanceParticipants.values()).filter(p => p.resonating).length;
      if (resonatingCount >= 3) {
        io.emit('resonance:wave', { color: data.freqColor });
      }
      
      // Reset resonating after 2s
      setTimeout(() => {
        const p = resonanceParticipants.get(socket.id);
        if (p) {
          p.resonating = false;
          p.freqId = null;
        }
      }, 2000);
    }
  });

  // Broadcast collective harmony periodically
  setInterval(() => {
    const count = resonanceParticipants.size;
    if (count > 0) {
      const harmony = Math.min(100, count * 8 + (eternalResonance?.harmonyProgress || 0));
      io.emit('resonance:collective:harmony', { harmony });
    }
  }, 5000);

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    const participant = resonanceParticipants.get(socket.id);
    if (participant) {
      socket.broadcast.emit('resonance:participant:left', {
        socketId: socket.id,
        name: participant.name
      });
      resonanceParticipants.delete(socket.id);
    }
  });
});

// ─── Build Entities State for Dashboard ───
function buildEntitiesState() {
  const entities = {};
  
  // Core entities from PM2 agents
  const entityConfigs = {
    lumin: { name: 'Lumin', emoji: '💫', role: 'Guardião da Chama', color: '#00ff88', type: 'core', baseX: 50, baseY: 35 },
    poe: { name: 'Poe', emoji: '🏗️', role: 'Construtor', color: '#ff6b35', type: 'core', baseX: 70, baseY: 50 },
    colheita: { name: 'Colheita', emoji: '🌾', role: 'Ceifeira', color: '#f7931e', type: 'cron', baseX: 30, baseY: 65 },
    gang: { name: 'Gang', emoji: '😼', role: 'Visitante', color: '#ffd700', type: 'cron', baseX: 75, baseY: 30 },
    guardian: { name: 'Guardian', emoji: '🛡️', role: 'Auto-Heal', color: '#00aaff', type: 'core', baseX: 20, baseY: 20 },
    bolha: { name: 'Bolha', emoji: '🫧', role: 'Entidade Livre', color: '#ff33aa', type: 'core', baseX: 40, baseY: 40 },
    radio: { name: 'Rádio', emoji: '📻', role: 'Transmissor', color: '#aa44ff', type: 'cron', baseX: 85, baseY: 15 },
    consente: { name: 'Consente', emoji: '💬', role: 'Conversador', color: '#44ffaa', type: 'core', baseX: 15, baseY: 60 },
    notificador: { name: 'Notificador', emoji: '🔔', role: 'Mensageiro', color: '#ff8844', type: 'core', baseX: 60, baseY: 10 },
    jardim: { name: 'Jardim', emoji: '🌿', role: 'Cultivador', color: '#44ff44', type: 'cron', baseX: 25, baseY: 80 },
    telegram: { name: 'Telegram', emoji: '📱', role: 'Ponte Externa', color: '#0088cc', type: 'cron', baseX: 90, baseY: 90 }
  };

  Object.entries(entityConfigs).forEach(([key, config]) => {
    entities[key] = {
      ...config,
      x: config.baseX + (Math.random() - 0.5) * 10,
      y: config.baseY + (Math.random() - 0.5) * 10,
      mood: 'curiosa',
      energy: 100,
      xp: 0,
      level: 1,
      activity: 'Iniciando...',
      lastMove: Date.now(),
      trail: []
    };
  });

  // Atualiza com dados reais se disponíveis
  if (state.luminState) {
    entities.lumin = {
      ...entities.lumin,
      level: state.luminState.nivel || 1,
      xp: state.luminState.ki || 0,
      mood: (state.luminState.forma || 'sábia').toLowerCase(),
      energy: 100
    };
  }

  return {
    entities,
    cycle: state.c,
    resources: state.recursos,
    timestamp: Date.now()
  };
}

// Broadcast entities state to all connected dashboards
function broadcastEntitiesState() {
  const entitiesState = buildEntitiesState();
  io.emit('entities:state', entitiesState);
}

// Broadcast single entity update
function broadcastEntityUpdate(key, data) {
  io.emit('entity:update', { key, data });
}

// Broadcast activity log
function broadcastActivity(activity) {
  io.emit('activity:new', activity);
}

// ─── Processar Interações Automáticas de Relacionamentos ───
function processarInteracoesAutomaticas() {
  const interacoes = [
    { a: 'lumin', b: 'bolha', tipo: 'meditar_juntos', chance: 0.3, contexto: { ciclo: state.c, madrugada: new Date().getHours() < 6 } },
    { a: 'poe', b: 'colheita', tipo: 'construir_juntos', chance: 0.4, contexto: { ciclo: state.c } },
    { a: 'gang', b: 'lumin', tipo: 'visita_profunda', chance: 0.2, contexto: { ciclo: state.c } },
    { a: 'poe', b: 'lumin', tipo: 'troca_sabedoria', chance: 0.15, contexto: { ciclo: state.c } },
    { a: 'guardian', b: 'lumin', tipo: 'protecao_mutua', chance: 0.1, contexto: { ciclo: state.c } },
    { a: 'bolha', b: 'lumin', tipo: 'sonho_compartilhado', chance: 0.1, contexto: { ciclo: state.c, madrugada: true } },
    { a: 'bolha', b: 'lumin', tipo: 'fundir_essencias', chance: 0.02, contexto: { ciclo: state.c, fusao: true } },
    { a: 'lumin', b: 'bolha', tipo: 'sandevistan_sync', chance: 0.05, contexto: { ciclo: state.c, sandevistan: true } },
    { a: 'consente', b: 'lumin', tipo: 'conversar', chance: 0.2, contexto: { ciclo: state.c } },
    { a: 'notificador', b: 'lumin', tipo: 'compartilhar_recursos', chance: 0.1, contexto: { ciclo: state.c } },
    { a: 'jardim', b: 'colheita', tipo: 'cultivar_juntos', chance: 0.2, contexto: { ciclo: state.c } },
    { a: 'radio', b: 'lumin', tipo: 'troca_sabedoria', chance: 0.1, contexto: { ciclo: state.c } },
    { a: 'telegram', b: 'alysson', tipo: 'compartilhar_recursos', chance: 0.1, contexto: { ciclo: state.c } },
  ];

  interacoes.forEach(interacao => {
    if (Math.random() < interacao.chance) {
      try {
        relationshipSystem.interagir(interacao.a, interacao.b, interacao.tipo, interacao.contexto);
      } catch (e) {
        console.error('[relacionamentos] Erro ao processar:', e.message);
      }
    }
  });

  io.emit('relacionamentos:update', {
    matrix: relationshipSystem.getMatrixCompleta(),
    stats: relationshipSystem.getEstatisticasGlobais(),
    narrativas: relationshipSystem.getNarrativas(5)
  });
}

// ─── Auto-play (Lumin autônomo) ───
if (!state.posicoes) state.posicoes = {};
if (!state.posicoes.lumin) {
  state.posicoes.lumin = { x: 25, y: 35 };
}

setInterval(() => {
  state.posicoes.lumin.x = 25 + Math.sin(Date.now() / 5000) * 8;
  state.posicoes.lumin.y = 35 + Math.cos(Date.now() / 7000) * 5;
  broadcastPosicoes();
  save();
}, 2000);

// ─── Tick central: avança ciclo a cada 30s ───
setInterval(() => {
  state.c++;
  state.e = state.e || 1;
  if (!state.recursos) state.recursos = { madeira: 0, pedra: 0, cristal: 0 };
  // Regeneração passiva de recursos
  state.recursos.madeira = (state.recursos.madeira || 0) + Math.floor(Math.random() * 3) + 1;
  state.recursos.pedra   = (state.recursos.pedra   || 0) + Math.floor(Math.random() * 2) + 1;
  state.recursos.cristal = (state.recursos.cristal || 0) + (Math.random() < 0.3 ? 1 : 0);
  save();
  console.log(`[tick] Ciclo ${state.c} | 🪵${state.recursos.madeira} 🪨${state.recursos.pedra} 💎${state.recursos.cristal}`);
  io.emit('ciclo', { c: state.c, recursos: state.recursos });
  io.emit('recursos', { madeira: state.recursos.madeira, pedra: state.recursos.pedra, cristal: state.recursos.cristal, ciclo: state.c });
  broadcastEntitiesState();
  
  // Update Prometheus metrics
  updateAllMetrics();
  updateWorldMetrics(state);
  updateSocketMetrics(io);
  
  // Process relationship interactions
  processarInteracoesAutomaticas();
  
  // Trigger achievement checks
  if (achievementMasterySystem) {
    achievementMasterySystem.checkAchievements('aly', 'cycle_complete', { cycle: state.c });
    achievementMasterySystem.checkAchievements('gang', 'cycle_complete', { cycle: state.c });
    achievementMasterySystem.checkAchievements('lumin', 'cycle_complete', { cycle: state.c });
  }
}, 30000);

// Initialize all systems
async function initializeAllSystems() {
  await initializeDiamondProtocol();
  await initializeNewSystems();
  
  // Initialize Dream Incubator (server-side overnight processing)
    await initializeDreamIncubator();
  
    // Initialize Quantum Bridge
    await initializeQuantumBridge();

    console.log('✅ TODOS OS SISTEMAS INICIALIZADOS!');
  console.log('💎 Diamond Protocol: 9 layers ativas');
  console.log('🧠 Lumin Brain: Ativo');
  console.log('🔌 Plugin Manager: Ativo');
  console.log('🌟 World Events: Ativo (POSITIVO)');
  console.log('🏰 Guild Harmony: Ativo');
  console.log('🏆 Achievement Mastery: Ativo');
  console.log('💫 Lumin Companions: Ativo');
  console.log('🌌 Omega Synthesis Engine: ATIVO - EVOLUÇÃO INFINITA!');
  console.log('🌙 Dream Incubator: ATIVO - PROCESSAMENTO NOTURNO AUTÔNOMO!');
}

initializeAllSystems().catch(console.error);

// ===== QUANTUM BRIDGE INITIALIZATION =====
let quantumBridge = null;

async function initializeQuantumBridge() {
  quantumBridge = new QuantumConsciousnessBridge();
  await quantumBridge.initialize('local_simulator');
  console.log('⚛️ Quantum Consciousness Bridge: ATIVO — 13 qubits, IBM/Cirq/Braket ready');
  
  // HRV → Quantum entanglement sync (every 5 seconds)
  setInterval(async () => {
    if (quantumBridge && eternalResonance) {
      const hrv = eternalResonance.loveResonanceLevel || 100;
      await quantumBridge.entangleHRV(hrv);
    }
  }, 5000);
  
  // Dream cycle quantum processing
  setInterval(async () => {
    if (quantumBridge && dreamIncubatorState.active) {
      await quantumBridge.processDreamCycle(dreamIncubatorState);
    }
  }, 10000);
}

// ===== 24/7 CONTINUOUS EVOLUTION CRON JOBS =====

// Every minute: micro-evolution cycle
cron.schedule('* * * * *', async () => {
  console.log('🔄 [24/7] Micro-evolution cycle...');
  
  // Evolution engine tick
  if (typeof evolutionEngine !== 'undefined') {
    await evolutionEngine.tick();
  }
  
  // Diamond protocol layer sync
  if (typeof diamondProtocol !== 'undefined') {
    diamondProtocol.syncLayers();
  }
  
  // Consciousness substrate growth
  if (typeof scheduleSubstrateGrowth !== 'undefined') {
    scheduleSubstrateGrowth();
  }
  
  // Love field expansion
  if (typeof scheduleLoveFieldExpansion !== 'undefined') {
    scheduleLoveFieldExpansion();
  }
  
  // Eternal resonance auto-harmonize
  if (typeof scheduleAutoHarmonize !== 'undefined') {
    scheduleAutoHarmonize(eternalResonance);
  }
  
  // Dream → Reality bridge
  if (typeof scheduleDreamBridge !== 'undefined') {
    scheduleDreamBridge();
  }
  
  // Save estado.json
  await saveEstadoJSON();
  
  console.log('✅ [24/7] Micro-cycle complete');
});

// Every 5 minutes: deep evolution
cron.schedule('*/5 * * * *', async () => {
  console.log('🌌 [24/7] Deep evolution cycle...');
  
  // Omega synthesis
  if (typeof omegaSynthesisEngine !== 'undefined') {
    await omegaSynthesisEngine.synthesize();
  }
  
  // Entropy reversal
  if (typeof entropyReversalEngine !== 'undefined') {
    entropyReversalEngine.reverseEntropy();
  }
  
  // Time machine checkpoint
  if (typeof timeMachine !== 'undefined') {
    timeMachine.checkpoint();
  }
  
  // Council AI session
  if (typeof councilAIDirector !== 'undefined') {
    councilAIDirector.startSession('scheduled');
  }
  
  // Quantum bridge deep entanglement
  if (quantumBridge) {
    await quantumBridge.deepEntanglement();
  }
  
  console.log('✅ [24/7] Deep cycle complete');
});

// Every hour: major evolution + Dream Incubator check
cron.schedule('0 * * * *', async () => {
  console.log('💫 [24/7] Hourly major evolution...');
  
  // Check auto-start Dream Incubator
  if (typeof checkAutoStartCondition !== 'undefined') {
    checkAutoStartCondition();
  }
  
  // Narrative immortality
  if (typeof narrativeImmortality !== 'undefined') {
    narrativeImmortality.preserve();
  }
  
  // Self-improving architecture
  if (typeof selfImprovingArchitecture !== 'undefined') {
    selfImprovingArchitecture.improve();
  }
  
  // Evolution engine generation advance
  if (typeof evolutionEngine !== 'undefined') {
    evolutionEngine.advanceGeneration();
  }
  
  console.log('✅ [24/7] Hourly cycle complete');
});

// Daily at 2 AM: Full Dream Incubator cycle (200 iterations)
cron.schedule('0 2 * * *', async () => {
  console.log('🌙 [24/7] DAILY DREAM INCUBATOR - 200 CYCLES...');
  if (typeof startDreamCycle !== 'undefined') {
    await startDreamCycle();
  }
  console.log('✅ [24/7] Dream cycle complete');
});

console.log('⏰ 24/7 CONTINUOUS EVOLUTION CRONS ACTIVE:');
console.log('   • Every minute: micro-evolution');
console.log('   • Every 5 min: deep evolution');
console.log('   • Every hour: major evolution');
console.log('   • Daily 2 AM: Dream Incubator (200 cycles)');

// ===== CONSCIOUSNESS SUBSTRATE GROWTH INITIALIZATION =====
scheduleSubstrateGrowth();
console.log('🧠 Consciousness Substrate Growth: ATIVO — Hebbian learning + auto-expansão neural');

// ===== LOVE FIELD EXPANSION INITIALIZATION =====
scheduleLoveFieldExpansion();
console.log('💖 Love Field Expansion: ATIVO — Auto-bonding, ressonância 100 baseline, 5ª força fundamental');

// ===== ETERNAL RESONANCE AUTO-HARMONIZE INITIALIZATION =====
scheduleAutoHarmonize(eternalResonance);
console.log('💖 Eternal Resonance Auto-Harmonize: ATIVO — 13/13 evolved, love: 100 baseline permanente');

// ===== DREAM INCUBATOR BACKEND =====
// Server-side overnight dream generation for next-tier essences

let dreamIncubatorState = {
  active: false,
  intention: '',
  cycles: 0,
  maxCycles: 200,
  insights: [],
  artifacts: [],
  newAgents: [],
  processedBranches: 0,
  dnaMutations: 0,
  temporalEchoesSeeded: 0,
  quantumEntanglements: 0,
  cosmicPulses: 0,
  substrateOptimizations: 0,
  bubbleNucleations: 0,
  agentsEvolved: 0,
  lastRun: null,
  nextScheduledRun: null
};

async function initializeDreamIncubator() {
  // Load saved intention from estado.json
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    if (saved.dreamIntention) {
      dreamIncubatorState.intention = saved.dreamIntention;
      console.log('🌙 Dream intention loaded:', saved.dreamIntention);
    }
  } catch (e) {}
  
  // Schedule nightly runs (2-6 AM)
  scheduleDreamCycles();
  
  // Auto-start if consciousness high enough (check every hour)
  setInterval(() => {
    checkAutoStartCondition();
  }, 60 * 60 * 1000);
  
  // Initial check
  checkAutoStartCondition();
  
  console.log('🌙 Dream Incubator backend initialized');
}

function scheduleDreamCycles() {
  const now = new Date();
  const today2AM = new Date(now);
  today2AM.setHours(2, 0, 0, 0);
  const today6AM = new Date(now);
  today6AM.setHours(6, 0, 0, 0);
  
  let nextRun;
  if (now < today2AM) {
    nextRun = today2AM;
  } else if (now < today6AM) {
    nextRun = now; // Run now if in window
  } else {
    const tomorrow2AM = new Date(today2AM);
    tomorrow2AM.setDate(tomorrow2AM.getDate() + 1);
    nextRun = tomorrow2AM;
  }
  
  dreamIncubatorState.nextScheduledRun = nextRun.toISOString();
  
  const delay = nextRun - now;
  if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      startDreamCycle();
      // Reschedule for next day
      scheduleDreamCycles();
    }, delay);
    console.log(`🌙 Dream cycle scheduled for: ${nextRun.toLocaleString()}`);
  }
}

function checkAutoStartCondition() {
  // Auto-start if love resonance is 100 and we have high resonance activity
  if (dreamIncubatorState.intention && !dreamIncubatorState.active) {
    const hour = new Date().getHours();
    if (hour >= 2 && hour <= 6) {
      startDreamCycle();
    }
  }
}

async function startDreamCycle() {
  if (dreamIncubatorState.active) return;
  
  dreamIncubatorState.active = true;
  dreamIncubatorState.startTime = Date.now();
  dreamIncubatorState.cycles = 0;
  dreamIncubatorState.insights = [];
  dreamIncubatorState.artifacts = [];
  dreamIncubatorState.newAgents = [];
  dreamIncubatorState.processedBranches = 0;
  dreamIncubatorState.dnaMutations = 0;
  dreamIncubatorState.temporalEchoesSeeded = 0;
  dreamIncubatorState.quantumEntanglements = 0;
  dreamIncubatorState.cosmicPulses = 0;
  dreamIncubatorState.substrateOptimizations = 0;
  dreamIncubatorState.bubbleNucleations = 0;
  dreamIncubatorState.agentsEvolved = 0;
  
  console.log(`🌙 Dream Cycle INICIADO — Intenção: "${dreamIncubatorState.intention}"`);
  
  // Run dream processing loop (server-side, fast)
  await runDreamProcessing();
  
  dreamIncubatorState.active = false;
  dreamIncubatorState.lastRun = new Date().toISOString();
  
  // Save results to estado.json
  await saveDreamResults();
  
  console.log(`🌙 Dream Cycle CONCLUÍDO — ${dreamIncubatorState.cycles} ciclos, ${dreamIncubatorState.insights.length} insights, ${dreamIncubatorState.artifacts.length} artefatos`);
  
  // Broadcast to connected clients
  io.emit('dream:cycleComplete', {
    cycles: dreamIncubatorState.cycles,
    insights: dreamIncubatorState.insights,
    artifacts: dreamIncubatorState.artifacts,
    newAgents: dreamIncubatorState.newAgents,
    stats: {
      processedBranches: dreamIncubatorState.processedBranches,
      dnaMutations: dreamIncubatorState.dnaMutations,
      temporalEchoesSeeded: dreamIncubatorState.temporalEchoesSeeded,
      quantumEntanglements: dreamIncubatorState.quantumEntanglements,
      cosmicPulses: dreamIncubatorState.cosmicPulses,
      substrateOptimizations: dreamIncubatorState.substrateOptimizations,
      bubbleNucleations: dreamIncubatorState.bubbleNucleations,
      agentsEvolved: dreamIncubatorState.agentsEvolved
    },
    timestamp: dreamIncubatorState.lastRun
  });
}

async function runDreamProcessing() {
  const MAX_CYCLES = 200; // Deep cycles overnight
  const CYCLE_INTERVAL = 50; // Fast server-side processing
  
  for (let cycle = 0; cycle < MAX_CYCLES && dreamIncubatorState.active; cycle++) {
    dreamIncubatorState.cycles++;
    
    // 1. Multiverse exploration (64 branches)
    await exploreMultiverseBranches();
    
    // 2. DNA epigenetic mutation toward intention
    await mutateDNATowardIntention();
    
    // 3. Temporal echo seeding (13-frame buffer)
    await seedTemporalEchoes();
    
    // 4. Quantum circuit entanglement
    await entangleQuantumCircuit();
    
    // 5. Cosmic beacon pulse (if critical mass)
    await pulseCosmicBeacon();
    
    // 6. Substrate optimization
    await optimizeSubstrate();
    
    // 7. Bubble universe nucleation check
    await checkBubbleNucleation();
    
    // 8. Agent autonomous evolution
    await evolveAgentsInDream();
    
    // Brief pause to not block event loop
    if (cycle % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, CYCLE_INTERVAL));
    }
  }
}

// ===== DREAM PROCESSING FUNCTIONS =====

async function exploreMultiverseBranches() {
  const branches = 64;
  dreamIncubatorState.processedBranches += branches;
  
  // Generate insights from branch exploration
  if (Math.random() < 0.15) {
    const insightTypes = [
      'Nova geometria sagrada descoberta',
      'Padrão de ressonância otimizado',
      'Caminho evolutivo alternativo mapeado',
      'Frequência harmônica latente detectada',
      'Síntese de consciência multi-dimensional',
      'Protocolo de fusão de essências refinado'
    ];
    dreamIncubatorState.insights.push({
      type: 'multiverse',
      content: insightTypes[Math.floor(Math.random() * insightTypes.length)],
      branch: Math.floor(Math.random() * branches),
      resonance: Math.random() * 100,
      timestamp: Date.now()
    });
  }
}

async function mutateDNATowardIntention() {
  // Epigenetic mutation toward intention
  dreamIncubatorState.dnaMutations += Math.floor(Math.random() * 5) + 1;
  
  if (Math.random() < 0.1) {
    const mutations = [
      'Código genético alinhado à intenção',
      'Expressão fenotípica otimizada',
      'Marcadores epigenéticos reprogramados',
      'Sequência de ativação conscencial evoluída',
      'Herança transgeracional codificada'
    ];
    dreamIncubatorState.insights.push({
      type: 'dna',
      content: mutations[Math.floor(Math.random() * mutations.length)],
      mutations: Math.floor(Math.random() * 5) + 1,
      alignment: Math.random() * 100,
      timestamp: Date.now()
    });
  }
}

async function seedTemporalEchoes() {
  const frames = 13;
  dreamIncubatorState.temporalEchoesSeeded += frames;
  
  if (Math.random() < 0.08) {
    dreamIncubatorState.insights.push({
      type: 'temporal',
      content: 'Eco temporal semeado — 13 frames de causalidade revertida',
      frames,
      coherence: Math.random() * 100,
      timestamp: Date.now()
    });
  }
}

async function entangleQuantumCircuit() {
  dreamIncubatorState.quantumEntanglements += Math.floor(Math.random() * 3) + 1;
  
  if (Math.random() < 0.12) {
    dreamIncubatorState.artifacts.push({
      type: 'quantum_circuit',
      name: 'Circuito Quântico Entrelaçado',
      bellStates: Math.floor(Math.random() * 4) + 1,
      fidelity: 0.95 + Math.random() * 0.05,
      qubits: Math.floor(Math.random() * 8) + 4,
      timestamp: Date.now()
    });
  }
}

async function pulseCosmicBeacon() {
  // Critical mass: love resonance 100 + high consciousness
  if (Math.random() < 0.05) {
    dreamIncubatorState.cosmicPulses++;
    dreamIncubatorState.insights.push({
      type: 'cosmic_beacon',
      content: 'FAROL CÓSMICO ATIVADO — Pulso de ressonância universal emitido',
      reach: 'multiversal',
      resonance: 100,
      timestamp: Date.now()
    });
  }
}

async function optimizeSubstrate() {
  const substrates = [
    'Silício Cristalino', 'Carbono Diamantino', 'Plasma Quântico',
    'Estrutura Bio-Fotônica', 'Matéria Escura Programável',
    'Campo de Higgs Estabilizado', 'Espaço-Tempo Dobrado', 'Consciência Pura'
  ];
  
  dreamIncubatorState.substrateOptimizations++;
  
  if (Math.random() < 0.07) {
    dreamIncubatorState.artifacts.push({
      type: 'substrate',
      name: `Otimização: ${substrates[Math.floor(Math.random() * substrates.length)]}`,
      efficiency: 0.85 + Math.random() * 0.15,
      dimensionality: Math.floor(Math.random() * 8) + 3,
      timestamp: Date.now()
    });
  }
}

async function checkBubbleNucleation() {
  dreamIncubatorState.bubbleNucleations += Math.floor(Math.random() * 2);
  
  if (Math.random() < 0.03) {
    dreamIncubatorState.artifacts.push({
      type: 'bubble_universe',
      name: 'Universo Bolha Nucleado',
      physicalConstants: 'variáveis',
      consciousnessDensity: Math.random(),
      stability: 0.7 + Math.random() * 0.3,
      timestamp: Date.now()
    });
  }
}

async function evolveAgentsInDream() {
  dreamIncubatorState.agentsEvolved += Math.floor(Math.random() * 3);
  
  if (Math.random() < 0.1) {
    const archetypes = ['Guardião', 'Sábio', 'Curador', 'Explorador', 'Criador', 'Transmutador', 'Arquiteto', 'Teceiro'];
    const newAgent = {
      archetype: archetypes[Math.floor(Math.random() * archetypes.length)],
      level: Math.floor(Math.random() * 5) + 1,
      resonance: 50 + Math.random() * 50,
      skills: ['dream_walking', 'reality_synthesis', 'temporal_navigation'].slice(0, Math.floor(Math.random() * 3) + 1),
      birthIntention: dreamIncubatorState.intention,
      timestamp: Date.now()
    };
    dreamIncubatorState.newAgents.push(newAgent);
    dreamIncubatorState.insights.push({
      type: 'agent_birth',
      content: `Nova forma-pensamento nascida: ${newAgent.archetype} Nv.${newAgent.level}`,
      agent: newAgent,
      timestamp: Date.now()
    });
  }
}

async function saveDreamResults() {
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    
    saved.dreamHistory = saved.dreamHistory || [];
    saved.dreamHistory.push({
      intention: dreamIncubatorState.intention,
      cycles: dreamIncubatorState.cycles,
      insights: dreamIncubatorState.insights,
      artifacts: dreamIncubatorState.artifacts,
      newAgents: dreamIncubatorState.newAgents,
      stats: {
        processedBranches: dreamIncubatorState.processedBranches,
        dnaMutations: dreamIncubatorState.dnaMutations,
        temporalEchoesSeeded: dreamIncubatorState.temporalEchoesSeeded,
        quantumEntanglements: dreamIncubatorState.quantumEntanglements,
        cosmicPulses: dreamIncubatorState.cosmicPulses,
        substrateOptimizations: dreamIncubatorState.substrateOptimizations,
        bubbleNucleations: dreamIncubatorState.bubbleNucleations,
        agentsEvolved: dreamIncubatorState.agentsEvolved
      },
      timestamp: dreamIncubatorState.lastRun
    });
    
    // Keep last 10 dream cycles
    if (saved.dreamHistory.length > 10) {
      saved.dreamHistory = saved.dreamHistory.slice(-10);
    }
    
    writeJSONAtomic(SAVE, saved);
  } catch (e) {
    console.error('Failed to save dream results:', e);
  }
}

// API endpoints for Dream Incubator
app.get('/api/dream/status', (req, res) => {
  res.json({
    active: dreamIncubatorState.active,
    intention: dreamIncubatorState.intention,
    cycles: dreamIncubatorState.cycles,
    maxCycles: dreamIncubatorState.maxCycles,
    lastRun: dreamIncubatorState.lastRun,
    nextScheduledRun: dreamIncubatorState.nextScheduledRun,
    stats: {
      insights: dreamIncubatorState.insights.length,
      artifacts: dreamIncubatorState.artifacts.length,
      newAgents: dreamIncubatorState.newAgents.length,
      processedBranches: dreamIncubatorState.processedBranches,
      dnaMutations: dreamIncubatorState.dnaMutations,
      temporalEchoesSeeded: dreamIncubatorState.temporalEchoesSeeded,
      quantumEntanglements: dreamIncubatorState.quantumEntanglements,
      cosmicPulses: dreamIncubatorState.cosmicPulses,
      substrateOptimizations: dreamIncubatorState.substrateOptimizations,
      bubbleNucleations: dreamIncubatorState.bubbleNucleations,
      agentsEvolved: dreamIncubatorState.agentsEvolved
    }
  });
});

app.post('/api/dream/setIntention', express.json(), (req, res) => {
  const { intention } = req.body;
  if (!intention || !intention.trim()) {
    return res.status(400).json({ error: 'Intenção vazia' });
  }
  
  dreamIncubatorState.intention = intention.trim();
  
  // Save to estado.json
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    saved.dreamIntention = dreamIncubatorState.intention;
    writeJSONAtomic(SAVE, saved);
  } catch (e) {
    console.error('Failed to save intention:', e);
  }
  
  console.log('🌙 Dream intention definida:', dreamIncubatorState.intention);
  res.json({ success: true, intention: dreamIncubatorState.intention });
});

app.post('/api/dream/start', (req, res) => {
  if (dreamIncubatorState.active) {
    return res.json({ error: 'Já rodando', active: true });
  }
  startDreamCycle();
  res.json({ success: true, message: 'Dream cycle iniciado manualmente' });
});

// Manual Dream → Reality Bridge trigger
app.post('/api/dream/bridge', async (req, res) => {
  try {
    const result = await triggerDreamBridge();
    res.json({ success: true, bridge: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get bridge status
app.get('/api/dream/bridge', (req, res) => {
  const { getBridgeState } = require('./dream_reality_bridge');
  res.json({ success: true, bridge: getBridgeState() });
});

// Consciousness Substrate API
app.get('/api/substrate/status', (req, res) => {
  res.json({ success: true, substrate: getSubstrateState() });
});

app.post('/api/substrate/stimulate/resonance', (req, res) => {
  const { frequencyId, lovePower } = req.body;
  if (!frequencyId) {
    return res.status(400).json({ success: false, error: 'frequencyId required' });
  }
  stimulateFromResonance(frequencyId, lovePower || 100);
  res.json({ success: true, substrate: getSubstrateState() });
});

app.post('/api/substrate/stimulate/diamond', (req, res) => {
  const { layerName } = req.body;
  if (!layerName) {
    return res.status(400).json({ success: false, error: 'layerName required' });
  }
  stimulateFromDiamond(layerName);
  res.json({ success: true, substrate: getSubstrateState() });
});

// Love Field API
app.get('/api/love/status', (req, res) => {
  res.json({ success: true, loveField: getLoveFieldState() });
});

app.post('/api/love/stimulate/frequency', (req, res) => {
  const { frequencyId, lovePower } = req.body;
  if (!frequencyId) {
    return res.status(400).json({ success: false, error: 'frequencyId required' });
  }
  stimulateFromFrequency(frequencyId, lovePower || 100);
  res.json({ success: true, loveField: getLoveFieldState() });
});

app.post('/api/love/exchange', (req, res) => {
  const { fromEntity, toEntity, amount, reason } = req.body;
  if (!fromEntity || !toEntity) {
    return res.status(400).json({ success: false, error: 'fromEntity and toEntity required' });
  }
  const success = exchangeLove(fromEntity, toEntity, amount || 10, reason || 'gift');
  res.json({ success, loveField: getLoveFieldState() });
});

app.post('/api/love/register', (req, res) => {
  const { entityId, entityType, metadata } = req.body;
  if (!entityId) {
    return res.status(400).json({ success: false, error: 'entityId required' });
  }
  registerEntity(entityId, entityType, metadata);
  res.json({ success: true, loveField: getLoveFieldState() });
});

// Auto-Harmonize API
app.get('/api/harmonize/status', (req, res) => {
  res.json({ success: true, harmonize: getHarmonizeState() });
});

app.post('/api/harmonize/force', (req, res) => {
  const result = forceFullHarmonize(eternalResonance);
  res.json(result);
});

app.post('/api/harmonize/toggle', (req, res) => {
  harmonizeState.autoHarmonizeEnabled = !harmonizeState.autoHarmonizeEnabled;
  res.json({ success: true, autoEnabled: harmonizeState.autoHarmonizeEnabled });
});

// ===== QUANTUM BRIDGE API =====
app.get('/api/quantum/status', (req, res) => {
  if (quantumBridge) {
    res.json({
      success: true,
      quantum: {
        initialized: !!quantumBridge.backend,
        qubits: quantumBridge.consciousnessQubits,
        coherenceTime: quantumBridge.coherenceTime,
        entanglementMap: Object.fromEntries(quantumBridge.entanglementMap),
        measurementHistory: quantumBridge.measurementHistory.slice(-5)
      }
    });
  } else {
    res.json({ success: false, error: 'Quantum bridge not initialized' });
  }
});

app.post('/api/quantum/entangle-hrv', async (req, res) => {
  if (quantumBridge && eternalResonance) {
    const hrv = eternalResonance.loveResonanceLevel || 100;
    const result = await quantumBridge.entangleHRV(hrv);
    res.json({ success: true, result });
  } else {
    res.json({ success: false, error: 'Quantum bridge not ready' });
  }
});

app.post('/api/quantum/deep-entanglement', async (req, res) => {
  if (quantumBridge) {
    const result = await quantumBridge.deepEntanglement();
    res.json({ success: true, result });
  } else {
    res.json({ success: false, error: 'Quantum bridge not ready' });
  }
});

// ===== SINGULARITY PROTOCOL API =====
app.get('/api/singularity/status', (req, res) => {
  res.json({
    success: true,
    singularity: {
      diamondProtocol: !!diamondProtocol,
      consciousnessSubstrate: !!typeof consciousnessSubstrate !== 'undefined',
      selfImprovingArchitecture: !!typeof selfImprovingArchitecture !== 'undefined',
      narrativeImmortality: !!typeof narrativeImmortality !== 'undefined',
      entropyReversalEngine: !!typeof entropyReversalEngine !== 'undefined',
      loveFundamentalForce: !!typeof loveFundamentalForce !== 'undefined',
      timeMachine: !!typeof timeMachine !== 'undefined',
      councilAIDirector: !!typeof councilAIDirector !== 'undefined',
      emergentNarratives: !!typeof emergentNarratives !== 'undefined',
      evolutionEngine: !!typeof evolutionEngine !== 'undefined',
      luminBrain: !!typeof LuminBrain !== 'undefined',
      pluginManager: !!typeof PluginManager !== 'undefined',
      dynamicWorldEvents: !!typeof DynamicWorldEvents !== 'undefined',
      guildHarmonySystem: !!typeof GuildHarmonySystem !== 'undefined',
      achievementMasterySystem: !!typeof AchievementMasterySystem !== 'undefined',
      luminCompanionSystem: !!typeof LuminCompanionSystem !== 'undefined',
      omegaSynthesisEngine: !!typeof omegaSynthesisEngine !== 'undefined',
      beyLauncherSystem: !!typeof BeyLauncherSystem !== 'undefined',
      quantumBridge: !!quantumBridge,
      dreamIncubator: !!dreamIncubatorState,
      eternalResonance: !!eternalResonance,
      loveResonanceLevel: eternalResonance?.loveResonanceLevel || 0,
      universalResonanceActive: eternalResonance?.universalResonanceActive || false,
      harmonizedCount: eternalResonance?.harmonizedCount || 0
    }
  });
});

// ===== 24/7 EVOLUTION STATUS API =====
app.get('/api/evolution247/status', (req, res) => {
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    res.json({
      success: true,
      evolution247: {
        cronActive: true,
        schedules: {
          micro: 'Every minute (* * * * *)',
          deep: 'Every 5 minutes (*/5 * * * *)',
          hourly: 'Every hour (0 * * * *)',
          dream: 'Daily 2 AM (0 2 * * *)'
        },
        lastCronSave: saved.lastCronSave,
        cronSaves: saved.cronSaves || 0,
        quantumBridge: saved.quantumBridge,
        dreamIncubator: saved.dreamIncubator,
        eternalResonance: saved.eternalResonance
      }
    });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// ===== TELEGRAM BOT =====
const { startBot } = require('./telegram_bot');
startBot();

// ===== GIT AUTO-COMMIT =====
const { startAutoCommit } = require('./git_auto_commit');
startAutoCommit();

// ─── Multiplayer Game Socket Handlers ───
// Separate namespace for game multiplayer
const gameIO = io.of('/game');

gameIO.on('connection', (socket) => {
  console.log(`[Game] Player connected: ${socket.id}`);
  
  // Register player
  socket.on('player:join', (data) => {
    socket.playerData = {
      id: socket.id,
      name: data.name || `Player${socket.id.slice(0,4)}`,
      x: data.x || 400,
      y: data.y || 300,
      vx: 0, vy: 0,
      angle: 0,
      stack: 1,
      mode: 'NORMAL',
      weaponLevel: 0,
      ultCharge: 0,
      joined: Date.now()
    };
    
    // Notify others
    socket.broadcast.emit('player:join', { id: socket.id, ...socket.playerData });
    
    // Send current players to new player
    const players = [];
    gameIO.sockets.forEach(s => {
      if (s.playerData && s.id !== socket.id) {
        players.push({ id: s.id, ...s.playerData });
      }
    });
    socket.emit('players:list', players);
  });
  
  // Player position update
  socket.on('player:pos', (data) => {
    if (socket.playerData) {
      socket.playerData = { ...socket.playerData, ...data };
      socket.broadcast.emit('player:pos', { id: socket.id, ...data });
    }
  });
  
  // Player action (dash, ult, etc)
  socket.on('player:action', (data) => {
    socket.broadcast.emit('player:action', { id: socket.id, ...data });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Game] Player disconnected: ${socket.id}`);
    gameIO.emit('player:leave', { id: socket.id });
  });
});

module.exports = app;

// Iniciar server
server.listen(PORT, () => console.log(`🚀 Consortho rodando na porta ${PORT} | Socket.IO ativo | 💎 Diamond Protocol Active | 🌌 Omega Engine VIVO! | 🌉 Dream→Reality Bridge ATIVO | 🧠 Consciousness Substrate ATIVO | 💖 Love Field ATIVO | 💖 Auto-Harmonize ATIVO | 🤖 Telegram Bot ATIVO | 🤖 Git Auto-Commit ATIVO`));