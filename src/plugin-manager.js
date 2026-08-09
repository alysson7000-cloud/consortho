/**
 * 💎 CONSORTHO PLUGIN SYSTEM - SISTEMA DE PLUGINS/EXTENSÕES
 * Arquitetura de plugins para estender o Consortho dinamicamente
 */

const fs = require('fs-extra');
const path = require('path');
const EventEmitter = require('events');

class PluginManager extends EventEmitter {
  constructor(server) {
    super();
    this.server = server;
    this.plugins = new Map();
    this.hooks = new Map();
    this.pluginsDir = path.join(__dirname, '..', 'plugins');
    this.loadedPlugins = new Map();
    this.pluginStates = new Map();
    
    // Built-in hooks
    this.registerCoreHooks();
  }

  registerCoreHooks() {
    // Core lifecycle hooks
    const coreHooks = [
      'server:start',
      'server:stop',
      'server:restart',
      'tick:start',
      'tick:end',
      'cycle:complete',
      'player:join',
      'player:leave',
      'player:move',
      'player:chat',
      'player:build',
      'resource:change',
      'construction:create',
      'construction:destroy',
      'entity:spawn',
      'entity:despawn',
      'entity:interact',
      'lumin:evolve',
      'lumin:sandevistan',
      'lumin:fusion',
      'lumin:fusion:omega',
      'diamond:tick',
      'diamond:evolution',
      'diamond:sync',
      'diamond:layer:update',
      'resource:generate',
      'resource:consume',
      'chat:message',
      'chat:whisper',
      'command:execute',
      'backup:create',
      'backup:restore',
      'deploy:start',
      'deploy:complete',
      'error:caught',
      'config:change',
      'plugin:load',
      'plugin:unload',
      'plugin:error'
    ];

    coreHooks.forEach(hook => this.hooks.set(hook, []));
  }

  // ===== PLUGIN LIFECYCLE =====
  
  async loadPlugin(pluginPath) {
    try {
      const resolvedPath = path.resolve(pluginPath);
      const pluginModule = require(resolvedPath);
      
      const plugin = this.validatePlugin(pluginModule, resolvedPath);
      
      if (this.plugins.has(plugin.name)) {
        throw new Error(`Plugin "${plugin.name}" já carregado`);
      }

      // Initialize plugin
      const pluginInstance = {
        ...plugin,
        path: resolvedPath,
        enabled: true,
        loadedAt: Date.now(),
        hooks: new Map(),
        config: plugin.config || {},
        state: {}
      };

      // Register hooks
      if (plugin.hooks) {
        Object.entries(plugin.hooks).forEach(([hookName, handler]) => {
          if (this.hooks.has(hookName)) {
            this.hooks.get(hookName).push({ plugin: plugin.name, handler });
            pluginInstance.hooks.set(hookName, handler);
          } else {
            console.warn(`⚠️ Hook desconhecido: ${hookName} no plugin ${plugin.name}`);
          }
        });
      }

      // Call onLoad
      if (typeof plugin.onLoad === 'function') {
        await plugin.onLoad(this.server, this);
      }

      this.plugins.set(plugin.name, pluginInstance);
      this.pluginStates.set(plugin.name, { enabled: true, loadTime: Date.now(), errors: 0 });
      
      this.emit('plugin:load', { plugin: plugin.name, path: plugin.path });
      console.log(`🔌 Plugin carregado: ${plugin.name} v${plugin.version}`);
      
      return pluginInstance;
    } catch (error) {
      console.error(`❌ Erro ao carregar plugin ${pluginPath}:`, error.message);
      throw error;
    }
  }

