/**
 * ATLAS CONTENT — Integração com Nucleo Atlas (porta 9879)
 * Puxa experiências WebGL do Núcleo como conteúdo de fases/mundos
 */
const AtlasContent = (function() {
  'use strict';

  const ATLAS_BASE = 'http://127.0.0.1:9879';
  const EXPERIENCES_ENDPOINT = `${ATLAS_BASE}/api/experiences`;
  const CATALOG_ENDPOINT = `${ATLAS_BASE}/api/catalog`;

  let state = {
    catalog: [],
    experiencesById: {},
    loaded: false,
    lastFetch: 0,
    mappedToPhases: {}
  };

  // Mapeamento de experiências conhecidas para fases
  const EXPERIENCE_PHASE_MAP = {
    // Fase 1 - Despertar
    'nucleo_semente_fofa': 1,
    'nucleo_indice': 1,
    'nucleo_portal': 1,
    
    // Fase 2 - Resonância
    'nucleo_manteiga': 2,
    'nucleo_sementes': 2,
    'nucleo_espaco': 2,
    
    // Fase 3 - Transcendência
    'nucleo_em_teia': 3,
    'nucleo_conexoes': 3,
    'nucleo_organismo': 3,
    'nucleo_raiz': 3,
    
    // Fase 4 - Síntese Ômega
    'nucleo_raiz': 4,
    'nucleo_volta': 4,
    'nucleo_mundo_fofa': 4,
    'nucleo_batalha_fofa': 4,
    'nucleo_sistema': 4,
    'nucleo_experiencia_v2': 4,
    'nucleo_experiencia': 4,
    
    // Fase 5+ - Infinito (todas)
    'nucleo_memoria_viva': 5,
    'nucleo_o_que_resta': 5,
    'nucleo_descubtas': 5
  };

  async function fetchCatalog() {
    try {
      const res = await fetch(CATALOG_ENDPOINT);
      if (res.ok) {
        const data = await res.json();
        state.catalog = data.experiences || data || [];
        state.loaded = true;
        state.lastFetch = Date.now();
        buildExperienceMap();
        return state.catalog;
      }
    } catch (e) {
      console.warn('[AtlasContent] Falha ao buscar catálogo:', e);
    }
    return [];
  }

  function buildExperienceMap() {
    state.experiencesById = {};
    state.mappedToPhases = {};
    
    state.catalog.forEach(exp => {
      const id = exp.id || exp.name || exp.file;
      if (id) {
        state.experiencesById[id] = exp;
        const phase = EXPERIENCE_PHASE_MAP[id] || 1;
        if (!state.mappedToPhases[phase]) {
          state.mappedToPhases[phase] = [];
        }
        state.mappedToPhases[phase].push(id);
      }
    });
  }

  function getExperiencesForPhase(phase) {
    const ids = state.mappedToPhases[phase] || [];
    return ids.map(id => state.experiencesById[id]).filter(Boolean);
  }

  function getAllExperiences() {
    return state.catalog;
  }

  function getExperienceById(id) {
    return state.experiencesById[id] || null;
  }

  function getExperienceUrl(id) {
    const exp = state.experiencesById[id];
    if (exp) {
      return `${ATLAS_BASE}/${exp.file || id}.html`;
    }
    return `${ATLAS_BASE}/${id}.html`;
  }

  function getRandomExperience(phase = null) {
    let pool = state.catalog;
    if (phase) {
      const ids = state.mappedToPhases[phase] || [];
      pool = ids.map(id => state.experiencesById[id]).filter(Boolean);
    }
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function getState() {
    return { ...state };
  }

  async function init() {
    await fetchCatalog();
    console.log('[AtlasContent] ✅ Catálogo carregado:', state.catalog.length, 'experiências');
    return state.catalog;
  }

  // Auto-init
  if (typeof window !== 'undefined') {
    window.AtlasContent = { 
      fetchCatalog, 
      getExperiencesForPhase, 
      getAllExperiences, 
      getExperienceById, 
      getExperienceUrl, 
      getRandomExperience, 
      getState, 
      init 
    };
    setTimeout(init, 1500);
  }

  return { fetchCatalog, getExperiencesForPhase, getAllExperiences, getExperienceById, getExperienceUrl, getRandomExperience, getState, init };
})();