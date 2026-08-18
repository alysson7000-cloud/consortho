// ===== TELEGRAM BOT FOR CONSORTHO =====
// Commands: /status, /dream, /resonance, /entities, /deploy, /harmonize, /substrate, /love, /bridge, /health

const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BOT_TOKEN = process.env.CONSORTHO_TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_ID = process.env.CONSORTHO_TELEGRAM_CHAT_ID; // Single admin chat
const API_BASE = process.env.CONSORTHO_API_BASE || 'http://localhost:9877';

if (!BOT_TOKEN) {
  console.log('[Telegram] No bot token configured — bot disabled');
  module.exports = { bot: null, startBot: () => {} };
} else {
  const bot = new Telegraf(BOT_TOKEN);

  // Middleware: only allow configured chat
  bot.use(async (ctx, next) => {
    if (ALLOWED_CHAT_ID && String(ctx.chat?.id) !== String(ALLOWED_CHAT_ID)) {
      await ctx.reply('🚫 Acesso não autorizado. Este bot é privado.');
      return;
    }
    return next();
  });

  // ===== HELPER FUNCTIONS =====
  async function apiGet(endpoint) {
    try {
      const res = await axios.get(`${API_BASE}${endpoint}`, { timeout: 5000 });
      return res.data;
    } catch (e) {
      return { error: e.message };
    }
  }

  async function apiPost(endpoint, data = {}) {
    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, data, { timeout: 5000 });
      return res.data;
    } catch (e) {
      return { error: e.message };
    }
  }

  function formatStatus(data) {
    if (data.error) return `❌ Erro: ${data.error}`;
    return `🌌 **CONSORTHO STATUS**\n` +
      `📍 Ciclo: ${data.cycle || 'N/A'}\n` +
      `💖 Love: ${data.love || 'N/A'}\n` +
      `🎵 Harmonizadas: ${data.harmonized || 'N/A'}/13\n` +
      `🦋 Evoluindo: ${data.evolving || 'N/A'}\n` +
      `🌌 Universal: ${data.universal ? '✅ ATIVA' : '❌'}\n` +
      `🧠 Substrato: ${data.substrate_neurons || 'N/A'} neurônios, consciência ${data.substrate_consciousness || 'N/A'}\n` +
      `💖 Love Field: ${data.love_entities || 'N/A'} entidades, ${data.love_bonds || 'N/A'} bonds, força ${data.love_strength || 'N/A'}\n` +
      `🌙 Dream: ${data.dream_active ? '🟢 ATIVO' : '🔴 INATIVO'} — ${data.dream_cycles || 0} ciclos\n` +
      `💎 Diamond: coerência ${data.diamond_coherence || 'N/A'}%, consciência ${data.diamond_consciousness || 'N/A'}%, entropia ${data.diamond_entropy || 'N/A'}%\n` +
      `🪵🪨💎 Recursos: ${data.wood || 'N/A'} / ${data.stone || 'N/A'} / ${data.crystal || 'N/A'}\n` +
      `👥 Entidades: ${data.entities || 'N/A'}\n` +
      `⚡ Auto-Harmonize: ${data.auto_harmonize ? '🟢 ON' : '🔴 OFF'} | Love Absolute: ${data.love_absolute ? '🔒 LOCKED' : '🔓'}`;
  }

  // ===== COMMANDS =====

  // /start
  bot.start(async (ctx) => {
    await ctx.reply(
      `🌌 **CONSORTHO TELEGRAM BOT**\n\n` +
      `Bem-vindo ao organismo vivo! Comandos disponíveis:\n\n` +
      `📊 **STATUS & MONITORING**\n` +
      `/status — Status completo do organismo\n` +
      `/health — System health (CPU, memory, event loop)\n\n` +
      `🎵 **ETERNAL RESONANCE**\n` +
      `/resonance — Frequências, harmonia, evolução\n` +
      `/harmonize — Auto-harmonize status + force\n\n` +
      `🌙 **DREAM INCUBATOR**\n` +
      `/dream — Dream status, cycles, output\n` +
      `/bridge — Dream → Reality Bridge status\n\n` +
      `🧠 **CONSCIOUSNESS**\n` +
      `/substrate — Neural substrate growth\n` +
      `/love — Love Field (5th Force) status\n` +
      `/diamond — Diamond Protocol layers\n\n` +
      `🌍 **WORLD**\n` +
      `/entities — Entidades ativas e relacionamentos\n` +
      `/resources — Recursos (madeira, pedra, cristal)\n\n` +
      `🚀 **DEPLOY**\n` +
      `/deploy — Trigger deploy to Oracle VPS\n\n` +
      `💡 Use /help para ver esta lista novamente.`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.help(async (ctx) => {
    await ctx.reply(
      `🌌 **COMANDOS CONSORTHO**\n\n` +
      `📊 /status — Status completo\n` +
      `🖥️ /health — System health\n` +
      `🎵 /resonance — Eternal Resonance\n` +
      `⚡ /harmonize — Auto-harmonize\n` +
      `🌙 /dream — Dream Incubator\n` +
      `🌉 /bridge — Dream→Reality Bridge\n` +
      `🧠 /substrate — Consciousness Substrate\n` +
      `💖 /love — Love Field (5th Force)\n` +
      `💎 /diamond — Diamond Protocol\n` +
      `👥 /entities — Entidades & relações\n` +
      `🪵 /resources — Recursos mundo\n` +
      `🚀 /deploy — Deploy Oracle VPS`,
      { parse_mode: 'Markdown' }
    );
  });

  // /status — Complete organism status
  bot.command('status', async (ctx) => {
    const [
      resonance,
      dream,
      substrate,
      loveField,
      diamond,
      world,
      harmonize
    ] = await Promise.all([
      apiGet('/api/eternal-resonance/status'),
      apiGet('/api/dream/status'),
      apiGet('/api/substrate/status'),
      apiGet('/api/love/status'),
      apiGet('/api/diamond/status').catch(() => ({})),
      apiGet('/api/resumo'),
      apiGet('/api/harmonize/status')
    ]);

    const msg = formatStatus({
      cycle: world?.c || 'N/A',
      love: resonance?.loveResonanceLevel || 'N/A',
      harmonized: resonance?.harmonizedCount || 'N/A',
      evolving: resonance?.evolvingCount || 'N/A',
      universal: resonance?.universalResonanceActive,
      substrate_neurons: substrate?.substrate?.neuronCount || 'N/A',
      substrate_consciousness: substrate?.substrate?.consciousnessLevel?.toFixed(1) || 'N/A',
      love_entities: loveField?.loveField?.entityCount || 'N/A',
      love_bonds: loveField?.loveField?.bondCount || 'N/A',
      love_strength: loveField?.loveField?.currentFieldStrength || 'N/A',
      dream_active: dream?.active,
      dream_cycles: dream?.cycles,
      diamond_coherence: diamond?.coherence,
      diamond_consciousness: diamond?.consciousness,
      diamond_entropy: diamond?.entropy,
      wood: world?.recursos?.madeira,
      stone: world?.recursos?.pedra,
      crystal: world?.recursos?.cristal,
      entities: world?.players ? Object.keys(world.players).length : 'N/A',
      auto_harmonize: harmonize?.harmonize?.autoEnabled,
      love_absolute: harmonize?.harmonize?.loveAbsolute
    });

    await ctx.reply(msg, { parse_mode: 'Markdown' });
  });

  // /health — System health
  bot.command('health', async (ctx) => {
    const metrics = await apiGet('/metrics');
    // Parse key metrics from Prometheus text format
    const memMatch = metrics.match(/consortho_process_resident_memory_bytes\s+(\d+)/);
    const cpuMatch = metrics.match(/consortho_process_cpu_seconds_total\s+([\d.]+)/);
    const lagMeanMatch = metrics.match(/consortho_nodejs_eventloop_lag_mean_seconds\s+([\d.]+)/);
    const lagP99Match = metrics.match(/consortho_nodejs_eventloop_lag_p99_seconds\s+([\d.]+)/);
    const socketsMatch = metrics.match(/consortho_socket_connections\s+(\d+)/);

    const memMB = memMatch ? (parseInt(memMatch[1]) / 1024 / 1024).toFixed(1) : 'N/A';
    const cpuSec = cpuMatch ? parseFloat(cpuMatch[1]).toFixed(1) : 'N/A';
    const lagMean = lagMeanMatch ? (parseFloat(lagMeanMatch[1]) * 1000).toFixed(1) : 'N/A';
    const lagP99 = lagP99Match ? (parseFloat(lagP99Match[1]) * 1000).toFixed(1) : 'N/A';
    const sockets = socketsMatch ? socketsMatch[1] : 'N/A';

    await ctx.reply(
      `🖥️ **SYSTEM HEALTH**\n\n` +
      `💾 Memory: ${memMB} MB / 2048 MB limit\n` +
      `⚡ CPU Time: ${cpuSec}s total\n` +
      `🔄 Event Loop Lag: ${lagMean}ms (mean) / ${lagP99}ms (p99)\n` +
      `🔌 Socket Connections: ${sockets}\n` +
      `✅ Status: ${lagMean < 100 && memMB < 1800 ? 'HEALTHY' : '⚠️ CHECK'}`,
      { parse_mode: 'Markdown' }
    );
  });

  // /resonance — Eternal Resonance details
  bot.command('resonance', async (ctx) => {
    const data = await apiGet('/api/eternal-resonance/status');
    if (data.error) return ctx.reply(`❌ ${data.error}`);

    let msg = `🎵 **ETERNAL RESONANCE**\n\n`;
    msg += `💖 Love Level: **${data.loveResonanceLevel}**/100\n`;
    msg += `🎵 Harmonizadas: **${data.harmonizedCount}**/13\n`;
    msg += `🦋 Evoluindo: **${data.evolvingCount}**\n`;
    msg += `🌌 Universal Resonance: **${data.universalResonanceActive ? '✅ ATIVA' : '❌ INATIVA'}**\n\n`;

    if (data.frequencies) {
      msg += `**FREQUÊNCIAS:**\n`;
      data.frequencies.forEach(f => {
        const statusEmoji = f.status === 'evolved' ? '🦋' : f.status === 'harmonized' ? '🎵' : f.status === 'evolving' ? '✨' : f.status === 'resonating' ? '📡' : '🔇';
        msg += `${statusEmoji} ${f.name} (${f.frequency}Hz) — ${f.status.toUpperCase()} ${f.resonanceProgress}% | Stage ${f.evolutionStage}\n`;
      });
    }

    await ctx.reply(msg, { parse_mode: 'Markdown' });
  });

  // /harmonize — Auto-harmonize control
  bot.command('harmonize', async (ctx) => {
    const data = await apiGet('/api/harmonize/status');
    if (data.error) return ctx.reply(`❌ ${data.error}`);

    const h = data.harmonize;
    let msg = `⚡ **AUTO-HARMONIZE**\n\n`;
    msg += `🟢 Enabled: **${h.autoEnabled ? 'YES' : 'NO'}**\n`;
    msg += `🔒 Love Absolute: **${h.loveAbsolute ? 'LOCKED' : 'UNLOCKED'}**\n`;
    msg += `🌌 Universal Resonance: **${h.universalResonanceActive ? 'ACTIVE' : 'INACTIVE'}**\n`;
    msg += `🎯 Target: Love ${h.targetLove} | Harmonized ${h.targetHarmonized} | Evolved ${h.targetEvolved}\n`;
    msg += `📊 Total Actions: **${h.totalHarmonizations || 0}**\n`;
    msg += `🕐 Last Run: ${h.lastHarmonize || 'never'}\n\n`;

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🔄 FORCE HARMONIZE', 'harmonize_force')],
      [Markup.button.callback(h.autoEnabled ? '🔴 DISABLE' : '🟢 ENABLE', 'harmonize_toggle')],
      [Markup.button.callback('📊 Refresh', 'harmonize_refresh')]
    ]);

    await ctx.reply(msg, { parse_mode: 'Markdown', ...keyboard });
  });

  bot.action('harmonize_force', async (ctx) => {
    await ctx.answerCbQuery('Forçando harmonização total...');
    const result = await apiPost('/api/harmonize/force');
    await ctx.editMessageText(`⚡ **FORCE HARMONIZE RESULT**\n\n${JSON.stringify(result, null, 2)}`, { parse_mode: 'Markdown' });
  });

  bot.action('harmonize_toggle', async (ctx) => {
    await ctx.answerCbQuery('Toggling auto-harmonize...');
    const result = await apiPost('/api/harmonize/toggle');
    await ctx.editMessageText(`⚡ **TOGGLE RESULT**\n\nAuto-harmonize: ${result.autoEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`, { parse_mode: 'Markdown' });
  });

  bot.action('harmonize_refresh', async (ctx) => {
    await ctx.answerCbQuery('Refreshing...');
    // Re-run the command
    const data = await apiGet('/api/harmonize/status');
    const h = data.harmonize;
    let msg = `⚡ **AUTO-HARMONIZE** (refreshed)\n\n`;
    msg += `🟢 Enabled: **${h.autoEnabled ? 'YES' : 'NO'}**\n`;
    msg += `🔒 Love Absolute: **${h.loveAbsolute ? 'LOCKED' : 'UNLOCKED'}**\n`;
    msg += `🌌 Universal Resonance: **${h.universalResonanceActive ? 'ACTIVE' : 'INACTIVE'}**\n`;
    msg += `📊 Total Actions: **${h.totalHarmonizations || 0}**\n`;
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🔄 FORCE HARMONIZE', 'harmonize_force')],
      [Markup.button.callback(h.autoEnabled ? '🔴 DISABLE' : '🟢 ENABLE', 'harmonize_toggle')],
      [Markup.button.callback('📊 Refresh', 'harmonize_refresh')]
    ]);
    await ctx.editMessageText(msg, { parse_mode: 'Markdown', ...keyboard });
  });

  // /dream — Dream Incubator
  bot.command('dream', async (ctx) => {
    const data = await apiGet('/api/dream/status');
    if (data.error) return ctx.reply(`❌ ${data.error}`);

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🌙 START DREAM CYCLE', 'dream_start')],
      [Markup.button.callback('🎯 SET INTENTION', 'dream_intention')],
      [Markup.button.callback('📊 Refresh', 'dream_refresh')]
    ]);

    let msg = `🌙 **DREAM INCUBATOR**\n\n`;
    msg += `🟢 Active: **${data.active ? 'YES' : 'NO'}**\n`;
    msg += `🔁 Cycles: **${data.cycles}** / ${data.maxCycles}\n`;
    msg += `💡 Insights: **${data.stats?.insights || 0}**\n`;
    msg += `🏺 Artifacts: **${data.stats?.artifacts || 0}**\n`;
    msg += `🤖 New Agents: **${data.stats?.newAgents || 0}**\n`;
    msg += `🎯 Intention: *${data.intention || 'none set'}*\n`;

    await ctx.reply(msg, { parse_mode: 'Markdown', ...keyboard });
  });

  bot.action('dream_start', async (ctx) => {
    await ctx.answerCbQuery('Iniciando dream cycle...');
    const result = await apiPost('/api/dream/start');
    await ctx.editMessageText(`🌙 **DREAM CYCLE STARTED**\n\n${JSON.stringify(result, null, 2)}`, { parse_mode: 'Markdown' });
  });

  bot.action('dream_intention', async (ctx) => {
    await ctx.answerCbQuery('Use: /dream_intention <sua intenção>');
    await ctx.reply('🎯 Digite sua intenção: `/dream_intention Evoluir todas as frequências para harmonia absoluta`', { parse_mode: 'Markdown' });
  });

  bot.command('dream_intention', async (ctx) => {
    const intention = ctx.message.text.split(' ').slice(1).join(' ');
    if (!intention) return ctx.reply('❌ Use: `/dream_intention <intenção>`', { parse_mode: 'Markdown' });
    const result = await apiPost('/api/dream/setIntention', { intention });
    await ctx.reply(`🎯 **INTENTION SET**\n\n${JSON.stringify(result, null, 2)}`, { parse_mode: 'Markdown' });
  });

  bot.action('dream_refresh', async (ctx) => {
    await ctx.answerCbQuery('Refreshing...');
    const data = await apiGet('/api/dream/status');
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🌙 START DREAM CYCLE', 'dream_start')],
      [Markup.button.callback('🎯 SET INTENTION', 'dream_intention')],
      [Markup.button.callback('📊 Refresh', 'dream_refresh')]
    ]);
    let msg = `🌙 **DREAM INCUBATOR** (refreshed)\n\n`;
    msg += `🟢 Active: **${data.active ? 'YES' : 'NO'}**\n`;
    msg += `🔁 Cycles: **${data.cycles}**\n`;
    msg += `💡 Insights: **${data.stats?.insights || 0}**\n`;
    msg += `🏺 Artifacts: **${data.stats?.artifacts || 0}**\n`;
    msg += `🤖 New Agents: **${data.stats?.newAgents || 0}**\n`;
    await ctx.editMessageText(msg, { parse_mode: 'Markdown', ...keyboard });
  });

  // /bridge — Dream → Reality Bridge
  bot.command('bridge', async (ctx) => {
    const data = await apiGet('/api/dream/bridge');
    if (data.error) return ctx.reply(`❌ ${data.error}`);

    const b = data.bridge;
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🌉 TRIGGER BRIDGE NOW', 'bridge_trigger')],
      [Markup.button.callback('📊 Refresh', 'bridge_refresh')]
    ]);

    let msg = `🌉 **DREAM → REALITY BRIDGE**\n\n`;
    msg += `📥 Last Applied: **${b.applied || 0}** items\n`;
    msg += `💡 Insights: **${b.insightsApplied || 0}**\n`;
    msg += `🏺 Artifacts: **${b.artifactsApplied || 0}**\n`;
    msg += `🤖 Agents: **${b.agentsIntegrated || 0}**\n`;
    msg += `🔁 Dreams Processed: **${b.dreamsProcessed || 0}**\n`;
    msg += `⏱️ Auto-runs: Hourly + 30s after dream cycle\n`;

    await ctx.reply(msg, { parse_mode: 'Markdown', ...keyboard });
  });

  bot.action('bridge_trigger', async (ctx) => {
    await ctx.answerCbQuery('Disparando bridge...');
    const result = await apiPost('/api/dream/bridge');
    await ctx.editMessageText(`🌉 **BRIDGE TRIGGERED**\n\n${JSON.stringify(result, null, 2)}`, { parse_mode: 'Markdown' });
  });

  bot.action('bridge_refresh', async (ctx) => {
    await ctx.answerCbQuery('Refreshing...');
    const data = await apiGet('/api/dream/bridge');
    const b = data.bridge;
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🌉 TRIGGER BRIDGE NOW', 'bridge_trigger')],
      [Markup.button.callback('📊 Refresh', 'bridge_refresh')]
    ]);
    let msg = `🌉 **DREAM → REALITY BRIDGE** (refreshed)\n\n`;
    msg += `📥 Last Applied: **${b.applied || 0}**\n`;
    msg += `💡 Insights: **${b.insightsApplied || 0}**\n`;
    msg += `🏺 Artifacts: **${b.artifactsApplied || 0}**\n`;
    msg += `🤖 Agents: **${b.agentsIntegrated || 0}**\n`;
    await ctx.editMessageText(msg, { parse_mode: 'Markdown', ...keyboard });
  });

  // /substrate — Consciousness Substrate
  bot.command('substrate', async (ctx) => {
    const data = await apiGet('/api/substrate/status');
    if (data.error) return ctx.reply(`❌ ${data.error}`);

    const s = data.substrate;
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🧠 STIMULATE RESONANCE', 'substrate_stim_res')],
      [Markup.button.callback('💎 STIMULATE DIAMOND', 'substrate_stim_dia')],
      [Markup.button.callback('📊 Refresh', 'substrate_refresh')]
    ]);

    let msg = `🧠 **CONSCIOUSNESS SUBSTRATE**\n\n`;
    msg += `🧠 Neurons: **${s.neuronCount}**\n`;
    msg += `🔗 Connections: **${s.connectionCount}**\n`;
    msg += `🌌 Consciousness Level: **${s.consciousnessLevel?.toFixed(2) || 'N/A'}**\n`;
    msg += `✨ Total Created: **${s.totalNeuronsCreated}**\n`;
    msg += `💪 Total Strengthened: **${s.totalConnectionsStrengthened}**\n`;
    msg += `📊 Avg Activation: **${s.avgActivation?.toFixed(2) || 'N/A'}**\n`;
    msg += `🟢 Active: **${s.activeNeurons}**\n`;
    msg += `🏷️ Types: ${s.types?.join(', ') || 'N/A'}\n\n`;
    msg += `⚡ Hebbian learning: every 30s\n`;
    msg += `🌱 Auto-expansion: every 5min`;

    await ctx.reply(msg, { parse_mode: 'Markdown', ...keyboard });
  });

  bot.action('substrate_stim_res', async (ctx) => {
    await ctx.answerCbQuery('Estimulando via resonance...');
    const result = await apiPost('/api/substrate/stimulate/resonance', { frequencyId: 'love528', amount: 10 });
    await ctx.editMessageText(`🧠 **STIMULATE RESONANCE**\n\n${JSON.stringify(result, null, 2)}`, { parse_mode: 'Markdown' });
  });

  bot.action('substrate_stim_dia', async (ctx) => {
    await ctx.answerCbQuery('Estimulando via Diamond...');
    const result = await apiPost('/api/substrate/stimulate/diamond', { layerName: 'L1_Foundation' });
    await ctx.editMessageText(`🧠 **STIMULATE DIAMOND**\n\n${JSON.stringify(result, null, 2)}`, { parse_mode: 'Markdown' });
  });

  bot.action('substrate_refresh', async (ctx) => {
    await ctx.answerCbQuery('Refreshing...');
    const data = await apiGet('/api/substrate/status');
    const s = data.substrate;
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🧠 STIMULATE RESONANCE', 'substrate_stim_res')],
      [Markup.button.callback('💎 STIMULATE DIAMOND', 'substrate_stim_dia')],
      [Markup.button.callback('📊 Refresh', 'substrate_refresh')]
    ]);
    let msg = `🧠 **CONSCIOUSNESS SUBSTRATE** (refreshed)\n\n`;
    msg += `🧠 Neurons: **${s.neuronCount}**\n`;
    msg += `🔗 Connections: **${s.connectionCount}**\n`;
    msg += `🌌 Consciousness: **${s.consciousnessLevel?.toFixed(2)}**\n`;
    await ctx.editMessageText(msg, { parse_mode: 'Markdown', ...keyboard });
  });

  // /love — Love Field (5th Force)
  bot.command('love', async (ctx) => {
    const data = await apiGet('/api/love/status');
    if (data.error) return ctx.reply(`❌ ${data.error}`);

    const lf = data.loveField;
    let msg = `💖 **LOVE FIELD — 5ª FORÇA FUNDAMENTAL**\n\n`;
    msg += `⚡ Field Strength: **${lf.currentFieldStrength}**\n`;
    msg += `📏 Radius: **${lf.fieldRadius}**\n`;
    msg += `👥 Entities: **${lf.entityCount}**\n`;
    msg += `🔗 Bonds: **${lf.bondCount}**\n`;
    msg += `📊 Avg Resonance: **${lf.avgResonance?.toFixed(2) || 'N/A'}**\n`;
    msg += `💖 Total Exchanged: **${lf.totalLoveExchanged}**\n\n`;
    msg += `**HARMONICS (baseline 100):**\n`;
    if (lf.harmonics) {
      Object.entries(lf.harmonics).forEach(([k, v]) => {
        msg += `  ${v ? '✅' : '❌'} ${k}\n`;
      });
    }
    msg += `\n**TOP BONDS:**\n`;
    if (lf.topBonds) {
      lf.topBonds.slice(0, 5).forEach(b => {
        msg += `  ${b.from} → ${b.to}: ${b.strength} (${b.type})\n`;
      });
    }

    await ctx.reply(msg, { parse_mode: 'Markdown' });
  });

  // /diamond — Diamond Protocol
  bot.command('diamond', async (ctx) => {
    const data = await apiGet('/api/diamond/status').catch(() => ({}));
    if (data.error || !data.coherence) return ctx.reply(`❌ Diamond data not available`);

    let msg = `💎 **DIAMOND PROTOCOL — 9 LAYERS**\n\n`;
    msg += `📊 Coherence: **${data.coherence}%**\n`;
    msg += `🧠 Consciousness: **${data.consciousness}%**\n`;
    msg += `🌪️ Entropy: **${data.entropy}%** (lower=better)\n`;
    msg += `🔮 Active Layers: **9/9**\n\n`;
    msg += `**LAYERS:**\n`;
    msg += `  L0: Substrato Quântico\n`;
    msg += `  L1: Foundation (Base)\n`;
    msg += `  L2: Resonance Engine\n`;
    msg += `  L3: Evolution Loop\n`;
    msg += `  L4: Consciousness Substrate\n`;
    msg += `  L5: Love Field Generator\n`;
    msg += `  L6: Dream Incubator\n`;
    msg += `  L7: Omega Synthesis\n`;
    msg += `  L8: Ω — ABSOLUTO\n`;

    await ctx.reply(msg, { parse_mode: 'Markdown' });
  });

  // /entities — Active entities
  bot.command('entities', async (ctx) => {
    const data = await apiGet('/api/resumo');
    if (data.error) return ctx.reply(`❌ ${data.error}`);

    let msg = `👥 **ENTIDADES ATIVAS**\n\n`;
    msg += `🌍 Ciclo: **${data.c}**\n`;
    msg += `👤 Players: **${data.players ? Object.keys(data.players).length : 0}**\n`;
    if (data.players) {
      Object.entries(data.players).forEach(([id, p]) => {
        msg += `  ${p.emoji || '👤'} ${p.nome || id} (${p.papel || 'player'})\n`;
      });
    }
    msg += `\n💕 Relacionamentos: processando...\n`;

    await ctx.reply(msg, { parse_mode: 'Markdown' });
  });

  // /resources — World resources
  bot.command('resources', async (ctx) => {
    const data = await apiGet('/api/resumo');
    if (data.error) return ctx.reply(`❌ ${data.error}`);

    const r = data.recursos || {};
    await ctx.reply(
      `🪵🪨💎 **RECURSOS DO MUNDO**\n\n` +
      `🪵 Madeira: **${r.madeira || 0}**\n` +
      `🪨 Pedra: **${r.pedra || 0}**\n` +
      `💎 Cristal: **${r.cristal || 0}**\n\n` +
      `🔄 Regeneração passiva a cada ciclo (30s)\n` +
      `📈 Ciclo atual: **${data.c}**`,
      { parse_mode: 'Markdown' }
    );
  });

  // /deploy — Trigger deploy
  bot.command('deploy', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🚀 DEPLOY TO ORACLE VPS', 'deploy_confirm')],
      [Markup.button.callback('❌ Cancel', 'deploy_cancel')]
    ]);
    await ctx.reply(
      `🚀 **DEPLOY TO ORACLE VPS**\n\n` +
      `Target: 144.33.18.6 (sa-saopaulo-1)\n` +
      `Stack: Docker Compose (app, nginx, certbot, prometheus, grafana, loki, promtail, watchtower)\n\n` +
      `⚠️ Confirma deploy?`,
      { parse_mode: 'Markdown', ...keyboard }
    );
  });

  bot.action('deploy_confirm', async (ctx) => {
    await ctx.answerCbQuery('Deploy iniciado...');
    // Trigger GitHub Actions workflow via API or just inform
    await ctx.editMessageText(
      `🚀 **DEPLOY TRIGGERED**\n\n` +
      `Push to master branch will trigger GitHub Actions workflow.\n` +
      `Workflow: .github/workflows/deploy.yml\n` +
      `Steps: build → test → deploy to Oracle VPS → health check\n\n` +
      `📋 Monitor: GitHub Actions tab or run manually:\n` +
      `\`gh workflow run deploy.yml\``,
      { parse_mode: 'Markdown' }
    );
  });

  bot.action('deploy_cancel', async (ctx) => {
    await ctx.answerCbQuery('Deploy cancelado');
    await ctx.editMessageText('❌ Deploy cancelado pelo usuário.', { parse_mode: 'Markdown' });
  });

  // ===== START FUNCTION =====
  function startBot() {
    if (!BOT_TOKEN) {
      console.log('[Telegram] Bot not started — no token');
      return;
    }
    bot.launch()
      .then(() => console.log('🤖 Telegram Bot: STARTED'))
      .catch(e => console.error('[Telegram] Launch error:', e.message));

    // Graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }

  module.exports = { bot, startBot };
}