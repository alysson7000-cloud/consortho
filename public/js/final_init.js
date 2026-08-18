// ===== FINAL INITIALIZATION =====
// Initialize recursive crafting and game instances

import { addLogEntry } from './utils.js';
import { state } from './api.js';

// Recursive Crafting System - 9 Layers L0→L8=Ω
const RECIPES = {
    // L0 - PRIMAL ESSENCE
    'wood': { inputs: {}, output: 'wood', layer: 0, time: 1000, xp: 1 },
    'stone': { inputs: {}, output: 'stone', layer: 0, time: 1500, xp: 1 },
    'water': { inputs: {}, output: 'water', layer: 0, time: 2000, xp: 1 },
    'fire': { inputs: {}, output: 'fire', layer: 0, time: 2500, xp: 2 },
    'air': { inputs: {}, output: 'air', layer: 0, time: 3000, xp: 2 },
    'ether': { inputs: {}, output: 'ether', layer: 0, time: 5000, xp: 5 },
    
    // L1 - BASIC MATERIALS
    'plank': { inputs: { wood: 2 }, output: 'plank', layer: 1, time: 2000, xp: 5 },
    'brick': { inputs: { stone: 2 }, output: 'brick', layer: 1, time: 3000, xp: 5 },
    'steam': { inputs: { water: 1, fire: 1 }, output: 'steam', layer: 1, time: 2500, xp: 10 },
    'crystal': { inputs: { stone: 1, ether: 1 }, output: 'crystal', layer: 1, time: 5000, xp: 20 },
    'essence': { inputs: { air: 1, ether: 1 }, output: 'essence', layer: 1, time: 4000, xp: 15 },
    
    // L2 - COMPONENTS
    'gear': { inputs: { plank: 1, brick: 1 }, output: 'gear', layer: 2, time: 5000, xp: 25 },
    'circuit': { inputs: { crystal: 1, steam: 1 }, output: 'circuit', layer: 2, time: 6000, xp: 30 },
    'rune': { inputs: { essence: 1, crystal: 1 }, output: 'rune', layer: 2, time: 7000, xp: 35 },
    'core': { inputs: { gear: 1, circuit: 1 }, output: 'core', layer: 2, time: 8000, xp: 50 },
    
    // L3 - SYSTEMS
    'engine': { inputs: { core: 1, gear: 2 }, output: 'engine', layer: 3, time: 15000, xp: 100 },
    'processor': { inputs: { core: 1, circuit: 2 }, output: 'processor', layer: 3, time: 15000, xp: 100 },
    'artifact': { inputs: { core: 1, rune: 2 }, output: 'artifact', layer: 3, time: 20000, xp: 150 },
    
    // L4 - CONSTRUCTS
    'golem': { inputs: { engine: 1, artifact: 1 }, output: 'golem', layer: 4, time: 30000, xp: 300 },
    'ai_core': { inputs: { processor: 1, artifact: 1 }, output: 'ai_core', layer: 4, time: 30000, xp: 300 },
    'guardian': { inputs: { engine: 1, processor: 1, rune: 1 }, output: 'guardian', layer: 4, time: 45000, xp: 500 },
    
    // L5 - ENTITIES
    'companion': { inputs: { golem: 1, ai_core: 1 }, output: 'companion', layer: 5, time: 60000, xp: 1000 },
    'avatar': { inputs: { guardian: 1, ai_core: 1 }, output: 'avatar', layer: 5, time: 60000, xp: 1000 },
    'deity_fragment': { inputs: { avatar: 1, artifact: 3 }, output: 'deity_fragment', layer: 5, time: 120000, xp: 2000 },
    
    // L6 - REALMS
    'pocket_dimension': { inputs: { deity_fragment: 1, companion: 1 }, output: 'pocket_dimension', layer: 6, time: 300000, xp: 5000 },
    'sanctuary': { inputs: { pocket_dimension: 1, avatar: 1 }, output: 'sanctuary', layer: 6, time: 300000, xp: 5000 },
    
    // L7 - COSMIC
    'world_seed': { inputs: { sanctuary: 1, deity_fragment: 3 }, output: 'world_seed', layer: 7, time: 600000, xp: 15000 },
    'star_core': { inputs: { world_seed: 1, avatar: 1 }, output: 'star_core', layer: 7, time: 600000, xp: 15000 },
    
    // L8 - OMEGA (∞)
    'omega_singularity': { inputs: { star_core: 1, world_seed: 1, deity_fragment: 13 }, output: 'omega_singularity', layer: 8, time: 3600000, xp: 100000 },
};