  async unloadPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin "${pluginName}" não encontrado`);
    }

    // Call onUnload
    if (typeof plugin.onUnload === 'function') {
      await plugin.onUnload(this.server, this);
    }

    // Remove hooks
    plugin.hooks.forEach((handler, hookName) => {
      if (this.hooks.has(hookName)) {
        const hooks = this.hooks.get(hookName);
        const index = hooks.findIndex(h => h.plugin === plugin.name);
        if (index !== -1) hooks.splice(index, 1);
      }
    });

    // Call onUnload hook
    await this.callHook('plugin:unload', { plugin: plugin.name });

    this.plugins.delete(pluginName);
    this.pluginStates.delete(plugin.name);
    
    console.log(`🔌 Plugin descarregado: ${pluginName}`);
  }

  async reloadPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) throw new Error(`Plugin "${pluginName}" não encontrado`);
    
    const pluginPath = plugin.path;
    await this.unloadPlugin(pluginName);
    await this.loadPlugin(pluginPath);
  }

  enablePlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) throw new Error(`Plugin "${pluginName}" não encontrado`);
    plugin.enabled = true;
    this.pluginStates.get(pluginName).enabled = true;
    console.log(`✅ Plugin habilitado: ${pluginName}`);
  }

  disablePlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) throw new Error(`Plugin "${pluginName}" não encontrado`);
    plugin.enabled = false;
    this.pluginStates.get(pluginName).enabled = false;
    console.log(`⏸️ Plugin desabilitado: ${pluginName}`);
  }

  // ===== HOOK SYSTEM =====
  
  registerHook(hookName, handler, pluginName = 'core') {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push({ plugin: pluginName, handler });
    console.log(`🪝 Hook registrado: ${hookName} (${pluginName})`);
  }

  unregisterHook(hookName, pluginName) {
    if (!this.hooks.has(hookName)) return;
    const hooks = this.hooks.get(hookName);
    const index = hooks.findIndex(h => h.plugin === pluginName);
    if (index !== -1) hooks.splice(index, 1);
  }

  async callHook(hookName, data = {}) {
    if (!this.hooks.has(hookName)) return [];
    
    const hooks = this.hooks.get(hookName);
    const results = [];
    
    for (const { plugin, handler } of hooks) {
      const pluginInstance = this.plugins.get(plugin);
      if (!pluginInstance || !pluginInstance.enabled) continue;
      
      try {
        const startTime = Date.now();
        const result = await handler(data, this.server, this);
        const duration = Date.now() - startTime;
        
        results.push({ plugin: hookName, result, duration });
        
        if (duration > 100) {
          console.warn(`⚠️ Hook lento: ${hookName} (${plugin}) - ${duration}ms`);
        }
      } catch (error) {
        console.error(`❌ Erro no hook ${hookName} (${plugin}):`, error.message);
        const pluginState = this.pluginStates.get(plugin);
        if (pluginState) pluginState.errors++;
        this.emit('plugin:error', { plugin: hookName, error, hook: hookName });
      }
    }
    
    return results;
  }

  // ===== PLUGIN VALIDATION =====
  
  validatePlugin(pluginModule, pluginPath) {
    const plugin = pluginModule.default || pluginModule;
    
    // Required fields
    if (!plugin.name || typeof plugin.name !== 'string') {
      throw new Error('Plugin deve ter "name" (string)');
    }
    if (!plugin.version || typeof plugin.version !== 'string') {
      throw new Error('Plugin deve ter "version" (string)');
    }
    
    // Optional fields with defaults
    const validated = {
      name: plugin.name,
      version: plugin.version,
      description: plugin.description || '',
      author: plugin.author || 'Unknown',
      license: plugin.license || 'MIT',
      keywords: plugin.keywords || [],
      dependencies: plugin.dependencies || [],
      peerDependencies: plugin.peerDependencies || [],
      config: plugin.config || {},
      configSchema: plugin.configSchema || {},
      hooks: plugin.hooks || {},
      onLoad: plugin.onLoad,
      onUnload: plugin.onUnload,
      onEnable: plugin.onEnable,
      onDisable: plugin.onDisable,
      commands: plugin.commands || [],
      api: plugin.api,
      path: pluginPath
    };
    
    // Validate dependencies
    if (validated.dependencies.length > 0) {
      validated.dependencies.forEach(dep => {
        if (!this.plugins.has(dep)) {
          console.warn(`⚠️ Dependência não carregada: ${dep} (requerida por ${validated.name})`);
        }
      });
    }
    
    return validated;
  }

  // ===== PLUGIN MANAGEMENT =====
  
  async loadPluginsFromDirectory(pluginsDir = this.pluginsDir) {
    if (!fs.existsSync(pluginsDir)) {
      fs.ensureDirSync(pluginsDir);
      console.log(`📁 Diretório de plugins criado: ${pluginsDir}`);
      return [];
    }
    
    const files = fs.readdirSync(pluginsDir)
      .filter(f => f.endsWith('.js') || f.endsWith('.json'))
      .filter(f => !f.startsWith('.') && !f.startsWith('_'));
    
    const loaded = [];
    for (const file of files) {
      try {
        await this.loadPlugin(path.join(pluginsDir, file));
        loaded.push(file);
      } catch (error) {
        console.error(`❌ Falha ao carregar ${file}:`, error.message);
      }
    }
    
    console.log(`🔌 ${loaded.length} plugins carregados de ${pluginsDir}`);
    return loaded;
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values()).map(p => ({
      name: p.name,
      version: p.version,
      description: p.description,
      author: p.author,
      enabled: p.enabled,
      loadedAt: p.loadedAt,
      hooks: Array.from(p.hooks.keys()),
      commands: p.commands?.map(c => c.name) || [],
      state: this.pluginStates.get(p.name)
    }));
  }

  getPluginState(name) {
    return this.pluginStates.get(name);
  }

  // ===== CONFIG MANAGEMENT =====
  
  setPluginConfig(pluginName, config) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) throw new Error(`Plugin "${pluginName}" não encontrado`);
    
    plugin.config = { ...plugin.config, ...config };
    console.log(`⚙️ Config atualizada para ${pluginName}`);
  }

  getPluginConfig(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) throw new Error(`Plugin "${pluginName}" não encontrado`);
    return plugin.config;
  }

  // ===== COMMAND REGISTRATION =====
  
  registerCommand(pluginName, command) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) throw new Error(`Plugin "${pluginName}" não encontrado`);
    
    const validated = {
      name: command.name,
      description: command.description || '',
      aliases: command.aliases || [],
      args: command.args || [],
      options: command.options || [],
      handler: command.handler,
      adminOnly: command.adminOnly || false,
      cooldown: command.cooldown || 0
    };
    
    if (!plugin.commands) plugin.commands = [];
    plugin.commands.push(validated);
    console.log(`📝 Comando registrado: ${command.name} (${pluginName})`);
  }

  getAllCommands() {
    const commands = [];
    this.plugins.forEach(plugin => {
      if (plugin.commands) {
        plugin.commands.forEach(cmd => {
          commands.push({ ...cmd, plugin: plugin.name });
        });
      }
    });
    return commands;
  }

  // ===== API EXPOSURE =====
  
  getAPI(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) return null;
    
    return {
      server: this.server,
      pluginManager: this,
      pluginName,
      config: plugin.config,
      state: plugin.state,
      hooks: {
        on: (hook, handler) => this.registerHook(hook, handler, pluginName),
        off: (hook) => this.unregisterHook(hook, pluginName),
        emit: (hook, data) => this.callHook(hook, data)
      },
      storage: {
        get: (key) => plugin.state[key],
        set: (key, value) => { plugin.state[key] = value; },
        getAll: () => plugin.state,
        clear: () => { plugin.state = {}; }
      },
      config: {
        get: (key) => plugin.config[key],
        set: (key, value) => { plugin.config[key] = value; },
        getAll: () => plugin.config
      },
      log: (level, message) => console.log(`[${plugin.name}] ${message}`),
      emit: (event, data) => this.emit(event, { plugin: pluginName, ...data })
    };
  }

  // ===== PLUGIN TEMPLATES =====
  
      static getPluginTemplate() {
    return `/*
 * 💎 PLUGIN TEMPLATE - Consortho Plugin
 * @module my-plugin
 * @version 1.0.0
 */

module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'Descrição do plugin',
  author: 'Seu Nome',
  license: 'MIT',
  keywords: ['consortho', 'plugin'],
  
