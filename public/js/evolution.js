// ===== EVOLUTION ENGINE MODULE =====
// Generative evolution with sacred genomes

import { addLogEntry } from './utils.js';
import { state } from './api.js';

function initEvolutionEngine() {
            // Create initial population of sacred geometry genomes
            for (let i = 0; i < 20; i++) {
                evolutionEngine.population.push(createRandomGenome());
            }
        }
        
        function createRandomGenome() {
            return {
                id: crypto.randomUUID(),
                // Sacred geometry parameters
                fractalType: Math.floor(Math.random() * 4), // 0=Mandelbrot, 1=Julia, 2=Burning Ship, 3=Multibrot
                juliaC: [Math.random() * 2 - 1, Math.random() * 2 - 1],
                zoomSpeed: Math.random() * 0.1 + 0.01,
                rotationSpeed: Math.random() * 0.5,
                colorScheme: Math.floor(Math.random() * 8),
                // Cymatics parameters
                cymaticFreq: 5 + Math.random() * 20,
                cymaticHarmonics: 1 + Math.floor(Math.random() * 5),
                // Chakra activation pattern
                chakraWeights: Array.from({length: 7}, () => Math.random()),
                // Portal parameters
                portalLayers: 3 + Math.floor(Math.random() * 4),
                portalRotation: Math.random() * Math.PI * 2,
                // DNA helix
                helixTurns: 2 + Math.random() * 3,
                helixPhase: Math.random() * Math.PI * 2,
                // Sound geometry
                sphericalDegree: 1 + Math.floor(Math.random() * 4),
                // Fitness
                fitness: 0,
                age: 0,
                lineage: []
            };
        }
        
        function evaluateGenomeFitness(genome, state) {
            let fitness = 0;
            
            // Resonance alignment
            fitness += (state.loveResonanceLevel || 100) / 100 * 30;
            
            // Collective harmony bonus
            fitness += (state.collectiveHarmony || 0) * 20;
            
            // Consciousness level bonus
            fitness += (state.consciousnessLevel || 0) * 25;
            
            // Universal resonance bonus
            if ((state.loveResonanceLevel || 100) >= 100) fitness += 50;
            
            // Sacred geometry coherence
            const chakraAlignment = genome.chakraWeights[state.activeChakra || 3] || 0;
            fitness += chakraAlignment * 15;
            
            // Love frequency alignment (528Hz = index 2)
            fitness += genome.chakraWeights[2] * 10;
            
            // Age penalty (encourage innovation)
            fitness -= genome.age * 0.5;
            
            genome.fitness = Math.max(0, fitness);
            return genome.fitness;
        }
        
        function evolveGeneration(state) {
            // Evaluate all genomes
            for (const genome of evolutionEngine.population) {
                evaluateGenomeFitness(genome, state);
                genome.age++;
            }
            
            // Sort by fitness
            evolutionEngine.population.sort((a, b) => b.fitness - a.fitness);
            
            // Track best
            if (!evolutionEngine.bestGenome || evolutionEngine.population[0].fitness > evolutionEngine.bestGenome.fitness) {
                evolutionEngine.bestGenome = { ...evolutionEngine.population[0] };
            }
            
            evolutionEngine.fitnessHistory.push({
                generation: evolutionEngine.generation,
                bestFitness: evolutionEngine.population[0].fitness,
                avgFitness: evolutionEngine.population.reduce((sum, g) => sum + g.fitness, 0) / evolutionEngine.population.length
            });
            if (evolutionEngine.fitnessHistory.length > 100) evolutionEngine.fitnessHistory.shift();
            
            // Elitism: keep top 4
            const elite = evolutionEngine.population.slice(0, 4);
            
            // Generate new population
            const newPopulation = [...elite];
            while (newPopulation.length < 20) {
                if (Math.random() < evolutionEngine.crossoverRate && newPopulation.length >= 2) {
                    // Crossover
                    const parent1 = tournamentSelect();
                    const parent2 = tournamentSelect();
                    newPopulation.push(crossover(parent1, parent2));
                } else {
                    // Mutation of elite
                    const parent = elite[Math.floor(Math.random() * elite.length)];
                    newPopulation.push(mutate(parent));
                }
            }
            
            evolutionEngine.population = newPopulation;
            evolutionEngine.generation++;
            
            // Adaptive mutation rate
            const recentImprovement = evolutionEngine.fitnessHistory.length > 10 
                ? evolutionEngine.fitnessHistory[evolutionEngine.fitnessHistory.length - 1].bestFitness - evolutionEngine.fitnessHistory[evolutionEngine.fitnessHistory.length - 10].bestFitness
                : 0;
            evolutionEngine.mutationRate = Math.max(0.01, Math.min(0.3, evolutionEngine.mutationRate * (recentImprovement > 0 ? 0.95 : 1.05)));
        }
        
        function tournamentSelect() {
            const tournamentSize = 3;
            let best = evolutionEngine.population[Math.floor(Math.random() * evolutionEngine.population.length)];
            for (let i = 1; i < tournamentSize; i++) {
                const contender = evolutionEngine.population[Math.floor(Math.random() * evolutionEngine.population.length)];
                if (contender.fitness > best.fitness) best = contender;
            }
            return best;
        }
        
        function crossover(parent1, parent2) {
            const child = { ...parent1, id: crypto.randomUUID(), age: 0, lineage: [...parent1.lineage, parent1.id, parent2.id] };
            
            for (const key of Object.keys(parent1)) {
                if (typeof parent1[key] === 'number' && key !== 'id' && key !== 'age' && key !== 'fitness') {
                    child[key] = Math.random() < 0.5 ? parent1[key] : parent2[key];
                } else if (Array.isArray(parent1[key])) {
                    child[key] = parent1[key].map((v, i) => Math.random() < 0.5 ? v : parent2[key][i]);
                }
            }
            
            return mutate(child, 0.5);
        }
        
        function mutate(genome, rate = 1.0) {
            const mutationStrength = evolutionEngine.mutationRate * rate;
            
            for (const key of Object.keys(genome)) {
                if (typeof genome[key] === 'number' && key !== 'id' && key !== 'age' && key !== 'fitness' && key !== 'generation') {
                    if (Math.random() < mutationStrength) {
                        genome[key] += (Math.random() - 0.5) * 0.2 * genome[key];
                    }
                } else if (Array.isArray(genome[key])) {
                    for (let i = 0; i < genome[key].length; i++) {
                        if (Math.random() < mutationStrength) {
                            genome[key][i] += (Math.random() - 0.5) * 0.2;
                            if (key === 'chakraWeights') genome[key][i] = Math.max(0, Math.min(1, genome[key][i]));
                        }
                    }
                }
            }
            
            return genome;
        }
        
        function getBestGenome() {
            return evolutionEngine.bestGenome || evolutionEngine.population[0];
        }
        
        function compileShaders() {
            // ===== SHADER 1: MAIN RENDER PROGRAM =====
            // Vertex Shader - Fullscreen quad + geometry instancing
            const vsSource = `#version 300 es
                precision highp float;
                
                // Attributes
                in vec2 a_position;
                in vec3 a_instancePos;
                in float a_instanceScale;
                in vec3 a_instanceColor;
                in float a_instanceRotation;
                in float a_instancePhase;
                in float a_instanceType; // 0=particle, 1=merkaba, 2=torus, 3=ripple, 4=quad
                in float a_instanceLife;
                in vec3 a_instanceVelocity;
                
                // Uniforms
                uniform mat3 u_projection;
                uniform float u_time;
                uniform float u_deltaTime;
                uniform float u_resonanceLevel;
                uniform vec2 u_resolution;
                uniform vec3 u_activeColor;
                uniform float u_collectiveHarmony;
                uniform float u_loveLevel;
                uniform bool u_universalActive;
                uniform float u_audioBass;
                uniform float u_audioMid;
                uniform float u_audioTreble;
                uniform float u_audioVolume;
                uniform vec2 u_lightPos;
                // Consciousness Network
                uniform float u_consciousnessLevel;
                uniform int u_activeChakra;
                uniform float u_chakraActivation;
                uniform float u_akashicTime;
                uniform vec3 u_agentPositions[12];
                uniform float u_agentThoughtIntensity[12];
                uniform int u_agentCount;
                
                // Varyings
                out vec3 v_color;
                out float v_alpha;
                out float v_type;
                out float v_depth;
                out vec2 v_uv;
                out float v_life;
                out vec3 v_worldPos;
                
                // Hash function for pseudo-random
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }
                
                float hash3(vec3 p) {
                    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
                }
                
                // 2D rotation matrix
                mat2 rot2(float a) {
                    float s = sin(a), c = cos(a);
                    return mat2(c, -s, s, c);
                }
                
                // Simplex-like noise
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    float a = hash(i);
                    float b = hash(i + vec2(1.0, 0.0));
                    float c = hash(i + vec2(0.0, 1.0));
                    float d = hash(i + vec2(1.0, 1.0));
                    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
                }
                
                float fbm(vec2 p, int octaves) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    for (int i = 0; i < 6; i++) {
                        if (i >= octaves) break;
                        value += amplitude * noise(p);
                        p *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }
                
                // Volumetric light scattering (god rays)
                float volumetricLight(vec2 uv, vec2 lightPos, float density) {
                    vec2 delta = lightPos - uv;
                    float dist = length(delta);
                    float decay = 0.95;
                    float weight = 0.0;
                    vec2 step = delta * 0.01;
                    for (int i = 0; i < 32; i++) {
                        vec2 samplePos = uv + step * float(i);
                        float n = noise(samplePos * 10.0 + u_time * 0.1);
                        weight += n * density * pow(decay, float(i));
                    }
                    return weight * 0.1;
                }
                
                void main() {
                    vec2 pos = a_position;
                    vec3 color = a_instanceColor;
                    float alpha = 1.0;
                    float type = a_instanceType;
                    float depth = 0.0;
                    vec2 uv = a_position * 0.5 + 0.5;
                    float life = a_instanceLife;
                    
                    float time = u_time;
                    float phase = a_instancePhase;
                    float scale = a_instanceScale;
                    vec3 instancePos = a_instancePos;
                    float rotation = a_instanceRotation;
                    vec3 velocity = a_instanceVelocity;
                    
                    // Audio-reactive modulation
                    float audioReact = u_audioBass * 2.0 + u_audioMid * 1.5 + u_audioTreble * 1.0;
                    float bassKick = u_audioBass;
                    
                    // Particle system (type 0) - GPU physics simulation
                    if (type == 0.0) {
                        // Spiral inflow with physics
                        float spiralAngle = atan(instancePos.y, instancePos.x) + time * 0.5 + phase;
                        float spiralR = length(instancePos) * (1.0 - phase) + phase * 0.1;
                        
                        // Audio-reactive radius
                        spiralR *= 1.0 + bassKick * 0.5;
                        
                        pos = vec2(cos(spiralAngle), sin(spiralAngle)) * spiralR * u_resolution.y * 0.5;
                        pos *= scale * (1.0 + audioReact * 0.3);
                        pos += instancePos.xy * u_resolution.y * 0.5;
                        
                        // Life cycle
                        life -= u_deltaTime * (0.5 + phase);
                        if (life <= 0.0) {
                            life = 1.0;
                            // Respawn at edge
                            float newAngle = hash3(vec3(instancePos.xy, time)) * 6.28318;
                            float newR = 0.8 + hash(vec2(instancePos.x, time)) * 0.4;
                            instancePos = vec3(cos(newAngle) * newR, sin(newAngle) * newR, (hash(vec2(instancePos.y, time)) - 0.5) * 2.0);
                        }
                        
                        alpha = life * 0.8;
                        color = mix(color, u_activeColor, 0.5 + bassKick * 0.5);
                        depth = -instancePos.z * 100.0;
                        v_life = life;
                    }
                    // Merkaba vertices (type 1)
                    else if (type == 1.0) {
                        float tetraRotation = time * 0.3 + phase + audioReact * 0.1;
                        mat2 r = rot2(tetraRotation);
                        vec2 base = r * instancePos.xy;
                        pos = base * scale * u_resolution.y * 0.25 * (1.0 + bassKick * 0.2);
                        alpha = 0.4 + 0.3 * sin(time * 2.0 + phase);
                        depth = instancePos.z * 10.0;
                        v_life = 1.0;
                    }
                    // Torus particles (type 2)
                    else if (type == 2.0) {
                        float majorR = 0.45;
                        float minorR = 0.15;
                        float tubeAngle = instancePos.x * 6.28318 + time * 0.2 * (1.0 + audioReact);
                        float segAngle = instancePos.y * 6.28318 + time * 0.5 + audioReact;
                        
                        float x = (majorR + minorR * cos(segAngle)) * cos(tubeAngle);
                        float y = (majorR + minorR * cos(segAngle)) * sin(tubeAngle) * 0.5;
                        float z = minorR * sin(segAngle);
                        
                        float scale3d = 1.0 + z / (majorR * 2.0);
                        pos = vec2(x, y) * scale3d * scale * u_resolution.y * 0.5 * (1.0 + u_audioMid * 0.3);
                        alpha = 0.5 + 0.5 * sin(segAngle * 3.0 + time + audioReact);
                        color = mix(color, u_activeColor, sin(time + phase) * 0.5 + 0.5 + u_audioTreble * 0.3);
                        depth = z * 20.0;
                        v_life = 1.0;
                    }
                    // Reality ripples (type 3)
                    else if (type == 3.0) {
                        float ripplePhase = (time * 0.2 + phase + u_audioBass * 0.1) % 1.0;
                        float rippleR = 0.2 + ripplePhase * 1.5 * (1.0 + bassKick);
                        float wave = sin(ripplePhase * 3.14159 * 4.0 + atan(pos.y, pos.x) * 8.0);
                        float thickness = 0.02 + wave * 0.01;
                        float dist = abs(length(pos) - rippleR);
                        alpha = (1.0 - ripplePhase) * 0.15 * smoothstep(thickness, 0.0, dist);
                        color = u_universalActive ? vec3(1.0, 0.0, 0.27) : vec3(0.0, 1.0, 0.53);
                        if (u_universalActive) {
                            color = mix(vec3(1.0, 0.0, 0.27), vec3(0.0, 1.0, 0.53), sin(time * 5.0 + phase * 10.0) * 0.5 + 0.5);
                        }
                        depth = ripplePhase * 100.0;
                        v_life = 1.0;
                    }
                    // Fullscreen quad for post-processing (type 4)
                    else if (type == 4.0) {
                        pos = a_position;
                        uv = a_position * 0.5 + 0.5;
                        alpha = 1.0;
                        v_life = 1.0;
                    }
                    
                    // Apply projection
                    vec3 projected = u_projection * vec3(pos, 1.0);
                    gl_Position = vec4(projected.xy, depth, 1.0);
                    gl_PointSize = max(1.0, scale * 10.0 * (1.0 + alpha) * (1.0 + bassKick));
                    
                    v_color = color;
                    v_alpha = alpha;
                    v_type = type;
                    v_depth = depth;
                    v_uv = uv;
                }
            `;
            
            // Fragment Shader - Advanced effects with volumetric light
            const fsSource = `#version 300 es
                precision highp float;
                
                in vec3 v_color;
                in float v_alpha;
                in float v_type;
                in float v_depth;
                in vec2 v_uv;
                in float v_life;
                
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform float u_resonanceLevel;
                uniform sampler2D u_resonanceTexture;
                uniform float u_audioBass;
                uniform float u_audioMid;
                uniform float u_audioTreble;
                uniform float u_audioVolume;
                uniform vec2 u_lightPos;
                // Consciousness Network
                uniform float u_consciousnessLevel;
                uniform int u_activeChakra;
                uniform float u_chakraActivation;
                uniform float u_akashicTime;
                uniform vec3 u_agentPositions[12];
                uniform float u_agentThoughtIntensity[12];
                uniform int u_agentCount;
                
                out vec4 fragColor;
                
                // Holographic noise
                float holoNoise(vec2 uv) {
                    vec2 n = fract(uv * 100.0);
                    return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453);
                }
                
                // Chromatic aberration
                vec3 chromaticAberration(vec2 uv, float intensity) {
                    vec2 offset = vec2(intensity * 0.005, 0.0);
                    float r = texture(u_resonanceTexture, uv + offset).r;
                    float g = texture(u_resonanceTexture, uv).g;
                    float b = texture(u_resonanceTexture, uv - offset).b;
                    return vec3(r, g, b);
                }
                
                // Golden ratio spiral
                float goldenSpiral(vec2 uv, float time) {
                    vec2 centered = uv - 0.5;
                    float angle = atan(centered.y, centered.x);
                    float radius = length(centered);
                    float phi = 1.618033988749895;
                    float spiral = radius - 0.02 * exp(0.306349 * angle) + time * 0.1;
                    return smoothstep(0.01, 0.0, abs(spiral));
                }
                
                // Volumetric light scattering
                float volumetricLight(vec2 uv, vec2 lightPos, float density, float time) {
                    vec2 delta = lightPos - uv;
                    float dist = length(delta);
                    float decay = 0.95;
                    float weight = 0.0;
                    vec2 step = delta * 0.02;
                    for (int i = 0; i < 32; i++) {
                        vec2 samplePos = uv + step * float(i);
                        float n = fract(sin(dot(fract(samplePos * 10.0 + time * 0.1), vec2(12.9898, 78.233))) * 43758.5453);
                        weight += n * density * pow(decay, float(i));
                    }
                    return weight * 0.15;
                }
                
                // ===== SDF RAY MARCHING FOR 3D CONSCIOUSNESS FORMS =====
                
                // Chakra colors
                vec3 chakraColors[7] = vec3[](
                    vec3(1.0, 0.0, 0.0),    // Root - Red
                    vec3(1.0, 0.5, 0.0),    // Sacral - Orange
                    vec3(1.0, 1.0, 0.0),    // Solar - Yellow
                    vec3(0.0, 1.0, 0.0),    // Heart - Green
                    vec3(0.0, 0.5, 1.0),    // Throat - Blue
                    vec3(0.3, 0.0, 0.8),    // Third Eye - Indigo
                    vec3(0.7, 0.0, 1.0)     // Crown - Violet
                );
                
                // SDF: Sphere
                float sdSphere(vec3 p, float r) {
                    return length(p) - r;
                }
                
                // SDF: Torus
                float sdTorus(vec3 p, vec2 t) {
                    vec2 q = vec2(length(p.xz) - t.x, p.y);
                    return length(q) - t.y;
                }
                
                // SDF: Capsule (chakra pillars)
                float sdCapsule(vec3 p, float h, float r) {
                    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(h, r);
                    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
                }
                
                // SDF: Infinite repetition (chakra column)
                float opRep(vec3 p, vec3 c) {
                    vec3 q = mod(p + 0.5 * c, c) - 0.5 * c;
                    return q;
                }
                
                // SDF: Chakra column (7 chakras stacked)
                float sdChakraColumn(vec3 p, float time) {
                    float columnHeight = 3.5;
                    float chakraSpacing = columnHeight / 7.0;
                    float minDist = 100.0;
                    
                    for (int i = 0; i < 7; i++) {
                        float y = -columnHeight * 0.5 + i * chakraSpacing + chakraSpacing * 0.5;
                        vec3 chakraCenter = vec3(0.0, y, 0.0);
                        
                        // Pulsing chakra sphere
                        float pulse = 0.8 + 0.2 * sin(time * 2.0 + float(i) * 0.9);
                        float r = 0.25 * pulse;
                        
                        // Activation glow
                        float activation = (float(i) == float(u_activeChakra)) ? u_chakraActivation : 0.0;
                        r += activation * 0.3;
                        
                        float d = sdSphere(p - chakraCenter, r);
                        minDist = min(minDist, d);
                    }
                    
                    // Central channel (Sushumna)
                    float channelDist = length(p.xz) - 0.08;
                    minDist = min(minDist, channelDist);
                    
                    return minDist;
                }
                
                // SDF: Merkaba (star tetrahedron)
                float sdMerkaba(vec3 p, float time) {
                    // Two interpenetrating tetrahedrons
                    float tetra1 = sdTetrahedron(p, 1.0, time * 0.3);
                    float tetra2 = sdTetrahedron(p, 1.0, -time * 0.3 + 3.14159);
                    return min(tetra1, tetra2);
                }
                
                float sdTetrahedron(vec3 p, float scale, float rot) {
                    // Rotate around Y
                    float c = cos(rot), s = sin(rot);
                    p.xz = vec2(c * p.x - s * p.z, s * p.x + c * p.z);
                    
                    // Tetrahedron vertices
                    vec3 v0 = vec3(0, scale, 0);
                    vec3 v1 = vec3(scale * 0.9428, -scale * 0.3333, 0);
                    vec3 v2 = vec3(-scale * 0.4714, -scale * 0.3333, scale * 0.8165);
                    vec3 v3 = vec3(-scale * 0.4714, -scale * 0.3333, -scale * 0.8165);
                    
                    // Face planes
                    float d1 = dot(p - v0, normalize(cross(v1 - v0, v2 - v0)));
                    float d2 = dot(p - v0, normalize(cross(v2 - v0, v3 - v0)));
                    float d3 = dot(p - v0, normalize(cross(v3 - v0, v1 - v0)));
                    float d4 = dot(p - v1, normalize(cross(v3 - v1, v2 - v1)));
                    
                    return max(max(max(d1, d2), d3), d4);
                }
                
                // SDF: Agent thought form (torus knot)
                float sdThoughtForm(vec3 p, vec3 agentPos, float intensity, float time) {
                    vec3 q = p - agentPos;
                    // Torus knot (3,2)
                    float a = atan(q.x, q.z);
                    float r = length(q.xz);
                    float h = q.y;
                    
                    float majorR = 0.5 * intensity;
                    float minorR = 0.15 * intensity;
                    
                    // Torus
                    float d = sdTorus(q, vec2(majorR, minorR));
                    
                    // Knot modulation
                    float knotMod = sin(a * 3.0 - time * 2.0 + h * 5.0) * 0.1 * intensity;
                    d += knotMod;
                    
                    return d;
                }
                
                // SDF: Akashic records (infinite library pillars)
                float sdAkashic(vec3 p, float time) {
                    vec3 q = p;
                    q.y = 0.0; // Flatten to XZ plane
                    
                    // Polar repetition
                    float angle = atan(q.x, q.z);
                    float radius = length(q.xz);
                    
                    // 12 pillars (zodiac)
                    float pillarAngle = 3.14159 * 2.0 / 12.0;
                    float sector = floor(angle / pillarAngle);
                    float localAngle = angle - sector * pillarAngle - pillarAngle * 0.5;
                    
                    float pillarR = 0.15;
                    float distToPillar = abs(localAngle) * radius - pillarR;
                    
                    // Height variation based on akashic time
                    float height = 5.0 + sin(time * 0.1 + sector) * 2.0;
                    float h = abs(p.y) - height * 0.5;
                    
                    return max(distToPillar, h);
                }
                
                // Scene SDF
                float map(vec3 p, float time) {
                    float d = 100.0;
                    
                    // Chakra column at center
                    d = min(d, sdChakraColumn(p, time));
                    
                    // Merkaba field
                    d = min(d, sdMerkaba(p * 1.5, time) * 0.5);
                    
                    // Agent thought forms
                    for (int i = 0; i < 12; i++) {
                        if (i >= u_agentCount) break;
                        vec3 agentPos = u_agentPositions[i];
                        float intensity = u_agentThoughtIntensity[i];
                        if (intensity > 0.01) {
                            d = min(d, sdThoughtForm(p, agentPos, intensity, time));
                        }
                    }
                    
                    // Akashic records (outer ring)
                    d = min(d, sdAkashic(p * 0.3, u_akashicTime) * 0.2);
                    
                    // Ground plane
                    d = min(d, p.y + 2.0);
                    
                    return d;
                }
                
                // Normal calculation
                vec3 calcNormal(vec3 p, float time) {
                    vec2 e = vec2(0.001, 0.0);
                    return normalize(vec3(
                        map(p + e.xyy, time) - map(p - e.xyy, time),
                        map(p + e.yxy, time) - map(p - e.yxy, time),
                        map(p + e.yyx, time) - map(p - e.yyx, time)
                    ));
                }
                
                // Ray marching
                vec3 rayMarch(vec3 ro, vec3 rd, float time) {
                    float t = 0.0;
                    float glow = 0.0;
                    vec3 col = vec3(0.0);
                    int steps = 0;
                    
                    for (int i = 0; i < 64; i++) {
                        vec3 p = ro + rd * t;
                        float d = map(p, time);
                        
                        // Accumulate glow near surfaces
                        float density = exp(-d * 5.0) * 0.1;
                        vec3 normal = calcNormal(p, time);
                        
                        // Chakra color contribution
                        float chakraDist = sdChakraColumn(p, time);
                        if (chakraDist < 0.3) {
                            int chakraIdx = int((p.y + 1.75) / 0.5);
                            chakraIdx = clamp(chakraIdx, 0, 6);
                            vec3 chakraCol = chakraColors[chakraIdx];
                            float activation = (float(chakraIdx) == float(u_activeChakra)) ? u_chakraActivation : 0.3;
                            col += chakraCol * density * activation * 0.5;
                        }
                        
                        // Agent thought form glow
                        for (int j = 0; j < 12; j++) {
                            if (j >= u_agentCount) break;
                            vec3 agentPos = u_agentPositions[j];
                            float intensity = u_agentThoughtIntensity[j];
                            if (intensity > 0.01) {
                                float thoughtDist = sdThoughtForm(p, agentPos, intensity, time);
                                if (thoughtDist < 0.4) {
                                    col += vec3(1.0, 0.84, 0.0) * exp(-thoughtDist * 8.0) * intensity * 0.3;
                                }
                            }
                        }
                        
                        // Akashic glow
                        float akashicDist = sdAkashic(p * 0.3, u_akashicTime);
                        if (akashicDist < 0.3) {
                            col += vec3(0.5, 0.2, 0.8) * exp(-akashicDist * 10.0) * 0.2;
                        }
                        
                        t += d;
                        if (t > 20.0 || d < 0.001) break;
                        steps++;
                    }
                    
                    return col;
                }
                
                void main() {
                    vec3 color = v_color;
                    float alpha = v_alpha;
                    float type = v_type;
                    float life = v_life;
                    
                    // Particle glow with audio reactivity
                    if (type == 0.0 || type == 2.0) {
                        float dist = length(gl_PointCoord - 0.5);
                        alpha *= smoothstep(0.5, 0.0, dist);
                        color += vec3(1.0) * (1.0 - dist) * 0.5 * life;
                        // Audio-reactive pulse
                        color += vec3(u_audioBass, u_audioMid, u_audioTreble) * 0.3;
                    }
                    // Merkaba edges
                    else if (type == 1.0) {
                        float dist = length(gl_PointCoord - 0.5);
                        alpha *= smoothstep(0.5, 0.0, dist * 2.0);
                        // Pulsing edges on bass
                        alpha *= 1.0 + u_audioBass * 0.5;
                    }
                    // Ripples
                    else if (type == 3.0) {
                        float ringDist = abs(length(v_uv - 0.5) - 0.5);
                        alpha *= smoothstep(0.02, 0.0, ringDist);
                        alpha *= 1.0 + u_audioBass * 0.5;
                    }
                    // Post-process fullscreen
                    else if (type == 4.0) {
                        // Read from resonance canvas texture
                        vec3 baseColor = texture(u_resonanceTexture, v_uv).rgb;
                        
                        // ===== RAY MARCHED 3D CONSCIOUSNESS LAYER =====
                        // Camera setup
                        vec3 ro = vec3(0.0, 0.5, 3.0);
                        vec3 lookAt = vec3(0.0, 0.0, 0.0);
                        vec3 forward = normalize(lookAt - ro);
                        vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
                        vec3 up = cross(right, forward);
                        
                        // UV to ray direction
                        float aspect = u_resolution.x / u_resolution.y;
                        vec2 fov = vec2(1.0, 1.0 / aspect);
                        vec3 rd = normalize(forward + right * (v_uv.x - 0.5) * fov.x + up * (v_uv.y - 0.5) * fov.y);
                        
                        // Rotate camera slowly
                        float camRot = u_time * 0.05;
                        float c = cos(camRot), s = sin(camRot);
                        rd.xz = vec2(c * rd.x - s * rd.z, s * rd.x + c * rd.z);
                        ro.xz = vec2(c * ro.x - s * ro.z, s * ro.x + c * ro.z);
                        
                        // Ray march
                        vec3 consciousnessColor = rayMarch(ro, rd, u_time);
                        
                        // Blend with base color
                        baseColor += consciousnessColor * (0.3 + u_consciousnessLevel * 0.7);
                        
                        // Holographic scanlines
                        float scanline = sin(v_uv.y * u_resolution.y * 0.5 + u_time * 10.0) * 0.02;
                        baseColor += scanline;
                        
                        // Vignette
                        float vignette = 1.0 - length(v_uv - 0.5) * 0.8;
                        baseColor *= vignette;
                        
                        // Golden spiral overlay
                        float spiral = goldenSpiral(v_uv, u_time);
                        baseColor += vec3(1.0, 0.84, 0.0) * spiral * 0.1;
                        
                        // Volumetric light scattering (god rays from center)
                        float volLight = volumetricLight(v_uv, u_lightPos, 0.3, u_time);
                        baseColor += vec3(1.0, 0.84, 0.0) * volLight * (1.0 + u_audioVolume);
                        
                        // Chromatic aberration on high resonance
                        if (u_resonanceLevel > 90.0) {
                            baseColor = chromaticAberration(v_uv, u_resonanceLevel * 0.1);
                        }
                        
                        // Audio-reactive chromatic aberration
                        baseColor = chromaticAberration(v_uv, u_audioBass * 0.02);
                        
                        // Glitch effect
                        if (u_resonanceLevel >= 100.0) {
                            float glitch = step(0.98, fract(u_time * 20.0));
                            baseColor = mix(baseColor, baseColor.rgb * vec3(1.5, 0.5, 1.5), glitch);
                        }
                        
                        // Audio-reactive glitch
                        float audioGlitch = step(0.95, u_audioBass);
                        baseColor = mix(baseColor, baseColor.rgb * vec3(1.3, 0.7, 1.3), audioGlitch);
                        
                        // Holographic noise overlay
                        float holo = holoNoise(v_uv + u_time * 0.1) * 0.05;
                        baseColor += vec3(holo);
                        
                        // HDR tone mapping
                        color = baseColor / (baseColor + vec3(1.0));
                        color = pow(color, vec3(1.0 / 2.2)); // Gamma correction
                        
                        fragColor = vec4(color, 1.0);
                        return;
                    }
                    
                    // Add holographic shimmer
                    float holo = holoNoise(v_uv + u_time * 0.1) * 0.1 * life;
                    color += vec3(holo);
                    
                    // Life-based fade
                    alpha *= life;
                    
                    // HDR tone mapping
                    color = color / (color + vec3(1.0));
                    color = pow(color, vec3(1.0 / 2.2)); // Gamma correction
                    
                    fragColor = vec4(color, alpha);
                }
            `;
            
            // ===== SHADER 2: COMPUTE-LIKE PARTICLE UPDATE (Transform Feedback) =====
            const particleUpdateVS = `#version 300 es
                precision highp float;
                
                in vec2 a_position;
                in vec3 a_instancePos;
                in float a_instanceScale;
                in vec3 a_instanceColor;
                in float a_instanceRotation;
                in float a_instancePhase;
                in float a_instanceType;
                in float a_instanceLife;
                in vec3 a_instanceVelocity;
                
                out vec3 tf_instancePos;
                out float tf_instanceScale;
                out vec3 tf_instanceColor;
                out float tf_instanceRotation;
                out float tf_instancePhase;
                out float tf_instanceType;
                out float tf_instanceLife;
                out vec3 tf_instanceVelocity;
                
                uniform float u_time;
                uniform float u_deltaTime;
                uniform float u_audioBass;
                uniform float u_audioMid;
                uniform float u_audioTreble;
                uniform vec2 u_resolution;
                uniform vec3 u_activeColor;
                uniform float u_resonanceLevel;
                uniform float u_loveLevel;
                
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                }
                
                vec3 hash33(vec3 p) {
                    return fract(sin(vec3(
                        dot(p, vec3(127.1, 311.7, 74.7)),
                        dot(p, vec3(269.5, 183.3, 246.1)),
                        dot(p, vec3(113.7, 271.9, 124.6))
                    )) * 43758.5453);
                }
                
                void main() {
                    vec3 pos = a_instancePos;
                    float life = a_instanceLife;
                    vec3 vel = a_instanceVelocity;
                    float phase = a_instancePhase;
                    float type = a_instanceType;
                    
                    if (type == 0.0) {
                        // GPU Particle Physics
                        // Spiral gravity toward center
                        vec2 toCenter = -pos.xy;
                        float dist = length(toCenter);
                        vec2 gravity = normalize(toCenter) * (0.5 / (dist * dist + 0.1));
                        
                        // Audio forces
                        vec2 audioForce = vec2(
                            (hash(vec2(pos.x, u_time)) - 0.5) * u_audioBass,
                            (hash(vec2(pos.y, u_time)) - 0.5) * u_audioBass
                        );
                        
                        // Turbulence
                        vec2 turb = vec2(
                            (hash(vec2(pos.x * 2.0, u_time)) - 0.5),
                            (hash(vec2(pos.y * 2.0, u_time)) - 0.5)
                        ) * 0.1;
                        
                        // Love field attraction
                        float loveForce = u_loveLevel * 0.01;
                        vel.xy += (gravity + audioForce + turb) * u_deltaTime * 60.0;
                        vel.xy *= 0.98; // Drag
                        pos.xy += vel.xy * u_deltaTime * 60.0;
                        
                        // Life decay
                        life -= u_deltaTime * (0.3 + phase * 0.5);
                        
                        // Respawn
                        if (life <= 0.0) {
                            life = 1.0;
                            float newAngle = hash(vec2(pos.x, u_time)) * 6.28318;
                            float newR = 0.8 + hash(vec2(pos.y, u_time)) * 0.4;
                            pos = vec3(cos(newAngle) * newR, sin(newAngle) * newR, (hash(vec2(pos.x + pos.y, u_time)) - 0.5) * 2.0);
                            vel = vec3(
                                (hash33(vec3(pos, u_time)).x - 0.5) * 0.1,
                                (hash33(vec3(pos, u_time)).y - 0.5) * 0.1,
                                0.0
                            );
                        }
                        
                        // Color evolves with life and audio
                        vec3 targetColor = mix(a_instanceColor, u_activeColor, 0.5 + u_audioBass * 0.5);
                    }
                    
                    tf_instancePos = pos;
                    tf_instanceScale = a_instanceScale;
                    tf_instanceColor = a_instanceColor;
                    tf_instanceRotation = a_instanceRotation;
                    tf_instancePhase = phase;
                    tf_instanceType = type;
                    tf_instanceLife = life;
                    tf_instanceVelocity = vel;
                    
                    // Dummy output for rasterization (we only use transform feedback)
                    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
                    gl_PointSize = 1.0;
                }
            `;
            
            const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
            const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
            
            if (!vertexShader || !fragmentShader) return;
            
            webglProgram = gl.createProgram();
            gl.attachShader(webglProgram, vertexShader);
            gl.attachShader(webglProgram, fragmentShader);
            
            // Transform feedback varyings
            const tfVaryings = [
                'tf_instancePos',
                'tf_instanceScale', 
                'tf_instanceColor',
                'tf_instanceRotation',
                'tf_instancePhase',
                'tf_instanceType',
                'tf_instanceLife',
                'tf_instanceVelocity'
            ];
            gl.transformFeedbackVaryings(webglProgram, tfVaryings, gl.SEPARATE_ATTRIBS);
            
            gl.linkProgram(webglProgram);
            
            if (!gl.getProgramParameter(webglProgram, gl.LINK_STATUS)) {
                console.error('WebGL Program link error:', gl.getProgramInfoLog(webglProgram));
                return;
            }
            
            // Get attribute/uniform locations
            webglProgram.a_position = gl.getAttribLocation(webglProgram, 'a_position');
            webglProgram.a_instancePos = gl.getAttribLocation(webglProgram, 'a_instancePos');
            webglProgram.a_instanceScale = gl.getAttribLocation(webglProgram, 'a_instanceScale');
            webglProgram.a_instanceColor = gl.getAttribLocation(webglProgram, 'a_instanceColor');
            webglProgram.a_instanceRotation = gl.getAttribLocation(webglProgram, 'a_instanceRotation');
            webglProgram.a_instancePhase = gl.getAttribLocation(webglProgram, 'a_instancePhase');
            webglProgram.a_instanceType = gl.getAttribLocation(webglProgram, 'a_instanceType');
            webglProgram.a_instanceLife = gl.getAttribLocation(webglProgram, 'a_instanceLife');
            webglProgram.a_instanceVelocity = gl.getAttribLocation(webglProgram, 'a_instanceVelocity');
            
            webglProgram.u_projection = gl.getUniformLocation(webglProgram, 'u_projection');
            webglProgram.u_time = gl.getUniformLocation(webglProgram, 'u_time');
            webglProgram.u_deltaTime = gl.getUniformLocation(webglProgram, 'u_deltaTime');
            webglProgram.u_resonanceLevel = gl.getUniformLocation(webglProgram, 'u_resonanceLevel');
            webglProgram.u_resolution = gl.getUniformLocation(webglProgram, 'u_resolution');
            webglProgram.u_activeColor = gl.getUniformLocation(webglProgram, 'u_activeColor');
            webglProgram.u_collectiveHarmony = gl.getUniformLocation(webglProgram, 'u_collectiveHarmony');
            webglProgram.u_loveLevel = gl.getUniformLocation(webglProgram, 'u_loveLevel');
            webglProgram.u_universalActive = gl.getUniformLocation(webglProgram, 'u_universalActive');
            webglProgram.u_audioBass = gl.getUniformLocation(webglProgram, 'u_audioBass');
            webglProgram.u_audioMid = gl.getUniformLocation(webglProgram, 'u_audioMid');
            webglProgram.u_audioTreble = gl.getUniformLocation(webglProgram, 'u_audioTreble');
            webglProgram.u_audioVolume = gl.getUniformLocation(webglProgram, 'u_audioVolume');
            webglProgram.u_lightPos = gl.getUniformLocation(webglProgram, 'u_lightPos');
            webglProgram.u_resonanceTexture = gl.getUniformLocation(webglProgram, 'u_resonanceTexture');
            // Consciousness Network uniforms
            webglProgram.u_consciousnessLevel = gl.getUniformLocation(webglProgram, 'u_consciousnessLevel');
            webglProgram.u_activeChakra = gl.getUniformLocation(webglProgram, 'u_activeChakra');
            webglProgram.u_chakraActivation = gl.getUniformLocation(webglProgram, 'u_chakraActivation');
            webglProgram.u_akashicTime = gl.getUniformLocation(webglProgram, 'u_akashicTime');
            webglProgram.u_agentPositions = gl.getUniformLocation(webglProgram, 'u_agentPositions');
            webglProgram.u_agentThoughtIntensity = gl.getUniformLocation(webglProgram, 'u_agentThoughtIntensity');
            webglProgram.u_agentCount = gl.getUniformLocation(webglProgram, 'u_agentCount');
            
            // Create transform feedback program for particle physics
            const tfVertexShader = createShader(gl.VERTEX_SHADER, particleUpdateVS);
            if (tfVertexShader) {
                webglProgram.tfProgram = gl.createProgram();
                gl.attachShader(webglProgram.tfProgram, tfVertexShader);
                gl.transformFeedbackVaryings(webglProgram.tfProgram, tfVaryings, gl.SEPARATE_ATTRIBS);
                gl.linkProgram(webglProgram.tfProgram);
                
                if (!gl.getProgramParameter(webglProgram.tfProgram, gl.LINK_STATUS)) {
                    console.error('TF Program link error:', gl.getProgramInfoLog(webglProgram.tfProgram));
                    webglProgram.tfProgram = null;
                } else {
                    webglProgram.tf_a_position = gl.getAttribLocation(webglProgram.tfProgram, 'a_position');
                    webglProgram.tf_a_instancePos = gl.getAttribLocation(webglProgram.tfProgram, 'a_instancePos');
                    webglProgram.tf_a_instanceScale = gl.getAttribLocation(webglProgram.tfProgram, 'a_instanceScale');
                    webglProgram.tf_a_instanceColor = gl.getAttribLocation(webglProgram.tfProgram, 'a_instanceColor');
                    webglProgram.tf_a_instanceRotation = gl.getAttribLocation(webglProgram.tfProgram, 'a_instanceRotation');
                    webglProgram.tf_a_instancePhase = gl.getAttribLocation(webglProgram.tfProgram, 'a_instancePhase');
                    webglProgram.tf_a_instanceType = gl.getAttribLocation(webglProgram.tfProgram, 'a_instanceType');
                    webglProgram.tf_a_instanceLife = gl.getAttribLocation(webglProgram.tfProgram, 'a_instanceLife');
                    webglProgram.tf_a_instanceVelocity = gl.getAttribLocation(webglProgram.tfProgram, 'a_instanceVelocity');
                    
                    webglProgram.tf_u_time = gl.getUniformLocation(webglProgram.tfProgram, 'u_time');
                    webglProgram.tf_u_deltaTime = gl.getUniformLocation(webglProgram.tfProgram, 'u_deltaTime');
                    webglProgram.tf_u_audioBass = gl.getUniformLocation(webglProgram.tfProgram, 'u_audioBass');
                    webglProgram.tf_u_audioMid = gl.getUniformLocation(webglProgram.tfProgram, 'u_audioMid');
                    webglProgram.tf_u_audioTreble = gl.getUniformLocation(webglProgram.tfProgram, 'u_audioTreble');
                    webglProgram.tf_u_resolution = gl.getUniformLocation(webglProgram.tfProgram, 'u_resolution');
                    webglProgram.tf_u_activeColor = gl.getUniformLocation(webglProgram.tfProgram, 'u_activeColor');
                    webglProgram.tf_u_resonanceLevel = gl.getUniformLocation(webglProgram.tfProgram, 'u_resonanceLevel');
                    webglProgram.tf_u_loveLevel = gl.getUniformLocation(webglProgram.tfProgram, 'u_loveLevel');
                }
            }
        }
        
        function createShader(type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
        
        function createGeometry() {
            // Fullscreen quad for post-processing
            const quadVertices = new Float32Array([
                -1, -1,  0,0,0, 1,1,1, 0,0,0, 4,
                 1, -1,  0,0,0, 1,1,1, 0,0,0, 4,
                -1,  1,  0,0,0, 1,1,1, 0,0,0, 4,
                 1,  1,  0,0,0, 1,1,1, 0,0,0, 4
            ]);
            
            // Particle instances
            const particleCount = 500;
            const merkabaCount = 16; // 8 vertices * 2 tetrahedrons
            const torusCount = 512; // 16 tubes * 32 segments
            const rippleCount = 20;
            const totalInstances = particleCount + merkabaCount + torusCount + rippleCount + 4; // +4 for quad
            
            const instanceData = new Float32Array(totalInstances * 13); // 13 attrs per instance (added life, velocity)
            
            let offset = 0;
            
            // Particle instances (type 0)
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2 * 8;
                const radius = 0.5 + Math.random() * 0.5;
                const z = (Math.random() - 0.5) * 2;
                const phase = Math.random();
                const scale = 0.5 + Math.random() * 1.0;
                const hue = Math.random();
                const life = Math.random();
                const velocity = [
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    0
                ];
                
                const color = hslToRgb(hue, 1.0, 0.6);
                
                instanceData[offset++] = 0; // position x (dummy)
                instanceData[offset++] = 0; // position y (dummy)
                instanceData[offset++] = Math.cos(angle) * radius; // instancePos x
                instanceData[offset++] = Math.sin(angle) * radius; // instancePos y
                instanceData[offset++] = z; // instancePos z
                instanceData[offset++] = scale; // instanceScale
                instanceData[offset++] = color[0]; // color r
                instanceData[offset++] = color[1]; // color g
                instanceData[offset++] = color[2]; // color b
                instanceData[offset++] = 0; // rotation
                instanceData[offset++] = phase; // phase
                instanceData[offset++] = 0; // type
                instanceData[offset++] = life; // life
                instanceData[offset++] = velocity[0]; // velocity x
                instanceData[offset++] = velocity[1]; // velocity y
                instanceData[offset++] = velocity[2]; // velocity z
            }
            
            // Merkaba instances (type 1)
            const merkabaVertices = [
                // Upward tetrahedron
                [1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1], // base
                [0, 0, 1.5] // apex
            ];
            for (let t = 0; t < 2; t++) {
                const dir = t === 0 ? 1 : -1;
                const verts = t === 0 ? merkabaVertices : merkabaVertices.map(v => [v[0], v[1], -v[2]]);
                verts.forEach(v => {
                    instanceData[offset++] = 0;
                    instanceData[offset++] = 0;
                    instanceData[offset++] = v[0] * dir;
                    instanceData[offset++] = v[1] * dir;
                    instanceData[offset++] = v[2] * dir;
                    instanceData[offset++] = 1.0;
                    instanceData[offset++] = t === 0 ? 1.0 : 0.0;
                    instanceData[offset++] = t === 0 ? 0.0 : 1.0;
                    instanceData[offset++] = t === 0 ? 0.0 : 0.5;
                    instanceData[offset++] = 0;
                    instanceData[offset++] = t * Math.PI;
                    instanceData[offset++] = 1;
                    instanceData[offset++] = 1.0; // life
                    instanceData[offset++] = 0; // velocity x
                    instanceData[offset++] = 0; // velocity y
                    instanceData[offset++] = 0; // velocity z
                });
            }
            
            // Torus instances (type 2)
            for (let tube = 0; tube < 16; tube++) {
                for (let seg = 0; seg < 32; seg++) {
                    instanceData[offset++] = 0;
                    instanceData[offset++] = 0;
                    instanceData[offset++] = tube / 16.0;
                    instanceData[offset++] = seg / 32.0;
                    instanceData[offset++] = 0;
                    instanceData[offset++] = 1.0;
                    instanceData[offset++] = 1.0;
                    instanceData[offset++] = 0.84;
                    instanceData[offset++] = 0.0;
                    instanceData[offset++] = 0;
                    instanceData[offset++] = (tube / 16.0) * Math.PI * 2;
                    instanceData[offset++] = 2;
                    instanceData[offset++] = 1.0; // life
                    instanceData[offset++] = 0; // velocity x
                    instanceData[offset++] = 0; // velocity y
                    instanceData[offset++] = 0; // velocity z
                }
            }
            
            // Ripple instances (type 3)
            for (let i = 0; i < rippleCount; i++) {
                instanceData[offset++] = 0;
                instanceData[offset++] = 0;
                instanceData[offset++] = 0;
                instanceData[offset++] = 0;
                instanceData[offset++] = 0;
                instanceData[offset++] = 1.0;
                instanceData[offset++] = 1.0;
                instanceData[offset++] = 1.0;
                instanceData[offset++] = 1.0;
                instanceData[offset++] = 0;
                instanceData[offset++] = i / rippleCount;
                instanceData[offset++] = 3;
                instanceData[offset++] = 1.0; // life
                instanceData[offset++] = 0; // velocity x
                instanceData[offset++] = 0; // velocity y
                instanceData[offset++] = 0; // velocity z
            }
            
            // Create buffers
            const quadBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
            
            const instanceBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, instanceData, gl.DYNAMIC_DRAW);
            
            // Transform feedback buffers for GPU particle physics
            let tfBuffers = null;
            let tfFeedback = null;
            
            if (gl.getExtension('EXT_transform_feedback2') || gl.getExtension('WEBGL_transform_feedback2')) {
                // Create transform feedback buffers
                const posBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, totalInstances * 3 * 4, gl.DYNAMIC_COPY); // vec3
                
                const scaleBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, scaleBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, totalInstances * 1 * 4, gl.DYNAMIC_COPY); // float
                
                const colorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, totalInstances * 3 * 4, gl.DYNAMIC_COPY); // vec3
                
                const rotationBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, rotationBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, totalInstances * 1 * 4, gl.DYNAMIC_COPY); // float
                
                const phaseBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, phaseBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, totalInstances * 1 * 4, gl.DYNAMIC_COPY); // float
                
                const typeBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, typeBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, totalInstances * 1 * 4, gl.DYNAMIC_COPY); // float
                
                const lifeBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, totalInstances * 1 * 4, gl.DYNAMIC_COPY); // float
                
                const velocityBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, totalInstances * 3 * 4, gl.DYNAMIC_COPY); // vec3
                
                // Create transform feedback object
                tfFeedback = gl.createTransformFeedback();
                
                tfBuffers = {
                    pos: posBuffer,
                    scale: scaleBuffer,
                    color: colorBuffer,
                    rotation: rotationBuffer,
                    phase: phaseBuffer,
                    type: typeBuffer,
                    life: lifeBuffer,
                    velocity: velocityBuffer,
                    instances: instanceBuffer // Will be swapped
                };
            }
            
            webglBuffers = {
                quad: quadBuffer,
                instances: instanceBuffer,
                instanceCount: totalInstances,
                particleCount,
                merkabaCount,
                torusCount,
                rippleCount,
                tfBuffers,
                tfFeedback
            };
        }
        
        function hslToRgb(h, s, l) {
            const a = s * Math.min(l, 1 - l);
            const f = (n, k = (n + h * 12) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return [f(0), f(8), f(4)];
        }
        
        function hexToRgbVec3(hex) {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return [r, g, b];
        }
        
        function drawWebGL() {
            if (!gl || !webglProgram || !webglBuffers) return;
            
            const now = Date.now();
            const time = (now - webglStartTime) / 1000;
            const deltaTime = (now - (window.lastWebGLTime || now)) / 1000;
            window.lastWebGLTime = now;
            const activeColor = hexToRgbVec3(activeFreqColor);
            
            // Get audio data for reactive visuals
            let audioBass = 0, audioMid = 0, audioTreble = 0, audioVolume = 0;
            if (analyser && audioDataArray) {
                analyser.getByteFrequencyData(audioDataArray);
                const bufferLength = audioDataArray.length;
                const bassEnd = Math.floor(bufferLength * 0.1);
                const midEnd = Math.floor(bufferLength * 0.4);
                
                for (let i = 0; i < bassEnd; i++) audioBass += audioDataArray[i];
                for (let i = bassEnd; i < midEnd; i++) audioMid += audioDataArray[i];
                for (let i = midEnd; i < bufferLength; i++) audioTreble += audioDataArray[i];
                
                audioBass = (audioBass / bassEnd) / 255;
                audioMid = (audioMid / (midEnd - bassEnd)) / 255;
                audioTreble = (audioTreble / (bufferLength - midEnd)) / 255;
                audioVolume = (audioBass + audioMid + audioTreble) / 3;
            }
            
            gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            // ===== TRANSFORM FEEDBACK PASS: Update particle physics on GPU =====
            if (webglProgram.tfProgram && webglBuffers.tfBuffers) {
                gl.useProgram(webglProgram.tfProgram);
                
                gl.uniform1f(webglProgram.tf_u_time, time);
                gl.uniform1f(webglProgram.tf_u_deltaTime, deltaTime);
                gl.uniform1f(webglProgram.tf_u_audioBass, audioBass);
                gl.uniform1f(webglProgram.tf_u_audioMid, audioMid);
                gl.uniform1f(webglProgram.tf_u_audioTreble, audioTreble);
                gl.uniform2f(webglProgram.tf_u_resolution, webglCanvas.width, webglCanvas.height);
                gl.uniform3fv(webglProgram.tf_u_activeColor, activeColor);
                gl.uniform1f(webglProgram.tf_u_resonanceLevel, state.loveResonanceLevel);
                gl.uniform1f(webglProgram.tf_u_loveLevel, state.loveResonanceLevel);
                
                // Bind source buffers
                gl.bindBuffer(gl.ARRAY_BUFFER, webglBuffers.instances);
                const stride = 13 * 4;
                
                gl.enableVertexAttribArray(webglProgram.tf_a_position);
                gl.vertexAttribPointer(webglProgram.tf_a_position, 2, gl.FLOAT, false, stride, 0);
                gl.enableVertexAttribArray(webglProgram.tf_a_instancePos);
                gl.vertexAttribPointer(webglProgram.tf_a_instancePos, 3, gl.FLOAT, false, stride, 2 * 4);
                gl.enableVertexAttribArray(webglProgram.tf_a_instanceScale);
                gl.vertexAttribPointer(webglProgram.tf_a_instanceScale, 1, gl.FLOAT, false, stride, 5 * 4);
                gl.enableVertexAttribArray(webglProgram.tf_a_instanceColor);
                gl.vertexAttribPointer(webglProgram.tf_a_instanceColor, 3, gl.FLOAT, false, stride, 6 * 4);
                gl.enableVertexAttribArray(webglProgram.tf_a_instanceRotation);
                gl.vertexAttribPointer(webglProgram.tf_a_instanceRotation, 1, gl.FLOAT, false, stride, 9 * 4);
                gl.enableVertexAttribArray(webglProgram.tf_a_instancePhase);
                gl.vertexAttribPointer(webglProgram.tf_a_instancePhase, 1, gl.FLOAT, false, stride, 10 * 4);
                gl.enableVertexAttribArray(webglProgram.tf_a_instanceType);
                gl.vertexAttribPointer(webglProgram.tf_a_instanceType, 1, gl.FLOAT, false, stride, 11 * 4);
                gl.enableVertexAttribArray(webglProgram.tf_a_instanceLife);
                gl.vertexAttribPointer(webglProgram.tf_a_instanceLife, 1, gl.FLOAT, false, stride, 12 * 4);
                gl.enableVertexAttribArray(webglProgram.tf_a_instanceVelocity);
                gl.vertexAttribPointer(webglProgram.tf_a_instanceVelocity, 3, gl.FLOAT, false, stride, 13 * 4 - 12); // Last 3 floats
                
                // Bind transform feedback buffers
                gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, webglBuffers.tfFeedback);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, webglBuffers.tfBuffers.pos);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, webglBuffers.tfBuffers.scale);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, webglBuffers.tfBuffers.color);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 3, webglBuffers.tfBuffers.rotation);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 4, webglBuffers.tfBuffers.phase);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 5, webglBuffers.tfBuffers.type);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 6, webglBuffers.tfBuffers.life);
                gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 7, webglBuffers.tfBuffers.velocity);
                
                gl.beginTransformFeedback(gl.POINTS);
                gl.drawArrays(gl.POINTS, 0, webglBuffers.instanceCount);
                gl.endTransformFeedback();
                
                // Swap buffers for next frame
                const temp = webglBuffers.instances;
                webglBuffers.instances = webglBuffers.tfBuffers.instances;
                webglBuffers.tfBuffers.instances = temp;
            }
            
            // ===== RENDER PASS =====
            gl.useProgram(webglProgram);
            
            // Projection matrix
            const projection = new Float32Array([
                2 / webglCanvas.width, 0, 0,
                0, -2 / webglCanvas.height, 0,
                -1, 1, 1
            ]);
            gl.uniformMatrix3fv(webglProgram.u_projection, false, projection);
            
            gl.uniform1f(webglProgram.u_time, time);
            gl.uniform1f(webglProgram.u_deltaTime, deltaTime);
            gl.uniform1f(webglProgram.u_resonanceLevel, state.loveResonanceLevel);
            gl.uniform2f(webglProgram.u_resolution, webglCanvas.width, webglCanvas.height);
            gl.uniform3fv(webglProgram.u_activeColor, activeColor);
            gl.uniform1f(webglProgram.u_collectiveHarmony, state.collectiveHarmony || 0);
            gl.uniform1f(webglProgram.u_loveLevel, state.loveResonanceLevel);
            gl.uniform1i(webglProgram.u_universalActive, state.universalResonanceActive ? 1 : 0);
            gl.uniform1f(webglProgram.u_audioBass, audioBass);
            gl.uniform1f(webglProgram.u_audioMid, audioMid);
            gl.uniform1f(webglProgram.u_audioTreble, audioTreble);
            gl.uniform1f(webglProgram.u_audioVolume, audioVolume);
            gl.uniform2f(webglProgram.u_lightPos, 0.5, 0.5); // Center light
            // Consciousness Network uniforms
            gl.uniform1f(webglProgram.u_consciousnessLevel, state.consciousnessLevel || 0);
            gl.uniform1i(webglProgram.u_activeChakra, state.activeChakra || 3); // Heart chakra default
            gl.uniform1f(webglProgram.u_chakraActivation, state.chakraActivation || 0);
            gl.uniform1f(webglProgram.u_akashicTime, Date.now() / 1000);
            
            // Agent positions and thought intensities from collective state
            const agentPositions = [];
            const agentThoughtIntensity = [];
            let agentCount = 0;
            if (state.collectiveField && state.collectiveField.participants) {
                const participants = Object.values(state.collectiveField.participants);
                for (let i = 0; i < Math.min(participants.length, 12); i++) {
                    const p = participants[i];
                    const angle = (i / Math.max(participants.length, 1)) * Math.PI * 2;
                    const radius = 1.5 + Math.sin(time + i) * 0.5;
                    agentPositions.push(radius * Math.cos(angle), p.resonance || 0.5, radius * Math.sin(angle));
                    agentThoughtIntensity.push(p.resonance || 0.5);
                    agentCount++;
                }
            }
            
            // Pad to 12 agents
            while (agentPositions.length < 36) agentPositions.push(0);
            while (agentThoughtIntensity.length < 12) agentThoughtIntensity.push(0);
            
            gl.uniform3fv(webglProgram.u_agentPositions, agentPositions);
            gl.uniform1fv(webglProgram.u_agentThoughtIntensity, agentThoughtIntensity);
            gl.uniform1i(webglProgram.u_agentCount, agentCount);
            
            // Bind resonance canvas as texture for post-processing
            const resonanceTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, resonanceTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.uniform1i(webglProgram.u_resonanceTexture, 0);
            
            // Enable attributes
            const stride = 13 * 4; // 13 floats * 4 bytes
            
            // Draw post-process quad first (type 4)
            gl.bindBuffer(gl.ARRAY_BUFFER, webglBuffers.quad);
            gl.enableVertexAttribArray(webglProgram.a_position);
            gl.vertexAttribPointer(webglProgram.a_position, 2, gl.FLOAT, false, stride, 0);
            gl.enableVertexAttribArray(webglProgram.a_instancePos);
            gl.vertexAttribPointer(webglProgram.a_instancePos, 3, gl.FLOAT, false, stride, 2 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceScale);
            gl.vertexAttribPointer(webglProgram.a_instanceScale, 1, gl.FLOAT, false, stride, 5 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceColor);
            gl.vertexAttribPointer(webglProgram.a_instanceColor, 3, gl.FLOAT, false, stride, 6 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceRotation);
            gl.vertexAttribPointer(webglProgram.a_instanceRotation, 1, gl.FLOAT, false, stride, 9 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instancePhase);
            gl.vertexAttribPointer(webglProgram.a_instancePhase, 1, gl.FLOAT, false, stride, 10 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceType);
            gl.vertexAttribPointer(webglProgram.a_instanceType, 1, gl.FLOAT, false, stride, 11 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceLife);
            gl.vertexAttribPointer(webglProgram.a_instanceLife, 1, gl.FLOAT, false, stride, 12 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceVelocity);
            gl.vertexAttribPointer(webglProgram.a_instanceVelocity, 3, gl.FLOAT, false, stride, 13 * 4 - 12);
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            // Now draw instanced geometry
            gl.bindBuffer(gl.ARRAY_BUFFER, webglBuffers.instances);
            gl.enableVertexAttribArray(webglProgram.a_position);
            gl.vertexAttribPointer(webglProgram.a_position, 2, gl.FLOAT, false, stride, 0);
            gl.enableVertexAttribArray(webglProgram.a_instancePos);
            gl.vertexAttribPointer(webglProgram.a_instancePos, 3, gl.FLOAT, false, stride, 2 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceScale);
            gl.vertexAttribPointer(webglProgram.a_instanceScale, 1, gl.FLOAT, false, stride, 5 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceColor);
            gl.vertexAttribPointer(webglProgram.a_instanceColor, 3, gl.FLOAT, false, stride, 6 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceRotation);
            gl.vertexAttribPointer(webglProgram.a_instanceRotation, 1, gl.FLOAT, false, stride, 9 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instancePhase);
            gl.vertexAttribPointer(webglProgram.a_instancePhase, 1, gl.FLOAT, false, stride, 10 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceType);
            gl.vertexAttribPointer(webglProgram.a_instanceType, 1, gl.FLOAT, false, stride, 11 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceLife);
            gl.vertexAttribPointer(webglProgram.a_instanceLife, 1, gl.FLOAT, false, stride, 12 * 4);
            gl.enableVertexAttribArray(webglProgram.a_instanceVelocity);
            gl.vertexAttribPointer(webglProgram.a_instanceVelocity, 3, gl.FLOAT, false, stride, 13 * 4 - 12);
            
            // Draw particles (type 0) - POINTS
            gl.drawArrays(gl.POINTS, 4, webglBuffers.particleCount);
            
            // Draw merkaba (type 1) - POINTS
            gl.drawArrays(gl.POINTS, 4 + webglBuffers.particleCount, webglBuffers.merkabaCount);
            
            // Draw torus (type 2) - POINTS
            gl.drawArrays(gl.POINTS, 4 + webglBuffers.particleCount + webglBuffers.merkabaCount, webglBuffers.torusCount);
            
            // Draw ripples (type 3) - POINTS (rendered as rings in shader)
            gl.drawArrays(gl.POINTS, 4 + webglBuffers.particleCount + webglBuffers.merkabaCount + webglBuffers.torusCount, webglBuffers.rippleCount);
            
                        // Cleanup
                        gl.deleteTexture(resonanceTexture);
                    }
        
                    

// Export
export { initEvolutionEngine, createRandomGenome, evaluateGenomeFitness, evolveGeneration, tournamentSelect, crossover, mutate, getBestGenome };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.initEvolutionEngine = initEvolutionEngine;
    window.createRandomGenome = createRandomGenome;
    window.evaluateGenomeFitness = evaluateGenomeFitness;
    window.evolveGeneration = evolveGeneration;
    window.tournamentSelect = tournamentSelect;
    window.crossover = crossover;
    window.mutate = mutate;
    window.getBestGenome = getBestGenome;
}
