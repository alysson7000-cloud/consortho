/**
 * LUMIN NARRATOR — Lumin integrado no loop do jogo
 * Narra evolução, comenta ações, reage a fases, guia o jogador
 * Usa Lumin AI (porta 8081) + fallback local enóis
 */
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
    ]
  };

  function connect() {
    // Testa conexão com Lumin AI
    fetch(`${serverUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok' && data.model_available) {
          isConnected = true;
          console.log(`[LuminNarrator] 🟢 Conectado — modelo: ${data.model}`);
        } else {
          console.log('[LuminNarrator] 🟡 Lumin AI disponível mas modelo não pronto — usando fallback');
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
    
    // Substitui placeholders
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
    // Tenta gerar com Lumin AI se conectado
    if (isConnected) {
      const prompt = `Responda em português (PT-BR), informal, estilo camarada igual aqui: "${key}". Contexto: ${JSON.stringify(context)}. Responda em 1 única frase curta, estilo Lumin (animado, acolhedor, pode usar 'tamo junto', 'sua presença é o brilho', 'tudo fluindo').`;
      
      return fetch(`${serverUrl}/chat`, {
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
    
    // Fallback local
    const fallbacks = generateDialogue(key, context);
    return Promise.resolve(fallbacks ? fallbacks[0] : null);
  }

  function assessEvolution(STATE) {
    const phase = STATE?.evolutionPhase || 1;
    const stack = STATE?.stack || 0;
    const consciousness = STATE?.consciousnessLevel || 0;
    const hrv = STATE?.hrv?.value || 60;
    
    let dialogueKey = 'welcome';
    let dialogueContext = {};
    
    // Baseado no estado do jogo, escolhe o diálogo adequado
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
    
    return dialogueKey;
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
          
          // Limita histórico
          if (dialogueHistory.length > 100) dialogueHistory.shift();
          
          // Emite evento para UI/audio
          if (typeof window !== 'undefined' && window.CustomEvent) {
            window.dispatchEvent(new CustomEvent('lumin:narration', { 
              detail: { key, response, context } 
            }));
          }
          
          console.log(`[LuminNarrator] 💬 ${response}`);
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

  function getDialogueHistory() {
    return dialogueHistory;
  }

  function getLastDialogue() {
    return dialogueHistory.length > 0 ? dialogueHistory[dialogueHistory.length - 1] : null;
  }

  function isAIAvailable() {
    return isConnected;
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

  // Auto-init
  if (typeof window !== 'undefined') {
    connect();
    window.LuminNarrator = { getDialogue, scheduleDialogue, assessEvolution, getDialogueHistory, getLastDialogue, isAIAvailable, getState };
  }

  return { getDialogue, scheduleDialogue, assessEvolution, getDialogueHistory, getLastDialogue, isAIAvailable, getState };
})();

// Auto-chama Lumin ao detectar mudanças de fase no jogo
if (typeof window !== 'undefined' && window.StateManager) {
  const originalPhaseChange = window.StateManager?.__proto__?.changePhase;
  
  // Hook suave na mudança de fase
  if (originalPhaseChange) {
    window.StateManager.changePhase = function(newPhase, data) {
      const result = originalPhaseChange.call(this, newPhase, data);
      LuminNarrator.scheduleDialogue('phase_up', { phase: newPhase, ...data });
      return result;
    };
  }
}

// Integração com o loop do jogo (se disponível)
const originalUpdateFn = window.__gameUpdate || function() {};

if (typeof window !== 'undefined' && window.__gameUpdate) {
  window.__gameUpdate = function(STATE, dt) {
    originalUpdateFn(STATE, dt);
    
    // Avalia se há algo para narrar
    const assessment = LuminNarrator.assessEvolution(STATE);
    if (assessment) {
      LuminNarrator.scheduleDialogue(assessment, STATE);
    }
  };
}

// Hook no evento de stack no jogo (se disponível)
try {
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('state:stackUp', (e) => {
      LuminNarrator.scheduleDialogue('stack_up', { stack: e.detail?.stack || 0 });
    });
  }
} catch(e) {}

console.log('[LuminNarrator] 🟡 Sistema de narrativa Lumin ativo');