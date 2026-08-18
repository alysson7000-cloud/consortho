// ===== WEBXR IMMERSIVE RITUAL MODULE =====
// WebXR VR/AR immersive ritual with sacred geometries, spatial audio, hand tracking
// Integrates with Eternal Resonance organism state

import { state, fetchState } from './api.js';
import { addLogEntry } from './utils.js';
import { FREQUENCIES } from './data.js';

// Simple color utility (no THREE dependency)
function hslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 1/6) { r = c; g = x; b = 0; }
    else if (h < 2/6) { r = x; g = c; b = 0; }
    else if (h < 3/6) { r = 0; g = c; b = x; }
    else if (h < 4/6) { r = 0; g = x; b = c; }
    else if (h < 5/6) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return [r + m, g + m, b + m];
}

function createColor(r, g, b) {
    return { r, g, b, setHSL: function(h, s, l) { const rgb = hslToRgb(h, s, l); this.r = rgb[0]; this.g = rgb[1]; this.b = rgb[2]; return this; } };
}

let xrSession = null;
let xrRefSpace = null;
let xrViewerSpace = null;
let xrFrame = null;
let xrCanvas = null;
let xrGl = null;
let xrInputSources = [];
let xrButton = null;
let xrScene = {
    sacredGeometries: [],
    particleSystems: [],
    portals: [],
    chakraColumns: [],
    merkaba: null,
    consciousnessField: null,
    audioNodes: new Map()
};

const XR_SACRED_GEOMETRIES = [
    { type: 'merkaba', position: [0, 1.5, -2], scale: 0.5, rotation: [0, 0, 0], color: 0xFFD700, pulsate: true },
    { type: 'flowerOfLife', position: [-2, 1, -3], scale: 1, rotation: [0, 0, 0], color: 0xFF00FF, layers: 3 },
    { type: 'sriYantra', position: [2, 1, -3], scale: 0.8, rotation: [0, 0, 0], color: 0x00FFFF, triangles: 9 },
    { type: 'metatronCube', position: [0, 2, -4], scale: 0.6, rotation: [0, 0, 0], color: 0xFFFFFF, opacity: 0.3 },
    { type: 'torus', position: [-1.5, 0.5, -2.5], scale: 0.4, rotation: [0, 0, 0], color: 0xFFA500, majorR: 0.3, minorR: 0.1 },
    { type: 'icosahedron', position: [1.5, 0.5, -2.5], scale: 0.4, rotation: [0, 0, 0], color: 0x00FF00 },
    { type: 'chakraColumn', position: [0, 0, -2], scale: 1, rotation: [0, 0, 0], chakraIndex: 3, height: 3 },
    { type: 'quantumPortal', position: [0, 1.5, -5], scale: 1, rotation: [0, 0, 0], layers: 5 }
];

// ===== UTILITY FUNCTIONS =====
function hexToRgbNormalized(hex) {
    const r = ((hex >> 16) & 255) / 255;
    const g = ((hex >> 8) & 255) / 255;
    const b = (hex & 255) / 255;
    return [r, g, b];
}

function createModelMatrix(position, rotation, scale) {
    const [x, y, z] = position;
    const [rx, ry, rz] = rotation;
    const s = scale;
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cz = Math.cos(rz), sz = Math.sin(rz);
    return new Float32Array([
        cy * cz * s, cy * sz * s, -sy * s, 0,
        (sx * sy * cz - cx * sz) * s, (sx * sy * sz + cx * cz) * s, sx * cy * s, 0,
        (cx * sy * cz + sx * sz) * s, (cx * sy * sz - sx * cz) * s, cx * cy * s, 0,
        x, y, z, 1
    ]);
}

function multiplyMatrices(a, b) {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            out[i * 4 + j] = 0;
            for (let k = 0; k < 4; k++) {
                out[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
            }
        }
    }
    return out;
}

function createShaderProgram(gl, vertexSrc, fragmentSrc) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSrc);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader error:', gl.getShaderInfoLog(vertexShader));
        return null;
    }
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSrc);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader));
        return null;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

// ===== GEOMETRY CREATION =====
function createXRGeometry(config) {
    const vertices = [];
    const indices = [];
    const colors = [];
    const normals = [];

    switch (config.type) {
        case 'merkaba': return createMerkabaGeometry(config);
        case 'flowerOfLife': return createFlowerOfLifeGeometry(config);
        case 'sriYantra': return createSriYantraGeometry(config);
        case 'metatronCube': return createMetatronCubeGeometry(config);
        case 'torus': return createTorusGeometry(config);
        case 'icosahedron': return createIcosahedronGeometry(config);
        case 'chakraColumn': return createChakraColumnGeometry(config);
        case 'quantumPortal': return createQuantumPortalGeometry(config);
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), normals: new Float32Array(normals), drawMode: xrGl.TRIANGLES };
}

