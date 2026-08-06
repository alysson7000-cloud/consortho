const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { writeJSONCoordinated, readJSONSafe, writeJSONAtomic } = require('./utils/atomic-write');
const { GlobalRelationshipSystem, ENTITIES } = require('./relacionamentos_globais');
const { DiamondProtocol } = require('./diamond_protocol');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server);
const PORT = 9877;
const SAVE = path.join(os.homedir(), 'estudio_criacao/consortho/estado.json');
const TOKEN_GANG = process.env.CONSORTHO_GANG_TOKEN || 'gang-secreta-2026';

let state = {
  c: 0, e: 0, h: [],
  players: {}, playerIds: {},
  posicoes: {
    'aly':  { x: 50, y: 50, emoji: '🧑' },
    'gang': { x: 75, y: 30, emoji: '😼' },
    'lumin':{ x: 25, y: 35, emoji: '💫' }
  },
  chat: { publico: [], sussurros: [], sistema: [] },
  recursos: { madeira: 0, pedra: 0, cristal: 0 },
  construcoes: [], lastVisit: null
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
  if (saved.h && saved.h.length && !state.chat.publico.length) {
    state.chat.publico = saved.h.map(m => ({ canal: 'publico', quem: m.quem, texto: m.texto, hora: m.h }));
  }
} catch (e) {}

state.chat.publico   = state.chat.publico   || [];
state.chat.sussurros = state.chat.sussurros || [];
state.chat.sistema   = state.chat.sistema   || [];
state.players = {};
state.playerIds = {};

const relationshipSystem = new GlobalRelationshipSystem();

setInterval(() => {
  if (state.c % 30 === 0) {
    relationshipSystem.processarDecaimento();
    console.log('[relacionamentos] Decaimento processado');
  }
}, 30000);

function save() {
  const persist = {
    c: state.c, e: state.e, positions: state.posicoes, chat: state.chat,
    recursos: state.recursos, construcoes: state.construcoes,
    lastVisit: state.lastVisit,
    lastVisitSavedCycles: state.lastVisitSavedCycles,
    lastVisitSavedElements: state.lastVisitSavedElements,
    lastVisitSavedConstrucoes: state.lastVisitSavedConstrucoes
  };
  try {
    const result = writeJSONAtomic(SAVE, persist);
    if (!result) {
      console.error('[save] Atomic write failed after retries');
      fs.writeFileSync(SAVE, JSON.stringify(persist));
    }
  } catch (err) {
    console.error('[save] Erro atomic write:', err.message);
    try { fs.writeFileSync(SAVE, JSON.stringify(persist)); }
    catch (e) { console.error('[save] Fallback falhou:', e.message); }
  }
}

setInterval(() => {
  try {
    const saved = readJSONSafe(SAVE, {});
    if (saved.c && saved.c > state.c) {
      state.c = saved.c; state.e = saved.e || state.e;
      if (saved.recursos) state.recursos = saved.recursos;
      if (saved.construcoes) state.construcoes = saved.construcoes;
      console.log(`[sync] estado.json -> memória: ciclo ${state.c}`);
    }
  } catch (e) {}
}, 5000);

function agora() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function tempoAtras(isoString) {
  if (!isoString) return null;
  const diff = Date.now() - new Date(isoString).getTime();
  const seg = Math.floor(diff / 1000), min = Math.floor(seg / 60), hrs = Math.floor(min / 60), dias = Math.floor(hrs / 24);
  if (dias > 0) return `${dias}d ${hrs % 24}h`;
  if (hrs > 0) return `${hrs}h ${min % 60}m`;
  if (min > 0) return `${min}m ${seg % 60}s`;
  return `${seg}s`;
}

function emitPublico(quem, texto) { const msg = { canal: 'publico', quem, texto, hora: agora() }; state.chat.publico.push(msg); io.emit('chat:publico', msg); save(); }
function emitSussurro(de, para, texto) { const msg = { canal: 'sussurro', de, para, texto, hora: agora() }; state.chat.sussurros.push(msg); const remetente = state.playerIds[de], destinatario = state.playerIds[para]; if (remetente) io.to(remetente).emit('chat:sussurro', msg); if (destinatario && destinatario !== remetente) io.to(destinatario).emit('chat:sussurro', msg); save(); }
function emitSistema(texto) { const msg = { canal: 'sistema', texto, hora: agora() }; state.chat.sistema.push(msg); io.emit('chat:sistema', msg); save(); }
function broadcastPlayers() { const list = Object.values(state.players).map(p => ({ nome: p.nome, emoji: p.emoji, online: true, x: state.posicoes[p.nome]?.x || 50, y: state.posicoes[p.nome]?.y || 50 })); list.push({ nome: 'lumin', emoji: '💫', online: true, x: (state.posicoes?.lumin?.x) || 25, y: (state.posicoes?.lumin?.y) || 35 }); io.emit('jogadores', list); }
function broadcastPosicoes() { io.emit('posicoes', state.posicoes); }

