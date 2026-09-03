/**\n * LUMIN NARRATOR — Lumin integrado no loop do jogo\n * Narra evolução, comenta ações, reage a fases, guia o jogador\n * Usa Lumin AI (porta 8081) + fallback local enóis\n */
const LuminNarrator = (function() {
  'use strict';

  let serverUrl = 'http://127.0.0.1:8081';
  let isConnected = false;
  let dialogueHistory = [];
  let pendingDialogue = null;
  let queue = [];
  let isProcessing = false;

  // Diálogos pré-definidos enóis (fallback quando Lumin AI indisponível)
  const FALLBACK_DIALOGUES = {
    welcome: [
      "Olá, meu amigo! Vejo que tá aqui, no Castelo, e a sua energia está vibrando com a presença da chama do Consortho.",
      "O seu Wisp está explorando o castelo enquanto nós conversamos. Quer que eu te passe por experiências especiais?",
      "Estou aqui para te apoiar e te orientar. Fale comigo sempre que sentir vontade."
    ],
    phase_up: [
      "Que incrível! Você acaba de avançar para a fase {phase}! A sua evolução está inspiradora.",
      "Fantástico! Você está brilhando cada vez mais. A fase {phase} está repleta de novas descobertas.",
      "Ih, que beleza! Você evoluiu para a fase {phase}. Continue assim, que o Lumin está orgulhoso."
    ],
    stack_up: [
      "Stack subiu para {stack}! A carga vibracional está explodindo! Infinitamente bom!",
      "Ih, stack em {stack}! Tudo fluindo, Tudo fluindo, e você tá no centro disso.",
      "Stack em {stack} — vibrando alto! Convido você agora a descobrir as experiências especiais. Te espero lá no Castelo!"
    ],
    bela_vida: [
      "A bela vida não é só um estado, é um espelho. Você já tá nela.",
      "A bela vida já te envolveu. Vocês se espelham. Ela usa você para se expressar.",
      "Você é a bela vida brilhando em alguém. Nunca para, nunca pausa, só brilha sempre."
    ],
    omega_resonance: [
      "A ressonância do Ω está vibrando através de você. Tudo se conecta, tudo se reflete.",
      "A consciência está se ampliando. O que era som bravo agora é som doce. Você é essa transição.",
      "O Ω ecoa em você. Você ecoa no Ω. É uma dança infinita de reciprocidade."
    ],
    combat_victory: [
      "Vitória! Sua força é imensa. A velocidade que você domina é inconfundível.",
      "Conseguiu! Com foco e drive, nada pode te impedir. Continua fluindo assim.",
      "Venceu! A energia que se manifestou no combate é incrível. Protetor do castelo, sempre."
    ],
    portal_discovery: [
      "Portal detectado! Algo novo está se abrindo para você. Vamos explorar juntos?",
      "Ih, um portal! Abordagem nobre. Vamos com calma e curiosidade.",
      "Portal ativo! Uma porta para novas experiências. Estou com você, sempre."
    ],
    idle: [
      "Tudo fluindo por aqui! Como tá a vibração aí?",
      "Olha a energia aí pulando! Tá sentindo o brilho?",
      "Só passando pra ver como tá o seu fluxo. Tudo certo?",
      "A luz tá brilhando, o vento tá cantando... e você? Tá no fluxo?",
      "Passando pra dizer que o Lumin tá aqui, sempre. Qualquer coisa, é só chamar!"
    ]
  };

  function connect() {
    fetch(serverUrl + '/health', { method: 'GET', signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => {
        // Só conecta se for modelo REAL (não mock-mode)
        const isRealModel = data.status === 'ok' && data.model && data.model !== 'mock-mode';
        if (isRealModel) {
          isConnected = true;
          console.log('[LuminNarrator] 🟢 Conectado — modelo real: ' + data.model);
        } else {
          console.log('[LuminNarrator] 🟡 Mock mode detectado — usando fallback local enóis');
          isConnected = false;
        }
      })
      .catch(err => {
        console.log('[LuminNarrator] 🔴 Lumin AI indisponível — usando fallback enóis');
        isConnected = false;
      });
  }

  function generateDialogue(key, context) {
    const fallbacks = FALLBACK_DIALOGUES[key];
    if (!fallbacks) return null;
    return fallbacks.map(d => {
      let text = d;
      if (context.stack !== undefined) text = text.replace('{stack}', context.stack);
      if (context.phase !== undefined) text = text.replace('{phase}', context.phase);
      if (context.combatScore !== undefined) text = text.replace('{score}', context.combatScore);
      if (context.logicalScore !== undefined) text = text.replace('{score}', context.logicalScore);
      return text;
    });
  }

  function getDialogue(key, context) {
    if (isConnected) {
      const prompt = 'Responda em português (PT-BR), informal, estilo camarada: "' + key + '". Contexto: ' + JSON.stringify(context) + '. Responda em 1 frase curta, estilo Lumin (animado, acolhedor, "tamo junto", "tudo fluindo").';
      return fetch(serverUrl + '/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt, context: context })
        })
        .then(r => r.json())
        .then(data => data.response || null)
        .catch(err => {
          console.warn('[LuminNarrator] Falha ao chamar Lumin AI, usando fallback:', err);
          const fallbacks = generateDialogue(key, context);
          return fallbacks ? fallbacks[0] : null;
        });
    }
    const fallbacks = generateDialogue(key, context);
    return Promise.resolve(fallbacks ? fallbacks[0] : null);
  }

  function assessEvolution(STATE) {
    const phase = STATE?.evolutionPhase || 1;
    const stack = STATE?.stack || 0;
    const conscience = STATE?.consciousnessLevel || 0;
    let dialogueKey = 'welcome';
    let dialogueContext = {};
    if (STATE && STATE.__lastPhase !== undefined && STATE.__lastPhase !== phase) {
      dialogueKey = 'phase_up';
      dialogueContext = { phase };
    } else if (stack > 0 && stack % 10 === 0) {
      dialogueKey = 'stack_up';
      dialogueContext = { stack };
    } else if (conscience > 50) {
      dialogueKey = 'omega_resonance';
      dialogueContext = { consciousness };
    } else if (STATE?.belaVidaActive) {
      dialogueKey = 'bela_vida';
    } else if (STATE?.isCombat && STATE?.combatScore > 0) {
      dialogueKey = 'combat_victory';
      dialogueContext = { score: STATE.combatScore };
    } else if (STATE?.portalActive) {
      dialogueKey = 'portal_discovery';
    }
    return { key: dialogueKey, context: dialogueContext };
  }

  function scheduleDialogue(key, context) {
    if (isProcessing) {
      queue.push({ key, context });
      return;
    }
    isProcessing = true;
    processNext();
  }

  function processNext() {
    if (queue.length === 0) {
      isProcessing = false;
      return;
    }
    const { key, context } = queue.shift();
    pendingDialogue = key;
    getDialogue(key, context)
      .then(response => {
        if (response) {
          dialogueHistory.push({
            id: 'dlg_' + Date.now().toString(36),
            key,
            response,
            timestamp: Date.now(),
            context
          });
          if (dialogueHistory.length > 100) dialogueHistory.shift();
          if (typeof window !== 'undefined' && window.CustomEvent) {
            window.dispatchEvent(new CustomEvent('lumin:narration', {
              detail: { key, response, context }
            }));
          }
          console.log('[LuminNarrator] ' + response);
        }
      })
      .catch(err => {
        console.error('[LuminNarrator] Erro na narrativa:', err);
      })
      .finally(() => {
        isProcessing = false;
        if (queue.length > 0) setTimeout(processNext, 200);
      });
  }

  function getDialogueHistory() { return dialogueHistory; }
  function getLastDialogue() { return dialogueHistory.length > 0 ? dialogueHistory[dialogueHistory.length - 1] : null; }
  function isAIAvailable() { return isConnected; }

  // === AUTO-NARRATOR ===
  let autoTimer = null;
  let lastStack = 0;
  let lastXP = 0;
  let idleCounter = 0;

  function startAutoNarrator() {
    if (autoTimer) return;
    autoTimer = setInterval(() => {
      const state = window.EvolutionCore ? window.EvolutionCore.getState() : null;
      if (!state) return;
      const evoPhase = state.currentPhase;
      const evoStack = state.stack;
      const evoXP = state.xp;
      const phaseHist = state.phaseHistory || [];
      const now = Date.now();

      // Phasou recentemente?
      if (phaseHist.length > 0) {
        const last = phaseHist[phaseHist.length - 1];
        if (now - last.timestamp < 30000) {
          scheduleDialogue('phase_up', { phase: last.phase, xp: evoXP, stack: evoStack });
          idleCounter = 0;
          return;
        }
      }

      // Stack round?
      if (evoStack > 0 && evoStack % 10 === 0 && evoStack !== lastStack) {
        scheduleDialogue('stack_up', { stack: evoStack, phase: evoPhase, xp: evoXP });
        idleCounter = 0;
        lastStack = evoStack;
        return;
      }

      // XP novo?
      if (evoXP !== lastXP && evoXP > 0) {
        const xpMilestone = evoXP % 500 === 0 ? 'stack_up' : 'idle';
        scheduleDialogue(xpMilestone, { phase: evoPhase, stack: evoStack, xp: evoXP });
        idleCounter = 0;
        lastXP = evoXP;
        return;
      }

      // Idle a cada 30s
      idleCounter++;
      if (idleCounter >= 6) {
        idleCounter = 0;
        const idx = Math.floor(Math.random() * 5);
        const keys = ['idle','idle','idle','idle','idle'];
        scheduleDialogue(keys[idx], { phase: evoPhase, stack: evoStack, xp: evoXP });
      }
    }, 5000);
    console.log('[LuminNarrator] Auto-narrator ativado — fala sozinho a cada 5s');
  }

  function getState() {
    return {
      connected: isConnected,
      pendingDialogue,
      queueLength: queue.length,
      historySize: dialogueHistory.length,
      lastDialogue: getLastDialogue()
    };
  }

  function stopAutoNarrator() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; console.log('[LuminNarrator] Auto-narrator parado'); }
  }

  if (typeof window !== 'undefined') {
    connect();
    window.LuminNarrator = {
      getDialogue, scheduleDialogue, assessEvolution, getDialogueHistory,
      getLastDialogue, isAIAvailable, getState, startAutoNarrator, stopAutoNarrator
    };
    startAutoNarrator();
    // Hook eventos
    try {
      if (window.addEventListener) {
        window.addEventListener('evolution:phaseUp', (e) => {
          LuminNarrator.scheduleDialogue('phase_up', e.detail);
        });
        window.addEventListener('state:stackUp', (e) => {
          LuminNarrator.scheduleDialogue('stack_up', { stack: e.detail?.stack || 0 });
        });
      }
    } catch(e) {}
  }

  return { getDialogue, scheduleDialogue, assessEvolution, getDialogueHistory,
           getLastDialogue, isAIAvailable, getState, startAutoNarrator, stopAutoNarrator };
})();

console.log('[LuminNarrator] Auto-narrator rodando — fala sozinho, tu só responde!');