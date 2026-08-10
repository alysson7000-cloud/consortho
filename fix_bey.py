with open(r'C:/Users/Alyssin/estudio_criacao/consortho/src/bey-launcher-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix checkRequirements to handle non-array guildRank
old = '''    if (requirements.guildRank) {
      const guildInfo = this.guildHarmony?.getPlayerGuildInfo(playerId);
      if (!guildInfo || !requirements.guildRank.includes(guildInfo.rank)) {
        missing.push(`Rank de guilda: ${requirements.guildRank.join(' ou ')}`);
        met = false;
      }
    }'''

new = '''    if (requirements.guildRank) {
      const guildInfo = this.guildHarmony?.getPlayerGuildInfo(playerId);
      const guildRanks = Array.isArray(requirements.guildRank) ? requirements.guildRank : [requirements.guildRank];
      if (!guildInfo || !guildRanks.includes(guildInfo.rank)) {
        missing.push(`Rank de guilda: ${guildRanks.join(' ou ')}`);
        met = false;
      }
    }'''

content = content.replace(old, new)

with open(r'C:/Users/Alyssin/estudio_criacao/consortho/src/bey-launcher-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed!')