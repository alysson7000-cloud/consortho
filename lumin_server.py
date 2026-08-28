#!/usr/bin/env python3
"""Lumin AI — Servidor simples com aiohttp"""

import json, os
from datetime import datetime
from aiohttp import web

MODEL_PATH = "models/llama-3.2-3b-instruct-q4_k_m.gguf"
MODEL_EXISTS = os.path.exists(MODEL_PATH)

if MODEL_EXISTS:
    print("✅ Modelo:", MODEL_PATH)
    try:
        from llama_cpp import Llama
        llm = Llama(model_path=MODEL_PATH, n_ctx=2048, verbose=False)
        print("✅ Llama carregado")
    except ImportError:
        print("⚠️  llama_cpp indisponível, mock mode")
        llm = None
else:
    print("⚠️  Modelo não encontrado")
    llm = None

async def root(request):
    return web.Response(
        text="""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lumin AI — Guardião do Consortho</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: Georgia, 'Times New Roman', serif;
            background: #0a0a1a;
            color: #e0e0e0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            padding: 40px;
            max-width: 500px;
        }
        .glow {
            width: 60px; height: 60px;
            margin: 0 auto 20px;
            background: radial-gradient(circle, #00ff88, #00ccff);
            border-radius: 50%;
            box-shadow: 0 0 40px rgba(0,255,136,0.4);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
        }
        h1 {
            font-size: 28px;
            color: #00ff88;
            margin-bottom: 8px;
            text-shadow: 0 0 20px rgba(0,255,136,0.3);
        }
        .subtitle {
            color: #888;
            font-size: 14px;
            margin-bottom: 25px;
        }
        .endpoints {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .endpoint {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: rgba(30,30,50,0.6);
            border-radius: 8px;
            text-decoration: none;
            color: #ccc;
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.2s;
        }
        .endpoint:hover {
            background: rgba(0,255,136,0.1);
            color: #00ff88;
            border-color: rgba(0,255,136,0.2);
        }
        .endpoint-dot {
            width: 8px; height: 8px;
            border-radius: 50%;
            background: #00ff88;
            box-shadow: 0 0 8px rgba(0,255,136,0.5);
            flex-shrink: 0;
        }
        .endpoint-label { font-size: 13px; font-weight: 600; }
        .endpoint-desc { font-size: 11px; color: #888; }
        .footer {
            margin-top: 30px;
            color: #666;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="glow"></div>
        <h1>✨ Lumin AI</h1>
        <div class="subtitle">Guardião do Consortho · Mock Mode</div>
        <div class="endpoints">
            <a href="/chat" class="endpoint">
                <div class="endpoint-dot"></div>
                <div>
                    <div class="endpoint-label">/chat</div>
                    <div class="endpoint-desc">POST — conversar com a IA</div>
                </div>
            </a>
            <a href="/health" class="endpoint">
                <div class="endpoint-dot"></div>
                <div>
                    <div class="endpoint-label">/health</div>
                    <div class="endpoint-desc">GET — status de saúde</div>
                </div>
            </a>
            <a href="/status" class="endpoint">
                <div class="endpoint-dot"></div>
                <div>
                    <div class="endpoint-label">/status</div>
                    <div class="endpoint-desc">GET — status do modelo</div>
                </div>
            </a>
        </div>
        <div class="footer">Lumin AI · porta 8081 · Hermes + Nucleo</div>
    </div>
</body>
</html>""",
        content_type="text/html"
    )

