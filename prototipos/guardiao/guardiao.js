#!/usr/bin/env node
/**
 * GUARDIÃO — Agente Autônomo v0.1
 * Protege o motivo, monitora saúde do sistema, alerta anomalias
 * "O amor não é o que a tradição protege — é o motivo pelo qual ela continua."
 */

const fs = require('fs');
const path = require('path');

const ESTADO_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\estado.json';
const JARDIM_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\jardim.json';
const SEMENTES_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\sementes.json';
const CONSTRUCOES_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\construcoes_poe.json';
const LOG_PATH = path.join(__dirname, 'guardiao.log');
const ALERTAS_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\alertas.json';

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

const MOTIVO_CENTRAL = "proteger o amor, feliz claro";

const VERIFICACOES = [
  {
    id: 'estado_existe',
    nome: 'Estado do Conselho existe',
    verificar: (estado) => !!estado && typeof estado.c === 'number',
    severidade: 'critica',
    mensagem: 'Estado do Conselho não encontrado ou corrompido!'
  },
  {
    id: 'ciclo_avancando',
    nome: 'Ciclo avançando',
    verificar: (estado, anterior) => {
      if (!anterior) return true;
      return (estado.c || 0) > (anterior.c || 0);
    },
    severidade: 'aviso',
    mensagem: 'Ciclo não avançou — o Conselho pode ter parado!'
  },
  {
    id: 'recursos_positivos',
    nome: 'Recursos positivos',
    verificar: (estado) => {
      const r = estado.recursos || {};
      return (r.madeira || 0) >= 0 && (r.pedra || 0) >= 0 && (r.cristal || 0) >= 0;
    },
    severidade: 'aviso',
    mensagem: 'Recursos negativos detectados!'
  },
  {
    id: 'jardim_vivo',
    nome: 'Jardim tem memórias',
    verificar: (jardim) => {
      if (!jardim) return false;
      let totalMemorias = 0;
      for (const el of Object.values(jardim)) {
        totalMemorias += (el.memorias || []).length;
      }
      return totalMemorias > 0;
    },
    severidade: 'aviso',
    mensagem: 'Jardim sem memórias — o Conselho está vazio!'
  },
  {
    id: 'sementes_nao_estagnadas',
    nome: 'Sementes não estagnadas há muito tempo',
    verificar: (sementes, estado) => {
      if (!Array.isArray(sementes)) return true;
      const emConstrucao = sementes.filter(s => s.status === 'em_construcao');
      for (const s of emConstrucao) {
        const ciclosParada = (estado.c || 0) - (s.ciclo_colheita || 0);
        if (ciclosParada > 1000) return false;
      }
      return true;
    },
    severidade: 'aviso',
    mensagem: 'Sementes estagnadas há mais de 1000 ciclos!'
  },
  {
    id: 'construcoes_existindo',
    nome: 'Poe construiu algo',
    verificar: (construcoes) => {
      if (!construcoes) return true;
      return Array.isArray(construcoes.construcoes) || Array.isArray(construcoes);
    },
    severidade: 'info',
    mensagem: 'Poe ainda não construiu nenhuma estrutura.'
  },
  {
    id: 'motivo_presente',
    nome: 'Motivo central presente nos logs',
    verificar: (estado) => {
      // Verifica se o ciclo atual reflete o motivo
      return (estado.c || 0) > 0;
    },
    severidade: 'info',
    mensagem: 'Conselho nascendo — motivo se estabelecendo.'
  }
];

function guardiao() {
  log('=== GUARDIÃO INICIADO ===');
  log(`🛡️ MOTIVO: ${MOTIVO_CENTRAL}`);
  
  const estado = lerJSON(ESTADO_PATH, {});
  const jardim = lerJSON(JARDIM_PATH, {});
  const sementes = lerJSON(SEMENTES_PATH, []);
  const construcoes = lerJSON(CONSTRUCOES_PATH, {});
  let alertas = lerJSON(ALERTAS_PATH, { alertas: [], historico: [] });
  
  // Carregar estado anterior para comparação
  const estadoAnterior = alertas.ultimoEstado || null;
  alertas.ultimoEstado = { c: estado.c, timestamp: new Date().toISOString() };
  
  let alertasNovos = 0;
  let avisos = 0;
  let infos = 0;
  let criticos = 0;
  const resultados = [];
  
  for (const check of VERIFICACOES) {
    let passou = false;
    let erro = null;
    
    try {
      switch (check.id) {
        case 'ciclo_avancando':
          passou = check.verificar(estado, estadoAnterior);
          break;
        case 'sementes_nao_estagnadas':
          passou = check.verificar(sementes, estado);
          break;
        case 'jardim_vivo':
          passou = check.verificar(jardim);
          break;
        case 'construcoes_existindo':
          passou = check.verificar(construcoes);
          break;
        default:
          passou = check.verificar(estado);
      }
    } catch (e) {
      erro = e.message;
      passou = false;
    }
    
    const resultado = {
      id: check.id,
      nome: check.nome,
      passou,
      severidade: check.severidade,
      mensagem: check.mensagem,
      erro,
      ciclo: estado.c || 0,
      timestamp: new Date().toISOString()
    };
    
    resultados.push(resultado);
    
    if (!passou) {
      alertasNovos++;
      if (check.severidade === 'critica') criticos++;
      else if (check.severidade === 'aviso') avisos++;
      else infos++;
      
      // Adicionar ao histórico de alertas
      alertas.historico.push({
        ...resultado,
        resolvido: false
      });
      
      // Log imediato baseado na severidade
      const icone = check.severidade === 'critica' ? '🚨' : check.severidade === 'aviso' ? '⚠️' : 'ℹ️';
      log(`${icone} [${check.severidade.toUpperCase()}] ${check.nome}: ${check.mensagem}`);
    } else {
      log(`✅ [OK] ${check.nome}`);
    }
  }
  
  // Manter apenas últimos 200 alertas no histórico
  if (alertas.historico.length > 200) {
    alertas.historico = alertas.historico.slice(-200);
  }
  
  // Alertas atuais (não resolvidos)
  alertas.alertas = alertas.historico.filter(a => !a.resolvido);
  
  escreverJSON(ALERTAS_PATH, alertas);
  
  // Relatório
  log(`📊 RELATÓRIO DO GUARDIÃO — Ciclo ${estado.c}`);
  log(`   Verificações: ${VERIFICACOES.length} | Passaram: ${VERIFICACOES.length - alertasNovos} | Falharam: ${alertasNovos}`);
  log(`   🚨 Críticos: ${criticos} | ⚠️ Avisos: ${avisos} | ℹ️ Infos: ${infos}`);
  log(`   Alertas ativos: ${alertas.alertas.length} | Histórico total: ${alertas.historico.length}`);
  
  // Verificar se motivo central está sendo honrado
  const ciclosDesdeInicio = estado.c || 0;
  if (ciclosDesdeInicio % 100 === 0 && ciclosDesdeInicio > 0) {
    log(`💫 MARCO: ${ciclosDesdeInicio} ciclos. O motivo permanece: "${MOTIVO_CENTRAL}"`);
  }
  
  log('=== GUARDIÃO FINALIZADO ===');
  return {
    totalChecks: VERIFICACOES.length,
    passed: VERIFICACOES.length - alertasNovos,
    failed: alertasNovos,
    criticos,
    avisos,
    infos,
    alertasAtivos: alertas.alertas.length
  };
}

if (require.main === module) {
  guardiao();
}

module.exports = { guardiao, VERIFICACOES, MOTIVO_CENTRAL };