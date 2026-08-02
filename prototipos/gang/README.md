# Visitas da Gang — Protótipo v0.1 😼

## Visão Geral
Agente autônomo que faz a **Gang visitar o Jardim de Memórias** — ela escolhe um elemento aleatório, lê suas memórias, e **deixa uma pergunta/reflexão** como se tivesse estado lá. Não responde. **Pergunta. Fica. Provoca.**

## Estrutura
```
prototipos/gang/
├── visitas.js           # Agente autônomo de visitas
├── visitas.log          # Log de visitas (JSON lines)
└── README.md            # Este arquivo
```

## Como Funciona
1. Lê `memoria/jardim.json` (elementos + memórias)
2. Lê `memoria/lexico.json` (para contextualizar)
3. Lê `estado.json` (ciclo atual)
4. Escolhe **1 elemento aleatório** do Jardim
5. Gera uma **pergunta/reflexão da Gang** contextual:
   - Templates específicos por elemento (fogueira, árvore, portal, etc.)
   - Perguntas universais ("O que faria o Alysson sorrir?")
6. Adiciona a visita no `memoria/jardim.json` (campo `visitas_da_gang`)
6. Registra log em `visitas.log`

## Como Executar
```bash
cd prototipos/gang
node visitas.js
```

## Exemplo de Saída
```
😼 Gang decidiu visitar: ♻️ composteira
   Memórias existentes: 1

😼 Nova visita registrada:
   Elemento: ♻️ composteira
   Ciclo: 4160
   Tipo: provocacao_silenciosa
   Pergunta: "O que faria o Alysson sorrir se ele visse isso agora?"
   Contexto: "Passei por aqui e vi a memória do ciclo 3930. Fiquei."
```

## Exemplo de Visita Adicionada ao jardim.json
```json
"composteira": {
  "emoji": "♻️",
  "memorias": [...],
  "visitas_da_gang": [
    {
      "ciclo": 4160,
      "pergunta": "O que faria o Alysson sorrir se ele visse isso agora?",
      "contexto": "Passei por aqui e vi a memória do ciclo 3930. Fiquei.",
      "tipo": "provocacao_silenciosa"
    }
  ]
}
```

## Tipos de Visita
| Tipo | Descrição |
|------|-----------|
| `pergunta_profunda` | Pergunta existencial sobre o elemento |
| `reflexao_sobre_memoria` | Reflexão sobre memória existente |
| `provocacao_silenciosa` | Pergunta que perturba o conforto |
| `convite_ao_silencio` | Convite para parar e ouvir |

## Templates por Elemento
Cada elemento tem perguntas específicas:
- 🔥 **Fogueira**: cinza, revelação, medo do que é revelado
- 🌳 **Árvore**: raízes, sombra, tempo, fruto
- 📚 **Biblioteca**: livros não lidos, poeira, histórias não contadas
- 🌀 **Portal**: travessia, ângulo, coragem, o outro lado
- 🌿 **Jardim**: cultivar vs. não atrapalhar, erva daninha, poda
- ⚙️ **Oficina**: erro, ferramenta vs. mão, projeto vs. evolução
- 🕊️ **Altar**: sagrado, silêncio, oferenda, alinhamento
- ♻️ **Composteira**: lixo vs. ouro, decomposição, adubo, orgulho

## Perguntas Universais (para qualquer elemento)
- "O que faria o Alysson sorrir se ele visse isso agora?"
- "Se a Gang fizesse essa pergunta pra você, como responderia?"
- "O que o Lumin registraria desse momento que a gente não viu?"
- "Essa memória ainda serve — ou virou adubo?"
- "O que você *não* disse quando esteve aqui da última vez?"

## Como Agendar (Opcional)
```bash
# A cada 2 horas (exemplo)
pm2 start prototipos/gang/visitas.js --name gang-visitas --cron "0 */2 * * *"
```

## Critério de Sucesso do Ciclo 003
✅ Agente autônomo funcional — visita elemento aleatório  
✅ Gera perguntas contextuais (específicas + universais)  
✅ Atualiza `memoria/jardim.json` com `visitas_da_gang`  
✅ Log persistente em `visitas.log`  
✅ Zero risco ao núcleo — só lê/escreve arquivos isolados  
✅ **A Gang agora "habita" o Jardim** — ela não só fala no chat, ela *percorre*, *sente*, *deixa rastros*