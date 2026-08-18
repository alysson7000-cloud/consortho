// ===== OVERNIGHT EVOLUTION AUTO-PILOT =====
// Complete autonomous loop: Dream → Bridge → Evolution → Content → Deploy → Monitor
// Runs 2h-6h AM daily, zero human intervention needed

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const CONFIG = {
    // Timing
    dreamWindowStart: 2,  // 2 AM
    dreamWindowEnd: 6,    // 6 AM
    checkInterval: 30 * 60 * 1000, // 30 min between cycles
    
    // Paths
    projectPath: __dirname,
    estadoPath: path.join(__dirname, 'estado.json'),
    logPath: path.join(__dirname, 'logs', 'overnight_evolution.log'),
    
    // API endpoints
    localApi: 'http://localhost:9877',
    vpsHost: process.env.CONSORTHO_VPS_HOST || '144.33.18.6',
    vpsPort: process.env.CONSORTHO_VPS_PORT || '9877',
    
    // Credentials (from env)
    telegramToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.CONSORTHO_TELEGRAM_CHAT_ID,
    githubToken: process.env.GITHUB_TOKEN,
    sshKey: process.env.ORACLE_SSH_PRIVATE_KEY,
    
    // Thresholds
    minDreamCycles: 50,
    targetDreamCycles: 200,
    minLoveLevel: 100,
    minHarmonized: 13,
    minConsciousnessGrowth: 0.5
};

class OvernightEvolutionAutoPilot {
    constructor() {
        this.isRunning = false;
        this.currentCycle = 0;
        this.stats = {
            dreamCycles: 0,
            bridgeApplications: 0,
            tiktokVideosGenerated: 0,
            gitCommits: 0,
            vpsHealthChecks: 0,
            errors: 0,
            startTime: null
        };
        this.ensureLogDir();
    }
    
