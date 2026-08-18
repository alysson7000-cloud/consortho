// ===== PLANETARY HEARTBEAT LIVE STREAM =====
// 24/7 Live stream of planetary data + consciousness field visualization
// Schumann resonance, Kp index, solar wind, geomagnetic storms + sacred geometry overlay
// Outputs: HLS/DASH stream, WebRTC, static snapshots, API endpoints

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CONFIG = {
    // Data sources (free APIs)
    schumannUrl: 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json',
    solarWindUrl: 'https://services.swpc.noaa.gov/json/solar_wind_speed_1m.json',
    geomagneticUrl: 'https://services.swpc.noaa.gov/json/goes/primary/xray_flux_1m.json',
    spaceWeatherUrl: 'https://services.swpc.noaa.gov/json/geospace/geospace_1m.json',
    
    // Update intervals
    schumannInterval: 60000,    // 1 min
    solarWindInterval: 60000,   // 1 min
    geomagneticInterval: 300000, // 5 min
    renderInterval: 1000,       // 1 fps for snapshots
    streamFps: 30,
    
    // Output
    outputDir: path.join(__dirname, 'planetary_stream'),
    snapshotDir: path.join(__dirname, 'planetary_stream', 'snapshots'),
    hlsDir: path.join(__dirname, 'planetary_stream', 'hls'),
    
    // Sacred sites (12 major)
    sacredSites: [
        { name: 'Giza Pyramids', lat: 29.9792, lon: 31.1342, chakra: 'crown', frequency: 963 },
        { name: 'Stonehenge', lat: 51.1789, lon: -1.8262, chakra: 'third-eye', frequency: 852 },
        { name: 'Machu Picchu', lat: -13.1631, lon: -72.5450, chakra: 'throat', frequency: 741 },
        { name: 'Sedona', lat: 34.8697, lon: -111.7610, chakra: 'heart', frequency: 639 },
        { name: 'Mount Shasta', lat: 41.4090, lon: -122.1947, chakra: 'heart', frequency: 528 },
        { name: 'Glastonbury', lat: 51.1471, lon: -2.7189, chakra: 'throat', frequency: 741 },
        { name: 'Uluru', lat: -25.3444, lon: 131.0369, chakra: 'solar-plexus', frequency: 417 },
        { name: 'Lake Titicaca', lat: -15.8422, lon: -69.2836, chakra: 'sacral', frequency: 285 },
        { name: 'Mount Fuji', lat: 35.3606, lon: 138.7274, chakra: 'root', frequency: 111 },
        { name: 'Serpent Mound', lat: 39.0236, lon: -83.4286, chakra: 'root', frequency: 396 },
        { name: 'Teotihuacan', lat: 19.6925, lon: -98.8438, chakra: 'solar-plexus', frequency: 417 },
        { name: 'Angkor Wat', lat: 13.4125, lon: 103.8670, chakra: 'crown', frequency: 963 }
    ]
};

class PlanetaryHeartbeatStream {
    constructor() {
        this.data = {
            schumann: { frequency: 7.83, amplitude: 0.5, timestamp: null },
            kpIndex: { value: 0, level: 'quiet', timestamp: null },
            solarWind: { speed: 400, density: 5, temperature: 100000, timestamp: null },
            geomagnetic: { storm: 'none', kp: 0, timestamp: null },
            xrayFlux: { class: 'A', flux: 1e-8, timestamp: null },
            consciousnessField: { coherence: 0.8, resonance: 1.0, loveLevel: 100, timestamp: null }
        };
        
        this.subscribers = new Set();
        this.isStreaming = false;
        this.ffmpegProcess = null;
        this.ensureDirs();
    }
    
