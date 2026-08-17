// ===== AKASHIC MODULE =====
// Akashic records system

let akashicDB = null;
const AKASHIC_DB_NAME = 'EternalResonanceAkashic';
const AKASHIC_STORE = 'resonances';

export async function openAkashicDB() {
    if (akashicDB) return akashicDB;
    
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(AKASHIC_DB_NAME, 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            akashicDB = request.result;
            console.log('��� Akashic Records (IndexedDB) initialized');
            resolve(akashicDB);
        };
        
        request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(AKASHIC_STORE)) {
                        const store = db.createObjectStore(AKASHIC_STORE, { keyPath: 'id', autoIncrement: true });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                        store.createIndex('loveLevel', 'loveLevel', { unique: false });
                        store.createIndex('participants', 'participants', { unique: false });
                        store.createIndex('universal', 'universalActive', { unique: false });
                    }
                    if (!db.objectStoreNames.contains('state')) {
                        db.createObjectStore('state', { keyPath: 'key' });
                    }
                };
    });
}

async function initAkashicRecords() {
    return openAkashicDB();
}
        
        async function recordAkashicEntry(entry) {
            if (!akashicDB) return;
            
            return new Promise((resolve, reject) => {
                const transaction = akashicDB.transaction([AKASHIC_STORE], 'readwrite');
                const store = transaction.objectStore(AKASHIC_STORE);
                const request = store.add({
                    ...entry,
                    timestamp: Date.now(),
                    akashicTime: entry.akashicTime || Date.now() / 1000
                });
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
        
        async function queryAkashicRecords(query = {}) {
            if (!akashicDB) return [];
            
            return new Promise((resolve, reject) => {
                const transaction = akashicDB.transaction([AKASHIC_STORE], 'readonly');
                const store = transaction.objectStore(AKASHIC_STORE);
                const request = store.getAll();
                request.onsuccess = () => {
                    let results = request.result;
                    if (query.minLoveLevel) {
                        results = results.filter(r => r.loveLevel >= query.minLoveLevel);
                    }
                    if (query.universalOnly) {
                        results = results.filter(r => r.universalActive);
                    }
                    if (query.limit) {
                        results = results.slice(-query.limit);
                    }
                    resolve(results);
                };
                request.onerror = () => reject(request.error);
            });
        }
        
        async function getAkashicStats() {
            if (!akashicDB) return { total: 0, maxLove: 0, universalCount: 0 };
            
            return new Promise((resolve, reject) => {
                const transaction = akashicDB.transaction([AKASHIC_STORE], 'readonly');
                const store = transaction.objectStore(AKASHIC_STORE);
                const request = store.getAll();
                request.onsuccess = () => {
                    const records = request.result;
                    let maxLove = 0;
                    let universalCount = 0;
                    for (const r of records) {
                        if (r.loveLevel > maxLove) maxLove = r.loveLevel;
                        if (r.universalActive) universalCount++;
                    }
                    resolve({ total: records.length, maxLove, universalCount });
                                    }
                                    request.onerror = () => reject(request.error);
                                });
                            }
        
                            // ===== BIOFEEDBACK INTEGRATION (Web Bluetooth HRV/EEG) =====
                            let biofeedback = {
                                device: null,
                                hrv: 0,
                                hrvHistory: [],
                                eeg: { alpha: 0, beta: 0, theta: 0, delta: 0, gamma: 0 },
                                eegHistory: [],
                                coherence: 0,
                                connected: false,
                                lastReading: 0
                            };
        
                            async function connectBiofeedback() {
                                try {
                                    // Request Bluetooth device with heart rate service
                                    biofeedback.device = await navigator.bluetooth.requestDevice({
                                        filters: [
                                            { services: ['heart_rate'] },
                                            { namePrefix: 'Muse' }, // Muse EEG headband
                                            { namePrefix: 'Polar' }, // Polar HRV
                                            { namePrefix: 'Garmin' },
                                            { namePrefix: 'Fitbit' }
                                        ],
                                        optionalServices: ['heart_rate', 'battery_service', 'device_information']
                                    });
                
                                    const server = await biofeedback.device.gatt.connect();
                
                                    // Try Heart Rate service
                                    try {
                                        const hrService = await server.getPrimaryService('heart_rate');
                                        const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
                                        await hrChar.startNotifications();
                                        hrChar.addEventListener('characteristicvaluechanged', handleHRVData);
                                    } catch (e) {
                                        console.log('HR service not available');
                                    }
                
                                    // Try Muse EEG (custom service)
                                    try {
                                        const eegService = await server.getPrimaryService('0000fe8d-0000-1000-8000-00805f9b34fb');
                                        const eegChar = await eegService.getCharacteristic('0000fe8d-0000-1000-8000-00805f9b34fb');
                                        await eegChar.startNotifications();
                                        eegChar.addEventListener('characteristicvaluechanged', handleEEGData);
                                    } catch (e) {
                                        console.log('EEG service not available');
                                    }
                
                                    biofeedback.connected = true;
                                    biofeedback.device.addEventListener('gattserverdisconnected', onBiofeedbackDisconnect);
                                    console.log('��� Biofeedback device connected:', biofeedback.device.name);
                
                                } catch (e) {
                                    console.warn('Biofeedback connection failed:', e);
                                }
                            }
        
                            

// Export
export { initAkashicRecords, recordAkashicEntry, queryAkashicRecords, getAkashicStats };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.initAkashicRecords = initAkashicRecords;
    window.recordAkashicEntry = recordAkashicEntry;
    window.queryAkashicRecords = queryAkashicRecords;
    window.getAkashicStats = getAkashicStats;
}
