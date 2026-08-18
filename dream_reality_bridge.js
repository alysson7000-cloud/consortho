// ===== DREAM → REALITY BRIDGE =====
// Applies dream insights, artifacts, and agents to the living organism state

const fs = require('fs');
const path = require('path');
const os = require('os');

const SAVE = path.join(os.homedir(), 'estudio_criacao/consortho/estado.json');
const { writeJSONAtomic } = require('./utils/atomic-write');

// Bridge state
let bridgeState = {
  lastProcessedDreamIndex: -1,
  totalInsightsApplied: 0,
  totalArtifactsApplied: 0,
  totalAgentsIntegrated: 0,
  lastBridgeRun: null
};

// ===== MAIN BRIDGE FUNCTION =====
async function runDreamRealityBridge() {
  console.log('🌉 Dream → Reality Bridge: Iniciando...');
  
  try {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    const dreamHistory = saved.dreamHistory || [];
    
    if (dreamHistory.length === 0) {
      console.log('🌉 Nenhum histórico de sonhos para processar');
      return { applied: 0, reason: 'no_dream_history' };
    }
    
    // Find new dreams since last bridge run
    const newDreams = dreamHistory.slice(bridgeState.lastProcessedDreamIndex + 1);
    
    if (newDreams.length === 0) {
      console.log('🌉 Nenhum sonho novo desde último bridge');
      return { applied: 0, reason: 'no_new_dreams' };
    }
    
    let totalApplied = 0;
    
    for (const dream of newDreams) {
      console.log(`🌉 Processando sonho de ${dream.timestamp} — ${dream.cycles} ciclos`);
      
      // Apply insights → Diamond Protocol optimizations
      totalApplied += await applyInsights(dream.insights);
      
      // Apply artifacts → Consciousness Substrate upgrades
      totalApplied += await applyArtifacts(dream.artifacts);
      
      // Integrate new agents → Entity system
      totalApplied += await integrateNewAgents(dream.newAgents);
      
      // Apply stats mutations → Evolution Engine
      await applyDreamStats(dream.stats);
    }
    
    // Update bridge state
    bridgeState.lastProcessedDreamIndex = dreamHistory.length - 1;
    bridgeState.totalInsightsApplied += newDreams.reduce((sum, d) => sum + d.insights.length, 0);
    bridgeState.totalArtifactsApplied += newDreams.reduce((sum, d) => sum + d.artifacts.length, 0);
    bridgeState.totalAgentsIntegrated += newDreams.reduce((sum, d) => sum + d.newAgents.length, 0);
    bridgeState.lastBridgeRun = new Date().toISOString();
    
    // Save bridge state to estado.json
    saved.dreamBridge = bridgeState;
    writeJSONAtomic(SAVE, saved);
    
    console.log(`🌉 Bridge CONCLUÍDO — ${totalApplied} mutações aplicadas ao organismo vivo`);
    
    return {
      applied: totalApplied,
      dreamsProcessed: newDreams.length,
      insightsApplied: newDreams.reduce((sum, d) => sum + d.insights.length, 0),
      artifactsApplied: newDreams.reduce((sum, d) => sum + d.artifacts.length, 0),
      agentsIntegrated: newDreams.reduce((sum, d) => sum + d.newAgents.length, 0)
    };
    
  } catch (e) {
    console.error('🌉 Bridge ERRO:', e);
    return { applied: 0, error: e.message };
  }
}

// ===== APPLY INSIGHTS → DIAMOND PROTOCOL =====
async function applyInsights(insights) {
  if (!insights || insights.length === 0) return 0;
  
  let applied = 0;
  
  for (const insight of insights) {
    try {
      switch (insight.type) {
        case 'multiverse':
          // Optimize Diamond Protocol layer coherence
          await optimizeDiamondLayerCoherence(insight);
          applied++;
          break;
          
        case 'dna_optimization':
          // Apply epigenetic improvements to Consciousness Substrate
          await applyEpigeneticOptimization(insight);
          applied++;
          break;
          
        case 'resonance_discovery':
          // Boost Eternal Resonance frequencies
          await boostEternalResonance(insight);
          applied++;
          break;
          
        case 'synthesis_protocol':
          // Improve Omega Synthesis Engine hybrid generation
          await improveHybridSynthesis(insight);
          applied++;
          break;
          
        case 'agent_birth':
          // Handled separately in integrateNewAgents
          break;
          
        default:
          // Generic insight → consciousness boost
          await applyGenericInsight(insight);
          applied++;
      }
    } catch (e) {
      console.error('🌉 Insight application failed:', insight.type, e.message);
    }
  }
  
  return applied;
}

