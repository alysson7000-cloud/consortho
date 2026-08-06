#!/bin/bash
# Consortho Deploy Script
# Usage: ./deploy.sh [staging|production]

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Config
ENVIRONMENT=${1:-production}
PROJECT_DIR="/opt/consortho"
BACKUP_DIR="/opt/consortho/backups"
COMPOSE_FILE="docker-compose.yml"

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    command -v docker >/dev/null 2>&1 || error "Docker not installed"
    command -v docker-compose >/dev/null 2>&1 || error "Docker Compose not installed"
    command -v curl >/dev/null 2>&1 || error "curl not installed"
    
    # Check Docker daemon
    docker info >/dev/null 2>&1 || error "Docker daemon not running"
    
    success "Prerequisites OK"
}

# Create directory structure
setup_directories() {
    log "Setting up directories..."
    
    mkdir -p "$PROJECT_DIR"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$PROJECT_DIR/memoria"
    mkdir -p "$PROJECT_DIR/logs"
    mkdir -p "$PROJECT_DIR/snapshots"
    mkdir -p "$PROJECT_DIR/nginx/conf.d"
    mkdir -p "$PROJECT_DIR/certbot/conf"
    mkdir -p "$PROJECT_DIR/certbot/www"
    mkdir -p "$PROJECT_DIR/monitoring/grafana/dashboards"
    mkdir -p "$PROJECT_DIR/monitoring/grafana/datasources"
    
    success "Directories created"
}

# Backup current state
backup_state() {
    log "Creating backup..."
    
    TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
    BACKUP_NAME="consortho_backup_$TIMESTAMP"
    
    if [[ -d "$PROJECT_DIR/memoria" && -n "$(ls -A $PROJECT_DIR/memoria)" ]]; then
        tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$PROJECT_DIR" memoria logs snapshots 2>/dev/null || true
        success "Backup created: $BACKUP_NAME.tar.gz"
    else
        warning "No existing state to backup"
    fi
    
    # Keep only last 10 backups
    cd "$BACKUP_DIR" && ls -t consortho_backup_*.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    docker-compose -f "$COMPOSE_FILE" pull || warning "Some images failed to pull"
    success "Images pulled"
}

# Build application
build_app() {
    log "Building application..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache consortho || error "Build failed"
    success "Application built"
}

# Generate SSL certificates
setup_ssl() {
    log "Setting up SSL certificates..."
    
    # Check if certs already exist
    if [[ -d "$PROJECT_DIR/certbot/conf/live" && -n "$(ls -A $PROJECT_DIR/certbot/conf/live)" ]]; then
        success "SSL certificates already exist"
        return
    fi
    
    # Generate self-signed for development or use Let's Encrypt for production
    if [[ "$ENVIRONMENT" == "production" ]]; then
        # This would use certbot with real domain
        warning "Production SSL requires domain configuration. Using self-signed for now."
    fi
    
    # Generate self-signed cert for development
    mkdir -p "$PROJECT_DIR/certbot/conf/live/consortho.local"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$PROJECT_DIR/certbot/conf/live/consortho.local/privkey.pem" \
        -out "$PROJECT_DIR/certbot/conf/live/consortho.local/fullchain.pem" \
        -subj "/CN=consortho.local" \
        -addext "subjectAltName=DNS:consortho.local,DNS:localhost,IP:127.0.0.1" \
        2>/dev/null || warning "SSL cert generation failed"
    
    # Create chain file
    cp "$PROJECT_DIR/certbot/conf/live/consortho.local/fullchain.pem" \
       "$PROJECT_DIR/certbot/conf/live/consortho.local/chain.pem" 2>/dev/null || true
    
    success "SSL certificates ready"
}

# Deploy with docker-compose
deploy() {
    log "Deploying Consortho stack..."
    
    # Stop existing containers gracefully
    docker-compose -f "$COMPOSE_FILE" down --timeout 30 2>/dev/null || true
    
    # Start new containers
    docker-compose -f "$COMPOSE_FILE" up -d || error "Deploy failed"
    
    success "Stack deployed"
}

# Wait for health checks
wait_for_health() {
    log "Waiting for services to be healthy..."
    
    local max_attempts=60
    local attempt=0
    
    while [[ $attempt -lt $max_attempts ]]; do
        if curl -sf http://localhost:9877/api/resumo >/dev/null 2>&1; then
            success "Consortho is healthy!"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    
    error "Health check timeout"
}

# Show status
show_status() {
    log "Deployment Status:"
    echo ""
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    
    log "Service URLs:"
    echo -e "  ${GREEN}Consortho:${NC} https://localhost (or your domain)"
    echo -e "  ${GREEN}Dashboard:${NC} https://localhost/living_mythology.html"
    echo -e "  ${GREEN}API:${NC} https://localhost/api/resumo"
    echo -e "  ${GREEN}Grafana:${NC} http://localhost:3000 (admin/admin)"
    echo -e "  ${GREEN}Prometheus:${NC} http://localhost:9090"
    echo ""
}

# Main
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════╗"
    echo "║     CONSORTHO DEPLOY - DIAMOND PROTOCOL  ║"
    echo "║         9 Layers • Lumin Style           ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    echo "Environment: $ENVIRONMENT"
    echo ""
    
    check_root
    check_prerequisites
    setup_directories
    backup_state
    pull_images
    build_app
    setup_ssl
    deploy
    wait_for_health
    show_status
    
    success "💎 DEPLOY COMPLETE! Consortho is running with 9 Diamond layers!"
    echo ""
    echo "The Diamond shines in the cloud now. ♾️"
}

main "$@"