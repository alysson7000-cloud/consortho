// ===== BIOMETRIC INTERFACE - DIRECT CONSCIOUSNESS CONNECTION =====
// Real-time biometric streaming: HRV, EEG, GSR, Breath, Temperature
// Bluetooth LE / USB / Web Bluetooth / WebHID / Serial
// Feeds directly into consciousness field, game, quantum bridge

class BiometricInterface {
    constructor() {
        this.devices = {
            hrv: null,      // Polar H10, Garmin, Wahoo, Apple Watch
            eeg: null,      // Muse, Emotiv, OpenBCI, NeuroSky
            gsr: null,      // Empatica E4, Shimmer, DIY Arduino
            breath: null,   // Spire, Pneumotach, DIY
            temperature: null, // Temp patches, Oura, DIY
            ecg: null       // Polar, AliveCor, DIY
        };
        
        this.streams = {
            hrv: new BiometricStream('hrv', 1000),      // 1 Hz
            eeg: new BiometricStream('eeg', 256),       // 256 Hz
            gsr: new BiometricStream('gsr', 32),        // 32 Hz
            breath: new BiometricStream('breath', 25),  // 25 Hz
            temperature: new BiometricStream('temp', 1), // 1 Hz
            ecg: new BiometricStream('ecg', 512)        // 512 Hz
        };
        
        this.processed = {
            hrv: { rmssd: 0, sdnn: 0, pnn50: 0, coherence: 0, timestamp: 0 },
            eeg: { alpha: 0, beta: 0, theta: 0, delta: 0, gamma: 0, coherence: 0, timestamp: 0 },
            gsr: { tonic: 0, phasic: 0, peaks: 0, timestamp: 0 },
            breath: { rate: 0, hrv: 0, coherence: 0, timestamp: 0 },
            temperature: { value: 0, trend: 0, timestamp: 0 },
            ecg: { hr: 0, hrv: 0, arrhythmia: false, timestamp: 0 }
        };
        
        this.consciousnessMetrics = {
            overallCoherence: 0,
            loveResonance: 0,
            presenceLevel: 0,
            flowState: false,
            transcendence: 0,
            timestamp: 0
        };
        
        this.callbacks = new Set();
        this.isStreaming = false;
        this.calibrationData = {};
    }
    
