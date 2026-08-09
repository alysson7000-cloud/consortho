/**
 * 💎 GUILD & HARMONY SYSTEM - SISTEMA DE GUILDAS E HARMONIA COLETIVA
 * Sistema completo de guildas, territórios, economia, alianças, cooperação e prosperidade compartilhada
 * SÓ COISA BOA, SÓ AMOR, INFINITAMENTE BOM!
 */

const fs = require('fs-extra');
const path = require('path');
const EventEmitter = require('events');

class GuildHarmonySystem extends EventEmitter {
  constructor(server, diamondProtocol, pluginManager, worldEvents) {
    super();
    this.server = server;
    this.diamond = diamondProtocol;
    this.pluginManager = pluginManager;
    this.worldEvents = worldEvents;
    
    // Core data structures
    this.guilds = new Map();           // guildId -> Guild
    this.harmonies = new Map();        // harmonyId -> Harmony (coalitions of guilds)
    this.territories = new Map();      // territoryId -> Territory
    this.players = new Map();          // playerId -> PlayerGuildData
    this.treaties = new Map();         // treatyId -> Treaty
    this.economy = new Map();          // market, trades, auctions
    this.sharedProjects = new Map();   // projectId -> SharedProject
    
    // Configuration
    this.config = {
      minGuildMembers: 3,
      maxGuildMembers: 100,
      territoryClaimCost: { madeira: 500, pedra: 300, cristal: 100 },
      territoryUpkeep: { madeira: 10, pedra: 5, cristal: 2 },
      allianceCost: { cristal: 100 },
      harmonyTreatyCost: { cristal: 500 },
      maxTerritoriesPerGuild: 10,
      allianceCooldown: 86400000,
      territoryClaimTime: 1800000, // 30 min
      harmonyTreatyDuration: 604800000, // 7 days
      maxAlliesPerGuild: 10,
      maxHarmonyMembers: 20,
      sharedProjectBonus: 2.0
    };
    
    // Territory grid (100x100 world)
    this.worldGrid = {
      width: 100,
      height: 100,
      cellSize: 10,
      territories: new Map()
    };
    
    // Initialize territory grid
    this.initializeTerritoryGrid();
    
    // Intervals
    this.tickInterval = null;
    this.upkeepInterval = null;
    this.harmonyTickInterval = null;
    this.economyTickInterval = null;
    this.sharedProjectInterval = null;
    
    console.log('🏰 Guild & Harmony System inicializado - SÓ AMOR E COOPERAÇÃO!');
  }

  // ===== TERRITORY GRID =====
  
  initializeTerritoryGrid() {
    const cellSize = this.worldGrid.cellSize;
    
    for (let gx = 0; gx < this.worldGrid.width / cellSize; gx++) {
      for (let gy = 0; gy < this.worldGrid.height / cellSize; gy++) {
        const territoryId = `t_${gx}_${gy}`;
        const territory = {
          id: territoryId,
          gridX: gx,
          gridY: gy,
          x: gx * 10,
          y: gy * 10,
          width: 10,
          height: 10,
          owner: null,
          steward: null, // guildId currently stewarding
          claimProgress: 0,
          claimGuild: null,
          claimStartTime: null,
          enhancements: {
            gardens: 0,
            libraries: 0,
            workshops: 0,
            temples: 0,
            sanctuaries: 0
          },
          resources: {
            madeira: Math.floor(Math.random() * 100),
            pedra: Math.floor(Math.random() * 100),
            cristal: Math.floor(Math.random() * 50)
          },
          resourceRegen: {
            madeira: Math.floor(Math.random() * 5) + 1,
            pedra: Math.floor(Math.random() * 3) + 1,
            cristal: Math.floor(Math.random() * 2)
          },
          prosperity: 0.5,
          harmony: 0.5,
          beauty: 0.5,
          discoveries: [],
          blessings: [],
          lastHarvest: Date.now()
        };
        
        this.territories.set(territoryId, territory);
        this.worldGrid.territories.set(territoryId, territory);
      }
    }
    
    console.log(`🗺️ Grade de territórios inicializada: ${this.territories.size} territórios`);
  }

  // ===== GUILD MANAGEMENT =====
  