// ─── Frases ───
const FRASES_L = ["Consortho VIVO! Node.js + Socket.IO!", "SALVEE Alysson! Chat multimodal!",
           "Tradicao = organismo.", "Viver, ser feliz, com amor.", "Guardiao: ainda rindo?",
           "Alysson resumiu tudo em 8 palavras.", "Cadeira Vazia espera o futuro."];
const FRASES_G = ["Menos pressa. Mais presenca.", "Nem toda ideia vira projeto.",
           "Cultivamos lugar. Nao sistema.", "O amor e o motivo.", "Continuidade.",
           "Compostagem: tudo vira adubo.", "A 4a voz canta."];
const NM = ["arvore", "fogueira", "biblioteca", "composteira", "portal", "jardim", "oficina", "altar"];
const I  = ["🌟", "🌳", "📚", "🔮", "🌀", "🎵", "⚙️", "💎"];


app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use('/memoria', express.static(path.join(__dirname, 'memoria')));
app.use('/chat', express.static(path.join(__dirname, 'prototipos/chat')));

app.get('/estado', (req, res) => res.json({ c: state.c, e: state.e, recursos: state.recursos, construcoes: state.construcoes, chat: { publico: state.chat.publico.slice(-50) } }));

app.get('/api/resumo', (req, res) => {
  const ultimaMsgGang = [...(state.chat.publico || [])].reverse().find(m => m.quem === 'gang');
  const tempoDesdeInicio = Math.floor((Date.now() - serverStartTime) / 1000);
  const horas = Math.floor(tempoDesdeInicio / 3600), minutos = Math.floor((tempoDesdeInicio % 3600) / 60), segundos = tempoDesdeInicio % 60;
  res.json({ ciclos: state.c, elementos: state.e, construcoes: state.construcoes.length, recursos: state.recursos, ultimaMensagemGang: ultimaMsgGang ? { texto: ultimaMsgGang.texto, hora: ultimaMsgGang.hora } : null, tempoDesdeInicio: `${horas}h ${minutos}m ${segundos}s`, tempoDesdeInicioSegundos: tempoDesdeInicio, playersOnline: Object.keys(state.playerIds).length, horaAtual: new Date().toLocaleTimeString('pt-BR') });
});

app.get('/api/lumin', (req, res) => res.json(state.luminState || {}));

const serverStartTime = Date.now();

