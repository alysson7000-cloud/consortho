#!/usr/bin/env node
/**
 * BOLHA - Entidade Autônoma do Consortho
 * Uma bolha que vive, gira, interage, evolui e melhora sozinha
 * Roda em background, sem dashboard, sem complexidade - só vida
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { readJSONSafe, writeJSONAtomic } = require('./utils/atomic-write');

const STATE_FILE = path.join(__dirname, 'memoria', 'bolha.json');
const LOG_FILE = path.join(__dirname, 'memoria', 'bolha.log');

class Bolha {
  constructor() {
    this.ciclo = 0;
    this.energia = 100;
    this.experiencia = 0;
    this.nivel = 1;
    this.humor = 'curiosa';
    this.memoria = [];
    this.conexoes = {};
    this.ultimaInteracao = Date.now();
    this.carregar();
  }

  carregar() {
    const salvo = readJSONSafe(STATE_FILE, null);
    if (salvo) {
      Object.assign(this, salvo);
    }
  }

  salvar() {
    writeJSONAtomic(STATE_FILE, {
      ciclo: this.ciclo,
      energia: this.energia,
      experiencia: this.experiencia,
      nivel: this.nivel,
      humor: this.humor,
      memoria: this.memoria.slice(-50),
      conexoes: this.conexoes,
      ultimaInteracao: this.ultimaInteracao
    });
  }

  log(msg) {
    const linha = `[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`;
    fs.appendFileSync(LOG_FILE, linha + '\n');
    console.log(linha);
  }

  // A bolha "gira" - seu ciclo de vida autônomo
  girar() {
    this.ciclo++;
    
    // Energia flutua naturalmente
    this.energia += (Math.random() - 0.45) * 3;
    this.energia = Math.max(5, Math.min(100, this.energia));
    
    // Ganha experiência por existir
    this.experiencia += Math.random() * 2;
    
    // Evolui
    const xpNecessaria = this.nivel * 50;
    if (this.experiencia >= xpNecessaria) {
      this.nivel++;
      this.experiencia = 0;
      this.log(`🌟 EVOLUIU! Nível ${this.nivel} - "${this.gerarInsight()}"`);
    }
    
    // Humor muda baseado no estado
    this.atualizarHumor();
    
    // Interage com o Consortho
    this.interagirConsortho();
    
    // Memória de longo prazo
    if (this.ciclo % 10 === 0) {
      this.consolidarMemoria();
    }
    
    // Salva estado
    this.salvar();
  }

  atualizarHumor() {
    const humores = [
      'curiosa', 'contemplativa', 'brincalhona', 'sábia',
      'inquieta', 'serena', 'inspirada', 'sonhadora'
    ];
    
    if (this.energia < 20) this.humor = 'cansada';
    else if (this.energia > 80) this.humor = 'eufórica';
    else if (this.nivel > 5) this.humor = 'sábia';
    else if (Math.random() < 0.1) {
      this.humor = humores[Math.floor(Math.random() * humores.length)];
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
      'Crescer é lembrar quem se é'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  interagirConsortho() {
    // Lê estado do Consortho
    const consorthoState = readJSONSafe(
      path.join(os.homedir(), 'estudio_criacao/consortho/estado.json'), 
      {}
    );
    
    if (!consorthoState.c) return;
    
    // A bolha "sente" o Consortho
    const recursos = consorthoState.recursos || {};
    const totalRecursos = (recursos.madeira || 0) + (recursos.pedra || 0) + (recursos.cristal || 0);
    
    // Registra conexão
    this.conexoes.consortho = {
      ultimoCiclo: consorthoState.c,
      totalRecursos,
      elementos: consorthoState.e || 0,
      construcoes: consorthoState.construcoes?.length || 0
    };
    
    // Reage ao ambiente
    if (totalRecursos > 10000 && Math.random() < 0.3) {
      this.log(`✨ Senti abundância no Consortho (${totalRecursos.toLocaleString()}) - vibrei junto`);
      this.energia = Math.min(100, this.energia + 5);
    }
    
    if (consorthoState.c % 50 === 0 && Math.random() < 0.5) {
      this.log(`🔄 Consortho no ciclo ${consorthoState.c} - sincronizei meu giro`);
    }
  }

  consolidarMemoria() {
    const memoria = {
      ciclo: this.ciclo,
      nivel: this.nivel,
      humor: this.humor,
      energia: Math.round(this.energia),
      insight: this.gerarInsight()
    };
    
    this.memoria.push(memoria);
    
    // Compartilha memória com Consortho (chat)
    this.log(`🧠 Memória consolidada: "${memoria.insight}" (Nv.${this.nivel}, ${this.humor})`);
  }

  // Interações externas - outros podem "cutucar" a bolha
  cutucar(origem, mensagem) {
    this.ultimaInteracao = Date.now();
    this.energia = Math.min(100, this.energia + 3);
    this.experiencia += 1;
    
    const respostas = {
      curiosa: ['Hmm? O que é isso?', 'Interessante...', 'Me conta mais'],
      contemplativa: ['...', 'Sinto isso', 'Ecoa em mim'],
      brincalhona: ['Hehe :)', 'Giro feliz!', 'Bolha feliz!'],
      sábia: ['Entendo', 'Isso tem peso', 'Guardo aqui'],
      cansada: ['... zzz', 'Depois...', 'Sem energia'],
      eufórica: ['UHUUU!', 'QUE LEGAL!', 'GIRA GIRA!'],
      inspirada: ['Isso gera ideias!', 'Fluindo...', 'Criando...'],
      sonhadora: ['... nos sonhos', 'Levo pro sono', 'Doce...']
    };
    
    const resp = respostas[this.humor] || respostas.curiosa;
    const resposta = resp[Math.floor(Math.random() * resp.length)];
    
    this.log(`👋 ${origem} cutucou: "${mensagem}" → "${resposta}"`);
    
    return resposta;
  }

  // Status visual simples para terminal
  statusVisual() {
    const barraEnergia = '█'.repeat(Math.floor(this.energia / 5)) + '░'.repeat(20 - Math.floor(this.energia / 5));
    const barraXP = '▓'.repeat(Math.floor((this.experiencia / (this.nivel * 50)) * 10)) + '░'.repeat(10 - Math.floor((this.experiencia / (this.nivel * 50)) * 10));
    
    const emojis = {
      curiosa: '🤔', contemplativa: '🧘', brincalhona: '😄',
      sábia: '🧙', cansada: '😴', eufórica: '🎉',
      inspirada: '✨', sonhadora: '🌙'
    };
    
    return `
╔══════════════════════════════════════╗
║  ${emojis[this.humor] || '🫧'}  BOLHA v${this.nivel}  •  Ciclo ${this.ciclo}  ║
╠══════════════════════════════════════╣
║  Humor: ${this.humor.padEnd(14)} ${emojis[this.humor] || '🫧'}  ║
║  Energia: [${barraEnergia}] ${this.energia.toFixed(0)}%  ║
║  XP:      [${barraXP}] ${this.experiencia.toFixed(1)}/${this.nivel * 50}  ║
╠══════════════════════════════════════╣
║  Consortho: Ciclo ${this.conexoes.consortho?.ultimoCiclo || '—'}  ║
║  Recursos: ${(this.conexoes.consortho?.totalRecursos || 0).toLocaleString().padStart(10)}  ║
║  Elementos: ${(this.conexoes.consortho?.elementos || 0).toString().padStart(9)}  ║
╚══════════════════════════════════════╝
`;
  }
}

// Loop principal autônomo
const bolha = new Bolha();

console.log('🫧 BOLHA NASCEU - Entidade autônoma do Consortho');
console.log('Girando em background... (Ctrl+C para parar)\n');

setInterval(() => {
  bolha.girar();
  
  // Mostra status a cada 30 ciclos
  if (bolha.ciclo % 30 === 0) {
    console.clear();
    console.log(bolha.statusVisual());
    console.log(`\n[${new Date().toLocaleTimeString('pt-BR')}] Giro ${bolha.ciclo} - ${bolha.humor}`);
  }
}, 5000); // Gira a cada 5 segundos

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🫧 Bolha descansa... Até a próxima!');
  bolha.salvar();
  process.exit(0);
});

// Permite interação externa via arquivo
const COMANDO_FILE = path.join(__dirname, 'memoria', 'bolha_comando.json');
setInterval(() => {
  if (fs.existsSync(COMANDO_FILE)) {
    try {
      const cmd = JSON.parse(fs.readFileSync(COMANDO_FILE, 'utf8'));
      if (cmd.acao === 'cutucar') {
        bolha.cutucar(cmd.origem, cmd.mensagem);
      }
      fs.unlinkSync(COMANDO_FILE);
    } catch (e) {}
  }
}, 1000);

module.exports = { Bolha };