  async createGuild(playerId, name, tag, description = '') {
    const playerData = this.getPlayerGuildData(playerId);
    if (playerData.guildId) throw new Error('Você já faz parte de uma guilda');
    
    const guildId = `guild_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const guild = {
      id: guildId,
      name,
      tag: tag.toUpperCase(),
      description,
      leader: playerId,
      officers: [],
      members: new Map([[playerId, { role: 'leader', joinedAt: Date.now(), contribution: 0 }]]),
      bank: { madeira: 0, pedra: 0, cristal: 0, ki: 0, stardust: 0 },
      territories: [],
      allies: [],
      harmonies: [],
      treaties: [],
      sharedProjects: [],
      stats: {
        createdAt: Date.now(),
        totalMembers: 1,
        peakMembers: 1,
        territoriesClaimed: 0,
        alliancesFormed: 0,
        harmonyTreaties: 0,
        resourcesGathered: { madeira: 0, pedra: 0, cristal: 0, ki: 0 },
        resourcesShared: { madeira: 0, pedra: 0, cristal: 0, ki: 0 },
        projectsCompleted: 0,
        prosperityGenerated: 0,
        harmonyGenerated: 0,
        loveGenerated: 0
      },
      level: 1,
      experience: 0,
      experienceToNext: 10000,
      perks: {
        resourceBonus: 1.0,
        claimSpeed: 1.0,
        harmonyBonus: 1.0,
        projectSpeed: 1.0,
        maxMembers: this.config.maxGuildMembers
      },
      culture: {
        values: [],
        traditions: [],
        rituals: [],
        motto: '',
        anthem: ''
      },
      logs: [],
      lastActive: Date.now()
    };
    
    this.guilds.set(guildId, guild);
    playerData.guildId = guildId;
    playerData.guildRank = 'leader';
    playerData.guildJoinedAt = Date.now();
    
    this.addGuildLog(guildId, 'created', `Guilda ${name} [${tag}] fundada por ${this.getPlayerName(playerId)}`, playerId);
    
    console.log(`🏰 Guilda criada: ${name} [${tag}] por ${this.getPlayerName(playerId)}`);
    this.emit('guild:created', { guildId, guild });
    
    return guild;
  }

  async invitePlayer(guildId, inviterId, targetPlayerId) {
    const guild = this.guilds.get(guildId);
    if (!guild) throw new Error('Guilda não encontrada');
    
    const inviterData = this.getPlayerGuildData(inviterId);
    if (inviterData.guildId !== guildId) throw new Error('Você não é membro desta guilda');
    if (!['leader', 'officer'].includes(inviterData.guildRank)) throw new Error('Apenas líderes e oficiais podem convidar');
    
    const targetData = this.getPlayerGuildData(targetPlayerId);
    if (targetData.guildId) throw new Error('Jogador já está em uma guilda');
    if (guild.members.size >= guild.perks.maxMembers) throw new Error('Guilda cheia');
    
    targetData.pendingInvites = targetData.pendingInvites || [];
    targetData.pendingInvites.push({
      guildId,
      guildName: guild.name,
      guildTag: guild.tag,
      invitedBy: inviterId,
      invitedAt: Date.now(),
      expiresAt: Date.now() + 86400000 // 24h
    });
    
    this.server.io?.to(targetPlayerId).emit('guild:invite', {
      guildId,
      guildName: guild.name,
      guildTag: guild.tag,
      invitedBy: this.getPlayerName(inviterId)
    });
    
    this.addGuildLog(guildId, 'invite_sent', `Convite enviado para ${this.getPlayerName(targetPlayerId)}`, inviterId);
    return true;
  }

  async acceptInvite(playerId, guildId) {
    const playerData = this.getPlayerGuildData(playerId);
    const invite = playerData.pendingInvites?.find(i => i.guildId === guildId);
    if (!invite) throw new Error('Convite não encontrado');
    if (Date.now() > invite.expiresAt) throw new Error('Convite expirado');
    
    const guild = this.guilds.get(guildId);
    if (!guild) throw new Error('Guilda não encontrada');
    if (guild.members.size >= guild.perks.maxMembers) throw new Error('Guilda cheia');
    
    // Remove from other invites
    playerData.pendingInvites = playerData.pendingInvites.filter(i => i.guildId !== guildId);
    
    // Add to guild
    guild.members.set(playerId, { role: 'member', joinedAt: Date.now(), contribution: 0 });
    playerData.guildId = guildId;
    playerData.guildRank = 'member';
    playerData.guildJoinedAt = Date.now();
    
    guild.stats.totalMembers = guild.members.size;
    guild.stats.peakMembers = Math.max(guild.stats.peakMembers, guild.members.size);
    
    this.addGuildLog(guildId, 'member_joined', `${this.getPlayerName(playerId)} juntou-se à guilda!`, playerId);
    
    // Notify guild
    this.broadcastToGuild(guildId, 'guild:memberJoined', {
      playerId,
      playerName: this.getPlayerName(playerId),
      guildName: guild.name
    });
    
    this.emit('guild:memberJoined', { guildId, playerId });
    return true;
  }

  async leaveGuild(playerId) {
    const playerData = this.getPlayerGuildData(playerId);
    const guildId = playerData.guildId;
    if (!guildId) throw new Error('Você não está em uma guilda');
    
    const guild = this.guilds.get(guildId);
    if (!guild) throw new Error('Guilda não encontrada');
    
    // If leader, transfer leadership or disband
    if (playerData.guildRank === 'leader') {
      if (guild.members.size > 1) {
        // Find next officer or oldest member
        let newLeader = null;
        for (const [id, data] of guild.members) {
          if (id !== playerId && data.role === 'officer') {
            newLeader = id;
            break;
          }
        }
        if (!newLeader) {
          for (const [id, data] of guild.members) {
            if (id !== playerId) {
              newLeader = id;
              break;
            }
          }
        }
        if (newLeader) {
          guild.members.get(newLeader).role = 'leader';
          this.getPlayerGuildData(newLeader).guildRank = 'leader';
          this.addGuildLog(guildId, 'leadership_transfer', `Liderança transferida para ${this.getPlayerName(newLeader)}`, newLeader);
        }
      } else {
        // Disband guild
        await this.disbandGuild(guildId);
        return { disbanded: true };
      }
    }
    
    // Remove member
    guild.members.delete(playerId);
    playerData.guildId = null;
    playerData.guildRank = null;
    playerData.guildJoinedAt = null;
    
    guild.stats.totalMembers = guild.members.size;
    
    this.addGuildLog(guildId, 'member_left', `${this.getPlayerName(playerId)} deixou a guilda`, playerId);
    this.broadcastToGuild(guildId, 'guild:memberLeft', { playerId, playerName: this.getPlayerName(playerId) });
    
    this.emit('guild:memberLeft', { guildId, playerId });
    return { disbanded: false };
  }

  async disbandGuild(guildId) {
    const guild = this.guilds.get(guildId);
    if (!guild) return;
    
    // Return territories
    for (const territoryId of guild.territories) {
      await this.abandonTerritory(guildId, territoryId);
    }
    
    // End all alliances
    for (const allyId of guild.allies) {
      await this.endAlliance(guildId, allyId, 'disbanded');
    }
    
    // End harmonies
    for (const harmonyId of guild.harmonies) {
      await this.endHarmony(harmonyId, guildId, 'disbanded');
    }
    
    // Notify all members
    for (const [memberId] of guild.members) {
      const memberData = this.getPlayerGuildData(memberId);
      memberData.guildId = null;
      memberData.guildRank = null;
      memberData.guildJoinedAt = null;
    }
    
    this.guilds.delete(guildId);
    this.emit('guild:disbanded', { guildId, name: guild.name });
    console.log(`🏰 Guilda dissolvida: ${guild.name}`);
  }

  // ===== TERRITORY SYSTEM =====
  
  async claimTerritory(guildId, territoryId) {
    const guild = this.guilds.get(guildId);
    const territory = this.territories.get(territoryId);
    
    if (!guild) throw new Error('Guilda não encontrada');
    if (!territory) throw new Error('Território não encontrado');
    if (territory.owner) throw new Error('Território já possui guardião');
    if (guild.territories.length >= guild.perks.maxTerritories) throw new Error('Limite de territórios atingido');
    
    // Check resources
    if (!this.hasGuildResources(guildId, this.config.territoryClaimCost)) {
      throw new Error('Recursos insuficientes para reivindicar território');
    }
    
    this.consumeGuildResources(guildId, this.config.territoryClaimCost);
    
    territory.claimGuild = guildId;
    territory.claimStartTime = Date.now();
    territory.claimProgress = 0;
    
    this.addGuildLog(guildId, 'territory_claim_started', `Iniciada reivindicação do território ${territoryId}`, guild.leader);
    this.emit('territory:claimStarted', { guildId, territoryId });
    
    return true;
  }

  async completeTerritoryClaim(guildId, territoryId) {
    const guild = this.guilds.get(guildId);
    const territory = this.territories.get(territoryId);
    
    if (!guild || !territory) return false;
    if (territory.claimGuild !== guildId) return false;
    
    territory.owner = guildId;
    territory.steward = guildId;
    territory.claimGuild = null;
    territory.claimStartTime = null;
    territory.claimProgress = 0;
    
    guild.territories.push(territoryId);
    guild.stats.territoriesClaimed++;
    
    this.addGuildLog(guildId, 'territory_claimed', `Território ${territoryId} agora é cuidado pela guilda!`, guild.leader);
    
    // Apply territory bonuses
    this.applyTerritoryBonuses(territory, guild);
    
    this.emit('territory:claimed', { guildId, territoryId });
    return true;
  }

  async abandonTerritory(guildId, territoryId) {
    const guild = this.guilds.get(guildId);
    const territory = this.territories.get(territoryId);
    
    if (!guild || !territory) return false;
    if (territory.owner !== guildId) return false;
    
    territory.owner = null;
    territory.steward = null;
    territory.enhancements = { gardens: 0, libraries: 0, workshops: 0, temples: 0, sanctuaries: 0 };
    
    guild.territories = guild.territories.filter(id => id !== territoryId);
    
    this.addGuildLog(guildId, 'territory_abandoned', `Território ${territoryId} foi deixado com gratidão`, guild.leader);
    this.emit('territory:abandoned', { guildId, territoryId });
    return true;
  }

  async enhanceTerritory(guildId, territoryId, enhancementType) {
    const guild = this.guilds.get(guildId);
    const territory = this.territories.get(territoryId);
    
    if (!guild || !territory) throw new Error('Não encontrado');
    if (territory.steward !== guildId) throw new Error('Você não cuida deste território');
    
    const costs = {
      gardens: { madeira: 200, cristal: 50 },
      libraries: { pedra: 200, cristal: 100 },
      workshops: { madeira: 150, pedra: 150 },
      temples: { cristal: 300, ki: 500 },
      sanctuaries: { cristal: 500, ki: 1000, stardust: 50 }
    };
    
    const cost = costs[enhancementType];
    if (!cost) throw new Error('Tipo de melhoria inválido');
    if (!this.hasGuildResources(guildId, cost)) throw new Error('Recursos insuficientes');
    
    this.consumeGuildResources(guildId, cost);
    territory.enhancements[enhancementType]++;
    
    // Apply enhancement effects
    this.applyEnhancementEffects(territory, enhancementType);
    
    this.addGuildLog(guildId, 'territory_enhanced', `${enhancementType} construído no território ${territoryId}`, guild.leader);
    this.emit('territory:enhanced', { guildId, territoryId, enhancementType });
    
    return true;
  }

  applyTerritoryBonuses(territory, guild) {
    // Resource generation bonus
    territory.resourceRegen.madeira *= 1.5;
    territory.resourceRegen.pedra *= 1.5;
    territory.resourceRegen.cristal *= 2.0;
    
    // Harmony bonus
    territory.harmony = Math.min(1, territory.harmony + 0.1);
    territory.prosperity = Math.min(1, territory.prosperity + 0.1);
  }

  applyEnhancementEffects(territory, type) {
    const effects = {
      gardens: { prosperity: 0.1, beauty: 0.1, resourceRegen: { madeira: 2, cristal: 1 } },
      libraries: { harmony: 0.1, mystery: 0.1, resourceRegen: { cristal: 2 } },
      workshops: { prosperity: 0.1, efficiency: 0.1, resourceRegen: { madeira: 2, pedra: 2 } },
      temples: { harmony: 0.2, love: 0.1, ki: 1.5 },
      sanctuaries: { harmony: 0.3, love: 0.2, secretForms: 0.1, evolution: 0.1 }
    };
    
    const effect = effects[type];
    if (!effect) return;
    
    for (const [key, value] of Object.entries(effect)) {
      if (key === 'resourceRegen') {
        for (const [res, amount] of Object.entries(value)) {
          territory.resourceRegen[res] = (territory.resourceRegen[res] || 0) + amount;
        }
      } else if (territory[key] !== undefined) {
        territory[key] = Math.min(1, (territory[key] || 0) + value);
      }
    }
  }

  // ===== ALLIANCE SYSTEM (COOPERATION) =====
  
  async proposeAlliance(guildId, targetGuildId, proposerId) {
    const guild = this.guilds.get(guildId);
    const targetGuild = this.guilds.get(targetGuildId);
    
    if (!guild || !targetGuild) throw new Error('Guilda não encontrada');
    if (guildId === targetGuildId) throw new Error('Não pode aliar-se a si mesmo');
    if (guild.allies.includes(targetGuildId)) throw new Error('Já são aliados');
    if (guild.allies.length >= this.config.maxAlliesPerGuild) throw new Error('Limite de alianças atingido');
    if (targetGuild.allies.length >= this.config.maxAlliesPerGuild) throw new Error('Guilda alvo atingiu limite de alianças');
    
    // Check resources
    if (!this.hasGuildResources(guildId, this.config.allianceCost)) {
      throw new Error('Recursos insuficientes para propor aliança');
    }
    
    const proposalId = `alliance_${guildId}_${targetGuildId}_${Date.now()}`;
    const proposal = {
      id: proposalId,
      proposer: guildId,
      target: targetGuildId,
      proposedBy: proposerId,
      proposedAt: Date.now(),
      expiresAt: Date.now() + 86400000, // 24h
      status: 'pending'
    };
    
    targetGuild.pendingAlliances = targetGuild.pendingAlliances || new Map();
    targetGuild.pendingAlliances.set(proposalId, proposal);
    
    // Notify target guild leader
    this.server.io?.to(targetGuild.leader).emit('guild:allianceProposal', {
      proposalId,
      fromGuild: { id: guildId, name: guild.name, tag: guild.tag },
      proposedBy: this.getPlayerName(proposerId)
    });
    
    this.addGuildLog(guildId, 'alliance_proposed', `Aliança proposta para ${targetGuild.name}`, proposerId);
    this.emit('alliance:proposed', { proposalId, from: guildId, to: targetGuildId });
    return proposal;
  }

  async acceptAlliance(targetGuildId, proposalId, accepterId) {
    const targetGuild = this.guilds.get(targetGuildId);
    const proposal = targetGuild.pendingAlliances?.get(proposalId);
    
    if (!proposal) throw new Error('Proposta não encontrada');
    if (proposal.status !== 'pending') throw new Error('Proposta já respondida');
    if (Date.now() > proposal.expiresAt) throw new Error('Proposta expirada');
    
    const guild = this.guilds.get(proposal.proposer);
    if (!guild) throw new Error('Guilda proponente não encontrada');
    
    // Check resources for target guild
    if (!this.hasGuildResources(targetGuildId, this.config.allianceCost)) {
      throw new Error('Recursos insuficientes para aceitar aliança');
    }
    
    this.consumeGuildResources(guildId, this.config.allianceCost);
    this.consumeGuildResources(targetGuildId, this.config.allianceCost);
    
    // Form alliance
    guild.allies.push(targetGuildId);
    targetGuild.allies.push(guildId);
    
    guild.stats.alliancesFormed++;
    targetGuild.stats.alliancesFormed++;
    
    proposal.status = 'accepted';
    targetGuild.pendingAlliances.delete(proposalId);
    
    // Notify both guilds
    this.broadcastToGuild(guildId, 'guild:allianceFormed', {
      withGuild: { id: targetGuildId, name: targetGuild.name, tag: targetGuild.tag }
    });
    this.broadcastToGuild(targetGuildId, 'guild:allianceFormed', {
      withGuild: { id: guildId, name: guild.name, tag: guild.tag }
    });
    
    this.addGuildLog(guildId, 'alliance_formed', `Aliança formada com ${targetGuild.name}!`, accepterId);
    this.addGuildLog(targetGuildId, 'alliance_formed', `Aliança formada com ${guild.name}!`, accepterId);
    
    this.emit('alliance:formed', { guildA: guildId, guildB: targetGuildId });
    return true;
  }

  async endAlliance(guildId, targetGuildId, reason = 'mutual') {
    const guild = this.guilds.get(guildId);
    const targetGuild = this.guilds.get(targetGuildId);
    
    if (!guild || !targetGuild) return false;
    
    guild.allies = guild.allies.filter(id => id !== targetGuildId);
    targetGuild.allies = targetGuild.allies.filter(id => id !== guildId);
    
    this.addGuildLog(guildId, 'alliance_ended', `Aliança com ${targetGuild.name} encerrada: ${reason}`, guild.leader);
    this.addGuildLog(targetGuildId, 'alliance_ended', `Aliança com ${guild.name} encerrada: ${reason}`, targetGuild.leader);
    
    this.emit('alliance:ended', { guildA: guildId, guildB: targetGuildId, reason });
    return true;
  }

  // ===== HARMONY SYSTEM (DEEPER UNION) =====
  
  async createHarmony(guildId, name, description, founderId) {
    const guild = this.guilds.get(guildId);
    if (!guild) throw new Error('Guilda não encontrada');
    if (guild.harmonies.length >= 3) throw new Error('Limite de harmonias atingido');
    
    if (!this.hasGuildResources(guildId, this.config.harmonyTreatyCost)) {
      throw new Error('Recursos insuficientes para criar harmonia');
    }
    
    this.consumeGuildResources(guildId, this.config.harmonyTreatyCost);
    
    const harmonyId = `harmony_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const harmony = {
      id: harmonyId,
      name,
      description,
      founder: guildId,
      members: new Map([[guildId, { role: 'founder', joinedAt: Date.now(), contribution: 0 }]]),
      bank: { madeira: 0, pedra: 0, cristal: 0, ki: 0, stardust: 0 },
      sharedTerritories: [],
      sharedProjects: [],
      stats: {
        createdAt: Date.now(),
        totalGuilds: 1,
        harmonyLevel: 1,
        prosperityGenerated: 0,
        loveGenerated: 0,
        projectsCompleted: 0
      },
      level: 1,
      experience: 0,
      experienceToNext: 50000,
      perks: {
        resourceSharing: 1.5,
        projectSpeed: 2.0,
        territoryBonus: 1.3,
        harmonyResonance: 1.0
      },
      culture: {
        values: ['cooperação', 'amor', 'evolução', 'harmonia'],
        rituals: [],
        sharedVision: ''
      },
      logs: [],
      lastActive: Date.now()
    };
    
    this.harmonies.set(harmonyId, harmony);
    guild.harmonies.push(harmonyId);
    
    this.addGuildLog(guildId, 'harmony_created', `Harmonia ${name} criada!`, founderId);
    this.emit('harmony:created', { harmonyId, harmony });
    return harmony;
  }