const LAYER_NAMES = [
    'PRIMAL ESSENCE (L0)',
    'BASIC MATERIALS (L1)', 
    'COMPONENTS (L2)',
    'SYSTEMS (L3)',
    'CONSTRUCTS (L4)',
    'ENTITIES (L5)',
    'REALMS (L6)',
    'COSMIC (L7)',
    'OMEGA SINGULARITY (L8=∞)'
];

const LAYER_COLORS = [
    '#8B4513', // L0 - brown
    '#CD853F', // L1 - peru
    '#B8860B', // L2 - darkgoldenrod
    '#DAA520', // L3 - goldenrod
    '#FFD700', // L4 - gold
    '#FFA500', // L5 - orange
    '#FF8C00', // L6 - darkorange
    '#FF4500', // L7 - orangered
    '#FF00FF', // L8 - magenta (∞)
];

let craftingState = {
    inventory: {},
    craftingQueue: [],
    currentCraft: null,
    craftProgress: 0,
    discoveredRecipes: new Set(['wood', 'stone', 'water', 'fire', 'air', 'ether']),
    totalXP: 0,
    layerXP: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    activeLayer: 0,
    recursionDepth: 0,
    gamesGenerated: [],
    dreamQueue: []
};

// Load from IndexedDB
async function loadCraftingState() {
    return new Promise((resolve) => {
        const request = indexedDB.open('ConsorthoCrafting', 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('crafting')) {
                db.createObjectStore('crafting', { keyPath: 'id' });
            }
        };
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('crafting', 'readonly');
            const store = tx.objectStore('crafting');
            const getReq = store.get('main');
            getReq.onsuccess = () => {
                if (getReq.result) {
                    craftingState = { ...craftingState, ...getReq.result.data };
                    craftingState.discoveredRecipes = new Set(craftingState.discoveredRecipes || ['wood', 'stone', 'water', 'fire', 'air', 'ether']);
                }
                resolve();
            };
            getReq.onerror = () => resolve();
        };
        request.onerror = () => resolve();
    });
}

// Save to IndexedDB
async function saveCraftingState() {
    return new Promise((resolve) => {
        const request = indexedDB.open('ConsorthoCrafting', 1);
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('crafting', 'readwrite');
            const store = tx.objectStore('crafting');
            store.put({ id: 'main', data: craftingState, timestamp: Date.now() });
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
        };
    });
}

// Check if recipe can be crafted
function canCraft(recipeId) {
    const recipe = RECIPES[recipeId];
    if (!recipe) return false;
    for (const [input, amount] of Object.entries(recipe.inputs)) {
        if ((craftingState.inventory[input] || 0) < amount) return false;
    }
    return true;
}

// Start crafting
function startCraft(recipeId) {
    if (!canCraft(recipeId)) return false;
    
    const recipe = RECIPES[recipeId];
    for (const [input, amount] of Object.entries(recipe.inputs)) {
        craftingState.inventory[input] -= amount;
        if (craftingState.inventory[input] <= 0) delete craftingState.inventory[input];
    }
    
    craftingState.currentCraft = { recipeId, startTime: Date.now(), duration: recipe.time };
    craftingState.craftProgress = 0;
    addLogEntry(`🔨 Crafting ${recipeId}...`, 'info');
    return true;
}

// Update crafting progress
function updateCrafting(deltaTime) {
    if (!craftingState.currentCraft) return;
    
    craftingState.craftProgress += deltaTime;
    if (craftingState.craftProgress >= craftingState.currentCraft.duration) {
        completeCraft();
    }
}

function completeCraft() {
    const recipe = RECIPES[craftingState.currentCraft.recipeId];
    craftingState.inventory[recipe.output] = (craftingState.inventory[recipe.output] || 0) + 1;
    craftingState.totalXP += recipe.xp;
    craftingState.layerXP[recipe.layer] += recipe.xp;
    craftingState.discoveredRecipes.add(recipe.output);
    
    // Check for layer unlock
    if (craftingState.activeLayer < recipe.layer) {
        craftingState.activeLayer = recipe.layer;
        addLogEntry(`✨ LAYER ${recipe.layer} DESBLOQUEADO: ${LAYER_NAMES[recipe.layer]}`, 'success');
    }
    
    addLogEntry(`✅ Crafted ${recipe.output} (+${recipe.xp} XP)`, 'success');
    craftingState.currentCraft = null;
    craftingState.craftProgress = 0;
    saveCraftingState();
}

// Collect primal resource
function collectResource(resource) {
    if (!['wood', 'stone', 'water', 'fire', 'air', 'ether'].includes(resource)) return;
    craftingState.inventory[resource] = (craftingState.inventory[resource] || 0) + 1;
    addLogEntry(`🌿 Coletou ${resource}`, 'info');
    saveCraftingState();
}

