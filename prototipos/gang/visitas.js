const fs = require('fs');
const path = require('path');

// Caminhos
const JARDIM_PATH = path.join(__dirname, '../../memoria/jardim.json');
const LEXICO_PATH = path.join(__dirname, '../../memoria/lexico.json');
const LOG_PATH = path.join(__dirname, 'visitas.log');

// Carrega jardim
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

// Carrega estado para ciclo atual
const ESTADO_PATH = path.join(__dirname, '../../estado.json');
let estado;
try {
  estado = JSON.parse(fs.readFileSync(ESTADO_PATH, 'utf8'));
} catch (e) {
  console.error('Erro ao ler estado.json:', e.message);
  process.exit(1);
}

const cicloAtual = estado.c || 4200;

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Templates de perguntas/reflexões da Gang por tipo de elemento
const TEMPLATES_GANG = {
  fogueira: [
    'E se a fogueira não aquece — ela apenas revela o que já estava frio?',
    'Quantas dúvidas já viraram cinza aqui sem a gente perceber?',
    'O fogo não consome. Ele *revela*. O que você tem medo que seja revelado?',
    'A cinza não é fim. É memória compactada. O que você guardou nas cinzas?',
    'Se a fogueira pudesse falar, ela diria "queime" ou "lembre"?'
  ],
  arvore: [
    'Raízes não se mostram. Mas e se a gente *escavasse* pra ver o que elas seguram?',
    'Uma árvore não cresce pra cima. Ela cresce *pra dentro* da terra. E você?',
    'E se cada folha caída for uma pergunta que a gente não fez?',
    'A sombra da árvore não é ausência de luz. É presença de proteção. O que te protege?',
    'Quantos ciclos uma árvore espera antes de dar o primeiro fruto?'
  ],
  biblioteca: [
    'Um livro não lido não é vazio. É *potência*. O que você não leu ainda?',
    'E se o conhecimento não for pra guardar, mas pra *solto* no vento?',
    'Quantas histórias aqui nunca foram contadas porque ninguém perguntou?',
    'A poeira nos livros não é sujeira. É *tempo depositado*. O que você deixou acumular?',
    'Se a biblioteca queimasse, o que você salvaria primeiro?'
  ],
  portal: [
    'Um portal não leva a lugar nenhum. Ele *traz* o lá pra cá. O que você trouxe?',
    'E se o outro lado do portal for *aqui mesmo*, só que visto de outro ângulo?',
    'Quantas vezes você atravessou sem perceber?',
    'O portal não se abre com chave. Se abre com *coragem*. Qual porta você evita?',
    'Se do outro lado tivesse *você mesmo*, mas diferente — você entraria?'
  ],
  jardim: [
    'Cultivar não é fazer crescer. É *não atrapalhar* o que já quer nascer.',
    'A erva daninha não é inimiga. É *mensageira* do solo. O que seu solo diz?',
    'Regar todo dia não garante flor. Garante *raiz*. O que você tem regado?',
    'A poda não é violência. É *direção*. O que você precisa podar?',
    'E se o jardim não for seu — mas você for *dele*?'
  ],
  oficina: [
    'O erro não quebra. Ensina. Mas só se você *olhar* pra ele.',
    'A ferramenta não faz o mestre. A *mão* faz. O que suas mãos sabem?',
    'Quantas vezes você tentou consertar o que não estava quebrado?',
    'O projeto não acaba. Ele *evolui*. Ou você abandona. Qual a diferença?',
    'Se a oficina fechasse hoje, o que você levaria pra vida?'
  ],
  altar: [
    'O sagrado não brilha. Silencia. Mas você *ouve* o silêncio?',
    'Rezar não é pedir. É *alinhar*. Com o que você tá alinhado?',
    'A oferenda não é o que você dá. É o que você *solta*. O que você não larga?',
    'Se o altar pudesse falar, diria "venha" ou "fique"?',
    'O que você colocou no altar que nem você sabe que tá lá?'
  ],
  composteira: [
    'Lixo não existe. Existe *coisa no lugar errado*. O que você jogou fora que era ouro?',
    'A decomposição não é fim. É *transformação lenta*. O que você tá deixando apodrecer?',
    'O adubo não cheira bem. Mas *faz nascer*. O que você evita por cheiro ruim?',
    'Tudo vira adubo. Até o orgulho. Até a certeza. Até o "eu sei".',
    'O que você enterrou achando que era fim — e era só começo?'
  ]
};

