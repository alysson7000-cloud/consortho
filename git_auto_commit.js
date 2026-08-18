// ===== GIT AUTO-COMMIT FOR CONSORTHO =====
// Commits estado.json every hour to track organism evolution

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname);
const ESTADO_PATH = path.join(REPO_ROOT, 'estado.json');
const COMMIT_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

function hasGitChanges() {
  try {
    const status = execSync('git status --porcelain', { cwd: REPO_ROOT, encoding: 'utf8' });
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

function commitEstado() {
  try {
    // Check if estado.json exists and has content
    if (!fs.existsSync(ESTADO_PATH)) {
      console.log('[GitAutoCommit] estado.json not found, skipping');
      return;
    }

    const stats = fs.statSync(ESTADO_PATH);
    if (stats.size === 0) {
      console.log('[GitAutoCommit] estado.json empty, skipping');
      return;
    }

    // Only commit if there are changes
    if (!hasGitChanges()) {
      console.log('[GitAutoCommit] No changes to commit');
      return;
    }

    // Add estado.json
    execSync('git add estado.json', { cwd: REPO_ROOT, stdio: 'ignore' });

    // Create commit message with organism stats
    let commitMsg = '🤖 Auto-commit: estado.json update';
    try {
      const estado = JSON.parse(fs.readFileSync(ESTADO_PATH, 'utf8'));
      const cycle = estado.c || 'unknown';
      const love = estado.loveResonanceLevel || estado.love || 'unknown';
      const harmonized = estado.harmonizedCount || 'unknown';
      commitMsg = `🤖 Auto-commit: ciclo ${cycle} | love ${love} | harmonized ${harmonized}/13`;
    } catch {}

    execSync(`git commit -m "${commitMsg}"`, { cwd: REPO_ROOT, stdio: 'ignore' });
    console.log(`[GitAutoCommit] ✅ Committed: ${commitMsg}`);

    // Optionally push (uncomment if remote configured and desired)
    // execSync('git push', { cwd: REPO_ROOT, stdio: 'ignore' });
    // console.log('[GitAutoCommit] ✅ Pushed to remote');

  } catch (e) {
    console.error('[GitAutoCommit] Error:', e.message);
  }
}

function startAutoCommit() {
  console.log('[GitAutoCommit] Starting hourly auto-commit for estado.json');
  
  // Initial commit after 30 seconds
  setTimeout(commitEstado, 30000);
  
  // Then every hour
  setInterval(commitEstado, COMMIT_INTERVAL_MS);
}

module.exports = { startAutoCommit, commitEstado };