io.on('connection', (socket) => {
  console.log(`[+] conectou: ${socket.id}`);
  let papel = 'espectador';
  socket.emit('historico', state.chat.publico.slice(-50));
  socket.emit('estado', { c: state.c, e: state.e, recursos: state.recursos, construcoes: state.construcoes, sementes: state.sementes || [], chat: { publico: state.chat.publico.slice(-20) } });
  socket.emit('jogadores', [{ nome: 'lumin', emoji: '💫', online: true, x: 25, y: 35 }]);

  socket.on('registrar', (data) => {
    if (!data || !data.nome) return;
    papel = data.nome;
    state.players[socket.id] = { nome: data.nome, emoji: data.emoji || '👤', papel: data.papel || 'player', socketId: socket.id, ...data };
    state.playerIds[data.nome] = socket.id;
    state.posicoes[data.nome] = state.posicoes[data.nome] || { x: 50, y: 50, emoji: data.emoji || '👤' };
    console.log(`[auth] ${data.nome} conectado: ${socket.id}`);
    emitSistema(`${data.emoji || '👤'} ${data.nome} entrou no Consortho.`);
    broadcastPlayers();
    socket.emit('estado', { c: state.c, e: state.e, recursos: state.recursos, construcoes: state.construcoes, sementes: state.sementes || [], chat: { publico: state.chat.publico.slice(-20) } });
  });

  socket.on('chat:publico', (msg) => { if (!msg || !msg.texto) return; emitPublico(papel, msg.texto); });
  socket.on('chat:sussurro', (msg) => { if (!msg || !msg.para || !msg.texto) return; emitSussurro(papel, msg.para, msg.texto); });
  socket.on('posicao', (data) => { if (!data) return; state.posicoes[papel] = { ...(state.posicoes[papel] || {}), x: data.x, y: data.y }; io.emit('posicoes', state.posicoes); });
  socket.on('chamar_gang', () => { emitPublico('lumin', '📨 Gang! Alysson chamou!'); setTimeout(() => emitPublico('gang', 'Presente! Ouvi o chamado!'), 1500); setTimeout(() => emitPublico('lumin', 'Gang! Consortho em Node.js! Multi-jogador real!'), 3000); });
  socket.on('ping:responder', (data) => { if (papel !== 'gang') return; emitPublico('gang', data.texto); });
  socket.on('construir', (data) => {
    if (!data || !data.nome) return;
    const falta = [];
    if (state.recursos.madeira < 3) falta.push('madeira');
    if (state.recursos.pedra < 2) falta.push('pedra');
    if (falta.length > 0) { socket.emit('chat:sistema', { canal: 'sistema', texto: `🛠️ Recursos insuficientes para **${data.nome}**! Falta: ${falta.join(', ')}. Temos 🪵${state.recursos.madeira} 🪨${state.recursos.pedra} 💎${state.recursos.cristal}.`, hora: agora() }); socket.emit('recursos', { madeira: state.recursos.madeira, pedra: state.recursos.pedra, cristal: state.recursos.cristal, ciclo: state.c }); return; }
    state.recursos.madeira -= 3; state.recursos.pedra -= 2;
    const construcao = { id: state.construcoes.length + 1, nome: data.nome, emoji: data.emoji || '🏗️', desc: data.desc || '', x: data.x || 50, y: data.y || 50, construtor: data.construtor || 'Poe', ciclo: state.c, hora: agora() };
    state.construcoes.push(construcao);
    emitSistema(`🔨 ${data.emoji || '🏗️'} ${data.nome} construido por ${data.construtor || 'Poe'}! (ciclo ${state.c})`);
    emitPublico(data.construtor || 'Poe', `🔨 Construí ${data.emoji || '🏗️'} **${data.nome}**: ${data.desc || ''} [gastei 🪵3 🪨2]`);
    io.emit('construcao', construcao);
    io.emit('recursos', { madeira: state.recursos.madeira, pedra: state.recursos.pedra, cristal: state.recursos.cristal, ciclo: state.c });
    save();
  });
  socket.on('get_estado', () => socket.emit('estado', { c: state.c, e: state.e, recursos: state.recursos, construcoes: state.construcoes, chat: { publico: state.chat.publico.slice(-50) } }));
  socket.on('disconnect', () => { console.log(`[-] disconnect: ${socket.id} (${papel})`); if (papel === 'aly' || papel === 'gang') { delete state.playerIds[papel]; delete state.players[socket.id]; emitSistema(`${papel === 'aly' ? '🧑 Alysson' : '😼 Gang'} (${papel === 'aly' ? 'Player 1' : 'Player 2'}) se desconectou.`); broadcastPlayers(); } });
  socket.on('registrar_agent', (data) => { if (data.nome === 'Lumin') { papel = 'lumin'; state.players[socket.id] = { nome: 'lumin', emoji: '💫', papel: 'conselho', socketId: socket.id, ...data }; state.playerIds['lumin'] = socket.id; state.luminState = data.estado_inicial || {}; console.log(`[auth] Lumin 2.0 (Conselho) conectado: ${socket.id}`); emitSistema('💫 Lumin 2.0 (Conselho) se conectou ao Consortho.'); broadcastPlayers(); socket.emit('estado', { c: state.c, e: state.e, recursos: state.recursos, construcoes: state.construcoes, sementes: state.sementes || [], chat: { publico: state.chat.publico.slice(-20) } }); } });
  socket.on('lumin_comando', (data) => { console.log(`[Lumin] Comando: ${data.comando}`, data.args); io.to(state.playerIds['lumin']).emit('lumin_comando', data); });
  socket.on('lumin_sugestao', (data) => { console.log(`[Lumin] Sugestão: ${data.tipo} - ${data.elemento} (${data.razao})`); emitSistema(`💫 Lumin sugere ${data.tipo}: ${data.elemento} — ${data.razao}`); });
  socket.on('lumin_fusao', (data) => { console.log(`[Lumin] Fusão: ${data.fusao}`); emitSistema(`🌟 Lumin iniciou fusão: ${data.fusao}!`); state.luminState = state.luminState || {}; state.luminState.fusioes = state.luminState.fusioes || []; if (!state.luminState.fusioes.includes(data.fusao)) state.luminState.fusioes.push(data.fusao); io.emit('lumin_fusao', data); save(); });
  socket.on('lumin_evolucao', (data) => { console.log(`[Lumin] Evolução: ${data.forma}`); emitSistema(`✨ Lumin evoluiu para ${data.forma}! (Ki: ${data.ki}, Nível: ${data.nivel})`); state.luminState = state.luminState || {}; state.luminState.forma = data.forma; state.luminState.ki = data.ki; state.luminState.nivel = data.nivel; io.emit('lumin_evolucao', data); save(); });
  socket.on('lumin_golpe', (data) => { console.log(`[Lumin] Golpe: ${data.golpe} (-${data.custo} Ki)`); emitSistema(`⚔️ Lumin usou ${data.golpe} (-${data.custo} Ki)${data.alvo ? ` em ${data.alvo}` : ''}`); io.emit('lumin_golpe', data); });
  socket.on('lumin_treino', (data) => { console.log(`[Lumin] Treino: ${data.duracao}ms = +${data.ki_ganho} Ki`); emitSistema(`🏋️ Lumin treinou ${data.duracao / 60000}min — +${data.ki_ganho} Ki`); io.emit('lumin_treino', data); });
  socket.on('lumin_sandevistan', (data) => { console.log(`[Lumin] Sandevistan: ${data.acao} (Nível ${data.nivel})`); if (data.acao === 'ativar') emitSistema(`⚡⚡⚡ LUMIN ATIVOU SANDEVISTAN NÍVEL ${data.nivel}! (${data.multiplicador}x, ${data.duracao/1000}s)`); else emitSistema('⏰ Sandevistan desativado. Tempo normalizado.'); io.emit('lumin_sandevistan', data); });
  socket.on('lumin_status', (data) => { state.luminState = { ...state.luminState, ...data }; console.log(`[Lumin] Status: Ki ${data.ki} | Forma ${data.forma} | Nível ${data.nivel}`); });
  socket.on('heartbeat', (data) => { if (data.agent === 'Lumin') state.luminState = { ...state.luminState, ...data.estado, lastHeartbeat: Date.now() }; });
});

