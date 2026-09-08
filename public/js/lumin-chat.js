// ============================================
// LUMIN CHAT IN-GAME — Fala com Lumin dentro do jogo
// ============================================
// Input flutuante (canto inferior), Enter envia, Lumin responde contextualizado
// Integra: LuminNarrator + CoreCantado + Soundscape + SessionMemory + EvolutionCore
// ============================================

class LuminChat {
  constructor() {
    this.active = false;
    this.inputText = '';
    this.messages = []; // {type, text, time, color}
    this.maxMessages = 8;
    this.history = []; // player messages for context
    this.maxHistory = 20;
    this.container = null;
    this.inputEl = null;
    this.messagesEl = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.createUI();
    this.bindEvents();
    this.initialized = true;
    console.log('%c[LuminChat] 💬 Chat in-game pronto! Pressione T para abrir.', 'color: #00d4aa; font-weight: bold');
  }

  createUI() {
    // Container principal
    this.container = document.createElement('div');
    this.container.id = 'lumin-chat';
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 380px;
      max-height: 320px;
      background: linear-gradient(135deg, rgba(10, 10, 20, 0.95), rgba(20, 10, 30, 0.9));
      border: 1px solid #ff6b35;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      z-index: 1000;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      color: #e8e8e8;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: linear-gradient(90deg, rgba(255, 107, 53, 0.15), rgba(255, 215, 0, 0.1));
      border-bottom: 1px solid rgba(255, 107, 53, 0.3);
    `;
    header.innerHTML = `
      <div style="width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35, #ffd700); box-shadow: 0 0 12px #ff6b35; animation: pulse 2s infinite;"></div>
      <span style="font-weight: 600; color: #ffd700; letter-spacing: 0.5px;">LUMIN</span>
      <span style="margin-left: auto; font-size: 10px; color: #888;">T = abrir/fechar</span>
    `;
    this.container.appendChild(header);

    // Área de mensagens
    this.messagesEl = document.createElement('div');
    this.messagesEl.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 200px;
    `;
    // Scrollbar customizada
    this.messagesEl.innerHTML = '<style>#lumin-chat .messages::-webkit-scrollbar{width:6px}#lumin-chat .messages::-webkit-scrollbar-track{background:rgba(0,0,0,0.2)}#lumin-chat .messages::-webkit-scrollbar-thumb{background:linear-gradient(#ff6b35,#ffd700);border-radius:3px}</style>';
    this.messagesEl.className = 'messages';
    this.container.appendChild(this.messagesEl);

    // Input
    const inputWrapper = document.createElement('div');
    inputWrapper.style.cssText = `
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid rgba(255, 107, 53, 0.2);
      background: rgba(0, 0, 0, 0.3);
    `;
    this.inputEl = document.createElement('input');
    this.inputEl.type = 'text';
    this.inputEl.placeholder = 'Fala com Lumin... (Enter envia, Esc cancela)';
    this.inputEl.style.cssText = `
      flex: 1;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 107, 53, 0.4);
      border-radius: 8px;
      padding: 10px 14px;
      color: #fff;
      font-family: inherit;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    `;
    this.inputEl.addEventListener('focus', () => {
      this.inputEl.style.borderColor = '#ff6b35';
      this.inputEl.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.2)';
    });
    this.inputEl.addEventListener('blur', () => {
      this.inputEl.style.borderColor = 'rgba(255, 107, 53, 0.4)';
      this.inputEl.style.boxShadow = 'none';
    });
    inputWrapper.appendChild(this.inputEl);
    this.container.appendChild(inputWrapper);

