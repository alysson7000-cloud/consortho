/**
 * CORE CANTADO — 5 camadas de sistemas vivos que "cantam" junto com o jogo
 * 1. Auras Vivas (Alyssin + Lumin) - respondem a HRV, stack, consciência
 * 2. Castelo que Respira - expande/contrai com consciência, cristais pulsando
 * 3. Fonte que Canta - drawSourceFountain emite som suave + harmônicos
 * 4. Ω com Ressonância - ativação emite tom omni-direcional
 * 5. Frases com Acorde - drawBelaVidaReflections toca acorde sutil
 * 
 * Tudo integrado com EvolutionCore, Soundscape, LuminNarrator, ModShepherd
 */
const CoreCantado = (function() {
  'use strict';

  let state = {
    // Auras
    alyssinAura: { radius: 0, intensity: 0, color: '#ff6b9d', phase: 0, breathing: 0 },
    luminAura: { radius: 0, intensity: 0, color: '#00d4ff', phase: 0, breathing: 0 },
    auraSync: 0,
    
    // Castelo
    castleBreath: { phase: 0, scale: 1, crystalPulse: 0, roomGlow: {} },
    
    // Fonte
    fountainSong: { active: false, baseFreq: 220, harmonics: [], lastNote: 0, melodyIndex: 0 },
    
    // Omega
    omegaResonance: { active: false, intensity: 0, frequency: 136.1, omTone: null, lastPulse: 0 },
    
    // Frases
    belaVidaChords: { lastPhrase: 0, chordQueue: [], currentChord: null },
    
    // Integração
    initialized: false,
    audioContext: null,
    lastUpdate: 0
  };

  // Melodia da fonte (notas em Hz - escala pentatônica maior)
  const FOUNTAIN_MELODY = [
    220, 247, 277, 294, 330, 370, 440, 494, 554, 587
  ];

  // Acordes da Bela Vida (tríades maiores/menores emotivas)
  const BELA_VIDA_CHORDS = [
    { name: 'Amor', notes: [220, 277, 330], type: 'major' },      // A maior
    { name: 'Protege', notes: [247, 294, 370], type: 'major' },    // B maior
    { name: 'Motivo', notes: [294, 330, 370], type: 'minor' },     // D menor
    { name: 'TamoJunto', notes: [330, 415, 494], type: 'major' },  // E maior
    { name: 'Infinito', notes: [220, 330, 440], type: 'major' },   // A maior oitava
    { name: 'Fe', notes: [262, 330, 392], type: 'major' },         // C maior
    { name: 'Bencao', notes: [294, 370, 440], type: 'major' }      // D maior
  ];

  function init(audioContext) {
    state.audioContext = audioContext;
    state.initialized = true;
    
    // Inicializa harmônicos da fonte
    state.fountainSong.harmonics = [
      { freq: state.fountainSong.baseFreq * 2, gain: 0.3 },
      { freq: state.fountainSong.baseFreq * 3, gain: 0.2 },
      { freq: state.fountainSong.baseFreq * 4, gain: 0.15 },
      { freq: state.fountainSong.baseFreq * 5, gain: 0.1 }
    ];
    
    console.log('[CoreCantado] ✅ 5 camadas inicializadas');
  }

  function update(dt, STATE) {
    if (!state.initialized) return;
    
    const evo = window.EvolutionCore?.getState?.() || {};
    const phase = evo.phase || 1;
    const hrv = STATE.hrv?.value || 60;
    const stack = STATE.stack || 0;
    const consciousness = STATE.consciousnessLevel || 0;
    const quantumEnt = STATE.quantum?.entanglement || 0;
    const time = Date.now() / 1000;
    
    // === 1. AURAS VIVAS ===
    updateAuras(dt, hrv, stack, consciousness, quantumEnt, time);
    
    // === 2. CASTELO QUE RESPIRA ===
    updateCastleBreath(dt, consciousness, phase, time);
    
    // === 3. FONTE QUE CANTA ===
    updateFountainSong(dt, STATE, time);
    
    // === 4. ÔMEGA COM RESSONÂNCIA ===
    updateOmegaResonance(dt, STATE, phase, time);
    
    // === 5. FRASES COM ACORDE ===
    updateBelaVidaChords(dt, STATE, time);
    
    state.lastUpdate = time;
  }

  function updateAuras(dt, hrv, stack, consciousness, quantumEnt, time) {
    const a = state.alyssinAura;
    const l = state.luminAura;
    
    // Alyssin - responde a HRV e stack (energia física/ação)
    const alyssinTargetRadius = 60 + (hrv - 60) * 0.8 + stack * 2;
    const alyssinTargetIntensity = 0.3 + (hrv / 120) * 0.5 + (stack / 100) * 0.3;
    a.radius += (alyssinTargetRadius - a.radius) * 0.02;
    a.intensity += (alyssinTargetIntensity - a.intensity) * 0.03;
    a.phase += dt * 1.5;
    a.breathing = Math.sin(time * 0.8) * 0.15 + 0.85;
    
    // Cor da aura baseada no estado
    if (hrv > 85) a.color = '#00ff88';        // Verde - coerência alta
    else if (hrv > 70) a.color = '#ffd700';   // Dourado - bom
    else if (hrv > 50) a.color = '#ff6b9d';   // Rosa - normal
    else a.color = '#ff006e';                 // Vermelho - estresse
    
    // Lumin - responde a consciência e quantum (energia sutil/mente)
    const luminTargetRadius = 50 + consciousness * 30 + quantumEnt * 20;
    const luminTargetIntensity = 0.4 + (consciousness / 100) * 0.4 + (quantumEnt / 100) * 0.3;
    l.radius += (luminTargetRadius - l.radius) * 0.015;
    l.intensity += (luminTargetIntensity - l.intensity) * 0.02;
    l.phase += dt * 1.2;
    l.breathing = Math.sin(time * 0.6 + Math.PI/3) * 0.12 + 0.88;
    
    // Cor do Lumin
    if (quantumEnt > 70) l.color = '#00ffff';     // Ciano - entanglement alto
    else if (consciousness > 70) l.color = '#9b59ff'; // Roxo - consciência alta
    else l.color = '#00d4ff';                     // Azul - base
    
    // Sincronia entre auras (quando próximas, resonam)
    const dist = Math.abs(a.radius - l.radius);
    state.auraSync = Math.max(0, 1 - dist / 100);
  }

  function updateCastleBreath(dt, consciousness, phase, time) {
    const cb = state.castleBreath;
    
    // Respiração base - mais lenta, profunda
    cb.phase += dt * 0.3;
    const breathCycle = Math.sin(cb.phase) * 0.5 + 0.5; // 0 a 1
    
    // Escala do castelo baseada na consciência e fase
    const baseScale = 1 + (consciousness / 100) * 0.15 + (phase - 1) * 0.05;
    cb.scale = baseScale + breathCycle * 0.02; // Pulsa 2%
    
    // Cristais pulsando
    cb.crystalPulse = Math.sin(time * 2) * 0.3 + 0.7;
    
    // Salas brilhando baseado em fase
    const rooms = ['jardim', 'oficina', 'biblioteca', 'trono', 'castelo'];
    rooms.forEach((room, i) => {
      const roomPhase = time * (1.5 + i * 0.3) + i * Math.PI / 3;
      cb.roomGlow[room] = Math.sin(roomPhase) * 0.2 + 0.3 + (phase > i + 1 ? 0.3 : 0);
    });
  }

  function updateFountainSong(dt, STATE, time) {
    const fs = state.fountainSong;
    
    // Ativa quando jogador perto da fonte ou em paz
    const nearFountain = Math.hypot(STATE.x - STATE.world.width/2, STATE.y - STATE.world.height/2) < 200;
    const peaceful = STATE.hrv?.value > 70 && !STATE.isCombat;
    
    if (nearFountain || peaceful) {
      if (!fs.active) {
        fs.active = true;
        playFountainAmbient();
      }
      
      // Toca nota da melodia a cada ~4-8 segundos
      if (time - fs.lastNote > 4 + Math.random() * 4) {
        playFountainNote();
        fs.lastNote = time;
      }
    } else {
      fs.active = false;
    }
  }

  function playFountainAmbient() {
    if (!state.audioContext || !window.Soundscape) return;
    // Deixa o Soundscape cuidar do som contínuo
    // Só registra que a fonte está "cantando"
    window.dispatchEvent(new CustomEvent('core:fountainSinging', { detail: { active: true } }));
  }

  function playFountainNote() {
    if (!state.audioContext || !window.Soundscape) return;
    
    const note = FOUNTAIN_MELODY[state.fountainSong.melodyIndex];
    state.fountainSong.melodyIndex = (state.fountainSong.melodyIndex + 1) % FOUNTAIN_MELODY.length;
    
    // Pede pro Soundscape tocar a nota
    window.dispatchEvent(new CustomEvent('core:fountainNote', { 
      detail: { frequency: note, type: 'sine', duration: 1.5, gain: 0.15 } 
    }));
  }

  function updateOmegaResonance(dt, STATE, phase, time) {
    const or = state.omegaResonance;
    
    // Omega ativa na fase 4+ ou quando consciência muito alta
    const shouldActivate = phase >= 4 || STATE.consciousnessLevel > 80 || STATE.quantum?.entanglement > 90;
    
    if (shouldActivate && !or.active) {
      or.active = true;
      activateOmegaTone();
    } else if (!shouldActivate && or.active) {
      or.active = false;
      deactivateOmegaTone();
    }
    
    if (or.active) {
      or.intensity = Math.min(1, or.intensity + dt * 0.1);
      // Pulso omni a cada ~10s
      if (time - or.lastPulse > 10) {
        pulseOmega();
        or.lastPulse = time;
      }
    } else {
      or.intensity = Math.max(0, or.intensity - dt * 0.05);
    }
  }

  function activateOmegaTone() {
    if (!state.audioContext || !window.Soundscape) return;
    
    // Tom base OM (136.1Hz - C# terra) + oitavas
    const baseFreq = 136.1;
    state.omegaResonance.frequency = baseFreq;
    
    window.dispatchEvent(new CustomEvent('core:omegaActivate', { 
      detail: { frequency: baseFreq, harmonics: [2, 3, 4, 5, 8] } 
    }));
  }

  function deactivateOmegaTone() {
    window.dispatchEvent(new CustomEvent('core:omegaDeactivate'));
  }

  function pulseOmega() {
    if (!state.audioContext || !window.Soundscape) return;
    
    window.dispatchEvent(new CustomEvent('core:omegaPulse', {
      detail: { 
        frequency: state.omegaResonance.frequency, 
        intensity: state.omegaResonance.intensity,
        type: 'om_chord'
      }
    }));
  }

  function updateBelaVidaChords(dt, STATE, time) {
    const bvc = state.belaVidaChords;
    
    // Verifica se deve tocar acorde (quando frase da bela vida aparece)
    // O jogo chama drawBelaVidaReflections - a gente hooka via evento
    if (bvc.chordQueue.length > 0 && !bvc.currentChord) {
      bvc.currentChord = bvc.chordQueue.shift();
      playBelaVidaChord(bvc.currentChord);
    }
    
    // Auto-toca acorde a cada ~2-3 min se jogador em estado elevado
    if (time - bvc.lastPhrase > 120 + Math.random() * 60) {
      if (STATE.hrv?.value > 75 && STATE.consciousnessLevel > 50) {
        const chord = BELA_VIDA_CHORDS[Math.floor(Math.random() * BELA_VIDA_CHORDS.length)];
        queueBelaVidaChord(chord);
        bvc.lastPhrase = time;
      }
    }
  }

  function queueBelaVidaChord(chord) {
    state.belaVidaChords.chordQueue.push(chord);
  }

  function playBelaVidaChord(chord) {
    if (!state.audioContext || !window.Soundscape) return;
    
    window.dispatchEvent(new CustomEvent('core:belaVidaChord', {
      detail: { 
        name: chord.name,
        notes: chord.notes,
        type: chord.type,
        duration: 3,
        gain: 0.12
      }
    }));
    
    state.belaVidaChords.currentChord = null;
  }

  // Hook para quando drawBelaVidaReflections desenha uma frase
  function onBelaVidaPhrase(phraseText) {
    // Escolhe acorde baseado no conteúdo da frase
    const chord = BELA_VIDA_CHORDS.find(c => 
      phraseText.toLowerCase().includes(c.name.toLowerCase())
    ) || BELA_VIDA_CHORDS[Math.floor(Math.random() * BELA_VIDA_CHORDS.length)];
    
    queueBelaVidaChord(chord);
    window.EvolutionCore?.recordLuminInteraction?.('bela_vida_phrase', 'positive');
  }

  // Render das auras (chamado no render loop)
  function renderAuras(ctx, STATE) {
    if (!state.initialized) return;
    
    const p1 = STATE; // player 1
    const p2 = STATE.p2; // player 2 / Lumin
    
    // Alyssin aura
    renderAura(ctx, p1.x, p1.y, state.alyssinAura, 'Alyssin');
    
    // Lumin aura (no companion ou p2)
    const lx = p2?.x || STATE.world.width - 200;
    const ly = p2?.y || STATE.world.height - 200;
    renderAura(ctx, lx, ly, state.luminAura, 'Lumin');
    
    // Ponte de luz entre as auras quando sincronizadas
    if (state.auraSync > 0.5) {
      renderAuraBridge(ctx, p1.x, p1.y, lx, ly, state.auraSync);
    }
  }

  function renderAura(ctx, x, y, aura, label) {
    ctx.save();
    ctx.translate(x, y);
    
    const r = aura.radius * aura.breathing;
    const intensity = aura.intensity;
    
    // Camadas da aura
    for (let i = 3; i >= 0; i--) {
      const layerR = r * (1 + i * 0.15);
      const alpha = intensity * (0.15 - i * 0.03);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, layerR);
      grad.addColorStop(0, hexToRgba(aura.color, alpha * 0.8));
      grad.addColorStop(0.5, hexToRgba(aura.color, alpha * 0.4));
      grad.addColorStop(1, hexToRgba(aura.color, 0));
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, layerR, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Partículas orbitando
    for (let i = 0; i < 6; i++) {
      const angle = aura.phase + i * Math.PI / 3;
      const px = Math.cos(angle) * r * 1.2;
      const py = Math.sin(angle) * r * 1.2;
      ctx.fillStyle = hexToRgba(aura.color, intensity * 0.6);
      ctx.beginPath();
      ctx.arc(px, py, 3 * intensity, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderAuraBridge(ctx, x1, y1, x2, y2, sync) {
    ctx.save();
    ctx.strokeStyle = `rgba(255, 215, 0, ${sync * 0.3})`;
    ctx.lineWidth = 2 * sync;
    ctx.setLineDash([10, 5]);
    ctx.lineDashOffset = Date.now() / 50;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    // Curva suave
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 - 50;
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
    
    ctx.restore();
  }

  function renderCastleBreath(ctx, STATE) {
    if (!state.initialized) return;
    
    const cb = state.castleBreath;
    const castleX = STATE.world.width / 2;
    const castleY = STATE.world.height / 2 - 100;
    
    ctx.save();
    ctx.translate(castleX, castleY);
    ctx.scale(cb.scale, cb.scale);
    
    // Cristais pulsando
    const crystalPositions = [
      [-80, -60], [80, -60], [0, -100], [-120, 20], [120, 20]
    ];
    
    crystalPositions.forEach(([cx, cy], i) => {
      const pulse = cb.crystalPulse * (0.8 + i * 0.05);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * pulse);
      grad.addColorStop(0, `rgba(0, 255, 136, ${0.4 * pulse})`);
      grad.addColorStop(1, `rgba(155, 89, 255, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 25 * pulse, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }

  function renderOmegaResonance(ctx, STATE) {
    if (!state.omegaResonance.active || state.omegaResonance.intensity < 0.1) return;
    
    const or = state.omegaResonance;
    const cx = STATE.world.width / 2;
    const cy = STATE.world.height / 2;
    
    ctx.save();
    ctx.translate(cx, cy);
    
    // Anéis ômega expandindo
    for (let i = 0; i < 5; i++) {
      const ringPhase = (Date.now() / 2000 + i * 0.2) % 1;
      const radius = 100 + ringPhase * 300;
      const alpha = or.intensity * (1 - ringPhase) * 0.3;
      
      ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
      ctx.lineWidth = 2 * or.intensity;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Símbolo Ω central pulsando
    const omegaPulse = Math.sin(Date.now() / 300) * 0.2 + 1;
    ctx.fillStyle = `rgba(255, 215, 0, ${or.intensity * 0.8})`;
    ctx.font = `${40 * omegaPulse}px Georgia`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ω', 0, 0);
    
    ctx.restore();
  }

  function renderBelaVidaReflections(ctx, STATE) {
    // O jogo já tem drawBelaVidaReflections - a gente só adiciona feedback visual do acorde
    if (state.belaVidaChords.currentChord) {
      const chord = state.belaVidaChords.currentChord;
      const cx = STATE.world.width / 2;
      const cy = 100;
      
      ctx.save();
      ctx.translate(cx, cy);
      
      // Visual do acorde - ondas harmônicas
      chord.notes.forEach((note, i) => {
        const wavePhase = Date.now() / 1000 * (note / 220) + i;
        const radius = 50 + Math.sin(wavePhase) * 20;
        const alpha = 0.3 * (1 - i * 0.2);
        
        ctx.strokeStyle = `rgba(255, 107, 157, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      // Nome do acorde
      ctx.fillStyle = 'rgba(255, 107, 157, 0.8)';
      ctx.font = 'italic 14px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText(`♪ ${chord.name} ♪`, 0, -60);
      
      ctx.restore();
    }
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function getState() {
    return { ...state };
  }

  // API pública
  return {
    init,
    update,
    renderAuras,
    renderCastleBreath,
    renderOmegaResonance,
    renderBelaVidaReflections,
    onBelaVidaPhrase,
    queueBelaVidaChord,
    getState
  };
})();

// Auto-expose
if (typeof window !== 'undefined') {
  window.CoreCantado = CoreCantado;
}