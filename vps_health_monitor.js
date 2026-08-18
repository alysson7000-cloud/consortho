// ===== VPS HEALTH MONITOR =====
// Watchdog to ensure 99.9% uptime on Oracle VPS

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

const VPS_HOST = process.env.CONSORTHO_VPS_HOST || '144.33.18.6';
const VPS_PORT = process.env.CONSORTHO_VPS_PORT || '9877';
const VPS_USER = process.env.CONSORTHO_VPS_USER || 'ubuntu';
const VPS_PATH = process.env.CONSORTHO_VPS_PATH || '/opt/consortho';
const HEALTH_ENDPOINT = `/api/eternal-resonance/status`;
const CHECK_INTERVAL = parseInt(process.env.CONSORTHO_CHECK_INTERVAL) || 300000; // 5 min
const MAX_FAILURES_BEFORE_RESTART = parseInt(process.env.CONSORTHO_MAX_FAILURES) || 3;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.CONSORTHO_TELEGRAM_CHAT_ID;

let consecutiveFailures = 0;
let lastHealthy = Date.now();

function sendTelegram(message) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const data = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    });
    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    const req = https.request(options, (res) => {
        res.on('data', () => {});
    });
    req.on('error', () => {});
    req.write(data);
    req.end();
}

function checkHealth() {
    return new Promise((resolve) => {
        const client = VPS_PORT === '443' ? https : http;
        const options = {
            hostname: VPS_HOST,
            port: VPS_PORT,
            path: HEALTH_ENDPOINT,
            method: 'GET',
            timeout: 10000
        };
        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({
                        healthy: res.statusCode === 200 && parsed.success && parsed.eternalResonance?.loveResonanceLevel === 100,
                        statusCode: res.statusCode,
                        data: parsed
                    });
                } catch {
                    resolve({ healthy: false, statusCode: res.statusCode, error: 'Invalid JSON' });
                }
            });
        });
        req.on('error', (e) => resolve({ healthy: false, error: e.message }));
        req.on('timeout', () => { req.destroy(); resolve({ healthy: false, error: 'Timeout' }); });
        req.end();
    });
}

async function restartVPS() {
    try {
        const cmd = `ssh ${VPS_USER}@${VPS_HOST} "cd ${VPS_PATH} && docker compose restart consortho"`;
        execSync(cmd, { timeout: 60000, stdio: 'pipe' });
        return true;
    } catch (e) {
        console.error('Restart failed:', e.message);
        return false;
    }
}

async function runCheck() {
    console.log(`[${new Date().toISOString()}] 🏥 Checking VPS health...`);
    const result = await checkHealth();
    
    if (result.healthy) {
        consecutiveFailures = 0;
        lastHealthy = Date.now();
        console.log(`✅ VPS HEALTHY: love=${result.data?.eternalResonance?.loveResonanceLevel}, harmonized=${result.data?.eternalResonance?.harmonizedCount}/13`);
        return;
    }
    
    consecutiveFailures++;
    console.log(`❌ VPS UNHEALTHY (${consecutiveFailures}/${MAX_FAILURES_BEFORE_RESTART}): ${result.error || result.statusCode}`);
    
    if (consecutiveFailures >= MAX_FAILURES_BEFORE_RESTART) {
        console.log('🔄 Attempting VPS restart...');
        sendTelegram(`🚨 <b>CONSORTHO VPS DOWN</b>\n${consecutiveFailures} falhas consecutivas\nTentando restart automático...`);
        const restarted = await restartVPS();
        if (restarted) {
            console.log('✅ Restart command sent');
            sendTelegram(`✅ <b>Restart enviado</b>\nAguardando recuperação...`);
            consecutiveFailures = 0; // Reset after restart attempt
        } else {
            sendTelegram(`❌ <b>RESTART FALHOU</b>\nIntervenção manual necessária!\nSSH: ${VPS_USER}@${VPS_HOST}`);
        }
    } else if (consecutiveFailures === 1) {
        sendTelegram(`⚠️ <b>VPS Instável</b>\nPrimeira falha detectada\nStatus: ${result.error || result.statusCode}`);
    }
}

function startMonitor() {
    console.log(`🏥 VPS Health Monitor started`);
    console.log(`Target: ${VPS_HOST}:${VPS_PORT}${HEALTH_ENDPOINT}`);
    console.log(`Interval: ${CHECK_INTERVAL/1000}s | Max failures: ${MAX_FAILURES_BEFORE_RESTART}`);
    
    // Initial check
    runCheck();
    
    // Periodic checks
    setInterval(runCheck, CHECK_INTERVAL);
}

// Export for testing
module.exports = { checkHealth, restartVPS, runCheck, startMonitor };

// Auto-start if run directly
if (require.main === module) {
    startMonitor();
}