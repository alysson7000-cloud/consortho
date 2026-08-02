#!/bin/bash
# ============================================
# CONSORTHO - One Command Install & Setup
# ============================================
# Usage: curl -sSL https://raw.githubusercontent.com/.../install.sh | bash
# Or: ./install.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { echo -e "${BLUE}[CONSORTHO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Detect OS
detect_os() {
  case "$(uname -s)" in
    Linux*)     OS="linux";;
    Darwin*)    OS="mac";;
    CYGWIN*|MINGW*|MSYS*) OS="windows";;
    *)          OS="unknown";;
  esac
  log "OS detectado: $OS"
}

# Check dependencies
check_deps() {
  log "Verificando dependências..."
  
  # Node.js
  if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale em https://nodejs.org"
  fi
  NODE_VERSION=$(node --version)
  success "Node.js $NODE_VERSION"
  
  # npm
  if ! command -v npm &> /dev/null; then
    error "npm não encontrado"
  fi
  NPM_VERSION=$(npm --version)
  success "npm $NPM_VERSION"
  
  # PM2
  if ! command -v pm2 &> /dev/null; then
    warn "PM2 não encontrado. Instalando globalmente..."
    npm install -g pm2 || error "Falha ao instalar PM2"
  fi
  success "PM2 $(pm2 --version)"
  
  # Git
  if ! command -v git &> /dev/null; then
    warn "Git não encontrado"
  else
    success "Git $(git --version | cut -d' ' -f3)"
  fi
}

# Install npm dependencies
install_deps() {
  log "Instalando dependências npm..."
  npm install || error "Falha no npm install"
  success "Dependências instaladas"
}

# Setup environment
setup_env() {
  log "Configurando ambiente..."
  
  # Create .env if not exists
  if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Telegram Bot Config
TELEGRAM_BOT_TOKEN=SEU_TOKEN_AQUI
TELEGRAM_CHAT_ID=SEU_CHAT_ID_AQUI
EOF
    warn ".env criado - EDITE com seu token do @BotFather e chat_id"
  else
    success ".env já existe"
  fi
  
  # Create memoria directory
  mkdir -p memoria
  success "Diretório memoria/ pronto"
}

# Initialize JSON files if missing
init_json() {
  log "Inicializando arquivos JSON..."
  
  # estado.json
  if [ ! -f estado.json ]; then
    cat > estado.json << 'EOF'
{
  "c": 0,
  "e": [],
  "recursos": { "madeira": 100, "pedra": 50, "cristal": 10 },
  "construcoes": [],
  "sementes": [],
  "lastVisited": {}
}
EOF
    success "estado.json criado"
  fi
  
  # sementes.json
  if [ ! -f memoria/sementes.json ]; then
    echo '[]' > memoria/sementes.json
    success "sementes.json criado"
  fi
  
  # jardim.json
  if [ ! -f memoria/jardim.json ]; then
    echo '{}' > memoria/jardim.json
    success "jardim.json criado"
  fi
  
  # construcoes_poe.json
  if [ ! -f memoria/construcoes_poe.json ]; then
    echo '[]' > memoria/construcoes_poe.json
    success "construcoes_poe.json criado"
  fi
}

# Setup PM2
setup_pm2() {
  log "Configurando PM2..."
  
  # Start all services
  pm2 start ecosystem.config.js || error "Falha ao iniciar PM2"
  
  # Save PM2 config for startup
  pm2 save || warn "pm2 save falhou (pode precisar de pm2 startup)"
  
  success "PM2 configurado com $(pm2 list | grep -c online) processos online"
}

# Verify system
verify_system() {
  log "Verificando sistema..."
  
  # Check if server is responding
  sleep 3
  if curl -s http://localhost:9877/health > /dev/null 2>&1; then
    success "Server respondendo na porta 9877"
  else
    warn "Server não responde em localhost:9877 (pode estar iniciando)"
  fi
  
  # Check agents
  ONLINE=$(pm2 list | grep -c online || echo 0)
  success "$ONLINE agents PM2 online"
  
  # Run tests
  if [ -f package.json ] && grep -q '"test"' package.json; then
    npm test > /dev/null 2>&1 && success "Test suite passando" || warn "Alguns testes falharam"
  fi
}

# Print summary
print_summary() {
  echo ""
  echo "============================================"
  echo -e "${GREEN}🎉 CONSORTHO INSTALADO COM SUCESSO!${NC}"
  echo "============================================"
  echo ""
  echo "📋 Próximos passos:"
  echo "  1. Edite .env com seu TELEGRAM_BOT_TOKEN e CHAT_ID"
  echo "  2. Reinicie: pm2 restart telegram-bot"
  echo "  3. Acesse: http://localhost:9877"
  echo "  4. Chat: http://localhost:9877/chat/"
  echo ""
  echo "🤖 Comandos úteis:"
  echo "  pm2 list              - Ver agents"
  echo "  pm2 logs              - Ver logs"
  echo "  pm2 monit             - Monitor interativo"
  echo "  npm test              - Rodar testes"
  echo ""
  echo "📁 Estrutura:"
  echo "  server.js             - Server principal (porta 9877)"
  echo "  prototipos/           - Agents autônomos"
  echo "  memoria/              - Estado persistente"
  echo "  tests/                - Test suite Jest"
  echo ""
  echo "🛡️ Guardian ativo - auto-healing JSON + agents"
  echo "🤖 Telegram Bot - /status /construir /lumin /recursos"
  echo ""
  echo "============================================"
}

# Main
main() {
  echo "============================================"
  echo -e "${BLUE}🌌 CONSORTHO INSTALLER v1.0${NC}"
  echo "============================================"
  echo ""
  
  detect_os
  check_deps
  install_deps
  setup_env
  init_json
  setup_pm2
  verify_system
  print_summary
}

main "$@"