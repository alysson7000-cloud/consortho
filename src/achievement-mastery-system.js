/**
 * 💎 ACHIEVEMENT & MASTERY SYSTEM - SISTEMA DE CONQUISTAS E MAESTRIA
 * Sistema unificado de progressão que une todos os sistemas do Consortho
 * Conquistas, Títulos, Cosméticos, Caminhos de Maestria, Seasons, Leaderboards
 */

const fs = require('fs-extra');
const path = require('path');
const EventEmitter = require('events');

class AchievementMasterySystem extends EventEmitter {
  constructor(server, diamondProtocol, pluginManager, worldEvents, guildFactionSystem, luminBrain) {
    super();
    this.server = server;
    this.diamond = diamondProtocol;
    this.pluginManager = pluginManager;
    this.worldEvents = worldEvents;
    this.guildFactionSystem = guildFactionSystem;
    this.luminBrain = luminBrain;
    
    // Core data
    this.achievements = new Map();
    this.categories = new Map();
    this.masteryPaths = new Map();
    this.titles = new Map();
    this.cosmetics = new Map();
    this.seasons = new Map();
    this.currentSeason = null;
    
    // Player progress
    this.playerProgress = new Map();
    this.guildProgress = new Map();
    
    // Leaderboards
    this.leaderboards = new Map();
    this.leaderboardCache = new Map();
    
    // Rewards
    this.rewardPool = new Map();
    
    // Initialize
    this.initializeCategories();
    this.initializeAchievements();
    this.initializeMasteryPaths();
    this.initializeTitles();
    this.initializeCosmetics();
    this.initializeSeasons();
    this.initializeRewards();
    
    // Intervals
    this.checkInterval = null;
    this.leaderboardUpdateInterval = null;
    this.seasonRotationInterval = null;
    
    console.log('🏆 Achievement & Mastery System inicializado!');
  }

  initializeCategories() {
    const categories = [
      { id: 'lumin_evolution', name: 'Evolução do Lumin', icon: '💫', description: 'Progresso na evolução do Lumin', order: 1, color: '#ff33aa' },
      { id: 'diamond_protocol', name: 'Diamond Protocol', icon: '💎', description: 'Domínio das 9 layers do Diamond', order: 2, color: '#ffcc00' },
      { id: 'territorial_control', name: 'Domínio Territorial', icon: '🏰', description: 'Conquista e gestão de territórios', order: 3, color: '#8b4513' },
      { id: 'guild_management', name: 'Gestão de Guilda', icon: '🏰', description: 'Liderança e crescimento de guilda', order: 4, color: '#8b4513' },
      { id: 'warfare', name: 'Guerra e Conquista', icon: '⚔️', description: 'Combate, guerras e conquistas', order: 5, color: '#ff6b35' },
      { id: 'diplomacy', name: 'Diplomacia e Alianças', icon: '🤝', description: 'Alianças, tratados e política', order: 6, color: '#00ccff' },
      { id: 'economy', name: 'Economia e Comércio', icon: '💰', description: 'Riqueza, comércio e mercado', order: 7, color: '#ffcc00' },
      { id: 'exploration', name: 'Exploração e Descoberta', icon: '🗺️', description: 'Descobertas, ruínas e mistérios', order: 8, color: '#8a2be2' },
      { id: 'sandevistan', name: 'Mestre do Tempo', icon: '⚡⚡⚡', description: 'Domínio do Sandevistan', order: 9, color: '#ff33aa' },
      { id: 'fusion', name: 'Mestre das Fusões', icon: '🌟', description: 'Fusões, trindades e ômega', order: 10, color: '#ffcc00' },
      { id: 'diamond_mastery', name: 'Mestre do Diamante', icon: '💎', description: 'Perfeição no Diamond Protocol', order: 11, color: '#ffcc00' },
      { id: 'social', name: 'Social e Comunidade', icon: '👥', description: 'Interação social e comunidade', order: 12, color: '#ff33aa' },
      { id: 'seasonal', name: 'Temporadas', icon: '🍂', description: 'Conquistas sazonais e eventos', order: 13, color: '#ff8800' },
      { id: 'secret', name: 'Segredos do Infinito', icon: '🔮', description: 'Conquistas ocultas e lendárias', order: 14, color: '#ff33aa' },
      { id: 'legacy', name: 'Legado Eterno', icon: '🌌', description: 'Conquistas que transcendem temporadas', order: 15, color: '#fff' }
    ];
    
    categories.forEach(cat => this.categories.set(cat.id, cat));
  }