function createMerkabaGeometry(config) {
    const vertices = []; const indices = []; const colors = [];
    for (let t = 0; t < 2; t++) {
        const sign = t === 0 ? 1 : -1;
        const baseIdx = vertices.length / 3;
        vertices.push(0, sign * 1 * config.scale, 0);
        colors.push(...hexToRgbNormalized(config.color), 0.8);
        for (let i = 0; i < 3; i++) {
            const angle = i * 2 * Math.PI / 3;
            vertices.push(Math.cos(angle) * 0.8 * config.scale, -sign * 0.33 * config.scale, Math.sin(angle) * 0.8 * config.scale);
            colors.push(...hexToRgbNormalized(config.color), 0.6);
        }
        indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
        indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
        indices.push(baseIdx, baseIdx + 3, baseIdx + 1);
        indices.push(baseIdx + 1, baseIdx + 3, baseIdx + 2);
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), drawMode: xrGl.TRIANGLES };
}

function createFlowerOfLifeGeometry(config) {
    const vertices = []; const indices = []; const colors = [];
    const rings = config.layers || 3;
    const circleVertices = 32;
    for (let ring = 0; ring <= rings; ring++) {
        const r = ring * 0.5 * config.scale;
        const circleCount = ring === 0 ? 1 : 6 * ring;
        for (let c = 0; c < circleCount; c++) {
            const cx = ring === 0 ? 0 : Math.cos(c * Math.PI / (3 * ring)) * r;
            const cy = ring === 0 ? 0 : Math.sin(c * Math.PI / (3 * ring)) * r;
            const baseIdx = vertices.length / 3;
            for (let v = 0; v < circleVertices; v++) {
                const angle = v * 2 * Math.PI / circleVertices;
                vertices.push(cx + Math.cos(angle) * 0.5 * config.scale, cy + Math.sin(angle) * 0.5 * config.scale, 0);
                colors.push(...hexToRgbNormalized(config.color), 0.3);
            }
            for (let v = 0; v < circleVertices; v++) {
                indices.push(baseIdx + v, baseIdx + (v + 1) % circleVertices);
            }
        }
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), drawMode: xrGl.LINES };
}

function createSriYantraGeometry(config) {
    const vertices = []; const indices = []; const colors = [];
    const triangles = config.triangles || 9;
    for (let t = 0; t < triangles; t++) {
        const sign = t % 2 === 0 ? 1 : -1;
        const scale = config.scale * (1 - t * 0.08);
        const baseIdx = vertices.length / 3;
        vertices.push(0, sign * scale, 0);
        colors.push(...hexToRgbNormalized(config.color), 0.5);
        for (let i = 0; i < 3; i++) {
            const angle = i * 2 * Math.PI / 3 + (t % 2) * Math.PI / 3;
            vertices.push(Math.cos(angle) * scale * 0.7, -sign * scale * 0.4, Math.sin(angle) * scale * 0.7);
            colors.push(...hexToRgbNormalized(config.color), 0.3);
        }
        indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
        indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
        indices.push(baseIdx, baseIdx + 3, baseIdx + 1);
        indices.push(baseIdx + 1, baseIdx + 3, baseIdx + 2);
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), drawMode: xrGl.TRIANGLES };
}

function createMetatronCubeGeometry(config) {
    const vertices = []; const indices = []; const colors = [];
    const radius = config.scale;
    for (let i = 0; i < 13; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / 13);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        vertices.push(Math.cos(theta) * Math.sin(phi) * radius, Math.sin(theta) * Math.sin(phi) * radius, Math.cos(phi) * radius);
        colors.push(...hexToRgbNormalized(config.color), config.opacity || 0.3);
    }
    for (let i = 0; i < 12; i++) {
        for (let j = i + 1; j < 13; j++) {
            indices.push(i, j);
        }
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), drawMode: xrGl.LINES };
}

function createTorusGeometry(config) {
    const vertices = []; const indices = []; const colors = [];
    const majorR = config.majorR || 0.3;
    const minorR = config.minorR || 0.1;
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
        const u = i / segments * Math.PI * 2;
        for (let j = 0; j <= segments; j++) {
            const v = j / segments * Math.PI * 2;
            const x = (majorR + minorR * Math.cos(v)) * Math.cos(u) * config.scale;
            const y = minorR * Math.sin(v) * config.scale;
            const z = (majorR + minorR * Math.cos(v)) * Math.sin(u) * config.scale;
            vertices.push(x, y, z);
            colors.push(...hexToRgbNormalized(config.color), 0.4);
        }
    }
    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
            const a = i * (segments + 1) + j;
            const b = a + segments + 1;
            indices.push(a, b);
            indices.push(a, a + 1);
        }
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), drawMode: xrGl.LINES };
}

