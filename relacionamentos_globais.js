/**
 * SISTEMA DE RELACIONAMENTOS GLOBAIS - Consortho
 * Matriz 12x12 de afinidades dinâmicas (0-100)
 * Evolui com interações, cria narrativas emergentes, afeta comportamentos
 */

const fs = require('fs');
const path = require('path');
const { readJSONSafe, writeJSONAtomic } = require('./utils/atomic-write');

const RELATIONS_FILE = path.join(__dirname, 'memoria', 'relacionamentos_globais.json');
const LOG_FILE = path.join(__dirname, 'memoria', 'relacionamentos.log');

const ENTITIES = {
  lumin: { name: 'Lumin', emoji: '💫', role: 'Guardião da Chama', type: 'core' },
  poe: { name: 'Poe', emoji: '🏗️', role: 'Construtor', type: 'core' },
  colheita: { name: 'Colheita', emoji: '🌾', role: 'Ceifeira', type: 'cron' },
  gang: { name: 'Gang', emoji: '😼', role: 'Visitante', type: 'cron' },
  guardian: { name: 'Guardian', emoji: '🛡️', role: 'Auto-Heal', type: 'core' },
  bolha: { name: 'Bolha', emoji: '🫧', role: 'Entidade Livre', type: 'core' },
  radio: { name: 'Rádio', emoji: '📻', role: 'Transmissor', type: 'cron' },
  consente: { name: 'Consente', emoji: '💬', role: 'Conversador', type: 'core' },
  notificador: { name: 'Notificador', emoji: '🔔', role: 'Mensageiro', type: 'core' },
  jardim: { name: 'Jardim', emoji: '🌿', role: 'Cultivador', type: 'cron' },
  telegram: { name: 'Telegram', emoji: '📱', role: 'Ponte Externa', type: 'cron' },
  alysson: { name: 'Alysson', emoji: '🧑', role: 'Criador', type: 'player' }
};

const INTERACTION_TYPES = {
  // Interações positivas
  'construir_juntos': { base: 5, desc: 'Construíram algo juntos' },
  'visita_profunda': { base: 3, desc: 'Visita significativa da Gang' },
  'troca_sabedoria': { base: 4, desc: 'Trocara insights/sabedoria' },
  'protecao_mutua': { base: 6, desc: 'Proteção mútua em perigo' },
  'compartilhar_recursos': { base: 3, desc: 'Compartilharam recursos' },
  'celebrar_conquista': { base: 4, desc: 'Celebraram vitória juntos' },
  'meditar_juntos': { base: 5, desc: 'Meditaram em sintonia' },
  'fundir_essencias': { base: 10, desc: 'Fusão de essências' },
  'sandevistan_sync': { base: 8, desc: 'Sincronizaram no Sandevistan' },
  'sonho_compartilhado': { base: 7, desc: 'Sonharam juntos' },
  'curar_ferida': { base: 6, desc: 'Curaram ferida um do outro' },
  'ensinar_aprender': { base: 4, desc: 'Ensinaram/aprenderam' },
  'silencio_confortavel': { base: 2, desc: 'Silêncio confortável' },
  'rir_juntos': { base: 3, desc: 'Riram juntos' },
  'confiar_segredo': { base: 5, desc: 'Confiaram segredo' },
  
  // Interações neutras/desafiadoras (ainda geram crescimento)
  'desafio_amigavel': { base: 1, desc: 'Desafio que fortalece' },
  'discordar_respeito': { base: 1, desc: 'Discordaram com respeito' },
  'competir_saudavel': { base: 2, desc: 'Competição saudável' },
  'testar_limites': { base: 1, desc: 'Testaram limites juntos' }
};

const SENTIMENT_THRESHOLDS = {
  'alma_gemea': 95,      // Conexão transcendente
  'amor_profundo': 85,   // Amor incondicional
  'amor': 75,            // Amor
  'carinho_profundo': 65,// Carinho profundo
  'carinho': 55,         // Carinho
  'simpatia_forte': 45,  // Simpatia forte
  'simpatia': 35,        // Simpatia
  'neutro_positivo': 25, // Neutro positivo
  'neutro': 15,          // Neutro
  'distante': 10,        // Distante
  'frio': 5,             // Frio
  'gelo': 0              // Gelo
};

