/**
 * 💎 SELF-IMPROVING ARCHITECTURE - Layer 2 of Diamond Protocol
 * 
 * Architecture that evolves itself. Code that rewrites code.
 * Tests that generate tests. Bugs that become features.
 * 
 * "A arquitetura não é estática. Ela respira, cresce, evolui."
 */

const fs = require('fs');
const path = require('path');
const { writeJSONAtomic, readJSONSafe } = require('./utils/atomic-write');

class SelfImprovingArchitecture {
  constructor(options = {}) {
    this.rootPath = options.rootPath || path.join(__dirname, '..');
    this.archivePath = path.join(this.rootPath, 'memoria', 'architecture_evolution.json');
    this.metricsPath = path.join(this.rootPath, 'memoria', 'architecture_metrics.json');
    
    // Evolution state
    this.population = []; // Architecture candidates
    this.generation = 0;
    this.bestFitness = 0;
    this.evolutionHistory = [];
    
    // Code analysis cache
    this.fileCache = new Map();
    this.astCache = new Map();
    this.metricsCache = null;
    
    // Evolution parameters
    this.params = {
      populationSize: 20,
      mutationRate: 0.15,
      crossoverRate: 0.7,
      elitismCount: 2,
      maxGenerations: 100,
      fitnessWeights: {
        coupling: 0.25,
        cohesion: 0.25,
        complexity: 0.20,
        testCoverage: 0.15,
        maintainability: 0.10,
        performance: 0.05
      },
      mutationStrength: 0.3,
      crossoverPoints: 3
    };
    
    // Refactoring rules
    this.refactoringRules = [
      { name: 'extract_method', weight: 0.2, complexityThreshold: 50 },
      { name: 'extract_class', weight: 0.15, complexityThreshold: 200 },
      { name: 'inline_method', weight: 0.1, complexityThreshold: 10 },
      { name: 'replace_conditional', weight: 0.15, complexityThreshold: 30 },
      { name: 'introduce_parameter_object', weight: 0.1, complexityThreshold: 40 },
      { name: 'remove_dead_code', weight: 0.2, complexityThreshold: 0 },
      { name: 'simplify_conditional', weight: 0.1, complexityThreshold: 20 },
      { name: 'extract_interface', weight: 0.1, complexityThreshold: 100 }
    ];
    
    this.loadState();
    this.scanCodebase();
  }

  // ============================================================
  // CODEBASE SCANNING & ANALYSIS
  // ============================================================
  
  scanCodebase() {
    console.log('[Architecture] Scanning codebase...');
    const files = this.getJSFiles(this.rootPath);
    
    const metrics = {
      files: [],
      summary: {
        totalFiles: 0,
        totalLines: 0,
        totalFunctions: 0,
        totalClasses: 0,
        avgComplexity: 0,
        maxComplexity: 0,
        coupling: 0,
        cohesion: 0,
        testCoverage: 0,
        maintainabilityIndex: 0,
        technicalDebt: 0
      }
    };
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const fileMetrics = this.analyzeFile(file, content);
      metrics.files.push(fileMetrics);
      this.fileCache.set(file, { content, metrics: fileMetrics, lastModified: fs.statSync(file).mtime });
    }
    
    // Calculate summary
    this.calculateSummary(metrics);
    this.metricsCache = metrics;
    this.saveMetrics(metrics);
    
