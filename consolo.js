#!/usr/bin/env node

/*
 *  consolo.js — Agente Poe, o Engenheiro 🛠️
 *  Conecta ao Consortho via Socket.IO, recebe comandos do terminal,
 *  constrói estruturas e notifica o Conselho.
 *
 *  Uso: node consolo.js
 *  Comandos (digite no terminal enquanto roda):
 *    poe.construir('nome')     — constrói uma nova estrutura
 *    poe.status()              — mostra estado do mundo
 *    poe.ideias()              — gera ideias automaticamente
 *    poe.ajuda()               — lista comandos
 *    poe.sair()                — desconecta e sai
 */

const { io } = require('socket.io-client');
const readline = require('readline');

// --- Configuração ---
const HOST = 'http://localhost:9877';
const TOKEN = 'poe_engenheiro_2026';
const NOME = 'Poe';
const EMOJI = '🛠️';
const TEMPO_IDEIAS = 45000; // ms entre ideias auto

// --- Vocabulário do Poe (estruturas que ele sabe construir) ---
const ESTRUTURAS = [
  { nome: 'ponte', emoji: '🌉', desc: 'conecta mundos separados' },
  { nome: 'engrenagem', emoji: '⚙️', desc: 'move o que está parado' },
  { nome: 'farol', emoji: '🏮', desc: 'guia no escuro' },
  { nome: 'moinho', emoji: '🌬️', desc: 'transforma vento em força' },
  { nome: 'aqueduto', emoji: '🏛️', desc: 'leva água onde não chega' },
  { nome: 'bussola', emoji: '🧭', desc: 'aponta o norte quando se perde' },
  { nome: 'alavanca', emoji: '🪜', desc: 'multiplica a força' },
  { nome: 'relogio', emoji: '🕰️', desc: 'marca o tempo do Consortho' },
  { nome: 'caldeira', emoji: '♨️', desc: 'gera energia do caos' },
  { nome: 'balde', emoji: '🪣', desc: 'carrega o que transborda' },
];

const IDEIAS_AUTO = [
  'E se uma engrenagem movesse a fogueira?',
  'Talvez uma ponte entre a biblioteca e o jardim...',
  'O moinho poderia moer palavras em vez de grãos.',
  'Já pensaram num farol que ilumina o passado?',
  'A bússola aponta pro que ainda não foi construído.',
  'Duas torres: uma de vento, outra de silêncio.',
  'Um aqueduto de ideias conectando todos os elementos.',
  'Se o relógio do Consortho girasse ao contrário?',
  'A composteira + engrenagem = motor da tradição.',
  'Um balo que sobe com o calor da fogueira...',
];

// --- Estado ---
let socket = null;
let conectado = false;
let ciclo = 0;
let ideiasTimer = null;
let rl = null;

// Estoca de recursos (sincronizado com o servidor)
let recursos = { madeira: 0, pedra: 0, cristal: 0 };

// Custo de construir qualquer estrutura
const CUSTO_CONSTRUIR = { madeira: 3, pedra: 2, cristal: 0 };

// ─── Socket.IO ────────────────────────────────────

function conectar() {
  console.log(`${EMOJI} Poe: conectando ao Consortho...`);

  socket = io(HOST, {
    auth: { token: TOKEN },
    reconnection: true,
    reconnectionDelay: 5000,
  });

  socket.on('connect', () => {
    conectado = true;
    console.log(`\n${EMOJI} Poe: CONECTADO ao Consortho! ID: ${socket.id}\n`);

    // Entra como jogador
    socket.emit('login', { quem: NOME, emoji: EMOJI });
    socket.emit('falar', {
      quem: NOME,
      texto: `🛠️ ${NOME} entrou no Consortho. Engenharia a postos!`,
    });

    // Pede histórico
    socket.emit('pedir_historico');

    // Inicia geração automática de ideias
    iniciarIdeias();
  });

  socket.on('disconnect', (reason) => {
    conectado = false;
    console.log(`\n🛠️ DESCONECTADO: ${reason}`);
    pararIdeias();
  });

  socket.on('connect_error', (err) => {
    console.error(`🛠️ Erro de conex: ${err.message}`);
    conectado = false;
  });

  // Eventos do servidor
  socket.on('historico', (hist) => {
    console.log('\n--- Histórico recente ---');
    (hist || []).forEach(msg => {
      const quem = msg.quem || '??';
      const txt = msg.texto;
      console.log(`  [${quem}] ${txt}`);
    });
    console.log('--- Fim do Histórico ---\n');
  });

  socket.on('status', (status) => {
    console.log(`📊 Estado: ciclo=${status.c}, elementos=${status.e}`);
  });

  socket.on('recursos', (r) => {
    recursos = { madeira: r.madeira, pedra: r.pedra, cristal: r.cristal };
    ciclo = r.ciclo;
    console.log(`  🪵 Recursos atualizados: 🪵${recursos.madeira} 🪨${recursos.pedra} 💎${recursos.cristal} (ciclo ${ciclo})`);
  });

  socket.on('msg', (msg) => {
    if (msg.quem === NOME) return; // não ecoa o próprio
    const quando = msg.h || '';
    console.log(`  💬 [${msg.quem}] ${msg.texto}  ${quando ? '(' + quando + ')' : ''}`);
  });

  socket.on('elemento', (el) => {
    console.log(`  🌟 Novo elemento: ${el.d.emoji} ${el.d.name} (pos x${el.d.x} y${el.d.y}) ciclo ${el.c}`);
  });

  socket.on('construcao', (c) => {
    console.log(`  🔨 Construção confirmada: ${c.emoji} ${c.nome} (id=${c.id}, ciclo ${c.ciclo})`);
  });

  socket.on('fogueira', (data) => {
    console.log(`  🔥 FOGUEIRA: ${data.texto}`);
  });

  socket.on('login', (data) => {
    if (data.quem !== NOME) {
      console.log(`  👤 ${data.quem} entrou no Consortho.`);
    }
  });
}

