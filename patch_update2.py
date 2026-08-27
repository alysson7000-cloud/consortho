with open('public/nosso_personagem.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The actual content has SINGLE backslashes followed by 'n' 
old = 'updateWorldCamera();\n  updateCompanion();\n  updateVoidFarm(); // Void Walker Farm - autonomous resource generation\n  updateCastle();\n  updateEnvironment();\n  updateChat();\n  updateDreamIncubator(); // Dream Incubator - autonomous 2-6AM generation\n  // Ultra Generation Systems\n  updateTalentTree();\n  updateRelics();\n  updateCosmicEvents();\n  updateRealityLayers();\n  updateAIDirector();\n  updateConsciousnessPaths();\n  updateLivingWorld();\n  updatePrestige();\n\n  // === PLAYER 1 (Alyssin - WASD + Touch) ==='

new = 'updateWorldCamera();\n  updateCompanion();\n  updateVoidFarm(); // Void Walker Farm - autonomous resource generation\n  updateCastle();\n  updateEnvironment();\n  updateChat();\n  updateDreamIncubator(); // Dream Incubator - autonomous 2-6AM generation\n  // Ultra Generation Systems\n  updateTalentTree();\n  updateRelics();\n  updateCosmicEvents();\n  updateRealityLayers();\n  updateAIDirector();\n  updateConsciousnessPaths();\n  updateLivingWorld();\n  updatePrestige();\n\n  // === MOD SHEPHERD & SOUNDSCAPE & SESSION MEMORY ===\n  if (window.ModShepherd && !window.ModShepherd.isRunning()) {\n    window.ModShepherd.startMods();\n  }\n  if (window.ModShepherd) {\n    window.ModShepherd.renderAll(ctx, w, h, STATE, dt);\n  }\n  if (window.Soundscape) {\n    window.Soundscape.update(STATE, dt);\n  }\n  if (window.SessionMemory) {\n    // Log stack changes periodically\n    if (Math.floor(STATE.save.playTime * 10) % 100 === 0) {\n      window.SessionMemory.logStackChange(STATE.stack, STATE.hrv.value);\n    }\n  }\n\n  // === PLAYER 1 (Alyssin - WASD + Touch) ==='

if old in content:
    content = content.replace(old, new)
    with open('public/nosso_personagem.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: Patched update() function')
else:
    print('NOT FOUND')
    idx = content.find('updateWorldCamera();')
    print('Actual content (first 600 chars):')
    print(repr(content[idx:idx+600]))
