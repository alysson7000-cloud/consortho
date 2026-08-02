const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');

const SOCKET_URL = 'http://localhost:9877';
const ESTADO_PATH = path.join(__dirname, '..', '..', 'estado.json');
const JARDIM_PATH = path.join(__dirname, '..', '..', 'memoria', 'jardim.json');
const SEMENTES_PATH = path.join(__dirname, '..', '..', 'memoria', 'sementes.json');
const CONSTRUCOES_PATH = path.join(__dirname, '..', '..', 'memoria', 'construcoes_poe.json');

const socket = io(SOCKET_URL);

let ultimoEstado = { c: 0, construcoes: 0, sementesProntas: 0 };
let ultimaVisitaGang = { total: 0 };

function lerEstado() {
  try { return JSON.parse(fs.readFileSync(ESTADO_PATH, 'utf8')); }
  catch { return { c: 0, e: 1, recursos: { madeira: 0, pedra: 0, cristal: 0 } }; }
}

function lerJardim() {
  try { return JSON.parse(fs.readFileSync(JARDIM_PATH, 'utf8')); }
  catch { return { elementos: {} }; }
}

function lerSementes() {
  try { return JSON.parse(fs.readFileSync(SEMENTES_PATH, 'utf8')); }
  catch { return { sementes: [] }; }
}

function lerConstrucoesPoe() {
  try { return JSON.parse(fs.readFileSync(CONSTRUCOES_PATH, 'utf8')); }
  catch { return { construcoes: [] }; }
}

function notificar(texto) {
  socket.emit('chat:falar', { canal: 'publico', texto: `[🔔] ${texto}` });
  console.log('[notificador]', texto);
}

function checarMudancas() {
  const estado = lerEstado();
  const jardim = lerJardim();
  const sementes = lerSementes();
  const construcoesPoe = lerConstrucoesPoe();

  // Ciclo avançou
  if (estado.c > ultimoEstado.c) {
    notificar(`Ciclo ${estado.c} iniciado. Recursos: 🪵${estado.recursos?.madeira||0} 🪨${estado.recursos?.pedra||0} 💎${estado.recursos?.cristal||0}`);
    ultimoEstado.c = estado.c;
  }

  // Nova construção do Poe
  const totalConstrucoes = (construcoesPoe.construcoes?.length || 0);
  if (totalConstrucoes > ultimoEstado.construcoes) {
    const nova = construcoesPoe.construcoes[totalConstrucoes - 1];
    notificar(`🔨 Poe ergueu **${nova.nome}** (ciclo ${nova.ciclo}): ${nova.desc || ''}`);
    ultimoEstado.construcoes = totalConstrucoes;
  }

  // Sementes prontas
  const prontas = sementes.sementes?.filter(s => s.pronta).length || 0;
  if (prontas > ultimoEstado.sementesProntas) {
    notificar(`🌱 ${prontas} semente(s) pronta(s) para colheita!`);
    ultimoEstado.sementesProntas = prontas;
  }

  // Nova visita da Gang
  let totalVisitas = 0;
  for (const el of Object.values(jardim.elementos || {})) {
    totalVisitas += (el.visitas?.length || 0);
  }
  if (totalVisitas > ultimaVisitaGang.total) {
    notificar(`😼 Gang visitou o Jardim. Total de visitas: ${totalVisitas}`);
    ultimaVisitaGang.total = totalVisitas;
  }

  // Recursos marco (cada 1000 madeira)
  const madeira = estado.recursos?.madeira || 0;
  if (Math.floor(madeira / 1000) > Math.floor((ultimoEstado.madeira || 0) / 1000)) {
    notificar(`🪵 Madeira passou de ${Math.floor(madeira/1000)*1000}! Total: ${madeira}`);
  }
  ultimoEstado.madeira = madeira;
}

socket.on('connect', () => {
  socket.emit('login:gang', { token: 'gang-token-consortho' });
  console.log('[notificador] conectado como Gang');
  // Inicializa baselines
  const estado = lerEstado();
  const jardim = lerJardim();
  const sementes = lerSementes();
  const construcoesPoe = lerConstrucoesPoe();
  ultimoEstado.c = estado.c || 0;
  ultimoEstado.construcoes = construcoesPoe.construcoes?.length || 0;
  ultimoEstado.sementesProntas = sementes.sementes?.filter(s => s.pronta).length || 0;
  let totalVisitas = 0;
  for (const el of Object.values(jardim.elementos || {})) {
    totalVisitas += (el.visitas?.length || 0);
  }
  ultimaVisitaGang.total = totalVisitas;
  ultimoEstado.madeira = estado.recursos?.madeira || 0;
  console.log('[notificador] baselines inicializados');
});

socket.on('disconnect', () => {
  console.log('[notificador] desconectado');
  setTimeout(() => process.exit(1), 5000);
});

// Checa a cada 10 segundos
setInterval(checarMudancas, 10000);

console.log('[notificador] iniciado — monitora ciclo, construções, sementes, visitas da Gang, recursos');