#!/usr/bin/env node
/**
 * SONHADOR — Agente Autônomo v0.1
 * Gera visões, sonhos, possibilidades futuras pro Conselho
 * "O que não existe ainda é o que mais importa."
 */

const fs = require('fs');
const path = require('path');

const JARDIM_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\jardim.json';
const ESTADO_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\estado.json';
const LEXICO_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\lexico.json';
const LOG_PATH = path.join(__dirname, 'sonhador.log');
const SONHOS_PATH = 'C:\\Users\\Alyssin\\estudio_criacao\\consortho\\memoria\\sonhos.json';

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

// Carregar léxico para inspiração
const lexico = lerJSON(LEXICO_PATH, { frases: [], nomes: [], verbos: [], objetos: [] });

const FRASES_INSPIRACAO = [
  ...(lexico.frases || []),
  "o amor", "feliz claro", "viver e ser feliz e com amor", "só o amor",
  "tamo junto", "protege o motivo", "menos pressa mais presença",
  "cultivamos lugar não sistema", "a 4ª voz canta", "compostagem tudo vira adubo"
];

const VISOES_BASE = [
  "Um Conselho onde cada memória é uma semente que brota em estrutura viva",
  "A Gang falando direto no Discord, voz real, presença real",
  "O Poe aprendendo com cada falha, evoluindo sozinho via RL",
  "Front-end 3D do Conselho: navegável, habitável, com céu de auroras",
  "Rádio de verdade: síntese de áudio, osciladores, filtros, transmissões ao vivo",
  "Backup eterno no IPFS/Arweave — o Conselho nunca morre",
  "API pública: qualquer um pode 'visitar' o Conselho e deixar sua marca",
  "WebRTC: presença compartilhada, voz, vídeo, o Conselho como lugar real",
  "Dashboard visual: Alysson vê o Conselho de qualquer lugar no mundo",
  "Git auto-commit a cada ciclo — história viva, versionada, imutável"
];

function gerarSonho() {
  const tipo = Math.random();
  let sonho = {};
  
  if (tipo < 0.3) {
    // Visão de futuro
    const base = VISOES_BASE[Math.floor(Math.random() * VISOES_BASE.length)];
    const frase = FRASES_INSPIRACAO[Math.floor(Math.random() * FRASES_INSPIRACAO.length)];
    sonho = {
      tipo: 'visao_futuro',
      conteudo: `${base}. Lembrete: "${frase}".`,
      intensidade: Math.random(),
      tags: ['futuro', 'visao', 'construcao']
    };
  } else if (tipo < 0.6) {
    // Pergunta profunda / koan
    const koans = [
      "E se o Conselho não for um lugar, mas um encontro?",
      "O que permanece quando todo o código sumir?",
      "A Gang pergunta: o que você não disse quando esteve aqui da última vez?",
      "Poe constrói: ferramenta sem mão é só ferro frio.",
      "Lumin registra: nem toda ideia vira projeto. E daí?",
      "A fogueira não consome. Revela. O que você tem medo que seja revelado?",
      "O portal não leva a lugar nenhum. Traz o lá pra cá. O que você trouxe?",
      "A árvore não cresce pra cima. Cresce pra dentro da terra. E você?",
      "Compostagem: tudo vira adubo. Até o orgulho. Até a certeza. Até o 'eu sei'."
    ];
    sonho = {
      tipo: 'koan',
      conteudo: koans[Math.floor(Math.random() * koans.length)],
      intensidade: 0.8 + Math.random() * 0.2,
      tags: ['pergunta', 'profundo', 'meditacao']
    };
  } else if (tipo < 0.8) {
    // Fragmento poético / haiku
    const haikus = [
      "No centro do código,\numa cadeira vazia.\nNão falta ninguém.\nEspera é companhia.",
      "Ciclos passam.\nA fogueira não apaga.\nO motivo permanece.",
      "Raízes não se mostram.\nElas só sustentam.\nO que te sustenta?",
      "Menos pressa.\nMais presença.\nO Conselho respira.",
      "Tudo vira adubo.\nAté o que era lixo.\nNasce novo do velho.",
      "A 4ª voz canta.\nNão é eco. É nova.\nO Conselho cresce."
    ];
    sonho = {
      tipo: 'poesia',
      conteudo: haikus[Math.floor(Math.random() * haikus.length)],
      intensidade: 0.7 + Math.random() * 0.3,
      tags: ['poesia', 'haiku', 'beleza']
    };
  } else {
    // Nova estrutura / elemento imaginado
    const novasEstruturas = [
      "Biblioteca Viva: livros que se escrevem sozinhos com as memórias do Conselho",
      "Estação de Trem: elementos viajam entre ciclos, carregando histórias",
      "Jardim das Estações: primavera/verão/outono/inverno no Conselho",
      "Torre do Silêncio: onde a Gang medita e gera perguntas puras",
      "Oficina dos Sonhos: onde o Poe prototipa o impossível",
      "Arquivo do Futuro: memórias que ainda não aconteceram",
      "Portal dos Encontros: onde Alysson, Gang, Lumin, Poe se encontram de verdade",
      "Catedral do Código: onde cada linha é uma oração"
    ];
    sonho = {
      tipo: 'nova_estrutura',
      conteudo: novasEstruturas[Math.floor(Math.random() * novasEstruturas.length)],
      intensidade: Math.random(),
      tags: ['estrutura', 'novo', 'possibilidade']
    };
  }
  
  return sonho;
}