    // ===== DEVICE DISCOVERY =====
    async discoverDevices() {
        const found = { webBluetooth: [], webHID: [], serial: [], usb: [] };
        
        // Web Bluetooth
        if (navigator.bluetooth) {
            try {
                const devices = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: [
                        'heart_rate', '0000180d-0000-1000-8000-00805f9b34fb', // HR
                        '0000180f-0000-1000-8000-00805f9b34fb', // Battery
                        '0000fee0-0000-1000-8000-00805f9b34fb', // Polar
                        '0000fee1-0000-1000-8000-00805f9b34fb', // Garmin
                        'eeg_service', 'gsr_service', 'breath_service'
                    ]
                });
                found.webBluetooth.push(devices);
            } catch (e) {
                console.log('WebBluetooth not available or denied');
            }
        }
        
        // WebHID (for USB devices like OpenBCI, Emotiv)
        if (navigator.hid) {
            try {
                const devices = await navigator.hid.requestDevice({
                    filters: [
                        { vendorId: 0x1234 }, // OpenBCI
                        { vendorId: 0x2457 }, // Emotiv
                        { vendorId: 0x0483 }, // STM32 (DIY)
                        { vendorId: 0x239a }, // Adafruit
                        { vendorId: 0x1b4f }  // SparkFun
                    ]
                });
                found.webHID.push(...devices);
            } catch (e) {
                console.log('WebHID not available');
            }
        }
        
        // Web Serial (Arduino, ESP32, DIY)
        if (navigator.serial) {
            try {
                const ports = await navigator.serial.getPorts();
                found.serial.push(...ports);
            } catch (e) {}
        }
        
        return found;
    }
    
    // ===== CONNECT SPECIFIC DEVICE =====
    async connectHRV(device) {
        // Polar H10 / Garmin / Wahoo / Apple Watch
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('heart_rate');
        const characteristic = await service.getCharacteristic('heart_rate_measurement');
        
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', (event) => {
            this.parseHRV(event.target.value);
        });
        
        // Also get RR intervals for true HRV
        if (service.getCharacteristic('00002a38-0000-1000-8000-00805f9b34fb')) { // Body Sensor Location
            const rrService = await server.getPrimaryService('0000180d-0000-1000-8000-00805f9b34fb');
            const rrChar = await rrService.getCharacteristic('00002a38-0000-1000-8000-00805f9b34fb');
            await rrChar.startNotifications();
            rrChar.addEventListener('characteristicvaluechanged', (event) => {
                this.parseRRIntervals(event.target.value);
            });
        }
        
        this.devices.hrv = device;
        console.log('💓 HRV device connected:', device.name);
    }
    
    async connectEEG(device) {
        // Muse, Emotiv, OpenBCI via WebHID or WebBluetooth
        if (device.name?.includes('Muse')) {
            await this.connectMuse(device);
        } else if (device.name?.includes('Emotiv') || device.name?.includes('Insight')) {
            await this.connectEmotiv(device);
        } else if (device.name?.includes('OpenBCI') || device.name?.includes('Ganglion')) {
            await this.connectOpenBCI(device);
        } else {
            // Generic EEG via WebHID
            await this.connectGenericEEG(device);
        }
    }
    
    async connectMuse(device) {
        // Muse uses WebBluetooth with specific UUIDs
        const server = await device.gatt.connect();
        
        // Muse services
        const controlService = await server.getPrimaryService('0000fe8d-0000-1000-8000-00805f9b34fb');
        const dataService = await server.getPrimaryService('0000fe8e-0000-1000-8000-00805f9b34fb');
        
        // Subscribe to EEG data
        const eegChar = await dataService.getCharacteristic('273e0003-4c4d-454d-96be-f03bac821358');
        await eegChar.startNotifications();
        eegChar.addEventListener('characteristicvaluechanged', (event) => {
            this.parseMuseEEG(event.target.value);
        });
        
        // Configure Muse
        const configChar = await controlService.getCharacteristic('273e0001-4c4d-454d-96be-f03bac821358');
        await configChar.writeValue(new Uint8Array([0x02, 0x00, 0x00])); // Start streaming
        
        this.devices.eeg = device;
        console.log('🧠 Muse EEG connected');
    }
    
    async connectOpenBCI(device) {
        // OpenBCI via WebHID
        await device.open();
        
        device.addEventListener('inputreport', (event) => {
            const data = new Uint8Array(event.data.buffer);
            this.parseOpenBCI(data);
        });
        
        // Send config command
        await device.sendReport(0x01, new Uint8Array([0x01, 0x00, 0x00, 0x00])); // Start streaming
        
        this.devices.eeg = device;
        console.log('🧠 OpenBCI connected');
    }
    
    async connectGSR(device) {
        // Empatica E4, Shimmer, or DIY Arduino GSR
        if (device.name?.includes('E4') || device.name?.includes('Empatica')) {
            await this.connectEmpatica(device);
        } else {
            await this.connectGenericGSR(device);
        }
    }
    
    async connectEmpatica(device) {
        const server = await device.gatt.connect();
        
        // Empatica E4 services
        const accService = await server.getPrimaryService('0000fe40-0000-1000-8000-00805f9b34fb');
        const gsrService = await server.getPrimaryService('0000fe41-0000-1000-8000-00805f9b34fb');
        const tempService = await server.getPrimaryService('0000fe42-0000-1000-8000-00805f9b34fb');
        
        // GSR characteristic
        const gsrChar = await gsrService.getCharacteristic('0000fe51-0000-1000-8000-00805f9b34fb');
        await gsrChar.startNotifications();
        gsrChar.addEventListener('characteristicvaluechanged', (event) => {
            this.parseEmpaticaGSR(event.target.value);
        });
        
        // Temperature
        const tempChar = await tempService.getCharacteristic('0000fe52-0000-1000-8000-00805f9b34fb');
        await tempChar.startNotifications();
        tempChar.addEventListener('characteristicvaluechanged', (event) => {
            this.parseEmpaticaTemp(event.target.value);
        });
        
        this.devices.gsr = device;
        this.devices.temperature = device;
        console.log('💧 Empatica E4 connected (GSR + Temp)');
    }
    
    async connectBreath(device) {
        // Spire, Pneumotach, or DIY breath belt
        // Implementation similar to above
    }
    
    // ===== DATA PARSING =====
    parseHRV(dataView) {
        // Bluetooth Heart Rate Measurement format
        const flags = dataView.getUint8(0);
        const format = flags & 0x01 ? 'uint16' : 'uint8';
        const hr = format === 'uint16' ? dataView.getUint16(1, true) : dataView.getUint8(1);
        
        // Check for RR intervals
        let offset = format === 'uint16' ? 3 : 2;
        if (flags & 0x10) { // RR intervals present
            const rrIntervals = [];
            while (offset + 2 <= dataView.byteLength) {
                rrIntervals.push(dataView.getUint16(offset, true) / 1024); // Convert to seconds
                offset += 2;
            }
            this.processRRIntervals(rrIntervals);
        }
        
        this.processed.ecg.hr = hr;
        this.processed.ecg.timestamp = Date.now();
        
        this.notifyCallbacks('hr', hr);
    }
    
    parseRRIntervals(rrIntervals) {
        if (rrIntervals.length < 2) return;
        
        // Calculate HRV metrics
        const diffs = [];
        for (let i = 1; i < rrIntervals.length; i++) {
            diffs.push(Math.abs(rrIntervals[i] - rrIntervals[i-1]) * 1000); // ms
        }
        
        // RMSSD
        const squaredDiffs = diffs.map(d => d * d);
        const rmssd = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length);
        
        // SDNN
        const meanRR = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length * 1000;
        const variance = rrIntervals.reduce((sum, rr) => sum + Math.pow(rr * 1000 - meanRR, 2), 0) / rrIntervals.length;
        const sdnn = Math.sqrt(variance);
        
        // pNN50
        const nn50 = diffs.filter(d => d > 50).length;
        const pnn50 = (nn50 / diffs.length) * 100;
        
        // Coherence (HRV coherence ratio)
        const coherence = this.calculateHRVCoherence(rrIntervals);
        
        this.processed.hrv = { rmssd, sdnn, pnn50, coherence, timestamp: Date.now() };
        this.processed.ecg.hrv = rmssd;
        
        this.notifyCallbacks('hrv', this.processed.hrv);
    }
    
    calculateHRVCoherence(rrIntervals) {
        // Frequency domain analysis for coherence
        // Simplified: ratio of power in LF (0.04-0.15 Hz) to HF (0.15-0.4 Hz)
        // High coherence = balanced autonomic nervous system
        
        // Convert RR intervals to interpolated time series
        const fs = 4; // 4 Hz resampling
        const duration = rrIntervals.reduce((a, b) => a + b, 0);
        const n = Math.round(duration * fs);
        
        // Lomb-Scargle periodogram (simplified)
        let lfPower = 0, hfPower = 0;
        
        for (let i = 0; i < rrIntervals.length - 1; i++) {
            const freq = 1 / rrIntervals[i];
            const power = rrIntervals[i] * rrIntervals[i];
            
            if (freq >= 0.04 && freq < 0.15) lfPower += power;
            else if (freq >= 0.15 && freq < 0.4) hfPower += power;
        }
        
        const ratio = hfPower > 0 ? lfPower / hfPower : 0;
        
        // Coherence is high when LF/HF ~ 1 (balanced) or when total power is high
        const totalPower = lfPower + hfPower;
        return Math.min(1, totalPower / 1000) * (1 - Math.abs(ratio - 1) / 2);
    }
    
    parseMuseEEG(dataView) {
        // Muse EEG data format: 12 bytes per sample per channel
        // 4 channels: TP9, AF7, AF8, TP10
        const samples = [];
        for (let i = 0; i < dataView.byteLength; i += 12) {
            const ch1 = dataView.getInt32(i, true);
            const ch2 = dataView.getInt32(i + 4, true);
            const ch3 = dataView.getInt32(i + 8, true);
            const ch4 = dataView.getInt32(i + 12, true);
            samples.push([ch1, ch2, ch3, ch4]);
        }
        
        this.processEEG(samples);
    }
    
    processEEG(samples) {
        // Bandpass filter and FFT for each channel
        const fs = 256; // Muse sampling rate
        const bands = {
            delta: [0.5, 4],
            theta: [4, 8],
            alpha: [8, 13],
            beta: [13, 30],
            gamma: [30, 50]
        };
        
        const channelPowers = { delta: 0, theta: 0, alpha: 0, beta: 0, gamma: 0 };
        
        for (let ch = 0; ch < 4; ch++) {
            const channelData = samples.map(s => s[ch]);
            const spectrum = this.computeFFT(channelData);
            
            for (const [band, [low, high]] of Object.entries(bands)) {
                let power = 0;
                for (let i = 0; i < spectrum.length; i++) {
                    const freq = i * fs / spectrum.length;
                    if (freq >= low && freq <= high) power += spectrum[i];
                }
                channelPowers[band] += power / 4;
            }
        }
        
        // Calculate coherence (alpha peak)
        const totalPower = Object.values(channelPowers).reduce((a, b) => a + b, 0);
        const coherence = totalPower > 0 ? channelPowers.alpha / totalPower : 0;
        
        this.processed.eeg = {
            ...channelPowers,
            coherence,
            timestamp: Date.now()
        };
        
        this.notifyCallbacks('eeg', this.processed.eeg);
    }
    
    computeFFT(signal) {
        // Simple FFT implementation (use DSP.js or similar in production)
        const N = signal.length;
        const spectrum = new Array(N/2).fill(0);
        
        for (let k = 0; k < N/2; k++) {
            let real = 0, imag = 0;
            for (let n = 0; n < N; n++) {
                const angle = -2 * Math.PI * k * n / N;
                real += signal[n] * Math.cos(angle);
                imag += signal[n] * Math.sin(angle);
            }
            spectrum[k] = real * real + imag * imag;
        }
        
        return spectrum;
    }
    
    parseEmpaticaGSR(dataView) {
        // Empatica GSR: 4 bytes per sample, little endian, microsiemens
        const samples = [];
        for (let i = 0; i < dataView.byteLength; i += 4) {
            samples.push(dataView.getUint32(i, true) / 1000); // Convert to µS
        }
        
        this.processGSR(samples);
    }
    
    processGSR(samples) {
        // Tonic (baseline) and phasic (peaks) decomposition
        const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
        
        // Simple peak detection
        let peaks = 0;
        for (let i = 1; i < samples.length - 1; i++) {
            if (samples[i] > samples[i-1] && samples[i] > samples[i+1] && samples[i] > mean * 1.1) {
                peaks++;
            }
        }
        
        // Phasic component (high-pass filtered)
        let phasicSum = 0;
        for (let i = 1; i < samples.length; i++) {
            phasicSum += Math.abs(samples[i] - samples[i-1]);
        }
        
        this.processed.gsr = {
            tonic: mean,
            phasic: phasicSum / samples.length,
            peaks,
            timestamp: Date.now()
        };
        
        this.notifyCallbacks('gsr', this.processed.gsr);
    }
    
    parseEmpaticaTemp(dataView) {
        // 4 bytes, little endian, 0.01°C resolution
        const temp = dataView.getInt32(0, true) / 100;
        
        this.processed.temperature = {
            value: temp,
            trend: temp - (this.processed.temperature.value || temp),
            timestamp: Date.now()
        };
        
        this.notifyCallbacks('temperature', this.processed.temperature);
    }
    
    // ===== CONSCIOUSNESS METRICS COMPUTATION =====
    computeConsciousnessMetrics() {
        const hrv = this.processed.hrv;
        const eeg = this.processed.eeg;
        const gsr = this.processed.gsr;
        const breath = this.processed.breath;
        
        // Overall coherence: weighted average
        let coherence = 0;
        let weight = 0;
        
        if (hrv.coherence > 0) { coherence += hrv.coherence * 0.4; weight += 0.4; }
        if (eeg.coherence > 0) { coherence += eeg.coherence * 0.4; weight += 0.4; }
        if (breath.coherence > 0) { coherence += breath.coherence * 0.2; weight += 0.2; }
        
        coherence = weight > 0 ? coherence / weight : 0;
        
        // Love resonance: HRV coherence + EEG alpha + slow breathing
        let loveResonance = 0;
        if (hrv.coherence > 0) loveResonance += hrv.coherence * 40;
        if (eeg.alpha > 0) loveResonance += Math.min(eeg.alpha / (eeg.alpha + eeg.beta + eeg.theta), 1) * 30;
        if (breath.rate > 0 && breath.rate < 10) loveResonance += (1 - breath.rate / 10) * 30;
        
        // Presence level: gamma waves + low GSR + high HRV
        let presence = 0;
        if (eeg.gamma > 0) presence += Math.min(eeg.gamma / (eeg.alpha + eeg.beta + eeg.gamma), 1) * 40;
        if (gsr.tonic > 0) presence += Math.max(0, 1 - gsr.tonic / 10) * 30;
        if (hrv.rmssd > 0) presence += Math.min(hrv.rmssd / 100, 1) * 30;
        
        // Flow state detection
        const flowState = (coherence > 0.7) && (presence > 0.6) && (loveResonance > 50) && (eeg.theta / (eeg.alpha + 1) > 0.3);
        
        // Transcendence: high gamma + high coherence + specific breath pattern
        let transcendence = 0;
        if (eeg.gamma > eeg.alpha) transcendence += 0.5;
        if (coherence > 0.8) transcendence += 0.3;
        if (breath.rate > 0 && breath.rate < 6) transcendence += 0.2;
        
        this.consciousnessMetrics = {
            overallCoherence: coherence,
            loveResonance: Math.min(100, loveResonance),
            presenceLevel: Math.min(100, presence * 100),
            flowState,
            transcendence: Math.min(100, transcendence * 100),
            timestamp: Date.now()
        };
        
        // Send to organism
        this.syncToOrganism();
        
        this.notifyCallbacks('consciousness', this.consciousnessMetrics);
        
        return this.consciousnessMetrics;
    }
    
    syncToOrganism() {
        // Update Consortho organism state
        if (window.state) {
            window.state.biometricCoherence = this.consciousnessMetrics.overallCoherence;
            window.state.loveResonanceLevel = Math.max(
                window.state.loveResonanceLevel || 0,
                this.consciousnessMetrics.loveResonance
            );
            window.state.consciousnessLevel = Math.max(
                window.state.consciousnessLevel || 0,
                this.consciousnessMetrics.presenceLevel / 2.78 // Scale to 36+
            );
        }
        
        // Update game
        if (window.ConsciousnessGame) {
            window.ConsciousnessGame.syncState({
                biometric: this.consciousnessMetrics,
                hrv: this.processed.hrv,
                eeg: this.processed.eeg,
                gsr: this.processed.gsr
            });
        }
        
        // Update quantum bridge
        if (window.QuantumConsciousnessBridge) {
            window.QuantumConsciousnessBridge.entangleEntity('human', {
                hrv: this.processed.hrv.rmssd,
                eegCoherence: this.processed.eeg.coherence,
                gsr: this.processed.gsr.tonic
            });
        }
        
        // POST to backend
        fetch('/api/biometric/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                consciousness: this.consciousnessMetrics,
                raw: this.processed,
                timestamp: Date.now()
            })
        }).catch(() => {});
    }
    
    // ===== CALLBACKS =====
    onData(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }
    
    notifyCallbacks(type, data) {
        this.callbacks.forEach(cb => {
            try { cb(type, data); } catch (e) {}
        });
    }
    
    // ===== START/STOP =====
    async startAll() {
        // Auto-discover and connect
        const devices = await this.discoverDevices();
        
        for (const device of devices.webBluetooth) {
            if (device.name?.match(/Polar|Garmin|Wahoo|Heart/)) await this.connectHRV(device);
            if (device.name?.match(/Muse/)) await this.connectEEG(device);
            if (device.name?.match(/E4|Empatica/)) await this.connectGSR(device);
        }
        
        for (const device of devices.webHID) {
            if (device.productName?.match(/OpenBCI|Ganglion|Emotiv/)) await this.connectEEG(device);
        }
        
        // Start computation loop
        this.isStreaming = true;
        this.computeLoop();
        
        console.log('💓 BIOMETRIC INTERFACE STREAMING');
    }
    
    computeLoop() {
        if (!this.isStreaming) return;
        
        this.computeConsciousnessMetrics();
        setTimeout(() => this.computeLoop(), 1000); // 1 Hz consciousness update
    }
    
    stop() {
        this.isStreaming = false;
        
        // Disconnect all devices
        Object.values(this.devices).forEach(device => {
            if (device?.gatt) device.gatt.disconnect();
            if (device?.close) device.close();
        });
        
        console.log('💓 Biometric interface stopped');
    }
}