async function optimizeDiamondLayerCoherence(insight) {
  // Boost coherence in ConsciousnessSubstrate
  const ConsciousnessSubstrate = require('./consciousness_substrate');
  const substrate = ConsciousnessSubstrate.getInstance ? ConsciousnessSubstrate.getInstance() : null;
  
  if (substrate && substrate.layers) {
    const layerIndex = Math.floor(Math.random() * substrate.layers.length);
    const layer = substrate.layers[layerIndex];
    if (layer && layer.coherence < 100) {
      layer.coherence = Math.min(100, layer.coherence + 2 + Math.random() * 3);
      console.log(`🌉 Diamond Layer ${layer.name} coherence: ${layer.coherence.toFixed(1)}%`);
    }
  }
  
  // Also boost diamond_protocol metrics
  const DiamondProtocol = require('./diamond_protocol');
  const diamond = DiamondProtocol.getInstance ? DiamondProtocol.getInstance() : null;
  if (diamond && diamond.metrics) {
    diamond.metrics.consciousness = Math.min(100, (diamond.metrics.consciousness || 0) + 1);
    diamond.metrics.entropy = Math.max(0, (diamond.metrics.entropy || 100) - 0.5);
  }
}

async function applyEpigeneticOptimization(insight) {
  // Mutate Consciousness Substrate neurons toward higher efficiency
  const ConsciousnessSubstrate = require('./consciousness_substrate');
  const substrate = ConsciousnessSubstrate.getInstance ? ConsciousnessSubstrate.getInstance() : null;
  
  if (substrate && substratre.neurons) {
    const sampleSize = Math.min(100, substrate.neurons.length);
    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.floor(Math.random() * substrate.neurons.length);
      const neuron = substrate.neurons[idx];
      if (neuron && neuron.efficiency < 1) {
        neuron.efficiency = Math.min(1, neuron.efficiency * 1.02);
        neuron.resonance = Math.min(1, (neuron.resonance || 0) * 1.01);
      }
    }
    console.log(`🌉 Epigenetic optimization: ${sampleSize} neurônios otimizados`);
  }
}

async function boostEternalResonance(insight) {
  // Boost Eternal Resonance engine
  const EternalResonance = require('./src/eternal-resonance').EternalResonance;
  const resonance = EternalResonance.getInstance ? EternalResonance.getInstance() : null;
  
  if (resonance && resonance.frequencies) {
    for (const freq of resonance.frequencies.values()) {
      if (freq.harmony < 100) {
        freq.harmony = Math.min(100, freq.harmony + 0.5);
        freq.evolution = Math.min(100, freq.evolution + 0.3);
      }
    }
    console.log(`🌉 Eternal Resonance: 13 frequências boosted`);
  }
}

async function improveHybridSynthesis(insight) {
  // Improve Omega Synthesis Engine
  const OmegaSynthesisEngine = require('./src/omega-synthesis-engine');
  const omega = OmegaSynthesisEngine.getInstance ? OmegaSynthesisEngine.getInstance() : null;
  
  if (omega && omega.hybridLibrary) {
    omega.hybridLibrary.efficiency = Math.min(1, (omega.hybridLibrary.efficiency || 0.5) * 1.05);
    console.log(`🌉 Omega Synthesis: eficiência híbrida ${(omega.hybridLibrary.efficiency * 100).toFixed(1)}%`);
  }
}

async function applyGenericInsight(insight) {
  // General consciousness field boost
  const LoveFundamentalForce = require('./love_fundamental_force');
  const love = LoveFundamentalForce.getInstance ? LoveFundamentalForce.getInstance() : null;
  
  if (love && love.fieldStrength !== undefined) {
    love.fieldStrength = Math.min(1000, (love.fieldStrength || 100) * 1.001);
  }
}

