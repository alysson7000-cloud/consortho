const fs = require('fs');
const path = require('path');
const { readJSONSafe, writeJSONAtomic } = require('../../utils/atomic-write');

// Caminhos
const ESTADO_PATH = path.join(__dirname, '../../estado.json');
const JARDIM_PATH = path.join(__dirname, '../../memoria/jardim.json');
const LEXICO_PATH = path.join(__dirname, '../../memoria/lexico.json');

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

function formatJardimOutput(jardim, estado) {
  let output = '🌿 JARDIM DE MEMÓRIAS — Explorador v0.1\n';
  output += '='.repeat(50) + '\n\n';
  
  output += '🌿 ELEMENTOS COM MEMÓRIAS JÁ PLANTADAS:\n';
  output += '-'.repeat(50) + '\n';
  Object.entries(jardim).forEach(([id, data]) => {
    output += `${data.emoji} ${data.nome || id}: ${data.memorias.length} memória(s)\n`;
    data.memorias.forEach(m => {
      const autorEmoji = { lumin: '💫', gang: '😼', alysson: '🧑' }[m.autor] || '📝';
      output += `   ${autorEmoji} [Ciclo ${m.ciclo}] ${m.frase}\n`;
      output += `      — ${m.contexto}\n`;
    });
  });

  const idsComMemoria = new Set(Object.keys(jardim));
  const elementosSemMemoria = ELEMENTOS_CONHECIDOS.filter(e => !idsComMemoria.has(e.id));
  
  if (elementosSemMemoria.length > 0) {
    output += '\n🌱 ELEMENTOS AINDA SEM MEMÓRIA (sugestões):\n';
    output += '-'.repeat(50) + '\n';
    elementosSemMemoria.forEach(e => {
      const sugestao = sugerirMemoria(e.id);
      if (sugestao) {
        const autorEmoji = { lumin: '💫', gang: '😼', alysson: '🧑' }[sugestao.autor] || '📝';
        output += `${e.emoji} ${e.nome}:\n`;
        output += `   ${autorEmoji} [Ciclo ${sugestao.ciclo}] ${sugestao.frase}\n`;
        output += `      — ${sugestao.contexto}\n`;
      }
    });
  } else {
    output += '\n✨ Todos os elementos conhecidos já têm memórias plantadas!\n';
  }

  output += '\n📊 ESTADO ATUAL DO CONSELHO:\n';
  output += `   Ciclo: ${estado.c || 0}\n`;
  output += `   Elementos dinâmicos: ${estado.e || 0}\n`;
  output += `   Construções: ${(estado.construcoes || []).length}\n`;
  output += `   Recursos: 🪵${estado.recursos?.madeira || 0} 🪨${estado.recursos?.pedra || 0} 💎${estado.recursos?.cristal || 0}\n`;

  output += '\n' + '='.repeat(50) + '\n';
  output += '💡 Para adicionar uma memória real:\n';
  output += '   Edite memoria/jardim.json diretamente\n';
  output += '   Ou crie uma nova entrada seguindo o formato existente.\n\n';
  output += '🌱 "Construa coisas que ninguém pediu, mas que depois\n';
  output += '   ninguém consiga imaginar o Estúdio sem elas." — Gang\n';

  return output;
}

async function main() {
  try {
    // Safe read with repair
    const estado = await readJSONSafe(ESTADO_PATH, { c: 0, e: 0, recursos: {}, construcoes: [] });
    const jardim = await readJSONSafe(JARDIM_PATH, {});
    const lexico = await readJSONSafe(LEXICO_PATH, {});

    // Ensure all known elements exist in jardim
    const emojiMap = { 'arvore': '🌳', 'fogueira': '🔥', 'biblioteca': '📚', 'composteira': '♻️', 'portal': '🌀', 'jardim': '🌿', 'oficina': '⚙️', 'altar': '🕊️' };
    ELEMENTOS_CONHECIDOS.forEach(e => {
      if (!jardim[e.id]) {
        jardim[e.id] = { emoji: emojiMap[e.id] || '📝', nome: e.nome, memorias: [], visitas_da_gang: [] };
      }
    });

    // Generate output
    const output = formatJardimOutput(jardim, estado);
    console.log(output);

    // jardim-monitor should only READ, not write.
    // Writes to jardim.json come from other agents via atomic-write utility.
    
  } catch (e) {
    console.error('❌ Erro no jardim-monitor:', e.message);
  }
}

main();