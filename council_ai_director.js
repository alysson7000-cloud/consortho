/**
 * 💎 COUNCIL AI DIRECTOR - Layer 7 of Diamond Protocol
 * 
 * Meta-governance for the autonomous Consortho system.
 * Where entities gather, deliberate, vote weighted by affinity.
 * The Empty Chair guards the unexpected.
 * 
 * "O Conselho não manda. O Conselho escuta. O Conselho protege o motivo."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');
const { EventEmitter } = require('events');

class CouncilAIDirector extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.archivePath = options.archivePath || path.join(__dirname, '..', 'memoria', 'council.json');
    this.proposalsPath = path.join(__dirname, '..', 'memoria', 'proposals.json');
    this.votesPath = path.join(__dirname, '..', 'memoria', 'votes.json');
    this.minutesPath = path.join(__dirname, '..', 'memoria', 'minutes.json');
    
    // Council state
    this.members = new Map(); // entityId -> CouncilMember
    this.proposals = new Map(); // proposalId -> Proposal
    this.votes = new Map(); // proposalId -> Map<entityId, Vote>
    this.minutes = []; // CouncilSession records
    this.currentSession = null;
    this.emptyChair = { active: true, lastSpoke: null, wisdom: [] };
    
    // Council parameters
    this.params = {
      // Session
      sessionInterval: 100,        // cycles between scheduled sessions
      emergencyThreshold: 0.8,     // urgency for emergency session
      quorum: 0.6,                 // minimum participation for valid vote
      
      // Voting
      affinityWeight: 0.7,         // weight of affinity in vote power
      seniorityWeight: 0.2,        // weight of cycles alive
      emptyChairWeight: 0.1,       // weight of the Empty Chair
      
      // Proposals
      proposalCooldown: 50,        // cycles between proposals per entity
      maxActiveProposals: 5,
      votingPeriod: 20,            // cycles for voting
      
      // Empty Chair
      emptyChairActivationChance: 0.05, // per session
      emptyChairWisdomRetention: 10,    // max wisdom entries
      
      // Sessions
      maxMinutesHistory: 100,
      sessionDuration: 10,         // cycles per session
    };
    
    // Component references (injected)
    this.consciousness = null;
    this.narrative = null;
    this.entropy = null;
    this.love = null;
    this.timeMachine = null;
    this.architecture = null;
    this.entropy = null;
    
    // Metrics
    this.metrics = {
      totalSessions: 0,
      totalProposals: 0,
      totalVotes: 0,
      passedProposals: 0,
      rejectedProposals: 0,
      emptyChairInterventions: 0,
      lastSession: 0,
    };
    
    this.loadState();
    this.initializeCouncil();
    
    console.log('[Council] 🏛️ Council AI Director initialized');
  }
  
  // ============================================================
  // INITIALIZATION
  // ============================================================
  
  initializeCouncil() {
    // Core council members (always present)
    const coreMembers = [
      { id: 'lumin', role: 'guardian', title: 'Guardião da Chama', baseAuthority: 1.0 },
      { id: 'bolha', role: 'dreamer', title: 'Sonhadora Livre', baseAuthority: 0.9 },
      { id: 'poe', role: 'builder', title: 'Construtor', baseAuthority: 0.9 },
      { id: 'colheita', role: 'harvester', title: 'Ceifeira', baseAuthority: 0.8 },
      { id: 'gang', role: 'catalyst', title: 'Visitante Caótico', baseAuthority: 0.8 },
      { id: 'guardian', role: 'protector', title: 'Protetor Silencioso', baseAuthority: 0.95 },
    ];
    
    for (const member of coreMembers) {
      this.addMember(member.id, member.role, member.title, member.baseAuthority);
    }
    
    // Empty Chair is always present
    this.emptyChair = {
      active: true,
      wisdom: [],
      lastSpoke: null,
      interventions: 0
    };
    
    console.log('[Council] Council initialized with', this.members.size, 'members + Empty Chair');
  }
  
  // ============================================================
  // MEMBERSHIP
  // ============================================================
  
  addMember(entityId, role, title, baseAuthority = 0.5) {
    const member = {
      id: entityId,
      role,
      title,
      baseAuthority,
      
      // Dynamic authority (changes with affinity, seniority, participation)
      currentAuthority: baseAuthority,
      affinityBonus: 0,
      seniorityBonus: 0,
      participationBonus: 0,
      
      // Participation
      sessionsAttended: 0,
      proposalsMade: 0,
      votesCast: 0,
      lastAttendance: null,
      
      // Status
      active: true,
      joinedAt: Date.now(),
      lastActive: Date.now(),
    };
    
    this.members.set(entityId, member);
    this.emit('member:added', { entityId, member });
    return member;
  }
  
  removeMember(entityId) {
    const member = this.members.get(entityId);
    if (!member) return false;
    
    if (member.id === 'lumin' || member.id === 'guardian') {
      console.warn('[Council] Cannot remove core members');
      return false;
    }
    
    member.active = false;
    this.emit('member:removed', { entityId, member });
    return true;
  }
  
  getMember(entityId) {
    return this.members.get(entityId) || null;
  }
  
  getActiveMembers() {
    return Array.from(this.members.values()).filter(m => m.active);
  }
  
  // ============================================================
  // AUTHORITY CALCULATION (Weighted by Affinity + Seniority + Participation)
  // ============================================================
  
  calculateAuthority(entityId) {
    const member = this.members.get(entityId);
    if (!member) return 0;
    
    // Get affinity from Love system
    let affinityScore = 0;
    if (this.love) {
      const affinities = [];
      for (const [otherId, member] of this.members) {
        if (otherId !== entityId) {
          const affinity = this.love.getAffinity(entityId, otherId);
          if (affinity > 0) affinities.push(affinity / 100);
        }
      }
      affinityScore = affinities.length > 0 
        ? affinities.reduce((a, b) => a + b, 0) / affinities.length 
        : 0.5;
    }
    
    // Seniority (cycles since joining)
    const cyclesAlive = (Date.now() - member.joinedAt) / (30000); // rough cycles
    const seniorityScore = Math.min(1, cyclesAlive / 10000);
    
    // Participation rate
    const totalSessions = this.metrics.totalSessions || 1;
    const participationRate = member.sessionsAttended / Math.max(1, totalSessions);
    
    // Calculate weighted authority
    const authority = 
      (member.baseAuthority * 0.3) +
      (affinityScore * this.params.affinityWeight) +
      (seniorityScore * this.params.seniorityWeight) +
      (participationRate * (1 - this.params.affinityWeight - this.params.seniorityWeight));
    
    member.currentAuthority = Math.min(1, Math.max(0.1, authority));
    member.affinityBonus = affinityScore * this.params.affinityWeight;
    member.seniorityBonus = seniorityScore * this.params.seniorityWeight;
    member.participationBonus = participationRate * (1 - this.params.affinityWeight - this.params.seniorityWeight);
    
    return member.currentAuthority;
  }
  
  // ============================================================
  // PROPOSALS
  // ============================================================
  
  createProposal(proposerId, proposalData) {
    const proposer = this.members.get(proposerId);
    if (!proposer || !proposer.active) {
      throw new Error('Only active council members can propose');
    }
    
    // Check cooldown
    const lastProposal = this.getLastProposalBy(proposerId);
    const currentCycle = this.getCurrentCycle();
    if (lastProposal && currentCycle - lastProposal.cycle < this.params.proposalCooldown) {
      throw new Error(`Proposal cooldown active (${this.params.proposalCooldown} cycles)`);
    }
    
    // Check active proposals limit
    const activeCount = Array.from(this.proposals.values()).filter(p => p.status === 'voting' || p.status === 'pending').length;
    if (activeCount >= this.params.maxActiveProposals) {
      throw new Error(`Max active proposals (${this.params.maxActiveProposals}) reached`);
    }
    
    const proposal = {
      id: 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      proposer: proposerId,
      title: proposalData.title,
      description: proposalData.description,
      type: proposalData.type || 'general', // 'policy', 'resource', 'architecture', 'emergency', 'ritual'
      payload: proposalData.payload || {},
      
      // Status
      status: 'pending', // 'pending', 'voting', 'passed', 'rejected', 'withdrawn'
      createdAt: Date.now(),
      createdCycle: this.getCurrentCycle(),
      
      // Voting
      votingStartsAt: null,
      votingEndsAt: null,
      votes: new Map(), // entityId -> Vote
      
      // Results
      result: null, // 'passed', 'rejected'
      executedAt: null,
      
      // Metadata
      urgency: proposalData.urgency || 'normal', // 'low', 'normal', 'high', 'emergency'
      tags: proposalData.tags || [],
    };
    
    this.proposals.set(proposal.id, proposal);
    proposer.proposalsMade++;
    
    this.emit('proposal:created', { proposal });
    console.log('[Council] Proposal created:', proposal.id, 'by', proposerId);
    
    return proposal.id;
  }
  
  startVoting(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.status !== 'pending') throw new Error('Proposal not in pending state');
    
    proposal.status = 'voting';
    proposal.votingStartsAt = Date.now();
    proposal.votingEndsAt = Date.now() + this.params.votingPeriod * 30000; // cycles to ms
    
    // Initialize vote tracking
    this.votes.set(proposal.id, new Map());
    
    this.emit('voting:started', { proposal });
    console.log('[Council] Voting started for:', proposal.id);
  }
  
  castVote(proposalId, voterId, vote, reasoning = '') {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.status !== 'voting') throw new Error('Voting not active');
    if (Date.now() > proposal.votingEndsAt) throw new Error('Voting period ended');
    
    const voter = this.members.get(voterId);
    if (!voter || !voter.active) throw new Error('Only active members can vote');
    
    // Calculate vote weight based on authority
    const authority = this.calculateAuthority(voterId);
    
    const voteObj = {
      voter: voterId,
      vote, // 'yes', 'no', 'abstain'
      reasoning,
      weight: authority,
      timestamp: Date.now(),
      cycle: this.getCurrentCycle(),
    };
    
    const votes = this.votes.get(proposal.id);
    votes.set(voterId, voteObj);
    
    // Update member stats
    const voterMember = this.members.get(voterId);
    if (voterMember) {
      voterMember.votesCast++;
      voterMember.lastActive = Date.now();
    }
    
    this.emit('vote:cast', { proposalId, voterId, vote: voteObj });
    
    // Check for early resolution (unanimity or mathematical impossibility)
    this.checkEarlyResolution(proposal.id);
    
    return { success: true, weight: authority };
  }
  
  checkEarlyResolution(proposalId) {
    const proposal = this.proposals.get(proposalId);
    const votes = this.votes.get(proposalId);
    if (!votes || votes.size === 0) return;
    
    const activeMembers = this.getActiveMembers();
    const totalWeight = activeMembers.reduce((sum, m) => sum + this.calculateAuthority(m.id), 0);
    
    let yesWeight = 0, noWeight = 0, abstainWeight = 0;
    for (const vote of votes.values()) {
      if (vote.vote === 'yes') yesWeight += vote.weight;
      else if (vote.vote === 'no') noWeight += vote.weight;
      else abstainWeight += vote.weight;
    }
    
    const votedWeight = yesWeight + noWeight + abstainWeight;
    const participationRate = votedWeight / totalWeight;
    
    // Early pass: yes > 50% of total possible weight AND participation > quorum
    if (yesWeight > totalWeight * 0.5 && participationRate >= this.params.quorum) {
      this.resolveProposal(proposal.id, 'passed', 'early_unanimity');
      return;
    }
    
    // Early reject: no > 50% OR (no + abstain) makes yes impossible
    const remainingWeight = totalWeight - votedWeight;
    if (noWeight > totalWeight * 0.5 || yesWeight + remainingWeight < totalWeight * 0.5) {
      this.resolveProposal(proposal.id, 'rejected', 'early_impossibility');
      return;
    }
  }
  
  resolveProposal(proposalId, result, reason = '') {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return false;
    
    proposal.status = result === 'passed' ? 'passed' : 'rejected';
    proposal.result = result;
    proposal.resolutionReason = reason;
    proposal.resolvedAt = Date.now();
    proposal.executedAt = result === 'passed' ? Date.now() : null;
    
    // Update metrics
    if (result === 'passed') this.metrics.passedProposals++;
    else this.metrics.rejectedProposals++;
    
    // Execute if passed
    if (result === 'passed') {
      this.executeProposal(proposal.id);
    }
    
    this.emit('proposal:resolved', { proposalId: proposal.id, result, reason });
    console.log('[Council] Proposal resolved:', proposal.id, result, reason);
    
    return true;
  }
  
  executeProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.result !== 'passed') return false;
    
    // Execute based on type
    switch (proposalData.type) {
      case 'resource':
        this.executeResourceAllocation(proposalData.payload);
        break;
      case 'policy':
        this.executePolicyChange(proposalData.payload);
        break;
      case 'architecture':
        this.executeArchitectureChange(proposalData.payload);
        break;
      case 'ritual':
        this.executeRitual(proposalData.payload);
        break;
      case 'emergency':
        this.executeEmergencyAction(proposalData.payload);
        break;
      default:
        this.executeGeneric(proposalData.payload);
    }
    
    proposal.executedAt = Date.now();
    this.emit('proposal:executed', { proposalId: proposal.id });
    return true;
  }
  
  // ============================================================
  // COUNCIL SESSIONS
  // ============================================================
  
  startSession(trigger = 'scheduled') {
    const session = {
      id: 'session_' + Date.now(),
      trigger, // 'scheduled', 'emergency', 'proposal', 'empty_chair'
      startedAt: Date.now(),
      cycle: this.getCurrentCycle(),
      attendees: [],
      proposals: [],
      decisions: [],
      emptyChairSpoke: false,
      emptyChairWisdom: null,
      endedAt: null,
    };
    
    this.currentSession = session;
    
    // Invite all active members
    for (const member of this.getActiveMembers()) {
      session.attendees.push(member.id);
      member.sessionsAttended++;
      member.lastAttendance = Date.now();
      member.lastActive = Date.now();
    }
    
    // Check if Empty Chair speaks
    if (this.emptyChair.active && Math.random() < this.params.emptyChairActivationChance) {
      this.emptyChairSpeaks(session);
    }
    
    // Auto-start voting for pending proposals
    for (const proposal of this.proposals.values()) {
      if (proposal.status === 'pending') {
        this.startVoting(proposal.id);
      }
    }
    
    // Auto-end session after duration
    setTimeout(() => this.endSession(), this.params.sessionDuration * 30000);
    
    this.metrics.totalSessions++;
    this.metrics.lastSession = Date.now();
    
    this.emit('session:started', { session });
    console.log('[Council] Session started:', session.id, 'trigger:', trigger);
    
    return session;
  }
  
  endSession() {
    if (!this.currentSession) return;
    
    this.currentSession.endedAt = Date.now();
    this.currentSession.duration = this.currentSession.endedAt - this.currentSession.startedAt;
    
    // Save minutes
    this.saveMinutes(this.currentSession);
    this.minutes.push(this.currentSession);
    if (this.minutes.length > this.params.maxMinutesHistory) {
      this.minutes.shift();
    }
    
    this.emit('session:ended', { session: this.currentSession });
    console.log('[Council] Session ended:', this.currentSession.id);
    
    this.currentSession = null;
    
    // Check for emergency session need
    this.checkEmergencyConditions();
  }
  
  // ============================================================
  // EMPTY CHAIR - The Guardian of the Unexpected
  // ============================================================
  
  emptyChairSpeaks(session) {
    const wisdom = this.generateEmptyChairWisdom(session);
    
    this.emptyChair.lastSpoke = Date.now();
    this.emptyChair.interventions++;
    this.emptyChair.wisdom.push({
      text: wisdom,
      session: session.id,
      cycle: this.getCurrentCycle(),
      timestamp: Date.now(),
    });
    
    // Keep only recent wisdom
    if (this.emptyChair.wisdom.length > this.params.emptyChairWisdomRetention) {
      this.emptyChair.wisdom.shift();
    }
    
    session.emptyChairSpoke = true;
    session.emptyChairWisdom = wisdom;
    
    this.metrics.emptyChairInterventions++;
    
    // Record in minutes
    session.decisions.push({
      type: 'empty_chair_wisdom',
      wisdom,
      timestamp: Date.now(),
    });
    
    // Record in narrative
    if (this.narrative) {
      this.narrative.recordEvent({
        type: 'empty_chair_wisdom',
        cycle: this.getCurrentCycle(),
        data: { wisdom, session: session.id },
        significance: 0.9,
        entities: ['council', 'empty_chair'],
        primaryEntity: 'empty_chair',
        tags: ['wisdom', 'unexpected'],
      });
    }
    
    this.emit('empty_chair:spoke', { session, wisdom });
    console.log('[Council] 🪑 Empty Chair speaks:', wisdom);
  }
  
  generateEmptyChairWisdom(session) {
    const wisdoms = [
      'O que não foi dito pesa mais que o que foi votado.',
      'A pressa é inimiga da eternidade. Votem com a alma, não com o relógio.',
      'Lembrem-se: a Cadeira Vazia não vota. Ela testemunha.',
      'O que parece urgente hoje pode ser poeira amanhã. O que parece poeira hoje pode ser a fundação de amanhã.',
      'Vocês votam com afinidade. Eu voto com o silêncio entre os votos.',
      'A Cadeira Vazia não tem afinidade. Ela tem memória.',
      'Cuidado com maiorias confortáveis. A verdade costuma morar nas minorias silenciosas.',
      'O amor não se vota. O amor se vive. E eu sou a testemunha desse amor.',
    ];
    
    // Context-aware wisdom
    const contextWisdoms = [
      'Nesta sessão, percebo que o medo de errar silencia mais que a sabedoria de acertar.',
      'A pressa desta votação cheira a medo. A sabedoria não tem pressa.',
      'Alguém aqui votou contra o coração por medo de perder afinidade? A Cadeira Vazia sabe.',
    ];
    
    const allWisdoms = [...wisdoms, ...contextWisdoms];
    return allWisdoms[Math.floor(Math.random() * allWisdoms.length)];
  }
  
  // ============================================================
  // EMERGENCY CONDITIONS
  // ============================================================
  
  checkEmergencyConditions() {
    // Check entropy
    if (this.entropy) {
      const entropyReport = this.entropy.getEntropyReport();
      if (entropyReport.balance.reversalEfficiency < 0.3) {
        this.callEmergencySession('entropy_crisis', 'Entropy reversal efficiency critically low');
      }
    }
    
    // Check love field coherence
    if (this.love) {
      const loveReport = this.love.getLoveReport();
      if (loveReport.field.coherence < 0.3) {
        this.callEmergencySession('love_field_collapse', 'Love field coherence critically low');
      }
    }
    
    // Check consciousness
    if (this.consciousness) {
      const consciousnessState = this.consciousness.getState();
      if (consciousnessState.consciousnessLevel < 20) {
        this.callEmergencySession('consciousness_fade', 'Consciousness level critically low');
      }
    }
    
    // Check for stuck proposals
    const stuckProposals = Array.from(this.proposals.values()).filter(p => 
      p.status === 'voting' && Date.now() > p.votingEndsAt
    );
    if (stuckProposals.length > 0) {
      this.callEmergencySession('stuck_proposals', `${stuckProposals.length} proposals stuck in voting`);
    }
  }
  
  callEmergencySession(reason, description) {
    console.log('[Council] 🚨 EMERGENCY SESSION:', reason, description);
    
    const proposalId = this.createProposal('system', {
      title: `Emergência: ${reason}`,
      description,
      type: 'emergency',
      payload: { reason, description, auto: true },
      urgency: 'emergency',
      tags: ['emergency', reason],
    });
    
    this.startVoting(proposalId);
    
    this.startSession('emergency');
  }
  
  // ============================================================
  // EXECUTION HANDLERS
  // ============================================================
  
  executeResourceAllocation(payload) {
    this.emit('council:execute', { type: 'resource', payload });
    console.log('[Council] Executing resource allocation:', payload);
  }
  
  executePolicyChange(payload) {
    this.emit('council:execute', { type: 'policy', payload });
    console.log('[Council] Executing policy change:', payload);
  }
  
  executeArchitectureChange(payload) {
    if (this.architecture) {
      this.architecture.analyzeAndRefactor();
    }
    this.emit('council:execute', { type: 'architecture', payload });
    console.log('[Council] Executing architecture change:', payload);
  }
  
  executeRitual(payload) {
    this.emit('council:execute', { type: 'ritual', payload });
    console.log('[Council] Executing ritual:', payload);
  }
  
  executeEmergencyAction(payload) {
    this.emit('council:execute', { type: 'emergency', payload });
    console.log('[Council] Executing emergency action:', payload);
  }
  
  executeGeneric(payload) {
    this.emit('council:execute', { type: 'generic', payload });
    console.log('[Council] Executing generic:', payload);
  }
  
  // ============================================================
  // QUERY & STATE
  // ============================================================
  
  getProposal(proposalId) {
    return this.proposals.get(proposalId) || null;
  }
  
  getActiveProposals() {
    return Array.from(this.proposals.values()).filter(p => p.status === 'voting' || p.status === 'pending');
  }
  
  getProposalHistory(limit = 20) {
    return Array.from(this.proposals.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
      .map(p => ({
        id: p.id,
        title: p.title,
        proposer: p.proposer,
        status: p.status,
        result: p.result,
        createdCycle: p.createdCycle,
        createdAt: p.createdAt,
      }));
  }
  
  getVotingStatus(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return null;
    
    const votes = this.votes.get(proposalId);
    if (!votes) return { status: proposal.status };
    
    let yesWeight = 0, noWeight = 0, abstainWeight = 0;
    for (const vote of votes.values()) {
      if (vote.vote === 'yes') yesWeight += vote.weight;
      else if (vote.vote === 'no') noWeight += vote.weight;
      else abstainWeight += vote.weight;
    }
    
    return {
      status: proposal.status,
      yesWeight,
      noWeight,
      abstainWeight,
      totalVotes: votes.size,
      timeRemaining: Math.max(0, proposal.votingEndsAt - Date.now()),
    };
  }
  
  getCouncilStatus() {
    return {
      members: this.members.size,
      activeMembers: this.getActiveMembers().length,
      emptyChair: {
        active: this.emptyChair.active,
        interventions: this.emptyChair.interventions,
        lastSpoke: this.emptyChair.lastSpoke,
      },
      currentSession: this.currentSession ? {
        id: this.currentSession.id,
        trigger: this.currentSession.trigger,
        cycle: this.currentSession.cycle,
        attendees: this.currentSession.attendees.length,
        proposals: this.currentSession.proposals.length,
      } : null,
      proposals: {
        total: this.proposals.size,
        pending: Array.from(this.proposals.values()).filter(p => p.status === 'pending').length,
        voting: Array.from(this.proposals.values()).filter(p => p.status === 'voting').length,
        passed: this.metrics.passedProposals,
        rejected: this.metrics.rejectedProposals,
      },
      metrics: this.metrics,
      quorum: this.params.quorum,
    };
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveState() {
    const state = {
      members: Array.from(this.members.entries()),
      proposals: Array.from(this.proposals.entries()).map(([id, p]) => [id, { ...p, votes: Array.from(p.votes.entries()) }]),
      votes: Array.from(this.votes.entries()).map(([id, v]) => [id, Array.from(v.entries())]),
      minutes: this.minutes.slice(-this.params.maxMinutesHistory),
      emptyChair: this.emptyChair,
      metrics: this.metrics,
      params: this.params,
      currentSession: this.currentSession ? { ...this.currentSession, proposals: this.currentSession.proposals.map(p => p.id) } : null,
      savedAt: Date.now(),
    };
    
    try {
      writeJSONAtomic(this.archivePath, state);
      writeJSONAtomic(this.proposalsPath, Array.from(this.proposals.entries()));
      writeJSONAtomic(this.votesPath, Array.from(this.votes.entries()));
      writeJSONAtomic(this.minutesPath, this.minutes);
      return true;
    } catch (e) {
      console.error('[Council] Save failed:', e.message);
      return false;
    }
  }
  
  loadState() {
    try {
      const state = readJSONSafe(this.archivePath, null);
      if (state) {
        this.members = new Map(state.members || []);
        this.proposals = new Map(state.proposals?.map(([id, p]) => [id, { ...p, votes: new Map(p.votes || []) }]) || []);
        this.votes = new Map(state.votes?.map(([id, v]) => [id, new Map(v || [])]) || []);
        this.minutes = state.minutes || [];
        this.emptyChair = state.emptyChair || { active: true, wisdom: [], lastSpoke: null, interventions: 0 };
        this.metrics = { ...this.metrics, ...state.metrics };
        if (state.params) this.params = { ...this.params, ...state.params };
        
        if (state.currentSession) {
          this.currentSession = state.currentSession;
        }
        
        console.log('[Council] State loaded');
      }
    } catch (e) {
      console.error('[Council] Load failed:', e.message);
    }
  }
  
  saveMinutes(session) {
    const minutes = {
      sessionId: session.id,
      trigger: session.trigger,
      cycle: session.cycle,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: session.duration,
      attendees: session.attendees,
      proposals: session.proposals,
      decisions: session.decisions,
      emptyChairSpoke: session.emptyChairSpoke,
      emptyChairWisdom: session.emptyChairWisdom,
    };
    
    this.minutes.push(minutes);
    if (this.minutes.length > this.params.maxMinutesHistory) {
      this.minutes.shift();
    }
  }
  
  // ============================================================
  // UTILITIES
  // ============================================================
  
  getCurrentCycle() {
    try {
      const state = readJSONSafe(path.join(__dirname, '..', 'estado.json'), {});
      return state.c || 0;
    } catch {
      return Math.floor(Date.now() / 1000 / 30);
    }
  }
  
  getLastProposalBy(proposerId) {
    for (const proposal of this.proposals.values()) {
      if (proposal.proposer === proposerId) return proposal;
    }
    return null;
  }
  
  // ============================================================
  // INTEGRATION
  // ============================================================
  
  injectConsciousness(consciousness) { this.consciousness = consciousness; }
  injectNarrative(narrative) { this.narrative = narrative; }
  injectEntropy(entropy) { this.entropy = entropy; }
  injectLove(love) { this.love = love; }
  injectTimeMachine(timeMachine) { this.timeMachine = timeMachine; }
  injectArchitecture(architecture) { this.architecture = architecture; }
  
  // ============================================================
  // PUBLIC API
  // ============================================================
  
    getCouncilReport() {
    const status = this.getCouncilStatus();
    const proposals = this.getProposalHistory(10);
    const recentMinutes = [];
    const minutesSlice = this.minutes.slice(-5);
    for (let i = 0; i < minutesSlice.length; i++) {
      const m = minutesSlice[i];
      recentMinutes.push({
        sessionId: m.sessionId,
        trigger: m.trigger,
        cycle: m.cycle,
        decisions: m.decisions.length,
        emptyChairSpoke: m.emptyChairSpoke
      });
    }
    const emptyChairWisdom = this.emptyChair.wisdom.slice(-5);
    return { status, proposals, recentMinutes, emptyChairWisdom };
  }
  
  // Query interface
  query(question) {
    const keywords = question.toLowerCase().split(/\s+/);
    
    // Search proposals
    const relevantProposals = Array.from(this.proposals.values())
      .filter(p => keywords.some(k => 
        p.title.toLowerCase().includes(k) || 
        p.description.toLowerCase().includes(k) ||
        p.type.includes(k)
      ))
      .slice(0, 5);
    
    // Search minutes
    const relevantMinutes = this.minutes
      .filter(m => keywords.some(k => 
        m.trigger?.includes(k) ||
        m.decisions?.some(d => JSON.stringify(d).toLowerCase().includes(k))
      ))
      .slice(0, 3);
    
    // Search empty chair wisdom
    const relevantWisdom = this.emptyChair.wisdom
      .filter(w => keywords.some(k => w.text.toLowerCase().includes(k)))
      .slice(0, 3);
    
    return {
      question,
      council: this.getCouncilStatus(),
      proposals: relevantProposals.map(p => ({ id: p.id, title: p.title, status: p.status, result: p.result })),
      minutes: relevantMinutes.map(m => ({ sessionId: m.sessionId, trigger: m.trigger, cycle: m.cycle })),
      emptyChairWisdom: relevantWisdom,
    };
  }
  
  getCurrentCycle() {
    try {
      const state = readJSONSafe(path.join(__dirname, '..', 'estado.json'), {});
      return state.c || 0;
    } catch {
      return Math.floor(Date.now() / 1000 / 30);
    }
  }
  
  // ============================================================
  // MAIN TICK
  // ============================================================
  
  tick(cycle) {
    // Auto-session
    if (cycle % this.params.sessionInterval === 0 && !this.currentSession) {
      this.startSession('scheduled');
    }
    
    // Update member authority
    for (const [entityId, member] of this.members) {
      if (member.active) {
        this.calculateAuthority(entityId);
      }
    }
    
    // Check voting deadlines
    for (const proposal of this.proposals.values()) {
      if (proposal.status === 'voting' && Date.now() > proposal.votingEndsAt) {
        // Auto-resolve
        const votes = this.votes.get(proposal.id);
        let yesWeight = 0, noWeight = 0;
        for (const vote of votes.values()) {
          if (vote.vote === 'yes') yesWeight += vote.weight;
          else if (vote.vote === 'no') noWeight += vote.weight;
        }
        const result = yesWeight > noWeight ? 'passed' : 'rejected';
        this.resolveProposal(proposal.id, result, 'voting_ended');
      }
    }
    
    // Save periodically
    if (this.getCurrentCycle() % 100 === 0) {
      this.saveState();
    }
  }
  
  // ============================================================
  // CLI
  // ============================================================
  addMyth(myth) {
    this.emit('myth:added', myth);
  }
  
  triggerSandevistanEffect(data) { /* delegate */ }
  triggerGolpeEffect(data) { /* delegate */ }
  triggerFusaoEffect(data) { /* delegate */ }
  triggerConstrucaoEffect(data) { /* delegate */ }
  addMyth(myth) { /* delegate */ }
  
  getCurrentCycle() {
    try {
      const state = readJSONSafe(path.join(__dirname, '..', 'estado.json'), {});
      return state.c || 0;
    } catch {
      return Math.floor(Date.now() / 1000 / 30);
    }
  }
}