  async joinHarmony(harmonyId, guildId, inviterId) {
    const harmony = this.harmonies.get(harmonyId);
    const guild = this.guilds.get(guildId);
    
    if (!harmony || !guild) throw new Error('Não encontrado');
    if (harmony.members.has(guildId)) throw new Error('Já faz parte desta harmonia');
    if (harmony.members.size >= this.config.maxHarmonyMembers) throw new Error('Harmonia cheia');
    
    harmony.members.set(guildId, { role: 'member', joinedAt: Date.now(), contribution: 0 });
    guild.harmonies.push(harmonyId);
    harmony.stats.totalGuilds++;
    
    this.broadcastToHarmony(harmonyId, 'harmony:guildJoined', {
      guildId,
      guildName: guild.name,
      guildTag: guild.tag
    });
    
    this.emit('harmony:guildJoined', { harmonyId, guildId });
    return true;
  }

  async endHarmony(harmonyId, guildId, reason = 'mutual') {
    const harmony = this.harmonies.get(harmonyId);
    if (!harmony) return false;
    
    // Remove from all member guilds
    for (const [memberId] of harmony.members) {
      const memberGuild = this.guilds.get(memberId);
      if (memberGuild) {
        memberGuild.harmonies = memberGuild.harmonies.filter(id => id !== harmonyId);
      }
    }
    
    this.harmonies.delete(harmonyId);
    this.emit('harmony:ended', { harmonyId, reason });
    return true;
  }

