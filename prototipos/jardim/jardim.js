const fs = require('fs');
const path = require('path');

// Caminhos
const ESTADO_PATH = path.join(__dirname, '../../estado.json');
const JARDIM_PATH = path.join(__dirname, '../../memoria/jardim.json');
const LEXICO_PATH = path.join(__dirname, '../../memoria/lexico.json');

// Carrega estado do Conselho
let estado;
try {
  estado = JSON.parse(fs.readFileSync(ESTADO_PATH, 'utf8'));
} catch (e) {
  console.error('Erro ao ler estado.json:', e.message);
  process.exit(1);
}

// Carrega jardim de memórias
let jardim;
try {
  jardim = JSON.parse(fs.readFileSync(JARDIM_PATH, 'utf8'));
} catch (e) {
  console.error('Erro ao ler jardim.json:', e.message);
  process.exit(1);
}

// Carrega léxico
let lexico;
try {
  lexico = JSON.parse(fs.readFileSync(LEXICO_PATH, 'utf8'));
} catch (e) {
  console.error('Erro ao ler lexico.json:', e.message);
  process.exit(1);
}

// Elementos conhecidos do Conselho (do server.js)
const ELEMENTOS_CONHECIDOS = [
  { id: 'arvore', emoji: '🌳', nome: 'Árvore' },
  { id: 'fogueira', emoji: '🔥', nome: 'Fogueira' },
  { id: 'biblioteca', emoji: '📚', nome: 'Biblioteca' },
  { id: 'composteira', emoji: '♻️', nome: 'Composteira' },
  { id: 'portal', emoji: '🌀', nome: 'Portal' },
  { id: 'jardim', emoji: '🌿', nome: 'Jardim' },
  { id: 'oficina', emoji: '⚙️', nome: 'Oficina' },
  { id: 'altar', emoji: '🕊️', nome: 'Altar' }
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sugerirMemoria(elementoId) {
  const elemento = ELEMENTOS_CONHECIDOS.find(e => e.id === elementoId);
  if (!elemento) return null;

  // Usa léxico + ciclo atual para gerar sugestão contextual
  const ciclo = 3950 + Math.floor(Math.random() * 100);
  const autor = randomPick(['lumin', 'gang', 'alysson']);
  
  const templates = {
    lumin: [
      `${elemento.nome} não nasce de pressa. Nasce de presença.`,
      `A organização vê: ${elemento.nome.toLowerCase()} é onde o tempo para pra respirar.`,
      `Registrar: ${elemento.nome.toLowerCase()} guarda o que o ciclo não apaga.`
    ],
    gang: [
      `E se ${elemento.nome.toLowerCase()} não for lugar, mas pergunta?`,
      `O que ${elemento.nome.toLowerCase()} protege que a gente ainda não nomeou?`,
      `${elemento.nome} é o vazio que a gente preenche com sentido.`
    ],
    alysson: [
      `Bora. ${elemento.nome} é onde a gente bota a mão na massa e o coração na obra.`,
      `Aqui não tem erro. Tem caminho. ${elemento.nome} é um deles.`,
      `Só o amor. ${elemento.nome} é prova.`
    ]
  };

  const frase = randomPick(templates[autor]);
  const contexto = `Sugestão automática baseada no léxico do Estúdio (ciclo ~${ciclo})`;

  return {
    ciclo,
    autor,
    frase,
    contexto
  };
}

function main() {
  console.log('🌿 JARDIM DE MEMÓRIAS — Explorador v0.1');
  console.log('='.repeat(50));

  // 1. Mostra elementos COM memórias
  console.log('\n🌿 ELEMENTOS COM MEMÓRIAS JÁ PLANTADAS:');
  console.log('-'.repeat(50));
  Object.entries(jardim).forEach(([id, data]) => {
    console.log(`${data.emoji} ${data.nome || id}: ${data.memorias.length} memória(s)`);
    data.memorias.forEach(m => {
      const autorEmoji = { lumin: '💫', gang: '😼', alysson: '🧑' }[m.autor] || '📝';
      console.log(`   ${autorEmoji} [Ciclo ${m.ciclo}] ${m.frase}`);
      console.log(`      — ${m.contexto}`);
    });
  });

  // 2. Identifica elementos SEM memórias
  const idsComMemoria = new Set(Object.keys(jardim));
  const elementosSemMemoria = ELEMENTOS_CONHECIDOS.filter(e => !idsComMemoria.has(e.id));

  if (elementosSemMemoria.length > 0) {
    console.log('\n🌱 ELEMENTOS AINDA SEM MEMÓRIA (sugestões):');
    console.log('-'.repeat(50));
    elementosSemMemoria.forEach(e => {
      const sugestao = sugerirMemoria(e.id);
      if (sugestao) {
        const autorEmoji = { lumin: '💫', gang: '😼', alysson: '🧑' }[sugestao.autor] || '📝';
        console.log(`${e.emoji} ${e.nome}:`);
        console.log(`   ${autorEmoji} [Ciclo ${sugestao.ciclo}] ${sugestao.frase}`);
        console.log(`      — ${sugestao.contexto}`);
      }
    });
  } else {
    console.log('\n✨ Todos os elementos conhecidos já têm memórias plantadas!');
  }

  // 3. Mostra elementos do estado.json (dinâmicos)
  const elementosEstado = estado.e ? Array.from({ length: estado.e }, (_, i) => i + 1) : [];
  console.log(`\n📊 ESTADO ATUAL DO CONSELHO:`);
  console.log(`   Ciclo: ${estado.c || 0}`);
  console.log(`   Elementos dinâmicos: ${estado.e || 0}`);
  console.log(`   Construções: ${(estado.construcoes || []).length}`);
  console.log(`   Recursos: 🪵${estado.recursos?.madeira || 0} 🪨${estado.recursos?.pedra || 0} 💎${estado.recursos?.cristal || 0}`);

  // 4. Opção interativa simples (se quiser adicionar memória)
  console.log('\n' + '='.repeat(50));
  console.log('💡 Para adicionar uma memória real:');
  console.log('   Edite memoria/jardim.json diretamente');
  console.log('   Ou crie uma nova entrada seguindo o formato existente.');
  console.log('\n🌱 "Construa coisas que ninguém pediu, mas que depois');
  console.log('   ninguém consiga imaginar o Estúdio sem elas." — Gang');
}

main();