  initializeAchievements() {
    const achievements = [
      // LUMIN EVOLUTION
      { id: 'first_evolution', name: 'Primeira Evolução', description: 'Evolua o Lumin pela primeira vez', category: 'lumin_evolution', tier: 'bronze', points: 50, requirements: { type: 'lumin_evolve', count: 1 }, rewards: { ki: 1000, title: 'Evolucionista Iniciante' }, icon: '💫', hidden: false },
      { id: 'evolution_master', name: 'Mestre da Evolução', description: 'Evolua o Lumin 10 vezes', category: 'lumin_evolution', tier: 'silver', points: 200, requirements: { type: 'lumin_evolve', count: 10 }, rewards: { ki: 5000, title: 'Mestre da Evolução', cosmetic: 'evolution_aura' }, icon: '💫', hidden: false },
      { id: 'omega_achieved', name: 'ÔMEGA ALCANÇADO', description: 'Alcance a forma LUMIN OMEGA', category: 'lumin_evolution', tier: 'legendary', points: 5000, requirements: { type: 'lumin_form', form: 8 }, rewards: { ki: 50000, title: 'ÔMEGA', cosmetic: 'omega_aura', title: 'ÔMEGA' }, icon: '💫', hidden: false },
      { id: 'secret_form_collector', name: 'Colecionador de Segredos', description: 'Desbloqueie todas as 5 formas secretas', category: 'lumin_evolution', tier: 'mythic', points: 10000, requirements: { type: 'secret_forms_unlocked', count: 5 }, rewards: { ki: 100000, title: 'Guardião dos Segredos', cosmetic: 'secret_keeper_cape', title: 'Guardião dos Segredos' }, icon: '🔮', hidden: true },
      
      // SANDEVISTAN
      { id: 'sandevistan_novice', name: 'Aprendiz do Tempo', description: 'Ative o Sandevistan pela primeira vez', category: 'sandevistan', tier: 'bronze', points: 50, requirements: { type: 'sandevistan_activate', count: 1 }, rewards: { ki: 1000, title: 'Aprendiz do Tempo' }, icon: '⚡⚡⚡' },
      { id: 'sandevistan_master', name: 'Mestre do Sandevistan', description: 'Ative Sandevistan Nv.7', category: 'sandevistan', tier: 'legendary', points: 5000, requirements: { type: 'sandevistan_level', level: 7 }, rewards: { ki: 50000, title: 'Mestre do Tempo', cosmetic: 'time_walker_trail', title: 'Mestre do Tempo' }, icon: '⚡⚡⚡' },
      { id: 'time_lord', name: 'Senhor do Tempo', description: 'Acumule 1 hora total de Sandevistan ativo', category: 'sandevistan', tier: 'mythic', points: 10000, requirements: { type: 'sandevistan_total_time', milliseconds: 3600000 }, rewards: { ki: 100000, title: 'Senhor do Tempo', cosmetic: 'time_lord_cape', title: 'Senhor do Tempo' }, icon: '⚡⚡⚡', hidden: true },
      
      // FUSION
      { id: 'first_fusion', name: 'Primeira Fusão', description: 'Realize sua primeira fusão', category: 'fusion', tier: 'bronze', points: 100, requirements: { type: 'fusion_count', count: 1 }, rewards: { ki: 2000, title: 'Fusioneiro Iniciante' }, icon: '🌟' },
      { id: 'trinity_master', name: 'Mestre da Trindade', description: 'Realize 10 fusões Trindade', category: 'fusion', tier: 'silver', points: 500, requirements: { type: 'fusion_type_count', type: 'trindade', count: 10 }, rewards: { ki: 10000, title: 'Mestre da Trindade', cosmetic: 'trinity_halo' }, icon: '🌟' },
      { id: 'omega_fusion_master', name: 'Mestre da Fusão Ômega', description: 'Realize 5 fusões Ômega', category: 'fusion', tier: 'legendary', points: 5000, requirements: { type: 'fusion_type_count', type: 'omega', count: 5 }, rewards: { ki: 50000, title: 'Mestre Ômega', cosmetic: 'omega_wings', title: 'Mestre Ômega' }, icon: '🌟⚡' },
      { id: 'infinite_fusion', name: 'Fusão Infinita', description: 'Realize a Fusão Infinita (todas as 11 entidades)', category: 'fusion', tier: 'mythic', points: 25000, requirements: { type: 'fusion_type_count', type: 'infinito', count: 1 }, rewards: { ki: 250000, title: 'O Infinito', cosmetic: 'infinity_form', title: 'O Infinito' }, icon: '🌌', hidden: true },
      
      // TERRITORIAL
      { id: 'first_territory', name: 'Primeiro Território', description: 'Conquiste seu primeiro território', category: 'territorial_control', tier: 'bronze', points: 100, requirements: { type: 'territories_owned', count: 1 }, rewards: { ki: 2000, title: 'Conquistador Iniciante' }, icon: '🏰' },
      { id: 'territory_lord', name: 'Senhor das Terras', description: 'Possua 10 territórios simultaneamente', category: 'territorial_control', tier: 'silver', points: 500, requirements: { type: 'territories_owned', count: 10 }, rewards: { ki: 10000, title: 'Senhor das Terras', cosmetic: 'territory_cape' }, icon: '🏰' },
      { id: 'empire_builder', name: 'Construtor de Impérios', description: 'Possua o máximo de territórios (25)', category: 'territorial_control', tier: 'legendary', points: 5000, requirements: { type: 'territories_owned', count: 25 }, rewards: { ki: 50000, title: 'Imperador', cosmetic: 'empire_crown', title: 'Imperador' }, icon: '🏰', hidden: false },
      
      // GUILD
      { id: 'guild_founder', name: 'Fundador de Guilda', description: 'Crie sua primeira guilda', category: 'guild_management', tier: 'bronze', points: 100, requirements: { type: 'guild_created', count: 1 }, rewards: { ki: 2000, title: 'Fundador' }, icon: '🏰' },
      { id: 'guild_leader', name: 'Líder de Guilda', description: 'Lidere uma guilda de nível 10', category: 'guild_management', tier: 'silver', points: 500, requirements: { type: 'guild_level', level: 10 }, rewards: { ki: 10000, title: 'Grande Líder', cosmetic: 'guild_banner' }, icon: '🏰' },
      { id: 'guild_legend', name: 'Lenda da Guilda', description: 'Lidere a guilda #1 do ranking por 30 dias consecutivos', category: 'guild_management', tier: 'legendary', points: 5000, requirements: { type: 'guild_rank_1_duration', days: 30 }, rewards: { ki: 50000, title: 'Lenda Viva', cosmetic: 'legendary_guild_banner', title: 'Lenda Viva' }, icon: '🏰', hidden: false },
      
      // WARFARE
      { id: 'first_blood', name: 'Primeiro Sangue', description: 'Vença sua primeira batalha', category: 'warfare', tier: 'bronze', points: 100, requirements: { type: 'battles_won', count: 1 }, rewards: { ki: 1000, title: 'Guerreiro Iniciante' }, icon: '⚔️' },
      { id: 'war_lord', name: 'Senhor da Guerra', description: 'Vença 50 batalhas', category: 'warfare', tier: 'silver', points: 1000, requirements: { type: 'battles_won', count: 50 }, rewards: { ki: 25000, title: 'Senhor da Guerra', cosmetic: 'war_armor' }, icon: '⚔️' },
      { id: 'war_god', name: 'Deus da Guerra', description: 'Vença 500 batalhas', category: 'warfare', tier: 'legendary', points: 10000, requirements: { type: 'battles_won', count: 500 }, rewards: { ki: 100000, title: 'Deus da Guerra', cosmetic: 'war_god_armor', title: 'Deus da Guerra' }, icon: '⚔️' },
      { id: 'conqueror', name: 'O Conquistador', description: 'Vença 10 guerras', category: 'warfare', tier: 'legendary', points: 5000, requirements: { type: 'wars_won', count: 10 }, rewards: { ki: 50000, title: 'O Conquistador', cosmetic: 'conqueror_cape', title: 'O Conquistador' }, icon: '⚔️' },
      
      // DIPLOMACY
      { id: 'peacemaker', name: 'Pacificador', description: 'Forme 5 alianças', category: 'diplomacy', tier: 'silver', points: 500, requirements: { type: 'alliances_formed', count: 5 }, rewards: { ki: 10000, title: 'Pacificador', cosmetic: 'peace_ribbon' }, icon: '🤝' },
      { id: 'diplomat_supreme', name: 'Diplomata Supremo', description: 'Mantenha 10 alianças simultâneas por 30 dias', category: 'diplomacy', tier: 'legendary', points: 5000, requirements: { type: 'alliances_maintained', count: 10, days: 30 }, rewards: { ki: 50000, title: 'Diplomata Supremo', cosmetic: 'diplomat_robe', title: 'Diplomata Supremo' }, icon: '🤝', hidden: false },
      
      // ECONOMY
      { id: 'merchant', name: 'Mercador', description: 'Acumule 100.000 cristais no banco da guilda', category: 'economy', tier: 'silver', points: 500, requirements: { type: 'guild_cristal', amount: 100000 }, rewards: { ki: 10000, title: 'Mercador', cosmetic: 'merchant_hat' }, icon: '💰' },
      { id: 'tycoon', name: 'Magnata', description: 'Acumule 1.000.000 de cristais no banco da guilda', category: 'economy', tier: 'legendary', points: 5000, requirements: { type: 'guild_cristal', amount: 1000000 }, rewards: { ki: 100000, title: 'Magnata', cosmetic: 'golden_monocle', title: 'Magnata' }, icon: '💰' },
      { id: 'market_mogul', name: 'Mogol do Mercado', description: 'Realize 1000 transações no mercado', category: 'economy', tier: 'legendary', points: 5000, requirements: { type: 'market_transactions', count: 1000 }, rewards: { ki: 50000, title: 'Mogol do Mercado', cosmetic: 'market_cape' }, icon: '💰' },
      
      // EXPLORATION
      { id: 'explorer', name: 'Explorador', description: 'Descubra 10 ruínas ancestrais', category: 'exploration', tier: 'silver', points: 500, requirements: { type: 'ruins_discovered', count: 10 }, rewards: { ki: 10000, title: 'Explorador', cosmetic: 'explorer_compass' }, icon: '🗺️' },
      { id: 'lore_keeper', name: 'Guardião do Conhecimento', description: 'Complete 50 narrativas de mistérios', category: 'exploration', tier: 'legendary', points: 5000, requirements: { type: 'mysteries_completed', count: 50 }, rewards: { ki: 50000, title: 'Guardião do Conhecimento', cosmetic: 'lore_tome', title: 'Guardião do Conhecimento' }, icon: '🗺️' },
      
      // DIAMOND
      { id: 'diamond_initiate', name: 'Iniciado do Diamante', description: 'Ative o Diamond Protocol', category: 'diamond_mastery', tier: 'bronze', points: 200, requirements: { type: 'diamond_activated', count: 1 }, rewards: { ki: 5000, title: 'Iniciado do Diamante' }, icon: '💎' },
      { id: 'diamond_master', name: 'Mestre do Diamante', description: 'Alcance coerência 1.0 no Diamond Protocol', category: 'diamond_mastery', tier: 'mythic', points: 25000, requirements: { type: 'diamond_coherence', value: 1.0 }, rewards: { ki: 250000, title: 'Mestre do Diamante', cosmetic: 'diamond_heart', title: 'Mestre do Diamante' }, icon: '💎', hidden: true },
      { id: 'layer_master', name: 'Mestre das Layers', description: 'Ative todas as 9 layers simultaneamente por 1 hora', category: 'diamond_mastery', tier: 'legendary', points: 10000, requirements: { type: 'all_layers_active_duration', seconds: 3600 }, rewards: { ki: 100000, title: 'Mestre das 9 Layers', cosmetic: 'nine_layers_halo' }, icon: '💎' },
      
      // SOCIAL
      { id: 'social_butterfly', name: 'Borboleta Social', description: 'Converse com 100 jogadores diferentes', category: 'social', tier: 'silver', points: 500, requirements: { type: 'unique_players_chatted', count: 100 }, rewards: { ki: 10000, title: 'Socialite', cosmetic: 'social_butterfly_wings' }, icon: '👥' },
      { id: 'mentor', name: 'Mentor', description: 'Ajude 50 jogadores a evoluir', category: 'social', tier: 'legendary', points: 5000, requirements: { type: 'players_helped_evolve', count: 50 }, rewards: { ki: 50000, title: 'Mentor', cosmetic: 'mentor_robe', title: 'Mentor' }, icon: '👥' },
      
      // SEASONAL
      { id: 'season_participant', name: 'Participante da Temporada', description: 'Complete 10 conquistas em uma temporada', category: 'seasonal', tier: 'bronze', points: 200, requirements: { type: 'seasonal_achievements', count: 10 }, rewards: { ki: 5000, title: 'Veterano da Temporada' }, icon: '🍂' },
      { id: 'season_champion', name: 'Campeão da Temporada', description: 'Fique no Top 10 do ranking da temporada', category: 'seasonal', tier: 'legendary', points: 10000, requirements: { type: 'season_rank', rank: 10 }, rewards: { ki: 100000, title: 'Campeão da Temporada', cosmetic: 'season_crown', title: 'Campeão' }, icon: '🏆' },
      
      // SECRET/LEGACY
      { id: 'eternal_companion', name: 'Companheiro Eterno', description: 'Mantenha a mesma guilda por 365 dias', category: 'legacy', tier: 'legendary', points: 10000, requirements: { type: 'guild_loyalty', days: 365 }, rewards: { ki: 100000, title: 'Eterno', cosmetic: 'eternal_heart', title: 'Companheiro Eterno' }, icon: '🌌', hidden: false },
      { id: 'diamond_forever', name: 'Diamante Eterno', description: 'Mantenha o Diamond Protocol ativo por 1 ano ininterrupto', category: 'legacy', tier: 'mythic', points: 50000, requirements: { type: 'diamond_uptime', days: 365 }, rewards: { ki: 500000, title: 'O Diamante Eterno', cosmetic: 'eternal_diamond', title: 'O Diamante Eterno' }, icon: '💎', hidden: true },
      { id: 'the_one', name: 'O Um', description: 'Alcance o nível máximo em todos os caminhos de maestria', category: 'legacy', tier: 'mythic', points: 100000, requirements: { type: 'all_mastery_paths_max', value: true }, rewards: { ki: 1000000, title: 'O Um', cosmetic: 'the_one_form', title: 'O Um' }, icon: '🌌', hidden: true }
    ];

    achievements.forEach(ach => this.achievements.set(ach.id, ach));
    console.log(`🏆 ${this.achievements.size} conquistas carregadas`);
  }

