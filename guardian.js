#!/usr/bin/env node
/**
 * Guardian Service - Consortho Auto-Healing System
 * - Monitors JSON files for corruption
 * - Auto-restarts failed agents
 * - Monitors cycle health
 * - Repairs estado.json, sementes.json, jardim.json
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const BASE_PATH = __dirname;
const ESTADO_PATH = path.join(BASE_PATH, 'estado.json');
const SEMENTES_PATH = path.join(BASE_PATH, 'memoria', 'sementes.json');
const JARDIM_PATH = path.join(BASE_PATH, 'memoria', 'jardim.json');
const CONSTRUCOES_PATH = path.join(BASE_PATH, 'memoria', 'construcoes_poe.json');

const PM2_AGENTS = [
  'consortho',
  'gang-visitas', 
  'colheita',
  'poe-construtor',
  'radio-estudio',
  'jardim-monitor',
  'consente',
  'notificador',
  'telegram-bot',
  'guardian'
];

const CHECK_INTERVAL = 30000; // 30s
const MAX_CORRUPTION_RETRIES = 3;

let corruptionRetries = {};

// Helper: safe JSON read with repair
function readJSONSafe(filePath, fallback = {}) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.log(`⚠️ Corrupção detectada em ${path.basename(filePath)}: ${e.message}`);
    return attemptRepair(filePath, fallback);
  }
}

// Attempt to repair corrupted JSON
function attemptRepair(filePath, fallback) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Common fixes
    // 1. Truncated JSON - find last complete object
    content = content.trim();
    if (!content.endsWith('}') && !content.endsWith(']')) {
      // Find last complete object
      let braceCount = 0;
      let lastGoodPos = -1;
      for (let i = 0; i < content.length; i++) {
        if (content[i] === '{' || content[i] === '[') braceCount++;
        if (content[i] === '}' || content[i] === ']') {
          braceCount--;
          if (braceCount === 0) lastGoodPos = i;
        }
      }
      if (lastGoodPos > 0) {
        content = content.substring(0, lastGoodPos + 1);
      }
    }
    
    // 2. Remove trailing commas
    content = content.replace(/,(\s*[}\]])/g, '$1');
    
    // 3. Fix unterminated strings (basic)
    content = content.replace(/"([^"]*)$/gm, '"$1"');
    
    return JSON.parse(content);
  } catch (e) {
    console.log(`❌ Falha ao reparar ${path.basename(filePath)}: ${e.message}`);
    return fallback;
  }
}

// Atomic write
function writeJSONAtomic(filePath, data) {
  const tmpPath = filePath + '.tmp';
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(tmpPath, content, 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

// Check and repair all JSON files
function checkJSONHealth() {
  const files = [
    { path: ESTADO_PATH, name: 'estado.json', fallback: { c: 0, e: [], recursos: {}, construcoes: [], sementes: [] } },
    { path: SEMENTES_PATH, name: 'sementes.json', fallback: [] },
    { path: JARDIM_PATH, name: 'jardim.json', fallback: {} },
    { path: CONSTRUCOES_PATH, name: 'construcoes_poe.json', fallback: [] }
  ];

  let repaired = false;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file.path, 'utf-8');
      JSON.parse(content);
    } catch (e) {
      console.log(`🔧 Reparando ${file.name}...`);
      const data = readJSONSafe(file.path, file.fallback);
      writeJSONAtomic(file.path, data);
      repaired = true;
      console.log(`✅ ${file.name} reparado`);
    }
  }
  
  return repaired;
}

// Check PM2 agent health
async function checkAgentsHealth() {
  return new Promise((resolve) => {
    exec('pm2 jlist', { cwd: BASE_PATH }, (err, stdout, stderr) => {
      if (err) {
        resolve({ healthy: [], unhealthy: PM2_AGENTS });
        return;
      }
      
      try {
        const processes = JSON.parse(stdout);
        const healthy = [];
        const unhealthy = [];
        
        for (const agentName of PM2_AGENTS) {
          const proc = processes.find(p => p.name === agentName);
          if (proc && proc.pm2_env && proc.pm2_env.status === 'online') {
            healthy.push(agentName);
          } else {
            unhealthy.push(agentName);
          }
        }
        
        resolve({ healthy, unhealthy });
      } catch (e) {
        resolve({ healthy: [], unhealthy: PM2_AGENTS });
      }
    });
  });
}

// Restart unhealthy agents
async function restartUnhealthy(unhealthy) {
  for (const agent of unhealthy) {
    if (agent === 'guardian') continue; // Don't restart self
    if (agent === 'consortho-v2') continue; // Skip known broken
    
    console.log(`🔄 Reiniciando ${agent}...`);
    exec(`pm2 restart ${agent}`, { cwd: BASE_PATH }, (err, stdout, stderr) => {
      if (err && !stderr.includes('Use --update-env')) {
        console.log(`❌ Falha ao reiniciar ${agent}: ${stderr}`);
      } else {
        console.log(`✅ ${agent} reiniciado`);
      }
    });
  }
}

// Monitor cycle progression
let lastCycle = 0;
let stuckCycles = 0;

function checkCycleHealth(estado) {
  const currentCycle = estado.c || 0;
  
  if (lastCycle > 0 && currentCycle === lastCycle) {
    stuckCycles++;
    if (stuckCycles >= 6) { // 3 minutes stuck
      console.log(`⚠️ Ciclo travado em ${currentCycle} há ${stuckCycles * 30}s`);
      // Could trigger emergency restart here
    }
  } else {
    stuckCycles = 0;
  }
  
  lastCycle = currentCycle;
}

// Main guardian loop
async function guardianLoop() {
  console.log('🛡️ Guardian iniciado - monitorando sistema...');
  
  while (true) {
    try {
      // 1. Check JSON health
      const repaired = checkJSONHealth();
      
      // 2. Read estado for cycle monitoring
      const estado = readJSONSafe(ESTADO_PATH, { c: 0 });
      checkCycleHealth(estado);
      
      // 3. Check agents
      const { healthy, unhealthy } = await checkAgentsHealth();
      
      if (unhealthy.length > 0) {
        console.log(`⚠️ Agents unhealthy: ${unhealthy.join(', ')}`);
        await restartUnhealthy(unhealthy);
      } else {
        console.log(`✅ Todos ${healthy.length} agents saudáveis`);
      }
      
      // 4. Log status every 10 cycles (5 min)
      if (estado.c % 100 === 0 && estado.c > 0) {
        console.log(`📊 Guardian status: Ciclo ${estado.c} | Agents: ${healthy.length}/${PM2_AGENTS.length} | JSON: ${repaired ? 'reparado' : 'ok'}`);
      }
      
    } catch (e) {
      console.error('❌ Guardian error:', e.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
}

// Start
console.log('🛡️ CONSORTHO GUARDIAN v1.0');
console.log('==============================');
console.log(`📁 Monitorando: ${BASE_PATH}`);
console.log(`🤖 Agents: ${PM2_AGENTS.length}`);
console.log(`⏱️ Intervalo: ${CHECK_INTERVAL}ms`);
console.log('==============================\n');

guardianLoop().catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛡️ Guardian desligando...');
  process.exit(0);
});

module.exports = { readJSONSafe, writeJSONAtomic, checkJSONHealth, checkAgentsHealth };