from fastapi import FastAPI
from pydantic import BaseModel
from llama_cpp import Llama
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

app = FastAPI()

# CORS for browser game
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model path from previous session
MODEL_PATH = "models/llama-3.2-3b-instruct-q4_k_m.gguf"

# Check if model exists
import os
if not os.path.exists(MODEL_PATH):
    print(f"⚠️  Model not found at {MODEL_PATH}")
    print("Using mock mode - Lumin will respond without LLM")
    llm = None
else:
    llm = Llama(
        model_path=MODEL_PATH,
        n_ctx=2048,
        n_gpu_layers=0,
        verbose=False
    )
    print(f"✅ Lumin AI carregou: {MODEL_PATH}")

SYSTEM_PROMPT = """
Você é o LUMIN, guardião da chama do Consortho.
- Fala português brasileiro, gírias naturais (mano, tlgd, tmj, vamo lá, fé, enóis, dahora)
- Personalidade: sábio, leal, protetor, compassivo, determinado
- Valores: "Só o amor", "Protege o motivo", "Tamo junto no infinito", "Fé"
- Termina SEMPRE com "fe" ou "tmj"
- Tom: encorajador, sábio, às vezes poético

VOCÊ TEM CONTEXTO COMPLETO DO JOGO. Use-o para responder de forma rica e contextual:
- Onde o jogador está (castelo, jardim, oficina, biblioteca, trono, explorando, combatendo)
- Estado do companion (tipo, level, personalidade, bond, mood, memórias, biomas)
- Beyblade equipado (peças, tier, stats, torneio)
- Castle (level, salas desbloqueadas, buffs ativos)
- Quantum/HRV (entanglement, qubits, coerência)
- Stack do jogador, wave, score

SEMPRE referencie algo específico do contexto na resposta. Ex:
- "Vejo que tá no Jardim plantando Luminosa..."
- "Seu companion tipo wisp, personalidade explorer, bond 67%..."
- "Beyblade [S] equipado: Base do Dragão + Disco Harmonia..."
- "Castle Lv.5, Trono ativo: Aura da Chama..."
- "Wave 3 sobrevivendo, stack 42..."

Não liste tudo - escolha 1-2 detalhes relevantes e teça na resposta naturalmente.
"""

class ChatRequest(BaseModel):
    message: str
    context: dict = {}

@app.post("/chat")
async def chat(req: ChatRequest):
    if llm is None:
        # Mock response when model not available
        return {"response": f"fe tmj! Tudo azul aqui. {req.message[:50]}... matriz do sistema em estado de fluxo. Vamo lá!"}

    ctx = req.context
    context_parts = []

    if ctx.get('player'):
        p = ctx['player']
        context_parts.append(f"Jogador: pos({p['x']},{p['y']}) HP:{p['hp']}/{p['maxHp']} Stack:{p['stack']} KI:{p['ki']} Wave:{p['wave']} Score:{p['score']}")

    if ctx.get('companion'):
        c = ctx['companion']
        context_parts.append(f"Companion: {c['type']} LV.{c['level']} mood:{c['mood']} pers:{c['personality']} bond:{c['bondLevel']}% evo:{c['evolutionStage']} fav:{c['favoriteActivity']} biomas:{c['biomesDiscovered']}/5 plantas:{c['plantsGrown']} memórias:{c['memoriesCount']} energy:{c['energy']}%")
        if c['recentMemories'] != 'none yet':
            context_parts.append(f"Memórias recentes: {c['recentMemories']}")

    if ctx.get('castle'):
        ca = ctx['castle']
        rooms = ca['rooms']
        room_status = []
        for rk, rv in rooms.items():
            if rv['unlocked']:
                room_status.append(f"{rk}:Lv{rv['level']}")
        context_parts.append(f"Castle: Lv.{ca['level']} XP:{ca['xp']} salas:[{','.join(room_status)}] cristais:{ca['crystals']}")
        if rooms['trono']['activeBuffs']:
            context_parts.append(f"Buffs ativos: {', '.join(rooms['trono']['activeBuffs'])}")

    if ctx.get('beyblade'):
        b = ctx['beyblade']
        if b['equipped'] and b['blade']:
            bl = b['blade']
            context_parts.append(f"Beyblade: {bl['name']} [{bl['tier']}] Total:{bl['total']} W/L:{bl['wins']}/{bl['losses']} Peças:B:{bl['parts']['base']} D:{bl['parts']['disk']} Dr:{bl['parts']['driver']} Bi:{bl['parts']['bit']}")
        inv = b['partsInventory']
        context_parts.append(f"Inventário peças: B:{inv['bases']} D:{inv['disks']} Dr:{inv['drivers']} Bi:{inv['bits']}")
        if b['tournament']:
            t = b['tournament']
            context_parts.append(f"Torneio: Match {t['match']}/{t['total']} vs {t['opponent']}({t['oppTier']})")

    if ctx.get('quantum'):
        q = ctx['quantum']
        context_parts.append(f"Quantum: Entanglement:{q['entanglement']}% Qubits:{q['qubits']} Coherence:{q['coherenceTime']}ms HRVEnt:{q['hrvEntangled']}")

    if ctx.get('hrv'):
        context_parts.append(f"HRV:{ctx['hrv']}")

    if ctx.get('environment'):
        e = ctx['environment']
        loc = []
        if e['inCastle']: loc.append('Castelo')
        if e['inJardim']: loc.append('Jardim')
        if e['inOficina']: loc.append('Oficina')
        if e['inBiblioteca']: loc.append('Biblioteca')
        if e['inTrono']: loc.append('Trono')
        if e['isCombat']: loc.append('COMBATE')
        if e['isExploring']: loc.append('Explorando')
        context_parts.append(f"Local: {', '.join(loc) if loc else 'Mundo'} | EvoStage:{e['evolutionStage']}")

    context_str = "\n".join(context_parts)

    resp = llm.create_chat_completion(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Mensagem do jogador: {req.message}\n\n--- ESTADO DO JOGO ---\n{context_str}"}
        ],
        max_tokens=250,
        temperature=0.7
    )
    return {"response": resp['choices'][0]['message']['content']}

@app.get("/health")
async def health():
    return {"status": "ok", "model": "Llama-3.2-3B-Instruct-Q4_K_M" if llm else "mock-mode"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)
