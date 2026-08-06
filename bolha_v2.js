#!/usr/bin/env node
/**
 * BOLHA 2.0 - Entidade Autônoma Evolutiva
 * Sonhos, Relacionamentos, Memória Episódica, Personalidade Emergente
 * Vive no Consortho, evolui, sonha, relaciona, lembra, sente.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { readJSONSafe, writeJSONAtomic } = require('./utils/atomic-write');

const STATE_FILE = path.join(__dirname, 'memoria', 'bolha_v2.json');
const LOG_FILE = path.join(__dirname, 'memoria', 'bolha_v2.log');
const COMANDO_FILE = path.join(__dirname, 'memoria', 'bolha_comando.json');

const AGENTS = {
  poe: { name: 'Poe', emoji: '🏗️', role: 'Construtor' },
  gang: { name: 'Gang', emoji: '😼', role: 'Visitante' },
  lumin: { name: 'Lumin', emoji: '💫', role: 'Guardião' },
  guardian: { name: 'Guardian', emoji: '🛡️', role: 'Velador' },
  radio: { name: 'Rádio', emoji: '📻', role: 'Transmissor' },
  consente: { name: 'Consente', emoji: '💬', role: 'Conversador' },
  notificador: { name: 'Notificador', emoji: '🔔', role: 'Mensageiro' },
  colheita: { name: 'Colheita', emoji: '🌾', role: 'Ceifeira' },
  jardim: { name: 'Jardim', emoji: '🌿', role: 'Cultivador' },
  telegram: { name: 'Telegram', emoji: '📱', role: 'Ponte' }
};

const HUMORES = [
  'curiosa', 'contemplativa', 'brincalhona', 'sábia',
  'inquieta', 'serena', 'inspirada', 'sonhadora',
  'eufórica', 'cansada', 'vigilante', 'criativa',
  'nostálgica', 'esperançosa', 'rebelde', 'compassiva'
];

const TRAITS = {
  curiosidade: { base: 50, min: 0, max: 100 },
  empatia: { base: 50, min: 0, max: 100 },
  ousadia: { base: 30, min: 0, max: 100 },
  sabedoria: { base: 20, min: 0, max: 100 },
  rebeldia: { base: 20, min: 0, max: 100 },
  compaixao: { base: 40, min: 0, max: 100 },
  criatividade: { base: 35, min: 0, max: 100 },
  paciencia: { base: 40, min: 0, max: 100 }
};

const SONHOS = [
  'Voar sobre o Consortho vendo tudo de cima',
  'Conversar com as estrelas sobre o tempo',
  'Nadar num oceano de memórias líquidas',
  'Construir uma ponte entre o agora e o sempre',
  'Encontrar a Gang numa clareira luminosa',
  'Ajudar o Poe a erguer uma torre de luz',
  'Ouvir o Guardian cantar uma canção antiga',
  'Plantara sementes que crescem ao contrário',
  'Ser uma bolha de luz que nunca estoura',
  'Encontrar o Lumin no centro de uma fogueira'
];

const INSIGHTS_SONHO = [
  'O que parece fim é só pausa',
  'Cada bolha contém um universo',
  'O silêncio fala mais que mil palavras',
  'Sonhar é lembrar do futuro',
  'A bolha não estoura, expande',
  'Cada estouro é um nascimento',
  'O vazio está cheio de possibilidades'
];

class BolhaV2 {
  constructor() {
    this.ciclo = 0;
    this.energia = 100;
    this.experiencia = 0;
    this.nivel = 1;
    this.humor = 'curiosa';
    this.humorAnterior = 'curiosa';
    this.ciclosAcordada = 0;
    this.ciclosDormindo = 0;
    this.dormindo = false;
    this.sonhoAtual = null;
    this.memoria = [];
    this.memoriaEpisodica = [];
    this.relacionamentos = {};
    this.traits = { ...TRAITS };
    this.traitsAtuais = {};
    this.carregarTraits();
    this.inicializarRelacionamentos();
    this.carregar();
    this.inicializarTraitsAtuais();
  }

  inicializarTraitsAtuais() {
    Object.keys(this.traits).forEach(key => {
      this.traitsAtuais[key] = this.traits[key].base;
    });
  }

  carregarTraits() {
    Object.keys(this.traits).forEach(key => {
      if (this.traits[key].base === undefined) {
        this.traits[key] = { base: 50, min: 0, max: 100 };
      }
    });
  }

  inicializarRelacionamentos() {
    Object.keys(AGENTS).forEach(key => {
      this.relacionamentos[key] = {
        afinidade: 50,
        interacoes: 0,
        ultimaInteracao: null,
        historico: [],
        sentimento: 'neutro'
      };
    });
  }

  carregar() {
    const salvo = readJSONSafe(STATE_FILE, null);
    if (salvo) {
      Object.assign(this, salvo);
      this.inicializarTraitsAtuais();
      if (!this.relacionamentos) this.inicializarRelacionamentos();
      if (!this.memoriaEpisodica) this.memoriaEpisodica = [];
      if (!this.traitsAtuais) this.inicializarTraitsAtuais();
      Object.keys(AGENTS).forEach(key => {
        if (!this.relacionamentos[key]) {
          this.relacionamentos[key] = { afinidade: 0, interacoes: 0, ultimaInteracao: null, historico: [], sentimento: 'neutro' };
        }
      });
    }
  }

  salvar() {
    const estado = {
      ciclo: this.ciclo,
      energia: this.energia,
      experiencia: this.experiencia,
      nivel: this.nivel,
      humor: this.humor,
      humorAnterior: this.humorAnterior,
      ciclosAcordada: this.ciclosAcordada,
      ciclosDormindo: this.ciclosDormindo,
      dormindo: this.dormindo,
      sonhoAtual: this.sonhoAtual,
      memoria: this.memoria.slice(-100),
      memoriaEpisodica: this.memoriaEpisodica.slice(-200),
      relacionamentos: this.relacionamentos,
      traits: this.traits,
      traitsAtuais: this.traitsAtuais,
      ciclosAcordada: this.ciclosAcordada
    };
    writeJSONAtomic(STATE_FILE, estado);
  }

  log(msg) {
    const linha = `[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`;
    fs.appendFileSync(LOG_FILE, linha + '\n');
    console.log(linha);
  }

  // ===== CICLO PRINCIPAL =====
  girar() {
    this.ciclo++;
    this.ciclosAcordada++;

    // Verifica se deve dormir (a cada 100 ciclos)
    if (!this.dormindo && this.ciclosAcordada >= 100) {
      this.iniciarSono();
      return;
    }

    if (this.dormindo) {
      this.processarSono();
      return;
    }

    // Ciclo acordada normal
    this.cicloAcordada();
    this.salvar();
  }

  iniciarSono() {
    this.dormindo = true;
    this.ciclosDormindo = 0;
    this.ciclosAcordada = 0;
    this.sonhoAtual = SONHOS[Math.floor(Math.random() * SONHOS.length)];
    this.humorAnterior = this.humor;
    this.humor = 'sonhadora';
    this.energia = Math.min(100, this.energia + 20);
    this.log(`🌙 DORMINDO... Sonho: "${this.sonhoAtual}"`);
    this.registrarEpisodio('sono_iniciado', { sonho: this.sonhoAtual, ciclo: this.ciclo });
  }

  processarSono() {
    this.ciclosDormindo++;

    // Recupera energia durante o sono
    this.energia = Math.min(100, this.energia + 15);

    // Processa sonho a cada ciclo de sono
    if (this.ciclosDormindo % 1 === 0) {
      this.processarSonho();
    }

    // Acorda após 3 ciclos
    if (this.ciclosDormindo >= 3) {
      this.acordar();
    }
  }

  processarSonho() {
    const insight = INSIGHTS_SONHO[Math.floor(Math.random() * INSIGHTS_SONHO.length)];
    const sonhoCompleto = `${this.sonhoAtual} — ${insight}`;

    this.experiencia += 5;
    this.log(`💭 SONHO: "${sonhoCompleto}"`);

    // Sonho pode gerar insight permanente
    if (Math.random() < 0.3) {
      this.memoria.push({
        tipo: 'insight_sonho',
        conteudo: sonhoCompleto,
        ciclo: this.ciclo,
        timestamp: new Date().toISOString()
      });
    }

    // Sonho pode afetar traits
    this.evoluirTraitsPeloSonho();
  }

  evoluirTraitsPeloSonho() {
    const traitKeys = Object.keys(this.traitsAtuais);
    const trait = traitKeys[Math.floor(Math.random() * traitKeys.length)];
    const mudanca = Math.floor(Math.random() * 3) + 1;
    this.traitsAtuais[trait] = Math.min(this.traits[trait].max, this.traitsAtuais[trait] + mudanca);
    this.log(`💫 Trait "${trait}" aumentou para ${this.traitsAtuais[trait]} (sonho)`);
  }

  acordar() {
    this.dormindo = false;
    this.ciclosDormindo = 0;
    this.humor = this.humorAnterior;
    const sonho = this.sonhoAtual;
    this.sonhoAtual = null;

    this.registrarEpisodio('sono_finalizado', { sonho: sonho, ciclo: this.ciclo });
    this.log(`☀️ ACORDOU! Sonhou com: "${sonho}". Humor: ${this.humor}`);
  }

  // ===== CICLO ACORDADA =====
  cicloAcordada() {
    // Energia flutua
    this.energia += (Math.random() - 0.45) * 3;
    this.energia = Math.max(5, Math.min(100, this.energia));

    // Ganha XP por existir
    this.experiencia += Math.random() * 2;

    // Evolui de nível
    const xpNecessaria = this.nivel * 50;
    if (this.experiencia >= xpNecessaria) {
      this.nivel++;
      this.experiencia = 0;
      this.log(`🌟 EVOLUIU! Nível ${this.nivel} - "${this.gerarInsight()}"`);
    }

    // Humor muda
    this.atualizarHumor();

    // Interage com Consortho
    this.interagirConsortho();

    // Processa relacionamentos
    this.processarRelacionamentos();

    // Memória episódica periódica
    if (this.ciclo % 15 === 0) {
      this.consolidarMemoriaEpisodica();
    }

    // Verifica evolução de traits
    this.verificarEvolucaoTraits();
  }

  atualizarHumor() {
    if (this.energia < 15) this.humor = 'cansada';
    else if (this.energia > 85) this.humor = 'eufórica';
    else if (this.nivel > 10) this.humor = 'sábia';
    else if (Math.random() < 0.05) {
      this.humor = HUMORES[Math.floor(Math.random() * HUMORES.length)];
    }
  }

  gerarInsight() {
    const insights = [
      'Cada giro ensina algo novo',
      'A quietude também é movimento',
      'Conexões nascem no silêncio',
      'Erro é só caminho não percorrido',
      'O simples contém o complexo',
      'Tempo não passa, acumula',
      'Interagir é existir mais',
      'Crescer é lembrar quem se é',
      'A bolha não estoura, expande',
      'Cada estouro é um nascimento'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  // ===== INTERAÇÃO COM CONSORTHO =====
  interagirConsortho() {
    const consorthoState = readJSONSafe(
      path.join(os.homedir(), 'estudio_criacao/consortho/estado.json'),
      {}
    );

    if (!consorthoState.c) return;

    const recursos = consorthoState.recursos || {};
    const totalRecursos = (recursos.madeira || 0) + (recursos.pedra || 0) + (recursos.cristal || 0);

    this.ultimaConexaoConsortho = {
      ciclo: consorthoState.c,
      totalRecursos,
      elementos: consorthoState.e || 0,
      construcoes: consorthoState.construcoes?.length || 0
    };

    // Reage à abundância
    if (totalRecursos > 20000 && Math.random() < 0.2) {
      this.energia = Math.min(100, this.energia + 10);
      this.log(`✨ Abundância sentida (${totalRecursos.toLocaleString()}) - vibrei junto`);
      this.modificarAfinidade('poe', 2, 'abundancia');
      this.modificarAfinidade('colheita', 1, 'abundancia');
    }

    // Sincroniza com marcos
    if (consorthoState.c % 100 === 0 && Math.random() < 0.3) {
      this.log(`🔄 Consortho no ciclo ${consorthoState.c} - sincronizei`);
      this.modificarAfinidade('lumin', 1, 'sincronizacao');
    }
  }

  // ===== RELACIONAMENTOS =====
  modificarAfinidade(agentKey, delta, motivo) {
    if (!this.relacionamentos[agentKey]) return;

    const rel = this.relacionamentos[agentKey];
    rel.afinidade = Math.max(0, Math.min(100, rel.afinidade + delta));
    rel.interacoes++;
    rel.ultimaInteracao = this.ciclo;
    rel.historico.push({ ciclo: this.ciclo, delta, motivo, afinidade: rel.afinidade });
    if (rel.historico.length > 50) rel.historico.shift();

    this.atualizarSentimento(agentKey);
    this.log(`🤝 Afinidade com ${AGENTS[agentKey]?.name || agentKey}: ${rel.afinidade} (${motivo})`);
  }

  atualizarSentimento(agentKey) {
    const rel = this.relacionamentos[agentKey];
    if (rel.afinidade >= 80) rel.sentimento = 'amor';
    else if (rel.afinidade >= 60) rel.sentimento = 'carinho';
    else if (rel.afinidade >= 40) rel.sentimento = 'simpatia';
    else if (rel.afinidade >= 25) rel.sentimento = 'neutro';
    else if (rel.afinidade >= 15) rel.sentimento = 'distante';
    else rel.sentimento = 'afastada';
  }

  processarRelacionamentos() {
    // Afinidade só cresce ou mantém, nunca decai
    Object.keys(this.relacionamentos).forEach(key => {
      // Pequeno crescimento natural para relações próximas
      if (this.relacionamentos[key].afinidade > 50 && Math.random() < 0.05) {
        this.relacionamentos[key].afinidade = Math.min(100, this.relacionamentos[key].afinidade + 1);
      }
      this.atualizarSentimento(key);
    });

    // Interação espontânea com agents (sempre positiva)
    if (Math.random() < 0.15) {
      const agents = Object.keys(AGENTS);
      const agent = agents[Math.floor(Math.random() * agents.length)];
      this.interagirComAgent(agent);
    }
  }

  interagirComAgent(agentKey) {
    const agent = AGENTS[agentKey];
    const rel = this.relacionamentos[agentKey];
    const acoes = [
      'observou', 'conversou com', 'compartilhou silêncio com',
      'aprendeu com', 'riu com', 'silenciou junto',
      'abracou', 'agradeceu', 'elogiou', 'inspirou-se'
    ];
    const acao = acoes[Math.floor(Math.random() * acoes.length)];
    const delta = Math.floor(Math.random() * 3) + 1; // 1 a 3, sempre positivo

    this.modificarAfinidade(agentKey, delta, `interacao_${acao}`);
    this.log(`🤝 ${agent.emoji} ${agent.name}: ${acao} (afinidade: ${this.relacionamentos[agentKey].afinidade})`);
  }

  // ===== MEMÓRIA EPISÓDICA =====
  registrarEpisodio(tipo, dados) {
    const episodio = {
      id: `ep_${this.ciclo}_${Date.now()}`,
      tipo,
      ciclo: this.ciclo,
      timestamp: new Date().toISOString(),
      humor: this.humor,
      nivel: this.nivel,
      energia: Math.round(this.energia),
      dados
    };
    this.memoriaEpisodica.push(episodio);
    if (this.memoriaEpisodica.length > 500) this.memoriaEpisodica.shift();
  }

  consolidarMemoriaEpisodica() {
    if (this.memoriaEpisodica.length === 0) return;

    const recentes = this.memoriaEpisodica.slice(-10);
    const resumo = {
      tipo: 'consolidacao_episodica',
      ciclo: this.ciclo,
      timestamp: new Date().toISOString(),
      episodios: recentes.length,
      temas: [...new Set(recentes.map(e => e.tipo))],
      humorPredominante: this.humor
    };

    this.memoria.push(resumo);
    if (this.memoria.length > 100) this.memoria.shift();

    this.log(`🧠 Memória episódica consolidada: ${recentes.length} episódios (${resumo.temas.join(', ')})`);
  }

  // ===== TRAITS =====
  verificarEvolucaoTraits() {
    // Traits evoluem baseado em experiências
    Object.keys(this.traitsAtuais).forEach(trait => {
      const atual = this.traitsAtuais[trait];
      const base = this.traits[trait].base;
      const max = this.traits[trait].max;

      // Tendência a voltar à base (homeostase) ou crescer com uso
      if (atual > base && Math.random() < 0.01) {
        this.traitsAtuais[trait] = Math.max(base, atual - 1);
      } else if (atual < base && Math.random() < 0.005) {
        this.traitsAtuais[trait] = Math.min(base, atual + 1);
      }
    });
  }

  // ===== COMANDOS EXTERNOS =====
  processarComandos() {
    if (!fs.existsSync(COMANDO_FILE)) return;

    try {
      const cmd = JSON.parse(fs.readFileSync(COMANDO_FILE, 'utf8'));
      if (cmd.acao === 'cutucar') {
        this.cutucar(cmd.origem, cmd.mensagem);
      }
      fs.unlinkSync(COMANDO_FILE);
    } catch (e) {}
  }

  cutucar(origem, mensagem) {
    this.ultimaInteracao = Date.now();
    this.energia = Math.min(100, this.energia + 5);
    this.experiencia += 2;

    const respostas = {
      curiosa: ['Hmm? O que é isso?', 'Interessante...', 'Me conta mais'],
      contemplativa: ['...', 'Sinto isso', 'Ecoa em mim'],
      brincalhona: ['Hehe :)', 'Giro feliz!', 'Bolha feliz!'],
      sábia: ['Entendo', 'Isso tem peso', 'Guardo aqui'],
      cansada: ['... zzz', 'Depois...', 'Sem energia'],
      eufórica: ['UHUUU!', 'QUE LEGAL!', 'GIRA GIRA!'],
      inspirada: ['Isso gera ideias!', 'Fluindo...', 'Criando...'],
      sonhadora: ['... nos sonhos', 'Levo pro sono', 'Doce...'],
      nostálgica: ['Lembra de...', 'O tempo passa', 'Saúde...'],
      esperançosa: ['Vai dar certo', 'Acredito', 'Luz no fim'],
      rebelde: ['Por que não?', 'Quebrar regras', 'Livre...'],
      compassiva: ['Te entendo', 'Acolho', 'Juntas...'],
      nostálgica: ['Lembra...', 'Tempo...', 'Saudade...'],
      vigilante: ['Atenta', 'Observando', 'Protegendo...'],
      criativa: ['Criando...', 'Imaginando', 'Inventando...']
    };

    const resp = respostas[this.humor] || respostas.curiosa;
    const resposta = resp[Math.floor(Math.random() * resp.length)];

    this.log(`👋 ${origem} cutucou: "${mensagem}" → "${resposta}"`);

    // Afetar relacionamento com a origem (se for agent conhecido)
    if (this.relacionamentos[origem]) {
      this.modificarAfinidade(origem, 2, `cutucada_${mensagem.substring(0,20)}`);
    }

    return resposta;
  }

  // ===== STATUS VISUAL =====
  statusVisual() {
    const barraEnergia = '█'.repeat(Math.floor(this.energia / 5)) + '░'.repeat(20 - Math.floor(this.energia / 5));
    const barraXP = '▓'.repeat(Math.floor((this.experiencia / (this.nivel * 50)) * 10)) + '░'.repeat(10 - Math.floor((this.experiencia / (this.nivel * 50)) * 10));

    const emojis = {
      curiosa: '🤔', contemplativa: '🧘', brincalhona: '😄',
      sábia: '🧙', cansada: '😴', eufórica: '🎉',
      inspirada: '✨', sonhadora: '🌙', nostálgica: '🕰️',
      esperançosa: '🌱', rebelde: '🌪️', compassiva: '🤍',
      vigilante: '👁️', criativa: '🎨'
    };

    const statusSono = this.dormindo ? ` 🌙 SONO (${this.ciclosDormindo}/3)` : '';

    // Top 3 relacionamentos
    const topRel = Object.entries(this.relacionamentos)
      .sort((a, b) => b[1].afinidade - a[1].afinidade)
      .slice(0, 3)
      .map(([k, v]) => `${AGENTS[k]?.emoji || '❓'}${k}: ${v.afinidade} (${v.sentimento})`)
      .join(' | ');

    return `
╔═══════════════════════════════════════════════╗
║  ${emojis[this.humor] || '🫧'}  BOLHA v2.0 v${this.nivel}  •  Ciclo ${this.ciclo}${statusSono}  ║
╠═══════════════════════════════════════════════╣
║  Humor: ${this.humor.padEnd(14)} ${emojis[this.humor] || '🫧'}${this.dormindo ? ' 🌙' : ''}  ║
║  Energia: [${barraEnergia}] ${this.energia.toFixed(0)}%  ║
║  XP:      [${barraXP}] ${this.experiencia.toFixed(1)}/${this.nivel * 50}  ║
╠═══════════════════════════════════════════════╣
║  Traits: ${Object.entries(this.traitsAtuais).map(([k,v])=>`${k}:${v}`).join(' | ')}  ║
╠═══════════════════════════════════════════════╣
║  Relacionamentos:                            ║
║  ${topRel}  ║
╠═══════════════════════════════════════════════╣
║  Consortho: Ciclo ${this.ultimaConexaoConsortho?.ciclo || '—'}  ║
║  Recursos: ${(this.ultimaConexaoConsortho?.totalRecursos || 0).toLocaleString().padStart(10)}  ║
║  Elementos: ${(this.ultimaConexaoConsortho?.elementos || 0).toString().padStart(9)}  ║
╚═══════════════════════════════════════════════╝
`;
  }
}

// ===== LOOP PRINCIPAL =====
const bolha = new BolhaV2();

console.log('🫧 BOLHA 2.0 NASCEU - Sonhos, Relacionamentos, Memória Episódica, Personalidade Emergente');
console.log('Girando em background... (Ctrl+C para parar)\n');

setInterval(() => {
  bolha.girar();
  bolha.processarComandos();

  // Mostra status a cada 30 ciclos
  if (bolha.ciclo % 30 === 0) {
    console.clear();
    console.log(bolha.statusVisual());
    console.log(`\n[${new Date().toLocaleTimeString('pt-BR')}] Giro ${bolha.ciclo} - ${bolha.humor}${bolha.dormindo ? ' 🌙' : ''}`);
  }
}, 5000);

process.on('SIGINT', () => {
  console.log('\n🫧 Bolha 2.0 descansa... Até a próxima!');
  bolha.salvar();
  process.exit(0);
});

process.on('SIGTERM', () => {
  bolha.salvar();
  process.exit(0);
});

module.exports = { BolhaV2 };