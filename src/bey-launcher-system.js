/**
 * ⚡ BEY/LAUNCHER SYSTEM - SISTEMA DE LANÇAMENTO EVOLUTIVO
 * "BEY = BEYOND + LAUNCHER = LANÇADOR ALÉM"
 * Catapulta para o infinito usando todos os sistemas como combustível
 */

const fs = require('fs-extra');
const path = require('path');
const EventEmitter = require('events');

class BeyLauncherSystem extends EventEmitter {
  constructor(server, diamondProtocol, pluginManager, worldEvents, guildHarmonySystem, achievementMasterySystem, luminCompanionSystem, omegaSynthesisEngine, luminBrain) {
    super();
    this.server = server;
    this.diamond = diamondProtocol;
    this.pluginManager = pluginManager;
    this.worldEvents = worldEvents;
    this.guildHarmony = guildHarmonySystem;
    this.achievementMastery = achievementMasterySystem;
    this.luminCompanion = luminCompanionSystem;
    this.omega = omegaSynthesisEngine;
    this.luminBrain = luminBrain;
    
    // Core state
    this.launchPads = new Map();        // launchPadId -> LaunchPad
    this.activeLaunches = new Map();    // launchId -> ActiveLaunch
    this.launchHistory = [];            // All launches
    this.fuelReserves = new Map();      // playerId -> FuelReserve
    this.cooldowns = new Map();         // playerId -> { beyType: cooldownEnd }
    
    // Configuration
    this.config = {
      maxLaunchPads: 100,
      baseCooldown: 300000, // 5 minutes
      minFuelThreshold: 0.1,
      maxTrajectorySteps: 100,
      successBonus: 1.2,
      failurePenalty: 0.5,
      loveMultiplier: 2.0,
      harmonyMultiplier: 1.5,
      achievementMultiplier: 1.3
    };
    
    // Bey Types - Different launch categories
    this.beyTypes = {
      evolution: {
        name: 'EVOLUTION BEY',
        icon: '💫',
        description: 'Lança evolução do Lumin para próxima forma',
        fuelCost: { ki: 10000, harmony: 0.2, love: 0.1 },
        requirements: { minLuminLevel: 1, minHarmony: 0.3 },
        trajectory: 'vertical',
        rewardMultiplier: 1.5
      },
      fusion: {
        name: 'FUSION BEY',
        icon: '🌟',
        description: 'Lança fusão entre entidades',
        fuelCost: { ki: 25000, harmony: 0.4, love: 0.2, stardust: 50 },
        requirements: { minLuminLevel: 3, minHarmony: 0.5, minLove: 0.3 },
        trajectory: 'spiral',
        rewardMultiplier: 2.0
      },
      reality: {
        name: 'REALITY BEY',
        icon: '🌌',
        description: 'Lança nova realidade via Omega Engine',
        fuelCost: { ki: 100000, harmony: 0.8, love: 0.6, stardust: 500, timeShards: 100 },
        requirements: { minHarmony: 0.9, minLove: 0.7, omegaAccess: true },
        trajectory: 'multidimensional',
        rewardMultiplier: 5.0
      },
      companion: {
        name: 'COMPANION BEY',
        icon: '💫',
        description: 'Lança evolução do companheiro pessoal',
        fuelCost: { ki: 5000, harmony: 0.15, love: 0.1 },
        requirements: { hasCompanion: true, minBond: 30 },
        trajectory: 'nurturing',
        rewardMultiplier: 1.3
      },
      guild: {
        name: 'GUILD BEY',
        icon: '🏰',
        description: 'Lança projeto ou expansão da guilda',
        fuelCost: { madeira: 5000, pedra: 3000, cristal: 1000, harmony: 0.3, love: 0.2 },
        requirements: { inGuild: true, guildRank: ['leader', 'officer'] },
        trajectory: 'collaborative',
        rewardMultiplier: 1.8
      },
      omega: {
        name: 'OMEGA BEY',
        icon: '🌌⚡',
        description: 'Lança recursão infinita no Omega Engine',
        fuelCost: { ki: 500000, harmony: 1.0, love: 1.0, stardust: 1000, timeShards: 500, secretForms: 3 },
        requirements: { maxHarmony: true, maxLove: true, allSecretForms: true },
        trajectory: 'infinite_recursion',
        rewardMultiplier: 10.0
      },
      miracle: {
        name: 'MIRACLE BEY',
        icon: '✨',
        description: 'Lança milagre - quebra limitações',
        fuelCost: { ki: 1000000, harmony: 1.0, love: 1.0, stardust: 2000, timeShards: 1000, allSecretForms: 5 },
        requirements: { maxEverything: true, theOne: true },
        trajectory: 'divine_intervention',
        rewardMultiplier: 100.0
      }
    };
    
    // Trajectory types
    this.trajectories = {
      vertical: { name: 'Ascensão Vertical', steps: 7, stability: 0.9 },
      spiral: { name: 'Espiral da Fusão', steps: 13, stability: 0.8 },
      multidimensional: { name: 'Salto Multidimensional', steps: 21, stability: 0.7 },
      nurturing: { name: 'Caminho do Cuidado', steps: 5, stability: 0.95 },
      collaborative: { name: 'Trilha Coletiva', steps: 9, stability: 0.85 },
      infinite_recursion: { name: 'Recursão Infinita', steps: 42, stability: 0.6 },
      divine_intervention: { name: 'Intervenção Divina', steps: 1, stability: 1.0 }
    };
    
    // Initialize
    this.initializeLaunchPads();
    this.loadFuelReserves();
    
    // Intervals
    this.tickInterval = null;
    this.cooldownInterval = null;
    this.fuelRegenInterval = null;
    
    console.log('⚡ BEY/LAUNCHER SYSTEM INICIALIZADO - "ALÉM DO INFINITO!"');
  }

