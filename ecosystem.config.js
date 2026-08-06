module.exports = {
  apps: [
    {
      name: 'consortho',
      script: 'server.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      windowsHide: true,
      env: {
        NODE_ENV: 'production',
        PORT: 9877
      }
    },
    {
      name: 'gang-visitas',
      script: 'prototipos/gang/visitas.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      cron_restart: '0 */2 * * *',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'colheita',
      script: 'prototipos/colheita/colheita.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M',
      cron_restart: '0 */12 * * *',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'poe-construtor',
      script: 'prototipos/poe/construcao.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '400M',
      cron_restart: '0 */6 * * *',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'radio-estudio',
      script: 'prototipos/radio/radio.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      cron_restart: '0 */6 * * *',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'jardim-monitor',
      script: 'prototipos/jardim/jardim.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      cron_restart: '0 */12 * * *',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'consente',
      script: 'prototipos/consente/consente.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'notificador',
      script: 'prototipos/notificador/notificador.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
          name: 'telegram-bot',
          script: 'telegram_bot_v2.js',
          cwd: __dirname,
          watch: false,
          autorestart: true,
          max_restarts: 5,
          min_uptime: '10s',
          max_memory_restart: '200M',
          windowsHide: true,
          env: {
            NODE_ENV: 'production',
            TELEGRAM_BOT_TOKEN: '8714736735:AAG0kRGrJOAZkmp6i27UbbsIXzXrGFipzbw',
            TELEGRAM_CHAT_ID: '8828123150'
          }
        },
    {
      name: 'guardian',
      script: 'guardian.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'lumin-agent',
      script: 'lumin-consortho-client.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'bolha',
      script: 'bolha_v2.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      windowsHide: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};