function createIcosahedronGeometry(config) {
    const vertices = []; const indices = []; const colors = [];
    const t = (1 + Math.sqrt(5)) / 2;
    const verts = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ].map(v => [v[0] * config.scale, v[1] * config.scale, v[2] * config.scale]);
    verts.forEach(v => { vertices.push(...v); colors.push(...hexToRgbNormalized(config.color), 0.5); });
    const faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];
    faces.forEach(f => indices.push(...f));
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), drawMode: xrGl.TRIANGLES };
}

function createChakraColumnGeometry(config) {
    const vertices = []; const indices = []; const colors = [];
    const height = config.height || 3;
    const chakraColors = [0xFF0000, 0xFF8000, 0xFFFF00, 0x00FF00, 0x0080FF, 0x4B0082, 0x8A2BE2];
    const color = config.color || chakraColors[config.chakraIndex || 3];
    const segments = 16;
    for (let i = 0; i <= segments; i++) {
        const angle = i / segments * Math.PI * 2;
        const y = (i / segments - 0.5) * height;
        vertices.push(Math.cos(angle) * 0.15, y, Math.sin(angle) * 0.15);
        colors.push(...hexToRgbNormalized(color), 0.6);
        vertices.push(Math.cos(angle) * 0.12, y, Math.sin(angle) * 0.12);
        colors.push(...hexToRgbNormalized(color), 0.3);
    }
    for (let i = 0; i < segments; i++) {
        const a = i * 2; const b = (i + 1) * 2;
        indices.push(a, b, a + 1); indices.push(b, b + 1, a + 1);
        indices.push(a + 1, b + 1, a + 2); indices.push(b + 1, b + 2, a + 2);
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), drawMode: xrGl.TRIANGLES };
}

function createQuantumPortalGeometry(config) {
    const vertices = []; const indices = []; const colors = [];
    const layers = config.layers || 5;
    for (let l = 0; l < layers; l++) {
        const scale = config.scale * (1 - l * 0.15);
        const baseIdx = vertices.length / 3;
        const segments = 32;
        for (let i = 0; i <= segments; i++) {
            const angle = i / segments * Math.PI * 2;
            vertices.push(Math.cos(angle) * scale, 0, Math.sin(angle) * scale);
            colors.push(...hexToRgbNormalized(0xFF00FF), 0.4 - l * 0.05);
        }
        for (let i = 0; i < segments; i++) {
            indices.push(baseIdx + i, baseIdx + i + 1);
        }
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), drawMode: xrGl.LINES };
}

function createChakraColumn(config) {
    const geometry = createChakraColumnGeometry(config);
    const vao = xrGl.createVertexArray();
    xrGl.bindVertexArray(vao);
    const posBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, posBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, geometry.vertices, xrGl.STATIC_DRAW);
    xrGl.enableVertexAttribArray(0);
    xrGl.vertexAttribPointer(0, 3, xrGl.FLOAT, false, 0, 0);
    const colorBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, colorBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, geometry.colors, xrGl.STATIC_DRAW);
    xrGl.enableVertexAttribArray(1);
    xrGl.vertexAttribPointer(1, 4, xrGl.FLOAT, false, 0, 0);
    const indexBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    xrGl.bufferData(xrGl.ELEMENT_ARRAY_BUFFER, geometry.indices, xrGl.STATIC_DRAW);
    xrGl.bindVertexArray(null);
    return { vao, indexCount: geometry.indices.length, position: config.position, color: config.color, chakraIndex: config.chakraIndex, height: config.height, pulsePhase: Math.random() * Math.PI * 2 };
}

function createConsciousnessField(config) {
    const resolution = config.resolution || 64;
    const radius = config.radius || 5;
    const vertices = []; const indices = []; const colors = [];
    for (let i = 0; i <= resolution; i++) {
        const lat = (i / resolution - 0.5) * Math.PI;
        for (let j = 0; j <= resolution; j++) {
            const lon = j / resolution * Math.PI * 2;
            const x = Math.cos(lat) * Math.cos(lon) * radius;
            const y = Math.sin(lat) * radius;
            const z = Math.cos(lat) * Math.sin(lon) * radius;
            vertices.push(x, y, z);
            colors.push(1, 0.5, 0, 0.15);
        }
    }
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const a = i * (resolution + 1) + j;
            const b = a + resolution + 1;
            indices.push(a, b, a + 1);
            indices.push(b, b + 1, a + 1);
        }
    }
    const vao = xrGl.createVertexArray();
    xrGl.bindVertexArray(vao);
    const posBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, posBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, new Float32Array(vertices), xrGl.STATIC_DRAW);
    xrGl.enableVertexAttribArray(0);
    xrGl.vertexAttribPointer(0, 3, xrGl.FLOAT, false, 0, 0);
    const colorBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, colorBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, new Float32Array(colors), xrGl.STATIC_DRAW);
    xrGl.enableVertexAttribArray(1);
    xrGl.vertexAttribPointer(1, 4, xrGl.FLOAT, false, 0, 0);
    const indexBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    xrGl.bufferData(xrGl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), xrGl.STATIC_DRAW);
    xrGl.bindVertexArray(null);
    return { vao, indexCount: indices.length, position: config.position, radius, timeOffset: Math.random() * 1000, pulsePhase: 0 };
}