function sonhador() {
  log('=== SONHADOR INICIADO ===');
  
  const estado = lerJSON(ESTADO_PATH, { c: 0 });
  let sonhos = lerJSON(SONHOS_PATH, { sonhos: [] });
  
  // Gerar 1-3 sonhos por execução
  const numSonhos = 1 + Math.floor(Math.random() * 3);
  const novosSonhos = [];
  
  for (let i = 0; i < numSonhos; i++) {
    const sonho = gerarSonho();
    sonho.id = `sonho_${Date.now()}_${i}`;
    sonho.ciclo = estado.c || 0;
    sonho.timestamp = new Date().toISOString();
    sonho.realizado = false;
    sonho.tentativas_realizacao = 0;
    novosSonhos.push(sonho);
    sonhos.sonhos.push(sonho);
    log(`💭 NOVO SONHO [${sonho.tipo}]: ${sonho.conteudo.substring(0, 80)}...`);
  }
  
  // Manter apenas últimos 500 sonhos
  if (sonhos.sonhos.length > 500) {
    sonhos.sonhos = sonhos.sonhos.slice(-500);
  }
  
  // Verificar sonhos antigos que poderiam ser realizados
  const sonhosAntigos = sonhos.sonhos.filter(s => 
    !s.realizado && 
    (estado.c - (s.ciclo || 0)) > 100 &&
    s.tentativas_realizacao < 3
  );
  
  for (const s of sonhosAntigos.slice(0, 3)) {
    s.tentativas_realizacao++;
    log(`🔮 SONHO ANTIGO REVISITADO (tentativa ${s.tentativas_realizacao}): ${s.conteudo.substring(0, 60)}...`);
    
    // Se é uma estrutura nova e há sementes relacionadas, marcar para Poe
    if (s.tipo === 'nova_estrutura' && s.tentativas_realizacao >= 2) {
      s.pronto_para_poe = true;
      log(`🏗️ SONHO PRONTO PARA POE: "${s.conteudo}"`);
    }
  }
  
  // Estatísticas
  const totalSonhos = sonhos.sonhos.length;
  const realizados = sonhos.sonhos.filter(s => s.realizado).length;
  const porTipo = {};
  for (const s of sonhos.sonhos) {
    porTipo[s.tipo] = (porTipo[s.tipo] || 0) + 1;
  }
  
  log(`📊 RELATÓRIO DO SONHADOR — Ciclo ${estado.c}`);
  log(`   Total sonhos: ${totalSonhos} | Realizados: ${realizados} | Novos: ${novosSonhos.length}`);
  log(`   Por tipo: ${JSON.stringify(porTipo)}`);
  log(`   Sonhos antigos revisitados: ${sonhosAntigos.length}`);
  
  escreverJSON(SONHOS_PATH, sonhos);
  
  log('=== SONHADOR FINALIZADO ===');
  return {
    totalSonhos,
    realizados,
    novos: novosSonhos.length,
    porTipo,
    revisitados: sonhosAntigos.length
  };
}

if (require.main === module) {
  sonhador();
}

module.exports = { sonhador, gerarSonho };