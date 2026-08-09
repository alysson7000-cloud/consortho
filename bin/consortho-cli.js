/**
 * 💎 CONSORTHO CLI - Ferramenta de Linha de Comando Oficial
 * Gerencia, monitora e controla o Consortho + Diamond Protocol
 */

const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const packageJson = require('../package.json');
const CONFIG_DIR = path.join(os.homedir(), '.consortho');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const LOGS_DIR = path.join(CONFIG_DIR, 'logs');

class ConsorthoCLI {
  constructor() {
    this.config = this.loadConfig();
    this.apiBase = this.config.apiBase || 'http://127.0.0.1:9877';
    this.setupCommander();
  }

  loadConfig() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      }
    } catch (e) {}
    return { apiBase: 'http://127.0.0.1:9877', oracleCloud: {} };
  }

  saveConfig() {
    fs.ensureDirSync(CONFIG_DIR);
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }

  setupCommander() {
    program
      .name('consortho')
      .description(chalk.cyan('💎 CONSORTHO CLI - Diamond Protocol Management Tool'))
      .version(packageJson.version)
      .addHelpText('after', `
${chalk.cyan('Exemplos:')}
  $ consortho status                    # Status do servidor
  $ consortho deploy oracle             # Deploy no Oracle Cloud
  $ consortho logs --follow             # Logs em tempo real
  $ consortho lumin evolve              # Evolui o Lumin
  $ consortho lumin sandevistan 3       # Ativa Sandevistan Nv.3
  $ consortho lumin fusion trindade     # Fusão Trindade
  $ consortho diamond status            # Status Diamond Protocol
  $ consortho backup create             # Cria backup
  $ consortho backup restore <file>     # Restaura backup
  $ consortho deploy oracle             # Deploy Oracle Cloud
  $ consortho config set apiBase http://127.0.0.1:9877
  $ consortho init                      # Inicializa projeto

${chalk.cyan('Documentação:')} https://github.com/alysson7000-cloud/consortho
      `);

    // Status command
    program
      .command('status')
      .description('Mostra status do servidor Consortho')
      .option('-w, --watch', 'Monitora continuamente')
      .option('-j, --json', 'Output em JSON')
      .action(async (options) => {
        await this.status(options);
      });

    // Config commands
    const configCmd = program.command('config').description('Gerencia configuração');
    configCmd
      .command('get <key>')
      .description('Obtém valor de configuração')
      .action((key) => this.configGet(key));
    configCmd
      .command('set <key> <value>')
      .description('Define valor de configuração')
      .action((key, value) => this.configSet(key, value));
    configCmd
      .command('list')
      .description('Lista todas as configurações')
      .action(() => this.configList());

    // Lumin commands
    const luminCmd = program.command('lumin').description('Controla o Lumin');
    luminCmd
      .command('status')
      .description('Status do Lumin')
      .action(() => this.luminStatus());
    luminCmd
      .command('evolve')
      .description('Evolui o Lumin para próxima forma')
      .action(() => this.luminEvolve());
    luminCmd
      .command('sandevistan <level>')
      .description('Ativa Sandevistan (1-7)')
      .action((level) => this.luminSandevistan(parseInt(level)));
    luminCmd
      .command('fusion <type>')
      .description('Realiza fusão (dual|trindade|quarteto|omega|infinito)')
      .action((type) => this.luminFusion(type));
    luminCmd
      .command('train <duration> [ki]')
      .description('Treina Lumin (duração em ms, ki ganho opcional)')
      .action((duration, ki) => this.luminTrain(parseInt(duration), parseInt(ki) || 100));

    // Diamond commands
    const diamondCmd = program.command('diamond').description('Diamond Protocol');
    diamondCmd
      .command('status')
      .description('Status de todas as 9 layers')
      .action(() => this.diamondStatus());
    diamondCmd
      .command('layer <name>')
      .description('Status detalhado de uma layer')
      .action((name) => this.diamondLayer(name));
    diamondCmd
      .command('trigger-evolution')
      .description('Dispara evolução do Diamond')
      .action(() => this.diamondTriggerEvolution());
    diamondCmd
      .command('sync')
      .description('Força sincronização das layers')
      .action(() => this.diamondSync());

    // Logs command
    program
      .command('logs')
      .description('Visualiza logs do servidor')
      .option('-f, --follow', 'Segue logs em tempo real')
      .option('-n, --lines <n>', 'Número de linhas', '50')
      .option('-t, --type <type>', 'Tipo de log (system|publico|sussurro|all)', 'all')
      .action(async (options) => {
        await this.logs(options);
      });

    // Backup commands
    const backupCmd = program.command('backup').description('Gerencia backups');
    backupCmd
      .command('create [name]')
      .description('Cria backup do estado atual')
      .action((name) => this.backupCreate(name));
    backupCmd
      .command('restore <file>')
      .description('Restaura backup')
      .action((file) => this.backupRestore(file));
    backupCmd
      .command('list')
      .description('Lista backups disponíveis')
      .action(() => this.backupList());
    backupCmd
      .command('delete <file>')
      .description('Deleta backup')
      .action((file) => this.backupDelete(file));

    // Deploy commands
    const deployCmd = program.command('deploy').description('Deploy para云');
    deployCmd
      .command('oracle')
      .description('Deploy no Oracle Cloud Free Tier')
      .option('-y, --yes', 'Confirma automaticamente')
      .action((options) => this.deployOracle(options));
    deployCmd
      .command('status')
      .description('Status do deploy')
      .action(() => this.deployStatus());

    // Monitor command
    program
      .command('monitor')
      .description('Monitor em tempo real (dashboard terminal)')
      .option('-i, --interval <ms>', 'Intervalo de atualização (ms)', '2000')
      .action((options) => this.monitor(parseInt(options.interval)));

    // Init command
    program
      .command('init')
      .description('Inicializa projeto Consortho')
      .option('-f, --force', 'Força reinicialização')
      .action((options) => this.init(options));

    // Doctor command
    program
      .command('doctor')
      .description('Verifica saúde do sistema')
      .action(() => this.doctor());

    // Logs command (alias)
    program
      .command('tail')
      .description('Alias para logs --follow')
      .action(() => this.logs({ follow: true }));

    // Version
    program
      .command('version')
      .description('Mostra versão')
      .action(() => console.log(chalk.cyan(`Consortho CLI v${packageJson.version}`)));

    // Default help
    program.parseAsync(process.argv).catch(() => {});
  }

  async apiRequest(endpoint, method = 'GET', data = null) {
    try {
      const config = { method, url: `${this.apiBase}${endpoint}`, timeout: 5000 };
      if (data) { config.data = data; config.headers = { 'Content-Type': 'application/json' }; }
      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Servidor não está rodando. Inicie com: consortho start');
      }
      throw error;
    }
  }

  // Status command
  async status(options) {
    const spinner = ora('Obtendo status...').start();
    try {
      const data = await this.apiRequest('/api/resumo');
      spinner.succeed('Status obtido');

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      console.log(chalk.cyan('\n💎 CONSORTHO STATUS\n'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(`${chalk.cyan('Ciclo:')} ${chalk.yellow(data.ciclos.toLocaleString())}`);
      console.log(`${chalk.cyan('Elementos:')} ${chalk.yellow(data.elementos)}`);
      console.log(`${chalk.cyan('Construções:')} ${chalk.yellow(data.construcoes)}`);
      console.log(`${chalk.cyan('Recursos:')}`);
      console.log(`  ${chalk.yellow('🪵 Madeira:')} ${chalk.green(data.recursos.madeira.toLocaleString())}`);
      console.log(`  ${chalk.yellow('🪨 Pedra:')} ${chalk.gray(data.recursos.pedra.toLocaleString())}`);
      console.log(`  ${chalk.yellow('💎 Cristal:')} ${chalk.cyan(data.recursos.cristal.toLocaleString())}`);
      console.log(`${chalk.cyan('Última msg Gang:')} ${chalk.gray(data.ultimaMensagemGang?.texto || 'N/A')}`);
      console.log(`${chalk.cyan('Uptime:')} ${chalk.yellow(data.tempoDesdeInicio)}`);
      console.log(`${chalk.cyan('Players Online:')} ${chalk.yellow(data.playersOnline)}`);
      console.log(`${chalk.cyan('Hora Atual:')} ${chalk.gray(data.horaAtual)}`);
      console.log(chalk.gray('─'.repeat(50)));

      if (options.watch) {
        console.log(chalk.cyan('\n👁️  Monitorando... (Ctrl+C para sair)\n'));
        setInterval(async () => {
          try {
            const data = await this.apiRequest('/api/resumo');
            process.stdout.write(`\r${chalk.cyan('Ciclo:')} ${data.ciclos} | ${chalk.green('🪵')} ${data.recursos.madeira} | ${chalk.gray('🪨')} ${data.recursos.pedra} | ${chalk.cyan('💎')} ${data.recursos.cristal} | ${chalk.yellow('⏱️')} ${data.tempoDesdeInicio}   `);
          } catch (e) {
            process.stdout.write(`\r${chalk.red('❌ Conexão perdida')}   `);
          }
        }, 2000);
      }
    } catch (error) {
      spinner.fail('Erro ao obter status');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }

  // Config commands
  configGet(key) {
    const value = this.config[key];
    if (value !== undefined) {
      console.log(chalk.green(`${key}: ${JSON.stringify(value)}`));
    } else {
      console.log(chalk.yellow(`Chave "${key}" não encontrada`));
    }
  }

  configSet(key, value) {
    try {
      const parsed = JSON.parse(value);
      this.config[key] = parsed;
    } catch {
      this.config[key] = value;
    }
    this.saveConfig();
    console.log(chalk.green(`✅ ${key} = ${JSON.stringify(this.config[key])}`));
  }

  configList() {
    console.log(chalk.cyan('\n⚙️  CONFIGURAÇÕES ATUAIS\n'));
    console.log(chalk.gray('─'.repeat(50)));
    Object.entries(this.config).forEach(([key, value]) => {
      console.log(`${chalk.cyan(key)}: ${chalk.yellow(JSON.stringify(value))}`);
    });
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.gray(`\nArquivo: ${CONFIG_FILE}\n`));
  }

  // Lumin commands
  async luminStatus() {
    const spinner = ora('Obtendo status do Lumin...').start();
    try {
      const data = await this.apiRequest('/api/lumin/state');
      spinner.succeed('Status do Lumin obtido');
      console.log(chalk.cyan('\n💫 LUMIN STATUS\n'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(JSON.stringify(data, null, 2));
      console.log(chalk.gray('─'.repeat(50)));
    } catch (error) {
      spinner.fail('Erro ao obter status');
      console.error(chalk.red(error.message));
    }
  }

  async luminEvolve() {
    const spinner = ora('Evoluindo Lumin...').start();
    try {
      const data = await this.apiRequest('/api/lumin/evolucao', 'POST', { forma: 'auto', ki: 5000, nivel: 1 });
      spinner.succeed('Lumin evoluiu!');
      console.log(chalk.green('⚡ Lumin evoluiu!'));
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      spinner.fail('Erro ao evoluir');
      console.error(chalk.red(error.message));
    }
  }

  async luminSandevistan(level) {
    if (level < 1 || level > 7) {
      console.error(chalk.red('Nível deve ser entre 1 e 7'));
      return;
    }
    const spinner = ora(`Ativando Sandevistan Nv.${level}...`).start();
    try {
      const data = await this.apiRequest('/api/lumin/sandevistan', 'POST', { acao: 'ativar', nivel: level });
      spinner.succeed(`Sandevistan Nv.${level} ativado!`);
      console.log(chalk.magenta(`⚡⚡⚡ SANDEVISTAN NV.${level} ATIVADO!`));
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      spinner.fail('Erro ao ativar Sandevistan');
      console.error(chalk.red(error.message));
    }
  }

  async luminFusion(type) {
    const validTypes = ['dual', 'trindade', 'quarteto', 'omega', 'infinito'];
    if (!validTypes.includes(type.toLowerCase())) {
      console.error(chalk.red(`Tipo inválido. Use: ${validTypes.join(', ')}`));
      return;
    }
    const spinner = ora(`Realizando fusão ${type}...`).start();
    try {
      const data = await this.apiRequest('/api/lumin/fusao', 'POST', { fusao: type });
      spinner.succeed(`Fusão ${type} realizada!`);
      console.log(chalk.yellow(`🌟 FUSÃO ${type.toUpperCase()} REALIZADA!`));
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      spinner.fail('Erro na fusão');
      console.error(chalk.red(error.message));
    }
  }

  async luminTrain(duration, ki) {
    const spinner = ora(`Treinando por ${duration}ms...`).start();
    try {
      const data = await this.apiRequest('/api/lumin/treino', 'POST', { duracao: duration, ki_ganho: ki });
      spinner.succeed('Treino concluído!');
      console.log(chalk.green(`🏋️ Treino concluído! +${ki} Ki`));
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      spinner.fail('Erro no treino');
      console.error(chalk.red(error.message));
    }
  }

  // Diamond commands
  async diamondStatus() {
    const spinner = ora('Obtendo status Diamond Protocol...').start();
    try {
      const data = await this.apiRequest('/api/diamond/status');
      spinner.succeed('Diamond Protocol status obtido');
      console.log(chalk.cyan('\n💎 DIAMOND PROTOCOL STATUS\n'));
      console.log(chalk.gray('─'.repeat(60)));
      console.log(`${chalk.cyan('Inicializado:')} ${data.initialized ? chalk.green('✅ SIM') : chalk.red('❌ NÃO')}`);
      console.log(`${chalk.cyan('Tick Count:')} ${chalk.yellow(data.tickCount)}`);
      console.log(`${chalk.cyan('Layers Ativas:')} ${chalk.green(Object.keys(data.layers || {}).length)}/9`);
      console.log(chalk.gray('─'.repeat(60)));
      console.log(chalk.cyan('\nLAYERS:\n'));
      Object.entries(data.layers || {}).forEach(([name, data]) => {
        console.log(`${chalk.cyan(`Layer ${name}:`)} ${chalk.green('✅ ATIVA')}`);
        if (data) {
          Object.entries(data).slice(0, 3).forEach(([k, v]) => {
            console.log(`  ${chalk.gray(k)}: ${chalk.yellow(JSON.stringify(v))}`);
          });
        }
      });
      console.log(chalk.gray('─'.repeat(60)));
    } catch (error) {
      console.error(chalk.red(error.message));
    }
  }

  async diamondLayer(name) {
    const spinner = ora(`Obtendo layer ${name}...`).start();
    try {
      const data = await this.apiRequest(`/api/diamond/${name}`);
      spinner.succeed(`Layer ${name} obtida`);
      console.log(chalk.cyan(`\n💎 LAYER ${name.toUpperCase()}\n`));
      console.log(chalk.gray('─'.repeat(60)));
      console.log(JSON.stringify(data, null, 2));
      console.log(chalk.gray('─'.repeat(60)));
    } catch (error) {
      spinner.fail('Erro ao obter layer');
      console.error(chalk.red(error.message));
    }
  }

  async diamondTriggerEvolution() {
    const spinner = ora('Disparando evolução Diamond...').start();
    try {
      const data = await this.apiRequest('/api/diamond/trigger-evolution', 'POST');
      spinner.succeed('Evolução Diamond disparada!');
      console.log(chalk.green('⚡ Evolução Diamond disparada!'));
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      spinner.fail('Erro ao disparar evolução');
      console.error(chalk.red(error.message));
    }
  }

  async diamondSync() {
    const spinner = ora('Sincronizando layers...').start();
    try {
      const data = await this.apiRequest('/api/diamond/sync', 'POST');
      spinner.succeed('Layers sincronizadas!');
      console.log(chalk.green('🔄 Layers sincronizadas!'));
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      spinner.fail('Erro na sincronização');
      console.error(chalk.red(error.message));
    }
  }

  // Logs command
  async logs(options) {
    const spinner = ora('Obtendo logs...').start();
    try {
      const data = await this.apiRequest(`/api/chat/${options.type === 'all' ? 'publico' : options.type}`);
      spinner.succeed('Logs obtidos');
      const lines = data.slice(-options.lines);
      if (options.follow) {
        console.log(chalk.cyan('\n👁️  Seguindo logs... (Ctrl+C para sair)\n'));
        let lastLength = data.length;
        setInterval(async () => {
          try {
            const newData = await this.apiRequest('/api/chat/publico');
            const newLines = newData.slice(lastLength);
            newLines.forEach(log => {
              console.log(`${chalk.gray(log.hora)} ${chalk.cyan(`[${log.canal}]`)} ${chalk.white(log.quem)}: ${log.texto}`);
            });
            lastLength = newData.length;
          } catch (e) {}
        }, 1000);
        console.log(chalk.cyan('\n👁️  Seguindo logs... (Ctrl+C para sair)\n'));
        return;
      }
      console.log(chalk.cyan('\n📋 LOGS RECENTES\n'));
      console.log(chalk.gray('─'.repeat(80)));
      lines.forEach(log => {
        const color = log.canal === 'sistema' ? chalk.cyan : log.canal === 'sussurro' ? chalk.magenta : chalk.white;
        console.log(`${chalk.gray(log.hora)} ${chalk.cyan(`[${log.canal}]`)} ${chalk.white(log.quem || 'sistema')}: ${log.texto}`);
      });
      console.log(chalk.gray('─'.repeat(80)));
    } catch (error) {
      spinner.fail('Erro ao obter logs');
      console.error(chalk.red(error.message));
    }
  }

  // Backup commands
  async backupCreate(name) {
    const spinner = ora('Criando backup...').start();
    try {
      const data = await this.apiRequest('/api/backup/full', 'GET');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = name ? `consortho-backup-${name}-${timestamp}.json` : `consortho-backup-${timestamp}.json`;
      const backupDir = path.join(CONFIG_DIR, 'backups');
      fs.ensureDirSync(backupDir);
      const filepath = path.join(backupDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      console.log(chalk.green(`✅ Backup criado: ${filepath}`));
      console.log(chalk.gray(`Tamanho: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`));
    } catch (error) {
      console.error(chalk.red('Erro ao criar backup:', error.message));
    }
  }

  async backupRestore(file) {
    const filepath = path.isAbsolute(file) ? file : path.join(CONFIG_DIR, 'backups', file);
    if (!fs.existsSync(filepath)) {
      console.error(chalk.red(`Arquivo não encontrado: ${filepath}`));
      return;
    }
    const spinner = ora('Restaurando backup...').start();
    try {
      const backup = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      const data = await this.apiRequest('/api/restore', 'POST', backup);
      console.log(chalk.green('✅ Backup restaurado com sucesso!'));
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(chalk.red('Erro ao restaurar:', error.message));
    }
  }

  backupList() {
    const backupDir = path.join(CONFIG_DIR, 'backups');
    if (!fs.existsSync(backupDir)) {
      console.log(chalk.yellow('Nenhum backup encontrado'));
      return;
    }
    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      console.log(chalk.yellow('Nenhum backup encontrado'));
      return;
    }
    console.log(chalk.cyan('\n📦 BACKUPS DISPONÍVEIS\n'));
    console.log(chalk.gray('─'.repeat(80)));
    files.sort().reverse().forEach(file => {
      const filepath = path.join(backupDir, file);
      const stats = fs.statSync(filepath);
      console.log(`${chalk.cyan(file)}  ${chalk.gray(`${(stats.size / 1024).toFixed(2)} KB`)}  ${chalk.gray(stats.mtime.toLocaleString())}`);
    });
    console.log(chalk.gray('─'.repeat(80)));
  }

  backupDelete(file) {
    const filepath = path.isAbsolute(file) ? file : path.join(CONFIG_DIR, 'backups', file);
    if (!fs.existsSync(filepath)) {
      console.error(chalk.red(`Arquivo não encontrado: ${filepath}`));
      return;
    }
    fs.unlinkSync(filepath);
    console.log(chalk.green(`✅ Backup deletado: ${file}`));
  }

  // Deploy Oracle
  async deployOracle(options) {
    console.log(chalk.cyan('\n☁️  DEPLOY ORACLE CLOUD FREE TIER\n'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.yellow('⚠️  Este comando fará deploy no Oracle Cloud Free Tier'));
    console.log(chalk.gray('─'.repeat(60)));

    if (!options.yes) {
      const { confirm } = await inquirer.prompt([
        { type: 'confirm', name: 'confirm', message: 'Continuar com deploy?', default: false }
      ]);
      if (!confirm) {
        console.log(chalk.yellow('Deploy cancelado'));
        return;
      }
    }

    const spinner = ora('Preparando deploy...').start();

    // Verifica Docker
    try {
      await this.runCommand('docker --version');
      spinner.succeed('Docker encontrado');
    } catch {
      spinner.fail('Docker não encontrado');
      console.error(chalk.red('Instale Docker primeiro: https://docker.com'));
      return;
    }

    // Build image
    spinner.text = 'Building Docker image...';
    try {
      await this.runCommand('docker build -t consortho:latest .', { cwd: path.join(__dirname, '..') });
      spinner.succeed('Imagem construída');
    } catch (e) {
      spinner.fail('Falha no build');
      console.error(chalk.red('Erro no build Docker'));
      return;
    }

    // Deploy commands
    const commands = [
      'docker tag consortho:latest <seu-registry>/consortho:latest',
      'docker push <seu-registry>/consortho:latest',
      'ssh ubuntu@<seu-ip> "docker pull <seu-registry>/consortho:latest && docker compose up -d"'
    ];

    console.log(chalk.cyan('\n📋 COMANDOS PARA DEPLOY MANUAL:\n'));
    commands.forEach((cmd, i) => {
      console.log(`${chalk.cyan(`${i+1}.`)} ${chalk.yellow(cmd)}`);
    }

    console.log(chalk.cyan('\n📋 OU USE DOCKER COMPOSE NO SERVIDOR:\n'));
    console.log(chalk.yellow(`scp -r . ubuntu@<ip>:/opt/consortho`));
    console.log(chalk.yellow(`ssh ubuntu@<ip> "cd /opt/consortho && docker compose up -d"`));

    console.log(chalk.green('\n✅ Deploy preparado! Execute os comandos acima no seu servidor Oracle.'));
  }

  deployStatus() {
    console.log(chalk.yellow('Status de deploy não implementado ainda'));
  }

  async monitor(interval) {
    console.log(chalk.cyan('\n👁️  MONITOR CONSORTHO - Tempo Real\n'));
    console.log(chalk.gray('─'.repeat(80)));
    console.log(chalk.yellow('Pressione Ctrl+C para sair\n'));

    let lastData = null;
    const render = (data) => {
      process.stdout.write('\x1B[2J\x1B[0f'); // Clear screen
      console.log(chalk.cyan('\n💎 CONSORTHO MONITOR - TEMPO REAL\n'));
      console.log(chalk.gray('─'.repeat(80)));
      console.log(`${chalk.cyan('Ciclo:')} ${chalk.yellow(data.ciclos?.toLocaleString() || 'N/A')}`);
      console.log(`${chalk.cyan('Uptime:')} ${chalk.yellow(data.tempoDesdeInicio || 'N/A')}`);
      console.log(`${chalk.cyan('Players:')} ${chalk.yellow(data.playersOnline)}`);
      console.log(chalk.gray('─'.repeat(80)));
      console.log(`${chalk.cyan('🪵 Madeira:')} ${chalk.green(data.recursos?.madeira?.toLocaleString() || 0)}`);
      console.log(`${chalk.cyan('🪨 Pedra:')} ${chalk.gray(data.recursos?.pedra?.toLocaleString() || 0)}`);
      console.log(`${chalk.cyan('💎 Cristal:')} ${chalk.cyan(data.recursos?.cristal?.toLocaleString() || 0)}`);
      console.log(chalk.gray('─'.repeat(80)));
      console.log(`${chalk.cyan('Construções:')} ${chalk.yellow(data.construcoes || 0)}`);
      console.log(`${chalk.cyan('Elementos:')} ${chalk.yellow(data.elementos || 0)}`);
      console.log(chalk.gray('─'.repeat(80)));
      console.log(`${chalk.cyan('Última Gang:')} ${chalk.gray(data.ultimaMensagemGang?.texto || 'N/A')}`);
      console.log(chalk.gray('─'.repeat(80)));
      console.log(`${chalk.gray('Atualizado:')} ${new Date().toLocaleTimeString()}`);
      console.log(chalk.gray('Pressione Ctrl+C para sair'));
    };

    let running = true;
    const update = async () => {
      try {
        const data = await this.apiRequest('/api/resumo');
        render(data);
      } catch (e) {
        console.log(chalk.red('\n❌ Erro de conexão. Tentando reconectar...'));
      }
    };

    await update();
    const intervalId = setInterval(update, interval);

    process.on('SIGINT', () => {
      clearInterval(intervalId);
      console.log(chalk.cyan('\n\n👋 Monitor encerrado'));
      process.exit(0);
    });
  }

  async init(options) {
    console.log(chalk.cyan('\n💎 CONSORTHO INIT\n'));
    console.log(chalk.gray('─'.repeat(50)));

    if (fs.existsSync(CONFIG_FILE) && !options.force) {
      console.log(chalk.yellow('Configuração já existe. Use --force para reinicializar.'));
      return;
    }

    const answers = await inquirer.prompt([
      { type: 'input', name: 'apiBase', message: 'URL base da API:', default: 'http://127.0.0.1:9877' },
      { type: 'input', name: 'oracleCloud.ip', message: 'IP do Oracle Cloud (opcional):' },
      { type: 'input', name: 'oracleCloud.user', message: 'Usuário SSH (padrão: ubuntu):', default: 'ubuntu' },
      { type: 'password', name: 'oracleCloud.keyPath', message: 'Caminho da chave SSH (opcional):' }
    ]);

    this.config = { apiBase: answers.apiBase, oracleCloud: {} };
    if (answers['oracleCloud.ip']) this.config.oracleCloud.ip = answers['oracleCloud.ip'];
    if (answers['oracleCloud.user']) this.config.oracleCloud.user = answers['oracleCloud.user'];
    if (answers['oracleCloud.keyPath']) this.config.oracleCloud.keyPath = answers['oracleCloud.keyPath'];

    this.saveConfig();
    console.log(chalk.green('\n✅ Consortho inicializado com sucesso!'));
    console.log(chalk.gray(`Config salvo em: ${CONFIG_FILE}\n`));
  }

  async doctor() {
    console.log(chalk.cyan('\n🩺 CONSORTHO DOCTOR\n'));
    console.log(chalk.gray('─'.repeat(50)));

    const checks = [
      { name: 'Node.js', check: async () => { const v = process.version; return { ok: true, msg: v }; } },
      { name: 'Docker', check: async () => { try { await this.runCommand('docker --version'); return { ok: true, msg: 'Instalado' }; } catch { return { ok: false, msg: 'Não instalado' }; } },
      { name: 'Docker Compose', check: async () => { try { await this.runCommand('docker compose version'); return { ok: true, msg: 'Instalado' }; } catch { return { ok: false, msg: 'Não instalado' }; } },
      { name: 'Servidor Consortho', check: async () => { try { await this.apiRequest('/api/resumo'); return { ok: true, msg: 'Rodando' }; } catch { return { ok: false, msg: 'Não rodando' }; } },
      { name: 'Diamond Protocol', check: async () => { try { const data = await this.apiRequest('/api/diamond/status'); return { ok: data.initialized, msg: data.initialized ? '9 Layers ativas' : 'Não inicializado' }; } catch { return { ok: false, msg: 'Erro' }; } },
      { name: 'Config', check: async () => { return { ok: fs.existsSync(CONFIG_FILE), msg: fs.existsSync(CONFIG_FILE) ? 'Configurado' : 'Não configurado' }; } },
      { name: 'Backup Dir', check: async () => { const dir = path.join(CONFIG_DIR, 'backups'); return { ok: fs.existsSync(dir), msg: fs.existsSync(dir) ? 'Existe' : 'Não existe' }; } },
    ];

    console.log(chalk.cyan('\n🔍 VERIFICAÇÕES DE SAÚDE\n'));
    console.log(chalk.gray('─'.repeat(60)));

    for (const check of checks) {
      const spinner = ora(`Verificando ${check.name}...`).start();
      try {
        const result = await check.check();
        if (result.ok) {
          spinner.succeed(`${check.name}: ${chalk.green(result.msg)}`);
        } else {
          spinner.fail(`${check.name}: ${chalk.red(result.msg)}`);
        }
      } catch (e) {
        spinner.fail(`${check.name}: ${chalk.red('Erro')}`);
      }
    }

    console.log(chalk.gray('\n─'.repeat(50)));
    console.log(chalk.cyan('\n✅ Doctor concluído!\n'));
  }

  runCommand(cmd, options = {}) {
    return new Promise((resolve, reject) => {
      const [command, ...args] = cmd.split(' ');
      const child = spawn(command, args, { ...options, shell: true, stdio: 'pipe' });
      let stdout = '', stderr = '';
      child.stdout.on('data', d => stdout += d.toString());
      child.stderr.on('data', d => stderr += d.toString());
      child.on('close', code => code === 0 ? resolve(stdout) : reject(new Error(stderr || `Exit code ${code}`)));
    });
  }

  run() {
    if (!process.argv.slice(2).length) {
      program.outputHelp();
      console.log('');
    }
  }
}

// Run CLI
const cli = new ConsorthoCLI();
cli.run();

module.exports = ConsorthoCLI;