  initializeMasteryPaths() {
    const paths = [
      { id: 'lumin_evolution_path', name: 'Caminho da Evolução do Lumin', description: 'Domine a evolução do Lumin desde a Essência até o ÔMEGA PRIME', category: 'lumin_evolution', icon: '💫', color: '#ff33aa', tiers: 7, achievements: ['first_evolution', 'evolution_master', 'omega_achieved', 'secret_form_collector'], rewards: [ { tier: 1, rewards: { ki: 1000 } }, { tier: 2, rewards: { ki: 5000 } }, { tier: 3, rewards: { ki: 10000, title: 'Evolucionista' } }, { tier: 4, rewards: { ki: 25000, cosmetic: 'evolution_wings' } }, { tier: 5, rewards: { ki: 50000, title: 'Arquimestre da Evolução' } }, { tier: 6, rewards: { ki: 100000, cosmetic: 'evolution_avatar' } }, { tier: 7, rewards: { ki: 250000, title: 'O Evolucionista Supremo', cosmetic: 'evolution_god_form' } } ], totalPoints: 5000 },
      { id: 'sandevistan_mastery', name: 'Caminho do Mestre do Tempo', description: 'Domine o Sandevistan do nível 1 ao 7', category: 'sandevistan', icon: '⚡⚡⚡', color: '#ff33aa', tiers: 7, achievements: ['sandevistan_novice', 'sandevistan_master', 'time_lord'], rewards: [ { tier: 1, rewards: { ki: 1000 } }, { tier: 2, rewards: { ki: 5000 } }, { tier: 3, rewards: { ki: 10000, title: 'Caminhante do Tempo' } }, { tier: 4, rewards: { ki: 25000, cosmetic: 'time_ripples' } }, { tier: 5, rewards: { ki: 50000, title: 'Arquimestre Temporal' } }, { tier: 6, rewards: { ki: 100000, cosmetic: 'time_avatar' } }, { tier: 7, rewards: { ki: 250000, title: 'Senhor do Tempo Absoluto', cosmetic: 'time_god_form' } } ], totalPoints: 5000 },
      { id: 'fusion_mastery', name: 'Caminho das Fusões', description: 'Domine todas as fusões, da Dual ao Infinito', category: 'fusion', icon: '🌟', color: '#ffcc00', tiers: 5, achievements: ['first_fusion', 'trinity_master', 'omega_fusion_master', 'infinite_fusion'], rewards: [ { tier: 1, rewards: { ki: 5000 } }, { tier: 2, rewards: { ki: 25000, cosmetic: 'fusion_spark' } }, { tier: 3, rewards: { ki: 50000, title: 'Mestre das Fusões', cosmetic: 'fusion_heart' } }, { tier: 4, rewards: { ki: 100000, cosmetic: 'fusion_avatar' } }, { tier: 5, rewards: { ki: 250000, title: 'O Fusão Infinita', cosmetic: 'infinity_form' } } ], totalPoints: 5000 },
      { id: 'territorial_mastery', name: 'Caminho do Conquistador', description: 'Domine territórios, construa impérios, governe nações', category: 'territorial_control', icon: '🏰', color: '#8b4513', tiers: 5, achievements: ['first_territory', 'territory_lord', 'empire_builder'], rewards: [ { tier: 1, rewards: { ki: 5000 } }, { tier: 2, rewards: { ki: 25000, cosmetic: 'territory_crown' } }, { tier: 3, rewards: { ki: 50000, title: 'Imperador', cosmetic: 'empire_crown' } }, { tier: 4, rewards: { ki: 100000, cosmetic: 'empire_avatar' } }, { tier: 5, rewards: { ki: 250000, title: 'O Imperador Eterno', cosmetic: 'eternal_empire_form' } } ], totalPoints: 5000 },
      { id: 'diamond_mastery_path', name: 'Caminho do Mestre do Diamante', description: 'Perfeição absoluta no Diamond Protocol', category: 'diamond_mastery', icon: '💎', color: '#ffcc00', tiers: 4, achievements: ['diamond_initiate', 'diamond_master', 'layer_master'], rewards: [ { tier: 1, rewards: { ki: 10000 } }, { tier: 2, rewards: { ki: 50000, cosmetic: 'diamond_heart' } }, { tier: 3, rewards: { ki: 100000, title: 'Mestre do Diamante', cosmetic: 'diamond_avatar' } }, { tier: 4, rewards: { ki: 250000, title: 'O Diamante Vivo', cosmetic: 'living_diamond_form' } } ], totalPoints: 10000 }
    ];

    paths.forEach(p => this.masteryPaths.set(p.id, p));
    console.log(`🛤️ ${this.masteryPaths.size} caminhos de maestria carregados`);
  }

