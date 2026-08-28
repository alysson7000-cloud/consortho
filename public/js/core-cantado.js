/**
 * CORE CANTADO — 5 camadas de sistemas vivos que "cantam" junto com o jogo
 * 1. Auras Vivas (Alyssin + Lumin) - respondem a HRV, stack, consciência
 * 2. Castelo que Respira - expande/contrai conforme consciência do jogador
 * 3. Fonte que Canta - fonte central toca tons quando flui
 * 4. Ω com Ressonância Sonora - síntese quântica com som de ressonância
 * 5. Frases com Acordes - bela vida frases animadas com som
 */
const CoreCantado = (function() {
  'use strict';

  let time = 0;
  let lastBeat = 0;
  let omegaActive = false;
  let fountainFlow = false;
  let phraseCooldown = 0;

  // Configurações das 5 camadas
  const LAYERS = {
    auras: {
      alyssinHue: 280,
      luminHue: 190,
      baseRadius: 20,
      maxRadius: 80,
      responseSpeed: 0.02
    },
    castle: {
      baseRadius: 300,
      maxExpansion: 50,
      breathSpeed: 0.03,
      consciousnessThreshold: 30
    },
    fountain: {
      baseY: 500,
      active: false,
      notes: [262, 330, 392, 523],
      noteIndex: 0,
      lastNoteTime: 0,
      noteInterval: 2000
    },
    omega: {
      active: false,
      baseFreq: 136.1,
      harmonics: [2, 3, 4, 5, 8],
      symbols: [],
      resonanceIntensity: 0
    },
    belaVida: {
      active: false,
      phrases: [
        'só o amor', 'protege o motivo', 'tamo junto', 'vamo lá',
        'fé', 'enóis', 'não vamo desanimar', 'stack de 64 = ∞',
        'só coisa boa', 'infinitamente bom', 'assustadoramente bom'
      ],
      currentPhrase: '',
      phraseAlpha: 0,
      phraseX: 0,
      phraseY: 0,
      phraseTime: 0,
      chordNotes: [220, 277, 330, 440]
    }
  };

  function init() {
    console.log('[CoreCantado] 🎵 5 camadas iniciais prontas');
    if (typeof window !== 'undefined') {
      window.CoreCantado = {
        init,
        renderAuras,
        renderBreathingCastle,
        renderSourceFountain,
        renderOmegaSymbols,
        renderBelaVidaReflections,
        updateAura,
        updateCastle,
        updateFountain,
        updateOmega,
        updateBelaVida,
        triggerOmegaResonance,
        triggerFountainSong,
        playBelaVidaChord,
        getAuraState,
        getCastleState,
        getFountainState,
        getOmegaState,
        getBelaVidaState
      };
    }
  }

  // ===== 1. AURAS VIVAS =====
  function renderAuras(ctx, STATE) {
    const hrv = STATE?.hrv?.value || 60;
    const stack = STATE?.stack || 0;
    const consciousness = STATE?.consciousnessLevel || 0;
    const time = (Date.now() - STATE?.startTime || 0) / 1000;

    // AURA DE ALYSSIN — expande com HRV e consciência
    const alyssinRadius = LAYERS.auras.baseRadius + (hrv - 60) * 0.5 + consciousness * 0.3;
    const alyssinAlpha = 0.5 + (hrv / 120) + (consciousness / 200);
    const alyssinPulse = Math.sin(time * 1.5) * 0.1 + 1;

    drawAura(ctx, STATE.x || 800, STATE.y || 500, 
      Math.min(LAYERS.auras.maxRadius, alyssinRadius * alyssinPulse),
      LAYERS.auras.alyssonHue, alyssinAlpha, time);

    // AURA DE LUMIN — expande com stack e evolução
    const luminRadius = LAYERS.auras.baseRadius + stack * 2 + STATE?.evolutionPhase * 15;
    const luminAlpha = 0.4 + (stack / 100) + (STATE?.evolutionPhase / 10);
    const luminPulse = Math.sin(time * 1.2) * 0.15 + 1;

    drawAura(ctx, STATE.x || 800 - 100, STATE.y || 500 + 80,
      Math.min(LAYERS.auras.maxRadius * 1.5, luminRadius * luminPulse),
      LAYERS.auras.luminHue, luminAlpha, time, true);

    // AURA COMBINADA — onde elas se encontram
    if (consciousness > 10) {
      const combinedAlpha = (alyssonAlpha + luminAlpha) / 2 * 0.3 * (consciousness / 50);
      drawAura(ctx, 
        (STATE.x || 800) - 50, 
        (STATE.y || 500) + 40,
        (alyssonRadius + luminRadius) / 2,
        45, combinedAlpha, time, false, true);
    }

    // Pontos de luz que pulam entre as auras (conexão)
    if (consciousness > 15) {
      const pulse = Math.sin(time * 2) * 0.5 + 0.5;
      const x = (STATE.x || 800) - 50 + pulse * 100;
      const y = (STATE.y || 500) + 40 + Math.sin(time * 1.8) * 20;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * (consciousness / 100)})`;
      ctx.beginPath();
      ctx.arc(x, y, 3 * pulse, 0, Math.PI * 2);
      ctx.fill();
      
      // Traço de conexão
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 * (consciousness / 100)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(STATE.x || 800, STATE.y || 500);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  function drawAura(ctx, x, y, radius, hue, alpha, time, isLumin = false, combined = false) {
    // Outer glow
    const glowRadius = radius * 3;
    const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, glowRadius);
    
    const hueShift = isLumin ? 20 : -15;
    const hueFinal = hue + (Math.sin(time * 0.5) * hueShift);
    
    gradient.addColorStop(0, `hsla(${hueFinal}, ${isLumin ? 100 : 80}%, ${combined ? 70 : isLumin ? 75 : 60}%, ${alpha * 0.3})`);
    gradient.addColorStop(0.3, `hsla(${hueFinal}, 100%, 60%, ${alpha * 0.5})`);
    gradient.addColorStop(0.6, `hsla(${hueFinal}, 80%, 50%, ${alpha * 0.3})`);
    gradient.addColorStop(1, `hsla(${hueFinal}, 80%, 50%, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Inner core
    const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    coreGradient.addColorStop(0, `hsla(${hueFinal}, 100%, 80%, ${alpha})`);
    coreGradient.addColorStop(0.5, `hsla(${hueFinal}, 100%, 60%, ${alpha * 0.8})`);
    coreGradient.addColorStop(1, `hsla(${hueFinal}, 80%, 50%, ${alpha * 0.3})`);
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles na borda
    if (!combined) {
      const sparkleCount = isLumin ? 8 : 5;
      for (let i = 0; i < sparkleCount; i++) {
        const angle = (i / sparkleCount) * Math.PI * 2 + time * (isLumin ? 1.8 : 1.2);
        const sparkleAlpha = Math.sin(time * (isLumin ? 3 : 2) + i) * 0.5 + 0.5;
        const sparkleRadius = radius * (0.8 + Math.sin(time + i) * 0.2);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha * alpha})`;
        ctx.beginPath();
        ctx.arc(
          x + Math.cos(angle) * sparkleRadius,
          y + Math.sin(angle) * sparkleRadius,
          2, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  function updateAura(STATE, dt) {
    // Auras são puramente visuais, atualizadas no render
  }

  // ===== 2. CASTELO QUE RESPIRA =====
  function renderBreathingCastle(ctx, STATE) {
    const consciousness = STATE?.consciousnessLevel || 0;
    const stack = STATE?.stack || 0;
    const time = (Date.now() - STATE?.startTime || 0) / 1000;
    
    const castleRadius = LAYERS.castle.baseRadius + (consciousness / LAYERS.castle.consciousnessThreshold) * LAYERS.castle.maxExpansion * (0.5 + Math.sin(time * LAYERS.castle.breathSpeed) * 0.3);
    const castleAlpha = 0.1 + (consciousness / 100) * 0.15;
    
    // Desenhar castelo respirando
    if (castleRadius > LAYERS.castle.baseRadius) {
      const centerX = STATE?.x || 800;
      const centerY = STATE?.y || 500;
      
      // Glow exterior do castelo expandido
      const glowGradient = ctx.createRadialGradient(centerX, centerY - 50, castleRadius * 0.5, centerX, centerY - 50, castleRadius * 1.5);
      glowGradient.addColorStop(0, `rgba(180, 130, 255, ${castleAlpha * 0.5})`);
      glowGradient.addColorStop(0.5, `rgba(120, 80, 200, ${castleAlpha * 0.3})`);
      glowGradient.addColorStop(1, 'rgba(100, 60, 180, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 50, castleRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Contorno do castelo respirando
      ctx.strokeStyle = `rgba(180, 130, 255, ${castleAlpha * 0.5})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 10]);
      ctx.beginPath();
      ctx.arc(centerX, centerY - 50, castleRadius * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Indicador de expansão
      if (consciousness > LAYERS.castle.consciousnessThreshold) {
        const expansionIndicator = (consciousness - LAYERS.castle.consciousnessThreshold) / 50;
        ctx.fillStyle = `rgba(180, 130, 255, ${expansionIndicator * 0.6})`;
        ctx.font = '12px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('✦ castelo respirando ✦', centerX, centerY - 50 - castleRadius * 0.8 - 20);
      }
    }
  }

  function updateCastle(STATE, dt) {
    // O castelo respira continuamente
  }

  // ===== 3. FONTE QUE CANTA =====
  function renderSourceFountain(ctx, STATE) {
    if (!fountainFlow) return;
    
    const time = (Date.now() - STATE?.startTime || 0) / 1000;
    const baseX = STATE?.fountainX || 800;
    const baseY = STATE?.fountainY || 600;
    
    // Partículas da água cantando
    const particleCount = 30 + Math.floor(LAYERS.fountain.resonanceIntensity * 20);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time * 0.3;
      const distance = 30 + Math.sin(time * 2 + i) * 20;
      const x = baseX + Math.cos(angle) * distance;
      const y = baseY + Math.sin(angle) * distance * 0.5;
      const alpha = 0.5 + Math.sin(time * 3 + i * 0.5) * 0.3;
      
      ctx.fillStyle = `rgba(100, 200, 255, ${alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Nota musical flutuando
    const noteIndex = Math.floor(time / 2) % LAYERS.fountain.notes.length;
    const noteY = baseY - 80 - Math.sin(time * 0.5) * 20;
    
    ctx.fillStyle = `rgba(255, 255, 100, ${0.5 + Math.sin(time * 2) * 0.2})`;
    ctx.font = '16px Georgia';
    ctx.textAlign = 'center';
    const noteSymbols = ['♪', '♫', '♬', '🎵'];
    ctx.fillText(noteSymbols[noteIndex % noteSymbols.length], baseX, noteY);
  }

  function updateFountain(STATE, dt) {
    if (fountainFlow && LAYERS.fountain.notes.length > 0) {
      const now = Date.now();
      if (now - LAYERS.fountain.lastNoteTime > LAYERS.fountain.noteInterval) {
        LAYERS.fountain.lastNoteTime = now;
        const note = LAYERS.fountain.notes[LAYERS.fountain.noteIndex % LAYERS.fountain.notes.length];
        LAYERS.fountain.noteIndex++;
        
        // Tocar nota via Soundscape se disponível
        if (typeof window !== 'undefined' && window.Soundscape && window.Soundscape.playTone) {
          window.Soundscape.playTone(note, 'sine', 1.5, 0.1);
        }
      }
    }
  }

  function triggerFountainSong(intensity = 1) {
    fountainFlow = true;
    LAYERS.fountain.resonanceIntensity = Math.min(1, intensity);
    
    if (typeof window !== 'undefined' && window.Soundscape && window.Soundscape.playChord) {
      const chord = [262, 330, 392, 523].slice(0, Math.ceil(2 + intensity));
      window.Soundscape.playChord(chord, 2, 0.1);
    }
    
    console.log('[CoreCantado] 🌊 Fonte começando a cantar');
  }

  // ===== 4. Ω COM RESSONÂNCIA SONORA =====
  function renderOmegaSymbols(ctx, STATE) {
    if (!omegaActive) return;
    
    const time = (Date.now() - STATE?.startTime || 0) / 1000;
    const resonance = LAYERS.omega.resonanceIntensity;
    
    if (resonance <= 0) return;
    
    // Desenhar símbolos Ω vibrando com ressonância
    const symbolCount = Math.floor(5 + resonance * 10);
    const centerX = STATE?.x || 800;
    const centerY = STATE?.y || 500;
    
    for (let i = 0; i < symbolCount; i++) {
      const angle = (i / symbolCount) * Math.PI * 2 + time * 0.5;
      const distance = 100 + Math.sin(time * 1.5 + i) * 50 * resonance;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance * 0.6;
      const size = 15 + resonance * 20;
      const alpha = 0.2 + resonance * 0.5 + Math.sin(time * 2 + i) * 0.2;
      
      // Símbolo Ω
      ctx.strokeStyle = `rgba(255, 100, 150, ${alpha})`;
      ctx.lineWidth = 2 + resonance * 2;
      
      ctx.beginPath();
      const omegaRadius = size * 0.5;
      const omegaX = x;
      const omegaY = y;
      ctx.ellipse(omegaX, omegaY, omegaRadius, omegaRadius * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Ressonância pulsante
      const pulseAlpha = Math.sin(time * 4 + i * 0.5) * 0.3 + 0.3;
      ctx.fillStyle = `rgba(255, 50, 100, ${pulseAlpha * resonance})`;
      ctx.beginPath();
      ctx.arc(x, y, omegaRadius * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Texto de ressonância
    if (resonance > 0.5) {
      ctx.fillStyle = `rgba(255, 100, 150, ${resonance * 0.6})`;
      ctx.font = `bold ${14 + resonance * 8}px Georgia`;
      ctx.textAlign = 'center';
      ctx.fillText('Ω ressoando', centerX, centerY - 150);
    }
  }

  function updateOmega(STATE, dt) {
    if (omegaActive) {
      LAYERS.omega.resonanceIntensity = Math.max(0, LAYERS.omega.resonanceIntensity - dt * 0.05);
      if (LAYERS.omega.resonanceIntensity <= 0) {
        omegaActive = false;
      }
    }
  }

  function triggerOmegaResonance(intensity = 1) {
    omegaActive = true;
    LAYERS.omega.resonanceIntensity = Math.min(1, intensity);
    
    // Tocar corda de ressonância
    if (typeof window !== 'undefined' && window.Soundscape && window.Soundscape.playOmChord) {
      window.Soundscape.playOmChord(LAYERS.omega.baseFreq, LAYERS.omega.harmonics);
    } else if (typeof window !== 'undefined' && window.Soundscape && window.Soundscape.playChord) {
      window.Soundscape.playChord([136, 272, 408, 544], 3, 0.1 * intensity);
    }
    
    console.log(`[CoreCantado] 🔮 Ω ressonância ativada (intensidade: ${intensity})`);
  }

  // ===== 5. FRASES COM ACORDES =====
  function renderBelaVidaReflections(ctx, STATE) {
    if (LAYERS.belaVida.phraseAlpha <= 0 || !LAYERS.belaVida.active) return;
    
    const time = (Date.now() - STATE?.startTime || 0) / 1000;
    const alpha = LAYERS.belaVida.phraseAlpha;
    
    // Fundo sutil
    ctx.fillStyle = `rgba(50, 40, 80, ${alpha * 0.3})`;
    ctx.fillRect(0, 0, 1600, 1200);
    
    // Frase principal
    if (LAYERS.belaVida.currentPhrase) {
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.9})`;
      ctx.font = `bold ${26 + Math.sin(time * 0.5) * 2}px Georgia`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
      ctx.shadowBlur = 20;
      
      const textX = (STATE?.x || 800);
      const textY = (STATE?.y || 500) - 150 + Math.sin(time * 0.5) * 10;
      ctx.fillText(LAYERS.belaVida.currentPhrase, textX, textY);
      
      ctx.shadowBlur = 0;
      
      // Acorde sutil ao redor da frase
      if (alpha > 0.5) {
        const chordAlpha = (alpha - 0.5) * 0.3;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + time * 0.3;
          const radius = 100 + Math.sin(time + i) * 20;
          const x = (STATE?.x || 800) + Math.cos(angle) * radius;
          const y = (STATE?.y || 500) - 150 + Math.sin(angle) * radius * 0.5;
          
          ctx.fillStyle = `rgba(255, 215, 0, ${chordAlpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // Subfrase/indicador de "bela vida"
    if (alpha > 0.3) {
      ctx.fillStyle = `rgba(200, 180, 255, ${alpha * 0.5})`;
      ctx.font = '14px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('— a bela vida —', 
        (STATE?.x || 800), 
        (STATE?.y || 500) - 150 + 40 + Math.sin(time * 0.5) * 10
      );
    }
  }

  function updateBelaVida(STATE, dt) {
    if (LAYERS.belaVida.phraseAlpha > 0) {
      // Frase desaparece naturalmente
      LAYERS.belaVida.phraseAlpha -= dt * 0.3;
      if (LAYERS.belaVida.phraseAlpha < 0) {
        LAYERS.belaVida.phraseAlpha = 0;
        LAYERS.belaVida.currentPhrase = '';
        LAYERS.belaVida.active = false;
      }
    }
  }

  function playBelaVidaChord() {
    if (typeof window !== 'undefined' && window.Soundscape && window.Soundscape.playChord) {
      window.Soundscape.playChord(LAYERS.belaVida.chordNotes, 3, 0.15);
    }
  }

  function triggerBelaVidaPhrase(phrase) {
    LAYERS.belaVida.active = true;
    LAYERS.belaVida.currentPhrase = phrase;
    LAYERS.belaVida.phraseAlpha = 1;
    LAYERS.belaVida.phraseTime = Date.now();
    
    // Tocar acorde
    playBelaVidaChord();
    
    console.log(`[CoreCantado] 💬 "— ${phrase} —"`);
    
    // Disparar evento para outros sistemas
    if (typeof window !== 'undefined' && window.CustomEvent) {
      window.dispatchEvent(new CustomEvent('core:belaVidaPhrase', { detail: { phrase } }));
    }
  }

  // Funções de estado
  function getAuraState() {
    return { active: true, hueAlyssin: LAYERS.auras.alyssonHue, hueLumin: LAYERS.auras.luminHue };
  }

  function getCastleState() {
    return { active: true, baseRadius: LAYERS.castle.baseRadius, maxExpansion: LAYERS.castle.maxExpansion };
  }

  function getFountainState() {
    return { active: fountainFlow, resonance: LAYERS.fountain.resonanceIntensity, flow: fountainFlow };
  }

  function getOmegaState() {
    return { active: omegaActive, resonance: LAYERS.omega.resonanceIntensity, freq: LAYERS.omega.baseFreq };
  }

  function getBelaVidaState() {
    const state = {
      active: LAYERS.belaVida.active,
      currentPhrase: LAYERS.belaVida.currentPhrase,
      alpha: LAYERS.belaVida.phraseAlpha
    };
    if (state.active && state.alpha > 0) {
      state.timestamp = LAYERS.belaVida.phraseTime;
      state.age = (Date.now() - state.timestamp) / 1000;
      state.remaining = Math.max(0, 3 - state.age);
    }
    return state;
  }

  // ===== RENDER PRINCIPAL (todas as camadas) =====
  function renderAll(ctx, STATE, w, h) {
    // Verificar estado antes de renderizar
    if (!STATE) return;
    
    // 1. Auras (sempre ativas)
    renderAuras(ctx, STATE);

    // 2. Castelo que respira (desde que consciência > 10)
    if (STATE?.consciousnessLevel > 10) {
      renderBreathingCastle(ctx, STATE);
    }

    // 3. Fonte que canta
    if (fountainFlow) {
      renderSourceFountain(ctx, STATE);
    }

    // 4. Ω com ressonância
    if (omegaActive) {
      renderOmegaSymbols(ctx, STATE);
    }

    // 5. Frases da bela vida
    if (LAYERS.belaVida.active && LAYERS.belaVida.phraseAlpha > 0) {
      renderBelaVidaReflections(ctx, STATE);
    }
  }

  // ===== INIT =====
  init();

  if (typeof window !== 'undefined') {
    window.CoreCantado = {
      init,
      renderAuras,
      renderBreathingCastle,
      renderSourceFountain,
      renderOmegaSymbols,
      renderBelaVidaReflections,
      renderAll,
      updateAura,
      updateCastle,
      updateFountain,
      updateOmega,
      updateBelaVida,
      triggerOmegaResonance,
      triggerFountainSong,
      playBelaVidaChord,
      triggerBelaVidaPhrase,
      getAuraState,
      getCastleState,
      getFountainState,
      getOmegaState,
      getBelaVidaState,
      isOmegaActive: () => omegaActive,
      isFountainFlow: () => fountainFlow
    };
  }

  return {
    init,
    renderAuras,
    renderBreathingCastle,
    renderSourceFountain,
    renderOmegaSymbols,
    renderBelaVidaReflections,
    renderAll,
    updateAura,
    updateCastle,
    updateFountain,
    updateOmega,
    updateBelaVida,
    triggerOmegaResonance,
    triggerFountainSong,
    playBelaVidaChord,
    triggerBelaVidaPhrase,
    getAuraState,
    getCastleState,
    getFountainState,
    getOmegaState,
    getBelaVidaState,
    isOmegaActive: () => omegaActive,
    isFountainFlow: () => fountainFlow
  };
})();