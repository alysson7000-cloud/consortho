with open(r'C:/Users/Alyssin/estudio_criacao/consortho/src/bey-launcher-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add detailed logging throughout prepareLaunch to find the exact error location
old = '''  async prepareLaunch(playerId, beyType, launchPadId, options = {}) {
    try {
      // Validate player
      const player = this.getPlayerData(playerId);
      if (!player) throw new Error('Jogador não encontrado');
      
      // Validate launch pad
      const launchPad = this.launchPads.get(launchPadId);
      if (!launchPad) throw new Error('Plataforma de lançamento não encontrada');
      if (launchPad.status !== 'ready') throw new Error(`Plataforma não está pronta: ${launchPad.status}`);
      
      // Validate bey type
      const beyTypeData = this.beyTypes[beyType];
      if (!beyTypeData) throw new Error('Tipo de BEY inválido');
      
      // Check cooldown
      if (this.isOnCooldown(playerId, beyType)) {
        const remaining = this.getCooldown(playerId, beyType);
        throw new Error(`BEY em cooldown: ${Math.ceil(remaining / 1000)}s restantes`);
      }
      
      // Check fuel
      if (!this.canAffordFuel(playerId, beyType)) {
        const cost = this.calculateFuelCost(beyType, playerId);
        throw new Error(`Combustível insuficiente. Necessário: ${JSON.stringify(cost)}`);
      }
      
      // Check requirements
      let reqCheck;
      try {
        reqCheck = this.checkRequirements(playerId, beyTypeData.requirements);
      } catch (e) {
        console.error('❌ ERRO EM checkRequirements:', e.message, e.stack);
        throw new Error(`Erro ao verificar requisitos: ${e.message}`);
      }
      if (!reqCheck || !reqCheck.met) {
        const missing = Array.isArray(reqCheck?.missing) ? reqCheck.missing.join(', ') : 'desconhecido';
        throw new Error(`Requisitos não atendidos: ${missing}`);
      }
      
      // Check launch pad level
      const maxBeyLevel = this.getBeyLevel(beyType);
      if (launchPad.level < maxBeyLevel) {
        throw new Error(`Plataforma nível ${launchPad.level} não suporta BEY nível ${maxBeyLevel}`);
      }
      
      // Calculate trajectory
      const trajectory = this.calculateTrajectory(beyType, playerId, options.target);
      
      // Create launch
      const launchId = `launch_${beyType}_${playerId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const launch = {
        id: launchId,
        playerId,
        playerName: player.name,
        beyType,
        beyTypeData,
        launchPadId,
        trajectory,
        status: 'preparing', // preparing, charging, launching, in_flight, completed, failed, aborted
        fuelCost: this.calculateFuelCost(beyType, playerId),
        fuelConsumed: {},
        progress: 0,
        currentStep: 0,
        totalSteps: trajectory.totalSteps,
        startTime: Date.now(),
        estimatedCompletion: Date.now() + trajectory.estimatedDuration,
        actualCompletion: null,
        result: null,
        narrative: '',
        rewards: [],
        anomalies: [],
        miracles: [],
        options
      };
      
      // Reserve launch pad
      launchPad.status = 'charging';
      launchPad.currentBey = launchId;
      
      // Consume fuel
      this.consumeFuel(playerId, beyType);
      launch.fuelConsumed = { ...launch.fuelCost };
      
      // Set cooldown
      this.setCooldown(playerId, beyType);
      
      // Store active launch
      this.activeLaunches.set(launchId, launch);
      
      // Start launch sequence
      this.startLaunchSequence(launchId);
      
      this.emit('bey:prepared', { launchId, launch });
      console.log(`🚀 BEY PREPARADO: ${beyTypeData.name} por ${player.name} na ${launchPad.name}`);
      
      return launch;
    } catch (e) {
      console.error('❌ ERRO EM prepareLaunch:', e.message, e.stack);
      throw e;
    }
  }'''

new = '''  async prepareLaunch(playerId, beyType, launchPadId, options = {}) {
    console.log(`🔍 prepareLaunch chamado: playerId=${playerId}, beyType=${beyType}, launchPadId=${launchPadId}`);
    try {
      // Validate player
      console.log('🔍 Validando player...');
      const player = this.getPlayerData(playerId);
      if (!player) throw new Error('Jogador não encontrado');
      console.log('✅ Player validado:', player.name);
      
      // Validate launch pad
      console.log('🔍 Validando launch pad...');
      const launchPad = this.launchPads.get(launchPadId);
      if (!launchPad) throw new Error('Plataforma de lançamento não encontrada');
      if (launchPad.status !== 'ready') throw new Error(`Plataforma não está pronta: ${launchPad.status}`);
      console.log('✅ Launch pad validado:', launchPad.name);
      
      // Validate bey type
      console.log('🔍 Validando bey type...');
      const beyTypeData = this.beyTypes[beyType];
      if (!beyTypeData) throw new Error('Tipo de BEY inválido');
      console.log('✅ Bey type validado:', beyTypeData.name);
      
      // Check cooldown
      console.log('🔍 Verificando cooldown...');
      if (this.isOnCooldown(playerId, beyType)) {
        const remaining = this.getCooldown(playerId, beyType);
        throw new Error(`BEY em cooldown: ${Math.ceil(remaining / 1000)}s restantes`);
      }
      console.log('✅ Cooldown OK');
      
      // Check fuel
      console.log('🔍 Verificando combustível...');
      if (!this.canAffordFuel(playerId, beyType)) {
        const cost = this.calculateFuelCost(beyType, playerId);
        throw new Error(`Combustível insuficiente. Necessário: ${JSON.stringify(cost)}`);
      }
      console.log('✅ Combustível OK');
      
      // Check requirements
      console.log('🔍 Verificando requisitos...');
      let reqCheck;
      try {
        reqCheck = this.checkRequirements(playerId, beyTypeData.requirements);
        console.log('✅ Requisitos verificados:', reqCheck);
      } catch (e) {
        console.error('❌ ERRO EM checkRequirements:', e.message, e.stack);
        throw new Error(`Erro ao verificar requisitos: ${e.message}`);
      }
      if (!reqCheck || !reqCheck.met) {
        const missing = Array.isArray(reqCheck?.missing) ? reqCheck.missing.join(', ') : 'desconhecido';
        throw new Error(`Requisitos não atendidos: ${missing}`);
      }
      console.log('✅ Requisitos OK');
      
      // Check launch pad level
      console.log('🔍 Verificando nível da plataforma...');
      const maxBeyLevel = this.getBeyLevel(beyType);
      if (launchPad.level < maxBeyLevel) {
        throw new Error(`Plataforma nível ${launchPad.level} não suporta BEY nível ${maxBeyLevel}`);
      }
      console.log('✅ Nível da plataforma OK');
      
      // Calculate trajectory
      console.log('🔍 Calculando trajetória...');
      const trajectory = this.calculateTrajectory(beyType, playerId, options.target);
      console.log('✅ Trajetória calculada:', trajectory);
      
      // Create launch
      console.log('🔍 Criando objeto launch...');
      const launchId = `launch_${beyType}_${playerId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const launch = {
        id: launchId,
        playerId,
        playerName: player.name,
        beyType,
        beyTypeData,
        launchPadId,
        trajectory,
        status: 'preparing', // preparing, charging, launching, in_flight, completed, failed, aborted
        fuelCost: this.calculateFuelCost(beyType, playerId),
        fuelConsumed: {},
        progress: 0,
        currentStep: 0,
        totalSteps: trajectory.totalSteps,
        startTime: Date.now(),
        estimatedCompletion: Date.now() + trajectory.estimatedDuration,
        actualCompletion: null,
        result: null,
        narrative: '',
        rewards: [],
        anomalies: [],
        miracles: [],
        options
      };
      console.log('✅ Objeto launch criado:', launchId);
      
      // Reserve launch pad
      launchPad.status = 'charging';
      launchPad.currentBey = launchId;
      console.log('✅ Launch pad reservado');
      
      // Consume fuel
      this.consumeFuel(playerId, beyType);
      launch.fuelConsumed = { ...launch.fuelCost };
      console.log('✅ Combustível consumido');
      
      // Set cooldown
      this.setCooldown(playerId, beyType);
      console.log('✅ Cooldown definido');
      
      // Store active launch
      this.activeLaunches.set(launchId, launch);
      console.log('✅ Launch armazenado');
      
      // Start launch sequence
      this.startLaunchSequence(launchId);
      console.log('✅ Sequência de lançamento iniciada');
      
      this.emit('bey:prepared', { launchId, launch });
      console.log(`🚀 BEY PREPARADO: ${beyTypeData.name} por ${player.name} na ${launchPad.name}`);
      
      return launch;
    } catch (e) {
      console.error('❌ ERRO EM prepareLaunch:', e.message, e.stack);
      throw e;
    }
  }'''

content = content.replace(old, new)

with open(r'C:/Users/Alyssin/estudio_criacao/consortho/src/bey-launcher-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed - added detailed logging throughout prepareLaunch!')