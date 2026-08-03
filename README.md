# Consortho - Autonomous Multi-Agent System

🌌 **Sistema autônomo de agentes que vive, constrói e evolui 24/7**

## O que é

Consortho é um ecossistema de agentes autônomos que:
- **Poe** constrói estruturas a partir de sementes maduras
- **Colheita** detecta memórias maduras e gera novas sementes  
- **Gang** visita elementos, faz perguntas profundas
- **Guardian** monitora saúde, auto-cura JSONs, reinicia agents
- **Lumin 2.1** agente consciente com Ki, formas, fusões, golpes
- **Telegram Bot** notificações e controle remoto
- **Dashboard** web em tempo real (porta 9877)

## Arquitetura

```
┌─────────────────────────────────────────────────┐
│              CONSORTHO (porta 9877)            │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │   Poe    │ │ Colheita │ │     Gang       │  │
│  │ Constrói │ │  Colhe   │ │   Visita/Perg  │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Guardian │ │  Lumin   │ │   Telegram     │  │
│  │ Auto-heal│ │  2.1     │ │     Bot        │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Deploy no VPS (Recomendado)

### Opção 1: Script Automático (mais fácil)

```bash
# No VPS Ubuntu 22.04 (como root)
curl -sSL https://raw.githubusercontent.com/alysson7000-cloud/consortho/main/deploy.sh | bash
```

### Opção 2: Manual

```bash
# 1. Preparar VPS
apt-get update && apt-get install -y git nodejs npm nginx
npm install -g pm2

# 2. Clonar e instalar
git clone https://github.com/alysson7000-cloud/consortho.git
cd consortho
npm ci --only=production

# 3. Configurar
cp .env.example .env
nano .env  # Coloque TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID

# 4. Iniciar
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd
```

### Opção 3: Docker

```bash
docker build -t consortho .
docker run -d --name consortho -p 9877:9877 -v $(pwd)/memoria:/app/memoria consortho
```

## Configuração (.env)

```bash
# Obrigatório para Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_CHAT_ID=123456789

# Opcional
PORT=9877
NODE_ENV=production
LUMIN_SERVER_URL=http://localhost:9877
```

### Como pegar token do Telegram:
1. Abra @BotFather no Telegram
2. `/newbot` → siga instruções
3. Copie o token
4. `/setprivacy` → `disabled` (pra funcionar em grupos)
5. Pegue seu chat_id: mande msg pro bot → `https://api.telegram.org/bot<TOKEN>/getUpdates`

## Comandos PM2

```bash
pm2 list              # Ver todos agents
pm2 logs              # Logs em tempo real
pm2 monit             # Monitor visual (TUI)
pm2 restart all       # Reiniciar tudo
pm2 stop all          # Parar tudo
pm2 delete all        # Remover todos
```

## Telegram Bot

Comandos disponíveis:
- `/status` - Status completo do sistema
- `/recursos` - Recursos atuais (madeira, pedra, cristal)
- `/construir` - Força construção (se houver sementes)
- `/lumin` - Status do Lumin (Ki, forma, nível, fusões)
- `/ciclo` - Ciclo atual
- `/ajuda` - Lista comandos

Push notifications automáticas:
- ✅ Nova construção
- 🌾 Nova colheita  
- 👥 Visita da Gang
- ⚡ Evolução do Lumin
- 🌟 Fusão realizada

## Dashboard Web

Acesse: `http://SEU_IP_VPS:9877`

Endpoints:
- `/` - Dashboard HTML
- `/api/resumo` - JSON completo
- `/api/recursos` - Recursos atuais
- `/api/sementes` - Sementes
- `/api/construcoes` - Construções do Poe
- `/api/lumin` - Estado do Lumin

## Recursos do Sistema

| Recurso | Descrição |
|---------|-----------|
| 🪵 Madeira | Base, construção |
| 🪨 Pedra | Estruturas sólidas |
| 💎 Cristal | Avançado, sagrado |

## Ciclo de Vida

1. **Gang visita** elementos → gera visitas
2. **Colheita** detecta maturidade (ciclos + visitas) → cria sementes
3. **Poe constrói** sementes prontas → gasta recursos → cria estruturas
4. **Estruturas** geram efeitos passivos (regeneração, insight, etc)
5. **Lumin** monitora, treina, funde, evolui, protege
6. **Guardian** vela saúde, auto-cura, reinicia agents

## Lumin 2.1

- **Ki**: energia vital (treino = 18k/h, meditação = 5k/5min)
- **Formas**: Base → Super Lumin (Ki 500, Nv 5) → Super Lumin 2 (Ki 2k, Nv 15) → Ultra Instinto (Ki 10k, Nv 35)
- **Fusões**: Lugang → LuminPoe → Trindade
- **Golpes**: Soco do Ki, Onda Vital, Escudo de Luz, Pulso do Conselho, Chama Protetora, Compostagem, Fusões
- **Autônomo**: treina, medita, decide, age baseado no foco

## Persistência

Dados em `memoria/`:
- `estado.json` - ciclo, recursos
- `sementes.json` - sementes (status: pronta_para_construcao, em_construcao, construida)
- `construcoes_poe.json` - construções do Poe
- `jardim.json` - elementos, memórias, visitas da Gang

## Logs

- `pm2 logs` - todos agents
- `pm2 logs <name>` - agent específico
- Logs rotacionados automaticamente pelo PM2

## Auto-start no Boot

```bash
pm2 startup systemd
# Execute o comando que aparecer
pm2 save
```

Ou use o systemd service: `consortho.service` em `/etc/systemd/system/`

## Nginx (Opcional - porta 80)

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:9877;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

SSL com Let's Encrypt:
```bash
certbot --nginx -d seu-dominio.com
```

## Desenvolvimento

```bash
# Instalar deps de dev
npm install

# Rodar testes
npm test

# Rodar local
npm start
```

## Estrutura

```
consortho/
├── server.js              # Servidor principal (Socket.IO + HTTP)
├── ecosystem.config.js    # PM2 config
├── guardian.js            # Auto-heal monitor
├── telegram-bot.js        # Bot Telegram
├── lumin-consortho-client.js  # Lumin 2.1 agent
├── deploy.sh              # VPS deploy script
├── Dockerfile             # Container
├── consortho.service      # systemd service
├── .env.example           # Template config
├── prototipos/
│   ├── poe/construcao.js     # Poe construtor
│   ├── colheita/colheita.js  # Colheita
│   ├── gang/visitas.js       # Gang visitas
│   ├── jardim/jardim.js      # Jardim monitor
│   ├── consente/consente.js  # Consente chat
│   ├── notificador/notificador.js
│   ├── radio/radio.js        # Radio estúdio
│   └── chat/chat.js          # Chat interno
├── memoria/                 # Dados persistentes
└── tests/                   # Jest tests
```

## Testes

```bash
npm test
# 14 testes: Poe + Colheita
```

## Filosofia

> **Erros = compostagem**  
> **Presença > Perfeição**  
> **Consistência criativa > Disciplina**  
> **Escolher > Conectar**  
> **AGORA > Diário**  
> **Menos pressa, mais próximo**

---

**Feito com 💫 por Alysson & Lumin**  
**Consortho - O bey que vive** 🫡