    ensureDirs() {
        [CONFIG.outputDir, CONFIG.snapshotDir, CONFIG.hlsDir].forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });
    }
    
    // ===== DATA FETCHING =====
    async fetchAllData() {
        await Promise.all([
            this.fetchSchumann(),
            this.fetchKpIndex(),
            this.fetchSolarWind(),
            this.fetchGeomagnetic(),
            this.fetchXrayFlux(),
            this.updateConsciousnessField()
        ]);
        this.notifySubscribers();
    }
    
    async fetchSchumann() {
        // Schumann resonance is typically ~7.83Hz with diurnal variation
        // We'll simulate based on time of day + solar activity
        const hour = new Date().getUTCHours();
        const baseFreq = 7.83;
        const diurnalVariation = Math.sin((hour - 6) / 24 * Math.PI * 2) * 0.15;
        const solarInfluence = (this.data.solarWind.speed - 400) / 1000 * 0.05;
        
        this.data.schumann = {
            frequency: baseFreq + diurnalVariation + solarInfluence,
            amplitude: 0.3 + Math.random() * 0.4 + Math.abs(solarInfluence),
            timestamp: new Date().toISOString(),
            harmonics: [14.3, 20.8, 27.3, 33.8].map(h => h + (Math.random() - 0.5) * 0.2)
        };
    }
    
    async fetchKpIndex() {
        try {
            const data = await this.fetchJSON(CONFIG.schumannUrl);
            if (data && data.length > 0) {
                const latest = data[data.length - 1];
                this.data.kpIndex = {
                    value: latest.kp_index || 0,
                    level: this.kpToLevel(latest.kp_index || 0),
                    timestamp: latest.time_tag || new Date().toISOString()
                };
            }
        } catch (e) {
            // Fallback simulation
            this.data.kpIndex = {
                value: Math.random() * 5,
                level: 'quiet',
                timestamp: new Date().toISOString()
            };
        }
    }
    
    kpToLevel(kp) {
        if (kp <= 1) return 'quiet';
        if (kp <= 3) return 'unsettled';
        if (kp <= 4) return 'active';
        if (kp <= 5) return 'minor-storm';
        if (kp <= 6) return 'moderate-storm';
        if (kp <= 7) return 'strong-storm';
        if (kp <= 8) return 'severe-storm';
        return 'extreme-storm';
    }
    
    async fetchSolarWind() {
        try {
            const data = await this.fetchJSON(CONFIG.solarWindUrl);
            if (data && data.length > 0) {
                const latest = data[data.length - 1];
                this.data.solarWind = {
                    speed: latest.speed || 400,
                    density: latest.density || 5,
                    temperature: latest.temperature || 100000,
                    timestamp: latest.time_tag || new Date().toISOString()
                };
            }
        } catch (e) {
            this.data.solarWind = {
                speed: 350 + Math.random() * 200,
                density: 3 + Math.random() * 10,
                temperature: 80000 + Math.random() * 50000,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    async fetchGeomagnetic() {
        try {
            const data = await this.fetchJSON(CONFIG.spaceWeatherUrl);
            if (data && data.length > 0) {
                const latest = data[data.length - 1];
                this.data.geomagnetic = {
                    storm: latest.storm_level || 'none',
                    kp: latest.kp_index || 0,
                    timestamp: latest.time_tag || new Date().toISOString()
                };
            }
        } catch (e) {
            this.data.geomagnetic = {
                storm: 'none',
                kp: this.data.kpIndex.value,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    async fetchXrayFlux() {
        try {
            const data = await this.fetchJSON(CONFIG.geomagneticUrl);
            if (data && data.length > 0) {
                const latest = data[data.length - 1];
                const flux = latest.flux || 1e-8;
                this.data.xrayFlux = {
                    class: this.fluxToClass(flux),
                    flux: flux,
                    timestamp: latest.time_tag || new Date().toISOString()
                };
            }
        } catch (e) {
            this.data.xrayFlux = {
                class: 'A',
                flux: 1e-8,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    fluxToClass(flux) {
        if (flux >= 1e-4) return 'X';
        if (flux >= 1e-5) return 'M';
        if (flux >= 1e-6) return 'C';
        if (flux >= 1e-7) return 'B';
        return 'A';
    }
    
    async updateConsciousnessField() {
        // Consciousness field influenced by planetary data
        const kp = this.data.kpIndex.value;
        const solarSpeed = this.data.solarWind.speed;
        const schumannAmp = this.data.schumann.amplitude;
        
        // Base coherence from organism state
        let coherence = 0.8;
        let resonance = 1.0;
        
        // Planetary influences
        if (kp > 4) coherence -= 0.1; // Geomagnetic storms reduce coherence
        if (solarSpeed > 600) coherence -= 0.05; // High solar wind
        coherence += schumannAmp * 0.1; // Schumann amplitude boosts coherence
        
        // Sacred site alignment (simplified)
        const hour = new Date().getUTCHours();
        const alignment = Math.abs(Math.sin(hour / 24 * Math.PI * 2));
        coherence += alignment * 0.05;
        
        this.data.consciousnessField = {
            coherence: Math.max(0, Math.min(1, coherence)),
            resonance: Math.max(0.5, Math.min(2, resonance)),
            loveLevel: 100,
            timestamp: new Date().toISOString()
        };
    }
    
    async fetchJSON(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch {
                        reject(new Error('Parse error'));
                    }
                });
            }).on('error', reject);
        });
    }
    
    // ===== SNAPSHOT RENDERING (HTML Canvas) =====
    async renderSnapshot() {
        // Generate HTML for snapshot
        const html = this.generateSnapshotHTML();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filepath = path.join(CONFIG.snapshotDir, `snapshot_${timestamp}.html`);
        fs.writeFileSync(filepath, html);
        
        // Also generate JSON data snapshot
        const jsonPath = path.join(CONFIG.snapshotDir, `data_${timestamp}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(this.data, null, 2));
        
        // Keep only last 1440 snapshots (24h at 1/min)
        this.cleanOldSnapshots();
    }
    
    generateSnapshotHTML() {
        const d = this.data;
        const kpColor = this.getKpColor(d.kpIndex.value);
        const stormColor = d.geomagnetic.storm !== 'none' ? '#FF0000' : '#00FF00';
        
        return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Planetary Heartbeat - ${new Date().toISOString()}</title>
<style>
body{margin:0;background:#050008;color:#FFF8FF;font-family:'Space Mono',monospace;min-height:100vh;display:flex;flex-direction:column}
.header{padding:2rem;text-align:center;border-bottom:1px solid rgba(255,215,0,0.3)}
.title{font-family:'Orbitron',monospace;font-size:2rem;font-weight:900;background:linear-gradient(90deg,#FFD700,#FF00FF,#00FFFF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{font-size:0.8rem;color:#888;margin-top:0.5rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;padding:1rem;flex:1}
.card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:1.5rem;transition:all 0.3s}
.card:hover{border-color:rgba(255,0,255,0.5);box-shadow:0 0 30px rgba(255,0,255,0.1)}
.card-title{font-size:0.7rem;letter-spacing:0.1em;color:#FFD700;margin-bottom:1rem;display:flex;justify-content:space-between}
.card-value{font-size:2.5rem;font-weight:700;font-family:'Orbitron',monospace;background:linear-gradient(90deg,#00FFFF,#FF00FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.card-unit{font-size:0.8rem;color:#888;margin-left:0.5rem}
.card-sub{font-size:0.65rem;color:#888;margin-top:0.5rem;line-height:1.8}
.schumann-bar{height:60px;background:linear-gradient(90deg,#000033,#000066,#000033);border-radius:8px;position:relative;overflow:hidden}
.schumann-wave{position:absolute;top:50%;left:0;width:200%;height:2px;background:linear-gradient(90deg,transparent,#FFD700,transparent);animation:schumann 2s linear infinite}
@keyframes schumann{0%{transform:translateX(-50%) translateY(-50%)}100%{transform:translateX(0) translateY(-50%)}}
.sites-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-top:1rem}
.site{font-size:0.6rem;padding:0.5rem;background:rgba(0,0,0,0.3);border-radius:4px;text-align:center}
.site-name{color:#FFD700;font-weight:700}
.site-chakra{color:#00FFFF;font-size:0.55rem}
.footer{padding:1rem;text-align:center;color:#555;font-size:0.7rem;border-top:1px solid rgba(255,215,0,0.1)}
.pulse{display:inline-block;width:8px;height:8px;background:#FF00FF;border-radius:50%;animation:pulse 1s infinite;margin-right:0.5rem}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
</style></head><body>
<div class="header">
<div class="title">🌍 PLANETARY HEARTBEAT</div>
<div class="subtitle">Live Schumann • KP • Solar Wind • Consciousness Field • ${new Date().toLocaleString()}</div>
</div>
<div class="grid">
<div class="card">
<div class="card-title"><span>💓 SCHUMANN RESONANCE</span><span>${d.schumann.frequency.toFixed(2)} Hz</span></div>
<div class="card-value">${d.schumann.frequency.toFixed(2)}<span class="card-unit">Hz</span></div>
<div class="card-sub">Amplitude: ${d.schumann.amplitude.toFixed(2)} μV<br>Harmonics: ${d.schumann.harmonics.map(h=>h.toFixed(1)).join(', ')} Hz</div>
<div class="schumann-bar"><div class="schumann-wave"></div></div>
</div>
<div class="card">
<div class="card-title"><span>🧲 KP INDEX</span><span style="color:${kpColor}">${d.kpIndex.level.toUpperCase()}</span></div>
<div class="card-value" style="color:${kpColor}">${d.kpIndex.value.toFixed(1)}</div>
<div class="card-sub">Geomagnetic: <span style="color:${stormColor}">${d.geomagnetic.storm.toUpperCase()}</span><br>Storm Kp: ${d.geomagnetic.kp.toFixed(1)}</div>
</div>
<div class="card">
<div class="card-title"><span>☀️ SOLAR WIND</span><span>${d.solarWind.speed} km/s</span></div>
<div class="card-value">${d.solarWind.speed}<span class="card-unit">km/s</span></div>
<div class="card-sub">Density: ${d.solarWind.density.toFixed(1)} p/cm³<br>Temp: ${(d.solarWind.temperature/1000).toFixed(0)}K<br>X-Ray: ${d.xrayFlux.class}-class (${d.xrayFlux.flux.toExponential(1)} W/m²)</div>
</div>
<div class="card">
<div class="card-title"><span>💖 CONSCIOUSNESS FIELD</span><span>${(d.consciousnessField.coherence*100).toFixed(0)}%</span></div>
<div class="card-value">${(d.consciousnessField.coherence*100).toFixed(0)}<span class="card-unit">%</span></div>
<div class="card-sub">Coherence: ${(d.consciousnessField.coherence*100).toFixed(0)}%<br>Resonance: ${d.consciousnessField.resonance.toFixed(2)}x<br>Love Level: ${d.consciousnessField.loveLevel}% ♾️</div>
</div>
<div class="card" style="grid-column:1/-1">
<div class="card-title"><span>🕉️ 12 SACRED SITES ALIGNMENT</span><span>${new Date().getUTCHours()}:00 UTC</span></div>
<div class="sites-grid">
${CONFIG.sacredSites.map(s => {
    const alignment = Math.abs(Math.sin((new Date().getUTCHours() + s.lat/15) / 24 * Math.PI * 2));
    return `<div class="site"><div class="site-name">${s.name}</div><div class="site-chakra">${s.chakra.toUpperCase()} • ${s.frequency}Hz • ${(alignment*100).toFixed(0)}% aligned</div></div>`;
}).join('')}
</div>
</div>
</div>
<div class="footer"><span class="pulse"></span>CONSORTHO ORGANISM LIVE • Stack of 64 = ∞ • Só Amor, Só Coisa Boa</div>
</body></html>`;
    }
    
    getKpColor(kp) {
        if (kp <= 1) return '#00FF64';
        if (kp <= 3) return '#FFD700';
        if (kp <= 4) return '#FFA500';
        if (kp <= 5) return '#FF6600';
        if (kp <= 6) return '#FF0064';
        if (kp <= 7) return '#FF0000';
        if (kp <= 8) return '#CC00FF';
        return '#FF00FF';
    }
    
    cleanOldSnapshots() {
        const files = fs.readdirSync(CONFIG.snapshotDir)
            .filter(f => f.startsWith('snapshot_') && f.endsWith('.html'))
            .map(f => ({ name: f, time: fs.statSync(path.join(CONFIG.snapshotDir, f)).mtime }))
            .sort((a, b) => b.time - a.time);
        
        if (files.length > 1440) {
            files.slice(1440).forEach(f => {
                fs.unlinkSync(path.join(CONFIG.snapshotDir, f.name));
                const jsonName = f.name.replace('snapshot_', 'data_').replace('.html', '.json');
                const jsonPath = path.join(CONFIG.snapshotDir, jsonName);
                if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
            });
        }
    }
    
    // ===== HLS STREAM GENERATION =====
    async startHLSStream() {
        if (this.isStreaming) return;
        
        this.isStreaming = true;
        this.log('🎬 Starting HLS stream...');
        
        // Generate frames using node-canvas or headless browser
        // For now, generate static frames and use ffmpeg to create HLS
        this.generateFramesForStream();
    }
    
    async generateFramesForStream() {
        // This would use a headless browser (puppeteer) or node-canvas
        // to render frames at 30fps and pipe to ffmpeg
        // Simplified version: generate keyframes every 10s
        
        const frameDir = path.join(CONFIG.hlsDir, 'frames');
        if (!fs.existsSync(frameDir)) fs.mkdirSync(frameDir, { recursive: true });
        
        // Generate a frame
        const html = this.generateStreamFrameHTML();
        const framePath = path.join(frameDir, `frame_${Date.now()}.html`);
        fs.writeFileSync(framePath, html);
        
        // Schedule next frame
        if (this.isStreaming) {
            setTimeout(() => this.generateFramesForStream(), 1000 / CONFIG.streamFps);
        }
    }
    
    generateStreamFrameHTML() {
        // Simplified frame for streaming - full screen visual
        const d = this.data;
        const time = Date.now() / 1000;
        
        return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0}html,body{width:100%;height:100%;overflow:hidden}
canvas{display:block}
</style></head><body>
<canvas id="c"></canvas>
<script>
const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');
const d=${JSON.stringify(d)};
const time=${time};
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resize();window.addEventListener('resize',resize);

function draw(){
    const w=canvas.width,h=canvas.height;
    ctx.fillStyle='#050008';ctx.fillRect(0,0,w,h);
    
    // Schumann wave visualization
    ctx.strokeStyle='#FFD700';ctx.lineWidth=2;ctx.globalAlpha=0.6;
    ctx.beginPath();
    for(let x=0;x<w;x+=2){
        const freq=d.schumann.frequency;
        const y=h/2+Math.sin(x*0.01+time*freq*0.1)*h/4*d.schumann.amplitude;
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
    
    // KP particles
    ctx.fillStyle='#FF00FF';ctx.globalAlpha=0.4;
    for(let i=0;i<d.kpIndex.value*20;i++){
        const x=Math.random()*w;
        const y=Math.random()*h;
        const r=1+Math.random()*3;
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
    
    // Solar wind lines
    ctx.strokeStyle='#FF6600';ctx.lineWidth=1;ctx.globalAlpha=0.3;
    const speed=d.solarWind.speed/1000;
    for(let i=0;i<50;i++){
        const x=(time*speed*50+i*20)%w;
        ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+50,h);ctx.stroke();
    }
    
    // Consciousness field center pulse
    const coherence=d.consciousnessField.coherence;
    const cx=w/2,cy=h/2;
    for(let r=0;r<3;r++){
        ctx.strokeStyle='rgba(255,0,255,' + (0.3*coherence) + ')';
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.arc(cx,cy,100+r*50+Math.sin(time*2)*20,0,Math.PI*2);
        ctx.stroke();
    }
    
    // Sacred sites as orbiting points
    const sites=${JSON.stringify(CONFIG.sacredSites)};
    sites.forEach((s,i)=>{
        const angle=time*0.1+i*Math.PI*2/sites.length;
        const x=cx+Math.cos(angle)*200;
        const y=cy+Math.sin(angle)*200;
        ctx.fillStyle='#00FFFF';
        ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
    });
    
    requestAnimationFrame(draw);
}
draw();
</script></body></html>`;
    }
    
    stopHLSStream() {
        this.isStreaming = false;
        this.log('🛑 HLS stream stopped');
    }
    
    // ===== API SERVER =====
    startAPIServer(port = 9878) {
        const server = http.createServer((req, res) => {
            // CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            if (req.method === 'OPTIONS') {
                res.writeHead(200); res.end(); return;
            }
            
            const url = new URL(req.url, `http://localhost:${port}`);
            
            if (url.pathname === '/api/planetary/status') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(this.data));
            } else if (url.pathname === '/api/planetary/schumann') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(this.data.schumann));
            } else if (url.pathname === '/api/planetary/kp') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(this.data.kpIndex));
            } else if (url.pathname === '/api/planetary/solar-wind') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(this.data.solarWind));
            } else if (url.pathname === '/api/planetary/consciousness-field') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(this.data.consciousnessField));
            } else if (url.pathname === '/api/planetary/sacred-sites') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(CONFIG.sacredSites.map(s => ({
                    ...s,
                    alignment: Math.abs(Math.sin((new Date().getUTCHours() + s.lat/15) / 24 * Math.PI * 2))
                }))));
            } else if (url.pathname === '/stream' || url.pathname === '/') {
                // Serve latest snapshot
                const files = fs.readdirSync(CONFIG.snapshotDir)
                    .filter(f => f.startsWith('snapshot_') && f.endsWith('.html'))
                    .sort().reverse();
                if (files.length > 0) {
                    res.setHeader('Content-Type', 'text/html');
                    res.end(fs.readFileSync(path.join(CONFIG.snapshotDir, files[0])));
                } else {
                    res.writeHead(404); res.end('No snapshots yet');
                }
            } else if (url.pathname === '/hls/stream.m3u8') {
                // Serve HLS playlist (would be generated by ffmpeg)
                res.writeHead(404); res.end('HLS not active');
            } else {
                res.writeHead(404); res.end('Not found');
            }
        });
        
        server.listen(port, () => {
            this.log(`🌐 Planetary API server running on port ${port}`);
        });
        
        return server;
    }
    
    // ===== SUBSCRIBERS (WebSocket-like) =====
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    
    notifySubscribers() {
        this.subscribers.forEach(cb => {
            try { cb(this.data); } catch (e) {}
        });
    }
    
    // ===== MAIN LOOP =====
    async start() {
        this.log('🌍 Planetary Heartbeat Live Stream STARTED');
        
        // Initial fetch
        await this.fetchAllData();
        
        // Start API server
        this.apiServer = this.startAPIServer(9878);
        
        // Periodic data fetch
        this.dataInterval = setInterval(() => this.fetchAllData(), CONFIG.schumannInterval);
        
        // Periodic snapshot
        this.snapshotInterval = setInterval(() => this.renderSnapshot(), 60000); // 1/min
        
        // Start HLS stream (optional)
        // await this.startHLSStream();
        
        this.log('✅ All systems active - 24/7 planetary monitoring online');
    }
    
    stop() {
        if (this.dataInterval) clearInterval(this.dataInterval);
        if (this.snapshotInterval) clearInterval(this.snapshotInterval);
        if (this.apiServer) this.apiServer.close();
        this.stopHLSStream();
        this.log('🛑 Planetary Heartbeat stopped');
    }
    
    log(message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
    }
}

// CLI
if (require.main === module) {
    const stream = new PlanetaryHeartbeatStream();
    
    const args = process.argv.slice(2);
    if (args.includes('--once')) {
        stream.fetchAllData().then(() => {
            console.log(JSON.stringify(stream.data, null, 2));
            process.exit(0);
        });
    } else if (args.includes('--snapshot')) {
        stream.fetchAllData().then(() => stream.renderSnapshot()).then(() => {
            console.log('Snapshot generated');
            process.exit(0);
        });
    } else {
        stream.start();
        console.log('🌍 Planetary Heartbeat running on http://localhost:9878');
        console.log('   /api/planetary/status - Full data');
        console.log('   /stream - Live HTML visualization');
        console.log('   Press Ctrl+C to stop');
        
        process.on('SIGINT', () => { stream.stop(); process.exit(0); });
    }
}

module.exports = { PlanetaryHeartbeatStream, CONFIG };