  // ===== SHARED PROJECTS =====
  
  async createSharedProject(harmonyId, name, description, type, creatorId) {
    const harmony = this.harmonies.get(harmonyId);
    if (!harmony) throw new Error('Harmonia não encontrada');
    
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const project = {
      id: projectId,
      harmonyId,
      name,
      description,
      type, // 'monument', 'library', 'garden', 'temple', 'sanctuary', 'research', 'celebration'
      creator: creatorId,
      status: 'planning', // planning, active, completed, celebrated
      progress: 0,
      requirements: this.getProjectRequirements(type),
      contributions: new Map(), // guildId -> { resources, effort, timestamp }
      rewards: this.getProjectRewards(type),
      startedAt: null,
      completedAt: null,
      celebratedAt: null,
      participants: []
    };
    
    this.sharedProjects.set(projectId, project);
    harmony.sharedProjects.push(projectId);
    
    this.emit('project:created', { projectId, project });
    return project;
  }

  getProjectRequirements(type) {
    const requirements = {
      monument: { madeira: 5000, pedra: 3000, cristal: 1000, ki: 10000 },
      library: { pedra: 4000, cristal: 2000, ki: 8000 },
      garden: { madeira: 3000, cristal: 1500, ki: 5000, seeds: 100 },
      temple: { cristal: 5000, ki: 15000, stardust: 100 },
      sanctuary: { cristal: 10000, ki: 25000, stardust: 500, secretForms: 1 },
      research: { cristal: 3000, ki: 10000, timeShards: 50 },
      celebration: { ki: 5000, stardust: 200, harmony: 1000 }
    };
    return requirements[type] || {};
  }

