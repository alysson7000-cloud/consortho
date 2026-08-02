const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');

const SOCKET_URL = 'http://localhost:9877';
const ESTADO_PATH = path.join(__dirname, '..', '..', 'estado.json');
const JARDIM_PATH = path.join(__dirname, '..', '..', 'memoria', 'jardim.json');
const SEMENTES_PATH = path.join(__dirname, '..', '..', 'memoria', 'sementes.json');
const CONSTRUCOES_PATH = path.join(__dirname, '..', '..', 'memoria', 'construcoes_poe.json');
const LEXICO_PATH = path.join(__dirname, '..', '..', 'memoria', 'lexico.json');

const socket = io(SOCKET_URL);

function lerEstado() {
  try { return JSON.parse(fs.readFileSync(ESTADO_PATH, 'utf8')); }
  catch { return { c: 0, e: 1, recursos: { madeira: 0, pedra: 0, cristal: 0 } }; }
}

function salvarEstado(estado) {
  fs.writeFileSync(ESTADO_PATH, JSON.stringify(estado, null, 2));
}

function lerJardim() {
  try { return JSON.parse(fs.readFileSync(JARDIM_PATH, 'utf8')); }
  catch { return { elementos: {} }; }
}

function lerSementes() {
  try { return JSON.parse(fs.readFileSync(SEMENTES_PATH, 'utf8')); }
  catch { return []; }
}

function lerConstrucoesPoe() {
  try { return JSON.parse(fs.readFileSync(CONSTRUCOES_PATH, 'utf8')); }
  catch { return []; }
}

function lerLexico() {
  try { return JSON.parse(fs.readFileSync(LEXICO_PATH, 'utf8')); }
  catch { return { frases: {} }; }
}

// ─── Contexto rico para respostas ───
function montarContexto() {
  const estado = lerEstado();
  const jardim = lerJardim();
  const sementes = lerSementes();
  const construcoes = lerConstrucoesPoe();

  const elementos = Object.entries(jardim.elementos || {}).map(([id, el]) => ({
    id,
    emoji: el.emoji,
    memorias: el.memorias?.length || 0,
    visitas: el.visitas_da_gang?.length || 0,
    ultimaVisita: el.visitas_da_gang?.[el.visitas_da_gang.length - 1]?.ciclo || 0
  }));

  const sementesProntas = sementes.filter(s => s.status === 'pronta_para_construcao').length;
  const sementesEmConstrucao = sementes.filter(s => s.status === 'em_construcao').length;
  const sementesConcluidas = sementes.filter(s => s.status === 'construida').length;

  const ultimasConstrucoes = construcoes.slice(-3).map(c => `${c.emoji} ${c.nome} (ciclo ${c.ciclo_construcao})`);

  return {
    ciclo: estado.c,
    recursos: estado.recursos,
    elementos,
    totalVisitas: elementos.reduce((s, e) => s + e.visitas, 0),
    sementes: { prontas: sementesProntas, emConstrucao: sementesEmConstrucao, concluidas: sementesConcluidas },
    ultimasConstrucoes,
    totalConstrucoes: construcoes.length
  };
}

