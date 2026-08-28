module.exports = {
  apps: [
    {
      name: 'consortho',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1536M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 9877,
        TZ: 'America/Sao_Paulo'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 9877,
        TZ: 'America/Sao_Paulo'
      },
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      out_file: './logs/consortho-out.log',
      error_file: './logs/consortho-error.log',
      merge_logs: true,
      log_type: 'json',
      // Windows compatibility
      windowsHide: true,
      // Auto-restart on crash
      autorestart: true,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 8000,
      // Source map support
      source_map_support: true,
    },
    // Diamond Protocol Workers (if needed for heavy processing)
    {
      name: 'consortho-diamond',
      script: 'diamond_worker.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'diamond'
      },
      windowsHide: true,
    },
    // Telegram Bot (separate process for reliability)
    {
      name: 'consortho-telegram',
      script: 'consortho/prototipos/telegram/bot.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'telegram'
      },
      windowsHide: true,
    }
  ],
  deploy: {
    production: {
      user: 'consortho',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'https://github.com/alysson7000-cloud/consortho.git',
      path: '/opt/consortho',
      'pre-deploy': 'git fetch origin',
      'post-deploy': 'npm ci --only=production && npm run build 2>/dev/null || true && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get update && apt-get install -y nodejs npm docker.io docker-compose'
    }
  }
};