// Game Instances System
const gameInstances = new Map();
let activeGame = null;

function createGameInstance(type, name = null) {
    const id = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const instance = {
        id,
        type,
        name: name || `${type.toUpperCase()} ${gameInstances.size + 1}`,
        created: Date.now(),
        worldData: {
            recursionDepth: 0,
            games: [],
            dreamQueue: [],
            entities: [],
            resources: { ...craftingState.inventory }
        },
        renderer: null
    };
    gameInstances.set(id, instance);
    return instance;
}

function loadGameInstances() {
    // Create default instances for each layer
    const types = ['rpg', 'mmo', 'city', 'god', 'universe', 'meta'];
    types.forEach((type, i) => {
        if (!Array.from(gameInstances.values()).find(g => g.type === type)) {
            createGameInstance(type);
        }
    });
    addLogEntry(`🎮 ${gameInstances.size} instâncias de jogo carregadas`, 'success');
}

function enterGameMode(instanceId) {
    const instance = gameInstances.get(instanceId);
    if (!instance) return;
    activeGame = instanceId;
    
    // Show game canvas, hide main ritual
    document.querySelectorAll('.game-canvas').forEach(c => c.style.display = 'none');
    const canvas = document.getElementById(`${instance.type}Canvas`);
    if (canvas) canvas.style.display = 'block';
    
    // Initialize renderer
    if (window.initGameRenderer) {
        setTimeout(() => window.initGameRenderer(instance), 100);
    }
    
    addLogEntry(`🎮 Entrou no modo ${instance.type.toUpperCase()}: ${instance.name}`, 'success');
}

function exitGameMode() {
    activeGame = null;
    document.querySelectorAll('.game-canvas').forEach(c => c.style.display = 'none');
    const mainCanvas = document.getElementById('resonanceCanvas');
    if (mainCanvas) mainCanvas.style.display = 'block';
    addLogEntry('⬅ Voltou ao Ritual Principal', 'info');
}

// Recursive actions
function actionGenerate() {
    if (!activeGame) return;
    const instance = gameInstances.get(activeGame);
    instance.worldData.games.push(`Generated_${Date.now()}`);
    addLogEntry('🎲 Novo jogo gerado!', 'success');
}

function actionMutate() {
    if (!activeGame) return;
    const instance = gameInstances.get(activeGame);
    if (instance.renderer && instance.renderer.actionMutate) {
        instance.renderer.actionMutate();
    }
    addLogEntry('🧬 Sistemas mutados!', 'success');
}

function actionDream() {
    if (!activeGame) return;
    const instance = gameInstances.get(activeGame);
    instance.worldData.dreamQueue.push(`Dream_${Date.now()}`);
    if (window.startDreamCycle) window.startDreamCycle(true);
    addLogEntry('💤 Dream Incubator ativado!', 'success');
}

function actionRecurse() {
    if (!activeGame) return;
    const instance = gameInstances.get(activeGame);
    instance.worldData.recursionDepth = (instance.worldData.recursionDepth || 0) + 1;
    craftingState.recursionDepth = instance.worldData.recursionDepth;
    addLogEntry(`♾️ RECURSÃO! Profundidade ${instance.worldData.recursionDepth}`, 'success');
    
    if (instance.worldData.recursionDepth >= 8) {
        addLogEntry('🌟 OMEGA SINGULARITY ALCANÇADA! ∞', 'success');
        craftingState.inventory['omega_singularity'] = (craftingState.inventory['omega_singularity'] || 0) + 1;
    }
}

