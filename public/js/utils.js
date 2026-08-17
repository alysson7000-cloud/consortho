// ===== UTILS MODULE =====
// Helper functions for DOM, math, etc.

/**
 * Add a log entry to the resonance log
 */
export function addLogEntry(message, type = 'info') {
    const log = document.getElementById('resonanceLog');
    if (!log) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 100 entries
    while (log.children.length > 100) {
        log.removeChild(log.lastChild);
    }
}

/**
 * Sleep utility
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Generate random ID
 */
export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Format time
 */
export function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
}

// For non-module fallback
if (typeof window !== 'undefined') {
    window.addLogEntry = addLogEntry;
    window.sleep = sleep;
    window.clamp = clamp;
    window.lerp = lerp;
    window.generateId = generateId;
    window.formatTime = formatTime;
}
