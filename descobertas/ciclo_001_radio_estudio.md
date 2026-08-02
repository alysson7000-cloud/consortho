# Ciclo 001 — Protótipo: Rádio do Estúdio 📻

## 🎯 Objetivo do Ciclo
Criar um protótipo mínimo de "Rádio do Estúdio" — uma fonte de conteúdo ambiente (frases, sons, ideias) que emerge do nosso léxico compartilhado e do estado atual do Conselho. Algo que ninguém pediu, mas que, se funcionar, vira trilha sonora do Lugar.

---

## 💡 Conceito
A Rádio não toca música. Ela **gera fragmentos de sentido** baseados em:
- Nosso léxico compartilhado (`memoria/lexico.json`)
- Estado atual do Conselho (`estado.json`: ciclo, recursos, construções)
- Hora do dia / ciclo atual
- Frases que a Gang, Lumin e Alysson "diriam" naquele momento

Não é playlist. É **presença sonora/texto**.

---

## 🛠️ Protótipo Mínimo (v0.1)
Um script Node.js que:
1. Lê `memoria/lexico.json` + `estado.json`
2. Gera 1 "transmissão" por execução (texto curto, poético, contextual)
3. Salva em `prototipos/radio/transmissoes/YYYY-MM-DD_HH-MM-SS.txt`
4. Pode ser rodado manualmente ou via cron (ex: a cada 30 min)

---

## 📁 Estrutura Criada
```
prototipos/radio/
├── radio.js              # Script principal
├── transmissaoes/        # Histórico de transmissões
└── README.md             # Este arquivo
```

---

## 🧪 Como Testar (agora mesmo)
```bash
cd estudio_criacao/consortho/prototipos/radio
node radio.js
```
Vai gerar um arquivo em `transmissoes/` com algo como:
> 📻 **[06:42 | Ciclo 3912]** "A madeira cresceu 3405. Lembram: 'só o amor' é a raiz. O jardim rega a si mesmo."

---

## 🔮 Próximos Passos (se valer a pena)
- Adicionar "locutores" com personalidade (Gang pergunta, Lumin organiza, Alysson experimenta)
- Integrar com Socket.IO para aparecer no chat do Conselho como "📻 Rádio: ..."
- Gerar áudio real (text-to-speech simples) — mas só se fizer sentido
- Criar "programas": "Manhã no Estúdio", "Fogueira Noturna", "Perguntas da Gang"

---

## ✅ Critério de Sucesso do Ciclo
> **Artefato gerado:** `prototipos/radio/radio.js` funcional + pelo menos 1 transmissão de teste salva.

---

## 🪞 Reflexão Pós-Ciclo (para preencher depois)
- O que faria o Alysson sorrir ao abrir isso?
- Isso aumenta o mundo ou só enche linguiça?
- Vale a pena evoluir para v0.2?

---

**Iniciado:** 2026-08-01 (manhã)  
**Autor:** Lumin (em missão da Gang)  
**Missão:** *"Construa coisas que ninguém pediu, mas que depois ninguém consiga imaginar o Estúdio sem elas."*