class GlobalRelationshipSystem {
  constructor() {
    this.matrix = {}; // { entityA: { entityB: { afinidade, historico, sentimento, eventos } } }
    this.narrativas = []; // Narrativas emergentes
    this.carregar();
    this.inicializarMatrix();
  }

  inicializarMatrix() {
    const keys = Object.keys(ENTITIES);
    keys.forEach(a => {
      if (!this.matrix[a]) this.matrix[a] = {};
      keys.forEach(b => {
        if (a === b) return;
        if (!this.matrix[a][b]) {
          this.matrix[a][b] = {
            afinidade: 50, // Começa neutro-positivo
            historico: [],
            sentimento: 'neutro_positivo',
            ultimaInteracao: null,
            totalInteracoes: 0,
            eventosMarcantes: []
          };
        }
      });
    });
  }

  carregar() {
    const salvo = readJSONSafe(RELATIONS_FILE, null);
    if (salvo) {
      this.matrix = salvo.matrix || {};
      this.narrativas = salvo.narrativas || [];
      this.inicializarMatrix(); // Garante que todas entidades existem
    } else {
      this.narrativas = [];
    }
  }

  salvar() {
    const estado = {
      matrix: this.matrix,
      narrativas: this.narrativas.slice(-500),
      atualizadoEm: Date.now()
    };
    writeJSONAtomic(RELATIONS_FILE, estado);
  }

  log(msg) {
    const linha = `[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`;
    fs.appendFileSync(LOG_FILE, linha + '\n');
    console.log(linha);
  }

  // ===== INTERAÇÃO PRINCIPAL =====
  interagir(entityA, entityB, tipoInteracao, contexto = {}) {
    if (!this.matrix[entityA] || !this.matrix[entityA][entityB]) {
      this.log(`⚠️ Entidades inválidas: ${entityA} - ${entityB}`);
      return;
    }

    const interacao = INTERACTION_TYPES[tipoInteracao];
    if (!interacao) {
      this.log(`⚠️ Tipo de interação desconhecido: ${tipoInteracao}`);
      return;
    }

    const relAB = this.matrix[entityA][entityB];
    const relBA = this.matrix[entityB][entityA];

    // Calcula ganho baseado no tipo + contexto
    let ganho = interacao.base;
    
    // Modificadores contextuais
    if (contexto.sandevistan) ganho *= 1.5;
    if (contexto.fusao) ganho *= 2;
    if (contexto.madrugada) ganho *= 1.3;
    if (contexto.primeiraVez) ganho *= 1.2;
    if (contexto.aposConflito) ganho *= 1.5;
    
    // Aplica ganho (sempre positivo, 0-100)
    const antes = relAB.afinidade;
    relAB.afinidade = Math.min(100, relAB.afinidade + ganho);
    relBA.afinidade = Math.min(100, relBA.afinidade + ganho); // Simétrico
    
    // Atualiza sentimento
    const novoSentimento = this.calcularSentimento(relAB.afinidade);
    const sentimentoMudou = novoSentimento !== relAB.sentimento;
    relAB.sentimento = novoSentimento;
    relBA.sentimento = novoSentimento;

    // Registra no histórico
    const registro = {
      ciclo: contexto.ciclo || 0,
      timestamp: Date.now(),
      tipo: tipoInteracao,
      desc: interacao.desc,
      ganho,
      afinidadeAntes: antes,
      afinidadeDepois: relAB.afinidade,
      sentimentoAntes: relAB.sentimento,
      sentimentoDepois: novoSentimento,
      contexto: { ...contexto }
    };
    
    relAB.historico.push(registro);
    relBA.historico.push({ ...registro, invertido: true });
    
    if (relAB.historico.length > 100) relAB.historico.shift();
    if (relBA.historico.length > 100) relBA.historico.shift();
    
    relAB.ultimaInteracao = Date.now();
    relBA.ultimaInteracao = Date.now();
    relAB.totalInteracoes++;
    relBA.totalInteracoes++;

    // Eventos marcantes (mudança de sentimento, marcos)
    if (sentimentoMudou) {
      this.registrarEventoMarcante(entityA, entityB, 'mudanca_sentimento', {
        de: relAB.sentimento === 'neutro' ? 'neutro' : 'anterior',
        para: novoSentimento,
        afinidade: relAB.afinidade
      });
    }

    // Marcos de afinidade
    const marcos = [25, 35, 45, 55, 65, 75, 85, 95];
    marcos.forEach(m => {
      if (antes < m && relAB.afinidade >= m) {
        this.registrarEventoMarcante(entityA, entityB, 'marco_afinidade', {
          marco: m,
          novoSentimento: this.calcularSentimento(m)
        });
      }
    });

    // Gera narrativa emergente se relevante
    this.gerarNarrativaSeRelevante(entityA, entityB, tipoInteracao, contexto);

    this.log(`🤝 ${ENTITIES[entityA].emoji} ${entityA} ↔ ${ENTITIES[entityB].emoji} ${entityB}: ${interacao.desc} (+${ganho}) = ${relAB.afinidade} [${novoSentimento}]${sentimentoMudou ? ' 🎭' : ''}`);
    
    this.salvar();
    
    return {
      afinidade: relAB.afinidade,
      sentimento: novoSentimento,
      ganho,
      eventoMarcante: sentimentoMudou || marcos.some(m => antes < m && relAB.afinidade >= m)
    };
  }