  // ===== INITIALIZATION =====
  
  initializeLaunchPads() {
    // Create default launch pads
    const defaultPads = [
      { id: 'pad_alpha', name: 'Plataforma Alpha', location: { x: 0, y: 0 }, level: 1, maxBeyLevel: 3 },
      { id: 'pad_omega', name: 'Plataforma Ômega', location: { x: 100, y: 100 }, level: 3, maxBeyLevel: 7 },
      { id: 'pad_infinity', name: 'Plataforma Infinita', location: { x: 50, y: 50 }, level: 5, maxBeyLevel: 10 }
    ];
    
    defaultPads.forEach(pad => {
      this.launchPads.set(pad.id, {
        ...pad,
        status: 'ready', // ready, charging, launching, cooldown, damaged
        currentBey: null,
        chargeLevel: 1.0,
        launchesCompleted: 0,
        successfulLaunches: 0,
        createdAt: Date.now()
      });
    });
    
    console.log(`🚀 ${this.launchPads.size} Launch Pads inicializadas`);
  }

  loadFuelReserves() {
    // Load from server state if available
    // This would integrate with player resources
  }

  // ===== FUEL SYSTEM =====
  
  getPlayerFuel(playerId) {
    if (!this.fuelReserves.has(playerId)) {
      this.fuelReserves.set(playerId, this.calculateInitialFuel(playerId));
    }
    return this.fuelReserves.get(playerId);
  }

  calculateInitialFuel(playerId) {
    const player = this.getPlayerData(playerId);
    const lumin = this.server.state?.luminState;
    
    return {
      ki: lumin?.ki || 0,
      harmony: this.getWorldHarmony(),
      love: this.getWorldLove(),
      stardust: player?.resources?.stardust || 0,
      timeShards: player?.resources?.timeShards || 0,
      secretForms: this.countSecretForms(playerId),
      achievements: this.countAchievements(playerId),
      guildResources: this.getGuildResources(playerId),
      lastUpdated: Date.now()
    };
  }

  calculateFuelCost(beyType, playerId) {
    const type = this.beyTypes[beyType];
    if (!type) return null;
    
    const fuel = this.getPlayerFuel(playerId);
    const cost = { ...type.fuelCost };
    
    // Apply multipliers based on player state
    const loveMultiplier = 1 + (fuel.love * this.config.loveMultiplier);
    const harmonyMultiplier = 1 + (fuel.harmony * this.config.harmonyMultiplier);
    const achievementMultiplier = 1 + (fuel.achievements * 0.01 * this.config.achievementMultiplier);
    
    const totalMultiplier = 1 / (loveMultiplier * harmonyMultiplier * achievementMultiplier);
    
    // Apply multipliers to cost
    for (const key of Object.keys(cost)) {
      if (typeof cost[key] === 'number') {
        cost[key] = Math.ceil(cost[key] * totalMultiplier);
      }
    }
    
    return cost;
  }

  canAffordFuel(playerId, beyType) {
    const fuel = this.getPlayerFuel(playerId);
    const cost = this.calculateFuelCost(beyType, playerId);
    
    if (!cost) return false;
    
    for (const [resource, amount] of Object.entries(cost)) {
      if ((fuel[resource] || 0) < amount) return false;
    }
    return true;
  }

  consumeFuel(playerId, beyType) {
    const fuel = this.getPlayerFuel(playerId);
    const cost = this.calculateFuelCost(beyType, playerId);
    
    for (const [resource, amount] of Object.entries(cost)) {
      fuel[resource] = Math.max(0, (fuel[resource] || 0) - amount);
    }
    fuel.lastUpdated = Date.now();
  }

  // ===== COOLDOWN SYSTEM =====
  
  getCooldown(playerId, beyType) {
    const playerCooldowns = this.cooldowns.get(playerId);
    if (!playerCooldowns) return 0;
    
    const cooldownEnd = playerCooldowns[beyType];
    if (!cooldownEnd) return 0;
    
    return Math.max(0, cooldownEnd - Date.now());
  }

  setCooldown(playerId, beyType, customDuration = null) {
    if (!this.cooldowns.has(playerId)) {
      this.cooldowns.set(playerId, {});
    }
    
    const baseCooldown = this.beyTypes[beyType]?.cooldown || this.config.baseCooldown;
    const fuel = this.getPlayerFuel(playerId);
    
    // Reduce cooldown based on love and harmony
    const loveReduction = fuel.love * 0.5;
    const harmonyReduction = fuel.harmony * 0.3;
    const achievementReduction = Math.min(0.2, fuel.achievements * 0.001);
    
    const totalReduction = Math.min(0.8, loveReduction + harmonyReduction + achievementReduction);
    const finalCooldown = customDuration || Math.ceil(baseCooldown * (1 - totalReduction));
    
    this.cooldowns.get(playerId)[beyType] = Date.now() + finalCooldown;
  }