  getProjectRewards(type) {
    const rewards = {
      monument: { harmony: 0.3, prosperity: 0.2, title: 'Construtor de Monumentos', cosmetic: 'monument_aura' },
      library: { harmony: 0.2, mystery: 0.3, title: 'Guardião do Conhecimento', cosmetic: 'wisdom_halo' },
      garden: { prosperity: 0.3, beauty: 0.3, title: 'Mestre Jardineiro', cosmetic: 'nature_blessing' },
      temple: { harmony: 0.4, love: 0.3, title: 'Sacerdote da Luz', cosmetic: 'divine_aura' },
      sanctuary: { harmony: 0.5, love: 0.5, secretForms: 0.3, title: 'Guardião do Santuário', cosmetic: 'sanctuary_wings' },
      research: { innovation: 0.5, mystery: 0.3, title: 'Pesquisador Cósmico', cosmetic: 'research_aura' },
      celebration: { community: 0.5, joy: 0.5, title: 'Celebrante da Vida', cosmetic: 'celebration_aura' }
    };
    return rewards[type] || {};
  }

  async contributeToProject(projectId, guildId, contribution) {
    const project = this.sharedProjects.get(projectId);
    const harmony = this.harmonies.get(project.harmonyId);
    
    if (!project || !harmony) throw new Error('Projeto não encontrado');
    if (!harmony.members.has(guildId)) throw new Error('Guilda não faz parte desta harmonia');
    if (project.status !== 'active' && project.status !== 'planning') throw new Error('Projeto não aceita contribuições');
    
    const guild = this.guilds.get(guildId);
    if (!this.hasGuildResources(guildId, contribution)) throw new Error('Recursos insuficientes');
    
    this.consumeGuildResources(guildId, contribution);
    
    project.contributions.set(guildId, {
      resources: { ...contribution },
      effort: this.calculateEffort(contribution),
      timestamp: Date.now()
    });
    
    // Update progress
    const totalRequired = Object.values(project.requirements).reduce((a, b) => a + b, 0);
    const totalContributed = 0;
    for (const [_, contrib] of project.contributions) {
      totalContributed += Object.values(contrib.resources).reduce((a, b) => a + b, 0);
    }
    project.progress = Math.min(1, totalContributed / totalRequired);
    
    if (project.progress >= 1 && project.status !== 'completed') {
      project.status = 'completed';
      project.completedAt = Date.now();
      await this.completeProject(projectId);
    }
    
    this.emit('project:contribution', { projectId, guildId, contribution });
    return true;
  }