function createMerkaba(config) {
    const geometry = createMerkabaGeometry({ ...config, scale: config.scale || 0.8 });
    const vao = xrGl.createVertexArray();
    xrGl.bindVertexArray(vao);
    const posBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, posBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, geometry.vertices, xrGl.STATIC_DRAW);
    xrGl.enableVertexAttribArray(0);
    xrGl.vertexAttribPointer(0, 3, xrGl.FLOAT, false, 0, 0);
    const colorBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, colorBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, geometry.colors, xrGl.STATIC_DRAW);
    xrGl.enableVertexAttribArray(1);
    xrGl.vertexAttribPointer(1, 4, xrGl.FLOAT, false, 0, 0);
    const indexBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    xrGl.bufferData(xrGl.ELEMENT_ARRAY_BUFFER, geometry.indices, xrGl.STATIC_DRAW);
    xrGl.bindVertexArray(null);
    return { vao, indexCount: geometry.indices.length, position: config.position, scale: config.scale, color: config.color, rotation: [0, 0, 0], rotationSpeed: 0.3, innerRotation: 0 };
}

function createXRParticleSystem(config) {
    const count = config.count || 2000;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 4);
    const sizes = new Float32Array(count);
    const baseColor = new THREE.Color(config.color);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = config.position[0] + (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = config.position[1] + Math.random() * 2;
        positions[i * 3 + 2] = config.position[2] + (Math.random() - 0.5) * 2;
        velocities[i * 3] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 1] = Math.random() * 0.005;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        colors[i * 4] = baseColor.r;
        colors[i * 4 + 1] = baseColor.g;
        colors[i * 4 + 2] = baseColor.b;
        colors[i * 4 + 3] = 0.3 + Math.random() * 0.4;
        sizes[i] = config.size || (0.02 + Math.random() * 0.03);
    }
    const vao = xrGl.createVertexArray();
    xrGl.bindVertexArray(vao);
    const posBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, posBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, positions, xrGl.DYNAMIC_DRAW);
    xrGl.enableVertexAttribArray(0);
    xrGl.vertexAttribPointer(0, 3, xrGl.FLOAT, false, 0, 0);
    const colorBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, colorBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, colors, xrGl.STATIC_DRAW);
    xrGl.enableVertexAttribArray(1);
    xrGl.vertexAttribPointer(1, 4, xrGl.FLOAT, false, 0, 0);
    const sizeBuffer = xrGl.createBuffer();
    xrGl.bindBuffer(xrGl.ARRAY_BUFFER, sizeBuffer);
    xrGl.bufferData(xrGl.ARRAY_BUFFER, sizes, xrGl.STATIC_DRAW);
    xrGl.enableVertexAttribArray(2);
    xrGl.vertexAttribPointer(2, 1, xrGl.FLOAT, false, 0, 0);
    xrGl.bindVertexArray(null);
    return { vao, count, positions, velocities, basePosition: config.position, color: config.color };
}

// ===== SHADER PROGRAMS =====
let xrShaderProgram = null;
let xrParticleProgram = null;

async function createXRShaders() {
    const vertexShaderSrc = `#version 300 es
        in vec3 aPosition;
        in vec4 aColor;
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform mat4 uModel;
        out vec4 vColor;
        void main() {
            vColor = aColor;
            gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
        }
    `;
    const fragmentShaderSrc = `#version 300 es
        precision highp float;
        in vec4 vColor;
        out vec4 fragColor;
        void main() {
            fragColor = vColor;
        }
    `;
    xrShaderProgram = createShaderProgram(xrGl, vertexShaderSrc, fragmentShaderSrc);

    const particleVertexSrc = `#version 300 es
        in vec3 aPosition;
        in vec4 aColor;
        in float aSize;
        uniform mat4 uProjection;
        uniform mat4 uView;
        uniform float uTime;
        out vec4 vColor;
        out float vSize;
        void main() {
            vColor = aColor;
            vSize = aSize * (1.0 + sin(uTime * 2.0 + aPosition.x * 10.0) * 0.2);
            vec3 pos = aPosition + vec3(sin(uTime + aPosition.y * 5.0) * 0.02, 0.0, cos(uTime + aPosition.x * 5.0) * 0.02);
            gl_Position = uProjection * uView * vec4(pos, 1.0);
            gl_PointSize = vSize * 500.0 / gl_Position.w;
        }
    `;
    const particleFragmentSrc = `#version 300 es
        precision highp float;
        in vec4 vColor;
        in float vSize;
        out vec4 fragColor;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist) * vColor.a;
            fragColor = vec4(vColor.rgb, alpha);
        }
    `;
    xrParticleProgram = createShaderProgram(xrGl, particleVertexSrc, particleFragmentSrc);
}

