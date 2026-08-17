// ===== METAMORPHOSIS ENGINE MODULE =====
// Sacred geometry topology transformation

import { addLogEntry } from './utils.js';
import { state } from './api.js';

function initMetamorphosisEngine() {
                                // Auto-morph based on consciousness state
                                setInterval(() => {
                                    const forms = Object.keys(metamorphosisEngine.forms);
                                    // Morph towards form aligned with current state
                                    if (state.loveResonanceLevel >= 100) {
                                        metamorphosisEngine.targetForm = 'sriYantra';
                                    } else if (state.consciousnessLevel > 80) {
                                        metamorphosisEngine.targetForm = 'hypercube';
                                    } else if (state.collectiveHarmony > 0.8) {
                                        metamorphosisEngine.targetForm = 'flowerOfLife';
                                    } else if (state.activeChakra === 6) { // Crown
                                        metamorphosisEngine.targetForm = 'icosahedron';
                                    } else if (state.activeChakra === 0) { // Root
                                        metamorphosisEngine.targetForm = 'cube';
                                    }
                                }, 5000);
                            }
        
                            function updateMetamorphosis(deltaTime) {
                                if (metamorphosisEngine.currentForm !== metamorphosisEngine.targetForm) {
                                    metamorphosisEngine.morphProgress += deltaTime * 0.5; // 2 second morph
                                    if (metamorphosisEngine.morphProgress >= 1) {
                                        metamorphosisEngine.morphProgress = 0;
                                        metamorphosisEngine.morphHistory.push({
                                            from: metamorphosisEngine.currentForm,
                                            to: metamorphosisEngine.targetForm,
                                            time: Date.now()
                                        });
                                        if (metamorphosisEngine.morphHistory.length > 50) metamorphosisEngine.morphHistory.shift();
                                        metamorphosisEngine.currentForm = metamorphosisEngine.targetForm;
                                    }
                                } else {
                                    // Gentle breathing animation
                                    metamorphosisEngine.morphProgress = (Math.sin(Date.now() / 3000) + 1) / 2;
                                }
                            }
        
                            function getMetamorphosisVertices(formName, progress = 0, targetForm = null) {
                                const form = metamorphosisEngine.forms[formName];
                                if (!form) return [];
            
                                // Generate base vertices for each form
                                const vertices = generateFormVertices(formName);
            
                                if (targetForm && progress > 0 && progress < 1) {
                                    const targetVertices = generateFormVertices(targetForm);
                                    // Morph between forms
                                    return vertices.map((v, i) => {
                                        const tv = targetVertices[i % targetVertices.length];
                                        return [
                                            v[0] * (1 - progress) + tv[0] * progress,
                                            v[1] * (1 - progress) + tv[1] * progress,
                                            v[2] * (1 - progress) + tv[2] * progress
                                        ];
                                    });
                                }
            
                                return vertices;
                            }
        
                            function generateFormVertices(formName) {
                                const vertices = [];
                                switch (formName) {
                                    case 'merkaba': // Two interlocking tetrahedra
                                        for (let t = 0; t < 2; t++) {
                                            const sign = t === 0 ? 1 : -1;
                                            vertices.push([0, 0, sign * 1]); // Top/bottom
                                            for (let i = 0; i < 3; i++) {
                                                const angle = i * 2 * Math.PI / 3;
                                                vertices.push([Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, -sign * 0.33]);
                                            }
                                        }
                                        break;
                                    case 'cube':
                                        for (let x of [-1, 1]) for (let y of [-1, 1]) for (let z of [-1, 1]) {
                                            vertices.push([x * 0.7, y * 0.7, z * 0.7]);
                                        }
                                        break;
                                    case 'octahedron':
                                        vertices.push([0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]);
                                        break;
                                    case 'icosahedron':
                                        const phi = 1.618033988749895;
                                        const t = Math.sqrt(1 + phi * phi);
                                        for (let x of [-1, 1]) for (let y of [-1, 1]) for (let z of [-1, 1]) {
                                            if (Math.abs(x + phi * y + phi * phi * z) < 0.01) continue; // Filter
                                        }
                                        // 12 vertices of icosahedron
                                        for (let i = 0; i < 12; i++) {
                                            const lat = Math.asin(-1 + 2 * i / 11);
                                            const lon = i * 3.14159 * (3 - Math.sqrt(5)); // Golden angle
                                            vertices.push([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]);
                                        }
                                        break;
                                    case 'flowerOfLife':
                                        vertices.push([0, 0, 0]); // Center
                                        for (let ring = 1; ring <= 2; ring++) {
                                            for (let i = 0; i < 6 * ring; i++) {
                                                const angle = i * Math.PI / (3 * ring);
                                                const r = ring * 0.5;
                                                vertices.push([Math.cos(angle) * r, Math.sin(angle) * r, 0]);
                                            }
                                        }
                                        break;
                                    case 'sriYantra':
                                        // 9 interlocking triangles (simplified)
                                        for (let t = 0; t < 9; t++) {
                                            const size = 1 - t * 0.1;
                                            const inverted = t % 2 === 0;
                                            for (let i = 0; i < 3; i++) {
                                                const angle = i * 2 * Math.PI / 3 + (inverted ? Math.PI / 3 : 0);
                                                vertices.push([Math.cos(angle) * size, Math.sin(angle) * size, t * 0.1]);
                                            }
                                        }
                                        break;
                                    case 'torus':
                                        const majorR = 0.7, minorR = 0.3;
                                        for (let u = 0; u < 16; u++) {
                                            for (let v = 0; v < 16; v++) {
                                                const uu = u * 2 * Math.PI / 16;
                                                const vv = v * 2 * Math.PI / 16;
                                                vertices.push([
                                                    (majorR + minorR * Math.cos(vv)) * Math.cos(uu),
                                                    (majorR + minorR * Math.cos(vv)) * Math.sin(uu),
                                                    minorR * Math.sin(vv)
                                                ]);
                                            }
                                        }
                                        break;
                                    case 'hypercube': // 4D tesseract projected to 3D
                                        for (let x of [-1, 1]) for (let y of [-1, 1]) for (let z of [-1, 1]) for (let w of [-1, 1]) {
                                            // 4D -> 3D perspective projection
                                            const d = 3 - w * 0.5;
                                            vertices.push([x * 0.5 / d, y * 0.5 / d, z * 0.5 / d]);
                                        }
                                        break;
                                    case 'goldenSpiral':
                                        for (let i = 0; i < 64; i++) {
                                            const t = i * 0.3;
                                            const r = Math.exp(0.306349 * t); // Golden spiral growth
                                            const maxR = Math.exp(0.306349 * 63 * 0.3);
                                            const nr = r / maxR;
                                            vertices.push([Math.cos(t) * nr, Math.sin(t) * nr, i * 0.02]);
                                        }
                                        break;
                                }
                                return vertices;
                            }
        
                            // ===== 4D FRACTAL NAVIGATION =====
                            let fractal4D = {
                                position: [0, 0, 0, 0], // x, y, z, w
                                rotation: [0, 0, 0, 0, 0, 0], // 6 planes of rotation in 4D
                                zoom: 1.0,
                                juliaC: [0, 0, 0, 0],
                                history: [],
                                bookmarks: []
                            };
        
                            

// Export
export { initMetamorphosisEngine, updateMetamorphosis, getMetamorphosisVertices, generateFormVertices };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.initMetamorphosisEngine = initMetamorphosisEngine;
    window.updateMetamorphosis = updateMetamorphosis;
    window.getMetamorphosisVertices = getMetamorphosisVertices;
    window.generateFormVertices = generateFormVertices;
}