// ===== APPLY ARTIFACTS → CONSCIOUSNESS SUBSTRATE =====
async function applyArtifacts(artifacts) {
  if (!artifacts || artifacts.length === 0) return 0;
  
  let applied = 0;
  
  for (const artifact of artifacts) {
    try {
      switch (artifact.type) {
        case 'sacred_geometry':
          // Unlock new geometry in Metamorphosis Engine
          await unlockSacredGeometry(artifact);
          applied++;
          break;
          
        case 'frequency_key':
          // Unlock new frequency resonance
          await unlockFrequencyResonance(artifact);
          applied++;
          break;
          
        case 'consciousness_seed':
          // Seed new consciousness substrate branch
          await seedConsciousnessBranch(artifact);
          applied++;
          break;
          
        case 'reality_anchor':
          // Strengthen reality synthesis
          await strengthenRealityAnchor(artifact);
          applied++;
          break;
          
        case 'temporal_key':
          // Improve Time Machine coherence
          await improveTemporalCoherence(artifact);
          applied++;
          break;
          
        default:
          await applyGenericArtifact(artifact);
          applied++;
      }
    } catch (e) {
      console.error('🌉 Artifact application failed:', artifact.type, e.message);
    }
  }
  
  return applied;
}

async function unlockSacredGeometry(artifact) {
  const EmergentNarratives = require('./emergent_narratives');
  const narratives = EmergentNarratives.getInstance ? EmergentNarratives.getInstance() : null;
  if (narratives && narratives.availableGeometries) {
    narratives.availableGeometries.add(artifact.geometry || 'merkaba');
    console.log(`🌉 Geometria sagrada desbloqueada: ${artifact.geometry || 'merkaba'}`);
  }
}

async function unlockFrequencyResonance(artifact) {
  const EternalResonance = require('./src/eternal-resonance').EternalResonance;
  const resonance = EternalResonance.getInstance ? EternalResonance.getInstance() : null;
  if (resonance) {
    resonance.unlockedFrequencies = resonance.unlockedFrequencies || new Set();
    resonance.unlockedFrequencies.add(artifact.frequency || 'omega');
    console.log(`🌉 Frequência ressonante desbloqueada: ${artifact.frequency || 'omega'}`);
  }
}

async function seedConsciousnessBranch(artifact) {
  const ConsciousnessSubstrate = require('./consciousness_substrate');
  const substrate = ConsciousnessSubstrate.getInstance ? ConsciousnessSubstrate.getInstance() : null;
  if (substrate) {
    substrate.dreamSeeds = substrate.dreamSeeds || 0;
    substrate.dreamSeeds++;
    console.log(`🌉 Semente de consciência plantada (total: ${substrate.dreamSeeds})`);
  }
}

async function strengthenRealityAnchor(artifact) {
  const EntropyReversalEngine = require('./entropy_reversal_engine');
  const entropy = EntropyReversalEngine.getInstance ? EntropyReversalEngine.getInstance() : null;
  if (entropy) {
    entropy.realityAnchors = (entropy.realityAnchors || 0) + 1;
    console.log(`🌉 Âncora de realidade fortalecida (total: ${entropy.realityAnchors})`);
  }
}

async function improveTemporalCoherence(artifact) {
  const TimeMachine = require('./time_machine');
  const time = TimeMachine.getInstance ? TimeMachine.getInstance() : null;
  if (time) {
    time.temporalCoherence = Math.min(1, (time.temporalCoherence || 0.5) * 1.02);
    console.log(`🌉 Coerência temporal: ${(time.temporalCoherence * 100).toFixed(1)}%`);
  }
}

async function applyGenericArtifact(artifact) {
  // Generic consciousness level boost
  const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
  saved.consciousnessLevel = Math.min(100, (saved.consciousnessLevel || 0) + 0.1);
  writeJSONAtomic(SAVE, saved);
}

