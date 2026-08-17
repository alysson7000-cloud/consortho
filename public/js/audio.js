// ===== AUDIO MODULE =====
// Web Audio API and frequency playback

import { addLogEntry } from './utils.js';

function setupAudio() {
            document.addEventListener('click', () => {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
            }, { once: true });
            
            // Haptic feedback for mobile
            if ('vibrate' in navigator) {
                window.hapticFeedback = (pattern) => navigator.vibrate(pattern);
            } else {
                window.hapticFeedback = () => {};
            }
        }
        
        function playFrequency(hz) {
                    if (!audioContext) return;
            
                    // Stop current
                    if (currentOscillator) {
                        currentGainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                        currentOscillator.stop(audioContext.currentTime + 0.1);
                    }
            
                    currentOscillator = audioContext.createOscillator();
                    currentGainNode = audioContext.createGain();
            
                    currentOscillator.type = 'sine';
                    currentOscillator.frequency.value = typeof hz === 'number' ? hz : 528; // OM/�� default to 528
            
                    currentGainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    currentGainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
                    currentGainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3);
            
                    currentOscillator.connect(currentGainNode);
                    currentGainNode.connect(audioContext.destination);
            
                    currentOscillator.start(audioContext.currentTime);
                    currentOscillator.stop(audioContext.currentTime + 3);
                }
        
                // ===== CANVAS =====
                

// Export
export { setupAudio, playFrequency };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.setupAudio = setupAudio;
    window.playFrequency = playFrequency;
}