// UI Rendering
function renderCraftingUI() {
    const container = document.getElementById('craftingPanel');
    if (!container) return;
    
    let html = `
        <div style="padding: 1rem;">
            <h3 style="color: var(--gold); margin-bottom: 1rem; font-size: 1rem;">
                🔨 RECURSIVE CRAFTING — Stack de 64 = ∞
                <span style="float: right; font-size: 0.7rem; color: var(--cyan);">
                    XP Total: ${craftingState.totalXP} | Layer: ${craftingState.activeLayer} | Recursão: ${craftingState.recursionDepth}
                </span>
            </h3>
            
            <!-- Inventory -->
            <div style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
                <strong style="color: var(--cyan);">INVENTÁRIO:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
    `;
    
    const invEntries = Object.entries(craftingState.inventory);
    if (invEntries.length === 0) {
        html += '<span style="color: #666;">(vazio)</span>';
    } else {
        for (const [item, count] of invEntries) {
            const recipe = Object.values(RECIPES).find(r => r.output === item);
            const layer = recipe ? recipe.layer : 0;
            const color = LAYER_COLORS[Math.min(layer, 8)];
            html += `
                <div style="background: ${color}22; border: 1px solid ${color}; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.75rem;">
                    ${item} ×${count}
                </div>
            `;
        }
    }
    
    html += `
                </div>
            </div>
            
            <!-- Recipes by Layer -->
            <div style="display: grid; gap: 0.5rem;">
    `;
    
    for (let layer = 0; layer <= craftingState.activeLayer + 1 && layer < 9; layer++) {
        const layerRecipes = Object.entries(RECIPES).filter(([, r]) => r.layer === layer);
        if (layerRecipes.length === 0) continue;
        
        const layerXP = craftingState.layerXP[layer];
        const nextLayerXP = layer < 8 ? 1000 * Math.pow(2, layer) : 0;
        
        html += `
            <div style="border: 1px solid ${LAYER_COLORS[layer]}; border-radius: 8px; overflow: hidden;">
                <div style="background: ${LAYER_COLORS[layer]}33; padding: 0.5rem; border-bottom: 1px solid ${LAYER_COLORS[layer]}; display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: ${LAYER_COLORS[layer]};">${LAYER_NAMES[layer]}</strong>
                    <span style="font-size: 0.7rem; color: var(--gold);">XP: ${layerXP}${nextLayerXP ? '/' + nextLayerXP : ''}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.3rem; padding: 0.5rem;">
        `;
        
        for (const [recipeId, recipe] of layerRecipes) {
            const discovered = craftingState.discoveredRecipes.has(recipeId);
            const craftable = canCraft(recipeId);
            const inProgress = craftingState.currentCraft?.recipeId === recipeId;
            
            if (!discovered && !craftable) continue; // Don't show locked recipes
            
            const progressBar = inProgress ? 
                `<div style="height: 3px; background: var(--gold); width: ${(craftingState.craftProgress / recipe.time) * 100}%;"></div>` : '';
            
            html += `
                <button 
                    onclick="window.craftItem('${recipeId}')"
                    ${!craftable && !inProgress ? 'disabled' : ''}
                    style="
                        padding: 0.4rem; 
                        border-radius: 6px; 
                        border: 1px solid ${craftable ? LAYER_COLORS[layer] : '#444'};
                        background: ${inProgress ? LAYER_COLORS[layer] + '44' : (craftable ? 'rgba(255,215,0,0.1)' : '#1a1a2e')};
                        color: ${craftable ? LAYER_COLORS[layer] : '#666'};
                        font-size: 0.65rem;
                        cursor: ${craftable || inProgress ? 'pointer' : 'not-allowed'};
                        text-align: left;
                        transition: all 0.2s;
                    "
                    onmouseover="this.style.background='${LAYER_COLORS[layer]}44'"
                    onmouseout="this.style.background='${inProgress ? LAYER_COLORS[layer] + '44' : (craftable ? 'rgba(255,215,0,0.1)' : '#1a1a2e')}'"
                >
                    <div style="font-weight: 700;">${recipe.output}</div>
                    <div style="font-size: 0.55rem; opacity: 0.7;">${Object.entries(recipe.inputs).map(([k,v]) => `${k}×${v}`).join(', ') || 'Primal'}</div>
                    <div style="font-size: 0.55rem; color: var(--gold);">+${recipe.xp} XP • ${(recipe.time/1000).toFixed(1)}s</div>
                    ${progressBar}
                </button>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Primal collectors
    html += `
            <div style="border: 1px solid #8B4513; border-radius: 8px; overflow: hidden; margin-top: 1rem;">
                <div style="background: #8B451333; padding: 0.5rem; border-bottom: 1px solid #8B4513;">
                    <strong style="color: #8B4513;">⛏️ COLETA PRIMAL (Click to gather)</strong>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.3rem; padding: 0.5rem;">
    `;
    
    const primalResources = ['wood', 'stone', 'water', 'fire', 'air', 'ether'];
    for (const resource of primalResources) {
        const count = craftingState.inventory[resource] || 0;
        html += `
            <button 
                onclick="window.collectResource('${resource}')"
                style="padding: 0.5rem; border-radius: 6px; border: 1px solid #8B4513; background: #8B451322; color: #CD853F; font-size: 0.7rem; cursor: pointer;"
            >
                ${resource.toUpperCase()} ×${count}
            </button>
        `;
    }
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderGameInstancesUI() {
    const container = document.getElementById('gameInstancesPanel');
    if (!container) return;
    
    let html = `
        <div style="padding: 1rem;">
            <h3 style="color: var(--gold); margin-bottom: 1rem; font-size: 1rem;">
                🎮 INSTÂNCIAS DE JOGO — Camadas L0→L8=Ω
            </h3>
            <div style="display: grid; gap: 0.5rem;">
    `;
    
    for (const instance of gameInstances.values()) {
        const isActive = activeGame === instance.id;
        const depth = instance.worldData.recursionDepth || 0;
        
        html += `
            <div style="
                border: 1px solid ${isActive ? 'var(--gold)' : '#444'};
                border-radius: 8px;
                padding: 0.75rem;
                background: ${isActive ? 'rgba(255,215,0,0.1)' : 'rgba(0,0,0,0.3)'};
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <div style="font-weight: 700; color: ${isActive ? 'var(--gold)' : 'var(--fg)'};">
                        ${instance.type.toUpperCase()} — ${instance.name}
                    </div>
                    <div style="font-size: 0.7rem; color: var(--cyan);">
                        Recursão: ${depth}/8 | Jogos: ${instance.worldData.games?.length || 0} | Sonhos: ${instance.worldData.dreamQueue?.length || 0}
                    </div>
                </div>
                <div style="display: flex; gap: 0.3rem;">
                    ${isActive ? 
                        `<button onclick="window.exitGameMode()" style="padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid var(--magenta); background: transparent; color: var(--magenta); cursor: pointer; font-size: 0.7rem;">⬅ VOLTAR</button>` :
                        `<button onclick="window.enterGameMode('${instance.id}')" style="padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid var(--gold); background: transparent; color: var(--gold); cursor: pointer; font-size: 0.7rem;">ENTRAR</button>`
                    }
                    <button onclick="window.deleteGameInstance('${instance.id}')" style="padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid #666; background: transparent; color: #666; cursor: pointer; font-size: 0.7rem;">🗑️</button>
                </div>
            </div>
        `;
    }
    
    html += `
                <button onclick="window.createNewGameInstance()" style="margin-top: 1rem; padding: 0.75rem; border-radius: 8px; border: 2px dashed var(--gold); background: transparent; color: var(--gold); cursor: pointer; font-weight: 700;">
                    ➕ NOVA INSTÂNCIA (Escolher Layer L0-L8)
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function createNewGameInstance() {
    const types = ['rpg', 'mmo', 'city', 'god', 'universe', 'meta'];
    const type = prompt('Tipo de jogo (rpg, mmo, city, god, universe, meta):', 'rpg');
    if (!type || !types.includes(type)) return;
    
    const name = prompt('Nome da instância:', `${type.toUpperCase()} ${gameInstances.size + 1}`);
    const instance = createGameInstance(type, name);
    renderGameInstancesUI();
    addLogEntry(`🎮 Nova instância criada: ${instance.name}`, 'success');
}

function deleteGameInstance(id) {
    if (confirm('Deletar esta instância?')) {
        gameInstances.delete(id);
        if (activeGame === id) exitGameMode();
        renderGameInstancesUI();
    }
}

// Main init functions
export async function initRecursiveCrafting() {
    await loadCraftingState();
    loadGameInstances();
    
    // Start crafting update loop
    setInterval(() => {
        updateCrafting(100); // 100ms steps
        renderCraftingUI();
    }, 100);
    
    // Initial render
    renderCraftingUI();
    renderGameInstancesUI();
    
    // Expose globally
    window.craftItem = startCraft;
    window.collectResource = collectResource;
    window.enterGameMode = enterGameMode;
    window.exitGameMode = exitGameMode;
    window.createNewGameInstance = createNewGameInstance;
    window.deleteGameInstance = deleteGameInstance;
    window.actionGenerate = actionGenerate;
    window.actionMutate = actionMutate;
    window.actionDream = actionDream;
    window.actionRecurse = actionRecurse;
    window.craftingState = craftingState;
    window.gameInstances = gameInstances;
    window.RECIPES = RECIPES;
    window.LAYER_NAMES = LAYER_NAMES;
    window.LAYER_COLORS = LAYER_COLORS;
    
    addLogEntry('🔨 Recursive Crafting System inicializado — 9 Layers L0→L8=Ω', 'success');
    addLogEntry('🎮 Game Instances System inicializado — 6 renderers prontos', 'success');
}

export function loadGameInstances() {
    // Create default instances if none exist
    if (gameInstances.size === 0) {
        const types = ['rpg', 'mmo', 'city', 'god', 'universe', 'meta'];
        types.forEach(type => createGameInstance(type));
    }
    renderGameInstancesUI();
}