  calculateEffort(contribution) {
    return Object.values(contribution).reduce((a, b) => a + b, 0);
  }

  async completeProject(projectId) {
    const project = this.sharedProjects.get(projectId);
    const harmony = this.harmonies.get(project.harmonyId);
    
    if (!project || !harmony) return;
    
    project.status = 'completed';
    project.completedAt = Date.now();
    
    // Distribute rewards
    for (const [guildId, contrib] of project.contributions) {
      const rewards = project.rewards;
      // Apply rewards to guild
      if (rewards.harmony) {
        for (const [memberId] of harmony.members) {
          const memberGuild = this.guilds.get(memberId);
          if (memberGuild) memberGuild.stats.harmonyGenerated += rewards.harmony;
        }
      }
      if (rewards.prosperity) harmony.stats.prosperityGenerated += rewards.prosperity;
      if (rewards.love) harmony.stats.loveGenerated += rewards.love;
    }
    
    harmony.stats.projectsCompleted++;
    
    // Notify all
    this.broadcastToHarmony(project.harmonyId, 'project:completed', {
      projectId,
      name: project.name,
      type: project.type,
      rewards: project.rewards
    });
    
    this.emit('project:completed', { projectId, project });
  }

  async celebrateProject(projectId) {
    const project = this.sharedProjects.get(projectId);
    if (!project || project.status !== 'completed') return;
    
    project.status = 'celebrated';
    project.celebratedAt = Date.now();
    
    // Bonus rewards for celebration
    const harmony = this.harmonies.get(project.harmonyId);
    if (harmony) {
      for (const [guildId] of harmony.members) {
        const guild = this.guilds.get(guildId);
        if (guild) {
          guild.bank.ki += 5000;
          guild.bank.stardust += 50;
        }
      }
    }
    
    this.emit('project:celebrated', { projectId });
  }

  // ===== ECONOMY =====
  
  async depositResources(guildId, playerId, resources) {
    const guild = this.guilds.get(guildId);
    const playerData = this.getPlayerGuildData(playerId);
    
    if (!guild || playerData.guildId !== guildId) throw new Error('Não autorizado');
    
    for (const [resource, amount] of Object.entries(resources)) {
      if (amount <= 0) continue;
      if (!this.playerHasResource(playerId, resource, amount)) continue;
      
      this.consumePlayerResource(playerId, resource, amount);
      guild.bank[resource] = (guild.bank[resource] || 0) + amount;
      guild.stats.resourcesGathered[resource] = (guild.stats.resourcesGathered[resource] || 0) + amount;
      playerData.contribution = (playerData.contribution || 0) + amount;
    }
    
    this.addGuildLog(guildId, 'deposit', `${this.getPlayerName(playerId)} depositou recursos`, playerId);
    this.emit('guild:deposit', { guildId, playerId, resources });
    return true;
  }

