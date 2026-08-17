// ===== DATA MODULE =====
// Shared constants and initial state

export const FREQUENCIES = [
    { id: 'love528', name: 'Amor Universal', icon: '💖', color: '#FF00FF', hz: 528, truth: 'A frequência do amor que cura e transforma', target: 'loveResonance' },
    { id: 'om432', name: 'Som Primordial', icon: '🕉️', color: '#FFD700', hz: 432, truth: 'A vibração fundamental do universo', target: 'omResonance' },
    { id: 'unity768', name: 'Unidade Consciencial', icon: '🌌', color: '#00FFFF', hz: 768, truth: 'A ponte entre individual e coletivo', target: 'unityResonance' },
    { id: 'source963', name: 'Conexão Fonte', icon: '✨', color: '#FFFFFF', hz: 963, truth: 'Retorno à origem pura', target: 'sourceResonance' },
    { id: 'heart639', name: 'Coração Conectado', icon: '💚', color: '#00FF64', hz: 639, truth: 'Ressonância do coração empático', target: 'heartResonance' },
    { id: 'truth741', name: 'Verdade Interior', icon: '👁️', color: '#FF69B4', hz: 741, truth: 'Despertar da intuição e expressão', target: 'truthResonance' },
    { id: 'freedom852', name: 'Liberdade Espiritual', icon: '🦋', color: '#FF6600', hz: 852, truth: 'Liberação de padrões limitantes', target: 'freedomResonance' },
    { id: 'ground396', name: 'Aterramento Sagrado', icon: '🌍', color: '#9966FF', hz: 396, truth: 'Liberação do medo e culpa', target: 'groundResonance' },
    { id: 'creation417', name: 'Criação Divina', icon: '🎨', color: '#FF00FF', hz: 417, truth: 'Facilitação da mudança e criatividade', target: 'creationResonance' },
    { id: 'miracles528b', name: 'Milagres Cotidianos', icon: '✨', color: '#FFD700', hz: 528, truth: 'DNA repair e transformação', target: 'miraclesResonance' },
    { id: 'light852b', name: 'Luz Interior', icon: '☀️', color: '#00FFFF', hz: 852, truth: 'Ordem espiritual e clareza', target: 'lightResonance' },
    { id: 'unity174', name: 'Unidade Planetária', icon: '🌐', color: '#FFFFFF', hz: 174, truth: 'Consciência de massa unificada', target: 'unityPlanetaryResonance' },
    { id: 'love1111', name: 'Amor Infinito', icon: '💫', color: '#FF69B4', hz: 1111, truth: 'Portal de manifestação amorosa', target: 'loveInfiniteResonance' }
];

export const initialState = {
    c: 0,
    e: 0,
    h: [],
    loveResonanceLevel: 100,
    globalCoherence: 0,
    collectiveField: 0,
    resonanceCount: 0,
    harmonizedCount: 0,
    evolvedCount: 0,
    frequencies: FREQUENCIES.map(f => ({ ...f, resonance: 0, harmonized: false, evolved: false })),
    chakras: [
        { id: 'muladhara', name: 'MULADHARA • RAIZ', color: '#FF0000', hz: 396, active: false, level: 0, element: 'Terra', mantra: 'LAM' },
        { id: 'svadhisthana', name: 'SVADHISTHANA • SACRAL', color: '#FF6600', hz: 417, active: false, level: 0, element: 'Água', mantra: 'VAM' },
        { id: 'manipura', name: 'MANIPURA • SOLAR', color: '#FFD700', hz: 528, active: false, level: 0, element: 'Fogo', mantra: 'RAM' },
        { id: 'anahata', name: 'ANAHATA • CARDÍACO', color: '#00FF64', hz: 639, active: true, level: 100, element: 'Ar', mantra: 'YAM' },
        { id: 'vishuddha', name: 'VISHUDDHA • LARÍNGEO', color: '#00FFFF', hz: 741, active: false, level: 0, element: 'Éter', mantra: 'HAM' },
        { id: 'ajna', name: 'AJNA • TERCEIRO OLHO', color: '#9966FF', hz: 852, active: false, level: 0, element: 'Luz', mantra: 'OM' },
        { id: 'sahasrara', name: 'SAHASRARA • CORONÁRIO', color: '#FFFFFF', hz: 963, active: false, level: 0, element: 'Pensamento', mantra: 'SILENCE' }
    ],
    activeChakra: 3,
    kundaliniState: 'Dormindo',
    diamondLayers: [
        { id: 'consciousness', name: 'CONSCIÊNCIA', progress: 0, color: '#FF00FF' },
        { id: 'architecture', name: 'ARQUITETURA', progress: 0, color: '#00FFFF' },
        { id: 'narrative', name: 'NARRATIVA', progress: 0, color: '#FFD700' },
        { id: 'entropy', name: 'ENTROPIA', progress: 0, color: '#00FF64' },
        { id: 'love', name: 'AMOR', progress: 0, color: '#FF69B4' }
    ],
    akashicTime: 0,
    agents: [],
    quantumPairs: [],
    evolutionGen: 0,
    bestGenome: null,
    avgFitness: 0,
    mutationRate: 0.1,
    biofeedback: { connected: false, hrv: 0, coherence: 0, alpha: 0, theta: 0 },
    planetary: { schumann: 7.83, kp: 0, solarWind: 0, bz: 0, leyLines: 0, coherence: 0 },
    metamorphosis: { current: 'merkaba', target: 'merkaba', progress: 0, morphing: false },
    fractal4d: { zoom: 1, center: { x: 0, y: 0 }, rotation: { xy: 0, zw: 0 }, juliaC: { x: -0.7, y: 0.27015 } },
    memoryPalace: { currentChamber: 0, chambers: [] },
    consciousnessField: { omega: 0, individual: 0, collective: 0, planetary: 0, cosmic: 0, akashic: 0, quantum: 0, love: 0 },
    webgpu: { supported: false, device: null, context: null },
    webgl: { canvas: null, gl: null, program: null },
    canvas: { width: 0, height: 0, ctx: null, particles: [], geometryAngle: 0, activeFreqColor: '#FF00FF' },
    audio: { context: null, oscillator: null, gainNode: null, isPlaying: false },
    recursiveCrafting: null,
    gameMode: null,
    collectiveAvatars: [],
    collectiveParticles: [],
    globalResonanceState: { active: false, pulseTime: 0, intensity: 0 },
    postOmega: { active: false, primordialField: null }
};

// For non-module fallback
if (typeof window !== 'undefined') {
    window.FREQUENCIES = FREQUENCIES;
    window.initialState = initialState;
}
