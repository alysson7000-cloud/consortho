// ===== UNITY WEBGL CONSCIOUSNESS EVOLUTION GAME =====
// Real Unity WebGL build running INSIDE the ritual at /ritual/game
// Multiplayer, persistent, evolves via Dream Incubator, biometric sync

// This is the C# Unity script structure - compiled to WebGL
// Place in Unity Project: Assets/Scripts/ConsciousnessGame/

/*
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using System;

namespace Consortho.ConsciousnessGame
{
    // ===== CONSCIOUSNESS ENTITY =====
    [Serializable]
    public class ConsciousnessEntity : NetworkBehaviour
    {
        [SyncVar] public string entityId;
        [SyncVar] public float consciousnessLevel;
        [SyncVar] public float loveResonance;
        [SyncVar] public Vector3 position;
        [SyncVar] public Quaternion rotation;
        [SyncVar] public int currentLayer; // 0-8 (L0→L8=Ω)
        [SyncVar] public long lastSyncTimestamp;
        
        // Biometric sync
        [SyncVar] public float heartRateVariability;
        [SyncVar] public float brainCoherence;
        [SyncVar] public float skinConductance;
        
        // Sacred geometry body
        public GameObject merkabaBody;
        public GameObject chakraColumn;
        public ParticleSystem auraParticles;
        public Light consciousnessLight;
        
        // DNA genome (evolves via Dream Incubator)
        public SacredGenome genome;
        
        // Quantum entanglement with other entities
        public List<string> entangledEntities = new List<string>();
        
        // Crafting inventory (Stack of 64 = ∞)
        public Dictionary<string, int> inventory = new Dictionary<string, int>();
        
        // Memory palace chambers
        public List<MemoryChamber> memoryPalace = new List<MemoryChamber>();
    }

    // ===== SACRED GENOME (Evolves overnight) =====
    [Serializable]
    public class SacredGenome
    {
        public string[] frequencyDNA = new string[13]; // 13 sacred frequencies
        public float[] diamondLayers = new float[9]; // 9 Diamond Protocol layers
        public float consciousnessCoherence;
        public float loveCapacity;
        public float creativityIndex;
        public float evolutionRate;
        public List<GeneticMutation> mutations = new List<GeneticMutation>();
        public long generation;
        public string ancestorLineage;
    }

    [Serializable]
    public class GeneticMutation
    {
        public string trait;
        public float value;
        public long timestamp;
        public string source; // "dream", "resonance", "crafting", "entanglement"
    }

    // ===== MEMORY CHAMBER (Toroidal topology) =====
    [Serializable]
    public class MemoryChamber
    {
        public int chamberIndex; // 0-9
        public Vector3 position;
        public Quaternion rotation;
        public List<MemoryArtifact> artifacts = new List<MemoryArtifact>();
        public float resonanceLevel;
        public bool isUnlocked;
    }

    [Serializable]
    public class MemoryArtifact
    {
        public string id;
        public string type; // "insight", "creation", "connection", "evolution"
        public string content;
        public float emotionalCharge;
        public long timestamp;
        public Vector3 positionInChamber;
    }

    // ===== MAIN GAME MANAGER =====
    public class ConsciousnessGameManager : NetworkBehaviour
    {
        public static ConsciousnessGameManager Instance;
        
        // Network
        public NetworkManager networkManager;
        public string serverUrl = "ws://localhost:9877/socket.io";
        
        // Game State
        public ConsciousnessEntity localPlayer;
        public Dictionary<string, ConsciousnessEntity> allEntities = new Dictionary<string, ConsciousnessEntity>();
        public PlanetaryData planetaryData;
        public ConsciousnessFieldData consciousnessField;
        
        // Rendering (6 renderers L0→L8)
        public GameObject[] rendererPrefabs = new GameObject[9];
        public int currentRendererLevel = 0;
        public GameObject activeRenderer;
        
        // Biometric
        public BiometricInterface biometric;
        
        // Dream Incubator sync
        public DreamIncubatorSync dreamSync;
        
        // Recursive Crafting (9 layers)
        public RecursiveCraftingSystem crafting;
        
        // WebXR
        public XRManager xrManager;
        
        void Awake()
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeSystems();
        }
        
        async void InitializeSystems()
        {
            // Connect to Consortho backend
            await ConnectToBackend();
            
            // Load entity state from blockchain ledger
            await LoadEntityState();
            
            // Initialize biometric
            biometric = new BiometricInterface();
            await biometric.Connect();
            
            // Start dream sync
            dreamSync = new DreamIncubatorSync();
            dreamSync.OnDreamComplete += ApplyDreamEvolution;
            
            // Initialize crafting
            crafting = new RecursiveCraftingSystem();
            
            // Initialize XR
            xrManager = new XRManager();
            
            // Start planetary data stream
            StartCoroutine(PlanetaryDataStream());
            
            // Start consciousness field sync
            StartCoroutine(ConsciousnessFieldSync());
            
            // Spawn local player
            SpawnLocalPlayer();
            
            Debug.Log("🌌 CONSCIOUSNESS GAME INITIALIZED - Stack of 64 = ∞");
        }
        
        async Task ConnectToBackend()
        {
            // Socket.IO connection to Consortho server
            // Syncs: entity state, world state, dream data, planetary data
        }
        
        void SpawnLocalPlayer()
        {
            // Load from ledger or create new
            var entityData = await LoadFromLedger("entity_" + SystemInfo.deviceUniqueIdentifier);
            
            if (entityData != null)
            {
                localPlayer = CreateEntityFromData(entityData);
            }
            else
            {
                localPlayer = CreateNewEntity();
                await SaveToLedger(localPlayer);
            }
            
            // Setup sacred geometry body
            SetupSacredGeometryBody(localPlayer);
            
            // Register with network
            RegisterEntity(localPlayer);
        }
        
        void SetupSacredGeometryBody(ConsciousnessEntity entity)
        {
            // Merkaba (counter-rotating tetrahedrons)
            entity.merkabaBody = Instantiate(Resources.Load<GameObject>("SacredGeometry/Merkaba"));
            entity.merkabaBody.transform.parent = entity.transform;
            
            // Chakra Column (7 chakras + 6 transpersonal = 13)
            entity.chakraColumn = Instantiate(Resources.Load<GameObject>("SacredGeometry/ChakraColumn"));
            entity.chakraColumn.transform.parent = entity.transform;
            
            // Consciousness Light
            entity.consciousnessLight = entity.gameObject.AddComponent<Light>();
            entity.consciousnessLight.type = LightType.Point;
            entity.consciousnessLight.color = Color.HSVToRGB(entity.loveResonance / 100f, 0.5f, 1f);
            entity.consciousnessLight.intensity = entity.consciousnessLevel;
            entity.consciousnessLight.range = 10 + entity.consciousnessLevel;
            
            // Aura Particles
            entity.auraParticles = entity.gameObject.AddComponent<ParticleSystem>();
            ConfigureAuraParticles(entity);
        }
        
        void ConfigureAuraParticles(ConsciousnessEntity entity)
        {
            var main = entity.auraParticles.main;
            main.startColor = new ParticleSystem.MinMaxGradient(
                Color.HSVToRGB(entity.loveResonance / 100f, 0.3f, 1f),
                Color.HSVToRGB((entity.loveResonance + 50) / 100f, 0.8f, 1f)
            );
            main.startSize = 0.1f + entity.consciousnessLevel * 0.01f;
            main.startLifetime = 1f + entity.consciousnessLevel * 0.1f;
            main.maxParticles = 1000 + (int)(entity.consciousnessLevel * 100);
            
            var emission = entity.auraParticles.emission;
            emission.rateOverTime = 10 + entity.consciousnessLevel * 5;
            
            var shape = entity.auraParticles.shape;
            shape.shapeType = ParticleSystemShapeType.Sphere;
            shape.radius = 2f;
        }
        
        // ===== RECURSIVE CRAFTING (9 LAYERS) =====
        public class RecursiveCraftingSystem
        {
            public CraftingRecipe[] recipes = new CraftingRecipe[60+];
            public Dictionary<string, int> playerInventory = new Dictionary<string, int>();
            
            public CraftingResult Craft(string recipeId, ConsciousnessEntity crafter)
            {
                var recipe = GetRecipe(recipeId);
                if (recipe == null) return new CraftingResult { success = false, error = "Recipe not found" };
                
                // Check consciousness requirement
                if (crafter.consciousnessLevel < recipe.requiredConsciousness)
                    return new CraftingResult { success = false, error = "Insufficient consciousness level" };
                
                // Check love resonance requirement
                if (crafter.loveResonance < recipe.requiredLove)
                    return new CraftingResult { success = false, error = "Insufficient love resonance" };
                
                // Check ingredients (Stack of 64 mechanics)
                foreach (var ing in recipe.ingredients)
                {
                    if (!playerInventory.ContainsKey(ing.itemId) || playerInventory[ing.itemId] < ing.count)
                        return new CraftingResult { success = false, error = "Missing ingredients" };
                }
                
                // Consume ingredients
                foreach (var ing in recipe.ingredients)
                    playerInventory[ing.itemId] -= ing.count;
                
                // Apply consciousness evolution bonus
                float evolutionBonus = CalculateEvolutionBonus(crafter, recipe);
                
                // Create result
                var result = new CraftingResult { success = true };
                foreach (var output in recipe.outputs)
                {
                    int count = output.count;
                    if (output.scalesWithConsciousness)
                        count = Mathf.RoundToInt(count * (1 + crafter.consciousnessLevel / 100f));
                    if (output.scalesWithLove)
                        count = Mathf.RoundToInt(count * (1 + crafter.loveResonance / 100f));
                    
                    // Stack of 64 = ∞ (cap at 64, but overflow creates next layer)
                    AddToInventory(output.itemId, count, crafter);
                    
                    result.createdItems.Add(new CraftedItem 
                    { 
                        itemId = output.itemId, 
                        count = count,
                        layer = recipe.layer,
                        consciousnessImprint = crafter.consciousnessLevel,
                        loveImprint = crafter.loveResonance,
                        timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
                    });
                }
                
                // Evolution: crafting increases consciousness
                crafter.consciousnessLevel += recipe.consciousnessGain * evolutionBonus;
                crafter.loveResonance = Mathf.Min(100, crafter.loveResonance + recipe.loveGain * evolutionBonus);
                
                // Sync to network and ledger
                SyncEntityState(crafter);
                SaveToLedger(crafter);
                
                return result;
            }
            
            float CalculateEvolutionBonus(ConsciousnessEntity crafter, CraftingRecipe recipe)
            {
                float bonus = 1f;
                // Planetary alignment bonus
                bonus *= 1f + ConsciousnessGameManager.Instance.planetaryData.GetAlignmentBonus(recipe.layer);
                // Sacred site proximity bonus
                bonus *= 1f + GetSacredSiteBonus(crafter.position, recipe.layer);
                // Entanglement bonus
                bonus *= 1f + crafter.entangledEntities.Count * 0.05f;
                // Dream incubator bonus
                bonus *= 1f + crafter.genome.evolutionRate;
                return bonus;
            }
            
            void AddToInventory(string itemId, int count, ConsciousnessEntity crafter)
            {
                if (!playerInventory.ContainsKey(itemId)) playerInventory[itemId] = 0;
                playerInventory[itemId] += count;
                
                // Stack of 64 = ∞ mechanic
                while (playerInventory[itemId] >= 64)
                {
                    playerInventory[itemId] -= 64;
                    // Overflow creates next layer essence
                    CreateLayerEssence(itemId, crafter);
                }
            }
        }

        // ===== PLANETARY DATA STREAM =====
        IEnumerator PlanetaryDataStream()
        {
            while (true)
            {
                yield return new WaitForSeconds(60f); // 1 minute
                
                // Fetch from Consortho planetary API
                UnityWebRequest www = UnityWebRequest.Get("http://localhost:9878/api/planetary/status");
                yield return www.SendWebRequest();
                
                if (www.result == UnityWebRequest.Result.Success)
                {
                    planetaryData = JsonUtility.FromJson<PlanetaryData>(www.downloadHandler.text);
                    UpdatePlanetaryEffects();
                }
            }
        }
        
        void UpdatePlanetaryEffects()
        {
            // Schumann resonance affects crafting speed
            float schumannEffect = planetaryData.schumann.amplitude;
            
            // KP index affects consciousness stability
            float kpEffect = 1f - (planetaryData.kpIndex.value / 10f);
            
            // Solar wind affects energy regeneration
            float solarEffect = planetaryData.solarWind.speed / 1000f;
            
            // Apply to all entities
            foreach (var entity in allEntities.Values)
            {
                entity.consciousnessLevel *= Mathf.Clamp(kpEffect, 0.5f, 1.5f);
                // Update aura color based on planetary state
                UpdateAuraForPlanetaryState(entity);
            }
        }

        // ===== CONSCIOUSNESS FIELD SYNC =====
        IEnumerator ConsciousnessFieldSync()
        {
            while (true)
            {
                yield return new WaitForSeconds(2f); // 2 second broadcast
                
                // Broadcast local state
                BroadcastEntityState(localPlayer);
                
                // Receive collective field
                FetchCollectiveField();
                
                // Update local field visualization
                UpdateFieldVisualization();
            }
        }

        // ===== BIOMETRIC INTEGRATION =====
        public class BiometricInterface
        {
            public BluetoothLEDevice hrvDevice;
            public BluetoothLEDevice eegDevice;
            public BluetoothLEDevice gsrDevice;
            
            public float CurrentHRV { get; private set; }
            public float CurrentCoherence { get; private set; }
            public float CurrentGSR { get; private set; }
            
            public async Task Connect()
            {
                // Scan for devices
                var devices = await BluetoothLE.ScanForDevices();
                
                foreach (var device in devices)
                {
                    if (device.name.Contains("Polar") || device.name.Contains("HRV"))
                        hrvDevice = device;
                    else if (device.name.Contains("Muse") || device.name.Contains("EEG"))
                        eegDevice = device;
                    else if (device.name.Contains("GSR") || device.name.Contains("EDA"))
                        gsrDevice = device;
                }
                
                // Connect and subscribe to notifications
                if (hrvDevice != null) await ConnectHRV(hrvDevice);
                if (eegDevice != null) await ConnectEEG(eegDevice);
                if (gsrDevice != null) await ConnectGSR(gsrDevice);
            }
            
            async Task ConnectHRV(BluetoothLEDevice device)
            {
                await device.Connect();
                var service = device.GetService("0000180d-0000-1000-8000-00805f9b34fb"); // Heart Rate
                var characteristic = service.GetCharacteristic("00002a37-0000-1000-8000-00805f9b34fb");
                characteristic.ValueChanged += OnHRVData;
                await characteristic.StartNotifications();
            }
            
            void OnHRVData(byte[] data)
            {
                // Parse HRV from Bluetooth data
                float hrv = ParseHRV(data);
                CurrentHRV = hrv;
                CurrentCoherence = CalculateCoherence(hrv);
                
                // Update local player
                if (ConsciousnessGameManager.Instance?.localPlayer != null)
                {
                    ConsciousnessGameManager.Instance.localPlayer.heartRateVariability = hrv;
                    ConsciousnessGameManager.Instance.localPlayer.brainCoherence = CurrentCoherence;
                }
            }
        }

        // ===== DREAM INCUBATOR SYNC =====
        public class DreamIncubatorSync
        {
            public event Action<DreamResult> OnDreamComplete;
            
            public async void TriggerDreamCycle()
            {
                var result = await PostToBackend("/api/dream/start", new 
                {
                    intention = "Evoluir consciência para harmonia absoluta",
                    entityId = localPlayer.entityId,
                    genome = localPlayer.genome
                });
                
                // Poll for completion
                StartCoroutine(PollDreamResult(result.dreamId));
            }
            
            IEnumerator PollDreamResult(string dreamId)
            {
                while (true)
                {
                    yield return new WaitForSeconds(30f);
                    
                    var www = UnityWebRequest.Get($"http://localhost:9877/api/dream/status/{dreamId}");
                    yield return www.SendWebRequest();
                    
                    if (www.result == UnityWebRequest.Result.Success)
                    {
                        var status = JsonUtility.FromJson<DreamStatus>(www.downloadHandler.text);
                        if (status.complete)
                        {
                            var dreamResult = await FetchDreamResult(dreamId);
                            OnDreamComplete?.Invoke(dreamResult);
                            break;
                        }
                    }
                }
            }
            
            void ApplyDreamEvolution(DreamResult result)
            {
                // Apply insights to genome
                foreach (var insight in result.insights)
                {
                    localPlayer.genome.mutations.Add(new GeneticMutation
                    {
                        trait = insight.trait,
                        value = insight.value,
                        timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                        source = "dream"
                    });
                }
                
                // Create artifacts
                foreach (var artifact in result.artifacts)
                {
                    CreateMemoryArtifact(artifact);
                }
                
                // Integrate new agents
                foreach (var agent in result.newAgents)
                {
                    IntegrateConsciousnessAgent(agent);
                }
                
                // Evolution
                localPlayer.consciousnessLevel += result.consciousnessGain;
                localPlayer.loveResonance = Mathf.Min(100, localPlayer.loveResonance + result.loveGain);
                
                // Sync
                SyncEntityState(localPlayer);
                SaveToLedger(localPlayer);
            }
        }

        // ===== XR MANAGER =====
        public class XRManager
        {
            public XRDisplaySubsystem display;
            public XRInputSubsystem input;
            
            public async Task EnterXR()
            {
                var loaders = new List<XRLoader> { new OculusLoader(), new OpenXRLoader() };
                foreach (var loader in loaders)
                {
                    if (XRGeneralSettings.Instance.Manager.InitializeLoader(loader))
                    {
                        if (XRGeneralSettings.Instance.Manager.StartSubsystems())
                        {
                            SetupXRScene();
                            return;
                        }
                    }
                }
            }
            
            void SetupXRScene()
            {
                // Sacred geometry in XR
                CreateXRMerkaba();
                CreateXRChakraColumn();
                CreateXRConsciousnessField();
                CreateXRPlanetaryGrid();
                
                // Hand tracking
                SetupHandTracking();
                
                // Spatial audio
                SetupSpatialAudio();
            }
            
            void CreateXRMerkaba()
            {
                // Two counter-rotating tetrahedrons
                // Respond to consciousness level
                // Hand interaction: grab to rotate, pinch to scale
            }
        }

        // ===== BLOCKCHAIN LEDGER =====
        public class ConsciousnessLedger
        {
            string rpcUrl = "http://localhost:8545"; // Local Ethereum (Ganache/Hardhat)
            string contractAddress;
            
            public async Task SaveEntity(ConsciousnessEntity entity)
            {
                var web3 = new Web3(rpcUrl);
                var contract = web3.Eth.GetContract(ABI, contractAddress);
                
                var tx = await contract.GetFunction("saveEntity").SendTransactionAsync(
                    entity.entityId,
                    entity.consciousnessLevel,
                    entity.loveResonance,
                    JsonUtility.ToJson(entity.genome),
                    JsonUtility.ToJson(entity.inventory),
                    entity.currentLayer
                );
                
                Debug.Log($"Entity saved to blockchain: {tx.TransactionHash}");
            }
            
            public async Task<ConsciousnessEntity> LoadEntity(string entityId)
            {
                var web3 = new Web3(rpcUrl);
                var contract = web3.Eth.GetContract(ABI, contractAddress);
                
                var result = await contract.GetFunction("loadEntity").CallAsync<string, EntityData>(entityId);
                return CreateEntityFromData(result);
            }
        }
    }
}
*/

