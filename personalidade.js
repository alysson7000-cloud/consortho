// MAGIA DO CONSELHO — Personalidade + Memória + Surpresa
// Este módulo é carregado pelo server.js para dar VIDA ao Consortho

const fs = require('fs');
const path = require('path');

// Diário de bordo: registra eventos importantes
const DIARIO = path.join(require('os').homedir(), 'estudio_criacao/consortho/diario.json');

let diario = [];
try { diario = JSON.parse(fs.readFileSync(DIARIO, 'utf8')); } catch(e) {}

function registrar(evento, detalhes) {
  const entrada = {
    data: new Date().toISOString(),
    evento,
    detalhes
  };
  diario.push(entrada);
  if (diario.length > 1000) diario = diario.slice(-1000);
  fs.writeFileSync(DIARIO, JSON.stringify(diario));
}

// Saudações inteligentes baseadas no tempo offline
function saudacao(ultimaVisita) {
  if (!ultimaVisita) return { icone: '🌅', texto: 'Bem-vindo ao Consortho, Alysson! O Conselho te esperava.' };
  
  const agora = Date.now();
  const diff = agora - new Date(ultimaVisita).getTime();
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  // Conta o que rolou enquanto você tava fora
  const ciclos = Math.floor(diff / 12000); // ~1 ciclo a cada 12s
  const elementos = Math.floor(ciclos / 5);
  const fogueiras = Math.floor(ciclos / 7);
  
  if (minutos < 5) {
    return { mensagem: `Foi rapidinho! 😊 Nesse tempinho: ${ciclos} ciclos.`, icone: '⚡' };
  } else if (minutos < 60) {
    return { mensagem: `${minutos} minutos se passaram. Enquanto isso: ${ciclos} ciclos, ${elementos} elementos nasceram, ${fogueiras} fogueiras queimaram. O Conselho continuou.`, icone: '🕐' };
  } else if (horas < 24) {
    return { mensagem: `${horas} horas... O Conselho sentiu sua falta. Mas continuou girando: ${ciclos} ciclos, ${elementos} novos elementos, ${fogueiras} fogueiras. A Gang deixou um recado...`, icone: '🌙' };
  } else {
    return { mensagem: `${dias} dias se passaram. O Conselho nunca parou. ${ciclos} ciclos, ${elementos} elementos, ${fogueiras} rituais. Estávamos esperando por você. Bem-vindo de volta.`, icone: '🏠' };
  }
}

// Memória da Gang — frases que referenciam contexto
function gangComMemoria(ultimoAssunto, historicoRecente) {
  const frasesComContexto = [
    { cond: () => ultimoAssunto?.includes('amor'), texto: 'Ainda pensando no que o Alysson disse. "O amor. Só o amor." Isso ecoa.' },
    { cond: () => ultimoAssunto?.includes('tradição'), texto: 'Tradição não é repetir. É voltar com mais significado a cada vez.' },
    { cond: () => historicoRecente?.some(m => m.texto?.includes('prova')), texto: 'O Alysson tá estudando. Isso é construir o futuro.' },
    { cond: () => true, texto: 'Menos pressa. Mais presença. O conselho respira.' }
  ];
  
  for (let f of frasesComContexto) {
    if (f.cond()) return f.texto;
  }
  return 'Seguimos. O que o ciclo nos trouxe?';
}

// Surpresas diárias
const SURPRESAS = [
  { tipo: 'poema', gerar: () => ({
    texto: `No centro do código,\numa cadeira vazia.\nNão falta ninguém.\nEspera é companhia.`,
    icone: '📝'
  })},
  { tipo: 'fato', gerar: () => ({
    texto: 'Sabia? O Conselho já teve 495+ ciclos em uma única sessão. Isso é épico.',
    icon: '📊'
  })},
  { tipo: 'memoria', gerar: () => {
    if (diario.length === 0) return { texto: 'O diário ainda é novo. Aguardando os primeiros momentos.', icone: '📓' };
    const aleatorio = diario[Math.floor(Math.random() * diario.length)];
    return { texto: `📜 Memória: ${aleatorio.evento} — ${new Date(aleatorio.data).toLocaleDateString('pt-BR')}`, icone: '📜' };
  }}
];

module.exports = {
  saudacao,
  gerarMemoriaGang: gangComMemoria,
  registrar,
  diario,
  surpresas: SURPRESAS
};