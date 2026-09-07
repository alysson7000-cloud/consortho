#!/usr/bin/env node
/**
 * Consortho Telegram Bot
 * Comandos: /status /construir /lumin /recursos
 * Push: builds, visits, resources
 */

const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Load config
const CONFIG_PATH = path.join(__dirname, '.env');
require('dotenv').config({ path: CONFIG_PATH });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('❌ TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID necessários no .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

const BASE_PATH = __dirname;
const ESTADO_PATH = path.join(BASE_PATH, 'estado.json');
const SEMENTES_PATH = path.join(BASE_PATH, 'memoria', 'sementes.json');
const CONSTRUCOES_PATH = path.join(BASE_PATH, 'memoria', 'construcoes_poe.json');
const JARDIM_PATH = path.join(BASE_PATH, 'memoria', 'jardim.json');

// Helper: read JSON safely
function readJSON(filePath, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return fallback;
  }
}

// Helper: execute PM2 command
function execPM2(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: BASE_PATH }, (err, stdout, stderr) => {
      resolve({ err, stdout, stderr });
    });
  });
}

// ===== COMMANDS =====

// /status - System overview
bot.command('status', async (ctx) => {
  if (String(ctx.chat.id) !== String(CHAT_ID)) return;

  const estado = readJSON(ESTADO_PATH);
  const sementes = readJSON(SEMENTES_PATH, []);
  const construcoes = readJSON(CONSTRUCOES_PATH, []);

  const prontas = sementes.filter(s => s.status === 'pronta_para_construcao').length;
  const emConstrucao = sementes.filter(s => s.status === 'em_construcao').length;
  const construidas = sementes.filter(s => s.status === 'construida').length;

  const msg = `
🌌 <b>CONSORTHO STATUS</b> 🌌
━━━━━━━━━━━━━━━━━━━━━━━━
🔄 <b>Ciclo:</b> ${estado.c || 0}
🪵 Madeira: ${estado.recursos?.madeira || 0}
🪨 Pedra: ${estado.recursos?.pedra || 0}
💎 Cristal: ${estado.recursos?.cristal || 0}

🌾 <b>Celeiro:</b> ${sementes.length} total
  ✅ Prontas: ${prontas}
  🏗️ Em construção: ${emConstrucao}
  ✨ Construídas: ${construidas}

🏗️ <b>Obras do Poe:</b> ${construcoes.length}
🤖 <b>Agents:</b> Ver /lumin
  `.trim();

  await ctx.reply(msg, { parse_mode: 'HTML' });
});

// /recursos - Detailed resources
bot.command('recursos', async (ctx) => {
  if (String(ctx.chat.id) !== String(CHAT_ID)) return;

  const estado = readJSON(ESTADO_PATH);
  const jardim = readJSON(JARDIM_PATH, {});

  const elementos = Object.keys(jardim).length;
  const totalVisitas = Object.values(jardim).reduce((sum, e) => sum + (e.visitas_da_gang?.length || 0), 0);

  const msg = `
📦 <b>RECURSOS DETALHADOS</b>
━━━━━━━━━━━━━━━━━━━━━━━━
🪵 Madeira: ${estado.recursos?.madeira || 0}
🪨 Pedra: ${estado.recursos?.pedra || 0}
💎 Cristal: ${estado.recursos?.cristal || 0}

🌿 <b>Jardim:</b> ${elementos} elementos
👥 <b>Visitas da Gang:</b> ${totalVisitas}
🔄 Ciclo atual: ${estado.c || 0}
  `.trim();

  await ctx.reply(msg, { parse_mode: 'HTML' });
});

