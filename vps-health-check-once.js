#!/usr/bin/env node
/**
 * VPS Health Check - One-time check for cron job execution
 * Checks HTTP endpoint, sends Telegram alert if unhealthy, attempts SSH restart
 * 
 * Usage: node vps-health-check-once.js
 * Reads config from project .env file
 */

require('dotenv').config();
const { exec } = require('child_process');
const http = require('http');
const https = require('https');
const path = require('path');

// Configuration - reads from .env or uses defaults
const VPS_HOST = process.env.VPS_HOST || '144.33.18.6';
const VPS_PORT = process.env.VPS_PORT || '9877';
const HEALTH_ENDPOINT = process.env.HEALTH_ENDPOINT || '/api/resumo';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_HOME_CHANNEL;
const SSH_USER = process.env.SSH_USER || 'ubuntu';

function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

function sendTelegram(message) {
    return new Promise((resolve) => {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            log('⚠️ Telegram credentials not configured');
            resolve(false);
            return;
        }
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
                log('📱 Telegram alert sent successfully');
                resolve(true);
            });
        });
        req.on('error', (e) => {
            log(`❌ Failed to send Telegram alert: ${e.message}`);
            resolve(false);
        });
        req.write(data);
        req.end();
    });
}

function checkHealth() {
    return new Promise((resolve) => {
        log(`🏥 Checking VPS health at ${VPS_HOST}:${VPS_PORT}${HEALTH_ENDPOINT}...`);
        
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
                    log(`Status Code: ${res.statusCode}`);
                    log(`Response: ${JSON.stringify(parsed)}`);
                    resolve({ healthy, statusCode: res.statusCode, data: parsed });
                } catch {
                    log(`Status Code: ${res.statusCode}`);
                    log(`Raw Response: ${data.substring(0, 500)}`);
                    resolve({ healthy: false, statusCode: res.statusCode, error: 'Invalid JSON' });
                }
            });
        });
        req.on('error', (e) => {
            log(`❌ Error: ${e.code || e.message}`);
            resolve({ healthy: false, error: e.code || e.message });
        });
        req.on('timeout', () => {
            req.destroy();
            log('❌ Timeout after 15s');
            resolve({ healthy: false, error: 'Timeout' });
        });
        req.end();
    });
}

async function attemptSSHRestart() {
    log('Attempting SSH restart...');
    
    const commands = [
        `ssh -o ConnectTimeout=15 -o BatchMode=yes ${SSH_USER}@${VPS_HOST} "pm2 restart all"`,
        `ssh -o ConnectTimeout=15 -o BatchMode=yes ${SSH_USER}@${VPS_HOST} "systemctl restart consortho 2>/dev/null || pm2 restart all"`,
        `ssh -o ConnectTimeout=15 -o BatchMode=yes ${SSH_USER}@${VPS_HOST} "cd /opt/consortho && docker compose restart consortho 2>/dev/null || pm2 restart all"`
    ];
    
    for (const cmd of commands) {
        try {
            log(`Executing: ${cmd}`);
            const result = await new Promise((resolve, reject) => {
                exec(cmd, { timeout: 60000 }, (err, stdout, stderr) => {
                    if (err) {
                        reject({ error: err.message, stdout, stderr });
                    } else {
                        resolve({ stdout, stderr });
                    }
                });
            });
            log('✅ SSH command executed successfully');
            log(`stdout: ${result.stdout}`);
            log(`stderr: ${result.stderr}`);
            return true;
        } catch (error) {
            log(`❌ SSH failed: ${error.error || error.message}`);
            log(`stdout: ${error.stdout}`);
            log(`stderr: ${error.stderr}`);
        }
    }
    
    return false;
}

async function main() {
    log('🔍 VPS HEALTH CHECK STARTED');
    log('==============================');
    log(`Target: ${VPS_HOST}:${VPS_PORT}${HEALTH_ENDPOINT}`);
    log(`Telegram: ${TELEGRAM_BOT_TOKEN ? 'Configured' : 'NOT CONFIGURED'}`);
    log('==============================\n');
    
    const health = await checkHealth();
    
    if (!health.healthy) {
        log('\n🚨 VPS IS UNHEALTHY - Sending alert and attempting recovery');
        
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
<b>SSH: ${SSH_USER}@${VPS_HOST}</b>
            `.trim();
            await sendTelegram(failureMessage);
        }
    } else {
        log('\n✅ VPS is healthy - no action needed');
        
        const okMessage = `
✅ <b>VPS HEALTH CHECK OK</b>

🟢 <b>Server:</b> ${VPS_HOST}:${VPS_PORT}
✅ <b>Status:</b> HTTP ${health.statusCode}
🕐 <b>Time:</b> ${new Date().toISOString()}
        `.trim();
        await sendTelegram(okMessage);
    }
    
    log('\n🔍 VPS HEALTH CHECK COMPLETE');
    process.exit(health.healthy ? 0 : 1);
}

main().catch(err => {
    log(`Fatal error: ${err.message}`);
    process.exit(1);
});