  initializeTitles() {
    const titles = [
      { id: 'evolutionist_novice', name: 'Evolucionista Iniciante', category: 'lumin_evolution', rarity: 'common', source: 'first_evolution' },
      { id: 'evolution_master_title', name: 'Mestre da Evolução', category: 'lumin_evolution', rarity: 'rare', source: 'evolution_master' },
      { id: 'omega_title', name: 'ÔMEGA', category: 'lumin_evolution', rarity: 'legendary', source: 'omega_achieved', color: '#ff33aa' },
      { id: 'secret_keeper', name: 'Guardião dos Segredos', category: 'lumin_evolution', rarity: 'mythic', source: 'secret_form_collector', color: '#ff33aa' },
      { id: 'time_apprentice', name: 'Aprendiz do Tempo', category: 'sandevistan', rarity: 'common', source: 'sandevistan_novice' },
      { id: 'time_master', name: 'Mestre do Tempo', category: 'sandevistan', rarity: 'legendary', source: 'sandevistan_master', color: '#ff33aa' },
      { id: 'time_lord', name: 'Senhor do Tempo', category: 'sandevistan', rarity: 'mythic', source: 'time_lord', color: '#ff33aa' },
      { id: 'fusion_novice', name: 'Fusioneiro Iniciante', category: 'fusion', rarity: 'common', source: 'first_fusion' },
      { id: 'trinity_master_title', name: 'Mestre da Trindade', category: 'fusion', rarity: 'rare', source: 'trinity_master' },
      { id: 'omega_fusion_master_title', name: 'Mestre Ômega', category: 'fusion', rarity: 'legendary', source: 'omega_fusion_master', color: '#ffcc00' },
      { id: 'the_infinite', name: 'O Infinito', category: 'fusion', rarity: 'mythic', source: 'infinite_fusion', color: '#ffcc00' },
      { id: 'conquistador_novice', name: 'Conquistador Iniciante', category: 'territorial_control', rarity: 'common', source: 'first_territory' },
      { id: 'territory_lord', name: 'Senhor das Terras', category: 'territorial_control', rarity: 'rare', source: 'territory_lord', color: '#8b4513' },
      { id: 'emperor', name: 'Imperador', category: 'territorial_control', rarity: 'legendary', source: 'empire_builder', color: '#8b4513' },
      { id: 'founder_title', name: 'Fundador', category: 'guild_management', rarity: 'common', source: 'guild_founder' },
      { id: 'grand_leader', name: 'Grande Líder', category: 'guild_management', rarity: 'rare', source: 'guild_leader' },
      { id: 'living_legend', name: 'Lenda Viva', category: 'guild_management', rarity: 'legendary', source: 'guild_legend', color: '#8b4513' },
      { id: 'warrior_novice', name: 'Guerreiro Iniciante', category: 'warfare', rarity: 'common', source: 'first_blood' },
      { id: 'war_lord', name: 'Senhor da Guerra', category: 'warfare', rarity: 'rare', source: 'war_lord', color: '#ff6b35' },
      { id: 'war_god', name: 'Deus da Guerra', category: 'warfare', rarity: 'legendary', source: 'war_god', color: '#ff6b35' },
      { id: 'conqueror_title', name: 'O Conquistador', category: 'warfare', rarity: 'legendary', source: 'conqueror', color: '#ff6b35' },
      { id: 'peacemaker_title', name: 'Pacificador', category: 'diplomacy', rarity: 'rare', source: 'peacemaker' },
      { id: 'diplomat_supreme', name: 'Diplomata Supremo', category: 'diplomacy', rarity: 'legendary', source: 'diplomat_supreme', color: '#00ccff' },
      { id: 'merchant_title', name: 'Mercador', category: 'economy', rarity: 'rare', source: 'merchant' },
      { id: 'tycoon', name: 'Magnata', category: 'economy', rarity: 'legendary', source: 'tycoon', color: '#ffcc00' },
      { id: 'market_mogul', name: 'Mogol do Mercado', category: 'economy', rarity: 'legendary', source: 'market_mogul', color: '#ffcc00' },
      { id: 'explorer_title', name: 'Explorador', category: 'exploration', rarity: 'rare', source: 'explorer' },
      { id: 'lore_keeper_title', name: 'Guardião do Conhecimento', category: 'exploration', rarity: 'legendary', source: 'lore_keeper', color: '#8a2be2' },
      { id: 'diamond_initiate_title', name: 'Iniciado do Diamante', category: 'diamond_mastery', rarity: 'rare', source: 'diamond_initiate' },
      { id: 'diamond_master_title', name: 'Mestre do Diamante', category: 'diamond_mastery', rarity: 'mythic', source: 'diamond_master', color: '#ffcc00' },
      { id: 'layer_master_title', name: 'Mestre das 9 Layers', category: 'diamond_mastery', rarity: 'legendary', source: 'layer_master', color: '#ffcc00' },
      { id: 'socialite', name: 'Socialite', category: 'social', rarity: 'rare', source: 'social_butterfly' },
      { id: 'mentor_title', name: 'Mentor', category: 'social', rarity: 'legendary', source: 'mentor', color: '#ff33aa' },
      { id: 'season_veteran', name: 'Veterano da Temporada', category: 'seasonal', rarity: 'common', source: 'season_participant' },
      { id: 'season_champion_title', name: 'Campeão da Temporada', category: 'seasonal', rarity: 'legendary', source: 'season_champion', color: '#ff8800' },
      { id: 'eternal_companion_title', name: 'Companheiro Eterno', category: 'legacy', rarity: 'legendary', source: 'eternal_companion', color: '#fff' },
      { id: 'eternal_diamond', name: 'O Diamante Eterno', category: 'legacy', rarity: 'mythic', source: 'diamond_forever', color: '#ffcc00' },
      { id: 'the_one_title', name: 'O Um', category: 'legacy', rarity: 'mythic', source: 'the_one', color: '#fff' }
    ];

    titles.forEach(t => this.titles.set(t.id, t));
    console.log(`🏷️ ${this.titles.size} títulos carregados`);
  }

