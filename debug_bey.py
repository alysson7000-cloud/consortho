with open(r'C:/Users/Alyssin/estudio_criacao/consortho/src/bey-launcher-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add try-catch wrapper to checkRequirements function to catch the exact error
old = '''  checkRequirements(playerId, requirements) {
    const player = this.getPlayerData(playerId);
    const lumin = this.server.state?.luminState;
    const missing = [];
    let met = true;'''

new = '''  checkRequirements(playerId, requirements) {
    try {
      const player = this.getPlayerData(playerId);
      const lumin = this.server.state?.luminState;
      const missing = [];
      let met = true;'''

content = content.replace(old, new)

# Find the return statement and wrap the rest in try-catch
old_return = '''    return { met, missing };
  }'''

new_return = '''    return { met, missing };
    } catch (e) {
      console.error('❌ ERRO EM checkRequirements:', e.message, e.stack);
      throw new Error(`Erro nos requisitos: ${e.message}`);
    }
  }'''

content = content.replace(old_return, new_return)

with open(r'C:/Users/Alyssin/estudio_criacao/consortho/src/bey-launcher-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed - added try-catch to checkRequirements!')