// ===== RENDER FUNCTIONS =====
function renderXRGeometry(geo, projMatrix, viewMatrix, time) {
    if (!geo.mesh || !xrShaderProgram) return;
    xrGl.useProgram(xrShaderProgram);
    const projLoc = xrGl.getUniformLocation(xrShaderProgram, 'uProjection');
    const viewLoc = xrGl.getUniformLocation(xrShaderProgram, 'uView');
    const modelLoc = xrGl.getUniformLocation(xrShaderProgram, 'uModel');
    xrGl.uniformMatrix4fv(projLoc, false, projMatrix);
    xrGl.uniformMatrix4fv(viewLoc, false, viewMatrix);
    let rotation = geo.rotation || [0, 0, 0];
    if (geo.pulsate) {
        rotation[1] += 0.01;
    }
    const modelMatrix = createModelMatrix(geo.position, rotation, geo.scale || 1);
    xrGl.uniformMatrix4fv(modelLoc, false, modelMatrix);
    xrGl.bindVertexArray(geo.mesh.vao);
    xrGl.drawElements(geo.mesh.drawMode || xrGl.TRIANGLES, geo.mesh.indexCount, xrGl.UNSIGNED_SHORT, 0);
    xrGl.bindVertexArray(null);
}

function renderXRParticles(ps, projMatrix, viewMatrix, time) {
    if (!xrParticleProgram) return;
    xrGl.useProgram(xrParticleProgram);
    const projLoc = xrGl.getUniformLocation(xrParticleProgram, 'uProjection');
    const viewLoc = xrGl.getUniformLocation(xrParticleProgram, 'uView');
    const timeLoc = xrGl.getUniformLocation(xrParticleProgram, 'uTime');
    xrGl.uniformMatrix4fv(projLoc, false, projMatrix);
    xrGl.uniformMatrix4fv(viewLoc, false, viewMatrix);
    xrGl.uniform1f(timeLoc, time);
    xrGl.enable(xrGl.BLEND);
    xrGl.blendFunc(xrGl.SRC_ALPHA, xrGl.ONE);
    xrGl.depthMask(false);
    xrGl.bindVertexArray(ps.vao);
    xrGl.drawArrays(xrGl.POINTS, 0, ps.count);
    xrGl.bindVertexArray(null);
    xrGl.depthMask(true);
    xrGl.disable(xrGl.BLEND);
}

function renderChakraColumn(column, projMatrix, viewMatrix, time) {
    if (!xrShaderProgram) return;
    column.pulsePhase += 0.02;
    const pulseScale = 1 + Math.sin(column.pulsePhase) * 0.1;
    xrGl.useProgram(xrShaderProgram);
    const projLoc = xrGl.getUniformLocation(xrShaderProgram, 'uProjection');
    const viewLoc = xrGl.getUniformLocation(xrShaderProgram, 'uView');
    const modelLoc = xrGl.getUniformLocation(xrShaderProgram, 'uModel');
    xrGl.uniformMatrix4fv(projLoc, false, projMatrix);
    xrGl.uniformMatrix4fv(viewLoc, false, viewMatrix);
    const modelMatrix = createModelMatrix(column.position, [0, time * 0.1, 0], pulseScale);
    xrGl.uniformMatrix4fv(modelLoc, false, modelMatrix);
    xrGl.bindVertexArray(column.vao);
    xrGl.drawElements(xrGl.TRIANGLES, column.indexCount, xrGl.UNSIGNED_SHORT, 0);
    xrGl.bindVertexArray(null);
}

