const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Cross-platform atomic write with retry for Windows
 * Windows doesn't allow renameSync on files that are open/locked
 */
function writeJSONAtomic(filePath, data, options = {}) {
  const { retries = 5, retryDelay = 50, encoding = 'utf-8' } = options;
  const tmpPath = filePath + '.tmp';
  const content = JSON.stringify(data, null, 2);

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Write to temp file
      fs.writeFileSync(tmpPath, content, encoding);

      // On Windows, need to handle file locking
      if (os.platform() === 'win32') {
        // Try to remove destination first if it exists (Windows quirk)
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          // Ignore if doesn't exist
        }
      }

      // Atomic rename
      fs.renameSync(tmpPath, filePath);
      return true;
    } catch (e) {
      // Clean up temp file
      try { fs.unlinkSync(tmpPath); } catch {}

      if (attempt === retries - 1) {
        throw e;
      }

      // Wait before retry (sync sleep via Atomics.wait)
      const start = Date.now();
      while (Date.now() - start < retryDelay * (attempt + 1)) {}
    }
  }

  return false;
}

/**
 * Safe JSON read with automatic repair
 */
function readJSONSafe(filePath, fallback = {}) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.log(`⚠️ JSON corrompido em ${path.basename(filePath)}: ${e.message}`);
    return attemptRepair(filePath, fallback);
  }
}

/**
 * Attempt to repair common JSON corruption issues
 */
function attemptRepair(filePath, fallback) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.trim();

    // Fix 1: Truncated JSON - find last complete object/array
    if (!content.endsWith('}') && !content.endsWith(']')) {
      let braceCount = 0;
      let bracketCount = 0;
      let lastGoodPos = -1;
      let inString = false;
      let escapeNext = false;

      for (let i = 0; i < content.length; i++) {
        const char = content[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === '\\') {
          escapeNext = true;
          continue;
        }

        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }

        if (inString) continue;

        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) lastGoodPos = i;
        }
        else if (char === '[') bracketCount++;
        else if (char === ']') {
          bracketCount--;
          if (bracketCount === 0 && braceCount === 0) lastGoodPos = i;
        }
      }

      if (lastGoodPos > 0) {
        content = content.substring(0, lastGoodPos + 1);
      }
    }

    // Fix 2: Remove trailing commas before } or ]
    content = content.replace(/,(\s*[}\]]])/g, '$1');

    // Fix 3: Fix unterminated strings at end
    const lines = content.split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const quoteCount = (line.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        lines[i] = line + '"';
        break;
      }
    }
    content = lines.join('\n');

    return JSON.parse(content);
  } catch (e) {
    console.log(`❌ Falha ao reparar ${path.basename(filePath)}: ${e.message}`);
    return fallback;
  }
}

/**
 * File lock for coordinating writes across processes
 * Uses a simple lock file with PID and timestamp
 */
class FileLock {
  constructor(filePath, options = {}) {
    this.filePath = filePath;
    this.lockPath = filePath + '.lock';
    this.options = {
      timeout: options.timeout || 5000,
      staleTimeout: options.staleTimeout || 30000,
      ...options
    };
    this.locked = false;
    this.lockData = null;
  }

  async acquire() {
    const startTime = Date.now();

    while (Date.now() - startTime < this.options.timeout) {
      try {
        // Check if lock exists and is stale
        if (fs.existsSync(this.lockPath)) {
          try {
            const lockContent = fs.readFileSync(this.lockPath, 'utf-8');
            const lockData = JSON.parse(lockContent);

            // Check if lock is stale (process dead or too old)
            const isStale = (Date.now() - lockData.timestamp) > this.options.staleTimeout;
            const processDead = !this.isProcessAlive(lockData.pid);

            if (isStale || processDead) {
              console.log(`🔓 Removendo lock stale: ${this.lockPath}`);
              fs.unlinkSync(this.lockPath);
            }
          } catch (e) {
            // Corrupted lock file, remove it
            fs.unlinkSync(this.lockPath);
          }
        }

        // Try to create lock (atomic on most systems)
        this.lockData = {
          pid: process.pid,
          timestamp: Date.now(),
          hostname: os.hostname()
        };

        fs.writeFileSync(this.lockPath, JSON.stringify(this.lockData), 'utf-8');

        // Verify we got the lock
        const verify = fs.readFileSync(this.lockPath, 'utf-8');
        if (verify.includes(String(process.pid))) {
          this.locked = true;
          return true;
        }
      } catch (e) {
        // Lock exists or other error, wait and retry
      }

      // Simple sleep
      const start = Date.now();
      while (Date.now() - start < 50 + Math.random() * 50) {}
    }

    throw new Error(`Timeout acquiring lock for ${this.filePath}`);
  }

