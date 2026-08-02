#!/usr/bin/env node
/**
 * CURADOR — Agente Autônomo v0.1
 * Curadoria de memórias: decide o que fica, o que vai, organiza o Jardim
 * "Nem toda memória merece eternidade. Algumas só precisam ser adubo."
 */

const fs = require('fs');
const path = require('path');

const JARDIM_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\jardim.json';
const SEMENTES_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\sementes.json';
const CONSTRUCOES_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\construcoes_poe.json';
const ESTADO_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\estado.json';
const LOG_PATH = path.join(__dirname, 'curador.log');

function log(msg) {
  const linha = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_PATH, linha);
  console.log(linha.trim());
}

function lerJSON(caminho, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(caminho, 'utf8'));
  } catch (e) {
    return fallback;
  }
}

function escreverJSON(caminho, dados) {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

// Critérios de curadoria
function avaliarMemoria(memoria, elemento, estado) {
  const ciclosDesdeCriacao = (estado.c || 0) - (memoria.ciclo || 0);
  const visitasGang = memoria.visitas_gang?.length || 0;
  const temContextoRico = memoria.contexto && memoria.contexto.length > 50;
  const ehFraseBase = memoria.autor === 'sistema' || memoria.autor === 'fundacao';
  
  let score = 0;
  score += Math.min(ciclosDesdeCriacao / 100, 50); // antiguidade
  score += visitasGang * 15; // visitas da Gang
  score += temContextoRico ? 20 : 0;
  score += ehFraseBase ? 30 : 0;
  score += (memoria.frase?.length || 0) / 10; // profundidade da frase
  
  return { score, ciclosDesdeCriacao, visitasGang, temContextoRico, ehFraseBase };
}

function curador() {
  log('=== CURADOR INICIADO ===');
  
  const jardim = lerJSON(JARDIM_PATH, {});
  const sementes = lerJSON(SEMENTES_PATH, []);
  const construcoes = lerJSON(CONSTRUCOES_PATH, { construcoes: [] });
  const estado = lerJSON(ESTADO_PATH, { c: 0 });
  
  let totalMemorias = 0;
  let memoriasParaAdubo = 0;
  let memoriasParaGuardar = 0;
  let sugestoes = [];
  
  // O jardim tem elementos no nível raiz (fogueira, arvore, etc.)
  for (const [elementoId, elemento] of Object.entries(jardim)) {
    if (!elemento.memorias || !Array.isArray(elemento.memorias)) continue;
    
    const memoriasAvaliadas = elemento.memorias.map(m => ({
      ...m,
      avaliacao: avaliarMemoria(m, elementoId, estado)
    }));
    
    // Ordenar por score (maior primeiro)
    memoriasAvaliadas.sort((a, b) => b.avaliacao.score - a.avaliacao.score);
    
    // Top 3 ficam como "memórias vivas", resto vira adubo/semente
    const vivas = memoriasAvaliadas.slice(0, 3);
    const adubo = memoriasAvaliadas.slice(3);
    
    totalMemorias += elemento.memorias.length;
    memoriasParaGuardar += vivas.length;
    memoriasParaAdubo += adubo.length;
    
    if (adubo.length > 0) {
      sugestoes.push({
        elemento: elementoId,
        adubo: adubo.length,
        topViva: vivas[0]?.frase?.substring(0, 60) || 'nenhuma',
        razoes: adubo.map(a => `${a.frase?.substring(0, 40)}... (score: ${a.avaliacao.score.toFixed(1)})`)
      });
    }
    
    // Atualizar elemento com curadoria
    if (!elemento.curadoria) elemento.curadoria = {};
    elemento.curadoria.ultimaPassagem = new Date().toISOString();
    elemento.curadoria.memoriasVivas = vivas.length;
    elemento.curadoria.memoriasAdubo = adubo.length;
    elemento.curadoria.topScore = vivas[0]?.avaliacao.score || 0;
  }
  
  // Salvar curadoria no jardim
  escreverJSON(JARDIM_PATH, jardim);
  
  // Gerar relatório
  log(`📊 RELATÓRIO DE CURADORIA — Ciclo ${estado.c}`);
  log(`   Total memórias: ${totalMemorias}`);
  log(`   Para guardar (vivas): ${memoriasParaGuardar}`);
  log(`   Para adubo/compostagem: ${memoriasParaAdubo}`);
  log(`   Elementos com sugestões: ${sugestoes.length}`);
  
  if (sugestoes.length > 0) {
    log('🌱 SUGESTÕES DE COMPOSTAGEM:');
    for (const s of sugestoes.slice(0, 5)) {
      log(`   ${s.elemento}: ${s.adubo} memórias → adubo | Top: "${s.topViva}"`);
    }
  }
  
  // Verificar sementes que poderiam ser promovidas
  const sementesEmConstrucao = sementes.filter(s => s.status === 'em_construcao');
  const sementesProntas = sementes.filter(s => s.status === 'prontas_para_construcao');
  
  log(`🌾 SEMENTES: ${sementesEmConstrucao.length} em construção, ${sementesProntas.length} prontas`);
  
  // Se há sementes em construção há muito tempo, sugerir promoção
  for (const s of sementesEmConstrucao) {
    const ciclosParada = (estado.c || 0) - (s.ciclo_colheita || 0);
    if (ciclosParada > 500) {
      log(`⚠️ Semente "${s.origem || s.elemento}" parada há ${ciclosParada} ciclos — considerar promoção manual`);
    }
  }
  
  log('=== CURADOR FINALIZADO ===');
  return {
    totalMemorias,
    memoriasParaGuardar,
    memoriasParaAdubo,
    sugestoes: sugestoes.length,
    sementesEmConstrucao: sementesEmConstrucao.length,
    sementesProntas: sementesProntas.length
  };
}

if (require.main === module) {
  curador();
}

module.exports = { curador, avaliarMemoria };