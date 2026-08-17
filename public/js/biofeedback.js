// ===== BIOFEEDBACK MODULE =====
// Biofeedback HRV/EEG handling

function handleHRVData(event) {
                                const value = event.target.value;
                                // Parse heart rate measurement (Bluetooth GATT format)
                                const flags = value.getUint8(0);
                                const hr16 = (flags & 0x01) !== 0;
                                let heartRate = hr16 ? value.getUint16(1, true) : value.getUint8(1);
            
                                // Calculate HRV from RR intervals if available
                                if (flags & 0x10) { // RR interval present
                                    const rrOffset = hr16 ? 3 : 2;
                                    const rrInterval = value.getUint16(rrOffset, true) / 1024; // seconds
                                    biofeedback.hrv = 1000 / rrInterval; // Convert to HRV proxy
                                    biofeedback.hrvHistory.push({ time: Date.now(), hrv: biofeedback.hrv });
                                    if (biofeedback.hrvHistory.length > 300) biofeedback.hrvHistory.shift();
                                }
            
                                biofeedback.lastReading = Date.now();
                            }
        
                            function handleEEGData(event) {
                                const value = event.target.value;
                                // Parse Muse EEG data (simplified)
                                const data = new Float32Array(value.buffer);
                                if (data.length >= 5) {
                                    biofeedback.eeg = {
                                        delta: data[0] || 0,
                                        theta: data[1] || 0,
                                        alpha: data[2] || 0,
                                        beta: data[3] || 0,
                                        gamma: data[4] || 0
                                    };
                                    biofeedback.eegHistory.push({ time: Date.now(), ...biofeedback.eeg });
                                    if (biofeedback.eegHistory.length > 300) biofeedback.eegHistory.shift();
                                }
                                biofeedback.lastReading = Date.now();
                            }
        
                            function onBiofeedbackDisconnect() {
                                biofeedback.connected = false;
                                console.log('Biofeedback device disconnected');
                            }
        
                            

// Export
export { handleHRVData, handleEEGData, onBiofeedbackDisconnect, connectBiofeedback };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.handleHRVData = handleHRVData;
    window.handleEEGData = handleEEGData;
    window.onBiofeedbackDisconnect = onBiofeedbackDisconnect;
    window.connectBiofeedback = connectBiofeedback;
}