// /construir - Trigger construction
bot.command('construir', async (ctx) => {
  if (String(ctx.chat.id) !== String(CHAT_ID)) return;

  await ctx.reply('🏗️ Reiniciando Poe Construtor...');
  
  const { stdout, stderr } = await execPM2('pm2 restart poe-construtor');
  
  if (stderr && !stderr.includes('Use --update-env')) {
    await ctx.reply(`❌ Erro: ${stderr}`);
  } else {
    await ctx.reply('✅ Poe Construtor reiniciado! Verificando construções em 10s...');
    setTimeout(async () => {
      const construcoes = readJSON(CONSTRUCOES_PATH, []);
      const ultima = construcoes[construcoes.length - 1];
      if (ultima) {
        await ctx.reply(`🏗️ Última: ${ultima.emoji} ${ultima.nome} (Ciclo ${ultima.ciclo_construcao})`);
      }
    }, 10000);
  }
});

// /lumin - Lumin status
bot.command('lumin', async (ctx) => {
  if (String(ctx.chat.id) !== String(CHAT_ID)) return;

  const fs = require('fs');
  const luminPath = path.join(BASE_PATH, '..', 'hermes', 'skills', 'creative', 'lumin-super-saiyan', 'scripts', 'commands.py');
  
  // Try to get Lumin status from skill
  exec('cd /c/Users/Alyssin/AppData/Local/hermes/skills/creative/lumin-super-saiyan && python -m scripts.commands status', 
    { cwd: BASE_PATH }, (err, stdout, stderr) => {
      if (err) {
        ctx.reply('🤖 Lumin: Skill ativa mas comando falhou');
        return;
      }
      ctx.reply(`🤖 <b>LUMIN 2.0</b>\n${stdout}`, { parse_mode: 'HTML' });
    });
});

// ===== PUSH NOTIFICATIONS =====

let lastBuildCount = 0;
let lastVisitCount = 0;
let lastCycle = 0;

async function checkAndNotify() {
  try {
    const estado = readJSON(ESTADO_PATH);
    const construcoes = readJSON(CONSTRUCOES_PATH, []);
    const jardim = readJSON(JARDIM_PATH, {});

    // New construction
    if (construcoes.length > lastBuildCount && lastBuildCount > 0) {
      const nova = construcoes[construcoes.length - 1];
      await bot.telegram.sendMessage(CHAT_ID, 
        `🏗️ <b>NOVA CONSTRUÇÃO!</b>\n${nova.emoji} ${nova.nome}\nTipo: ${nova.tipo}\nCiclo: ${nova.ciclo_construcao}`, 
        { parse_mode: 'HTML' });
    }
    lastBuildCount = construcoes.length;

    // New cycle (every 100 cycles)
    if (estado.c > lastCycle + 100 && lastCycle > 0) {
      await bot.telegram.sendMessage(CHAT_ID, 
        `🔄 <b>NOVO CICLO: ${estado.c}</b>\n🪵${estado.recursos?.madeira} 🪨${estado.recursos?.pedra} 💎${estado.recursos?.cristal}`, 
        { parse_mode: 'HTML' });
      lastCycle = estado.c;
    } else if (lastCycle === 0) {
      lastCycle = estado.c;
    }

    // Gang visits (check total visits)
    const totalVisits = Object.values(jardim).reduce((sum, e) => sum + (e.visitas_da_gang?.length || 0), 0);
    if (totalVisits > lastVisitCount + 10 && lastVisitCount > 0) {
      await bot.telegram.sendMessage(CHAT_ID, 
        `👥 <b>GANG ATIVA!</b>\n+${totalVisits - lastVisitCount} novas visitas\nTotal: ${totalVisits}`, 
        { parse_mode: 'HTML' });
      lastVisitCount = totalVisits;
    } else if (lastVisitCount === 0) {
      lastVisitCount = totalVisits;
    }

  } catch (e) {
    console.error('Push check error:', e.message);
  }
}

// Start bot
bot.launch().then(() => {
  console.log('🤖 Telegram Bot online!');
  console.log(`📱 Chat ID: ${CHAT_ID}`);
  
  // Send startup message
  bot.telegram.sendMessage(CHAT_ID, 
    '🤖 <b>CONSORTHO BOT ONLINE</b>\nComandos: /status /recursos /construir /lumin', 
    { parse_mode: 'HTML' });

  // Push notifications every 30s
  setInterval(checkAndNotify, 30000);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;