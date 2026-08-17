// ===== WEBGPU MODULE =====
// WebGPU rendering and compute

async function initWebGPU(wrapper, size) {
            if (!navigator.gpu) {
                console.log('WebGPU not available, using WebGL2 fallback');
                webgpuSupported = false;
                return;
            }
            
            try {
                webgpuCanvas = document.getElementById('webgpuCanvas');
                if (!webgpuCanvas) return;
                
                webgpuCanvas.width = size * window.devicePixelRatio;
                webgpuCanvas.height = size * window.devicePixelRatio;
                webgpuCanvas.style.width = size + 'px';
                webgpuCanvas.style.height = size + 'px';
                
                const adapter = await navigator.gpu.requestAdapter({
                    powerPreference: 'high-performance',
                    forceFallbackAdapter: false
                });
                
                if (!adapter) {
                    console.log('No WebGPU adapter found');
                    webgpuSupported = false;
                    return;
                }
                
                webgpuDevice = await adapter.requestDevice({
                    requiredFeatures: ['shader-f16', 'depth-clip-control', 'texture-compression-bc'],
                    requiredLimits: {
                        maxTextureDimension2D: 8192,
                        maxBufferSize: 256 * 1024 * 1024,
                        maxStorageBufferBindingSize: 128 * 1024 * 1024
                    }
                });
                
                webgpuContext = webgpuCanvas.getContext('webgpu');
                const format = navigator.gpu.getPreferredCanvasFormat();
                
                webgpuContext.configure({
                    device: webgpuDevice,
                    format: format,
                    alphaMode: 'premultiplied',
                    viewFormats: [format]
                });
                
                // Compile WebGPU shaders
                await compileWebGPUShaders(format);
                createWebGPUBuffers();
                
                webgpuStartTime = Date.now();
                webgpuSupported = true;
                console.log('��� WebGPU initialized successfully!');
                
                // Initialize WebGPU Compute Shaders
                await initWebGPUCompute();
                
                // Initialize Akashic Records (IndexedDB)
                await initAkashicRecords();
                
                // Initialize Evolution Engine
                initEvolutionEngine();
                
            } catch (e) {
                console.warn('WebGPU init failed:', e);
                webgpuSupported = false;
            }
        }
        
        function compileWebGPUShaders(format) {
            // ===== WEBGPU FRACTAL INFINITE ZOOM SHADER =====
            const fractalWGSL = `
                struct Uniforms {
                    time: f32,
                    resolution: vec2<f32>,
                    zoom: f32,
                    center: vec2<f32>,
                    resonanceLevel: f32,
                    loveLevel: f32,
                    collectiveHarmony: f32,
                    audioBass: f32,
                    audioMid: f32,
                    audioTreble: f32,
                    audioVolume: f32,
                    activeColor: vec3<f32>,
                    consciousnessLevel: f32,
                    activeChakra: u32,
                    chakraActivation: f32,
                    akashicTime: f32,
                    agentCount: u32,
                    portalDepth: f32,
                    dnaActivity: f32,
                    coherenceStrength: f32,
                };
                
                @group(0) @binding(0) var<uniform> uniforms: Uniforms;
                @group(0) @binding(1) var<storage, read_write> agentPositions: array<vec3<f32>>;
                @group(0) @binding(2) var<storage, read_write> agentIntensities: array<f32>;
                
                @vertex
                fn vs_main(@builtin(vertex_index) idx: u32) -> @builtin(position) vec4<f32> {
                    // Fullscreen triangle strip
                    var pos = array<vec2<f32>, 4>(
                        vec2<f32>(-1.0, -1.0),
                        vec2<f32>(3.0, -1.0),
                        vec2<f32>(-1.0, 3.0),
                        vec2<f32>(3.0, 3.0)
                    );
                    return vec4<f32>(pos[idx], 0.0, 1.0);
                }
                
                @fragment
                fn fs_main(@builtin(position) fragCoord: vec2<f32>) -> @location(0) vec4<f32> {
                    let uv = (fragCoord - uniforms.resolution * 0.5) / min(uniforms.resolution.x, uniforms.resolution.y);
                    let time = uniforms.time;
                    let zoom = uniforms.zoom;
                    let center = uniforms.center;
                    
                    // ===== MULTI-DIMENSIONAL PORTALS =====
                    // Recursive portal layers with depth
                    var portalLayers = 0.0;
                    var portalUV = uv;
                    let portalDepth = uniforms.portalDepth;
                    for (var layer = 0u; layer < 5u; layer++) {
                        let layerScale = pow(1.618, f32(layer)) * portalDepth;
                        let layerTime = time * (1.0 + f32(layer) * 0.3);
                        let layerRot = layerTime * 0.5;
                        let rot = mat2x2<f32>(cos(layerRot), -sin(layerRot), sin(layerRot), cos(layerRot));
                        portalUV = rot * portalUV * layerScale;
                        
                        // Portal ring
                        let r = length(portalUV);
                        let ring = smoothstep(0.8 / layerScale, 0.78 / layerScale, r) * (1.0 - f32(layer) * 0.15);
                        portalLayers += ring * (0.5 + 0.5 * sin(layerTime * 2.0 + f32(layer) * 1.618));
                    }
                    
                    // ===== TEMPORAL ECHOES =====
                    // Multiple time offsets creating echo trails
                    var temporalEcho = 0.0;
                    for (var echo = 1u; echo <= 8u; echo++) {
                        let echoTime = time - f32(echo) * 0.15;
                        let echoUV = uv * (1.0 + f32(echo) * 0.05);
                        let echoZoom = zoom * (1.0 - f32(echo) * 0.03);
                        var zEcho = echoUV * echoZoom + center;
                        var cEcho = vec2<f32>(-0.7, 0.27015) + vec2<f32>(sin(echoTime * 0.1), cos(echoTime * 0.13)) * 0.1;
                        
                        var iterEcho = 0u;
                        for (var i = 0u; i < 64u; i++) {
                            let x2 = zEcho.x * zEcho.x - zEcho.y * zEcho.y;
                            let y2 = 2.0 * zEcho.x * zEcho.y;
                            zEcho = vec2<f32>(x2, y2) + cEcho;
                            if (dot(zEcho, zEcho) > 100.0) { iterEcho = i; break; }
                        }
                        let echoIntensity = exp(-f32(echo) * 0.4) * (1.0 - f32(iterEcho) / 64.0) * 0.1;
                        temporalEcho += echoIntensity;
                    }
                    temporalEcho *= uniforms.dnaActivity; // Reuse dnaActivity for temporal intensity
                    
                    // ===== PLANETARY GRID (Ley lines / Earth grid) =====
                    var planetaryGrid = 0.0;
                    let gridScale = 12.0;
                    // Icosahedral grid projection
                    for (var gx = -3; gx <= 3; gx++) {
                        for (var gy = -3; gy <= 3; gy++) {
                            let gridX = uv.x * gridScale - f32(gx);
                            let gridY = uv.y * gridScale - f32(gy);
                            let gridDist = length(vec2<f32>(gridX, gridY));
                            // Ley line intersections
                            planetaryGrid += smoothstep(0.05, 0.03, gridDist) * (0.5 + 0.5 * sin(time * 0.2 + f32(gx + gy) * 0.7));
                            // Sacred sites at intersections
                            if (abs(gridX) < 0.05 && abs(gridY) < 0.05) {
                                planetaryGrid += 0.3 * (0.5 + 0.5 * sin(time * 1.0 + f32(gx * 17 + gy * 23)));
                            }
                        }
                    }
                    planetaryGrid *= 0.1 * uniforms.dnaActivity;
                    
                    // ===== DNA GENETIC MEMORY HELIX =====
                    var dnaHelix = 0.0;
                    let helixTurns = 3.0;
                    for (var h = 0; h < 2; h++) {
                        for (var turn = 0u; turn < 20u; turn++) {
                            let t = f32(turn) / 20.0;
                            let y = -1.0 + t * 2.0;
                            let angle = t * helixTurns * 6.283 + time * 0.5 + f32(h) * 3.14159;
                            let hx = cos(angle) * 0.3;
                            let hy = sin(angle) * 0.3;
                            let d = length(uv - vec2<f32>(hx, hy));
                            // Genetic codons as pulsing nodes
                            let codon = smoothstep(0.04, 0.02, d) * (0.5 + 0.5 * sin(time * 3.0 + f32(turn) * 0.5 + f32(h) * 1.618));
                            dnaHelix += codon * (1.0 - t * 0.3);
                        }
                    }
                    dnaHelix *= 0.15 * uniforms.dnaActivity;
                    
                    // ===== 3D SACRED SOUND GEOMETRY (Cymatics in 3D) =====
                    // Spherical harmonics visualization
                    var soundGeometry3D = 0.0;
                    let sphericalUV = uv * 2.0;
                    let r3D = length(sphericalUV);
                    let theta = atan2(sphericalUV.y, sphericalUV.x);
                    let phi = acos(clamp(sphericalUV.y / max(r3D, 0.001), -1.0, 1.0));
                    
                    // Spherical harmonics Y_l^m
                    for (var l = 1u; l <= 4u; l++) {
                        for (var m = 0u; m <= l; m++) {
                            let harmonic = 0.0;
                            // Simplified spherical harmonic
                            let l_f = f32(l);
                            let m_f = f32(m);
                            harmonic = sin(l_f * phi + time * 0.5) * cos(m_f * theta + time * 0.3);
                            harmonic *= exp(-r3D * 1.5) * (1.0 / l_f);
                            soundGeometry3D += abs(harmonic) * (uniforms.audioBass * 0.5 + uniforms.audioMid * 0.3);
                        }
                    }
                    soundGeometry3D *= 0.2 * uniforms.dnaActivity;
                    
                    // ===== HOLOGRAPHIC CONSCIOUSNESS PROJECTION =====
                    // Interference pattern from multiple consciousness sources
                    var holoProjection = 0.0;
                    let coherence = uniforms.collectiveHarmony;
                    for (var src = 0u; src < min(uniforms.agentCount, 8u); src++) {
                        let pos = agentPositions[src].xy;
                        let intensity = agentIntensities[src];
                        if (intensity > 0.01) {
                            let d = length(uv - pos);
                            // Holographic interference
                            let phase = d * 50.0 + time * 10.0 + f32(src) * 7.0;
                            let interference = (1.0 + cos(phase)) * 0.5;
                            holoProjection += intensity * interference * exp(-d * 3.0) * coherence;
                        }
                    }
                    holoProjection *= 0.3 * uniforms.dnaActivity;
                    
                    // ===== COLLECTIVE COHERENCE FIELD =====
                    // Global field connecting all participants
                    var coherenceField = 0.0;
                    if (uniforms.agentCount > 1u) {
                        // Center of mass
                        var com = vec2<f32>(0.0);
                        var totalIntensity = 0.0;
                        for (var a = 0u; a < min(uniforms.agentCount, 12u); a++) {
                            let intensity = agentIntensities[a];
                            if (intensity > 0.01) {
                                com += agentPositions[a].xy * intensity;
                                totalIntensity += intensity;
                            }
                        }
                        if (totalIntensity > 0.0) {
                            com /= totalIntensity;
                            let dCom = length(uv - com);
                            coherenceField = exp(-dCom * 2.0) * coherence * (0.5 + 0.5 * sin(time * 0.7)) * uniforms.coherenceStrength;
                            
                            // Connections between agents
                            for (var i = 0u; i < min(uniforms.agentCount, 12u); i++) {
                                for (var j = i + 1u; j < min(uniforms.agentCount, 12u); j++) {
                                    let pi = agentPositions[i].xy;
                                    let pj = agentPositions[j].xy;
                                    let ii = agentIntensities[i];
                                    let ij = agentIntensities[j];
                                    if (ii > 0.01 && ij > 0.01) {
                                        // Line between agents
                                        let mid = (pi + pj) * 0.5;
                                        let dir = pj - pi;
                                        let len = length(dir);
                                        let perp = vec2<f32>(-dir.y, dir.x) / max(len, 0.001);
                                        let proj = dot(uv - mid, perp);
                                        let along = dot(uv - mid, dir) / max(len, 0.001);
                                        if (along >= 0.0 && along <= 1.0) {
                                            coherenceField += exp(-abs(proj) * 10.0) * ii * ij * 0.2 * uniforms.coherenceStrength;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    // ===== INFINITE FRACTAL ZOOM (Mandelbrot + Julia hybrid) =====
                    var z = uv * zoom + center;
                    var c = vec2<f32>(-0.7, 0.27015) + vec2<f32>(sin(time * 0.1), cos(time * 0.13)) * 0.1;
                    
                    // Audio-reactive Julia parameter
                    c += vec2<f32>(uniforms.audioBass * 0.3, uniforms.audioMid * 0.2);
                    
                    var iterations = 0u;
                    var maxIter = 256u;
                    var orbitTrap = 1000.0;
                    var finalZ = vec2<f32>(0.0);
                    
                    for (var i = 0u; i < maxIter; i++) {
                        let x2 = z.x * z.x - z.y * z.y;
                        let y2 = 2.0 * z.x * z.y;
                        z = vec2<f32>(x2, y2) + c;
                        
                        // Orbit trapping for coloring
                        let dist = length(z - vec2<f32>(sin(time * 0.5), cos(time * 0.7)));
                        orbitTrap = min(orbitTrap, dist);
                        
                        if (dot(z, z) > 100.0) {
                            iterations = i;
                            finalZ = z;
                            break;
                        }
                    }
                    
                    // Smooth coloring
                    let smoothIter = f32(iterations) + 1.0 - log2(log2(length(finalZ) + 1.0));
                    let normalizedIter = smoothIter / f32(maxIter);
                    
                    // ===== CYMATICS PATTERNS (Chladni figures) =====
                    var cymatics = 0.0;
                    let freq = 5.0 + uniforms.audioBass * 20.0 + uniforms.resonanceLevel * 0.1;
                    let cx = uv.x * freq;
                    let cy = uv.y * freq;
                    cymatics = abs(sin(cx * 3.14159) * sin(cy * 3.14159) + 
                                   sin(cx * 3.14159 * 1.618) * sin(cy * 3.14159 * 1.618) * 0.5);
                    
                    // Audio-reactive cymatics
                    cymatics *= 1.0 + uniforms.audioMid * 2.0;
                    
                    // ===== SACRED GEOMETRY OVERLAY =====
                    // Flower of Life
                    var fol = 0.0;
                    let folScale = 8.0 / zoom;
                    for (var i = -2; i <= 2; i++) {
                        for (var j = -2; j <= 2; j++) {
                            let dx = uv.x * folScale - f32(i) * 1.5;
                            let dy = uv.y * folScale - f32(j) * sqrt(3.0) * 1.5;
                            if (abs(i) % 2 == 1) { dy += sqrt(3.0) * 0.75; }
                            let d = length(vec2<f32>(dx, dy));
                            fol += smoothstep(0.5, 0.45, d) * 0.1;
                        }
                    }
                    
                    // ===== CHAKRA RESONANCE FIELD =====
                    let chakraPos = vec2<f32>(0.0, 0.0);
                    let chakraField = 0.0;
                    if (uniforms.consciousnessLevel > 0.1) {
                        for (var k = 0u; k < 7u; k++) {
                            let y = -1.0 + f32(k) * (2.0 / 7.0);
                            let chakraUV = uv - vec2<f32>(0.0, y);
                            let activation = select(0.3, uniforms.chakraActivation, k == uniforms.activeChakra);
                            chakraField += activation * exp(-length(chakraUV) * 10.0) * 
                                          (0.5 + 0.5 * sin(time * 2.0 + f32(k) * 0.9));
                        }
                    }
                    
                    // ===== AGENT THOUGHT FORMS =====
                    var agentField = 0.0;
                    for (var a = 0u; a < min(uniforms.agentCount, 12u); a++) {
                        let pos = agentPositions[a].xy;
                        let intensity = agentIntensities[a];
                        if (intensity > 0.01) {
                            let d = length(uv - pos);
                            agentField += intensity * exp(-d * 5.0) * (1.0 + sin(time * 3.0 + f32(a)) * 0.3);
                        }
                    }
                    
                    // ===== AKASHIC PILLARS =====
                    var akashicField = 0.0;
                    let pillarAngle = 2.0 * 3.14159 / 12.0;
                    for (var p = 0u; p < 12u; p++) {
                        let angle = f32(p) * pillarAngle + uniforms.akashicTime * 0.01;
                        let pillarPos = vec2<f32>(cos(angle), sin(angle)) * 1.2;
                        let d = length(uv - pillarPos);
                        akashicField += exp(-d * 8.0) * (0.3 + 0.7 * sin(uniforms.akashicTime * 0.1 + f32(p))) * 0.1;
                    }
                    
                    // ===== COLOR SYNTHESIS =====
                    // Fractal color
                    let fractalHue = normalizedIter * 0.6 + time * 0.05;
                    let fractalCol = vec3<f32>(
                        0.5 + 0.5 * sin(fractalHue * 6.283),
                        0.5 + 0.5 * sin(fractalHue * 6.283 + 2.094),
                        0.5 + 0.5 * sin(fractalHue * 6.283 + 4.188)
                    );
                    
                    // Cymatics color (golden)
                    let cymaticsCol = vec3<f32>(1.0, 0.84, 0.0) * cymatics;
                    
                    // Chakra colors
                    let chakraColors = array<vec3<f32>, 7>(
                        vec3<f32>(1.0, 0.0, 0.0),    // Root
                        vec3<f32>(1.0, 0.5, 0.0),    // Sacral
                        vec3<f32>(1.0, 1.0, 0.0),    // Solar
                        vec3<f32>(0.0, 1.0, 0.0),    // Heart
                        vec3<f32>(0.0, 0.5, 1.0),    // Throat
                        vec3<f32>(0.3, 0.0, 0.8),    // Third Eye
                        vec3<f32>(0.7, 0.0, 1.0)     // Crown
                    );
                    let activeChakraCol = chakraColors[min(uniforms.activeChakra, 6u)];
                    let chakraCol = activeChakraCol * chakraField;
                    
                    // Agent thought color (golden consciousness)
                    let agentCol = vec3<f32>(1.0, 0.9, 0.3) * agentField;
                    
                    // Akashic color (violet cosmic)
                    let akashicCol = vec3<f32>(0.5, 0.2, 0.8) * akashicField;
                    
                    // Active color from resonance
                    let resonanceCol = uniforms.activeColor * (uniforms.resonanceLevel / 100.0) * 0.5;
                    
                    // Love field
                    let loveCol = vec3<f32>(1.0, 0.0, 1.0) * (uniforms.loveLevel / 100.0) * 0.3;
                    
                    // Collective harmony
                    let harmonyCol = vec3<f32>(0.0, 1.0, 1.0) * uniforms.collectiveHarmony * 0.2;
                    
                    // NEW LAYERS
                    // Portal layers (iridescent)
                    let portalCol = vec3<f32>(0.5, 0.8, 1.0) * portalLayers;
                    
                    // Temporal echoes (ghostly cyan)
                    let temporalCol = vec3<f32>(0.3, 0.8, 0.9) * temporalEcho;
                    
                    // Planetary grid (earthy green-gold)
                    let gridCol = vec3<f32>(0.2, 0.6, 0.3) * planetaryGrid;
                    
                    // DNA helix (rose gold genetic)
                    let dnaCol = vec3<f32>(1.0, 0.4, 0.6) * dnaHelix;
                    
                    // 3D Sound geometry (audio-reactive spectrum)
                    let soundCol = vec3<f32>(0.8, 0.9, 0.2) * soundGeometry3D;
                    
                    // Holographic projection (plasma white)
                    let holoCol = vec3<f32>(1.0, 0.95, 0.8) * holoProjection;
                    
                    // Coherence field (unity blue-white)
                    let coherenceCol = vec3<f32>(0.4, 0.8, 1.0) * coherenceField;
                    
                    // Combine all layers
                    var color = fractalCol * (1.0 - cymatics * 0.5);
                    color += cymaticsCol;
                    color += chakraCol;
                    color += agentCol;
                    color += akashicCol;
                    color += resonanceCol;
                    color += loveCol;
                    color += harmonyCol;
                    color += vec3<f32>(fol) * vec3<f32>(0.2, 0.4, 0.8);
                    
                    // New layer blend
                    color += portalCol;
                    color += temporalCol;
                    color += gridCol;
                    color += dnaCol;
                    color += soundCol;
                    color += holoCol;
                    color += coherenceCol;
                    
                    // Volumetric light from center
                    let vl = exp(-length(uv) * 3.0) * (1.0 + uniforms.audioVolume) * 0.2;
                    color += vec3<f32>(1.0, 0.84, 0.0) * vl;
                    
                    // Chromatic aberration on high resonance
                    if (uniforms.resonanceLevel > 90.0) {
                        let offset = vec2<f32>(uniforms.resonanceLevel * 0.001, 0.0);
                        // Simplified - real CA needs multi-pass
                        color = color * vec3<f32>(1.1, 0.9, 1.1);
                    }
                    
                    // Glitch on universal
                    if (uniforms.resonanceLevel >= 100.0) {
                        let glitch = step(0.98, fract(time * 30.0));
                        color = mix(color, color * vec3<f32>(1.5, 0.5, 1.5), glitch);
                    }
                    
                    // Audio-reactive glitch
                    let audioGlitch = step(0.95, uniforms.audioBass);
                    color = mix(color, color * vec3<f32>(1.3, 0.7, 1.3), audioGlitch);
                    
                    // Holographic noise
                    let holoNoise = fract(sin(dot(fragCoord * 10.0 + time * 100.0, vec2<f32>(12.9898, 78.233))) * 43758.5453) * 0.02;
                    color += vec3<f32>(holoNoise);
                    
                    // Vignette
                    let vignette = 1.0 - length(uv) * 0.6;
                    color *= vignette;
                    
                    // HDR tone mapping (Reinhard)
                    color = color / (color + vec3<f32>(1.0));
                    // Gamma correction
                    color = pow(color, vec3<f32>(1.0 / 2.2));
                    
                    return vec4<f32>(color, 1.0);
                }
            `;
            
            const fractalShaderModule = webgpuDevice.createShaderModule({
                code: fractalWGSL
            });
            
            // Pipeline layout
            const bindGroupLayout = webgpuDevice.createBindGroupLayout({
                entries: [
                    { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
                    { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'storage' } },
                    { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'storage' } }
                ]
            });
            
            const pipelineLayout = webgpuDevice.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout]
            });
            
            webgpuPipeline = webgpuDevice.createRenderPipeline({
                layout: pipelineLayout,
                vertex: {
                    module: fractalShaderModule,
                    entryPoint: 'vs_main',
                    buffers: []
                },
                fragment: {
                    module: fractalShaderModule,
                    entryPoint: 'fs_main',
                    targets: [{ format: format }]
                },
                primitive: {
                    topology: 'triangle-strip'
                }
            });
            
            // Create uniform buffer
            const uniformBufferSize = 4 * 16; // 16 floats * 4 bytes
            webgpuBuffers = {
                uniform: webgpuDevice.createBuffer({
                    size: uniformBufferSize,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                }),
                agentPositions: webgpuDevice.createBuffer({
                    size: 12 * 3 * 4, // 12 agents * vec3 * 4 bytes
                    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
                }),
                agentIntensities: webgpuDevice.createBuffer({
                    size: 12 * 4,
                    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
                }),
                bindGroup: null
            };
            
            // Create bind group
            webgpuBuffers.bindGroup = webgpuDevice.createBindGroup({
                layout: bindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: webgpuBuffers.uniform } },
                    { binding: 1, resource: { buffer: webgpuBuffers.agentPositions } },
                    { binding: 2, resource: { buffer: webgpuBuffers.agentIntensities } }
                ]
            });
        }
        
        function createWebGPUBuffers() {
            // Fullscreen triangle vertices (no vertex buffer needed, generated in shader)
        }
        
        function drawWebGPU(state, time, audioData) {
            if (!webgpuSupported || !webgpuDevice || !webgpuPipeline) return;
            
            // Update uniforms
            const activeColor = hexToRgbVec3(state.activeFreqColor || '#FF00FF');
            const zoom = 1.0 + Math.sin(time * 0.05) * 0.1 + (state.loveResonanceLevel / 100) * 0.5;
            const centerX = Math.sin(time * 0.03) * 0.01;
            const centerY = Math.cos(time * 0.04) * 0.01;
            
            // Dynamic portal/dna/coherence values based on state
            const portalDepth = 3.0 + Math.sin(time * 0.1) * 2.0 + (state.loveResonanceLevel / 100) * 3.0;
            const dnaActivity = (state.consciousnessLevel || 0) * 0.5 + (state.chakraActivation || 0) * 0.3 + Math.sin(time * 0.2) * 0.2;
            const coherenceStrength = (state.collectiveHarmony || 0) * 0.8 + (state.loveResonanceLevel / 100) * 0.2;
            
            // Agent data
            const agentPositions = new Float32Array(36);
            const agentIntensities = new Float32Array(12);
            if (state.collectiveField && state.collectiveField.participants) {
                const participants = Object.values(state.collectiveField.participants);
                for (let i = 0; i < Math.min(participants.length, 12); i++) {
                    const p = participants[i];
                    const angle = (i / Math.max(participants.length, 1)) * Math.PI * 2;
                    const radius = 0.5 + Math.sin(time + i) * 0.2;
                    agentPositions[i * 3] = radius * Math.cos(angle);
                    agentPositions[i * 3 + 1] = radius * Math.sin(angle);
                    agentPositions[i * 3 + 2] = p.resonance || 0.5;
                    agentIntensities[i] = p.resonance || 0.5;
                }
            }
            
            const uniformData = new Float32Array([
                time, 0, 0, 0,
                webgpuCanvas.width, webgpuCanvas.height, 0, 0,
                zoom, centerX, centerY, 0,
                state.loveResonanceLevel || 100, 0, 0, 0,
                state.collectiveHarmony || 0, 0, 0, 0,
                audioData.bass, audioData.mid, audioData.treble, audioData.volume,
                activeColor[0], activeColor[1], activeColor[2], 0,
                state.consciousnessLevel || 0, state.activeChakra || 3, state.chakraActivation || 0, 0,
                Date.now() / 1000, 0, 0, 0,
                state.collectiveField ? Object.keys(state.collectiveField.participants || {}).length : 0, 0, 0, 0,
                portalDepth, dnaActivity, coherenceStrength, 0
            ]);
            
            webgpuDevice.queue.writeBuffer(webgpuBuffers.uniform, 0, uniformData);
            webgpuDevice.queue.writeBuffer(webgpuBuffers.agentPositions, 0, agentPositions);
            webgpuDevice.queue.writeBuffer(webgpuBuffers.agentIntensities, 0, agentIntensities);
            
            // Render
            const textureView = webgpuContext.getCurrentTexture().createView();
            const commandEncoder = webgpuDevice.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: textureView,
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store'
                }]
            });
            
            renderPass.setPipeline(webgpuPipeline);
            renderPass.setBindGroup(0, webgpuBuffers.bindGroup);
            renderPass.draw(4, 1, 0, 0); // Fullscreen triangle strip
            renderPass.end();
            
            webgpuDevice.queue.submit([commandEncoder.finish()]);
        }
        
        // ===== WEBGPU COMPUTE SHADERS (Next Gen GPU Compute) =====
        let webgpuComputePipeline = null;
        let webgpuComputeBuffers = null;
        let webgpuNeuralBuffer = null;
        let webgpuAkashicBuffer = null;
        let webgpuQuantumBuffer = null;
        let webgpuEvolutionBuffer = null;
        
        

// Export
export { initWebGPU };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.initWebGPU = initWebGPU;
}
