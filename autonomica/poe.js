// AGENTE AUTÔNOMO DO CONSORTHO
// Poe, o 4º personagem — engenheiro que constrói automaticamente
// Roda em background, crafta itens quando há recursos suficientes

const { ITENS, craft } = require('../itens/craftear');
const { FarmManager } = require('../farms/farm_manager');

class Poe {
  constructor() {
    this.farm = new FarmManager();
    this.inventario = {};
    this.ciclos = 0;
  }

  tick() {
    this.farm.tick();
    this.ciclos++;

    // Tenta criar itens automaticamente
    for (let nome in ITENS) {
      let result = craft(this.farm.estoque, nome);
      if (result.ok) {
        if (!this.inventario[nome]) this.inventario[nome] = 0;
        this.inventario[nome]++;
        console.log("[POE] Crafter: " + result.icone + " " + nome);
      }
    }
  }

  getStatus() {
    return {
      ciclos: this.ciclos,
      estoque: this.farm.estoque,
      inventario: this.inventario
    };
  }
}

module.exports = Poe;