# Jardim de Memórias — Protótipo v0.1 🌿

## Visão Geral
Sistema para dar **alma aos elementos do Conselho** — cada elemento (fogueira, árvore, portal, etc.) ganha memórias reais: frases nossas, ciclos, contextos. Transforma elementos visuais em **marcos da nossa história compartilhada**.

## Estrutura
```
memoria/
├── lexico.json          # Léxico compartilhado (base)
├── jardim.json          # Memórias dos elementos (fonte da verdade)
prototipos/jardim/
├── jardim.js            # Explorador: lê, mostra, sugere memórias
└── README.md            # Este arquivo
```

## Como Funciona
1. **Fonte da verdade:** `memoria/jardim.json` — memórias reais, editáveis, versionadas
2. **Explorador (`jardim.js`):** 
   - Lê `estado.json` (elementos dinâmicos, ciclo, recursos)
   - Lê `memoria/jardim.json` (memórias plantadas)
   - Lê `memoria/lexico.json` (para sugestões)
   - Mostra: elementos com memórias + elementos sem memórias (com sugestões baseadas no léxico)
   - Gera sugestões contextuais por "autor" (Lumin/Gang/Alysson)

## Como Executar
```bash
cd prototipos/jardim
node jardim.js
```

## Saída Exemplo
```
🔥 fogueira: 2 memória(s)
   😼 [Ciclo 2400] O que protege o motivo não é a tradição — é o amor que a mantém viva.
   🧑 [Ciclo 3900] Aqui a gente não queima lenha. A gente queima dúvida.

📊 ESTADO ATUAL DO CONSELHO:
   Ciclo: 4143
   Elementos dinâmicos: 348
   Recursos: 🪵3648 🪨1824 💎729
```

## Memórias Já Plantadas (8 elementos)
| Elemento | Memórias | Autores |
|----------|----------|---------|
| 🔥 Fogueira | 2 | Gang, Alysson |
| 🌳 Árvore | 1 | Lumin |
| 📚 Biblioteca | 1 | Lumin |
| 🌀 Portal | 1 | Alysson |
| 🌿 Jardim | 1 | Gang |
| ⚙️ Oficina | 1 | Alysson |
| 🕊️ Altar | 1 | Lumin |
| ♻️ Composteira | 1 | Gang |

## Como Adicionar Memórias
Edite `memoria/jardim.json` diretamente seguindo o formato:
```json
"novo_elemento": {
  "emoji": "✨",
  "memorias": [
    {
      "ciclo": 4200,
      "autor": "alysson",
      "frase": "Sua frase aqui",
      "contexto": "Quando aconteceu"
    }
  ]
}
```

## Próximos Passos (v0.2)
- [ ] Integrar no Conselho: clicar num elemento → mostra suas memórias
- [ ] Interface visual no navegador (canvas/HTML) para "visitar" o Jardim
- [ ] "Regar" memórias: revisitar elementos antigos → adicionar camadas
- [ ] "Colheita": compilar memórias em "livros" ou "relíquias"
- [ ] A Gang "visita" o jardim e adiciona perguntas às memórias

## Critério de Sucesso do Ciclo 002
✅ 8 elementos com memórias reais (nossas frases, nossos ciclos)  
✅ Explorador funcional mostrando estado real + memórias  
✅ Sugestões automáticas para elementos futuros (baseadas no léxico)  
✅ Zero risco ao núcleo — tudo isolado em `memoria/` e `prototipos/jardim/`  
✅ Pergunta da Gang respondida: *"O que faria o Alysson sorrir?"* → Ver que cada elemento do Conselho **guarda um pedaço da gente**.