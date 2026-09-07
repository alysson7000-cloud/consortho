#!/bin/bash
# Consortho - One-command VPS deploy
# Run as root on fresh Ubuntu 22.04 VPS
# Usage: curl -sSL https://raw.githubusercontent.com/alysson7000-cloud/consortho/main/deploy.sh | bash

set -e

echo "🌌 CONSORTHO VPS DEPLOY"
echo "========================"

# Update system
apt-get update && apt-get upgrade -y

# Install dependencies
apt-get install -y git curl wget nginx certbot python3-certbot-nginx

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Create consortho user
useradd -m -s /bin/bash consortho 2>/dev/null || true

# Clone repo
cd /home/consortho
sudo -u consortho git clone https://github.com/alysson7000-cloud/consortho.git 2>/dev/null || \
  sudo -u consortho git -C consortho pull

cd consortho

# Install dependencies
sudo -u consortho npm ci --only=production

# Create .env from example if not exists
if [ ! -f .env ]; then
    sudo -u consortho cp .env.example .env
    echo "⚠️  EDIT /home/consortho/consortho/.env COM SEU TOKEN DO TELEGRAM!"
    echo "   nano /home/consortho/consortho/.env"
fi

# Create data directories
sudo -u consortho mkdir -p memoria prototipos/poe prototipos/colheita prototipos/jardim prototipos/gang logs

# Setup PM2 startup
sudo -u consortho pm2 startup systemd -u consortho --hp /home/consortho

# Start Consortho
cd /home/consortho/consortho
sudo -u consortho pm2 start ecosystem.config.js
sudo -u consortho pm2 save

# Configure Nginx reverse proxy (optional)
cat > /etc/nginx/sites-available/consortho << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:9877;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

ln -sf /etc/nginx/sites-available/consortho /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Enable firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 9877/tcp
ufw --force enable

echo ""
echo "✅ DEPLOY CONCLUÍDO!"
echo "====================="
echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo "1. Edite o .env com seu token do Telegram:"
echo "   nano /home/consortho/consortho/.env"
echo ""
echo "2. Reinicie o bot:"
echo "   sudo -u consortho pm2 restart telegram-bot"
echo ""
echo "3. Acesse o dashboard:"
echo "   http://SEU_IP_VPS:9877"
echo "   ou via Nginx: http://SEU_IP_VPS"
echo ""
echo "📊 COMANDOS ÚTEIS:"
echo "   pm2 list              # Ver agentes"
echo "   pm2 logs              # Ver logs"
echo "   pm2 monit             # Monitor visual"
echo "   pm2 restart all       # Reiniciar tudo"
echo ""
echo "🔒 SSL (opcional):"
echo "   certbot --nginx -d seu-dominio.com"
echo ""
echo "🌌 CONSORTHO RODANDO 24/7 NO VPS!"