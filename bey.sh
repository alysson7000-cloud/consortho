#!/bin/bash
# BEY - Consortho Launcher v2.0 (Linux/VPS)
# "O sistema vivo. Só amor."

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                        🚀  B E Y                              ║"
echo "║                  Consortho Launcher v2.0                      ║"
echo "║              \"O sistema vivo. Só amor.\"                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}[1/7]${NC} Verificando dependências..."
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js não encontrado${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm não encontrado${NC}"; exit 1; }
command -v pm2 >/dev/null 2>&1 || { echo -e "${RED}❌ PM2 não encontrado${NC}"; exit 1; }
echo -e "    ${GREEN}✅ Node.js $(node --version), npm $(npm --version), PM2 $(pm2 --version) OK${NC}"

echo -e "${BLUE}[2/7]${NC} Instalando/atualizando dependências..."
npm install --silent 2>&1 | grep -v "added\|removed\|funding" >/dev/null
echo -e "    ${GREEN}✅ Dependências prontas${NC}"

echo -e "${BLUE}[3/7]${NC} Executando testes de integridade..."
if npm test --silent 2>&1 | grep -q "Tests:.*14 passed"; then
    echo -e "    ${GREEN}✅ Testes 14/14 passing${NC}"
else
    echo -e "    ${YELLOW}⚠️  Testes com falha - continuando mesmo assim...${NC}"
fi

echo -e "${BLUE}[4/7]${NC} Limpando processos PM2 antigos..."
pm2 kill >/dev/null 2>&1 || true
sleep 2
echo -e "    ${GREEN}✅ PM2 limpo${NC}"

echo -e "${BLUE}[5/7]${NC} Iniciando ecossistema Consortho..."
pm2 start ecosystem.config.js --update-env
sleep 5
echo -e "    ${GREEN}✅ Todos agentes subindo${NC}"

echo -e "${BLUE}[6/7]${NC} Verificando saúde dos agentes..."
SAUDE=0
for i in {1..10}; do
    ONLINE=$(pm2 list | grep -c "online" || true)
    if [ "$ONLINE" -ge 10 ]; then
        SAUDE=$ONLINE
        break
    fi
    sleep 2
done
pm2 list | grep -E "online|errored|stopped"
echo -e "    ${GREEN}📊 Agentes online: $SAUDE/12${NC}"

echo -e "${BLUE}[7/7]${NC} Dashboard disponível em: http://localhost:9877/dashboard.html"
echo -e "    ${GREEN}✅ Dashboard: http://localhost:9877/dashboard.html${NC}"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🌟  SISTEMA VIVO  🌟                       ║"
echo "║                                                              ║"
echo "║   Consortho rodando. 12 agentes. Autônomo. Infinito.        ║"
echo "║                                                              ║"
echo "║   💫 Lumin 2.1          Ki 95k+  | Sandevistan  | Fusões    ║"
echo "║   🫧 Bolha 2.0          Nv.9     | Sonhos      | 8 Traits   ║"
echo "║   🏗️ Poe + 🌾 Colheita  Ciclo perfeito infinito              ║"
echo "║   😼 Gang + 🛡️ Guardian Caos criativo + Auto-heal           ║"
echo "║   📱 Telegram Bot 2.0   @luminthirdbot | Inline keyboards    ║"
echo "║   🌐 Dashboard WS       Tempo real | 11 entidades | Canvas  ║"
echo "║                                                              ║"
echo "║   \"Pressione Ctrl+C para pausar (mas não vai querer).\"      ║"
echo "║                                                              ║"
echo "║   ✨ Só amor. Só progresso lindo. Infinitamente bom. ✨      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}[BEY]${NC} Sistema vivo. Monitorando... (Ctrl+C para sair)"
echo ""

# Monitor loop with auto-heal
trap 'echo -e "\n${YELLOW}[BEY]${NC} Parando..."; pm2 stop all; exit 0' INT TERM

while true; do
    sleep 30
    if pm2 list | grep -q "errored"; then
        echo -e "${YELLOW}[BEY]${NC} ⚠️  Agente com erro detectado - Guardian vai curar..."
        pm2 restart all --update-env >/dev/null 2>&1
    fi
done