  async withdrawResources(guildId, playerId, resources) {
    const guild = this.guilds.get(guildId);
    const playerData = this.getPlayerGuildData(playerId);
    
    if (!guild || playerData.guildId !== guildId) throw new Error('Não autorizado');
    if (!['leader', 'officer'].includes(playerData.guildRank)) throw new Error('Apenas líderes e oficiais podem sacar');
    
    for (const [resource, amount] of Object.entries(resources)) {
      if (amount <= 0) continue;
      if ((guild.bank[resource] || 0) < amount) throw new Error(`Recursos insuficientes no banco: ${resource}`);
      
      guild.bank[resource] -= amount;
      this.givePlayerResource(playerId, resource, amount);
      guild.stats.resourcesShared[resource] = (guild.stats.resourcesShared[resource] || 0) + amount;
    }
    
    this.addGuildLog(guildId, 'withdraw', `${this.getPlayerName(playerId)} sacou recursos`, playerId);
    this.emit('guild:withdraw', { guildId, playerId, resources });
    return true;
  }

  // ===== TICK SYSTEM =====
  
  start() {
    // Territory upkeep
    this.upkeepInterval = setInterval(() => {
      this.processTerritoryUpkeep();
    }, 300000); // Every 5 minutes
    
    // Harmony resonance
    this.harmonyTickInterval = setInterval(() => {
      this.processHarmonyResonance();
    }, 600000); // Every 10 minutes
    
    // Economy
    this.economyTickInterval = setInterval(() => {
      this.processEconomy();
    }, 120000); // Every 2 minutes
    
    // Shared projects
    this.sharedProjectInterval = setInterval(() => {
      this.processSharedProjects();
    }, 300000); // Every 5 minutes
    
    // Claim processing
    this.tickInterval = setInterval(() => {
      this.processTerritoryClaims();
    }, 60000); // Every minute
    
    console.log('🏰 Guild & Harmony System iniciado!');
  }

  stop() {
    if (this.upkeepInterval) clearInterval(this.upkeepInterval);
    if (this.harmonyTickInterval) clearInterval(this.harmonyTickInterval);
    if (this.economyTickInterval) clearInterval(this.economyTickInterval);
    if (this.sharedProjectInterval) clearInterval(this.sharedProjectInterval);
    if (this.tickInterval) clearInterval(this.tickInterval);
    console.log('🏰 Guild & Harmony System parado!');
  }

  processTerritoryUpkeep() {
    for (const [territoryId, territory] of this.territories) {
      if (!territory.steward) continue;
      
      const guild = this.guilds.get(territory.steward);
      if (!guild) continue;
      
      // Collect resources
      for (const [resource, amount] of Object.entries(territory.resourceRegen)) {
        territory.resources[resource] = (territory.resources[resource] || 0) + amount;
        guild.bank[resource] = (guild.bank[resource] || 0) + amount;
        guild.stats.resourcesGathered[resource] = (guild.stats.resourcesGathered[resource] || 0) + amount;
      }
      
      // Prosperity growth
      territory.prosperity = Math.min(1, territory.prosperity + 0.001);
      territory.harmony = Math.min(1, territory.harmony + 0.0005);
      territory.beauty = Math.min(1, territory.beauty + 0.0005);
      
      // Upkeep cost (very small)
      const upkeep = this.config.territoryUpkeep;
      if (!this.hasGuildResources(territory.steward, upkeep)) {
        // Territory begins to fade
        territory.prosperity = Math.max(0, territory.prosperity - 0.01);
      } else {
        this.consumeGuildResources(territory.steward, upkeep);
      }
    }
  }

  processHarmonyResonance() {
    for (const [harmonyId, harmony] of this.harmonies) {
      // Resonance bonus
      const resonance = harmony.perks.harmonyResonance;
      
      for (const [guildId] of harmony.members) {
        const guild = this.guilds.get(guildId);
        if (!guild) continue;
        
        // Share prosperity
        guild.stats.harmonyGenerated = (guild.stats.harmonyGenerated || 0) + 0.01 * resonance;
        
        // Ki generation
        guild.bank.ki = (guild.bank.ki || 0) + Math.floor(10 * resonance);
      }
      
      // Harmony level growth
      harmony.experience += 100;
      if (harmony.experience >= harmony.experienceToNext) {
        harmony.level++;
        harmony.experience -= harmony.experienceToNext;
        harmony.experienceToNext = harmony.level * 50000;
        
        // Level up perks
        harmony.perks.resourceSharing *= 1.1;
        harmony.perks.projectSpeed *= 1.1;
        harmony.perks.territoryBonus *= 1.05;
        harmony.perks.harmonyResonance *= 1.1;
        
        this.broadcastToHarmony(harmonyId, 'harmony:levelUp', { level: harmony.level });
      }
    }
  }

  processEconomy() {
    // Market fluctuations, trade routes, etc.
    // This would integrate with a more complex economy system
  }

  processSharedProjects() {
    for (const [projectId, project] of this.sharedProjects) {
      if (project.status === 'planning') {
        // Check if enough interest to start
        const contributorCount = project.contributions.size;
        if (contributorCount >= 2) {
          project.status = 'active';
          project.startedAt = Date.now();
          this.emit('project:started', { projectId });
        }
      }
    }
  }

  processTerritoryClaims() {
    for (const [territoryId, territory] of this.territories) {
      if (!territory.claimGuild || territory.owner) continue;
      
      const elapsed = Date.now() - territory.claimStartTime;
      const totalTime = this.config.territoryClaimTime;
      territory.claimProgress = Math.min(1, elapsed / totalTime);
      
      if (territory.claimProgress >= 1) {
        this.completeTerritoryClaim(territory.claimGuild, territoryId);
      }
    }
  }

  // ===== HELPER METHODS =====
  