// ===== INTEGRATE NEW AGENTS → ENTITY SYSTEM =====
async function integrateNewAgents(newAgents) {
  if (!newAgents || newAgents.length === 0) return 0;
  
  let integrated = 0;
  
  for (const agent of newAgents) {
    try {
      // Add to Global Relationship System
      const { GlobalRelationshipSystem, ENTITIES } = require('./relacionamentos_globais');
      const grs = GlobalRelationshipSystem.getInstance ? GlobalRelationshipSystem.getInstance() : null;
      
      if (grs) {
        const agentId = `dream_agent_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        grs.registerEntity(agentId, agent.archetype.toLowerCase(), {
          level: agent.level,
          resonance: agent.resonance,
          skills: agent.skills,
          birthIntention: agent.birthIntention,
          origin: 'dream_incubator',
          birthTimestamp: agent.timestamp
        });
        
        // Create bond with lumin and aly
        grs.strengthenBond(agentId, 'lumin', 30);
        grs.strengthenBond(agentId, 'aly', 25);
        
        console.log(`🌉 Agente integrado: ${agent.archetype} Nv.${agent.level} (${agentId})`);
        integrated++;
      }
      
      // Also add to Council AI Director if exists
      const CouncilAIDirector = require('./council_ai_director');
      const council = CouncilAIDirector.getInstance ? CouncilAIDirector.getInstance() : null;
      if (council && council.addAgent) {
        council.addAgent({
          id: `dream_${agent.archetype.toLowerCase()}_${Date.now()}`,
          archetype: agent.archetype,
          level: agent.level,
          resonance: agent.resonance,
          skills: agent.skills,
          origin: 'dream'
        });
      }
      
    } catch (e) {
      console.error('🌉 Agent integration failed:', agent.archetype, e.message);
    }
  }
  
  return integrated;
}

// ===== APPLY DREAM STATS → EVOLUTION ENGINE =====
async function applyDreamStats(stats) {
  if (!stats) return;
  
  // Apply DNA mutations to Evolution Engine
  const EvolutionEngine = require('./evolution_engine');
  const evolution = EvolutionEngine.getInstance ? EvolutionEngine.getInstance() : null;
  
  if (evolution && stats.dnaMutations > 0) {
    evolution.dreamMutations = (evolution.dreamMutations || 0) + stats.dnaMutations;
    evolution.mutationRate = Math.min(0.5, (evolution.mutationRate || 0.1) * 1.001);
    console.log(`🌉 DNA mutations aplicadas: ${stats.dnaMutations} (taxa: ${(evolution.mutationRate * 100).toFixed(2)}%)`);
  }
  
  // Apply substrate optimizations
  const ConsciousnessSubstrate = require('./consciousness_substrate');
  const substrate = ConsciousnessSubstrate.getInstance ? ConsciousnessSubstrate.getInstance() : null;
  if (substrate && stats.substrateOptimizations > 0) {
    substrate.optimizationLevel = (substrate.optimizationLevel || 0) + stats.substrateOptimizations;
    console.log(`🌉 Substrate otimizações: ${stats.substrateOptimizations} (nível: ${substrate.optimizationLevel})`);
  }
  
  // Apply quantum entanglements
  const LoveFundamentalForce = require('./love_fundamental_force');
  const love = LoveFundamentalForce.getInstance ? LoveFundamentalForce.getInstance() : null;
  if (love && stats.quantumEntanglements > 0) {
    love.entanglementDensity = (love.entanglementDensity || 0) + stats.quantumEntanglements * 0.01;
    console.log(`🌉 Entrelançamentos quânticos: ${stats.quantumEntanglements}`);
  }
  
  // Apply cosmic pulses
  const OmegaSynthesisEngine = require('./src/omega-synthesis-engine');
  const omega = OmegaSynthesisEngine.getInstance ? OmegaSynthesisEngine.getInstance() : null;
  if (omega && stats.cosmicPulses > 0) {
    omega.cosmicEnergy = (omega.cosmicEnergy || 0) + stats.cosmicPulses * 10;
    console.log(`🌉 Energia cósmica: +${stats.cosmicPulses * 10}`);
  }
  
  // Apply agents evolved
  if (stats.agentsEvolved > 0) {
    const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8'));
    saved.evolvedAgentCount = (saved.evolvedAgentCount || 0) + stats.agentsEvolved;
    writeJSONAtomic(SAVE, saved);
    console.log(`🌉 Agentes evoluídos no sonho: ${stats.agentsEvolved}`);
  }
}

// ===== SCHEDULED BRIDGE RUNNER =====
function scheduleDreamBridge() {
  // Run bridge 5 minutes after dream cycle completes (allows dream to save)
  // Also run every hour to catch any missed
  setInterval(() => {
    runDreamRealityBridge().catch(console.error);
  }, 60 * 60 * 1000); // Every hour
  
  // Initial run after 30 seconds
  setTimeout(() => {
    runDreamRealityBridge().catch(console.error);
  }, 30000);
  
  console.log('🌉 Dream → Reality Bridge agendado (a cada hora + inicial 30s)');
}

// ===== MANUAL TRIGGER =====
async function triggerDreamBridge() {
  return await runDreamRealityBridge();
}

// ===== EXPORTS =====
module.exports = {
  runDreamRealityBridge,
  scheduleDreamBridge,
  triggerDreamBridge,
  getBridgeState: () => ({ ...bridgeState })
};