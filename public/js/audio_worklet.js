// ===== AUDIO WORKLET MODULE =====
// AudioWorklet for sacred synthesis

import { addLogEntry } from './utils.js';

let audioWorkletContext = null;
let audioWorkletNode = null;

async function initAudioWorklet() {
    try {
        if (!audioWorkletContext) {
            audioWorkletContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 48000
            });
        }

        // Create AudioWorklet processor inline
        const processorCode = `
            class SacredSynthProcessor extends AudioWorkletProcessor {
                constructor() {
                    super();
                    this.phase = 0;
                    this.frequency = 528;
                    this.amplitude = 0.3;
                    this.waveform = 'sine';
                    this.port.onmessage = (e) => {
                        if (e.data.frequency) this.frequency = e.data.frequency;
                        if (e.data.amplitude) this.amplitude = e.data.amplitude;
                        if (e.data.waveform) this.waveform = e.data.waveform;
                    };
                }

                process(inputs, outputs, parameters) {
                    const output = outputs[0];
                    const channel = output[0];
                    const sampleRate = sampleRate;
                    
                    for (let i = 0; i < channel.length; i++) {
                        this.phase += this.frequency / sampleRate;
                        if (this.phase >= 1) this.phase -= 1;
                        
                        let sample = 0;
                        switch(this.waveform) {
                            case 'sine':
                                sample = Math.sin(this.phase * Math.PI * 2);
                                break;
                            case 'triangle':
                                sample = 2 * Math.abs(2 * (this.phase - Math.floor(this.phase + 0.5))) - 1;
                                break;
                            case 'square':
                                sample = this.phase < 0.5 ? 1 : -1;
                                break;
                            case 'sawtooth':
                                sample = 2 * (this.phase - 0.5);
                                break;
                        }
                        channel[i] = sample * this.amplitude;
                    }
                    return true;
                }
            }
            registerProcessor('sacred-synth', SacredSynthProcessor);
        `;

        const blob = new Blob([processorCode], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        
        await audioWorkletContext.audioWorklet.addModule(url);
        
        audioWorkletNode = new AudioWorkletNode(audioWorkletContext, 'sacred-synth');
        audioWorkletNode.connect(audioWorkletContext.destination);
        
        addLogEntry('🎵 AudioWorklet inicializado - Síntese sagrada ativa', 'success');
        return true;
    } catch (e) {
        console.error('Erro ao inicializar AudioWorklet:', e);
        addLogEntry('❌ AudioWorklet falhou: ' + e.message, 'error');
        return false;
    }
}

function updateAudioWorklet(params) {
    if (audioWorkletNode && audioWorkletNode.port) {
        audioWorkletNode.port.postMessage(params);
    }
}

// Export
export { initAudioWorklet, updateAudioWorklet };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.initAudioWorklet = initAudioWorklet;
    window.updateAudioWorklet = updateAudioWorklet;
}