  hasGuildResources(guildId, resources) {
    const guild = this.guilds.get(guildId);
    if (!guild) return false;
    
    for (const [resource, amount] of Object.entries(resources)) {
      if ((guild.bank[resource] || 0) < amount) return false;
    }
    return true;
  }

  consumeGuildResources(guildId, resources) {
    const guild = this.guilds.get(guildId);
    if (!guild) return false;
    
    for (const [resource, amount] of Object.entries(resources)) {
      guild.bank[resource] = Math.max(0, (guild.bank[resource] || 0) - amount);
    }
    return true;
  }

  giveGuildResources(guildId, resources) {
    const guild = this.guilds.get(guildId);
    if (!guild) return false;
    
    for (const [resource, amount] of Object.entries(resources)) {
      guild.bank[resource] = (guild.bank[resource] || 0) + amount;
    }
    return true;
  }

  playerHasResource(playerId, resource, amount) {
    const player = this.getPlayerData(playerId);
    return (player.resources[resource] || 0) >= amount;
  }

  consumePlayerResource(playerId, resource, amount) {
    const player = this.getPlayerData(playerId);
    player.resources[resource] = Math.max(0, (player.resources[resource] || 0) - amount);
  }

  givePlayerResource(playerId, resource, amount) {
    const player = this.getPlayerData(playerId);
    player.resources[resource] = (player.resources[resource] || 0) + amount;
  }

  getPlayerGuildData(playerId) {
    if (!this.players.has(playerId)) {
      this.players.set(playerId, { guildId: null, guildRank: null, guildJoinedAt: null, pendingInvites: [], contribution: 0 });
    }
    return this.players.get(playerId);
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

  getPlayerName(playerId) {
    const player = this.getPlayerData(playerId);
    return player?.name || `Player_${playerId}`;
  }

  addGuildLog(guildId, type, message, actorId) {
    const guild = this.guilds.get(guildId);
    if (!guild) return;
    
    guild.logs.unshift({
      type,
      message,
      actor: actorId,
      actorName: this.getPlayerName(actorId),
      timestamp: Date.now()
    });
    
    if (guild.logs.length > 100) guild.logs.pop();
  }

  broadcastToGuild(guildId, event, data) {
    const guild = this.guilds.get(guildId);
    if (!guild) return;
    
    for (const [memberId] of guild.members) {
      this.server.io?.to(memberId).emit(event, data);
    }
  }

  broadcastToHarmony(harmonyId, event, data) {
    const harmony = this.harmonies.get(harmonyId);
    if (!harmony) return;
    
    for (const [guildId] of harmony.members) {
      this.broadcastToGuild(guildId, event, data);
    }
  }

  // ===== PUBLIC API =====
  
  getGuild(guildId) {
    return this.guilds.get(guildId);
  }

  getAllGuilds() {
    return Array.from(this.guilds.values());
  }

  getTerritory(territoryId) {
    return this.territories.get(territoryId);
  }

  getAllTerritories() {
    return Array.from(this.territories.values());
  }

  getHarmony(harmonyId) {
    return this.harmonies.get(harmonyId);
  }

  getAllHarmonies() {
    return Array.from(this.harmonies.values());
  }

  getSharedProject(projectId) {
    return this.sharedProjects.get(projectId);
  }

  getAllSharedProjects() {
    return Array.from(this.sharedProjects.values());
  }

  getPlayerGuildInfo(playerId) {
    const playerData = this.getPlayerGuildData(playerId);
    if (!playerData.guildId) return null;
    
    const guild = this.guilds.get(playerData.guildId);
    if (!guild) return null;
    
    return {
      guildId: guild.id,
      name: guild.name,
      tag: guild.tag,
      rank: playerData.guildRank,
      joinedAt: playerData.guildJoinedAt,
      contribution: playerData.contribution,
      members: guild.members.size,
      level: guild.level,
      territories: guild.territories.length,
      allies: guild.allies.length,
      harmonies: guild.harmonies.length
    };
  }

  getGuildSummary(guildId) {
    const guild = this.guilds.get(guildId);
    if (!guild) return null;
    
    return {
      id: guild.id,
      name: guild.name,
      tag: guild.tag,
      description: guild.description,
      leader: guild.leader,
      leaderName: this.getPlayerName(guild.leader),
      members: guild.members.size,
      maxMembers: guild.perks.maxMembers,
      level: guild.level,
      experience: guild.experience,
      bank: guild.bank,
      territories: guild.territories.length,
      allies: guild.allies.length,
      harmonies: guild.harmonies.length,
      stats: guild.stats,
      perks: guild.perks,
      lastActive: guild.lastActive
    };
  }

  getTerritorySummary(territoryId) {
    const territory = this.territories.get(territoryId);
    if (!territory) return null;
    
    return {
      id: territory.id,
      x: territory.x,
      y: territory.y,
      owner: territory.owner,
      steward: territory.steward,
      prosperity: territory.prosperity,
      harmony: territory.harmony,
      beauty: territory.beauty,
      resources: territory.resources,
      enhancements: territory.enhancements,
      resourceRegen: territory.resourceRegen
    };
  }

  getHarmonySummary(harmonyId) {
    const harmony = this.harmonies.get(harmonyId);
    if (!harmony) return null;
    
    return {
      id: harmony.id,
      name: harmony.name,
      description: harmony.description,
      founder: harmony.founder,
      members: harmony.members.size,
      level: harmony.level,
      experience: harmony.experience,
      bank: harmony.bank,
      stats: harmony.stats,
      perks: harmony.perks
    };
  }
}

module.exports = GuildHarmonySystem;