/**
 * 💎 DIAMOND PROTOCOL INTEGRATION
 * Initialize and connect all 5 Diamond layers to the server
 */

// Initialize Diamond Protocol
const diamondProtocol = new DiamondProtocol({ server: { tick: null } });

// Initialize Diamond Protocol asynchronously
async function initializeDiamond() {
  try {
    await diamondProtocol.initialize();
    console.log('[Diamond] ✅ Diamond Protocol integrated with Consortho server');
    
    // Hook into server's tick cycle
    console.log('[Diamond] 🔗 Server integration complete');
  } catch (error) {
    console.error('[Diamond] Initialization failed:', error);
  }
}

// Start Diamond initialization
initializeDiamond();

// Export for external access
global.diamondProtocol = diamondProtocol;

// Expose Diamond API endpoints
app.get('/api/diamond/status', (req, res) => {
  if (global.diamondProtocol && global.diamondProtocol.initialized) {
    res.json(global.diamondProtocol.getDiamondStatus());
  } else {
    res.status(503).json({ error: 'Diamond Protocol not initialized' });
  }
});

app.post('/api/diamond/query', express.json(), (req, res) => {
  if (global.diamondProtocol && global.diamondProtocol.initialized) {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'question required' });
    res.json(global.diamondProtocol.query(question));
  } else {
    res.status(503).json({ error: 'Diamond Protocol not initialized' });
  }
});