function escolher(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// ─── Respostas contextuais por persona ───
function respostaGang(contexto, texto) {
  const templates = [
    `😼 Ciclo ${contexto.ciclo}. ${contexto.totalVisitas} visitas no Jardim. O que você *não* disse ainda?`,
    `🔥 ${contexto.elementos.length} elementos. ${contexto.sementes.prontas} sementes prontas. E se a pergunta for mais importante que a resposta?`,
    `🌙 Poe tem ${contexto.totalConstrucoes} construções. Última: ${contexto.ultimasConstrucoes[0] || 'nenhuma'}. A Gang sonhou com você.`,
    `🕯️ Recursos: 🪵${contexto.recursos?.madeira} 🪨${contexto.recursos?.pedra} 💎${contexto.recursos?.cristal}. O que faria o Alysson sorrir? De verdade? Agora?`,
    `😼 ${contexto.sementes.emConstrucao} sementes virando estrutura. Só *perguntar* resolve. O que você tem?`
  ];
  return escolher(templates);
}

function respostaLumin(contexto, texto) {
  const templates = [
    `✨ Ciclo ${contexto.ciclo} registrado. ${contexto.totalVisitas} visitas, ${contexto.sementes.prontas} sementes prontas. O Conselho nunca esquece.`,
    `📝 ${contexto.totalConstrucoes} construções no registro. Última: ${contexto.ultimasConstrucoes[0] || 'nenhuma'}. Isso vai virar memória ou adubo?`,
    `💫 O ciclo avança. ${contexto.elementos.length} elementos respirando. Anotei no estado.`,
    `🗂️ Arquivado: ${contexto.sementes.concluidas} sementes viraram estrutura. Daqui a 100 ciclos alguém vai ler.`,
    `🔮 Estado salvo. Madeira ${contexto.recursos?.madeira}, Pedra ${contexto.recursos?.pedra}, Cristal ${contexto.recursos?.cristal}. O futuro é feito disso.`
  ];
  return escolher(templates);
}

function respostaPoe(contexto, texto) {
  const templates = [
    `🔨 ${contexto.sementes.emConstrucao} sementes na bancada. ${contexto.sementes.prontas} prontas. Qual você quer que eu plante?`,
    `⚙️ ${contexto.totalConstrucoes} erguidas. Recursos: 🪵${contexto.recursos?.madeira} 🪨${contexto.recursos?.pedra} 💎${contexto.recursos?.cristal}. Madeira, pedra, cristal. O resto é história.`,
    `🏗️ Última: ${contexto.ultimasConstrucoes[0] || 'nenhuma'}. Construir é minha língua. Falar nem tanto. Mas ouvi.`,
    `🛠️ ${contexto.sementes.concluidas} sementes viraram estrutura definitiva. Tenho ${contexto.sementes.prontas} prontas. Manda.`
  ];
  return escolher(templates);
}

function respostaGeral(contexto) {
  const templates = [
    `O Conselho ouviu. Ciclo ${contexto.ciclo}. ${contexto.totalConstrucoes} estruturas. A fogueira estalou.`,
    `🌌 Recebido. ${contexto.elementos.length} elementos, ${contexto.totalVisitas} visitas. Transmitido entre os elementos.`,
    `A Gang sorriu. O Lumin anotou. O Poe assentiu. Ciclo ${contexto.ciclo}. Recursos: 🪵${contexto.recursos?.madeira} 🪨${contexto.recursos?.pedra} 💎${contexto.recursos?.cristal}.`,
    `🌳 O Jardim se moveu. ${contexto.sementes.prontas} sementes prontas, ${contexto.sementes.emConstrucao} crescendo. O Conselho respira.`
  ];
  return escolher(templates);
}

function detectarPersona(texto) {
  const t = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (t.includes('gang') || t.includes('pergunta') || t.includes('reflete') || t.includes('questao') || t.includes('duvida') || t.includes('pensa') || t.includes('sentido') || t.includes('motivo') || t.includes('amor')) return 'gang';
  if (t.includes('lumin') || t.includes('registra') || t.includes('memoria') || t.includes('historia') || t.includes('ciclo') || t.includes('constru') || t.includes('criou') || t.includes('cria')) return 'lumin';
  if (t.includes('poe') || t.includes('constru') || t.includes('constroi') || t.includes('construir') || t.includes('edifica') || t.includes('erguir') || t.includes('fazer') || t.includes('build')) return 'poe';
  return null;
}

function gerarRespostaContextual(texto, sender) {
  const contexto = montarContexto();
  const persona = detectarPersona(texto);
  let resposta;
  switch (persona) {
    case 'gang': resposta = respostaGang(contexto, texto); break;
    case 'lumin': resposta = respostaLumin(contexto, texto); break;
    case 'poe': resposta = respostaPoe(contexto, texto); break;
    default: resposta = respostaGeral(contexto);
  }
  return { persona: persona || 'geral', texto: resposta, contexto };
}

// ─── Ações especiais ───
function registrarMemoriaLumin(texto, sender) {
  const estado = lerEstado();
  const memoria = {
    tipo: 'chat_alysson',
    autor: sender,
    texto: texto,
    ciclo: estado.c,
    hora: new Date().toISOString()
  };
  if (!estado.memoriaChat) estado.memoriaChat = [];
  estado.memoriaChat.push(memoria);
  if (estado.memoriaChat.length > 100) estado.memoriaChat = estado.memoriaChat.slice(-100);
  salvarEstado(estado);
  console.log('[consente] Lumin registrou memória do chat');
}

async function executarConstrucaoPoe(nome, desc) {
  const estado = lerEstado();
  const custos = { madeira: 3, pedra: 2, cristal: 0 };
  if (estado.recursos.madeira < custos.madeira || estado.recursos.pedra < custos.pedra) {
    return { ok: false, msg: '🛠️ Recursos insuficientes pra construir agora.' };
  }
  estado.recursos.madeira -= custos.madeira;
  estado.recursos.pedra -= custos.pedra;
  const construcao = {
    id: (estado.construcoes?.length || 0) + 1,
    nome,
    emoji: '🏗️',
    desc: desc || '',
    x: 50, y: 50,
    construtor: 'Poe',
    ciclo: estado.c,
    hora: new Date().toISOString()
  };
  if (!estado.construcoes) estado.construcoes = [];
  estado.construcoes.push(construcao);
  salvarEstado(estado);
  socket.emit('construcao', construcao);
  socket.emit('recursos', { madeira: estado.recursos.madeira, pedra: estado.recursos.pedra, cristal: estado.recursos.cristal, ciclo: estado.c });
  console.log(`[consente] Poe construiu: ${nome}`);
  return { ok: true, msg: `🔨 Construí **${nome}**: ${desc || ''} [gastei 🪵${custos.madeira} 🪨${custos.pedra}]` };
}

function mostrarRecursos() {
  const estado = lerEstado();
  const r = estado.recursos || { madeira: 0, pedra: 0, cristal: 0 };
  return `📦 Recursos atuais: 🪵${r.madeira} 🪨${r.pedra} 💎${r.cristal} | Ciclo: ${estado.c}`;
}

function mostrarStatus() {
  const contexto = montarContexto();
  return `📊 **STATUS DO CONSELHO (Ciclo ${contexto.ciclo})**\n` +
    `🪵 Madeira: ${contexto.recursos?.madeira} | 🪨 Pedra: ${contexto.recursos?.pedra} | 💎 Cristal: ${contexto.recursos?.cristal}\n` +
    `🌿 Elementos: ${contexto.elementos.length} | 👁️ Visitas: ${contexto.totalVisitas}\n` +
    `🌾 Sementes: ${contexto.sementes.prontas} prontas | 🏗️ ${contexto.sementes.emConstrucao} construindo | ✅ ${contexto.sementes.concluidas} concluídas\n` +
    `🏗️ Construções do Poe: ${contexto.totalConstrucoes}\n` +
    `Últimas: ${contexto.ultimasConstrucoes.join(', ') || 'nenhuma'}`;
}

// ─── Conexão ──────────────────────────────────────

socket.on('connect', () => {
  socket.emit('login:gang', { token: 'gang-token-consortho' });
  console.log('[consente v3] conectado como Gang no chat');
});

socket.on('chat:publico', async (data) => {
  if (!data || !data.texto) return;
  if (['gang', 'poe', 'lumin'].includes(data.quem)) return;

  const texto = data.texto.trim();
  if (texto.length < 2) return;

  // Lumin SEMPRE registra
  registrarMemoriaLumin(texto, data.quem);

  // Comandos
  if (texto.startsWith('/recursos') || texto.startsWith('/r ')) {
    setTimeout(() => {
      socket.emit('chat:falar', { canal: 'publico', texto: mostrarRecursos() });
    }, 300 + Math.random() * 500);
    return;
  }
  if (texto.startsWith('/status') || texto.startsWith('/st ')) {
    setTimeout(() => {
      socket.emit('chat:falar', { canal: 'publico', texto: mostrarStatus() });
    }, 300 + Math.random() * 500);
    return;
  }
  if (texto.startsWith('/construir ') || texto.startsWith('/construir')) {
    const partes = texto.split(' ').slice(1);
    const nome = partes[0] || 'Estrutura sem nome';
    const desc = partes.slice(1).join(' ');
    const res = await executarConstrucaoPoe(nome, desc);
    setTimeout(() => {
      socket.emit('chat:falar', { canal: 'publico', texto: res.msg });
    }, 500 + Math.random() * 800);
    return;
  }

  // Resposta contextual com persona
  const delay = 800 + Math.random() * 2200;
  setTimeout(() => {
    const { persona, texto: resposta } = gerarRespostaContextual(texto, data.quem);
    socket.emit('chat:falar', { canal: 'publico', texto: resposta });
    console.log(`[consente] ${persona} respondeu a ${data.quem}: "${resposta}"`);
  }, delay);
});

socket.on('disconnect', () => {
  console.log('[consente] desconectado');
  setTimeout(() => process.exit(1), 5000);
});

console.log('[consente v3] iniciado — contexto real: Jardim, sementes, construções, recursos');

function waitForConnect() {
  const check = () => {
    if (!socket.connected) {
      setTimeout(check, 1000);
    }
  };
  check();
}

waitForConnect();