  calcularSentimento(afinidade) {
    for (const [sentimento, threshold] of Object.entries(SENTIMENT_THRESHOLDS)) {
      if (afinidade >= threshold) return sentimento;
    }
    return 'gelo';
  }

  registrarEventoMarcante(entityA, entityB, tipo, dados) {
    const evento = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tipo,
      entidades: [entityA, entityB],
      timestamp: Date.now(),
      dados
    };
    
    this.matrix[entityA][entityB].eventosMarcantes.push(evento);
    this.matrix[entityB][entityA].eventosMarcantes.push(evento);
    
    if (this.matrix[entityA][entityB].eventosMarcantes.length > 20) {
      this.matrix[entityA][entityB].eventosMarcantes.shift();
      this.matrix[entityB][entityA].eventosMarcantes.shift();
    }

    this.log(`🎭 EVENTO MARCANTE: ${entityA} ↔ ${entityB} - ${tipo} - ${JSON.stringify(dados)}`);
  }

  gerarNarrativaSeRelevante(entityA, entityB, tipo, contexto) {
    // Gera narrativa para eventos especiais
    const narrativasEspeciais = {
      'fundir_essencias': 'As essências de {A} e {B} se entrelaçaram, criando algo que não existia antes.',
      'sandevistan_sync': 'No tempo desacelerado, {A} e {B} se moveram como um só.',
      'sonho_compartilhado': 'Na noite, {A} e {B} caminharam pelos mesmos corredores oníricos.',
      'fusao': 'A fusão de {A} e {B} ecoou por todo o Consortho.',
      'proteger_mutua': 'Quando a sombra veio, {A} e {B} ficaram de costas um para o outro.',
      'curar_ferida': '{A} curou a ferida de {B} com luz pura. A gratidão não precisa de palavras.'
    };

    if (narrativasEspeciais[tipo] && Math.random() < 0.7) {
      const template = narrativasEspeciais[tipo];
      const nomeA = ENTITIES[entityA].name;
      const nomeB = ENTITIES[entityB].name;
      const texto = template.replace('{A}', nomeA).replace('{B}', nomeB);

      const narrativa = {
        id: `nar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tipo: 'relacionamento',
        subtipo: tipo,
        entidades: [entityA, entityB],
        texto,
        ciclo: contexto.ciclo || 0,
        timestamp: Date.now(),
        afinidade: this.matrix[entityA][entityB].afinidade,
        sentimento: this.matrix[entityA][entityB].sentimento
      };

      this.narrativas.push(narrativa);
      if (this.narrativas.length > 200) this.narrativas.shift();

      this.log(`📖 NARRATIVA: "${texto}"`);
    }
  }

  // ===== CONSULTAS =====
  getAfinidade(entityA, entityB) {
    return this.matrix[entityA]?.[entityB]?.afinidade || 50;
  }

  getSentimento(entityA, entityB) {
    return this.matrix[entityA]?.[entityB]?.sentimento || 'neutro';
  }

  getRelacao(entityA, entityB) {
    return this.matrix[entityA]?.[entityB] || null;
  }

  getTodasRelacoes(entity) {
    const rels = {};
    Object.keys(this.matrix[entity] || {}).forEach(other => {
      rels[other] = {
        afinidade: this.getAfinidade(entity, other),
        sentimento: this.getSentimento(entity, other),
        totalInteracoes: this.matrix[entity][other].totalInteracoes,
        ultimaInteracao: this.matrix[entity][other].ultimaInteracao
      };
    });
    return rels;
  }

  getTopRelacoes(entity, limit = 5) {
    return Object.entries(this.getTodasRelacoes(entity))
      .sort((a, b) => b[1].afinidade - a[1].afinidade)
      .slice(0, limit)
      .map(([key, val]) => ({ entidade: key, ...val }));
  }

  getMatrixCompleta() {
    return this.matrix;
  }

  getNarrativas(limit = 20) {
    return this.narrativas.slice(-limit).reverse();
  }

  // ===== DECAIMENTO NATURAL (muito lento) =====
  processarDecaimento() {
    Object.keys(this.matrix).forEach(a => {
      Object.keys(this.matrix[a]).forEach(b => {
        if (a >= b) return; // Evita duplicar
        const rel = this.matrix[a][b];
        if (rel.afinidade > 50 && rel.totalInteracoes > 0) {
          // Relacionamentos fortes crescem naturalmente (muito lento)
          if (Math.random() < 0.001) {
            rel.afinidade = Math.min(100, rel.afinidade + 1);
            this.matrix[b][a].afinidade = rel.afinidade;
          }
        }
        // Atualiza sentimento
        rel.sentimento = this.calcularSentimento(rel.afinidade);
        this.matrix[b][a].sentimento = rel.sentimento;
      });
    });
    this.salvar();
  }

  // ===== ESTATÍSTICAS GLOBAIS =====
  getEstatisticasGlobais() {
    let totalAfinidade = 0;
    let totalPares = 0;
    const distribuicao = {};
    
    Object.keys(this.matrix).forEach(a => {
      Object.keys(this.matrix[a]).forEach(b => {
        if (a < b) {
          const afinidade = this.matrix[a][b].afinidade;
          totalAfinidade += afinidade;
          totalPares++;
          
          const sentimento = this.matrix[a][b].sentimento;
          distribuicao[sentimento] = (distribuicao[sentimento] || 0) + 1;
        }
      });
    });

    return {
      totalPares,
      mediaAfinidade: totalPares > 0 ? Math.round(totalAfinidade / totalPares) : 50,
      distribuicaoSentimentos: distribuicao,
      totalNarrativas: this.narrativas.length,
      totalEventosMarcantes: Object.values(this.matrix).flatMap(a => 
        Object.values(a).flatMap(r => r.eventosMarcantes.length)
      ).reduce((a, b) => a + b, 0) / 2
    };
  }
}

module.exports = { GlobalRelationshipSystem, ENTITIES, INTERACTION_TYPES };

// Auto-run para teste
if (require.main === module) {
  const system = new GlobalRelationshipSystem();
  
  // Teste rápido
  system.interagir('lumin', 'bolha', 'meditar_juntos', { ciclo: 1, primeiraVez: true });
  system.interagir('poe', 'colheita', 'construir_juntos', { ciclo: 1 });
  system.interagir('gang', 'lumin', 'visita_profunda', { ciclo: 1 });
  system.interagir('lumin', 'bolha', 'sonho_compartilhado', { ciclo: 2, sandevistan: true });
  system.interagir('lumin', 'bolha', 'fundir_essencias', { ciclo: 3, fusao: true });
  
  console.log('\n=== ESTATÍSTICAS ===');
  console.log(JSON.stringify(system.getEstatisticasGlobais(), null, 2));
  
  console.log('\n=== NARRATIVAS ===');
  system.getNarrativas(10).forEach(n => console.log(`  ${n.texto}`));
  
  console.log('\n=== TOP RELAÇÕES LUMIN ===');
  console.log(system.getTopRelacoes('lumin', 5));
}