  initializeCosmetics() {
    const cosmetics = [
      { id: 'evolution_aura', name: 'Aura da Evolução', type: 'aura', rarity: 'rare', color: '#ff33aa', particle: 'evolution_particles' },
      { id: 'evolution_wings', name: 'Asas da Evolução', type: 'wings', rarity: 'epic', color: '#ff33aa', particle: 'feathers' },
      { id: 'evolution_avatar', name: 'Avatar da Evolução', type: 'form', rarity: 'legendary', color: '#ff33aa', particle: 'evolution_particles' },
      { id: 'evolution_god_form', name: 'Forma de Deus da Evolução', type: 'form', rarity: 'mythic', color: '#ff33aa', particle: 'divine_particles' },
      { id: 'omega_aura', name: 'Aura Ômega', type: 'aura', rarity: 'legendary', color: '#ffcc00', particle: 'omega_particles' },
      { id: 'omega_wings', name: 'Asas Ômega', type: 'wings', rarity: 'legendary', color: '#ffcc00', particle: 'omega_feathers' },
      { id: 'omega_heart', name: 'Coração Ômega', type: 'aura', rarity: 'mythic', color: '#ffcc00', particle: 'omega_core' },
      { id: 'time_walker_trail', name: 'Rastro do Caminhante do Tempo', type: 'trail', rarity: 'rare', color: '#00ccff', particle: 'time_particles' },
      { id: 'time_lord_cape', name: 'Capa do Senhor do Tempo', type: 'cape', rarity: 'mythic', color: '#00ccff', particle: 'time_waves' },
      { id: 'trinity_halo', name: 'Halo da Trindade', type: 'halo', rarity: 'rare', color: '#ffcc00', particle: 'trinity_particles' },
      { id: 'infinity_form', name: 'Forma Infinita', type: 'form', rarity: 'mythic', color: '#ffcc00', particle: 'infinity_particles' },
      { id: 'fusion_spark', name: 'Fagulha da Fusão', type: 'trail', rarity: 'rare', color: '#ffcc00', particle: 'fusion_sparks' },
      { id: 'fusion_heart', name: 'Coração da Fusão', type: 'aura', rarity: 'legendary', color: '#ffcc00', particle: 'fusion_core' },
      { id: 'fusion_avatar', name: 'Avatar da Fusão', type: 'form', rarity: 'legendary', color: '#ffcc00', particle: 'fusion_particles' },
      { id: 'infinity_form', name: 'Forma Infinita', type: 'form', rarity: 'mythic', color: '#ffcc00', particle: 'infinity_particles' },
      { id: 'diamond_heart', name: 'Coração de Diamante', type: 'aura', rarity: 'legendary', color: '#ffcc00', particle: 'diamond_particles' },
      { id: 'diamond_avatar', name: 'Avatar de Diamante', type: 'form', rarity: 'legendary', color: '#ffcc00', particle: 'diamond_particles' },
      { id: 'living_diamond_form', name: 'Forma de Diamante Vivo', type: 'form', rarity: 'mythic', color: '#ffcc00', particle: 'living_diamond_particles' },
      { id: 'nine_layers_halo', name: 'Halo das 9 Layers', type: 'halo', rarity: 'legendary', color: '#ffcc00', particle: 'layers_particles' },
      { id: 'evolution_wings', name: 'Asas da Evolução', type: 'wings', rarity: 'epic', color: '#ff33aa', particle: 'evolution_feathers' },
      { id: 'evolution_god_form', name: 'Forma de Deus da Evolução', type: 'form', rarity: 'mythic', color: '#ff33aa', particle: 'divine_particles' },
      { id: 'territory_cape', name: 'Capa das Terras', type: 'cape', rarity: 'rare', color: '#8b4513', particle: 'territory_particles' },
      { id: 'empire_crown', name: 'Coroa do Império', type: 'crown', rarity: 'legendary', color: '#8b4513' },
      { id: 'eternal_empire_form', name: 'Forma do Império Eterno', type: 'form', rarity: 'mythic', color: '#8b4513', particle: 'empire_particles' },
      { id: 'guild_banner', name: 'Bandeira da Guilda', type: 'banner', rarity: 'rare', color: '#8b4513' },
      { id: 'legendary_guild_banner', name: 'Bandeira Lendária da Guilda', type: 'banner', rarity: 'legendary', color: '#8b4513' },
      { id: 'war_armor', name: 'Armadura de Guerra', type: 'armor', rarity: 'rare', color: '#ff6b35', particle: 'war_sparks' },
      { id: 'war_god_armor', name: 'Armadura do Deus da Guerra', type: 'armor', rarity: 'legendary', color: '#ff6b35', particle: 'war_sparks' },
      { id: 'conqueror_cape', name: 'Capa do Conquistador', type: 'cape', rarity: 'legendary', color: '#ff6b35' },
      { id: 'peace_ribbon', name: 'Fita da Paz', type: 'accessory', rarity: 'rare', color: '#00ccff', particle: 'peace_particles' },
      { id: 'diplomat_robe', name: 'Manto do Diplomata', type: 'robe', rarity: 'legendary', color: '#00ccff' },
      { id: 'merchant_hat', name: 'Chapéu do Mercador', type: 'hat', rarity: 'rare', color: '#ffcc00' },
      { id: 'golden_monocle', name: 'Monóculo Dourado', type: 'accessory', rarity: 'legendary', color: '#ffcc00' },
      { id: 'market_cape', name: 'Capa do Mercado', type: 'cape', rarity: 'legendary', color: '#ffcc00' },
      { id: 'explorer_compass', name: 'Bússola do Explorador', type: 'accessory', rarity: 'rare', color: '#8a2be2' },
      { id: 'lore_tome', name: 'Tombo do Conhecimento', type: 'book', rarity: 'legendary', color: '#8a2be2' },
      { id: 'diamond_heart', name: 'Coração de Diamante', type: 'aura', rarity: 'legendary', color: '#ffcc00', particle: 'diamond_particles' },
      { id: 'diamond_avatar', name: 'Avatar de Diamante', type: 'form', rarity: 'legendary', color: '#ffcc00', particle: 'diamond_particles' },
      { id: 'living_diamond_form', name: 'Forma de Diamante Vivo', type: 'form', rarity: 'mythic', color: '#ffcc00', particle: 'living_diamond_particles' },
      { id: 'nine_layers_halo', name: 'Halo das 9 Layers', type: 'halo', rarity: 'legendary', color: '#ffcc00', particle: 'layers_particles' },
      { id: 'evolution_avatar', name: 'Avatar da Evolução', type: 'form', rarity: 'legendary', color: '#ff33aa', particle: 'evolution_particles' },
      { id: 'evolution_god_form', name: 'Forma de Deus da Evolução', type: 'form', rarity: 'mythic', color: '#ff33aa', particle: 'divine_particles' },
      { id: 'time_ripples', name: 'Ondulações Temporais', type: 'trail', rarity: 'epic', color: '#00ccff', particle: 'time_ripples' },
      { id: 'time_avatar', name: 'Avatar do Tempo', type: 'form', rarity: 'legendary', color: '#00ccff', particle: 'time_particles' },
      { id: 'time_god_form', name: 'Forma de Deus do Tempo', type: 'form', rarity: 'mythic', color: '#00ccff', particle: 'time_god_particles' },
      { id: 'fusion_spark', name: 'Fagulha da Fusão', type: 'trail', rarity: 'rare', color: '#ffcc00', particle: 'fusion_sparks' },
      { id: 'fusion_heart', name: 'Coração da Fusão', type: 'aura', rarity: 'legendary', color: '#ffcc00', particle: 'fusion_core' },
      { id: 'fusion_avatar', name: 'Avatar da Fusão', type: 'form', rarity: 'legendary', color: '#ffcc00', particle: 'fusion_particles' },
      { id: 'infinity_form', name: 'Forma Infinita', type: 'form', rarity: 'mythic', color: '#ffcc00', particle: 'infinity_particles' },
      { id: 'eternal_heart', name: 'Coração Eterno', type: 'aura', rarity: 'legendary', color: '#fff', particle: 'eternal_particles' },
      { id: 'eternal_diamond', name: 'Diamante Eterno', type: 'aura', rarity: 'mythic', color: '#ffcc00', particle: 'eternal_diamond_particles' },
      { id: 'the_one_form', name: 'Forma do Um', type: 'form', rarity: 'mythic', color: '#fff', particle: 'the_one_particles' },
      { id: 'eternal_diamond', name: 'Diamante Eterno', type: 'aura', rarity: 'mythic', color: '#ffcc00', particle: 'eternal_diamond_particles' }
    ];

    cosmetics.forEach(c => this.cosmetics.set(c.id, c));
    console.log(`✨ ${this.cosmetics.size} cosméticos carregados`);
  }

