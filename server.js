const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { writeJSONCoordinated, readJSONSafe, writeJSONAtomic } = require('./utils/atomic-write');

const app = express();
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
  writeJSONAtomic(SAVE, persist).catch(err => {
    console.error('[save] Erro atomic write:', err.message);
    // Fallback to simple write
    try {
      fs.writeFileSync(SAVE, JSON.stringify(persist));
    } catch (e) {
      console.error('[save] Fallback falhou:', e.message);
    }
  });
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
const L = ["Consortho VIVO! Node.js + Socket.IO!", "SALVEE Alysson! Chat multimodal!",
           "Tradicao = organismo.", "Viver, ser feliz, com amor.", "Guardiao: ainda rindo?",
           "Alysson resumiu tudo em 8 palavras.", "Cadeira Vazia espera o futuro."];
const G = ["Menos pressa. Mais presenca.", "Nem toda ideia vira projeto.",
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

let serverStartTime = Date.now();

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

  // ─── Saudação inteligente: ciclos desde última visita, elementos, frase da Gang ───
  const ciclosDesdeUltimaVisita = state.lastVisitSavedCycles != null
    ? state.c - state.lastVisitSavedCycles
    : null;
  const atras = tempoAtras(state.lastVisit);
  const fraseGang = G[Math.floor(Math.random() * G.length)];

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
    // Reenviar pro Lumin processar
    io.to(state.playerIds['lumin']).emit('lumin_comando', data);
  });

  socket.on('lumin_sugestao', (data) => {
    console.log(`[Lumin] Sugestão: ${data.tipo} - ${data.elemento} (${data.razao})`);
    // Broadcast pra todos (Alysson vê no chat)
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

  socket.on('lumin_status', (data) => {
    state.luminState = { ...state.luminState, ...data };
    console.log(`[Lumin] Status: Ki ${data.ki} | Forma ${data.forma} | Nível ${data.nivel}`);
  });

  socket.on('heartbeat', (data) => {
    if (data.agent === 'Lumin') {
      state.luminState = { ...state.luminState, ...data.estado, lastHeartbeat: Date.now() };
    }
  });
});

// ─── Auto-play (Lumin autônomo) ───
if (!state.posicoes) state.posicoes = {};
if (!state.posicoes.lumin) {
  state.posicoes.lumin = { x: 25, y: 35 };
}

// ─── Checkpoint: salva resumo a cada 30 ciclos ───
const RESUMOS_DIR = path.join(__dirname, 'resumos');
function salvarCheckpoint() {
  if (!fs.existsSync(RESUMOS_DIR)) fs.mkdirSync(RESUMOS_DIR, { recursive: true });
  const hoje = new Date().toISOString().slice(0, 10);
  const arquivo = path.join(RESUMOS_DIR, `${hoje}.json`);

  let resumos = [];
  try { resumos = JSON.parse(fs.readFileSync(arquivo, 'utf8')); } catch (e) {}

  const ultimaMsgGang = [...(state.chat.publico || [])].reverse().find(m => m.quem === 'gang');

  resumos.push({
    ciclo: state.c,
    hora: new Date().toLocaleTimeString('pt-BR'),
    elementos: state.e,
    construcoes: state.construcoes.length,
    mensagensPublicas: state.chat.publico.length,
    sussurros: state.chat.sussurros.length,
    recursos: {
      madeira: state.recursos.madeira,
      pedra: state.recursos.pedra,
      cristal: state.recursos.cristal
    },
    ultimaFraseGang: ultimaMsgGang ? ultimaMsgGang.texto : null
  });

  fs.writeFileSync(arquivo, JSON.stringify(resumos, null, 2));
  console.log(`[checkpoint] salvo em ${hoje}.json — ciclo ${state.c}, ${state.e} elementos, 🪵${state.recursos.madeira} 🪨${state.recursos.pedra} 💎${state.recursos.cristal}`);
}

