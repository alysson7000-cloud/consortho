module.exports = {
  apps: [
    {
      name: 'consortho',
      script: 'server.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
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
      cron_restart: '0 */2 * * *',
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
      cron_restart: '0 */12 * * *',
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
      cron_restart: '0 */6 * * *',
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
      cron_restart: '0 */6 * * *',
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
      cron_restart: '0 */12 * * *',
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
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'telegram-bot',
      script: 'telegram-bot.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 5,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'guardian',
      script: 'guardian.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
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
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};