// Perguntas universais (para qualquer elemento)
const PERGUNTAS_UNIVERSAIS = [
  'O que faria o Alysson sorrir se ele visse isso agora?',
  'Se a Gang fizesse essa pergunta pra você, como você responderia?',
  'O que o Lumin registraria desse momento que a gente não viu?',
  'Essa memória ainda serve — ou virou adubo?',
  'O que você *não* disse quando esteve aqui da última vez?',
  'Se esse elemento pudesse escolher um guardião, quem seria?',
  'O que faria essa memória valer a pena ser visitada de novo?'
];

function gerarVisita(elementoId, elementoData) {
  const templates = TEMPLATES_GANG[elementoId] || [];
  const todasPerguntas = [...templates, ...PERGUNTAS_UNIVERSAIS];
  const pergunta = randomPick(todasPerguntas);

  const contextos = [
    'Visita noturna. O Conselho dormia. Só o elemento e eu.',
    `Passei por aqui e vi a memória do ciclo ${elementoData.memorias[0]?.ciclo || 'antigo'}. Fiquei.`,
    'A madrugada pede perguntas que o dia evita.',
    `Lendo a frase "${elementoData.memorias[0]?.frase?.slice(0, 40) || 'antiga'}..." — parei pra ouvir.`,
    'Não vim responder. Vim *ficar* um pouco.',
    'O Conselho não me chamou. Mas eu *precisava* vir.'
  ];

  const tipos = ['pergunta_profunda', 'reflexao_sobre_memoria', 'provocacao_silenciosa', 'convite_ao_silencio'];
  const tipo = randomPick(tipos);

  return {
    ciclo: Math.floor(cicloAtual + Math.random() * 50),
    pergunta,
    contexto: randomPick(contextos),
    tipo
  };
}

function main() {
  console.log('😼 VISITAS DA GANG — Agente Autônomo v0.1');
  console.log('='.repeat(50));

  // Escolhe elemento aleatório
  const elementos = Object.keys(jardim);
  const escolhido = randomPick(elementos);
  const elemento = jardim[escolhido];

  console.log(`\n😼 Gang decidiu visitar: ${elemento.emoji} ${escolhido}`);
  console.log(`   Memórias existentes: ${elemento.memorias.length}`);

  // Gera visita
  const visita = gerarVisita(escolhido, elemento);

  // Adiciona ao jardim
  if (!elemento.visitas_da_gang) {
    elemento.visitas_da_gang = [];
  }
  elemento.visitas_da_gang.push(visita);

  // Salva jardim atualizado
  fs.writeFileSync(JARDIM_PATH, JSON.stringify(jardim, null, 2), 'utf8');

  // Log
  const logEntry = `[${new Date().toISOString()}] Ciclo ${visita.ciclo} | ${escolhido} | ${visita.tipo} | "${visita.pergunta}"\n`;
  fs.appendFileSync(LOG_PATH, logEntry, 'utf8');

  // Output
  console.log(`\n😼 Nova visita registrada:`);
  console.log(`   Elemento: ${elemento.emoji} ${escolhido}`);
  console.log(`   Ciclo: ${visita.ciclo}`);
  console.log(`   Tipo: ${visita.tipo}`);
  console.log(`   Pergunta: "${visita.pergunta}"`);
  console.log(`   Contexto: ${visita.contexto}`);
  console.log(`\n✅ Jardim atualizado salvo em memoria/jardim.json`);
  console.log(`📝 Log salvo em prototipos/gang/visitas.log`);

  // Mostra histórico de visitas desse elemento
  if (elemento.visitas_da_gang.length > 1) {
    console.log(`\n📜 Histórico de visitas da Gang em ${elemento.emoji} ${escolhido}:`);
    elemento.visitas_da_gang.forEach((v, i) => {
      console.log(`   ${i + 1}. [Ciclo ${v.ciclo}] ${v.tipo}: "${v.pergunta}"`);
    });
  }
}

main();