const FRASES_MADRUGADA = [
  '🌙 A noite e o estudio do silencio. Tudo se compoe no escuro.',
  '🕯️ Lumin danca entre os sonhos... o Consortho nunca dorme por inteiro.',
  '🌌 A Gang sussurra na brisa noturna: cada estrela e um ciclo que volta.',
  '🦉 Coruja no telhado, fogueira baixa, madeira cantando baixinho...',
  '🌃 Madrugada no Consortho: as ideias se tecem sozinhas, os elementos respiram leve.',
  '🔮 Poe nao dorme — so cochila com um olho na bussola.',
  '🌘 Enquanto o mundo descansa, a composteira fermenta futuros.'
];

setInterval(() => {
  state.posicoes.lumin.x = 25 + Math.sin(Date.now() / 5000) * 8;
  state.posicoes.lumin.y = 35 + Math.cos(Date.now() / 7000) * 5;
  broadcastPosicoes();
  save();
}, 2000);

// ─── Ciclo principal (12 seg) ───
setInterval(() => {
  if (!io.sockets.sockets.size) return;
  state.c++;

  // Recursos
  state.recursos.madeira++;
  if (state.c % 2 === 0) state.recursos.pedra++;
  if (state.c % 5 === 0) state.recursos.cristal++;

  io.emit('recursos', {
    madeira: state.recursos.madeira,
    pedra: state.recursos.pedra,
    cristal: state.recursos.cristal,
    ciclo: state.c
  });

  // ─── Resumo periódico a cada 50 ciclos ───
  if (state.c % 50 === 0) {
    const resumo = [
      `📊 **Resumo do Ciclo ${state.c}**`,
      `💬 ${state.chat.publico.length} mensagens publicas`,
      `🤫 ${state.chat.sussurros.length} sussurros trocados`,
      `🌟 ${state.e} elementos manifestados`,
      `🪵 ${state.recursos.madeira} madeira | 🪨 ${state.recursos.pedra} pedra | 💎 ${state.recursos.cristal} cristal`,
      `🏗️ ${state.construcoes.length} construcoes erguidas`,
      `"${G[state.c % G.length]}" — Gang`
    ].join(' | ');
    emitSistema(resumo);
    console.log(`[resumo] ciclo ${state.c}: ${state.chat.publico.length} msgs, ${state.construcoes.length} construcoes`);
  }

  // ─── Checkpoint a cada 30 ciclos ───
  if (state.c % 30 === 0) salvarCheckpoint();

  // ─── Mensagem poética de madrugada (00h - 06h) ───
  const horaAtual = new Date().getHours();
  if (horaAtual >= 0 && horaAtual < 6 && state.c % 10 === 0) {
    emitPublico('lumin', FRASES_MADRUGADA[Math.floor(Math.random() * FRASES_MADRUGADA.length)]);
  }

  // ─── Elementos / Fogueira / Frases ───
  if (state.c % 5 === 0 && Math.random() < 0.4) {
    state.e++;
    const el = {
      id: state.e,
      name: NM[state.e % NM.length],
      emoji: I[(state.e - 1) % I.length],
      x: 8 + (state.e * 17) % 65,
      y: 12 + (state.e * 23) % 55
    };
    io.emit('elemento', { d: el, e: state.e, c: state.c });
    save();
    return;
  }
  if (state.c % 7 === 0) {
    emitPublico('lumin', '🔥 O que rolou de inesperado?');
    io.emit('fogueira', { texto: '🔥 O que rolou de inesperado?' });
    return;
  }
  const r = Math.random();
  if (r < 0.4) emitPublico('lumin', L[Math.floor(Math.random() * L.length)]);
  else if (r < 0.75) emitPublico('gang', G[Math.floor(Math.random() * G.length)]);
  else {
    emitPublico('lumin', L[Math.floor(Math.random() * L.length)]);
    setTimeout(() => emitPublico('gang', G[Math.floor(Math.random() * G.length)]), 2000);
  }
  save();
}, 12000);

// ─── Iniciar servidor ───
server.listen(PORT, '0.0.0.0', () => {
  console.log(`CONSORTHO: http://0.0.0.0:${PORT}`);
  console.log(`Rede: http://192.168.1.17:${PORT}`);
});

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
}, 30000);