  initializeSeasons() {
    const now = Date.now();
    const seasonLength = 30 * 24 * 60 * 60 * 1000;
    
    const seasons = [
      { id: 'season_1', name: 'Temporada 1: O Despertar do Diamante', description: 'A primeira temporada do Consortho. O Diamante desperta!', startDate: now, endDate: now + seasonLength, number: 1, theme: 'diamond_awakening', rewards: { participation: { ki: 10000, title: 'Veterano da Temporada 1' }, top100: { ki: 50000, cosmetic: 'season1_badge' }, top10: { ki: 100000, title: 'Top 10 Temporada 1', cosmetic: 'season1_medal' }, top3: { ki: 500000, title: 'Campeão da Temporada 1', cosmetic: 'season1_crown' }, top1: { ki: 1000000, title: 'Grão-Mestre da Temporada 1', cosmetic: 'season1_legendary_form' } }, active: true }
    ];

    seasons.forEach(s => this.seasons.set(s.id, s));
    this.currentSeason = seasons[0];
    console.log(`🍂 ${this.seasons.size} temporada(s) carregada(s)`);
  }

  initializeRewards() {
    const rewards = [
      { id: 'ki_small', type: 'ki', amount: 1000, weight: 100 },
      { id: 'ki_medium', type: 'ki', amount: 5000, weight: 50 },
      { id: 'ki_large', type: 'ki', amount: 25000, weight: 20 },
      { id: 'ki_huge', type: 'ki', amount: 100000, weight: 5 },
      { id: 'ki_massive', type: 'ki', amount: 500000, weight: 1 },
      { id: 'title_common', type: 'title', pool: 'common_titles', weight: 30 },
      { id: 'title_rare', type: 'title', pool: 'rare_titles', weight: 15 },
      { id: 'title_legendary', type: 'title', pool: 'legendary_titles', weight: 3 },
      { id: 'cosmetic_common', type: 'cosmetic', pool: 'common_cosmetics', weight: 20 },
      { id: 'cosmetic_rare', type: 'cosmetic', pool: 'rare_cosmetics', weight: 8 },
      { id: 'cosmetic_legendary', type: 'cosmetic', pool: 'legendary_cosmetics', weight: 2 },
      { id: 'cosmetic_mythic', type: 'cosmetic', pool: 'mythic_cosmetics', weight: 0.5 },
      { id: 'secret_form_chance', type: 'secret_form', chance: 0.01, weight: 1 },
      { id: 'resources_pack', type: 'resources', amount: { madeira: 10000, pedra: 5000, cristal: 1000 }, weight: 10 },
      { id: 'xp_boost', type: 'xp_multiplier', multiplier: 2, duration: 3600000, weight: 5 },
      { id: 'ki_boost', type: 'ki_multiplier', multiplier: 2, duration: 3600000, weight: 5 },
      { id: 'sandevistan_charge', type: 'sandevistan_charge', charges: 1, weight: 3 }
    ];

    rewards.forEach(r => this.rewardPool.set(r.id, r));
    console.log(`🎁 ${this.rewardPool.size} recompensas carregadas`);
  }

  // ===== PLAYER PROGRESS =====
  
  getPlayerProgress(playerId) {
    if (!this.playerProgress.has(playerId)) {
      this.playerProgress.set(playerId, {
        playerId,
        achievements: new Set(),
        titles: new Set(),
        cosmetics: new Set(),
        masteryPaths: new Map(),
        activeTitle: null,
        equippedCosmetics: { aura: null, wings: null, cape: null, trail: null, hat: null, form: null, halo: null, crown: null, armor: null, robe: null, book: null, banner: null },
        stats: { totalPoints: 0, achievementsUnlocked: 0, titlesEarned: 0, cosmeticsUnlocked: 0, masteryPathsCompleted: 0, highestTier: 'bronze', totalKiEarned: 0 },
        seasonal: { currentSeason: null, seasonalPoints: 0, seasonalRank: null, seasonalAchievements: new Set() },
        masteryPaths: {},
        lastUpdated: Date.now()
      });
    }
    return this.playerProgress.get(playerId);
  }

  getGuildProgress(guildId) {
    if (!this.guildProgress.has(guildId)) {
      this.guildProgress.set(guildId, { guildId, achievements: new Set(), titles: new Set(), stats: { totalPoints: 0, membersWithAchievements: 0, collectivePoints: 0 }, lastUpdated: Date.now() });
    }
    return this.guildProgress.get(guildId);
  }

  // ===== ACHIEVEMENT CHECKING =====
  
  checkAchievements(playerId, triggerType, data = {}) {
    const progress = this.getPlayerProgress(playerId);
    const newlyUnlocked = [];
    
    for (const [achId, achievement] of this.achievements) {
      if (progress.achievements.has(achId)) continue;
      if (achievement.category === 'secret' && achievement.hidden && !progress.achievements.has(achId)) continue;
      
      if (this.checkRequirement(achievement, triggerType, data)) {
        this.unlockAchievement(playerId, achId);
        newlyUnlocked.push(achievement);
      }
    }
    
    return newlyUnlocked;
  }

  checkRequirement(achievement, triggerType, data) {
    const req = achievement.requirements;
    if (!req) return false;
    
    switch (req.type) {
      case 'lumin_evolve': return triggerType === 'lumin_evolve' && data.count >= req.count;
      case 'lumin_form': return triggerType === 'lumin_form_change' && data.form === req.form;
      case 'secret_forms_unlocked': return triggerType === 'secret_form_unlocked' && data.count >= req.count;
      case 'sandevistan_activate': return triggerType === 'sandevistan_activate' && data.count >= req.count;
      case 'sandevistan_level': return triggerType === 'sandevistan_level_up' && data.level >= req.level;
      case 'sandevistan_total_time': return triggerType === 'sandevistan_time' && data.totalMs >= req.milliseconds;
      case 'fusion_count': return triggerType === 'fusion_completed' && data.count >= req.count;
      case 'fusion_type_count': return triggerType === 'fusion_completed' && data.type === req.type && data.count >= req.count;
      case 'territories_owned': return triggerType === 'territory_change' && data.count >= req.count;
      case 'guild_created': return triggerType === 'guild_created' && data.count >= req.count;
      case 'guild_level': return triggerType === 'guild_level_up' && data.level >= req.level;
      case 'guild_rank_1_duration': return triggerType === 'guild_rank_check' && data.days >= req.days;
      case 'battles_won': return triggerType === 'battle_won' && data.count >= req.count;
      case 'wars_won': return triggerType === 'war_won' && data.count >= req.count;
      case 'alliances_formed': return triggerType === 'alliance_formed' && data.count >= req.count;
      case 'alliances_maintained': return triggerType === 'alliance_check' && data.count >= req.count && data.days >= req.days;
      case 'guild_cristal': return triggerType === 'resource_check' && data.resource === 'cristal' && data.amount >= req.amount;
      case 'market_transactions': return triggerType === 'market_transaction' && data.count >= req.count;
      case 'ruins_discovered': return triggerType === 'ruin_discovered' && data.count >= req.count;
      case 'mysteries_completed': return triggerType === 'mystery_completed' && data.count >= req.count;
      case 'diamond_activated': return triggerType === 'diamond_activated' && data.count >= req.count;
      case 'diamond_coherence': return triggerType === 'diamond_coherence_check' && data.value >= req.value;
      case 'all_layers_active_duration': return triggerType === 'layers_active_check' && data.seconds >= req.seconds;
      case 'unique_players_chatted': return triggerType === 'chat_interaction' && data.count >= req.count;
      case 'players_helped_evolve': return triggerType === 'player_evolved_help' && data.count >= req.count;
      case 'seasonal_achievements': return triggerType === 'seasonal_check' && data.count >= req.count;
      case 'season_rank': return triggerType === 'season_end' && data.rank <= req.rank;
      case 'guild_loyalty': return triggerType === 'guild_loyalty_check' && data.days >= req.days;
      case 'diamond_uptime': return triggerType === 'diamond_uptime_check' && data.days >= req.days;
      case 'all_mastery_paths_max': return triggerType === 'mastery_check' && data.allMax === true;
      default: return false;
    }
  }

