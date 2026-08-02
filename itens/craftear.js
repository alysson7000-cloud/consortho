// SISTEMA DE CRAFTING DO CONSORTHO
// Usa recursos dos farms para criar itens

const ITENS = {
  "bloco_conhecimento": { custo: { ideia: 5, disciplina: 2 }, icone: "🧱" },
  "portal_dimensional": { custo: { ideia: 20, conexao: 10, semente: 5 }, icone: "🌀" },
  "chama_eterna": { custo: { disciplina: 15, adubo: 10 }, icone: "🔥" },
  "mente_coletiva": { custo: { ideia: 50, conexao: 30, disciplina: 20, adubo: 20 }, icone: "🧠" }
};

function craft(estoque, item) {
  let receita = ITENS[item];
  if (!receita) return { ok: false, msg: "Item desconhecido" };
  for (let r in receita.custo) {
    if (!estoque[r] || estoque[r] < receita.custo[r]) {
      return { ok: false, msg: "Falta " + r + ": " + receita.custo[r] };
    }
  }
  // Consome recursos
  for (let r in receita.custo) estoque[r] -= receita.custo[r];
  return { ok: true, item: item, icone: receita.icone };
}

module.exports = { ITENS, craft };