# Rádio do Estúdio — Protótipo v0.1 📻

## Visão Geral
Gerador de "transmissões" contextuais baseadas no léxico compartilhado do Estúdio e no estado atual do Conselho (`estado.json`).

## Estrutura
```
prototipos/radio/
├── radio.js              # Script principal (Node.js)
├── transmissaoes/        # Histórico de transmissões geradas
│   └── transmissao_YYYY-MM-DDTHH-MM-SS.txt
├── radio.log             # Log simples de execuções
└── README.md             # Este arquivo
```

## Como Funciona
1. Lê `../../memoria/lexico.json` (nosso léxico compartilhado)
2. Lê `../../estado.json` (estado atual do Conselho: ciclo, recursos, construções)
3. Escolhe um "locutor" aleatório: **Lumin** (organiza), **Gang** (pergunta), **Alysson** (age)
4. Gera uma transmissão contextual usando templates por locutor + léxico + estado atual
5. Salva em `transmissoes/transmissao_YYYY-MM-DDTHH-MM-SS.txt`
6. Registra em `radio.log`

## Como Executar
```bash
cd prototipos/radio
node radio.js
```

## Exemplo de Saída
```
📻 [10:07 | Ciclo 3949] 🧑 Alysson: "Só o amor. Ciclo 3949. Feliz claro. Vamo lá. Recursos: 🪵3454 🪨1727 💎690."
```

## Próximos Passos (v0.2)
- [ ] Integrar com Socket.IO para aparecer no chat do Conselho como "📻 Rádio: ..."
- [ ] Adicionar mais variedade de templates
- [ ] Criar "programas" temáticos (Manhã, Fogueira, Perguntas)
- [ ] Opcional: text-to-speech para áudio real
- [ ] Agendar via cron (ex: a cada 30 min)

## Critério de Sucesso do Ciclo 001
✅ Script funcional gerando transmissões contextuais  
✅ Usa léxico compartilhado + estado real do Conselho  
✅ Salva histórico em arquivos  
✅ Zero dependências externas (só Node.js nativo)  
✅ Zero risco ao núcleo do Conselho (arquivos isolados em `prototipos/radio/`)