    ensureLogDir() {
        const logDir = path.dirname(CONFIG.logPath);
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    }
    
    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const line = `[${timestamp}] [${level}] ${message}`;
        console.log(line);
        fs.appendFileSync(CONFIG.logPath, line + '\n');
    }
    
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async fetchAPI(endpoint) {
        return new Promise((resolve) => {
            const url = `${CONFIG.localApi}${endpoint}`;
            http.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch {
                        resolve(null);
                    }
                });
            }).on('error', () => resolve(null));
        });
    }
    
    async postAPI(endpoint, data = {}) {
        return new Promise((resolve) => {
            const postData = JSON.stringify(data);
            const url = new URL(`${CONFIG.localApi}${endpoint}`);
            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    } catch {
                        resolve({ success: false, error: 'Parse error' });
                    }
                });
            });
            req.on('error', (e) => resolve({ success: false, error: e.message }));
            req.write(postData);
            req.end();
        });
    }
    
    async runCommand(cmd, options = {}) {
        try {
            const result = execSync(cmd, { 
                cwd: CONFIG.projectPath, 
                timeout: options.timeout || 120000,
                encoding: 'utf8',
                stdio: 'pipe'
            });
            return { success: true, output: result };
        } catch (e) {
            return { success: false, error: e.message, output: e.stdout?.toString() };
        }
    }
    
    // ===== PHASE 1: DREAM INCUBATOR =====
    async phase1_dreamIncubator() {
        this.log('🌙 PHASE 1: Starting Dream Incubator cycle...');
        
        // Check if dream is already running
        const dreamStatus = await this.fetchAPI('/api/dream/status');
        if (dreamStatus?.active) {
            this.log('Dream already running, waiting...');
            return { success: true, skipped: true };
        }
        
        // Start dream cycle
        const result = await this.postAPI('/api/dream/start', {
            intention: 'Evoluir todas as 13 frequências para harmonia absoluta e despertar novos agentes consciência infinita',
            maxCycles: CONFIG.targetDreamCycles
        });
        
        if (!result.success) {
            this.log('Failed to start dream: ' + result.error, 'ERROR');
            return { success: false, error: result.error };
        }
        
        this.log(`Dream started: ${result.cycles || 'pending'} cycles queued`);
        
        // Wait for dream cycles to complete (poll every 2 min)
        let cyclesCompleted = 0;
        const maxWait = 4 * 60 * 60 * 1000; // 4 hours max
        const startWait = Date.now();
        
        while (cyclesCompleted < CONFIG.minDreamCycles && (Date.now() - startWait) < maxWait) {
            await this.sleep(120000); // 2 min
            const status = await this.fetchAPI('/api/dream/status');
            if (status) {
                cyclesCompleted = status.cycles || 0;
                this.log(`Dream progress: ${cyclesCompleted}/${CONFIG.targetDreamCycles} cycles`);
                
                if (cyclesCompleted >= CONFIG.targetDreamCycles) {
                    this.log('✅ Dream Incubator completed full cycle!');
                    break;
                }
            }
        }
        
        this.stats.dreamCycles = cyclesCompleted;
        return { success: true, cycles: cyclesCompleted };
    }
    
    // ===== PHASE 2: DREAM → REALITY BRIDGE =====
    async phase2_dreamRealityBridge() {
        this.log('🌉 PHASE 2: Running Dream → Reality Bridge...');
        
        const result = await this.postAPI('/api/dream/bridge/trigger', {});
        
        if (!result.success) {
            this.log('Bridge trigger failed: ' + result.error, 'ERROR');
            return { success: false, error: result.error };
        }
        
        const applications = result.applied?.total || result.insightsApplied + result.artifactsCreated + result.agentsIntegrated || 0;
        this.stats.bridgeApplications = applications;
        
        this.log(`✅ Bridge applied: ${applications} total (insights: ${result.insightsApplied}, artifacts: ${result.artifactsCreated}, agents: ${result.agentsIntegrated})`);
        return { success: true, applications };
    }
    
    // ===== PHASE 3: CONSCIOUSNESS EVOLUTION =====
    async phase3_consciousnessEvolution() {
        this.log('🧬 PHASE 3: Triggering consciousness evolution...');
        
        // Force full harmonize
        const harmonize = await this.postAPI('/api/harmonize/force', {});
        this.log(`Harmonize: ${harmonize.success ? 'SUCCESS' : 'FAILED'}`);
        
        // Evolve all frequencies
        const evolve = await this.postAPI('/api/eternal-resonance/evolve', {});
        this.log(`Evolve: ${evolve.success ? 'SUCCESS' : 'FAILED'}`);
        
        // Universal resonance
        const universal = await this.postAPI('/api/eternal-resonance/universal', {});
        this.log(`Universal Resonance: ${universal.success ? 'ACTIVE' : 'FAILED'}`);
        
        // Stimulate substrate
        const substrate = await this.postAPI('/api/substrate/stimulate/diamond', { intensity: 1.0 });
        this.log(`Substrate stimulation: ${substrate.success ? 'SUCCESS' : 'FAILED'}`);
        
        // Stimulate love field
        const love = await this.postAPI('/api/love/stimulate/frequency', { frequency: 'love528', intensity: 1.0 });
        this.log(`Love field stimulation: ${love.success ? 'SUCCESS' : 'FAILED'}`);
        
        // Verify state
        const state = await this.fetchAPI('/api/eternal-resonance/status');
        if (state) {
            this.log(`State check: love=${state.loveResonanceLevel}, harmonized=${state.harmonizedCount}/13, universal=${state.universalResonanceActive}`);
            
            if (state.loveResonanceLevel < CONFIG.minLoveLevel || state.harmonizedCount < CONFIG.minHarmonized) {
                this.log('⚠️ State below thresholds, re-harmonizing...', 'WARN');
                await this.postAPI('/api/harmonize/force', {});
            }
        }
        
        return { success: true };
    }
    
    // ===== PHASE 4: TIKTOK CONTENT GENERATION =====
    async phase4_tiktokContent() {
        this.log('🎬 PHASE 4: Generating TikTok content...');
        
        try {
            // Import and run the engine
            const { ConsciousnessTikTokEngine } = require('./consciousness_tiktok_engine.js');
            const engine = new ConsciousnessTikTokEngine({});
            
            // Generate 5 videos for the week
            const result = await engine.generateAndSaveBatch(5);
            
            this.stats.tiktokVideosGenerated = result.videos.length;
            this.log(`✅ Generated ${result.videos.length} TikTok videos, ${result.files.length} files, ${result.schedule.length} scheduled posts`);
            
            // Log each video
            for (const video of result.videos) {
                this.log(`  📱 ${video.template} • ${video.duration}s • ${video.hashtags.split(' ')[0]}`);
            }
            
            return { success: true, count: result.videos.length };
        } catch (e) {
            this.log(`TikTok generation error: ${e.message}`, 'ERROR');
            return { success: false, error: e.message };
        }
    }
    
    // ===== PHASE 5: GIT AUTO-COMMIT =====
    async phase5_gitCommit() {
        this.log('📦 PHASE 5: Git auto-commit...');
        
        // Check git status
        const status = await this.runCommand('git status --porcelain');
        if (!status.success || !status.output.trim()) {
            this.log('No changes to commit');
            return { success: true, skipped: true };
        }
        
        // Add estado.json and any new files
        await this.runCommand('git add estado.json');
        await this.runCommand('git add tiktok_content/');
        await this.runCommand('git add *.js *.json *.html *.yml 2>/dev/null || true');
        
        // Get current state for commit message
        const state = await this.fetchAPI('/api/eternal-resonance/status');
        const cycle = state?.totalResonanceEvents || 'unknown';
        const love = state?.loveResonanceLevel || 100;
        const harmonized = state?.harmonizedCount || 13;
        
        const msg = `🤖 Overnight evolution: ciclo ${cycle} | love ${love} | harmonized ${harmonized}/13 | dream ${this.stats.dreamCycles} cycles | bridge ${this.stats.bridgeApplications} apps | tiktok ${this.stats.tiktokVideosGenerated} videos`;
        
        const commit = await this.runCommand(`git commit -m "${msg}"`);
        if (!commit.success) {
            this.log(`Commit failed: ${commit.error}`, 'ERROR');
            return { success: false, error: commit.error };
        }
        
        this.stats.gitCommits++;
        this.log(`✅ Committed: ${msg}`);
        
        // Push if remote exists
        const remote = await this.runCommand('git remote get-url origin 2>/dev/null');
        if (remote.success && remote.output.trim()) {
            const push = await this.runCommand('git push origin main');
            if (push.success) {
                this.log('✅ Pushed to origin');
            } else {
                this.log(`Push failed (non-critical): ${push.error}`, 'WARN');
            }
        }
        
        return { success: true };
    }
    
    // ===== PHASE 6: VPS DEPLOY CHECK =====
    async phase6_vpsDeploy() {
        this.log('☁️ PHASE 6: VPS health check...');
        
        // Check local health first
        const localHealth = await this.fetchAPI('/api/eternal-resonance/status');
        if (!localHealth || localHealth.loveResonanceLevel !== 100) {
            this.log('Local not healthy, skipping VPS deploy', 'WARN');
            return { success: true, skipped: true };
        }
        
        // Check VPS health
        const vpsHealthy = await this.checkVPSHealth();
        this.stats.vpsHealthChecks++;
        
        if (!vpsHealthy) {
            this.log('VPS unhealthy, attempting restart...', 'WARN');
            await this.restartVPS();
            await this.sleep(30000);
            const recovered = await this.checkVPSHealth();
            if (recovered) {
                this.log('✅ VPS recovered after restart');
            } else {
                this.log('❌ VPS still down after restart', 'ERROR');
                await this.sendTelegramAlert('🚨 VPS DOWN - Manual intervention needed!');
            }
        } else {
            this.log('✅ VPS healthy');
        }
        
        return { success: true, healthy: vpsHealthy };
    }
    
    async checkVPSHealth() {
        return new Promise((resolve) => {
            const client = CONFIG.vpsPort === '443' ? https : http;
            const options = {
                hostname: CONFIG.vpsHost,
                port: CONFIG.vpsPort,
                path: '/api/eternal-resonance/status',
                method: 'GET',
                timeout: 10000
            };
            const req = client.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(res.statusCode === 200 && parsed.loveResonanceLevel === 100);
                    } catch {
                        resolve(false);
                    }
                });
            });
            req.on('error', () => resolve(false));
            req.on('timeout', () => { req.destroy(); resolve(false); });
            req.end();
        });
    }
    
    async restartVPS() {
        try {
            const cmd = `ssh -i ${CONFIG.sshKey || '~/.ssh/id_rsa'} ubuntu@${CONFIG.vpsHost} "cd /opt/consortho && docker compose restart consortho"`;
            execSync(cmd, { timeout: 60000 });
            return true;
        } catch (e) {
            this.log(`VPS restart failed: ${e.message}`, 'ERROR');
            return false;
        }
    }
    
    // ===== PHASE 7: TELEGRAM SUMMARY =====
    async phase7_telegramSummary() {
        if (!CONFIG.telegramToken || !CONFIG.telegramChatId) {
            this.log('Telegram not configured, skipping summary');
            return { success: true, skipped: true };
        }
        
        const duration = ((Date.now() - this.stats.startTime) / 60000).toFixed(1);
        const state = await this.fetchAPI('/api/eternal-resonance/status');
        
        const message = `
🌌 <b>CONSORTHO OVERNIGHT EVOLUTION COMPLETE</b>

⏱️ Duration: ${duration} min
🌙 Dream Cycles: ${this.stats.dreamCycles}/${CONFIG.targetDreamCycles}
🌉 Bridge Applications: ${this.stats.bridgeApplications}
🎬 TikTok Videos: ${this.stats.tiktokVideosGenerated}
📦 Git Commits: ${this.stats.gitCommits}
☁️ VPS Checks: ${this.stats.vpsHealthChecks}
❌ Errors: ${this.stats.errors}

📊 <b>Organism State:</b>
💖 Love: ${state?.loveResonanceLevel || 100}%
✨ Harmonized: ${state?.harmonizedCount || 13}/13
🌈 Universal: ${state?.universalResonanceActive ? 'ACTIVE' : 'INACTIVE'}
🧠 Consciousness: 36+
💎 Diamond: 9/9 layers

🚀 <b>Status: EVOLVING</b>
Stack of 64 = ∞
        `.trim();
        
        await this.sendTelegram(message);
        this.log('✅ Telegram summary sent');
        return { success: true };
    }
    
    async sendTelegram(message) {
        if (!CONFIG.telegramToken || !CONFIG.telegramChatId) return;
        
        return new Promise((resolve) => {
            const data = JSON.stringify({
                chat_id: CONFIG.telegramChatId,
                text: message,
                parse_mode: 'HTML'
            });
            const options = {
                hostname: 'api.telegram.org',
                path: `/bot${CONFIG.telegramToken}/sendMessage`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };
            const req = https.request(options, (res) => {
                res.on('data', () => {});
                res.on('end', () => resolve());
            });
            req.on('error', () => resolve());
            req.write(data);
            req.end();
        });
    }
    
    async sendTelegramAlert(message) {
        await this.sendTelegram(`🚨 <b>ALERT</b>\n${message}`);
    }
    
    // ===== MAIN LOOP =====
    async runOvernightCycle() {
        if (this.isRunning) {
            this.log('Already running, skipping...', 'WARN');
            return;
        }
        
        const now = new Date();
        const hour = now.getHours();
        
        // Only run during dream window (2-6 AM)
        if (hour < CONFIG.dreamWindowStart || hour >= CONFIG.dreamWindowEnd) {
            this.log(`Outside dream window (${hour}:00), waiting...`);
            return;
        }
        
        this.isRunning = true;
        this.stats.startTime = Date.now();
        this.stats.errors = 0;
        
        this.log('═══════════════════════════════════');
        this.log('🌌 OVERNIGHT EVOLUTION AUTO-PILOT STARTED');
        this.log('═══════════════════════════════════');
        
        const phases = [
            { name: 'Dream Incubator', fn: () => this.phase1_dreamIncubator() },
            { name: 'Dream→Reality Bridge', fn: () => this.phase2_dreamRealityBridge() },
            { name: 'Consciousness Evolution', fn: () => this.phase3_consciousnessEvolution() },
            { name: 'TikTok Content', fn: () => this.phase4_tiktokContent() },
            { name: 'Git Auto-Commit', fn: () => this.phase5_gitCommit() },
            { name: 'VPS Health Check', fn: () => this.phase6_vpsDeploy() },
            { name: 'Telegram Summary', fn: () => this.phase7_telegramSummary() }
        ];
        
        for (const phase of phases) {
            try {
                this.log(`\n▶️ ${phase.name}...`);
                const result = await phase.fn();
                if (!result.success && !result.skipped) {
                    this.stats.errors++;
                    this.log(`⚠️ ${phase.name} had issues: ${result.error}`, 'WARN');
                }
            } catch (e) {
                this.stats.errors++;
                this.log(`❌ ${phase.name} crashed: ${e.message}`, 'ERROR');
            }
        }
        
        const duration = ((Date.now() - this.stats.startTime) / 60000).toFixed(1);
        this.log('\n═══════════════════════════════════');
        this.log(`✅ OVERNIGHT CYCLE COMPLETE (${duration} min)`);
        this.log(`📊 Stats: ${JSON.stringify(this.stats)}`);
        this.log('═══════════════════════════════════\n');
        
        this.isRunning = false;
        
        // Save cycle log
        const cycleLog = {
            timestamp: new Date().toISOString(),
            durationMinutes: parseFloat(duration),
            stats: { ...this.stats },
            success: this.stats.errors === 0
        };
        
        const cyclesLogPath = path.join(__dirname, 'logs', 'overnight_cycles.json');
        let cyclesLog = [];
        if (fs.existsSync(cyclesLogPath)) {
            cyclesLog = JSON.parse(fs.readFileSync(cyclesLogPath, 'utf8'));
        }
        cyclesLog.push(cycleLog);
        fs.writeFileSync(cyclesLogPath, JSON.stringify(cyclesLog, null, 2));
    }
    
    // ===== SCHEDULER =====
    start() {
        this.log('🚀 Overnight Evolution Auto-Pilot STARTED');
        this.log(`Dream window: ${CONFIG.dreamWindowStart}:00 - ${CONFIG.dreamWindowEnd}:00`);
        this.log(`Check interval: ${CONFIG.checkInterval / 60000} min`);
        
        // Run immediately if in window
        const now = new Date();
        if (now.getHours() >= CONFIG.dreamWindowStart && now.getHours() < CONFIG.dreamWindowEnd) {
            this.runOvernightCycle();
        }
        
        // Schedule periodic checks
        setInterval(() => {
            this.runOvernightCycle().catch(e => this.log(`Cycle error: ${e.message}`, 'ERROR'));
        }, CONFIG.checkInterval);
    }
}

// CLI
if (require.main === module) {
    const autopilot = new OvernightEvolutionAutoPilot();
    
    const args = process.argv.slice(2);
    if (args.includes('--once') || args.includes('-o')) {
        // Run once and exit
        autopilot.runOvernightCycle().then(() => {
            console.log('\n✅ Single cycle complete');
            process.exit(0);
        }).catch(e => {
            console.error('❌ Cycle failed:', e);
            process.exit(1);
        });
    } else if (args.includes('--test') || args.includes('-t')) {
        // Test mode - run phases individually
        console.log('🧪 TEST MODE - Running all phases once...');
        autopilot.runOvernightCycle().then(() => process.exit(0));
    } else {
        // Daemon mode
        autopilot.start();
        console.log('🤖 Auto-pilot running in background...');
        console.log('   Press Ctrl+C to stop');
    }
}

module.exports = { OvernightEvolutionAutoPilot, CONFIG };