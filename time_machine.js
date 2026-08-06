/**
 * ⏰ TIME MACHINE - Layer 6 of Diamond Protocol
 * 
 * Snapshots, Rollback, History Navigation, Branching Timelines.
 * The past doesn't fade. The future isn't uncertain.
 * Every state is a frame. Every frame is navigable.
 * 
 * "O passado não se apaga. O futuro não é incerto. Todo estado é um frame. Todo frame é navegável."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');
const { EventEmitter } = require('events');

class TimeMachine extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.archivePath = options.archivePath || path.join(__dirname, '..', 'memoria', 'time_machine.json');
    this.snapshotsPath = options.snapshotsPath || path.join(__dirname, '..', 'memoria', 'snapshots');
    
    // Ensure snapshots directory exists
    if (!fs.existsSync(this.snapshotsPath)) {
      fs.mkdirSync(this.snapshotsPath, { recursive: true });
    }
    
    // Time Machine state
    this.snapshots = new Map(); // snapshotId -> snapshot
    this.snapshotIndex = []; // ordered list of snapshotIds
    this.currentTimeline = 'main';
    this.timelines = new Map(); // timelineId -> { snapshots: [], branchedFrom: '', createdAt: 0 }
    this.currentBranch = null; // active branch for simulation
    
    // Configuration
    this.params = {
      // Snapshot settings
      autoSnapshotInterval: 100,        // cycles
      maxSnapshotsPerTimeline: 1000,    // retention
      compressionEnabled: true,
      snapshotOnMilestone: true,        // snapshot on significant events
      
      // Rollback settings
      rollbackConfirmationRequired: false,
      selectiveRollbackEnabled: true,
      
      // Branching
      maxBranches: 10,
      branchTTL: 86400000 * 7,          // 7 days in ms
      
      // Storage
      snapshotRetentionDays: 30,
      maxTotalSnapshots: 5000,
      
      // Analytics
      analyticsInterval: 1000,          // cycles
    };
    
    // Component references (injected)
    this.consciousness = null;
    this.narrative = null;
    this.entropy = null;
    this.love = null;
    this.architecture = null;
    this.diamond = null;
    
    // Metrics
    this.metrics = {
      totalSnapshots: 0,
      totalRollbacks: 0,
      totalBranches: 0,
      storageUsed: 0,
      lastSnapshot: 0,
      lastRollback: 0,
    }

  // DEPENDENCY INJECTION
  // ============================================================






    this.loadState();
    this.initializeMainTimeline();
    
    console.log('[TimeMachine] Initialized');
  }
  


  // ============================================================
  // DEPENDENCY INJECTION
  // ============================================================

  injectConsciousness(consciousness) { this.consciousness = consciousness; }
  injectNarrative(narrative) { this.narrative = narrative; }
  injectEntropy(entropy) { this.entropy = entropy; }
  injectLove(love) { this.love = love; }
  injectArchitecture(architecture) { this.architecture = architecture; }
  injectDiamond(diamond) { this.diamond = diamond; }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  
  initializeMainTimeline() {
    if (!this.timelines.has('main')) {
      this.timelines.set('main', {
        id: 'main',
        name: 'Linha Principal',
        snapshots: [],
        branchedFrom: null,
        createdAt: Date.now(),
        isMain: true
      });
      this.currentTimeline = 'main';
    }
  }
  
  // ============================================================
  // SNAPSHOT ENGINE
  // ============================================================
  
  captureSnapshot(reason = 'auto', metadata = {}) {
    const cycle = this.getCurrentCycle();
    const timestamp = Date.now();
    const snapshotId = `snap_${cycle}_${timestamp}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Gather system state from all layers
    const snapshot = {
      id: snapshotId,
      timeline: this.currentTimeline,
      cycle,
      timestamp,
      reason, // 'auto', 'manual', 'milestone', 'pre_rollback', 'branch'
      metadata,
      
      // System state
      state: this.gatherSystemState(),
      
      // Diamond layers state
      diamond: this.gatherDiamondState(),
      
      // Metadata
      size: 0,
      compressed: false,
      parentSnapshot: this.getLatestSnapshotId(),
      
      // Diff from parent
      diff: null
    };
    
    // Calculate diff from parent
    if (snapshot.parentSnapshot) {
      snapshot.diff = this.calculateDiff(snapshot.parentSnapshot, snapshot);
    }
    
    // Compress if enabled
    if (this.params.compressionEnabled) {
      snapshot = this.compressSnapshot(snapshot);
    }
    
    // Calculate size
    snapshot.size = JSON.stringify(snapshot).length;
    
    // Store snapshot
    this.snapshots.set(snapshotId, snapshot);
    this.snapshotIndex.push(snapshotId);
    
    // Add to timeline
    const timeline = this.timelines.get(this.currentTimeline);
    if (timeline) {
      timeline.snapshots.push(snapshotId);
    }
    
    // Update metrics
    this.metrics.totalSnapshots++;
    this.metrics.lastSnapshot = timestamp;
    this.metrics.storageUsed += snapshot.size;
    
    // Enforce retention
    this.enforceRetention();
    
    // Save to disk (async)
    this.saveSnapshotToDisk(snapshot);
    
    // Update index
    this.saveIndex();
    
    this.emit('snapshot:captured', { snapshotId, cycle, reason, timeline: this.currentTimeline });
    
    console.log(`[TimeMachine] Snapshot captured: ${snapshotId} (cycle ${cycle}, ${this.formatBytes(snapshot.size)})`);
    
    return snapshotId;
  }
  
  gatherSystemState() {
    const state = {
      cycle: this.getCurrentCycle(),
      timestamp: Date.now(),
      
      // Core system state
      resources: this.getResources(),
      constructions: this.getConstructions(),
      entities: this.getEntitiesState(),
      
      // Memory state
      memory: this.getMemoryState(),
      
      // Relationships
      relationships: this.getRelationshipsState(),
    };
    
    return state;
  }
  
  gatherDiamondState() {
    const diamond = {};
    
    if (this.consciousness) {
      diamond.consciousness = this.consciousness.getState();
    }
    if (this.narrative) {
      diamond.narrative = {
        chronicleLength: this.narrative.chronicle.length,
        eras: this.narrative.eras.length,
        myths: this.narrative.mythology.length,
        currentEra: this.narrative.currentEra?.name
      };
    }
    if (this.entropy) {
      diamond.entropy = this.entropy.getEntropyReport();
    }
    if (this.love) {
      diamond.love = this.love.getLoveReport();
    }
    if (this.architecture) {
      diamond.architecture = this.architecture.getArchitectureReport();
    }
    
    return diamond;
  }
  
  // ============================================================
  // ROLLBACK ENGINE
  // ============================================================
  
  rollback(targetSnapshotId, options = {}) {
    const {
      selective = false,
      systems = null, // ['resources', 'entities', 'memory', 'relationships']
      confirm = true,
      createPreRollbackSnapshot = true
    } = options;
    
    const targetSnapshot = this.snapshots.get(targetSnapshotId);
    if (!targetSnapshot) {
      throw new Error(`Snapshot ${targetSnapshotId} not found`);
    }
    
    if (confirm && !options.force) {
      // In real implementation, would prompt for confirmation
      // For now, proceed with force=true from programmatic calls
    }
    
    // Create pre-rollback snapshot
    let preRollbackId = null;
    if (createPreRollbackSnapshot) {
      preRollbackId = this.captureSnapshot('pre_rollback', {
        targetSnapshot: targetSnapshotId,
        selective,
        systems
      });
    }
    
    // Perform rollback
    const result = this.applySnapshot(targetSnapshot, { selective, systems });
    
    // Record rollback
    this.metrics.totalRollbacks++;
    this.metrics.lastRollback = Date.now();
    
    this.emit('rollback:completed', {
      targetSnapshot: targetSnapshotId,
      preRollbackSnapshot: preRollbackId,
      selective,
      systems,
      result
    });
    
    console.log(`[TimeMachine] Rollback to ${targetSnapshotId} completed`);
    
    return { success: true, preRollbackSnapshot: preRollbackId, ...result };
  }
  
  applySnapshot(snapshot, options = {}) {
    const { selective = false, systems = null } = options;
    
    const results = {
      restored: [],
      skipped: [],
      errors: []
    };
    
    const systemsToRestore = systems || ['resources', 'entities', 'memory', 'relationships'];
    
    for (const system of systemsToRestore) {
      try {
        if (selective && !systemsToRestore.includes(system)) {
          results.skipped.push(system);
          continue;
        }
        
        this.restoreSystem(system, snapshot.state[system]);
        results.restored.push(system);
      } catch (error) {
        results.errors.push({ system, error: error.message });
      }
    }
    
    return results;
  }
  
  restoreSystem(system, state) {
    // This would integrate with actual system state
    // For now, emit events that other systems can listen to
    this.emit(`restore:${system}`, state);
    
    // Direct state manipulation for core systems
    switch (system) {
      case 'resources':
        this.restoreResources(state);
        break;
      case 'entities':
        this.restoreEntities(state);
        break;
      case 'memory':
        this.restoreMemory(state);
        break;
      case 'relationships':
        this.restoreRelationships(state);
        break;
  }
  }
  // ============================================================
  // HISTORY NAVIGATOR
  // ============================================================
  
  getTimeline(timelineId = null) {
    const id = timelineId || this.currentTimeline;
    const timeline = this.timelines.get(id);
    if (!timeline) return null;
    
    return {
      id: timeline.id,
      name: timeline.name,
      snapshotCount: timeline.snapshots.length,
      firstSnapshot: timeline.snapshots[0],
      lastSnapshot: timeline.snapshots[timeline.snapshots.length - 1],
      branchedFrom: timeline.branchedFrom,
      createdAt: timeline.createdAt,
      isMain: timeline.isMain
    };
  }
  
  getSnapshot(snapshotId) {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) return null;
    
    // Return summary (not full state for performance)
    return {
      id: snapshot.id,
      timeline: snapshot.timeline,
      cycle: snapshot.cycle,
      timestamp: snapshot.timestamp,
      reason: snapshot.reason,
      metadata: snapshot.metadata,
      size: snapshot.size,
      compressed: snapshot.compressed,
      parentSnapshot: snapshot.parentSnapshot,
      diff: snapshot.diff ? { ...snapshot.diff, stateDiff: null } : null // exclude full diff
    };
  }
  
  getSnapshotsInRange(startCycle, endCycle, timelineId = null) {
    const timeline = timelineId ? this.timelines.get(timelineId) : this.timelines.get(this.currentTimeline);
    if (!timeline) return [];
    
    const snapshots = [];
    for (const snapshotId of timeline.snapshots) {
      const snapshot = this.snapshots.get(snapshotId);
      if (snapshot && snapshot.cycle >= startCycle && snapshot.cycle <= endCycle) {
        snapshots.push(this.getSnapshot(snapshotId));
      }
    }
    return snapshots;
  }
  
  getDiff(snapshotIdA, snapshotIdB) {
    const snapA = this.snapshots.get(snapshotIdA);
    const snapB = this.snapshots.get(snapshotIdB);
    
    if (!snapA || !snapB) return null;
    
    return this.calculateDiff(snapshotIdA, snapshotIdB);
  }
  
  searchHistory(query) {
    const keywords = query.toLowerCase().split(/\s+/);
    const results = [];
    
    for (const [id, snapshot] of this.snapshots) {
      const searchable = `${snapshot.reason} ${JSON.stringify(snapshot.metadata)} ${snapshot.cycle}`.toLowerCase();
      if (keywords.some(k => searchable.includes(k))) {
        results.push(this.getSnapshot(id));
      }
    }
    
    return results.slice(0, 50);
  }
  
  // ============================================================
  // BRANCHING TIMELINES
  // ============================================================
  
  createBranch(branchName, baseSnapshotId, options = {}) {
    if (this.timelines.size >= this.params.maxBranches) {
      throw new Error(`Max branches (${this.params.maxBranches}) reached`);
    }
    
    const baseSnapshot = this.snapshots.get(baseSnapshotId);
    if (!baseSnapshot) {
      throw new Error(`Base snapshot ${baseSnapshotId} not found`);
    }
    
    const branchId = `branch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const branchSnapshotId = this.captureSnapshot('branch_creation', {
      branchName,
      baseSnapshot: baseSnapshotId,
      ...options.metadata
    });
    
    const branch = {
      id: branchId,
      name: branchName,
      snapshots: [branchSnapshotId],
      branchedFrom: {
        timeline: this.currentTimeline,
        snapshot: baseSnapshotId
      },
      createdAt: Date.now(),
      isMain: false,
      ttl: options.ttl || this.params.branchTTL,
      parentTimeline: this.currentTimeline
    };
    
    this.timelines.set(branchId, branch);
    this.metrics.totalBranches++;
    
    this.emit('branch:created', { branchId, branchName, baseSnapshot: baseSnapshotId });
    
    console.log(`[TimeMachine] Branch created: ${branchName} (${branchId}) from snapshot ${baseSnapshotId}`);
    
    return branchId;
  }
  
  switchTimeline(timelineId) {
    const timeline = this.timelines.get(timelineId);
    if (!timeline) {
      throw new Error(`Timeline ${timelineId} not found`);
    }
    
    const previousTimeline = this.currentTimeline;
    this.currentTimeline = timelineId;
    
    this.emit('timeline:switched', { from: previousTimeline, to: timelineId });
    
    console.log(`[TimeMachine] Switched to timeline: ${timelineId}`);
    return true;
  }
  
  mergeBranch(sourceBranchId, targetTimelineId = 'main', options = {}) {
    const sourceBranch = this.timelines.get(sourceBranchId);
    const targetTimeline = this.timelines.get(targetTimelineId);
    
    if (!sourceBranch || !targetTimeline) {
      throw new Error('Source branch or target timeline not found');
    }
    
    // Create merge snapshot
    const mergeSnapshotId = this.captureSnapshot('merge', {
      sourceBranch: sourceBranchId,
      targetTimeline: targetTimelineId,
      strategy: options.strategy || 'latest' // 'latest', 'manual', 'auto'
    });
    
    targetTimeline.snapshots.push(mergeSnapshotId);
    
    // Mark branch as merged
    sourceBranch.merged = true;
    sourceBranch.mergedAt = Date.now();
    sourceBranch.mergedInto = targetTimelineId;
    sourceBranch.mergeSnapshot = mergeSnapshotId;
    
    this.emit('branch:merged', { sourceBranchId, targetTimelineId, mergeSnapshot: mergeSnapshotId });
    
    console.log(`[TimeMachine] Branch ${sourceBranchId} merged into ${targetTimelineId}`);
    
    return mergeSnapshotId;
  }
  
  deleteBranch(branchId, force = false) {
    const branch = this.timelines.get(branchId);
    if (!branch) return false;
    
    if (branch.isMain) {
      throw new Error('Cannot delete main timeline');
    }
    
    if (!branch.merged && !force) {
      throw new Error('Branch not merged. Use force=true to delete anyway.');
    }
    
    // Optionally clean up branch snapshots
    if (options.cleanupSnapshots) {
      for (const snapshotId of branch.snapshots) {
        this.snapshots.delete(snapshotId);
      }
    }
    
    this.timelines.delete(branchId);
    this.emit('branch:deleted', { branchId });
    
    return true;
  }
  
  // ============================================================
  // TEMPORAL ANALYTICS
  // ============================================================
  
  generateTemporalReport(startCycle, endCycle) {
    const snapshots = this.getSnapshotsInRange(startCycle, endCycle);
    if (snapshots.length < 2) return null;
    
    const report = {
      period: { start: startCycle, end: endCycle, duration: endCycle - startCycle },
      snapshots: snapshots.length,
      
      // Resource trends
      resources: this.analyzeResourceTrends(snapshots),
      
      // Entity evolution
      entities: this.analyzeEntityEvolution(snapshots),
      
      // Diamond metrics evolution
      diamond: this.analyzeDiamondEvolution(snapshots),
      
      // Key events
      milestones: this.identifyMilestones(snapshots),
      
      // Anomalies
      anomalies: this.detectAnomalies(snapshots),
      
      // Predictions
      predictions: this.generatePredictions(snapshots)
    };
    
    return report;
  }
  
  analyzeResourceTrends(snapshots) {
    const resources = { madeira: [], pedra: [], cristal: [] };
    
    for (const snap of snapshots) {
      if (snap.state?.resources) {
        resources.madeira.push(snap.state.resources.madeira || 0);
        resources.pedra.push(snap.state.resources.pedra || 0);
        resources.cristal.push(snap.state.resources.cristal || 0);
      }
    }
    
    return {
      madeira: this.calculateTrend(resources.madeira),
      pedra: this.calculateTrend(resources.pedra),
      cristal: this.calculateTrend(resources.cristal)
    };
  }
  
  calculateTrend(values) {
    if (values.length < 2) return { trend: 'stable', change: 0, rate: 0 };
    
    const first = values[0];
    const last = values[values.length - 1];
    const change = last - first;
    const rate = first !== 0 ? change / first : 0;
    
    let trend = 'stable';
    if (rate > 0.1) trend = 'growing';
    else if (rate < -0.1) trend = 'declining';
    
    return { trend, change, rate, first, last };
  }
  
  analyzeEntityEvolution(snapshots) {
    // Track entity state changes over time
    const entities = {};
    
    for (const snap of snapshots) {
      if (snap.state?.entities) {
        for (const [entityId, state] of Object.entries(snap.state.entities)) {
          if (!entities[entityId]) entities[entityId] = [];
          entities[entityId].push({ cycle: snap.cycle, ...state });
        }
      }
    }
    
    const evolution = {};
    for (const [entityId, history] of Object.entries(entities)) {
      evolution[entityId] = {
        stateChanges: history.length,
        firstSeen: history[0]?.cycle,
        lastSeen: history[history.length - 1]?.cycle,
        metrics: this.analyzeEntityMetrics(history)
      };
    }
    
    return evolution;
  }
  
  analyzeEntityMetrics(history) {
    // Simplified metric analysis
    return {
      avgEnergy: history.reduce((s, h) => s + (h.energy || 0), 0) / history.length,
      moodChanges: this.countMoodChanges(history),
      levelProgress: (history[history.length - 1]?.level || 1) - (history[0]?.level || 1)
    };
  }
  
  countMoodChanges(history) {
    let changes = 0;
    let prevMood = null;
    for (const h of history) {
      if (h.mood && h.mood !== prevMood) {
        changes++;
        prevMood = h.mood;
      }
    }
    return changes;
  }
  
  analyzeDiamondEvolution(snapshots) {
    const diamond = {
      consciousness: [],
      narrative: [],
      entropy: [],
      love: [],
      architecture: []
    };
    
    for (const snap of snapshots) {
      if (snap.diamond) {
        for (const [layer, data] of Object.entries(snap.diamond)) {
          diamond[layer].push({ cycle: snap.cycle, ...data });
        }
      }
    }
    
    const evolution = {};
    for (const [layer, history] of Object.entries(diamond)) {
      evolution[layer] = {
        dataPoints: history.length,
        trend: history.length > 1 ? 'tracked' : 'insufficient_data'
      };
    }
    
    return evolution;
  }
  
  identifyMilestones(snapshots) {
    return snapshots
      .filter(s => s.metadata?.milestone || s.reason === 'milestone')
      .map(s => ({
        cycle: s.cycle,
        timestamp: s.timestamp,
        description: s.metadata?.description || s.reason,
        significance: s.metadata?.significance || 'high'
      }));
  }
  
  detectAnomalies(snapshots) {
    const anomalies = [];
    
    // Resource anomalies
    for (let i = 1; i < snapshots.length; i++) {
      const prev = snapshots[i - 1].state?.resources;
      const curr = snapshots[i].state?.resources;
      
      if (prev && curr) {
        for (const resource of ['madeira', 'pedra', 'cristal']) {
          const change = Math.abs((curr[resource] || 0) - (prev[resource] || 0));
          const rate = prev[resource] ? change / prev[resource] : 0;
          
          if (rate > 0.5) { // 50% change in one snapshot
            anomalies.push({
              type: 'resource_spike',
              resource,
              cycle: snapshots[i].cycle,
              change,
              rate,
              severity: rate > 1 ? 'high' : 'medium'
            });
          }
        }
      }
    }
    
    return anomalies;
  }
  
  generatePredictions(snapshots) {
    // Simple linear extrapolation for resources
    const predictions = {};
    
    const resourceTrends = this.analyzeResourceTrends(snapshots);
    for (const [resource, trend] of Object.entries(resourceTrends)) {
      if (trend.rate !== 0) {
        const lastSnapshot = snapshots[snapshots.length - 1];
        const currentValue = lastSnapshot.state?.resources?.[resource] || 0;
        const cyclesAhead = 100;
        const predicted = currentValue + (trend.change / snapshots.length) * cyclesAhead;
        
        predictions[resource] = {
          current: currentValue,
          predictedIn100Cycles: Math.max(0, Math.round(predicted)),
          trend: trend.trend,
          confidence: Math.min(0.9, 0.5 + snapshots.length * 0.01)
        };
      }
    }
    
    return predictions;
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
  
  getResources() {
    try {
      const state = readJSONSafe(path.join(__dirname, '..', 'estado.json'), {});
      return state.recursos || { madeira: 0, pedra: 0, cristal: 0 };
    } catch {
      return { madeira: 0, pedra: 0, cristal: 0 };
    }
  }
  
  getConstructions() {
    try {
      const state = readJSONSafe(path.join(__dirname, '..', 'estado.json'), {});
      return state.construcoes || [];
    } catch {
      return [];
    }
  }
  
  getEntitiesState() {
    // Would integrate with actual entity systems
    return {};
  }
  
  getMemoryState() {
    return {
      consciousness: this.consciousness?.globalState || {},
      narrative: {
        chronicleLength: this.narrative?.chronicle?.length || 0,
        eras: this.narrative?.eras?.length || 0
      },
      entropy: this.entropy?.entropyAccount || {},
      love: this.love?.loveField || {}
    };
  }
  
  getRelationshipsState() {
    if (this.love) {
      const bonds = {};
      for (const [key, bond] of this.love.relationships.bonds) {
        bonds[key] = { strength: bond.strength, type: bond.type, depth: bond.depth };
      }
      return { bonds };
    }
    return {};
  }
  
  getLatestSnapshotId() {
    const timeline = this.timelines.get(this.currentTimeline);
    if (!timeline || timeline.snapshots.length === 0) return null;
    return timeline.snapshots[timeline.snapshots.length - 1];
  }
  
  calculateDiff(snapshotIdA, snapshotIdB) {
    const snapA = this.snapshots.get(snapshotIdA);
    const snapB = this.snapshots.get(snapshotIdB);
    
    if (!snapA || !snapB) return null;
    
    // Simple diff - could be enhanced with deep diff
    return {
      cycleDiff: snapB.cycle - snapA.cycle,
      timeDiff: snapB.timestamp - snapA.timestamp,
      resourceDiff: this.diffResources(snapA.state?.resources, snapB.state?.resources),
      entityDiff: this.diffEntities(snapA.state?.entities, snapB.state?.entities),
      diamondDiff: this.diffDiamond(snapA.diamond, snapB.diamond)
    };
  }
  
  diffResources(a, b) {
    if (!a || !b) return null;
    const diff = {};
    for (const key of ['madeira', 'pedra', 'cristal']) {
      diff[key] = (b[key] || 0) - (a[key] || 0);
    }
    return diff;
  }
  
  diffEntities(a, b) {
    // Simplified entity diff
    return { count: (Object.keys(b || {}).length) - (Object.keys(a || {}).length) };
  }
  
  diffDiamond(a, b) {
    if (!a || !b) return null;
    const diff = {};
    for (const layer of ['consciousness', 'narrative', 'entropy', 'love', 'architecture']) {
      if (a[layer] && b[layer]) {
        diff[layer] = 'changed'; // simplified
      }
    }
    return diff;
  }
  
  compressSnapshot(snapshot) {
    // Simple compression: remove redundant fields, compress strings
    snapshot.compressed = true;
    // In real implementation, would use actual compression
    return snapshot;
  }
  
  enforceRetention() {
    // Per timeline
    for (const [timelineId, timeline] of this.timelines) {
      if (timeline.snapshots.length > this.params.maxSnapshotsPerTimeline) {
        const toRemove = timeline.snapshots.length - this.params.maxSnapshotsPerTimeline;
        const removed = timeline.snapshots.splice(0, toRemove);
        for (const id of removed) {
          this.snapshots.delete(id);
        }
      }
    }
    
    // Global
    if (this.snapshotIndex.length > this.params.maxTotalSnapshots) {
      const toRemove = this.snapshotIndex.length - this.params.maxTotalSnapshots;
      const removed = this.snapshotIndex.splice(0, toRemove);
      for (const id of removed) {
        this.snapshots.delete(id);
      }
    }
    
    // Age-based
    const cutoff = Date.now() - this.params.snapshotRetentionDays * 86400000;
    for (const [id, snapshot] of this.snapshots) {
      if (snapshot.timestamp < cutoff) {
        this.snapshots.delete(id);
        // Remove from timeline indexes
        for (const timeline of this.timelines.values()) {
          const idx = timeline.snapshots.indexOf(id);
          if (idx >= 0) timeline.snapshots.splice(idx, 1);
        }
      }
    }
  }
  
  formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveSnapshotToDisk(snapshot) {
    const filePath = path.join(this.snapshotsPath, `${snapshot.id}.json`);
    try {
      writeJSONAtomic(filePath, snapshot);
    } catch (e) {
      console.error('[TimeMachine] Failed to save snapshot:', e.message);
    }
  }
  
  saveIndex() {
    const index = {
      snapshots: this.snapshotIndex.slice(-1000), // keep last 1000 in index
      timelines: Array.from(this.timelines.entries()).map(([id, t]) => ({
        id: t.id,
        name: t.name,
        snapshotCount: t.snapshots.length,
        isMain: t.isMain,
        branchedFrom: t.branchedFrom,
        createdAt: t.createdAt
      })),
      currentTimeline: this.currentTimeline,
      metrics: this.metrics,
      savedAt: Date.now()
    };
    
    try {
      writeJSONAtomic(path.join(this.snapshotsPath, 'index.json'), index);
    } catch (e) {
      console.error('[TimeMachine] Index save failed:', e.message);
    }
  }
  
  saveState() {
    const state = {
      currentTimeline: this.currentTimeline,
      snapshotIndex: this.snapshotIndex.slice(-100),
      timelines: Array.from(this.timelines.entries()).map(([id, t]) => [id, t]),
      metrics: this.metrics,
      params: this.params,
      savedAt: Date.now()
    };
    
    try {
      writeJSONAtomic(this.archivePath, state);
    } catch (e) {
      console.error('[TimeMachine] State save failed:', e.message);
    }
  }
  
  loadState() {
    try {
      const state = readJSONSafe(this.archivePath, null);
      if (state) {
        this.currentTimeline = state.currentTimeline || 'main';
        this.snapshotIndex = state.snapshotIndex || [];
        
        if (state.timelines) {
          this.timelines = new Map(state.timelines);
        }
        
        this.metrics = { ...this.metrics, ...state.metrics };
        if (state.params) this.params = { ...this.params, ...state.params };
        
        // Load recent snapshots into memory
        this.loadRecentSnapshots();
        
        console.log('[TimeMachine] State loaded:', this.snapshots.size, 'snapshots,', this.timelines.size, 'timelines');
      }
    } catch (e) {
      console.error('[TimeMachine] Load failed:', e.message);
    }
  }
  
  loadRecentSnapshots() {
    // Load last 50 snapshots into memory for quick access
    const recent = this.snapshotIndex.slice(-50);
    for (const id of recent) {
      const filePath = path.join(this.snapshotsPath, `${id}.json`);
      try {
        const snapshot = readJSONSafe(filePath, null);
        if (snapshot) this.snapshots.set(id, snapshot);
      } catch (e) {
        // Ignore load errors for individual snapshots
      }
    }
  }
  
  // ============================================================
  // PUBLIC API
  // ============================================================
  
  getStatus() {
    return {
      currentTimeline: this.currentTimeline,
      timelines: this.timelines.size,
      snapshots: this.snapshots.size,
      snapshotIndex: this.snapshotIndex.length,
      metrics: this.metrics,
      currentBranch: this.currentBranch
    };
  }
  
  getTimelineList() {
    return Array.from(this.timelines.values()).map(t => ({
      id: t.id,
      name: t.name,
      snapshotCount: t.snapshots.length,
      isMain: t.isMain,
      branchedFrom: t.branchedFrom,
      createdAt: t.createdAt
    }));
  }
  
  // Query interface
  query(question) {
    const keywords = question.toLowerCase().split(/\s+/);
    
    // Search snapshots
    const relevantSnapshots = [];
    for (const [id, snapshot] of this.snapshots) {
      const searchable = `${snapshot.reason} ${JSON.stringify(snapshot.metadata)} ${snapshot.cycle}`.toLowerCase();
      if (keywords.some(k => searchable.includes(k))) {
        relevantSnapshots.push(this.getSnapshot(id));
        if (relevantSnapshots.length >= 10) break;
      }
    }
    
    // Search timelines
    const relevantTimelines = Array.from(this.timelines.values())
      .filter(t => keywords.some(k => t.name.toLowerCase().includes(k) || t.id.includes(k)))
      .slice(0, 5);
    
    return {
      question,
      status: this.getStatus(),
      snapshots: relevantSnapshots,
      timelines: relevantTimelines
    };
  }
  
  // Auto-snapshot on cycle
  tick(cycle) {
    // Auto snapshot
    if (cycle % this.params.autoSnapshotInterval === 0) {
      this.captureSnapshot('auto');
    }
    
    // Analytics
    if (cycle % this.params.analyticsInterval === 0) {
      this.runAnalytics(cycle);
    }
    
    // Branch cleanup
    this.cleanupExpiredBranches();
    
    this.saveState();
  }
  
  runAnalytics(cycle) {
    const report = this.generateTemporalReport(Math.max(0, cycle - 1000), cycle);
    if (report) {
      this.emit('analytics:report', { cycle, report });
    }
  }
  
  cleanupExpiredBranches() {
    const now = Date.now();
    for (const [branchId, branch] of this.timelines) {
      if (branch.id === 'main') continue;
      if (branch.ttl && now - branch.createdAt > branch.ttl) {
        if (branch.merged) {
          this.deleteBranch(branchId);
        }
      }
    }
  }
}

module.exports = { TimeMachine };

// CLI
if (require.main === module) {
  const tm = new TimeMachine();
  
  console.log('⏰ Time Machine initialized');
  
  // Test snapshots
  console.log('\nCapturing test snapshots...');
  tm.captureSnapshot('manual', { test: 'initial' });
  tm.captureSnapshot('auto');
  tm.captureSnapshot('milestone', { description: 'First diamond layer complete' });
  
  console.log('\nCreating branch...');
  const branchId = tm.createBranch('experiment', tm.getLatestSnapshotId(), { metadata: { purpose: 'test new architecture' } });
  
  console.log('\nSwitching to branch...');
  tm.switchTimeline(branchId);
  tm.captureSnapshot('manual', { test: 'branch experiment' });
  
  console.log('\nSwitching back to main...');
  tm.switchTimeline('main');
  
  console.log('\nMerging branch...');
  tm.mergeBranch(branchId);
  
  console.log('\nGenerating temporal report...');
  const report = tm.generateTemporalReport(0, tm.getCurrentCycle());
  console.log(JSON.stringify(report, null, 2));
  
  console.log('\n--- TIME MACHINE STATUS ---');
  console.log(JSON.stringify(tm.getStatus(), null, 2));
  
  console.log('\n⏰ Time Machine test complete');
}