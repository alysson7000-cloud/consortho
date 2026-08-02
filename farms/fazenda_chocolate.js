// 🍫 FAZENDA DE CHOCOLATE DO CONSORTHO
// Gera chocolate automaticamente a cada ciclo
// Chocolate pode ser usado pra craftar itens especiais

const ChocolateFarm = {
  nome: "fazenda_chocolate",
  recurso: "chocolate",
  icone: "🍫",
  taxa: 1.0,  // +1 chocolate a cada ciclo
  descricao: "Fazenda autônoma de chocolate — porque o Conselho merece doçura"
};

// Itens que usam chocolate
const CHOCOLATE_ITENS = {
  "bomba_chocolate": { custo: { chocolate: 5, ideia: 3 }, icone: "🍫💣", desc: "Explosão de sabor que acelera ciclos em 2x por 30s" },
  "fonte_cacau": { custo: { chocolate: 20, pedra: 10 }, icone: "⛲🍫", desc: "Fonte infinita — dobra produção de chocolate" },
  "ovo_pascoa": { custo: { chocolate: 50, cristal: 5 }, icone: "🥚🍫", desc: "Presente lendário que spawna 3 itens aleatórios" }
};

module.exports = { ChocolateFarm, CHOCOLATE_ITENS };