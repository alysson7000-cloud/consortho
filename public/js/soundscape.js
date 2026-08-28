/**
 * SOUNDSCAPE — Ambiente sonoro vivo para Consortho
 * WebAudio API standalone, reage ao STATE do jogo
 * 
 * Features:
 * - Ambiente contínuo: vento, água, tons etéreos
 * - Reativo: stack, portal, beyblade, Ω, bela-vida, HRV, fase
 * - Controle: ativar/desativar, volume
 */
const Soundscape = (function() {
  'use strict';

  let audioContext = null;
  let masterGain = null;
  let ambientSources = {};
  let isInitialized = false;
  let isPlaying = false;
  let currentState = {};
  let scheduledEvents = [];

  // Configuração das camadas sonoras
  const LAYERS = {
    ambient_wind: { type: 'noise', freq: [100, 500], gain: 0.08, attack: 5, release: 5 },
    ambient_water: { type: 'noise', freq: [200, 800], gain: 0.06, attack: 3, release: 3 },
    ethereal_tones: { type: 'sine', baseFreq: 110, harmonics: [2, 3, 5, 8], gain: 0.04, interval: 8 },
    heartbeat_rhythm: { type: 'pulse', freq: 60, gain: 0.05, interval: 1 },
    cosmic_drift: { type: 'noise', freq: [50, 2000], gain: 0.03, attack: 10, release: 10 },
    whisper_harmonics: { type: 'sine', baseFreq: 220, harmonics: [1.5, 2, 2.5, 3], gain: 0.03, interval: 6 },
    bela_vida_chords: { type: 'chord', notes: [220, 277, 330], gain: 0.08, interval: 120 },
    omega_resonance: { type: 'om', baseFreq: 136.1, harmonics: [2, 3, 4, 5, 8], gain: 0.06 },
    infinite_harmony: { type: 'pad', baseFreq: 55, gain: 0.02 }
  };

  function init() {
    if (isInitialized) return;
    
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(audioContext.destination);
      isInitialized = true;
      console.log('[Soundscape] 🎵 Inicializado');
    } catch (e) {
      console.error('[Soundscape] Erro ao inicializar WebAudio:', e);
    }
  }

  function resume() {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  function update(STATE, dt) {
    if (!isInitialized || !isPlaying) return;
    currentState = STATE || {};
    updateLayers(dt);
  }

  function updateLayers(dt) {
    const hrv = currentState.hrv?.value || 60;
    const stack = currentState.stack || 0;
    const phase = currentState.evolutionPhase || 1;
    const consciousness = currentState.consciousnessLevel || 0;
    const quantum = currentState.quantum?.entanglement || 0;
    const isCombat = currentState.isCombat || false;
    const portalActive = currentState.portalActive || false;
    const beybladeActive = currentState.mode === 'BEYBLADE';

    // Vento - sempre presente, intensidade com HRV
    setLayerGain('ambient_wind', 0.05 + (hrv / 120) * 0.05);

    // Água - presente perto de fonte/calmo
    const nearWater = !isCombat && hrv > 65;
    setLayerGain('ambient_water', nearWater ? 0.06 : 0.01);

    // Tons etéreos - fase 2+
    if (phase >= 2) {
      setLayerGain('ethereal_tones', 0.03 + (consciousness / 100) * 0.03);
    }

    // Batida cardíaca - reage a HRV
    setLayerRate('heartbeat_rhythm', Math.max(0.5, 60 / hrv));
    setLayerGain('heartbeat_rhythm', 0.04 * (1 + stack / 50));

    // Drift cósmico - fase 3+
    if (phase >= 3) {
      setLayerGain('cosmic_drift', 0.02 + (quantum / 100) * 0.03);
    }

    // Harmônicos sussurrados - fase 3+
    if (phase >= 3) {
      setLayerGain('whisper_harmonics', 0.02 + (consciousness / 100) * 0.02);
    }

    // Portal - whoosh
    if (portalActive && !ambientSources.portal_whoosh) {
      playPortalWhoosh();
    }

    // Beyblade - ring tone
    if (beybladeActive && !ambientSources.beyblade_ring) {
      playBeybladeRing();
    }

    // Ω resonance - fase 4+
    if (phase >= 4 || consciousness > 80) {
      setLayerGain('omega_resonance', 0.04 + (consciousness / 100) * 0.04);
    }

    // Harmonia infinita - fase 5+
    if (phase >= 5) {
      setLayerGain('infinite_harmony', 0.01 + (consciousness / 100) * 0.02);
    }
  }

  function setLayerGain(layerId, gain) {
    const source = ambientSources[layerId];
    if (source && source.gainNode) {
      source.gainNode.gain.linearRampToValueAtTime(gain, audioContext.currentTime + 1);
    }
  }

  function setLayerRate(layerId, rate) {
    const source = ambientSources[layerId];
    if (source && source.oscillator) {
      source.oscillator.frequency.linearRampToValueAtTime(rate, audioContext.currentTime + 0.5);
    }
  }

  function startLayer(layerId) {
    if (!isInitialized || ambientSources[layerId]) return;
    
    const config = LAYERS[layerId];
    if (!config) return;

    try {
      let source = { gainNode: audioContext.createGain() };
      source.gainNode.connect(masterGain);
      source.gainNode.gain.value = config.gain || 0.05;

      if (config.type === 'noise') {
        source.buffer = createNoiseBuffer(config.freq[0], config.freq[1], 2);
        source.source = audioContext.createBufferSource();
        source.source.buffer = source.buffer;
        source.source.loop = true;
        source.source.connect(source.gainNode);
        source.source.start();
      } else if (config.type === 'sine') {
        source.oscillator = audioContext.createOscillator();
        source.oscillator.type = 'sine';
        source.oscillator.frequency.value = config.baseFreq || 110;
        source.oscillator.connect(source.gainNode);
        source.oscillator.start();
        
        // Harmônicos
        if (config.harmonics) {
          source.harmonics = config.harmonics.map(h => {
            const osc = audioContext.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = (config.baseFreq || 110) * h;
            const gain = audioContext.createGain();
            gain.gain.value = config.gain * 0.3 / h;
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            return { osc, gain };
          });
        }
      } else if (config.type === 'pulse') {
        source.oscillator = audioContext.createOscillator();
        source.oscillator.type = 'sine';
        source.oscillator.frequency.value = config.freq || 60;
        source.oscillator.connect(source.gainNode);
        source.oscillator.start();
        
        // Envelope pulsante
        pulseEnvelope(source.gainNode, config.interval || 1);
      } else if (config.type === 'chord') {
        source.oscillators = config.notes.map(note => {
          const osc = audioContext.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = note;
          const gain = audioContext.createGain();
          gain.gain.value = config.gain / config.notes.length;
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          return { osc, gain };
        });
      } else if (config.type === 'om') {
        source.oscillator = audioContext.createOscillator();
        source.oscillator.type = 'sine';
        source.oscillator.frequency.value = config.baseFreq;
        source.oscillator.connect(source.gainNode);
        source.oscillator.start();
        
        if (config.harmonics) {
          source.harmonics = config.harmonics.map(h => {
            const osc = audioContext.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = config.baseFreq * h;
            const gain = audioContext.createGain();
            gain.gain.value = config.gain * 0.2 / h;
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            return { osc, gain };
          });
        }
      } else if (config.type === 'pad') {
        source.oscillator = audioContext.createOscillator();
        source.oscillator.type = 'triangle';
        source.oscillator.frequency.value = config.baseFreq;
        source.oscillator.connect(source.gainNode);
        source.oscillator.start();
      }

      ambientSources[layerId] = source;
    } catch (e) {
      console.error(`[Soundscape] Erro ao iniciar layer ${layerId}:`, e);
    }
  }

  function stopLayer(layerId) {
    const source = ambientSources[layerId];
    if (!source) return;

    try {
      if (source.source) { source.source.stop(); source.source.disconnect(); }
      if (source.oscillator) { source.oscillator.stop(); source.oscillator.disconnect(); }
      if (source.oscillators) { source.oscillators.forEach(o => { o.osc.stop(); o.osc.disconnect(); o.gain.disconnect(); }); }
      if (source.harmonics) { source.harmonics.forEach(h => { h.osc.stop(); h.osc.disconnect(); h.gain.disconnect(); }); }
      if (source.gainNode) source.gainNode.disconnect();
      delete ambientSources[layerId];
    } catch (e) {
      console.error(`[Soundscape] Erro ao parar layer ${layerId}:`, e);
    }
  }

  function pulseEnvelope(gainNode, interval) {
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
    
    // Repete
    setTimeout(() => {
      if (ambientSources.heartbeat_rhythm) {
        pulseEnvelope(gainNode, interval);
      }
    }, interval * 1000);
  }

  function createNoiseBuffer(lowFreq, highFreq, duration) {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    // Filtro simples passa-banda
    return buffer;
  }

  function playTone(frequency, type = 'sine', duration = 1, gain = 0.1) {
    if (!isInitialized) return;
    
    try {
      const osc = audioContext.createOscillator();
      const g = audioContext.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      osc.connect(g);
      g.connect(masterGain);
      g.gain.value = gain;
      const now = audioContext.currentTime;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(gain, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (e) {
      console.error('[Soundscape] Erro playTone:', e);
    }
  }

  function playChord(notes, duration = 2, gain = 0.08) {
    if (!isInitialized) return;
    
    notes.forEach((note, i) => {
      setTimeout(() => playTone(note, 'sine', duration, gain / notes.length), i * 50);
    });
  }

  function playOmChord(baseFreq, harmonics) {
    if (!isInitialized) return;
    
    const notes = [baseFreq].concat(harmonics.map(h => baseFreq * h));
    playChord(notes, 4, 0.06);
  }

  function playOmPulse(frequency, intensity) {
    if (!isInitialized) return;
    
    playTone(frequency, 'sine', 2, 0.05 * intensity);
    playTone(frequency * 2, 'sine', 1.5, 0.03 * intensity);
    playTone(frequency * 3, 'sine', 1, 0.02 * intensity);
  }

  function stopOmTone() {
    // As tones param sozinhas via envelope
  }

  function playPortalWhoosh() {
    if (!isInitialized) return;
    
    const osc = audioContext.createOscillator();
    const g = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1.5);
    
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 5;
    
    osc.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    g.gain.value = 0.1;
    
    const now = audioContext.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    osc.start(now);
    osc.stop(now + 1.5);
    
    ambientSources.portal_whoosh = { osc, g, filter };
    setTimeout(() => delete ambientSources.portal_whoosh, 2000);
  }

  function playBeybladeRing() {
    if (!isInitialized) return;
    
    const notes = [880, 1320, 1760, 2640];
    notes.forEach((note, i) => {
      setTimeout(() => playTone(note, 'sine', 0.8, 0.06), i * 100);
    });
    
    ambientSources.beyblade_ring = true;
    setTimeout(() => delete ambientSources.beyblade_ring, 2000);
  }

  function trigger(event, data) {
    switch (event) {
      case 'phase_up':
        // Som de evolução
        playChord([220, 330, 440, 554, 660], 3, 0.1);
        break;
      case 'stack_up':
        playTone(440 + stack * 10, 'sine', 0.5, 0.08);
        break;
      case 'combo':
        playChord([523, 659, 784], 1, 0.1);
        break;
    }
  }

  function start() {
    if (!isInitialized) init();
    resume();
    isPlaying = true;
    
    // Inicia layers base
    startLayer('ambient_wind');
    startLayer('ambient_water');
    
    console.log('[Soundscape] ▶️ Tocando');
  }

  function stop() {
    isPlaying = false;
    Object.keys(ambientSources).forEach(stopLayer);
    console.log('[Soundscape] ⏹️ Parado');
  }

  function setVolume(vol) {
    if (masterGain) {
      masterGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, vol)), audioContext.currentTime + 0.5);
    }
  }

  function getState() {
    return {
      initialized: isInitialized,
      playing: isPlaying,
      activeLayers: Object.keys(ambientSources),
      volume: masterGain?.gain?.value || 0
    };
  }

  // Auto-expose
  if (typeof window !== 'undefined') {
    window.Soundscape = { init, update, start, stop, playTone, playChord, playOmChord, playOmPulse, stopOmTone, trigger, setVolume, getState, audioContext: () => audioContext };
  }

  return { init, update, start, stop, playTone, playChord, playOmChord, playOmPulse, stopOmTone, trigger, setVolume, getState };
})();