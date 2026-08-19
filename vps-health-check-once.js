#!/usr/bin/env node
/**
 * VPS Health Check - One-time check for 144.33.18.6:9877
 * Sends Telegram alert if unhealthy and attempts SSH restart
 */

require('dotenv').config();
const { exec } = require('child_process');
const http = require('http');
const https = require('https');

const VPS_HOST = '144.33.18.6';
const VPS_PORT = '9877';
const HEALTH_ENDPOINT = '/api/eternal-resonance/status';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function sendTelegram(message) {
    return new Promise((resolve) => {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.log('⚠️ Telegram credentials not configured');
            resolve(false);
            return;
        }
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
            res.on('end', () => {
                console.log('📱 Telegram alert sent successfully');
                resolve(true);
            });
        });
        req.on('error', (e) => {
            console.error('❌ Failed to send Telegram alert:', e.message);
            resolve(false);
        });
        req.write(data);
        req.end();
    });
}

function checkHealth() {
    return new Promise((resolve) => {
        console.log(`[${new Date().toISOString()}] 🏥 Checking VPS health at ${VPS_HOST}:${VPS_PORT}${HEALTH_ENDPOINT}...`);
        
        const client = VPS_PORT === '443' ? https : http;
        const options = {
            hostname: VPS_HOST,
            port: VPS_PORT,
            path: HEALTH_ENDPOINT,
            method: 'GET',
            timeout: 15000
        };
        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const healthy = res.statusCode === 200 && parsed.success;
                    console.log(`Status Code: ${res.statusCode}`);
                    console.log(`Response:`, JSON.stringify(parsed, null, 2));
                    resolve({ healthy, statusCode: res.statusCode, data: parsed });
                } catch {
                    console.log(`Status Code: ${res.statusCode}`);
                    console.log(`Raw Response: ${data.substring(0, 500)}`);
                    resolve({ healthy: false, statusCode: res.statusCode, error: 'Invalid JSON' });
                }
            });
        });
        req.on('error', (e) => {
            console.log(`❌ Error: ${e.code || e.message}`);
            resolve({ healthy: false, error: e.code || e.message });
        });
        req.on('timeout', () => {
            req.destroy();
            console.log('❌ Timeout after 15s');
            resolve({ healthy: false, error: 'Timeout' });
        });
        req.end();
    });
}

async function attemptSSHRestart() {
    console.log(`[${new Date().toISOString()}] Attempting SSH restart...`);
    
    const commands = [
        `ssh -o ConnectTimeout=15 -o BatchMode=yes root@${VPS_HOST} "pm2 restart all"`,
        `ssh -o ConnectTimeout=15 -o BatchMode=yes root@${VPS_HOST} "systemctl restart consortho 2>/dev/null || pm2 restart all"`,
        `ssh -o ConnectTimeout=15 -o BatchMode=yes root@${VPS_HOST} "cd /opt/consortho && docker compose restart consortho 2>/dev/null || pm2 restart all"`
    ];
    
    for (const cmd of commands) {
        try {
            console.log(`Executing: ${cmd}`);
            const result = await new Promise((resolve, reject) => {
                exec(cmd, { timeout: 60000 }, (err, stdout, stderr) => {
                    if (err) {
                        reject({ error: err.message, stdout, stderr });
                    } else {
                        resolve({ stdout, stderr });
                    }
                });
            });
            console.log('✅ SSH command executed successfully');
            console.log('stdout:', result.stdout);
            console.log('stderr:', result.stderr);
            return true;
        } catch (error) {
            console.log(`❌ SSH failed: ${error.error || error.message}`);
            console.log('stdout:', error.stdout);
            console.log('stderr:', error.stderr);
        }
    }
    
    return false;
}

async function main() {
    console.log('🔍 VPS HEALTH CHECK STARTED');
    console.log('==============================');
    console.log(`Target: ${VPS_HOST}:${VPS_PORT}${HEALTH_ENDPOINT}`);
    console.log(`Telegram: ${TELEGRAM_BOT_TOKEN ? 'Configured' : 'NOT CONFIGURED'}`);
    console.log('==============================\n');
    
    const health = await checkHealth();
    
    if (!health.healthy) {
        console.log('\n🚨 VPS IS UNHEALTHY - Sending alert and attempting recovery');
        
        const alertMessage = `
🚨 <b>VPS HEALTH ALERT</b> 🚨

🔴 <b>Server:</b> ${VPS_HOST}:${VPS_PORT}
❌ <b>Status:</b> ${health.error || `HTTP ${health.statusCode}`}
🕐 <b>Time:</b> ${new Date().toISOString()}

<b>Attempting automatic recovery via SSH...</b>
        `.trim();
        
        await sendTelegram(alertMessage);
        
        const restartSuccess = await attemptSSHRestart();
        
        if (restartSuccess) {
            const recoveryMessage = `
✅ <b>VPS RECOVERY ATTEMPTED</b>

🔄 <b>SSH restart commands sent</b>
🕐 <b>Time:</b> ${new Date().toISOString()}

<b>Please verify manually if services are restored.</b>
            `.trim();
            await sendTelegram(recoveryMessage);
        } else {
            const failureMessage = `
❌ <b>VPS RECOVERY FAILED</b>

🔴 <b>SSH connection failed - manual intervention required</b>
🕐 <b>Time:</b> ${new Date().toISOString()}

<b>Check Oracle Cloud console or network connectivity.</b>
<b>SSH: root@${VPS_HOST}</b>
            `.trim();
            await sendTelegram(failureMessage);
        }
    } else {
        console.log('\n✅ VPS is healthy - no action needed');
        
        const okMessage = `
✅ <b>VPS HEALTH CHECK OK</b>

🟢 <b>Server:</b> ${VPS_HOST}:${VPS_PORT}
✅ <b>Status:</b> HTTP ${health.statusCode}
🕐 <b>Time:</b> ${new Date().toISOString()}
        `.trim();
        await sendTelegram(okMessage);
    }
    
    console.log('\n🔍 VPS HEALTH CHECK COMPLETE');
    process.exit(health.healthy ? 0 : 1);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});