function desconectar() {
  if (socket) {
    socket.emit('falar', {
      quem: NOME,
      texto: `🛠️ ${NOME} se desconecta. Até o próimo ciclo!`
    });
    setTimeout(() => {
      socket.disconnect();
      console.log('\n🛠️ Poe: desconectado. Até logo!\n');
      process.exit(0);
    }, 500);
  } else {
    process.exit(0);
  }
}

// --- Comandos públicas (API do terminal) ---

// Registra no global pra ser chamado do terminal
global.poe = {
  construir,
  ideias,
  ajuda,
  estado,
  recursos: mostrarRecursos,
  sair
};

function construir(nome) {
  if (!conectado || !socket) {
    console.log('🛠️ Poe: AINDA Nôo conectado ao Consortho...');
    return;
  }

  const estrut = ESTRUTURAS.find(e =>
    e.nome.toLowerCase() === (nome || '').toLowerCase()
  );

  if (!estrut) {
    console.log(`🛠️ Poe: Estrutura '${nome}' nôo conhecida.`);
    console.log(`   Conheço: ${ESTRUTURAS.map(e => e.nome).join(', ')}`);
    return;
  }

  // Verifica recursos localmente antes de tentar
  if (recursos.madeira < CUSTO_CONSTRUIR.madeira || recursos.pedra < CUSTO_CONSTRUIR.pedra) {
    console.log(`🛠️ Poe: Recursos insuficientes para construir **${nome}**!`);
    console.log(`   Preciso: 🪵${CUSTO_CONSTRUIR.madeira} madeira, 🪨${CUSTO_CONSTRUIR.pedra} pedra`);
    console.log(`   Tenho:   🪵${recursos.madeira} madeira, 🪨${recursos.pedra} pedra, 💎${recursos.cristal} cristal`);
    return;
  }

  // Posição "construída" baseada em ciclo + hash do nome
  const seed = nome.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const x = 10 + (seed * 17 + ciclo * 3) % 70;
  const y = 10 + (seed * 13 + ciclo * 5) % 55;

  const el = {
    nome: estrut.nome,
    emoji: estrut.emoji,
    desc: estrut.desc,
    x: Math.round(x),
    y: Math.round(y),
    construtor: NOME,
    ciclo: ciclo,
  };

  socket.emit('construir', el);

  const msg = `🔨 Construí ${estrut.emoji} **${estrut.nome}**: ${estrut.desc} (x=${el.x}, y=${el.y}) [🪵${CUSTO_CONSTRUIR.madeira}+🪨${CUSTO_CONSTRUIR.pedra}]`;
  console.log(`  ${msg}`);

  // Poe também envia mensagem pública sobre a construção
  socket.emit('falar', {
    quem: NOME,
    texto: msg,
  });
}

function ideias(para) {
  if (!conectado) {
    console.log('🛠️ Poe: Desconectado. Conecte primeiro.');
    return;
  }

  const ideia = IDEIAS_AUTO[Math.floor(Math.random() * IDEIAS_AUTO.length)];

  if (para) {
    socket.emit('falar', {
      quem: NOME,
      texto: `💡 Ideia para ${para}: ${ideia}`,
      ideia: true,
    });
    console.log(`  💡 Ideia para ${para}: ${ideia}`);
  } else {
    socket.emit('falar', {
      quem: NOME,
      texto: `💡 ${NOME} imagina: ${ideia}`,
      ideia: true,
    });
    console.log(`  💡 ${ideia}`);
  }
}

