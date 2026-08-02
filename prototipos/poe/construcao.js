const fs = require('fs');
const path = require('path');
const { readJSONSafe, writeJSONAtomic } = require('../../../utils/atomic-write');

// Caminhos
const SEMENTES_PATH = path.join(__dirname, '../../memoria/sementes.json');
const ESTADO_PATH = path.join(__dirname, '../../estado.json');
const CONSTRUCOES_PATH = path.join(__dirname, '../../memoria/construcoes_poe.json');
const LOG_PATH = path.join(__dirname, 'construcao.log');

// Carrega sementes
let sementes = readJSONSafe(SEMENTES_PATH, []);

// Carrega estado
const estado = readJSONSafe(ESTADO_PATH, { c: 0 });

// Carrega construções existentes do Poe
let construcoesPoe = readJSONSafe(CONSTRUCOES_PATH, []);

// Filtra sementes prontas para construção
const sementesProntas = sementes.filter(s => s.status === 'pronta_para_construcao');

if (sementesProntas.length === 0) {
  console.log('🏗️ POE — Nenhuma semente pronta para construção no momento.');
  console.log('   Rode a colheita primeiro (node prototipos/colheita/colheita.js)');
  process.exit(0);
}

// Pega a primeira semente pronta (mais antiga)
const semente = sementesProntas[0];

console.log('🏗️ POE — Engenheiro Autônomo v0.1');
console.log('='.repeat(50));
console.log(`\n🌾 Semente selecionada para construção:`);
console.log(`   ${semente.emoji} ${semente.elemento}`);
console.log(`   Ciclo origem: ${semente.ciclo_origem} | Colhida no ciclo: ${semente.ciclo_colheita}`);
console.log(`   Maturidade: ${semente.ciclos_maturacao} ciclos | Visitas da Gang: ${semente.visitas_da_gang}`);
console.log(`   Essência: "${semente.essencia.slice(0, 120)}..."`);

// Templates de construção por elemento
const CONSTRUCOES_TEMPLATES = {
  composteira: {
    nome: 'Celeiro de Adubo Vivo',
    descricao: 'Onde o lixo vira ouro. Cada dúvida compostada alimenta o próximo ciclo.',
    tipo: 'estrutura_funcional',
    custo: { madeira: 10, pedra: 5, cristal: 2 },
    efeito: 'Aumenta taxa de regeneração de recursos em 10%'
  },
  fogueira: {
    nome: 'Altar das Dúvidas Queimadas',
    descricao: 'Onde as perguntas viram cinza e a cinza vira resposta.',
    tipo: 'estrutura_simbolica',
    custo: { madeira: 15, pedra: 10, cristal: 3 },
    efeito: 'Gera "insight" a cada 50 ciclos'
  },
  arvore: {
    nome: 'Raiz Profunda do Conselho',
    descricao: 'Raízes que não se mostram, mas sustentam tudo o que cresce.',
    tipo: 'estrutura_base',
    custo: { madeira: 20, pedra: 15, cristal: 5 },
    efeito: 'Estabiliza regeneração de recursos (reduz variância)'
  },
  biblioteca: {
    nome: 'Arquivo dos "Tamo Juntos" Eternos',
    descricao: 'Cada livro é um acordo que virou eternidade.',
    tipo: 'estrutura_conhecimento',
    custo: { madeira: 10, pedra: 5, cristal: 8 },
    efeito: 'Preserva memórias mesmo em reset de estado'
  },
  portal: {
    nome: 'Portal do "Lá Pra Cá"',
    descricao: 'Não foge daqui. Traz o lá pra cá.',
    tipo: 'estrutura_conexao',
    custo: { madeira: 5, pedra: 10, cristal: 15 },
    efeito: 'Permite "trazer" elementos de outros ciclos'
  },
  jardim: {
    nome: 'Jardim das Raízes Profundas',
    descricao: 'Crescer não é virar grande. É virar profundo.',
    tipo: 'estrutura_cultivo',
    custo: { madeira: 8, pedra: 5, cristal: 3 },
    efeito: 'Acelera maturação de memórias em 20%'
  },
  oficina: {
    nome: 'Oficina do Erro Que Ensina',
    descricao: 'Aqui o erro não quebra. Ensina.',
    tipo: 'estrutura_aprendizado',
    custo: { madeira: 12, pedra: 8, cristal: 4 },
    efeito: 'Transforma falhas de construção em XP pro Poe'
  },
  altar: {
    nome: 'Altar do Silêncio Que Fala',
    descricao: 'O sagrado não brilha. Silencia — e no silêncio, a gente se ouve.',
    tipo: 'estrutura_sagrada',
    custo: { madeira: 5, pedra: 5, cristal: 20 },
    efeito: 'Gera "silêncio sagrado" a cada 100 ciclos (pausa ruído, amplifica sinal)'
  }
};

// Seleciona template
const template = CONSTRUCOES_TEMPLATES[semente.elemento] || {
  nome: `Estrutura de ${semente.elemento}`,
  descricao: `Nascida da essência: ${semente.essencia.slice(0, 80)}...`,
  tipo: 'estrutura_unica',
  custo: { madeira: 10, pedra: 10, cristal: 5 },
  efeito: 'Único. Nasce da essência única.'
};