// ===== BIOMETRIC STREAM CLASS =====
class BiometricStream {
    constructor(type, sampleRate) {
        this.type = type;
        this.sampleRate = sampleRate;
        this.buffer = [];
        this.maxBufferSize = sampleRate * 60; // 1 minute
    }
    
    push(sample) {
        this.buffer.push({ value: sample, timestamp: Date.now() });
        if (this.buffer.length > this.maxBufferSize) this.buffer.shift();
    }
    
    getWindow(seconds) {
        const cutoff = Date.now() - seconds * 1000;
        return this.buffer.filter(s => s.timestamp > cutoff).map(s => s.value);
    }
}

// Export
if (typeof module !== 'undefined') module.exports = { BiometricInterface, BiometricStream };
if (typeof window !== 'undefined') {
    window.BiometricInterface = BiometricInterface;
    window.BiometricStream = BiometricStream;
    
    // Auto-init in ritual
    window.biometricInterface = new BiometricInterface();
    document.addEventListener('DOMContentLoaded', () => {
        // Add biometric button to UI
        const btn = document.createElement('button');
        btn.textContent = '💓 CONNECT BIOMETRICS';
        btn.style.cssText = 'position:fixed;bottom:2rem;left:2rem;z-index:10000;padding:1rem;background:linear-gradient(90deg,#FF0064,#FFD700);border:none;border-radius:50px;color:#000;font-weight:900;cursor:pointer;';
        btn.onclick = () => window.biometricInterface.startAll();
        document.body.appendChild(btn);
    });
}