// ===== PLANETARY GRID MODULE =====
// Planetary consciousness grid with Schumann resonance

import { addLogEntry } from './utils.js';
import { state } from './api.js';

async function initPlanetaryGrid() {
                                // Define major sacred sites (ley line intersections)
                                planetaryGrid.sacredSites = [
                                    { name: 'Giza Pyramids', lat: 29.9792, lon: 31.1342, resonance: 1.0 },
                                    { name: 'Stonehenge', lat: 51.1789, lon: -1.8262, resonance: 0.9 },
                                    { name: 'Machu Picchu', lat: -13.1631, lon: -72.5450, resonance: 0.95 },
                                    { name: 'Chichen Itza', lat: 20.6843, lon: -88.5678, resonance: 0.85 },
                                    { name: 'Angkor Wat', lat: 13.4125, lon: 103.8670, resonance: 0.9 },
                                    { name: 'Sedona', lat: 34.8697, lon: -111.7610, resonance: 0.88 },
                                    { name: 'Glastonbury', lat: 51.1472, lon: -2.7165, resonance: 0.82 },
                                    { name: 'Mount Shasta', lat: 41.4090, lon: -122.1945, resonance: 0.87 },
                                    { name: 'Uluru', lat: -25.3444, lon: 131.0369, resonance: 0.93 },
                                    { name: 'Lake Titicaca', lat: -15.8267, lon: -69.3300, resonance: 0.86 },
                                    { name: 'Easter Island', lat: -27.1127, lon: -109.3497, resonance: 0.84 },
                                    { name: 'Varanasi', lat: 25.3176, lon: 82.9739, resonance: 0.91 }
                                ];
            
                                // Generate ley lines connecting sacred sites
                                for (let i = 0; i < planetaryGrid.sacredSites.length; i++) {
                                    for (let j = i + 1; j < planetaryGrid.sacredSites.length; j++) {
                                        const site1 = planetaryGrid.sacredSites[i];
                                        const site2 = planetaryGrid.sacredSites[j];
                                        const dist = haversine(site1.lat, site1.lon, site2.lat, site2.lon);
                                        if (dist < 10000) { // Within 10000km
                                            planetaryGrid.leyLines.push({
                                                from: i, to: j,
                                                strength: (site1.resonance + site2.resonance) / 2,
                                                active: false
                                            });
                                        }
                                    }
                                }
            
                                // Start simulated real-time updates (in production, fetch from NOAA/spaceweather APIs)
                                setInterval(updatePlanetaryData, 30000); // Every 30 seconds
                                updatePlanetaryData();
                            }
        
                            function haversine(lat1, lon1, lat2, lon2) {
                                const R = 6371; // Earth radius km
                                const dLat = (lat2 - lat1) * Math.PI / 180;
                                const dLon = (lon2 - lon1) * Math.PI / 180;
                                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                                          Math.sin(dLon/2) * Math.sin(dLon/2);
                                return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                            }
        
                            function updatePlanetaryData() {
                                // Simulated Schumann resonance with natural variation
                                const baseSchumann = 7.83;
                                const variation = Math.sin(Date.now() / 1000000) * 0.1 + (Math.random() - 0.5) * 0.05;
                                planetaryGrid.schumann.current = baseSchumann + variation;
                                planetaryGrid.schumann.history.push({ time: Date.now(), value: planetaryGrid.schumann.current });
                                if (planetaryGrid.schumann.history.length > 1440) planetaryGrid.schumann.history.shift(); // 12 hours
            
                                // Higher resonances
                                for (let i = 1; i < planetaryGrid.schumann.resonances.length; i++) {
                                    planetaryGrid.schumann.resonances[i] = planetaryGrid.schumann.resonances[0] * (i + 1) + (Math.random() - 0.5) * 0.1;
                                }
            
                                // Simulated geomagnetic Kp index (0-9)
                                planetaryGrid.geomagnetic.kp = Math.max(0, Math.min(9, 2 + Math.sin(Date.now() / 5000000) * 2 + (Math.random() - 0.5) * 1));
                                planetaryGrid.geomagnetic.bz = (Math.random() - 0.5) * 20; // nT
                                planetaryGrid.geomagnetic.bt = 5 + Math.random() * 10;
                                planetaryGrid.geomagnetic.history.push({ time: Date.now(), kp: planetaryGrid.geomagnetic.kp });
                                if (planetaryGrid.geomagnetic.history.length > 1440) planetaryGrid.geomagnetic.history.shift();
            
                                // Solar wind
                                planetaryGrid.solarWind.speed = 350 + Math.sin(Date.now() / 8000000) * 100 + (Math.random() - 0.5) * 50;
                                planetaryGrid.solarWind.density = 3 + Math.random() * 10;
                                planetaryGrid.solarWind.history.push({ time: Date.now(), speed: planetaryGrid.solarWind.speed });
                                if (planetaryGrid.solarWind.history.length > 1440) planetaryGrid.solarWind.history.shift();
            
                                // Calculate planetary grid coherence
                                let coherence = 0;
                                // Schumann alignment with love frequency (528Hz -> 7.83Hz harmonic)
                                const schumannAlignment = 1 - Math.abs(planetaryGrid.schumann.current - 7.83) / 1.0;
                                coherence += Math.max(0, schumannAlignment) * 0.4;
            
                                // Geomagnetic calm (low Kp = high coherence)
                                coherence += (1 - planetaryGrid.geomagnetic.kp / 9) * 0.3;
            
                                // Solar wind gentle
                                coherence += (1 - Math.abs(planetaryGrid.solarWind.speed - 400) / 400) * 0.3;
            
                                planetaryGrid.gridCoherence = Math.max(0, Math.min(1, coherence));
                                planetaryGrid.lastUpdate = Date.now();
            
                                // Activate ley lines based on coherence
                                for (const line of planetaryGrid.leyLines) {
                                    line.active = planetaryGrid.gridCoherence > 0.6 && Math.random() < planetaryGrid.gridCoherence * 0.1;
                                }
                            }
        
                            function getPlanetaryGridVisualData() {
                                return {
                                    schumann: planetaryGrid.schumann.current,
                                    resonances: [...planetaryGrid.schumann.resonances],
                                    kp: planetaryGrid.geomagnetic.kp,
                                    bz: planetaryGrid.geomagnetic.bz,
                                    solarSpeed: planetaryGrid.solarWind.speed,
                                    gridCoherence: planetaryGrid.gridCoherence,
                                    sacredSites: planetaryGrid.sacredSites.map((s, i) => ({
                                        name: s.name,
                                        lat: s.lat,
                                        lon: s.lon,
                                        resonance: s.resonance,
                                        active: planetaryGrid.leyLines.some(l => (l.from === i || l.to === i) && l.active)
                                    })),
                                    leyLines: planetaryGrid.leyLines.filter(l => l.active).map(l => ({
                                        from: planetaryGrid.sacredSites[l.from],
                                        to: planetaryGrid.sacredSites[l.to],
                                        strength: l.strength
                                    }))
                                };
                            }
        
                            // ===== SACRED GEOMETRY METAMORPHOSIS ENGINE (Real-time Topology Transform) =====
                            let metamorphosisEngine = {
                                currentForm: 'merkaba',
                                targetForm: 'merkaba',
                                morphProgress: 0,
                                forms: {
                                    merkaba: { vertices: 8, edges: 12, faces: 8, symmetry: 'tetrahedral' },
                                    cube: { vertices: 8, edges: 12, faces: 6, symmetry: 'cubic' },
                                    octahedron: { vertices: 6, edges: 12, faces: 8, symmetry: 'octahedral' },
                                    dodecahedron: { vertices: 20, edges: 30, faces: 12, symmetry: 'icosahedral' },
                                    icosahedron: { vertices: 12, edges: 30, faces: 20, symmetry: 'icosahedral' },
                                    flowerOfLife: { vertices: 19, edges: 36, faces: 1, symmetry: 'hexagonal' },
                                    sriYantra: { vertices: 43, edges: 84, faces: 1, symmetry: 'triangular' },
                                    torus: { vertices: 256, edges: 512, faces: 256, symmetry: 'toroidal' },
                                    hypercube: { vertices: 16, edges: 32, faces: 24, symmetry: '4D' },
                                    goldenSpiral: { vertices: 64, edges: 63, faces: 1, symmetry: 'phi' }
                                },
                                morphHistory: []
                            };
        
                            

// Export
export { initPlanetaryGrid, updatePlanetaryData, getPlanetaryGridVisualData, haversine };

// For non-module fallback
if (typeof window !== 'undefined') {
    window.initPlanetaryGrid = initPlanetaryGrid;
    window.updatePlanetaryData = updatePlanetaryData;
    window.getPlanetaryGridVisualData = getPlanetaryGridVisualData;
    window.haversine = haversine;
}