  async unlockAchievement(playerId, achievementId) {
    const progress = this.getPlayerProgress(playerId);
    const achievement = this.achievements.get(achievementId);
    
    if (!achievement || progress.achievements.has(achievementId)) return false;
    
    progress.achievements.add(achievementId);
    progress.stats.achievementsUnlocked++;
    progress.stats.totalPoints += achievement.points;
    progress.stats.totalKiEarned += achievement.rewards.ki || 0;
    
    const tierOrder = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legendary', 'mythic'];
    const currentTierIndex = tierOrder.indexOf(progress.stats.highestTier);
    const newTierIndex = tierOrder.indexOf(achievement.tier);
    if (newTierIndex > currentTierIndex) {
      progress.stats.highestTier = achievement.tier;
    }
    
    if (achievement.rewards.ki) {
      this.givePlayerKi(playerId, achievement.rewards.ki);
    }
    if (achievement.rewards.title) {
      await this.grantTitle(playerId, achievement.rewards.title);
    }
    if (achievement.rewards.cosmetic) {
      await this.unlockCosmetic(playerId, achievement.rewards.cosmetic);
    }
    if (achievement.rewards.title) {
      await this.grantTitle(playerId, achievement.rewards.title);
    }
    
    this.updateMasteryProgress(playerId, achievementId);
    
    this.emit('achievement:unlocked', { playerId, achievementId, achievement });
    
    this.server.io?.to(playerId).emit('achievement:unlocked', {
      achievementId,
      name: achievement.name,
      description: achievement.description,
      tier: achievement.tier,
      points: achievement.points,
      rewards: achievement.rewards
    });
    
    console.log(`🏆 Conquista desbloqueada: ${achievement.name} (${achievement.tier}) para ${playerId}`);
    return true;
  }

  async grantTitle(playerId, titleName) {
    const title = Array.from(this.titles.values()).find(t => t.name === titleName);
    if (!title) return false;
    
    const progress = this.getPlayerProgress(playerId);
    if (progress.titles.has(title.id)) return false;
    
    progress.titles.add(title.id);
    progress.stats.titlesEarned++;
    
    this.server.io?.to(playerId).emit('title:unlocked', { titleId: title.id, name: title.name });
    console.log(`🏷️ Título concedido: ${titleName} para ${playerId}`);
    return true;
  }

  async unlockCosmetic(playerId, cosmeticId) {
    const cosmetic = this.cosmetics.get(cosmeticId);
    if (!cosmetic) return false;
    
    const progress = this.getPlayerProgress(playerId);
    if (progress.cosmetics.has(cosmeticId)) return false;
    
    progress.cosmetics.add(cosmeticId);
    progress.stats.cosmeticsUnlocked++;
    
    this.server.io?.to(playerId).emit('cosmetic:unlocked', { cosmeticId, name: cosmetic.name });
    console.log(`✨ Cosmético desbloqueado: ${cosmetic.name} para ${playerId}`);
    return true;
  }

  equipCosmetic(playerId, cosmeticId, slot) {
    const progress = this.getPlayerProgress(playerId);
    if (!progress.cosmetics.has(cosmeticId)) return false;
    
    const validSlots = ['aura', 'wings', 'cape', 'trail', 'hat', 'form', 'halo', 'crown', 'armor', 'robe', 'book', 'banner'];
    if (!validSlots.includes(slot)) return false;
    
    progress.equippedCosmetics[slot] = cosmeticId;
    
    this.server.io?.to(playerId).emit('cosmetic:equipped', { cosmeticId, slot });
    return true;
  }

  updateMasteryProgress(playerId, achievementId) {
    const progress = this.getPlayerProgress(playerId);
    
    for (const [pathId, path] of this.masteryPaths) {
      if (!path.achievements.includes(achievementId)) continue;
      
      const pathProgress = progress.masteryPaths.get(pathId) || { tier: 0, progress: 0, completed: [] };
      
      if (!pathProgress.completed.includes(achievementId)) {
        pathProgress.completed.push(achievementId);
        pathProgress.progress = pathProgress.completed.length / path.achievements.length;
        
        const achievementsPerTier = Math.ceil(path.achievements.length / path.tiers);
        const tierStart = pathProgress.tier * Math.ceil(path.achievements.length / path.tiers);
        const tierEnd = Math.min(tierStart + Math.ceil(path.achievements.length / path.tiers), path.achievements.length);
        const achievementsInTier = path.achievements.slice(tierStart, tierEnd);
        
        const tierComplete = achievementsInTier.every(a => pathProgress.completed.includes(a));
        if (tierComplete && pathProgress.tier < path.tiers) {
          pathProgress.tier++;
          this.grantMasteryTierRewards(playerId, path, pathProgress.tier);
        }
        
        if (pathProgress.progress >= 1) {
          this.completeMasteryPath(playerId, pathId);
        }
      }
      
      progress.masteryPaths.set(pathId, pathProgress);
    }
  }

  async grantMasteryTierRewards(playerId, path, tier) {
    const tierRewards = path.rewards.find(r => r.tier === tier);
    if (!tierRewards) return;
    
    const rewards = tierRewards.rewards;
    if (rewards.ki) this.givePlayerKi(playerId, rewards.ki);
    if (rewards.title) await this.grantTitle(playerId, rewards.title);
    if (rewards.cosmetic) await this.unlockCosmetic(playerId, rewards.cosmetic);
    if (rewards.title) await this.grantTitle(playerId, rewards.title);
    
    this.emit('mastery:tierComplete', { playerId, pathId: path.id, tier });
    console.log(`🛤️ Tier ${tier} completado no caminho ${path.name} para ${playerId}`);
  }

  async completeMasteryPath(playerId, pathId) {
    const path = this.masteryPaths.get(pathId);
    const progress = this.getPlayerProgress(playerId);
    const pathProgress = progress.masteryPaths.get(pathId);
    
    if (!pathProgress) return;
    
    const finalReward = path.rewards.find(r => r.tier === path.tiers);
    if (finalReward) {
      const rewards = finalReward.rewards;
      if (rewards.ki) this.givePlayerKi(playerId, rewards.ki);
      if (rewards.title) await this.grantTitle(playerId, rewards.title);
      if (rewards.cosmetic) await this.unlockCosmetic(playerId, rewards.cosmetic);
    }
    
    progress.stats.masteryPathsCompleted++;
    this.emit('mastery:completed', { playerId, pathId });
    console.log(`🛤️ Caminho de maestria completado: ${this.masteryPaths.get(pathId).name} por ${playerId}`);
  }

  // ===== UTILITIES =====
  
  givePlayerKi(playerId, amount) {
    const player = this.getPlayerData(playerId);
    if (player) {
      player.resources.ki = (player.resources.ki || 0) + amount;
    }
  }

  getPlayerData(playerId) {
    const state = this.server.state;
    if (!state.players) state.players = {};
    if (!state.players[playerId]) {
      state.players[playerId] = { id: playerId, name: `Player_${playerId}`, level: 1, guildId: null, guildRank: null, guildJoinedAt: null, pendingInvites: [], resources: { madeira: 0, pedra: 0, cristal: 0, ki: 0 } };
    }
    return state.players[playerId];
  }

  // ===== LEADERBOARDS =====
  
