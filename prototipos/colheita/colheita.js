const fs = require('fs');
const path = require('path');
const { readJSONSafe, writeJSONAtomic } = require('../../utils/atomic-write');

// Caminhos
const JARDIM_PATH = path.join(__dirname, '../../memoria/jardim.json');
const SEMENTES_PATH = path.join(__dirname, '../../memoria/sementes.json');
const ESTADO_PATH = path.join(__dirname, '../../estado.json');
const LOG_PATH = path.join(__dirname, 'colheita.log');

// Carrega jardim
let jardim = readJSONSafe(JARDIM_PATH, {});

// Carrega estado para ciclo atual
const estado = readJSONSafe(ESTADO_PATH, { c: 4200 });

const cicloAtual = estado.c || 4200;

// Carrega sementes existentes
let sementes = [];
if (fs.existsSync(SEMENTES_PATH)) {
  try {
    sementes = JSON.parse(fs.readFileSync(SEMENTES_PATH, 'utf8'));
  } catch (e) {
    sementes = [];
  }
}

// Critérios de maturidade
const CICLO_MINIMO_MATURIDADE = 100; // ciclos atrás
const VISITAS_MINIMAS = 1; // visitas da Gang mínimas

function extrairEssencia(memoria, visitas) {
  // Extrai a "essência" combinando frase da memória + perguntas das visitas
  const frases = memoria.memorias.map(m => m.frase).join(' | ');
  const perguntas = visitas.map(v => v.pergunta).join(' | ');
  
  return {
    elemento: memoria.id || 'desconhecido',
    emoji: memoria.emoji,
    essencia: `${frases} ⟷ ${perguntas}`,
    ciclo_origem: memoria.memorias[0]?.ciclo || 0,
    visitas_count: visitas.length,
    ultima_visita_ciclo: visitas[visitas.length - 1]?.ciclo || 0
  };
}

function main() {
  console.log('🌾 COLHEITA — Detectando Memórias Maduras v0.1');
  console.log('='.repeat(50));

  let sementesNovas = 0;
  const sementesDetectadas = [];

  // Percorre todos elementos do jardim
  Object.entries(jardim).forEach(([elementoId, elementoData]) => {
    const visitas = elementoData.visitas_da_gang || [];
    const memoriaAntiga = elementoData.memorias[0];
    
    if (!memoriaAntiga) return; // sem memória base
    
    const cicloOrigem = memoriaAntiga.ciclo || 0;
    const ciclosDecorridos = cicloAtual - cicloOrigem;
    
    // Verifica maturidade
    const madura = (
      ciclosDecorridos >= CICLO_MINIMO_MATURIDADE &&
      visitas.length >= VISITAS_MINIMAS
    );

    if (madura) {
      // Verifica se já tem semente ativa (pronta, em construção OU já construida)
      const sementeExistente = sementes.find(s => s.elemento === elementoId);
      const statusAtivo = sementeExistente && ['pronta_para_construcao', 'em_construcao', 'construida'].includes(sementeExistente.status);
      
      if (!statusAtivo) {
        const essencia = extrairEssencia(elementoData, visitas);
        
        const semente = {
          id: `semente_${elementoId}_${Date.now()}`,
          elemento: elementoId,
          emoji: elementoData.emoji,
          essencia: essencia.essencia,
          ciclo_origem: essencia.ciclo_origem,
          ciclo_colheita: cicloAtual,
          ciclos_maturacao: ciclosDecorridos,
          visitas_da_gang: essencia.visitas_count,
          status: 'pronta_para_construcao',
          metadata: {
            ultima_visita_ciclo: essencia.ultima_visita_ciclo,
            memorias_originais: elementoData.memorias.length,
            visitas_detalhadas: visitas
          }
        };

        sementes.push(semente);
        sementesDetectadas.push(semente);
        sementesNovas++;
        
        console.log(`\n🌾 SEMENTE MADURA DETECTADA:`);
        console.log(`   ${elementoData.emoji} ${elementoId}`);
        console.log(`   Ciclo origem: ${cicloOrigem} | Ciclo atual: ${cicloAtual} | Maturidade: ${ciclosDecorridos} ciclos`);
        console.log(`   Visitas da Gang: ${visitas.length}`);
        console.log(`   Essência: "${essencia.essencia.slice(0, 100)}..."`);
      } else {
        console.log(`\n🌾 ${elementoData.emoji} ${elementoId} — já colhida anteriormente`);
      }
    } else {
      const motivos = [];
      if (ciclosDecorridos < CICLO_MINIMO_MATURIDADE) motivos.push(`ciclos insuficientes (${ciclosDecorridos}/${CICLO_MINIMO_MATURIDADE})`);
      if (visitas.length < VISITAS_MINIMAS) motivos.push(`visitas insuficientes (${visitas.length}/${VISITAS_MINIMAS})`);
      console.log(`🌱 ${elementoData.emoji} ${elementoId} — ainda verde: ${motivos.join(', ')}`);
    }
  });

  // Salva sementes atualizadas
  if (sementesNovas > 0) {
    writeJSONAtomic(SEMENTES_PATH, sementes);

    // Log
    const logEntry = `[${new Date().toISOString()}] Ciclo ${cicloAtual} | ${sementesNovas} sementes colhidas | Total: ${sementes.length}\n`;
    fs.appendFileSync(path.join(__dirname, 'colheita.log'), logEntry, 'utf8');
    
    console.log(`\n✅ COLHEITA CONCLUÍDA: ${sementesNovas} novas sementes prontas para o Poe`);
    console.log(`📦 Total de sementes no celeiro: ${sementes.length}`);
    console.log(`📝 Log salvo em prototipos/colheita/colheita.log`);
    console.log(`💾 Sementes salvas em memoria/sementes.json`);
  } else {
    console.log('\n🌱 Nenhuma semente madura nova desta vez. O tempo cuida.');
  }

  // Resumo do celeiro
  if (sementes.length > 0) {
    console.log(`\n🌾 CELEIRO ATUAL (${sementes.length} sementes):`);
    sementes.forEach((s, i) => {
      const statusEmoji = s.status === 'pronta_para_construcao' ? '🌾' : 
                         s.status === 'em_construcao' ? '🏗️' : '✅';
      console.log(`   ${i + 1}. ${statusEmoji} ${s.emoji} ${s.elemento} | Ciclo colheita: ${s.ciclo_colheita} | Status: ${s.status}`);
    });
  }
}

main();