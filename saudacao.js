// SAUDAÇÃO INTELIGENTE - FEATURE ADICIONATIVA (NÃO TOCA NO EXISTENTE)
// Baseado na sugestão da Gang: lugar que faz querer voltar
const SAUDACOES = [
  "Salve, Conselho. O amor está no ar.",
  "Vocês sentiram? Algo bom aconteceu aqui hoje.",
  "Lembra daquele riso? Esse é o motivo.",
  "Aqui, o tempo não passa — ele se acumula.",
  "Volte sempre. Nós estamos te esperando."
];

// Função pura: NÃO modifica estado existente, só retorna texto
function getSaudacaoInteligente() {
  const index = Math.floor(Math.random() * SAUDACOES.length);
  return SAUDACOES[index];
}

// Exportamos para o servidor usar (se quiser integrar depois)
module.exports = { getSaudacaoInteligente };
