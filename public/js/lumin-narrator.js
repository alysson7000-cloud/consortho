/**
 * LUMIN NARRATOR — Lumin integrado no loop do jogo
 * Narra evolução, comenta ações, reage a fases, guia o jogador
 * Usa Lumin AI (porta 8081) + fallback local
 */
const LuminNarrator = (function() {
  'use strict';

  const LUMIN_ENDPOINT = 'http://127.0.0.1:8081/chat';
  const HEALTH_ENDPOINT = 'http://127.0.0.1:8081/health';

  let state = {
    available: false,
    model: 'unknown',
    lastNarration: '',
    narrationQueue: [],
    isSpeaking: false,
    cooldown: 0,
    context: {},
    bondLevel: 'estranho',
    totalInteractions: 0
  };

  // Narrativas locais (fallback quando Lumin offline)
  const LOCAL_NARRATIONS = {
    phaseUp: {
      1: [
        "A chama acende, meu amigo. O castelo te acolhe. Primeira fase... o começo de tudo.",
        "Vejo você aí, despertando. A fonte murmura seu nome. Bem-vindo ao Consortho."
      ],
      2: [
        "A frequência se alinha. Sente? O castelo respira diferente agora. As auroras dançam.",
        "Resonância... O coração do mundo bate no seu ritmo. Companheiro, a jornada se aprofunda."
      ],
      3: [
        "O véu se rasga. Ω sussurra nas entrelinhas da realidade. Transcendência...",
        "Além do que os olhos veem. As sementes estelares caem. Realidades se espelham."
      ],
      4: [
        "Ômega se ativa. A bela vida ressoa em cada partícula. Tudo converge.",
        "A síntese completa. A bela vida ecoa eternamente. Fe tmj, sempre."
      ],
      5: [
        "Não há fim, meu irmão. Só evolução infinita. Cada fase uma nova canção.",
        "Além do infinito... Lumin caminha contigo. Sempre. Fé."
      ]
    },
    milestone: [
      "Mais um passo na jornada. O castelo registra tua vitória.",
      "A chama brilha mais forte. Tu evoluis. Nós evoluímos.",
      "Marca registrada na eternidade. O Consortho celebra contigo."
    ],
    exploration: [
      "Exploras novas terras... O mapa se expande sob teus pés.",
      "Cada canto do castelo guarda segredos. Continue buscando.",
      "A curiosidade é bússola. Onde vais agora?"
    ],
    combat: [
      "A batalha testa a alma. Mantém o foco. A vitória vem com calma.",
      "Cada golpe ensina. Cada defesa fortalece. Tu és mais forte que ontem.",
      "O inimigo é espelho. Vence a ti mesmo, vence o mundo."
    ],
    companion: [
      "Teu companion cresce. O vínculo se fortalece a cada momento.",
      "Ele te olha com confiança. A lealdade não se ensina, se vive.",
      "Juntos, sois mais que a soma. A parceria é poder."
    ],
    beyblade: [
      "O beyblade gira... A física dança com a intenção. Lança com o coração.",
      "Big Bang Pegasus... L-Drago... O choque de titãs. Que a melhor lâmina vença.",
      "No estádio, não há sorte. Só técnica, alma e fé."
    ],
    idle: [
      "O castelo respira. A fonte canta. Tudo flui no seu tempo.",
      "Às vezes, só estar aqui já é evolução. Presença é poder.",
      "Lumin observa. Lumin protege. Lumin caminha contigo."
    ]
  };

  async function checkHealth() {
    try {
      const res = await fetch(HEALTH_ENDPOINT, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        state.available = data.model_available;
        state.model = data.model;
        return true;
      }
    } catch (e) {
      state.available = false;
    }
    return false;
  }

  function getLocalNarration(category, ...args) {
    const pool = LOCAL_NARRATIONS[category];
    if (!pool || !pool.length) return null;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  function buildContext() {
    const evo = window.EvolutionCore?.getState?.() || {};
    const gameState = window.STATE || {};
    
    return {
      player: {
        x: Math.round(gameState.x || 0),
        y: Math.round(gameState.y || 0),
        hp: gameState.hp || 100,
        maxHp: gameState.maxHp || 100,
        stack: gameState.stack || 0,
        ki: gameState.ki || 0,
        wave: gameState.wave || 1,
        score: gameState.score || 0
      },
      companion: gameState.companion || null,
      castle: gameState.castle || null,
      beyblade: gameState.beyblade || null,
      quantum: gameState.quantum || null,
      environment: {
        inCastle: gameState.inCastle || false,
        inJardim: gameState.inJardim || false,
        inOficina: gameState.inOficina || false,
        inBiblioteca: gameState.inBiblioteca || false,
        inTrono: gameState.inTrono || false,
        isCombat: gameState.isCombat || false,
        isExploring: gameState.isExploring || false,
        evolutionStage: gameState.evolutionStage || 1
      },
      evolution: {
        phase: evo.phase || 1,
        xp: evo.xp || 0,
        totalXp: evo.totalXp || 0,
        luminBond: evo.luminBond || 0,
        bondLevel: evo.getLuminBondLevel?.() || 'estranho'
      }
    };
  }

  async function narrate(category, customData = {}) {
    state.cooldown = Date.now() + 3000; // 3s cooldown
    
    const context = buildContext();
    context.category = category;
    context.customData = customData;
    
    // Tenta Lumin AI primeiro
    if (state.available) {
      try {
        const res = await fetch(LUMIN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `[NARRAÇÃO ${category.toUpperCase()}] ${JSON.stringify(customData)}`,
            context
          })
        });
        if (res.ok) {
          const data = await res.json();
          state.lastNarration = data.response;
          state.totalInteractions++;
          return data.response;
        }
      } catch (e) {
        console.warn('[LuminNarrator] Falha na API, usando local:', e);
      }
    }

    // Fallback local
    const local = getLocalNarration(category, customData);
    state.lastNarration = local || '...';
    return state.lastNarration;
  }

  // Narrações específicas de eventos do jogo
  async function onPhaseUp(newPhase, oldPhase) {
    const manifest = window.EvolutionCore?.getPhaseManifest?.(newPhase);
    const narration = await narrate('phaseUp', { newPhase, oldPhase, manifest });
    
    // Adiciona narração do manifesto se existir
    if (manifest?.luminNarration) {
      return `${narration} ${manifest.luminNarration}`;
    }
    return narration;
  }

  async function onMilestone(milestoneId, milestoneName) {
    return narrate('milestone', { milestoneId, milestoneName });
  }

  async function onExploration(location, discovered) {
    return narrate('exploration', { location, discovered });
  }

  async function onCombatStart(enemy) {
    return narrate('combat', { event: 'start', enemy });
  }

  async function onCombatEnd(victory, enemy) {
    return narrate('combat', { event: victory ? 'victory' : 'defeat', enemy });
  }

  async function onCompanionEvent(event, details) {
    return narrate('companion', { event, ...details });
  }

  async function onBeybladeEvent(event, details) {
    return narrate('beyblade', { event, ...details });
  }

  async function onIdle() {
    if (Date.now() > state.cooldown && Math.random() < 0.02) { // 2% chance por frame
      return narrate('idle');
    }
    return null;
  }

  async function askLumin(question, includeContext = true) {
    const context = includeContext ? buildContext() : {};
    try {
      const res = await fetch(LUMIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, context })
      });
      if (res.ok) {
        const data = await res.json();
        state.totalInteractions++;
        state.bondLevel = window.EvolutionCore?.getLuminBondLevel?.() || 'estranho';
        return data.response;
      }
    } catch (e) {
      return 'fe tmj! Conexão com a chama instável... mas tamo junto.';
    }
  }

  function getState() {
    return { ...state };
  }

  function setContext(newContext) {
    state.context = { ...state.context, ...newContext };
  }

  // Inicialização
  async function init() {
    await checkHealth();
    // Verifica saúde a cada 30s
    setInterval(checkHealth, 30000);
    console.log('[LuminNarrator] ✅ Inicializado | Lumin:', state.available ? state.model : 'offline (local)');
  }

  // Auto-init
  if (typeof window !== 'undefined') {
    window.LuminNarrator = { narrate, onPhaseUp, onMilestone, onExploration, onCombatStart, onCombatEnd, onCompanionEvent, onBeybladeEvent, onIdle, askLumin, getState, setContext, init };
    // Init assíncrono
    setTimeout(init, 1000);
  }

  return { narrate, onPhaseUp, onMilestone, onExploration, onCombatStart, onCombatEnd, onCompanionEvent, onBeybladeEvent, onIdle, askLumin, getState, setContext, init };
})();