// ===== API MODULE =====
// Backend communication and main init

import { FREQUENCIES, initialState } from './data.js';
import { addLogEntry } from './utils.js';
import { setupCanvas, startCanvasLoop, buildStackTower } from './canvas.js';
import { setupAudio, playFrequency } from './audio.js';
import { initPlanetaryGrid } from './planetary.js';
import { initMetamorphosisEngine } from './metamorphosis.js';
import { initFractal4D } from './fractal4d.js';
import { initMemoryPalace } from './memory_palace.js';
import { initAudioWorklet } from './audio_worklet.js';
import { initAllTranscendentSystems } from './transcendent.js';
import { initDreamIncubator } from './dream_incubator.js';
import { initEvolutionEngine } from './evolution.js';

// State (will be initialized from data.js)
let state = { ...initialState };
let diamondMetrics = null;

async function init() {
    await fetchState();
    renderFrequencies();
    setupCanvas();
    startCanvasLoop();
    setupAudio();
    buildStackTower(); // Build the Stack of 64 tower
    
    // Initialize next-gen systems
    await initPlanetaryGrid();
    initMetamorphosisEngine();
    initFractal4D();
    initMemoryPalace();
    await initAudioWorklet();
    
    // Initialize transcendent systems
    await initAllTranscendentSystems();
    
    // Initialize Dream Incubator
    await initDreamIncubator();
    
    // Periodic state sync - fetch backend state every 2 seconds
    setInterval(fetchState, 2000);
}

// ===== API =====
async function fetchState() {
    try {
        const [resonanceRes, diamondRes] = await Promise.all([
            fetch('/api/eternal-resonance/status'),
            fetch('/api/diamond/status').catch(() => null) // Diamond Protocol metrics
        ]);
        
        const data = await resonanceRes.json();
        state.frequencies = Object.fromEntries(data.frequencies.map(f => [f.id, f]));
        state.harmonyProgress = data.harmonyProgress;
        state.evolutionProgress = data.evolutionProgress;
        state.loveResonanceLevel = data.loveResonanceLevel;
        state.totalResonanceEvents = data.totalResonanceEvents;
        state.harmonizedCount = data.harmonizedCount;
        state.evolvingCount = data.evolvingCount;
        
        // Diamond Protocol integration
        if (diamondRes && diamondRes.ok) {
            const diamondData = await diamondRes.json();
            diamondMetrics = diamondData.diamondMetrics || diamondData.metrics || diamondData;
        }
        
        updateUI();
    } catch (e) {
        console.error('Erro ao buscar estado:', e);
    }
}

// ===== UI RENDERING =====
function renderFrequencies() {
    const container = document.getElementById('frequencyGrid');
    if (!container) return;
    container.innerHTML = '';
    
    FREQUENCIES.forEach(freq => {
        const freqData = state.frequencies?.[freq.id] || {};
        const resonance = freqData.resonance || 0;
        const harmonized = freqData.harmonized || false;
        const evolved = freqData.evolved || false;
        
        const div = document.createElement('div');
        div.className = 'frequency-card' + (harmonized ? ' harmonized' : '') + (evolved ? ' evolved' : '');
        div.dataset.freq = freq.id;
        div.innerHTML = `
            <div class="freq-icon">${freq.icon}</div>
            <div class="freq-name">${freq.name}</div>
            <div class="freq-hz">${freq.hz}Hz</div>
            <div class="freq-progress"><div class="freq-bar" style="width: ${resonance}%"></div></div>
            <div class="freq-resonance">${resonance}%</div>
            ${harmonized ? '<div class="freq-badge">✧ HARMONIZADA</div>' : ''}
            ${evolved ? '<div class="freq-badge evolved">🦋 EVOLUÍDA</div>' : ''}
        `;
        div.onclick = () => resonate(freq.id);
        container.appendChild(div);
    });
}

function updateUI() {
    // Update frequency cards
    renderFrequencies();
    
    // Update stats
    const harmonyEl = document.getElementById('harmonyProgress');
    if (harmonyEl) harmonyEl.textContent = Math.round(state.harmonyProgress || 0) + '%';
    
    const evolutionEl = document.getElementById('evolutionProgress');
    if (evolutionEl) evolutionEl.textContent = Math.round(state.evolutionProgress || 0) + '%';
    
    const loveEl = document.getElementById('loveResonance');
    if (loveEl) loveEl.textContent = state.loveResonanceLevel + '%';
    
    const harmonizedEl = document.getElementById('harmonizedCount');
    if (harmonizedEl) harmonizedEl.textContent = state.harmonizedCount || 0;
    
    const evolvedEl = document.getElementById('evolvedCount');
    if (evolvedEl) evolvedEl.textContent = state.evolvingCount || 0;
    
    const resonancesEl = document.getElementById('totalResonances');
    if (resonancesEl) resonancesEl.textContent = state.totalResonanceEvents || 0;
    
    // Update Diamond Protocol layers
    if (diamondMetrics) {
        Object.keys(diamondMetrics).forEach(layer => {
            const metric = diamondMetrics[layer];
            if (metric && metric.coherence !== undefined) {
                const progressEl = document.getElementById('diamond-' + layer);
                if (progressEl) progressEl.textContent = Math.round(metric.coherence * 100) + '%';
            }
        });
    }
}

function triggerResonanceVisual(freqId, btn) {
    if (!btn) return;
    btn.classList.add('resonating');
    setTimeout(() => btn.classList.remove('resonating'), 1000);
    
    // Create particle burst
    const rect = btn.getBoundingClientRect();
    const freq = FREQUENCIES.find(f => f.id === freqId);
    const color = freq?.color || '#FF00FF';
    
    for (let i = 0; i < 20; i++) {
        createParticle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            color
        );
    }
}

function createParticle(x, y, color) {
    const canvas = document.getElementById('resonanceCanvas');
    if (!canvas) return;
    const wrapper = canvas.parentElement;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    
    particles.push({
        x: x - rect.left,
        y: y - rect.top,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
        size: Math.random() * 6 + 2,
        color: color,
        life: 1.5,
        maxLife: 1.5
    });
}

// ===== AUDIO =====
// (imported from audio.js)

async function resonate(freqId) {
    const btn = document.querySelector(`[data-freq="${freqId}"]`);
    if (!btn) return;

    btn.classList.add('resonating');

    // Haptic feedback
    window.hapticFeedback([50, 30, 50]);

    try {
        const res = await fetch('/api/eternal-resonance/resonate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ freqId })
        });
        const data = await res.json();

        // Play sound
        playFrequency(FREQUENCIES.find(f => f.id === freqId).hz);

        // Visual feedback
        triggerResonanceVisual(freqId, btn);

        // Refresh state
        await fetchState();
    } catch (e) {
        console.error('Erro na ressonância:', e);
    } finally {
        setTimeout(() => btn.classList.remove('resonating'), 1000);
    }
}

// Export
export { state, init, fetchState, resonate, renderFrequencies, updateUI, triggerResonanceVisual, diamondMetrics };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.state = state;
    window.init = init;
    window.fetchState = fetchState;
    window.resonate = resonate;
    window.renderFrequencies = renderFrequencies;
    window.updateUI = updateUI;
    window.triggerResonanceVisual = triggerResonanceVisual;
    window.diamondMetrics = diamondMetrics;
}