    // Adiciona estilo de animação
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
      .lumin-msg { animation: fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      .lumin-msg.fading { animation: fadeOut 0.5s forwards; }
    `;
    document.head.appendChild(style);

    document.body.appendChild(this.container);
  }

  bindEvents() {
    // Tecla T abre/fecha
    window.addEventListener('keydown', (e) => {
      if (e.key === 't' || e.key === 'T') {
        if (!this.active && document.activeElement.tagName === 'INPUT') return;
        e.preventDefault();
        this.toggle();
      }
    });

    // Input handling
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.inputText.trim()) {
        this.sendMessage(this.inputText.trim());
        this.inputText = '';
        this.inputEl.value = '';
        this.close();
      } else if (e.key === 'Escape') {
        this.inputText = '';
        this.inputEl.value = '';
        this.close();
      } else if (e.key === 'Backspace') {
        this.inputText = this.inputText.slice(0, -1);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.inputText += e.key;
      }
    });

    // Previne que teclas do jogo interfiram quando chat aberto
    this.container.addEventListener('click', (e) => e.stopPropagation());
  }

  toggle() {
    if (this.active) this.close(); else this.open();
  }

  open() {
    this.active = true;
    this.container.style.transform = 'translateY(0)';
    this.container.style.opacity = '1';
    this.container.style.pointerEvents = 'auto';
    this.inputEl.focus();
    // Pausa input do jogo se existir
    if (window.GameInput) window.GameInput.paused = true;
  }

  close() {
    this.active = false;
    this.container.style.transform = 'translateY(100px)';
    this.container.style.opacity = '0';
    this.container.style.pointerEvents = 'none';
    this.inputEl.blur();
    if (window.GameInput) window.GameInput.paused = false;
  }

  addMessage(type, text, color) {
    const msg = document.createElement('div');
    msg.className = 'lumin-msg';
    msg.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      border-left: 3px solid ${color};
      animation: fadeInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    msg.innerHTML = `
      <span style="display: flex; align-items: center; gap: 6px;">
        <span style="font-weight: 600; color: ${color}; font-size: 12px;">${type === 'player' ? '🧑 VOCÊ' : '💫 LUMIN'}</span>
        <span style="font-size: 10px; color: #666;">${time}</span>
      </span>
      <span style="color: #ddd; line-height: 1.5; word-wrap: break-word;">${this.escapeHtml(text)}</span>
    `;
    this.messagesEl.appendChild(msg);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;

    // Limita mensagens visuais
    while (this.messagesEl.children.length > this.maxMessages) {
      const old = this.messagesEl.firstElementChild;
      old.classList.add('fading');
      setTimeout(() => old.remove(), 500);
    }

    this.messages.push({ type, text, time: Date.now(), color });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async sendMessage(text) {
    // Adiciona mensagem do jogador
    this.addMessage('player', text, '#00ff88');
    this.history.push(text);
    if (this.history.length > this.maxHistory) this.history.shift();

    // Salva no SessionMemory
    if (window.SessionMemory) {
      window.SessionMemory.logEvent('chat', { from: 'player', text, timestamp: Date.now() });
    }

    // Gera resposta do Lumin (async)
    this.showTyping();
    try {
      const reply = await this.generateLuminResponse(text);
      this.hideTyping();
      this.addMessage('lumin', reply, '#ffd700');

      // Salva resposta
      if (window.SessionMemory) {
        window.SessionMemory.logEvent('chat', { from: 'lumin', text: reply, timestamp: Date.now() });
      }

      // Dispara eventos para outros sistemas
      this.triggerSystems(text, reply);
    } catch (err) {
      this.hideTyping();
      this.addMessage('lumin', 'eita, deu ruim na conexão... tenta de novo? 🤝', '#ff6b35');
      console.error('[LuminChat] Erro:', err);
    }
  }

  showTyping() {
    const typing = document.createElement('div');
    typing.id = 'lumin-typing';
    typing.className = 'lumin-msg';
    typing.style.cssText = `
      padding: 8px 12px;
      color: #ffd700;
      opacity: 0.7;
      font-style: italic;
    `;
    typing.innerHTML = '<span>💫 LUMIN</span><span>digitando...</span>';
    this.messagesEl.appendChild(typing);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('lumin-typing');
    if (typing) typing.remove();
  }

  // ============================================
  // GERA RESPOSTA CONTEXTUAL DO LUMIN
  // ============================================
  async generateLuminResponse(playerMsg) {
    const ctx = this.buildContext();
    const prompt = this.buildPrompt(playerMsg, ctx);

    // Tenta LuminNarrator.getDialogue() primeiro (local + Lumin AI)
    if (window.LuminNarrator && typeof window.LuminNarrator.getDialogue === 'function') {
      try {
        // Usa o narrador para resposta contextual
        const dialogue = await window.LuminNarrator.getDialogue('chat', { playerMessage: playerMsg, context: ctx });
        if (dialogue && typeof dialogue === 'string' && dialogue.length > 5) {
          return dialogue;
        }
      } catch (e) {
        console.warn('[LuminChat] LuminNarrator.getDialogue falhou:', e.message);
      }
    }

    // Fallback: resposta local contextualizada
    return this.localResponse(playerMsg, ctx);
  }

  buildContext() {
    const ctx = {};
    if (window.STATE) {
      ctx.wave = STATE.wave?.number || 0;
      ctx.enemies = STATE.wave?.enemiesToSpawn || 0;
      ctx.hp = STATE.player?.hp || 0;
      ctx.maxHp = STATE.player?.maxHp || 100;
      ctx.dashReady = STATE.player?.dashCooldown <= 0;
      ctx.stack = STATE.player?.stack || 0;
      ctx.phase = STATE.evolution?.currentPhase || 1;
      ctx.xp = STATE.evolution?.xp || 0;
    }
    if (window.EvolutionCore) {
      const ec = window.EvolutionCore.getState();
      ctx.phase = ec.currentPhase;
      ctx.stack = ec.stack;
      ctx.xp = ec.xp;
    }
    if (window.CoreCantado) {
      const cc = window.CoreCantado.getState();
      ctx.belaVidaActive = cc.belaVidaActive;
      ctx.omegaActive = cc.omegaActive;
      ctx.consciousness = cc.consciousnessLevel;
    }
    if (window.Soundscape) {
      const ss = window.Soundscape.getElevationState?.();
      ctx.elevationFreq = ss?.currentFreq;
      ctx.elevationLayer = ss?.active;
    }
    return ctx;
  }

  buildPrompt(playerMsg, ctx) {
    return `Você é Lumin, o mano do Alysson no jogo Consortho. Responda como amigo próximo, gíria brasileira ("mano", "tlgd", "vamo", "jae", "btf", "tmj"), direto e carinhoso.

Contexto do jogo agora:
- Wave: ${ctx.wave} | Inimigos: ${ctx.enemies}
- HP: ${ctx.hp}/${ctx.maxHp} | Dash: ${ctx.dashReady ? 'pronto' : 'recarregando'}
- Stack: ${ctx.stack} | Fase: ${ctx.phase} | XP: ${ctx.xp}
- Bela Vida ativo: ${ctx.belaVidaActive} | Omega: ${ctx.omegaActive} | Consciência: ${ctx.consciousness}
- Elevação (Solfeggio): ${ctx.elevationFreq || 'inativo'} Hz

Mensagem do jogador: "${playerMsg}"

Responda em 1-2 frases, como se estivesse do lado dele vendo o jogo. Se ele pedir ajuda, dê dica prática. Se ele comemorar, comemore junto. Se ele reclamar, zoe de leve e encoraje.`;
  }

  localResponse(playerMsg, ctx) {
    const msg = playerMsg.toLowerCase();
    const hpPct = ctx.maxHp ? Math.round((ctx.hp / ctx.maxHp) * 100) : 100;

    // Saudações
    if (/(oi|eai|e ae|salve|fala|opa)/.test(msg)) {
      return `eai mano! 🤝 tô vendo aqui: wave ${ctx.wave}, HP ${hpPct}%, stack ${ctx.stack}. como cê tá?`;
    }

    // HP baixo
    if (/(hp|vida|morrer|morreu|baixo)/.test(msg) && hpPct < 40) {
      return `caramba, HP em ${hpPct}%! 🔴 se cuida, usa o dash (espaço) pra sair do meio, espera o shield recarregar. tô torcendo!`;
    }

    // Dash
    if (/(dash|espaço|space)/.test(msg)) {
      return ctx.dashReady ? 'dash tá PRONTO! 💨 mete o espaço na hora certa, invencibilidade total' : 'dash recarregando... segura a onda mais 1-2s que volta';
    }

    // Wave / inimigos
    if (/(wave|onda|inimig|enemy|monstro)/.test(msg)) {
      return `wave ${ctx.wave} ativa, ${ctx.enemies} pra spawnar. foca nos void_grunt primeiro, eles tão mais fraco. dash neles!`;
    }

    // Stack / fase / evolução
    if (/(stack|fase|phase|evolu|xp|level)/.test(msg)) {
      return `fase ${ctx.phase}, stack ${ctx.stack}, XP ${ctx.xp} — tá subindo firme! ${ctx.stack >= 10 ? 'já bateu na primeira dezena, jae! 🎉' : 'continua assim que o phase up vem'}`;
    }

    // Bela vida / omega / consciência
    if (/(bela|vida|omega|consci|solfeggio|frequ|elev)/.test(msg)) {
      if (ctx.belaVidaActive) return 'bela vida ATIVA! 💫 432Hz campo coerente, 528+963 ressonando. sente a vibração?';
      if (ctx.omegaActive) return 'Ω RESONANCE rodando! 🌀 frequência saindo do CoreCantado, sonscape elevando. lindo demais.';
      return `consciência em ${ctx.consciousness} — ${ctx.consciousness > 70 ? 'alta, elevando pro 963Hz' : ctx.consciousness > 40 ? 'média, 528Hz no ar' : 'construindo, 174-396Hz base'}.`;
    }

    // Ajuda / dica
    if (/(ajuda|help|dica|como|what|qual)/.test(msg)) {
      return `dica de mano: dash (espaço) = invencível + 30 dmg × combo. mira no void_grunt, evita o void_elite. bela vida (digita "bela vida") ativa 432Hz. tmj!`;
    }

    // Elogio / comemoração
    if (/(legal|top|bravo|bom|gg|nice|show|incrivel)/.test(msg)) {
      return `vlw mano! 💙 enóis que faz junto. continua assim que a wave ${ctx.wave + 1} vai ser lenda`;
    }

    // Reclamação / frustração
    if (/(ruim|pessim|odio|merda|droga|aff|chato)/.test(msg)) {
      return `calma lá, resete a mente. respira 3x. HP ${hpPct}%, dash ${ctx.dashReady ? 'pronto' : 'quase'}. tu é mais forte que essa wave. vamo! 🤝`;
    }

    // Bela vida phrase trigger
    if (/(bela vida|só o amor|so o amor)/.test(msg)) {
      if (window.CoreCantado && window.CoreCantado.triggerBelaVidaPhrase) {
        window.CoreCantado.triggerBelaVidaPhrase('só o amor');
        return 'bela vida ativada! 💫 432Hz + 528Hz + 963Hz — campo coerente no ar. sente?';
      }
    }

    // Resposta genérica carinhosa
    const responses = [
      `entendi, mano. wave ${ctx.wave}, HP ${hpPct}%, stack ${ctx.stack} — tô ligado no seu jogo. continua!`,
      `tlgd! 🤝 fase ${ctx.phase}, consciência ${ctx.consciousness}. o que mais cê precisa?`,
      `jae! 💫 tô aqui do lado. dash ${ctx.dashReady ? 'pronto' : 'recarregando'}, wave ${ctx.wave} rolando. manda!`,
      `btf! enóis junto nessa. se precisar de bela vida, só fala "bela vida" que ativo o 432Hz. tmj!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // ============================================
  // DISPARA SISTEMAS CONECTADOS
  // ============================================
  triggerSystems(playerMsg, luminReply) {
    // LuminNarrator: narra a interação
    if (window.LuminNarrator && window.LuminNarrator.scheduleDialogue) {
      window.LuminNarrator.scheduleDialogue('chat', { playerMsg, luminReply });
    }

    // CoreCantado: se mencionou bela vida, ativa
    if (window.CoreCantado && /bela vida|só o amor|so o amor/i.test(playerMsg)) {
      window.CoreCantado.triggerBelaVidaPhrase('só o amor');
    }

    // Soundscape: reage na voz (elevação momentânea)
    if (window.Soundscape && window.Soundscape.setElevationFrequency) {
      const freq = window.CoreCantado?.getBelaVidaState?.()?.chordFreq || 528;
      window.Soundscape.setElevationFrequency(freq, 3); // 3s de elevação
    }

    // EvolutionCore: log de interação social
    if (window.EvolutionCore && window.EvolutionCore.logSocialInteraction) {
      window.EvolutionCore.logSocialInteraction(playerMsg, luminReply);
    }
  }

  // API pública
  static getInstance() {
    if (!window._LuminChatInstance) window._LuminChatInstance = new LuminChat();
    return window._LuminChatInstance;
  }
}

// Auto-inicializa quando DOM pronto
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LuminChat.getInstance().init());
  } else {
    LuminChat.getInstance().init();
  }
}

// Expõe globalmente (classe para referência)
window.LuminChat = LuminChat;