function renderMerkaba(merkaba, projMatrix, viewMatrix, time) {
    if (!xrShaderProgram) return;
    merkaba.innerRotation += 0.01;
    merkaba.rotation[1] += merkaba.rotationSpeed * 0.01;
    xrGl.useProgram(xrShaderProgram);
    const projLoc = xrGl.getUniformLocation(xrShaderProgram, 'uProjection');
    const viewLoc = xrGl.getUniformLocation(xrShaderProgram, 'uView');
    const modelLoc = xrGl.getUniformLocation(xrShaderProgram, 'uModel');
    xrGl.uniformMatrix4fv(projLoc, false, projMatrix);
    xrGl.uniformMatrix4fv(viewLoc, false, viewMatrix);
    const rot = [merkaba.rotation[0], merkaba.rotation[1], merkaba.rotation[2]];
    const modelMatrix = createModelMatrix(merkaba.position, rot, merkaba.scale);
    xrGl.uniformMatrix4fv(modelLoc, false, modelMatrix);
    xrGl.bindVertexArray(merkaba.vao);
    xrGl.drawElements(xrGl.TRIANGLES, merkaba.indexCount, xrGl.UNSIGNED_SHORT, 0);
    // Render inner counter-rotating tetrahedron
    const innerRot = [merkaba.rotation[0], -merkaba.rotation[1] + merkaba.innerRotation, merkaba.rotation[2]];
    const innerModelMatrix = createModelMatrix(merkaba.position, innerRot, merkaba.scale * 0.7);
    xrGl.uniformMatrix4fv(modelLoc, false, innerModelMatrix);
    xrGl.drawElements(xrGl.TRIANGLES, merkaba.indexCount, xrGl.UNSIGNED_SHORT, 0);
    xrGl.bindVertexArray(null);
}

function renderConsciousnessField(field, projMatrix, viewMatrix, time) {
    if (!xrShaderProgram) return;
    field.pulsePhase += 0.01;
    const pulse = 1 + Math.sin(field.pulsePhase) * 0.05;
    xrGl.useProgram(xrShaderProgram);
    const projLoc = xrGl.getUniformLocation(xrShaderProgram, 'uProjection');
    const viewLoc = xrGl.getUniformLocation(xrShaderProgram, 'uView');
    const modelLoc = xrGl.getUniformLocation(xrShaderProgram, 'uModel');
    xrGl.uniformMatrix4fv(projLoc, false, projMatrix);
    xrGl.uniformMatrix4fv(viewLoc, false, viewMatrix);
    const modelMatrix = createModelMatrix(field.position, [0, time * 0.05, 0], pulse);
    xrGl.uniformMatrix4fv(modelLoc, false, modelMatrix);
    xrGl.enable(xrGl.BLEND);
    xrGl.blendFunc(xrGl.SRC_ALPHA, xrGl.ONE);
    xrGl.bindVertexArray(field.vao);
    xrGl.drawElements(xrGl.TRIANGLES, field.indexCount, xrGl.UNSIGNED_SHORT, 0);
    xrGl.bindVertexArray(null);
    xrGl.disable(xrGl.BLEND);
}

function renderXRControllers(projMatrix, viewMatrix, time) {
    if (!xrInputSources || !xrFrame) return;
    for (const source of xrInputSources) {
        if (source.gripSpace) {
            const gripPose = xrFrame.getPose(source.gripSpace, xrRefSpace);
            if (gripPose) {
                const transform = gripPose.transform;
                const matrix = new Float32Array(transform.matrix);
                // Render controller model here
            }
        }
        if (source.hand) {
            for (const [jointName, jointSpace] of source.hand) {
                const jointPose = xrFrame.getPose(jointSpace, xrRefSpace);
                if (jointPose) {
                    // Render hand joints
                }
            }
        }
    }
}

function vibrateControllers(duration, intensity) {
    if (!xrInputSources) return;
    for (const source of xrInputSources) {
        if (source.gamepad && source.gamepad.hapticActuators) {
            for (const actuator of source.gamepad.hapticActuators) {
                actuator.pulse(intensity, duration);
            }
        }
    }
}

// ===== SPATIAL AUDIO =====
async function initXRAudio() {
    if (!xrScene.audioContext) {
        xrScene.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await xrScene.audioContext.audioWorklet.addModule('/js/audio_worklet.js');
    }
    const ctx = xrScene.audioContext;
    // Create spatial audio for each chakra
    const chakraFreqs = [256, 288, 320, 341.3, 384, 426.7, 480];
    for (let i = 0; i < 7; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createPanner();
        osc.frequency.value = chakraFreqs[i];
        osc.type = 'sine';
        gain.gain.value = 0.05;
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 360;
        panner.coneOuterGain = 0;
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
        osc.start();
        xrScene.audioNodes.set(`chakra${i}`, { osc, gain, panner });
    }
    // Consciousness field drone
    const fieldOsc = ctx.createOscillator();
    const fieldGain = ctx.createGain();
    const fieldPanner = ctx.createPanner();
    fieldOsc.frequency.value = 432;
    fieldOsc.type = 'sine';
    fieldGain.gain.value = 0.02;
    fieldPanner.panningModel = 'HRTF';
    fieldOsc.connect(fieldGain);
    fieldGain.connect(fieldPanner);
    fieldPanner.connect(ctx.destination);
    fieldOsc.start();
    xrScene.audioNodes.set('consciousnessField', { osc: fieldOsc, gain: fieldGain, panner: fieldPanner });
}