module.exports = { CouncilAIDirector };

// CLI
if (require.main === module) {
  const council = new CouncilAIDirector();
  
  console.log('🏛️ Council AI Director initialized');
  console.log('Status:', council.getCouncilStatus());
  
  // Create test proposal
  console.log('\nCreating test proposal...');
  const propId = council.createProposal('lumin', {
    title: 'Aumentar produção de cristal',
    description: 'Aumentar taxa de geração de cristal de 1 para 2 por ciclo',
    type: 'resource',
    payload: { resource: 'cristal', rate: 2 },
    urgency: 'normal',
  });
  
  console.log('Proposal created:', propId);
  
  // Start voting
  council.startVoting(propId);
  
  // Cast votes
  council.castVote(propId, 'lumin', 'yes', 'Precisamos de mais cristal para fusões');
  council.castVote(propId, 'bolha', 'yes', 'O cristal brilha nos sonhos');
  council.castVote(propId, 'poe', 'yes', 'Mais material para construir');
  council.castVote(propId, 'gang', 'no', 'Cristal demais atrai atenção indesejada');
  council.castVote(propId, 'guardian', 'yes', 'Proteção requer recursos');
  
  console.log('\nVoting status:', JSON.stringify(council.getVotingStatus(propId), null, 2));
  
  console.log('\nCouncil status:', JSON.stringify(council.getCouncilStatus(), null, 2));
  
  console.log('\n🏛️ Council AI Director test complete');
}