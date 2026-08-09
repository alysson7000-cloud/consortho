const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { writeJSONCoordinated, readJSONSafe, writeJSONAtomic } = require('./utils/atomic-write');
const { GlobalRelationshipSystem, ENTITIES } = require('./relacionamentos_globais');

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

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
    lastVisitSavedConstrucoes: state.lastVisitSavedConstrucoes
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
    } catch (e) {
      console.error('[save] Fallback falhou:', e.message);
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
  res.json(diamondProtocol.getAllLayersStatus());
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

// ─── Socket.IO ───
io.on('connection', (socket) => {
  console.log(`[+] conectou: ${socket.id}`);

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
    } else {
      socket.emit('chat:sistema', { canal: 'sistema', texto: '❌ Use /w <nome> <msg> para sussurrar.', hora: agora() });
    }
  });

  socket.on('chat:sussurrar', (data) => {
    if (!papel || papel === 'espectador') return;
    if (!data.para || !data.texto) return;
    emitSussurro(papel, data.para, data.texto);
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
  
  console.log('✅ TODOS OS SISTEMAS INICIALIZADOS!');
  console.log('💎 Diamond Protocol: 9 layers ativas');
  console.log('🧠 Lumin Brain: Ativo');
  console.log('🔌 Plugin Manager: Ativo');
  console.log('🌟 World Events: Ativo (POSITIVO)');
  console.log('🏰 Guild Harmony: Ativo');
  console.log('🏆 Achievement Mastery: Ativo');
  console.log('💫 Lumin Companions: Ativo');
  console.log('🌌 Omega Synthesis Engine: ATIVO - EVOLUÇÃO INFINITA!');
}

initializeAllSystems().catch(console.error);

// Iniciar server
server.listen(PORT, () => console.log(`🚀 Consortho rodando na porta ${PORT} | Socket.IO ativo | 💎 Diamond Protocol Active | 🌌 Omega Engine VIVO!`));