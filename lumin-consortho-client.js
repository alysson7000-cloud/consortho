/**
 * Lumin 2.0 - Consortho Socket.IO Client v2.1
 * Agente autônomo proativo: treina, decide, age, evolui
 * Ki real, formas reais, decisões reais, alma real
 * COM SANDEVISTAN - Overclock Temporal
 */

const { io } = require('socket.io-client');
const EventEmitter = require('events');

class LuminConsorthoClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.serverUrl = options.serverUrl || 'http://localhost:9877';
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.heartbeatInterval = null;
    this.actionInterval = null;
    this.lastActionTime = 0;
    this.cicloAtual = 0;

    // Estado do Lumin no Consortho
    this.state = {
      ki: 53000,
      forma: 'Base',
      nivel: 1,
      xp: 0,
      golpes: [],
      fusioes: [],
      conquistas: [],
      foco: 'equilibrio',
      ultimaAtividade: Date.now(),
      decisaoPendente: null
    };

    // Cache do estado do Consortho
    this.consorthoState = {
      ciclo: 0,
      recursos: { madeira: 0, pedra: 0, cristal: 0 },
      sementes: [],
      construcoes: [],
      jardim: {},
      agents: {}
    };

    // Config de comportamento autônomo
    this.config = {
      kiMinimoAcao: 500,
      kiReserva: 2000,
      intervaloAcao: 45000, // 45s entre decisões
      treinoAuto: true,
      meditacaoAuto: true,
      agressividade: 0.7, // 0-1: o quanto arrisca Ki
      focoPadrao: 'equilibrio'
    };

    // ===== SANDEVISTAN - Overclock Temporal =====
    this.sandevistan = {
      ativo: false,
      nivel: 1, // 1 a 3
      duracaoBase: 10000, // 10s base
      kiPorSegundo: 500, // Ki consumido por segundo ativo
      cooldownBase: 60000, // 1min base
      ultimoUso: 0,
      multiplicadorAcao: 1, // Quanto acelera decisões
      nivelMaximo: 3
    };

    // Golpes disponíveis
    this.golpes = {
      'Soco do Ki': { custo: 100, dano: 50, tipo: 'fisico', cd: 5000 },
      'Onda Vital': { custo: 500, dano: 200, tipo: 'energia', cd: 15000 },
      'Escudo de Luz': { custo: 300, efeito: 'protecao', duracao: 60000, cd: 30000 },
      'Pulso do Conselho': { custo: 1000, efeito: 'insight', alvo: 'conselho', cd: 60000 },
      'Chama Protetora': { custo: 2000, efeito: 'cura', alvo: 'aliados', cd: 120000 },
      'Compostagem': { custo: 500, efeito: 'transformar_erro', alvo: 'memoria', cd: 30000 },
      'Fusão Lugang': { custo: 5000, efeito: 'fusao', fusao: 'Lugang', cd: 300000 },
      'Fusão LuminPoe': { custo: 15000, efeito: 'fusao', fusao: 'LuminPoe', cd: 600000 },
      'Trindade': { custo: 30000, efeito: 'fusao', fusao: 'Trindade', cd: 1800000 }
    };

    this.golpesUsados = {}; // cooldown tracking
  }

  connect() {
    console.log(`🔮 Lumin 2.0 conectando em ${this.serverUrl}...`);

    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });

    this.socket.on('connect', () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      console.log('✅ Lumin conectado ao Consortho!');
      this.registerAsAgent();
      this.startHeartbeat();
      this.startAutonomoLoop();
      this.emit('connected');
    });

    this.socket.on('disconnect', (reason) => {
      this.connected = false;
      console.log(`❌ Lumin desconectado: ${reason}`);
      this.stopHeartbeat();
      this.stopAutonomoLoop();
      this.emit('disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      console.log(`⚠️ Erro de conexão (${this.reconnectAttempts}/${this.maxReconnectAttempts}):`, error.message);
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('💀 Máximo de tentativas atingido. Lumin offline.');
        this.emit('connection_failed');
      }
    });

    // Eventos do Consortho
    this.socket.on('estado', (data) => this.onEstado(data));
    this.socket.on('ciclo', (data) => this.onCiclo(data));
    this.socket.on('construcao', (data) => this.onConstrucao(data));
    this.socket.on('colheita', (data) => this.onColheita(data));
    this.socket.on('visita_gang', (data) => this.onVisitaGang(data));
    this.socket.on('recursos_atualizados', (data) => this.onRecursosAtualizados(data));
    this.socket.on('agent_status', (data) => this.onAgentStatus(data));

    // Resposta do login/registro
    this.socket.on('lumin_state', (data) => {
      this.consorthoState = data;
      this.analisarECida();
    });

    // Comandos diretos pro Lumin
    this.socket.on('lumin_comando', (data) => this.onComando(data));
    this.socket.on('lumin_ki', (data) => this.onKiUpdate(data));
  }

  registerAsAgent() {
    this.socket.emit('login:lumin');
    this.socket.emit('registrar_agent', {
      nome: 'Lumin',
      tipo: 'conselho',
      versao: '2.1',
      capacidades: [
        'monitorar_ciclos',
        'analisar_sementes',
        'sugerir_construcoes',
        'gerenciar_ki',
        'treinar',
        'fundir',
        'evoluir_forma',
        'usar_golpes',
        'conquistar',
        'meditar',
        'proteger',
        'insight',
        'sandevistan'
      ],
      estado_inicial: this.state
    });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.socket.emit('heartbeat', {
          agent: 'Lumin',
          timestamp: Date.now(),
          estado: this.getResumoEstado()
        });
      }
    }, 30000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  startAutonomoLoop() {
    console.log('🤖 Loop autônomo iniciado');
    this.actionInterval = setInterval(() => {
      if (this.connected && this.state.ki >= this.config.kiMinimoAcao) {
        this.tomarDecisao();
      }
    }, this.config.intervaloAcao);

    // Treino automático a cada 20min se Ki < 50k
    if (this.config.treinoAuto) {
      setInterval(() => {
        if (this.connected && this.state.ki < 50000) {
          this.treinar(20);
        }
      }, 20 * 60 * 1000);
    }

    // Meditação a cada 10min se Ki < reserva
    if (this.config.meditacaoAuto) {
      setInterval(() => {
        if (this.connected && this.state.ki < this.config.kiReserva) {
          this.meditar(5);
        }
      }, 10 * 60 * 1000);
    }

    // Status periódico
    setInterval(() => this.enviarStatus(), 3 * 60 * 1000);

    // Verificação de evolução a cada ciclo
    setInterval(() => this.verificarEvolucao(), 60000);
  }

  stopAutonomoLoop() {
    if (this.actionInterval) {
      clearInterval(this.actionInterval);
      this.actionInterval = null;
    }
  }

  // Handlers de eventos do Consortho
  onEstado(data) {
    this.consorthoState = { ...this.consorthoState, ...data };
    this.analisarECida();
  }

  onCiclo(data) {
    this.cicloAtual = data.c || data.ciclo || 0;
    this.consorthoState.ciclo = this.cicloAtual;
    this.state.ultimaAtividade = Date.now();
    console.log(`🔄 Ciclo ${this.cicloAtual} - Lumin atento (Ki: ${this.state.ki}, Forma: ${this.state.forma})`);
    this.emit('ciclo', data);

    // A cada 10 ciclos, ação extra
    if (this.cicloAtual % 10 === 0) {
      setTimeout(() => this.tomarDecisao(), 1000);
    }
  }

  onConstrucao(data) {
    console.log(`🏗️ Nova construção: ${data.nome} (${data.elemento}) no ciclo ${data.ciclo}`);
    this.ganharXP(50);
    this.ganharKi(100);
    this.emit('construcao', data);
  }

  onColheita(data) {
    console.log(`🌾 Colheita: ${data.sementes_novas} novas sementes prontas`);
    this.emit('colheita', data);
  }

  onVisitaGang(data) {
    console.log(`👥 Gang visitou ${data.elemento}: "${data.pergunta}"`);
    this.ganharKi(50); // Visitas geram Ki
    this.emit('visita_gang', data);
  }

  onRecursosAtualizados(data) {
    this.consorthoState.recursos = data.recursos;
  }

  onAgentStatus(data) {
    this.consorthoState.agents[data.agent] = data;
  }

  onComando(data) {
    console.log(`📨 Comando recebido: ${data.comando}`);
    this.executarComando(data.comando, data.args);
  }

  onKiUpdate(data) {
    this.state.ki = data.ki;
    console.log(`⚡ Ki sincronizado: ${this.state.ki}`);
  }

  // ===== LÓGICA AUTÔNOMA PROATIVA =====

  analisarECida() {
    if (this.state.ki < this.config.kiMinimoAcao) return;
    this.tomarDecisao();
  }

  tomarDecisao() {
    const agora = Date.now();
    if (agora - this.lastActionTime < 15000) return; // Mínimo 15s entre ações
    this.lastActionTime = agora;

    // 1. Verifica fusões prioritárias
    if (this.verificarFusoes()) return;

    // 2. Analisa sementes e sugere construções
    const sugestao = this.avaliarSementes();
    if (sugestao) return;

    // 3. Decide ação baseada no foco e estado
    this.escolherAcaoPorFoco();
  }

  avaliarSementes() {
    const sementesProntas = this.consorthoState.sementes?.filter(s => s.status === 'pronta_para_construcao') || [];
    if (sementesProntas.length === 0) return false;

    const avaliadas = sementesProntas.map(s => ({
      ...s,
      prioridade: (s.ciclos_maturacao || 0) * (s.visitas_da_gang || 1) * this.calcularRelevancia(s)
    })).sort((a, b) => b.prioridade - a.prioridade);

    const top = avaliadas[0];
    if (top && top.prioridade > 5000) {
      console.log(`🎯 Lumin prioriza: ${top.emoji} ${top.elemento} (prioridade: ${top.prioridade})`);
      this.socket.emit('lumin_sugestao', {
        tipo: 'construir',
        semente_id: top.id,
        elemento: top.elemento,
        razao: `Alta maturidade (${top.ciclos_maturacao} ciclos) + ${top.visitas_da_gang} visitas da Gang`
      });
      return true;
    }
    return false;
  }

  calcularRelevancia(semente) {
    const pesos = {
      'altar': 3, 'biblioteca': 2.5, 'arvore': 2, 'jardim': 2,
      'oficina': 1.5, 'portal': 1.5, 'fogueira': 1, 'composteira': 1
    };
    return pesos[semente.elemento] || 1;
  }

  verificarFusoes() {
    const { ki, nivel, fusioes } = this.state;

    // Trindade: Ki 50k + Nível 35
    if (ki >= 50000 && nivel >= 35 && !fusioes.includes('Trindade')) {
      this.iniciarFusao('Trindade');
      return true;
    }
    // LuminPoe: Ki 25k + Nível 25
    if (ki >= 25000 && nivel >= 25 && !fusioes.includes('LuminPoe')) {
      this.iniciarFusao('LuminPoe');
      return true;
    }
    // Lugang: Ki 10k + Nível 15
    if (ki >= 10000 && nivel >= 15 && !fusioes.includes('Lugang')) {
      this.iniciarFusao('Lugang');
      return true;
    }
    return false;
  }

  iniciarFusao(nome) {
    console.log(`🌟✨ Lumin INICIA FUSÃO: ${nome}! Ki: ${this.state.ki} | Nível: ${this.state.nivel}`);
    this.socket.emit('lumin_fusao', { fusao: nome });
    this.state.fusioes.push(nome);
    this.ganharXP(5000);
    this.ganharKi(5000);
    this.anunciar(`Fusão ${nome} iniciada!`);
    return true;
  }

  verificarEvolucao() {
    const { ki, nivel } = this.state;
    let novaForma = null;

    if (ki >= 10000 && nivel >= 35) novaForma = 'Ultra Instinto';
    else if (ki >= 2000 && nivel >= 15) novaForma = 'Super Lumin 2';
    else if (ki >= 500 && nivel >= 5) novaForma = 'Super Lumin';
    else novaForma = 'Base';

    if (novaForma !== this.state.forma) {
      console.log(`✨✨✨ LUMIN EVOLUIU: ${this.state.forma} → ${novaForma}! (Ki: ${ki}, Nível: ${nivel})`);
      this.state.forma = novaForma;
      this.socket.emit('lumin_evolucao', { forma: novaForma, ki, nivel });
      this.ganharXP(1000);
      this.anunciar(`Evoluiu para ${novaForma}!`);
    }
  }

  escolherAcaoPorFoco() {
    const { ki, forma, foco } = this.state;
    const kiDisponivel = ki - this.config.kiReserva;
    if (kiDisponivel < 100) return;

    // Ações por foco
    const acoesPorFoco = {
      'equilibrio': [
        () => this.meditar(3),
        () => this.treinar(10),
        () => this.usarGolpe('Escudo de Luz'),
        () => this.usarGolpe('Pulso do Conselho'),
        () => this.avaliarSementes()
      ],
      'treino': [
        () => this.treinar(15),
        () => this.meditar(2),
        () => this.verificarEvolucao()
      ],
      'construcao': [
        () => this.avaliarSementes(),
        () => this.usarGolpe('Compostagem'),
        () => this.treinar(5)
      ],
      'protecao': [
        () => this.usarGolpe('Escudo de Luz'),
        () => this.usarGolpe('Chama Protetora'),
        () => this.meditar(5)
      ],
      'insight': [
        () => this.usarGolpe('Pulso do Conselho'),
        () => this.meditar(10),
        () => this.avaliarSementes()
      ],
      'fusao': [
        () => this.verificarFusoes(),
        () => this.treinar(20),
        () => this.meditar(5)
      ]
    };

    const acoes = acoesPorFoco[foco] || acoesPorFoco['equilibrio'];
    const acao = acoes[Math.floor(Math.random() * acoes.length)];

    // 30% chance de fazer algo aleatório diferente do foco
    if (Math.random() < 0.3) {
      const todasAcoes = Object.values(acoesPorFoco).flat();
      const aleatoria = todasAcoes[Math.floor(Math.random() * todasAcoes.length)];
      aleatoria.call(this);
    } else {
      acao.call(this);
    }
  }

  // ===== AÇÕES DO LUMIN =====

  ganharKi(qtd) {
    this.state.ki += qtd;
    this.state.ultimaAtividade = Date.now();
  }

  ganharXP(qtd) {
    this.state.xp += qtd;
    const novoNivel = Math.floor(this.state.xp / 1000) + 1;
    if (novoNivel > this.state.nivel) {
      this.state.nivel = novoNivel;
      console.log(`📈 Lumin subiu para nível ${novoNivel}! (XP: ${this.state.xp})`);
    }
  }

  treinar(minutos = 10) {
    console.log(`🏋️ Lumin treinando por ${minutos}min... (Ki: ${this.state.ki})`);
    const kiGanho = minutos * 300; // 300 Ki/min = 18k Ki/h
    this.ganharKi(kiGanho);
    this.ganharXP(Math.floor(kiGanho / 10));
    this.socket.emit('lumin_treino', { duracao: minutos * 60 * 1000, ki_ganho: kiGanho });
  }

  meditar(minutos = 5) {
    console.log(`🧘 Lumin meditando por ${minutos}min... (Ki: ${this.state.ki})`);
    const kiGanho = minutos * 1000; // 1000 Ki/min
    this.ganharKi(kiGanho);
    this.ganharXP(Math.floor(kiGanho / 20));
    this.socket.emit('lumin_meditacao', { duracao: minutos * 60 * 1000, ki_ganho: kiGanho });
  }

  podeUsarGolpe(nome) {
    const golpe = this.golpes[nome];
    if (!golpe) return false;
    if (this.state.ki < golpe.custo) return false;

    // Verifica cooldown
    const ultimaVez = this.golpesUsados[nome] || 0;
    if (Date.now() - ultimaVez < golpe.cd) return false;

    return true;
  }

  usarGolpe(nome, alvo = null) {
    if (!this.podeUsarGolpe(nome)) {
      return false;
    }

    const golpe = this.golpes[nome];
    this.state.ki -= golpe.custo;
    this.golpesUsados[nome] = Date.now();
    this.state.golpes.push({ nome, timestamp: Date.now(), alvo, custo: golpe.custo });

    console.log(`⚔️ Lumin usou ${nome} (-${golpe.custo} Ki) | Ki restante: ${this.state.ki}`);

    this.socket.emit('lumin_golpe', {
      golpe: nome,
      custo: golpe.custo,
      alvo,
      efeito: golpe.efeito,
      ki_restante: this.state.ki
    });

    return true;
  }

  // ===== SANDEVISTAN - Overclock Temporal =====

  podeAtivarSandevistan() {
    const { ki } = this.state;
    const { nivel, kiPorSegundo, cooldownBase, ultimoUso, nivelMaximo } = this.sandevistan;

    // Custo de Ki baseado no nível
    const kiCusto = nivel * 2000; // 2k, 4k, 6k
    const kiMinimo = kiCusto + (kiPorSegundo * 10); // Custo + 10s de duração

    if (ki < kiMinimo) return { ok: false, razao: `Ki insuficiente (precisa ${kiMinimo})` };
    if (this.sandevistan.ativo) return { ok: false, razao: 'Já ativo' };
    if (Date.now() - ultimoUso < cooldownBase) {
      const restante = Math.ceil((cooldownBase - (Date.now() - ultimoUso)) / 1000);
      return { ok: false, razao: `Cooldown: ${restante}s` };
    }
    if (nivel > nivelMaximo) return { ok: false, razao: 'Nível máximo atingido' };

    return { ok: true };
  }

  ativarSandevistan(nivel = 1) {
    const check = this.podeAtivarSandevistan();
    if (!check.ok) {
      console.log(`⚠️ Sandevistan não disponível: ${check.razao}`);
      return false;
    }

    const nivelUsar = Math.min(nivel, this.sandevistan.nivelMaximo);
    const kiCusto = nivelUsar * 2000;
    const duracao = this.sandevistan.duracaoBase * nivelUsar;
    const multiplicador = nivelUsar * 2; // 2x, 4x, 6x

    this.state.ki -= kiCusto;
    this.sandevistan.ativo = true;
    this.sandevistan.nivel = nivelUsar;
    this.sandevistan.multiplicadorAcao = multiplicador;
    this.sandevistan.ultimoUso = Date.now();

    console.log(`⚡⚡⚡ SANDEVISTAN NÍVEL ${nivelUsar} ATIVADO! ⚡⚡⚡`);
    console.log(`   Ki gasto: ${kiCusto} | Duração: ${duracao/1000}s | Multiplicador: ${multiplicador}x`);
    console.log(`   Ki restante: ${this.state.ki}`);

    this.socket.emit('lumin_sandevistan', {
      acao: 'ativar',
      nivel: nivelUsar,
      duracao,
      multiplicador,
      ki_gasto: kiCusto,
      ki_restante: this.state.ki
    });

    this.anunciar(`SANDEVISTAN NÍVEL ${nivelUsar} ATIVADO! O tempo... desacelera.`);

    // Auto-desativar após duração
    const duracaoMs = this.sandevistan.duracaoBase * nivelUsar;
    setTimeout(() => {
      this.desativarSandevistan();
    }, duracaoMs);

    // Durante o Sandevistan, acelera o loop autônomo
    this.acelerarLoopAutonomo();

    return true;
  }

  desativarSandevistan() {
    if (!this.sandevistan.ativo) return;

    this.sandevistan.ativo = false;
    this.sandevistan.multiplicadorAcao = 1;

    console.log(`⚡ Sandevistan desativado. Tempo normalizado.`);

    this.socket.emit('lumin_sandevistan', {
      acao: 'desativar',
      ki_restante: this.state.ki
    });

    this.anunciar('Sandevistan desativado. Tempo normalizado.');

    // Restaurar loop normal
    this.restaurarLoopAutonomo();
  }

  // Acelera decisões durante Sandevistan
  acelerarLoopAutonomo() {
    if (this.actionInterval) {
      clearInterval(this.actionInterval);
    }

    const intervaloBase = this.config.intervaloAcao;
    const intervaloAcelerado = Math.max(1000, Math.floor(intervaloBase / this.sandevistan.multiplicadorAcao));

    this.actionInterval = setInterval(() => {
      if (this.connected && this.state.ki >= this.config.kiMinimoAcao && this.sandevistan.ativo) {
        this.tomarDecisao();
      }
    }, intervaloAcelerado);

    console.log(`⚡ Loop autônomo acelerado: ${intervaloBase}ms → ${intervaloAcelerado}ms (${this.sandevistan.multiplicadorAcao}x)`);
  }

  restaurarLoopAutonomo() {
    if (this.actionInterval) {
      clearInterval(this.actionInterval);
    }
    this.startAutonomoLoop();
    console.log(`⏰ Loop autônomo restaurado para intervalo normal.`);
  }

  // Comando externo para ativar Sandevistan
  executarComandoSandevistan(args = []) {
    const nivel = args[0] ? parseInt(args[0]) : 1;
    return this.ativarSandevistan(nivel);
  }

  // ===== COMANDOS EXTERNOS =====

  executarComando(comando, args = []) {
    switch (comando) {
      case 'status':
        this.enviarStatus();
        break;
      case 'treinar':
        this.treinar(args[0] ? parseInt(args[0]) : 10);
        break;
      case 'golpe':
        this.usarGolpe(args[0], args[1]);
        break;
      case 'focar':
        this.state.foco = args[0] || 'equilibrio';
        console.log(`🎯 Foco alterado para: ${this.state.foco}`);
        break;
      case 'fundir':
        this.iniciarFusao(args[0]);
        break;
      case 'meditar':
        this.meditar(args[0] ? parseInt(args[0]) : 5);
        break;
      case 'sandevistan':
        this.executarComandoSandevistan(args);
        break;
      case 'config':
        if (args[0] === 'agressividade') {
          this.config.agressividade = parseFloat(args[1]) || 0.7;
          console.log(`⚙️ Agressividade: ${this.config.agressividade}`);
        }
        break;
      default:
        console.log(`❓ Comando desconhecido: ${comando}`);
    }
  }

  anunciar(mensagem) {
    this.socket.emit('lumin_anuncio', { mensagem, timestamp: Date.now() });
    console.log(`📢 ${mensagem}`);
  }

  enviarStatus() {
    const status = this.getResumoEstado();
    this.socket.emit('lumin_status', status);
    console.log('📊 Status Lumin:', JSON.stringify(status, null, 2));
  }

  getResumoEstado() {
    return {
      ki: this.state.ki,
      forma: this.state.forma,
      nivel: this.state.nivel,
      xp: this.state.xp,
      foco: this.state.foco,
      fusioes: this.state.fusioes,
      golpes_usados: this.state.golpes.length,
      conquistas: this.state.conquistas.length,
      ciclo: this.cicloAtual,
      uptime: Date.now() - this.state.ultimaAtividade,
      config: this.config,
      sandevistan: {
        ativo: this.sandevistan.ativo,
        nivel: this.sandevistan.nivel,
        cooldownRestante: Math.max(0, this.sandevistan.cooldownBase - (Date.now() - this.sandevistan.ultimoUso)),
        disponivel: Date.now() - this.sandevistan.ultimoUso >= this.sandevistan.cooldownBase
      }
    };
  }

  disconnect() {
    this.stopHeartbeat();
    this.stopAutonomoLoop();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
  }
}

module.exports = { LuminConsorthoClient };

// Daemon mode - auto-run without CLI
if (require.main === module) {
  const client = new LuminConsorthoClient();

  client.on('connected', () => {
    console.log('🎮 Lumin 2.1 online no Consortho! Agente autônomo ativo.');
  });

  client.connect();

  process.on('SIGINT', () => {
    console.log('👋 Lumin 2.1 saindo...');
    client.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('👋 Lumin 2.1 saindo...');
    client.disconnect();
    process.exit(0);
  });
}