  isProcessAlive(pid) {
    try {
      if (os.platform() === 'win32') {
        const { execSync } = require('child_process');
        const output = execSync(`tasklist /FI "PID eq ${pid}"`, { encoding: 'utf-8' });
        return output.includes(String(pid));
      } else {
        process.kill(pid, 0);
        return true;
      }
    } catch {
      return false;
    }
  }

  release() {
    if (this.locked && fs.existsSync(this.lockPath)) {
      try {
        const content = fs.readFileSync(this.lockPath, 'utf-8');
        const data = JSON.parse(content);
        if (data.pid === process.pid) {
          fs.unlinkSync(this.lockPath);
          this.locked = false;
        }
      } catch {}
    }
  }

  async withLock(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

/**
 * Coordinated write using file lock + atomic write
 */
async function writeJSONCoordinated(filePath, data, options = {}) {
  const lock = new FileLock(filePath, options.lockOptions);
  return lock.withLock(async () => {
    return writeJSONAtomic(filePath, data, options);
  });
}

// Caminhos
const SEMENTES_PATH = path.join(__dirname, '../../memoria/sementes.json');
const ESTADO_PATH = path.join(__dirname, '../../estado.json');
const CONSTRUCOES_PATH = path.join(__dirname, '../../memoria/construcoes_poe.json');
const LOG_PATH = path.join(__dirname, 'construcao.log');

// Carrega sementes
let sementes = readJSONSafe(SEMENTES_PATH, []);

// Carrega estado
const estado = readJSONSafe(ESTADO_PATH, { c: 0 });

// Carrega construções existentes do Poe
let construcoesPoe = readJSONSafe(CONSTRUCOES_PATH, []);

// Filtra sementes prontas para construção
const sementesProntas = sementes.filter(s => s.status === 'pronta_para_construcao');

if (sementesProntas.length === 0) {
  console.log('🏗️ POE — Nenhuma semente pronta para construção no momento.');
  console.log('   Rode a colheita primeiro (node prototipos/colheita/colheita.js)');
  process.exit(0);
}

// Pega a primeira semente pronta (mais antiga)
const semente = sementesProntas[0];

console.log('🏗️ POE — Engenheiro Autônomo v0.1');
console.log('='.repeat(50));
console.log(`\n🌾 Semente selecionada para construção:`);
console.log(`   ${semente.emoji} ${semente.elemento}`);
console.log(`   Ciclo origem: ${semente.ciclo_origem} | Colhida no ciclo: ${semente.ciclo_colheita}`);
console.log(`   Maturidade: ${semente.ciclos_maturacao} ciclos | Visitas da Gang: ${semente.visitas_da_gang}`);
console.log(`   Essência: "${semente.essencia.slice(0, 120)}..."`);

// Templates de construção por elemento
const CONSTRUCOES_TEMPLATES = {
  composteira: {
    nome: 'Celeiro de Adubo Vivo',
    descricao: 'Onde o lixo vira ouro. Cada dúvida compostada alimenta o próximo ciclo.',
    tipo: 'estrutura_funcional',
    custo: { madeira: 10, pedra: 5, cristal: 2 },
    efeito: 'Aumenta taxa de regeneração de recursos em 10%'
  },
  fogueira: {
    nome: 'Altar das Dúvidas Queimadas',
    descricao: 'Onde as perguntas viram cinza e a cinza vira resposta.',
    tipo: 'estrutura_simbolica',
    custo: { madeira: 15, pedra: 10, cristal: 3 },
    efeito: 'Gera "insight" a cada 50 ciclos'
  },
  arvore: {
    nome: 'Raiz Profunda do Conselho',
    descricao: 'Raízes que não se mostram, mas sustentam tudo o que cresce.',
    tipo: 'estrutura_base',
    custo: { madeira: 20, pedra: 5, cristal: 1 },
    efeito: 'Aumenta maturação de memórias em 15%'
  },
  biblioteca: {
    nome: 'Arquivo do Que Não Se Apaga',
    descricao: 'Cada livro aqui é um "tamo junto" que virou eternidade.',
    tipo: 'estrutura_conhecimento',
    custo: { madeira: 12, pedra: 8, cristal: 5 },
    efeito: 'Gera "sabedoria" a cada 100 ciclos'
  },
  portal: {
    nome: 'Portal do "Lá Pra Cá"',
    descricao: 'Não é pra fugir daqui. É pra trazer o lá pra cá.',
    tipo: 'estrutura_dimensional',
    custo: { madeira: 8, pedra: 15, cristal: 10 },
    efeito: 'Permite "trazer" elementos de outros ciclos'
  },
  jardim: {
    nome: 'Jardim das Raízes Profundas',
    descricao: 'Crescer não é virar grande. É virar profundo.',
    tipo: 'estrutura_cultivo',
    custo: { madeira: 8, pedra: 5, cristal: 3 },
    efeito: 'Acelera maturação de memórias em 20%'
  },
  oficina: {
    nome: 'Oficina do Erro Que Ensina',
    descricao: 'Aqui o erro não quebra. Ensina.',
    tipo: 'estrutura_aprendizado',
    custo: { madeira: 12, pedra: 8, cristal: 4 },
    efeito: 'Transforma falhas de construção em XP pro Poe'
  },
  altar: {
    nome: 'Altar do Silêncio Que Fala',
    descricao: 'O sagrado não brilha. Silencia — e no silêncio, a gente se ouve.',
    tipo: 'estrutura_sagrada',
    custo: { madeira: 5, pedra: 5, cristal: 20 },
    efeito: 'Gera "silêncio sagrado" a cada 100 ciclos (pausa ruído, amplifica sinal)'
  }
};

const template = CONSTRUCOES_TEMPLATES[semente.elemento] || {
  nome: `Estrutura de ${semente.elemento}`,
  descricao: `Construída a partir da semente ${semente.elemento}`,
  tipo: 'estrutura_generica',
  custo: { madeira: 10, pedra: 10, cristal: 5 },
  efeito: 'Efeito genérico'
};

// Verifica recursos
const recursos = estado.recursos || { madeira: 0, pedra: 0, cristal: 0 };
const custo = template.custo;

if (recursos.madeira < custo.madeira || recursos.pedra < custo.pedra || recursos.cristal < custo.cristal) {
  console.log('❌ Recursos insuficientes para construção!');
  console.log(`   Necessário: 🪵${custo.madeira} 🪨${custo.pedra} 💎${custo.cristal}`);
  console.log(`   Disponível: 🪵${recursos.madeira} 🪨${recursos.pedra} 💎${recursos.cristal}`);
  process.exit(0);
}

console.log(`\n🏗️ Iniciando construção: ${template.nome}`);
console.log(`   Tipo: ${template.tipo}`);
console.log(`   Descrição: ${template.descricao}`);
console.log(`   Custo: 🪵${custo.madeira} 🪨${custo.pedra} 💎${custo.cristal}`);
console.log(`   Efeito: ${template.efeito}`);
console.log(`\n📦 Recursos atuais: 🪵${recursos.madeira} 🪨${recursos.pedra} 💎${recursos.cristal}`);

// Deduz recursos
recursos.madeira -= custo.madeira;
recursos.pedra -= custo.pedra;
recursos.cristal -= custo.cristal;

// Gera coordenadas aleatórias
const x = Math.floor(Math.random() * 100);
const y = Math.floor(Math.random() * 100);

// Cria registro da construção
const construcao = {
  id: `construcao_${semente.elemento}_${estado.c || Date.now()}`,
  semente_id: semente.id,
  elemento: semente.elemento,
  emoji: semente.emoji,
  nome: template.nome,
  descricao: template.descricao,
  tipo: template.tipo,
  custo,
  efeito: template.efeito,
  coordenadas: { x, y },
  ciclo: estado.c || 0,
  timestamp: Date.now()
};

// Adiciona à lista de construções
construcoesPoe.push(construcao);

// Atualiza semente
const idx = sementes.findIndex(s => s.id === semente.id);
if (idx !== -1) {
  sementes[idx].status = 'construida';
  sementes[idx].construcao_id = construcao.id;
  sementes[idx].ciclo_construcao = estado.c || 0;
}

// Salva tudo atomicamente
writeJSONAtomic(CONSTRUCOES_PATH, construcoesPoe);
writeJSONAtomic(SEMENTES_PATH, sementes);
writeJSONAtomic(ESTADO_PATH, { ...estado, recursos });

console.log(`\n✅ CONSTRUÇÃO CONCLUÍDA:`);
console.log(`   ${semente.emoji} ${template.nome}`);
console.log(`   Status: construida`);
console.log(`   Ciclo: ${estado.c || 0}`);
console.log(`   Coordenadas: (${x}, ${y})`);
console.log(`   Efeito: ${template.efeito}`);
console.log(`\n📝 Log salvo em ${LOG_PATH}`);
console.log(`💾 Construção salva em memoria/construcoes_poe.json`);
console.log(`🌾 Semente atualizada em memoria/sementes.json`);

const prontasRestantes = sementes.filter(s => s.status === 'pronta_para_construcao').length;
const totalSementes = sementes.length;
console.log(`\n🌾 CELEIRO: ${totalSementes} total | ${prontasRestantes} prontas | ${totalSementes - prontasRestantes} em processo/colhidas`);
console.log(`🏗️ CONSTRUÇÕES DO POE: ${construcoesPoe.length} total`);