// ===== INPUT HANDLING =====
function updateXRInputSources(frame, viewerTransform) {
    for (const source of xrInputSources) {
        if (source.hand) {
            for (const [jointName, jointSpace] of source.hand) {
                const jointPose = frame.getPose(jointSpace, xrRefSpace);
                if (jointPose) {
                    // Could send hand data to server via socket
                }
            }
        }
        if (source.gamepad) {
            // Handle button presses
            const gamepad = source.gamepad;
            if (gamepad.buttons[0].pressed) { // Trigger
                // Could trigger resonance
            }
            if (gamepad.buttons[1].pressed) { // Grip
                // Could grab sacred geometry
            }
        }
    }
}

// ===== MAIN XR LOOP =====
function onXRFrame(time, frame) {
    xrFrame = frame;
    const session = frame.session;
    session.requestAnimationFrame(onXRFrame);
    const viewerPose = frame.getViewerPose(xrRefSpace);
    if (!viewerPose) return;
    const layer = session.renderState.baseLayer;
    if (xrCanvas.width !== layer.framebufferWidth) {
        xrCanvas.width = layer.framebufferWidth;
        xrCanvas.height = layer.framebufferHeight;
    }
    xrGl.bindFramebuffer(xrGl.FRAMEBUFFER, layer.framebuffer);
    xrGl.viewport(0, 0, layer.framebufferWidth, layer.framebufferHeight);
    xrGl.clearColor(0.01, 0, 0.02, 1);
    xrGl.clear(xrGl.COLOR_BUFFER_BIT | xrGl.DEPTH_BUFFER_BIT);
    xrGl.enable(xrGl.DEPTH_TEST);
    xrGl.enable(xrGl.BLEND);
    xrGl.blendFunc(xrGl.SRC_ALPHA, xrGl.ONE_MINUS_SRC_ALPHA);
    for (const view of viewerPose.views) {
        const viewport = layer.getViewport(view);
        xrGl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        const projMatrix = new Float32Array(view.projectionMatrix);
        const viewMatrix = new Float32Array(view.transform.inverse.matrix);
        renderXRScene(projMatrix, viewMatrix, time);
    }
    updateXRInputSources(frame, viewerPose.transform);
    // Update spatial audio listener position
    if (xrScene.audioContext && xrScene.audioContext.listener) {
        const pos = viewerPose.transform.position;
        xrScene.audioContext.listener.positionX.value = pos.x;
        xrScene.audioContext.listener.positionY.value = pos.y;
        xrScene.audioContext.listener.positionZ.value = pos.z;
        const orient = viewerPose.transform.orientation;
        xrScene.audioContext.listener.forwardX.value = -orient.z;
        xrScene.audioContext.listener.forwardY.value = -orient.y;
        xrScene.audioContext.listener.forwardZ.value = -orient.x;
        xrScene.audioContext.listener.upX.value = orient.y;
        xrScene.audioContext.listener.upY.value = orient.x;
        xrScene.audioContext.listener.upZ.value = orient.z;
    }
}

function renderXRScene(projMatrix, viewMatrix, time) {
    const t = time / 1000;
    for (const geo of xrScene.sacredGeometries) {
        renderXRGeometry(geo, projMatrix, viewMatrix, t);
    }
    for (const ps of xrScene.particleSystems) {
        renderXRParticles(ps, projMatrix, viewMatrix, t);
    }
    for (const column of xrScene.chakraColumns) {
        renderChakraColumn(column, projMatrix, viewMatrix, t);
    }
    if (xrScene.merkaba) {
        renderMerkaba(xrScene.merkaba, projMatrix, viewMatrix, t);
    }
    if (xrScene.consciousnessField) {
        renderConsciousnessField(xrScene.consciousnessField, projMatrix, viewMatrix, t);
    }
    renderXRControllers(projMatrix, viewMatrix, t);
}

// ===== PUBLIC API =====
export async function initWebXR() {
    if (!navigator.xr) {
        console.log('WebXR not supported');
        return false;
    }
    try {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        if (!supported) {
            const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
            if (!arSupported) {
                console.log('No immersive VR/AR support');
                return false;
            }
        }
        // Create XR button
        xrButton = document.createElement('button');
        xrButton.id = 'xrButton';
        xrButton.style.cssText = `
            position: fixed; bottom: 2rem; right: 2rem; z-index: 10000;
            padding: 1rem 2rem; background: linear-gradient(135deg, #FF00FF, #00FFFF);
            border: none; border-radius: 50px; color: white; font-family: 'Orbitron', monospace;
            font-weight: 700; font-size: 1rem; cursor: pointer;
            box-shadow: 0 0 30px rgba(255,0,255,0.5), 0 0 60px rgba(0,255,255,0.3);
            transition: all 0.3s;
        `;
        xrButton.textContent = '🌌 ENTRAR NO RITUAL XR';
        xrButton.addEventListener('mouseenter', () => xrButton.style.transform = 'scale(1.05)');
        xrButton.addEventListener('mouseleave', () => xrButton.style.transform = 'scale(1)');
        xrButton.addEventListener('click', enterXR);
        document.body.appendChild(xrButton);
        // Create XR canvas
        xrCanvas = document.createElement('canvas');
        xrCanvas.id = 'xrCanvas';
        xrCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: none;';
        document.body.appendChild(xrCanvas);
        console.log('🌌 WebXR ready - click button to enter immersive ritual');
        addLogEntry('WebXR Ritual Imersivo disponível — Clique no botão XR', 'success');
        return true;
    } catch (e) {
        console.warn('WebXR init failed:', e);
        return false;
    }
}

