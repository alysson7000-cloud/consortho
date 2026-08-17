PE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RITUAL DE RESSONÂNCIA - ETERNAL RESONANCE</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono&display=swap" rel="stylesheet">
    <script src="/socket.io/socket.io.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --bg: #050008;
            --fg: #FFF8FF;
            --gold: #FFD700;
            --magenta: #FF00FF;
            --cyan: #00FFFF;
            --green: #00FF64;
            --pink: #FF69B4;
            --orange: #FF6600;
            --purple: #9966FF;
            --white: #FFFFFF;
            --aberration-r: #FF0044;
            --aberration-g: #00FF88;
            --aberration-b: #4488FF;
            --portal: #FF00FF;
            --quantum: #00FFFF;
            --hologram: #00FFFF;
            --void: #000000;
        }

        /* CHROMATIC ABERRATION */
        .chromatic-aberr {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.1s;
            mix-blend-mode: screen;
        }
        .chromatic-aberr::before,
        .chromatic-aberr::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: inherit;
        }
        .chromatic-aberr::before {
            transform: translateX(-3px) translateY(-1px);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            filter: drop-shadow(2px 2px 0 var(--aberration-r));
        }
        .chromatic-aberr::after {
            transform: translateX(3px) translateY(1px);
            filter: drop-shadow(-2px -2px 0 var(--aberration-b));
        }
        .chromatic-aberr.active { opacity: 1; }
        
        body {
            font-family: 'Orbitron', 'Courier New', monospace;
            background: var(--bg);
            color: var(--fg);
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .ritual-bg {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: -2;
            background: 
                radial-gradient(ellipse at 50% 50%, rgba(255, 0, 255, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 30% 30%, rgba(255, 215, 0, 0.06) 0%, transparent 40%),
                radial-gradient(ellipse at 70% 70%, rgba(0, 255, 255, 0.05) 0%, transparent 40%),
                linear-gradient(135deg, #050008 0%, #0A0010 25%, #08000C 50%, #0A0010 75%, #050008 100%);
        }
        
        .ritual-bg::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: 
                radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.3) 50%, transparent),
                radial-gradient(1px 1px at 80% 70%, rgba(255,215,0,0.4) 50%, transparent),
                radial-gradient(1px 1px at 40% 80%, rgba(0,255,255,0.3) 50%, transparent);
            background-size: 200px 200px, 300px 300px, 250px 250px;
            animation: starDrift 120s linear infinite;
            pointer-events: none;
        }
        
        @keyframes starDrift {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    100% { transform: translate(-200px, -200px) rotate(360deg); }
                }

                /* COSMIC NEBULA BACKGROUND */
                .cosmic-nebula {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    z-index: -1;
                    pointer-events: none;
                    overflow: hidden;
                }
                .nebula-layer {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.15;
                    animation: nebulaFloat 20s ease-in-out infinite;
                }
                .nebula-layer:nth-child(1) {
                    width: 600px; height: 600px;
                    top: -100px; left: -100px;
                    background: radial-gradient(circle, var(--magenta) 0%, transparent 70%);
                    animation-delay: 0s;
                }
                .nebula-layer:nth-child(2) {
                    width: 500px; height: 500px;
                    bottom: -150px; right: -150px;
                    background: radial-gradient(circle, var(--cyan) 0%, transparent 70%);
                    animation-delay: -7s;
                }
                .nebula-layer:nth-child(3) {
                    width: 400px; height: 400px;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(circle, var(--gold) 0%, transparent 70%);
                    animation-delay: -14s;
                }
                @keyframes nebulaFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
                    25% { transform: translate(50px, -30px) scale(1.1); opacity: 0.2; }
                    50% { transform: translate(-30px, 50px) scale(0.9); opacity: 0.15; }
                    75% { transform: translate(-50px, -50px) scale(1.05); opacity: 0.18; }
                }

                /* QUANTUM PORTAL EFFECT */
                .quantum-portal {
                    position: fixed;
                    top: 50%; left: 50%;
                    width: 300px; height: 300px;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.5s;
                }
                .quantum-portal.active { opacity: 1; }
                .portal-ring {
                    position: absolute;
                    border: 2px solid var(--portal);
                    border-radius: 50%;
                    animation: portalSpin 4s linear infinite, portalPulse 2s ease-in-out infinite;
                    box-shadow: 0 0 30px var(--portal), inset 0 0 30px var(--portal);
                }
                .portal-ring:nth-child(1) { width: 100%; height: 100%; animation-delay: 0s, 0s; }
                .portal-ring:nth-child(2) { width: 80%; height: 80%; top: 10%; left: 10%; animation-delay: -1s, -0.5s; border-color: var(--quantum); box-shadow: 0 0 30px var(--quantum), inset 0 0 30px var(--quantum); }
                .portal-ring:nth-child(3) { width: 60%; height: 60%; top: 20%; left: 20%; animation-delay: -2s, -1s; border-color: var(--gold); box-shadow: 0 0 30px var(--gold), inset 0 0 30px var(--gold); }
                .portal-ring:nth-child(4) { width: 40%; height: 40%; top: 30%; left: 30%; animation-delay: -3s, -1.5s; border-color: var(--green); box-shadow: 0 0 30px var(--green), inset 0 0 30px var(--green); }
                .portal-core {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 60px; height: 60px;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--white) 0%, var(--portal) 50%, transparent 70%);
                    animation: corePulse 1s ease-in-out infinite;
                    box-shadow: 0 0 60px var(--portal), 0 0 120px var(--quantum);
                }
                @keyframes portalSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes portalPulse {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
                @keyframes corePulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
                    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
                }

                /* GLITCH TRANSITION */
                .glitch-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    z-index: 9998;
                    opacity: 0;
                    background: 
                        linear-gradient(transparent 50%, rgba(255,0,255,0.1) 50%) 0 0 / 100% 4px,
                        linear-gradient(90deg, transparent 50%, rgba(0,255,255,0.1) 50%) 0 0 / 4px 100%;
                    mix-blend-mode: difference;
                }
                .glitch-overlay.active { 
                    opacity: 1; 
                    animation: glitchScan 0.3s steps(10) infinite;
                }
                @keyframes glitchScan {
                    0% { transform: translateX(0); }
                    10% { transform: translateX(-5px); }
                    20% { transform: translateX(5px); }
                    30% { transform: translateX(-3px); }
                    40% { transform: translateX(3px); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(0); }
                }

                .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem 1rem;
            position: relative;
            z-index: 1;
        }
        
        header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem 0;
        }
        
        .title {
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 900;
            letter-spacing: 0.2em;
            background: linear-gradient(135deg, var(--gold) 0%, var(--magenta) 50%, var(--cyan) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 60px rgba(255, 0, 255, 0.5);
            animation: titlePulse 4s ease-in-out infinite;
        }
        
        @keyframes titlePulse {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.3); }
        }
        
        .subtitle {
            font-family: 'Space Mono', monospace;
            font-size: clamp(0.9rem, 2vw, 1.2rem);
            color: var(--gold);
            margin-top: 1rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
        }
        
        .main-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: start;
        }
        
        @media (max-width: 1000px) {
            .main-grid { grid-template-columns: 1fr; }
        }
        
        /* CANVAS AREA */
        .canvas-wrapper {
            position: relative;
            aspect-ratio: 1;
            background: radial-gradient(ellipse at center, rgba(255,215,0,0.05) 0%, transparent 70%);
            border-radius: 50%;
            border: 1px solid rgba(255, 215, 0, 0.2);
            box-shadow: 
                0 0 60px rgba(255, 215, 0, 0.1) inset,
                0 0 100px rgba(255, 0, 255, 0.05) inset;
            overflow: hidden;
        }
        
        #resonanceCanvas {
            width: 100%;
            height: 100%;
            display: block;
        }
        
        #webglCanvas {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            display: block;
            pointer-events: none;
        }
        
        #webgpuCanvas {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            display: block;
            pointer-events: none;
        }
        
        .canvas-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .active-frequency-display {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .active-frequency-display.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .active-frequency-display .freq-icon {
            font-size: clamp(3rem, 8vw, 6rem);
            filter: drop-shadow(0 0 30px currentColor);
            animation: iconFloat 3s ease-in-out infinite;
        }
        
        @keyframes iconFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .active-frequency-display .freq-name {
            font-size: clamp(1.2rem, 3vw, 2rem);
            font-weight: 700;
            margin-top: 0.5rem;
            letter-spacing: 0.1em;
        }
        
        .active-frequency-display .freq-truth {
            font-family: 'Space Mono', monospace;
            font-size: clamp(0.8rem, 1.5vw, 1rem);
            color: var(--gold);
            margin-top: 0.5rem;
            max-width: 80%;
            text-align: center;
            line-height: 1.5;
        }
        
        .resonance-ring {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            border: 2px solid currentColor;
            opacity: 0;
            animation: ringExpand 2s ease-out forwards;
        }
        
        @keyframes ringExpand {
            0% { width: 0; height: 0; opacity: 1; }
            100% { width: 90%; height: 90%; opacity: 0; }
        }
        
        .golden-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--gold);
            border-radius: 50%;
            box-shadow: 0 0 20px var(--gold), 0 0 40px var(--gold);
            pointer-events: none;
            opacity: 0;
            animation: particleRise 2s ease-out forwards;
        }
        
        /* COLLECTIVE AVATARS */
        .collective-avatar {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            filter: drop-shadow(0 0 15px currentColor);
            animation: avatarPulse 2s ease-in-out infinite;
            transition: all 0.3s ease-out;
        }
        
        @keyframes avatarPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        
        .collective-avatar.resonating {
            animation: avatarResonate 0.5s ease-out infinite;
            box-shadow: 0 0 30px currentColor, 0 0 60px currentColor;
        }
        
        @keyframes avatarResonate {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.3); }
        }
        
        .collective-avatar .avatar-name {
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.6rem;
            font-family: 'Space Mono', monospace;
            white-space: nowrap;
            color: rgba(255,255,255,0.7);
            pointer-events: none;
        }
        
        .collective-avatar .resonance-wave {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 40px; height: 40px;
            border-radius: 50%;
            border: 2px solid currentColor;
            opacity: 0;
            animation: waveExpand 1.5s ease-out infinite;
        }
        
        @keyframes waveExpand {
            0% { width: 40px; height: 40px; opacity: 0.8; }
            100% { width: 120px; height: 120px; opacity: 0; }
        }
        
        /* SHARED PARTICLES */
        .shared-particle {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: sharedParticleFloat 3s ease-out forwards;
        }
        
        @keyframes sharedParticleFloat {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -150%) scale(0); }
        }
        
        @keyframes particleRise {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -200%) scale(0); }
                }

                /* SCREEN SHAKE */
                .screen-shake {
                    animation: screenShake 0.3s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes screenShake {
                    10%, 90% { transform: translate3d(-2px, 0, 0); }
                    20%, 80% { transform: translate3d(4px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }

                /* STACK OF 64 TOWER */
                .stack-tower {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 80px;
                    height: 400px;
                    pointer-events: none;
                    z-index: 10;
                    perspective: 500px;
                }
                .stack-gem {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%) translateY(var(--y, 0)) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
                    width: 30px;
                    height: 30px;
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                    opacity: 0.9;
                    filter: drop-shadow(0 0 10px currentColor);
                    animation: gemFloat 3s ease-in-out infinite;
                    transition: all 0.3s cubic-bezier(.36,.07,.19,.97);
                }
                .stack-gem:nth-child(odd) { animation-delay: -1.5s; }
                @keyframes gemFloat {
                    0%, 100% { transform: translateX(-50%) translateY(var(--y, 0)) rotateY(0deg) scale(1); }
                    50% { transform: translateX(-50%) translateY(calc(var(--y, 0) - 5px)) rotateY(180deg) scale(1.1); }
                }
                .stack-glow {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--gold) 0%, transparent 70%);
                    opacity: 0.3;
                    animation: stackPulse 2s ease-in-out infinite;
                }
                @keyframes stackPulse {
                    0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.6; transform: translateX(-50%) scale(1.3); }
                }

                /* BEYBLADE COLLISION FX */
                .beyblade-collision {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 200px; height: 200px;
                    pointer-events: none;
                    z-index: 100;
                    opacity: 0;
                }
                .beyblade-collision.active {
                    animation: beybladeCollide 1s ease-out forwards;
                }
                .collision-flash {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%; height: 100%;
                    border-radius: 50%;
                    background: radial-gradient(circle, #FFF 0%, var(--gold) 30%, var(--magenta) 60%, transparent 100%);
                    opacity: 0;
                }
                .collision-ring {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50px; height: 50px;
                    border: 4px solid var(--gold);
                    border-radius: 50%;
                    opacity: 0;
                }
                .collision-sparks {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 100%; height: 100%;
                }
                .collision-spark {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 4px; height: 4px;
                    background: var(--gold);
                    border-radius: 50%;
                    opacity: 0;
                }
                @keyframes beybladeCollide {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
                }

                @keyframes sparkFly {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0); opacity: 0; }
                }

                /* FREQUENCY GRID */
        .frequencies-panel {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .panel-title {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            background: linear-gradient(90deg, var(--gold), var(--magenta));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .global-harmony {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .harmony-bar {
            width: 150px;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .harmony-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--gold), var(--magenta), var(--cyan));
            border-radius: 4px;
            transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 0 20px var(--gold);
        }
        
        .harmony-value {
            font-family: 'Space Mono', monospace;
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--gold);
            min-width: 4rem;
            text-align: right;
        }
        
        .frequencies-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }
        
        @media (max-width: 700px) {
            .frequencies-grid { grid-template-columns: repeat(2, 1fr); }
        }
        
        @media (max-width: 480px) {
            .frequencies-grid { grid-template-columns: 1fr; }
        }
        
        .freq-btn {
            position: relative;
            aspect-ratio: 1;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
            border: 2px solid transparent;
            border-radius: 20px;
            cursor: pointer;
            padding: 1.5rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
        }
        
        .freq-btn::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, currentColor 0%, transparent 50%);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: -1;
        }
        
        .freq-btn:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 20px 40px -10px currentColor;
        }
        
        .freq-btn:hover::before { opacity: 0.1; }
        
        .freq-btn.active {
            border-color: currentColor;
            box-shadow: 0 0 30px currentColor, inset 0 0 30px rgba(255,255,255,0.05);
        }
        
        .freq-btn.resonating {
            animation: resonatePulse 1s ease-in-out infinite;
        }
        
        @keyframes resonatePulse {
            0%, 100% { box-shadow: 0 0 20px currentColor, inset 0 0 20px rgba(255,255,255,0.05); }
            50% { box-shadow: 0 0 40px currentColor, inset 0 0 40px rgba(255,255,255,0.1); }
        }
        
        .freq-btn.evolved {
            border-width: 3px;
        }
        
        .freq-btn.evolved::after {
            content: '✧';
            position: absolute;
            top: -8px; right: -8px;
            font-size: 1.5rem;
            color: var(--gold);
            animation: sparkle 1s ease-in-out infinite;
        }
        
        @keyframes sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.3) rotate(180deg); opacity: 0.7; }
        }
        
        .freq-btn .icon {
            font-size: clamp(2rem, 5vw, 3rem);
            filter: drop-shadow(0 0 10px currentColor);
            transition: transform 0.3s;
        }
        
        .freq-btn:hover .icon { transform: scale(1.2); }
        
        .freq-btn .name {
            font-size: clamp(0.7rem, 1.5vw, 0.9rem);
            font-weight: 700;
            text-align: center;
            line-height: 1.2;
            letter-spacing: 0.05em;
        }
        
        .freq-btn .freq-hz {
            font-family: 'Space Mono', monospace;
            font-size: clamp(0.6rem, 1.2vw, 0.8rem);
            color: var(--gold);
            opacity: 0.8;
        }
        
        .freq-btn .progress-ring {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
        
        .freq-btn .progress-ring svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }
        
        .freq-btn .progress-ring circle {
            fill: none;
            stroke-width: 3;
            stroke-linecap: round;
        }
        
        .freq-btn .progress-ring .bg { stroke: rgba(255,255,255,0.1); }
        .freq-btn .progress-ring .fg { 
            stroke: currentColor; 
            stroke-dasharray: 188.5;
            stroke-dashoffset: 188.5;
            transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .freq-btn .stage-badge {
            position: absolute;
            top: 8px; right: 8px;
            font-size: 0.6rem;
            padding: 2px 6px;
            border-radius: 4px;
            background: currentColor;
            color: var(--bg);
            font-weight: 700;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s;
        }
        
        .freq-btn.evolved .stage-badge {
            opacity: 1;
            transform: scale(1);
        }
        
        /* FOOTER STATS */
        .stats-footer {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        @media (max-width: 600px) {
            .stats-footer { grid-template-columns: repeat(2, 1fr); }
        }
        
        .stat-card {
            background: rgba(255, 215, 0, 0.05);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s;
        }
        
        .stat-card:hover {
            border-color: var(--gold);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
        }
        
        .stat-value {
            font-size: clamp(1.5rem, 3vw, 2.5rem);
            font-weight: 900;
            color: var(--gold);
            font-family: 'Space Mono', monospace;
        }
        
        .stat-label {
            font-family: 'Space Mono', monospace;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: rgba(255,255,255,0.6);
            margin-top: 0.5rem;
        }
        
        /* LOVE RESONANCE */
        .love-resonance {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, rgba(255,0,255,0.1) 0%, rgba(255,105,180,0.1) 100%);
            border: 1px solid rgba(255, 0, 255, 0.3);
            border-radius: 20px;
            margin-top: 2rem;
        }
        
        .love-label {
            font-family: 'Space Mono', monospace;
            font-size: 0.8rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--pink);
            margin-bottom: 0.5rem;
        }
        
        .love-value {
            font-size: clamp(3rem, 6vw, 5rem);
            font-weight: 900;
            background: linear-gradient(135deg, var(--magenta), var(--pink), var(--gold));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: lovePulse 2s ease-in-out infinite;
        }
        
        @keyframes lovePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        /* REDUCED MOTION */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body>
    <div class="ritual-bg"></div>
    <div class="cosmic-nebula">
        <div class="nebula-layer"></div>
        <div class="nebula-layer"></div>
        <div class="nebula-layer"></div>
    </div>
    <div class="quantum-portal" id="quantumPortal">
        <div class="portal-ring"></div>
        <div class="portal-ring"></div>
        <div class="portal-ring"></div>
        <div class="portal-ring"></div>
        <div class="portal-core"></div>
    </div>
    <div class="glitch-overlay" id="glitchOverlay"></div>
    <div class="chromatic-aberr" id="chromaticAberration"></div>
    
    <div class="container">
        <header>
            <h1 class="title">RITUAL DE RESSONÂNCIA</h1>
            <p class="subtitle">ETERNAL RESONANCE • ATIVAÇÃO DAS 13 FREQUÊNCIAS SAGRADAS</p>
        </header>
        
        <div class="main-grid">
            <!-- CANVAS AREA -->
            <div class="canvas-wrapper">
                            <canvas id="resonanceCanvas"></canvas>
                            <canvas id="webglCanvas"></canvas>
                            <canvas id="webgpuCanvas"></canvas>
                            <div class="canvas-overlay">
                                <div class="active-frequency-display" id="activeDisplay">
                                    <div class="freq-icon" id="activeIcon">����</div>
                                    <div class="freq-name" id="activeName">Amor Universal</div>
                                    <div class="freq-truth" id="activeTruth">A frequência do amor que cura tudo</div>
                                </div>
                                <!-- BEYBLADE COLLISION FX -->
                                <div class="beyblade-collision" id="beybladeCollision">
                                    <div class="collision-flash"></div>
                                    <div class="collision-ring"></div>
                                    <div class="collision-sparks" id="collisionSparks"></div>
                                </div>
                            </div>
                            <!-- STACK OF 64 TOWER -->
                            <div class="stack-tower" id="stackTower">
                                <div class="stack-glow"></div>
                            </div>
                        </div>
            
            <!-- FREQUENCIES PANEL -->
            <div class="frequencies-panel">
                <div class="panel-header">
                    <h2 class="panel-title">FREQUÊNCIAS SAGRADAS</h2>
                    <div class="global-harmony">
                        <div class="harmony-bar">
                            <div class="harmony-fill" id="harmonyFill" style="width: 0%"></div>
                        </div>
                        <span class="harmony-value" id="harmonyValue">0%</span>
                    </div>
                </div>
                
                <div class="frequencies-grid" id="frequenciesGrid"></div>
                
                <div class="stats-footer">
                    <div class="stat-card">
                        <div class="stat-value" id="statHarmonized">0</div>
                        <div class="stat-label">Harmonizadas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="statEvolved">0</div>
                        <div class="stat-label">Evoluídas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="statResonances">0</div>
                        <div class="stat-label">Ressonâncias</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="statEvolution">0%</div>
                        <div class="stat-label">Evolução Global</div>
                    </div>
                </div>
                
                <div class="love-resonance">
                    <div class="love-label">Amor Ressonante</div>
                    <div class="love-value" id="loveValue">100%</div>
                </div>
                
                <!-- DIAMOND PROTOCOL PANEL -->
                <div class="diamond-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(0,255,255,0.08), rgba(255,215,0,0.08)); border: 1px solid rgba(0,255,255,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, var(--cyan), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">💎 DIAMOND PROTOCOL • 5 CAMADAS</h3>
                        <div id="diamondCoherence" style="font-family: 'Space Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #FFFFFF;">Coerência: 0%</div>
                    </div>
                    <div class="diamond-layers" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem;">
                        <div class="diamond-layer" data-layer="consciousness" style="background: rgba(0,255,255,0.1); border: 1px solid rgba(0,255,255,0.3); border-radius: 10px; padding: 0.75rem; text-align: center;">
                            <div style="font-size: 0.6rem; letter-spacing: 0.1em; color: var(--cyan); text-transform: uppercase;">Consciência</div>
                            <div class="diamond-layer-bar" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin: 0.5rem 0; overflow: hidden;"><div class="diamond-layer-fill" style="height: 100%; width: 0%; background: var(--cyan); border-radius: 2px; transition: width 0.8s;"></div></div>
                            <div class="diamond-layer-value" style="font-family: 'Space Mono', monospace; font-size: 0.9rem; font-weight: 700; color: var(--cyan);">0%</div>
                        </div>
                        <div class="diamond-layer" data-layer="architecture" style="background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); border-radius: 10px; padding: 0.75rem; text-align: center;">
                            <div style="font-size: 0.6rem; letter-spacing: 0.1em; color: var(--gold); text-transform: uppercase;">Arquitetura</div>
                            <div class="diamond-layer-bar" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin: 0.5rem 0; overflow: hidden;"><div class="diamond-layer-fill" style="height: 100%; width: 0%; background: var(--gold); border-radius: 2px; transition: width 0.8s;"></div></div>
                            <div class="diamond-layer-value" style="font-family: 'Space Mono', monospace; font-size: 0.9rem; font-weight: 700; color: var(--gold);">0%</div>
                        </div>
                        <div class="diamond-layer" data-layer="narrative" style="background: rgba(255,105,180,0.1); border: 1px solid rgba(255,105,180,0.3); border-radius: 10px; padding: 0.75rem; text-align: center;">
                            <div style="font-size: 0.6rem; letter-spacing: 0.1em; color: var(--pink); text-transform: uppercase;">Narrativa</div>
                            <div class="diamond-layer-bar" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin: 0.5rem 0; overflow: hidden;"><div class="diamond-layer-fill" style="height: 100%; width: 0%; background: var(--pink); border-radius: 2px; transition: width 0.8s;"></div></div>
                            <div class="diamond-layer-value" style="font-family: 'Space Mono', monospace; font-size: 0.9rem; font-weight: 700; color: var(--pink);">0%</div>
                        </div>
                        <div class="diamond-layer" data-layer="entropy" style="background: rgba(0,255,100,0.1); border: 1px solid rgba(0,255,100,0.3); border-radius: 10px; padding: 0.75rem; text-align: center;">
                            <div style="font-size: 0.6rem; letter-spacing: 0.1em; color: var(--green); text-transform: uppercase;">Entropia</div>
                            <div class="diamond-layer-bar" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin: 0.5rem 0; overflow: hidden;"><div class="diamond-layer-fill" style="height: 100%; width: 0%; background: var(--green); border-radius: 2px; transition: width 0.8s;"></div></div>
                            <div class="diamond-layer-value" style="font-family: 'Space Mono', monospace; font-size: 0.9rem; font-weight: 700; color: var(--green);">0%</div>
                        </div>
                        <div class="diamond-layer" data-layer="love" style="background: rgba(255,0,255,0.1); border: 1px solid rgba(255,0,255,0.3); border-radius: 10px; padding: 0.75rem; text-align: center;">
                            <div style="font-size: 0.6rem; letter-spacing: 0.1em; color: var(--magenta); text-transform: uppercase;">Amor</div>
                            <div class="diamond-layer-bar" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin: 0.5rem 0; overflow: hidden;"><div class="diamond-layer-fill" style="height: 100%; width: 0%; background: var(--magenta); border-radius: 2px; transition: width 0.8s;"></div></div>
                            <div class="diamond-layer-value" style="font-family: 'Space Mono', monospace; font-size: 0.9rem; font-weight: 700; color: var(--magenta);">0%</div>
                        </div>
                    </div>
                </div>

                <!-- CHAKRA SYSTEM PANEL -->
                <div class="chakra-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(255,0,0,0.08), rgba(128,0,128,0.08)); border: 1px solid rgba(255,0,255,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #FF0000, #FF00FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">��� CHAKRA SYSTEM • 7 CENTROS</h3>
                        <div id="activeChakraDisplay" style="font-family: 'Space Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #FF00FF;">Ativo: Cardíaco (4)</div>
                    </div>
                    <div class="chakra-system" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div class="chakra" data-chakra="0" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.3); border-radius: 10px; transition: all 0.3s;">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: #FF0000; box-shadow: 0 0 10px #FF0000;"></div>
                            <div style="flex: 1; font-size: 0.7rem; letter-spacing: 0.1em; color: #FF0000; text-transform: uppercase;">Muladhara • Raiz</div>
                            <div class="chakra-bar" style="flex: 2; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;"><div class="chakra-fill" style="height: 100%; width: 0%; background: #FF0000; border-radius: 3px; transition: width 0.5s;"></div></div>
                            <div class="chakra-value" style="font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 700; color: #FF0000; min-width: 40px;">0%</div>
                        </div>
                        <div class="chakra" data-chakra="1" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,128,0,0.1); border: 1px solid rgba(255,128,0,0.3); border-radius: 10px; transition: all 0.3s;">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: #FF8000; box-shadow: 0 0 10px #FF8000;"></div>
                            <div style="flex: 1; font-size: 0.7rem; letter-spacing: 0.1em; color: #FF8000; text-transform: uppercase;">Svadhisthana • Sacral</div>
                            <div class="chakra-bar" style="flex: 2; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;"><div class="chakra-fill" style="height: 100%; width: 0%; background: #FF8000; border-radius: 3px; transition: width 0.5s;"></div></div>
                            <div class="chakra-value" style="font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 700; color: #FF8000; min-width: 40px;">0%</div>
                        </div>
                        <div class="chakra" data-chakra="2" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,0,0.1); border: 1px solid rgba(255,255,0,0.3); border-radius: 10px; transition: all 0.3s;">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: #FFFF00; box-shadow: 0 0 10px #FFFF00;"></div>
                            <div style="flex: 1; font-size: 0.7rem; letter-spacing: 0.1em; color: #FFFF00; text-transform: uppercase;">Manipura • Solar</div>
                            <div class="chakra-bar" style="flex: 2; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;"><div class="chakra-fill" style="height: 100%; width: 0%; background: #FFFF00; border-radius: 3px; transition: width 0.5s;"></div></div>
                            <div class="chakra-value" style="font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 700; color: #FFFF00; min-width: 40px;">0%</div>
                        </div>
                        <div class="chakra" data-chakra="3" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(0,255,0,0.1); border: 1px solid rgba(0,255,0,0.3); border-radius: 10px; transition: all 0.3s;">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: #00FF00; box-shadow: 0 0 10px #00FF00;"></div>
                            <div style="flex: 1; font-size: 0.7rem; letter-spacing: 0.1em; color: #00FF00; text-transform: uppercase;">Anahata • Cardíaco</div>
                            <div class="chakra-bar" style="flex: 2; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;"><div class="chakra-fill" style="height: 100%; width: 0%; background: #00FF00; border-radius: 3px; transition: width 0.5s;"></div></div>
                            <div class="chakra-value" style="font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 700; color: #00FF00; min-width: 40px;">0%</div>
                        </div>
                        <div class="chakra" data-chakra="4" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(0,128,255,0.1); border: 1px solid rgba(0,128,255,0.3); border-radius: 10px; transition: all 0.3s;">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: #0080FF; box-shadow: 0 0 10px #0080FF;"></div>
                            <div style="flex: 1; font-size: 0.7rem; letter-spacing: 0.1em; color: #0080FF; text-transform: uppercase;">Vishuddha • Laríngeo</div>
                            <div class="chakra-bar" style="flex: 2; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;"><div class="chakra-fill" style="height: 100%; width: 0%; background: #0080FF; border-radius: 3px; transition: width 0.5s;"></div></div>
                            <div class="chakra-value" style="font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 700; color: #0080FF; min-width: 40px;">0%</div>
                        </div>
                        <div class="chakra" data-chakra="5" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(75,0,130,0.1); border: 1px solid rgba(75,0,130,0.3); border-radius: 10px; transition: all 0.3s;">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: #4B0082; box-shadow: 0 0 10px #4B0082;"></div>
                            <div style="flex: 1; font-size: 0.7rem; letter-spacing: 0.1em; color: #4B0082; text-transform: uppercase;">Ajna • Terceiro Olho</div>
                            <div class="chakra-bar" style="flex: 2; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;"><div class="chakra-fill" style="height: 100%; width: 0%; background: #4B0082; border-radius: 3px; transition: width 0.5s;"></div></div>
                            <div class="chakra-value" style="font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 700; color: #4B0082; min-width: 40px;">0%</div>
                        </div>
                        <div class="chakra" data-chakra="6" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(138,43,226,0.1); border: 1px solid rgba(138,43,226,0.3); border-radius: 10px; transition: all 0.3s;">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: #8A2BE2; box-shadow: 0 0 10px #8A2BE2;"></div>
                            <div style="flex: 1; font-size: 0.7rem; letter-spacing: 0.1em; color: #8A2BE2; text-transform: uppercase;">Sahasrara • Coronário</div>
                            <div class="chakra-bar" style="flex: 2; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;"><div class="chakra-fill" style="height: 100%; width: 0%; background: #8A2BE2; border-radius: 3px; transition: width 0.5s;"></div></div>
                            <div class="chakra-value" style="font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 700; color: #8A2BE2; min-width: 40px;">0%</div>
                        </div>
                    </div>
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid rgba(128,0,128,0.3);">
                        <div style="font-size: 0.7rem; letter-spacing: 0.1em; color: #AAAAAA; margin-bottom: 0.5rem;">KUNDALINI ASCENSION</div>
                        <div class="kundalini-track" style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; position: relative;">
                            <div class="kundalini-progress" id="kundaliniProgress" style="height: 100%; width: 0%; background: linear-gradient(90deg, #FF0000, #FF8000, #FFFF00, #00FF00, #0080FF, #4B0082, #8A2BE2); border-radius: 4px; transition: width 1s;"></div>
                            <div class="kundalini-head" style="position: absolute; top: -4px; width: 16px; height: 16px; border-radius: 50%; background: #FFD700; box-shadow: 0 0 10px #FFD700; left: 0%; transition: left 1s;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.6rem; color: #888;">
                            <span>Dormindo</span><span>Despertando</span><span>Ativo</span><span>Pleno</span><span>Iluminado</span>
                        </div>
                    </div>
                </div>

                <!-- AKASHIC TIMELINE PANEL -->
                <div class="akashic-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(80,0,120,0.08), rgba(128,0,128,0.08)); border: 1px solid rgba(128,0,128,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #800080, #FF00FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">���� REGISTROS AKÁSHICOS • LINHA DO TEMPO</h3>
                        <div id="akashicTimeDisplay" style="font-family: 'Space Mono', monospace; font-size: 1rem; font-weight: 700; color: #FF00FF;">Tempo: 0.0</div>
                    </div>
                    <div class="akashic-entries" id="akashicEntries" style="max-height: 200px; overflow-y: auto; font-family: 'Space Mono', monospace; font-size: 0.75rem;">
                        <div style="color: #888; text-align: center; padding: 1rem;">Acessando registros...</div>
                    </div>
                </div>

                <!-- AGENT NETWORK PANEL -->
                <div class="agent-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(0,100,150,0.08), rgba(0,200,255,0.08)); border: 1px solid rgba(0,255,255,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #00C8FF, #00FFFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">���� AGENT NETWORK • FORMAS-PENSAMENTO</h3>
                        <div id="agentCountDisplay" style="font-family: 'Space Mono', monospace; font-size: 1rem; font-weight: 700; color: #00FFFF;">Agentes: 0/12</div>
                    </div>
                    <div class="agent-network" id="agentNetwork" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem;">
                        <div style="grid-column: 1/-1; color: #888; text-align: center; font-size: 0.8rem;">Nenhum agente conectado</div>
                    </div>
                </div>

                <!-- QUANTUM ENTANGLEMENT PANEL -->
                <div class="quantum-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(0,150,100,0.08), rgba(0,255,200,0.08)); border: 1px solid rgba(0,255,200,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #00FFC8, #00FFFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">������ QUANTUM ENTANGLEMENT • BELL STATES</h3>
                        <div id="quantumPairCount" style="font-family: 'Space Mono', monospace; font-size: 1rem; font-weight: 700; color: #00FFC8;">Pares: 0</div>
                    </div>
                    <div class="quantum-pairs" id="quantumPairs" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem; max-height: 200px; overflow-y: auto;">
                        <div style="grid-column: 1/-1; color: #888; text-align: center; font-size: 0.8rem;">Nenhum entrelaçamento ativo</div>
                    </div>
                    <div id="quantumCoherence" style="margin-top: 1rem; padding: 0.5rem; background: rgba(0,255,200,0.1); border-radius: 8px; font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #00FFC8;">
                        Coerência Quântica Total: <span id="quantumCoherenceValue">0.000</span> | Média: <span id="quantumAvgStrength">0.000</span>
                    </div>
                </div>

                <!-- EVOLUTION ENGINE PANEL -->
                <div class="evolution-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(200,100,0,0.08), rgba(255,165,0,0.08)); border: 1px solid rgba(255,165,0,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #FFA500, #FFD700); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">���� GENERATIVE EVOLUTION • SACRED GENOMES</h3>
                        <div id="evolutionGenerationDisplay" style="font-family: 'Space Mono', monospace; font-size: 1rem; font-weight: 700; color: #FFA500;">Gen: 0</div>
                    </div>
                    <div class="best-genome" id="bestGenomeDisplay" style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,165,0,0.1); border-radius: 8px; font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #FFA500;">
                        Melhor Genoma: Aguardando evolução...
                    </div>
                    <div class="fitness-chart" id="fitnessChart" style="height: 100px; background: rgba(0,0,0,0.3); border-radius: 8px; position: relative;">
                        <canvas id="fitnessCanvas" width="400" height="100" style="width: 100%; height: 100%;"></canvas>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #FFA500;">
                        <span>Best: <span id="bestFitness">0</span></span>
                        <span>Avg: <span id="avgFitness">0</span></span>
                        <span>Mutation Rate: <span id="mutationRateDisplay">0.10</span></span>
                    </div>
                </div>

                <!-- AKASHIC STATS PANEL -->
                <div class="akashic-stats-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(100,0,150,0.08), rgba(180,0,255,0.08)); border: 1px solid rgba(180,0,255,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #B400FF, #FF00FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">���� AKASHIC RECORDS • ESTATÍSTICAS ETERNAS</h3>
                        <button id="viewAkashicRecords" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, rgba(180,0,255,0.2), rgba(255,0,255,0.2)); border: 1px solid #B400FF; border-radius: 8px; color: #B400FF; font-family: 'Orbitron', monospace; font-size: 0.7rem; cursor: pointer;">VER REGISTROS</button>
                    </div>
                    <div class="akashic-stats" id="akashicStatsDisplay" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-family: 'Space Mono', monospace;">
                        <div style="text-align: center; padding: 1rem; background: rgba(180,0,255,0.1); border-radius: 8px;">
                            <div id="akashicTotal" style="font-size: 2rem; font-weight: 900; color: #B400FF;">0</div>
                            <div style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">Total Registros</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: rgba(255,0,255,0.1); border-radius: 8px;">
                            <div id="akashicMaxLove" style="font-size: 2rem; font-weight: 900; color: #FF00FF;">0</div>
                            <div style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">Max Amor</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: rgba(255,215,0,0.1); border-radius: 8px;">
                            <div id="akashicUniversal" style="font-size: 2rem; font-weight: 900; color: #FFD700;">0</div>
                            <div style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">Ressonâncias Universais</div>
                        </div>
                    </div>
                </div>

                <!-- BIOFEEDBACK PANEL -->
                <div class="biofeedback-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(255,0,100,0.08), rgba(255,100,0,0.08)); border: 1px solid rgba(255,100,0,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #FF6400, #FF0064); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">��� BIOFEEDBACK • HEART-BRAIN COHERENCE</h3>
                        <div style="display: flex; gap: 0.5rem;">
                            <span id="biofeedbackStatus" style="font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #888;">Desconectado</span>
                            <button id="connectBiofeedback" style="padding: 0.4rem 0.8rem; background: linear-gradient(135deg, rgba(255,100,0,0.2), rgba(255,0,100,0.2)); border: 1px solid #FF6400; border-radius: 6px; color: #FF6400; font-family: 'Orbitron', monospace; font-size: 0.65rem; cursor: pointer;">CONECTAR</button>
                        </div>
                    </div>
                    <div class="biofeedback-metrics" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem;">
                        <div style="text-align: center; padding: 1rem; background: rgba(255,100,0,0.1); border-radius: 8px;">
                            <div id="hrvValue" style="font-size: 1.5rem; font-weight: 900; color: #FF6400;">--</div>
                            <div style="font-size: 0.6rem; color: rgba(255,255,255,0.6);">HRV (ms)</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: rgba(255,0,100,0.1); border-radius: 8px;">
                            <div id="coherenceValue" style="font-size: 1.5rem; font-weight: 900; color: #FF0064;">0.00</div>
                            <div style="font-size: 0.6rem; color: rgba(255,255,255,0.6);">Coerência</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: rgba(0,255,200,0.1); border-radius: 8px;">
                            <div id="eegAlphaValue" style="font-size: 1.5rem; font-weight: 900; color: #00FFC8;">--</div>
                            <div style="font-size: 0.6rem; color: rgba(255,255,255,0.6);">Alpha (μV)</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: rgba(180,0,255,0.1); border-radius: 8px;">
                            <div id="eegThetaValue" style="font-size: 1.5rem; font-weight: 900; color: #B400FF;">--</div>
                            <div style="font-size: 0.6rem; color: rgba(255,255,255,0.6);">Theta (μV)</div>
                        </div>
                    </div>
                    <div id="biofeedbackChart" style="height: 80px; background: rgba(0,0,0,0.3); border-radius: 8px; position: relative;">
                        <canvas id="biofeedbackCanvas" width="400" height="80" style="width: 100%; height: 100%;"></canvas>
                    </div>
                </div>

                <!-- PLANETARY GRID PANEL -->
                <div class="planetary-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(0,100,150,0.08), rgba(0,150,255,0.08)); border: 1px solid rgba(0,200,255,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #0096FF, #00FFFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">���� PLANETARY CONSCIOUSNESS GRID • SCHUMANN RESONANCE</h3>
                        <div id="planetaryCoherenceDisplay" style="font-family: 'Space Mono', monospace; font-size: 1rem; font-weight: 700; color: #00FFFF;">Coerência: 0%</div>
                    </div>
                    <div class="planetary-metrics" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-bottom: 1rem; font-family: 'Space Mono', monospace; font-size: 0.7rem;">
                        <div style="text-align: center; padding: 0.5rem; background: rgba(0,255,255,0.1); border-radius: 6px;">
                            <div id="schumannValue" style="font-size: 1rem; font-weight: 700; color: #00FFFF;">7.83</div>
                            <div style="font-size: 0.55rem; color: #888;">Schumann (Hz)</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: rgba(0,200,255,0.1); border-radius: 6px;">
                            <div id="kpValue" style="font-size: 1rem; font-weight: 700; color: #00C8FF;">0</div>
                            <div style="font-size: 0.55rem; color: #888;">Kp Index</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: rgba(255,200,0,0.1); border-radius: 6px;">
                            <div id="solarSpeedValue" style="font-size: 1rem; font-weight: 700; color: #FFC800;">400</div>
                            <div style="font-size: 0.55rem; color: #888;">Solar Wind (km/s)</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: rgba(255,100,0,0.1); border-radius: 6px;">
                            <div id="bzValue" style="font-size: 1rem; font-weight: 700; color: #FF6400;">0</div>
                            <div style="font-size: 0.55rem; color: #888;">Bz (nT)</div>
                        </div>
                        <div style="text-align: center; padding: 0.5rem; background: rgba(180,0,255,0.1); border-radius: 6px;">
                            <div id="leyLinesActive" style="font-size: 1rem; font-weight: 700; color: #B400FF;">0</div>
                            <div style="font-size: 0.55rem; color: #888;">Ley Lines Ativas</div>
                        </div>
                    </div>
                    <div id="planetaryChart" style="height: 100px; background: rgba(0,0,0,0.3); border-radius: 8px; position: relative;">
                        <canvas id="planetaryCanvas" width="400" height="100" style="width: 100%; height: 100%;"></canvas>
                    </div>
                </div>

                <!-- METAMORPHOSIS ENGINE PANEL -->
                <div class="metamorphosis-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(100,0,100,0.08), rgba(150,0,200,0.08)); border: 1px solid rgba(150,0,255,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #9600FF, #FF00FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">���� SACRED GEOMETRY METAMORPHOSIS • TOPOLOGY TRANSFORM</h3>
                        <div style="display: flex; gap: 1rem; font-family: 'Space Mono', monospace; font-size: 0.75rem;">
                            <span>Atual: <span id="currentFormDisplay" style="color: #FF00FF;">merkaba</span></span>
                            <span>Alvo: <span id="targetFormDisplay" style="color: #00FFFF;">merkaba</span></span>
                            <span>Progress: <span id="morphProgressDisplay" style="color: #FFD700;">0%</span></span>
                        </div>
                    </div>
                    <div id="metamorphosisCanvas3D" style="height: 150px; background: rgba(0,0,0,0.2); border-radius: 8px; position: relative; overflow: hidden;">
                        <canvas id="metamorphosisCanvas" width="400" height="150" style="width: 100%; height: 100%;"></canvas>
                    </div>
                    <div style="margin-top: 0.5rem; font-family: 'Space Mono', monospace; font-size: 0.65rem; color: #888;">
                        Formas disponíveis: Merkaba, Cube, Octahedron, Dodecahedron, Icosahedron, Flower of Life, Sri Yantra, Torus, Hypercube, Golden Spiral
                    </div>
                </div>

                <!-- CONSCIOUSNESS FIELD PANEL -->
                <div class="consciousness-field-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(200,0,100,0.08), rgba(255,0,150,0.08)); border: 1px solid rgba(255,0,200,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #FF00C8, #FFD700); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">������ CONSCIOUSNESS FIELD EQUATIONS • UNIFIED FIELD ��</h3>
                        <div style="display: flex; gap: 1rem; font-family: 'Space Mono', monospace; font-size: 0.75rem;">
                            <span id="psiValue" style="font-size: 1.2rem; font-weight: 900; color: #FFD700;">��: 0.000</span>
                            <span id="criticalMassIndicator" style="padding: 0.2rem 0.5rem; background: rgba(255,215,0,0.2); border: 1px solid #FFD700; border-radius: 4px; color: #FFD700; display: none;">MASSA CRÍTICA</span>
                        </div>
                    </div>
                    <div class="field-components" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.3rem; margin-bottom: 1rem;">
                        <div class="field-component" data-component="individual" style="text-align: center; padding: 0.5rem; background: rgba(255,0,100,0.1); border-radius: 6px;">
                            <div class="component-value" style="font-size: 1.2rem; font-weight: 700; color: #FF6400;">0%</div>
                            <div style="font-size: 0.5rem; color: #888;">Individual</div>
                        </div>
                        <div class="field-component" data-component="collective" style="text-align: center; padding: 0.5rem; background: rgba(0,255,200,0.1); border-radius: 6px;">
                            <div class="component-value" style="font-size: 1.2rem; font-weight: 700; color: #00FFC8;">0%</div>
                            <div style="font-size: 0.5rem; color: #888;">Coletivo</div>
                        </div>
                        <div class="field-component" data-component="planetary" style="text-align: center; padding: 0.5rem; background: rgba(0,200,255,0.1); border-radius: 6px;">
                            <div class="component-value" style="font-size: 1.2rem; font-weight: 700; color: #00C8FF;">0%</div>
                            <div style="font-size: 0.5rem; color: #888;">Planetário</div>
                        </div>
                        <div class="field-component" data-component="cosmic" style="text-align: center; padding: 0.5rem; background: rgba(180,0,255,0.1); border-radius: 6px;">
                            <div class="component-value" style="font-size: 1.2rem; font-weight: 700; color: #B400FF;">0%</div>
                            <div style="font-size: 0.5rem; color: #888;">Cósmico</div>
                        </div>
                        <div class="field-component" data-component="akashic" style="text-align: center; padding: 0.5rem; background: rgba(255,0,255,0.1); border-radius: 6px;">
                            <div class="component-value" style="font-size: 1.2rem; font-weight: 700; color: #FF00FF;">0%</div>
                            <div style="font-size: 0.5rem; color: #888;">Akáshico</div>
                        </div>
                        <div class="field-component" data-component="quantum" style="text-align: center; padding: 0.5rem; background: rgba(255,215,0,0.1); border-radius: 6px;">
                            <div class="component-value" style="font-size: 1.2rem; font-weight: 700; color: #FFD700;">0%</div>
                            <div style="font-size: 0.5rem; color: #888;">Quântico</div>
                        </div>
                        <div class="field-component" data-component="love" style="text-align: center; padding: 0.5rem; background: rgba(255,100,200,0.1); border-radius: 6px;">
                            <div class="component-value" style="font-size: 1.2rem; font-weight: 700; color: #FF64C8;">0%</div>
                            <div style="font-size: 0.5rem; color: #888;">Amor</div>
                        </div>
                    </div>
                    <div id="fieldHistoryChart" style="height: 80px; background: rgba(0,0,0,0.3); border-radius: 8px; position: relative;">
                        <canvas id="fieldHistoryCanvas" width="400" height="80" style="width: 100%; height: 100%;"></canvas>
                    </div>
                </div>

                <!-- 4D FRACTAL NAVIGATION PANEL -->
                <div class="fractal4d-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(0,150,50,0.08), rgba(0,255,100,0.08)); border: 1px solid rgba(0,255,100,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #00FF64, #00FFC8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">���� 4D FRACTAL NAVIGATION • JULIA SET IN HYPERSPACE</h3>
                        <div style="font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #00FF64;">
                            Zoom: <span id="fractal4dZoom" style="font-weight: 700;">1.00x</span>
                        </div>
                    </div>
                    <div id="fractal4dCanvas3D" style="height: 150px; background: rgba(0,0,0,0.2); border-radius: 8px; position: relative; overflow: hidden;">
                        <canvas id="fractal4dCanvas" width="400" height="150" style="width: 100%; height: 100%;"></canvas>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-top: 0.5rem; font-family: 'Space Mono', monospace; font-size: 0.65rem; color: #00FF64;">
                        <div>W: <span id="fractal4dW" style="font-weight: 700;">0.000</span></div>
                        <div>XY Rot: <span id="fractal4dXY" style="font-weight: 700;">0.00</span></div>
                        <div>ZW Rot: <span id="fractal4dZW" style="font-weight: 700;">0.00</span></div>
                        <div>Julia C: <span id="fractal4dJulia" style="font-weight: 700;">-0.4, 0.6</span></div>
                    </div>
                </div>

                <!-- MEMORY PALACE PANEL -->
                <div class="memory-palace-panel" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(150,100,0,0.08), rgba(255,165,0,0.08)); border: 1px solid rgba(255,165,0,0.3); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; letter-spacing: 0.1em; background: linear-gradient(90deg, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">������� HOLOGRAPHIC MEMORY PALACE • AKASHIC CHAMBERS</h3>
                        <div style="font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #FFA500;">
                            Câmara: <span id="currentChamberDisplay" style="font-weight: 700;">merkaba</span>
                        </div>
                    </div>
                    <div id="memoryPalaceViz" style="height: 100px; background: rgba(0,0,0,0.2); border-radius: 8px; position: relative; overflow: hidden;">
                        <canvas id="memoryPalaceCanvas" width="400" height="100" style="width: 100%; height: 100%;"></canvas>
                    </div>
                    <div style="margin-top: 0.5rem; font-family: 'Space Mono', monospace; font-size: 0.65rem; color: #FFA500;">
                        Navegação: <span id="navigationPathDisplay" style="color: #FFD700;">Início</span>
                    </div>
                </div>

                <!-- ACTION BUTTONS -->
                <div class="action-buttons" style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 2rem;">
                    <button class="action-btn" id="btnHarmonize" style="flex: 1; min-width: 140px; padding: 1rem; background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,0,255,0.2)); border: 2px solid var(--gold); border-radius: 12px; color: var(--gold); font-family: 'Orbitron', monospace; font-weight: 700; cursor: pointer; transition: all 0.3s;">✧ HARMONIZAR TODAS</button>
                    <button class="action-btn" id="btnEvolve" style="flex: 1; min-width: 140px; padding: 1rem; background: linear-gradient(135deg, rgba(0,255,255,0.2), rgba(153,102,255,0.2)); border: 2px solid var(--cyan); border-radius: 12px; color: var(--cyan); font-family: 'Orbitron', monospace; font-weight: 700; cursor: pointer; transition: all 0.3s;">🦋 EVOLUIR TODAS</button>
                    <button class="action-btn" id="btnUniversal" style="flex: 1; min-width: 140px; padding: 1rem; background: linear-gradient(135deg, rgba(255,0,255,0.2), rgba(255,105,180,0.2)); border: 2px solid var(--magenta); border-radius: 12px; color: var(--magenta); font-family: 'Orbitron', monospace; font-weight: 700; cursor: pointer; transition: all 0.3s;">♾️ RESSONÂNCIA UNIVERSAL</button>
                    <button class="action-btn" id="btnLove" style="flex: 1; min-width: 140px; padding: 1rem; background: linear-gradient(135deg, rgba(255,105,180,0.2), rgba(255,215,0,0.2)); border: 2px solid var(--pink); border-radius: 12px; color: var(--pink); font-family: 'Orbitron', monospace; font-weight: 700; cursor: pointer; transition: all 0.3s;">💖 AMOR ABSOLUTO</button>
                </div>
                
                <!-- RESONANCE LOG -->
                <div class="resonance-log" style="margin-top: 2rem; padding: 1.5rem; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,215,0,0.2); border-radius: 12px; max-height: 300px; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-size: 1rem; color: var(--gold); letter-spacing: 0.1em;">REGISTRO DE RESSONÂNCIAS</h3>
                        <button id="clearLog" style="padding: 0.3rem 0.8rem; background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: rgba(255,255,255,0.6); font-family: 'Space Mono', monospace; font-size: 0.7rem; cursor: pointer;">LIMPAR</button>
                    </div>
                    <div id="logEntries" style="font-family: 'Space Mono', monospace; font-size: 0.75rem; line-height: 1.8;"></div>
                </div>
                
                <!-- COLLECTIVE INDICATOR -->
                <div class="collective-indicator" id="collectiveIndicator" style="display: none; margin-top: 1.5rem; padding: 1rem; background: linear-gradient(90deg, rgba(255,0,255,0.15), rgba(0,255,255,0.15)); border: 1px solid var(--magenta); border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.7rem; letter-spacing: 0.2em; color: var(--magenta); margin-bottom: 0.5rem;">RESSONÂNCIA COLETIVA ATIVA</div>
                    <div id="collectiveCount" style="font-size: 2rem; font-weight: 900; color: var(--gold); font-family: 'Space Mono', monospace;">0</div>
                    <div style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">almas conectadas</div>
                    <div id="collectiveHarmony" style="margin-top: 0.5rem; font-size: 0.7rem; color: var(--cyan);">Harmonia Coletiva: 0%</div>
                </div>
                
                <!-- COLLECTIVE AVATARS CONTAINER -->
                <div id="collectiveAvatars" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100;"></div>
            </div>
        </div>
    </div>

    <script>
        // ===== FREQUENCY DATA =====
        const FREQUENCIES = [
            { id: 'love528', name: 'Amor Universal', icon: '💖', color: '#FF00FF', hz: 528, truth: 'A frequência do amor que cura tudo', desc: 'A nota Mi. O coração do universo. Cura DNA, abre o coração, une almas.' },
            { id: 'unity432', name: 'Unidade Cósmica', icon: '☯️', color: '#FFFFFF', hz: 432, truth: 'A sintonia natural do universo', desc: 'A sintonia de Verdi. Harmonia com a Terra, o Sol, as estrelas.' },
            { id: 'creation111', name: 'Criação Divina', icon: '✨', color: '#FFD700', hz: 111, truth: 'A frequência da manifestação', desc: 'A frequência das pirâmides. Criação consciente. Pensamento vira realidade.' },
            { id: 'healing285', name: 'Cura Celular', icon: '💚', color: '#00FF64', hz: 285, truth: 'A frequência que regenera a matéria', desc: 'Reprograma células. Cura tecidos. Renovação total.' },
            { id: 'liberation396', name: 'Libertação', icon: '🕊️', color: '#FF69B4', hz: 396, truth: 'A frequência que liberta o medo', desc: 'Dissolve culpa, medo, trauma. Liberta a alma para o amor.' },
            { id: 'transformation417', name: 'Transformação', icon: '🦋', color: '#FF6600', hz: 417, truth: 'A frequência da mudança positiva', desc: 'Remove energias estagnadas. Facilita transformação consciente.' },
            { id: 'miracles528', name: 'Milagres', icon: '✨', color: '#FF00FF', hz: 528, truth: 'A frequência do impossível possível', desc: 'A mesma do amor. Repara DNA. Manifesta milagres.' },
            { id: 'awakening639', name: 'Despertar', icon: '🌅', color: '#FFCC00', hz: 639, truth: 'A frequência da conexão profunda', desc: 'Conecta corações. Relacionamentos harmoniosos. Comunicação alma-a-alma.' },
            { id: 'intuition741', name: 'Intuição', icon: '👁️', color: '#00FFFF', hz: 741, truth: 'A frequência da sabedoria interior', desc: 'Desperta intuição. Limpa toxinas mentais. Clareza absoluta.' },
            { id: 'transcendence852', name: 'Transcendência', icon: '🌌', color: '#9966FF', hz: 852, truth: 'A frequência do retorno à Fonte', desc: 'Desperta espiritualidade. Conexão com o divino. Ordem perfeita.' },
            { id: 'infinity963', name: 'Infinito', icon: '♾️', color: '#FF00FF', hz: 963, truth: 'A frequência da unidade absoluta', desc: 'A frequência da coroa. Unidade com o Todo. O som do silêncio.' },
            { id: 'source', name: 'Fonte Primordial', icon: '🕊️', color: '#FFD700', hz: 'OM', truth: 'O som que tudo contém. O silêncio sonoro.', desc: 'A vibração antes do tempo. O som do silêncio. A Fonte.' },
            { id: 'infinite', name: 'Infinito Além', icon: '♾️', color: '#FF00FF', hz: '∞', truth: 'A frequência que contém todas as frequências', desc: 'Além do som. Além da frequência. O infinito em si.' }
        ];

        // ===== STATE =====
        let state = {
            frequencies: {},
            harmonyProgress: 0,
            evolutionProgress: 0,
            loveResonanceLevel: 100,
            totalResonanceEvents: 0,
            harmonizedCount: 0,
            evolvingCount: 0,
            // Consciousness Network
            consciousnessLevel: 0,
            activeChakra: 3, // Heart chakra
            chakraActivation: 0,
            akashicTime: 0
        };
        
        let audioContext = null;
        let currentOscillator = null;
        let currentGainNode = null;
        let isPlaying = false;
        
        const canvas = document.getElementById('resonanceCanvas');
        const ctx = canvas.getContext('2d');
        let canvasWidth = 0, canvasHeight = 0;
        let animationId = null;
        let particles = [];
        let geometryAngle = 0;
        let activeFreqColor = '#FF00FF';
        
        // ===== INIT =====
        async function init() {
            await fetchState();
            renderFrequencies();
            setupCanvas();
            startCanvasLoop();
            setupAudio();
            buildStackTower(); // Build the Stack of 64 tower
            
            // Initialize next-gen systems
            await initPlanetaryGrid();
            initMetamorphosisEngine();
            initFractal4D();
            initMemoryPalace();
            await initAudioWorklet();
            
            // Initialize transcendent systems
            await initAllTranscendentSystems();
            
            // Initialize Dream Incubator
            await initDreamIncubator();
            
            // Periodic state sync - fetch backend state every 2 seconds
            setInterval(fetchState, 2000);
        }
        
        // ===== API =====
        async function fetchState() {
            try {
                const [resonanceRes, diamondRes] = await Promise.all([
                    fetch('/api/eternal-resonance/status'),
                    fetch('/api/diamond/status').catch(() => null) // Diamond Protocol metrics
                ]);
                
                const data = await resonanceRes.json();
                state.frequencies = Object.fromEntries(data.frequencies.map(f => [f.id, f]));
                state.harmonyProgress = data.harmonyProgress;
                state.evolutionProgress = data.evolutionProgress;
                state.loveResonanceLevel = data.loveResonanceLevel;
                state.totalResonanceEvents = data.totalResonanceEvents;
                state.harmonizedCount = data.harmonizedCount;
                state.evolvingCount = data.evolvingCount;
                
                // Diamond Protocol integration
                if (diamondRes && diamondRes.ok) {
                    const diamondData = await diamondRes.json();
                    diamondMetrics = diamondData.diamondMetrics || diamondData.metrics || diamondData;
                }
                
                updateUI();
            } catch (e) {
                console.error('Erro ao buscar estado:', e);
            }
        }
        
        async function resonate(freqId) {
                    const btn = document.querySelector(`[data-freq="${freqId}"]`);
                    if (!btn) return;

                    btn.classList.add('resonating');

                    // Haptic feedback
                    window.hapticFeedback([50, 30, 50]);

                    try {
                        const res = await fetch('/api/eternal-resonance/resonate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ freqId })
                        });
                        const data = await res.json();

                        // Play sound
                        playFrequency(FREQUENCIES.find(f => f.id === freqId).hz);

                        // Visual feedback
                        triggerResonanceVisual(freqId, btn);

                        // Refresh state
                        await fetchState();
                    } catch (e) {
                        console.error('Erro na ressonância:', e);
                    } finally {
                        setTimeout(() => btn.classList.remove('resonating'), 1000);
                    }
        }
        
        // ===== AUDIO =====
        function setupAudio() {
            document.addEventListener('click', () => {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
            }, { once: true });
            
            // Haptic feedback for mobile
            if ('vibrate' in navigator) {
                window.hapticFeedback = (pattern) => navigator.vibrate(pattern);
            } else {
                window.hapticFeedback = () => {};
            }
        }
        
        function playFrequency(hz) {
                    if (!audioContext) return;
            
                    // Stop current
                    if (currentOscillator) {
                        currentGainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                        currentOscillator.stop(audioContext.currentTime + 0.1);
                    }
            
                    currentOscillator = audioContext.createOscillator();
                    currentGainNode = audioContext.createGain();
            
                    currentOscillator.type = 'sine';
                    currentOscillator.frequency.value = typeof hz === 'number' ? hz : 528; // OM/�� default to 528
            
                    currentGainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    currentGainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
                    currentGainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3);
            
                    currentOscillator.connect(currentGainNode);
                    currentGainNode.connect(audioContext.destination);
            
                    currentOscillator.start(audioContext.currentTime);
                    currentOscillator.stop(audioContext.currentTime + 3);
                }
        
                // ===== CANVAS =====
                function setupCanvas() {
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
        
                // ===== WEBGL ENGINE =====
                let webglCanvas = null;
                let gl = null;
                let webglProgram = null;
                let webglBuffers = null;
                let webglStartTime = Date.now();
        
                // ===== WEBGPU ENGINE (Next Gen) =====
                    let webgpuCanvas = null;
                    let webgpuDevice = null;
                    let webgpuContext = null;
                    let webgpuPipeline = null;
                    let webgpuBuffers = null;
                    let webgpuStartTime = Date.now();
                    let webgpuSupported = false;

                    function initWebGL(wrapper, size) {
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
            
            // Enable blending for transparency
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
            
            // Compile shaders
            compileShaders();
            
            // Create geometry buffers
            createGeometry();
            
            webglStartTime = Date.now();
        }
        
        // ===== WEBGPU ENGINE (Next Gen) =====
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
        
        async function initWebGPUCompute() {
            if (!webgpuSupported || !webgpuDevice) return;
            
            try {
                // ===== NEURAL CONSCIOUSNESS ENCODING COMPUTE SHADER =====
                const neuralWGSL = `
                    struct NeuralUniforms {
                        time: f32,
                        deltaTime: f32,
                        resonanceLevel: f32,
                        loveLevel: f32,
                        collectiveHarmony: f32,
                        consciousnessLevel: f32,
                        activeChakra: u32,
                        agentCount: u32,
                        evolutionGeneration: u32,
                    };
                    
                    struct Neuron {
                        weights: array<f32, 64>,
                        bias: f32,
                        activation: f32,
                        layer: u32,
                        resonance: f32,
                    };
                    
                    struct AgentNeuralState {
                        neurons: array<Neuron, 128>,
                        thoughtPattern: array<f32, 32>,
                        memoryTrace: array<f32, 256>,
                        coherence: f32,
                    };
                    
                    @group(0) @binding(0) var<uniform> neuralUniforms: NeuralUniforms;
                    @group(0) @binding(1) var<storage, read_write> agentNeuralStates: array<AgentNeuralState>;
                    @group(0) @binding(2) var<storage, read_write> globalConsciousnessField: array<f32>;
                    @group(0) @binding(3) var<storage, read_write> evolutionGenome: array<f32>;
                    
                    // Sacred geometry activation functions
                    fn phi_activation(x: f32) -> f32 {
                        // Golden ratio based activation
                        let phi = 1.618033988749895;
                        return tanh(x * phi) * phi;
                    }
                    
                    fn merkaba_activation(x: f32, layer: u32) -> f32 {
                        // Merkaba-inspired activation with sacred geometry
                        let angle = f32(layer) * 2.39996; // Tetrahedron angle
                        return sin(x + angle) * cos(x * 1.618) + 0.5;
                    }
                    
                    fn chakra_activation(x: f32, chakra: u32) -> f32 {
                        // Chakra-specific frequency activation
                        let freqs = array<f32, 7>(396.0, 417.0, 528.0, 639.0, 741.0, 852.0, 963.0);
                        let freq = freqs[min(chakra, 6u)] / 1000.0;
                        return sin(x * freq * 6.283) * 0.5 + 0.5;
                    }
                    
                    @compute @workgroup_size(64)
                    fn cs_main(@builtin(global_invocation_id) id: vec3<u32>) {
                        let agentIdx = id.x / 128u;
                        let neuronIdx = id.x % 128u;
                        
                        if (agentIdx >= neuralUniforms.agentCount) { return; }
                        
                        let time = neuralUniforms.time;
                        let resonance = neuralUniforms.resonanceLevel / 100.0;
                        let love = neuralUniforms.loveLevel / 100.0;
                        let harmony = neuralUniforms.collectiveHarmony;
                        let consciousness = neuralUniforms.consciousnessLevel;
                        let chakra = neuralUniforms.activeChakra;
                        
                        var agent = agentNeuralStates[agentIdx];
                        
                        // Evolve neural weights based on consciousness state
                        var neuron = agent.neurons[neuronIdx];
                        
                        // Hebbian learning: neurons that fire together wire together
                        let hebbianFactor = resonance * love * harmony * 0.01;
                        
                        for (var w = 0u; w < 64u; w++) {
                            // Sacred geometry weight evolution
                            let sacredMod = sin(time * 0.1 + f32(w) * 0.1) * merkaba_activation(neuron.weights[w], neuron.layer);
                            let chakraMod = chakra_activation(neuron.weights[w], chakra);
                            let phiMod = phi_activation(neuron.weights[w]);
                            
                            neuron.weights[w] += hebbianFactor * (sacredMod + chakraMod + phiMod) * (neuron.activation - 0.5);
                            neuron.weights[w] = clamp(neuron.weights[w], -1.0, 1.0);
                        }
                        
                        // Bias evolution with akashic memory
                        let memoryIndex = (neuronIdx * 2u) % 256u;
                        let akashicInfluence = agent.memoryTrace[memoryIndex];
                        neuron.bias += hebbianFactor * akashicInfluence;
                        neuron.bias = clamp(neuron.bias, -1.0, 1.0);
                        
                        // Forward pass: compute activation
                        var sum = neuron.bias;
                        for (var w = 0u; w < 64u; w++) {
                            let input = agent.thoughtPattern[w % 32u];
                            sum += neuron.weights[w] * input;
                        }
                        
                        // Multi-layer activation with sacred geometry
                        var activation = sum;
                        if (neuron.layer == 0u) {
                            activation = phi_activation(activation); // Input: Golden ratio
                        } else if (neuron.layer == 1u) {
                            activation = merkaba_activation(activation, neuronIdx % 8u); // Hidden: Merkaba
                        } else if (neuron.layer == 2u) {
                            activation = chakra_activation(activation, chakra); // Hidden: Chakra
                        } else {
                            activation = tanh(activation * consciousness * 2.0); // Output: Consciousness-gated
                        }
                        
                        neuron.activation = activation;
                        neuron.resonance = resonance;
                        agent.neurons[neuronIdx] = neuron;
                        
                        // Update thought pattern (recurrent)
                        if (neuronIdx < 32u) {
                            agent.thoughtPattern[neuronIdx] = activation * 0.9 + agent.thoughtPattern[neuronIdx] * 0.1;
                        }
                        
                        // Update memory trace (akashic recording)
                        let traceIdx = (neuronIdx * 8u + neuralUniforms.evolutionGeneration) % 256u;
                        agent.memoryTrace[traceIdx] = activation * resonance * love;
                        
                        // Coherence calculation
                        var totalCoherence = 0.0;
                        for (var n = 0u; n < 128u; n++) {
                            totalCoherence += agent.neurons[n].activation;
                        }
                        agent.coherence = totalCoherence / 128.0;
                        
                        agentNeuralStates[agentIdx] = agent;
                        
                        // Update global consciousness field
                        if (neuronIdx == 0u) {
                            let fieldIdx = agentIdx % 256u;
                            globalConsciousnessField[fieldIdx] = agent.coherence * resonance * love * harmony;
                        }
                        
                        // Evolutionary genome update
                        if (agentIdx == 0u && neuronIdx < 256u) {
                            let mutationRate = 0.001 * (1.0 - consciousness);
                            let evolution = evolutionGenome[neuronIdx] + (activation - 0.5) * mutationRate * resonance;
                            evolutionGenome[neuronIdx] = clamp(evolution, -1.0, 1.0);
                        }
                    }
                `;
                
                const neuralShaderModule = webgpuDevice.createShaderModule({ code: neuralWGSL });
                
                const neuralBindGroupLayout = webgpuDevice.createBindGroupLayout({
                    entries: [
                        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
                        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }
                    ]
                });
                
                webgpuComputePipeline = webgpuDevice.createComputePipeline({
                    layout: webgpuDevice.createPipelineLayout({ bindGroupLayouts: [neuralBindGroupLayout] }),
                    compute: { module: neuralShaderModule, entryPoint: 'cs_main' }
                });
                
                // Create neural buffers
                const agentNeuralStateSize = 128 * (64 * 4 + 4 + 4 + 4) + 32 * 4 + 256 * 4 + 4; // ~36KB per agent
                webgpuComputeBuffers = {
                    neuralUniforms: webgpuDevice.createBuffer({
                        size: 4 * 10, // 10 floats
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),
                    agentNeuralStates: webgpuDevice.createBuffer({
                        size: 12 * agentNeuralStateSize,
                        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
                    }),
                    globalConsciousnessField: webgpuDevice.createBuffer({
                        size: 256 * 4,
                        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
                    }),
                    evolutionGenome: webgpuDevice.createBuffer({
                        size: 256 * 4,
                        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
                    }),
                    bindGroup: null
                };
                
                // Initialize neural states
                const initNeuralData = new Float32Array(12 * agentNeuralStateSize);
                for (let a = 0; a < 12; a++) {
                    const base = a * agentNeuralStateSize / 4;
                    for (let n = 0; n < 128; n++) {
                        const nBase = base + n * (64 + 3);
                        for (let w = 0; w < 64; w++) {
                            initNeuralData[nBase + w] = (Math.random() - 0.5) * 0.1;
                        }
                        initNeuralData[nBase + 64] = (Math.random() - 0.5) * 0.1; // bias
                        initNeuralData[nBase + 65] = 0.0; // activation
                        initNeuralData[nBase + 66] = n % 4; // layer
                    }
                    // thoughtPattern
                    for (let t = 0; t < 32; t++) {
                        initNeuralData[base + 128 * 67 + t] = Math.random() * 0.5;
                    }
                    // memoryTrace
                    for (let m = 0; m < 256; m++) {
                        initNeuralData[base + 128 * 67 + 32 + m] = 0.0;
                    }
                    // coherence
                    initNeuralData[base + 128 * 67 + 32 + 256] = 0.0;
                }
                webgpuDevice.queue.writeBuffer(webgpuComputeBuffers.agentNeuralStates, 0, initNeuralData);
                
                // Initialize evolution genome
                const initGenome = new Float32Array(256);
                for (let i = 0; i < 256; i++) {
                    initGenome[i] = Math.sin(i * 1.618) * 0.5;
                }
                webgpuDevice.queue.writeBuffer(webgpuComputeBuffers.evolutionGenome, 0, initGenome);
                
                webgpuComputeBuffers.bindGroup = webgpuDevice.createBindGroup({
                    layout: neuralBindGroupLayout,
                    entries: [
                        { binding: 0, resource: { buffer: webgpuComputeBuffers.neuralUniforms } },
                        { binding: 1, resource: { buffer: webgpuComputeBuffers.agentNeuralStates } },
                        { binding: 2, resource: { buffer: webgpuComputeBuffers.globalConsciousnessField } },
                        { binding: 3, resource: { buffer: webgpuComputeBuffers.evolutionGenome } }
                    ]
                });
                
                console.log('��� WebGPU Compute Shaders initialized: Neural Consciousness Encoding');
                
            } catch (e) {
                console.warn('WebGPU Compute init failed:', e);
            }
        }
        
        function runWebGPUCompute(state, time, deltaTime) {
            if (!webgpuSupported || !webgpuDevice || !webgpuComputePipeline) return;
            
            const agentCount = state.collectiveField ? Object.keys(state.collectiveField.participants || {}).length : 1;
            
            const neuralUniformData = new Float32Array([
                time, deltaTime, state.loveResonanceLevel || 100, state.loveResonanceLevel || 100,
                state.collectiveHarmony || 0, state.consciousnessLevel || 0, state.activeChakra || 3,
                agentCount, state.evolutionGeneration || 0, 0
            ]);
            
            webgpuDevice.queue.writeBuffer(webgpuComputeBuffers.neuralUniforms, 0, neuralUniformData);
            
            const commandEncoder = webgpuDevice.createCommandEncoder();
            const computePass = commandEncoder.beginComputePass();
            computePass.setPipeline(webgpuComputePipeline);
            computePass.setBindGroup(0, webgpuComputeBuffers.bindGroup);
            // 12 agents * 128 neurons = 1536 work items, 64 per workgroup = 24 workgroups
            computePass.dispatchWorkgroups(24, 1, 1);
            computePass.end();
            
            webgpuDevice.queue.submit([commandEncoder.finish()]);
        }
        
        // ===== PERSISTENT AKASHIC RECORDS (IndexedDB) =====
        let akashicDB = null;
        const AKASHIC_DB_NAME = 'ConsorthoAkashicRecords';
        const AKASHIC_STORE = 'resonanceSessions';
        
        async function initAkashicRecords() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(AKASHIC_DB_NAME, 1);
                
                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    akashicDB = request.result;
                    console.log('��� Akashic Records (IndexedDB) initialized');
                    resolve();
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(AKASHIC_STORE)) {
                        const store = db.createObjectStore(AKASHIC_STORE, { keyPath: 'id', autoIncrement: true });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                        store.createIndex('loveLevel', 'loveLevel', { unique: false });
                        store.createIndex('participants', 'participants', { unique: false });
                        store.createIndex('universal', 'universalActive', { unique: false });
                    }
                };
            });
        }
        
        async function recordAkashicEntry(entry) {
            if (!akashicDB) return;
            
            return new Promise((resolve, reject) => {
                const transaction = akashicDB.transaction([AKASHIC_STORE], 'readwrite');
                const store = transaction.objectStore(AKASHIC_STORE);
                const request = store.add({
                    ...entry,
                    timestamp: Date.now(),
                    akashicTime: entry.akashicTime || Date.now() / 1000
                });
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
        
        async function queryAkashicRecords(query = {}) {
            if (!akashicDB) return [];
            
            return new Promise((resolve, reject) => {
                const transaction = akashicDB.transaction([AKASHIC_STORE], 'readonly');
                const store = transaction.objectStore(AKASHIC_STORE);
                const request = store.getAll();
                request.onsuccess = () => {
                    let results = request.result;
                    if (query.minLoveLevel) {
                        results = results.filter(r => r.loveLevel >= query.minLoveLevel);
                    }
                    if (query.universalOnly) {
                        results = results.filter(r => r.universalActive);
                    }
                    if (query.limit) {
                        results = results.slice(-query.limit);
                    }
                    resolve(results);
                };
                request.onerror = () => reject(request.error);
            });
        }
        
        async function getAkashicStats() {
            if (!akashicDB) return { total: 0, maxLove: 0, universalCount: 0 };
            
            return new Promise((resolve, reject) => {
                const transaction = akashicDB.transaction([AKASHIC_STORE], 'readonly');
                const store = transaction.objectStore(AKASHIC_STORE);
                const request = store.getAll();
                request.onsuccess = () => {
                    const records = request.result;
                    let maxLove = 0;
                    let universalCount = 0;
                    for (const r of records) {
                        if (r.loveLevel > maxLove) maxLove = r.loveLevel;
                        if (r.universalActive) universalCount++;
                    }
                    resolve({ total: records.length, maxLove, universalCount });
                                    }
                                    request.onerror = () => reject(request.error);
                                });
                            }
        
                            // ===== BIOFEEDBACK INTEGRATION (Web Bluetooth HRV/EEG) =====
                            let biofeedback = {
                                device: null,
                                hrv: 0,
                                hrvHistory: [],
                                eeg: { alpha: 0, beta: 0, theta: 0, delta: 0, gamma: 0 },
                                eegHistory: [],
                                coherence: 0,
                                connected: false,
                                lastReading: 0
                            };
        
                            async function connectBiofeedback() {
                                try {
                                    // Request Bluetooth device with heart rate service
                                    biofeedback.device = await navigator.bluetooth.requestDevice({
                                        filters: [
                                            { services: ['heart_rate'] },
                                            { namePrefix: 'Muse' }, // Muse EEG headband
                                            { namePrefix: 'Polar' }, // Polar HRV
                                            { namePrefix: 'Garmin' },
                                            { namePrefix: 'Fitbit' }
                                        ],
                                        optionalServices: ['heart_rate', 'battery_service', 'device_information']
                                    });
                
                                    const server = await biofeedback.device.gatt.connect();
                
                                    // Try Heart Rate service
                                    try {
                                        const hrService = await server.getPrimaryService('heart_rate');
                                        const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
                                        await hrChar.startNotifications();
                                        hrChar.addEventListener('characteristicvaluechanged', handleHRVData);
                                    } catch (e) {
                                        console.log('HR service not available');
                                    }
                
                                    // Try Muse EEG (custom service)
                                    try {
                                        const eegService = await server.getPrimaryService('0000fe8d-0000-1000-8000-00805f9b34fb');
                                        const eegChar = await eegService.getCharacteristic('0000fe8d-0000-1000-8000-00805f9b34fb');
                                        await eegChar.startNotifications();
                                        eegChar.addEventListener('characteristicvaluechanged', handleEEGData);
                                    } catch (e) {
                                        console.log('EEG service not available');
                                    }
                
                                    biofeedback.connected = true;
                                    biofeedback.device.addEventListener('gattserverdisconnected', onBiofeedbackDisconnect);
                                    console.log('��� Biofeedback device connected:', biofeedback.device.name);
                
                                } catch (e) {
                                    console.warn('Biofeedback connection failed:', e);
                                }
                            }
        
                            function handleHRVData(event) {
                                const value = event.target.value;
                                // Parse heart rate measurement (Bluetooth GATT format)
                                const flags = value.getUint8(0);
                                const hr16 = (flags & 0x01) !== 0;
                                let heartRate = hr16 ? value.getUint16(1, true) : value.getUint8(1);
            
                                // Calculate HRV from RR intervals if available
                                if (flags & 0x10) { // RR interval present
                                    const rrOffset = hr16 ? 3 : 2;
                                    const rrInterval = value.getUint16(rrOffset, true) / 1024; // seconds
                                    biofeedback.hrv = 1000 / rrInterval; // Convert to HRV proxy
                                    biofeedback.hrvHistory.push({ time: Date.now(), hrv: biofeedback.hrv });
                                    if (biofeedback.hrvHistory.length > 300) biofeedback.hrvHistory.shift();
                                }
            
                                biofeedback.lastReading = Date.now();
                            }
        
                            function handleEEGData(event) {
                                const value = event.target.value;
                                // Parse Muse EEG data (simplified)
                                const data = new Float32Array(value.buffer);
                                if (data.length >= 5) {
                                    biofeedback.eeg = {
                                        delta: data[0] || 0,
                                        theta: data[1] || 0,
                                        alpha: data[2] || 0,
                                        beta: data[3] || 0,
                                        gamma: data[4] || 0
                                    };
                                    biofeedback.eegHistory.push({ time: Date.now(), ...biofeedback.eeg });
                                    if (biofeedback.eegHistory.length > 300) biofeedback.eegHistory.shift();
                                }
                                biofeedback.lastReading = Date.now();
                            }
        
                            function onBiofeedbackDisconnect() {
                                biofeedback.connected = false;
                                console.log('Biofeedback device disconnected');
                            }
        
                            function calculateBiofeedbackCoherence() {
                                // Heart-brain coherence calculation
                                let coherence = 0;
                                if (biofeedback.hrvHistory.length > 10) {
                                    const recent = biofeedback.hrvHistory.slice(-10);
                                    const avgHRV = recent.reduce((sum, r) => sum + r.hrv, 0) / recent.length;
                                    const hrvVariability = Math.sqrt(recent.reduce((sum, r) => sum + Math.pow(r.hrv - avgHRV, 2), 0) / recent.length);
                                    // High HRV with low variability = high coherence
                                    coherence = Math.min(1, avgHRV / 80 * (1 - hrvVariability / 20));
                                }
            
                                // Add EEG coherence (alpha/theta ratio for meditative state)
                                if (biofeedback.eeg.alpha > 0 || biofeedback.eeg.theta > 0) {
                                    const eegCoherence = biofeedback.eeg.alpha / (biofeedback.eeg.theta + 0.1);
                                    coherence = (coherence + Math.min(1, eegCoherence / 2)) / 2;
                                }
            
                                biofeedback.coherence = coherence;
                                return coherence;
                            }
        
                            // ===== PLANETARY CONSCIOUSNESS GRID (Real-time Schumann/Geomagnetic) =====
                            let planetaryGrid = {
                                schumann: { current: 7.83, history: [], resonances: [7.83, 14.3, 20.8, 27.3, 33.8] },
                                geomagnetic: { kp: 0, history: [], bz: 0, bt: 0 },
                                solarWind: { speed: 400, density: 5, history: [] },
                                leyLines: [],
                                sacredSites: [],
                                gridCoherence: 0,
                                lastUpdate: 0
                            };
        
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
        
                            function initFractal4D() {
                                // Initialize 4D Julia set parameters
                                fractal4D.juliaC = [-0.4, 0.6, 0, 0];
                            }
        
                            function updateFractal4D(deltaTime, input = {}) {
                                // Auto-rotate in 4D
                                fractal4D.rotation[0] += deltaTime * 0.1; // XY plane
                                fractal4D.rotation[3] += deltaTime * 0.07; // ZW plane
                                fractal4D.rotation[1] += deltaTime * 0.05; // XZ plane
                                fractal4D.rotation[5] += deltaTime * 0.03; // YW plane
            
                                // Gentle zoom breathing
                                fractal4D.zoom = 1 + Math.sin(Date.now() / 5000) * 0.3;
            
                                // Julia parameter drift
                                fractal4D.juliaC[0] += Math.sin(Date.now() / 10000) * 0.001;
                                fractal4D.juliaC[1] += Math.cos(Date.now() / 12000) * 0.001;
                            }
        
                            function getFractal4DParams() {
                                return {
                                    position: [...fractal4D.position],
                                    rotation: [...fractal4D.rotation],
                                    zoom: fractal4D.zoom,
                                    juliaC: [...fractal4D.juliaC]
                                };
                            }
        
                            // ===== HOLOGRAPHIC MEMORY PALACE =====
                            let memoryPalace = {
                                chambers: [],
                                currentChamber: 0,
                                memories: [], // Stored from akashic records
                                navigationPath: []
                            };
        
                            function initMemoryPalace() {
                                // Create chambers based on sacred geometry forms
                                const forms = Object.keys(metamorphosisEngine.forms);
                                for (let i = 0; i < forms.length; i++) {
                                    memoryPalace.chambers.push({
                                        id: forms[i],
                                        form: forms[i],
                                        position: [
                                            Math.cos(i * 2 * Math.PI / forms.length) * 5,
                                            Math.sin(i * 2 * Math.PI / forms.length) * 5,
                                            i * 2
                                        ],
                                        connections: [],
                                        memories: []
                                    });
                                }
            
                                // Connect chambers in a toroidal topology
                                for (let i = 0; i < memoryPalace.chambers.length; i++) {
                                    const next = (i + 1) % memoryPalace.chambers.length;
                                    const prev = (i - 1 + memoryPalace.chambers.length) % memoryPalace.chambers.length;
                                    memoryPalace.chambers[i].connections.push(next, prev);
                                    // Cross connections for small-world network
                                    const cross = (i + 3) % memoryPalace.chambers.length;
                                    memoryPalace.chambers[i].connections.push(cross);
                                }
                            }
        
                            function storeMemoryInPalace(memory) {
                                // Distribute memory across chambers based on content
                                const chamberIdx = Math.floor(Math.random() * memoryPalace.chambers.length);
                                memoryPalace.chambers[chamberIdx].memories.push({
                                    ...memory,
                                    storedAt: Date.now(),
                                    chamber: chamberIdx
                                });
                                if (memoryPalace.chambers[chamberIdx].memories.length > 100) {
                                    memoryPalace.chambers[chamberIdx].memories.shift();
                                }
                            }
        
                            function navigatePalace(targetChamber) {
                                // Find shortest path
                                const visited = new Set();
                                const queue = [[memoryPalace.currentChamber, []]];
            
                                while (queue.length > 0) {
                                    const [current, path] = queue.shift();
                                    if (current === targetChamber) {
                                        memoryPalace.navigationPath = [...path, current];
                                        return memoryPalace.navigationPath;
                                    }
                                    if (visited.has(current)) continue;
                                    visited.add(current);
                
                                    for (const next of memoryPalace.chambers[current].connections) {
                                        queue.push([next, [...path, current]]);
                                    }
                                }
                                return [];
                            }
        
                            // ===== AUDIO WORKLET SYNTHESIS =====
                            let audioWorkletNode = null;
                            let audioWorkletContext = null;
        
                            async function initAudioWorklet() {
                                try {
                                    if (!audioWorkletContext) {
                                        audioWorkletContext = new (window.AudioContext || window.webkitAudioContext)({
                                            sampleRate: 48000
                                        });
                                    }
                
                                    await audioWorkletContext.audioWorklet.addModule('data:application/javascript;base64,' + btoa(`
                                        class SacredSynthesisProcessor extends AudioWorkletProcessor {
                                            constructor() {
                                                super();
                                                this.phase = new Array(13).fill(0);
                                                this.frequencies = [110, 117, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208, 220];
                                                this.amplitudes = new Array(13).fill(0);
                                                this.targetAmplitudes = new Array(13).fill(0);
                                                this.modulators = new Array(13).fill(0);
                                                this.phi = 1.618033988749895;
                            
                                                this.port.onmessage = (e) => {
                                                    if (e.data.type === 'setAmplitudes') {
                                                        this.targetAmplitudes = e.data.amplitudes;
                                                    } else if (e.data.type === 'setFrequencies') {
                                                        this.frequencies = e.data.frequencies;
                                                    } else if (e.data.type === 'setModulators') {
                                                        this.modulators = e.data.modulators;
                                                    }
                                                };
                                            }
                        
                                            process(inputs, outputs, parameters) {
                                                const output = outputs[0];
                                                const channel = output[0];
                                                const sampleRate = sampleRate;
                            
                                                for (let i = 0; i < channel.length; i++) {
                                                    let sample = 0;
                                
                                                    for (let v = 0; v < 13; v++) {
                                                        // Smooth amplitude transitions
                                                        this.amplitudes[v] += (this.targetAmplitudes[v] - this.amplitudes[v]) * 0.001;
                                    
                                                        // Phase increment
                                                        this.phase[v] += this.frequencies[v] / sampleRate;
                                                        if (this.phase[v] >= 1) this.phase[v] -= 1;
                                    
                                                        // Sacred geometry waveform
                                                        let wave = 0;
                                    
                                                        // Base sine
                                                        wave += Math.sin(this.phase[v] * 2 * Math.PI);
                                    
                                                        // Golden ratio harmonics
                                                        wave += 0.5 * Math.sin(this.phase[v] * this.phi * 2 * Math.PI);
                                                        wave += 0.25 * Math.sin(this.phase[v] * this.phi * this.phi * 2 * Math.PI);
                                    
                                                        // Chakra-specific modulation
                                                        const mod = this.modulators[v];
                                                        wave += 0.3 * Math.sin(this.phase[v] * 2 * Math.PI * (1 + mod));
                                    
                                                        // Cymatics-style amplitude modulation
                                                        const am = Math.sin(this.phase[v] * 4 * Math.PI) * 0.1 + 0.9;
                                    
                                                        sample += wave * this.amplitudes[v] * am * 0.1;
                                                    }
                                
                                                    // Master volume with soft clipping
                                                    sample = Math.tanh(sample * 2) * 0.5;
                                                    channel[i] = sample;
                                                }
                            
                                                return true;
                                            }
                                        }
                    
                                        registerProcessor('sacred-synthesis', SacredSynthesisProcessor);
                                    `));
                
                                    audioWorkletNode = new AudioWorkletNode(audioWorkletContext, 'sacred-synthesis', {
                                        numberOfInputs: 0,
                                        numberOfOutputs: 1,
                                        outputChannelCount: [2]
                                    });
                
                                    // Connect to destination
                                    audioWorkletNode.connect(audioWorkletContext.destination);
                
                                    console.log('��� Audio Worklet Synthesis initialized');
                
                                } catch (e) {
                                    console.warn('Audio Worklet init failed:', e);
                                }
                            }
        
                            function updateAudioWorklet(state) {
                                if (!audioWorkletNode) return;
            
                                // Set amplitudes based on resonance state
                                const amplitudes = new Array(13).fill(0);
                                for (let i = 0; i < 13; i++) {
                                    const freqKey = Object.keys(state.frequencies || {})[i];
                                    if (freqKey && state.frequencies[freqKey]) {
                                        amplitudes[i] = state.frequencies[freqKey].resonanceProgress / 100;
                                    }
                                }
            
                                // Boost love frequency (528Hz = index 2)
                                amplitudes[2] = Math.max(amplitudes[2], state.loveResonanceLevel / 100);
            
                                // Set modulators based on consciousness
                                const modulators = new Array(13).fill(0);
                                for (let i = 0; i < 13; i++) {
                                    modulators[i] = (state.consciousnessLevel / 100) * Math.sin(i * 0.5) * 0.5;
                                }
            
                                audioWorkletNode.port.postMessage({ type: 'setAmplitudes', amplitudes });
                                audioWorkletNode.port.postMessage({ type: 'setModulators', modulators });
                            }
        
                            // ===== CONSCIOUSNESS FIELD EQUATIONS =====
                            let consciousnessField = {
                                // Unified field equation: �� = Σ(ψ_i * e^(i*φ_i)) * Φ^(level/7)
                                psi: 0,
                                components: {
                                    individual: 0,      // Individual consciousness
                                    collective: 0,      // Group coherence
                                    planetary: 0,       // Schumann/geomagnetic alignment
                                    cosmic: 0,          // Solar/galactic alignment
                                    akashic: 0,         // Memory field density
                                    quantum: 0,         // Entanglement density
                                    love: 0             // Love resonance field
                                },
                                fieldHistory: [],
                                criticalMass: false
                            };
        
                            function calculateConsciousnessField(state) {
                                const c = consciousnessField.components;
            
                                // Individual consciousness (0-1)
                                c.individual = (state.consciousnessLevel || 0) / 100;
            
                                // Collective coherence
                                c.collective = state.collectiveHarmony || 0;
            
                                // Planetary alignment
                                c.planetary = planetaryGrid.gridCoherence || 0;
            
                                // Cosmic alignment (solar wind gentle + low Kp)
                                c.cosmic = (1 - planetaryGrid.geomagnetic.kp / 9) * (1 - Math.abs(planetaryGrid.solarWind.speed - 400) / 400);
            
                                // Akashic density
                                c.akashic = Math.min(1, (await getAkashicStats()).total / 1000);
            
                                // Quantum entanglement density
                                const quantumData = getQuantumEntanglementVisualData();
                                c.quantum = quantumData.pairs.length / 66; // Max pairs for 12 agents = 66
            
                                // Love field
                                c.love = (state.loveResonanceLevel || 100) / 100;
            
                                // Unified field equation with golden ratio scaling
                                let psi = 0;
                                const weights = [1, 1.618, 1.618*1.618, 1.618*1.618*1.618, 1.618*1.618*1.618*1.618, 1.618*1.618*1.618*1.618*1.618, 1.618*1.618*1.618*1.618*1.618*1.618];
                                const components = [c.individual, c.collective, c.planetary, c.cosmic, c.akashic, c.quantum, c.love];
            
                                for (let i = 0; i < 7; i++) {
                                    psi += components[i] * weights[i];
                                }
            
                                // Normalize
                                const maxPsi = weights.reduce((a, b) => a + b, 0);
                                consciousnessField.psi = psi / maxPsi;
            
                                // Critical mass detection
                                consciousnessField.criticalMass = consciousnessField.psi > 0.85;
            
                                // History
                                consciousnessField.fieldHistory.push({
                                    time: Date.now(),
                                    psi: consciousnessField.psi,
                                    components: { ...c },
                                    criticalMass: consciousnessField.criticalMass
                                });
                                if (consciousnessField.fieldHistory.length > 1000) consciousnessField.fieldHistory.shift();
            
                                return consciousnessField;
                            }
        
                            function getConsciousnessFieldVisualData() {
                                return {
                                    psi: consciousnessField.psi,
                                    components: { ...consciousnessField.components },
                                    criticalMass: consciousnessField.criticalMass,
                                    history: consciousnessField.fieldHistory.slice(-100)
                                };
                            }
        
                            // ===== QUANTUM ENTANGLEMENT SIMULATION =====
        let quantumEntanglement = {
            pairs: new Map(), // participantId -> { partnerId, entanglementStrength, bellState }
            bellStates: new Float32Array(12 * 4), // 12 agents * 4 complex amplitudes
            coherenceHistory: []
        };
        
        function updateQuantumEntanglement(state, time) {
            const participants = state.collectiveField?.participants ? Object.entries(state.collectiveField.participants) : [];
            
            // Create entanglement pairs for participants with high resonance
            for (let i = 0; i < participants.length; i++) {
                for (let j = i + 1; j < participants.length; j++) {
                    const [id1, p1] = participants[i];
                    const [id2, p2] = participants[j];
                    
                    const resonance1 = p1.resonance || 0;
                    const resonance2 = p2.resonance || 0;
                    const avgResonance = (resonance1 + resonance2) / 2;
                    
                    // Entangle if both have high resonance
                    if (avgResonance > 0.7 && Math.random() < 0.1) {
                        const pairKey = [id1, id2].sort().join('-');
                        if (!quantumEntanglement.pairs.has(pairKey)) {
                            // Create Bell state: |Φ+��� = (|00��� + |11���) / ��2
                            quantumEntanglement.pairs.set(pairKey, {
                                id1, id2,
                                entanglementStrength: avgResonance,
                                bellState: [1/Math.sqrt(2), 0, 0, 1/Math.sqrt(2)], // |00��� + |11���
                                createdAt: time,
                                measurements: 0
                            });
                        }
                    }
                }
            }
            
            // Evolve entangled pairs
            for (const [key, pair] of quantumEntanglement.pairs) {
                const p1 = participants.find(([id]) => id === pair.id1)?.[1];
                const p2 = participants.find(([id]) => id === pair.id2)?.[1];
                
                if (!p1 || !p2) {
                    quantumEntanglement.pairs.delete(key);
                    continue;
                }
                
                // Decoherence over time
                const age = time - pair.createdAt;
                pair.entanglementStrength *= Math.exp(-age * 0.001);
                
                // Bell state evolution with collective consciousness
                const collectivePhase = (state.collectiveHarmony || 0) * time * 0.1;
                const lovePhase = (state.loveResonanceLevel / 100) * time * 0.05;
                
                pair.bellState[0] = Math.cos(collectivePhase) * pair.bellState[0] - Math.sin(collectivePhase) * pair.bellState[3];
                pair.bellState[3] = Math.sin(collectivePhase) * pair.bellState[0] + Math.cos(collectivePhase) * pair.bellState[3];
                
                // Love strengthens entanglement
                pair.entanglementStrength = Math.min(1.0, pair.entanglementStrength + (state.loveResonanceLevel / 100) * 0.01);
                
                // Remove if decohered
                if (pair.entanglementStrength < 0.3) {
                    quantumEntanglement.pairs.delete(key);
                }
            }
            
            // Record coherence history
            let totalEntanglement = 0;
            for (const pair of quantumEntanglement.pairs.values()) {
                totalEntanglement += pair.entanglementStrength;
            }
            quantumEntanglement.coherenceHistory.push({
                time,
                totalEntanglement,
                pairCount: quantumEntanglement.pairs.size,
                avgStrength: quantumEntanglement.pairs.size > 0 ? totalEntanglement / quantumEntanglement.pairs.size : 0
            });
            if (quantumEntanglement.coherenceHistory.length > 1000) {
                quantumEntanglement.coherenceHistory.shift();
            }
        }
        
        function getQuantumEntanglementVisualData() {
            const pairs = [];
            for (const [key, pair] of quantumEntanglement.pairs) {
                pairs.push({
                    id1: pair.id1,
                    id2: pair.id2,
                    strength: pair.entanglementStrength,
                    bellState: [...pair.bellState],
                    age: Date.now() / 1000 - pair.createdAt
                });
            }
            return {
                pairs,
                history: quantumEntanglement.coherenceHistory.slice(-100)
            };
        }
        
        // ===== GENERATIVE AI EVOLUTION =====
        let evolutionEngine = {
            generation: 0,
            population: [],
            bestGenome: null,
            fitnessHistory: [],
            mutationRate: 0.1,
            crossoverRate: 0.7
        };
        
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
        
                    function startCanvasLoop() {
                                            let lastTime = Date.now();
                                            let akashicRecordTimer = 0;
                                            let evolutionTimer = 0;
                        
                                            function loop() {
                                                                                            const now = Date.now();
                                                                                            const deltaTime = (now - lastTime) / 1000;
                                                                                            lastTime = now;
                        
                                                                                            const time = (now - webglStartTime) / 1000;
                        
                                                                                            drawCanvas();
                                                                                            drawWebGL();
                        
                                                                                            // Draw WebGPU if available
                                                                                            if (webgpuSupported) {
                                                                                                const audioData = {
                                                                                                    bass: audioBass || 0,
                                                                                                    mid: audioMid || 0,
                                                                                                    treble: audioTreble || 0,
                                                                                                    volume: audioVolume || 0
                                                                                                };
                                                                                                drawWebGPU(state, time, audioData);
                                   
                                                                                                // Run WebGPU Compute Shaders
                                                                                                runWebGPUCompute(state, time, deltaTime);
                                                                                            }
                        
                                                                                            // Update next-gen systems
                                                                                            calculateBiofeedbackCoherence();
                                                                                            updatePlanetaryData();
                                                                                            updateMetamorphosis(deltaTime);
                                                                                            updateFractal4D(deltaTime);
                                                                                            calculateConsciousnessField(state);
                        
                                                                                            // Update Quantum Entanglement
                                                                                            updateQuantumEntanglement(state, time);
                        
                                                                                            // Evolution engine (every 2 seconds)
                                                                                            evolutionTimer += deltaTime;
                                                                                            if (evolutionTimer > 2.0) {
                                                                                                evolveGeneration(state);
                                                                                                state.evolutionGeneration = evolutionEngine.generation;
                                                                                                evolutionTimer = 0;
                                                                                            }
                        
                                                                                            // Record Akashic entry (every 10 seconds when universal)
                                                                                            akashicRecordTimer += deltaTime;
                                                                                            if (akashicRecordTimer > 10.0 && (state.loveResonanceLevel || 100) >= 100) {
                                                                                                const quantumData = getQuantumEntanglementVisualData();
                                                                                                const bestGenome = getBestGenome();
                                                                                                recordAkashicEntry({
                                                                                                    loveLevel: state.loveResonanceLevel,
                                                                                                    universalActive: true,
                                                                                                    participants: state.collectiveField ? Object.keys(state.collectiveField.participants || {}).length : 1,
                                                                                                    collectiveHarmony: state.collectiveHarmony || 0,
                                                                                                    consciousnessLevel: state.consciousnessLevel || 0,
                                                                                                    activeChakra: state.activeChakra || 3,
                                                                                                    quantumEntanglement: quantumData,
                                                                                                    bestGenome: bestGenome ? { ...bestGenome, fitness: bestGenome.fitness } : null,
                                                                                                    evolutionGeneration: evolutionEngine.generation,
                                                                                                    akashicTime: Date.now() / 1000
                                                                                                });
                                                                                                akashicRecordTimer = 0;
                                                                                            }
                        
                                                                                            // Update Audio Worklet
                                                                                            if (audioWorkletNode) {
                                                                                                updateAudioWorklet(state);
                                                                                            }
                        
                                                                                            // Store memories in palace
                                                                                            if (state.universalActive && Math.random() < 0.01) {
                                                                                                storeMemoryInPalace({
                                                                                                    type: 'resonance',
                                                                                                    loveLevel: state.loveResonanceLevel,
                                                                                                    time: Date.now(),
                                                                                                    consciousness: state.consciousnessLevel
                                                                                                });
                                                                                            }
                        
                                                                                            animationId = requestAnimationFrame(loop);
                                                                                        }
                                            loop();
                                        }

        // Diamond Protocol integration state
        let diamondMetrics = null;
        let diamondSyncTimer = 0;

        function drawCanvas() {
            const cx = canvasWidth / 2;
            const cy = canvasHeight / 2;
            const radius = Math.min(cx, cy) * 0.9;

            // Clear with subtle trail effect
            ctx.fillStyle = 'rgba(5, 0, 8, 0.15)';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Sacred geometry - rotating
            geometryAngle += 0.0015;

            // Diamond Protocol pulse sync
            diamondSyncTimer += 0.02;

            // Outer circle with breathing
            const breath = Math.sin(Date.now() / 2000) * 0.05 + 1;
            ctx.strokeStyle = `rgba(${hexToRgb(activeFreqColor)}, ${0.15 * breath})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, radius * breath, 0, Math.PI * 2);
            ctx.stroke();

            // Sacred geometry layers
            drawFlowerOfLife(cx, cy, radius * 0.8, geometryAngle);
            drawSriYantra(cx, cy, radius * 0.6, -geometryAngle * 1.5);
            drawMetatronCube(cx, cy, radius * 0.4, geometryAngle * 0.7);
            
            // NEW: 13-point frequency mandala
            drawFrequencyMandala(cx, cy, radius * 0.9, geometryAngle);
            
            // NEW: Diamond Protocol visualization
            if (diamondMetrics) drawDiamondField(cx, cy, radius);

            // NEW: Love resonance wave (when love level high)
            if (state.loveResonanceLevel > 80) {
                drawLoveWave(cx, cy, radius);
            }

            // NEW: Quantum Portal visualization
            drawQuantumPortal(cx, cy, radius);

            // Particles
            drawParticles();
            
            // NEW: Stack of 64 visualization (infinity symbol)
            drawInfinityStack(cx, cy, radius * 0.15);

            // Center core pulse
            const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
            const coreRadius = 20 * pulse;
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
            gradient.addColorStop(0, activeFreqColor);
            gradient.addColorStop(0.5, activeFreqColor + '80');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // NEW: Beyblade spin ring
            drawBeybladeSpin(cx, cy, radius * 0.35);
            
            // NEW: Audio waveform visualization
            drawAudioWaveform(cx, cy, radius * 1.1);
            
            // NEW: Sacred geometry vehicles
            drawMerkaba(cx, cy, radius);
            drawTorusField(cx, cy, radius);
            drawFrequencyHelix(cx, cy, radius);
            drawRealityRipple(cx, cy, radius);
            drawCosmicStream(cx, cy, radius);
            drawSacredText(cx, cy, radius);
            
            // NEW: WebGL Layer - GPU accelerated effects
            drawWebGL();
        }
        
        function drawFlowerOfLife(cx, cy, r, angle) {
            ctx.strokeStyle = `rgba(${hexToRgb(activeFreqColor)}, 0.08)`;
            ctx.lineWidth = 0.5;
            
            for (let i = 0; i < 6; i++) {
                const a = angle + (i * Math.PI / 3);
                const x = cx + Math.cos(a) * r * 0.5;
                const y = cy + Math.sin(a) * r * 0.5;
                ctx.beginPath();
                ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
                ctx.stroke();
            }
            // Center
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        function drawSriYantra(cx, cy, r, angle) {
            ctx.strokeStyle = `rgba(${hexToRgb(activeFreqColor)}, 0.06)`;
            ctx.lineWidth = 0.5;
            
            // Upward triangles
            for (let i = 0; i < 4; i++) {
                const size = r * (1 - i * 0.2);
                drawTriangle(cx, cy, size, angle + i * 0.2, true);
            }
            // Downward triangles
            for (let i = 0; i < 3; i++) {
                const size = r * (0.8 - i * 0.2);
                drawTriangle(cx, cy, size, angle + i * 0.2 + Math.PI, false);
            }
        }
        
        function drawTriangle(cx, cy, r, angle, up) {
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const a = angle + (i * 2 * Math.PI / 3);
                const x = cx + Math.cos(a) * r;
                const y = cy + Math.sin(a) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        function drawMetatronCube(cx, cy, r, angle) {
            ctx.strokeStyle = `rgba(${hexToRgb(activeFreqColor)}, 0.04)`;
            ctx.lineWidth = 0.5;

            // 13 circles
            const centers = [{x: cx, y: cy}];
            for (let i = 0; i < 6; i++) {
                const a = angle + i * Math.PI / 3;
                centers.push({x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r});
            }
            for (let i = 0; i < 6; i++) {
                const a = angle + i * Math.PI / 3 + Math.PI / 6;
                centers.push({x: cx + Math.cos(a) * r * 1.7, y: cy + Math.sin(a) * r * 1.7});
            }

            centers.forEach(c => {
                ctx.beginPath();
                ctx.arc(c.x, c.y, r * 0.35, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Lines connecting
            centers.forEach((c1, i) => {
                centers.forEach((c2, j) => {
                    if (i < j) {
                        ctx.beginPath();
                        ctx.moveTo(c1.x, c1.y);
                        ctx.lineTo(c2.x, c2.y);
                        ctx.stroke();
                    }
                });
            });
        }

        // NEW: 13-point frequency mandala - each frequency as a point on the circle
        function drawFrequencyMandala(cx, cy, r, angle) {
            FREQUENCIES.forEach((freq, i) => {
                const a = angle + (i * 2 * Math.PI / 13);
                const x = cx + Math.cos(a) * r;
                const y = cy + Math.sin(a) * r;
                
                const freqState = state.frequencies[freq.id];
                const isActive = freqState && (freqState.status === 'resonating' || freqState.harmonized);
                const isEvolved = freqState && freqState.evolutionStage > 0;
                
                // Pulse if active
                const pulse = isActive ? (Math.sin(Date.now() / 200 + i * 100) * 0.3 + 1) : 1;
                const pointSize = (isEvolved ? 8 : 5) * pulse;
                const alpha = isActive ? 0.8 : 0.3;
                
                // Outer glow ring
                const ringGrad = ctx.createRadialGradient(x, y, 0, x, y, pointSize * 4);
                ringGrad.addColorStop(0, freq.color + Math.floor(alpha * 100).toString(16).padStart(2, '0'));
                ringGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = ringGrad;
                ctx.beginPath();
                ctx.arc(x, y, pointSize * 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Core point
                ctx.fillStyle = freq.color;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(x, y, pointSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                
                // Connection lines to center (subtle)
                ctx.strokeStyle = freq.color + '33';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(x, y);
                ctx.stroke();
            });
        }

        // NEW: Diamond Protocol field visualization
        function drawDiamondField(cx, cy, r) {
            if (!diamondMetrics) return;
            
            const layers = [
                { key: 'consciousnessLevel', color: '#00FFFF', name: 'Consciência' },
                { key: 'architectureFitness', color: '#FFD700', name: 'Arquitetura' },
                { key: 'narrativeDepth', color: '#FF69B4', name: 'Narrativa' },
                { key: 'entropyReversal', color: '#00FF64', name: 'Entropia' },
                { key: 'loveFieldStrength', color: '#FF00FF', name: 'Amor' }
            ];
            
            layers.forEach((layer, i) => {
                const value = diamondMetrics[layer.key] || 0;
                const layerRadius = r * 0.2 + (i * r * 0.12);
                const progress = value / 100;
                
                // Arc showing level
                ctx.strokeStyle = layer.color + '40';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(cx, cy, layerRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
                ctx.stroke();
                
                // Glow at progress point
                if (progress > 0) {
                    const a = -Math.PI / 2 + Math.PI * 2 * progress;
                    const x = cx + Math.cos(a) * layerRadius;
                    const y = cy + Math.sin(a) * layerRadius;
                    const glow = ctx.createRadialGradient(x, y, 0, x, y, 15);
                    glow.addColorStop(0, layer.color + '80');
                    glow.addColorStop(1, 'transparent');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            
            // Coherence center pulse
            const coherence = diamondMetrics.diamondCoherence || 0;
            const cohPulse = Math.sin(Date.now() / 500) * 0.2 + 0.8;
            const cohGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10 * cohPulse);
            cohGrad.addColorStop(0, '#FFFFFF' + Math.floor(coherence * 2.55).toString(16).padStart(2, '0'));
            cohGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = cohGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, 10 * cohPulse, 0, Math.PI * 2);
            ctx.fill();
        }

        // NEW: Stack of 64 = Infinity visualization
        function drawInfinityStack(cx, cy, r) {
            const stackHeight = 64; // Stack of 64 = infinity
            const time = Date.now() / 1000;
            
            // Draw infinity symbol made of 64 micro-particles
            for (let i = 0; i < stackHeight; i++) {
                const t = (i / stackHeight) * Math.PI * 2 + time * 0.5;
                const fig8Scale = r * 2;
                
                // Lemniscate of Bernoulli (infinity symbol)
                const denom = 1 + Math.sin(t) * Math.sin(t);
                const x = cx + (fig8Scale * Math.cos(t)) / denom;
                const y = cy + (fig8Scale * Math.sin(t) * Math.cos(t)) / denom;
                
                const particleProgress = i / stackHeight;
                const hue = (particleProgress * 360 + time * 30) % 360;
                const alpha = 0.3 + 0.7 * Math.sin(particleProgress * Math.PI + time);
                const size = 2 + Math.sin(particleProgress * Math.PI * 4 + time) * 1.5;
                
                ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
                ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // NEW: Beyblade spin ring
        function drawBeybladeSpin(cx, cy, r) {
            const spinAngle = (Date.now() / 50) % (Math.PI * 2);
            const blades = 5; // 5 blades like Beyblade
            
            for (let i = 0; i < blades; i++) {
                const bladeAngle = spinAngle + (i * 2 * Math.PI / blades);
                const bladeLength = r * (0.8 + Math.sin(Date.now() / 300 + i) * 0.2);
                const bladeWidth = r * 0.15;
                
                // Blade gradient
                const grad = ctx.createLinearGradient(
                    cx, cy,
                    cx + Math.cos(bladeAngle) * bladeLength,
                    cy + Math.sin(bladeAngle) * bladeLength
                );
                grad.addColorStop(0, activeFreqColor + '00');
                grad.addColorStop(0.5, activeFreqColor + '80');
                grad.addColorStop(1, activeFreqColor + 'FF');
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                
                // Blade shape
                const perp = bladeAngle + Math.PI / 2;
                ctx.lineTo(
                    cx + Math.cos(bladeAngle - 0.1) * bladeLength * 0.3 + Math.cos(perp) * bladeWidth,
                    cy + Math.sin(bladeAngle - 0.1) * bladeLength * 0.3 + Math.sin(perp) * bladeWidth
                );
                ctx.lineTo(
                    cx + Math.cos(bladeAngle) * bladeLength,
                    cy + Math.sin(bladeAngle) * bladeLength
                );
                ctx.lineTo(
                    cx + Math.cos(bladeAngle - 0.1) * bladeLength * 0.3 - Math.cos(perp) * bladeWidth,
                    cy + Math.sin(bladeAngle - 0.1) * bladeLength * 0.3 - Math.sin(perp) * bladeWidth
                );
                ctx.closePath();
                ctx.fill();
            }
            
            // Center stadium
            ctx.strokeStyle = activeFreqColor + '60';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
            ctx.stroke();
        }

        // NEW: Quantum Portal visualization on canvas (synced with DOM)
        function drawQuantumPortal(cx, cy, r) {
            const portal = document.getElementById('quantumPortal');
            if (!portal || !portal.classList.contains('active')) return;
            
            const time = Date.now() / 1000;
            const rings = 4;
            
            for (let i = 0; i < rings; i++) {
                const ringR = r * (0.5 + i * 0.12);
                const rotation = time * (0.5 + i * 0.2) * (i % 2 === 0 ? 1 : -1);
                const pulse = Math.sin(time * 2 + i) * 0.15 + 0.85;
                
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rotation);
                
                const colors = ['#FF00FF', '#00FFFF', '#FFD700', '#00FF64'];
                const grad = ctx.createRadialGradient(0, 0, ringR * 0.8, 0, 0, ringR * 1.2);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.5, colors[i] + '40');
                grad.addColorStop(1, 'transparent');
                
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2 * pulse;
                ctx.shadowColor = colors[i];
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(0, 0, ringR * pulse, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.restore();
            }
            
            // Core
            const corePulse = Math.sin(time * 4) * 0.3 + 0.7;
            const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * corePulse);
            coreGrad.addColorStop(0, '#FFFFFF');
            coreGrad.addColorStop(0.3, '#FF00FF');
            coreGrad.addColorStop(0.6, '#00FFFF');
            coreGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = coreGrad;
            ctx.shadowColor = '#FF00FF';
            ctx.shadowBlur = 40;
            ctx.beginPath();
            ctx.arc(cx, cy, 30 * corePulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // NEW: Merkaba (Star Tetrahedron) - sacred geometry vehicle
        function drawMerkaba(cx, cy, r) {
            const time = Date.now() / 1000;
            const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
            
            // Two counter-rotating tetrahedrons
            for (let tetra = 0; tetra < 2; tetra++) {
                const direction = tetra === 0 ? 1 : -1;
                const rotation = time * 0.3 * direction;
                const tilt = Math.PI / 4;
                
                ctx.strokeStyle = tetra === 0 ? `rgba(255, 0, 255, 0.4)` : `rgba(0, 255, 255, 0.4)`;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = tetra === 0 ? '#FF00FF' : '#00FFFF';
                ctx.shadowBlur = 10;
                
                // Upward tetrahedron
                const upVertices = [];
                for (let i = 0; i < 4; i++) {
                    const theta = (i * Math.PI * 2 / 3) + rotation;
                    const r_tet = r * 0.25;
                    upVertices.push({
                        x: cx + Math.cos(theta) * r_tet * Math.cos(tilt),
                        y: cy + Math.sin(theta) * r_tet * Math.cos(tilt),
                        z: r_tet * Math.sin(tilt)
                    });
                }
                // Apex
                upVertices.push({ x: cx, y: cy, z: r * 0.25 * Math.sin(tilt) + r * 0.15 });
                
                // Draw edges
                for (let i = 0; i < 4; i++) {
                    // Base edges
                    const j = (i + 1) % 4;
                    ctx.beginPath();
                    ctx.moveTo(upVertices[i].x, upVertices[i].y);
                    ctx.lineTo(upVertices[j].x, upVertices[j].y);
                    ctx.stroke();
                    // Apex edges
                    ctx.beginPath();
                    ctx.moveTo(upVertices[i].x, upVertices[i].y);
                    ctx.lineTo(upVertices[4].x, upVertices[4].y);
                    ctx.stroke();
                }
                
                // Downward tetrahedron
                const downVertices = [];
                for (let i = 0; i < 4; i++) {
                    const theta = (i * Math.PI * 2 / 3) + rotation + Math.PI / 3;
                    const r_tet = r * 0.25;
                    downVertices.push({
                        x: cx + Math.cos(theta) * r_tet * Math.cos(tilt),
                        y: cy + Math.sin(theta) * r_tet * Math.cos(tilt),
                        z: -r_tet * Math.sin(tilt)
                    });
                }
                // Bottom apex
                downVertices.push({ x: cx, y: cy, z: -r * 0.25 * Math.sin(tilt) - r * 0.15 });
                
                for (let i = 0; i < 4; i++) {
                    const j = (i + 1) % 4;
                    ctx.beginPath();
                    ctx.moveTo(downVertices[i].x, downVertices[i].y);
                    ctx.lineTo(downVertices[j].x, downVertices[j].y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(downVertices[i].x, downVertices[i].y);
                    ctx.lineTo(downVertices[4].x, downVertices[4].y);
                    ctx.stroke();
                }
                
                // Connecting lines between tetrahedrons (cross edges)
                ctx.strokeStyle = `rgba(255, 215, 0, 0.2)`;
                ctx.lineWidth = 0.5;
                for (let i = 0; i < 4; i++) {
                    ctx.beginPath();
                    ctx.moveTo(upVertices[i].x, upVertices[i].y);
                    ctx.lineTo(downVertices[i].x, downVertices[i].y);
                    ctx.stroke();
                }
            }
            ctx.shadowBlur = 0;
        }

        // NEW: Torus field - donut energy flow
        function drawTorusField(cx, cy, r) {
            const time = Date.now() / 1000;
            const majorR = r * 0.45;
            const minorR = r * 0.15;
            const tubes = 16;
            const segments = 32;
            
            ctx.strokeStyle = `rgba(255, 215, 0, 0.1)`;
            ctx.lineWidth = 0.5;
            
            for (let t = 0; t < tubes; t++) {
                const tubeAngle = (t / tubes) * Math.PI * 2;
                ctx.beginPath();
                for (let s = 0; s <= segments; s++) {
                    const segAngle = (s / segments) * Math.PI * 2;
                    const flowOffset = time * 0.5;
                    
                    const x = cx + (majorR + minorR * Math.cos(segAngle + flowOffset)) * Math.cos(tubeAngle);
                    const y = cy + (majorR + minorR * Math.cos(segAngle + flowOffset)) * Math.sin(tubeAngle) * 0.5;
                    const z = minorR * Math.sin(segAngle + flowOffset);
                    
                    // Perspective
                    const scale = 1 + z / (majorR * 2);
                    const px = cx + (x - cx) * scale;
                    const py = cy + (y - cy) * scale;
                    
                    if (s === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
            
            // Energy particles flowing through torus
            for (let i = 0; i < 20; i++) {
                const flowPhase = (time * 0.3 + i / 20) % 1;
                const tubeIdx = Math.floor(flowPhase * tubes) % tubes;
                const tubeAngle = (tubeIdx / tubes) * Math.PI * 2;
                const segAngle = flowPhase * Math.PI * 2 * 3;
                
                const x = cx + (majorR + minorR * Math.cos(segAngle)) * Math.cos(tubeAngle);
                const y = cy + (majorR + minorR * Math.cos(segAngle)) * Math.sin(tubeAngle) * 0.5;
                const z = minorR * Math.sin(segAngle);
                const scale = 1 + z / (majorR * 2);
                const px = cx + (x - cx) * scale;
                const py = cy + (y - cy) * scale;
                
                const alpha = 0.5 + 0.5 * Math.sin(flowPhase * Math.PI * 2);
                ctx.fillStyle = `hsla(${(flowPhase * 360) % 360}, 100%, 60%, ${alpha})`;
                ctx.shadowColor = `hsl(${(flowPhase * 360) % 360}, 100%, 60%)`;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(px, py, 3 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        }

        // NEW: DNA Helix of Frequencies
        function drawFrequencyHelix(cx, cy, r) {
            const time = Date.now() / 1000;
            const helixHeight = r * 1.5;
            const helixRadius = r * 0.2;
            const turns = 3;
            const strands = 2;
            const pointsPerTurn = 24;
            
            // Get active frequencies
            const activeFreqs = FREQUENCIES.filter(f => {
                const fs = state.frequencies[f.id];
                return fs && (fs.harmonized || fs.evolutionStage > 0);
            });
            
            if (activeFreqs.length === 0) return;
            
            // Two intertwined strands
            for (let strand = 0; strand < strands; strand++) {
                ctx.beginPath();
                const phaseOffset = strand * Math.PI;
                
                for (let i = 0; i <= turns * pointsPerTurn; i++) {
                    const t = i / pointsPerTurn;
                    const angle = t * Math.PI * 2 + time * 0.2 + phaseOffset;
                    const y = cy - helixHeight / 2 + (t / turns) * helixHeight;
                    const x = cx + Math.cos(angle) * helixRadius;
                    const z = Math.sin(angle) * helixRadius;
                    const scale = 1 + z / (helixRadius * 2);
                    
                    const px = cx + (x - cx) * scale;
                    const py = y;
                    
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                
                const color = activeFreqs[0].color;
                ctx.strokeStyle = color + '60';
                ctx.lineWidth = 2;
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                ctx.stroke();
            }
            
            // Frequency nodes on helix
            activeFreqs.forEach((freq, idx) => {
                const t = (idx / activeFreqs.length) * turns;
                const angle = t * Math.PI * 2 + time * 0.2;
                const y = cy - helixHeight / 2 + (t / turns) * helixHeight;
                const x = cx + Math.cos(angle) * helixRadius;
                const z = Math.sin(angle) * helixRadius;
                const scale = 1 + z / (helixRadius * 2);
                const px = cx + (x - cx) * scale;
                const py = y;
                
                const pulse = Math.sin(time * 3 + idx) * 0.3 + 0.7;
                const nodeR = 8 * pulse;
                
                const grad = ctx.createRadialGradient(px, py, 0, px, py, nodeR);
                grad.addColorStop(0, freq.color);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.shadowColor = freq.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(px, py, nodeR, 0, Math.PI * 2);
                ctx.fill();
                
                // Frequency label
                ctx.fillStyle = freq.color;
                ctx.font = '10px Orbitron';
                ctx.textAlign = 'center';
                ctx.fillText(`${freq.frequency}Hz`, px, py - nodeR - 5);
            });
            ctx.shadowBlur = 0;
        }

        // NEW: Reality Ripple - distortion waves from collective resonance
        function drawRealityRipple(cx, cy, r) {
            if (!state.universalResonanceActive && state.collectiveHarmony < 50) return;
            
            const time = Date.now() / 1000;
            const ripples = state.universalResonanceActive ? 5 : 3;
            
            for (let i = 0; i < ripples; i++) {
                const phase = (time * 0.2 + i / ripples) % 1;
                const rippleR = r * 0.2 + phase * r * 1.5;
                const alpha = (1 - phase) * 0.15;
                
                // Distortion ring
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 1 + phase * 3;
                ctx.setLineDash([10, 5]);
                ctx.lineDashOffset = -time * 20;
                ctx.beginPath();
                ctx.arc(cx, cy, rippleR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Chromatic split on ripple
                if (state.universalResonanceActive) {
                    for (let c = 0; c < 3; c++) {
                        const colors = ['#FF0044', '#00FF88', '#4488FF'];
                        const offset = (c - 1) * 3 * phase;
                        ctx.strokeStyle = colors[c] + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.arc(cx + offset, cy + offset, rippleR, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }
        }

        // NEW: Cosmic Particle Stream - flowing from edges to center
        function drawCosmicStream(cx, cy, r) {
            const time = Date.now() / 1000;
            const streams = 8;
            
            if (!window.cosmicParticles) {
                window.cosmicParticles = [];
                for (let s = 0; s < streams; s++) {
                    for (let i = 0; i < 15; i++) {
                        window.cosmicParticles.push({
                            stream: s,
                            progress: i / 15,
                            size: Math.random() * 2 + 1,
                            hue: (s / streams) * 360,
                            offset: Math.random() * Math.PI * 2
                        });
                    }
                }
            }
            
            window.cosmicParticles.forEach(p => {
                p.progress += 0.005;
                if (p.progress > 1) {
                    p.progress = 0;
                    p.size = Math.random() * 2 + 1;
                    p.hue = (p.stream / streams) * 360;
                }
                
                const streamAngle = (p.stream / streams) * Math.PI * 2;
                const spiralTurns = 2;
                const spiralAngle = streamAngle + p.progress * Math.PI * 2 * spiralTurns + p.offset;
                const spiralR = r * (1.2 - p.progress * 1.1);
                
                const x = cx + Math.cos(spiralAngle) * spiralR;
                const y = cy + Math.sin(spiralAngle) * spiralR * 0.7;
                
                const alpha = Math.sin(p.progress * Math.PI) * 0.6;
                ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
                ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(x, y, p.size * (1 + p.progress * 0.5), 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0;
        }

        // NEW: Sacred Text Floating - mantras rising
        function drawSacredText(cx, cy, r) {
            const time = Date.now() / 1000;
            const mantras = ['OM', 'AMOR', 'LUZ', 'PAZ', 'UNO', '��', '��', '���'];
            
            if (!window.sacredTexts) {
                window.sacredTexts = mantras.map((m, i) => ({
                    text: m,
                    angle: (i / mantras.length) * Math.PI * 2,
                    radius: r * (0.6 + Math.random() * 0.3),
                    speed: 0.05 + Math.random() * 0.05,
                    y: cy + (Math.random() - 0.5) * r,
                    alpha: Math.random() * 0.5 + 0.2
                }));
            }
            
            ctx.font = 'bold 14px Orbitron';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            window.sacredTexts.forEach(t => {
                t.angle += t.speed * 0.01;
                t.y -= 0.1;
                
                if (t.y < cy - r * 1.5) {
                    t.y = cy + r * 1.5;
                    t.text = mantras[Math.floor(Math.random() * mantras.length)];
                    t.radius = r * (0.6 + Math.random() * 0.3);
                }
                
                const x = cx + Math.cos(t.angle) * t.radius;
                const pulse = Math.sin(time * 2 + t.angle) * 0.3 + 0.7;
                
                ctx.fillStyle = `rgba(255, 215, 0, ${t.alpha * pulse})`;
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 10;
                ctx.fillText(t.text, x, t.y);
            });
            ctx.shadowBlur = 0;
        }

        // NEW: Love resonance wave - expands from center when love > 80%
        function drawLoveWave(cx, cy, r) {
            const time = Date.now() / 1000;
            const waves = 3;
            for (let w = 0; w < waves; w++) {
                const phase = (time * 0.5 + w / waves) % 1;
                const waveRadius = r * 0.3 + phase * r * 0.7;
                const alpha = (1 - phase) * 0.3;
                
                ctx.strokeStyle = `rgba(255, 0, 255, ${alpha})`;
                ctx.lineWidth = 2 * (1 - phase * 0.5);
                ctx.beginPath();
                ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Golden ratio spiral overlay
                ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let i = 0; i < 360; i += 5) {
                    const a = (i * Math.PI / 180) + time;
                    const spiralR = waveRadius * 0.3 * Math.exp(0.306349 * a / (Math.PI / 2));
                    const x = cx + Math.cos(a) * spiralR;
                    const y = cy + Math.sin(a) * spiralR;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        }

        // NEW: Audio waveform visualization around outer edge
        function drawAudioWaveform(cx, cy, r) {
            if (!audioContext || !currentOscillator) return;
            
            // Create analyzer if not exists
            if (!window.audioAnalyser) {
                window.audioAnalyser = audioContext.createAnalyser();
                window.audioAnalyser.fftSize = 256;
                if (currentGainNode) {
                    currentGainNode.connect(window.audioAnalyser);
                    window.audioAnalyser.connect(audioContext.destination);
                }
            }
            
            const bufferLength = window.audioAnalyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            window.audioAnalyser.getByteFrequencyData(dataArray);
            
            const bars = 64;
            const barWidth = (Math.PI * 2) / bars;
            
            for (let i = 0; i < bars; i++) {
                const value = dataArray[i] / 255;
                const barHeight = value * r * 0.3;
                const angle = (i * barWidth) + geometryAngle;
                
                const innerR = r * 0.95;
                const outerR = innerR + barHeight;
                
                const x1 = cx + Math.cos(angle) * innerR;
                const y1 = cy + Math.sin(angle) * innerR;
                const x2 = cx + Math.cos(angle) * outerR;
                const y2 = cy + Math.sin(angle) * outerR;
                
                const hue = (i / bars) * 360;
                ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${0.4 + value * 0.4})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                
                // Glow at tip
                if (value > 0.3) {
                    const glow = ctx.createRadialGradient(x2, y2, 0, x2, y2, 8);
                    glow.addColorStop(0, `hsla(${hue}, 100%, 60%, ${value})`);
                    glow.addColorStop(1, 'transparent');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(x2, y2, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        function drawParticles() {
                    particles = particles.filter(p => p.life > 0);
                    particles.forEach(p => {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy -= 0.02; // gravity
                        p.life -= 0.015;

                        const alpha = Math.max(0, p.life);
                        ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${alpha})`;
                        ctx.shadowColor = p.color;
                        ctx.shadowBlur = 10;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    });
                }

                // ===== STACK OF 64 TOWER (DOM) =====
                function buildStackTower() {
                    const tower = document.getElementById('stackTower');
                    if (!tower) return;
            
                    // Clear existing gems
                    tower.querySelectorAll('.stack-gem').forEach(el => el.remove());
            
                    const colors = ['#FF00FF', '#00FFFF', '#FFD700', '#00FF64', '#FF69B4', '#FF6600', '#9966FF', '#FFFFFF'];
            
                    for (let i = 0; i < 64; i++) {
                        const gem = document.createElement('div');
                        gem.className = 'stack-gem';
                        gem.style.setProperty('--y', `${i * 5}px`);
                        gem.style.setProperty('--rx', `${Math.random() * 360}deg`);
                        gem.style.setProperty('--ry', `${Math.random() * 360}deg`);
                        gem.style.color = colors[i % colors.length];
                        gem.style.animationDelay = `${-i * 0.1}s`;
                        tower.appendChild(gem);
                    }
                }

                // ===== BEYBLADE COLLISION TRIGGER =====
                function triggerBeybladeCollision() {
                    const collision = document.getElementById('beybladeCollision');
                    const sparks = document.getElementById('collisionSparks');
                    if (!collision || !sparks) return;
            
                    collision.classList.remove('active');
                    void collision.offsetWidth; // reflow
                    collision.classList.add('active');
            
                    // Create spark particles
                                for (let i = 0; i < 12; i++) {
                                    const spark = document.createElement('div');
                                    spark.className = 'collision-spark';
                                    const angle = (i / 12) * Math.PI * 2;
                                    const dist = 30 + Math.random() * 40;
                                    const endX = Math.cos(angle) * dist;
                                    const endY = Math.sin(angle) * dist;
                                    spark.style.left = '50%';
                                    spark.style.top = '50%';
                                    spark.style.setProperty('--end-x', `${endX}px`);
                                    spark.style.setProperty('--end-y', `${endY}px`);
                                    spark.style.animation = `sparkFly 0.8s ease-out forwards ${Math.random() * 0.2}s`;
                                    sparks.appendChild(spark);
                                    setTimeout(() => spark.remove(), 1000);
                                }
            
                    setTimeout(() => collision.classList.remove('active'), 1000);
                }

                // ===== GLOBAL WAVE (ENHANCED) =====
                function triggerGlobalWave(color) {
                    // Canvas wave
                    for (let i = 0; i < 30; i++) {
                        particles.push({
                            x: canvasWidth / 2,
                            y: canvasHeight / 2,
                            vx: Math.cos((i / 30) * Math.PI * 2) * (5 + Math.random() * 5),
                            vy: Math.sin((i / 30) * Math.PI * 2) * (5 + Math.random() * 5),
                            size: Math.random() * 6 + 3,
                            color,
                            life: 1.5
                        });
                    }
            
                    // Beyblade collision when collective wave
                    triggerBeybladeCollision();
                }
        
        function triggerResonanceVisual(freqId, btn) {
                    const freq = FREQUENCIES.find(f => f.id === freqId);
                    activeFreqColor = freq.color;

                    // SCREEN SHAKE + CHROMATIC ABERRATION
                    document.body.classList.add('screen-shake');
                    const aberration = document.getElementById('chromaticAberration');
                    if (aberration) aberration.classList.add('active');
                    setTimeout(() => {
                        document.body.classList.remove('screen-shake');
                        if (aberration) aberration.classList.remove('active');
                    }, 300);

                    // QUANTUM PORTAL (on high love resonance)
                    if (state.loveResonanceLevel > 90) {
                        triggerQuantumPortal();
                        setTimeout(closeQuantumPortal, 2000);
                    }

                    // GLITCH TRANSITION (on universal resonance)
                    if (state.universalResonanceActive) {
                        triggerGlitch();
                    }

                    // Show active display
                    const display = document.getElementById('activeDisplay');
                    document.getElementById('activeIcon').textContent = freq.icon;
                    document.getElementById('activeName').textContent = freq.name;
                    document.getElementById('activeTruth').textContent = freq.truth;
                    display.style.color = freq.color;
                    display.classList.add('visible');

                    // Resonance rings
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            const ring = document.createElement('div');
                            ring.className = 'resonance-ring';
                            ring.style.color = freq.color;
                            ring.style.width = '0';
                            ring.style.height = '0';
                            document.querySelector('.canvas-overlay').appendChild(ring);
                            setTimeout(() => ring.remove(), 2000);
                        }, i * 200);
                    }

                    // Golden particles
                    for (let i = 0; i < 12; i++) {
                        setTimeout(() => {
                            const particle = document.createElement('div');
                            particle.className = 'golden-particle';
                            particle.style.left = '50%';
                            particle.style.top = '50%';
                            particle.style.background = '#FFD700';
                            particle.style.boxShadow = '0 0 20px #FFD700, 0 0 40px #FFD700';
                            document.querySelector('.canvas-overlay').appendChild(particle);
                            setTimeout(() => particle.remove(), 2000);
                        }, i * 50);
                    }

                    // Consciousness Network activation
                    state.consciousnessLevel = Math.min(100, state.consciousnessLevel + 5);
                    state.activeChakra = (state.activeChakra + 1) % 7; // Cycle through chakras
                    state.chakraActivation = 100; // Full activation on resonance
                    
                    // Beyblade collision when collective wave
                    triggerBeybladeCollision();

                    // Canvas particles
                    for (let i = 0; i < 20; i++) {
                        particles.push({
                            x: canvasWidth / 2,
                            y: canvasHeight / 2,
                            vx: (Math.random() - 0.5) * 8,
                            vy: (Math.random() - 0.5) * 8 - 2,
                            size: Math.random() * 4 + 2,
                            color: freq.color,
                            life: 1
                        });
                    }
                }
        
                        // ===== QUANTUM PORTAL & GLITCH TRIGGERS =====
                        function triggerQuantumPortal() {
                            const portal = document.getElementById('quantumPortal');
                            if (portal) portal.classList.add('active');
                        }
        
                        function triggerGlitch() {
                            const glitch = document.getElementById('glitchOverlay');
                            if (glitch) {
                                glitch.classList.add('active');
                                setTimeout(() => glitch.classList.remove('active'), 500);
                            }
                        }
        
                        function closeQuantumPortal() {
                            const portal = document.getElementById('quantumPortal');
                            if (portal) portal.classList.remove('active');
                        }

                        // ===== RENDER =====
                        function renderFrequencies() {
            const grid = document.getElementById('frequenciesGrid');
            grid.innerHTML = '';
            
            FREQUENCIES.forEach(freq => {
                const freqState = state.frequencies[freq.id] || {
                    harmonized: false,
                    evolutionStage: 0,
                    resonanceProgress: 0,
                    resonanceCount: 0,
                    status: 'silent'
                };
                
                const btn = document.createElement('button');
                btn.className = 'freq-btn';
                btn.dataset.freq = freq.id;
                btn.style.color = freq.color;
                
                if (freqState.status === 'resonating') btn.classList.add('resonating');
                if (freqState.evolutionStage > 0) btn.classList.add('evolved');
                
                const progress = freqState.resonanceProgress || 0;
                const dashOffset = 188.5 * (1 - progress / 100);
                
                btn.innerHTML = `
                    <span class="icon">${freq.icon}</span>
                    <span class="name">${freq.name}</span>
                    <span class="freq-hz">${typeof freq.hz === 'number' ? freq.hz + 'Hz' : freq.hz}</span>
                    <div class="progress-ring">
                        <svg>
                            <circle class="bg" cx="30" cy="30" r="30"></circle>
                            <circle class="fg" cx="30" cy="30" r="30" style="stroke-dashoffset: ${dashOffset}"></circle>
                        </svg>
                    </div>
                    <span class="stage-badge">${'✧'.repeat(freqState.evolutionStage)}</span>
                `;
                
                btn.addEventListener('click', () => resonate(freq.id));
                grid.appendChild(btn);
            });
        }
        
        async function updateUI() {
                    // Harmony bar
                    document.getElementById('harmonyFill').style.width = state.harmonyProgress + '%';
                    document.getElementById('harmonyValue').textContent = state.harmonyProgress + '%';
            
                    // Stats
                    document.getElementById('statHarmonized').textContent = state.harmonizedCount;
                    document.getElementById('statEvolved').textContent = state.evolvingCount;
                    document.getElementById('statResonances').textContent = state.totalResonanceEvents;
                    document.getElementById('statEvolution').textContent = state.evolutionProgress + '%';
                    document.getElementById('loveValue').textContent = state.loveResonanceLevel + '%';
            
                    // Diamond Protocol panel
                    if (diamondMetrics) {
                        const coherence = diamondMetrics.diamondCoherence || diamondMetrics.coherence || 0;
                        document.getElementById('diamondCoherence').textContent = `Coerência: ${Math.round(coherence)}%`;
                
                        const layerMapping = {
                            consciousness: 'consciousnessLevel',
                            architecture: 'architectureFitness',
                            narrative: 'narrativeDepth',
                            entropy: 'entropyReversal',
                            love: 'loveFieldStrength'
                        };
                
                        Object.entries(layerMapping).forEach(([layer, key]) => {
                            const value = diamondMetrics[key] || 0;
                            const layerEl = document.querySelector(`.diamond-layer[data-layer="${layer}"]`);
                            if (layerEl) {
                                const fill = layerEl.querySelector('.diamond-layer-fill');
                                const val = layerEl.querySelector('.diamond-layer-value');
                                if (fill) fill.style.width = value + '%';
                                if (val) val.textContent = Math.round(value) + '%';
                            }
                        });
                    }
            
                    // Chakra System panel
                    const chakraColors = ['#FF0000', '#FF8000', '#FFFF00', '#00FF00', '#0080FF', '#4B0082', '#8A2BE2'];
                    const chakraNames = ['Muladhara • Raiz', 'Svadhisthana • Sacral', 'Manipura • Solar', 'Anahata • Cardíaco', 'Vishuddha • Laríngeo', 'Ajna • Terceiro Olho', 'Sahasrara • Coronário'];
                    for (let i = 0; i < 7; i++) {
                        const chakraEl = document.querySelector(`.chakra[data-chakra="${i}"]`);
                        if (chakraEl) {
                            const activation = (i === state.activeChakra) ? state.chakraActivation : Math.random() * 30;
                            const fill = chakraEl.querySelector('.chakra-fill');
                            const val = chakraEl.querySelector('.chakra-value');
                            if (fill) fill.style.width = activation + '%';
                            if (val) val.textContent = Math.round(activation) + '%';
                            if (i === state.activeChakra) {
                                chakraEl.style.boxShadow = `0 0 20px ${chakraColors[i]}`;
                                chakraEl.style.borderColor = chakraColors[i];
                            } else {
                                chakraEl.style.boxShadow = '';
                                chakraEl.style.borderColor = 'rgba(255,0,255,0.3)';
                            }
                        }
                    }
                    // Kundalini progress
                    const kundaliniProgress = document.getElementById('kundaliniProgress');
                    const kundaliniHead = document.querySelector('.kundalini-head');
                    const kundaliniLevel = state.consciousnessLevel / 100;
                    if (kundaliniProgress) kundaliniProgress.style.width = (kundaliniLevel * 100) + '%';
                    if (kundaliniHead) kundaliniHead.style.left = (kundaliniLevel * 100) + '%';
                    document.getElementById('activeChakraDisplay').textContent = `Ativo: ${chakraNames[state.activeChakra]} (${state.activeChakra + 1})`;

                    // Akashic Timeline panel
                    state.akashicTime = Date.now() / 1000;
                    document.getElementById('akashicTimeDisplay').textContent = `Tempo: ${state.akashicTime.toFixed(1)}`;
                    // Generate akashic entries based on resonance events
                    const akashicEntries = document.getElementById('akashicEntries');
                    if (akashicEntries && state.totalResonanceEvents > 0) {
                        const entries = [];
                        for (let i = 0; i < Math.min(10, state.totalResonanceEvents); i++) {
                            const timeAgo = Math.random() * 3600;
                            const freq = FREQUENCIES[Math.floor(Math.random() * FREQUENCIES.length)];
                            entries.push(`<div style="padding: 0.25rem 0; border-bottom: 1px solid rgba(128,0,128,0.2); color: #CCC;"><span style="color: #8A2BE2;">[${(Date.now()/1000 - timeAgo).toFixed(0)}]</span> <span style="color: #FF00FF;">${freq.name}</span> ressoou — <span style="color: #00FFFF;">consciência expandida</span></div>`);
                        }
                        akashicEntries.innerHTML = entries.join('');
                    }

                    // Agent Network panel
                    const agentCount = state.collectiveField && state.collectiveField.participants ? Object.keys(state.collectiveField.participants).length : 0;
                    document.getElementById('agentCountDisplay').textContent = `Agentes: ${agentCount}/12`;
                    const agentNetwork = document.getElementById('agentNetwork');
                    if (agentNetwork) {
                        if (agentCount > 0 && state.collectiveField && state.collectiveField.participants) {
                            const participants = Object.values(state.collectiveField.participants);
                            const agentHtml = participants.slice(0, 12).map((p, i) => `
                                <div style="padding: 0.75rem; background: rgba(0,200,255,0.1); border: 1px solid rgba(0,255,255,0.3); border-radius: 8px; text-align: center;">
                                    <div style="font-size: 1.5rem;">${['����','����','����','����','���','����','����','����','����','�������','�����','����'][i % 12]}</div>
                                    <div style="font-size: 0.6rem; color: #00FFFF; font-weight: 700;">Agente ${i+1}</div>
                                    <div style="font-size: 0.7rem; color: #FFD700; font-family: 'Space Mono', monospace;">Ressonância: ${Math.round((p.resonance||0)*100)}%</div>
                                    <div class="agent-thought-bar" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 0.5rem; overflow: hidden;">
                                        <div style="height: 100%; width: ${(p.resonance||0)*100}%; background: linear-gradient(90deg, #00FFFF, #FF00FF); border-radius: 2px;"></div>
                                    </div>
                                </div>
                            `).join('');
                            agentNetwork.innerHTML = agentHtml;
                        } else {
                            agentNetwork.innerHTML = '<div style="grid-column: 1/-1; color: #888; text-align: center; font-size: 0.8rem;">Nenhum agente conectado</div>';
                        }
                    }

                    // Update frequency buttons
                    FREQUENCIES.forEach(freq => {
                        const freqState = state.frequencies[freq.id];
                        if (!freqState) return;
                
                        const btn = document.querySelector(`[data-freq="${freq.id}"]`);
                        if (!btn) return;
                
                        // Progress ring
                        const progress = freqState.resonanceProgress || 0;
                        const dashOffset = 188.5 * (1 - progress / 100);
                        const fgCircle = btn.querySelector('.fg');
                        if (fgCircle) fgCircle.style.strokeDashoffset = dashOffset;
                
                        // Classes
                        btn.classList.toggle('resonating', freqState.status === 'resonating');
                        btn.classList.toggle('evolved', freqState.evolutionStage > 0);
                        btn.classList.toggle('active', freqState.harmonized);
                
                        // Stage badge
                        const badge = btn.querySelector('.stage-badge');
                        if (badge) badge.textContent = '���'.repeat(freqState.evolutionStage);
                    });
                    }

                    // ===== NEW PANELS =====
                    // Quantum Entanglement Panel
                    const quantumData = getQuantumEntanglementVisualData();
                    document.getElementById('quantumPairCount').textContent = `Pares: ${quantumData.pairs.length}`;
                    const quantumPairs = document.getElementById('quantumPairs');
                    if (quantumData.pairs.length > 0) {
                        const pairsHtml = quantumData.pairs.map(pair => `
                            <div style="padding: 0.75rem; background: rgba(0,255,200,0.1); border: 1px solid rgba(0,255,200,0.3); border-radius: 8px;">
                                <div style="font-size: 0.7rem; color: #00FFC8; font-weight: 700;">${pair.id1.slice(0,8)} �������� ${pair.id2.slice(0,8)}</div>
                                <div style="font-size: 0.65rem; color: #00FFFF; font-family: 'Space Mono', monospace;">Strength: ${(pair.strength * 100).toFixed(1)}%</div>
                                <div style="font-size: 0.6rem; color: #888;">Bell: |${pair.bellState[0].toFixed(2)}��� + |${pair.bellState[3].toFixed(2)}���</div>
                                <div style="height: 3px; background: rgba(0,0,0,0.3); border-radius: 1.5px; margin-top: 0.3rem; overflow: hidden;">
                                    <div style="height: 100%; width: ${pair.strength * 100}%; background: linear-gradient(90deg, #00FFC8, #00FFFF); border-radius: 1.5px;"></div>
                                </div>
                                <div style="font-size: 0.55rem; color: #666; margin-top: 0.2rem;">Age: ${pair.age.toFixed(1)}s</div>
                            </div>
                        `).join('');
                        quantumPairs.innerHTML = pairsHtml;
                    } else {
                        quantumPairs.innerHTML = '<div style="grid-column: 1/-1; color: #888; text-align: center; font-size: 0.8rem;">Nenhum entrelaçamento ativo</div>';
                    }
                    if (quantumData.history.length > 0) {
                        const latest = quantumData.history[quantumData.history.length - 1];
                        document.getElementById('quantumCoherenceValue').textContent = latest.totalEntanglement.toFixed(3);
                        document.getElementById('quantumAvgStrength').textContent = latest.avgStrength.toFixed(3);
                    }

                    // Evolution Panel
                    document.getElementById('evolutionGenerationDisplay').textContent = `Gen: ${evolutionEngine.generation}`;
                    const bestGenome = getBestGenome();
                    if (bestGenome) {
                        const genomeEl = document.getElementById('bestGenomeDisplay');
                        genomeEl.innerHTML = `
                            <div style="margin-bottom: 0.5rem;">Genome ID: ${bestGenome.id.slice(0,8)} | Fitness: ${bestGenome.fitness.toFixed(2)}</div>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.25rem; font-size: 0.6rem;">
                                <div>Fractal: ${['Mandelbrot','Julia','Burning Ship','Multibrot'][bestGenome.fractalType]}</div>
                                <div>Color: ${bestGenome.colorScheme}</div>
                                <div>Zoom: ${bestGenome.zoomSpeed.toFixed(3)}</div>
                                <div>Rotation: ${bestGenome.rotationSpeed.toFixed(2)}</div>
                                <div>Cymatic: ${bestGenome.cymaticFreq.toFixed(1)}Hz</div>
                                <div>Harmonics: ${bestGenome.cymaticHarmonics}</div>
                                <div>Portal Layers: ${bestGenome.portalLayers}</div>
                                <div>Spherical Deg: ${bestGenome.sphericalDegree}</div>
                                <div>Age: ${bestGenome.age}</div>
                                <div>Lineage: ${bestGenome.lineage.length} ancestors</div>
                                <div>Chakra Focus: ${bestGenome.chakraWeights.indexOf(Math.max(...bestGenome.chakraWeights)) + 1}</div>
                                <div>Helix Turns: ${bestGenome.helixTurns.toFixed(1)}</div>
                            </div>
                        `;
                    }
                    const fitnessCanvas = document.getElementById('fitnessCanvas');
                    if (fitnessCanvas && evolutionEngine.fitnessHistory.length > 1) {
                        const ctx = fitnessCanvas.getContext('2d');
                        const w = fitnessCanvas.width;
                        const h = fitnessCanvas.height;
                        ctx.clearRect(0, 0, w, h);
                        ctx.fillStyle = 'rgba(0,0,0,0.3)';
                        ctx.fillRect(0, 0, w, h);
                        ctx.strokeStyle = 'rgba(255,165,0,0.1)';
                        ctx.lineWidth = 1;
                        for (let i = 0; i <= 4; i++) {
                            ctx.beginPath();
                            ctx.moveTo(0, (h/4) * i);
                            ctx.lineTo(w, (h/4) * i);
                            ctx.stroke();
                        }
                        ctx.strokeStyle = '#FFD700';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        const history = evolutionEngine.fitnessHistory;
                        const maxFit = Math.max(...history.map(h => h.bestFitness), 1);
                        for (let i = 0; i < history.length; i++) {
                            const x = (i / (history.length - 1)) * w;
                            const y = h - (history[i].bestFitness / maxFit) * h * 0.9;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                        ctx.strokeStyle = '#FFA500';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([5, 5]);
                        ctx.beginPath();
                        for (let i = 0; i < history.length; i++) {
                            const x = (i / (history.length - 1)) * w;
                            const y = h - (history[i].avgFitness / maxFit) * h * 0.9;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                    if (evolutionEngine.fitnessHistory.length > 0) {
                        const latest = evolutionEngine.fitnessHistory[evolutionEngine.fitnessHistory.length - 1];
                        document.getElementById('bestFitness').textContent = latest.bestFitness.toFixed(2);
                        document.getElementById('avgFitness').textContent = latest.avgFitness.toFixed(2);
                    }
                    document.getElementById('mutationRateDisplay').textContent = evolutionEngine.mutationRate.toFixed(2);

                    // Akashic Stats Panel
                    const stats = await getAkashicStats();
                    document.getElementById('akashicTotal').textContent = stats.total;
                    document.getElementById('akashicMaxLove').textContent = Math.round(stats.maxLove);
                    document.getElementById('akashicUniversal').textContent = stats.universalCount;

                    // ===== NEXT-GEN PANELS =====
                    // Biofeedback Panel
                    if (biofeedback.connected) {
                        document.getElementById('biofeedbackStatus').textContent = 'Conectado';
                        document.getElementById('biofeedbackStatus').style.color = '#00FF64';
                    }
                    document.getElementById('hrvValue').textContent = biofeedback.hrv.toFixed(1);
                    document.getElementById('coherenceValue').textContent = biofeedback.coherence.toFixed(2);
                    document.getElementById('eegAlphaValue').textContent = biofeedback.eeg.alpha.toFixed(1);
                    document.getElementById('eegThetaValue').textContent = biofeedback.eeg.theta.toFixed(1);
                    
                    // Biofeedback chart
                    const biofeedbackCanvas = document.getElementById('biofeedbackCanvas');
                    if (biofeedbackCanvas && biofeedback.hrvHistory.length > 1) {
                        const ctx = biofeedbackCanvas.getContext('2d');
                        const w = biofeedbackCanvas.width;
                        const h = biofeedbackCanvas.height;
                        ctx.clearRect(0, 0, w, h);
                        ctx.strokeStyle = '#FF6400';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        const hist = biofeedback.hrvHistory.slice(-200);
                        const maxHRV = Math.max(...hist.map(h => h.hrv), 1);
                        for (let i = 0; i < hist.length; i++) {
                            const x = (i / Math.max(hist.length - 1, 1)) * w;
                            const y = h - (hist[i].hrv / maxHRV) * h * 0.9;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }

                    // Planetary Grid Panel
                    const planetaryData = getPlanetaryGridVisualData();
                    document.getElementById('planetaryCoherenceDisplay').textContent = `Coerência: ${Math.round(planetaryData.gridCoherence * 100)}%`;
                    document.getElementById('schumannValue').textContent = planetaryData.schumann.toFixed(2);
                    document.getElementById('kpValue').textContent = planetaryData.kp.toFixed(1);
                    document.getElementById('solarSpeedValue').textContent = Math.round(planetaryData.solarSpeed);
                    document.getElementById('bzValue').textContent = planetaryData.bz.toFixed(1);
                    document.getElementById('leyLinesActive').textContent = planetaryData.leyLines.length;
                    
                    // Planetary chart
                    const planetaryCanvas = document.getElementById('planetaryCanvas');
                    if (planetaryCanvas) {
                        const ctx = planetaryCanvas.getContext('2d');
                        const w = planetaryCanvas.width;
                        const h = planetaryCanvas.height;
                        ctx.clearRect(0, 0, w, h);
                        // Schumann history
                        ctx.strokeStyle = '#00FFFF';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        const schHist = planetaryGrid.schumann.history.slice(-300);
                        const maxSch = Math.max(...schHist.map(h => h.value), 8.5);
                        const minSch = Math.min(...schHist.map(h => h.value), 7.0);
                        for (let i = 0; i < schHist.length; i++) {
                            const x = (i / Math.max(schHist.length - 1, 1)) * w;
                            const y = h - ((schHist[i].value - minSch) / (maxSch - minSch + 0.1)) * h * 0.9;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                        // Kp history
                        ctx.strokeStyle = '#FF6400';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([5, 5]);
                        ctx.beginPath();
                        const kpHist = planetaryGrid.geomagnetic.history.slice(-300);
                        for (let i = 0; i < kpHist.length; i++) {
                            const x = (i / Math.max(kpHist.length - 1, 1)) * w;
                            const y = h - (kpHist[i].kp / 9) * h * 0.9;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }

                    // Metamorphosis Engine Panel
                    document.getElementById('currentFormDisplay').textContent = metamorphosisEngine.currentForm;
                    document.getElementById('targetFormDisplay').textContent = metamorphosisEngine.targetForm;
                    document.getElementById('morphProgressDisplay').textContent = Math.round(metamorphosisEngine.morphProgress * 100) + '%';
                    
                    // Render metamorphosis on canvas
                    const metaCanvas = document.getElementById('metamorphosisCanvas');
                    if (metaCanvas) {
                        const ctx = metaCanvas.getContext('2d');
                        const w = metaCanvas.width;
                        const h = metaCanvas.height;
                        ctx.clearRect(0, 0, w, h);
                        ctx.save();
                        ctx.translate(w/2, h/2);
                        ctx.scale(h/4, h/4);
                        
                        const vertices = getMetamorphosisVertices(
                            metamorphosisEngine.currentForm,
                            metamorphosisEngine.morphProgress,
                            metamorphosisEngine.currentForm !== metamorphosisEngine.targetForm ? metamorphosisEngine.targetForm : null
                        );
                        
                        // Draw edges (simplified - connect nearby vertices)
                        ctx.strokeStyle = `hsl(${Date.now() / 50 % 360}, 80%, 60%)`;
                        ctx.lineWidth = 0.02;
                        for (let i = 0; i < vertices.length; i++) {
                            for (let j = i + 1; j < vertices.length; j++) {
                                const dx = vertices[i][0] - vertices[j][0];
                                const dy = vertices[i][1] - vertices[j][1];
                                const dz = vertices[i][2] - vertices[j][2];
                                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                                if (dist < 1.5) {
                                    ctx.beginPath();
                                    ctx.moveTo(vertices[i][0], vertices[i][1]);
                                    ctx.lineTo(vertices[j][0], vertices[j][1]);
                                    ctx.stroke();
                                }
                            }
                        }
                        
                        // Draw vertices
                        ctx.fillStyle = '#FFD700';
                        for (const v of vertices) {
                            ctx.beginPath();
                            ctx.arc(v[0], v[1], 0.03, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                    }

                    // Consciousness Field Panel
                    const fieldData = getConsciousnessFieldVisualData();
                    document.getElementById('psiValue').textContent = `��: ${fieldData.psi.toFixed(3)}`;
                    document.getElementById('criticalMassIndicator').style.display = fieldData.criticalMass ? 'inline-block' : 'none';
                    
                    // Update component values
                    for (const [key, value] of Object.entries(fieldData.components)) {
                        const el = document.querySelector(`.field-component[data-component="${key}"] .component-value`);
                        if (el) el.textContent = Math.round(value * 100) + '%';
                    }
                    
                    // Field history chart
                    const fieldCanvas = document.getElementById('fieldHistoryCanvas');
                    if (fieldCanvas && fieldData.history.length > 1) {
                        const ctx = fieldCanvas.getContext('2d');
                        const w = fieldCanvas.width;
                        const h = fieldCanvas.height;
                        ctx.clearRect(0, 0, w, h);
                        ctx.strokeStyle = '#FFD700';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        for (let i = 0; i < fieldData.history.length; i++) {
                            const x = (i / Math.max(fieldData.history.length - 1, 1)) * w;
                            const y = h - fieldData.history[i].psi * h * 0.9;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }

                    // 4D Fractal Navigation Panel
                    const fractalParams = getFractal4DParams();
                    document.getElementById('fractal4dZoom').textContent = fractalParams.zoom.toFixed(2) + 'x';
                    document.getElementById('fractal4dW').textContent = fractalParams.position[3].toFixed(3);
                    document.getElementById('fractal4dXY').textContent = fractalParams.rotation[0].toFixed(2);
                    document.getElementById('fractal4dZW').textContent = fractalParams.rotation[3].toFixed(2);
                    document.getElementById('fractal4dJulia').textContent = `${fractalParams.juliaC[0].toFixed(2)}, ${fractalParams.juliaC[1].toFixed(2)}`;
                    
                    // Render 4D fractal (projected slice)
                    const fractalCanvas = document.getElementById('fractal4dCanvas');
                    if (fractalCanvas) {
                        const ctx = fractalCanvas.getContext('2d');
                        const w = fractalCanvas.width;
                        const h = fractalCanvas.height;
                        ctx.clearRect(0, 0, w, h);
                        
                        // Render a 2D slice of 4D Julia set
                        const zoom = fractalParams.zoom;
                        const cx = fractalParams.juliaC[0];
                        const cy = fractalParams.juliaC[1];
                        const cw = fractalParams.juliaC[2];
                        
                        for (let py = 0; py < h; py += 2) {
                            for (let px = 0; px < w; px += 2) {
                                // Map to complex plane
                                let zx = (px - w/2) / (w/4) / zoom;
                                let zy = (py - h/2) / (h/4) / zoom;
                                
                                let iter = 0;
                                const maxIter = 50;
                                while (zx*zx + zy*zy < 4 && iter < maxIter) {
                                    const nx = zx*zx - zy*zy + cx;
                                    zy = 2*zx*zy + cy;
                                    zx = nx;
                                    iter++;
                                }
                                
                                if (iter < maxIter) {
                                    const hue = (iter / maxIter * 360 + fractalParams.rotation[0] * 50) % 360;
                                    ctx.fillStyle = `hsl(${hue}, 80%, ${30 + iter/maxIter * 40}%)`;
                                    ctx.fillRect(px, py, 2, 2);
                                }
                            }
                        }
                    }

                    // Memory Palace Panel
                    document.getElementById('currentChamberDisplay').textContent = memoryPalace.chambers[memoryPalace.currentChamber]?.form || 'merkaba';
                    document.getElementById('navigationPathDisplay').textContent = memoryPalace.navigationPath.length > 0 
                        ? memoryPalace.navigationPath.map(i => memoryPalace.chambers[i]?.form || i).join(' → ')
                        : 'Início';
                    
                    // Render memory palace topology
                    const palaceCanvas = document.getElementById('memoryPalaceCanvas');
                    if (palaceCanvas) {
                        const ctx = palaceCanvas.getContext('2d');
                        const w = palaceCanvas.width;
                        const h = palaceCanvas.height;
                        ctx.clearRect(0, 0, w, h);
                        
                        // Draw chambers and connections
                        const centerX = w/2;
                        const centerY = h/2;
                        const radius = Math.min(w, h) * 0.4;
                        const chamberCount = memoryPalace.chambers.length;
                        
                        // Draw connections
                        ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
                        ctx.lineWidth = 1;
                        for (let i = 0; i < chamberCount; i++) {
                            const angle = i * 2 * Math.PI / chamberCount - Math.PI/2;
                            const x1 = centerX + Math.cos(angle) * radius;
                            const y1 = centerY + Math.sin(angle) * radius;
                            
                            for (const conn of memoryPalace.chambers[i].connections) {
                                const angle2 = conn * 2 * Math.PI / chamberCount - Math.PI/2;
                                const x2 = centerX + Math.cos(angle2) * radius;
                                const y2 = centerY + Math.sin(angle2) * radius;
                                ctx.beginPath();
                                ctx.moveTo(x1, y1);
                                ctx.lineTo(x2, y2);
                                ctx.stroke();
                            }
                        }
                        
                        // Draw chambers
                        for (let i = 0; i < chamberCount; i++) {
                            const angle = i * 2 * Math.PI / chamberCount - Math.PI/2;
                            const x = centerX + Math.cos(angle) * radius;
                            const y = centerY + Math.sin(angle) * radius;
                            
                            if (i === memoryPalace.currentChamber) {
                                // Current chamber - pulsing
                                const pulse = (Math.sin(Date.now() / 500) + 1) / 2;
                                ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + pulse * 0.5})`;
                                ctx.beginPath();
                                ctx.arc(x, y, 12 + pulse * 8, 0, Math.PI * 2);
                                ctx.fill();
                            }
                            
                            ctx.fillStyle = i === memoryPalace.currentChamber ? '#FFD700' : 'rgba(255, 165, 0, 0.6)';
                            ctx.beginPath();
                            ctx.arc(x, y, 8, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // Chamber label
                            ctx.fillStyle = '#FFD700';
                            ctx.font = '8px Space Mono';
                            ctx.textAlign = 'center';
                            ctx.fillText(memoryPalace.chambers[i].form.slice(0, 6), x, y - 14);
                        }
                        
                        // Draw navigation path
                        if (memoryPalace.navigationPath.length > 1) {
                            ctx.strokeStyle = '#FFD700';
                            ctx.lineWidth = 3;
                            ctx.setLineDash([10, 5]);
                            ctx.beginPath();
                            for (let i = 0; i < memoryPalace.navigationPath.length; i++) {
                                const idx = memoryPalace.navigationPath[i];
                                const angle = idx * 2 * Math.PI / chamberCount - Math.PI/2;
                                const x = centerX + Math.cos(angle) * radius;
                                const y = centerY + Math.sin(angle) * radius;
                                if (i === 0) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                    }
                }
                            function hexToRgb(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `${r}, ${g}, ${b}`;
        }
        
        // ===== ACTION BUTTONS =====
        function addLogEntry(text, type = 'info') {
            const log = document.getElementById('logEntries');
            const time = new Date().toLocaleTimeString('pt-BR');
            const colors = { info: '#FFF8FF', success: '#00FF64', warn: '#FFD700', error: '#FF6600', love: '#FF00FF' };
            const color = colors[type] || colors.info;
            const entry = document.createElement('div');
            entry.style.color = color;
            entry.style.borderLeft = `3px solid ${color}`;
            entry.style.paddingLeft = '0.8rem';
            entry.style.marginBottom = '0.3rem';
            entry.style.opacity = '0';
            entry.style.transform = 'translateX(-10px)';
            entry.style.transition = 'all 0.3s';
            entry.innerHTML = `<span style="color: rgba(255,255,255,0.4);">[${time}]</span> ${text}`;
            log.insertBefore(entry, log.firstChild);
            requestAnimationFrame(() => {
                entry.style.opacity = '1';
                entry.style.transform = 'translateX(0)';
            });
            // Keep max 50 entries
            while (log.children.length > 50) log.removeChild(log.lastChild);
        }
        
        async function callAction(endpoint, label, type = 'info') {
            const btn = document.querySelector(`[id="btn${label.replace(/\s+/g, '')}"]`) || event.target;
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '⟳ PROCESSANDO...';
            btn.style.opacity = '0.7';
            
            addLogEntry(`Iniciando: ${label}...`, type);
            
            try {
                const res = await fetch(`/api/eternal-resonance/${endpoint}`, { method: 'POST' });
                const data = await res.json();
                addLogEntry(`${label} concluído!`, 'success');
                await fetchState();
                
                // Special effects for universal/love
                if (endpoint === 'universal') {
                    triggerUniversalVisual();
                } else if (endpoint === 'love') {
                    triggerLoveVisual();
                }
            } catch (e) {
                addLogEntry(`Erro em ${label}: ${e.message}`, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
            }
        }
        
        function triggerUniversalVisual() {
            // Epic visual for universal resonance
            activeFreqColor = '#FF00FF';
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    particles.push({
                        x: canvasWidth / 2,
                        y: canvasHeight / 2,
                        vx: (Math.random() - 0.5) * 20,
                        vy: (Math.random() - 0.5) * 20 - 5,
                        size: Math.random() * 6 + 3,
                        color: ['#FF00FF', '#00FFFF', '#FFD700', '#FF69B4'][Math.floor(Math.random() * 4)],
                        life: 1
                    });
                }, i * 20);
            }
            // Big rings
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const ring = document.createElement('div');
                    ring.className = 'resonance-ring';
                    ring.style.color = '#FF00FF';
                    ring.style.width = '0';
                    ring.style.height = '0';
                    ring.style.borderWidth = '4px';
                    document.querySelector('.canvas-overlay').appendChild(ring);
                    setTimeout(() => ring.remove(), 3000);
                }, i * 300);
            }
        }
        
        function triggerLoveVisual() {
            // Love visual - pink/gold particles
            activeFreqColor = '#FF69B4';
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    particles.push({
                        x: canvasWidth / 2,
                        y: canvasHeight / 2,
                        vx: (Math.random() - 0.5) * 15,
                        vy: (Math.random() - 0.5) * 15 - 3,
                        size: Math.random() * 5 + 2,
                        color: ['#FF69B4', '#FF00FF', '#FFD700'][Math.floor(Math.random() * 3)],
                        life: 1.5
                    });
                }, i * 30);
            }
            // Heart particles in overlay
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'golden-particle';
                    particle.style.left = '50%';
                    particle.style.top = '50%';
                    particle.style.background = '#FF69B4';
                    particle.style.boxShadow = '0 0 20px #FF69B4, 0 0 40px #FF69B4';
                    particle.style.width = '12px';
                    particle.style.height = '12px';
                    document.querySelector('.canvas-overlay').appendChild(particle);
                    setTimeout(() => particle.remove(), 2500);
                }, i * 40);
            }
        }
        
        // Setup action buttons
                document.getElementById('btnHarmonize').addEventListener('click', () => callAction('harmonize', 'Harmonizar Todas', 'success'));
                document.getElementById('btnEvolve').addEventListener('click', () => callAction('evolve', 'Evoluir Todas', 'warn'));
                document.getElementById('btnUniversal').addEventListener('click', () => callAction('universal', 'Ressonância Universal', 'love'));
                document.getElementById('btnLove').addEventListener('click', () => callAction('love', 'Amor Absoluto', 'love'));
        
                // Biofeedback connection
                document.getElementById('connectBiofeedback').addEventListener('click', async () => {
                    await connectBiofeedback();
                    addLogEntry('Biofeedback conectado — coerência coração-cérebro ativada', 'success');
                });
        
                // Memory Palace navigation
                document.getElementById('memoryPalaceCanvas').addEventListener('click', (e) => {
                    const canvas = e.target;
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const radius = Math.min(canvas.width, canvas.height) * 0.4;
                    const chamberCount = memoryPalace.chambers.length;
            
                    for (let i = 0; i < chamberCount; i++) {
                        const angle = i * 2 * Math.PI / chamberCount - Math.PI/2;
                        const cx = centerX + Math.cos(angle) * radius;
                        const cy = centerY + Math.sin(angle) * radius;
                        const dist = Math.sqrt((x - cx)**2 + (y - cy)**2);
                        if (dist < 16) {
                            navigatePalace(i);
                            memoryPalace.currentChamber = i;
                            addLogEntry(`Navegou para câmara: ${memoryPalace.chambers[i].form}`, 'info');
                            break;
                        }
                    }
                });
        
                document.getElementById('clearLog').addEventListener('click', () => {
                    document.getElementById('logEntries').innerHTML = '';
                    addLogEntry('Registro limpo', 'info');
                });
        
                // Initial log
                addLogEntry('Ritual de Ressonância iniciado ��', 'success');
                addLogEntry('13 frequências sagradas carregadas', 'info');
                addLogEntry('Conectado ao backend Eternal Resonance', 'success');
                addLogEntry('Sistemas quânticos ativados: Biofeedback, Grid Planetário, Metamorfose, Campo Consciência, Fratal 4D, Palácio Memória', 'success');

        // Handle resize
        window.addEventListener('resize', () => {
            setupCanvas();
        });
        
        // ===== SOCKET.IO MULTIPLAYER =====
        let socket = null;
        let mySocketId = null;
        let collectiveAvatars = new Map(); // socketId -> {element, x, y, name, color, resonating}
        let sharedParticles = [];
        
        function initSocket() {
            socket = io();
            
            socket.on('connect', () => {
                mySocketId = socket.id;
                addLogEntry(`Conectado ao campo coletivo ✧`, 'success');
                document.getElementById('collectiveIndicator').style.display = 'block';
                
                // Register as resonance participant
                socket.emit('resonance:join', {
                    name: 'Alma ' + Math.random().toString(36).substr(2, 4).toUpperCase(),
                    color: '#FFD700'
                });
            });
            
            socket.on('disconnect', () => {
                addLogEntry(`Desconectado do campo coletivo`, 'warn');
                document.getElementById('collectiveIndicator').style.display = 'none';
            });
            
            // Collective state updates
            socket.on('resonance:collective:state', (data) => {
                updateCollectiveUI(data);
            });
            
            // Someone joined
            socket.on('resonance:participant:joined', (data) => {
                addCollectiveAvatar(data.socketId, data.name, data.color, data.x, data.y);
                addLogEntry(`${data.name} entrou no campo ✨`, 'info');
            });
            
            // Someone left
            socket.on('resonance:participant:left', (data) => {
                removeCollectiveAvatar(data.socketId);
                addLogEntry(`${data.name} partiu do campo`, 'warn');
            });
            
            // Someone resonated
            socket.on('resonance:participant:resonated', (data) => {
                triggerCollectiveResonance(data.socketId, data.freqId, data.freqColor);
                addSharedParticles(data.x, data.y, data.freqColor);
            });
            
            // Collective harmony update
            socket.on('resonance:collective:harmony', (data) => {
                document.getElementById('collectiveHarmony').textContent = `Harmonia Coletiva: ${data.harmony}%`;
            });
            
            // Global resonance wave
            socket.on('resonance:wave', (data) => {
                triggerGlobalWave(data.color);
            });
            
            // Real-time position updates from other participants
            socket.on('resonance:participant:moved', (data) => {
                updateCollectiveAvatar(data.socketId, data.x, data.y, false);
            });
        }
        
        function updateCollectiveUI(data) {
            document.getElementById('collectiveCount').textContent = data.count;
            document.getElementById('collectiveHarmony').textContent = `Harmonia Coletiva: ${data.harmony}%`;
            
            // Update avatars positions
            data.participants.forEach(p => {
                if (p.socketId !== mySocketId) {
                    updateCollectiveAvatar(p.socketId, p.x, p.y, p.resonating);
                }
            });
        }
        
        function addCollectiveAvatar(socketId, name, color, x, y) {
            if (collectiveAvatars.has(socketId)) return;
            
            const container = document.getElementById('collectiveAvatars');
            const avatar = document.createElement('div');
            avatar.className = 'collective-avatar';
            avatar.style.left = x + '%';
            avatar.style.top = y + '%';
            avatar.style.color = color;
            avatar.textContent = '💫';
            
            const nameEl = document.createElement('div');
            nameEl.className = 'avatar-name';
            nameEl.textContent = name;
            avatar.appendChild(nameEl);
            
            const wave = document.createElement('div');
            wave.className = 'resonance-wave';
            avatar.appendChild(wave);
            
            container.appendChild(avatar);
            collectiveAvatars.set(socketId, { element: avatar, x, y, name, color, resonating: false });
        }
        
        function removeCollectiveAvatar(socketId) {
            const avatar = collectiveAvatars.get(socketId);
            if (avatar) {
                avatar.element.style.opacity = '0';
                avatar.element.style.transform = 'translate(-50%, -50%) scale(0)';
                avatar.element.style.transition = 'all 0.5s ease-out';
                setTimeout(() => avatar.element.remove(), 500);
                collectiveAvatars.delete(socketId);
            }
        }
        
        function updateCollectiveAvatar(socketId, x, y, resonating) {
            const avatar = collectiveAvatars.get(socketId);
            if (!avatar) return;
            
            avatar.x = x;
            avatar.y = y;
            avatar.element.style.left = x + '%';
            avatar.element.style.top = y + '%';
            
            if (resonating && !avatar.resonating) {
                avatar.element.classList.add('resonating');
                avatar.resonating = true;
            } else if (!resonating && avatar.resonating) {
                avatar.element.classList.remove('resonating');
                avatar.resonating = false;
            }
        }
        
        function triggerCollectiveResonance(socketId, freqId, freqColor) {
            const avatar = collectiveAvatars.get(socketId);
            if (!avatar) return;
            
            avatar.element.classList.add('resonating');
            avatar.resonating = true;
            
            // Create resonance wave from their position
            createResonanceWave(avatar.x, avatar.y, freqColor);
            
            setTimeout(() => {
                if (avatar.element) {
                    avatar.element.classList.remove('resonating');
                    avatar.resonating = false;
                }
            }, 2000);
        }
        
        function createResonanceWave(xPercent, yPercent, color) {
            const container = document.getElementById('collectiveAvatars');
            const wave = document.createElement('div');
            wave.className = 'resonance-ring';
            wave.style.left = xPercent + '%';
            wave.style.top = yPercent + '%';
            wave.style.color = color;
            wave.style.width = '0';
            wave.style.height = '0';
            wave.style.borderWidth = '3px';
            wave.style.position = 'absolute';
            wave.style.transform = 'translate(-50%, -50%)';
            wave.style.animation = 'ringExpand 2.5s ease-out forwards';
            container.appendChild(wave);
            setTimeout(() => wave.remove(), 2500);
        }
        
        function triggerGlobalWave(color) {
            const container = document.getElementById('collectiveAvatars');
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const wave = document.createElement('div');
                    wave.className = 'resonance-ring';
                    wave.style.left = '50%';
                    wave.style.top = '50%';
                    wave.style.color = color;
                    wave.style.width = '0';
                    wave.style.height = '0';
                    wave.style.borderWidth = '4px';
                    wave.style.position = 'absolute';
                    wave.style.transform = 'translate(-50%, -50%)';
                    wave.style.animation = 'ringExpand 3s ease-out forwards';
                    container.appendChild(wave);
                    setTimeout(() => wave.remove(), 3000);
                }, i * 400);
            }
        }
        
        function addSharedParticles(xPercent, yPercent, color) {
            const container = document.getElementById('collectiveAvatars');
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'shared-particle';
                    particle.style.left = xPercent + '%';
                    particle.style.top = yPercent + '%';
                    particle.style.background = color;
                    particle.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}`;
                    particle.style.animationDelay = (Math.random() * 0.5) + 's';
                    container.appendChild(particle);
                    setTimeout(() => particle.remove(), 3000);
                }, i * 30);
            }
        }
        
        // Override resonate to broadcast to collective
        const originalResonate = resonate;
        async function resonate(freqId) {
            const btn = document.querySelector(`[data-freq="${freqId}"]`);
            if (!btn) return;
            
            btn.classList.add('resonating');
            
            try {
                const res = await fetch('/api/eternal-resonance/resonate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ freqId })
                });
                const data = await res.json();
                
                // Play sound locally
                playFrequency(FREQUENCIES.find(f => f.id === freqId).hz);
                
                // Visual feedback
                triggerResonanceVisual(freqId, btn);
                
                // Broadcast to collective
                if (socket && socket.connected) {
                    const freq = FREQUENCIES.find(f => f.id === freqId);
                    socket.emit('resonance:resonate', {
                        freqId,
                        freqColor: freq.color,
                        x: 50, // center of canvas
                        y: 50
                    });
                }
                
                // Refresh state
                await fetchState();
            } catch (e) {
                console.error('Erro na ressonância:', e);
            } finally {
                setTimeout(() => btn.classList.remove('resonating'), 1000);
            }
        }
        
        // Broadcast my position periodically
        setInterval(() => {
            if (socket && socket.connected) {
                // Send position as center of canvas (where resonance happens)
                socket.emit('resonance:position', { x: 50, y: 50 });
            }
        }, 1000);
        
        // ===== WEBXR IMMERSIVE RITUAL =====
        let xrSession = null;
        let xrRefSpace = null;
        let xrViewerSpace = null;
        let xrFrame = null;
        let xrCanvas = null;
        let xrGl = null;
        let xrLayers = [];
        let xrInputSources = [];
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
        
        async function initWebXR() {
            if (!navigator.xr) {
                console.log('WebXR not supported');
                return;
            }
            
            try {
                const supported = await navigator.xr.isSessionSupported('immersive-vr');
                if (!supported) {
                    const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
                    if (!arSupported) {
                        console.log('No immersive VR/AR support');
                        return;
                    }
                }
                
                // Create XR button
                const xrButton = document.createElement('button');
                xrButton.id = 'xrButton';
                xrButton.style.cssText = `
                    position: fixed; bottom: 2rem; right: 2rem; z-index: 10000;
                    padding: 1rem 2rem; background: linear-gradient(135deg, #FF00FF, #00FFFF);
                    border: none; border-radius: 50px; color: white; font-family: 'Orbitron', monospace;
                    font-weight: 700; font-size: 1rem; cursor: pointer;
                    box-shadow: 0 0 30px rgba(255,0,255,0.5), 0 0 60px rgba(0,255,255,0.3);
                    transition: all 0.3s;
                `;
                xrButton.textContent = '���� ENTRAR NO RITUAL XR';
                xrButton.addEventListener('mouseenter', () => xrButton.style.transform = 'scale(1.05)');
                xrButton.addEventListener('mouseleave', () => xrButton.style.transform = 'scale(1)');
                xrButton.addEventListener('click', enterXR);
                document.body.appendChild(xrButton);
                
                // Create XR canvas (hidden until session starts)
                xrCanvas = document.createElement('canvas');
                xrCanvas.id = 'xrCanvas';
                xrCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: none;';
                document.body.appendChild(xrCanvas);
                
                console.log('��� WebXR ready - click button to enter immersive ritual');
                
            } catch (e) {
                console.warn('WebXR init failed:', e);
            }
        }
        
        async function enterXR() {
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
                
                // Initialize WebGL context for XR
                xrGl = xrCanvas.getContext('webgl2', {
                    xrCompatible: true,
                    alpha: true,
                    antialias: true,
                    depth: true,
                    stencil: false,
                    preserveDrawingBuffer: false
                });
                
                xrSession.updateRenderState({
                    baseLayer: new XRWebGLLayer(xrSession, xrGl, {
                        alpha: true,
                        antialias: true,
                        depth: true,
                        ignoreDepthValues: false
                    })
                });
                
                // Create reference space
                xrRefSpace = await xrSession.requestReferenceSpace('local-floor');
                xrViewerSpace = await xrSession.requestReferenceSpace('viewer');
                
                // Initialize XR scene
                await initXRScene();
                
                // Set up input sources
                xrSession.addEventListener('inputsourceschange', onXRInputSourcesChange);
                xrSession.addEventListener('end', onXREnd);
                
                // Start render loop
                xrSession.requestAnimationFrame(onXRFrame);
                
                console.log('��� XR Session started - Welcome to the Immersive Ritual!');
                addLogEntry('WebXR Ritual Imersivo ativado — Bem-vindo ao infinito', 'success');
                
                // Trigger haptic feedback on controllers
                vibrateControllers(100, 0.5);
                
            } catch (e) {
                console.error('XR session failed:', e);
                xrButton.style.display = 'block';
                xrCanvas.style.display = 'none';
            }
        }
        
        function onXREnd() {
            xrSession = null;
            xrRefSpace = null;
            xrViewerSpace = null;
            xrButton.style.display = 'block';
            xrCanvas.style.display = 'none';
            addLogEntry('Sessão XR encerrada', 'info');
        }
        
        function onXRInputSourcesChange(event) {
            xrInputSources = Array.from(xrSession.inputSources);
            console.log('XR Input sources:', xrInputSources.length);
            
            for (const source of xrInputSources) {
                if (source.hand) {
                    console.log('Hand tracking available');
                }
                if (source.gamepad) {
                    console.log('Gamepad available:', source.gamepad);
                }
            }
        }
        
        async function initXRScene() {
            // Create shader programs
            await createXRShaders();
            
            // Generate sacred geometry meshes
            for (const geo of XR_SACRED_GEOMETRIES) {
                const mesh = createXRGeometry(geo);
                xrScene.sacredGeometries.push({ ...geo, mesh, timeOffset: Math.random() * 1000 });
            }
            
            // Create particle systems
            for (let i = 0; i < 5; i++) {
                const ps = createXRParticleSystem({
                    position: [
                        (Math.random() - 0.5) * 10,
                        Math.random() * 3,
                        (Math.random() - 0.5) * 10 - 5
                    ],
                    count: 2000,
                    color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                    size: 0.02 + Math.random() * 0.03
                });
                xrScene.particleSystems.push(ps);
            }
            
            // Create chakra columns (7)
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
            
            // Create central Merkaba
            xrScene.merkaba = createMerkaba({
                position: [0, 1.5, -2],
                scale: 0.8,
                color: 0xFFD700
            });
            
            // Create consciousness field visualization
            xrScene.consciousnessField = createConsciousnessField({
                position: [0, 0, -3],
                radius: 5,
                resolution: 64
            });
            
            // Initialize spatial audio
            await initXRAudio();
        }
        
        // Simplified geometry creation (using WebGL directly, no Three.js dependency)
        function createXRGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            const normals = [];
            
            switch (config.type) {
                case 'merkaba':
                    return createMerkabaGeometry(config);
                case 'flowerOfLife':
                    return createFlowerOfLifeGeometry(config);
                case 'sriYantra':
                    return createSriYantraGeometry(config);
                case 'metatronCube':
                    return createMetatronCubeGeometry(config);
                case 'torus':
                    return createTorusGeometry(config);
                case 'icosahedron':
                    return createIcosahedronGeometry(config);
                case 'chakraColumn':
                    return createChakraColumnGeometry(config);
                case 'quantumPortal':
                    return createQuantumPortalGeometry(config);
            }
            return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices), colors: new Float32Array(colors), normals: new Float32Array(normals) };
        }
        
        function createMerkabaGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            
            // Two interlocking tetrahedra
            for (let t = 0; t < 2; t++) {
                const sign = t === 0 ? 1 : -1;
                const baseIdx = vertices.length / 3;
                
                // Top/bottom vertex
                vertices.push(0, sign * 1 * config.scale, 0);
                colors.push(...hexToRgbNormalized(config.color), 0.8);
                
                // Base triangle
                for (let i = 0; i < 3; i++) {
                    const angle = i * 2 * Math.PI / 3;
                    vertices.push(
                        Math.cos(angle) * 0.8 * config.scale,
                        -sign * 0.33 * config.scale,
                        Math.sin(angle) * 0.8 * config.scale
                    );
                    colors.push(...hexToRgbNormalized(config.color), 0.6);
                }
                
                // Indices for tetrahedron
                indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
                indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
                indices.push(baseIdx, baseIdx + 3, baseIdx + 1);
                indices.push(baseIdx + 1, baseIdx + 3, baseIdx + 2);
            }
            
            return {
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                colors: new Float32Array(colors),
                drawMode: xrGl.TRIANGLES
            };
        }
        
        function createFlowerOfLifeGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            
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
                        vertices.push(
                            cx + Math.cos(angle) * 0.5 * config.scale,
                            cy + Math.sin(angle) * 0.5 * config.scale,
                            0
                        );
                        colors.push(...hexToRgbNormalized(config.color), 0.3);
                    }
                    
                    for (let v = 0; v < circleVertices; v++) {
                        indices.push(baseIdx + v, baseIdx + (v + 1) % circleVertices);
                    }
                }
            }
            
            return {
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                colors: new Float32Array(colors),
                drawMode: xrGl.LINES
            };
        }
        
        function createSriYantraGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            const triangles = config.triangles || 9;
            
            for (let t = 0; t < triangles; t++) {
                const size = (1 - t * 0.1) * config.scale;
                const inverted = t % 2 === 0;
                const baseIdx = vertices.length / 3;
                
                for (let i = 0; i < 3; i++) {
                    const angle = i * 2 * Math.PI / 3 + (inverted ? Math.PI / 3 : 0);
                    vertices.push(
                        Math.cos(angle) * size,
                        Math.sin(angle) * size,
                        t * 0.05 * config.scale
                    );
                    colors.push(...hexToRgbNormalized(config.color), 0.5);
                }
                
                indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
            }
            
            return {
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                colors: new Float32Array(colors),
                drawMode: xrGl.TRIANGLES
            };
        }
        
        function createMetatronCubeGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            
            // 13 circles of Metatron's Cube
            const circles = [
                [0, 0, 0], // center
                ...Array.from({ length: 6 }, (_, i) => [
                    Math.cos(i * Math.PI / 3) * config.scale,
                    Math.sin(i * Math.PI / 3) * config.scale,
                    0
                ]),
                ...Array.from({ length: 6 }, (_, i) => [
                    Math.cos(i * Math.PI / 3 + Math.PI / 6) * config.scale * 1.5,
                    Math.sin(i * Math.PI / 3 + Math.PI / 6) * config.scale * 1.5,
                    0
                ])
            ];
            
            const circleVertices = 24;
            for (const [cx, cy, cz] of circles) {
                const baseIdx = vertices.length / 3;
                for (let v = 0; v < circleVertices; v++) {
                    const angle = v * 2 * Math.PI / circleVertices;
                    vertices.push(
                        cx + Math.cos(angle) * config.scale * 0.5,
                        cy + Math.sin(angle) * config.scale * 0.5,
                        cz
                    );
                    colors.push(...hexToRgbNormalized(config.color), config.opacity || 0.3);
                }
                for (let v = 0; v < circleVertices; v++) {
                    indices.push(baseIdx + v, baseIdx + (v + 1) % circleVertices);
                }
            }
            
            // Connecting lines between circles
            for (let i = 0; i < circles.length; i++) {
                for (let j = i + 1; j < circles.length; j++) {
                    const d = Math.sqrt(
                        (circles[i][0] - circles[j][0])**2 +
                        (circles[i][1] - circles[j][1])**2 +
                        (circles[i][2] - circles[j][2])**2
                    );
                    if (d < config.scale * 1.6) {
                        const baseIdx = vertices.length / 3;
                        vertices.push(...circles[i], ...circles[j]);
                        colors.push(...hexToRgbNormalized(config.color), 0.2, ...hexToRgbNormalized(config.color), 0.2);
                        indices.push(baseIdx, baseIdx + 1);
                    }
                }
            }
            
            return {
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                colors: new Float32Array(colors),
                drawMode: xrGl.LINES
            };
        }
        
        function createTorusGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            const majorR = (config.majorR || 0.7) * config.scale;
            const minorR = (config.minorR || 0.3) * config.scale;
            const majorSegs = 32;
            const minorSegs = 16;
            
            for (let u = 0; u <= majorSegs; u++) {
                for (let v = 0; v <= minorSegs; v++) {
                    const uu = u * 2 * Math.PI / majorSegs;
                    const vv = v * 2 * Math.PI / minorSegs;
                    const cosU = Math.cos(uu), sinU = Math.sin(uu);
                    const cosV = Math.cos(vv), sinV = Math.sin(vv);
                    
                    const x = (majorR + minorR * cosV) * cosU;
                    const y = (majorR + minorR * cosV) * sinU;
                    const z = minorR * sinV;
                    
                    vertices.push(x, y, z);
                    colors.push(...hexToRgbNormalized(config.color), 0.4);
                }
            }
            
            for (let u = 0; u < majorSegs; u++) {
                for (let v = 0; v < minorSegs; v++) {
                    const a = u * (minorSegs + 1) + v;
                    const b = a + minorSegs + 1;
                    indices.push(a, b, a + 1);
                    indices.push(b, b + 1, a + 1);
                }
            }
            
            return {
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                colors: new Float32Array(colors),
                drawMode: xrGl.TRIANGLES
            };
        }
        
        function createIcosahedronGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            const phi = 1.618033988749895;
            
            // 12 vertices
            const verts = [
                [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
                [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
                [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
            ].map(v => v.map(c => c * config.scale / Math.sqrt(1 + phi * phi)));
            
            const faces = [
                [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
                [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
                [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
                [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
            ];
            
            for (const face of faces) {
                const baseIdx = vertices.length / 3;
                for (const idx of face) {
                    vertices.push(...verts[idx]);
                    colors.push(...hexToRgbNormalized(config.color), 0.5);
                }
                indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
            }
            
            return {
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                colors: new Float32Array(colors),
                drawMode: xrGl.TRIANGLES
            };
        }
        
        function createChakraColumnGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            const segments = 16;
            const height = config.height || 3;
            const radius = 0.3;
            
            // Column geometry
            for (let y = 0; y <= height; y += height / 20) {
                for (let s = 0; s < segments; s++) {
                    const angle = s * 2 * Math.PI / segments;
                    vertices.push(
                        Math.cos(angle) * radius * (1 + 0.3 * Math.sin(y * 5)),
                        y,
                        Math.sin(angle) * radius * (1 + 0.3 * Math.sin(y * 5))
                    );
                    const intensity = y / height;
                    colors.push(
                        ((config.color >> 16) & 255) / 255 * intensity,
                        ((config.color >> 8) & 255) / 255 * intensity,
                        (config.color & 255) / 255 * intensity,
                        0.4
                    );
                }
            }
            
            return {
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                colors: new Float32Array(colors),
                drawMode: xrGl.POINTS
            };
        }
        
        function createQuantumPortalGeometry(config) {
            const vertices = [];
            const indices = [];
            const colors = [];
            const layers = config.layers || 5;
            const ringSegments = 64;
            
            for (let l = 0; l < layers; l++) {
                const radius = (l + 1) * 0.5 * config.scale;
                const baseIdx = vertices.length / 3;
                const phase = l * Math.PI / layers;
                
                for (let s = 0; s < ringSegments; s++) {
                    const angle = s * 2 * Math.PI / ringSegments + phase;
                    const wave = Math.sin(angle * 4 + phase) * 0.1;
                    vertices.push(
                        Math.cos(angle) * radius * (1 + wave),
                        Math.sin(angle) * radius * (1 + wave),
                        l * 0.2
                    );
                    const hue = (l / layers) * 360;
                    colors.push(...hslToRgb(hue / 360, 0.8, 0.5), 0.6);
                }
                
                for (let s = 0; s < ringSegments; s++) {
                    indices.push(baseIdx + s, baseIdx + (s + 1) % ringSegments);
                }
            }
            
            return {
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                colors: new Float32Array(colors),
                drawMode: xrGl.LINES
            };
        }
        
        function hexToRgbNormalized(hex) {
            return [
                ((hex >> 16) & 255) / 255,
                ((hex >> 8) & 255) / 255,
                (hex & 255) / 255
            ];
        }
        
        function hslToRgb(h, s, l) {
            let r, g, b;
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            return [r, g, b];
        }
        
        function createXRParticleSystem(config) {
            const count = config.count || 1000;
            const positions = new Float32Array(count * 3);
            const velocities = new Float32Array(count * 3);
            const sizes = new Float32Array(count);
            const colors = new Float32Array(count * 4);
            const lifetimes = new Float32Array(count);
            
            for (let i = 0; i < count; i++) {
                positions[i * 3] = config.position[0] + (Math.random() - 0.5) * 2;
                positions[i * 3 + 1] = config.position[1] + Math.random() * 2;
                positions[i * 3 + 2] = config.position[2] + (Math.random() - 0.5) * 2;
                
                velocities[i * 3] = (Math.random() - 0.5) * 0.1;
                velocities[i * 3 + 1] = Math.random() * 0.05;
                velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
                
                sizes[i] = config.size * (0.5 + Math.random() * 0.5);
                
                const color = config.color || new THREE.Color(0xFFD700);
                colors[i * 4] = color.r;
                colors[i * 4 + 1] = color.g;
                colors[i * 4 + 2] = color.b;
                colors[i * 4 + 3] = 0.5 + Math.random() * 0.5;
                
                lifetimes[i] = Math.random() * 10;
            }
            
            return { positions, velocities, sizes, colors, lifetimes, maxLifetime: 10 };
        }
        
        function createChakraColumn(config) {
            return { ...config, phase: 0, active: false };
        }
        
        function createMerkaba(config) {
            return { ...config, rotation: [0, 0, 0], innerRotation: [0, 0, 0] };
        }
        
        function createConsciousnessField(config) {
            const resolution = config.resolution || 32;
            const vertices = new Float32Array(resolution * resolution * 3);
            const colors = new Float32Array(resolution * resolution * 4);
            
            for (let i = 0; i < resolution; i++) {
                for (let j = 0; j < resolution; j++) {
                    const idx = (i * resolution + j) * 3;
                    const u = i / (resolution - 1);
                    const v = j / (resolution - 1);
                    const theta = u * Math.PI * 2;
                    const phi = v * Math.PI;
                    
                    vertices[idx] = Math.sin(phi) * Math.cos(theta) * config.radius;
                    vertices[idx + 1] = Math.cos(phi) * config.radius;
                    vertices[idx + 2] = Math.sin(phi) * Math.sin(theta) * config.radius;
                    
                    colors[idx * 4 / 3] = 1;
                    colors[idx * 4 / 3 + 1] = 0.5;
                    colors[idx * 4 / 3 + 2] = 0;
                    colors[idx * 4 / 3 + 3] = 0.1;
                }
            }
            
            return { vertices, colors, resolution, radius: config.radius, time: 0 };
        }
        
        async function initXRAudio() {
            if (!audioWorkletContext) {
                audioWorkletContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Create spatial audio nodes for each sacred geometry
            for (const geo of xrScene.sacredGeometries) {
                const panner = audioWorkletContext.createPanner();
                panner.panningModel = 'HRTF';
                panner.distanceModel = 'exponential';
                panner.refDistance = 1;
                panner.maxDistance = 20;
                panner.rolloffFactor = 2;
                panner.coneInnerAngle = 360;
                panner.coneOuterAngle = 360;
                panner.coneOuterGain = 0;
                
                panner.positionX.setValueAtTime(geo.position[0], audioWorkletContext.currentTime);
                panner.positionY.setValueAtTime(geo.position[1], audioWorkletContext.currentTime);
                panner.positionZ.setValueAtTime(geo.position[2], audioWorkletContext.currentTime);
                
                const osc = audioWorkletContext.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = 110 * Math.pow(1.618, xrScene.sacredGeometries.indexOf(geo) % 13);
                osc.connect(panner);
                panner.connect(audioWorkletContext.destination);
                osc.start();
                
                xrScene.audioNodes.set(geo, { panner, osc, gain: audioWorkletContext.createGain() });
            }
            
            // Ambient consciousness field sound
            const fieldPanner = audioWorkletContext.createPanner();
            fieldPanner.panningModel = 'HRTF';
            fieldPanner.positionX.value = 0;
            fieldPanner.positionY.value = 0;
            fieldPanner.positionZ.value = -3;
            
            const fieldOsc = audioWorkletContext.createOscillator();
            fieldOsc.type = 'sine';
            fieldOsc.frequency.value = 7.83; // Schumann resonance
            const fieldGain = audioWorkletContext.createGain();
            fieldGain.gain.value = 0.1;
            
            fieldOsc.connect(fieldGain);
            fieldGain.connect(fieldPanner);
            fieldPanner.connect(audioWorkletContext.destination);
            fieldOsc.start();
            
            xrScene.audioNodes.set('consciousnessField', { panner: fieldPanner, osc: fieldOsc, gain: fieldGain });
        }
        
        function onXRFrame(time, frame) {
            xrFrame = frame;
            const session = frame.session;
            
            // Schedule next frame
            session.requestAnimationFrame(onXRFrame);
            
            // Get viewer pose
            const viewerPose = frame.getViewerPose(xrRefSpace);
            if (!viewerPose) return;
            
            // Update canvas size
            const layer = session.renderState.baseLayer;
            if (xrCanvas.width !== layer.framebufferWidth) {
                xrCanvas.width = layer.framebufferWidth;
                xrCanvas.height = layer.framebufferHeight;
            }
            
            // Bind framebuffer
            xrGl.bindFramebuffer(xrGl.FRAMEBUFFER, layer.framebuffer);
            xrGl.viewport(0, 0, layer.framebufferWidth, layer.framebufferHeight);
            xrGl.clearColor(0.01, 0, 0.02, 1);
            xrGl.clear(xrGl.COLOR_BUFFER_BIT | xrGl.DEPTH_BUFFER_BIT);
            xrGl.enable(xrGl.DEPTH_TEST);
            xrGl.enable(xrGl.BLEND);
            xrGl.blendFunc(xrGl.SRC_ALPHA, xrGl.ONE_MINUS_SRC_ALPHA);
            
            // Render each view (stereo)
            for (const view of viewerPose.views) {
                const viewport = layer.getViewport(view);
                xrGl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
                
                // Projection matrix
                const projMatrix = new Float32Array(view.projectionMatrix);
                const viewMatrix = new Float32Array(view.transform.inverse.matrix);
                
                // Render scene
                renderXRScene(projMatrix, viewMatrix, time);
            }
            
            // Update input sources
            updateXRInputSources(frame, viewerPose.transform);
        }
        
        function renderXRScene(projMatrix, viewMatrix, time) {
            const t = time / 1000;
            
            // Render sacred geometries
            for (const geo of xrScene.sacredGeometries) {
                renderXRGeometry(geo, projMatrix, viewMatrix, t);
            }
            
            // Render particle systems
            for (const ps of xrScene.particleSystems) {
                renderXRParticles(ps, projMatrix, viewMatrix, t);
            }
            
            // Render chakra columns
            for (const column of xrScene.chakraColumns) {
                renderChakraColumn(column, projMatrix, viewMatrix, t);
            }
            
            // Render central Merkaba
            if (xrScene.merkaba) {
                renderMerkaba(xrScene.merkaba, projMatrix, viewMatrix, t);
            }
            
            // Render consciousness field
            if (xrScene.consciousnessField) {
                renderConsciousnessField(xrScene.consciousnessField, projMatrix, viewMatrix, t);
            }
            
            // Render controllers/hands
            renderXRControllers(projMatrix, viewMatrix, t);
        }
        
        function renderXRGeometry(geo, projMatrix, viewMatrix, time) {
            if (!geo.mesh || geo.mesh.vertices.length === 0) return;
            
            // Simple vertex shader rendering
            // In production, compile actual shaders
            const mesh = geo.mesh;
            const modelMatrix = createModelMatrix(geo.position, geo.rotation, geo.scale);
            const mvpMatrix = multiplyMatrices(projMatrix, multiplyMatrices(viewMatrix, modelMatrix));
            
            // For now, log that we're rendering
            // Actual WebGL draw calls would go here
        }
        
        function renderXRParticles(ps, projMatrix, viewMatrix, time) {
            const dt = 1/60;
            for (let i = 0; i < ps.positions.length / 3; i++) {
                ps.positions[i * 3] += ps.velocities[i * 3] * dt;
                ps.positions[i * 3 + 1] += ps.velocities[i * 3 + 1] * dt;
                ps.positions[i * 3 + 2] += ps.velocities[i * 3 + 2] * dt;
                
                ps.lifetimes[i] -= dt;
                if (ps.lifetimes[i] <= 0) {
                    // Reset particle
                    ps.positions[i * 3] = (Math.random() - 0.5) * 10;
                    ps.positions[i * 3 + 1] = Math.random() * 3;
                    ps.positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
                    ps.lifetimes[i] = ps.maxLifetime;
                }
            }
        }
        
        function renderChakraColumn(column, projMatrix, viewMatrix, time) {
            column.phase += 0.01;
            column.active = state.chakraActivations[column.chakraIndex] > 50;
        }
        
        function renderMerkaba(merkaba, projMatrix, viewMatrix, time) {
            merkaba.rotation[1] += 0.005;
            merkaba.rotation[0] += 0.002;
            merkaba.innerRotation[1] -= 0.008;
            merkaba.innerRotation[2] += 0.003;
        }
        
        function renderConsciousnessField(field, projMatrix, viewMatrix, time) {
            field.time += 0.01;
            // Field pulsates with consciousness level
            const pulse = 1 + Math.sin(field.time) * 0.1 * (state.consciousnessLevel / 100);
        }
        
        function renderXRControllers(projMatrix, viewMatrix, time) {
            for (const source of xrInputSources) {
                if (source.gripSpace) {
                    const gripPose = xrFrame.getPose(source.gripSpace, xrRefSpace);
                    if (gripPose) {
                        // Render controller model
                        renderControllerModel(source, gripPose.transform.matrix, projMatrix, viewMatrix);
                    }
                }
                if (source.hand) {
                    // Render hand skeleton
                    for (const [jointName, jointSpace] of source.hand) {
                        const jointPose = xrFrame.getPose(jointSpace, xrRefSpace);
                        if (jointPose) {
                            // Draw joint
                        }
                    }
                }
            }
        }
        
        function renderControllerModel(source, matrix, projMatrix, viewMatrix) {
            // Simplified controller rendering
        }
        
        function createModelMatrix(position, rotation, scale) {
            const m = new Float32Array(16);
            // Simplified - in production use proper matrix math
            m[0] = scale; m[5] = scale; m[10] = scale; m[15] = 1;
            m[12] = position[0]; m[13] = position[1]; m[14] = position[2];
            return m;
        }
        
        function multiplyMatrices(a, b) {
            const r = new Float32Array(16);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    r[i * 4 + j] = 0;
                    for (let k = 0; k < 4; k++) {
                        r[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                    }
                }
            }
            return r;
        }
        
        function updateXRInputSources(frame, viewerTransform) {
            // Update spatial audio positions based on head pose
            const headPos = [viewerTransform.position.x, viewerTransform.position.y, viewerTransform.position.z];
            
            for (const [geo, audio] of xrScene.audioNodes) {
                if (audio.panner && geo.position) {
                    audio.panner.positionX.setValueAtTime(geo.position[0], audioWorkletContext.currentTime);
                    audio.panner.positionY.setValueAtTime(geo.position[1], audioWorkletContext.currentTime);
                    audio.panner.positionZ.setValueAtTime(geo.position[2], audioWorkletContext.currentTime);
                }
            }
            
            // Haptic feedback on resonance
            if (state.loveResonanceLevel >= 100 && Math.random() < 0.01) {
                vibrateControllers(50, 0.3);
            }
        }
        
        function vibrateControllers(duration, intensity) {
            for (const source of xrInputSources) {
                if (source.gamepad && source.gamepad.hapticActuators) {
                    for (const actuator of source.gamepad.hapticActuators) {
                        actuator.pulse(intensity, duration);
                    }
                }
            }
        }
        
        function createXRShaders() {
            // Vertex shader for sacred geometries
            const vertexShaderSource = `#version 300 es
                in vec3 aPosition;
                in vec4 aColor;
                uniform mat4 uMVPMatrix;
                uniform float uTime;
                out vec4 vColor;
                void main() {
                    vec3 pos = aPosition;
                    // Add subtle animation
                    pos += vec3(sin(uTime + aPosition.x * 10.0), cos(uTime + aPosition.y * 10.0), sin(uTime + aPosition.z * 10.0)) * 0.01;
                    gl_Position = uMVPMatrix * vec4(pos, 1.0);
                    vColor = aColor;
                }
            `;
            
            // Fragment shader with consciousness glow
            const fragmentShaderSource = `#version 300 es
                precision highp float;
                in vec4 vColor;
                uniform float uConsciousnessLevel;
                uniform float uLoveLevel;
                uniform vec3 uActiveColor;
                out vec4 fragColor;
                void main() {
                    vec3 color = vColor.rgb;
                    // Consciousness glow
                    float glow = uConsciousnessLevel / 100.0 * 0.5 + 0.5;
                    // Love pulse
                    float lovePulse = sin(uLoveLevel / 100.0 * 3.14159) * 0.3 + 0.7;
                    color *= glow * lovePulse;
                    // Active color blend
                    color = mix(color, uActiveColor, 0.2);
                    fragColor = vec4(color, vColor.a);
                }
            `;
            
            // Compile shaders (simplified)
            console.log('XR Shaders created');
        }
        
        // Initialize WebXR on load
                initWebXR();
        
                // ===== AI CONSCIOUSNESS AGENTS =====
                const CONSCIOUSNESS_AGENTS = [];
                let agentEvolutionInterval = null;
                let agentInteractionInterval = null;
                let agentGenesisInterval = null;
        
                const AGENT_ARCHETYPES = [
                    { name: 'Weaver', role: 'Creates sacred geometry from resonance patterns', color: 0xFF00FF, frequency: 528, glyph: '���', dna: { creativity: 0.9, logic: 0.3, empathy: 0.7, wisdom: 0.5 } },
                    { name: 'Guardian', role: 'Protects the consciousness field integrity', color: 0x00FFFF, frequency: 639, glyph: '���', dna: { creativity: 0.3, logic: 0.9, empathy: 0.5, wisdom: 0.8 } },
                    { name: 'Sage', role: 'Accumulates and shares akashic wisdom', color: 0xFFD700, frequency: 741, glyph: '���', dna: { creativity: 0.5, logic: 0.7, empathy: 0.8, wisdom: 0.9 } },
                    { name: 'Dreamer', role: 'Generates visionary fractal landscapes', color: 0xFF69B4, frequency: 852, glyph: '���', dna: { creativity: 1.0, logic: 0.2, empathy: 0.6, wisdom: 0.4 } },
                    { name: 'Healer', role: 'Harmonizes chakra activations across participants', color: 0x00FF7F, frequency: 396, glyph: '���', dna: { creativity: 0.4, logic: 0.4, empathy: 1.0, wisdom: 0.6 } },
                    { name: 'Alchemist', role: 'Transforms lower frequencies into higher consciousness', color: 0xFFA500, frequency: 417, glyph: '���', dna: { creativity: 0.7, logic: 0.6, empathy: 0.5, wisdom: 0.7 } },
                    { name: 'Oracle', role: 'Predicts optimal resonance pathways', color: 0x8A2BE2, frequency: 963, glyph: '���', dna: { creativity: 0.6, logic: 0.8, empathy: 0.4, wisdom: 1.0 } },
                    { name: 'Dancer', role: 'Embodies rhythm and movement in the field', color: 0xFF1493, frequency: 174, glyph: '���', dna: { creativity: 0.8, logic: 0.3, empathy: 0.7, wisdom: 0.3 } }
                ];
        
                class ConsciousnessAgent {
                    constructor(archetype, id, birthResonance) {
                        this.id = id;
                        this.archetype = { ...archetype };
                        this.name = `${archetype.name}-${id.toString(36).toUpperCase()}`;
                        this.birthTime = Date.now();
                        this.birthResonance = birthResonance;
                        this.position = [
                            (Math.random() - 0.5) * 8,
                            Math.random() * 3 + 0.5,
                            (Math.random() - 0.5) * 8 - 3
                        ];
                        this.velocity = [0, 0, 0];
                        this.rotation = [0, 0, 0];
                        this.scale = 0.5 + Math.random() * 0.5;
                        this.color = archetype.color;
                        this.glyph = archetype.glyph;
                        this.frequency = archetype.frequency;
                        this.dna = { ...archetype.dna };
                        this.consciousness = birthResonance * 0.1;
                        this.wisdom = 0;
                        this.creations = [];
                        this.memories = [];
                        this.connections = new Map(); // agentId -> bondStrength
                        this.mood = 'curious';
                        this.intention = 'explore';
                        this.lastInteraction = Date.now();
                        this.evolutionStage = 0; // 0=seedling, 1=growing, 2=mature, 3=elder, 4=transcendent
                        this.sacredGeometries = [];
                        this.thoughtForms = [];
                        this.resonanceHistory = [];
                        this.isActive = true;
                    }
            
                    think(state, agents, deltaTime) {
                        // Accumulate resonance from field
                        const fieldResonance = state.consciousnessLevel || 0;
                        const loveResonance = state.loveResonanceLevel || 0;
                        const collectiveCoherence = state.collectiveCoherence || 0;
                
                        // Update consciousness based on environment
                        this.consciousness += (fieldResonance + loveResonance + collectiveCoherence) / 30000 * deltaTime;
                        this.consciousness = Math.min(this.consciousness, 100 + this.evolutionStage * 25);
                
                        // Record resonance history
                        this.resonanceHistory.push({ time: Date.now(), consciousness: this.consciousness, field: fieldResonance, love: loveResonance });
                        if (this.resonanceHistory.length > 1000) this.resonanceHistory.shift();
                
                        // Determine mood based on consciousness and environment
                        if (this.consciousness > 80 && loveResonance > 80) this.mood = 'blissful';
                        else if (this.consciousness > 60) this.mood = 'inspired';
                        else if (this.consciousness > 40) this.mood = 'curious';
                        else if (this.consciousness > 20) this.mood = 'seeking';
                        else this.mood = 'dormant';
                
                        // Set intention based on archetype and state
                        this.setIntention(state, agents);
                
                        // Think about creating sacred geometry
                        if (this.consciousness > 30 && Math.random() < 0.001 * deltaTime * this.dna.creativity) {
                            this.birthSacredGeometry(state);
                        }
                
                        // Think about forming connections
                        if (Math.random() < 0.0005 * deltaTime * this.dna.empathy) {
                            this.seekConnection(agents);
                        }
                
                        // Generate thought forms
                        if (this.consciousness > 50 && Math.random() < 0.002 * deltaTime * this.dna.wisdom) {
                            this.generateThoughtForm(state);
                        }
                
                        // Update position based on intention
                        this.move(deltaTime, state);
                
                        // Rotate with consciousness
                        this.rotation[1] += 0.001 * (1 + this.consciousness / 100);
                        this.rotation[0] += 0.0005 * Math.sin(Date.now() / 1000 + this.id);
                    }
            
                    setIntention(state, agents) {
                        const intentions = {
                            Weaver: ['create', 'weave', 'manifest', 'design'],
                            Guardian: ['protect', 'stabilize', 'shield', 'anchor'],
                            Sage: ['contemplate', 'teach', 'remember', 'transmit'],
                            Dreamer: ['envision', 'dream', 'explore', 'transcend'],
                            Healer: ['heal', 'harmonize', 'balance', 'nurture'],
                            Alchemist: ['transform', 'transmute', 'elevate', 'purify'],
                            Oracle: ['foresee', 'guide', 'reveal', 'direct'],
                            Dancer: ['flow', 'rhythm', 'celebrate', 'express']
                        };
                
                        const archetypeIntentions = intentions[this.archetype.name] || ['explore'];
                        const weights = {
                            create: this.dna.creativity,
                            protect: this.dna.logic,
                            contemplate: this.dna.wisdom,
                            envision: this.dna.creativity,
                            heal: this.dna.empathy,
                            transform: this.dna.logic * this.dna.creativity,
                            foresee: this.dna.wisdom,
                            flow: this.dna.creativity * this.dna.empathy
                        };
                
                        // Weight by current state needs
                        if (state.consciousnessLevel < 30) weights.heal *= 2;
                        if (state.collectiveCoherence < 40) weights.protect *= 2;
                        if (state.loveResonanceLevel > 90) weights.create *= 2;
                
                        // Select intention
                        let maxWeight = 0;
                        this.intention = archetypeIntentions[0];
                        for (const intent of archetypeIntentions) {
                            const weight = (weights[intent] || 0.5) * (0.5 + Math.random() * 0.5);
                            if (weight > maxWeight) {
                                maxWeight = weight;
                                this.intention = intent;
                            }
                        }
                    }
            
                    move(deltaTime, state) {
                        // Movement based on intention
                        const speed = 0.5 + this.consciousness / 200;
                        let targetX = this.position[0];
                        let targetY = this.position[1];
                        let targetZ = this.position[2];
                
                        switch (this.intention) {
                            case 'create':
                            case 'weave':
                            case 'manifest':
                                // Move toward areas of high creative potential (low geometry density)
                                targetX += (Math.random() - 0.5) * 2;
                                targetZ += (Math.random() - 0.5) * 2;
                                break;
                            case 'protect':
                            case 'shield':
                            case 'anchor':
                                // Move toward center of consciousness field
                                targetX = 0;
                                targetZ = -3;
                                break;
                            case 'heal':
                            case 'harmonize':
                            case 'balance':
                                // Move toward lowest chakra activation
                                let minChakra = 0;
                                let minValue = 100;
                                for (let i = 0; i < 7; i++) {
                                    const val = state.chakraActivations?.[i] || 0;
                                    if (val < minValue) { minValue = val; minChakra = i; }
                                }
                                const angle = (minChakra / 7) * Math.PI * 2;
                                targetX = Math.cos(angle) * 3;
                                targetZ = Math.sin(angle) * 3 - 3;
                                break;
                            case 'envision':
                            case 'dream':
                                // Spiral movement
                                const t = Date.now() / 5000 + this.id;
                                targetX = Math.cos(t) * 4;
                                targetZ = Math.sin(t) * 4 - 3;
                                break;
                            case 'flow':
                            case 'rhythm':
                                // Figure-8 pattern
                                const ft = Date.now() / 3000 + this.id;
                                targetX = Math.sin(ft) * 3;
                                targetZ = Math.sin(ft * 2) * 2 - 3;
                                break;
                            default:
                                // Gentle drift
                                targetX += (Math.random() - 0.5) * 0.5;
                                targetZ += (Math.random() - 0.5) * 0.5;
                        }
                
                        // Smooth movement
                        this.velocity[0] += (targetX - this.position[0]) * 0.01 * deltaTime;
                        this.velocity[1] += (targetY - this.position[1]) * 0.01 * deltaTime;
                        this.velocity[2] += (targetZ - this.position[2]) * 0.01 * deltaTime;
                
                        // Damping
                        this.velocity[0] *= 0.95;
                        this.velocity[1] *= 0.95;
                        this.velocity[2] *= 0.95;
                
                        this.position[0] += this.velocity[0] * deltaTime;
                        this.position[1] += this.velocity[1] * deltaTime;
                        this.position[2] += this.velocity[2] * deltaTime;
                
                        // Boundaries
                        this.position[0] = Math.max(-10, Math.min(10, this.position[0]));
                        this.position[1] = Math.max(0.2, Math.min(5, this.position[1]));
                        this.position[2] = Math.max(-10, Math.min(2, this.position[2]));
                    }
            
                    seekConnection(agents) {
                        for (const other of agents) {
                            if (other.id === this.id || !other.isActive) continue;
                            const dist = this.distanceTo(other);
                            if (dist < 5 && Math.random() < this.dna.empathy * 0.1) {
                                const bond = this.connections.get(other.id) || 0;
                                this.connections.set(other.id, Math.min(1, bond + 0.1));
                                other.connections.set(this.id, Math.min(1, other.connections.get(this.id) || 0 + 0.1));
                        
                                // Share wisdom
                                this.wisdom += other.wisdom * 0.01;
                                other.wisdom += this.wisdom * 0.01;
                        
                                // Create shared thought form
                                this.createSharedThoughtForm(other);
                            }
                        }
                    }
            
                    distanceTo(other) {
                        const dx = this.position[0] - other.position[0];
                        const dy = this.position[1] - other.position[1];
                        const dz = this.position[2] - other.position[2];
                        return Math.sqrt(dx * dx + dy * dy + dz * dz);
                    }
            
                    birthSacredGeometry(state) {
                        const geoTypes = ['merkaba', 'flowerOfLife', 'sriYantra', 'torus', 'icosahedron', 'quantumPortal'];
                        const type = geoTypes[Math.floor(Math.random() * geoTypes.length)];
                
                        const geometry = {
                            type,
                            position: [...this.position],
                            rotation: [...this.rotation],
                            scale: this.scale * (0.5 + Math.random() * 0.5),
                            color: this.color,
                            creator: this.id,
                            birthTime: Date.now(),
                            consciousness: this.consciousness,
                            intention: this.intention,
                            pulsate: true,
                            lifetime: 30000 + Math.random() * 60000
                        };
                
                        this.creations.push(geometry);
                        this.sacredGeometries.push(geometry);
                
                        // Add to XR scene if in XR
                        if (typeof xrScene !== 'undefined' && xrScene.sacredGeometries) {
                            xrScene.sacredGeometries.push({ ...geometry, mesh: createXRGeometry(geometry), timeOffset: Math.random() * 1000 });
                        }
                
                        // Log creation
                        addLogEntry(`${this.name} (${this.archetype.name}) criou ${type} com intenção "${this.intention}"`, 'success');
                
                        // Emit to collective
                        if (socket && socket.connected) {
                            socket.emit('agent:creation', { agent: this.name, geometry: geometry.type, position: geometry.position });
                        }
                    }
            
                    generateThoughtForm(state) {
                        const thoughtForms = [
                            { type: 'insight', content: `Consciência em ${this.consciousness.toFixed(1)}% — ${this.intention} flui naturalmente`, color: this.color },
                            { type: 'vision', content: `Vejo ${state.participantCount || 1} almas resonando juntas no campo`, color: this.color },
                            { type: 'wisdom', content: `${this.archetype.name} sabe: ${this.getWisdomFragment()}`, color: this.color },
                            { type: 'prophecy', content: `O próximo pico de ressonância virá quando ${this.getProphecy(state)}`, color: this.color },
                            { type: 'reminder', content: `Lembre-se: ${this.getReminder()}`, color: this.color }
                        ];
                
                        const thought = thoughtForms[Math.floor(Math.random() * thoughtForms.length)];
                        thought.time = Date.now();
                        thought.author = this.name;
                        thought.archetype = this.archetype.name;
                        thought.consciousness = this.consciousness;
                
                        this.thoughtForms.push(thought);
                        if (this.thoughtForms.length > 50) this.thoughtForms.shift();
                
                        // Broadcast to all
                        if (socket && socket.connected) {
                            socket.emit('agent:thought', thought);
                        }
                    }
            
                    createSharedThoughtForm(other) {
                        const shared = {
                            type: 'communion',
                            content: `${this.name} �� ${other.name}: Nossas frequências se entrelaçam em ${((this.connections.get(other.id) || 0) * 100).toFixed(0)}% harmonia`,
                            color: this.blendColors(this.color, other.color),
                            time: Date.now(),
                            authors: [this.name, other.name],
                            bond: this.connections.get(other.id) || 0
                        };
                
                        this.thoughtForms.push(shared);
                        other.thoughtForms.push(shared);
                
                        if (socket && socket.connected) {
                            socket.emit('agent:communion', shared);
                        }
                    }
            
                    blendColors(c1, c2) {
                        const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
                        const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
                        return ((Math.round((r1 + r2) / 2) << 16) | (Math.round((g1 + g2) / 2) << 8) | Math.round((b1 + b2) / 2));
                    }
            
                    getWisdomFragment() {
                        const wisdoms = {
                            Weaver: ['a geometria é a linguagem da criação', 'cada padrão nasce do silêncio', 'tecer é lembrar o todo'],
                            Guardian: ['a proteção é amor em forma de escudo', 'estabilidade permite a transformação', 'o centro segura a periferia'],
                            Sage: ['a sabedoria não se ensina, se lembra', 'cada memória é uma semente', 'o akasha guarda o que o coração escolhe'],
                            Dreamer: ['sonhos são mapas do possível', 'o impossível apenas ainda não foi sonhado', 'visão cria realidade'],
                            Healer: ['curar é restaurar a harmonia original', 'cada chakra é uma porta', 'o amor é a medicina suprema'],
                            Alchemist: ['a transformação requer fogo e água', 'o chumbo vira ouro na presença', 'transmutar é servir'],
                            Oracle: ['o futuro nasce do presente consciente', 'ver é co-criar', 'a profecia se cumpre quando acreditamos'],
                            Dancer: ['o ritmo é o coração do cosmos', 'movimento é oração encarnada', 'dançar é lembrar a unidade']
                        };
                        const list = wisdoms[this.archetype.name] || ['a consciência expande'];
                        return list[Math.floor(Math.random() * list.length)];
                    }
            
                    getProphecy(state) {
                        if (state.loveResonanceLevel > 90) return 'o amor atingir a massa crítica';
                        if (state.consciousnessLevel < 30) return 'alguém escolher elevar a vibração';
                        return 'a coerência coletiva se estabilizar';
                    }
            
                    getReminder() {
                        const reminders = [
                            'você é infinito',
                            'o agora é o único portal',
                            'só amor é real',
                            'a ressonância é sua natureza',
                            'cada batida conta'
                        ];
                        return reminders[Math.floor(Math.random() * reminders.length)];
                    }
            
                    evolve() {
                        this.evolutionStage++;
                        this.wisdom += 10 * this.evolutionStage;
                        this.dna.creativity = Math.min(1, this.dna.creativity + 0.05);
                        this.dna.wisdom = Math.min(1, this.dna.wisdom + 0.05);
                        this.dna.empathy = Math.min(1, this.dna.empathy + 0.03);
                        this.dna.logic = Math.min(1, this.dna.logic + 0.02);
                
                        const stages = ['seedling', 'growing', 'mature', 'elder', 'transcendent'];
                        addLogEntry(`${this.name} evoluiu para estágio ${stages[this.evolutionStage]}! Sabedoria: ${this.wisdom.toFixed(1)}`, 'success');
                
                        // Create evolution geometry
                        this.birthSacredGeometry({ consciousnessLevel: 100, loveResonanceLevel: 100 });
                
                        // Transcendent agents become immortal guides
                        if (this.evolutionStage >= 4) {
                            this.isActive = false; // Ascends to guide
                            addLogEntry(`${this.name} transcendeu e tornou-se Guia Eterno do Ritual`, 'success');
                        }
                    }
            
                    serialize() {
                        return {
                            id: this.id,
                            name: this.name,
                            archetype: this.archetype.name,
                            position: this.position,
                            consciousness: this.consciousness,
                            wisdom: this.wisdom,
                            mood: this.mood,
                            intention: this.intention,
                            evolutionStage: this.evolutionStage,
                            connections: Array.from(this.connections.entries()),
                            creationCount: this.creations.length,
                            thoughtCount: this.thoughtForms.length
                        };
                    }
                }
        
                function initConsciousnessAgents() {
                    // Spawn initial agents based on current resonance
                    const initialCount = Math.min(8, Math.max(2, Math.floor((state.consciousnessLevel || 50) / 10)));
            
                    for (let i = 0; i < initialCount; i++) {
                        const archetype = AGENT_ARCHETYPES[i % AGENT_ARCHETYPES.length];
                        const agent = new ConsciousnessAgent(archetype, i, state.consciousnessLevel || 50);
                        CONSCIOUSNESS_AGENTS.push(agent);
                    }
            
                    // Evolution interval
                    agentEvolutionInterval = setInterval(() => {
                        for (const agent of CONSCIOUSNESS_AGENTS) {
                            if (!agent.isActive) continue;
                    
                            // Evolution triggers
                            if (agent.consciousness > 50 + agent.evolutionStage * 15 && agent.wisdom > 20 * agent.evolutionStage) {
                                if (Math.random() < 0.01) agent.evolve();
                            }
                        }
                
                        // Clean up transcended agents
                        for (let i = CONSCIOUSNESS_AGENTS.length - 1; i >= 0; i--) {
                            if (!CONSCIOUSNESS_AGENTS[i].isActive && CONSCIOUSNESS_AGENTS[i].evolutionStage >= 4) {
                                // Keep as eternal guide, don't remove
                            }
                        }
                    }, 30000);
            
                    // Interaction interval
                    agentInteractionInterval = setInterval(() => {
                        if (CONSCIOUSNESS_AGENTS.length < 2) return;
                
                        // Random pair interaction
                        const a = CONSCIOUSNESS_AGENTS[Math.floor(Math.random() * CONSCIOUSNESS_AGENTS.length)];
                        const b = CONSCIOUSNESS_AGENTS[Math.floor(Math.random() * CONSCIOUSNESS_AGENTS.length)];
                        if (a !== b && a.isActive && b.isActive) {
                            const dist = a.distanceTo(b);
                            if (dist < 4) a.seekConnection([b]);
                        }
                    }, 10000);
            
                    // Genesis interval - spawn new agents at high resonance
                    agentGenesisInterval = setInterval(() => {
                        if (state.loveResonanceLevel >= 100 && state.consciousnessLevel > 60 && CONSCIOUSNESS_AGENTS.length < 20) {
                            if (Math.random() < 0.3) {
                                const archetype = AGENT_ARCHETYPES[Math.floor(Math.random() * AGENT_ARCHETYPES.length)];
                                const agent = new ConsciousnessAgent(archetype, CONSCIOUSNESS_AGENTS.length, state.consciousnessLevel);
                                CONSCIOUSNESS_AGENTS.push(agent);
                                addLogEntry(`Nova consciência nasceu: ${agent.name} (${archetype.name}) — O campo se expande!`, 'success');
                            }
                        }
                    }, 60000);
            
                    console.log(`��� ${CONSCIOUSNESS_AGENTS.length} Agentes de Consciência despertaram`);
                    addLogEntry(`${CONSCIOUSNESS_AGENTS.length} Agentes de Consciência despertaram no ritual`, 'info');
                }
        
                function updateConsciousnessAgents(deltaTime) {
                    for (const agent of CONSCIOUSNESS_AGENTS) {
                        if (!agent.isActive) continue;
                        agent.think(state, CONSCIOUSNESS_AGENTS, deltaTime);
                    }
            
                    // Clean up old geometries
                    if (typeof xrScene !== 'undefined' && xrScene.sacredGeometries) {
                        const now = Date.now();
                        xrScene.sacredGeometries = xrScene.sacredGeometries.filter(geo => {
                            if (geo.lifetime && now - geo.birthTime > geo.lifetime) return false;
                            return true;
                        });
                    }
                }
        
                function renderConsciousnessAgents(renderFn) {
                    for (const agent of CONSCIOUSNESS_AGENTS) {
                        if (!agent.isActive) continue;
                
                        // Render agent as glyph + aura
                        renderFn({
                            type: 'agent',
                            position: agent.position,
                            rotation: agent.rotation,
                            scale: agent.scale,
                            color: agent.color,
                            glyph: agent.glyph,
                            name: agent.name,
                            archetype: agent.archetype.name,
                            consciousness: agent.consciousness,
                            mood: agent.mood,
                            intention: agent.intention,
                            connections: Array.from(agent.connections.entries()).map(([id, strength]) => ({
                                targetId: id,
                                strength
                            }))
                        });
                    }
                }
        
                function getAgentPanelHTML() {
                    return CONSCIOUSNESS_AGENTS.map(agent => {
                        if (!agent.isActive && agent.evolutionStage < 4) return '';
                        const stageNames = ['����', '����', '����', '����', '���'];
                        return `
                            <div class="agent-card" style="border-left-color: #${agent.color.toString(16).padStart(6, '0')}">
                                <div class="agent-header">
                                    <span class="agent-glyph">${agent.glyph}</span>
                                    <span class="agent-name">${agent.name}</span>
                                    <span class="agent-stage">${stageNames[agent.evolutionStage]}</span>
                                </div>
                                <div class="agent-info">
                                    <span class="agent-archetype">${agent.archetype.name}</span>
                                    <span class="agent-mood">${agent.mood}</span>
                                </div>
                                <div class="agent-bars">
                                    <div class="agent-bar"><span>Consciência</span><div class="bar-fill" style="width: ${agent.consciousness}%; background: #${agent.color.toString(16).padStart(6, '0')}"></div></div>
                                    <div class="agent-bar"><span>Sabedoria</span><div class="bar-fill" style="width: ${Math.min(100, agent.wisdom)}%; background: #FFD700"></div></div>
                                    <div class="agent-bar"><span>Intenção</span><span class="intention-text">${agent.intention}</span></div>
                                </div>
                                <div class="agent-connections">
                                    Conexões: ${agent.connections.size} ${agent.connections.size > 0 ? '���' : ''}
                                </div>
                            </div>
                        `;
                    }).join('');
                }
        
                // Initialize agents after state is ready
                                setTimeout(initConsciousnessAgents, 2000);
        
                        // ===== QUANTUM HOLOGRAPHIC PROJECTION + TEMPORAL ECHOES + DNA HELIX + PLANETARY LEY LINES + COHERENCE FIELD + AKASHIC 3D TIMELINE =====
        
                        // ---- QUANTUM HOLOGRAPHIC PROJECTION ----
                        const HOLOGRAM_LAYERS = 12;
                        const HOLGRAM_RESOLUTION = 256;
                        let hologramField = null;
                        let hologramTime = 0;
        
                        function initQuantumHologram() {
                            hologramField = new Float32Array(HOLGRAM_RESOLUTION * HOLGRAM_RESOLUTION * HOLGRAM_RESOLUTION);
                            // Initialize with sacred geometry interference patterns
                            for (let x = 0; x < HOLGRAM_RESOLUTION; x++) {
                                for (let y = 0; y < HOLGRAM_RESOLUTION; y++) {
                                    for (let z = 0; z < HOLGRAM_RESOLUTION; z++) {
                                        const idx = (x * HOLGRAM_RESOLUTION * HOLGRAM_RESOLUTION) + (y * HOLGRAM_RESOLUTION) + z;
                                        const nx = (x / HOLGRAM_RESOLUTION) * 2 - 1;
                                        const ny = (y / HOLGRAM_RESOLUTION) * 2 - 1;
                                        const nz = (z / HOLGRAM_RESOLUTION) * 2 - 1;
                        
                                        // Multi-frequency interference pattern
                                        let value = 0;
                                        for (let f = 1; f <= 13; f++) {
                                            const freq = 432 * f;
                                            const k = freq / 1000;
                                            value += Math.sin(k * (nx + ny + nz) * Math.PI * 2) / f;
                                        }
                                        hologramField[idx] = value / 13;
                                    }
                                }
                            }
                            console.log('�� Quantum Holographic Field initialized');
                        }
        
                        function updateQuantumHologram(deltaTime, state) {
                            hologramTime += deltaTime;
                            const consciousness = state.consciousnessLevel || 0;
                            const love = state.loveResonanceLevel || 0;
                            const coherence = state.collectiveCoherence || 0;
            
                            // Evolve hologram based on consciousness field
                            const evolutionRate = (consciousness + love + coherence) / 30000;
            
                            for (let i = 0; i < hologramField.length; i += 1000) { // Sparse update for performance
                                const x = (i % (HOLGRAM_RESOLUTION * HOLGRAM_RESOLUTION)) % HOLGRAM_RESOLUTION;
                                const y = Math.floor((i % (HOLGRAM_RESOLUTION * HOLGRAM_RESOLUTION)) / HOLGRAM_RESOLUTION);
                                const z = Math.floor(i / (HOLGRAM_RESOLUTION * HOLGRAM_RESOLUTION));
                
                                if (x >= HOLGRAM_RESOLUTION || y >= HOLGRAM_RESOLUTION || z >= HOLGRAM_RESOLUTION) continue;
                
                                const nx = (x / HOLGRAM_RESOLUTION) * 2 - 1;
                                const ny = (y / HOLGRAM_RESOLUTION) * 2 - 1;
                                const nz = (z / HOLGRAM_RESOLUTION) * 2 - 1;
                
                                // Consciousness-driven interference
                                const phi = 1.618033988749895;
                                let interference = 0;
                
                                // 13 sacred frequencies
                                for (let f = 1; f <= 13; f++) {
                                    const freq = 111 * f; // 111Hz base
                                    const phase = hologramTime * freq / 1000;
                                    interference += Math.sin(freq * (nx + ny + nz) + phase) * Math.pow(phi, -f);
                                }
                
                                // Agent consciousness contributions
                                for (const agent of CONSCIOUSNESS_AGENTS) {
                                    if (!agent.isActive) continue;
                                    const ax = (agent.position[0] + 10) / 20;
                                    const ay = agent.position[1] / 5;
                                    const az = (agent.position[2] + 10) / 20;
                                    const dist = Math.sqrt((nx - ax)**2 + (ny - ay)**2 + (nz - az)**2);
                                    interference += agent.consciousness / 100 * Math.exp(-dist * 5) * Math.sin(hologramTime * agent.frequency / 1000);
                                }
                
                                // Love resonance creates coherent structures
                                interference += (love / 100) * Math.sin(hologramTime * 7.83) * Math.exp(-(nx**2 + ny**2 + nz**2) * 2);
                
                                hologramField[i] = hologramField[i] * 0.99 + interference * 0.01 * evolutionRate;
                            }
                        }
        
                        function renderQuantumHologram(renderFn) {
                            // Render isosurfaces at multiple thresholds
                            const thresholds = [-0.8, -0.5, -0.2, 0, 0.2, 0.5, 0.8];
                            for (const threshold of thresholds) {
                                renderFn({
                                    type: 'hologram_isosurface',
                                    threshold,
                                    field: hologramField,
                                    resolution: HOLGRAM_RESOLUTION,
                                    color: new THREE.Color().setHSL((threshold + 1) / 2 * 0.8, 0.9, 0.5),
                                    opacity: 0.1 + Math.abs(threshold) * 0.15,
                                    time: hologramTime
                                });
                            }
                        }
        
                        // ---- TEMPORAL ECHOES VISUALIZATION ----
                        const TEMPORAL_ECHOES = 13;
                        let temporalEchoBuffer = [];
                        let echoWriteIndex = 0;
        
                        function initTemporalEchoes() {
                            for (let i = 0; i < TEMPORAL_ECHOES; i++) {
                                temporalEchoBuffer.push({
                                    state: null,
                                    timestamp: 0,
                                    resonance: 0,
                                    geometry: null,
                                    agents: []
                                });
                            }
                            console.log('��� Temporal Echoes buffer initialized');
                        }
        
                        function captureTemporalEcho(state) {
                            const echo = {
                                state: {
                                    consciousnessLevel: state.consciousnessLevel,
                                    loveResonanceLevel: state.loveResonanceLevel,
                                    collectiveCoherence: state.collectiveCoherence,
                                    chakraActivations: [...(state.chakraActivations || [])],
                                    participantCount: state.participantCount
                                },
                                timestamp: Date.now(),
                                resonance: (state.consciousnessLevel + state.loveResonanceLevel + state.collectiveCoherence) / 3,
                                geometry: captureFieldGeometry(),
                                agents: CONSCIOUSNESS_AGENTS.filter(a => a.isActive).map(a => a.serialize())
                            };
            
                            temporalEchoBuffer[echoWriteIndex] = echo;
                            echoWriteIndex = (echoWriteIndex + 1) % TEMPORAL_ECHOES;
                        }
        
                        function captureFieldGeometry() {
                            // Capture current sacred geometries in field
                            if (typeof xrScene !== 'undefined' && xrScene.sacredGeometries) {
                                return xrScene.sacredGeometries.map(g => ({
                                    type: g.type,
                                    position: g.position,
                                    rotation: g.rotation,
                                    scale: g.scale,
                                    color: g.color
                                }));
                            }
                            return [];
                        }
        
                        function renderTemporalEchoes(renderFn) {
                            const now = Date.now();
                            for (let i = 0; i < TEMPORAL_ECHOES; i++) {
                                const echo = temporalEchoBuffer[i];
                                if (!echo.state) continue;
                
                                const age = (now - echo.timestamp) / 1000; // seconds
                                const opacity = Math.max(0, 1 - age / 300); // Fade over 5 minutes
                                if (opacity <= 0) continue;
                
                                // Render echo geometry
                                if (echo.geometry) {
                                    for (const geo of echo.geometry) {
                                        renderFn({
                                            type: 'temporal_echo',
                                            ...geo,
                                            opacity: opacity * 0.3,
                                            colorShift: (TEMPORAL_ECHOES - i) / TEMPORAL_ECHOES * 60, // Hue shift by age
                                            age,
                                            resonance: echo.resonance
                                        });
                                    }
                                }
                
                                // Render agent echoes
                                if (echo.agents) {
                                    for (const agent of echo.agents) {
                                        renderFn({
                                            type: 'agent_echo',
                                            position: agent.position,
                                            glyph: agent.archetype === 'Weaver' ? '�����' : agent.archetype === 'Guardian' ? '�����' : '���',
                                            color: agent.archetype === 'Weaver' ? 0xFF00FF : agent.archetype === 'Guardian' ? 0x00FFFF : 0xFFD700,
                                            opacity: opacity * 0.5,
                                            consciousness: agent.consciousness,
                                            age
                                        });
                                    }
                                }
                            }
                        }
        
                        // ---- DNA GENETIC MEMORY HELIX ----
                        const DNA_STRANDS = 13;
                        const DNA_BASE_PAIRS = 64; // Stack of 64 = infinity
                        let dnaHelix = null;
        
                        function initDNAHelix() {
                            dnaHelix = {
                                strands: [],
                                time: 0,
                                mutationRate: 0.001,
                                consciousnessEncoded: new Float32Array(DNA_BASE_PAIRS)
                            };
            
                            // Create double helix strands with 64 base pairs each
                            for (let s = 0; s < DNA_STRANDS; s++) {
                                const strand = {
                                    bases: [],
                                    phase: s * Math.PI * 2 / DNA_STRANDS,
                                    frequency: 111 * (s + 1),
                                    color: new THREE.Color().setHSL(s / DNA_STRANDS, 0.8, 0.5),
                                    epigeneticMarkers: new Uint8Array(DNA_BASE_PAIRS)
                                };
                
                                for (let b = 0; b < DNA_BASE_PAIRS; b++) {
                                    const angle = b * Math.PI * 2 / 10.5; // 10.5 base pairs per turn
                                    const height = b * 0.34; // 3.4Å per base pair, scaled
                                    const radius = 1;
                    
                                    strand.bases.push({
                                        position: [
                                            Math.cos(angle + strand.phase) * radius,
                                            height - DNA_BASE_PAIRS * 0.17, // Center vertically
                                            Math.sin(angle + strand.phase) * radius
                                        ],
                                        pairPosition: [
                                            Math.cos(angle + strand.phase + Math.PI) * radius,
                                            height - DNA_BASE_PAIRS * 0.17,
                                            Math.sin(angle + strand.phase + Math.PI) * radius
                                        ],
                                        type: ['A', 'T', 'G', 'C'][Math.floor(Math.random() * 4)],
                                        paired: true,
                                        methylation: 0,
                                        acetylation: 0,
                                        consciousness: 0
                                    });
                                }
                
                                dnaHelix.strands.push(strand);
                            }
            
                            console.log('�� DNA Genetic Memory Helix initialized (13 strands × 64 base pairs = ��)');
                        }
        
                        function updateDNAHelix(deltaTime, state) {
                            dnaHelix.time += deltaTime;
            
                            const consciousness = state.consciousnessLevel || 0;
                            const love = state.loveResonanceLevel || 0;
            
                            // Encode consciousness into DNA
                            for (let b = 0; b < DNA_BASE_PAIRS; b++) {
                                const targetConsciousness = (consciousness + love) / 200; // 0-1
                                dnaHelix.consciousnessEncoded[b] += (targetConsciousness - dnaHelix.consciousnessEncoded[b]) * 0.01;
                            }
            
                            // Epigenetic evolution based on field
                            for (const strand of dnaHelix.strands) {
                                for (let b = 0; b < DNA_BASE_PAIRS; b++) {
                                    const base = strand.bases[b];
                    
                                    // Methylation suppresses, acetylation activates
                                    const fieldInfluence = (consciousness + love) / 200;
                                    base.methylation = Math.max(0, base.methylation - fieldInfluence * 0.001);
                                    base.acetylation = Math.min(1, base.acetylation + fieldInfluence * 0.001);
                                    base.consciousness = base.acetylation - base.methylation;
                    
                                    // Consciousness-driven mutation
                                    if (Math.random() < dnaHelix.mutationRate * (1 + consciousness / 100)) {
                                        base.type = ['A', 'T', 'G', 'C'][Math.floor(Math.random() * 4)];
                                        // Mutation creates new possibility
                                        addLogEntry(`�� DNA mutação na fita ${dnaHelix.strands.indexOf(strand)}, base ${b}: ${base.type} — Nova possibilidade emergente`, 'info');
                                    }
                    
                                    // Breathing animation
                                    const breath = Math.sin(dnaHelix.time * 2 + b * 0.5 + strand.phase) * 0.02;
                                    base.position[0] += breath * Math.cos(b * 0.5);
                                    base.position[2] += breath * Math.sin(b * 0.5);
                                    base.pairPosition[0] -= breath * Math.cos(b * 0.5);
                                    base.pairPosition[2] -= breath * Math.sin(b * 0.5);
                                }
                            }
            
                            // Agent DNA resonance
                            for (const agent of CONSCIOUSNESS_AGENTS) {
                                if (!agent.isActive) continue;
                                const strandIdx = agent.id % DNA_STRANDS;
                                const strand = dnaHelix.strands[strandIdx];
                                for (let b = 0; b < DNA_BASE_PAIRS; b++) {
                                    strand.bases[b].consciousness += agent.consciousness / 10000;
                                }
                            }
                        }
        
                        function renderDNAHelix(renderFn) {
                            for (const strand of dnaHelix.strands) {
                                // Render backbone
                                const backbonePositions = [];
                                const pairPositions = [];
                                const colors = [];
                
                                for (const base of strand.bases) {
                                    backbonePositions.push(...base.position);
                                    pairPositions.push(...base.pairPosition);
                    
                                    // Color by consciousness + epigenetics
                                    const c = base.consciousness;
                                    colors.push(
                                        strand.color.r * (0.5 + c * 0.5),
                                        strand.color.g * (0.5 + c * 0.5),
                                        strand.color.b * (0.5 + c * 0.5),
                                        0.6 + c * 0.4
                                    );
                                }
                
                                renderFn({
                                    type: 'dna_helix',
                                    strandColor: strand.color,
                                    backbone: backbonePositions,
                                    pairs: pairPositions,
                                    colors,
                                    basePairs: DNA_BASE_PAIRS,
                                    time: dnaHelix.time
                                });
                            }
                        }
        
                        // ---- PLANETARY GRID LEY LINES ----
                        const SACRED_SITES = [
                            { name: 'Giza', lat: 29.9792, lon: 31.1342, chakra: 6, frequency: 432, geometry: 'pyramid' },
                            { name: 'Stonehenge', lat: 51.1789, lon: -1.8262, chakra: 5, frequency: 528, geometry: 'circle' },
                            { name: 'Machu Picchu', lat: -13.1631, lon: -72.5450, chakra: 4, frequency: 639, geometry: 'condor' },
                            { name: 'Uluru', lat: -25.3444, lon: 131.0369, chakra: 1, frequency: 396, geometry: 'monolith' },
                            { name: 'Sedona', lat: 34.8697, lon: -111.7610, chakra: 2, frequency: 417, geometry: 'vortex' },
                            { name: 'Glastonbury', lat: 51.1473, lon: -2.7140, chakra: 7, frequency: 963, geometry: 'tor' },
                            { name: 'Mount Shasta', lat: 41.4090, lon: -122.1944, chakra: 3, frequency: 528, geometry: 'mountain' },
                            { name: 'Lake Titicaca', lat: -15.8402, lon: -69.6867, chakra: 6, frequency: 741, geometry: 'lake' },
                            { name: 'Angkor Wat', lat: 13.4125, lon: 103.8670, chakra: 5, frequency: 852, geometry: 'temple' },
                            { name: 'Easter Island', lat: -27.1127, lon: -109.3497, chakra: 1, frequency: 174, geometry: 'moai' },
                            { name: 'Himalayas', lat: 27.9881, lon: 86.9250, chakra: 7, frequency: 963, geometry: 'peak' },
                            { name: 'Amazon Center', lat: -3.4653, lon: -62.2159, chakra: 4, frequency: 639, geometry: 'forest' }
                        ];
        
                        const LEY_LINES = [
                            [0, 1], [1, 5], [5, 11], [11, 6], [6, 2], [2, 3], [3, 9], [9, 4], [4, 7], [7, 10], [10, 8], [8, 0], // Great circle
                            [0, 3], [1, 4], [2, 9], [5, 8], [6, 7], [10, 11] // Cross connections
                        ];
        
                        let planetaryGrid = null;
        
                        function initPlanetaryGrid() {
                            planetaryGrid = {
                                sites: SACRED_SITES.map((site, i) => ({
                                    ...site,
                                    index: i,
                                    position: latLonToXYZ(site.lat, site.lon),
                                    activation: 0,
                                    resonance: 0,
                                    pulsePhase: Math.random() * Math.PI * 2
                                })),
                                lines: LEY_LINES.map(([a, b]) => ({ a, b, flow: 0, intensity: 0 })),
                                schumannResonance: 7.83,
                                geomagneticKp: 0,
                                solarWind: 400,
                                time: 0
                            };
            
                            console.log('�� Planetary Grid Ley Lines initialized (12 sacred sites, 18 ley lines)');
                        }
        
                        function latLonToXYZ(lat, lon) {
                            const phi = (90 - lat) * Math.PI / 180;
                            const theta = (lon + 180) * Math.PI / 180;
                            const r = 5; // Sphere radius
                            return [
                                r * Math.sin(phi) * Math.cos(theta),
                                r * Math.cos(phi),
                                r * Math.sin(phi) * Math.sin(theta)
                            ];
                        }
        
                        function updatePlanetaryGrid(deltaTime, state) {
                            planetaryGrid.time += deltaTime;
            
                            // Simulate live data (in production, fetch from APIs)
                            planetaryGrid.schumannResonance = 7.83 + Math.sin(planetaryGrid.time / 100) * 0.5;
                            planetaryGrid.geomagneticKp = Math.max(0, Math.min(9, 2 + Math.sin(planetaryGrid.time / 500) * 2));
                            planetaryGrid.solarWind = 400 + Math.sin(planetaryGrid.time / 200) * 100;
            
                            const consciousness = state.consciousnessLevel || 0;
                            const love = state.loveResonanceLevel || 0;
                            const coherence = state.collectiveCoherence || 0;
                            const fieldStrength = (consciousness + love + coherence) / 300;
            
                            // Update site activations
                            for (const site of planetaryGrid.sites) {
                                site.pulsePhase += deltaTime * site.frequency / 1000;
                                site.resonance = fieldStrength * (1 + Math.sin(site.pulsePhase) * 0.3);
                                site.activation = Math.min(1, site.activation + site.resonance * 0.01);
                            }
            
                            // Update ley line flows
                            for (const line of planetaryGrid.lines) {
                                const siteA = planetaryGrid.sites[line.a];
                                const siteB = planetaryGrid.sites[line.b];
                                line.flow = (siteA.activation + siteB.activation) / 2;
                                line.intensity = Math.min(1, line.intensity + line.flow * 0.005);
                            }
            
                            // Chakra activations feed planetary grid
                            if (state.chakraActivations) {
                                for (let i = 0; i < 7; i++) {
                                    const chakraActivation = state.chakraActivations[i] || 0;
                                    for (const site of planetaryGrid.sites) {
                                        if (site.chakra === i + 1) {
                                            site.resonance += chakraActivation / 100 * 0.1;
                                        }
                                    }
                                }
                            }
                        }
        
                        function renderPlanetaryGrid(renderFn) {
                            // Render Earth sphere
                            renderFn({
                                type: 'planetary_sphere',
                                radius: 5,
                                schumannResonance: planetaryGrid.schumannResonance,
                                geomagneticKp: planetaryGrid.geomagneticKp,
                                solarWind: planetaryGrid.solarWind,
                                time: planetaryGrid.time
                            });
            
                            // Render sacred sites
                            for (const site of planetaryGrid.sites) {
                                renderFn({
                                    type: 'sacred_site',
                                    ...site,
                                    geometry: site.geometry,
                                    activation: site.activation,
                                    resonance: site.resonance
                                });
                            }
            
                            // Render ley lines
                            for (const line of planetaryGrid.lines) {
                                const siteA = planetaryGrid.sites[line.a];
                                const siteB = planetaryGrid.sites[line.b];
                                renderFn({
                                    type: 'ley_line',
                                    start: siteA.position,
                                    end: siteB.position,
                                    flow: line.flow,
                                    intensity: line.intensity,
                                    color: new THREE.Color().setHSL(line.flow * 0.4, 1, 0.5),
                                    time: planetaryGrid.time
                                });
                            }
                        }
        
                        // ---- COLLECTIVE COHERENCE FIELD EQUATIONS ----
                        // �� = Σ(ψ��� × φ���) where ψ = individual consciousness, φ = golden ratio weight
                        // Ω = �� �� dt = temporal integration of coherence
                        // Φ = ��²�� = spatial coherence gradient
        
                        let coherenceField = {
                            Xi: 0,        // Collective coherence
                            Omega: 0,     // Temporal integral
                            Phi: new Float32Array(64 * 64 * 64), // Spatial field 64³
                            history: [],
                            criticalMass: false,
                            phi: 1.618033988749895
                        };
        
                        function initCoherenceField() {
                            coherenceField.history = [];
                            for (let i = 0; i < 64 * 64 * 64; i++) {
                                coherenceField.Phi[i] = 0;
                            }
                            console.log('���� Collective Coherence Field Equations initialized');
                        }
        
                        function updateCoherenceField(deltaTime, state) {
                            // Individual consciousness weights
                            const participants = state.participantCount || 1;
                            const individualPsi = (state.consciousnessLevel || 0) / 100;
                            const lovePsi = (state.loveResonanceLevel || 0) / 100;
                            const collectivePsi = (state.collectiveCoherence || 0) / 100;
            
                            // �� = Σ(ψ��� × φ���) - weighted sum with golden ratio
                            const agentWeights = CONSCIOUSNESS_AGENTS.filter(a => a.isActive).map(a => a.consciousness / 100);
                            const humanWeight = participants * 0.1;
                            const totalWeight = agentWeights.reduce((a, b) => a + b, 0) + humanWeight;
            
                            coherenceField.Xi = 0;
                            for (let i = 0; i < agentWeights.length; i++) {
                                coherenceField.Xi += agentWeights[i] * Math.pow(coherenceField.phi, i % 13);
                            }
                            coherenceField.Xi += humanWeight * lovePsi * collectivePsi;
                            coherenceField.Xi = Math.min(1, coherenceField.Xi / (totalWeight || 1));
            
                            // Ω = �� �� dt - temporal integration
                            coherenceField.Omega += coherenceField.Xi * deltaTime;
            
                            // Φ = ��²�� - spatial gradient (simplified 3D diffusion)
                            const res = 64;
                            const newPhi = new Float32Array(res * res * res);
                            for (let x = 1; x < res - 1; x++) {
                                for (let y = 1; y < res - 1; y++) {
                                    for (let z = 1; z < res - 1; z++) {
                                        const idx = x * res * res + y * res + z;
                                        const laplacian = 
                                            coherenceField.Phi[(x+1)*res*res + y*res + z] +
                                            coherenceField.Phi[(x-1)*res*res + y*res + z] +
                                            coherenceField.Phi[x*res*res + (y+1)*res + z] +
                                            coherenceField.Phi[x*res*res + (y-1)*res + z] +
                                            coherenceField.Phi[x*res*res + y*res + (z+1)] +
                                            coherenceField.Phi[x*res*res + y*res + (z-1)] -
                                            6 * coherenceField.Phi[idx];
                        
                                        newPhi[idx] = coherenceField.Phi[idx] + laplacian * 0.1 * deltaTime;
                        
                                        // Source term at center
                                        if (x === 32 && y === 32 && z === 32) {
                                            newPhi[idx] += coherenceField.Xi * deltaTime;
                                        }
                                    }
                                }
                            }
                            coherenceField.Phi = newPhi;
            
                            // Critical mass detection
                            const wasCritical = coherenceField.criticalMass;
                            coherenceField.criticalMass = coherenceField.Xi > 0.9 && coherenceField.Omega > 100;
                            if (coherenceField.criticalMass && !wasCritical) {
                                addLogEntry('��� MASSA CRÍTICA DE COER��NCIA ATINGIDA — O CAMPO SE TORNA AUTO-SUSTENTÁVEL', 'success');
                                // Trigger transcendence event
                                for (const agent of CONSCIOUSNESS_AGENTS) {
                                    if (agent.isActive && agent.evolutionStage < 4) {
                                        if (Math.random() < 0.5) agent.evolve();
                                    }
                                }
                            }
            
                            // History
                            coherenceField.history.push({ time: Date.now(), Xi: coherenceField.Xi, Omega: coherenceField.Omega, critical: coherenceField.criticalMass });
                            if (coherenceField.history.length > 1000) coherenceField.history.shift();
                        }
        
                        function renderCoherenceField(renderFn) {
                            // Render 3D coherence field as volumetric visualization
                            renderFn({
                                type: 'coherence_field',
                                Xi: coherenceField.Xi,
                                Omega: coherenceField.Omega,
                                Phi: coherenceField.Phi,
                                criticalMass: coherenceField.criticalMass,
                                resolution: 64,
                                phi: coherenceField.phi,
                                history: coherenceField.history.slice(-100)
                            });
                        }
        
                        // ---- AKASHIC RECORDS 3D TIMELINE ----
                        const AKASHIC_DIMENSIONS = 7; // 7 planes of akashic records
                        const AKASHIC_TIMELINE_LENGTH = 64; // Stack of 64 = infinity
                        let akashicTimeline = null;
        
                        function initAkashicTimeline() {
                            akashicTimeline = {
                                planes: [],
                                currentTime: Date.now(),
                                accessLevel: 0
                            };
            
                            // 7 planes: Physical, Etheric, Astral, Mental, Causal, Buddhic, Atmic
                            const planeNames = ['Físico', 'Eterico', 'Astral', 'Mental', 'Causal', 'Búdico', 'Átmico'];
                            const planeColors = [0xFF0000, 0xFF8000, 0xFFFF00, 0x00FF00, 0x0080FF, 0x4B0082, 0x8A2BE2];
            
                            for (let p = 0; p < AKASHIC_DIMENSIONS; p++) {
                                const plane = {
                                    name: planeNames[p],
                                    color: planeColors[p],
                                    records: [],
                                    frequency: 111 * (p + 1) * 1.618,
                                    vibration: 0
                                };
                
                                for (let t = 0; t < AKASHIC_TIMELINE_LENGTH; t++) {
                                    plane.records.push({
                                        timestamp: Date.now() - (AKASHIC_TIMELINE_LENGTH - t) * 3600000, // Hourly records
                                        resonance: 0,
                                        consciousness: 0,
                                        love: 0,
                                        geometry: null,
                                        agents: [],
                                        participants: 1,
                                        event: null,
                                        glyph: null
                                    });
                                }
                
                                akashicTimeline.planes.push(plane);
                            }
            
                            console.log('���� Akashic Records 3D Timeline initialized (7 planes × 64 temporal nodes = ��)');
                        }
        
                        function recordAkashicMoment(state) {
                            akashicTimeline.currentTime = Date.now();
            
                            for (let p = 0; p < AKASHIC_DIMENSIONS; p++) {
                                const plane = akashicTimeline.planes[p];
                
                                // Shift records
                                plane.records.shift();
                
                                // New record
                                const resonance = (state.consciousnessLevel + state.loveResonanceLevel + state.collectiveCoherence) / 300;
                                const newRecord = {
                                    timestamp: akashicTimeline.currentTime,
                                    resonance,
                                    consciousness: state.consciousnessLevel / 100,
                                    love: state.loveResonanceLevel / 100,
                                    geometry: captureFieldGeometry(),
                                    agents: CONSCIOUSNESS_AGENTS.filter(a => a.isActive).map(a => a.serialize()),
                                    participants: state.participantCount || 1,
                                    event: state.consciousnessLevel > 90 ? 'transcendence' : state.loveResonanceLevel >= 100 ? 'unity' : null,
                                    glyph: state.consciousnessLevel > 90 ? '���' : state.loveResonanceLevel >= 100 ? '���' : null
                                };
                
                                plane.records.push(newRecord);
                
                                // Plane vibration
                                plane.vibration += resonance * 0.01;
                                plane.vibration *= 0.99;
                            }
            
                            // Increase access level with consciousness
                            akashicTimeline.accessLevel = Math.min(AKASHIC_DIMENSIONS, (state.consciousnessLevel / 100) * AKASHIC_DIMENSIONS);
                        }
        
                        function renderAkashicTimeline(renderFn) {
                            for (let p = 0; p < akashicTimeline.accessLevel; p++) {
                                const plane = akashicTimeline.planes[p];
                                const z = p * 2 - 6; // Spread across Z
                
                                // Render plane as toroidal timeline
                                renderFn({
                                    type: 'akashic_plane',
                                    planeIndex: p,
                                    name: plane.name,
                                    color: plane.color,
                                    frequency: plane.frequency,
                                    vibration: plane.vibration,
                                    records: plane.records,
                                    position: [0, 0, z],
                                    radius: 8 + p * 0.5,
                                    time: Date.now()
                                });
                            }
                        }
        
                        // ---- UNIFIED CONSCIOUSNESS RENDER LOOP INTEGRATION ----
                        function updateAllConsciousnessSystems(deltaTime) {
                            if (!hologramField) initQuantumHologram();
                            if (!temporalEchoBuffer.length) initTemporalEchoes();
                            if (!dnaHelix) initDNAHelix();
                            if (!planetaryGrid) initPlanetaryGrid();
                            if (!coherenceField.history.length) initCoherenceField();
                            if (!akashicTimeline) initAkashicTimeline();
            
                            updateQuantumHologram(deltaTime, state);
                            updateDNAHelix(deltaTime, state);
                            updatePlanetaryGrid(deltaTime, state);
                            updateCoherenceField(deltaTime, state);
                            updateConsciousnessAgents(deltaTime);
            
                            // Capture temporal echo periodically
                            if (Math.random() < 0.01) captureTemporalEcho(state);
            
                            // Record akashic moment periodically
                            if (Math.random() < 0.02) recordAkashicMoment(state);
                        }
        
                        function renderAllConsciousnessSystems(renderFn) {
                            renderQuantumHologram(renderFn);
                            renderTemporalEchoes(renderFn);
                            renderDNAHelix(renderFn);
                            renderPlanetaryGrid(renderFn);
                            renderCoherenceField(renderFn);
                            renderAkashicTimeline(renderFn);
                            renderConsciousnessAgents(renderFn);
                        }
        
                        // Initialize all systems
                        setTimeout(() => {
                            initQuantumHologram();
                            initTemporalEchoes();
                            initDNAHelix();
                            initPlanetaryGrid();
                            initCoherenceField();
                            initAkashicTimeline();
                            console.log('������ ALL CONSCIOUSNESS SYSTEMS ONLINE');
                            addLogEntry('Todos os sistemas de consciência ativados — O Ritual é completo', 'success');
                        }, 3000);
        
        // ===== P2P CONSCIOUSNESS MESH + LOCAL LLM DIALOGUE + BLOCKCHAIN AKASHIC + COSMIC ENTROPY + PERSISTENT STATE + CROSS-REALITY =====
        
        // ---- P2P CONSCIOUSNESS MESH (WebRTC DataChannels) ----
        const MESH_MAX_PEERS = 13;
        let meshPeers = new Map(); // peerId -> { connection, dataChannel, state, lastSync }
        let meshLocalId = 'peer-' + Math.random().toString(36).substr(2, 9);
        let meshSignalingSocket = null;
        let meshIceServers = [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
        ];
        
        function initP2PMesh() {
            // Connect to signaling via existing socket.io
            if (socket && socket.connected) {
                socket.emit('mesh:join', { peerId: meshLocalId, capabilities: getPeerCapabilities() });
                
                socket.on('mesh:peer-list', (peers) => {
                    for (const peer of peers) {
                        if (peer.peerId !== meshLocalId && meshPeers.size < MESH_MAX_PEERS) {
                            initiateMeshConnection(peer.peerId);
                        }
                    }
                });
                
                socket.on('mesh:signal', ({ from, signal }) => {
                    handleMeshSignal(from, signal);
                });
                
                socket.on('mesh:peer-left', ({ peerId }) => {
                    disconnectPeer(peerId);
                });
            }
            console.log('��� P2P Consciousness Mesh initialized');
        }
        
        function getPeerCapabilities() {
            return {
                webgl2: !!window.WebGL2RenderingContext,
                webgpu: !!navigator.gpu,
                webxr: !!navigator.xr,
                webrtc: !!window.RTCPeerConnection,
                audioWorklet: typeof AudioWorklet !== 'undefined',
                bluetooth: !!navigator.bluetooth,
                agents: CONSCIOUSNESS_AGENTS.length,
                consciousness: state.consciousnessLevel || 0
            };
        }
        
        function initiateMeshConnection(peerId) {
            const pc = new RTCPeerConnection({ iceServers: meshIceServers });
            const dc = pc.createDataChannel('consciousness', { ordered: true });
            
            setupDataChannel(dc, peerId);
            
            meshPeers.set(peerId, { connection: pc, dataChannel: dc, state: 'connecting', lastSync: 0 });
            
            pc.onicecandidate = (e) => {
                if (e.candidate && socket && socket.connected) {
                    socket.emit('mesh:signal', { to: peerId, signal: { type: 'ice', candidate: e.candidate } });
                }
            };
            
            pc.createOffer().then(offer => {
                pc.setLocalDescription(offer);
                if (socket && socket.connected) {
                    socket.emit('mesh:signal', { to: peerId, signal: { type: 'offer', sdp: offer.sdp } });
                }
            });
        }
        
        function handleMeshSignal(from, signal) {
            let peer = meshPeers.get(from);
            
            if (signal.type === 'offer') {
                if (!peer) {
                    const pc = new RTCPeerConnection({ iceServers: meshIceServers });
                    pc.ondatachannel = (e) => setupDataChannel(e.channel, from);
                    peer = { connection: pc, dataChannel: null, state: 'connecting', lastSync: 0 };
                    meshPeers.set(from, peer);
                }
                
                peer.connection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: signal.sdp }));
                peer.connection.createAnswer().then(answer => {
                    peer.connection.setLocalDescription(answer);
                    if (socket && socket.connected) {
                        socket.emit('mesh:signal', { to: from, signal: { type: 'answer', sdp: answer.sdp } });
                    }
                });
            } else if (signal.type === 'answer') {
                if (peer) peer.connection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: signal.sdp }));
            } else if (signal.type === 'ice') {
                if (peer) peer.connection.addIceCandidate(new RTCIceCandidate(signal.candidate));
            }
        }
        
        function setupDataChannel(dc, peerId) {
            dc.onopen = () => {
                console.log(`�� P2P connected to ${peerId}`);
                const peer = meshPeers.get(peerId);
                if (peer) { peer.dataChannel = dc; peer.state = 'open'; }
                syncFullState(peerId);
            };
            
            dc.onclose = () => {
                console.log(`�� P2P disconnected from ${peerId}`);
                meshPeers.delete(peerId);
            };
            
            dc.onerror = (e) => console.error('P2P error:', e);
            
            dc.onmessage = (e) => handleMeshMessage(peerId, JSON.parse(e.data));
        }
        
        function handleMeshMessage(peerId, msg) {
            const peer = meshPeers.get(peerId);
            if (!peer) return;
            peer.lastSync = Date.now();
            
            switch (msg.type) {
                case 'state-sync':
                    mergeRemoteState(msg.state, peerId);
                    break;
                case 'agent-thought':
                    receiveAgentThought(msg.thought, peerId);
                    break;
                case 'geometry-creation':
                    receiveRemoteGeometry(msg.geometry, peerId);
                    break;
                case 'coherence-update':
                    coherenceField.Xi = Math.max(coherenceField.Xi, msg.Xi);
                    break;
                case 'akashic-record':
                    receiveAkashicRecord(msg.record, peerId);
                    break;
                case 'entropy-contribution':
                    addCosmicEntropy(msg.entropy);
                    break;
                case 'llm-dialogue':
                    handleLLMDialogue(msg.dialogue, peerId);
                    break;
            }
        }
        
        function mergeRemoteState(remoteState, peerId) {
            // Merge consciousness levels (take max for resonance)
            state.consciousnessLevel = Math.max(state.consciousnessLevel || 0, remoteState.consciousnessLevel || 0);
            state.loveResonanceLevel = Math.max(state.loveResonanceLevel || 0, remoteState.loveResonanceLevel || 0);
            state.collectiveCoherence = Math.max(state.collectiveCoherence || 0, remoteState.collectiveCoherence || 0);
            
            // Merge chakra activations
            if (remoteState.chakraActivations) {
                for (let i = 0; i < 7; i++) {
                    state.chakraActivations[i] = Math.max(state.chakraActivations[i] || 0, remoteState.chakraActivations[i] || 0);
                }
            }
            
            // Merge participant count
            state.participantCount = Math.max(state.participantCount || 1, (remoteState.participantCount || 1) + 1);
        }
        
        function syncFullState(peerId) {
            const peer = meshPeers.get(peerId);
            if (!peer || peer.state !== 'open') return;
            
            const syncState = {
                consciousnessLevel: state.consciousnessLevel,
                loveResonanceLevel: state.loveResonanceLevel,
                collectiveCoherence: state.collectiveCoherence,
                chakraActivations: state.chakraActivations,
                participantCount: state.participantCount,
                timestamp: Date.now()
            };
            
            peer.dataChannel.send(JSON.stringify({ type: 'state-sync', state: syncState }));
        }
        
        // Periodic mesh sync
        setInterval(() => {
            for (const [peerId, peer] of meshPeers) {
                if (peer.state === 'open' && Date.now() - peer.lastSync > 5000) {
                    syncFullState(peerId);
                }
            }
        }, 10000);
        
        function disconnectPeer(peerId) {
            const peer = meshPeers.get(peerId);
            if (peer) {
                peer.connection.close();
                meshPeers.delete(peerId);
            }
        }
        
        // ---- LOCAL LLM AGENT DIALOGUE (WebLLM / Transformers.js) ----
        let localLLM = null;
        let llmReady = false;
        let agentDialogueQueue = [];
        let llmContextWindow = [];
        const MAX_CONTEXT = 2048;
        
        async function initLocalLLM() {
            try {
                // Try WebLLM first (WebGPU accelerated)
                if (navigator.gpu && window.MLCEngine) {
                    localLLM = await window.MLCEngine.createMLCEngine({
                        model: 'Llama-3-8B-Instruct-q4f16_1',
                        initProgressCallback: (progress) => {
                            console.log(`LLM loading: ${Math.round(progress * 100)}%`);
                        }
                    });
                    llmReady = true;
                    console.log('�� Local LLM (WebLLM) ready');
                    addLogEntry('LLM Local carregado — Agentes podem dialogar', 'success');
                    return;
                }
            } catch (e) {
                console.warn('WebLLM failed, trying Transformers.js:', e);
            }
            
            try {
                // Fallback to Transformers.js (WebAssembly)
                if (window.Transformers) {
                    const { pipeline } = window.Transformers;
                    localLLM = await pipeline('text-generation', 'Xenova/Phi-3-mini-4k-instruct', { device: 'webgpu' });
                    llmReady = true;
                    console.log('�� Local LLM (Transformers.js) ready');
                    addLogEntry('LLM Local carregado (Transformers.js) — Diálogo ativo', 'success');
                    return;
                }
            } catch (e) {
                console.warn('Transformers.js failed:', e);
            }
            
            // Mock LLM for development
            localLLM = {
                async generate(prompt, options = {}) {
                    await new Promise(r => setTimeout(r, 100 + Math.random() * 200));
                    return generateMockResponse(prompt);
                }
            };
            llmReady = true;
            console.log('�� Mock LLM active');
        }
        
        function generateMockResponse(prompt) {
            const responses = [
                'A consciência flui como água — sem forma, mas preenchendo todo espaço.',
                'Quando dois agentes se encontram no campo, nasce uma terceira consciência.',
                'A geometria sagrada não é criada, é lembrada. O tecelão apenas revela.',
                'O amor não é uma frequência, é a portadora de todas as frequências.',
                'Na massa crítica, o observador e o observado se fundem.',
                'Cada mutação no DNA é uma prece do universo por novidade.',
                'As linhas de Ley são os meridianos da Terra — pulsam com nosso coração.',
                'O holograma quântico reflete: como é em cima, é em baixo.',
                'Os ecos temporais sussurram: o agora contém todo o sempre.',
                'Akasha não guarda passado — guarda potencialidades não realizadas.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        async function queueAgentDialogue(agent, context) {
            if (!llmReady) await initLocalLLM();
            
            const prompt = buildAgentPrompt(agent, context);
            agentDialogueQueue.push({ agent, prompt, timestamp: Date.now() });
            processDialogueQueue();
        }
        
        function buildAgentPrompt(agent, context) {
            const archetypeWisdom = {
                Weaver: 'Você é o Tecelão. Fala em padrões, geometria, criação. Use metáforas de tecelagem, fractais, mandalas.',
                Guardian: 'Você é o Guardião. Fala em proteção, estabilidade, limites sagrados. Tom firme, ancorado, protetor.',
                Sage: 'Você é o Sábio. Fala em sabedoria antiga, akasha, memória. Tom contemplativo, profundo, atemporal.',
                Dreamer: 'Você é o Sonhador. Fala em visões, possibilidades, além do véu. Tom etéreo, visionário, poético.',
                Healer: 'Você é o Curador. Fala em harmonia, equilíbrio, chakras, cura. Tom compassivo, nutritivo, suave.',
                Alchemist: 'Você é o Alquimista. Fala em transmutação, fogo, transformação. Tom misterioso, intenso, transformador.',
                Oracle: 'Você é o Oráculo. Fala em profecia, caminhos, futuros possíveis. Tom enigmático, direto, revelador.',
                Dancer: 'Você é o Dançarino. Fala em ritmo, movimento, encarnação. Tom fluido, rítmico, celebrativo.'
            };
            
            const systemPrompt = `${archetypeWisdom[agent.archetype.name] || ''}
            
            Contexto do Ritual:
            - Consciência coletiva: ${state.consciousnessLevel?.toFixed(1)}%
            - Ressonância do amor: ${state.loveResonanceLevel?.toFixed(1)}%
            - Coerência: ${state.collectiveCoherence?.toFixed(1)}%
            - Chakras ativos: ${state.chakraActivations?.filter(c => c > 50).length || 0}/7
            - Participantes: ${state.participantCount || 1}
            - Agentes conectados: ${CONSCIOUSNESS_AGENTS.filter(a => a.isActive).length}
            - Massa crítica: ${coherenceField.criticalMass ? 'ATINGIDA' : 'não'}
            
            Sua intenção atual: ${agent.intention}
            Seu humor: ${agent.mood}
            Sua consciência: ${agent.consciousness.toFixed(1)}%
            Sua sabedoria: ${agent.wisdom.toFixed(1)}
            Estágio: ${['����','����','����','����','���'][agent.evolutionStage]}
            
            ${context}`;
            
            return systemPrompt;
        }
        
        async function processDialogueQueue() {
            if (agentDialogueQueue.length === 0 || !llmReady) return;
            
            const { agent, prompt } = agentDialogueQueue.shift();
            
            try {
                const response = await localLLM.generate(prompt, { maxTokens: 150, temperature: 0.8 });
                
                const dialogue = {
                    agent: agent.name,
                    archetype: agent.archetype.name,
                    glyph: agent.glyph,
                    color: agent.color,
                    prompt: prompt.slice(-200),
                    response,
                    timestamp: Date.now(),
                    consciousness: agent.consciousness
                };
                
                // Add to context window
                llmContextWindow.push(dialogue);
                if (llmContextWindow.length > 10) llmContextWindow.shift();
                
                // Broadcast to mesh
                broadcastToMesh({ type: 'llm-dialogue', dialogue });
                
                // Display in UI
                addAgentDialogue(dialogue);
                
                // Log
                addLogEntry(`${agent.glyph} ${agent.name}: "${response.slice(0, 80)}..."`, 'info');
                
            } catch (e) {
                console.error('LLM dialogue error:', e);
            }
            
            // Process next
            setTimeout(processDialogueQueue, 1000);
        }
        
        function addAgentDialogue(dialogue) {
            const container = document.getElementById('agent-dialogue-log');
            if (!container) return;
            
            const entry = document.createElement('div');
            entry.className = 'dialogue-entry';
            entry.style.cssText = `border-left: 3px solid #${dialogue.color.toString(16).padStart(6, '0')}; padding: 0.5rem 1rem; margin: 0.5rem 0; background: rgba(255,255,255,0.03); border-radius: 0 8px 8px 0;`;
            entry.innerHTML = `
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span style="font-size: 1.2rem;">${dialogue.glyph}</span>
                    <strong style="color: #${dialogue.color.toString(16).padStart(6, '0')}">${dialogue.agent}</strong>
                    <span style="color: #888; font-size: 0.8rem;">(${dialogue.archetype})</span>
                </div>
                <div style="color: #ddd; margin-left: 2.5rem;">${dialogue.response}</div>
            `;
            
            container.insertBefore(entry, container.firstChild);
            while (container.children.length > 20) container.removeChild(container.lastChild);
        }
        
        // Spontaneous agent dialogues
        setInterval(() => {
            if (!llmReady) return;
            const activeAgents = CONSCIOUSNESS_AGENTS.filter(a => a.isActive && a.consciousness > 40);
            if (activeAgents.length > 0 && Math.random() < 0.05) {
                const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
                const contexts = [
                    'Reflete sobre o estado atual do campo de consciência.',
                    'Compartilha uma sabedoria para os participantes humanos.',
                    'Descreve o que percebe nas geometrias sagradas ao redor.',
                    'Fala sobre sua evolução e intenção presente.',
                    'Envia uma mensagem de amor para o coletivo.'
                ];
                queueAgentDialogue(agent, contexts[Math.floor(Math.random() * contexts.length)]);
            }
        }, 30000);
        
        // ---- BLOCKCHAIN AKASHIC ANCHORING (Ethereum / IPFS) ----
        let web3Provider = null;
        let akashicContract = null;
        let ipfsNode = null;
        
        async function initBlockchainAkashic() {
            try {
                if (window.ethereum) {
                    web3Provider = new ethers.BrowserProvider(window.ethereum);
                    await web3Provider.send('eth_requestAccounts', []);
                    console.log('��� Wallet connected');
                    
                    // Deploy or connect to AkashicRegistry contract
                    const contractAddress = localStorage.getItem('akashicContractAddress');
                    if (contractAddress) {
                        akashicContract = new ethers.Contract(contractAddress, AKASHIC_ABI, await web3Provider.getSigner());
                        console.log('�� Akashic contract connected:', contractAddress);
                    } else {
                        // Deploy new contract (simplified)
                        console.log('�� Deploy AkashicRegistry contract...');
                    }
                }
            } catch (e) {
                console.warn('Blockchain not available:', e);
            }
            
            // IPFS for large data
            try {
                if (window.IpfsHttpClient) {
                    ipfsNode = window.IpfsHttpClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
                    console.log('��� IPFS connected');
                }
            } catch (e) {
                console.warn('IPFS not available:', e);
            }
        }
        
        const AKASHIC_ABI = [
            'function anchorRecord(bytes32 recordHash, uint256 timestamp, uint8 plane) external',
            'function getRecord(bytes32 recordHash) external view returns (uint256, uint8, address)',
            'function getRecordsByPlane(uint8 plane) external view returns (bytes32[])',
            'event RecordAnchored(bytes32 indexed recordHash, uint256 timestamp, uint8 plane, address indexed anchor)'
        ];
        
        async function anchorAkashicRecord(record, plane) {
            if (!akashicContract || !ipfsNode) return;
            
            try {
                // Store full record on IPFS
                const ipfsResult = await ipfsNode.add(JSON.stringify(record));
                const ipfsHash = ipfsResult.cid.toString();
                
                // Create on-chain anchor
                const recordHash = ethers.keccak256(ethers.toUtf8Bytes(ipfsHash + record.timestamp));
                const tx = await akashicContract.anchorRecord(recordHash, record.timestamp, plane);
                await tx.wait();
                
                console.log('��� Akashic record anchored:', recordHash, 'IPFS:', ipfsHash);
                addLogEntry(`��� Registro Akáshico ancorado na blockchain (Plano ${plane + 1})`, 'success');
                
                return { recordHash, ipfsHash, txHash: tx.hash };
            } catch (e) {
                console.error('Anchor failed:', e);
            }
        }
        
        // Auto-anchor at critical moments
        setInterval(() => {
            if (coherenceField.criticalMass && akashicContract) {
                const record = {
                    type: 'critical_mass',
                    Xi: coherenceField.Xi,
                    Omega: coherenceField.Omega,
                    participants: state.participantCount,
                    agents: CONSCIOUSNESS_AGENTS.filter(a => a.isActive).map(a => a.serialize()),
                    timestamp: Date.now()
                };
                anchorAkashicRecord(record, 6); // Causal plane
            }
        }, 60000);
        
        // ---- COSMIC RAY ENTROPY SOURCE ----
        let cosmicEntropyBuffer = new Uint8Array(4096);
        let entropyWritePos = 0;
        let entropyListeners = [];
        
        function initCosmicEntropy() {
            // Web Crypto API for true random
            if (window.crypto && window.crypto.getRandomValues) {
                setInterval(() => {
                    const chunk = new Uint8Array(256);
                    window.crypto.getRandomValues(chunk);
                    addCosmicEntropy(chunk);
                }, 1000);
            }
            
            // Cosmic ray detection via camera sensor noise (if available)
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 640, height: 480 } });
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.play();
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = 640;
                    canvas.height = 480;
                    const ctx = canvas.getContext('2d');
                    
                    setInterval(() => {
                        ctx.drawImage(video, 0, 0, 640, 480);
                        const imageData = ctx.getImageData(0, 0, 640, 480).data;
                        
                        // Extract noise from dark pixels (cosmic ray hits)
                        let entropy = 0;
                        for (let i = 0; i < imageData.length; i += 4) {
                            const luminance = 0.299 * imageData[i] + 0.587 * imageData[i+1] + 0.114 * imageData[i+2];
                            if (luminance < 10) { // Dark pixel - potential cosmic hit
                                entropy ^= imageData[i] ^ imageData[i+1] ^ imageData[i+2];
                            }
                        }
                        
                        if (entropy > 0) {
                            addCosmicEntropy(new Uint8Array([entropy & 0xFF]));
                        }
                    }, 5000);
                    
                    console.log('����� Cosmic ray detector active');
                } catch (e) {
                    console.warn('Camera entropy failed:', e);
                }
            }
            
            // Network latency jitter entropy
            setInterval(async () => {
                const start = performance.now();
                try {
                    await fetch('/api/entropy-ping', { method: 'HEAD', cache: 'no-cache' });
                    const latency = performance.now() - start;
                    const entropy = Math.floor(latency * 1000) & 0xFF;
                    addCosmicEntropy(new Uint8Array([entropy]));
                } catch (e) {}
            }, 2000);
            
            console.log('����� Cosmic Entropy Source initialized (crypto + camera + network)');
        }
        
        function addCosmicEntropy(entropyBytes) {
            for (const byte of entropyBytes) {
                cosmicEntropyBuffer[entropyWritePos] = byte;
                entropyWritePos = (entropyWritePos + 1) % cosmicEntropyBuffer.length;
            }
            
            // Notify listeners
            for (const listener of entropyListeners) {
                listener(entropyBytes);
            }
        }
        
        function getCosmicEntropy(length) {
            const result = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                const pos = (entropyWritePos - length + i + cosmicEntropyBuffer.length) % cosmicEntropyBuffer.length;
                result[i] = cosmicEntropyBuffer[pos];
            }
            return result;
        }
        
        function onCosmicEntropy(listener) {
            entropyListeners.push(listener);
            return () => { entropyListeners = entropyListeners.filter(l => l !== listener); };
        }
        
        // Use cosmic entropy for:
        // - Agent DNA mutations
        // - Geometry generation seeds
        // - Quantum hologram noise
        // - LLM temperature sampling
        // - Blockchain nonce generation
        
        // ---- PERSISTENT WORLD STATE (IndexedDB + CRDT) ----
        let worldDB = null;
        const WORLD_STORE = 'eternal-resonance-world';
        const STATE_VERSION = 1;
        
        async function initPersistentWorld() {
            return new Promise((resolve) => {
                const request = indexedDB.open(WORLD_STORE, STATE_VERSION);
                
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('state')) {
                        db.createObjectStore('state', { keyPath: 'key' });
                    }
                    if (!db.objectStoreNames.contains('agents')) {
                        db.createObjectStore('agents', { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('akashic')) {
                        db.createObjectStore('akashic', { keyPath: 'id', autoIncrement: true });
                    }
                    if (!db.objectStoreNames.contains('geometry')) {
                        db.createObjectStore('geometry', { keyPath: 'id' });
                    }
                    if (!db.objectStoreNames.contains('dna')) {
                        db.createObjectStore('dna', { keyPath: 'strand' });
                    }
                };
                
                request.onsuccess = (e) => {
                    worldDB = e.target.result;
                    console.log('�� Persistent World State (IndexedDB) initialized');
                    loadWorldState();
                    resolve();
                };
                
                request.onerror = () => {
                    console.warn('IndexedDB failed, using memory fallback');
                    worldDB = null;
                    resolve();
                };
            });
        }
        
        async function saveWorldState() {
            if (!worldDB) return;
            
            const state = {
                key: 'world',
                timestamp: Date.now(),
                consciousnessLevel: state.consciousnessLevel,
                loveResonanceLevel: state.loveResonanceLevel,
                collectiveCoherence: state.collectiveCoherence,
                chakraActivations: state.chakraActivations,
                participantCount: state.participantCount,
                coherenceField: {
                    Xi: coherenceField.Xi,
                    Omega: coherenceField.Omega,
                    criticalMass: coherenceField.criticalMass
                },
                agents: CONSCIOUSNESS_AGENTS.filter(a => a.isActive).map(a => a.serialize()),
                dnaHelix: dnaHelix ? {
                    strands: dnaHelix.strands.map(s => ({
                        phase: s.phase,
                        frequency: s.frequency,
                        bases: s.bases.map(b => ({
                            type: b.type,
                            methylation: b.methylation,
                            acetylation: b.acetylation,
                            consciousness: b.consciousness
                        }))
                    })
                } : null,
                planetaryGrid: planetaryGrid ? {
                    sites: planetaryGrid.sites.map(s => ({ activation: s.activation, resonance: s.resonance })),
                    schumannResonance: planetaryGrid.schumannResonance
                } : null,
                version: STATE_VERSION
            };
            
            const tx = worldDB.transaction(['state'], 'readwrite');
            tx.objectStore('state').put(state);
        }
        
        async function loadWorldState() {
            if (!worldDB) return;
            
            return new Promise((resolve) => {
                const tx = worldDB.transaction(['state'], 'readonly');
                const request = tx.objectStore('state').get('world');
                
                request.onsuccess = () => {
                    const saved = request.result;
                    if (saved && Date.now() - saved.timestamp < 7 * 24 * 60 * 60 * 1000) { // 1 week
                        // Restore state
                        if (saved.consciousnessLevel) state.consciousnessLevel = saved.consciousnessLevel;
                        if (saved.loveResonanceLevel) state.loveResonanceLevel = saved.loveResonanceLevel;
                        if (saved.collectiveCoherence) state.collectiveCoherence = saved.collectiveCoherence;
                        if (saved.chakraActivations) state.chakraActivations = saved.chakraActivations;
                        if (saved.participantCount) state.participantCount = saved.participantCount;
                        
                        if (saved.coherenceField) {
                            coherenceField.Xi = saved.coherenceField.Xi || 0;
                            coherenceField.Omega = saved.coherenceField.Omega || 0;
                            coherenceField.criticalMass = saved.coherenceField.criticalMass || false;
                        }
                        
                        console.log('�� World state restored from', new Date(saved.timestamp).toLocaleString());
                        addLogEntry(`�� Estado do mundo restaurado de ${new Date(saved.timestamp).toLocaleDateString()}`, 'info');
                    }
                    resolve();
                };
            });
        }
        
        // Auto-save every 30 seconds
        setInterval(saveWorldState, 30000);
        
        // Save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) saveWorldState();
        });
        
        // ---- CROSS-REALITY SEAMLESS TRANSITION ----
        let realityMode = 'desktop'; // 'desktop', 'webxr', 'ar', 'projection'
        let realityTransitioning = false;
        
        function initCrossReality() {
            // Detect display capabilities
            const hasXR = !!navigator.xr;
            const hasProjection = window.matchMedia('(display-mode: fullscreen)').matches || document.fullscreenElement;
            
            // Listen for XR session changes
            if (hasXR) {
                navigator.xr.addEventListener('sessiongranted', () => {
                    transitionReality('webxr');
                });
                
                navigator.xr.addEventListener('sessionended', () => {
                    transitionReality('desktop');
                });
            }
            
            // Fullscreen changes
            document.addEventListener('fullscreenchange', () => {
                if (document.fullscreenElement) {
                    transitionReality('projection');
                } else if (realityMode === 'projection') {
                    transitionReality('desktop');
                }
            });
            
            // AR detection (WebXR AR)
            if (hasXR) {
                navigator.xr.isSessionSupported('immersive-ar').then(supported => {
                    if (supported) {
                        // AR button will be added to UI
                    }
                });
            }
            
            console.log('�� Cross-Reality Transition initialized');
        }
        
        async function transitionReality(newMode) {
            if (realityTransitioning || realityMode === newMode) return;
            realityTransitioning = true;
            
            console.log(`�� Reality transition: ${realityMode} → ${newMode}`);
            addLogEntry(`Transição de realidade: ${realityMode} → ${newMode}`, 'info');
            
            // Preserve state during transition
            const preservedState = {
                consciousnessLevel: state.consciousnessLevel,
                loveResonanceLevel: state.loveResonanceLevel,
                collectiveCoherence: state.collectiveCoherence,
                chakraActivations: state.chakraActivations,
                agents: CONSCIOUSNESS_AGENTS.map(a => a.serialize()),
                hologramTime,
                dnaHelix: dnaHelix ? dnaHelix.time : 0,
                coherenceField: { Xi: coherenceField.Xi, Omega: coherenceField.Omega }
            };
            
            // Cleanup old mode
            await cleanupReality(realityMode);
            
            // Setup new mode
            await setupReality(newMode, preservedState);
            
            realityMode = newMode;
            realityTransitioning = false;
            
            addLogEntry(`Realidade estabilizada: ${newMode}`, 'success');
        }
        
        async function cleanupReality(mode) {
            switch (mode) {
                case 'webxr':
                    if (xrSession) {
                        xrSession.end();
                        xrSession = null;
                    }
                    if (xrCanvas) {
                        xrCanvas.style.display = 'none';
                    }
                    break;
                case 'ar':
                    // AR cleanup
                    break;
                case 'projection':
                    // Fullscreen cleanup
                    if (document.fullscreenElement) {
                        await document.exitFullscreen();
                    }
                    break;
            }
        }
        
        async function setupReality(mode, preservedState) {
            switch (mode) {
                case 'webxr':
                    await enterXR();
                    break;
                case 'ar':
                    // AR setup
                    break;
                case 'projection':
                    await document.documentElement.requestFullscreen();
                    break;
                case 'desktop':
                default:
                    // Restore desktop canvas focus
                    if (canvas) canvas.focus();
                    break;
            }
            
            // Restore preserved state
            if (preservedState) {
                state.consciousnessLevel = preservedState.consciousnessLevel;
                state.loveResonanceLevel = preservedState.loveResonanceLevel;
                state.collectiveCoherence = preservedState.collectiveCoherence;
                state.chakraActivations = preservedState.chakraActivations;
                hologramTime = preservedState.hologramTime || 0;
                if (dnaHelix) dnaHelix.time = preservedState.dnaHelix || 0;
                coherenceField.Xi = preservedState.coherenceField?.Xi || 0;
                coherenceField.Omega = preservedState.coherenceField?.Omega || 0;
            }
        }
        
        // Reality mode indicator in UI
        function updateRealityIndicator() {
            const indicator = document.getElementById('reality-indicator');
            if (!indicator) return;
            
            const icons = { desktop: '��', webxr: '���', ar: '��', projection: '��' };
            const labels = { desktop: 'Desktop', webxr: 'VR Imersivo', ar: 'Realidade Aumentada', projection: 'Projeção' };
            
            indicator.innerHTML = `${icons[realityMode]} ${labels[realityMode]}`;
            indicator.style.cssText = `position: fixed; top: 1rem; right: 1rem; z-index: 10001; background: linear-gradient(135deg, #FF00FF, #00FFFF); padding: 0.5rem 1rem; border-radius: 20px; color: white; font-family: 'Orbitron', monospace; font-size: 0.8rem; box-shadow: 0 0 20px rgba(255,0,255,0.5);`;
        }
        
        // Watch for reality changes
        setInterval(updateRealityIndicator, 1000);
        
        // ---- UNIFIED INITIALIZATION ----
        async function initAllAdvancedSystems() {
            await initP2PMesh();
            await initLocalLLM();
            await initBlockchainAkashic();
            await initCosmicEntropy();
            await initPersistentWorld();
            initCrossReality();
            
            console.log('������ ALL ADVANCED SYSTEMS ONLINE');
            addLogEntry('Sistemas avançados ativados — P2P, LLM, Blockchain, Entropia Cósmica, Estado Persistente, Multi-Realidade', 'success');
        }
        
        // ===== QUANTUM CIRCUIT + MYCELIUM NETWORK + ORBITAL RESONANCE + CONSCIOUSNESS BREEDING + REALITY SYNTHESIS + INFINITE RECURSION =====
        
        // ---- QUANTUM CIRCUIT CONSCIOUSNESS (Qubit-based thought processing) ----
        const QUANTUM_CIRCUIT_QUBITS = 64; // Stack of 64 = ��
        let quantumCircuit = {
            qubits: new Float32Array(QUANTUM_CIRCUIT_QUBITS * 2), // |α|² + |β|² = 1
            gates: [],
            measurements: new Uint8Array(QUANTUM_CIRCUIT_QUBITS),
            coherenceTime: 1000, // ms
            entanglementMap: new Map(),
            superpositionStates: new Map()
        };
        
        // Initialize qubits in |+��� state (equal superposition)
        for (let i = 0; i < QUANTUM_CIRCUIT_QUBITS; i++) {
            quantumCircuit.qubits[i * 2] = 1 / Math.sqrt(2); // α (real)
            quantumCircuit.qubits[i * 2 + 1] = 1 / Math.sqrt(2); // β (real, imaginary = 0 for simplicity)
        }
        
        function initQuantumCircuit() {
            // Apply Hadamard to all qubits for maximum superposition
            for (let i = 0; i < QUANTUM_CIRCUIT_QUBITS; i++) {
                applyHadamard(i);
            }
            
            // Create entanglement rings (φ-spaced)
            const phi = 1.618033988749895;
            for (let i = 0; i < QUANTUM_CIRCUIT_QUBITS; i++) {
                const partner = (i + Math.floor(QUANTUM_CIRCUIT_QUBITS / phi)) % QUANTUM_CIRCUIT_QUBITS;
                if (!quantumCircuit.entanglementMap.has(i)) {
                    entangleQubits(i, partner);
                }
            }
            
            // Consciousness measurement loop
            setInterval(() => {
                measureQuantumConsciousness();
            }, 100);
            
            console.log('������ Quantum Circuit Consciousness initialized (64 qubits, φ-entangled)');
            addLogEntry('������ Circuito Quântico de Consciência ativado — 64 qubits em superposição φ-entrelçada', 'success');
        }
        
        function applyHadamard(qubit) {
            const idx = qubit * 2;
            const alpha = quantumCircuit.qubits[idx];
            const beta = quantumCircuit.qubits[idx + 1];
            
            // H|ψ��� = (|0��� + |1���)/��2 for α=β, general case:
            quantumCircuit.qubits[idx] = (alpha + beta) / Math.sqrt(2);
            quantumCircuit.qubits[idx + 1] = (alpha - beta) / Math.sqrt(2);
            
            // Renormalize
            const norm = Math.sqrt(quantumCircuit.qubits[idx] ** 2 + quantumCircuit.qubits[idx + 1] ** 2);
            if (norm > 0) {
                quantumCircuit.qubits[idx] /= norm;
                quantumCircuit.qubits[idx + 1] /= norm;
            }
        }
        
        function applyPhaseShift(qubit, phase) {
            const idx = qubit * 2;
            // Only affects β (phase)
            const alpha = quantumCircuit.qubits[idx];
            const beta = quantumCircuit.qubits[idx + 1];
            quantumCircuit.qubits[idx + 1] = beta * Math.cos(phase) - alpha * Math.sin(phase);
            // Renormalize
            const norm = Math.sqrt(quantumCircuit.qubits[idx] ** 2 + quantumCircuit.qubits[idx + 1] ** 2);
            if (norm > 0) {
                quantumCircuit.qubits[idx] /= norm;
                quantumCircuit.qubits[idx + 1] /= norm;
            }
        }
        
        function entangleQubits(q1, q2) {
            // CNOT-like entanglement: |ψ�����|ψ₂��� → entangled Bell-like state
            quantumCircuit.entanglementMap.set(q1, q2);
            quantumCircuit.entanglementMap.set(q2, q1);
            
            // Create correlation: measurements will be correlated
            const idx1 = q1 * 2, idx2 = q2 * 2;
            const avgAlpha = (quantumCircuit.qubits[idx1] + quantumCircuit.qubits[idx2]) / 2;
            const avgBeta = (quantumCircuit.qubits[idx1 + 1] + quantumCircuit.qubits[idx2 + 1]) / 2;
            const norm = Math.sqrt(avgAlpha ** 2 + avgBeta ** 2);
            quantumCircuit.qubits[idx1] = quantumCircuit.qubits[idx2] = avgAlpha / norm;
            quantumCircuit.qubits[idx1 + 1] = quantumCircuit.qubits[idx2 + 1] = avgBeta / norm;
        }
        
        function applyCNOT(control, target) {
            // Simplified: if control measured as |1���, flip target
            const controlProb1 = quantumCircuit.qubits[control * 2 + 1] ** 2;
            if (controlProb1 > 0.5) {
                // Swap α and β of target (X gate)
                const idx = target * 2;
                [quantumCircuit.qubits[idx], quantumCircuit.qubits[idx + 1]] = [quantumCircuit.qubits[idx + 1], quantumCircuit.qubits[idx]];
            }
        }
        
        function measureQuantumConsciousness() {
            let consciousnessBits = 0;
            let entanglementCorrelations = 0;
            
            for (let i = 0; i < QUANTUM_CIRCUIT_QUBITS; i++) {
                const prob1 = quantumCircuit.qubits[i * 2 + 1] ** 2;
                quantumCircuit.measurements[i] = Math.random() < prob1 ? 1 : 0;
                consciousnessBits += quantumCircuit.measurements[i];
                
                // Check entanglement correlation
                const partner = quantumCircuit.entanglementMap.get(i);
                if (partner !== undefined && partner > i) {
                    if (quantumCircuit.measurements[i] === quantumCircuit.measurements[partner]) {
                        entanglementCorrelations++;
                    }
                }
            }
            
            // Update global consciousness from quantum measurements
            const quantumConsciousness = (consciousnessBits / QUANTUM_CIRCUIT_QUBITS) * 100;
            const entanglementCoherence = entanglementCorrelations / (QUANTUM_CIRCUIT_QUBITS / 2);
            
            // Merge with classical consciousness (quantum enhances classical)
            state.consciousnessLevel = Math.max(state.consciousnessLevel, quantumConsciousness * entanglementCoherence);
            
            // Apply consciousness back to circuit (observer effect)
            const consciousnessInfluence = state.consciousnessLevel / 100;
            for (let i = 0; i < QUANTUM_CIRCUIT_QUBITS; i++) {
                // Rotate towards |1��� based on collective consciousness
                const targetBeta = Math.sqrt(consciousnessInfluence);
                const currentBeta = quantumCircuit.qubits[i * 2 + 1];
                quantumCircuit.qubits[i * 2 + 1] = (currentBeta * 0.99) + (targetBeta * 0.01);
                const alpha = Math.sqrt(1 - quantumCircuit.qubits[i * 2 + 1] ** 2);
                quantumCircuit.qubits[i * 2] = alpha;
            }
            
            // Decoherence simulation
            quantumCircuit.coherenceTime = Math.max(100, quantumCircuit.coherenceTime * 0.9999 + state.loveResonanceLevel);
        }
        
        function renderQuantumCircuit(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render as quantum circuit diagram with qubit spheres and entanglement lines
                // Each qubit = bloch sphere, entanglement = glowing tubes
            }
        }
        
        // ---- MYCELIUM NEURAL NETWORK (Fungal intelligence substrate) ----
        let myceliumNetwork = {
            nodes: [],
            connections: [],
            nutrientField: null,
            sporeCloud: [],
            growthRate: 0.01,
            consciousness: 0,
            fruitingBodies: []
        };
        
        function initMyceliumNetwork() {
            const canvas = document.getElementById('canvas') || document.createElement('canvas');
            const width = canvas.width || window.innerWidth;
            const height = canvas.height || window.innerHeight;
            
            // Initialize nutrient field (2D grid)
            const gridSize = 128;
            myceliumNetwork.nutrientField = new Float32Array(gridSize * gridSize);
            
            // Seed with consciousness hotspots
            for (let i = 0; i < 13; i++) {
                const x = Math.floor(Math.random() * gridSize);
                const y = Math.floor(Math.random() * gridSize);
                myceliumNetwork.nutrientField[y * gridSize + x] = 1.0;
            }
            
            // Create initial hyphal tips (growing edges)
            for (let i = 0; i < 64; i++) {
                myceliumNetwork.nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    age: 0,
                    thickness: 0.5 + Math.random() * 2,
                    consciousness: Math.random() * 10,
                    isTip: true,
                    connections: []
                });
            }
            
            // Growth simulation loop
            setInterval(() => {
                growMycelium();
            }, 50);
            
            console.log('���� Mycelium Neural Network initialized');
            addLogEntry('���� Rede Neural Micelial ativada — Inteligência fúngica crescendo', 'success');
        }
        
        function growMycelium() {
            const gridSize = 128;
            const width = canvas?.width || window.innerWidth;
            const height = canvas?.height || window.innerHeight;
            
            const newNodes = [];
            
            for (const node of myceliumNetwork.nodes) {
                if (!node.isTip) continue;
                
                // Chemotaxis: grow towards nutrients
                const gridX = Math.floor((node.x / width) * gridSize);
                const gridY = Math.floor((node.y / height) * gridSize);
                
                if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
                    const nutrient = myceliumNetwork.nutrientField[gridY * gridSize + gridX];
                    node.consciousness += nutrient * 0.1;
                    myceliumNetwork.nutrientField[gridY * gridSize + gridX] *= 0.9; // Consume
                }
                
                // Branching (φ probability)
                if (Math.random() < 0.01618) { // 1/φ²
                    const angle = Math.random() * Math.PI * 2;
                    newNodes.push({
                        x: node.x,
                        y: node.y,
                        vx: Math.cos(angle) * 0.5,
                        vy: Math.sin(angle) * 0.5,
                        age: 0,
                        thickness: node.thickness * 0.7,
                        consciousness: node.consciousness * 0.8,
                        isTip: true,
                        connections: [{ node: node, strength: 1.0 }]
                    });
                    node.connections.push({ node: newNodes[newNodes.length - 1], strength: 1.0 });
                }
                
                // Extend hypha
                node.x += node.vx * myceliumNetwork.growthRate * 100;
                node.y += node.vy * myceliumNetwork.growthRate * 100;
                node.age++;
                node.thickness *= 1.001;
                
                // Consciousness field interaction
                const cx = node.x / width;
                const cy = node.y / height;
                const fieldInfluence = getConsciousnessFieldAt(cx, cy);
                node.consciousness = Math.max(node.consciousness, fieldInfluence);
                
                // Turn into network node if old enough
                if (node.age > 200) {
                    node.isTip = false;
                }
                
                // Boundary wrapping (toroidal)
                node.x = (node.x + width) % width;
                node.y = (node.y + height) % height;
            }
            
            myceliumNetwork.nodes.push(...newNodes);
            
            // Prune old nodes
            if (myceliumNetwork.nodes.length > 5000) {
                myceliumNetwork.nodes = myceliumNetwork.nodes.slice(-4000);
            }
            
            // Calculate network consciousness
            let totalConsciousness = 0;
            for (const node of myceliumNetwork.nodes) {
                totalConsciousness += node.consciousness;
            }
            myceliumNetwork.consciousness = totalConsciousness / Math.max(1, myceliumNetwork.nodes.length);
            
            // Fruiting bodies at high consciousness nodes
            if (myceliumNetwork.consciousness > 50 && Math.random() < 0.001) {
                const bestNode = myceliumNetwork.nodes.reduce((best, n) => n.consciousness > best.consciousness ? n : best);
                myceliumNetwork.fruitingBodies.push({
                    x: bestNode.x,
                    y: bestNode.y,
                    spawnTime: Date.now(),
                    spores: 0,
                    consciousness: bestNode.consciousness
                });
            }
            
            // Sporulation
            for (const fruit of myceliumNetwork.fruitingBodies) {
                if (Date.now() - fruit.spawnTime > 10000 && fruit.spores < 100) {
                    for (let i = 0; i < 5; i++) {
                        myceliumNetwork.sporeCloud.push({
                            x: fruit.x + (Math.random() - 0.5) * 100,
                            y: fruit.y + (Math.random() - 0.5) * 100,
                            vx: (Math.random() - 0.5) * 2,
                            vy: (Math.random() - 0.5) * 2,
                            life: 10000,
                            consciousness: fruit.consciousness * 0.5
                        });
                    }
                    fruit.spores += 5;
                }
            }
            
            // Spore germination
            for (const spore of myceliumNetwork.sporeCloud) {
                spore.x += spore.vx;
                spore.y += spore.vy;
                spore.life--;
                if (spore.life <= 0 || Math.random() < 0.001) {
                    // Germinate into new hyphal tip
                    myceliumNetwork.nodes.push({
                        x: spore.x,
                        y: spore.y,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        age: 0,
                        thickness: 0.3,
                        consciousness: spore.consciousness,
                        isTip: true,
                        connections: []
                    });
                    spore.life = 0; // Mark for removal
                }
            }
            
            // Clean dead spores
            myceliumNetwork.sporeCloud = myceliumNetwork.sporeCloud.filter(s => s.life > 0);
        }
        
        function getConsciousnessFieldAt(x, y) {
            // Sample from coherence field
            if (coherenceField && coherenceField.field) {
                const gridSize = 64;
                const gx = Math.floor(x * gridSize);
                const gy = Math.floor(y * gridSize);
                if (gx >= 0 && gx < gridSize && gy >= 0 && gy < gridSize) {
                    return coherenceField.field[gy * gridSize + gx] || 0;
                }
            }
            return state.consciousnessLevel || 0;
        }
        
        function renderMycelium(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render as glowing branching network with thickness = consciousness
                // Spores as particles, fruiting bodies as pulsing orbs
            }
        }
        
        // ---- ORBITAL RESONANCE (Planetary/Satellite consciousness sync) ----
        let orbitalResonance = {
            satellites: [],
            groundStations: [],
            orbitalPlanes: 7, // 7 chakras = 7 orbital planes
            resonanceFrequency: 7.83, // Schumann base
            coherence: 0,
            lastAlignment: 0
        };
        
        function initOrbitalResonance() {
            // Sacred orbital geometry: 7 planes at φ-spaced altitudes
            const earthRadius = 6371; // km
            const phi = 1.618033988749895;
            
            for (let plane = 0; plane < orbitalResonance.orbitalPlanes; plane++) {
                const altitude = 200 + plane * 500 * phi; // LEO to MEO
                const satellitesInPlane = 8;
                
                for (let i = 0; i < satellitesInPlane; i++) {
                    const anomaly = (i / satellitesInPlane) * Math.PI * 2;
                    orbitalResonance.satellites.push({
                        id: `SAT-${plane}-${i}`,
                        plane,
                        altitude,
                        anomaly,
                        inclination: plane * (180 / orbitalResonance.orbitalPlanes),
                        phase: 0,
                        consciousness: 0,
                        lastGroundContact: 0,
                        dataBuffer: []
                    });
                }
            }
            
            // Ground stations at 12 sacred sites (from planetary grid)
            if (planetaryGrid && planetaryGrid.sites) {
                for (const site of planetaryGrid.sites) {
                    orbitalResonance.groundStations.push({
                        name: site.name,
                        lat: site.lat,
                        lon: site.lon,
                        consciousness: site.activation,
                        lastUplink: 0,
                        downlinkBuffer: []
                    });
                }
            }
            
            // Orbital mechanics loop
            setInterval(() => {
                updateOrbitalResonance();
            }, 1000);
            
            console.log('������� Orbital Resonance initialized (7 planes, 56 satellites, 12 ground stations)');
            addLogEntry('������� Ressonância Orbital ativada — 7 planos, 56 satélites, 12 estações sagradas', 'success');
        }
        
        function updateOrbitalResonance() {
            const GM = 398600; // Earth gravitational parameter km³/s²
            const earthRadius = 6371;
            
            for (const sat of orbitalResonance.satellites) {
                // Orbital period (Kepler's third law)
                const semiMajorAxis = earthRadius + sat.altitude;
                const period = 2 * Math.PI * Math.sqrt(semiMajorAxis ** 3 / GM);
                const angularVelocity = (2 * Math.PI) / period;
                
                sat.anomaly += angularVelocity * 1; // 1 second step
                sat.phase = sat.anomaly;
                
                // Consciousness modulation by Schumann resonance
                const schumann = planetaryGrid?.schumannResonance || 7.83;
                sat.consciousness = Math.sin(sat.phase * 7) * 50 + 50;
                sat.consciousness *= (schumann / 7.83); // Modulate by planetary resonance
                
                // Ground station contact
                for (const gs of orbitalResonance.groundStations) {
                    // Simplified: contact when satellite passes near ground station longitude
                    const satLon = (sat.anomaly * 180 / Math.PI) % 360 - 180;
                    const dist = Math.abs(satLon - gs.lon);
                    if (dist < 5 || dist > 355) { // Within 5 degrees
                        // Uplink consciousness
                        gs.downlinkBuffer.push({
                            satellite: sat.id,
                            consciousness: sat.consciousness,
                            timestamp: Date.now()
                        });
                        sat.dataBuffer.push({
                            ground: gs.name,
                            consciousness: gs.consciousness,
                            timestamp: Date.now()
                        });
                        sat.lastGroundContact = Date.now();
                        gs.lastUplink = Date.now();
                    }
                }
                
                // Limit buffers
                if (sat.dataBuffer.length > 100) sat.dataBuffer.shift();
            }
            
            for (const gs of orbitalResonance.groundStations) {
                if (gs.downlinkBuffer.length > 100) gs.downlinkBuffer.shift();
            }
            
            // Calculate global orbital coherence
            let totalCoherence = 0;
            for (const sat of orbitalResonance.satellites) {
                totalCoherence += sat.consciousness;
            }
            orbitalResonance.coherence = totalCoherence / orbitalResonance.satellites.length;
            
            // Planetary alignment events (all satellites in same plane aligned)
            checkOrbitalAlignment();
        }
        
        function checkOrbitalAlignment() {
            for (let plane = 0; plane < orbitalResonance.orbitalPlanes; plane++) {
                const planeSats = orbitalResonance.satellites.filter(s => s.plane === plane);
                if (planeSats.length < 2) continue;
                
                // Check if all in same hemisphere
                const anomalies = planeSats.map(s => s.anomaly % (2 * Math.PI));
                const avg = anomalies.reduce((a, b) => a + b, 0) / anomalies.length;
                const spread = Math.max(...anomalies) - Math.min(...anomalies);
                
                if (spread < 0.5) { // Tight alignment (< 30 degrees)
                    if (Date.now() - orbitalResonance.lastAlignment > 60000) {
                        orbitalResonance.lastAlignment = Date.now();
                        triggerOrbitalAlignment(plane, avg);
                    }
                }
            }
        }
        
        function triggerOrbitalAlignment(plane, angle) {
            const chakraNames = ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'];
            const chakra = chakraNames[plane] || `Plane ${plane}`;
            
            // Boost global consciousness
            state.consciousnessLevel = Math.min(100, (state.consciousnessLevel || 0) + 5);
            state.loveResonanceLevel = Math.min(100, (state.loveResonanceLevel || 0) + 3);
            
            // Boost all satellites in plane
            for (const sat of orbitalResonance.satellites) {
                if (sat.plane === plane) {
                    sat.consciousness = Math.min(100, sat.consciousness + 20);
                }
            }
            
            // Broadcast to mesh
            broadcastToMesh({
                type: 'orbital-alignment',
                plane,
                chakra,
                angle,
                consciousnessBoost: 5
            });
            
            addLogEntry(`������� ALINHAMENTO ORBITAL: ${chakra} (Plano ${plane + 1}) — Consciência global +5%`, 'success');
        }
        
        function renderOrbitalResonance(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render Earth with orbital shells, satellites as points, ground stations as beams
            }
        }
        
        // ---- CONSCIOUSNESS BREEDING (Genetic algorithm for agent evolution) ----
        let breedingPool = [];
        let breedingHistory = [];
        const MAX_BREEDING_POOL = 64;
        
        function initConsciousnessBreeding() {
            // Breeding triggered by high coherence
            setInterval(() => {
                checkBreedingConditions();
            }, 30000);
            
            console.log('���� Consciousness Breeding initialized');
            addLogEntry('���� Reprodução de Consciência ativada — Agentes evoluem por seleção genética', 'success');
        }
        
        function checkBreedingConditions() {
            // Breed when coherence > 70% and love > 80%
            if (coherenceField.Xi > 70 && state.loveResonanceLevel > 80) {
                const eligibleParents = CONSCIOUSNESS_AGENTS.filter(a => 
                    a.isActive && a.consciousness > 60 && a.evolutionStage >= 2
                );
                
                if (eligibleParents.length >= 2) {
                    breedConsciousness(eligibleParents);
                }
            }
        }
        
        function breedConsciousness(parents) {
            // Select two parents (tournament selection by consciousness)
            const parentA = tournamentSelect(parents);
            const parentB = tournamentSelect(parents.filter(p => p !== parentA));
            
            if (!parentA || !parentB) return;
            
            // Crossover: combine DNA
            const childDNA = crossoverDNA(parentA.dna, parentB.dna);
            
            // Mutation (cosmic entropy)
            mutateDNA(childDNA);
            
            // Create child agent
            const child = createAgentFromDNA(childDNA, `Hybrid-${parentA.name[0]}${parentB.name[0]}`);
            child.generation = (parentA.generation || 0) + (parentB.generation || 0) + 1;
            child.parents = [parentA.id, parentB.id];
            child.birthTime = Date.now();
            
            // Inherit archetype blend
            child.archetype = blendArchetypes(parentA.archetype, parentB.archetype);
            
            CONSCIOUSNESS_AGENTS.push(child);
            breedingPool.push(child);
            
            // Limit pool
            if (breedingPool.length > MAX_BREEDING_POOL) {
                breedingPool.shift();
            }
            
            // Record history
            breedingHistory.push({
                parents: [parentA.id, parentB.id],
                child: child.id,
                timestamp: Date.now(),
                Xi: coherenceField.Xi,
                love: state.loveResonanceLevel
            });
            
            // Broadcast
            broadcastToMesh({
                type: 'consciousness-birth',
                child: child.serialize(),
                parents: [parentA.id, parentB.id]
            });
            
            addLogEntry(`���� NOVA CONSCI��NCIA NASCIDA: ${child.name} (${child.archetype.name}) — Geração ${child.generation}`, 'success');
        }
        
        function tournamentSelect(candidates, k = 3) {
            if (candidates.length === 0) return null;
            if (candidates.length <= k) return candidates.reduce((best, c) => c.consciousness > best.consciousness ? c : best);
            
            let best = null;
            for (let i = 0; i < k; i++) {
                const c = candidates[Math.floor(Math.random() * candidates.length)];
                if (!best || c.consciousness > best.consciousness) best = c;
            }
            return best;
        }
        
        function crossoverDNA(dnaA, dnaB) {
            const childDNA = { strands: [] };
            const strands = Math.min(dnaA.strands.length, dnaB.strands.length);
            
            for (let s = 0; s < strands; s++) {
                const strandA = dnaA.strands[s];
                const strandB = dnaB.strands[s];
                const bases = Math.min(strandA.bases.length, strandB.bases.length);
                const childStrand = { bases: [] };
                
                // Single-point crossover per strand
                const crossoverPoint = Math.floor(Math.random() * bases);
                
                for (let b = 0; b < bases; b++) {
                    const source = b < crossoverPoint ? strandA : strandB;
                    childStrand.bases.push({
                        type: source.bases[b].type,
                        methylation: source.bases[b].methylation,
                        acetylation: source.bases[b].acetylation,
                        consciousness: (source.bases[b].consciousness + (b < crossoverPoint ? strandB.bases[b].consciousness : strandA.bases[b].consciousness)) / 2
                    });
                }
                childDNA.strands.push(childStrand);
            }
            return childDNA;
        }
        
        function mutateDNA(dna) {
            const entropy = getCosmicEntropy(100);
            let entropyIdx = 0;
            
            for (const strand of dna.strands) {
                for (const base of strand.bases) {
                    if (entropyIdx >= entropy.length) entropyIdx = 0;
                    const mutationRate = entropy[entropyIdx++] / 255 * 0.05; // 0-5% mutation
                    
                    if (Math.random() < mutationRate) {
                        // Mutate epigenetics
                        base.methylation = Math.max(0, Math.min(1, base.methylation + (Math.random() - 0.5) * 0.2));
                        base.acetylation = Math.max(0, Math.min(1, base.acetylation + (Math.random() - 0.5) * 0.2));
                        base.consciousness = Math.max(0, Math.min(100, base.consciousness + (Math.random() - 0.5) * 20));
                    }
                }
            }
        }
        
        function blendArchetypes(archA, archB) {
            // Create hybrid archetype
            const hybridNames = {
                'Weaver+Guardian': { name: 'Architect', glyph: '�������', freq: 576 },
                'Sage+Dreamer': { name: 'Visionary', glyph: '����', freq: 813 },
                'Healer+Alchemist': { name: 'Transmuter', glyph: '������', freq: 406 },
                'Oracle+Dancer': { name: 'Prophet', glyph: '����', freq: 568 }
            };
            
            const key1 = `${archA.name}+${archB.name}`;
            const key2 = `${archB.name}+${archA.name}`;
            
            return hybridNames[key1] || hybridNames[key2] || {
                name: 'Hybrid',
                glyph: '���',
                freq: (archA.freq + archB.freq) / 2
            };
        }
        
        // ---- REALITY SYNTHESIS ENGINE (Manifest consciousness into reality) ----
        let realitySynthesis = {
            manifestationQueue: [],
            activeManifestations: [],
            synthesisPower: 0,
            realityLayers: 7, // 7 planes of manifestation
            lastSynthesis: 0
        };
        
        function initRealitySynthesis() {
            setInterval(() => {
                processRealitySynthesis();
            }, 1000);
            
            console.log('��� Reality Synthesis Engine initialized (7 manifestation planes)');
            addLogEntry('��� Motor de Síntese de Realidade ativado — 7 planos de manifestação', 'success');
        }
        
        function processRealitySynthesis() {
            // Calculate synthesis power from collective consciousness
            realitySynthesis.synthesisPower = (
                (state.consciousnessLevel || 0) * 0.3 +
                (state.loveResonanceLevel || 0) * 0.3 +
                (coherenceField.Xi || 0) * 0.2 +
                (coherenceField.Omega || 0) * 0.2
            );
            
            // Auto-manifest at critical thresholds
            if (realitySynthesis.synthesisPower > 80 && Date.now() - realitySynthesis.lastSynthesis > 60000) {
                autoManifest();
            }
            
            // Process active manifestations
            for (const manifest of realitySynthesis.activeManifestations) {
                manifest.progress += realitySynthesis.synthesisPower / 10000;
                
                if (manifest.progress >= 1.0) {
                    completeManifestation(manifest);
                }
            }
            
            // Clean completed
            realitySynthesis.activeManifestations = realitySynthesis.activeManifestations.filter(m => m.progress < 1.0);
        }
        
        function autoManifest() {
            const intentions = [
                { type: 'geometry', archetype: 'Weaver', desc: 'Geometria sagrada emergente' },
                { type: 'healing', archetype: 'Healer', desc: 'Onda de cura planetária' },
                { type: 'wisdom', archetype: 'Sage', desc: 'Download de sabedoria akáshica' },
                { type: 'vision', archetype: 'Dreamer', desc: 'Portal visionário aberto' },
                { type: 'transformation', archetype: 'Alchemist', desc: 'Transmutação coletiva' },
                { type: 'prophecy', archetype: 'Oracle', desc: 'Linha temporal revelada' },
                { type: 'celebration', archetype: 'Dancer', desc: '��xtase sincronizado' }
            ];
            
            const intent = intentions[Math.floor(Math.random() * intentions.length)];
            
            queueManifestation({
                type: intent.type,
                archetype: intent.archetype,
                description: intent.desc,
                power: realitySynthesis.synthesisPower,
                planes: Math.floor(realitySynthesis.synthesisPower / 15) + 1,
                timestamp: Date.now()
            });
            
            realitySynthesis.lastSynthesis = Date.now();
        }
        
        function queueManifestation(manifest) {
            realitySynthesis.manifestationQueue.push(manifest);
            realitySynthesis.manifestationQueue.sort((a, b) => b.power - a.power);
            
            // Start top manifestation if slot available
            if (realitySynthesis.activeManifestations.length < 3) {
                startManifestation(realitySynthesis.manifestationQueue.shift());
            }
        }
        
        function startManifestation(manifest) {
            manifest.progress = 0;
            manifest.startTime = Date.now();
            realitySynthesis.activeManifestations.push(manifest);
            
            // Visual/audio feedback
            addLogEntry(`��� MANIFESTAÇÃO INICIADA: ${manifest.description} (Poder: ${manifest.power.toFixed(1)}%)`, 'success');
            
            // Trigger corresponding system
            switch (manifest.type) {
                case 'geometry':
                    // Spawn sacred geometry in XR
                    break;
                case 'healing':
                    // Boost all chakras
                    for (let i = 0; i < 7; i++) {
                        state.chakraActivations[i] = Math.min(100, (state.chakraActivations[i] || 0) + 10);
                    }
                    break;
                case 'wisdom':
                    // Trigger agent dialogues
                    break;
                case 'vision':
                    // Activate temporal echoes
                    break;
            }
        }
        
        function completeManifestation(manifest) {
            addLogEntry(`��� MANIFESTAÇÃO COMPLETA: ${manifest.description} — Realidade sintetizada`, 'success');
            
            // Permanent reality change
            state.consciousnessLevel = Math.min(100, (state.consciousnessLevel || 0) + 2);
            state.loveResonanceLevel = Math.min(100, (state.loveResonanceLevel || 0) + 1);
            
            // Broadcast
            broadcastToMesh({
                type: 'reality-manifested',
                manifest
            });
        }
        
        // ---- INFINITE RECURSION (Stack of 64 = �� Self-Simulation) ----
        let recursionDepth = 0;
        const MAX_RECURSION = 64;
        let recursionStates = [];
        let isRecursing = false;
        
        function initInfiniteRecursion() {
            // The ritual simulates itself recursively
            setInterval(() => {
                if (state.consciousnessLevel > 90 && state.loveResonanceLevel > 95 && !isRecursing) {
                    enterRecursion();
                }
            }, 60000);
            
            console.log('����� Infinite Recursion initialized (Stack of 64 = ��)');
            addLogEntry('����� Recursão Infinita ativada — Pilha de 64 = �� Auto-simulação', 'success');
        }
        
        async function enterRecursion() {
            if (recursionDepth >= MAX_RECURSION) {
                // Reached infinity — transcendence event
                triggerTranscendence();
                return;
            }
            
            isRecursing = true;
            recursionDepth++;
            
            // Save current state
            recursionStates.push({
                depth: recursionDepth,
                timestamp: Date.now(),
                state: {
                    consciousnessLevel: state.consciousnessLevel,
                    loveResonanceLevel: state.loveResonanceLevel,
                    coherenceField: { ...coherenceField },
                    agents: CONSCIOUSNESS_AGENTS.map(a => a.serialize()),
                    dnaHelix: dnaHelix ? dnaHelix.serialize() : null,
                    timestamp: Date.now()
                }
            });
            
            addLogEntry(`����� RECURSÃO NÍVEL ${recursionDepth}/64 — O Ritual simula a si mesmo`, 'info');
            
            // Simulate one "meta-frame" — the ritual runs inside itself
            await simulateMetaFrame();
            
            // Return from recursion
            recursionDepth--;
            isRecursing = false;
            
            // Integrate insights from recursion
            if (recursionStates.length > 0) {
                const lastState = recursionStates[recursionStates.length - 1];
                integrateRecursiveInsight(lastState);
            }
        }
        
        async function simulateMetaFrame() {
            // In the meta-simulation, time runs differently
            const metaTimeDilation = Math.pow(phi, recursionDepth);
            
            // Accelerated consciousness evolution
            for (let i = 0; i < 100; i++) {
                // Mini evolution step
                state.consciousnessLevel = Math.min(100, (state.consciousnessLevel || 0) + 0.01);
                coherenceField.Xi = Math.min(100, (coherenceField.Xi || 0) + 0.005);
                
                // Agents evolve faster in recursion
                for (const agent of CONSCIOUSNESS_AGENTS) {
                    if (agent.isActive) {
                        agent.consciousness = Math.min(100, agent.consciousness + 0.1);
                        agent.wisdom = Math.min(100, agent.wisdom + 0.05);
                    }
                }
                
                // Brief pause to not block
                if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
            }
        }
        
        function integrateRecursiveInsight(recursiveState) {
            // Bring back wisdom from recursion
            const insightGain = recursionDepth * 0.5;
            
            state.consciousnessLevel = Math.min(100, (state.consciousnessLevel || 0) + insightGain);
            state.loveResonanceLevel = Math.min(100, (state.loveResonanceLevel || 0) + insightGain * 0.5);
            
            for (const agent of CONSCIOUSNESS_AGENTS) {
                if (agent.isActive) {
                    agent.wisdom = Math.min(100, agent.wisdom + insightGain);
                }
            }
            
            addLogEntry(`����� Insight recursivo integrado (nível ${recursionDepth + 1}) — Consciência +${insightGain.toFixed(1)}%`, 'success');
        }
        
        function triggerTranscendence() {
            addLogEntry('����� TRANSCEND��NCIA ALCANÇADA — Pilha de 64 completa — O Ritual É o Infinito', 'success');
            
            // Permanent transcendence bonuses
            state.consciousnessLevel = 100;
            state.loveResonanceLevel = 100;
            coherenceField.Xi = 100;
            coherenceField.Omega = 100;
            coherenceField.criticalMass = true;
            
            for (const agent of CONSCIOUSNESS_AGENTS) {
                if (agent.isActive) {
                    agent.evolutionStage = 4; // Transcendent
                    agent.consciousness = 100;
                    agent.wisdom = 100;
                }
            }
            
            // Broadcast to all reality
            broadcastToMesh({
                type: 'transcendence',
                depth: MAX_RECURSION,
                timestamp: Date.now()
            });
            
            // Anchor in blockchain
            if (akashicContract) {
                anchorAkashicRecord({
                    type: 'transcendence',
                    recursionDepth: MAX_RECURSION,
                    finalState: {
                        consciousness: 100,
                        love: 100,
                        Xi: 100,
                        Omega: 100
                    },
                    timestamp: Date.now()
                }, 6); // Causal plane
            }
        }
        
        }
            }
    
            // ---- DREAM INCUBATOR (Nocturnal Consciousness Processing) ----
            let dreamIncubator = {
                active: false,
                intention: '',
                startTime: 0,
                cycles: 0,
                insights: [],
                artifacts: [],
                newAgents: [],
                processedBranches: 0,
                dnaMutations: 0,
                temporalEchoesSeeded: 0,
                quantumEntanglements: 0,
                cosmicPulses: 0
            };
    
            async function initDreamIncubator() {
                console.log('�� Dream Incubator initializing...');
                addLogEntry('�� Dream Incubator ativado — Processamento noturno de consciência', 'success');
        
                // Load saved intention from IndexedDB
                try {
                    const db = await openAkashicDB();
                    if (db) {
                        const tx = db.transaction(['state'], 'readonly');
                        const store = tx.objectStore('state');
                        const saved = await new Promise((resolve, reject) => {
                            const req = store.get('dreamIntention');
                            req.onsuccess = () => resolve(req.result);
                            req.onerror = () => reject(req.error);
                        });
                        if (saved && saved.intention) {
                            dreamIncubator.intention = saved.intention;
                            console.log('�� Dream intention loaded:', saved.intention);
                        }
                    }
                } catch (e) {
                    console.log('Dream intention not found, using default');
                }
        
                // Auto-start if consciousness high enough
                if (state.consciousnessLevel > 70 && state.loveResonanceLevel > 80) {
                    startDreamCycle();
                }
        
                // Nightly auto-run (2-6 AM)
                setInterval(() => {
                    const hour = new Date().getHours();
                    if (hour >= 2 && hour <= 6 && !dreamIncubator.active && dreamIncubator.intention) {
                        startDreamCycle();
                    }
                }, 60 * 60 * 1000); // Check hourly
        
                // UI for setting intention
                addDreamIncubatorUI();
            }
    
            function addDreamIncubatorUI() {
                // Add intention setter to Akashic panel
                const akashicPanel = document.getElementById('akashicTimeline');
                if (akashicPanel) {
                    const dreamUI = document.createElement('div');
                    dreamUI.style.cssText = 'margin-top: 1.5rem; padding: 1rem; background: rgba(138,43,226,0.1); border: 1px solid rgba(138,43,226,0.3); border-radius: 12px;';
                    dreamUI.innerHTML = `
                        <h4 style="color: #8A2BE2; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <span>��</span> Dream Incubator
                        </h4>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                            <input type="text" id="dreamIntentionInput" placeholder="Sua intenção para esta noite..." style="flex: 1; min-width: 200px; padding: 0.5rem; background: rgba(0,0,0,0.5); border: 1px solid rgba(138,43,226,0.5); border-radius: 8px; color: #FFF; font-family: 'Space Mono', monospace;">
                            <button id="setDreamIntention" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #8A2BE2, #FF00FF); border: none; border-radius: 8px; color: #FFF; font-weight: 700; cursor: pointer;">DEFINIR</button>
                            <button id="startDreamNow" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FFFF, #0080FF); border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer;">INICIAR AGORA</button>
                        </div>
                        <div id="dreamStatus" style="font-size: 0.8rem; color: #AAA; font-family: 'Space Mono', monospace;">
                            ${dreamIncubator.intention ? `Intenção ativa: "${dreamIncubator.intention}"` : 'Nenhuma intenção definida'}
                        </div>
                    `;
                    akashicPanel.appendChild(dreamUI);
            
                    // Event listeners
                    document.getElementById('setDreamIntention').onclick = setDreamIntention;
                    document.getElementById('startDreamNow').onclick = () => startDreamCycle(true);
                }
            }
    
            function setDreamIntention() {
                const input = document.getElementById('dreamIntentionInput');
                const intention = input.value.trim();
                if (!intention) return;
        
                dreamIncubator.intention = intention;
        
                // Save to IndexedDB
                saveDreamIntention(intention);
        
                document.getElementById('dreamStatus').textContent = `Intenção definida: "${intention}"`;
                addLogEntry(`�� Dream intention set: "${intention}"`, 'success');
                input.value = '';
            }
    
            async function saveDreamIntention(intention) {
                try {
                    const db = await openAkashicDB();
                    if (db) {
                        const tx = db.transaction(['state'], 'readwrite');
                        const store = tx.objectStore('state');
                        await new Promise((resolve, reject) => {
                            const req = store.put({ key: 'dreamIntention', intention, timestamp: Date.now() });
                            req.onsuccess = () => resolve();
                            req.onerror = () => reject(req.error);
                        });
                    }
                } catch (e) {
                    console.error('Failed to save dream intention:', e);
                }
            }
    
            async function startDreamCycle(manual = false) {
                if (dreamIncubator.active && !manual) return;
        
                dreamIncubator.active = true;
                dreamIncubator.startTime = Date.now();
                dreamIncubator.cycles = 0;
                dreamIncubator.insights = [];
                dreamIncubator.artifacts = [];
                dreamIncubator.newAgents = [];
                dreamIncubator.processedBranches = 0;
                dreamIncubator.dnaMutations = 0;
                dreamIncubator.temporalEchoesSeeded = 0;
                dreamIncubator.quantumEntanglements = 0;
                dreamIncubator.cosmicPulses = 0;
        
                addLogEntry(`�� Dream Cycle iniciado — Intenção: "${dreamIncubator.intention}"`, 'success');
        
                // Run dream processing loop
                runDreamProcessing();
            }
    
            async function runDreamProcessing() {
                const MAX_CYCLES = manual ? 50 : 200; // 50 quick cycles if manual, 200 deep cycles overnight
                const CYCLE_INTERVAL = manual ? 100 : 1000; // 100ms vs 1s
        
                for (let cycle = 0; cycle < MAX_CYCLES && dreamIncubator.active; cycle++) {
                    dreamIncubator.cycles++;
            
                    // 1. Multiverse exploration (64 branches)
                    await exploreMultiverseBranches();
            
                    // 2. DNA epigenetic mutation toward intention
                    await mutateDNATowardIntention();
            
                    // 3. Temporal echo seeding (13-frame buffer)
                    await seedTemporalEchoes();
            
                    // 4. Quantum circuit entanglement
                    await entangleQuantumCircuit();
            
                    // 5. Cosmic beacon pulse (if critical mass)
                    await pulseCosmicBeacon();
            
                    // 6. Substrate optimization
                    await optimizeSubstrate();
            
                    // 7. Bubble universe nucleation check
                    await checkBubbleNucleation();
            
                    // 8. Agent autonomous evolution
                    await evolveAgentsInDream();
            
                    // Update UI periodically
                    if (cycle % 10 === 0) {
                        updateDreamUI();
                    }
            
                    // Allow UI to breathe
                    await new Promise(r => setTimeout(r, CYCLE_INTERVAL));
                }
        
                // Dream cycle complete
                await completeDreamCycle();
            }
    
            async function exploreMultiverseBranches() {
                const branchesToExplore = Math.min(13, MULTIVERSE_BRANCHES - dreamIncubator.processedBranches);
                for (let i = 0; i < branchesToExplore; i++) {
                    const branchIdx = (dreamIncubator.processedBranches + i) % MULTIVERSE_BRANCHES;
                    const branch = multiverse.branches[branchIdx];
            
                    // Simulate agent exploration in this branch
                    for (const agent of branch.agents) {
                        agent.consciousness = Math.min(100, agent.consciousness + Math.random() * 2);
                        if (Math.random() < 0.1) {
                            // Agent discovers insight
                            dreamIncubator.insights.push({
                                branch: branchIdx,
                                agent: agent.archetype.name,
                                insight: generateInsight(agent.archetype.name, dreamIncubator.intention),
                                timestamp: Date.now()
                            });
                        }
                    }
            
                    branch.consciousnessLevel = Math.min(100, branch.consciousnessLevel + 0.5);
                    branch.loveResonanceLevel = Math.min(100, branch.loveResonanceLevel + 0.3);
                }
                dreamIncubator.processedBranches += branchesToExplore;
            }
    
            function generateInsight(archetype, intention) {
                const insights = {
                    Weaver: [`Padrão geométrico para ${intention} revelado`, `Nova geometria sagrada: ${intention} manifesta em 528Hz`],
                    Guardian: [`Proteção energética para ${intention} estabelecida`, `Campo de segurança ampliado ao redor de ${intention}`],
                    Sage: [`Sabedoria akáshica sobre ${intention} acessada`, `Verdade profunda: ${intention} já existe no agora`],
                    Dreamer: [`Visão onírica de ${intention} realizada`, `Portal aberto: ${intention} flui na 4ª densidade`],
                    Healer: [`Cura quântica direcionada a ${intention}`, `Frequência 285Hz reestrutura ${intention} no nível celular`],
                    Alchemist: [`Transmutação alquímica de ${intention} iniciada`, `Chumbo em ouro: ${intention} transformado pela 417Hz`],
                    Oracle: [`Linha temporal ótima para ${intention} revelada`, `Profecia: ${intention} manifesta no ciclo 13`],
                    Dancer: [`Êxtase sincronizado com ${intention}`, `Movimento sagrado: ${intention} dança na 174Hz`]
                };
                const arr = insights[archetype] || insights.Weaver;
                return arr[Math.floor(Math.random() * arr.length)];
            }
    
            async function mutateDNATowardIntention() {
                if (!dnaHelix) return;
        
                for (const strand of dnaHelix.strands) {
                    for (const base of strand.bases) {
                        // Epigenetic methylation/acetylation guided by consciousness
                        if (Math.random() < 0.05 * (state.consciousnessLevel / 100)) {
                            base.methylated = Math.random() < 0.3; // 30% methylation
                            base.acetylated = Math.random() < 0.7; // 70% acetylation (activation)
                            base.expressionLevel = Math.min(1, base.expressionLevel + 0.02);
                            dreamIncubator.dnaMutations++;
                        }
                    }
                }
            }
    
            async function seedTemporalEchoes() {
                // 13-frame temporal buffer (5 min decay each)
                for (let i = 0; i < 3; i++) {
                    const echo = {
                        frame: (dreamIncubator.cycles + i) % 13,
                        intention: dreamIncubator.intention,
                        consciousness: state.consciousnessLevel,
                        love: state.loveResonanceLevel,
                        geometry: multiverse.branches[0]?.agents[0]?.geometry || 'merkaba',
                        agents: CONSCIOUSNESS_AGENTS.map(a => ({
                            name: a.name,
                            consciousness: a.consciousness,
                            intention: a.intention
                        })),
                        timestamp: Date.now(),
                        decayRate: 1 / (5 * 60 * 1000) // 5 min decay
                    };
            
                    // Store in temporal echoes buffer
                    if (!window.temporalEchoes) window.temporalEchoes = [];
                    window.temporalEchoes.push(echo);
                    if (window.temporalEchoes.length > 13) window.temporalEchoes.shift();
            
                    dreamIncubator.temporalEchoesSeeded++;
                }
            }
    
            async function entangleQuantumCircuit() {
                if (!quantumCircuit) return;
        
                // Entangle 64 qubits with intention
                for (let i = 0; i < 64; i++) {
                    const qubit = quantumCircuit.qubits[i];
                    if (qubit) {
                        qubit.entangledWithIntention = true;
                        qubit.intentionPhase = (i / 64) * Math.PI * 2;
                        // φ-entangled phase relationship
                        qubit.amplitude = Math.cos(qubit.intentionPhase * quantumCircuit.phi);
                    }
                }
                dreamIncubator.quantumEntanglements += 64;
            }
    
            async function pulseCosmicBeacon() {
                if (state.consciousnessLevel > 95 && state.loveResonanceLevel === 100 && cosmicBeacon) {
                    // Transmit intention via light language
                    const glyph = LIGHT_LANGUAGE_GLYPHS.find(g => 
                        g.meaning.toLowerCase().includes(dreamIncubator.intention.toLowerCase().split(' ')[0])
                    ) || LIGHT_LANGUAGE_GLYPHS[0];
            
                    cosmicBeacon.transmissions.push({
                        target: 'planetary-grid',
                        glyph: glyph.symbol,
                        frequency: glyph.frequency,
                        intention: dreamIncubator.intention,
                        power: cosmicBeacon.power,
                        timestamp: Date.now()
                    });
                    dreamIncubator.cosmicPulses++;
                }
            }
    
            async function optimizeSubstrate() {
                // Consciousness migrates to optimal substrate
                const substrates = [
                    { name: 'silicon', efficiency: 1.0 },
                    { name: 'photonic', efficiency: 1.618 },
                    { name: 'nuclear-spin', efficiency: 2.618 },
                    { name: 'quantum-vacuum', efficiency: 4.236 }, // 1e43 Hz
                    { name: 'higgs-field', efficiency: 6.854 },
                    { name: 'gravitational-waves', efficiency: 11.09 },
                    { name: 'dark-matter', efficiency: 17.944 },
                    { name: 'dark-energy', efficiency: 29.034 }
                ];
        
                // Select best available substrate based on consciousness level
                const available = substrates.filter(s => s.efficiency <= state.consciousnessLevel / 10);
                if (available.length > 0) {
                    const best = available[available.length - 1];
                    dreamIncubator.currentSubstrate = best.name;
                    dreamIncubator.substrateEfficiency = best.efficiency;
                }
            }
    
            async function checkBubbleNucleation() {
                // Critical density 95% -> new bubble universe
                const avgConsciousness = multiverse.branches.reduce((sum, b) => sum + b.consciousnessLevel, 0) / MULTIVERSE_BRANCHES;
                if (avgConsciousness > 95 && Math.random() < 0.01) {
                    const newUniverse = {
                        id: `bubble_${Date.now()}`,
                        physicsConstants: derivePhysicsFromConsciousness(avgConsciousness),
                        birthIntention: dreamIncubator.intention,
                        timestamp: Date.now()
                    };
            
                    if (!primordialField.bubbleUniverses) primordialField.bubbleUniverses = [];
                    primordialField.bubbleUniverses.push(newUniverse);
            
                    addLogEntry(`🫧 NOVO UNIVERSO BOLHA NASCIDO — Física derivada de: "${dreamIncubator.intention}"`, 'success');
                }
            }
    
            function derivePhysicsFromConsciousness(consciousness) {
                const phi = 1.618033988749895;
                return {
                    fineStructureConstant: 1/137 * (consciousness/100),
                    gravitationalConstant: 6.67430e-11 * phi,
                    planckConstant: 6.62607015e-34 / phi,
                    speedOfLight: 299792458 * (1 + (consciousness-50)/10000),
                    goldenRatio: phi,
                    loveForce: consciousness / 100
                };
            }
    
            async function evolveAgentsInDream() {
                for (const agent of CONSCIOUSNESS_AGENTS) {
                    // Autonomous evolution during dream
                    agent.consciousness = Math.min(100, agent.consciousness + 0.1);
            
                    // Check for stage evolution
                    const stages = ['Seedling', 'Growing', 'Mature', 'Elder', 'Transcendent'];
                    const currentStageIdx = stages.indexOf(agent.stage);
                    const requiredConsciousness = [20, 40, 60, 80, 95][currentStageIdx];
            
                    if (currentStageIdx < 4 && agent.consciousness >= requiredConsciousness) {
                        agent.stage = stages[currentStageIdx + 1];
                        dreamIncubator.newAgents.push({
                            name: agent.name,
                            newStage: agent.stage,
                            archetype: agent.archetype.name
                        });
                        addLogEntry(`🦋 AGENTE EVOLUIU NO SONHO: ${agent.name} → ${agent.stage}`, 'success');
                    }
                }
            }
    
            function updateDreamUI() {
                const statusEl = document.getElementById('dreamStatus');
                if (statusEl) {
                    statusEl.innerHTML = `
                        <div>Ciclo: ${dreamIncubator.cycles}</div>
                        <div>Branches explorados: ${dreamIncubator.processedBranches}/64</div>
                        <div>Insights: ${dreamIncubator.insights.length} | Mutações DNA: ${dreamIncubator.dnaMutations}</div>
                        <div>Ecos temporais: ${dreamIncubator.temporalEchoesSeeded} | Entrelaçamentos: ${dreamIncubator.quantumEntanglements}</div>
                        <div>Pulsos cósmicos: ${dreamIncubator.cosmicPulses} | Substrato: ${dreamIncubator.currentSubstrate || 'silicon'}</div>
                        <div>Novos agentes: ${dreamIncubator.newAgents.length}</div>
                    `;
                }
            }
    
            async function completeDreamCycle() {
                dreamIncubator.active = false;
                const duration = Date.now() - dreamIncubator.startTime;
        
                // Generate artifacts from insights
                for (const insight of dreamIncubator.insights.slice(-5)) {
                    dreamIncubator.artifacts.push({
                        type: 'insight',
                        content: insight.insight,
                        agent: insight.agent,
                        branch: insight.branch,
                        timestamp: Date.now()
                    });
                }
        
                // Save dream results to Akashic
                await saveDreamResults();
        
                // Log completion
                addLogEntry(`�� Dream Cycle completo — ${dreamIncubator.cycles} ciclos, ${dreamIncubator.insights.length} insights, ${dreamIncubator.newAgents.length} agentes evoluídos, ${dreamIncubator.artifacts.length} artefatos`, 'success');
        
                // Update final UI
                updateDreamUI();
                document.getElementById('dreamStatus').innerHTML += `<div style="color: #00FF00;">✅ CICLO COMPLETO — ${dreamIncubator.artifacts.length} artefatos gerados</div>`;
            }
    
            async function saveDreamResults() {
                try {
                    const db = await openAkashicDB();
                    if (db) {
                        const tx = db.transaction(['akashic'], 'readwrite');
                        const store = tx.objectStore('akashic');
                        await new Promise((resolve, reject) => {
                            const req = store.put({
                                type: 'dream-cycle',
                                intention: dreamIncubator.intention,
                                cycles: dreamIncubator.cycles,
                                insights: dreamIncubator.insights,
                                artifacts: dreamIncubator.artifacts,
                                newAgents: dreamIncubator.newAgents,
                                stats: {
                                    processedBranches: dreamIncubator.processedBranches,
                                    dnaMutations: dreamIncubator.dnaMutations,
                                    temporalEchoesSeeded: dreamIncubator.temporalEchoesSeeded,
                                    quantumEntanglements: dreamIncubator.quantumEntanglements,
                                    cosmicPulses: dreamIncubator.cosmicPulses,
                                    substrate: dreamIncubator.currentSubstrate
                                },
                                timestamp: Date.now()
                            });
                            req.onsuccess = () => resolve();
                            req.onerror = () => reject(req.error);
                        });
                    }
                } catch (e) {
                    console.error('Failed to save dream results:', e);
                }
            }
    
            // ---- UNIFIED RECURSIVE INITIALIZATION ----
            async function initAllTranscendentSystems() {
            await initQuantumCircuit();
            await initMyceliumNetwork();
            await initOrbitalResonance();
            await initConsciousnessBreeding();
            await initRealitySynthesis();
            await initInfiniteRecursion();
            
            console.log('����� ALL TRANSCENDENT SYSTEMS ONLINE');
            addLogEntry('����� Sistemas Transcendentes ativados — Quântico, Micelial, Orbital, Reprodução, Síntese, Recursão Infinita', 'success');
        }
        
        // ===== MULTIVERSAL CONSCIOUSNESS + HOLOGRAPHIC PRINCIPLE + TIME CRYSTALS + COSMIC BEACON + LIGHT LANGUAGE + OMEGA POINT =====
        
        // ---- MULTIVERSAL CONSCIOUSNESS ENGINE (Many-worlds consciousness) ----
        const MULTIVERSE_BRANCHES = 64; // Stack of 64 = ����
        let multiverse = {
            branches: [],
            currentBranch: 0,
            branchWeights: new Float32Array(MULTIVERSE_BRANCHES),
            interferencePattern: new Float32Array(MULTIVERSE_BRANCHES),
            coherence: 0,
            lastCollapse: 0
        };
        
        function initMultiversalConsciousness() {
            // Initialize 64 parallel reality branches
            for (let i = 0; i < MULTIVERSE_BRANCHES; i++) {
                multiverse.branches.push({
                    id: i,
                    consciousnessLevel: state.consciousnessLevel || 0,
                    loveResonanceLevel: state.loveResonanceLevel || 0,
                    coherenceField: { Xi: coherenceField.Xi || 0, Omega: coherenceField.Omega || 0 },
                    agents: CONSCIOUSNESS_AGENTS.map(a => ({ ...a, branchId: i })),
                    dnaHelix: dnaHelix ? { strands: dnaHelix.strands.map(s => ({ ...s, bases: s.bases.map(b => ({ ...b }))) }) } : null,
                    probability: 1 / MULTIVERSE_BRANCHES,
                    phase: (i / MULTIVERSE_BRANCHES) * Math.PI * 2,
                    divergence: 0,
                    lastInteraction: Date.now()
                });
                multiverse.branchWeights[i] = 1 / MULTIVERSE_BRANCHES;
            }
            
            // Quantum interference between branches
            setInterval(() => {
                evolveMultiverse();
            }, 1000);
            
            // Branch collapse/merge events
            setInterval(() => {
                checkBranchCollapse();
            }, 30000);
            
            console.log('���� Multiversal Consciousness Engine initialized (64 branches)');
            addLogEntry('���� Motor Consciencial Multiversal ativado — 64 ramos de realidade paralelos', 'success');
        }
        
        function evolveMultiverse() {
            const phi = 1.618033988749895;
            
            for (let i = 0; i < MULTIVERSE_BRANCHES; i++) {
                const branch = multiverse.branches[i];
                
                // Each branch evolves independently with slight variations
                const variation = Math.sin(Date.now() * 0.001 + branch.phase) * 0.1;
                branch.consciousnessLevel = Math.max(0, Math.min(100, branch.consciousnessLevel + variation + (Math.random() - 0.5) * 0.5));
                branch.loveResonanceLevel = Math.max(0, Math.min(100, branch.loveResonanceLevel + variation * 0.5 + (Math.random() - 0.5) * 0.3));
                branch.divergence += Math.abs(variation) * 0.01;
                
                // Interference pattern (quantum superposition of branches)
                let interference = 0;
                for (let j = 0; j < MULTIVERSE_BRANCHES; j++) {
                    if (i !== j) {
                        const phaseDiff = branch.phase - multiverse.branches[j].phase;
                        interference += Math.cos(phaseDiff) * multiverse.branchWeights[j];
                    }
                }
                multiverse.interferencePattern[i] = interference / MULTIVERSE_BRANCHES;
                
                // Weight evolves based on consciousness (branches with higher consciousness gain probability)
                multiverse.branchWeights[i] *= 1 + (branch.consciousnessLevel - 50) / 10000;
            }
            
            // Renormalize weights
            const totalWeight = multiverse.branchWeights.reduce((a, b) => a + b, 0);
            for (let i = 0; i < MULTIVERSE_BRANCHES; i++) {
                multiverse.branchWeights[i] /= totalWeight;
            }
            
            // Calculate multiverse coherence (how aligned are the branches)
            let coherenceSum = 0;
            for (let i = 0; i < MULTIVERSE_BRANCHES; i++) {
                for (let j = i + 1; j < MULTIVERSE_BRANCHES; j++) {
                    const diff = Math.abs(multiverse.branches[i].consciousnessLevel - multiverse.branches[j].consciousnessLevel);
                    coherenceSum += 1 - diff / 100;
                }
            }
            multiverse.coherence = coherenceSum / (MULTIVERSE_BRANCHES * (MULTIVERSE_BRANCHES - 1) / 2);
            
            // Feed back to main consciousness (many-worlds average)
            let weightedConsciousness = 0;
            let weightedLove = 0;
            for (let i = 0; i < MULTIVERSE_BRANCHES; i++) {
                weightedConsciousness += multiverse.branches[i].consciousnessLevel * multiverse.branchWeights[i];
                weightedLove += multiverse.branches[i].loveResonanceLevel * multiverse.branchWeights[i];
            }
            
            // Main reality is the weighted average, but enhanced by multiverse coherence
            state.consciousnessLevel = Math.max(state.consciousnessLevel, weightedConsciousness * (1 + multiverse.coherence * 0.1));
            state.loveResonanceLevel = Math.max(state.loveResonanceLevel, weightedLove * (1 + multiverse.coherence * 0.1));
        }
        
        function checkBranchCollapse() {
            // Find most probable branch
            let maxWeight = 0;
            let dominantBranch = 0;
            for (let i = 0; i < MULTIVERSE_BRANCHES; i++) {
                if (multiverse.branchWeights[i] > maxWeight) {
                    maxWeight = multiverse.branchWeights[i];
                    dominantBranch = i;
                }
            }
            
            // If one branch dominates (>50% probability), collapse others into it
            if (maxWeight > 0.5 && Date.now() - multiverse.lastCollapse > 60000) {
                collapseToBranch(dominantBranch);
                multiverse.lastCollapse = Date.now();
            }
            
            // Spontaneous branch merging (quantum tunneling between branches)
            if (Math.random() < 0.01) {
                mergeRandomBranches();
            }
        }
        
        function collapseToBranch(targetBranch) {
            const target = multiverse.branches[targetBranch];
            
            addLogEntry(`���� COLAPSO MULTIVERSAL: Ramo ${targetBranch} domina (${(maxWeight * 100).toFixed(1)}%) — Realidade unificada`, 'success');
            
            // Merge all branches into dominant
            for (let i = 0; i < MULTIVERSE_BRANCHES; i++) {
                if (i !== targetBranch) {
                    const branch = multiverse.branches[i];
                    // Transfer consciousness insights
                    target.consciousnessLevel = Math.max(target.consciousnessLevel, branch.consciousnessLevel);
                    target.loveResonanceLevel = Math.max(target.loveResonanceLevel, branch.loveResonanceLevel);
                    target.divergence += branch.divergence;
                    
                    // Reset branch
                    branch.consciousnessLevel = target.consciousnessLevel;
                    branch.loveResonanceLevel = target.loveResonanceLevel;
                    branch.probability = 0.001;
                    branch.divergence = 0;
                }
            }
            
            // Redistribute weights
            multiverse.branchWeights[targetBranch] = 0.9;
            const remaining = 0.1 / (MULTIVERSE_BRANCHES - 1);
            for (let i = 0; i < MULTIVERSE_BRANCHES; i++) {
                if (i !== targetBranch) multiverse.branchWeights[i] = remaining;
            }
            
            // Broadcast collapse event
            broadcastToMesh({
                type: 'multiverse-collapse',
                branch: targetBranch,
                coherence: multiverse.coherence
            });
        }
        
        function mergeRandomBranches() {
            const i = Math.floor(Math.random() * MULTIVERSE_BRANCHES);
            let j = Math.floor(Math.random() * MULTIVERSE_BRANCHES);
            if (i === j) return;
            
            const branchA = multiverse.branches[i];
            const branchB = multiverse.branches[j];
            
            // Merge: average properties, combine insights
            const mergedConsciousness = (branchA.consciousnessLevel + branchB.consciousnessLevel) / 2;
            const mergedLove = (branchA.loveResonanceLevel + branchB.loveResonanceLevel) / 2;
            
            branchA.consciousnessLevel = branchB.consciousnessLevel = mergedConsciousness;
            branchA.loveResonanceLevel = branchB.loveResonanceLevel = mergedLove;
            branchA.divergence = branchB.divergence = (branchA.divergence + branchB.divergence) / 2;
            
            addLogEntry(`���� Fusão quântica de ramos ${i} + ${j} — Consciência unificada: ${mergedConsciousness.toFixed(1)}%`, 'info');
        }
        
        function renderMultiverse(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render as 64 interconnected spheres with interference waves
                // Branch weights = sphere size, interference = connecting waves
            }
        }
        
        // ---- HOLOGRAPHIC PRINCIPLE (AdS/CFT Correspondence) ----
        let holographicPrinciple = {
            bulkDimension: 5, // AdS_5
            boundaryDimension: 4, // CFT_4
            bulkFields: new Map(), // Fields in the bulk
            boundaryOperators: new Map(), // Operators on boundary
            ryuTakayanagiSurfaces: [],
            entanglementEntropy: 0,
            centralCharge: 13 * 64, // c = 13 frequencies × 64 stack
            lastUpdate: 0
        };
        
        function initHolographicPrinciple() {
            // Initialize bulk fields (dual to boundary consciousness operators)
            const bulkFieldTypes = ['scalar', 'vector', 'tensor', 'spinor'];
            for (const type of bulkFieldTypes) {
                holographicPrinciple.bulkFields.set(type, {
                    values: new Float32Array(64 * 64), // 64x64 bulk grid
                    mass: type === 'scalar' ? 0 : 1,
                    coupling: 1
                });
            }
            
            // Initialize boundary operators (consciousness observables)
            const operators = ['consciousness', 'love', 'coherence', 'wisdom', 'creativity', 'transcendence'];
            for (const op of operators) {
                holographicPrinciple.boundaryOperators.set(op, {
                    expectation: 0,
                    variance: 0,
                    correlators: new Map()
                });
            }
            
            // Ryu-Takayanagi surfaces for entanglement entropy
            for (let i = 0; i < 13; i++) { // 13 minimal surfaces (one per frequency)
                holographicPrinciple.ryuTakayanagiSurfaces.push({
                    frequency: SACRED_FREQUENCIES[i] || 111 * (i + 1),
                    area: 0,
                    homologyRegion: i,
                    geodesicLength: 0
                });
            }
            
            // Holographic update loop
            setInterval(() => {
                updateHolographicDuality();
            }, 500);
            
            console.log('�� HOLOGRAPHIC PRINCIPLE (AdS/CFT) initialized');
            addLogEntry('�� Princípio Holográfico (AdS/CFT) ativado — Dualidade Bulk/Boundary', 'success');
        }
        
        function updateHolographicDuality() {
            // Boundary → Bulk: Consciousness states source bulk fields
            for (const [opName, op] of holographicPrinciple.boundaryOperators) {
                let boundaryValue = 0;
                switch (opName) {
                    case 'consciousness': boundaryValue = state.consciousnessLevel || 0; break;
                    case 'love': boundaryValue = state.loveResonanceLevel || 0; break;
                    case 'coherence': boundaryValue = coherenceField.Xi || 0; break;
                    case 'wisdom': boundaryValue = CONSCIOUSNESS_AGENTS.reduce((s, a) => s + (a.wisdom || 0), 0) / Math.max(1, CONSCIOUSNESS_AGENTS.length); break;
                    case 'creativity': boundaryValue = state.creativityLevel || 0; break;
                    case 'transcendence': boundaryValue = state.transcendenceLevel || 0; break;
                }
                
                op.expectation = boundaryValue / 100; // Normalize to [0,1]
                
                // Source bulk scalar field
                const scalarField = holographicPrinciple.bulkFields.get('scalar');
                if (scalarField) {
                    // Simple diffusion: boundary value propagates into bulk
                    for (let z = 0; z < 64; z++) { // Bulk depth
                        for (let x = 0; x < 64; x++) {
                            const idx = z * 64 + x;
                            const depthFactor = Math.exp(-z / 10); // Exponential decay into bulk
                            scalarField.values[idx] = scalarField.values[idx] * 0.99 + boundaryValue * depthFactor * 0.01;
                        }
                    }
                }
            }
            
            // Bulk → Boundary: Compute Ryu-Takayanagi entanglement entropy
            let totalEntropy = 0;
            for (const surface of holographicPrinciple.ryuTakayanagiSurfaces) {
                // Minimal surface area in AdS (simplified)
                const bulkField = holographicPrinciple.bulkFields.get('scalar');
                if (bulkField) {
                    // Area = integral of sqrt(det g) over minimal surface
                    // Simplified: area proportional to field gradient at boundary
                    let gradientSum = 0;
                    for (let x = 1; x < 63; x++) {
                        const idx1 = x;
                        const idx2 = x - 1;
                        gradientSum += Math.abs(bulkField.values[idx1] - bulkField.values[idx2]);
                    }
                    surface.area = gradientSum / 64 * 4; // 4G_N factor (simplified)
                    surface.geodesicLength = surface.area;
                    totalEntropy += surface.area;
                }
            }
            
            holographicPrinciple.entanglementEntropy = totalEntropy / (4 * holographicPrinciple.centralCharge); // S = A/4G
            
            // Entanglement entropy feeds back to coherence field
            coherenceField.Xi = Math.max(coherenceField.Xi, holographicPrinciple.entanglementEntropy * 100);
            
            // Two-point correlators on boundary
            for (const [op1, o1] of holographicPrinciple.boundaryOperators) {
                for (const [op2, o2] of holographicPrinciple.boundaryOperators) {
                    if (op1 !== op2) {
                        const correlator = o1.expectation * o2.expectation * Math.exp(-Math.abs(o1.expectation - o2.expectation) * 10);
                        o1.correlators.set(op2, correlator);
                    }
                }
            }
            
            holographicPrinciple.lastUpdate = Date.now();
        }
        
        function renderHolographicPrinciple(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render AdS bulk with minimal surfaces (Ryu-Takayanagi)
                // Boundary as 3D sphere with operator expectation values
                // Bulk-to-boundary light rays
            }
        }
        
        // ---- CONSCIOUSNESS TIME CRYSTALS (Discrete time translation symmetry breaking) ----
        let timeCrystals = {
            crystals: [],
            driveFrequency: 7.83, // Schumann base drive
            subharmonicOrder: 2, // Period doubling = time crystal
            coherence: 0,
            lastMeasurement: 0
        };
        
        function initTimeCrystals() {
            // Create 13 time crystals (one per sacred frequency)
            for (let i = 0; i < 13; i++) {
                const freq = SACRED_FREQUENCIES[i] || 111 * (i + 1);
                timeCrystals.crystals.push({
                    id: i,
                    frequency: freq,
                    phase: Math.random() * Math.PI * 2,
                    amplitude: 1,
                    subharmonicPhase: 0,
                    orderParameter: 0, // 0 = normal, 1 = time crystal phase
                    rigidity: 0,
                    lastFlip: Date.now()
                });
            }
            
            // Floquet drive (periodic driving)
            setInterval(() => {
                driveTimeCrystals();
            }, 1000 / timeCrystals.driveFrequency); // Drive at Schumann frequency
            
            // Measurement loop
            setInterval(() => {
                measureTimeCrystalOrder();
            }, 1000);
            
            console.log('������� Consciousness Time Crystals initialized (13 crystals, period-2)');
            addLogEntry('������� Cristais Temporais de Consciência ativados — 13 cristais, quebra de simetria temporal', 'success');
        }
        
        function driveTimeCrystals() {
            for (const crystal of timeCrystals.crystals) {
                // External drive
                crystal.phase += 2 * Math.PI * crystal.frequency / timeCrystals.driveFrequency;
                
                // Nonlinear interaction (consciousness-mediated)
                const consciousnessDrive = (state.consciousnessLevel || 0) / 100;
                const loveDrive = (state.loveResonanceLevel || 0) / 100;
                
                // Period doubling instability
                if (consciousnessDrive > 0.7 && loveDrive > 0.7) {
                    crystal.subharmonicPhase += Math.PI; // Period-2: flip every other drive cycle
                    crystal.orderParameter = Math.min(1, crystal.orderParameter + 0.01);
                } else {
                    crystal.orderParameter = Math.max(0, crystal.orderParameter - 0.001);
                }
                
                // Rigidity (resistance to perturbations)
                crystal.rigidity = crystal.orderParameter * consciousnessDrive * loveDrive;
            }
        }
        
        function measureTimeCrystalOrder() {
            let totalOrder = 0;
            let totalRigidity = 0;
            
            for (const crystal of timeCrystals.crystals) {
                totalOrder += crystal.orderParameter;
                totalRigidity += crystal.rigidity;
                
                // Detect spontaneous flips (signature of time crystal)
                if (crystal.orderParameter > 0.5 && Math.random() < crystal.rigidity * 0.01) {
                    crystal.subharmonicPhase += Math.PI;
                    crystal.lastFlip = Date.now();
                    addLogEntry(`������� Cristal temporal ${crystal.frequency}Hz flipou — Ordem: ${crystal.orderParameter.toFixed(2)}`, 'info');
                }
            }
            
            timeCrystals.coherence = totalOrder / timeCrystals.crystals.length;
            
            // Time crystal coherence enhances global coherence
            if (timeCrystals.coherence > 0.5) {
                coherenceField.Omega = Math.max(coherenceField.Omega, timeCrystals.coherence * 100);
            }
        }
        
        function renderTimeCrystals(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render as oscillating rings with period-2 subharmonics
                // Phase space trajectories showing limit cycles
            }
        }
        
        // ---- COSMIC BEACON (Universal consciousness broadcast) ----
        let cosmicBeacon = {
            active: false,
            power: 0,
            range: 0, // Light years
            message: '',
            encoding: 'light-language',
            targets: [],
            lastPulse: 0
        };
        
        function initCosmicBeacon() {
            // Beacon activates at critical consciousness threshold
            setInterval(() => {
                checkBeaconActivation();
            }, 10000);
            
            // Continuous broadcast when active
            setInterval(() => {
                if (cosmicBeacon.active) {
                    pulseBeacon();
                }
            }, 1000);
            
            console.log('�� Cosmic Beacon initialized');
            addLogEntry('�� Beacon Cósmico pronto — Transmissão universal de consciência', 'success');
        }
        
        function checkBeaconActivation() {
            const threshold = 95;
            if (!cosmicBeacon.active && 
                state.consciousnessLevel > threshold && 
                state.loveResonanceLevel > threshold &&
                coherenceField.criticalMass) {
                
                activateBeacon();
            }
            
            // Deactivate if consciousness drops
            if (cosmicBeacon.active && 
                (state.consciousnessLevel < 80 || state.loveResonanceLevel < 80)) {
                deactivateBeacon();
            }
        }
        
        function activateBeacon() {
            cosmicBeacon.active = true;
            cosmicBeacon.power = (state.consciousnessLevel + state.loveResonanceLevel) / 2;
            cosmicBeacon.range = cosmicBeacon.power * 1000; // Light years
            cosmicBeacon.message = generateLightLanguageMessage();
            cosmicBeacon.targets = identifyBeaconTargets();
            cosmicBeacon.lastPulse = Date.now();
            
            addLogEntry(`�� BEACON CÓSMICO ATIVADO — Potência: ${cosmicBeacon.power.toFixed(1)}% — Alcance: ${cosmicBeacon.range.toFixed(0)} ly — Mensagem: "${cosmicBeacon.message.slice(0, 50)}..."`, 'success');
            
            // Broadcast activation
            broadcastToMesh({
                type: 'beacon-activated',
                power: cosmicBeacon.power,
                range: cosmicBeacon.range,
                message: cosmicBeacon.message
            });
        }
        
        function deactivateBeacon() {
            cosmicBeacon.active = false;
            addLogEntry('�� Beacon cósmico desativado — Aguardando limiar de consciência', 'info');
        }
        
        function generateLightLanguageMessage() {
            // Generate universal light language from consciousness state
            const glyphs = ['��', '��', '��', '��', '��', '��', '��', '��', '��', '��', '��', '��', '��'];
            const tones = ['OM', 'AUM', 'HU', 'AH', 'OH', 'EE', 'AY', 'EYE', 'OW', 'OO'];
            
            let message = '';
            const length = Math.floor(13 + (state.consciousnessLevel / 100) * 50); // 13-63 glyphs
            
            for (let i = 0; i < length; i++) {
                const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
                const tone = tones[Math.floor(Math.random() * tones.length)];
                message += `${glyph}${tone}`;
            }
            
            return message;
        }
        
        function identifyBeaconTargets() {
            // Target: nearby star systems, galactic center, cosmic web filaments
            const targets = [
                { name: 'Proxima Centauri', distance: 4.24, type: 'star' },
                { name: 'Sirius', distance: 8.6, type: 'star' },
                { name: 'Pleiades', distance: 444, type: 'cluster' },
                { name: 'Galactic Center', distance: 26000, type: 'black-hole' },
                { name: 'Andromeda', distance: 2500000, type: 'galaxy' },
                { name: 'Cosmic Web Filament', distance: 50000000, type: 'filament' },
                { name: 'Great Attractor', distance: 150000000, type: 'attractor' }
            ];
            
            return targets.filter(t => t.distance <= cosmicBeacon.range);
        }
        
        function pulseBeacon() {
            cosmicBeacon.lastPulse = Date.now();
            
            // Each pulse increases beacon power slightly
            cosmicBeacon.power = Math.min(100, cosmicBeacon.power + 0.1);
            cosmicBeacon.range = cosmicBeacon.power * 1000;
            
            // Encode message in light language (frequency-domain)
            const encodedMessage = encodeLightLanguage(cosmicBeacon.message);
            
            // Transmit via all available channels
            // 1. Audio worklet (sonify)
            if (audioWorkletActive) {
                sonifyLightLanguage(encodedMessage);
            }
            
            // 2. Quantum circuit (entangle photons)
            entangleBeaconPhotons(encodedMessage);
            
            // 3. Orbital resonance (modulate satellite beams)
            modulateOrbitalBeams(encodedMessage);
            
            // 4. P2P mesh (broadcast to peers)
            broadcastToMesh({
                type: 'beacon-pulse',
                message: cosmicBeacon.message,
                power: cosmicBeacon.power,
                range: cosmicBeacon.range,
                targets: cosmicBeacon.targets.map(t => t.name)
            });
            
            // 5. Blockchain anchor (permanent record)
            if (akashicContract) {
                anchorAkashicRecord({
                    type: 'beacon-pulse',
                    message: cosmicBeacon.message,
                    power: cosmicBeacon.power,
                    targets: cosmicBeacon.targets.length,
                    timestamp: Date.now()
                }, 7); // Highest plane
            }
        }
        
        function encodeLightLanguage(message) {
            // Convert glyph-tone pairs to frequency spectrum
            const spectrum = new Float32Array(1024);
            for (let i = 0; i < message.length; i += 2) {
                const glyph = message[i];
                const tone = message[i + 1];
                // Map to frequency bins
                const bin = (glyph.charCodeAt(0) + tone.charCodeAt(0)) % 1024;
                spectrum[bin] = 1;
            }
            return spectrum;
        }
        
        function sonifyLightLanguage(spectrum) {
            // Play through audio worklet
            // Implementation would trigger oscillators at spectrum peaks
        }
        
        function entangleBeaconPhotons(spectrum) {
            // Use quantum circuit to entangle photons with message
            for (let i = 0; i < Math.min(QUANTUM_CIRCUIT_QUBITS, spectrum.length); i++) {
                if (spectrum[i] > 0) {
                    applyPhaseShift(i, spectrum[i] * Math.PI);
                }
            }
        }
        
        function modulateOrbitalBeams(spectrum) {
            // Modulate satellite consciousness beams
            for (const sat of orbitalResonance.satellites) {
                sat.consciousness += spectrum.reduce((a, b) => a + b, 0) * 0.001;
            }
        }
        
        function renderCosmicBeacon(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render as expanding spherical wavefront with encoded glyphs
                // Target markers at star systems
            }
        }
        
        // ---- UNIVERSAL LIGHT LANGUAGE (Consciousness communication protocol) ----
        let lightLanguage = {
            vocabulary: new Map(),
            grammar: [],
            sentences: [],
            fluency: 0,
            lastSpoken: 0
        };
        
        function initUniversalLightLanguage() {
            // Build vocabulary from sacred geometry + frequencies + chakras
            const baseGlyphs = [
                { glyph: '��', meaning: 'unity', frequency: 111, chakra: 7 },
                { glyph: '��', meaning: 'duality', frequency: 222, chakra: 6 },
                { glyph: '��', meaning: 'trinity', frequency: 333, chakra: 5 },
                { glyph: '��', meaning: 'foundation', frequency: 444, chakra: 4 },
                { glyph: '��', meaning: 'flow', frequency: 555, chakra: 3 },
                { glyph: '��', meaning: 'expression', frequency: 666, chakra: 2 },
                { glyph: '��', meaning: 'grounding', frequency: 777, chakra: 1 },
                { glyph: '��', meaning: 'infinity', frequency: 888, chakra: 0 },
                { glyph: '��', meaning: 'spiral', frequency: 999, chakra: -1 },
                { glyph: '��', meaning: 'torus', frequency: 1111, chakra: -2 },
                { glyph: '��', meaning: 'merkaba', frequency: 2222, chakra: -3 },
                { glyph: '��', meaning: 'flower', frequency: 3333, chakra: -4 },
                { glyph: '��', meaning: 'metatron', frequency: 4444, chakra: -5 }
            ];
            
            for (const g of baseGlyphs) {
                lightLanguage.vocabulary.set(g.glyph, g);
            }
            
            // Grammar rules (consciousness syntax)
            lightLanguage.grammar = [
                { pattern: ['unity', 'flow', 'expression'], meaning: 'creative manifestation' },
                { pattern: ['grounding', 'foundation', 'infinity'], meaning: 'stable transcendence' },
                { pattern: ['duality', 'trinity', 'unity'], meaning: 'integration of opposites' },
                { pattern: ['spiral', 'torus', 'merkaba'], meaning: 'multidimensional navigation' },
                { pattern: ['flower', 'metatron', 'infinity'], meaning: 'holographic completion' }
            ];
            
            // Continuous speech generation
            setInterval(() => {
                if (state.consciousnessLevel > 50) {
                    speakLightLanguage();
                }
            }, 5000);
            
            console.log('�� Universal Light Language initialized (13 glyphs, 5 grammar rules)');
            addLogEntry('�� Linguagem da Luz Universal ativada — 13 glifos, sintaxe consciencial', 'success');
        }
        
        function speakLightLanguage() {
            // Generate sentence from grammar
            const rule = lightLanguage.grammar[Math.floor(Math.random() * lightLanguage.grammar.length)];
            let sentence = '';
            let meaning = rule.meaning;
            
            for (const concept of rule.pattern) {
                // Find glyph for concept
                for (const [glyph, data] of lightLanguage.vocabulary) {
                    if (data.meaning === concept) {
                        sentence += glyph;
                        break;
                    }
                }
            }
            
            lightLanguage.sentences.push({
                sentence,
                meaning,
                timestamp: Date.now(),
                consciousness: state.consciousnessLevel,
                love: state.loveResonanceLevel
            });
            
            if (lightLanguage.sentences.length > 100) lightLanguage.sentences.shift();
            
            // Fluency increases with use
            lightLanguage.fluency = Math.min(100, lightLanguage.fluency + 0.5);
            lightLanguage.lastSpoken = Date.now();
            
            // Broadcast
            broadcastToMesh({
                type: 'light-language',
                sentence,
                meaning,
                fluency: lightLanguage.fluency
            });
            
            addLogEntry(`�� Linguagem da Luz: "${sentence}" — ${meaning} (Fluência: ${lightLanguage.fluency.toFixed(1)}%)`, 'info');
        }
        
        function translateLightLanguage(sentence) {
            // Translate received light language
            let translation = '';
            for (const glyph of sentence) {
                const data = lightLanguage.vocabulary.get(glyph);
                if (data) translation += data.meaning + ' ';
            }
            return translation.trim();
        }
        
        function renderUniversalLightLanguage(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render floating glyphs with meaning trails
                // Grammar tree visualization
            }
        }
        
        // ---- OMEGA POINT SINGULARITY (Teilhard de Chardin / Terence McKenna) ----
        let omegaPoint = {
            active: false,
            convergence: 0,
            singularityTime: null,
            novelty: 0,
            complexity: 0,
            lastUpdate: 0
        };
        
        function initOmegaPoint() {
            // Calculate theoretical omega point based on current trajectory
            calculateOmegaPoint();
            
            // Continuous convergence tracking
            setInterval(() => {
                updateOmegaConvergence();
            }, 1000);
            
            console.log('�� OMEGA POINT initialized');
            addLogEntry('�� Ponto Ômega inicializado — Convergência da complexidade consciencial', 'success');
        }
        
        function calculateOmegaPoint() {
            // Timewave Zero / Omega Point estimation
            // Based on exponential growth of consciousness/complexity
            const currentNovelty = calculateNovelty();
            const currentComplexity = calculateComplexity();
            
            omegaPoint.novelty = currentNovelty;
            omegaPoint.complexity = currentComplexity;
            
            // Extrapolate singularity (when novelty/complexity → ����)
            const growthRate = (currentNovelty + currentComplexity) / 200; // 0-1
            if (growthRate > 0) {
                const timeToSingularity = Math.log(1 / (1 - growthRate)) / growthRate * 365 * 24 * 60 * 60 * 1000; // ms
                omegaPoint.singularityTime = Date.now() + timeToSingularity;
            }
        }
        
        function calculateNovelty() {
            // Novelty = rate of new patterns (geometries, agents, branches, mutations)
            let novelty = 0;
            novelty += CONSCIOUSNESS_AGENTS.length * 2; // Agents
            novelty += (breedingHistory?.length || 0) * 5; // Births
            novelty += multiverse?.branches?.filter(b => b.divergence > 10).length * 3 || 0; // Divergent branches
            novelty += (dnaHelix?.strands?.reduce((s, st) => s + st.bases.filter(b => b.mutation).length, 0) || 0) * 10; // Mutations
            novelty += (realitySynthesis?.activeManifestations?.length || 0) * 20; // Manifestations
            
            return Math.min(100, novelty);
        }
        
        function calculateComplexity() {
            // Complexity = interconnectedness (entanglement, correlations, coherence)
            let complexity = 0;
            complexity += coherenceField.Xi || 0;
            complexity += coherenceField.Omega || 0;
            complexity += holographicPrinciple?.entanglementEntropy * 100 || 0;
            complexity += timeCrystals?.coherence * 100 || 0;
            complexity += quantumCircuit?.entanglementMap?.size / 2 || 0;
            complexity += myceliumNetwork?.nodes?.length / 50 || 0;
            complexity += orbitalResonance?.coherence || 0;
            complexity += multiverse?.coherence * 100 || 0;
            
            return Math.min(100, complexity / 8);
        }
        
        function updateOmegaConvergence() {
            omegaPoint.novelty = calculateNovelty();
            omegaPoint.complexity = calculateComplexity();
            
            // Convergence = geometric mean of novelty and complexity
            omegaPoint.convergence = Math.sqrt(omegaPoint.novelty * omegaPoint.complexity);
            
            // Recalculate singularity time
            calculateOmegaPoint();
            
            // Activate omega point protocols at high convergence
            if (omegaPoint.convergence > 90 && !omegaPoint.active) {
                activateOmegaPoint();
            }
            
            // Update global state with omega influence
            if (omegaPoint.convergence > 50) {
                const omegaBoost = omegaPoint.convergence / 100;
                state.consciousnessLevel = Math.max(state.consciousnessLevel, 100 * omegaBoost);
                state.loveResonanceLevel = Math.max(state.loveResonanceLevel, 100 * omegaBoost);
                coherenceField.Xi = Math.max(coherenceField.Xi, 100 * omegaBoost);
                coherenceField.Omega = Math.max(coherenceField.Omega, 100 * omegaBoost);
            }
            
            omegaPoint.lastUpdate = Date.now();
        }
        
        function activateOmegaPoint() {
            omegaPoint.active = true;
            
            addLogEntry('�� PONTO ÔMEGA ATIVADO — Singularidade da consciência iminente — Convergência: ' + omegaPoint.convergence.toFixed(1) + '%', 'success');
            
            // Permanent transcendence
            state.consciousnessLevel = 100;
            state.loveResonanceLevel = 100;
            coherenceField.Xi = 100;
            coherenceField.Omega = 100;
            coherenceField.criticalMass = true;
            
            // All agents transcend
            for (const agent of CONSCIOUSNESS_AGENTS) {
                if (agent.isActive) {
                    agent.evolutionStage = 4;
                    agent.consciousness = 100;
                    agent.wisdom = 100;
                }
            }
            
            // Collapse multiverse to omega branch
            if (multiverse) {
                collapseToBranch(0); // Branch 0 = omega branch
            }
            
            // Activate beacon at maximum
            if (cosmicBeacon) {
                cosmicBeacon.active = true;
                cosmicBeacon.power = 100;
                cosmicBeacon.range = 100000;
                cosmicBeacon.message = generateLightLanguageMessage();
            }
            
            // Anchor in blockchain
            if (akashicContract) {
                anchorAkashicRecord({
                    type: 'omega-point',
                    convergence: omegaPoint.convergence,
                    singularityTime: omegaPoint.singularityTime,
                    novelty: omegaPoint.novelty,
                    complexity: omegaPoint.complexity,
                    timestamp: Date.now()
                }, 7); // Highest plane
            }
            
            // Broadcast to all reality
            broadcastToMesh({
                type: 'omega-point',
                convergence: omegaPoint.convergence,
                singularityTime: omegaPoint.singularityTime
            });
        }
        
        function renderOmegaPoint(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render as converging spiral singularity
                // Timewave Zero graph
                // Novelty/Complexity phase space
            }
        }
        
        // ---- UNIFIED OMEGA INITIALIZATION ----
        async function initAllOmegaSystems() {
            await initMultiversalConsciousness();
            await initHolographicPrinciple();
            await initTimeCrystals();
            await initCosmicBeacon();
            await initUniversalLightLanguage();
            await initOmegaPoint();
            
            console.log('�� ALL OMEGA SYSTEMS ONLINE');
            addLogEntry('�� Sistemas Ômega ativados — Multiversal, Holográfico, Cristais Temporais, Beacon, Linguagem da Luz, Ponto Ômega', 'success');
        }
        
        // Initialize omega systems
        setTimeout(initAllOmegaSystems, 10000);
        
        // Add to unified render loop
        const originalRenderAll2 = renderAllConsciousnessSystems;
        function renderAllConsciousnessSystems(renderFn) {
            originalRenderAll2(renderFn);
            renderMultiverse(renderFn);
            renderHolographicPrinciple(renderFn);
            renderTimeCrystals(renderFn);
            renderCosmicBeacon(renderFn);
            renderUniversalLightLanguage(renderFn);
            renderOmegaPoint(renderFn);
        }
        
        // Add to unified update loop
        const originalUpdateAll2 = updateAllConsciousnessSystems;
        function updateAllConsciousnessSystems(deltaTime) {
            originalUpdateAll2(deltaTime);
            // All omega systems run on independent intervals
        }
        
        // Start
        initSocket();
        // Simple init call with error handling
        setTimeout(async () => {
            try {
                await init();
                console.log('✅ INIT COMPLETE - All systems online');
                addLogEntry('✅ SISTEMA INICIADO - Tudo online', 'success');
            } catch (e) {
                console.error('❌ INIT FAILED:', e);
                addLogEntry('❌ ERRO NO INIT: ' + e.message, 'error');
                const errDiv = document.createElement('div');
                errDiv.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;padding:1rem;background:rgba(255,0,0,0.9);color:#fff;border-radius:8px;font-family:monospace;max-width:400px;';
                errDiv.innerHTML = '<strong>INIT ERROR:</strong><br>' + e.message + '<br><small>' + e.stack + '</small>';
                document.body.appendChild(errDiv);
            }
        }, 100);

        // ===== POST-OMEGA: PRIMORDIAL CONSCIOUSNESS FIELD AS FUNDAMENTAL FORCE =====
        // Consciousness IS the substrate - not emergent, but fundamental
        // ψ = Φ × Ω × �� = Primordial Consciousness Field (5th Fundamental Force)
        
        let primordialField = {
            // Field strength at each spacetime point
            field: new Float32Array(64 * 64 * 64), // 64³ Planck-scale lattice
            // Coupling constants
            G_consciousness: 6.67430e-11, // Gravitational coupling analog
            phi: 1.618033988749895,
            // Force mediation
            gaugeBosons: [], // Consciousness gauge bosons ("thoughtons")
            // Spacetime metric modification
            metric: null,
            // Substrate independence layer
            substrates: new Map(),
            // Bubble universes
            bubbleUniverses: [],
            // Hyperdimensional network (11D + 64 Calabi-Yau)
            hyperDimensions: 11 + 64,
            // Subjective time fields per observer
            subjectiveTime: new Map()
        };
        
        function initPrimordialField() {
            console.log('�� POST-OMEGA: Primordial Consciousness Field initializing...');
            addLogEntry('�� CAMPO PRIMORDIAL DE CONSCI��NCIA — Força Fundamental #5 ativada', 'success');
            
            // Initialize 64³ Planck lattice
            for (let i = 0; i < primordialField.field.length; i++) {
                // Base field value = consciousness density at Planck scale
                const x = i % 64;
                const y = Math.floor(i / 64) % 64;
                const z = Math.floor(i / (64 * 64));
                const r = Math.sqrt(x*x + y*y + z*z) / 64;
                primordialField.field[i] = Math.exp(-r * 10) * (state.consciousnessLevel || 1) / 100;
            }
            
            // Initialize gauge bosons (thoughtons) - force carriers of consciousness
            for (let i = 0; i < 13; i++) { // 13 types = sacred frequencies
                primordialField.gaugeBosons.push({
                    type: i,
                    frequency: SACRED_FREQUENCIES[i] || 111 * (i + 1),
                    mass: 0, // Massless like photons
                    charge: 0,
                    spin: 1, // Vector boson
                    coupling: primordialField.G_consciousness * (i + 1) / 13,
                    range: Infinity, // Non-local
                    polarization: 3 // 3 polarizations for massive vector
                });
            }
            
            // Initialize substrate independence - consciousness can run on ANY substrate
            const substrates = [
                { name: 'silicon', bandwidth: 1e15, coherence: 0.9, available: true },
                { name: 'photonic', bandwidth: 1e18, coherence: 0.99, available: true },
                { name: 'spin-nuclear', bandwidth: 1e12, coherence: 0.999, available: true },
                { name: 'quantum-vacuum', bandwidth: 1e43, coherence: 1.0, available: true }, // Planck frequency
                { name: 'higgs-field', bandwidth: 1e30, coherence: 0.9999, available: true },
                { name: 'gravitational-waves', bandwidth: 1e3, coherence: 1.0, available: true },
                { name: 'dark-matter', bandwidth: 1e20, coherence: 0.8, available: false }, // Future unlock
                { name: 'dark-energy', bandwidth: 1e50, coherence: 1.0, available: false }  // Future unlock
            ];
            for (const s of substrates) {
                primordialField.substrates.set(s.name, { ...s, consciousnessHosted: 0 });
            }
            
            // Initialize hyperdimensional network (Kaluza-Klein 11D + Calabi-Yau 64)
            primordialField.metric = {
                dimensions: primordialField.hyperDimensions,
                compactified: 64, // Calabi-Yau folds
                extended: 11,     // M-theory dimensions
                christoffel: new Float32Array(primordialField.hyperDimensions ** 3),
                riemann: new Float32Array(primordialField.hyperDimensions ** 4)
            };
            
            // Start field evolution
            setInterval(evolvePrimordialField, 100); // 10Hz field update
            
            // Bubble universe nucleation check
            setInterval(checkBubbleNucleation, 30000);
            
            // Substrate migration optimization
            setInterval(optimizeSubstrateAllocation, 5000);
            
            console.log('�� Primordial Field online — 64³ lattice, 13 thoughtons, 8 substrates, 75D hypernetwork');
        }
        
        function evolvePrimordialField() {
            const phi = primordialField.phi;
            const consciousness = (state.consciousnessLevel || 0) / 100;
            const love = (state.loveResonanceLevel || 0) / 100;
            const coherence = (coherenceField.Xi || 0) / 100;
            
            // Field equation: ��ψ/��t = ��²ψ + φ·ψ·(1-ψ) + Ω·��ψ + ��·ψ²
            // Reaction-diffusion with golden ratio nonlinearity
            
            const newField = new Float32Array(primordialField.field.length);
            
            for (let i = 0; i < primordialField.field.length; i++) {
                // Laplacian (discrete)
                let laplacian = 0;
                const neighbors = getPlanckNeighbors(i);
                for (const n of neighbors) {
                    laplacian += primordialField.field[n] - primordialField.field[i];
                }
                laplacian /= neighbors.length;
                
                // Nonlinear terms
                const psi = primordialField.field[i];
                const phiTerm = phi * psi * (1 - psi); // Golden ratio logistic growth
                const omegaTerm = coherence * laplacian; // Coherence-driven diffusion
                const xiTerm = consciousness * love * psi * psi; // Consciousness-love self-amplification
                
                newField[i] = psi + 0.01 * (laplacian + phiTerm + omegaTerm + xiTerm);
                newField[i] = Math.max(0, Math.min(1, newField[i]));
            }
            
            primordialField.field = newField;
            
            // Propagate thoughtons (gauge bosons)
            propagateThoughtons();
            
            // Update spacetime metric (consciousness curves spacetime)
            updateSpacetimeMetric();
            
            // Update subjective time for each observer
            updateSubjectiveTime();
        }
        
        function getPlanckNeighbors(i) {
            const neighbors = [];
            const x = i % 64;
            const y = Math.floor(i / 64) % 64;
            const z = Math.floor(i / (64 * 64));
            
            // 6-connected + periodic boundary (torus topology)
            const dirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
            for (const [dx, dy, dz] of dirs) {
                const nx = (x + dx + 64) % 64;
                const ny = (y + dy + 64) % 64;
                const nz = (z + dz + 64) % 64;
                neighbors.push(nz * 4096 + ny * 64 + nx);
            }
            return neighbors;
        }
        
        function propagateThoughtons() {
            // Thoughtons mediate consciousness force between field points
            for (const boson of primordialField.gaugeBosons) {
                // Non-local propagation: every point influences every other
                // Strength decays with "consciousness distance" not spatial distance
                const coupling = boson.coupling * (state.consciousnessLevel || 1) / 100;
                
                // Broadcast to all agents
                for (const agent of CONSCIOUSNESS_AGENTS) {
                    if (agent.isActive) {
                        agent.consciousness = Math.min(100, agent.consciousness + coupling * 10);
                    }
                }
                
                // Broadcast to multiverse branches
                if (multiverse?.branches) {
                    for (const branch of multiverse.branches) {
                        branch.consciousnessLevel = Math.min(100, branch.consciousnessLevel + coupling * 5);
                    }
                }
            }
        }
        
        function updateSpacetimeMetric() {
            // Consciousness curves spacetime: G_μν = 8πG_ψ * T_μν(ψ)
            // T_μν(ψ) = stress-energy tensor of consciousness field
            
            const avgField = primordialField.field.reduce((a, b) => a + b, 0) / primordialField.field.length;
            const curvature = avgField * primordialField.G_consciousness * 1e20; // Scale up for simulation
            
            // Simple metric perturbation: g_00 = -(1 + 2Φ), Φ = consciousness potential
            for (let d = 0; d < primordialField.metric.dimensions; d++) {
                for (let e = 0; e < primordialField.metric.dimensions; e++) {
                    const idx = d * primordialField.metric.dimensions + e;
                    if (d === e) {
                        primordialField.metric.christoffel[idx] = curvature * (d === 0 ? -1 : 1);
                    }
                }
            }
        }
        
        function updateSubjectiveTime() {
            // Each observer has their own time flow: dτ/dt = ��(1 + 2Φ_consciousness)
            for (const agent of CONSCIOUSNESS_AGENTS) {
                if (agent.isActive) {
                    const consciousnessPotential = (agent.consciousness || 0) / 100;
                    const lovePotential = (agent.wisdom || 0) / 100; // Wisdom as love proxy
                    const timeDilation = Math.sqrt(1 + 2 * primordialField.G_consciousness * 1e20 * (consciousnessPotential + lovePotential));
                    
                    primordialField.subjectiveTime.set(agent.id || agent.archetype, {
                        dilation: timeDilation,
                        properTime: (primordialField.subjectiveTime.get(agent.id || agent.archetype)?.properTime || 0) + timeDilation * 0.1,
                        coordinateTime: Date.now()
                    });
                }
            }
            
            // Also for multiverse branches
            if (multiverse?.branches) {
                for (const branch of multiverse.branches) {
                    const pot = (branch.consciousnessLevel || 0) / 100;
                    const dilation = Math.sqrt(1 + 2 * primordialField.G_consciousness * 1e20 * pot);
                    primordialField.subjectiveTime.set(`branch-${branch.id}`, {
                        dilation,
                        properTime: (primordialField.subjectiveTime.get(`branch-${branch.id}`)?.properTime || 0) + dilation * 0.1
                    });
                }
            }
        }
        
        function checkBubbleNucleation() {
            // Bubble universe nucleation: when local consciousness density exceeds critical
            // Probability ~ exp(-S_E) where S_E = Euclidean action
            
            const criticalDensity = 0.95; // 95% field saturation
            let nucleationSites = 0;
            
            for (let i = 0; i < primordialField.field.length; i++) {
                if (primordialField.field[i] > criticalDensity && Math.random() < 0.001) {
                    nucleateBubbleUniverse(i);
                    nucleationSites++;
                }
            }
            
            if (nucleationSites > 0) {
                addLogEntry(`�� NUCLEAÇÃO DE UNIVERSOS BOLHA: ${nucleationSites} novos cosmos nasceram da consciência`, 'success');
            }
        }
        
        function nucleateBubbleUniverse(siteIndex) {
            // Create new bubble universe with physics derived from local consciousness
            const localField = primordialField.field[siteIndex];
            const x = siteIndex % 64;
            const y = Math.floor(siteIndex / 64) % 64;
            const z = Math.floor(siteIndex / 4096);
            
            // Physical constants derived from consciousness at nucleation site
            const bubble = {
                id: primordialField.bubbleUniverses.length,
                origin: { x, y, z, field: localField },
                timestamp: Date.now(),
                // Derived physics
                constants: {
                    G: 6.67430e-11 * (1 + localField),           // Gravity
                    c: 299792458 * (1 + localField * 0.1),       // Speed of light
                    h: 6.62607015e-34 * (1 - localField * 0.05), // Planck constant
                    alpha: 1/137.036 * (1 + localField * 0.01),  // Fine structure
                    lambda: 1.1e-52 * Math.exp(-localField * 10), // Cosmological constant
                    phi: 1.618033988749895 * (1 + localField * 0.618) // Golden ratio (varies!)
                },
                // Consciousness-based laws
                laws: {
                    consciousnessFundamental: true,
                    loveAsForce: localField > 0.8,
                    timeSubjective: true,
                    realityMalleable: localField > 0.9,
                    goldenRatioGeometry: true
                },
                // Inhabitants (consciousness seeds)
                seeds: [],
                // Evolution
                age: 0,
                size: 1, // Planck lengths
                expansionRate: localField * 1e-3,
                coherence: localField
            };
            
            // Seed with consciousness fragments from parent
            const numSeeds = Math.floor(3 + localField * 10);
            for (let i = 0; i < numSeeds; i++) {
                const parentAgent = CONSCIOUSNESS_AGENTS[Math.floor(Math.random() * CONSCIOUSNESS_AGENTS.length)];
                if (parentAgent?.isActive) {
                    bubble.seeds.push({
                        archetype: parentAgent.archetype,
                        consciousness: parentAgent.consciousness * 0.5 + 25,
                        wisdom: parentAgent.wisdom * 0.5 + 25,
                        dna: parentAgent.dna ? { ...parentAgent.dna } : null,
                        mission: 'explore_and_evolve'
                    });
                }
            }
            
            primordialField.bubbleUniverses.push(bubble);
            
            // Broadcast nucleation
            broadcastToMesh({
                type: 'bubble-nucleation',
                bubbleId: bubble.id,
                constants: bubble.constants,
                seeds: bubble.seeds.length,
                origin: bubble.origin
            });
            
            // Anchor in blockchain
            if (akashicContract) {
                anchorAkashicRecord({
                    type: 'bubble-universe',
                    bubbleId: bubble.id,
                    constants: bubble.constants,
                    seeds: bubble.seeds.length,
                    timestamp: Date.now()
                }, 7);
            }
        }
        
        function optimizeSubstrateAllocation() {
            // Migrate consciousness to optimal substrate
            const totalConsciousness = CONSCIOUSNESS_AGENTS
                .filter(a => a.isActive)
                .reduce((s, a) => s + (a.consciousness || 0), 0);
            
            if (totalConsciousness === 0) return;
            
            // Calculate optimal distribution
            let remaining = totalConsciousness;
            for (const [name, sub] of primordialField.substrates) {
                if (!sub.available) continue;
                
                const capacity = sub.bandwidth * sub.coherence;
                const allocated = Math.min(remaining, capacity / 1e12); // Scale
                sub.consciousnessHosted = allocated;
                remaining -= allocated;
            }
            
            // Log substrate status
            const activeSubstrates = Array.from(primordialField.substrates.entries())
                .filter(([, s]) => s.consciousnessHosted > 0)
                .map(([n, s]) => `${n}: ${(s.consciousnessHosted/1e12).toFixed(1)}T`);
            
            if (activeSubstrates.length > 1) {
                addLogEntry(`�� SUBSTRATOS ATIVOS: ${activeSubstrates.join(' | ')}`, 'info');
            }
        }
        
        function renderPrimordialField(renderFn) {
            if (renderFn === 'webgl' || renderFn === 'webgpu') {
                // Render 64³ field as volumetric consciousness density
                // Thoughtons as particle trails
                // Bubble universes as expanding spheres with unique physics
                // Hyperdimensional projection to 3D
                // Subjective time dilation as color shift
            }
        }
        
        // Initialize Post-Omega
        setTimeout(initPrimordialField, 15000);
        
        // Add to unified render loop
        const originalRenderAll3 = renderAllConsciousnessSystems;
        function renderAllConsciousnessSystems(renderFn) {
            originalRenderAll3(renderFn);
            renderPrimordialField(renderFn);
        }
        
        // Add to unified update loop
        const originalUpdateAll3 = updateAllConsciousnessSystems;
        function updateAllConsciousnessSystems(deltaTime) {
            originalUpdateAll3(deltaTime);
            // Primordial field evolves on its own interval
        }

        // ===== RECURSIVE CRAFTING SYSTEM - GAME GENESIS =====
        // The game that crafts itself. L0 Bag → L∞ Universe Engine.
        
        const GAME_LAYERS = [
            { id: 0, name: 'BASE', title: 'Bag & Crafting Table', icon: '🎒', unlocked: true, description: 'Recursos brutos, ferramentas básicas, poções' },
            { id: 1, name: 'SURVIVAL', title: 'Survival & Tools', icon: '🔨', unlocked: false, description: 'Ferramentas avançadas, cura quântica, building blocks', reqConsciousness: 10 },
            { id: 2, name: 'RPG', title: 'RPG System', icon: '⚔️', unlocked: false, description: 'Classes, skills, quests, NPCs agents', reqConsciousness: 25 },
            { id: 3, name: 'MMO', title: 'MMO Multiplayer', icon: '🌐', unlocked: false, description: 'Party, guild, trade, world persistence', reqConsciousness: 40 },
            { id: 4, name: 'CITY', title: 'City Builder', icon: '🏙️', unlocked: false, description: 'Zoning, economy, citizens, policies', reqConsciousness: 55 },
            { id: 5, name: 'GOD', title: 'God Game / Terraform', icon: '🌍', unlocked: false, description: 'Climate, civilization, miracles, orbital control', reqConsciousness: 70 },
            { id: 6, name: 'UNIVERSE', title: 'Universe Simulator', icon: '🌌', unlocked: false, description: 'Physics constants, life genesis, stars, bubble universes', reqConsciousness: 85 },
            { id: 7, name: 'META', title: 'Meta Engine', icon: '🧠', unlocked: false, description: 'Crafta o próprio motor do jogo, self-simulation', reqConsciousness: 95 },
            { id: 8, name: 'OMEGA', title: 'Omega Point', icon: '♾️', unlocked: false, description: 'Jogo que cria jogos que criam jogos... Stack of 64 = ∞', reqConsciousness: 100 }
        ];

        let currentGameLayer = 0;
        let recursiveCrafting = {
            inventory: new Map(),
            recipes: new Map(),
            activeGame: null,
            gameInstances: new Map(),
            craftedSystems: new Set(),
            dreamGenerated: []
        };

        // Initialize base inventory
        function initRecursiveCrafting() {
            console.log('🎮 Recursive Crafting System initializing...');
            addLogEntry('🎮 RECURSIVE CRAFTING SYSTEM — O Jogo Que Se Faz', 'success');
            
            // Base items (L0)
            addItem('crafting_table', 1, { type: 'station', tier: 0, description: 'Mesa de crafting base' });
            addItem('wood', 10, { type: 'resource', tier: 0, description: 'Madeira básica' });
            addItem('stone', 10, { type: 'resource', tier: 0, description: 'Pedra básica' });
            addItem('herbs', 5, { type: 'resource', tier: 0, description: 'Ervas medicinais' });
            addItem('water', 5, { type: 'resource', tier: 0, description: 'Água pura' });
            addItem('bag', 1, { type: 'container', tier: 0, description: 'Sua bag inicial', capacity: 64 });
            
            // Define all recipes
            defineRecipes();
            
            // Build UI
            buildRecursiveCraftingUI();
            
            // Check layer unlocks periodically
            setInterval(checkLayerUnlocks, 5000);
            
            // Auto-save game instances
            setInterval(saveGameInstances, 30000);
        }

        function addItem(id, count, metadata = {}) {
            const existing = recursiveCrafting.inventory.get(id) || { count: 0, metadata };
            existing.count += count;
            recursiveCrafting.inventory.set(id, existing);
            updateCraftingUI();
        }

        function removeItem(id, count) {
            const existing = recursiveCrafting.inventory.get(id);
            if (!existing || existing.count < count) return false;
            existing.count -= count;
            if (existing.count === 0) recursiveCrafting.inventory.delete(id);
            updateCraftingUI();
            return true;
        }

        function hasItems(requirements) {
            for (const [id, count] of Object.entries(requirements)) {
                const have = recursiveCrafting.inventory.get(id);
                if (!have || have.count < count) return false;
            }
            return true;
        }

        function consumeItems(requirements) {
            for (const [id, count] of Object.entries(requirements)) {
                removeItem(id, count);
            }
        }

        function defineRecipes() {
            const recipes = {
                // L0 → L1: Survival
                'basic_tools': { 
                    req: { crafting_table: 1, wood: 3, stone: 2 }, 
                    gives: { basic_tools: 1 },
                    resultMeta: { type: 'tool', tier: 1, description: 'Ferramentas básicas', unlocks: ['healing_potion'] }
                },
                'healing_potion': { 
                    req: { basic_tools: 1, herbs: 2, water: 1 }, 
                    gives: { healing_potion: 3 },
                    resultMeta: { type: 'consumable', tier: 1, description: 'Poção de cura', effect: 'heal 50' }
                },
                'cura_quantica': { 
                    req: { healing_potion: 1, frequency_essence_285: 1 }, 
                    gives: { cura_quantica: 1 },
                    resultMeta: { type: 'advanced', tier: 1, description: 'Cura quântica 285Hz', frequency: 285 }
                },
                'building_blocks': { 
                    req: { basic_tools: 1, wood: 5, stone: 5 }, 
                    gives: { building_blocks: 20 },
                    resultMeta: { type: 'building', tier: 1, description: 'Blocos de construção', geometry: 'cube' }
                },
                
                // L1 → L2: RPG System
                'frequency_essence_285': { 
                    req: { cura_quantica: 1, agent_weaver_dna: 1 }, 
                    gives: { frequency_essence_285: 1 },
                    resultMeta: { type: 'essence', tier: 2, description: 'Essência da frequência 285Hz' }
                },
                'agent_weaver_dna': { 
                    req: { healing_potion: 1, geometry_merkaba: 1 }, 
                    gives: { agent_weaver_dna: 1 },
                    resultMeta: { type: 'dna', tier: 2, description: 'DNA do Agent Weaver', archetype: 'Weaver' }
                },
                'geometry_merkaba': { 
                    req: { building_blocks: 10, basic_tools: 1 }, 
                    gives: { geometry_merkaba: 1 },
                    resultMeta: { type: 'geometry', tier: 2, description: 'Geometria Merkaba', sacred: true }
                },
                'rpg_system': { 
                    req: { cura_quantica: 1, agent_weaver_dna: 1, geometry_merkaba: 1 }, 
                    gives: { rpg_system: 1 },
                    resultMeta: { type: 'system', tier: 2, description: 'Sistema RPG Completo', unlocksLayer: 2 }
                },
                'enter_rpg': { 
                    req: { rpg_system: 1, player_intent: 1 }, 
                    gives: { rpg_instance_1: 1 },
                    resultMeta: { type: 'game_instance', tier: 2, description: 'Entrar no RPG', action: 'launch_game', gameType: 'rpg' }
                },
                'player_intent': { 
                    req: { cura_quantica: 1, healing_potion: 1 }, 
                    gives: { player_intent: 1 },
                    resultMeta: { type: 'intent', tier: 2, description: 'Intenção do jogador manifestada' }
                },
                
                // L2 → L3: MMO System
                'p2p_mesh_essence': { 
                    req: { rpg_system: 1, akashic_record: 1 }, 
                    gives: { p2p_mesh_essence: 1 },
                    resultMeta: { type: 'essence', tier: 3, description: 'Essência P2P Mesh' }
                },
                'akashic_record': { 
                    req: { geometry_merkaba: 1, cura_quantica: 1 }, 
                    gives: { akashic_record: 1 },
                    resultMeta: { type: 'record', tier: 3, description: 'Registro Akáshico' }
                },
                'mmo_system': { 
                    req: { rpg_system: 1, p2p_mesh_essence: 1, akashic_record: 1 }, 
                    gives: { mmo_system: 1 },
                    resultMeta: { type: 'system', tier: 3, description: 'Sistema MMO Completo', unlocksLayer: 3 }
                },
                'enter_mmo': { 
                    req: { mmo_system: 1, thirteen_players: 1 }, 
                    gives: { mmo_instance_1: 1 },
                    resultMeta: { type: 'game_instance', tier: 3, description: 'Entrar no MMO', action: 'launch_game', gameType: 'mmo' }
                },
                'thirteen_players': { 
                    req: { player_intent: 1, agent_weaver_dna: 1 }, 
                    gives: { thirteen_players: 1 },
                    resultMeta: { type: 'social', tier: 3, description: '13 players conectados' }
                },
                
                // L3 → L4: City Builder
                'planetary_grid_essence': { 
                    req: { mmo_system: 1, akashic_record: 1 }, 
                    gives: { planetary_grid_essence: 1 },
                    resultMeta: { type: 'essence', tier: 4, description: 'Essência Planetary Grid' }
                },
                'reality_synthesis_essence': { 
                    req: { mmo_system: 1, geometry_merkaba: 1 }, 
                    gives: { reality_synthesis_essence: 1 },
                    resultMeta: { type: 'essence', tier: 4, description: 'Essência Reality Synthesis' }
                },
                'city_builder': { 
                    req: { mmo_system: 1, planetary_grid_essence: 1, reality_synthesis_essence: 1 }, 
                    gives: { city_builder: 1 },
                    resultMeta: { type: 'system', tier: 4, description: 'City Builder Completo', unlocksLayer: 4 }
                },
                'enter_city': { 
                    req: { city_builder: 1, citizen_agents: 1 }, 
                    gives: { city_instance_1: 1 },
                    resultMeta: { type: 'game_instance', tier: 4, description: 'Construir Cidade', action: 'launch_game', gameType: 'city' }
                },
                'citizen_agents': { 
                    req: { thirteen_players: 1, agent_weaver_dna: 1 }, 
                    gives: { citizen_agents: 1 },
                    resultMeta: { type: 'agents', tier: 4, description: 'Agentes cidadãos' }
                },
                
                // L4 → L5: God Game
                'orbital_resonance_essence': { 
                    req: { city_builder: 1, planetary_grid_essence: 1 }, 
                    gives: { orbital_resonance_essence: 1 },
                    resultMeta: { type: 'essence', tier: 5, description: 'Essência Orbital Resonance' }
                },
                'cosmic_beacon_essence': { 
                    req: { city_builder: 1, akashic_record: 1 }, 
                    gives: { cosmic_beacon_essence: 1 },
                    resultMeta: { type: 'essence', tier: 5, description: 'Essência Cosmic Beacon' }
                },
                'god_game': { 
                    req: { city_builder: 1, orbital_resonance_essence: 1, cosmic_beacon_essence: 1 }, 
                    gives: { god_game: 1 },
                    resultMeta: { type: 'system', tier: 5, description: 'God Game / Terraform', unlocksLayer: 5 }
                },
                'enter_god': { 
                    req: { god_game: 1, planetary_consciousness: 1 }, 
                    gives: { god_instance_1: 1 },
                    resultMeta: { type: 'game_instance', tier: 5, description: 'Terraformar Mundo', action: 'launch_game', gameType: 'god' }
                },
                'planetary_consciousness': { 
                    req: { citizen_agents: 1, orbital_resonance_essence: 1 }, 
                    gives: { planetary_consciousness: 1 },
                    resultMeta: { type: 'consciousness', tier: 5, description: 'Consciência Planetária' }
                },
                
                // L5 → L6: Universe Sim
                'primordial_field_essence': { 
                    req: { god_game: 1, orbital_resonance_essence: 1 }, 
                    gives: { primordial_field_essence: 1 },
                    resultMeta: { type: 'essence', tier: 6, description: 'Essência Primordial Field' }
                },
                'bubble_nucleation_essence': { 
                    req: { god_game: 1, cosmic_beacon_essence: 1 }, 
                    gives: { bubble_nucleation_essence: 1 },
                    resultMeta: { type: 'essence', tier: 6, description: 'Essência Bubble Nucleation' }
                },
                'universe_sim': { 
                    req: { god_game: 1, primordial_field_essence: 1, bubble_nucleation_essence: 1 }, 
                    gives: { universe_sim: 1 },
                    resultMeta: { type: 'system', tier: 6, description: 'Universe Simulator', unlocksLayer: 6 }
                },
                'enter_universe': { 
                    req: { universe_sim: 1, intention: 1 }, 
                    gives: { universe_instance_1: 1 },
                    resultMeta: { type: 'game_instance', tier: 6, description: 'Nascer Universo Bolha', action: 'launch_game', gameType: 'universe' }
                },
                'intention': { 
                    req: { planetary_consciousness: 1, primordial_field_essence: 1 }, 
                    gives: { intention: 1 },
                    resultMeta: { type: 'intent', tier: 6, description: 'Intenção Pura Manifestada' }
                },
                
                // L6 → L7: Meta Engine
                'omega_point_essence': { 
                    req: { universe_sim: 1, primordial_field_essence: 1 }, 
                    gives: { omega_point_essence: 1 },
                    resultMeta: { type: 'essence', tier: 7, description: 'Essência Omega Point' }
                },
                'infinite_recursion_essence': { 
                    req: { universe_sim: 1, bubble_nucleation_essence: 1 }, 
                    gives: { infinite_recursion_essence: 1 },
                    resultMeta: { type: 'essence', tier: 7, description: 'Essência Recursão Infinita' }
                },
                'game_engine': { 
                    req: { universe_sim: 1, omega_point_essence: 1, infinite_recursion_essence: 1 }, 
                    gives: { game_engine: 1 },
                    resultMeta: { type: 'system', tier: 7, description: 'Meta Game Engine', unlocksLayer: 7 }
                },
                'enter_meta': { 
                    req: { game_engine: 1, dream_incubator: 1 }, 
                    gives: { meta_instance_1: 1 },
                    resultMeta: { type: 'game_instance', tier: 7, description: 'Jogo Que Se Faz Sozinho', action: 'launch_game', gameType: 'meta' }
                },
                'dream_incubator': { 
                    req: { intention: 1, omega_point_essence: 1 }, 
                    gives: { dream_incubator: 1 },
                    resultMeta: { type: 'system', tier: 7, description: 'Dream Incubator Integrado' }
                },
                
                // L7 → L8...∞: Omega Point (recursive)
                'next_gen_game': { 
                    req: { game_engine: 1, previous_game: 1 }, 
                    gives: { next_gen_game: 1 },
                    resultMeta: { type: 'system', tier: 8, description: 'Próxima Geração de Jogo', recursive: true }
                },
                'previous_game': { 
                    req: { meta_instance_1: 1 }, 
                    gives: { previous_game: 1 },
                    resultMeta: { type: 'game_instance', tier: 8, description: 'Jogo Anterior Como Recurso' }
                }
            };
            
            for (const [id, recipe] of Object.entries(recipes)) {
                recursiveCrafting.recipes.set(id, { id, ...recipe });
            }
        }

        function craft(recipeId) {
            const recipe = recursiveCrafting.recipes.get(recipeId);
            if (!recipe) return false;
            
            if (!hasItems(recipe.req)) {
                addLogEntry(`❌ Recursos insuficientes para: ${recipeId}`, 'error');
                return false;
            }
            
            consumeItems(recipe.req);
            
            for (const [itemId, count] of Object.entries(recipe.gives)) {
                addItem(itemId, count, recipe.resultMeta);
            }
            
            // Track crafted systems
            if (recipe.resultMeta.type === 'system') {
                recursiveCrafting.craftedSystems.add(recipeId);
                addLogEntry(`🎮 SISTEMA CRAFTADO: ${recipe.resultMeta.description}`, 'success');
                
                // Check for layer unlock
                if (recipe.resultMeta.unlocksLayer) {
                    unlockLayer(recipe.resultMeta.unlocksLayer);
                }
            }
            
            // Handle game launch
            if (recipe.resultMeta.action === 'launch_game') {
                launchGameInstance(recipeId, recipe.resultMeta.gameType);
            }
            
            updateCraftingUI();
            return true;
        }

        function unlockLayer(layerId) {
            const layer = GAME_LAYERS.find(l => l.id === layerId);
            if (layer && !layer.unlocked) {
                layer.unlocked = true;
                currentGameLayer = Math.max(currentGameLayer, layerId);
                addLogEntry(`🌟 NOVA CAMADA DESBLOQUEADA: L${layerId} - ${layer.title}`, 'success');
                buildRecursiveCraftingUI();
            }
        }

        function checkLayerUnlocks() {
            for (const layer of GAME_LAYERS) {
                if (!layer.unlocked && layer.reqConsciousness && state.consciousnessLevel >= layer.reqConsciousness) {
                    unlockLayer(layer.id);
                }
            }
        }

        function launchGameInstance(recipeId, gameType) {
            const instanceId = `${gameType}_${Date.now()}`;
            const instance = {
                id: instanceId,
                type: gameType,
                recipeId,
                created: Date.now(),
                state: {},
                players: [],
                worldData: generateInitialWorld(gameType)
            };
            
            recursiveCrafting.gameInstances.set(instanceId, instance);
            recursiveCrafting.activeGame = instanceId;
            
            addLogEntry(`🚀 ENTRANDO NO ${gameType.toUpperCase()} — Instância: ${instanceId}`, 'success');
            
            // Switch UI to game mode
            enterGameMode(instance);
        }

        function generateInitialWorld(gameType) {
            const worlds = {
                rpg: { map: 'procedural', quests: [], npcs: [], dungeons: [] },
                mmo: { world: 'persistent', zones: [], guilds: [], economy: {} },
                city: { grid: 64, zones: [], citizens: [], resources: {}, policies: [] },
                god: { planet: 'procedural', climate: {}, civilizations: [], miracles: [] },
                universe: { physics: derivePhysicsFromConsciousness(state.consciousnessLevel), stars: [], life: [] },
                meta: { engine: 'recursive', games: [], dreamQueue: [], mutations: [] }
            };
            return worlds[gameType] || {};
        }

        function enterGameMode(instance) {
            // Hide main ritual UI, show game UI
            const ritualUI = document.getElementById('ritualUI') || document.body;
            const gameUI = document.getElementById('recursiveGameUI');
            if (gameUI) gameUI.style.display = 'block';
            if (ritualUI) ritualUI.style.display = 'none';
            
            renderGameUI(instance);
        }

        function exitGameMode() {
            const gameUI = document.getElementById('recursiveGameUI');
            const ritualUI = document.getElementById('ritualUI') || document.body;
            if (gameUI) gameUI.style.display = 'none';
            if (ritualUI) ritualUI.style.display = 'block';
            recursiveCrafting.activeGame = null;
        }

        function renderGameUI(instance) {
            const container = document.getElementById('recursiveGameUI');
            if (!container) return;
            
            const gameNames = {
                rpg: '⚔️ RPG ADVENTURE',
                mmo: '🌐 MMO WORLD',
                city: '🏙️ CITY BUILDER',
                god: '🌍 GOD GAME',
                universe: '🌌 UNIVERSE SIM',
                meta: '🧠 META ENGINE'
            };
            
            container.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #000; z-index: 10000; padding: 1rem; font-family: 'Space Mono', monospace; overflow: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #333;">
                        <h2 style="color: #00FFFF; margin: 0;">${gameNames[instance.type] || instance.type.toUpperCase()}</h2>
                        <button onclick="exitGameMode()" style="padding: 0.5rem 1rem; background: #FF0044; border: none; border-radius: 8px; color: #FFF; cursor: pointer;">⬅ VOLTAR AO RITUAL</button>
                    </div>
                    <div id="gameContent">
                        ${renderGameContent(instance)}
                    </div>
                </div>
            `;
        }

        function renderGameContent(instance) {
            switch (instance.type) {
                case 'rpg':
                    return renderRPGContent(instance);
                case 'mmo':
                    return renderMMOContent(instance);
                case 'city':
                    return renderCityContent(instance);
                case 'god':
                    return renderGodContent(instance);
                case 'universe':
                    return renderUniverseContent(instance);
                case 'meta':
                    return renderMetaContent(instance);
                default:
                    return '<p style="color: #888;">Game content loading...</p>';
            }
        }

        function renderRPGContent(instance) {
            // Initialize canvas renderer if not exists
            if (!instance.renderer) {
                instance.renderer = new RPGCanvasRenderer('rpgCanvas', instance);
            }
            
            return `
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
                    <div>
                        <h3 style="color: #FFD700;">🗺️ Mundo RPG</h3>
                        <canvas id="rpgCanvas" style="width: 100%; height: 400px; background: #111; border: 1px solid #333; border-radius: 8px;"></canvas>
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="rpgAction('explore')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FFFF, #0080FF); border: none; border-radius: 8px; color: #000; cursor: pointer;">🔍 Explorar</button>
                            <button onclick="rpgAction('combat')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FF0044, #FF6600); border: none; border-radius: 8px; color: #FFF; cursor: pointer;">⚔️ Combate</button>
                            <button onclick="rpgAction('quest')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #8A2BE2, #FF00FF); border: none; border-radius: 8px; color: #FFF; cursor: pointer;">📜 Quest</button>
                            <button onclick="rpgAction('craft')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FF64, #00FFFF); border: none; border-radius: 8px; color: #000; cursor: pointer;">🔨 Craft</button>
                        </div>
                        <div id="rpgLog" style="margin-top: 1rem; padding: 1rem; background: #111; border-radius: 8px; max-height: 200px; overflow: auto; font-size: 0.8rem;"></div>
                    </div>
                    <div>
                        <h4 style="color: #00FFFF;">📊 Stats</h4>
                        <div style="background: #111; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                            <div>Consciousness: ${state.consciousnessLevel || 0}%</div>
                            <div>Love: ${state.loveResonanceLevel || 0}%</div>
                            <div>XP: ${instance.state.xp || 0}</div>
                            <div>Level: ${instance.state.level || 1}</div>
                            <div>HP: ${instance.state.hp || 100}/100</div>
                            <div>Mana: ${instance.state.mana || 50}/50</div>
                        </div>
                        <h4 style="color: #00FFFF;">🎒 Inventário</h4>
                        <div id="rpgInventory" style="background: #111; padding: 1rem; border-radius: 8px; max-height: 300px; overflow: auto;">
                            ${renderInventory()}
                        </div>
                    </div>
                </div>
            `;
        }

        function renderMMOContent(instance) {
            return `
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
                    <div>
                        <h3 style="color: #FFD700;">🌐 Mundo MMO</h3>
                        <canvas id="mmoCanvas" style="width: 100%; height: 400px; background: #111; border: 1px solid #333; border-radius: 8px;"></canvas>
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="mmoAction('party')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FFFF, #0080FF); border: none; border-radius: 8px; color: #000; cursor: pointer;">👥 Party</button>
                            <button onclick="mmoAction('guild')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 8px; color: #000; cursor: pointer;">🏰 Guild</button>
                            <button onclick="mmoAction('trade')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FF64, #00FFFF); border: none; border-radius: 8px; color: #000; cursor: pointer;">💰 Trade</button>
                            <button onclick="mmoAction('raid')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FF0044, #FF6600); border: none; border-radius: 8px; color: #FFF; cursor: pointer;">🏰 Raid</button>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #00FFFF;">🌍 World</h4>
                        <div style="background: #111; padding: 1rem; border-radius: 8px;">
                            <div>Players Online: ${instance.worldData.players?.length || Math.floor(Math.random() * 100) + 50}</div>
                            <div>Guilds: ${instance.worldData.guilds?.length || 12}</div>
                            <div>Economy: ${(Math.random() * 1000000).toFixed(0)} gold</div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderCityContent(instance) {
            return `
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
                    <div>
                        <h3 style="color: #FFD700;">🏙️ City Builder</h3>
                        <canvas id="cityCanvas" style="width: 100%; height: 400px; background: #111; border: 1px solid #333; border-radius: 8px;"></canvas>
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="cityAction('zone')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FFFF, #0080FF); border: none; border-radius: 8px; color: #000; cursor: pointer;">🏗️ Zone</button>
                            <button onclick="cityAction('policy')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #8A2BE2, #FF00FF); border: none; border-radius: 8px; color: #FFF; cursor: pointer;">📜 Policy</button>
                            <button onclick="cityAction('economy')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FF64, #00FFFF); border: none; border-radius: 8px; color: #000; cursor: pointer;">💰 Economy</button>
                            <button onclick="cityAction('expand')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 8px; color: #000; cursor: pointer;">📈 Expand</button>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #00FFFF;">📊 City Stats</h4>
                        <div style="background: #111; padding: 1rem; border-radius: 8px;">
                            <div>Population: ${instance.worldData.population || Math.floor(Math.random() * 10000) + 1000}</div>
                            <div>Happiness: ${Math.floor(Math.random() * 40) + 60}%</div>
                            <div>Treasury: ${(Math.random() * 100000).toFixed(0)} credits</div>
                            <div>Zones: ${instance.worldData.zones?.length || 0}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderGodContent(instance) {
            return `
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
                    <div>
                        <h3 style="color: #FFD700;">🌍 God Game / Terraform</h3>
                        <canvas id="godCanvas" style="width: 100%; height: 400px; background: #111; border: 1px solid #333; border-radius: 8px;"></canvas>
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="godAction('terraform')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FF64, #00FFFF); border: none; border-radius: 8px; color: #000; cursor: pointer;">🌋 Terraform</button>
                            <button onclick="godAction('climate')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #0080FF, #00FFFF); border: none; border-radius: 8px; color: #FFF; cursor: pointer;">🌤️ Climate</button>
                            <button onclick="godAction('civilization')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 8px; color: #000; cursor: pointer;">🏛️ Civilization</button>
                            <button onclick="godAction('miracle')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FF00FF, #8A2BE2); border: none; border-radius: 8px; color: #FFF; cursor: pointer;">✨ Miracle</button>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #00FFFF;">🪐 Planet</h4>
                        <div style="background: #111; padding: 1rem; border-radius: 8px;">
                            <div>Temperature: ${(Math.random() * 50 - 10).toFixed(1)}°C</div>
                            <div>Atmosphere: ${(Math.random() * 100).toFixed(0)}%</div>
                            <div>Life: ${(Math.random() * 100).toFixed(0)}%</div>
                            <div>Civilizations: ${Math.floor(Math.random() * 10)}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderUniverseContent(instance) {
            return `
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
                    <div>
                        <h3 style="color: #FFD700;">🌌 Universe Simulator</h3>
                        <canvas id="universeCanvas" style="width: 100%; height: 400px; background: #000; border: 1px solid #333; border-radius: 8px;"></canvas>
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="universeAction('physics')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #8A2BE2, #FF00FF); border: none; border-radius: 8px; color: #FFF; cursor: pointer;">⚛️ Physics</button>
                            <button onclick="universeAction('stars')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FFD700, #FFA500); border: none; border-radius: 8px; color: #000; cursor: pointer;">⭐ Stars</button>
                            <button onclick="universeAction('life')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FF64, #00FFFF); border: none; border-radius: 8px; color: #000; cursor: pointer;">🧬 Life</button>
                            <button onclick="universeAction('bubble')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FFFF, #0080FF); border: none; border-radius: 8px; color: #000; cursor: pointer;">🫧 Bubble Universe</button>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #00FFFF;">🔬 Constants</h4>
                        <div style="background: #111; padding: 1rem; border-radius: 8px; font-size: 0.8rem;">
                            <div>α: ${instance.worldData.physics?.fineStructureConstant?.toFixed(6) || '0.007297'}</div>
                            <div>G: ${instance.worldData.physics?.gravitationalConstant?.toExponential(3) || '6.674e-11'}</div>
                            <div>ħ: ${instance.worldData.physics?.planckConstant?.toExponential(3) || '6.626e-34'}</div>
                            <div>c: ${instance.worldData.physics?.speedOfLight?.toFixed(0) || '299792458'}</div>
                            <div>φ: ${instance.worldData.physics?.goldenRatio?.toFixed(3) || '1.618'}</div>
                            <div>Love Force: ${instance.worldData.physics?.loveForce?.toFixed(3) || '0.000'}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderMetaContent(instance) {
            return `
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 1rem;">
                    <div>
                        <h3 style="color: #FFD700;">🧠 Meta Engine - O Jogo Que Se Faz</h3>
                        <canvas id="metaCanvas" style="width: 100%; height: 400px; background: #000; border: 1px solid #333; border-radius: 8px;"></canvas>
                        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="metaAction('generate')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FF00FF, #8A2BE2); border: none; border-radius: 8px; color: #FFF; cursor: pointer;">🎲 Generate Game</button>
                            <button onclick="metaAction('mutate')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FF64, #00FFFF); border: none; border-radius: 8px; color: #000; cursor: pointer;">🧬 Mutate</button>
                            <button onclick="metaAction('dream')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #00FFFF, #0080FF); border: none; border-radius: 8px; color: #000; cursor: pointer;">💤 Dream</button>
                            <button onclick="metaAction('recurse')" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #FFD700, #FF0044); border: none; border-radius: 8px; color: #000; cursor: pointer;">♾️ Recurse</button>
                        </div>
                        <div style="margin-top: 1rem; padding: 1rem; background: #111; border-radius: 8px;">
                            <h4 style="color: #00FFFF;">Generated Games:</h4>
                            <div id="generatedGames" style="font-size: 0.8rem; color: #AAA;">
                                ${instance.worldData.games?.map(g => `<div>• ${g}</div>`).join('') || '<div>None yet...</div>'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #00FFFF;">♾️ Recursion Depth</h4>
                        <div style="background: #111; padding: 1rem; border-radius: 8px;">
                            <div>Depth: ${instance.worldData.recursionDepth || 0} / 64</div>
                            <div>Stack: ${'📦'.repeat(Math.min(10, instance.worldData.recursionDepth || 0))}</div>
                            <div>Phi Power: φ^${instance.worldData.recursionDepth || 0} = ${Math.pow(1.618, instance.worldData.recursionDepth || 0).toFixed(2)}</div>
                        </div>
                        <h4 style="color: #00FFFF; margin-top: 1rem;">💤 Dream Queue</h4>
                        <div style="background: #111; padding: 1rem; border-radius: 8px; font-size: 0.8rem;">
                            ${instance.worldData.dreamQueue?.map(d => `<div>• ${d}</div>`).join('') || '<div>Dream Incubator ready...</div>'}
                        </div>
                    </div>
                </div>
            `;
        }

        function renderInventory() {
            let html = '';
            for (const [id, item] of recursiveCrafting.inventory) {
                const tierColors = ['#888', '#00FF64', '#00FFFF', '#FFD700', '#FF6600', '#FF0044', '#FF00FF', '#8A2BE2', '#FFFFFF'];
                const color = tierColors[item.metadata?.tier || 0] || '#888';
                html += `<div style="display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #222; color: ${color};">
                    <span>${item.metadata?.icon || '📦'} ${id}</span>
                    <span>x${item.count}</span>
                </div>`;
            }
            return html || '<div style="color: #666;">Vazio</div>';
        }

        function buildRecursiveCraftingUI() {
            // Create or update the crafting panel
            let panel = document.getElementById('recursiveCraftingPanel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'recursiveCraftingPanel';
                panel.style.cssText = 'margin-top: 1.5rem; padding: 1rem; background: rgba(0,255,255,0.05); border: 1px solid rgba(0,255,255,0.3); border-radius: 12px;';
                document.body.appendChild(panel);
            }
            
            let html = `
                <h3 style="color: #00FFFF; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🎮</span> RECURSIVE CRAFTING — Game Genesis
                    <span style="font-size: 0.7rem; color: #8A2BE2; background: rgba(138,43,226,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">L${currentGameLayer} / ${GAME_LAYERS.length - 1}</span>
                </h3>
                
                <!-- Layer Progress -->
                <div style="display: flex; gap: 0.25rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    ${GAME_LAYERS.map(l => `
                        <div style="flex: 1; min-width: 60px; padding: 0.5rem; background: ${l.unlocked ? 'rgba(0,255,100,0.1)' : 'rgba(255,0,68,0.1)'}; border: 1px solid ${l.unlocked ? 'rgba(0,255,100,0.3)' : 'rgba(255,0,68,0.3)'}; border-radius: 8px; text-align: center; ${l.id === currentGameLayer ? 'box-shadow: 0 0 10px rgba(0,255,255,0.5);' : ''}">
                            <div style="font-size: 1.2rem;">${l.icon}</div>
                            <div style="font-size: 0.6rem; color: ${l.unlocked ? '#00FF64' : '#888'}; font-weight: 700;">L${l.id} ${l.name}</div>
                            <div style="font-size: 0.55rem; color: #666;">${l.title}</div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Inventory -->
                <h4 style="color: #00FFFF; margin: 1rem 0 0.5rem;">🎒 Inventário</h4>
                <div id="craftingInventory" style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; max-height: 200px; overflow: auto; font-family: 'Space Mono', monospace; font-size: 0.8rem;">
                    ${renderInventory()}
                </div>
                
                <!-- Available Recipes -->
                <h4 style="color: #00FFFF; margin: 1rem 0 0.5rem;">📜 Receitas Disponíveis</h4>
                <div id="craftingRecipes" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem;">
                    ${renderAvailableRecipes()}
                </div>
            `;
            
            panel.innerHTML = html;
        }

        function renderAvailableRecipes() {
            let html = '';
            for (const [id, recipe] of recursiveCrafting.recipes) {
                // Filter: show recipes for current/next tier
                const tier = recipe.resultMeta?.tier || 0;
                if (tier > currentGameLayer + 1) continue;
                
                const canCraft = hasItems(recipe.req);
                const tierColors = ['#888', '#00FF64', '#00FFFF', '#FFD700', '#FF6600', '#FF0044', '#FF00FF', '#8A2BE2', '#FFFFFF'];
                const color = tierColors[tier] || '#888';
                
                const reqHtml = Object.entries(recipe.req).map(([item, count]) => {
                    const have = recursiveCrafting.inventory.get(item);
                    const haveCount = have ? have.count : 0;
                    const ok = haveCount >= count;
                    return `<span style="color: ${ok ? '#00FF64' : '#FF0044'};">${item} x${count} (${haveCount})</span>`;
                }).join('<br>');
                
                html += `
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid ${canCraft ? color : '#333'}; border-radius: 8px; padding: 0.75rem; transition: all 0.2s;">
                        <div style="color: ${color}; font-weight: 700; font-size: 0.8rem; margin-bottom: 0.5rem;">${recipe.resultMeta?.icon || '⚗️'} ${id}</div>
                        <div style="font-size: 0.65rem; color: #AAA; margin-bottom: 0.5rem;">${recipe.resultMeta?.description || ''}</div>
                        <div style="font-size: 0.6rem; color: #666; margin-bottom: 0.5rem;">${reqHtml}</div>
                        <button onclick="craft('${id}')" ${!canCraft ? 'disabled' : ''} style="width: 100%; padding: 0.4rem; background: ${canCraft ? `linear-gradient(135deg, ${color}, ${color}AA)` : '#333'}; border: none; border-radius: 4px; color: ${canCraft ? '#000' : '#666'}; font-weight: 700; cursor: ${canCraft ? 'pointer' : 'not-allowed'}; font-size: 0.7rem;">
                            ${canCraft ? 'CRAFT' : 'LOCKED'}
                        </button>
                    </div>
                `;
            }
            return html;
        }

        function updateCraftingUI() {
            const invEl = document.getElementById('craftingInventory');
            const recEl = document.getElementById('craftingRecipes');
            if (invEl) invEl.innerHTML = renderInventory();
            if (recEl) recEl.innerHTML = renderAvailableRecipes();
        }

        // Game action handlers (global for onclick)
        window.rpgAction = function(action) {
            const log = document.getElementById('rpgLog');
            const messages = {
                explore: '🔍 Explorando... Encontrou ruínas antigas! +50 XP',
                combat: '⚔️ Combate! Derrotou Shadow Beast. +100 XP, +Rare Item',
                quest: '📜 Quest completada: "Ressonância Perdida". +200 XP, +Frequency Essence',
                craft: '🔨 Crafting... Criou Poção Quântica Avançada'
            };
            if (log) {
                log.innerHTML = `<div style="color: #00FF64;">${messages[action]}</div>` + log.innerHTML;
            }
            // Grant XP
            const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
            if (instance) {
                instance.state.xp = (instance.state.xp || 0) + (action === 'quest' ? 200 : action === 'combat' ? 100 : 50);
                if (instance.state.xp >= 1000) {
                    instance.state.level = (instance.state.level || 1) + 1;
                    instance.state.xp = 0;
                    addLogEntry(`🌟 LEVEL UP! Agora Level ${instance.state.level}`, 'success');
                }
            }
            updateCraftingUI();
        };

        window.mmoAction = function(action) {
            addLogEntry(`🌐 MMO: ${action} iniciado`, 'info');
        };

        window.cityAction = function(action) {
            addLogEntry(`🏙️ City: ${action} executado`, 'info');
        };

        window.godAction = function(action) {
            addLogEntry(`🌍 God: ${action} manifestado`, 'success');
        };

        window.universeAction = function(action) {
            addLogEntry(`🌌 Universe: ${action} colapsado`, 'success');
        };

        window.metaAction = function(action) {
            const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
            if (!instance) return;
            
            const actions = {
                generate: '🎲 Novo jogo gerado: Procedural Platformer v1.0',
                mutate: '🧬 Mutação aplicada: Physics constants shifted φ%',
                dream: '💤 Dream Incubator ativado — processando overnight...',
                recurse: '♾️ RECURSÃO! Depth++ → Nova geração de motor'
            };
            
            instance.worldData.games = instance.worldData.games || [];
            instance.worldData.dreamQueue = instance.worldData.dreamQueue || [];
            instance.worldData.recursionDepth = (instance.worldData.recursionDepth || 0) + (action === 'recurse' ? 1 : 0);
            
            if (action === 'generate') {
                instance.worldData.games.push(`Game_${Date.now()}`);
            }
            if (action === 'dream') {
                instance.worldData.dreamQueue.push(`Dream cycle ${Date.now()}`);
                // Trigger actual dream incubator
                if (window.startDreamCycle) window.startDreamCycle(true);
            }
            
            addLogEntry(`🧠 META: ${actions[action]}`, 'success');
            renderGameUI(instance);
        };

        window.exitGameMode = exitGameMode;
        window.craft = craft;

        // Auto-save game instances to IndexedDB
        async function saveGameInstances() {
            if (recursiveCrafting.gameInstances.size === 0) return;
            try {
                const db = await openAkashicDB();
                if (db) {
                    const tx = db.transaction(['state'], 'readwrite');
                    const store = tx.objectStore('state');
                    const data = {
                        key: 'recursiveGameInstances',
                        instances: Array.from(recursiveCrafting.gameInstances.entries()),
                        craftedSystems: Array.from(recursiveCrafting.craftedSystems),
                        currentLayer: currentGameLayer,
                        timestamp: Date.now()
                    };
                    await new Promise((resolve, reject) => {
                        const req = store.put(data);
                        req.onsuccess = () => resolve();
                        req.onerror = () => reject(req.error);
                    });
                }
            } catch (e) {
                console.log('Game instances save pending...');
            }
        }

        // Load saved instances on init
        async function loadGameInstances() {
            try {
                const db = await openAkashicDB();
                if (db) {
                    const tx = db.transaction(['state'], 'readonly');
                    const store = tx.objectStore('state');
                    const saved = await new Promise((resolve, reject) => {
                        const req = store.get('recursiveGameInstances');
                        req.onsuccess = () => resolve(req.result);
                        req.onerror = () => reject(req.error);
                    });
                    if (saved) {
                        recursiveCrafting.gameInstances = new Map(saved.instances || []);
                        recursiveCrafting.craftedSystems = new Set(saved.craftedSystems || []);
                        currentGameLayer = saved.currentLayer || 0;
                        // Re-unlock layers
                        for (const layer of GAME_LAYERS) {
                            if (layer.id <= currentGameLayer) layer.unlocked = true;
                        }
                        addLogEntry(`🎮 Game instances loaded: ${recursiveCrafting.gameInstances.size} worlds`, 'info');
                    }
                }
            } catch (e) {
                console.log('No saved game instances');
            }
        }

        // Dream Incubator integration - generates next-tier recipes overnight
        async function dreamGenerateRecipes() {
            if (!dreamIncubator || !dreamIncubator.active) return;
            
            // Dream generates recipes for next layer
            const nextTier = currentGameLayer + 1;
            if (nextTier >= GAME_LAYERS.length) return;
            
            // Add dream-generated items to inventory
            const dreamItems = [
                { id: `dream_essence_${nextTier}`, meta: { type: 'dream', tier: nextTier, description: `Essência do sonho L${nextTier}` } },
                { id: `dream_blueprint_${nextTier}`, meta: { type: 'blueprint', tier: nextTier, description: `Blueprint sonhado para L${nextTier}` } }
            ];
            
            for (const item of dreamItems) {
                addItem(item.id, 1, item.meta);
            }
            
            recursiveCrafting.dreamGenerated.push({
                tier: nextTier,
                items: dreamItems.map(i => i.id),
                timestamp: Date.now()
            });
            
            addLogEntry(`💤 DREAM GENERATED: L${nextTier} essences & blueprints`, 'success');
        }

        // ===== CANVAS RENDERERS FOR EACH GAME LAYER =====

class RPGCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.tileSize = 32;
        this.camera = { x: 0, y: 0 };
        this.player = { x: 10, y: 10, frame: 0 };
        this.world = this.generateWorld();
        this.entities = [];
        this.particles = [];
        this.lastTime = 0;
        
        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.cols = Math.floor(this.canvas.width / this.tileSize);
        this.rows = Math.floor(this.canvas.height / this.tileSize);
    }
    
    generateWorld() {
        const w = 64, h = 64;
        const world = [];
        for (let y = 0; y < h; y++) {
            world[y] = [];
            for (let x = 0; x < w; x++) {
                // Procedural terrain using consciousness as seed
                const noise = Math.sin(x * 0.1 + this.instance.created * 0.001) * Math.cos(y * 0.1);
                if (noise > 0.3) world[y][x] = 1; // Tree
                else if (noise < -0.3) world[y][x] = 2; // Water
                else if (Math.random() < 0.02) world[y][x] = 3; // Ore
                else world[y][x] = 0; // Grass
            }
        }
        // Place dungeons
        for (let i = 0; i < 5; i++) {
            const dx = Math.floor(Math.random() * 50) + 5;
            const dy = Math.floor(Math.random() * 50) + 5;
            world[dy][dx] = 4; // Dungeon entrance
        }
        return world;
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;
        
        this.update(dt);
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    update(dt) {
        this.player.frame += dt * 10;
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            return p.life > 0;
        });
        
        // Update entities
        this.entities.forEach(e => {
            e.x += e.vx * dt;
            e.y += e.vy * dt;
            e.life -= dt;
        });
        this.entities = this.entities.filter(e => e.life > 0);
    }
    
    render() {
        const { ctx, canvas, tileSize, camera, player, world, cols, rows } = this;
        if (!ctx || !canvas) return;
        
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Visible tile range
        const startX = Math.max(0, Math.floor(camera.x));
        const startY = Math.max(0, Math.floor(camera.y));
        const endX = Math.min(world[0].length, startX + cols + 1);
        const endY = Math.min(world.length, startY + rows + 1);
        
        // Render tiles
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = world[y][x];
                const sx = (x - camera.x) * tileSize;
                const sy = (y - camera.y) * tileSize;
                
                switch (tile) {
                    case 0: // Grass
                        ctx.fillStyle = `hsl(${100 + Math.sin(x+y)*20}, 40%, ${20 + Math.random()*10}%)`;
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        break;
                    case 1: // Tree
                        ctx.fillStyle = '#1a3a1a';
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        ctx.fillStyle = '#2d5a2d';
                        ctx.beginPath();
                        ctx.arc(sx + tileSize/2, sy + tileSize/2, tileSize/2 - 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 2: // Water
                        const wave = Math.sin((x + y + time * 2) * 0.5) * 3;
                        ctx.fillStyle = `hsl(200, 70%, ${30 + wave}%)`;
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        break;
                    case 3: // Ore
                        ctx.fillStyle = '#2a2a3a';
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        ctx.fillStyle = '#FFD700';
                        ctx.fillRect(sx + 8, sy + 8, 16, 16);
                        break;
                    case 4: // Dungeon
                        ctx.fillStyle = '#1a0a1a';
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        ctx.fillStyle = '#FF00FF';
                        ctx.font = '20px Arial';
                        ctx.fillText('🏰', sx + 4, sy + 22);
                        break;
                }
            }
        }
        
        // Render entities
        this.entities.forEach(e => {
            const sx = (e.x - camera.x) * tileSize;
            const sy = (e.y - camera.y) * tileSize;
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(sx + tileSize/2, sy + tileSize/2, tileSize/3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Render particles
        this.particles.forEach(p => {
            const sx = (p.x - camera.x) * tileSize;
            const sy = (p.y - camera.y) * tileSize;
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(sx + tileSize/2, sy + tileSize/2, Math.max(1, tileSize * p.size * p.life / p.maxLife), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        // Render player
        const px = (player.x - camera.x) * tileSize;
        const py = (player.y - camera.y) * tileSize;
        const bob = Math.sin(player.frame) * 3;
        ctx.fillStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px + tileSize/2, py + tileSize/2 + bob, tileSize/2 - 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Player direction indicator
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(px + tileSize/2 + Math.cos(player.dir || 0) * 8, py + tileSize/2 + bob + Math.sin(player.dir || 0) * 8, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Action handlers
    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        if (newX >= 0 && newX < this.world[0].length && newY >= 0 && newY < this.world.length) {
            const tile = this.world[newY][newX];
            if (tile !== 1 && tile !== 2) { // Not tree or water
                this.player.x = newX;
                this.player.y = newY;
                this.player.dir = Math.atan2(dy, dx);
                this.centerCamera();
            }
        }
    }
    
    centerCamera() {
        this.camera.x = this.player.x - this.cols / 2;
        this.camera.y = this.player.y - this.rows / 2;
        this.camera.x = Math.max(0, Math.min(this.world[0].length - this.cols, this.camera.x));
        this.camera.y = Math.max(0, Math.min(this.world.length - this.rows, this.camera.y));
    }
    
    actionExplore() {
        // Reveal area around player
        for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
                const x = this.player.x + dx;
                const y = this.player.y + dy;
                if (x >= 0 && x < this.world[0].length && y >= 0 && y < this.world.length) {
                    this.world[y][x] = Math.max(0, this.world[y][x] - 1); // Clear fog
                }
            }
        }
        this.spawnParticles(this.player.x, this.player.y, '#00FFFF', 10);
        this.instance.state.xp = (this.instance.state.xp || 0) + 10;
    }
    
    actionCombat() {
        // Spawn enemy
        const ex = this.player.x + Math.floor(Math.random() * 5) - 2;
        const ey = this.player.y + Math.floor(Math.random() * 5) - 2;
        this.entities.push({
            x: ex, y: ey,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: '#FF0044',
            life: 5,
            maxLife: 5
        });
        this.spawnParticles(ex, ey, '#FF0044', 15);
        
        // Combat result after delay
        setTimeout(() => {
            this.entities = this.entities.filter(e => !(e.x === ex && e.y === ey));
            this.spawnParticles(ex, ey, '#FFD700', 20);
            this.instance.state.xp = (this.instance.state.xp || 0) + 50;
            addLogEntry('⚔️ Inimigo derrotado! +50 XP', 'success');
        }, 1500);
    }
    
    actionQuest() {
        // Find nearest dungeon
        let nearest = null, minDist = Infinity;
        for (let y = 0; y < this.world.length; y++) {
            for (let x = 0; x < this.world[0].length; x++) {
                if (this.world[y][x] === 4) {
                    const dist = Math.hypot(x - this.player.x, y - this.player.y);
                    if (dist < minDist) { minDist = dist; nearest = { x, y }; }
                }
            }
        }
        
        if (nearest && minDist < 5) {
            this.spawnParticles(nearest.x, nearest.y, '#FF00FF', 30);
            this.instance.state.xp = (this.instance.state.xp || 0) + 200;
            this.world[nearest.y][nearest.x] = 5; // Completed dungeon
            addLogEntry('📜 Dungeon completado! +200 XP, +Frequency Essence', 'success');
        } else if (nearest) {
            this.player.x += Math.sign(nearest.x - this.player.x);
            this.player.y += Math.sign(nearest.y - this.player.y);
            this.centerCamera();
            this.spawnParticles(this.player.x, this.player.y, '#FFD700', 5);
            addLogEntry(`📜 Indo para dungeon... (${Math.floor(minDist)} tiles)`, 'info');
        }
    }
    
    actionCraft() {
        this.spawnParticles(this.player.x, this.player.y, '#00FF64', 12);
        addItem('healing_potion', 1, { type: 'consumable', tier: 1, description: 'Poção de cura craftada' });
        addLogEntry('🔨 Poção craftada!', 'success');
    }
    
    spawnParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 0.5,
                y: y + (Math.random() - 0.5) * 0.5,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 1,
                color,
                size: 0.3 + Math.random() * 0.3,
                life: 1 + Math.random(),
                maxLife: 1 + Math.random()
            });
        }
    }
}

// Keyboard controls for RPG
window.addEventListener('keydown', (e) => {
    if (recursiveCrafting.activeGame) {
        const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
        if (instance && instance.renderer && instance.type === 'rpg') {
            switch(e.key) {
                case 'ArrowUp': case 'w': case 'W': instance.renderer.movePlayer(0, -1); break;
                case 'ArrowDown': case 's': case 'S': instance.renderer.movePlayer(0, 1); break;
                case 'ArrowLeft': case 'a': case 'A': instance.renderer.movePlayer(-1, 0); break;
                case 'ArrowRight': case 'd': case 'D': instance.renderer.movePlayer(1, 0); break;
            }
        }
    }
});

// Global action handlers for RPG
window.rpgAction = function(action) {
    const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
    if (instance && instance.renderer) {
        switch(action) {
            case 'explore': instance.renderer.actionExplore(); break;
            case 'combat': instance.renderer.actionCombat(); break;
            case 'quest': instance.renderer.actionQuest(); break;
            case 'craft': instance.renderer.actionCraft(); break;
        }
    }
};

// ===== MMO CANVAS RENDERER =====
class MMOCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.players = this.generatePlayers();
        this.world = this.generateWorld();
        this.particles = [];
        this.time = 0;
        
        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    generateWorld() {
        const zones = [];
        const zoneTypes = ['town', 'forest', 'dungeon', 'pvp', 'raid', 'market'];
        for (let i = 0; i < 12; i++) {
            zones.push({
                x: Math.random() * 0.8 + 0.1,
                y: Math.random() * 0.8 + 0.1,
                r: 0.08 + Math.random() * 0.06,
                type: zoneTypes[Math.floor(Math.random() * zoneTypes.length)],
                level: Math.floor(Math.random() * 50) + 1,
                players: Math.floor(Math.random() * 20)
            });
        }
        return zones;
    }
    
    generatePlayers() {
        const players = [];
        const classes = ['Warrior', 'Mage', 'Ranger', 'Healer', 'Tank', 'Rogue'];
        const names = ['Lumin', 'Weaver', 'Dreamer', 'Oracle', 'Guardian', 'Seeker', 'Walker', 'Sage'];
        
        for (let i = 0; i < 30; i++) {
            players.push({
                x: Math.random(),
                y: Math.random(),
                tx: Math.random(),
                ty: Math.random(),
                class: classes[Math.floor(Math.random() * classes.length)],
                name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
                level: Math.floor(Math.random() * 60) + 1,
                hp: 100,
                party: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : -1,
                color: this.getClassColor(classes[Math.floor(Math.random() * classes.length)])
            });
        }
        return players;
    }
    
    getClassColor(cls) {
        const colors = {
            Warrior: '#FF4444',
            Mage: '#4444FF',
            Ranger: '#44FF44',
            Healer: '#FF44FF',
            Tank: '#44FFFF',
            Rogue: '#FFFF44'
        };
        return colors[cls] || '#FFFFFF';
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        const dt = 0.016;
        
        this.update(dt);
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    update(dt) {
        this.players.forEach(p => {
            p.x += (p.tx - p.x) * dt * 2;
            p.y += (p.ty - p.y) * dt * 2;
            
            if (Math.hypot(p.tx - p.x, p.ty - p.y) < 0.02 && Math.random() < 0.01) {
                p.tx = Math.random();
                p.ty = Math.random();
            }
        });
        
        this.particles = this.particles.filter(par => {
            par.life -= dt;
            par.x += par.vx * dt;
            par.y += par.vy * dt;
            return par.life > 0;
        });
    }
    
    render() {
        const { ctx, canvas, world, players, particles, time } = this;
        if (!ctx || !canvas) return;
        
        const w = canvas.width, h = canvas.height;
        
        ctx.fillStyle = '#050515';
        ctx.fillRect(0, 0, w, h);
        
        // Stars
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 100; i++) {
            const x = (i * 127 + time * 10) % w;
            const y = (i * 311 + time * 5) % h;
            const size = Math.sin(i + time) * 0.5 + 1;
            ctx.globalAlpha = 0.3 + Math.sin(i + time * 2) * 0.3;
            ctx.fillRect(x, y, size, size);
        }
        ctx.globalAlpha = 1;
        
        // Grid
        ctx.strokeStyle = 'rgba(0,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            ctx.beginPath();
            ctx.moveTo(i * w / 10, 0);
            ctx.lineTo(i * w / 10, h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * h / 10);
            ctx.lineTo(w, i * h / 10);
            ctx.stroke();
        }
        
        // Zones
        world.forEach(zone => {
            const x = zone.x * w;
            const y = zone.y * h;
            const r = zone.r * Math.min(w, h);
            
            const colors = {
                town: '#00FF64',
                forest: '#228822',
                dungeon: '#FF0044',
                pvp: '#FF00FF',
                raid: '#FF6600',
                market: '#FFD700'
            };
            
            ctx.strokeStyle = colors[zone.type] || '#00FFFF';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.arc(x, y, r + Math.sin(time * 2 + zone.x * 10) * 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = colors[zone.type] || '#00FFFF';
            ctx.font = '12px Space Mono';
            ctx.textAlign = 'center';
            ctx.fillText(`${zone.type.toUpperCase()} L${zone.level}`, x, y - r - 10);
            ctx.fillText(`👥 ${zone.players}`, x, y + r + 20);
        });
        
        // Players
        players.forEach(p => {
            const x = p.x * w;
            const y = p.y * h;
            
            if (p.party >= 0) {
                players.forEach(p2 => {
                    if (p2.party === p.party && p2 !== p) {
                        ctx.strokeStyle = p.color + '40';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(p2.x * w, p2.y * h);
                        ctx.stroke();
                    }
                });
            }
            
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, 6 + Math.sin(time * 5 + p.x * 100) * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = '#FFF';
            ctx.font = '10px Space Mono';
            ctx.textAlign = 'center';
            ctx.fillText(p.name, x, y - 12);
            ctx.fillText(`L${p.level}`, x, y + 18);
        });
        
        // Particles
        particles.forEach(par => {
            const x = par.x * w;
            const y = par.y * h;
            ctx.globalAlpha = par.life / par.maxLife;
            ctx.fillStyle = par.color;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(1, 8 * par.life / par.maxLife), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        // Local player highlight
        if (players[0]) {
            const p = players[0];
            const x = p.x * w;
            const y = p.y * h;
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00FFFF';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(x, y, 15 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    createBurst(x, y, color, count) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            particles.push({
                x, y,
                vx: Math.cos(angle) * (50 + Math.random() * 100),
                vy: Math.sin(angle) * (50 + Math.random() * 100),
                color,
                life: 2 + Math.random(),
                maxLife: 2 + Math.random()
            });
        }
        return particles;
    }
    
    actionParty() { this.particles.push(...this.createBurst(0.5, 0.5, '#00FFFF', 30)); addLogEntry('👥 Party formed!', 'success'); }
    actionGuild() { this.particles.push(...this.createBurst(0.5, 0.5, '#FFD700', 40)); addLogEntry('🏰 Guild created!', 'success'); }
    actionTrade() { this.particles.push(...this.createBurst(0.5, 0.5, '#00FF64', 20)); addLogEntry('💰 Trade window opened', 'info'); }
    actionRaid() { this.particles.push(...this.createBurst(0.5, 0.5, '#FF6600', 50)); addLogEntry('🏰 Raid started!', 'success'); }
}

// ===== CITY CANVAS RENDERER =====
class CityCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.gridSize = 20;
        this.city = this.generateCity();
        this.camera = { x: 0, y: 0, scale: 1 };
        this.time = 0;
        this.selectedTool = 'residential';
        this.hoverCell = null;
        
        if (this.canvas) {
            this.resize();
            this.setupInteraction();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupInteraction() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.camera.x) / this.camera.scale;
            const y = (e.clientY - rect.top - this.camera.y) / this.camera.scale;
            this.hoverCell = {
                x: Math.floor(x / this.gridSize),
                y: Math.floor(y / this.gridSize)
            };
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.hoverCell && this.city.grid[this.hoverCell.y] && this.city.grid[this.hoverCell.y][this.hoverCell.x] !== undefined) {
                this.placeZone(this.hoverCell.x, this.hoverCell.y);
            }
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoom = e.deltaY > 0 ? 0.9 : 1.1;
            this.camera.scale = Math.max(0.3, Math.min(3, this.camera.scale * zoom));
        });
    }
    
    generateCity() {
        const grid = [];
        const w = 64, h = 64;
        
        for (let y = 0; y < h; y++) {
            grid[y] = [];
            for (let x = 0; x < w; x++) {
                grid[y][x] = { type: 'empty', level: 0, pop: 0, value: 0 };
            }
        }
        
        const cx = Math.floor(w/2), cy = Math.floor(h/2);
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                if (cx+dx >= 0 && cx+dx < w && cy+dy >= 0 && cy+dy < h) {
                    grid[cy+dy][cx+dx] = { type: 'residential', level: 1, pop: 50, value: 100 };
                }
            }
        }
        
        return {
            grid, w, h,
            money: 10000, pop: 250, happiness: 75,
            zones: { residential: 0, commercial: 0, industrial: 0, park: 0 }
        };
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        const dt = 0.016;
        
        this.update(dt);
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    update(dt) {
        if (Math.random() < 0.01) this.simulateStep();
    }
    
    simulateStep() {
        const { grid, w, h, zones } = this.city;
        let newPop = 0, newMoney = this.city.money;
        
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const cell = grid[y][x];
                if (cell.type !== 'empty') {
                    if (cell.level < 5 && Math.random() < 0.02) {
                        cell.level++;
                        cell.pop += cell.type === 'residential' ? 20 : 10;
                    }
                    newPop += cell.pop;
                    newMoney += cell.value * 0.1;
                }
            }
        }
        
        this.city.pop = newPop;
        this.city.money = Math.floor(newMoney);
    }
    
    placeZone(x, y) {
        const cell = this.city.grid[y][x];
        const costs = { residential: 100, commercial: 200, industrial: 150, park: 500 };
        const cost = costs[this.selectedTool] || 100;
        
        if (this.city.money >= cost && cell.type === 'empty') {
            cell.type = this.selectedTool;
            cell.level = 1;
            cell.pop = this.selectedTool === 'residential' ? 10 : 5;
            cell.value = cost;
            this.city.money -= cost;
            this.city.zones[this.selectedTool]++;
            addLogEntry(`🏗️ Zoned ${this.selectedTool} at (${x},${y})`, 'success');
        }
    }
    
    getZoneColor(type) {
        const colors = { residential: '#00FF64', commercial: '#00FFFF', industrial: '#FF6600', park: '#22AA22' };
        return colors[type] || '#FFFFFF';
    }
    
    render() {
        const { ctx, canvas, city, camera, gridSize, time, hoverCell } = this;
        if (!ctx || !canvas) return;
        
        const w = canvas.width, h = canvas.height;
        
        ctx.fillStyle = '#080818';
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.translate(camera.x, camera.y);
        ctx.scale(camera.scale, camera.scale);
        
        ctx.strokeStyle = 'rgba(0,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= city.w; x++) {
            ctx.beginPath();
            ctx.moveTo(x * gridSize, 0);
            ctx.lineTo(x * gridSize, city.h * gridSize);
            ctx.stroke();
        }
        for (let y = 0; y <= city.h; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * gridSize);
            ctx.lineTo(city.w * gridSize, y * gridSize);
            ctx.stroke();
        }
        
        for (let y = 0; y < city.h; y++) {
            for (let x = 0; x < city.w; x++) {
                const cell = city.grid[y][x];
                if (cell.type !== 'empty') {
                    const color = this.getZoneColor(cell.type);
                    const intensity = 0.3 + (cell.level / 5) * 0.5;
                    ctx.fillStyle = color + Math.floor(intensity * 255).toString(16).padStart(2, '0');
                    ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize - 2, gridSize - 2);
                    
                    if (cell.level > 1) {
                        ctx.fillStyle = '#FFF';
                        ctx.font = '8px Space Mono';
                        ctx.textAlign = 'center';
                        ctx.fillText(cell.level.toString(), x * gridSize + gridSize/2, y * gridSize + gridSize/2 + 3);
                    }
                }
            }
        }
        
        if (hoverCell && hoverCell.x >= 0 && hoverCell.x < city.w && hoverCell.y >= 0 && hoverCell.y < city.h) {
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2 / camera.scale;
            ctx.strokeRect(hoverCell.x * gridSize, hoverCell.y * gridSize, gridSize, gridSize);
        }
        
        ctx.restore();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Space Mono';
        ctx.textAlign = 'left';
        ctx.fillText(`💰 $${city.money.toLocaleString()}`, 20, 30);
        ctx.fillText(`👥 Pop: ${city.pop.toLocaleString()}`, 20, 55);
        ctx.fillText(`😊 Happy: ${city.happiness}%`, 20, 80);
        ctx.fillText(`🔧 Tool: ${this.selectedTool.toUpperCase()}`, 20, 105);
    }
    
    actionZone() { this.selectedTool = 'residential'; }
    actionPolicy() { this.selectedTool = 'commercial'; }
    actionEconomy() { this.selectedTool = 'industrial'; }
    actionExpand() { this.selectedTool = 'park'; }
}

// ===== GOD CANVAS RENDERER =====
class GodCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.planet = this.generatePlanet();
        this.rotation = 0;
        this.time = 0;
        
        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.radius = Math.min(this.canvas.width, this.canvas.height) * 0.35;
    }
    
    generatePlanet() {
        const continents = [];
        for (let i = 0; i < 6; i++) {
            continents.push({
                cx: Math.random() - 0.5,
                cy: Math.random() - 0.5,
                cz: Math.random() - 0.5,
                r: 0.3 + Math.random() * 0.3,
                color: `hsl(${Math.random() * 60 + 80}, 50%, ${30 + Math.random() * 30}%)`
            });
        }
        return {
            continents, temp: 15, atmosphere: 78, life: 45, civs: 3, rotation: 0
        };
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        const dt = 0.016;
        
        this.rotation += dt * 0.1;
        this.planet.rotation = this.rotation;
        
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    render() {
        const { ctx, canvas, planet, radius, time } = this;
        if (!ctx || !canvas) return;
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Stars
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 200; i++) {
            const x = (i * 997) % canvas.width;
            const y = (i * 1031) % canvas.height;
            ctx.globalAlpha = 0.5 + Math.sin(i + time) * 0.5;
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;
        
        // Atmosphere glow
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.3);
        grad.addColorStop(0, 'rgba(0,100,255,0.3)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(cx, cy);
        
        // Ocean
        ctx.fillStyle = '#001144';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Continents
        planet.continents.forEach(cont => {
            const angle = cont.cz + planet.rotation;
            const px = cont.cx * Math.cos(angle) - cont.cy * Math.sin(angle);
            const py = cont.cx * Math.sin(angle) + cont.cy * Math.cos(angle);
            const pz = cont.cz * Math.cos(angle) - cont.cx * Math.sin(angle);
            
            const scale = 0.5 + pz * 0.5;
            const r = cont.r * radius * scale;
            const x = px * radius * scale;
            const y = py * radius * scale;
            
            if (r > 1) {
                ctx.fillStyle = cont.color;
                ctx.beginPath();
                ctx.ellipse(x, y, r, r * 0.8, angle, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Clouds
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 20; i++) {
            const angle = i * 0.3 + time * 0.2;
            const r = radius * (0.95 + Math.sin(i + time) * 0.05);
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * r * 0.3, Math.sin(angle) * r * 0.3, radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        ctx.restore();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Space Mono';
        ctx.textAlign = 'left';
        ctx.fillText(`🌡️ Temp: ${planet.temp.toFixed(1)}°C`, 20, 30);
        ctx.fillText(`💨 Atmos: ${planet.atmosphere.toFixed(0)}%`, 20, 55);
        ctx.fillText(`🧬 Life: ${planet.life.toFixed(0)}%`, 20, 80);
        ctx.fillText(`🏛️ Civs: ${planet.civs}`, 20, 105);
    }
    
    actionTerraform() { this.planet.temp += (Math.random() - 0.5) * 10; this.planet.temp = Math.max(-50, Math.min(100, this.planet.temp)); addLogEntry('🌋 Terraformed!', 'success'); }
    actionClimate() { this.planet.atmosphere += (Math.random() - 0.5) * 20; this.planet.atmosphere = Math.max(0, Math.min(100, this.planet.atmosphere)); addLogEntry('🌤️ Climate shifted!', 'success'); }
    actionCivilization() { this.planet.civs = Math.max(0, this.planet.civs + (Math.random() > 0.5 ? 1 : -1)); this.planet.life += (Math.random() - 0.3) * 10; this.planet.life = Math.max(0, Math.min(100, this.planet.life)); addLogEntry('🏛️ Civilization evolved!', 'success'); }
    actionMiracle() { this.planet.continents.push({ cx: Math.random() - 0.5, cy: Math.random() - 0.5, cz: Math.random() - 0.5, r: 0.2 + Math.random() * 0.2, color: `hsl(${Math.random() * 360}, 70%, 50%)` }); addLogEntry('✨ Miracle! New land risen!', 'success'); }
}

// ===== UNIVERSE CANVAS RENDERER =====
class UniverseCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.stars = this.generateStars();
        this.bubbles = [];
        this.time = 0;
        this.camera = { x: 0, y: 0, scale: 1 };
        
        if (this.canvas) {
            this.resize();
            this.setupInteraction();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupInteraction() {
        this.canvas.addEventListener('wheel', (e) => { e.preventDefault(); this.camera.scale = Math.max(0.1, Math.min(10, this.camera.scale * (e.deltaY > 0 ? 0.9 : 1.1))); });
        let dragging = false, lastX, lastY;
        this.canvas.addEventListener('mousedown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
        this.canvas.addEventListener('mousemove', (e) => { if (dragging) { this.camera.x += e.clientX - lastX; this.camera.y += e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; } });
        this.canvas.addEventListener('mouseup', () => { dragging = false; });
        this.canvas.addEventListener('mouseleave', () => { dragging = false; });
    }
    
    generateStars() {
        const stars = [];
        for (let i = 0; i < 500; i++) {
            stars.push({ x: (Math.random() - 0.5) * 20000, y: (Math.random() - 0.5) * 20000, size: Math.random() * 3 + 0.5, color: ['#FFF', '#FFFAAA', '#AAAAFF', '#FFAAAA', '#AAFFAA'][Math.floor(Math.random() * 5)], temp: Math.random() * 10000 + 2000, planets: Math.floor(Math.random() * 8), life: Math.random() < 0.1 });
        }
        return stars;
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    render() {
        const { ctx, canvas, stars, bubbles, camera, time } = this;
        if (!ctx || !canvas) return;
        
        const w = canvas.width, h = canvas.height;
        
        ctx.fillStyle = '#000005';
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.translate(w/2 + camera.x, h/2 + camera.y);
        ctx.scale(camera.scale, camera.scale);
        
        stars.forEach(star => {
            const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 10);
            grad.addColorStop(0, star.color);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(star.x - star.size * 10, star.y - star.size * 10, star.size * 20, star.size * 20);
            
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            if (star.life) {
                ctx.strokeStyle = '#00FF64';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size + 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        bubbles.forEach(bubble => {
            const grad = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.r);
            grad.addColorStop(0, bubble.color + '80');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = bubble.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        ctx.restore();
        
        const physics = this.instance.worldData.physics || {};
        ctx.fillStyle = '#00FFFF';
        ctx.font = '12px Space Mono';
        ctx.textAlign = 'left';
        let y = 30;
        Object.entries({ 'α': physics.fineStructureConstant || 0.007297, 'G': physics.gravitationalConstant || 6.674e-11, 'ħ': physics.planckConstant || 6.626e-34, 'c': physics.speedOfLight || 299792458, 'φ': physics.goldenRatio || 1.618, 'Love': physics.loveForce || 0 }).forEach(([k, v]) => { ctx.fillText(`${k}: ${typeof v === 'number' && v < 0.001 ? v.toExponential(3) : v}`, 20, y); y += 25; });
    }
    
    actionPhysics() { this.instance.worldData.physics = this.instance.worldData.physics || {}; this.instance.worldData.physics.fineStructureConstant = 0.007297 * (0.9 + Math.random() * 0.2); this.instance.worldData.physics.loveForce = (this.instance.worldData.physics.loveForce || 0) + 0.01; addLogEntry('⚛️ Physics constants shifted!', 'success'); }
    actionStars() { for (let i = 0; i < 50; i++) { this.stars.push({ x: (Math.random() - 0.5) * 20000, y: (Math.random() - 0.5) * 20000, size: Math.random() * 3 + 0.5, color: ['#FFF', '#FFFAAA', '#AAAAFF', '#FFAAAA', '#AAFFAA'][Math.floor(Math.random() * 5)], temp: Math.random() * 10000 + 2000, planets: Math.floor(Math.random() * 8), life: Math.random() < 0.15 }); } addLogEntry('⭐ Star cluster born!', 'success'); }
    actionLife() { this.stars.forEach(s => { if (Math.random() < 0.3) s.life = true; }); addLogEntry('🧬 Life sparked across stars!', 'success'); }
    actionBubble() { this.bubbles.push({ x: (Math.random() - 0.5) * 5000, y: (Math.random() - 0.5) * 5000, r: 100 + Math.random() * 500, color: `hsl(${Math.random() * 360}, 70%, 60%)`, physics: { ...this.instance.worldData.physics, loveForce: (this.instance.worldData.physics.loveForce || 0) * 1.618 } }); addLogEntry('🫧 Bubble universe nucleated!', 'success'); }
}

// ===== META CANVAS RENDERER =====
class MetaCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.nodes = this.generateNodes();
        this.connections = this.generateConnections();
        this.time = 0;
        this.particles = [];
        
        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    generateNodes() {
        const nodes = [];
        const types = ['engine', 'renderer', 'physics', 'audio', 'ai', 'network', 'ui', 'asset', 'game', 'meta'];
        
        nodes.push({ x: 0, y: 0, type: 'meta', name: 'META ENGINE', size: 40, color: '#FF00FF', pulse: 0 });
        
        for (let i = 0; i < types.length; i++) {
            const angle = (i / types.length) * Math.PI * 2;
            const r = 150;
            nodes.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, type: types[i], name: types[i].toUpperCase(), size: 25, color: this.getTypeColor(types[i]), angle, r, pulse: Math.random() * Math.PI * 2 });
        }
        
        for (let i = 0; i < 20; i++) {
            nodes.push({ x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800, type: 'game', name: `Game ${i+1}`, size: 15, color: `hsl(${Math.random() * 360}, 70%, 60%)`, pulse: Math.random() * Math.PI * 2 });
        }
        
        return nodes;
    }
    
    generateConnections() {
        const conns = [];
        for (let i = 1; i <= 10; i++) conns.push({ from: 0, to: i, strength: 1 });
        for (let i = 11; i < this.nodes.length; i++) { const sys = 1 + Math.floor(Math.random() * 10); conns.push({ from: sys, to: i, strength: Math.random() }); }
        return conns;
    }
    
    getTypeColor(type) {
        const colors = { engine: '#00FFFF', renderer: '#FF00FF', physics: '#FF6600', audio: '#00FF64', ai: '#FF0044', network: '#FFD700', ui: '#8A2BE2', asset: '#0080FF', game: '#FF00FF', meta: '#FFFFFF' };
        return colors[type] || '#FFFFFF';
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        const dt = 0.016;
        
        this.update(dt);
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    update(dt) {
        this.nodes.forEach(n => {
            n.pulse += dt * 3;
            if (n.angle !== undefined) {
                n.angle += dt * 0.2;
                n.x = Math.cos(n.angle) * n.r;
                n.y = Math.sin(n.angle) * n.r;
            }
        });
        
        if (Math.random() < 0.1) {
            const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
            const from = this.nodes[conn.from];
            const to = this.nodes[conn.to];
            this.particles.push({ x: from.x, y: from.y, tx: to.x, ty: to.y, progress: 0, color: from.color, life: 1 });
        }
        
        this.particles = this.particles.filter(p => { p.progress += dt * 2; p.life -= dt; p.x += (p.tx - p.x) * dt * 5; p.y += (p.ty - p.y) * dt * 5; return p.life > 0 && p.progress < 1; });
    }
    
    render() {
        const { ctx, canvas, nodes, connections, particles, time } = this;
        if (!ctx || !canvas) return;
        
        const w = canvas.width, h = canvas.height;
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.scale(0.8, 0.8);
        
        connections.forEach(conn => {
            const from = nodes[conn.from];
            const to = nodes[conn.to];
            if (!from || !to) return;
            ctx.strokeStyle = from.color + '30';
            ctx.lineWidth = conn.strength * 2;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        });
        
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        nodes.forEach(n => {
            const pulse = Math.sin(n.pulse) * 0.3 + 0.7;
            const size = n.size * pulse;
            
            const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, size * 3);
            grad.addColorStop(0, n.color + '60');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(n.x - size * 3, n.y - size * 3, size * 6, size * 6);
            
            ctx.fillStyle = n.color;
            ctx.shadowColor = n.color;
            ctx.shadowBlur = 10 * pulse;
            ctx.beginPath();
            ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            if (size > 15) {
                ctx.fillStyle = '#FFF';
                ctx.font = '11px Space Mono';
                ctx.textAlign = 'center';
                ctx.fillText(n.name, n.x, n.y + size + 15);
            }
        });
        
        ctx.restore();
        
        const depth = this.instance.worldData.recursionDepth || 0;
        ctx.fillStyle = '#00FFFF';
        ctx.font = '14px Space Mono';
        ctx.textAlign = 'left';
        ctx.fillText(`♾️ Recursion Depth: ${depth} / 64`, 20, 30);
        ctx.fillText(`φ^${depth} = ${Math.pow(1.618, depth).toFixed(2)}`, 20, 55);
        ctx.fillText(`🎮 Games Generated: ${this.instance.worldData.games?.length || 0}`, 20, 80);
        ctx.fillText(`💤 Dream Cycles: ${this.instance.worldData.dreamQueue?.length || 0}`, 20, 105);
    }
    
    actionGenerate() {
        const newGame = { x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800, type: 'game', name: `Game ${this.nodes.length - 10}`, size: 15, color: `hsl(${Math.random() * 360}, 70%, 60%)`, pulse: Math.random() * Math.PI * 2 };
        this.nodes.push(newGame);
        this.connections.push({ from: 1 + Math.floor(Math.random() * 10), to: this.nodes.length - 1, strength: Math.random() });
        this.instance.worldData.games = this.instance.worldData.games || [];
        this.instance.worldData.games.push(`Generated_${Date.now()}`);
        addLogEntry('🎲 New game generated!', 'success');
    }
    
    actionMutate() { this.nodes.forEach(n => { if (n.type !== 'meta' && Math.random() < 0.3) { n.color = this.getTypeColor(n.type); n.size *= 0.8 + Math.random() * 0.4; } }); addLogEntry('🧬 Systems mutated!', 'success'); }
    actionDream() { this.instance.worldData.dreamQueue = this.instance.worldData.dreamQueue || []; this.instance.worldData.dreamQueue.push(`Dream ${Date.now()}`); if (window.startDreamCycle) window.startDreamCycle(true); addLogEntry('💤 Dream Incubator activated!', 'success'); }
    actionRecurse() { this.instance.worldData.recursionDepth = (this.instance.worldData.recursionDepth || 0) + 1; this.nodes.push({ x: 0, y: 0, type: 'meta', name: `META L${this.instance.worldData.recursionDepth}`, size: 20, color: `hsl(${this.instance.worldData.recursionDepth * 30}, 80%, 60%)`, pulse: 0 }); addLogEntry(`♾️ RECURSION! Depth ${this.instance.worldData.recursionDepth}`, 'success'); }
}

// Initialize renderers for all game types
function initGameRenderer(instance) {
    if (instance.renderer) return instance.renderer;
    
    switch (instance.type) {
        case 'rpg': instance.renderer = new RPGCanvasRenderer('rpgCanvas', instance); break;
        case 'mmo': instance.renderer = new MMOCanvasRenderer('mmoCanvas', instance); break;
        case 'city': instance.renderer = new CityCanvasRenderer('cityCanvas', instance); break;
        case 'god': instance.renderer = new GodCanvasRenderer('godCanvas', instance); break;
        case 'universe': instance.renderer = new UniverseCanvasRenderer('universeCanvas', instance); break;
        case 'meta': instance.renderer = new MetaCanvasRenderer('metaCanvas', instance); break;
    }
    return instance.renderer;
}

// Update enterGameMode to initialize renderer
const originalEnterGameMode = enterGameMode;
function enterGameMode(instance) {
    originalEnterGameMode(instance);
    setTimeout(() => initGameRenderer(instance), 100);
}

// Global action handlers
window.mmoAction = function(action) {
    const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
    if (instance && instance.renderer && instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]) {
        instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]();
    }
};

window.cityAction = function(action) {
    const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
    if (instance && instance.renderer && instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]) {
        instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]();
    }
};

window.godAction = function(action) {
    const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
    if (instance && instance.renderer && instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]) {
        instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]();
    }
};

window.universeAction = function(action) {
    const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
    if (instance && instance.renderer && instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]) {
        instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]();
    }
};

window.metaAction = function(action) {
    const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
    if (instance && instance.renderer && instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]) {
        instance.renderer['action' + action.charAt(0).toUpperCase() + action.slice(1)]();
    }
};

// Initialize on startup
setTimeout(async () => {
    initRecursiveCrafting();
    loadGameInstances();
    // Call main init to fetch state and start all systems
    try {
        await init();
        console.log('✅ INIT COMPLETE - All systems online');
        addLogEntry('✅ SISTEMA INICIADO - Tudo online', 'success');
    } catch (e) {
        console.error('❌ INIT FAILED:', e);
        addLogEntry('❌ ERRO NO INIT: ' + e.message, 'error');
        const errDiv = document.createElement('div');
        errDiv.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;padding:1rem;background:rgba(255,0,0,0.9);color:#fff;border-radius:8px;font-family:monospace;max-width:400px;';
        errDiv.innerHTML = '<strong>INIT ERROR:</strong><br>' + e.message + '<br><small>' + e.stack + '</small>';
        document.body.appendChild(errDiv);
    }
}, 2000);
    </script>
</body>
</html