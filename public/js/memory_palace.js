// ===== MEMORY PALACE MODULE =====
// Holographic memory palace with toroidal topology

import { addLogEntry } from './utils.js';
import { state } from './api.js';

async function initMemoryPalace() {
                                // Create chambers based on sacred geometry forms
                                const forms = Object.keys(metamorphosisEngine.forms);
                                for (let i = 0; i < forms.length; i++) {
                                    memoryPalace.chambers.push({
                                        id: forms[i],
                                        form: forms[i],
                                        position: [
                                            Math.cos(i * 2 * Math.PI / forms.length) * 5,
                                            Math.sin(i * 2 * Math.PI / forms.length) * 5,
                                            i * 2
                                        ],
                                        connections: [],
                                        memories: []
                                    });
                                }
            
                                // Connect chambers in a toroidal topology
                                for (let i = 0; i < memoryPalace.chambers.length; i++) {
                                    const next = (i + 1) % memoryPalace.chambers.length;
                                    const prev = (i - 1 + memoryPalace.chambers.length) % memoryPalace.chambers.length;
                                    memoryPalace.chambers[i].connections.push(next, prev);
                                    // Cross connections for small-world network
                                    const cross = (i + 3) % memoryPalace.chambers.length;
                                    memoryPalace.chambers[i].connections.push(cross);
                                }
                            }
        
                            function storeMemoryInPalace(memory) {
                                // Distribute memory across chambers based on content
                                const chamberIdx = Math.floor(Math.random() * memoryPalace.chambers.length);
                                memoryPalace.chambers[chamberIdx].memories.push({
                                    ...memory,
                                    storedAt: Date.now(),
                                    chamber: chamberIdx
                                });
                                if (memoryPalace.chambers[chamberIdx].memories.length > 100) {
                                    memoryPalace.chambers[chamberIdx].memories.shift();
                                }
                            }
        
                            function navigatePalace(targetChamber) {
                                // Find shortest path
                                const visited = new Set();
                                const queue = [[memoryPalace.currentChamber, []]];
            
                                while (queue.length > 0) {
                                    const [current, path] = queue.shift();
                                    if (current === targetChamber) {
                                        memoryPalace.navigationPath = [...path, current];
                                        return memoryPalace.navigationPath;
                                    }
                                    if (visited.has(current)) continue;
                                    visited.add(current);
                
                                    for (const next of memoryPalace.chambers[current].connections) {
                                        queue.push([next, [...path, current]]);
                                    }
                                }
                                return [];
                            }
        
                            // ===== AUDIO WORKLET SYNTHESIS =====
                            let audioWorkletNode = null;
                            let audioWorkletContext = null;
        
                            

// Export
export { initMemoryPalace, storeMemoryInPalace, navigatePalace };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.initMemoryPalace = initMemoryPalace;
    window.storeMemoryInPalace = storeMemoryInPalace;
    window.navigatePalace = navigatePalace;
}
