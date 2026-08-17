// ===== CANVAS MODULE =====
// Canvas rendering, WebGL, particles, geometry, stack tower

import { addLogEntry } from './utils.js';

// Canvas state
let canvas = null;
let ctx = null;
let canvasWidth = 0;
let canvasHeight = 0;
let animationId = null;
let particles = [];
let geometryAngle = 0;
let activeFreqColor = '#FF00FF';

// WebGL state
let webglCanvas = null;
let gl = null;
let webglProgram = null;
let webglBuffers = null;
let webglStartTime = Date.now();

// WebGPU state
let webgpuCanvas = null;
let webgpuDevice = null;
let webgpuContext = null;
let webgpuPipeline = null;
let webgpuBuffers = null;
let webgpuStartTime = Date.now();
let webgpuSupported = false;

export function setupCanvas() {
    canvas = document.getElementById('resonanceCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    ctx = canvas.getContext('2d');
    const wrapper = canvas.parentElement;
    const size = Math.min(wrapper.clientWidth, wrapper.clientHeight);
    canvasWidth = size;
    canvasHeight = size;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initialize WebGL Canvas
    initWebGL(wrapper, size);

    // Initialize WebGPU (async)
    initWebGPU(wrapper, size);
}

export function initWebGL(wrapper, size) {
    webglCanvas = document.getElementById('webglCanvas');
    if (!webglCanvas) return;

    webglCanvas.width = size * window.devicePixelRatio;
    webglCanvas.height = size * window.devicePixelRatio;
    webglCanvas.style.width = size + 'px';
    webglCanvas.style.height = size + 'px';

    gl = webglCanvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        antialias: true
    });

    if (!gl) {
        console.warn('WebGL2 not available, falling back to WebGL1');
        gl = webglCanvas.getContext('webgl', { alpha: true });
    }

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    compileShaders();
    createGeometry();
    webglStartTime = Date.now();
}

function compileShaders() {
    // Vertex shader
    const vsSource = `
        attribute vec2 a_position;
        attribute vec2 a_instancePos;
        attribute float a_instanceScale;
        attribute vec3 a_instanceColor;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec3 u_activeColor;
        varying vec3 v_color;
        varying float v_life;
        void main() {
            vec2 pos = a_position * a_instanceScale + a_instancePos;
            vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
            v_color = mix(a_instanceColor, u_activeColor, 0.5);
            v_life = a_instanceScale;
        }
    `;

    // Fragment shader
    const fsSource = `
        precision mediump float;
        varying vec3 v_color;
        varying float v_life;
        void main() {
            float alpha = v_life;
            gl_FragColor = vec4(v_color, alpha);
        }
    `;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error('Vertex shader error:', gl.getShaderInfoLog(vs));
        return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
        return;
    }

    webglProgram = gl.createProgram();
    gl.attachShader(webglProgram, vs);
    gl.attachShader(webglProgram, fs);
    gl.linkProgram(webglProgram);
    if (!gl.getProgramParameter(webglProgram, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(webglProgram));
        return;
    }

    webglProgram.a_position = gl.getAttribLocation(webglProgram, 'a_position');
    webglProgram.a_instancePos = gl.getAttribLocation(webglProgram, 'a_instancePos');
    webglProgram.a_instanceScale = gl.getAttribLocation(webglProgram, 'a_instanceScale');
    webglProgram.a_instanceColor = gl.getAttribLocation(webglProgram, 'a_instanceColor');
    webglProgram.u_time = gl.getUniformLocation(webglProgram, 'u_time');
    webglProgram.u_resolution = gl.getUniformLocation(webglProgram, 'u_resolution');
    webglProgram.u_activeColor = gl.getUniformLocation(webglProgram, 'u_activeColor');
}

function createGeometry() {
    // Create particle geometry buffers
    const positions = new Float32Array([
        -0.5, -0.5,
         0.5, -0.5,
        -0.5,  0.5,
         0.5,  0.5
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    webglBuffers = { position: positionBuffer };
}

export async function initWebGPU(wrapper, size) {
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

        await compileWebGPUShaders(format);
        createWebGPUBuffers();
        webgpuStartTime = Date.now();
        webgpuSupported = true;
        console.log('WebGPU initialized successfully!');

        await initWebGPUCompute();
        await initAkashicRecords();
        initEvolutionEngine();
    } catch (e) {
        console.warn('WebGPU init failed:', e);
        webgpuSupported = false;
    }
}

async function compileWebGPUShaders(format) {
    // Shaders will be compiled in webgpu_compute.js
}

function createWebGPUBuffers() {
    // Buffers created in webgpu_compute.js
}

export function startCanvasLoop() {
    if (animationId) cancelAnimationFrame(animationId);
    animate();
}

function animate() {
    const now = Date.now();
    const deltaTime = (now - (webglStartTime || now)) / 1000;
    webglStartTime = now;

    updateParticles(deltaTime);
    renderCanvas();
    renderWebGL(deltaTime);

    if (webgpuSupported) {
        renderWebGPU(deltaTime);
    }

    animationId = requestAnimationFrame(animate);
}

function updateParticles(deltaTime) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= deltaTime;
        if (p.life <= 0) {
            particles.splice(i, 1);
        } else {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.vx *= 0.99;
            p.vy *= 0.99;
        }
    }
}