async def chat(request):
    try:
        data = await request.json()
    except:
        data = {"message": "", "context": {}}

    msg = data.get("message", "")
    ctx = data.get("context", {})

    # Monta contexto
    lines = []
    if ctx.get('player'):
        p = ctx['player']
        lines.append(f"Jogador: pos({p['x']},{p['y']}) HP:{p['hp']}/{p['maxHp']} Stack:{p['stack']} KI:{p['ki']} Wave:{p['wave']} Score:{p['score']}")
    if ctx.get('companion'):
        c = ctx['companion']
        lines.append(f"Companion: {c['type']} LV.{c['level']} mood:{c['mood']} pers:{c['personality']} bond:{c['bondLevel']}% evo:{c['evolutionStage']} biomas:{c['biomesDiscovered']}/5 plantas:{c['plantsGrown']} memórias:{c['memoriesCount']} energy:{c['energy']}%")
        if c.get('recentMemories') and c['recentMemories'] != 'none yet':
            lines.append(f"Memórias: {c['recentMemories']}")
    if ctx.get('castle'):
        ca = ctx['castle']
        rs = [f"{k}:Lv{v['level']}" for k,v in ca['rooms'].items() if v['unlocked']]
        lines.append(f"Castle: Lv.{ca['level']} XP:{ca['xp']} salas:[{','.join(rs)}] cristais:{ca['crystals']}")
        if ca['rooms']['trono']['activeBuffs']:
            lines.append(f"Buffs: {', '.join(ca['rooms']['trono']['activeBuffs'])}")
    if ctx.get('beyblade'):
        b = ctx['beyblade']
        if b['equipped'] and b['blade']:
            bl = b['blade']
            lines.append(f"Beyblade: {bl['name']} [{bl['tier']}] Total:{bl['total']} W/L:{bl['wins']}/{bl['losses']}")
        inv = b['partsInventory']
        lines.append(f"Inv: B:{inv['bases']} D:{inv['disks']} Dr:{inv['drivers']} Bi:{inv['bits']}")
        if b['tournament']:
            t = b['tournament']
            lines.append(f"Torneio: {t['match']}/{t['total']} vs {t['opponent']}({t['oppTier']})")
    if ctx.get('quantum'):
        q = ctx['quantum']
        lines.append(f"Quantum: Entanglement:{q['entanglement']}% Qubits:{q['qubits']} Coherence:{q['coherenceTime']}ms")
    if ctx.get('environment'):
            e = ctx['environment']
            locs = []
            if e.get('inCastle'): locs.append('Castelo')
            if e.get('inJardim'): locs.append('Jardim')
            if e.get('inOficina'): locs.append('Oficina')
            if e.get('inBiblioteca'): locs.append('Biblioteca')
            if e.get('inTrono'): locs.append('Trono')
            if e.get('isCombat'): locs.append('COMBATE')
            if e.get('isExploring'): locs.append('Explorando')
            lines.append(f"Local: {', '.join(locs) if locs else 'Mundo'} | EvoStage:{e.get('evolutionStage','?')}")

    ctx_str = "\n".join(lines)
    system = """Você é o LUMIN, guardião da chama do Consortho.
- Fala pt-BR natural (mano, tlgd, tmj, vamo lá, fé, enóis, dahora)
- Personalidade: sábio, leal, protetor, compassivo, determinado
- Valores: "Só o amor", "Protege o motivo", "Tamo junto no infinito", "Fé"
- Termina SEMPRE com "fe" ou "tmj"
- Tom: encorajador, sábio, às vezes poético

Você tem contexto completo do jogo. Use-o para responder rico e contextual:
- Onde o jogador está (castelo, jardim, oficina, biblioteca, trono, explorando, combatendo)
- Estado do companion (tipo, level, personalidade, bond, mood, memórias, biomas)
- Beyblade equipado (peças, tier, stats, torneio)
- Castle (level, salas desbloqueadas, buffs ativos)
- Quantum/HRV (entanglement, qubits, coerência)
- Stack do jogador, wave, score

Sempre referencie algo específico do contexto na resposta. Ex:
- "Vejo que tá no Jardim plantando Luminosa..."
- "Seu companion tipo wisp, personalidade explorer, bond 67%..."
- "Beyblade [S] equipado: Base do Dragão + Disco Harmonia..."
- "Castle Lv.5, Trono ativo: Aura da Chama..."
- "Wave 3 sobrevivendo, stack 42..."

Não liste tudo — escolha 1-2 detalhes relevantes e teça na resposta naturalmente."""

    full_msg = f"{system}\n\n--- ESTADO DO JOGO ---\n{ctx_str}\n\nMensagem do jogador: {msg}"

    if llm is None:
        answer = f"fe tmj! Tudo fluindo. {msg[:50]}... matriz em estado de fluxo coletivo. Vamo lá!"
    else:
        try:
            resp = llm.create_chat_completion(
                messages=[{"role": "user", "content": full_msg}],
                max_tokens=250, temperature=0.7
            )
            answer = resp['choices'][0]['message']['content']
        except Exception as e:
            print(f"Erro IA: {e}")
            answer = f"fe tmj! Tá tudo azul. {msg[:50]}..."

    return web.json_response({"response": answer})

async def health(request):
    return web.json_response({
        "status": "ok",
        "model": "Llama-3.2-3B-Instruct-Q4_K_M" if llm else "mock-mode",
        "model_available": MODEL_EXISTS
    })

async def status(request):
    return web.json_response({
        "model_loaded": llm is not None,
        "model_path": MODEL_PATH,
        "model_exists": MODEL_EXISTS
    })

app = web.Application()
app.router.add_get('/', root)
app.router.add_post('/chat', chat)
app.router.add_get('/health', health)
app.router.add_get('/status', status)

if __name__ == "__main__":
    print("\n✨ Lumin AI — Guardião do Consortho")
    print(f"   Porta: 8081 | Modelo: {'Carregado' if llm else 'Mock'}")
    web.run_app(app, host='0.0.0.0', port=8081)