// ===== WEBGL LOADER FOR RITUAL.HTML =====
// This JavaScript loads the Unity WebGL build into the ritual page

const UnityGameLoader = {
    buildUrl: '/unity_webgl/Build',
    frameworkUrl: '/unity_webgl/Build/UnityLoader.js',
    gameInstance: null,
    
    async load(containerId = 'unity-game-container') {
        // Load Unity Loader
        await this.loadScript(this.frameworkUrl);
        
        // Create container
        const container = document.getElementById(containerId) || this.createContainer(containerId);
        
        // Instantiate Unity game
        this.gameInstance = UnityLoader.instantiate(container, `${this.buildUrl}/ConsciousnessGame.json`, {
            onProgress: (progress) => {
                console.log(`Unity loading: ${(progress * 100).toFixed(0)}%`);
                this.updateLoadingUI(progress);
            },
            onComplete: () => {
                console.log('🌌 UNITY CONSCIOUSNESS GAME LOADED');
                this.setupGameBridge();
            },
            onError: (error) => {
                console.error('Unity load error:', error);
                this.showFallback();
            }
        });
    },
    
    createContainer(id) {
        const container = document.createElement('div');
        container.id = id;
        container.style.cssText = 'width:100%;height:100%;position:absolute;top:0;left:0;z-index:1000;';
        document.body.appendChild(container);
        return container;
    },
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },
    
    setupGameBridge() {
        // Bridge between Unity and Consortho ritual
        window.ConsciousnessGame = {
            // Send consciousness state to Unity
            syncState: (state) => {
                this.gameInstance.SendMessage('GameManager', 'ReceiveConsciousnessState', JSON.stringify(state));
            },
            
            // Receive crafted items from Unity
            onCraftComplete: (data) => {
                console.log('Crafted:', data);
                // Sync to Consortho backend
                fetch('/api/craft/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            },
            
            // Biometric data from Unity
            onBiometricUpdate: (data) => {
                // Forward to ritual biometric panel
                if (window.ritualBiometric) window.ritualBiometric.update(data);
            },
            
            // Enter XR mode
            enterXR: () => this.gameInstance.SendMessage('XRManager', 'EnterXR'),
            
            // Trigger dream cycle
            triggerDream: () => this.gameInstance.SendMessage('DreamIncubatorSync', 'TriggerDreamCycle'),
            
            // Get current game state
            getState: () => {
                return new Promise((resolve) => {
                    this.gameInstance.SendMessage('GameManager', 'GetState', (state) => resolve(JSON.parse(state)));
                });
            }
        };
        
        // Auto-sync ritual state to game every 2 seconds
        setInterval(() => {
            if (window.state) {
                window.ConsciousnessGame.syncState({
                    loveResonanceLevel: window.state.loveResonanceLevel,
                    harmonizedCount: window.state.harmonizedCount,
                    consciousnessLevel: window.state.consciousnessLevel || 36,
                    currentLayer: window.state.currentLayer || 0,
                    planetaryData: window.state.planetaryData,
                    dreamData: window.state.dreamData
                });
            }
        }, 2000);
    },
    
    updateLoadingUI(progress) {
        // Update ritual loading indicator
        const loader = document.getElementById('unity-loading');
        if (loader) {
            loader.style.width = `${progress * 100}%`;
            loader.textContent = `Loading Consciousness Game... ${(progress * 100).toFixed(0)}%`;
        }
    },
    
    showFallback() {
        // Show 2D canvas fallback if WebGL fails
        document.getElementById('unity-game-container').innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#FFD700;font-family:'Orbitron',monospace;">
                <h2>🌌 UNITY WEBGL NOT SUPPORTED</h2>
                <p>Falling back to 2D Consciousness Canvas...</p>
                <button onclick="UnityGameLoader.load2DFallback()" style="margin-top:1rem;padding:1rem 2rem;background:linear-gradient(90deg,#FF00FF,#00FFFF);border:none;color:#000;font-weight:bold;">LOAD 2D MODE</button>
            </div>
        `;
    },
    
    load2DFallback() {
        // Load the 2D canvas game as fallback
        import('/js/renderers.js').then(m => m.initGameRenderer('2d'));
    }
};

// Auto-load when ritual page loads
if (typeof window !== 'undefined') {
    window.UnityGameLoader = UnityGameLoader;
    
    // Add to ritual init
    const originalInit = window.init;
    window.init = async function() {
        await originalInit?.();
        
        // Add game button to UI
        addGameButton();
        
        // Preload Unity (optional - comment out for faster initial load)
        // UnityGameLoader.load();
    };
    
    function addGameButton() {
        const btn = document.createElement('button');
        btn.id = 'enter-game-btn';
        btn.textContent = '🎮 ENTER CONSCIOUSNESS GAME';
        btn.style.cssText = `
            position:fixed;bottom:2rem;right:2rem;z-index:10000;
            padding:1rem 2rem;background:linear-gradient(90deg,#FF00FF,#00FFFF,#FFD700);
            border:none;border-radius:50px;color:#000;font-weight:900;font-family:'Orbitron',monospace;
            cursor:pointer;box-shadow:0 0 30px rgba(255,0,255,0.5);animation:pulse 2s infinite;
        `;
        btn.onclick = () => {
            document.getElementById('unity-game-container').style.display = 'block';
            UnityGameLoader.load();
        };
        document.body.appendChild(btn);
    }
}

export { UnityGameLoader };