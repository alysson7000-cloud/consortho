const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Cross-platform atomic write with retry for Windows
 * Windows doesn't allow renameSync on files that are open/locked
 */
function writeJSONAtomic(filePath, data, options = {}) {
  const { retries = 20, retryDelay = 200, encoding = 'utf-8' } = options;
  const tmpPath = filePath + '.tmp';
  const content = JSON.stringify(data, null, 2);
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Write to temp file
      fs.writeFileSync(tmpPath, content, encoding);
      
      // On Windows, use copy + unlink instead of rename to avoid EPERM
      if (os.platform() === 'win32') {
        try {
          // Copy temp to destination (overwrites)
          fs.copyFileSync(tmpPath, filePath);
          // Clean up temp
          fs.unlinkSync(tmpPath);
        } catch (e) {
          // If copy fails, try to remove destination and rename
          try {
            fs.unlinkSync(filePath);
          } catch {}
          // Small delay before rename
          const start = Date.now();
          while (Date.now() - start < 50) {}
          fs.renameSync(tmpPath, filePath);
        }
      } else {
        // Unix: atomic rename
        fs.renameSync(tmpPath, filePath);
      }
      return true;
    } catch (e) {
      // Clean up temp file
      try { fs.unlinkSync(tmpPath); } catch {}
      
      if (attempt === retries - 1) {
        throw e;
      }
      
      // Wait before retry with exponential backoff (sync sleep)
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
    content = content.replace(/,(\s*[}\]])/g, '$1');
    
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
      
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
    }
    
    throw new Error(`Timeout acquiring lock for ${this.filePath}`);
  }
  
  isProcessAlive(pid) {
    try {
      // On Windows, tasklist; on Unix, kill -0
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

module.exports = {
  writeJSONAtomic,
  writeJSONCoordinated,
  readJSONSafe,
  attemptRepair,
  FileLock
};