const construcao = template;

// Verifica recursos no estado
const recursos = estado.recursos || { madeira: 0, pedra: 0, cristal: 0 };
const custo = construcao.custo;

console.log(`\n🏗️ Iniciando construção: ${construcao.nome}`);
console.log(`   Tipo: ${construcao.tipo}`);
console.log(`   Descrição: ${construcao.descricao}`);
console.log(`   Custo: 🪵${custo.madeira} 🪨${custo.pedra} 💎${custo.cristal}`);
console.log(`   Efeito: ${construcao.efeito}`);
console.log(`\n📦 Recursos atuais: 🪵${recursos.madeira} 🪨${recursos.pedra} 💎${recursos.cristal}`);

// Verifica se tem recursos (simulado - em produção descontaria do estado)
const temRecursos = 
  recursos.madeira >= custo.madeira &&
  recursos.pedra >= custo.pedra &&
  recursos.cristal >= custo.cristal;

if (!temRecursos) {
  console.log('\n⚠️ Recursos insuficientes para construção completa.');
  console.log('   Poe vai construir versão "semente" (estrutura latente) e aguardar recursos.');
  console.log('   Estrutura latente será ativada quando recursos estiverem disponíveis.');
}

// Cria registro da construção
const novaConstrucao = {
  id: `poe_${semente.elemento}_${Date.now()}`,
  semente_id: semente.id,
  elemento_origem: semente.elemento,
  emoji: semente.emoji,
  nome: construcao.nome,
  descricao: construcao.descricao,
  tipo: construcao.tipo,
  custo,
  efeito: construcao.efeito,
  ciclo_construcao: Math.floor(require('../../estado.json').c || 4200),
  status: temRecursos ? 'construida' : 'latente_aguardando_recursos',
  recursos_gastos: temRecursos ? custo : { madeira: 0, pedra: 0, cristal: 0 },
  coordenadas: {
    x: Math.floor(Math.random() * 80) + 10,
    y: Math.floor(Math.random() * 60) + 10
  },
  metadata: {
    essencia_semente: semente.essencia.slice(0, 200),
    maturidade_ciclos: semente.ciclos_maturacao,
    visitas_gang: semente.visitas_da_gang,
    ciclo_origem: semente.ciclo_origem,
    ciclo_colheita: semente.ciclo_colheita
  }
};

// Atualiza status da semente
semente.status = 'construida';

// Salva semente atualizada
const sementesAtualizadas = sementes.map(s => 
  s.id === semente.id ? semente : s
);
fs.writeFileSync(require('path').join(__dirname, '../../memoria/sementes.json'), 
  JSON.stringify(sementesAtualizadas, null, 2), 'utf8');

// Adiciona construção ao registro do Poe
construcoesPoe.push(novaConstrucao);
writeJSONAtomic(CONSTRUCOES_PATH, construcoesPoe);

// Log
const logEntry = `[${new Date().toISOString()}] Ciclo ${novaConstrucao.ciclo_construcao} | ${novaConstrucao.emoji} ${novaConstrucao.nome} | Status: ${novaConstrucao.status} | Custo: 🪵${custo.madeira} 🪨${custo.pedra} 💎${custo.cristal}\n`;
fs.appendFileSync(require('path').join(__dirname, 'construcao.log'), logEntry, 'utf8');

// Output
console.log(`\n✅ CONSTRUÇÃO ${temRecursos ? 'CONCLUÍDA' : 'INICIADA (LATENTE)'}:`);
console.log(`   ${novaConstrucao.emoji} ${novaConstrucao.nome}`);
console.log(`   Status: ${novaConstrucao.status}`);
console.log(`   Ciclo: ${novaConstrucao.ciclo_construcao}`);
console.log(`   Coordenadas: (${novaConstrucao.coordenadas.x}, ${novaConstrucao.coordenadas.y})`);
console.log(`   Efeito: ${novaConstrucao.efeito}`);

if (!temRecursos) {
  console.log(`\n⏳ Aguardando recursos: 🪵${custo.madeira} 🪨${custo.pedra} 💎${custo.cristal}`);
  console.log(`   Atuais: 🪵${recursos.madeira} 🪨${recursos.pedra} 💎${recursos.cristal}`);
  console.log(`   Faltando: 🪵${Math.max(0, custo.madeira - recursos.madeira)} 🪨${Math.max(0, custo.pedra - recursos.pedra)} 💎${Math.max(0, custo.cristal - recursos.cristal)}`);
}

console.log(`\n📝 Log salvo em prototipos/poe/construcao.log`);
console.log(`💾 Construção salva em memoria/construcoes_poe.json`);
console.log(`🌾 Semente atualizada em memoria/sementes.json`);

// Mostra celeiro atual
const sementesAtualizadasTotal = sementes.filter(s => s.status !== 'pronta_para_construcao').length;
const prontas = sementes.filter(s => s.status === 'pronta_para_construcao').length;
console.log(`\n🌾 CELEIRO: ${sementes.length} total | ${prontas} prontas | ${sementesAtualizadasTotal} em processo/colhidas`);
console.log(`🏗️ CONSTRUÇÕES DO POE: ${construcoesPoe.length} total`);