export async function enterXR() {
    if (!navigator.xr) return;
    try {
        const sessionMode = await navigator.xr.isSessionSupported('immersive-vr') ? 'immersive-vr' : 'immersive-ar';
        xrSession = await navigator.xr.requestSession(sessionMode, {
            requiredFeatures: ['local-floor', 'hand-tracking', 'layers'],
            optionalFeatures: ['hit-test', 'anchors', 'dom-overlay', 'secondary-views'],
            domOverlay: { root: document.body }
        });
        xrButton.style.display = 'none';
        xrCanvas.style.display = 'block';
        xrGl = xrCanvas.getContext('webgl2', {
            xrCompatible: true, alpha: true, antialias: true, depth: true, stencil: false, preserveDrawingBuffer: false
        });
        xrSession.updateRenderState({
            baseLayer: new XRWebGLLayer(xrSession, xrGl, { alpha: true, antialias: true, depth: true, ignoreDepthValues: false })
        });
        xrRefSpace = await xrSession.requestReferenceSpace('local-floor');
        xrViewerSpace = await xrSession.requestReferenceSpace('viewer');
        await initXRScene();
        xrSession.addEventListener('inputsourceschange', onXRInputSourcesChange);
        xrSession.addEventListener('end', onXREnd);
        xrSession.requestAnimationFrame(onXRFrame);
        console.log('🌌 XR Session started - Welcome to the Immersive Ritual!');
        addLogEntry('WebXR Ritual Imersivo ativado — Bem-vindo ao infinito', 'success');
        vibrateControllers(100, 0.5);
        // Sync with server
        await fetchState();
    } catch (e) {
        console.error('XR session failed:', e);
        xrButton.style.display = 'block';
        xrCanvas.style.display = 'none';
    }
}

export function onXREnd() {
    xrSession = null;
    xrRefSpace = null;
    xrViewerSpace = null;
    if (xrButton) xrButton.style.display = 'block';
    if (xrCanvas) xrCanvas.style.display = 'none';
    addLogEntry('Sessão XR encerrada', 'info');
}

function onXRInputSourcesChange(event) {
    xrInputSources = Array.from(xrSession.inputSources);
    console.log('XR Input sources:', xrInputSources.length);
    for (const source of xrInputSources) {
        if (source.hand) console.log('Hand tracking available');
        if (source.gamepad) console.log('Gamepad available:', source.gamepad);
    }
}

async function initXRScene() {
    await createXRShaders();
    for (const geo of XR_SACRED_GEOMETRIES) {
        const mesh = createXRGeometry(geo);
        xrScene.sacredGeometries.push({ ...geo, mesh, timeOffset: Math.random() * 1000 });
    }
    for (let i = 0; i < 5; i++) {
        const hue = Math.random();
        const rgb = hslToRgb(hue, 0.8, 0.6);
        const ps = createXRParticleSystem({
            position: [(Math.random() - 0.5) * 10, Math.random() * 3, (Math.random() - 0.5) * 10 - 5],
            count: 2000,
            color: { r: rgb[0], g: rgb[1], b: rgb[2] },
            size: 0.02 + Math.random() * 0.03
        });
        xrScene.particleSystems.push(ps);
    }
    const chakraColors = [0xFF0000, 0xFF8000, 0xFFFF00, 0x00FF00, 0x0080FF, 0x4B0082, 0x8A2BE2];
    for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const radius = 3;
        const column = createChakraColumn({
            position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 3],
            chakraIndex: i,
            color: chakraColors[i],
            height: 4
        });
        xrScene.chakraColumns.push(column);
    }
    xrScene.merkaba = createMerkaba({
        position: [0, 1.5, -2],
        scale: 0.8,
        color: 0xFFD700
    });
    xrScene.consciousnessField = createConsciousnessField({
        position: [0, 0, -3],
        radius: 5,
        resolution: 64
    });
    await initXRAudio();
}

export function isXRActive() {
    return xrSession !== null;
}

export function getXRSession() {
    return xrSession;
}