function renderCanvas() {
    if (!ctx) return;
    ctx.fillStyle = 'rgba(5, 0, 8, 0.15)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw sacred geometry
    geometryAngle += 0.005;
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(geometryAngle);
    ctx.strokeStyle = activeFreqColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 100;
        const y = Math.sin(angle) * 100;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

function renderWebGL(deltaTime) {
    if (!gl || !webglProgram || !webglBuffers) return;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(webglProgram);
    gl.uniform1f(webglProgram.u_time, Date.now() / 1000);
    gl.uniform2f(webglProgram.u_resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(webglProgram.u_activeColor,
        parseInt(activeFreqColor.slice(1, 3), 16) / 255,
        parseInt(activeFreqColor.slice(3, 5), 16) / 255,
        parseInt(activeFreqColor.slice(5, 7), 16) / 255
    );

    // Update particle instances
    const instanceCount = Math.min(particles.length, 1000);
    if (instanceCount === 0) return;

    const instancePositions = new Float32Array(instanceCount * 2);
    const instanceScales = new Float32Array(instanceCount);
    const instanceColors = new Float32Array(instanceCount * 3);

    for (let i = 0; i < instanceCount; i++) {
        const p = particles[i];
        instancePositions[i * 2] = p.x;
        instancePositions[i * 2 + 1] = p.y;
        instanceScales[i] = p.size;
        instanceColors[i * 3] = parseInt(p.color.slice(1, 3), 16) / 255;
        instanceColors[i * 3 + 1] = parseInt(p.color.slice(3, 5), 16) / 255;
        instanceColors[i * 3 + 2] = parseInt(p.color.slice(5, 7), 16) / 255;
    }

    // Bind instance buffers
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, instancePositions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(webglProgram.a_instancePos);
    gl.vertexAttribPointer(webglProgram.a_instancePos, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(webglProgram.a_instancePos, 1);

    const scaleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, scaleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, instanceScales, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(webglProgram.a_instanceScale);
    gl.vertexAttribPointer(webglProgram.a_instanceScale, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(webglProgram.a_instanceScale, 1);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, instanceColors, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(webglProgram.a_instanceColor);
    gl.vertexAttribPointer(webglProgram.a_instanceColor, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(webglProgram.a_instanceColor, 1);

    // Base geometry
    gl.bindBuffer(gl.ARRAY_BUFFER, webglBuffers.position);
    gl.enableVertexAttribArray(webglProgram.a_position);
    gl.vertexAttribPointer(webglProgram.a_position, 2, gl.FLOAT, false, 0, 0);

    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, instanceCount);
}

function renderWebGPU(deltaTime) {
    if (!webgpuSupported || !webgpuDevice || !webgpuContext) return;
    // WebGPU rendering in webgpu_compute.js
}

export function buildStackTower() {
    // Stack of 64 = Infinity visualization
    const tower = document.getElementById('stackTower');
    if (!tower) return;
    tower.innerHTML = '';
    for (let i = 63; i >= 0; i--) {
        const block = document.createElement('div');
        block.className = 'stack-block';
        block.style.cssText = `
            width: ${80 + i * 2}px;
            height: 8px;
            margin: 1px auto;
            background: linear-gradient(90deg, #FF00FF, #FFD700, #00FFFF);
            border-radius: 2px;
            opacity: ${0.1 + i / 64 * 0.9};
            transform: translateY(${(63 - i) * 2}px);
            transition: all 0.3s ease;
        `;
        block.dataset.level = i;
        tower.appendChild(block);
    }
}

// For non-module fallback
if (typeof window !== 'undefined') {
    window.setupCanvas = setupCanvas;
    window.initWebGL = initWebGL;
    window.startCanvasLoop = startCanvasLoop;
    window.buildStackTower = buildStackTower;
}