  updateLeaderboards() {
    const leaderboards = [
      { id: 'total_points', name: 'Pontos Totais', getValue: (p) => p.stats.totalPoints },
      { id: 'achievements', name: 'Conquistas Desbloqueadas', getValue: (p) => p.stats.achievementsUnlocked },
      { id: 'total_ki', name: 'Ki Total Ganho', getValue: (p) => p.stats.totalKiEarned },
      { id: 'mastery_paths', name: 'Caminhos Completados', getValue: (p) => p.stats.masteryPathsCompleted },
      { id: 'titles', name: 'Títulos Conquistados', getValue: (p) => p.stats.titlesEarned }
    ];
    
    leaderboards.forEach(lb => {
      const rankings = Array.from(this.playerProgress.values())
        .map(p => ({ playerId: p.playerId, name: this.getPlayerName(p.playerId), value: lb.getValue(p) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 100)
        .map((p, i) => ({ rank: i + 1, ...p }));
      
      this.leaderboardCache.set(lb.id, { ...lb, rankings, updatedAt: Date.now() });
    });
  }

  getLeaderboard(leaderboardId) {
    return this.leaderboardCache.get(leaderboardId);
  }

  // ===== SEASONS =====
  
  async endSeason() {
    const oldSeason = this.currentSeason;
    const nextSeasonNumber = oldSeason.number + 1;
    const now = Date.now();
    const seasonLength = 30 * 24 * 60 * 60 * 1000;
    
    // Calculate rewards
    const rankings = Array.from(this.playerProgress.values())
      .map(p => ({ playerId: p.playerId, name: this.getPlayerName(p.playerId), points: p.stats.totalPoints }))
      .sort((a, b) => b.points - a.points);
    
    // Grant seasonal rewards
    rankings.slice(0, 100).forEach((p, i) => {
      if (i < 1) this.grantSeasonRewards(p.playerId, oldSeason.rewards.top1);
      else if (i < 3) this.grantSeasonRewards(p.playerId, oldSeason.rewards.top3);
      else if (i < 10) this.grantSeasonRewards(p.playerId, oldSeason.rewards.top10);
      else if (i < 100) this.grantSeasonRewards(p.playerId, oldSeason.rewards.top100);
      else this.grantSeasonRewards(p.playerId, oldSeason.rewards.participation);
    });
    
    // Create new season
    const newSeason = {
      id: `season_${oldSeason.number + 1}`,
      name: `Temporada ${oldSeason.number + 1}: ${this.getSeasonTheme()}`,
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      number: oldSeason.number + 1,
      theme: this.getSeasonTheme(),
      rewards: {
        participation: { ki: 10000, title: 'Veterano da Temporada ' + newSeason.number },
        top100: { ki: 50000, cosmetic: 'season' + newSeason.number + '_badge' },
        top10: { ki: 100000, title: 'Top 10 Temporada ' + newSeason.number, cosmetic: 'season' + newSeason.number + '_medal' },
        top3: { ki: 500000, title: 'Campeão da Temporada ' + newSeason.number, cosmetic: 'season' + newSeason.number + '_crown' },
        top1: { ki: 1000000, title: 'Grão-Mestre da Temporada ' + newSeason.number, cosmetic: 'season' + newSeason.number + '_legendary_form' }
      },
      active: true
    };
    
    this.currentSeason = newSeason;
    this.seasons.set(newSeason.id, newSeason);
    
    // Reset seasonal progress for all players
    for (const progress of this.playerProgress.values()) {
      progress.seasonal = {
        currentSeason: newSeason.id,
        seasonalPoints: 0,
        seasonalRank: null,
        seasonalAchievements: new Set()
      };
    }
    
    console.log(`🍂 Temporada ${oldSeason.number} finalizada. Temporada ${newSeason.number} iniciada!`);
  }
  
  getSeasonTheme() {
    const themes = [
      'diamond_awakening',
      'eternal_war',
      'cosmic_convergence',
      'eternal_love',
      'infinite_evolution',
      'timeless_harmony',
      'infinite_possibilities'
    ];
    return themes[Math.floor(Math.random() * themes.length)];
  }
  
  grantSeasonRewards(playerId, rewards) {
    if (!rewards) return;
    if (rewards.ki) this.givePlayerKi(playerId, rewards.ki);
    if (rewards.title) this.grantTitle(playerId, rewards.title);
    if (rewards.cosmetic) this.unlockCosmetic(playerId, rewards.cosmetic);
  }
  
  getSeasonRewards(rank) {
    if (!this.currentSeason) return null;
    const rewards = this.currentSeason.rewards;
    if (rank === 1) return rewards.top1;
    if (rank <= 3) return rewards.top3;
    if (rank <= 10) return rewards.top10;
    if (rank <= 100) return rewards.top100;
    return rewards.participation;
  }
  
  // ===== PUBLIC API =====
  
  getAchievement(achievementId) {
    return this.achievements.get(achievementId);
  }
  
  getAllAchievements() {
    return Array.from(this.achievements.values());
  }
  
  getAchievementsByCategory(categoryId) {
    return Array.from(this.achievements.values()).filter(a => a.category === categoryId);
  }
  
  getCategory(categoryId) {
    return this.categories.get(categoryId);
  }
  
  getAllCategories() {
    return Array.from(this.categories.values());
  }
  
  getMasteryPath(pathId) {
    return this.masteryPaths.get(pathId);
  }
  
  getAllMasteryPaths() {
    return Array.from(this.masteryPaths.values());
  }
  
  getPlayerMasteryProgress(playerId, pathId) {
    const progress = this.getPlayerProgress(playerId);
    return progress.masteryPaths.get(pathId);
  }
  
  getTitle(titleId) {
    return this.titles.get(titleId);
  }
  
  getAllTitles() {
    return Array.from(this.titles.values());
  }
  
  getCosmetic(cosmeticId) {
    return this.cosmetics.get(cosmeticId);
  }
  
  getAllCosmetics() {
    return Array.from(this.cosmetics.values());
  }
  
  getCurrentSeason() {
    return this.currentSeason;
  }
  
  getAllSeasons() {
    return Array.from(this.seasons.values());
  }
  
  getPlayerProgressSummary(playerId) {
    const progress = this.getPlayerProgress(playerId);
    return {
      playerId,
      name: this.getPlayerName(playerId),
      stats: progress.stats,
      achievements: Array.from(progress.achievements),
      titles: Array.from(progress.titles),
      activeTitle: progress.activeTitle,
      cosmetics: Array.from(progress.cosmetics),
      equippedCosmetics: progress.equippedCosmetics,
      masteryPaths: Object.fromEntries(progress.masteryPaths),
      seasonal: progress.seasonal
    };
  }
  
  getGuildProgressSummary(guildId) {
    const progress = this.getGuildProgress(guildId);
    return {
      guildId,
      name: this.guildFactionSystem?.getGuild(guildId)?.name,
      stats: progress.stats,
      achievements: Array.from(progress.achievements),
      titles: Array.from(progress.titles)
    };
  }
  
  // ===== START/STOP =====
  
  start() {
    // Check achievements every 30 seconds
    this.checkInterval = setInterval(() => {
      // This would be called from server tick with actual player data
    }, 30000);
    
    // Update leaderboards every 5 minutes
    this.leaderboardUpdateInterval = setInterval(() => {
      this.updateLeaderboards();
    }, 300000);
    
    // Check season rotation every hour
    this.seasonRotationInterval = setInterval(() => {
      if (this.currentSeason && Date.now() >= this.currentSeason.endDate) {
        this.endSeason().catch(console.error);
      }
    }, 3600000);
    
    console.log('🏆 Achievement & Mastery System iniciado!');
  }
  
  stop() {
    if (this.checkInterval) clearInterval(this.checkInterval);
    if (this.leaderboardUpdateInterval) clearInterval(this.leaderboardUpdateInterval);
    if (this.seasonRotationInterval) clearInterval(this.seasonRotationInterval);
    
    console.log('🏆 Achievement & Mastery System parado!');
  }
  
  // Helper
  getPlayerName(playerId) {
    const player = this.getPlayerData(playerId);
    return player?.name || `Player_${playerId}`;
  }
  
  getPlayerData(playerId) {
    const state = this.server.state;
    if (!state.players) state.players = {};
    if (!state.players[playerId]) {
      state.players[playerId] = { 
        id: playerId, 
        name: `Player_${playerId}`, 
        level: 1, 
        guildId: null, 
        guildRank: null, 
        guildJoinedAt: null, 
        pendingInvites: [], 
        resources: { madeira: 0, pedra: 0, cristal: 0, ki: 0 } 
      };
    }
    return state.players[playerId];
  }
}

module.exports = AchievementMasterySystem;