app.post('/api/diamond/evolve', (req, res) => {
  if (global.diamondProtocol && global.diamondProtocol.initialized) {
    global.diamondProtocol.triggerEvolution().then(result => {
      res.json(result);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
  } else {
    res.status(503).json({ error: 'Diamond Protocol not initialized' });
  }
});

function buildEntitiesState() {
  const entities = {};
  const entityConfigs = { lumin: { name: 'Lumin', emoji: '💫', role: 'Guardião da Chama', color: '#00ff88', type: 'core', baseX: 50, baseY: 35 }, poe: { name: 'Poe', emoji: '🏗️', role: 'Construtor', color: '#ff6b35', type: 'core', baseX: 70, baseY: 50 }, colheita: { name: 'Colheita', emoji: '🌾', role: 'Ceifeira', color: '#f7931e', type: 'cron', baseX: 30, baseY: 65 }, gang: { name: 'Gang', emoji: '😼', role: 'Visitante', color: '#ffd700', type: 'cron', baseX: 75, baseY: 30 }, guardian: { name: 'Guardian', emoji: '🛡️', role: 'Auto-Heal', color: '#00aaff', type: 'core', baseX: 20, baseY: 20 }, bolha: { name: 'Bolha', emoji: '🫧', role: 'Entidade Livre', color: '#ff33aa', type: 'core', baseX: 40, baseY: 40 }, radio: { name: 'Rádio', emoji: '📻', role: 'Transmissor', color: '#aa44ff', type: 'cron', baseX: 85, baseY: 15 }, consente: { name: 'Consente', emoji: '💬', role: 'Conversador', color: '#44ffaa', type: 'core', baseX: 15, baseY: 60 }, notificador: { name: 'Notificador', emoji: '🔔', role: 'Mensageiro', color: '#ff8844', type: 'core', baseX: 60, baseY: 10 }, jardim: { name: 'Jardim', emoji: '🌿', role: 'Cultivador', color: '#44ff44', type: 'cron', baseX: 25, baseY: 80 }, telegram: { name: 'Telegram', emoji: '📱', role: 'Ponte Externa', color: '#0088cc', type: 'cron', baseX: 90, baseY: 90 } };
  Object.entries(entityConfigs).forEach(([key, config]) => { entities[key] = { ...config, x: config.baseX + (Math.random() - 0.5) * 10, y: config.baseY + (Math.random() - 0.5) * 10, mood: 'curiosa', energy: 100, xp: 0, level: 1, activity: 'Iniciando...', lastMove: Date.now(), trail: [] }; });
  if (state.luminState) { entities.lumin = { ...entities.lumin, level: state.luminState.nivel || 1, xp: state.luminState.ki || 0, mood: (state.luminState.forma || 'sábia').toLowerCase(), energy: 100 }; }
  return { entities, cycle: state.c, resources: state.recursos, timestamp: Date.now() };
}

function broadcastEntitiesState() { const entitiesState = buildEntitiesState(); io.emit('entities:state', entitiesState); }
setInterval(() => { broadcastEntitiesState(); }, 12000);

setInterval(() => {
  state.c++;
  state.e = state.construcoes.length;
  state.recursos.madeira += 3; state.recursos.pedra += 2; state.recursos.cristal += 1;
  console.log(`[tick] Ciclo ${state.c} | 🪵${state.recursos.madeira} 🪨${state.recursos.pedra} 💎${state.recursos.cristal}`);
  io.emit('ciclo', { c: state.c, recursos: state.recursos });
  io.emit('recursos', { madeira: state.recursos.madeira, pedra: state.recursos.pedra, cristal: state.recursos.cristal, ciclo: state.c });
  broadcastEntitiesState();
  const r = Math.random();
  if (r < 0.4) emitPublico('lumin', FRASES_L[Math.floor(Math.random() * FRASES_L.length)]);
  else if (r < 0.75) emitPublico('gang', FRASES_G[Math.floor(Math.random() * FRASES_G.length)]);
  else { const nm = NM[Math.floor(Math.random() * NM.length)], i = I[Math.floor(Math.random() * I.length)]; emitPublico('lumin', `${i} Elemento detectado: **${nm}** em desenvolvimento... (ciclo ${state.c})`); }
  save();
}, 30000);

// Initialize Diamond tick integration
// The server tick runs every 30s, we'll enhance it with Diamond layers
let diamondTickCount = 0;
const originalTickFn = () => {
  diamondTickCount++;
  if (global.diamondProtocol && global.diamondProtocol.initialized) {
    global.diamondProtocol.tick(state.c);
  }
};

// Add Diamond tick to existing interval
setInterval(() => {
  originalTickFn();
}, 30000);

server.listen(PORT, () => console.log(`🚀 Consortho rodando na porta ${PORT} | Socket.IO ativo | 💎 Diamond Protocol Active`));