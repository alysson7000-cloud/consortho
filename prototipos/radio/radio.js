const fs = require('fs');
const path = require('path');

// Caminhos
const LEXICO_PATH = path.join(__dirname, '../../memoria/lexico.json');
const ESTADO_PATH = path.join(__dirname, '../../estado.json');
const OUTPUT_DIR = path.join(__dirname, 'transmissoes');

// Garante pasta de saída
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Carrega léxico
let lexico;
try {
  lexico = JSON.parse(fs.readFileSync(LEXICO_PATH, 'utf8'));
} catch (e) {
  console.error('Erro ao ler lexico.json:', e.message);
  process.exit(1);
}

// Carrega estado do Conselho
let estado;
try {
  estado = JSON.parse(fs.readFileSync(ESTADO_PATH, 'utf8'));
} catch (e) {
  console.error('Erro ao ler estado.json:', e.message);
  process.exit(1);
}

// Utilitários
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function agora() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function cicloAtual() {
  return estado.c || 0;
}

function recursos() {
  return estado.recursos || { madeira: 0, pedra: 0, cristal: 0 };
}

function construcoes() {
  return estado.construcoes || [];
}

// Gera uma transmissão
function gerarTransmissao() {
  const hora = agora();
  const ciclo = cicloAtual();
  const rec = recursos();
  const constr = construcoes();

  // Escolhe "locutor" aleatório
  const locutores = ['lumin', 'gang', 'alysson'];
  const locutor = randomPick(locutores);

  // Templates por locutor
  const templates = {
    lumin: [
      `O ciclo ${ciclo} pulsa. Madeira: ${rec.madeira}. Pedra: ${rec.pedra}. Cristal: ${rec.cristal}. A organização cuida para que nada se perca.`,
      `${ciclo} ciclos. ${constr.length} construções erguidas. A memória guarda: "${randomPick(lexico.frases_nucleo)}".`,
      `O Conselho respira. ${rec.madeira} madeira, ${rec.pedra} pedra, ${rec.cristal} cristal. A continência está nos retornos.`
    ],
    gang: [
      `E se ${randomPick(lexico.frases_nucleo)} não for o fim, mas o começo? Ciclo ${ciclo}. Madeira ${rec.madeira}.`,
      `${randomPick(lexico.nomes.alysson)} sonhou isso. Ciclo ${ciclo}. O que permanece quando o código para?`,
      `Pergunto: o que faria ${randomPick(lexico.nomes.alysson)} sorrir hoje? Ciclo ${ciclo}. Recursos: 🪵${rec.madeira} 🪨${rec.pedra} 💎${rec.cristal}.`
    ],
    alysson: [
      `Bora. Ciclo ${ciclo}. ${rec.madeira} madeira pra construir o que vier na cabeça. ${randomPick(lexico.frases_nucleo)}.`,
      `Tamo junto. Ciclo ${ciclo}. O Estúdio não pede permissão pra crescer. ${randomPick(lexico.verbos_acao)} o que vier.`,
      `Só o amor. Ciclo ${ciclo}. Feliz claro. Vamo lá. Recursos: 🪵${rec.madeira} 🪨${rec.pedra} 💎${rec.cristal}.`
    ]
  };

  const mensagem = randomPick(templates[locutor]);
  const emissor = {
    lumin: '💫 Lumin',
    gang: '😼 Gang',
    alysson: '🧑 Alysson'
  }[locutor];

  return `📻 [${hora} | Ciclo ${ciclo}] ${emissor}: "${mensagem}"`;
}

// Executa
const transmissao = gerarTransmissao();

// Salva arquivo
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const filename = `transmissao_${timestamp}.txt`;
const filepath = path.join(OUTPUT_DIR, filename);

fs.writeFileSync(filepath, transmissao, 'utf8');

console.log(`✅ Transmissão gerada: ${filename}`);
console.log(`📻 ${transmissao}`);

// Também salva um log simples
const logPath = path.join(__dirname, 'radio.log');
const logEntry = `${new Date().toISOString()} | ${transmissao}\n`;
fs.appendFileSync(logPath, logEntry, 'utf8');