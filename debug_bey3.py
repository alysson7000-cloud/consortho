with open(r'C:/Users/Alyssin/estudio_criacao/consortho/src/bey-launcher-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add detailed logging around the checkRequirements call
old = '''    // Check requirements
      const reqCheck = this.checkRequirements(playerId, beyTypeData.requirements);
      if (!reqCheck.met) throw new Error(`Requisitos não atendidos: ${reqCheck.missing.join(', ')}`);'''

new = '''    // Check requirements
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
      }'''

content = content.replace(old, new)

with open(r'C:/Users/Alyssin/estudio_criacao/consortho/src/bey-launcher-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed - added detailed error handling!')