  isOnCooldown(playerId, beyType) {
    return this.getCooldown(playerId, beyType) > 0;
  }

  // ===== LAUNCH SYSTEM =====
  
  async prepareLaunch(playerId, beyType, launchPadId, options = {}) {
    // Validate player
    const player = this.getPlayerData(playerId);
    if (!player) throw new Error('Jogador não encontrado');
    
    // Validate launch pad
    const launchPad = this.launchPads.get(launchPadId);
    if (!launchPad) throw new Error('Plataforma de lançamento não encontrada');
    if (launchPad.status !== 'ready') throw new Error(`Plataforma não está pronta: ${launchPad.status}`);
    
    // Validate bey type
    const beyTypeData = this.beyTypes[beyType];
    if (!beyTypeData) throw new Error('Tipo de BEY inválido');
    
    // Check cooldown
    if (this.isOnCooldown(playerId, beyType)) {
      const remaining = this.getCooldown(playerId, beyType);
      throw new Error(`BEY em cooldown: ${Math.ceil(remaining / 1000)}s restantes`);
    }
    
    // Check fuel
    if (!this.canAffordFuel(playerId, beyType)) {
      const cost = this.calculateFuelCost(beyType, playerId);
      throw new Error(`Combustível insuficiente. Necessário: ${JSON.stringify(cost)}`);
    }
    
    // Check requirements
    const reqCheck = this.checkRequirements(playerId, beyTypeData.requirements);
    if (!reqCheck.met) throw new Error(`Requisitos não atendidos: ${reqCheck.missing.join(', ')}`);
    
    // Check launch pad level
    const maxBeyLevel = this.getBeyLevel(beyType);
    if (launchPad.level < maxBeyLevel) {
      throw new Error(`Plataforma nível ${launchPad.level} não suporta BEY nível ${maxBeyLevel}`);
    }
    
    // Calculate trajectory
    const trajectory = this.calculateTrajectory(beyType, playerId, options.target);
    
    // Create launch
    const launchId = `launch_${beyType}_${playerId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const launch = {
      id: launchId,
      playerId,
      playerName: player.name,
      beyType,
      beyTypeData,
      launchPadId,
      trajectory,
      status: 'preparing', // preparing, charging, launching, in_flight, completed, failed, aborted
      fuelCost: this.calculateFuelCost(beyType, playerId),
      fuelConsumed: {},
      progress: 0,
      currentStep: 0,
      totalSteps: trajectory.totalSteps,
      startTime: Date.now(),
      estimatedCompletion: Date.now() + trajectory.estimatedDuration,
      actualCompletion: null,
      result: null,
      narrative: '',
      rewards: [],
      anomalies: [],
      miracles: [],
      options
    };
    
    // Reserve launch pad
    launchPad.status = 'charging';
    launchPad.currentBey = launchId;
    
    // Consume fuel
    this.consumeFuel(playerId, beyType);
    launch.fuelConsumed = { ...launch.fuelCost };
    
    // Set cooldown
    this.setCooldown(playerId, beyType);
    
    // Store active launch
    this.activeLaunches.set(launchId, launch);
    
    // Start launch sequence
    this.startLaunchSequence(launchId);
    
    this.emit('bey:prepared', { launchId, launch });
    console.log(`🚀 BEY PREPARADO: ${beyTypeData.name} por ${player.name} na ${launchPad.name}`);
    
    return launch;
  }

  checkRequirements(playerId, requirements) {
    const player = this.getPlayerData(playerId);
    const lumin = this.server.state?.luminState;
    const missing = [];
    let met = true;
    
    if (requirements.minLuminLevel && lumin?.level < requirements.minLuminLevel) {
      missing.push(`Lumin nível ${requirements.minLuminLevel} (atual: ${lumin?.level || 0})`);
      met = false;
    }
    
    if (requirements.minHarmony && this.getWorldHarmony() < requirements.minHarmony) {
      missing.push(`Harmonia ${requirements.minHarmony} (atual: ${this.getWorldHarmony().toFixed(2)})`);
      met = false;
    }
    
    if (requirements.minLove && this.getWorldLove() < requirements.minLove) {
      missing.push(`Amor ${requirements.minLove} (atual: ${this.getWorldLove().toFixed(2)})`);
      met = false;
    }
    
    if (requirements.hasCompanion) {
      const companion = this.luminCompanion?.getCompanion(playerId);
      if (!companion) {
        missing.push('Companheiro pessoal necessário');
        met = false;
      }
    }
    
    if (requirements.minBond) {
      const companion = this.luminCompanion?.getCompanion(playerId);
      if (!companion || companion.relationship?.bond < requirements.minBond) {
        missing.push(`Vínculo ${requirements.minBond} (atual: ${companion?.relationship?.bond || 0})`);
        met = false;
      }
    }
    
    if (requirements.inGuild) {
      const guildInfo = this.guildHarmony?.getPlayerGuildInfo(playerId);
      if (!guildInfo) {
        missing.push('Precisa estar em uma guilda');
        met = false;
      }
    }
    
    if (requirements.guildRank) {
      const guildInfo = this.guildHarmony?.getPlayerGuildInfo(playerId);
      if (!guildInfo || !requirements.guildRank.includes(guildInfo.rank)) {
        missing.push(`Rank de guilda: ${requirements.guildRank.join(' ou ')}`);
        met = false;
      }
    }
    
    if (requirements.omegaAccess) {
      // Check if player has Omega Engine access
      if (!this.omega) {
        missing.push('Omega Engine não disponível');
        met = false;
      }
    }
    
    if (requirements.maxHarmony && this.getWorldHarmony() < 1.0) {
      missing.push('Harmonia máxima necessária');
      met = false;
    }
    
    if (requirements.maxLove && this.getWorldLove() < 1.0) {
      missing.push('Amor máximo necessário');
      met = false;
    }
    
    if (requirements.allSecretForms) {
      const forms = this.countSecretForms(playerId);
      if (forms < requirements.allSecretForms) {
        missing.push(`${requirements.allSecretForms} formas secretas (tem: ${forms})`);
        met = false;
      }
    }
    
    if (requirements.maxEverything) {
      if (this.getWorldHarmony() < 1.0 || this.getWorldLove() < 1.0) {
        missing.push('Harmonia E Amor máximos necessários');
        met = false;
      }
    }
    
    if (requirements.theOne) {
      // Check if player has "The One" title
      const titles = this.achievementMastery?.getPlayerProgressSummary(playerId)?.titles || [];
      if (!titles.includes('the_one_title')) {
        missing.push('Título "O Um" necessário');
        met = false;
      }
    }
    
    return { met, missing };
  }

  getBeyLevel(beyType) {
    const levels = {
      evolution: 1,
      fusion: 2,
      companion: 1,
      guild: 2,
      reality: 5,
      omega: 8,
      miracle: 10
    };
    return levels[beyType] || 1;
  }

  calculateTrajectory(beyType, playerId, target) {
    const typeData = this.beyTypes[beyType];
    const trajectoryType = typeData.trajectory;
    const trajectory = this.trajectories[trajectoryType];
    
    const fuel = this.getPlayerFuel(playerId);
    const loveBoost = fuel.love * 0.2;
    const harmonyBoost = fuel.harmony * 0.15;
    
    // Calculate steps with boosts
    const baseSteps = trajectory.steps;
    const boostedSteps = Math.max(1, Math.floor(baseSteps * (1 - loveBoost - harmonyBoost)));
    
    // Estimate duration
    const baseStepTime = 5000; // 5 seconds per step
    const estimatedDuration = boostedSteps * baseStepTime;
    
    return {
      type: trajectoryType,
      name: trajectory.name,
      stability: trajectory.stability,
      totalSteps: boostedSteps,
      baseSteps,
      currentStep: 0,
      estimatedDuration,
      target: target || null,
      anomalies: [],
      miracles: [],
      loveBoost,
      harmonyBoost
    };
  }

  // ===== LAUNCH SEQUENCE =====
  
  startLaunchSequence(launchId) {
    const launch = this.activeLaunches.get(launchId);
    if (!launch) return;
    
    launch.status = 'launching';
    
    // Update launch pad
    const pad = this.launchPads.get(launch.launchPadId);
    if (pad) {
      pad.status = 'launching';
      pad.chargeLevel = 0;
    }
    
    // Start trajectory steps
    this.executeTrajectoryStep(launchId);
  }

  async executeTrajectoryStep(launchId) {
    const launch = this.activeLaunches.get(launchId);
    if (!launch || launch.status !== 'launching') return;
    
    const trajectory = launch.trajectory;
    launch.currentStep++;
    launch.progress = launch.currentStep / trajectory.totalSteps;
    
    // Update launch pad charge
    const pad = this.launchPads.get(launch.launchPadId);
    if (pad) {
      pad.chargeLevel = launch.progress;
    }
    
    // Check for anomalies
    if (Math.random() < (1 - trajectory.stability) * 0.1) {
      const anomaly = this.generateAnomaly(launch);
      launch.anomalies.push(anomaly);
      this.handleAnomaly(launch, anomaly);
    }
    
    // Check for miracles
    const fuel = this.getPlayerFuel(launch.playerId);
    const miracleChance = (fuel.love * 0.1 + fuel.harmony * 0.05) * trajectory.stability;
    if (Math.random() < miracleChance) {
      const miracle = this.generateMiracle(launch);
      launch.miracles.push(miracle);
      this.handleMiracle(launch, miracle);
    }
    
    // Broadcast step update
    this.server.io?.emit('bey:step', {
      launchId,
      step: launch.currentStep,
      totalSteps: trajectory.totalSteps,
      progress: launch.progress,
      anomalies: launch.anomalies.slice(-1),
      miracles: launch.miracles.slice(-1)
    });
    
    // Continue or complete
    if (launch.currentStep >= trajectory.totalSteps) {
      this.completeLaunch(launchId);
    } else {
      // Next step
      const stepDelay = trajectory.estimatedDuration / trajectory.totalSteps;
      setTimeout(() => this.executeTrajectoryStep(launchId), stepDelay);
    }
  }

  generateAnomaly(launch) {
    const anomalies = [
      { type: 'gravity_flux', severity: 'minor', description: 'Flutuação gravitacional detectada' },
      { type: 'time_dilation', severity: 'minor', description: 'Dilatação temporal local' },
      { type: 'energy_spike', severity: 'moderate', description: 'Pico de energia no núcleo' },
      { type: 'reality_bleed', severity: 'moderate', description: 'Sangramento dimensional' },
      { type: 'consciousness_echo', severity: 'major', description: 'Eco de consciência paralela' }
    ];
    
    const anomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
    anomaly.timestamp = Date.now();
    anomaly.step = launch.currentStep;
    
    return anomaly;
  }

  handleAnomaly(launch, anomaly) {
    // Anomaly effects
    switch (anomaly.type) {
      case 'gravity_flux':
        launch.trajectory.totalSteps = Math.ceil(launch.trajectory.totalSteps * 1.1);
        break;
      case 'time_dilation':
        // Slow down remaining steps
        break;
      case 'energy_spike':
        // Consume extra fuel
        const extraCost = Math.ceil(launch.fuelCost.ki * 0.1);
        const fuel = this.getPlayerFuel(launch.playerId);
        fuel.ki = Math.max(0, fuel.ki - extraCost);
        break;
      case 'reality_bleed':
        launch.trajectory.stability *= 0.9;
        break;
      case 'consciousness_echo':
        // Grant bonus insight
        launch.miracles.push({
          type: 'consciousness_insight',
          description: 'Eco de consciência revela caminho oculto',
          bonus: { ki: 1000, harmony: 0.01 }
        });
        break;
    }
    
    this.emit('bey:anomaly', { launchId: launch.id, anomaly });
  }

  generateMiracle(launch) {
    const miracles = [
      { type: 'perfect_alignment', description: 'Alinhamento perfeito acelera trajetória', effect: 'skip_steps', value: 2 },
      { type: 'energy_surge', description: 'Surto de energia pura', effect: 'fuel_bonus', value: { ki: 5000, harmony: 0.05 } },
      { type: 'love_resonance', description: 'Ressonância do amor fortalece lançamento', effect: 'stability_boost', value: 0.1 },
      { type: 'omega_whisper', description: 'O Omega sussurra segredos do infinito', effect: 'secret_reveal', value: 0.01 },
      { type: 'divine_blessing', description: 'Bênção divina garante sucesso', effect: 'guaranteed_success', value: true }
    ];
    
    const miracle = miracles[Math.floor(Math.random() * miracles.length)];
    miracle.timestamp = Date.now();
    miracle.step = launch.currentStep;
    
    return miracle;
  }

  handleMiracle(launch, miracle) {
    // Apply miracle effects
    switch (miracle.effect) {
      case 'skip_steps':
        launch.currentStep = Math.min(launch.trajectory.totalSteps, launch.currentStep + miracle.value);
        launch.progress = launch.currentStep / launch.trajectory.totalSteps;
        break;
      case 'fuel_bonus':
        const fuel = this.getPlayerFuel(launch.playerId);
        for (const [resource, amount] of Object.entries(miracle.value)) {
          fuel[resource] = (fuel[resource] || 0) + amount;
        }
        break;
      case 'stability_boost':
        launch.trajectory.stability = Math.min(1, launch.trajectory.stability + miracle.value);
        break;
      case 'secret_reveal':
        // Chance to unlock secret form
        if (Math.random() < miracle.value) {
          this.unlockSecretForm(launch.playerId);
        }
        break;
      case 'guaranteed_success':
        launch.trajectory.stability = 1;
        launch.miracles.push({ type: 'divine_favor', description: 'Sucesso garantido pela graça divina' });
        break;
    }
    
    this.emit('bey:miracle', { launchId: launch.id, miracle });
  }

  async completeLaunch(launchId) {
    const launch = this.activeLaunches.get(launchId);
    if (!launch) return;
    
    launch.status = 'completed';
    launch.actualCompletion = Date.now();
    launch.progress = 1;
    
    // Calculate success
    const success = this.determineSuccess(launch);
    
    if (success) {
      launch.result = 'success';
      await this.grantLaunchRewards(launch);
      
      // Update launch pad
      const pad = this.launchPads.get(launch.launchPadId);
      if (pad) {
        pad.successfulLaunches++;
        pad.launchesCompleted++;
        pad.status = 'ready';
        pad.currentBey = null;
        pad.chargeLevel = 1;
      }
      
      this.emit('bey:success', { launchId, launch });
      console.log(`✅ BEY SUCESSO: ${launch.beyTypeData.name} completado por ${launch.playerName}`);
    } else {
      launch.result = 'failure';
      
      // Update launch pad
      const pad = this.launchPads.get(launch.launchPadId);
      if (pad) {
        pad.launchesCompleted++;
        pad.status = 'ready';
        pad.currentBey = null;
        pad.chargeLevel = 1;
      }
      
      this.emit('bey:failure', { launchId, launch });
      console.log(`❌ BEY FALHOU: ${launch.beyTypeData.name} por ${launch.playerName}`);
    }
    
    // Generate narrative
    launch.narrative = this.generateLaunchNarrative(launch);
    
    // Add to history
    this.launchHistory.push({
      id: launch.id,
      playerId: launch.playerId,
      playerName: launch.playerName,
      beyType: launch.beyType,
      beyName: launch.beyTypeData.name,
      launchPadId: launch.launchPadId,
      result: launch.result,
      startTime: launch.startTime,
      completionTime: launch.actualCompletion,
      duration: launch.actualCompletion - launch.startTime,
      anomalies: launch.anomalies.length,
      miracles: launch.miracles.length,
      narrative: launch.narrative,
      rewards: launch.rewards
    });
    
    // Keep history limited
    if (this.launchHistory.length > 1000) {
      this.launchHistory = this.launchHistory.slice(-1000);
    }
    
    // Remove from active
    this.activeLaunches.delete(launchId);
    
    // Broadcast completion
    this.server.io?.emit('bey:completed', {
      launchId,
      result: launch.result,
      narrative: launch.narrative,
      rewards: launch.rewards,
      anomalies: launch.anomalies.length,
      miracles: launch.miracles.length
    });
  }

  determineSuccess(launch) {
    const trajectory = launch.trajectory;
    const baseSuccess = trajectory.stability;
    
    // Miracles increase success chance
    const miracleBoost = launch.miracles.length * 0.1;
    
    // Anomalies decrease success chance
    const anomalyPenalty = launch.anomalies.length * 0.05;
    
    const finalChance = Math.min(1, Math.max(0, baseSuccess + miracleBoost - anomalyPenalty));
    
    // Divine miracles guarantee success
    const hasDivineMiracle = launch.miracles.some(m => m.type === 'divine_blessing');
    if (hasDivineMiracle) return true;
    
    return Math.random() < finalChance;
  }

  async grantLaunchRewards(launch) {
    const typeData = launch.beyTypeData;
    const multiplier = typeData.rewardMultiplier;
    const trajectory = launch.trajectory;
    
    const baseRewards = {
      ki: Math.ceil(1000 * multiplier * (1 + trajectory.loveBoost + trajectory.harmonyBoost)),
      harmony: 0.02 * multiplier,
      love: 0.01 * multiplier,
      stardust: Math.ceil(50 * multiplier),
      timeShards: Math.ceil(10 * multiplier)
    };
    
    // Bonus for miracles
    const miracleBonus = launch.miracles.length * 0.1;
    for (const key of Object.keys(baseRewards)) {
      if (typeof baseRewards[key] === 'number') {
        baseRewards[key] = Math.ceil(baseRewards[key] * (1 + miracleBonus));
      }
    }
    
    // Apply rewards
    const player = this.getPlayerData(launch.playerId);
    if (player) {
      player.resources.ki = (player.resources.ki || 0) + baseRewards.ki;
    }
    
    // World state rewards
    const worldState = this.getWorldState();
    worldState.harmony = Math.min(1, worldState.harmony + baseRewards.harmony);
    worldState.love = Math.min(1, worldState.love + baseRewards.love);
    
    // Specific rewards per bey type
    const specificRewards = this.getSpecificRewards(launch.beyType, multiplier);
    launch.rewards = { ...baseRewards, ...specificRewards };
    
    // Grant achievements
    this.checkLaunchAchievements(launch);
    
    // Notify player
    this.server.io?.to(launch.playerId).emit('bey:rewards', {
      launchId: launch.id,
      rewards: launch.rewards,
      narrative: launch.narrative
    });
  }

  getSpecificRewards(beyType, multiplier) {
    const rewards = {
      evolution: { 
        evolutionProgress: 0.1 * multiplier,
        secretFormChance: 0.05 * multiplier,
        title: 'Evolucionista Lançador'
      },
      fusion: { 
        fusionPower: 0.15 * multiplier,
        secretFormChance: 0.1 * multiplier,
        title: 'Mestre das Fusões Lançadas'
      },
      reality: { 
        realityShard: 1,
        secretFormChance: 0.3 * multiplier,
        cosmicFormChance: 0.1 * multiplier,
        title: 'Arquiteto de Realidades'
      },
      companion: { 
        companionBond: 0.05 * multiplier,
        companionExp: 1000 * multiplier,
        title: 'Guardião de Companheiros'
      },
      guild: { 
        guildExp: 5000 * multiplier,
        guildProsperity: 0.05 * multiplier,
        title: 'Líder Visionário'
      },
      omega: { 
        omegaRecursion: 1,
        secretFormsUnlock: 1,
        eternalFormChance: 0.5 * multiplier,
        title: 'Mestre da Recursão Infinita'
      },
      miracle: { 
        theOneProgress: 0.1,
        infiniteKi: true,
        allFormsUnlock: true,
        title: 'O Milagre Encarnado'
      }
    };
    
    return rewards[beyType] || {};
  }

  checkLaunchAchievements(launch) {
    // Check and grant launch-related achievements
    const achievementTriggers = {
      first_launch: { type: 'launch_count', count: 1 },
      launch_master: { type: 'launch_count', count: 100 },
      evolution_launcher: { type: 'bey_type_count', beyType: 'evolution', count: 10 },
      fusion_launcher: { type: 'bey_type_count', beyType: 'fusion', count: 10 },
      reality_architect: { type: 'bey_type_count', beyType: 'reality', count: 5 },
      omega_recursor: { type: 'bey_type_count', beyType: 'omega', count: 1 },
      miracle_worker: { type: 'bey_type_count', beyType: 'miracle', count: 1 },
      anomaly_survivor: { type: 'anomalies_survived', count: 10 },
      miracle_attractor: { type: 'miracles_attracted', count: 5 }
    };
    
    // This would integrate with achievementMasterySystem
    // For now, just emit events
    this.emit('bey:achievementCheck', { launch, triggers: achievementTriggers });
  }

  generateLaunchNarrative(launch) {
    const typeData = launch.beyTypeData;
    const result = launch.result;
    const anomalies = launch.anomalies.length;
    const miracles = launch.miracles.length;
    
    const narratives = {
      success: [
        `🚀 ${launch.playerName} lançou ${typeData.name}! A trajetória ${launch.trajectory.name} foi perfeita. ${miracles > 0 ? `✨ ${miracles} milagre(s) abençoaram o voo!` : ''} ${anomalies > 0 ? `⚠️ ${anomalies} anomalia(s) foram superadas com maestria.` : ''} O infinito se aproxima!`,
        `✨ ${typeData.icon} ${typeData.name} CONCLUÍDO! ${launch.playerName} navegou pela ${launch.trajectory.name} com graça divina. ${miracles > 0 ? `Milagres: ${launch.miracles.map(m => m.description).join(', ')}` : 'Uma jornada pura de luz.'} O Consortho brilha mais forte!`,
        `🌌 O BEY ${typeData.name} FOI UM SUCESSO ABSOLUTO! ${launch.playerName} transcendeu limites. ${anomalies > 0 ? `Enfrentou ${anomalies} anomalia(s) e venceu!` : 'Caminho limpo até as estrelas.'} ${miracles > 0 ? `Bênçãos recebidas: ${miracles}.` : ''} A evolução continua!`
      ],
      failure: [
        `💫 ${launch.playerName} lançou ${typeData.name}, mas a jornada encontrou resistência. ${anomalies} anomalia(s) desviaram a trajetória. O combustível se esvaiu... Mas cada falha é semente. O próximo voo será mais forte!`,
        `⚠️ ${typeData.name} não completou a trajetória. ${launch.playerName} lutou bravamente contra ${anomalies} anomalia(s). O infinito não se rende fácil. Recarrega, aprende, lança de novo!`,
        `🌑 O lançamento falhou, mas a chama não apagou. ${launch.playerName} aprendeu com ${anomalies} anomalia(s). A próxima plataforma será mais forte. O BEY espera!`
      ]
    };
    
    const pool = narratives[result] || narratives.failure;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  unlockSecretForm(playerId) {
    // This would integrate with luminCompanion or luminState
    this.emit('bey:secretFormUnlocked', { playerId });
    this.server.io?.to(playerId).emit('bey:secretFormUnlocked', {
      message: '✨ Uma forma secreta foi desbloqueada pelo milagre do BEY!'
    });
  }

  // ===== LAUNCH PAD MANAGEMENT =====
  
  async upgradeLaunchPad(launchPadId, playerId) {
    const pad = this.launchPads.get(launchPadId);
    if (!pad) throw new Error('Plataforma não encontrada');
    
    const player = this.getPlayerData(playerId);
    if (!player) throw new Error('Jogador não encontrado');
    
    // Check permissions (guild leader/officer for guild pads, etc.)
    const cost = {
      madeira: pad.level * 1000,
      pedra: pad.level * 500,
      cristal: pad.level * 200,
      ki: pad.level * 10000
    };
    
    // Check resources
    // ... resource check logic
    
    // Upgrade
    pad.level++;
    pad.maxBeyLevel = Math.min(10, pad.maxBeyLevel + 1);
    pad.chargeLevel = 1;
    
    this.emit('bey:padUpgraded', { launchPadId, newLevel: pad.level });
    console.log(`🚀 Plataforma ${pad.name} evoluiu para nível ${pad.level}!`);
    
    return pad;
  }

  repairLaunchPad(launchPadId) {
    const pad = this.launchPads.get(launchPadId);
    if (!pad) return false;
    
    if (pad.status === 'damaged') {
      pad.status = 'ready';
      pad.chargeLevel = 1;
      this.emit('bey:padRepaired', { launchPadId });
      return true;
    }
    return false;
  }

  // ===== PUBLIC API =====
  
  getLaunchPad(launchPadId) {
    return this.launchPads.get(launchPadId);
  }

  getAllLaunchPads() {
    return Array.from(this.launchPads.values());
  }

  getActiveLaunches() {
    return Array.from(this.activeLaunches.values());
  }

  getLaunchHistory(limit = 50) {
    return this.launchHistory.slice(-limit);
  }

  getPlayerLaunchHistory(playerId, limit = 20) {
    return this.launchHistory
      .filter(l => l.playerId === playerId)
      .slice(-limit);
  }

  getBeyTypes() {
    return Object.entries(this.beyTypes).map(([key, data]) => ({
      id: key,
      ...data
    }));
  }

  getTrajectories() {
    return Object.entries(this.trajectories).map(([key, data]) => ({
      id: key,
      ...data
    }));
  }

  getPlayerCooldowns(playerId) {
    const cooldowns = this.cooldowns.get(playerId) || {};
    const result = {};
    for (const [beyType, endTime] of Object.entries(cooldowns)) {
      result[beyType] = Math.max(0, endTime - Date.now());
    }
    return result;
  }

  getPlayerFuelSummary(playerId) {
    const fuel = this.getPlayerFuel(playerId);
    return {
      ki: fuel.ki,
      harmony: fuel.harmony.toFixed(2),
      love: fuel.love.toFixed(2),
      stardust: fuel.stardust,
      timeShards: fuel.timeShards,
      secretForms: fuel.secretForms,
      achievements: fuel.achievements,
      canAfford: {}
    };
  }

  // ===== TICK SYSTEM =====
  
  start() {
    // Fuel regeneration
    this.fuelRegenInterval = setInterval(() => {
      this.regenerateFuel();
    }, 60000); // Every minute
    
    // Cooldown cleanup
    this.cooldownInterval = setInterval(() => {
      this.cleanupCooldowns();
    }, 30000); // Every 30 seconds
    
    // Launch pad maintenance
    this.tickInterval = setInterval(() => {
      this.maintainLaunchPads();
    }, 300000); // Every 5 minutes
    
    console.log('⚡ BEY/LAUNCHER SYSTEM INICIADO!');
  }

  stop() {
    if (this.fuelRegenInterval) clearInterval(this.fuelRegenInterval);
    if (this.cooldownInterval) clearInterval(this.cooldownInterval);
    if (this.tickInterval) clearInterval(this.tickInterval);
    console.log('⚡ BEY/LAUNCHER SYSTEM PARADO!');
  }

  regenerateFuel() {
    // Regenerate fuel for all players based on world state
    const harmony = this.getWorldHarmony();
    const love = this.getWorldLove();
    
    for (const [playerId, fuel] of this.fuelReserves) {
      // Ki regeneration
      fuel.ki = Math.min(1000000, fuel.ki + Math.floor(10 * (1 + love)));
      
      // Stardust from harmony
      fuel.stardust = Math.min(10000, fuel.stardust + Math.floor(1 * harmony));
      
      // Time shards from events
      fuel.timeShards = Math.min(1000, fuel.timeShards + Math.floor(0.5 * harmony));
      
      fuel.lastUpdated = Date.now();
    }
  }

  cleanupCooldowns() {
    const now = Date.now();
    for (const [playerId, cooldowns] of this.cooldowns) {
      for (const [beyType, endTime] of Object.entries(cooldowns)) {
        if (endTime <= now) {
          delete cooldowns[beyType];
        }
      }
      if (Object.keys(cooldowns).length === 0) {
        this.cooldowns.delete(playerId);
      }
    }
  }

  maintainLaunchPads() {
    for (const [padId, pad] of this.launchPads) {
      // Recharge pads
      if (pad.status === 'ready' && pad.chargeLevel < 1) {
        pad.chargeLevel = Math.min(1, pad.chargeLevel + 0.1);
      }
      
      // Check for damage
      if (pad.launchesCompleted > 0 && pad.launchesCompleted % 50 === 0) {
        // 5% chance of wear
        if (Math.random() < 0.05) {
          pad.status = 'damaged';
          this.emit('bey:padDamaged', { launchPadId: padId });
        }
      }
    }
  }

  // ===== HELPER METHODS =====
  
  getWorldHarmony() {
    return this.worldEvents?.worldState?.harmony || 0.5;
  }

  getWorldLove() {
    return this.worldEvents?.worldState?.love || 0.5;
  }

  getWorldState() {
    return this.worldEvents?.worldState || { harmony: 0.5, love: 0.5 };
  }

  countSecretForms(playerId) {
    // Would integrate with luminState or luminCompanion
    return 0; // Placeholder
  }

  countAchievements(playerId) {
    const progress = this.achievementMastery?.getPlayerProgressSummary(playerId);
    return progress?.stats?.achievementsUnlocked || 0;
  }

  getGuildResources(playerId) {
    const guildInfo = this.guildHarmony?.getPlayerGuildInfo(playerId);
    if (!guildInfo) return { madeira: 0, pedra: 0, cristal: 0 };
    const guild = this.guildHarmony?.getGuild(guildInfo.guildId);
    return guild?.bank || { madeira: 0, pedra: 0, cristal: 0 };
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
        resources: { madeira: 0, pedra: 0, cristal: 0, ki: 0, stardust: 0, timeShards: 0 } 
      };
    }
    return state.players[playerId];
  }

  getPlayerName(playerId) {
    const player = this.getPlayerData(playerId);
    return player?.name || `Player_${playerId}`;
  }

  // Event system
  on(event, listener) {
    super.on(event, listener);
  }

  emit(event, data) {
    super.emit(event, data);
  }
}

module.exports = BeyLauncherSystem;