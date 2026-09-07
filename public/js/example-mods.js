/**
 * EXAMPLE MODS — 7 mods leves e bonitos para Consortho
 * Registra automaticamente no ModShepherd se disponível
 * 
 * Mods:
 * 1. rainbow-orb     — orb que dança pelo castelo pintando o ar
 * 2. stardust-rain   — chuva de estrelas que batem e somem
 * 3. aurora-veil     — cortina de luz que varre o céu
 * 4. heartbeat-echo  — som de batida que ecoa no chão
 * 5. whisper-garden  — cada clique planta uma semente que floresce com som
 * 6. cosmic-drift    — ruído sutil de estrelas que flutuam
 * 7. bela-vida-resonance — a cada 15 min, a frase da bela vida ecoa em som
 */
const ExampleMods = (function() {
  'use strict';

  const mods = {};

  // Helper para registrar no ModShepherd
  function register(id, modFn) {
    if (window.ModShepherd) {
      window.ModShepherd.registerMod(id, modFn);
    }
    mods[id] = modFn;
  }

  // ===== 1. RAINBOW ORB =====
  register('rainbow-orb', (api) => {
    const orbs = [];
    let time = 0;

    function createOrb() {
      return {
        x: Math.random() * 800 + 400,
        y: Math.random() * 600 + 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 360,
        size: 8 + Math.random() * 12,
        life: 1,
        trail: []
      };
    }

    // Inicia com 3 orbs
    for (let i = 0; i < 3; i++) orbs.push(createOrb());

    return {
      update(dt) {
        time += dt;
        
        orbs.forEach(orb => {
          // Movimento orgânico
          orb.x += Math.sin(time * 0.3 + orb.hue * 0.01) * 0.8;
          orb.y += Math.cos(time * 0.25 + orb.hue * 0.01) * 0.6;
          
          // Trails
          orb.trail.unshift({ x: orb.x, y: orb.y, hue: orb.hue, alpha: 1 });
          if (orb.trail.length > 20) orb.trail.pop();
          
          orb.hue = (orb.hue + dt * 30) % 360;
          
          // Renasce se sair da tela
          if (orb.x < 0 || orb.x > 1600 || orb.y < 0 || orb.y > 1000) {
            Object.assign(orb, createOrb());
          }
        });

        // Spawn ocasional
        if (Math.random() < 0.002 && orbs.length < 8) {
          orbs.push(createOrb());
        }
      },

      draw(ctx, w, h, STATE, dt) {
        orbs.forEach(orb => {
          // Trail
          orb.trail.forEach((pt, i) => {
            const alpha = pt.alpha * (1 - i / orb.trail.length) * 0.3;
            ctx.fillStyle = `hsla(${pt.hue}, 100%, 70%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, orb.size * (1 - i / orb.trail.length), 0, Math.PI * 2);
            ctx.fill();
          });

          // Orb principal
          const glow = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size * 2);
          glow.addColorStop(0, `hsla(${orb.hue}, 100%, 70%, 0.8)`);
          glow.addColorStop(1, `hsla(${orb.hue}, 100%, 50%, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.size * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `hsl(${orb.hue}, 100%, 65%)`;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
          ctx.fill();
        });
      },

      onClick(x, y) {
        // Cria orb no clique
        orbs.push({
          x, y,
          vx: 0, vy: 0,
          hue: Math.random() * 360,
          size: 15,
          life: 1,
          trail: []
        });
        if (api.audio) api.audio().trigger('combo');
      }
    };
  });

  // ===== 2. STARDUST RAIN =====
  register('stardust-rain', (api) => {
    const stars = [];
    const maxStars = 100;

    function createStar() {
      return {
        x: Math.random() * 1600,
        y: -20,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 1 + Math.random() * 2,
        size: 1 + Math.random() * 2,
        hue: 40 + Math.random() * 60,
        alpha: 0.5 + Math.random() * 0.5,
        twinkle: Math.random() * Math.PI * 2
      };
    }

    return {
      update(dt) {
        // Spawn
        if (stars.length < maxStars && Math.random() < 0.3) {
          stars.push(createStar());
        }

        stars.forEach((star, i) => {
          star.y += star.vy * dt * 60;
          star.x += star.vx * dt * 60;
          star.twinkle += dt * 5;
          star.alpha = 0.3 + Math.sin(star.twinkle) * 0.3;

          // Remove se saiu
          if (star.y > 1000 || star.x < -50 || star.x > 1650) {
            stars.splice(i, 1);
          }
        });
      },

      draw(ctx, w, h, STATE, dt) {
        stars.forEach(star => {
          ctx.fillStyle = `hsla(${star.hue}, 100%, 80%, ${star.alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();

          // Brilho
          if (star.alpha > 0.6) {
            ctx.fillStyle = `hsla(${star.hue}, 100%, 90%, ${star.alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    };
  });

  // ===== 3. AURORA VEIL =====
  register('aurora-veil', (api) => {
    const waves = [];
    let time = 0;

    for (let i = 0; i < 5; i++) {
      waves.push({
        y: 100 + i * 150,
        speed: 0.02 + i * 0.005,
        amplitude: 30 + i * 10,
        hue: 120 + i * 40,
        phase: i * Math.PI / 3
      });
    }

    return {
      update(dt) {
        time += dt;
        waves.forEach(w => {
          w.phase += dt * w.speed;
        });
      },

      draw(ctx, w, h, STATE, dt) {
        waves.forEach(w => {
          const gradient = ctx.createLinearGradient(0, w.y - 100, 0, w.y + 100);
          gradient.addColorStop(0, `hsla(${w.hue}, 80%, 60%, 0)`);
          gradient.addColorStop(0.5, `hsla(${w.hue}, 80%, 50%, 0.15)`);
          gradient.addColorStop(1, `hsla(${w.hue}, 80%, 60%, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(0, w.y + 100);
          
          for (let x = 0; x <= w; x += 10) {
            const y = w.y + Math.sin(x * 0.01 + w.phase) * w.amplitude;
            ctx.lineTo(x, y);
          }
          
          ctx.lineTo(w, w.y + 100);
          ctx.closePath();
          ctx.fill();
        });
      }
    };
  });

  // ===== 4. HEARTBEAT ECHO =====
  register('heartbeat-echo', (api) => {
    const rings = [];
    let lastBeat = 0;

    return {
      update(dt, STATE) {
        const hrv = STATE?.hrv?.value || 60;
        const beatInterval = 60000 / hrv; // ms por batida
        const now = Date.now();

        if (now - lastBeat > beatInterval) {
          lastBeat = now;
          rings.push({
            x: STATE?.x || 800,
            y: STATE?.y || 500,
            radius: 0,
            maxRadius: 300,
            alpha: 0.6,
            hue: hrv > 80 ? 120 : hrv > 60 ? 50 : 0
          });
          
          if (api.audio) {
            api.audio().playTone(hrv > 80 ? 220 : 180, 'sine', 0.3, 0.1);
          }
        }

        rings.forEach((ring, i) => {
          ring.radius += dt * 100;
          ring.alpha = 0.6 * (1 - ring.radius / ring.maxRadius);
          if (ring.alpha <= 0) rings.splice(i, 1);
        });
      },

      draw(ctx, w, h, STATE, dt) {
        rings.forEach(ring => {
          ctx.strokeStyle = `hsla(${ring.hue}, 100%, 60%, ${ring.alpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
          ctx.stroke();
        });
      }
    };
  });

  // ===== 5. WHISPER GARDEN =====
  register('whisper-garden', (api) => {
    const seeds = [];
    const maxSeeds = 30;

    return {
      update(dt) {
        seeds.forEach((seed, i) => {
          seed.growth = Math.min(1, seed.growth + dt * 0.1);
          seed.sway += dt * 2;
          
          if (seed.growth >= 1 && !seed.bloomed) {
            seed.bloomed = true;
            seed.bloomTime = Date.now();
            if (api.audio) {
              api.audio().playTone(440 + seed.hue * 2, 'sine', 1, 0.08);
            }
          }
          
          // Remove flores velhas
          if (seed.bloomed && Date.now() - seed.bloomTime > 30000) {
            seeds.splice(i, 1);
          }
        });
      },

      draw(ctx, w, h, STATE, dt) {
        seeds.forEach(seed => {
          const x = seed.x + Math.sin(seed.sway) * 5 * seed.growth;
          const y = seed.y;
          const h = seed.growth * 40;
          
          // Caule
          ctx.strokeStyle = `rgba(100, 200, 100, ${0.5 * seed.growth})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.quadraticCurveTo(x, y - h/2, x, y - h);
          ctx.stroke();

          // Flor
          if (seed.bloomed) {
            const bloomAlpha = Math.max(0, 1 - (Date.now() - seed.bloomTime) / 30000);
            ctx.fillStyle = `hsla(${seed.hue}, 80%, 60%, ${0.8 * bloomAlpha})`;
            for (let p = 0; p < 5; p++) {
              const angle = (p / 5) * Math.PI * 2 + seed.sway * 0.5;
              const px = x + Math.cos(angle) * 12;
              const py = y - h + Math.sin(angle) * 12;
              ctx.beginPath();
              ctx.arc(px, py, 8, 0, Math.PI * 2);
              ctx.fill();
            }
            // Centro
            ctx.fillStyle = `hsla(${seed.hue}, 100%, 80%, ${bloomAlpha})`;
            ctx.beginPath();
            ctx.arc(x, y - h, 5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Broto
            ctx.fillStyle = `rgba(150, 220, 150, ${0.7 * seed.growth})`;
            ctx.beginPath();
            ctx.arc(x, y - h, 4 * seed.growth, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      },

      onClick(x, y) {
        if (seeds.length < maxSeeds) {
          seeds.push({
            x, y,
            growth: 0,
            sway: Math.random() * Math.PI * 2,
            hue: Math.random() * 60 + 300,
            bloomed: false
          });
        }
      }
    };
  });

  // ===== 6. COSMIC DRIFT =====
  register('cosmic-drift', (api) => {
    const particles = [];
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * 1600,
        y: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: 0.5 + Math.random() * 1.5,
        hue: 200 + Math.random() * 100,
        alpha: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }

    return {
      update(dt) {
        particles.forEach(p => {
          p.x += p.vx * dt * 60;
          p.y += p.vy * dt * 60;
          p.phase += dt;
          p.alpha = 0.1 + Math.sin(p.phase) * 0.2;

          // Wrap around
          if (p.x < 0) p.x = 1600;
          if (p.x > 1600) p.x = 0;
          if (p.y < 0) p.y = 1000;
          if (p.y > 1000) p.y = 0;
        });
      },

      draw(ctx, w, h, STATE, dt) {
        particles.forEach(p => {
          ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };
  });

  // ===== 7. BELA VIDA RESONANCE =====
  register('bela-vida-resonance', (api) => {
    const phrases = [
      'só o amor',
      'protege o motivo',
      'tamo junto',
      'vamo lá',
      'fé',
      'enóis',
      'não vamo desanimar',
      'stack de 64 = ∞',
      'só coisa boa',
      'infinitamente bom',
      'assustadoramente bom',
      'a fonte flui',
      'a luz acende',
      'brilha mais e mais',
      'a bela vida espelha'
    ];

    let lastPhrase = 0;
    let currentPhrase = '';
    let phraseAlpha = 0;
    let phraseScale = 1;

    return {
      update(dt, STATE) {
        const now = Date.now();
        
        // Nova frase a cada ~15 min (900000ms) ou se stack alto
        const interval = STATE?.stack > 50 ? 60000 : 900000;
        
        if (now - lastPhrase > interval) {
          lastPhrase = now;
          currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];
          phraseAlpha = 0;
          phraseScale = 0.5;
          
          if (api.audio) {
            api.audio().trigger('phase_up');
          }
        }

        // Animação de entrada/saída
        if (currentPhrase) {
          if (phraseAlpha < 1) {
            phraseAlpha = Math.min(1, phraseAlpha + dt * 2);
            phraseScale = 0.5 + phraseAlpha * 0.5;
          } else if (now - lastPhrase > 5000) {
            phraseAlpha = Math.max(0, phraseAlpha - dt * 0.5);
            phraseScale = 1 + (1 - phraseAlpha) * 0.5;
            if (phraseAlpha <= 0) currentPhrase = '';
          }
        }
      },

      draw(ctx, w, h, STATE, dt) {
        if (!currentPhrase || phraseAlpha <= 0) return;

        ctx.save();
        ctx.translate(w / 2, h / 2 - 100);
        ctx.scale(phraseScale, phraseScale);

        // Glow
        ctx.shadowColor = `rgba(255, 215, 0, ${phraseAlpha})`;
        ctx.shadowBlur = 30;
        
        ctx.fillStyle = `rgba(255, 215, 0, ${phraseAlpha * 0.9})`;
        ctx.font = 'bold 28px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText(`♪ ${currentPhrase} ♪`, 0, 0);

        ctx.shadowBlur = 0;
        ctx.restore();
      }
    };
  });

  // API pública
  function registerExamples() {
    console.log('[ExampleMods] 🌈 7 mods registrados');
    return Object.keys(mods);
  }

  function getMod(id) {
    return mods[id];
  }

  function getAllMods() {
    return Object.keys(mods);
  }

  if (typeof window !== 'undefined') {
    window.ExampleMods = { registerExamples, getMod, getAllMods };
  }

  return { registerExamples, getMod, getAllMods };
})();