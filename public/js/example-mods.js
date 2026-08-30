/**
 * EXEMPLE MODS — 7 mods visuais e sonoros para Consortho
 * Auto-registram no ModShepherd ao carregar
 */
const ExampleMods = (function() {
  'use strict';

  function registerExamples() {
    // 1. RAINBOW ORB — orb que dança pelo castelo pintando o ar
    registerMod('rainbow-orb', (api) => {
      let hue = 0;
      let t = 0;
      let posX = 0.5;
      let posY = 0.5;

      return {
        name: 'Rainbow Orb',
        description: 'Orb que dança pelo castelo pintando o ar',

        onEnable() {
          console.log('[Rainbow Orb] 🌈 Orb ativada!');
          posX = 0.5;
          posY = 0.5;
        },

        onDisable() {
          api.audio().playChord([523, 659, 784], 1, 0.05);
        },

        update(dt) {
          if (!api.getState()) return;
          t += dt * 0.01;
          const STATE = api.getState();
          const cx = STATE.x || 800;
          const cy = STATE.y || 500;
          posX = 0.4 + Math.sin(t * 0.7) * 0.25;
          posY = 0.4 + Math.cos(t * 0.5) * 0.25;
          hue = (hue + dt * 2) % 360;

          // Reage ao stack
          if (STATE && STATE.stack && STATE.stack > 30) {
            api.audio().playTone(523, 'sine', 0.05, dt);
          }
        },

        draw(ctx, w, h, STATE, dt) {
          if (!STATE) return;
          const cx = (posX) * w;
          const cy = (posY) * h;
          const radius = 20 + Math.sin(t * 2) * 5;

          // Glow
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 3);
          glow.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.4)`);
          glow.addColorStop(0.3, `hsla(${(hue + 60) % 360}, 100%, 60%, 0.2)`);
          glow.addColorStop(1, `hsla(${(hue + 120) % 360}, 100%, 50%, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 3, 0, Math.PI * 2);
          ctx.fill();

          // Orb
          const grad = ctx.createRadialGradient(cx - radius/2, cy - radius/2, 0, cx, cy, radius);
          grad.addColorStop(0, `hsla(${hue}, 100%, 90%, 1)`);
          grad.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 100%, 60%, 0.8)`);
          grad.addColorStop(1, `hsla(${(hue + 120) % 360}, 80%, 40%, 0.4)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      };
    });

    // 2. STARDUST RAIN — chuva de estrelas
    const stardust = [];
    for (let i = 0; i < 50; i++) {
      stardust.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 3 + 1
      });
    }

    registerMod('stardust-rain', (api) => {
      let particles = stardust.slice();

      return {
        name: 'Stardust Rain',
        description: 'Chuva de estrelas que batem e somem',

        onEnable() {
          console.log('[Stardust Rain] 🌠 Chuva de estrelas!');
          if (api.audio().playTone) {
            api.audio().playTone(1000, 'sine', 0.05, 0.01);
          }
        },

        onDisable() {
          if (api.audio().playTone) {
            api.audio().playTone(200, 'sine', 0.1, 0.2);
          }
        },

        update(dt) {
          particles.forEach(p => {
            p.y += p.speed * dt * 0.5;
            p.twinkle += p.twinkleSpeed * dt;
            if (p.y > 1.2) {
              p.y = -0.1;
              p.x = Math.random();
            }
          });
        },

        draw(ctx, w, h, STATE, dt) {
          particles.forEach(p => {
            const alpha = (Math.sin(p.twinkle) + 1) / 2 * 0.8;
            const x = p.x * w;
            const y = p.y * h;
            const size = p.size * (0.8 + Math.sin(p.twinkle) * 0.3);

            ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            // Trail
            ctx.strokeStyle = `rgba(200, 220, 255, ${alpha * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + size * 3);
            ctx.stroke();
          });
        }
      };
    });

    // 3. AURORA VEIL — cortina de luz
    registerMod('aurora-veil', (api) => {
      let bands = [];
      const NUM_BANDS = 15;
      for (let i = 0; i < NUM_BANDS; i++) {
        bands.push({
          offset: i / NUM_BANDS,
          speed: Math.random() * 0.3 + 0.1,
          amplitude: Math.random() * 0.3 + 0.1,
          hue: Math.random() * 60 + 200
        });
      }

      return {
        name: 'Aurora Veil',
        description: 'Cortina de luz que varre o céu',

        onEnable() {
          console.log('[Aurora Veil] 🌌 Veil ativada!');
          if (api.audio().playChord) {
            api.audio().playChord([392, 523, 659], 2, 0.08);
          }
        },

        onDisable() {
          if (api.audio().playTone) {
            api.audio().playTone(220, 'sine', 0.3, 0.5);
          }
        },

        update(dt) {
          bands.forEach(b => {
            b.offset += b.speed * dt * 0.02;
            b.hue = (b.hue + dt * 1) % 360;
          });
        },

        draw(ctx, w, h, STATE, dt) {
          const time = Date.now() / 1000;

          bands.forEach(band => {
            const y = band.offset * h;
            const alpha_base = 0.15;

            for (let x = 0; x < w; x += 5) {
              const wave = Math.sin(x * 0.01 + time * band.speed + band.offset * 10) * band.amplitude * h * 0.2;
              const y_pos = y + wave;

              const hue = band.hue + Math.sin(x * 0.02 + time) * 20;
              const alpha = alpha_base * (1 - Math.abs(y_pos - y) / (h * 0.3)) * (0.5 + Math.sin(time + band.offset) * 0.5);

              if (alpha > 0.02) {
                ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha})`;
                ctx.fillRect(x, y_pos - 5, 5, 10);
              }
            }
          });
        }
      };
    });

    // 4. HEARTBEAT ECHO — som de batida que ecoa
    registerMod('heartbeat-echo', (api) => {
      let lastBeat = 0;
      let beatInterval = 60; // fps beats
      let beatCount = 0;

      return {
        name: 'Heartbeat Echo',
        description: 'Som de batida que ecoa no chão',

        onEnable() {
          console.log('[Heartbeat Echo] 💓 Batida ativada!');
          if (api.audio().playTone) {
            api.audio().playTone(60, 'sine', 0.3, 0.3);
          }
        },

        onDisable() {
          if (api.audio().stopOmTone) {
            api.audio().stopOmTone();
          }
        },

        update(dt) {
          if (!api.getState()) return;
          const STATE = api.getState();
          beatInterval = Math.max(20, 80 - STATE.stack * 0.5);
          beatCount = Math.floor(Date.now() / (beatInterval * 50)) % 20;

          // Quando bate, toca som
          if (beatCount % 2 === 0 && Date.now() % (beatInterval * 50) < 50) {
            if (api.audio().playTone) {
              api.audio().playTone(40 + STATE.stack * 2, 'sine', 0.2, 0.1);
            }
          }
        },

        draw(ctx, w, h, STATE, dt) {
          if (!STATE) return;
          const beat = Math.sin(Date.now() / (beatInterval * 50) * Math.PI * 2) * 0.5 + 0.5;
          const radius = 20 + beat * 80 * (STATE.stack / 100);

          // Raios de batida
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + Date.now() / 1000;
            const r = radius + beat * 40;
            ctx.strokeStyle = `rgba(255, 50, 50, ${beat * 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(w/2 + Math.cos(angle) * radius, h/2 + Math.sin(angle) * radius);
            ctx.lineTo(w/2 + Math.cos(angle) * (radius + 40 * beat), h/2 + Math.sin(angle) * (radius + 40 * beat));
            ctx.stroke();
          }

          // Centro pulsante
          const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, radius + 40);
          grad.addColorStop(0, `rgba(255, 80, 80, ${beat * 0.5})`);
          grad.addColorStop(0.5, `rgba(200, 30, 30, ${beat * 0.3})`);
          grad.addColorStop(1, 'rgba(100, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(w/2, h/2, radius + 40, 0, Math.PI * 2);
          ctx.fill();
        }
      };
    });

    // 5. WHISPER GARDEN — cada clique planta uma semente
    const plants = [];

    registerMod('whisper-garden', (api) => {
      let plantList = [];

      return {
        name: 'Whisper Garden',
        description: 'Cada clique planta uma semente que floresce',

        onEnable() {
          console.log('[Whisper Garden] 🌱 Jardim sussurrante!');
          plantList = plants.slice();
        },

        onDisable() {
          if (api.audio().playChord) {
            api.audio().playChord([440, 554, 659], 1, 0.05);
          }
        },

        update(dt) {
          plantList.forEach(p => {
            p.age += dt * 0.1;
            p.phase += dt * 0.05;
            if (p.age > 10) {
              p.bloom = Math.min(1, p.bloom + dt * 0.02);
            }
          });
        },

        draw(ctx, w, h, STATE, dt) {
          plantList.forEach(p => {
            const cx = p.x * w;
            const cy = p.y * h;
            const bloom = p.bloom;

            // Stem
            ctx.strokeStyle = `rgba(50, 200, 50, ${0.5 + bloom * 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy + 20);
            ctx.quadraticCurveTo(cx + Math.sin(p.phase) * 10, cy + 5, cx, cy - 20);
            ctx.stroke();

            // Flower
            if (bloom > 0.1) {
              const flowerSize = 8 * bloom;
              const hue = p.hue || 120;
              for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 + p.phase;
                const fx = cx + Math.cos(angle) * flowerSize;
                const fy = cy - 20 + Math.sin(angle) * flowerSize;
                ctx.fillStyle = `hsla(${hue + i * 20}, 100%, 70%, ${bloom})`;
                ctx.beginPath();
                ctx.arc(fx, fy, flowerSize * 0.5, 0, Math.PI * 2);
                ctx.fill();
              }
              // Center
              ctx.fillStyle = `hsla(40, 100%, 80%, ${bloom})`;
              ctx.beginPath();
              ctx.arc(cx, cy - 20, flowerSize * 0.4, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Seed stage
              ctx.fillStyle = `rgba(100, 80, 40, 0.5)`;
              ctx.beginPath();
              ctx.arc(cx, cy, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        },

        onClick(x, y) {
          const plant = {
            x: x / (api.getState()?.canvasWidth || 1600),
            y: y / (api.getState()?.canvasHeight || 900),
            age: 0,
            bloom: 0,
            phase: Math.random() * Math.PI * 2,
            hue: Math.random() * 120 + 80
          };
          plantList.push(plant);

          // Toca som de plantação
          if (api.audio().playTone) {
            api.audio().playTone(600 + Math.random() * 400, 'sine', 0.1, 0.1);
          }
          console.log(`[Whisper Garden] 🌱 Semente plantada em (${x}, ${y})`);
        }
      };
    });

    // 6. COSMIC DRIFT — estrelas flutuantes
    const stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        drift: {
          x: (Math.random() - 0.5) * 0.002,
          y: (Math.random() - 0.5) * 0.002
        }
      });
    }

    registerMod('cosmic-drift', (api) => {
      let starField = stars.slice();

      return {
        name: 'Cosmic Drift',
        description: 'Ruído sutil de estrelas que flutuam',

        onEnable() {
          console.log('[Cosmic Drift] ✨ Campo estelar!');
          if (api.audio().playChord) {
            api.audio().playChord([523, 784], 3, 0.03);
          }
        },

        onDisable() {
          if (api.audio().playTone) {
            api.audio().playTone(300, 'sine', 0.05, 0.2);
          }
        },

        update(dt) {
          starField.forEach(s => {
            s.x += s.drift.x * dt * 5;
            s.y += s.drift.y * dt * 5;
            s.twinkle += dt * (Math.random() > 0.99 ? Math.random() * 5 : 2);

            // Wrap around
            if (s.x < -0.05) s.x = 1.05;
            if (s.x > 1.05) s.x = -0.05;
            if (s.y < -0.05) s.y = 1.05;
            if (s.y > 1.05) s.y = -0.05;
          });
        },

        draw(ctx, w, h, STATE, dt) {
          const time = Date.now() / 1000;

          // Deep space background
          if (!STATE || STATE.backgroundColor !== 'transparent') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, w, h);
          }

          starField.forEach(s => {
            const alpha = s.alpha * (0.5 + Math.sin(s.twinkle) * 0.5);
            const x = s.x * w;
            const y = s.y * h;
            const size = s.size * (0.8 + Math.sin(s.twinkle) * 0.4);

            // Glow
            if (size > 1.5) {
              const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
              glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
              glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
              ctx.fillStyle = glow;
              ctx.beginPath();
              ctx.arc(x, y, size * 3, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      };
    });

    // 7. BELA VIDA RESONANCE — frase ecoa em som a cada 15 min
    registerMod('bela-vida-resonance', (api) => {
      let lastEcho = 0;
      let echoActive = false;
      let echoTime = 0;

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
        'matrix em estado de fluxo'
      ];

      return {
        name: 'Bela Vida Resonance',
        description: 'A cada 15 minutos, a frase da bela vida ecoa em som',

        onEnable() {
          console.log('[Bela Vida Resonance] 💬 Eco de bela vida ativado!');
          lastEcho = Date.now();
        },

        onDisable() {
          if (api.audio().playChord) {
            api.audio().playChord([440, 554, 659, 880], 2, 0.05);
          }
        },

        update(dt) {
          const now = Date.now();
          const elapsed = now - lastEcho;

          if (elapsed > 15 * 60 * 1000 && !echoActive) {
            echoActive = true;
            echoTime = now;
            const idx = Math.floor(Math.random() * phrases.length);
            const phrase = phrases[idx];

            console.log(`[Bela Vida Resonance] 💬 "${phrase}"`);

            // Tocar acorde
            if (api.audio().playChord) {
              api.audio().playChord([262, 330, 392, 523], 3, 0.15);
            }

            // Som de eco
            if (api.audio().playTone) {
              for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                  api.audio().playTone(
                    400 + Math.random() * 600,
                    'sine',
                    0.1,
                    0.05
                  );
                }, i * 100);
              }
            }

            // Reavaliar após eco
            setTimeout(() => {
              echoActive = false;
              lastEcho = now;
            }, 5000);
          }

          if (echoActive) {
            echoTime += dt;
            // Pulsar visual
            if (echoTime % 500 < 50 && api.audio().playTone) {
              api.audio().playTone(500 + Math.random() * 300, 'sine', 0.05, 0.03);
            }
          }
        },

        draw(ctx, w, h, STATE, dt) {
          if (echoActive) {
            const alpha = 0.2 + Math.sin(echoTime / 200) * 0.1;
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.font = '18px Georgia';
            ctx.textAlign = 'center';
            ctx.fillText('✦ bela vida resonance ✦', w/2, h - 60);

            // Partículas
            const count = Math.floor(Math.sin(echoTime / 100) * 5 + 5);
            for (let i = 0; i < count; i++) {
              const angle = (i / count) * Math.PI * 2 + echoTime / 500;
              const radius = 40 + Math.sin(echoTime / 200) * 20;
              const x = w/2 + Math.cos(angle) * radius;
              const y = h/2 + Math.sin(angle) * radius;
              ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      };
    });
  }

  // Auto-registrar quando o módulo é carregado
  if (typeof window !== 'undefined' && window.ModShepherd) {
    registerExamples();
    console.log('[ExampleMods] ✅ 7 mods registrados');
  } else {
    // Espera o ModShepherd carregar
    window.addEventListener('load', () => {
      if (window.ModShepherd) {
        registerExamples();
        console.log('[ExampleMods] ✅ 7 mods registrados');
      }
    });
  }

  return { registerExamples };
})();