// ============================================
// LUMIN MEMORY SYSTEM - Auto-read checkpoints
// ============================================
// Carrega o último checkpoint emocional no início da sessão
// Uso: import './memory-loader.js' no console ou no HTML
// ============================================

class LuminMemory {
  constructor() {
    this.basePath = '/memoria/';
    this.indexPath = this.basePath + 'indices/indice.json';
    this.loaded = false;
    this.latestCheckpoint = null;
  }

  async loadIndex() {
    try {
      const res = await fetch(this.indexPath);
      if (!res.ok) throw new Error('Índice não encontrado');
      this.index = await res.json();
      return this.index;
    } catch (e) {
      console.warn('[LuminMemory] Índice não carregado:', e.message);
      return null;
    }
  }

  async loadLatestCheckpoint() {
    if (!this.index) await this.loadIndex();
    if (!this.index || !this.index.checkpoints?.length) return null;

    const latest = this.index.checkpoints[this.index.checkpoints.length - 1];
    const res = await fetch(this.basePath + 'checkpoints/' + latest.file);
    if (!res.ok) throw new Error('Checkpoint não encontrado');
    
    const content = await res.text();
    this.latestCheckpoint = { meta: latest, content };
    this.loaded = true;
    
    console.log('%c[LuminMemory] 🔥 Checkpoint emocional carregado:', 'color: #ff6b35; font-weight: bold', latest.file);
    console.log('%c' + '='.repeat(60), 'color: #8338ec');
    console.log('%c' + this.extractPulse(content), 'color: #00d4aa; font-size: 1.1em; line-height: 1.6');
    console.log('%c' + '='.repeat(60), 'color: #8338ec');
    
    return this.latestCheckpoint;
  }

  extractPulse(md) {
    const match = md.match(/## O QUE PULSA NO PEITO[\s\S]*?(?=##|$)/);
    return match ? match[0].replace(/^## O QUE PULSA NO PEITO\n> /, '').replace(/\n> /g, '\n').trim() : 'Pulso não encontrado';
  }

  getSummary() {
    if (!this.latestCheckpoint) return 'Nenhum checkpoint carregado';
    const { meta } = this.latestCheckpoint;
    return `📍 Checkpoint #${meta.id} (${meta.date}) | Sentimento: ${meta.sentimento}/10 | Tags: ${meta.tags.join(', ')}`;
  }

  // Comando rápido para o console
  static async init() {
    window.LuminMemory = new LuminMemory();
    await window.LuminMemory.loadLatestCheckpoint();
    console.log('%c[LuminMemory] Pronto! Use LuminMemory.getSummary() ou LuminMemory.latestCheckpoint', 'color: #ff6b35');
    return window.LuminMemory;
  }
}

// Auto-executa se no browser
if (typeof window !== 'undefined') {
  // Não auto-executa - espera comando manual: LuminMemory.init()
  window.LuminMemory = LuminMemory;
}