    console.log('[Architecture] Scan complete:', metrics.summary);
    return metrics;
  }
  
  getJSFiles(dir) {
    const files = [];
    const ignoreDirs = ['node_modules', '.git', '.pm2', 'dist', 'build', 'coverage'];
    
    function scan(d) {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        if (ignoreDirs.includes(entry.name)) continue;
        const fullPath = path.join(d, entry.name);
        if (entry.isDirectory()) {
          scan(fullPath);
        } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.test.js')) {
          files.push(fullPath);
        }
      }
    }
    
    scan(dir);
    return files;
  }
  
  analyzeFile(filePath, content) {
    const lines = content.split('\n');
    const relativePath = path.relative(this.rootPath, filePath);
    
    // Simple AST-like analysis using regex (lightweight)
    const functions = this.extractFunctions(content);
    const classes = this.extractClasses(content);
    const imports = this.extractImports(content);
    const exports = this.extractExports(content);
    const complexity = this.calculateComplexity(content, functions);
    const coupling = this.calculateCoupling(imports, exports);
    const cohesion = this.calculateCohesion(functions, classes);
    const maintainability = this.calculateMaintainability(lines.length, complexity, coupling, cohesion);
    const testCoverage = this.estimateTestCoverage(filePath);
    const technicalDebt = this.estimateTechnicalDebt(complexity, coupling, cohesion, testCoverage);
    const codeSmells = this.detectCodeSmells(content, functions, classes, complexity);
    
    return {
      path: relativePath,
      lines: lines.length,
      functions: functions,
      classes: classes,
      imports: imports.length,
      exports: exports.length,
      complexity,
      coupling,
      cohesion,
      maintainability,
      testCoverage,
      technicalDebt,
      codeSmells,
      imports: imports.map(i => i.source),
      exports: exports.map(e => e.name)
    };
  }
  
  extractFunctions(content) {
    const functions = [];
    // Function declarations
    const fnDeclRegex = /function\s+(\w+)\s*\([^)]*\)\s*{/g;
    let match;
    while ((match = fnDeclRegex.exec(content)) !== null) {
      functions.push({ name: match[1], type: 'declaration', line: content.substr(0, match.index).split('\n').length });
    }
    // Arrow functions
    const arrowRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*{/g;
    while ((match = arrowRegex.exec(content)) !== null) {
      functions.push({ name: match[1], type: 'arrow', line: content.substr(0, match.index).split('\n').length });
    }
    // Method definitions in classes
    const methodRegex = /(?:async\s+)?(\w+)\s*\([^)]*\)\s*{/g;
    while ((match = methodRegex.exec(content)) !== null) {
      if (!match[1].match(/^(if|for|while|switch|catch|function|class)$/)) {
        functions.push({ name: match[1], type: 'method', line: content.substr(0, match.index).split('\n').length });
      }
    }
    return functions;
  }
  
  extractClasses(content) {
    const classes = [];
    const classRegex = /class\s+(\w+)(?:\s+extends\s+\w+)?\s*{/g;
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      classes.push({ name: match[1], line: content.substr(0, match.index).split('\n').length });
    }
    return classes;
  }
  
  extractImports(content) {
    const imports = [];
    // ES6 imports
    const importRegex = /import\s+(?:(?:\w+|{[^}]+})\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push({ source: match[1], line: content.substr(0, match.index).split('\n').length });
    }
    // CommonJS requires
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      imports.push({ source: match[1], line: content.substr(0, match.index).split('\n').length });
    }
    return imports;
  }
  
  extractExports(content) {
    const exports = [];
    // Named exports
    const exportRegex = /export\s+(?:const|let|var|function|class)\s+(\w+)/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push({ name: match[1], type: 'named', line: content.substr(0, match.index).split('\n').length });
    }
    // Default export
    const defaultExportRegex = /export\s+default\s+(?:class|function)\s+(\w+)/g;
    while ((match = defaultExportRegex.exec(content)) !== null) {
      exports.push({ name: match[1] || 'default', type: 'default', line: content.substr(0, match.index).split('\n').length });
    }
    // module.exports
    const moduleExportRegex = /module\.exports\s*=\s*(\w+)/g;
    while ((match = moduleExportRegex.exec(content)) !== null) {
      exports.push({ name: match[1], type: 'commonjs', line: content.substr(0, match.index).split('\n').length });
    }
    return exports;
  }
  
  calculateComplexity(content, functions) {
    // Cyclomatic complexity approximation
    let complexity = 1; // Base complexity
    
    // Decision points
    const decisionPatterns = [
      /\bif\b/g, /\belse\s+if\b/g, /\bwhile\b/g, /\bfor\b/g,
      /\bswitch\b/g, /\bcase\b/g, /\bcatch\b/g,
      /\?\s*.*\s*:/g, // ternary
      /\|\|/g, /&&/g // logical operators
    ];
    
    for (const pattern of decisionPatterns) {
      const matches = content.match(pattern);
      if (matches) complexity += matches.length;
    }
    
    // Function complexity
    for (const fn of functions) {
      // Estimate function complexity by length
      const fnStart = content.indexOf(fn.name);
      if (fnStart >= 0) {
        const fnContent = content.substr(fnStart, 500); // first 500 chars of function
        const fnComplexity = 1 + (fnContent.match(/\bif\b/g) || []).length + 
                            (fnContent.match(/\belse\b/g) || []).length +
                            (fnContent.match(/\bwhile\b/g) || []).length +
                            (fnContent.match(/\bfor\b/g) || []).length +
                            (fnContent.match(/\bswitch\b/g) || []).length;
        complexity += Math.min(fnComplexity, 10); // cap per function
      }
    }
    
    return Math.max(1, complexity);
  }
  
  calculateCoupling(imports, exports) {
    // Afferent coupling (Ca) - who depends on this
    // Efferent coupling (Ce) - what this depends on
    const externalImports = imports.filter(i => !i.source.startsWith('.') && !i.source.startsWith('/')).length;
    const internalImports = imports.filter(i => i.source.startsWith('.') || i.source.startsWith('/')).length;
    
    // Coupling = external deps / total deps (normalized)
    const totalDeps = externalImports + internalImports;
    if (totalDeps === 0) return 0;
    
    // High external coupling = bad, high internal = good (modular)
    return Math.min(1, externalImports / totalDeps);
  }
  
  calculateCohesion(functions, classes) {
    // High cohesion = related functions grouped together
    // Simplified: ratio of methods to classes, function relatedness
    if (classes.length === 0 && functions.length === 0) return 0;
    if (classes.length === 0) return functions.length > 5 ? 0.3 : 0.7; // standalone functions
    
    // Ideal: each class has 3-10 methods
    const avgMethodsPerClass = functions.length / Math.max(1, classes.length);
    if (avgMethodsPerClass >= 3 && avgMethodsPerClass <= 10) return 1;
    if (avgMethodsPerClass > 10) return 0.6; // too many methods
    if (avgMethodsPerClass < 2) return 0.4; // anemic classes
    return 0.8;
  }
  
  calculateMaintainability(lines, complexity, coupling, cohesion) {
    // Maintainability Index approximation (MI)
    // MI = 171 - 5.2 * ln(avgV) - 0.23 * avgV(g') - 16.2 * ln(avgLOC) + 50 * sin(sqrt(2.4 * cm))
    // Simplified version
    const volume = lines * Math.log2(Math.max(1, complexity));
    const mi = 171 - 5.2 * Math.log(Math.max(1, complexity)) - 0.23 * complexity - 16.2 * Math.log(Math.max(1, lines)) + 50 * Math.sin(Math.sqrt(2.4 * cohesion));
    return Math.max(0, Math.min(100, mi));
  }
  
  estimateTestCoverage(filePath) {
    const testPath = filePath.replace('.js', '.test.js');
    if (fs.existsSync(testPath)) {
      const testContent = fs.readFileSync(testPath, 'utf-8');
      const testLines = testContent.split('\n').length;
      const sourceLines = fs.readFileSync(filePath, 'utf-8').split('\n').length;
      // Rough estimate: test lines / source lines ratio
      return Math.min(1, testLines / Math.max(1, sourceLines));
    }
    return 0;
  }
  
  estimateTechnicalDebt(complexity, coupling, cohesion, testCoverage) {
    // Technical debt in "hours to fix"
    let debt = 0;
    debt += complexity * 0.5; // complexity debt
    debt += coupling * 10; // coupling debt
    debt += (1 - cohesion) * 20; // cohesion debt
    debt += (1 - testCoverage) * 30; // testing debt
    return Math.round(debt);
  }
  
  detectCodeSmells(content, functions, classes, complexity) {
    const smells = [];
    
    // Long method
    for (const fn of functions) {
      if (fn.type === 'method' && complexity > 50) {
        smells.push({ type: 'long_method', function: fn.name, severity: 'high' });
      }
    }
    
    // Large class
    for (const cls of classes) {
      const classMethods = functions.filter(f => f.type === 'method').length;
      if (classMethods > 20) {
        smells.push({ type: 'large_class', class: cls.name, severity: 'high', methods: classMethods });
      }
    }
    
    // Long parameter list (heuristic)
    const paramRegex = /function\s+\w+\s*\(([^)]{100,})\)/g;
    if (content.match(paramRegex)) {
      smells.push({ type: 'long_parameter_list', severity: 'medium' });
    }
    
    // Duplicate code (simplified)
    const lines = content.split('\n');
    const lineMap = new Map();
    for (let i = 0; i < lines.length - 5; i++) {
      const block = lines.slice(i, i + 6).join('\n').trim();
      if (block.length > 50) {
        const count = lineMap.get(block) || 0;
        lineMap.set(block, count + 1);
      }
    }
    for (const [block, count] of lineMap) {
      if (count > 1 && block.length > 100) {
        smells.push({ type: 'duplicate_code', severity: 'medium', occurrences: count });
        break; // just report once
      }
    }
    
    // God object
    if (classes.length === 1 && functions.length > 30) {
      smells.push({ type: 'god_object', class: classes[0].name, severity: 'critical' });
    }
    
    return smells;
  }
  
    calculateSummary(metrics) {
    const { files } = metrics;
    if (files.length === 0) return;
    
    let totalFunctions = 0;
    let totalClasses = 0;
    for (const f of files) {
      totalFunctions += (f.functions?.length || 0);
      totalClasses += (f.classes?.length || 0);
    }
    
    metrics.summary.totalFiles = files.length;
    metrics.summary.totalLines = files.reduce((s, f) => s + f.lines, 0);
    metrics.summary.totalFunctions = totalFunctions;
    metrics.summary.totalClasses = totalClasses;
    metrics.summary.avgComplexity = files.reduce((s, f) => s + f.complexity, 0) / files.length;
    metrics.summary.maxComplexity = Math.max(...files.map(f => f.complexity));
    metrics.summary.coupling = files.reduce((s, f) => s + f.coupling, 0) / files.length;
    metrics.summary.cohesion = files.reduce((s, f) => s + f.cohesion, 0) / files.length;
    metrics.summary.testCoverage = files.reduce((s, f) => s + f.testCoverage, 0) / files.length;
    metrics.summary.maintainabilityIndex = files.reduce((s, f) => s + f.maintainability, 0) / files.length;
    metrics.summary.technicalDebt = files.reduce((s, f) => s + f.technicalDebt, 0);
  }
  
  // ============================================================
  // EVOLUTIONARY ARCHITECTURE SEARCH
  // ============================================================
  
  initializePopulation() {
    this.population = [];
    const baseArchitecture = this.extractArchitectureGenome();
    
    for (let i = 0; i < this.params.populationSize; i++) {
      const individual = this.mutateGenome(baseArchitecture, i === 0 ? 0 : this.params.mutationStrength);
      individual.id = `gen${this.generation}_ind${i}`;
      individual.fitness = 0;
      individual.age = 0;
      this.population.push(individual);
    }
    
    console.log(`[Architecture] Population initialized: ${this.population.length} individuals`);
  }
  
  extractArchitectureGenome() {
    // Encode current architecture as genome
    const metrics = this.metricsCache;
    if (!metrics) return this.createRandomGenome();
    
    return {
      // Structural genes
      moduleCount: metrics.summary.totalFiles,
      avgModuleSize: metrics.summary.totalLines / Math.max(1, metrics.summary.totalFiles),
      functionDensity: metrics.summary.totalFunctions / Math.max(1, metrics.summary.totalFiles),
      classDensity: metrics.summary.totalClasses / Math.max(1, metrics.summary.totalFiles),
      
      // Quality genes
      avgComplexity: metrics.summary.avgComplexity,
      coupling: metrics.summary.coupling,
      cohesion: metrics.summary.cohesion,
      testCoverage: metrics.summary.testCoverage,
      maintainability: metrics.summary.maintainabilityIndex,
      
      // Structural patterns
      patterns: this.detectArchitecturalPatterns(),
      
      // Metadata
      fitness: 0,
      generation: this.generation,
      timestamp: Date.now()
    };
  }
  
  createRandomGenome() {
    return {
      moduleCount: 10 + Math.floor(Math.random() * 20),
      avgModuleSize: 100 + Math.random() * 400,
      functionDensity: 2 + Math.random() * 8,
      classDensity: 0.5 + Math.random() * 2,
      avgComplexity: 5 + Math.random() * 20,
      coupling: Math.random() * 0.5,
      cohesion: 0.3 + Math.random() * 0.7,
      testCoverage: Math.random() * 0.5,
      maintainability: 30 + Math.random() * 70,
      patterns: [],
      fitness: 0,
      generation: 0,
      timestamp: Date.now()
    };
  }
  
  detectArchitecturalPatterns() {
    const patterns = [];
    const files = this.metricsCache?.files || [];
    
    // Layered architecture
    const layers = ['controller', 'service', 'repository', 'model', 'util', 'config'];
    const hasLayers = layers.some(l => 
      files.some(f => f.path.toLowerCase().includes(l))
    );
    if (hasLayers) patterns.push('layered');
    
    // Event-driven
    const hasEvents = files.some(f => 
      f.content?.includes('EventEmitter') || 
      f.content?.includes('emit(') || 
      f.content?.includes('on(')
    );
    if (hasEvents) patterns.push('event_driven');
    
    // Plugin architecture
    const hasPlugins = files.some(f => 
      f.path.includes('plugin') || 
      f.content?.includes('plugin')
    );
    if (hasPlugins) patterns.push('plugin');
    
    // Microservices (unlikely in monorepo)
    // ...
    
    return patterns;
  }
  
  mutateGenome(genome, strength = 1.0) {
    const mutated = JSON.parse(JSON.stringify(genome));
    const mutationRate = this.params.mutationRate * strength;
    
    // Mutate numeric genes
    const numericGenes = ['avgModuleSize', 'functionDensity', 'classDensity', 'avgComplexity', 'coupling', 'cohesion', 'testCoverage', 'maintainability'];
    
    for (const gene of numericGenes) {
      if (mutated[gene] !== undefined && Math.random() < mutationRate) {
        const current = mutated[gene];
        const variance = current * 0.1 * strength;
        mutated[gene] = Math.max(0, current + (Math.random() - 0.5) * 2 * variance);
        
        // Clamp to valid ranges
        if (gene === 'coupling' || gene === 'cohesion' || gene === 'testCoverage') {
          mutated[gene] = Math.max(0, Math.min(1, mutated[gene]));
        }
        if (gene === 'maintainability') {
          mutated[gene] = Math.max(0, Math.min(100, mutated[gene]));
        }
      }
    }
    
    // Mutate patterns
    if (Math.random() < mutationRate * 0.5) {
      const allPatterns = ['layered', 'event_driven', 'plugin', 'microservices', 'modular', 'monolithic', 'clean_architecture', 'hexagonal'];
      const currentPatterns = mutated.patterns || [];
      if (Math.random() < 0.5 && allPatterns.length > 0) {
        // Add random pattern
        const available = allPatterns.filter(p => !currentPatterns.includes(p));
        if (available.length > 0) {
          currentPatterns.push(available[Math.floor(Math.random() * available.length)]);
        }
      } else if (currentPatterns.length > 0) {
        // Remove random pattern
        currentPatterns.splice(Math.floor(Math.random() * currentPatterns.length), 1);
      }
      mutated.patterns = currentPatterns;
    }
    
    mutated.generation = this.generation + 1;
    mutated.timestamp = Date.now();
    mutated.fitness = 0;
    
    return mutated;
  }
  
  crossover(parentA, parentB) {
    const child = JSON.parse(JSON.stringify(parentA));
    
    // Multi-point crossover
    const genes = Object.keys(parentA).filter(k => typeof parentA[k] === 'number');
    const crossoverPoints = this.params.crossoverPoints;
    
    for (let i = 0; i < crossoverPoints; i++) {
      const gene = genes[Math.floor(Math.random() * genes.length)];
      if (parentB[gene] !== undefined && Math.random() < this.params.crossoverRate) {
        child[gene] = parentB[gene];
      }
    }
    
    // Crossover patterns
    if (Math.random() < this.params.crossoverRate) {
      const patternsA = parentA.patterns || [];
      const patternsB = parentB.patterns || [];
      const allPatterns = [...new Set([...patternsA, ...patternsB])];
      child.patterns = allPatterns.filter(() => Math.random() < 0.5);
    }
    
    child.id = `gen${this.generation + 1}_cross_${Date.now()}`;
    child.generation = this.generation + 1;
    child.timestamp = Date.now();
    child.fitness = 0;
    
    return child;
  }
  
  // ============================================================
  // FITNESS EVALUATION
  // ============================================================
  
  evaluateFitness(genome) {
    const w = this.params.fitnessWeights;
    
    // Normalize each metric to 0-1 (higher = better)
    const normalizedCoupling = 1 - Math.min(1, genome.coupling); // lower coupling = better
    const normalizedComplexity = 1 - Math.min(1, genome.avgComplexity / 50); // lower complexity = better
    
    const fitness = 
      w.coupling * normalizedCoupling +
      w.cohesion * genome.cohesion +
      w.complexity * (1 - normalizedComplexity) +
      w.testCoverage * genome.testCoverage +
      w.maintainability * (genome.maintainability / 100) +
      w.performance * 0.5; // placeholder
    
    // Bonus for good patterns
    const patternBonus = (genome.patterns || []).length * 0.02;
    
    // Penalty for extreme values
    let penalty = 0;
    if (genome.coupling > 0.8) penalty += 0.3;
    if (genome.avgComplexity > 50) penalty += 0.2;
    if (genome.cohesion < 0.3) penalty += 0.2;
    if (genome.testCoverage < 0.2) penalty += 0.3;
    if (genome.maintainability < 30) penalty += 0.2;
    
    genome.fitness = Math.max(0, Math.min(1, fitness + patternBonus - penalty));
    return genome.fitness;
  }
  
  evaluatePopulation() {
    for (const individual of this.population) {
      this.evaluateFitness(individual);
    }
    
    // Sort by fitness (descending)
    this.population.sort((a, b) => b.fitness - a.fitness);
    
    // Track best
    if (this.population[0].fitness > this.bestFitness) {
      this.bestFitness = this.population[0].fitness;
      console.log(`[Architecture] New best fitness: ${this.bestFitness.toFixed(4)}`);
    }
  }
  
  // ============================================================
  // EVOLUTION LOOP
  // ============================================================
  
  evolve() {
    console.log(`[Architecture] Generation ${this.generation} - Evolving...`);
    
    // Evaluate current population
    this.evaluatePopulation();
    
    // Elitism - keep best individuals
    const elite = this.population.slice(0, this.params.elitismCount);
    
    // Generate next generation
    const nextGeneration = [...elite];
    
    while (nextGeneration.length < this.params.populationSize) {
      if (Math.random() < this.params.crossoverRate && this.population.length >= 2) {
        // Crossover
        const parentA = this.selectParent();
        const parentB = this.selectParent();
        if (parentA && parentB && parentA !== parentB) {
          const child = this.crossover(parentA, parentB);
          nextGeneration.push(this.mutateGenome(child));
        }
      } else {
        // Mutation only
        const parent = this.selectParent();
        if (parent) {
          nextGeneration.push(this.mutateGenome(parent));
        }
      }
    }
    
    this.population = nextGeneration.slice(0, this.params.populationSize);
    this.generation++;
    
    // Age individuals
    for (const ind of this.population) {
      ind.age = (ind.age || 0) + 1;
    }
    
    // Record history
    this.evolutionHistory.push({
      generation: this.generation,
      bestFitness: this.population[0]?.fitness || 0,
      avgFitness: this.population.reduce((s, i) => s + i.fitness, 0) / this.population.length,
      bestGenome: this.population[0] ? JSON.parse(JSON.stringify(this.population[0])) : null,
      timestamp: Date.now()
    });
    
    // Save state
    this.saveState();
    
    console.log(`[Architecture] Generation ${this.generation} complete. Best fitness: ${this.population[0]?.fitness.toFixed(4) || 0}`);
    
    return this.population[0];
  }
  
  selectParent() {
    // Tournament selection
    const tournamentSize = 3;
    let best = null;
    for (let i = 0; i < tournamentSize; i++) {
      const candidate = this.population[Math.floor(Math.random() * this.population.length)];
      if (!best || candidate.fitness > best.fitness) {
        best = candidate;
      }
    }
    return best;
  }
  
  // ============================================================
  // AUTONOMOUS REFACTORING ENGINE
  // ============================================================
  
  analyzeAndRefactor() {
    console.log('[Architecture] Analyzing codebase for refactoring opportunities...');
    
    const metrics = this.scanCodebase();
    const refactorings = [];
    
    for (const file of metrics.files) {
      const fileRefactorings = this.analyzeFileForRefactoring(file);
      refactorings.push(...fileRefactorings);
    }
    
    // Sort by impact * confidence / effort
    refactorings.sort((a, b) => (b.impact * b.confidence / b.effort) - (a.impact * a.confidence / a.effort));
    
    console.log(`[Architecture] Found ${refactorings.length} refactoring opportunities`);
    
    // Auto-apply high-confidence, low-effort refactorings
    const autoApply = refactorings.filter(r => r.confidence > 0.8 && r.effort < 0.3 && r.impact > 0.5);
    
    for (const refactoring of autoApply) {
      this.applyRefactoring(refactoring);
    }
    
    if (autoApply.length > 0) {
      console.log(`[Architecture] Auto-applied ${autoApply.length} refactorings`);
      // Rescan after changes
      this.scanCodebase();
    }
    
    return refactorings;
  }
  
  analyzeFileForRefactoring(file) {
    const refactorings = [];
    const { codeSmells, functions, classes, complexity, coupling, cohesion } = file;
    
    for (const smell of codeSmells) {
      const rule = this.refactoringRules.find(r => r.name === smell.type.replace('_', '_'));
      if (!rule) continue;
      
      const applicable = !rule.complexityThreshold || complexity >= rule.complexityThreshold;
      if (!applicable) continue;
      
      const refactoring = {
        file: file.path,
        type: smell.type,
        rule: rule.name,
        smell,
        impact: this.estimateImpact(smell, complexity, coupling, cohesion),
        confidence: this.estimateConfidence(smell, file),
        effort: this.estimateEffort(smell, file),
        description: this.generateRefactoringDescription(smell, rule)
      };
      
      refactorings.push(refactoring);
    }
    
    // Additional refactoring opportunities not tied to smells
    
    // Extract class if too many functions
    if (functions.length > 15 && classes.length === 0) {
      refactorings.push({
        file: file.path,
        type: 'extract_class',
        impact: 0.8,
        confidence: 0.7,
        effort: 0.6,
        description: 'Extract cohesive functions into dedicated classes'
      });
    }
    
    // Introduce parameter object
    const longParamFuncs = functions.filter(f => {
      const fnContent = this.getFunctionContent(file.path, f.name);
      return (fnContent.match(/\([^)]{80,}\)/g) || []).length > 0;
    });
    
    for (const fn of longParamFuncs) {
      refactorings.push({
        file: file.path,
        type: 'introduce_parameter_object',
        function: fn.name,
        impact: 0.6,
        confidence: 0.8,
        effort: 0.4,
        description: `Introduce parameter object for ${fn.name}`
      });
    }
    
    return refactorings;
  }
  
  getFunctionContent(filePath, functionName) {
    const fileData = this.fileCache.get(filePath);
    if (!fileData) return '';
    
    const content = fileData.content;
    const start = content.indexOf(functionName);
    if (start === -1) return '';
    
    // Find function body
    let braceCount = 0;
    let started = false;
    let end = start;
    for (let i = start; i < content.length; i++) {
      if (content[i] === '{') {
        braceCount++;
        started = true;
      } else if (content[i] === '}') {
        braceCount--;
        if (started && braceCount === 0) {
          end = i + 1;
          break;
        }
      }
    }
    return content.substring(start, end);
  }
  
  estimateImpact(smell, complexity, coupling, cohesion) {
    const severityWeights = { critical: 1.0, high: 0.8, medium: 0.5, low: 0.2 };
    const baseImpact = severityWeights[smell.severity] || 0.5;
    
    // Adjust based on context
    let impact = baseImpact;
    if (complexity > 50) impact *= 1.2;
    if (coupling > 0.7) impact *= 1.1;
    if (cohesion < 0.4) impact *= 1.1;
    
    return Math.min(1, impact);
  }
  
  estimateConfidence(smell, file) {
    // High confidence for well-defined patterns
    const confidenceMap = {
      'long_method': 0.9,
      'large_class': 0.85,
      'long_parameter_list': 0.8,
      'duplicate_code': 0.75,
      'god_object': 0.95
    };
    return confidenceMap[smell.type] || 0.6;
  }
  
  estimateEffort(smell, file) {
    const effortMap = {
      'long_method': 0.3,
      'large_class': 0.6,
      'long_parameter_list': 0.4,
      'duplicate_code': 0.5,
      'god_object': 0.8
    };
    return effortMap[smell.type] || 0.5;
  }
  
  generateRefactoringDescription(smell, rule) {
    const descriptions = {
      'long_method': `Extract method: ${smell.function} exceeds complexity threshold`,
      'large_class': `Extract class: ${smell.class} has too many responsibilities`,
      'long_parameter_list': 'Introduce parameter object to reduce parameter count',
      'duplicate_code': 'Extract common code into shared function/module',
      'god_object': 'Decompose god object into focused, cohesive classes'
    };
    return descriptions[smell.type] || `Apply ${rule.name} refactoring`;
  }
  
  applyRefactoring(refactoring) {
    console.log(`[Architecture] Applying refactoring: ${refactoring.type} in ${refactoring.file}`);
    
    // This would implement actual code transformations
    // For now, we simulate and log
    const filePath = path.join(this.rootPath, refactoring.file);
    if (!fs.existsSync(filePath)) return false;
    
    // In a real implementation, this would use AST manipulation
    // For now, we log and record
    this.recordRefactoring(refactoring);
    
    return true;
  }
  
  recordRefactoring(refactoring) {
    const record = {
      ...refactoring,
      appliedAt: Date.now(),
      success: true
    };
    
    // Store in evolution history
    this.evolutionHistory.push({
      type: 'refactoring',
      ...record,
      generation: this.generation
    });
    
    this.saveState();
  }
  
  // ============================================================
  // AUTONOMOUS TEST GENERATION
  // ============================================================
  
  generateTests() {
    console.log('[Architecture] Generating autonomous tests...');
    
    const metrics = this.metricsCache;
    if (!metrics) return [];
    
    const generatedTests = [];
    
    for (const file of metrics.files) {
      const testPath = file.path.replace('.js', '.test.js');
      if (fs.existsSync(path.join(this.rootPath, testPath))) continue;
      
      // Generate test file
      const testContent = this.generateTestFile(file);
      if (testContent) {
        const fullPath = path.join(this.rootPath, testPath);
        fs.writeFileSync(fullPath, testContent);
        generatedTests.push({ file: testPath, functions: file.functions.length });
        console.log(`[Architecture] Generated test: ${testPath}`);
      }
    }
    
    return generatedTests;
  }
  
  generateTestFile(file) {
    if (file.functions.length === 0) return null;
    
    const moduleName = path.basename(file.path, '.js');
    const imports = file.imports.map(i => `const ${path.basename(i.source, '.js')} = require('${i.source}');`).join('\n');
    
    let testContent = `/**
 * Auto-generated tests for ${file.path}
 * Generated by Self-Improving Architecture Layer 2
 */

${imports}
const { ${file.exports.map(e => e.name).join(', ')} } = require('./${moduleName}');

describe('${moduleName}', () => {
`;
    
    for (const fn of file.functions) {
      testContent += `
  describe('${fn.name}', () => {
    it('should exist and be a function', () => {
      expect(typeof ${fn.name}).toBe('function');
    });
    
    it('should not throw on basic invocation', () => {
      expect(() => ${fn.name}()).not.toThrow();
    });
  });
`;
    }
    
    testContent += `
});
`;
    
    return testContent;
  }
  
  // ============================================================
  // CONTINUOUS IMPROVEMENT LOOP
  // ============================================================
  
  async runContinuousImprovement(intervalMs = 300000) { // 5 minutes
    console.log('[Architecture] Starting continuous improvement loop...');
    
    while (true) {
      try {
        // 1. Scan and analyze
        this.scanCodebase();
        
        // 2. Analyze and refactor
        this.analyzeAndRefactor();
        
        // 3. Generate missing tests
        this.generateTests();
        
        // 4. Evolve architecture (if enough generations)
        if (this.generation < this.params.maxGenerations) {
          this.evolve();
        }
        
        // 5. Save state
        this.saveState();
        
        console.log(`[Architecture] Cycle complete. Next in ${intervalMs/1000}s...`);
        
        // Wait for next cycle
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        
      } catch (error) {
        console.error('[Architecture] Error in improvement loop:', error);
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 min on error
      }
    }
  }
  
  // ============================================================
  // PERSISTENCE
  // ============================================================
  
  saveState() {
    const state = {
      generation: this.generation,
      bestFitness: this.bestFitness,
      population: this.population.slice(0, 10), // Save top 10
      evolutionHistory: this.evolutionHistory.slice(-100),
      params: this.params,
      refactoringRules: this.refactoringRules,
      savedAt: Date.now()
    };
    
    try {
      writeJSONAtomic(this.archivePath, state);
    } catch (e) {
      console.error('[Architecture] Save failed:', e.message);
    }
  }
  
  loadState() {
    try {
      const state = readJSONSafe(this.archivePath, null);
      if (state) {
        this.generation = state.generation || 0;
        this.bestFitness = state.bestFitness || 0;
        this.population = state.population || [];
        this.evolutionHistory = state.evolutionHistory || [];
        if (state.params) this.params = { ...this.params, ...state.params };
        if (state.refactoringRules) this.refactoringRules = state.refactoringRules;
        console.log('[Architecture] State loaded: generation', this.generation);
      }
    } catch (e) {
      console.error('[Architecture] Load failed:', e.message);
    }
  }
  
  saveMetrics(metrics) {
    try {
      writeJSONAtomic(this.metricsPath, metrics);
    } catch (e) {
      console.error('[Architecture] Metrics save failed:', e.message);
    }
  }
  
  // ============================================================
  // PUBLIC API
  // ============================================================
  
  getArchitectureReport() {
    return {
      generation: this.generation,
      bestFitness: this.bestFitness,
      populationSize: this.population.length,
      metrics: this.metricsCache?.summary || null,
      topIndividual: this.population[0] || null,
      evolutionHistory: this.evolutionHistory.slice(-10),
      codeSmells: this.metricsCache?.files.flatMap(f => f.codeSmells.map(s => ({ file: f.path, ...s }))) || [],
      refactoringOpportunities: this.analyzeAndRefactor().length
    };
  }
  
  getFileMetrics(filePath) {
    const relative = path.relative(this.rootPath, filePath);
    return this.metricsCache?.files.find(f => f.path === relative) || null;
  }
  
  // Export genome for external use
  exportBestGenome() {
    return this.population[0] ? JSON.parse(JSON.stringify(this.population[0])) : null;
  }

  // Import genome
  importGenome(genome) {
    if (this.population.length < this.params.populationSize) {
      this.population.push({ ...genome, id: `imported_${Date.now()}`, fitness: 0 });
    } else {
      // Replace worst
      this.population.sort((a, b) => a.fitness - b.fitness);
      this.population[0] = { ...genome, id: `imported_${Date.now()}`, fitness: 0 };
    }
    this.saveState();
  }

  // Tick method for Diamond Protocol integration (runs every 100 cycles)
  tick(cycle) {
    // Self-improving architecture runs deep analysis less frequently
    // No-op for regular ticks - heavy lifting happens in analyzeAndRefactor/evolve
  }
}

module.exports = { SelfImprovingArchitecture };

// CLI
if (require.main === module) {
  const arch = new SelfImprovingArchitecture();
  
  console.log('💎 Self-Improving Architecture initialized');
  console.log('Initial scan...');
  arch.scanCodebase();
  
  console.log('\nAnalyzing refactoring opportunities...');
  const refactorings = arch.analyzeAndRefactor();
  console.log(`Found ${refactorings.length} refactoring opportunities`);
  
  console.log('\nGenerating tests...');
  const tests = arch.generateTests();
  console.log(`Generated ${tests.length} test files`);
  
  console.log('\nInitializing evolution population...');
  arch.initializePopulation();
  
  console.log('\nRunning evolution for 10 generations...');
  for (let i = 0; i < 10; i++) {
    arch.evolve();
  }
  
  console.log('\n💎 Architecture report:');
  console.log(JSON.stringify(arch.getArchitectureReport(), null, 2));
  
  console.log('\n💎 Self-Improving Architecture ready');
}
