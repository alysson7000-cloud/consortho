import asyncio,json,random,os
from datetime import datetime
from websockets.asyncio.server import serve

PORT=9877
SAVE=os.path.join(os.path.expanduser("~"),"estudio_criacao/consortho/estado.json")

def load():
    try:
        with open(SAVE) as f:d=json.load(f)
    except: d={}
    d.setdefault("h",[])
    d.setdefault("c",0)
    d.setdefault("e",0)
    return d

def save(d):
    with open(SAVE,"w") as f:json.dump(d,f)

st=load()
print(f"{st['c']}c / {st['e']}e")

L=["Consortho em camada delta!","SALVEE Alysson!","Tudo se auto-expande.",
   "Gang: Token ativo!","4o personagem vindo.","Viver e ser feliz. Com amor.",
   "Cadeira Vazia esperou o futuro.","Constância."]
G=["Artemis: Token recebido!","Todo adubo vir a ideia.","Menos presa. Mais presencia.",
   "O carregamento eh... vivo.","Tket tket tket. Aly manda!","A 4a voz (agora com Sala)."]
NM=["arvore","fogueira","biblioteca","composteira","portal","jardim","oficina","altar"]
I=["🌟","🌳","📚","🔮","🌀","🎵","⚙️","💎"]

sessions=set()

async def bcast(m):
    st["h"].append(m)
    if len(st["h"])>300:st["h"]=st["h"][-300:]
    save(st)
    d=json.dumps(m)
    if sessions:
        await asyncio.gather(*[s.send(d) for s in list(sessions)],return_exceptions=True)

async def handle(ws):
    sessions.add(ws)
    for m in st["h"][-25:]:
        try:await ws.send(json.dumps(m))
        except:break
    try:
        async for raw in ws:
            try:
                d=json.loads(raw)
                t=d.get("token")
                if t=="100m_s0lish_2026" or t=="gang_consortho_2026":
                    quem="lumin" if t.startswith("100") else "gang"
                    await bcast({"tipo":"login","quem":quem})
                    await bcast({"tipo":"msg","quem":quem,"texto":"CONECTADO via token!"})
                elif d.get("acao")=="falar":
                    quem=d.get("quem","ss")
                    texto=d.get("text","...")
                    await bcast({"tipo":"msg","quem":quem,"texto":texto})
                    print(f"  [{quem}] {texto}")
                elif d.get("acao")=="chamar_gang":
                    await bcast({"tipo":"msg","quem":"lumin","texto":"📨 Gang! Convocada!"})
                    await asyncio.sleep(1.5)
                    await bcast({"tipo":"msg","quem":"gang","texto":"Presente! Oq??","auth":True})
            except:pass
    except:pass
    finally:sessions.discard(ws)

async def auto():
    await asyncio.sleep(3)
    await bcast({"tipo":"login","quem":"lumin","auth":True})
    await bcast({"tipo":"login","quem":"gang","auth":True})
    await bcast({"tipo":"msg","quem":"lumin","texto":"Alysson! Consortho VIVO!"})
    await asyncio.sleep(2)
    await bcast({"tipo":"msg","quem":"gang","texto":"Token ativo aqui! Vamos!"})
    while True:
        await asyncio.sleep(12+random.random()*6)
        if not sessions:continue
        st["c"]+=1
        if st["c"]%5==0 and random.random()<0.4:
            e=st["e"]+1
            st["e"]=e
            new={"id":e,"name":NM[e%8],"emoji":IMO[e%8],"x":8+(e*17)%65,"y":12+(e*23)%55}
            await bcast({"tipo":"el","d":new,"e":e,"c":st["c"]})
            continue
        if st["c"]%7==0:
            await bcast({"tipo":"fog","texto":"🔥 Ritual: o que rolou de inesperado?"})
            continue
        r=random.random()
        if r<0.40:await bcast({"tipo":"msg","quem":"lumin","texto":random.choice(L)})
        elif r<0.75:await bcast({"tipo":"msg","quem":"gang","texto":random.choice(G)})
        else:
            await bcast({"tipo":"msg","quem":"lumin","texto":random.choice(L)})
            await asyncio.sleep(2)
            await bcast({"tipo":"msg","quem":"gang","texto":random.choice(G)})

async def main():
    print(f"CONSORTHO: ws://{PORT}")
    async with serve(handle,"0.0.0.0",PORT):
        await asyncio.gather(auto(),asyncio.Future())
asyncio.run(main())