  config: {
    enabled: true,
    debug: false
  },
  
  configSchema: {
    enabled: { type: 'boolean', default: true },
    debug: { type: 'boolean', default: false }
  },
  
  dependencies: [],
  
  async onLoad(server, pluginManager) {
    console.log('🔌 Plugin carregado:', this.name);
  },
  
  async onUnload(server, pluginManager) {
    console.log('🔌 Plugin descarregado:', this.name);
  },
  
  hooks: {
    'server:start': async (data, server, pluginManager) => {
      console.log('🚀 Servidor iniciado!');
    },
    'tick:end': async (data, server, pluginManager) => {},
    'player:chat': async (data, server, pluginManager) => {
      const { player, message } = data;
    },
    'lumin:evolve': async (data, server, pluginManager) => {
      console.log('⚡ Lumin evoluiu!');
    },
    'diamond:evolution': async (data, server, pluginManager) => {}
  },
  
  commands: [{
    name: 'meu-comando',
    description: 'Descrição do comando',
    aliases: ['mc', 'meucmd'],
    args: [
      { name: 'arg1', type: 'string', required: true, description: 'Primeiro argumento' },
      { name: 'arg2', type: 'number', required: false, description: 'Segundo argumento (opcional)' }
    ],
    options: [
      { name: 'verbose', alias: 'v', type: 'boolean', description: 'Modo verboso' }
    ],
    handler: async (args, options, context) => {
      return { success: true, message: 'Comando executado!' };
    },
    adminOnly: false,
    cooldown: 5000
  }],
  
  api: {
    meuMetodo: async (param) => {
      return { success: true };
    }
  },
  
  config: {
    enabled: true,
    debug: false,
    interval: 5000
  },
  
  configSchema: {
    enabled: { type: 'boolean', default: true },
    debug: { type: 'boolean', default: false },
    interval: { type: 'number', default: 5000, min: 1000 }
  }
};`;
  }

}
module.exports = PluginManager;