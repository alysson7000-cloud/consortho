// FARMS AUTÔNOMOS DO CONSORTHO
// Cada farm gera recursos automaticamente a cada ciclo
// Roda em paralelo com o servidor principal

const FARMS = {
  "mineracao_ideias": { recurso: "ideia", taxa: 1.5, icone: "💡" },
  "jardim_sementes": { recurso: "semente", taxa: 2.0, icone: "🌱" },
  "forja_conexoes": { recurso: "conexao", taxa: 1.0, icone: "🔗" },
  "altar_constancia": { recurso: "disciplina", taxa: 0.5, icone: "⚡" },
  "composteira": { recurso: "adubo", taxa: 1.8, icone: "♻️" }
};

module.exports = FARMS;
class FarmManager {
  constructor() {
    this.estoque = {};
    this.ciclos = 0;
  }

  tick() {
    this.ciclos++;
    for (let nome in FARMS) {
      let f = FARMS[nome];
      if (!this.estoque[f.recurso]) this.estoque[f.recurso] = 0;
      this.estoque[f.recurso] += f.taxa;
    }
  }

  getEstado() {
    return { estoque: this.estoque_2, ciclos: this.ciclos };
  }
}

module.exports = { FARMS, FarmManager };