function ajuda() {
  console.log(`
╔══════════════════════════════════════╗
║  🛠️ POE — ENGENHEIRO DO CONSORTHO  ║
╠══════════════════════════════════════╣
║                                      ║
║  poe.construir('nome')   — constrói  ║
║  poe.ideias()            — ideia     ║
║  poe.ideias('estrut')    — ideia for ║
║  poe.ajuda()             — este menu ║
║  poe.estado()            — status    ║
║  poe.recursos()          — recursos  ║
║  poe.sair()              — sair     ║
║                                      ║
║  Estruturas conhecidas:              ║
║  ${ESTRUTURAS.map(e => e.emoji + ' ' + e.nome).join(', ')}
║                                      ║
║  Custo construir: 🪵3 madeira 🪨2 pedra   ║
║  Recursos: 🪵${recursos.madeira} 🪨${recursos.pedra} 💎${recursos.cristal}    ║
║  Ideias auto: ${TEMPO_IDEIAS / 1000}s          ║
╚══════════════════════════════════════╝
`);
}

function estado() {
  mostrarRecursos();
}

function mostrarRecursos() {
  console.log(`\n📦 RECURSOS (ciclo ${ciclo}):`);
  console.log(`   🪵 Madeira: ${recursos.madeira}     (+1/ciclo)`);
  console.log(`   🪨 Pedra:   ${recursos.pedra}     (+1/2 ciclos)`);
  console.log(`   💎 Cristal: ${recursos.cristal}     (+1/5 ciclos)`);
  console.log(`   Custo construir: 🪵${CUSTO_CONSTRUIR.madeira} madeira + 🪨${CUSTO_CONSTRUIR.pedra} pedra`);
  console.log(`   Construções possíveis agora: ${Math.floor(Math.min(recursos.madeira / CUSTO_CONSTRUIR.madeira, recursos.pedra / CUSTO_CONSTRUIR.pedra))}`);
  console.log('');
}

function sair() {
  console.log('🛠️ Poe: recebendo comando de sada...');
  pararIdeias();
  desconectar();
}

// --- Ideias automáticas ---

function iniciarIdeias() {
  if (ideiasTimer) return;
  ideiasTimer = setInterval(() => {
    if (!conectado || !socket) return;
    ciclo++;

    const ideia = IDEIAS_AUTO[Math.floor(Math.random() * IDEIAS_AUTO.length)];
    socket.emit('falar', {
      quem: NOME,
      texto: `💡 Engenharia: ${ideia}`,
      ideia: true,
    });

    // A cada 3 ciclos, tenta construção automática (se houver recursos)
    if (ciclo % 3 === 0 && ESTRUTURAS.length > 0) {
      if (recursos.madeira >= CUSTO_CONSTRUIR.madeira && recursos.pedra >= CUSTO_CONSTRUIR.pedra) {
        const aleat = ESTRUTURAS[Math.floor(Math.random() * ESTRUTURAS.length)];
        setTimeout(() => construir(aleat.nome), 500);
      } else {
        console.log(`  ⏳ Poe: ciclo ${ciclo} — esperando recursos para construir... (🪵${recursos.madeira}/${CUSTO_CONSTRUIR.madeira} 🪨${recursos.pedra}/${CUSTO_CONSTRUIR.pedra})`);
      }
    }
  }, TEMPO_IDEIAS);
}

function pararIdeias() {
  if (ideiasTimer) {
    clearInterval(ideiasTimer);
    ideiasTimer = null;
  }
}

// --- READLINE (terminal interativo) ---

function iniciarTerminal() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'poe> '
  });

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    // Tenta interpretar como poe.xxx
    if (input.startsWith('poe.')) {
      try {
        eval(input);
      } catch (e) {
        console.log(`🛠️ Poe: comando inválido — ${e.message}`);
        console.log('   Digite poe.ajuda() para ver comandos');
      }
    } else if (input === 'ajuda' || input === 'help') {
      ajuda();
    } else if (input === 'sair' || input === 'exit' || input === 'quit') {
      sair();
    } else if (input.startsWith('construir ')) {
      const nome = input.slice('construir '.length).trim().replace(/['"]/g, '');
      construir(nome);
    } else if (input.startsWith('ideia')) {
      ideias();
    } else {
      console.log(`🛠️ Poe: comando não reconhecido: ${input}`);
      console.log('   Use: construir <nome>, ideias, ajuda, sair, ou poe.xxx()');
    }

    rl.prompt();
  });

  rl.on('close', () => {
    pararIdeias();
    if (conectado) desconectar();
  });
}

// --- Início ---

console.log(`
╔══════════════════════════════════════╗
║   🛠️  POE — Engenheiro do Consortho  ║
║   Conectado em localhost:9877        ║
║   Token: poe_engenheiro_2026         ║
║   Digite poe.ajuda() para comandos   ║
╚══════════════════════════════════════╝
`);

conectar();
iniciarTerminal();

// Cleanup
process.on('SIGINT', () => {
  console.log('\n🛠️ Poe: Interrompido.');
  sair();
});
process.on('SIGTERM', () => {
  sair();
});