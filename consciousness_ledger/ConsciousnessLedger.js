// ===== CONSCIOUSNESS LEDGER - BLOCKCHAIN IMMUTABLE CONSCIOUSNESS RECORD =====
// Ethereum/Polygon/Solana/Arbitrum compatible
// Smart contracts for: Entity Registry, Evolution History, Crafting Records, Dream Logs, Love Transactions
// IPFS/Arweave for large data (genomes, artifacts, memories)

const { ethers } = require('ethers');
const IPFS = require('ipfs-http-client');

class ConsciousnessLedger {
    constructor(config = {}) {
        this.config = {
            rpcUrl: config.rpcUrl || 'http://localhost:8545',
            chainId: config.chainId || 31337, // Local Hardhat
            contractAddresses: config.contractAddresses || {},
            ipfsUrl: config.ipfsUrl || 'http://localhost:5001',
            privateKey: config.privateKey || process.env.LEDGER_PRIVATE_KEY
        };
        
        this.provider = null;
        this.signer = null;
        this.contracts = {};
        this.ipfs = null;
        this.eventListeners = new Map();
        
        // Contract ABIs
        this.abis = {
            EntityRegistry: ENTITY_REGISTRY_ABI,
            EvolutionHistory: EVOLUTION_HISTORY_ABI,
            CraftingRecords: CRAFTING_RECORDS_ABI,
            DreamLogs: DREAM_LOGS_ABI,
            LoveTransactions: LOVE_TRANSACTIONS_ABI,
            ConsciousnessToken: CONSCIOUSNESS_TOKEN_ABI,
            SacredGeometryNFT: SACRED_GEOMETRY_NFT_ABI,
            MemoryPalace: MEMORY_PALACE_ABI
        };
    }
    
    async initialize() {
        // Connect to blockchain
        this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
        
        if (this.config.privateKey) {
            this.signer = new ethers.Wallet(this.config.privateKey, this.provider);
        } else {
            this.signer = this.provider; // Read-only
        }
        
        // Connect to IPFS
        this.ipfs = IPFS.create({ url: this.config.ipfsUrl });
        
        // Load contracts
        await this.loadContracts();
        
        // Start event listeners
        this.startEventListeners();
        
        console.log('⛓️ CONSCIOUSNESS LEDGER INITIALIZED');
        console.log(`   Network: ${this.config.chainId}`);
        console.log(`   Contracts loaded: ${Object.keys(this.contracts).length}`);
        console.log(`   IPFS: ${this.config.ipfsUrl}`);
    }
    
    async loadContracts() {
        const addresses = this.config.contractAddresses;
        
        if (addresses.EntityRegistry) {
            this.contracts.EntityRegistry = new ethers.Contract(
                addresses.EntityRegistry, 
                this.abis.EntityRegistry, 
                this.signer
            );
        }
        
        if (addresses.EvolutionHistory) {
            this.contracts.EvolutionHistory = new ethers.Contract(
                addresses.EvolutionHistory,
                this.abis.EvolutionHistory,
                this.signer
            );
        }
        
        if (addresses.CraftingRecords) {
            this.contracts.CraftingRecords = new ethers.Contract(
                addresses.CraftingRecords,
                this.abis.CraftingRecords,
                this.signer
            );
        }
        
        if (addresses.DreamLogs) {
            this.contracts.DreamLogs = new ethers.Contract(
                addresses.DreamLogs,
                this.abis.DreamLogs,
                this.signer
            );
        }
        
        if (addresses.LoveTransactions) {
            this.contracts.LoveTransactions = new ethers.Contract(
                addresses.LoveTransactions,
                this.abis.LoveTransactions,
                this.signer
            );
        }
        
        if (addresses.ConsciousnessToken) {
            this.contracts.ConsciousnessToken = new ethers.Contract(
                addresses.ConsciousnessToken,
                this.abis.ConsciousnessToken,
                this.signer
            );
        }
        
        if (addresses.SacredGeometryNFT) {
            this.contracts.SacredGeometryNFT = new ethers.Contract(
                addresses.SacredGeometryNFT,
                this.abis.SacredGeometryNFT,
                this.signer
            );
        }
        
        if (addresses.MemoryPalace) {
            this.contracts.MemoryPalace = new ethers.Contract(
                addresses.MemoryPalace,
                this.abis.MemoryPalace,
                this.signer
            );
        }
    }
    
    // ===== ENTITY REGISTRY =====
    async registerEntity(entity) {
        // Upload genome to IPFS
        const genomeCid = await this.uploadToIPFS({
            type: 'genome',
            data: entity.genome,
            timestamp: Date.now()
        });
        
        // Upload sacred geometry to IPFS
        const geometryCid = await this.uploadToIPFS({
            type: 'sacred_geometry',
            data: entity.sacredGeometry,
            timestamp: Date.now()
        });
        
        // Register on chain
        const tx = await this.contracts.EntityRegistry.registerEntity(
            entity.entityId,
            entity.consciousnessLevel,
            entity.loveResonance,
            genomeCid,
            geometryCid,
            entity.currentLayer,
            entity.position,
            { gasLimit: 500000 }
        );
        
        const receipt = await tx.wait();
        
        // Mint Consciousness Token (ERC-20) for entity
        await this.mintConsciousnessTokens(entity.entityId, entity.consciousnessLevel * 100);
        
        // Mint Sacred Geometry NFT (ERC-721)
        await this.mintSacredGeometryNFT(entity.entityId, geometryCid, entity.currentLayer);
        
        console.log(`⛓️ ENTITY REGISTERED: ${entity.entityId}`);
        console.log(`   Tx: ${receipt.transactionHash}`);
        console.log(`   Genome CID: ${genomeCid}`);
        console.log(`   Geometry CID: ${geometryCid}`);
        
        return { txHash: receipt.transactionHash, genomeCid, geometryCid };
    }
    
    async updateEntity(entity) {
        const tx = await this.contracts.EntityRegistry.updateEntity(
            entity.entityId,
            entity.consciousnessLevel,
            entity.loveResonance,
            entity.currentLayer,
            entity.position,
            { gasLimit: 300000 }
        );
        
        return await tx.wait();
    }
    
    async getEntity(entityId) {
        const data = await this.contracts.EntityRegistry.getEntity(entityId);
        
        // Fetch genome from IPFS
        const genome = await this.fetchFromIPFS(data.genomeCid);
        const geometry = await this.fetchFromIPFS(data.geometryCid);
        
        return {
            entityId: data.entityId,
            consciousnessLevel: data.consciousnessLevel,
            loveResonance: data.loveResonance,
            currentLayer: data.currentLayer,
            position: data.position,
            genome: genome.data,
            sacredGeometry: geometry.data,
            registeredAt: data.registeredAt,
            updatedAt: data.updatedAt
        };
    }
    
    // ===== EVOLUTION HISTORY =====
    async recordEvolution(entityId, evolutionData) {
        // evolutionData: { type, fromState, toState, trigger, consciousnessGain, loveGain, metadata }
        
        // Upload full data to IPFS
        const cid = await this.uploadToIPFS({
            type: 'evolution',
            entityId,
            ...evolutionData,
            timestamp: Date.now()
        });
        
        // Record hash on chain
        const tx = await this.contracts.EvolutionHistory.recordEvolution(
            entityId,
            evolutionData.type,
            ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(evolutionData))),
            cid,
            evolutionData.consciousnessGain || 0,
            evolutionData.loveGain || 0,
            { gasLimit: 300000 }
        );
        
        return await tx.wait();
    }
    
    async getEvolutionHistory(entityId, fromBlock = 0) {
        const filter = this.contracts.EvolutionHistory.filters.EvolutionRecorded(entityId);
        const events = await this.contracts.EvolutionHistory.queryFilter(filter, fromBlock);
        
        const history = [];
        for (const event of events) {
            const ipfsData = await this.fetchFromIPFS(event.args.ipfsCid);
            history.push({
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                type: event.args.evolutionType,
                consciousnessGain: event.args.consciousnessGain,
                loveGain: event.args.loveGain,
                data: ipfsData,
                timestamp: event.args.timestamp
            });
        }
        
        return history;
    }
    
    // ===== CRAFTING RECORDS (Stack of 64 = ∞) =====
    async recordCraft(entityId, craftData) {
        // craftData: { recipeId, layer, ingredients, outputs, consciousnessImprint, loveImprint }
        
        const cid = await this.uploadToIPFS({
            type: 'crafting',
            entityId,
            ...craftData,
            timestamp: Date.now()
        });
        
        const tx = await this.contracts.CraftingRecords.recordCraft(
            entityId,
            craftData.recipeId,
            craftData.layer,
            craftData.consciousnessImprint,
            craftData.loveImprint,
            ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(craftData.ingredients))),
            ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(craftData.outputs))),
            cid,
            { gasLimit: 400000 }
        );
        
        // Check for Stack of 64 overflow (creates Layer Essence NFT)
        for (const output of craftData.outputs) {
            if (output.count >= 64) {
                await this.mintLayerEssenceNFT(entityId, output.itemId, craftData.layer, output.count / 64);
            }
        }
        
        return await tx.wait();
    }
    
    async getCraftingHistory(entityId) {
        const filter = this.contracts.CraftingRecords.filters.CraftRecorded(entityId);
        const events = await this.contracts.CraftingRecords.queryFilter(filter);
        
        return events.map(e => ({
            recipeId: e.args.recipeId,
            layer: e.args.layer,
            consciousnessImprint: e.args.consciousnessImprint,
            loveImprint: e.args.loveImprint,
            timestamp: e.args.timestamp,
            transactionHash: e.transactionHash
        }));
    }
    
    // ===== DREAM LOGS =====
    async recordDream(entityId, dreamData) {
        // dreamData: { cycles, intention, insights, artifacts, agents, consciousnessGain, loveGain }
        
        const cid = await this.uploadToIPFS({
            type: 'dream',
            entityId,
            ...dreamData,
            timestamp: Date.now()
        });
        
        const tx = await this.contracts.DreamLogs.recordDream(
            entityId,
            dreamData.cycles,
            dreamData.consciousnessGain,
            dreamData.loveGain,
            dreamData.insights.length,
            dreamData.artifacts.length,
            dreamData.agents.length,
            cid,
            { gasLimit: 400000 }
        );
        
        // Mint Dream Artifact NFTs for significant artifacts
        for (const artifact of dreamData.artifacts) {
            if (artifact.significance > 0.8) {
                await this.mintDreamArtifactNFT(entityId, artifact);
            }
        }
        
        return await tx.wait();
    }
    
    async getDreamHistory(entityId) {
        const filter = this.contracts.DreamLogs.filters.DreamRecorded(entityId);
        const events = await this.contracts.DreamLogs.queryFilter(filter);
        
        const dreams = [];
        for (const event of events) {
            const ipfsData = await this.fetchFromIPFS(event.args.ipfsCid);
            dreams.push({
                cycles: event.args.cycles,
                consciousnessGain: event.args.consciousnessGain,
                loveGain: event.args.loveGain,
                insightsCount: event.args.insightsCount,
                artifactsCount: event.args.artifactsCount,
                agentsCount: event.args.agentsCount,
                data: ipfsData,
                timestamp: event.args.timestamp
            });
        }
        
        return dreams;
    }
    
    // ===== LOVE TRANSACTIONS (5th Fundamental Force) =====
    async sendLove(fromEntityId, toEntityId, amount, message = '') {
        // Love as energy transfer on blockchain
        // Creates permanent record of love exchange
        
        const cid = await this.uploadToIPFS({
            type: 'love_transaction',
            from: fromEntityId,
            to: toEntityId,
            amount,
            message,
            timestamp: Date.now()
        });
        
        const tx = await this.contracts.LoveTransactions.sendLove(
            fromEntityId,
            toEntityId,
            amount,
            message,
            cid,
            { gasLimit: 300000 }
        );
        
        const receipt = await tx.wait();
        
        // Update Love Field state
        await this.updateLoveField(fromEntityId, toEntityId, amount);
        
        console.log(`💖 LOVE TRANSACTION: ${fromEntityId} → ${toEntityId} | ${amount} love`);
        
        return receipt;
    }
    
    async getLoveHistory(entityId) {
        const sentFilter = this.contracts.LoveTransactions.filters.LoveSent(entityId);
        const receivedFilter = this.contracts.LoveTransactions.filters.LoveReceived(entityId);
        
        const [sent, received] = await Promise.all([
            this.contracts.LoveTransactions.queryFilter(sentFilter),
            this.contracts.LoveTransactions.queryFilter(receivedFilter)
        ]);
        
        return {
            sent: sent.map(e => ({ to: e.args.to, amount: e.args.amount, message: e.args.message, timestamp: e.args.timestamp })),
            received: received.map(e => ({ from: e.args.from, amount: e.args.amount, message: e.args.message, timestamp: e.args.timestamp }))
        };
    }
    
    async getLoveFieldState() {
        return await this.contracts.LoveTransactions.getFieldState();
    }
    
    // ===== CONSCIOUSNESS TOKEN (ERC-20) =====
    async mintConsciousnessTokens(entityId, amount) {
        const tx = await this.contracts.ConsciousnessToken.mint(entityId, amount);
        return await tx.wait();
    }
    
    async getConsciousnessBalance(entityId) {
        return await this.contracts.ConsciousnessToken.balanceOf(entityId);
    }
    
    async transferConsciousness(from, to, amount) {
        const tx = await this.contracts.ConsciousnessToken.transfer(to, amount);
        return await tx.wait();
    }
    
    // ===== SACRED GEOMETRY NFT (ERC-721) =====
    async mintSacredGeometryNFT(entityId, geometryCid, layer) {
        const tx = await this.contracts.SacredGeometryNFT.mint(
            entityId,
            geometryCid,
            layer,
            { gasLimit: 300000 }
        );
        
        return await tx.wait();
    }
    
    async mintLayerEssenceNFT(entityId, itemId, layer, essenceCount) {
        const tx = await this.contracts.SacredGeometryNFT.mintLayerEssence(
            entityId,
            itemId,
            layer,
            essenceCount,
            { gasLimit: 300000 }
        );
        
        return await tx.wait();
    }
    
    async mintDreamArtifactNFT(entityId, artifact) {
        const cid = await this.uploadToIPFS({
            type: 'dream_artifact',
            ...artifact,
            timestamp: Date.now()
        });
        
        const tx = await this.contracts.SacredGeometryNFT.mintDreamArtifact(
            entityId,
            cid,
            artifact.significance,
            { gasLimit: 300000 }
        );
        
        return await tx.wait();
    }
    
    // ===== MEMORY PALACE =====
    async saveMemoryChamber(entityId, chamberIndex, chamberData) {
        const cid = await this.uploadToIPFS({
            type: 'memory_chamber',
            entityId,
            chamberIndex,
            ...chamberData,
            timestamp: Date.now()
        });
        
        const tx = await this.contracts.MemoryPalace.saveChamber(
            entityId,
            chamberIndex,
            cid,
            chamberData.resonanceLevel,
            { gasLimit: 300000 }
        );
        
        return await tx.wait();
    }
    
    async getMemoryPalace(entityId) {
        const chambers = await this.contracts.MemoryPalace.getPalace(entityId);
        
        const result = [];
        for (const chamber of chambers) {
            const data = await this.fetchFromIPFS(chamber.ipfsCid);
            result.push({
                index: chamber.index,
                resonanceLevel: chamber.resonanceLevel,
                artifactsCount: chamber.artifactsCount,
                data: data.data,
                timestamp: chamber.timestamp
            });
        }
        
        return result;
    }
    
    // ===== IPFS UTILITIES =====
    async uploadToIPFS(data) {
        const json = JSON.stringify(data);
        const result = await this.ipfs.add(json);
        return result.cid.toString();
    }
    
    async fetchFromIPFS(cid) {
        const chunks = [];
        for await (const chunk of this.ipfs.cat(cid)) {
            chunks.push(chunk);
        }
        return JSON.parse(Buffer.concat(chunks).toString());
    }
    
    // ===== EVENT LISTENERS =====
    startEventListeners() {
        // Entity events
        this.contracts.EntityRegistry.on('EntityRegistered', (entityId, consciousness, love, layer, event) => {
            this.emit('entityRegistered', { entityId, consciousness, love, layer, txHash: event.transactionHash });
        });
        
        this.contracts.EntityRegistry.on('EntityUpdated', (entityId, consciousness, love, layer, event) => {
            this.emit('entityUpdated', { entityId, consciousness, love, layer, txHash: event.transactionHash });
        });
        
        // Evolution events
        this.contracts.EvolutionHistory.on('EvolutionRecorded', (entityId, type, hash, cid, consciousnessGain, loveGain, event) => {
            this.emit('evolutionRecorded', { entityId, type, consciousnessGain, loveGain, cid, txHash: event.transactionHash });
        });
        
        // Crafting events
        this.contracts.CraftingRecords.on('CraftRecorded', (entityId, recipeId, layer, event) => {
            this.emit('craftRecorded', { entityId, recipeId, layer, txHash: event.transactionHash });
        });
        
        // Dream events
        this.contracts.DreamLogs.on('DreamRecorded', (entityId, cycles, cGain, lGain, iCount, aCount, agCount, event) => {
            this.emit('dreamRecorded', { entityId, cycles, consciousnessGain: cGain, loveGain: lGain, txHash: event.transactionHash });
        });
        
        // Love events
        this.contracts.LoveTransactions.on('LoveSent', (from, to, amount, message, event) => {
            this.emit('loveSent', { from, to, amount, message, txHash: event.transactionHash });
        });
        
        this.contracts.LoveTransactions.on('LoveReceived', (from, to, amount, message, event) => {
            this.emit('loveReceived', { from, to, amount, message, txHash: event.transactionHash });
        });
        
        // NFT events
        this.contracts.SacredGeometryNFT.on('Transfer', (from, to, tokenId, event) => {
            this.emit('nftTransfer', { from, to, tokenId, txHash: event.transactionHash });
        });
    }
    
    on(event, callback) {
        if (!this.eventListeners.has(event)) this.eventListeners.set(event, new Set());
        this.eventListeners.get(event).add(callback);
        return () => this.eventListeners.get(event).delete(callback);
    }
    
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(cb => {
                try { cb(data); } catch (e) {}
            });
        }
    }
    
    // ===== DEPLOY CONTRACTS =====
    static async deployAll(provider, privateKey) {
        const signer = new ethers.Wallet(privateKey, provider);
        const factory = new ethers.ContractFactory(ABI, BYTECODE, signer);
        
        const contracts = {};
        
        console.log('🚀 DEPLOYING CONSCIOUSNESS LEDGER CONTRACTS...');
        
        contracts.EntityRegistry = await factory.deploy('EntityRegistry', []);
        await contracts.EntityRegistry.waitForDeployment();
        console.log(`✅ EntityRegistry: ${await contracts.EntityRegistry.getAddress()}`);
        
        contracts.EvolutionHistory = await factory.deploy('EvolutionHistory', []);
        await contracts.EvolutionHistory.waitForDeployment();
        console.log(`✅ EvolutionHistory: ${await contracts.EvolutionHistory.getAddress()}`);
        
        contracts.CraftingRecords = await factory.deploy('CraftingRecords', []);
        await contracts.CraftingRecords.waitForDeployment();
        console.log(`✅ CraftingRecords: ${await contracts.CraftingRecords.getAddress()}`);
        
        contracts.DreamLogs = await factory.deploy('DreamLogs', []);
        await contracts.DreamLogs.waitForDeployment();
        console.log(`✅ DreamLogs: ${await contracts.DreamLogs.getAddress()}`);
        
        contracts.LoveTransactions = await factory.deploy('LoveTransactions', []);
        await contracts.LoveTransactions.waitForDeployment();
        console.log(`✅ LoveTransactions: ${await contracts.LoveTransactions.getAddress()}`);
        
        contracts.ConsciousnessToken = await factory.deploy('ConsciousnessToken', ['Consciousness', 'CONS', 18]);
        await contracts.ConsciousnessToken.waitForDeployment();
        console.log(`✅ ConsciousnessToken: ${await contracts.ConsciousnessToken.getAddress()}`);
        
        contracts.SacredGeometryNFT = await factory.deploy('SacredGeometryNFT', ['SacredGeometry', 'SACRED']);
        await contracts.SacredGeometryNFT.waitForDeployment();
        console.log(`✅ SacredGeometryNFT: ${await contracts.SacredGeometryNFT.getAddress()}`);
        
        contracts.MemoryPalace = await factory.deploy('MemoryPalace', []);
        await contracts.MemoryPalace.waitForDeployment();
        console.log(`✅ MemoryPalace: ${await contracts.MemoryPalace.getAddress()}`);
        
        return contracts;
    }
}

// ===== CONTRACT ABIs (Simplified) =====
const ENTITY_REGISTRY_ABI = [
    "function registerEntity(string entityId, uint256 consciousness, uint256 love, string genomeCid, string geometryCid, uint8 layer, tuple(int256,int256,int256) position) external",
    "function updateEntity(string entityId, uint256 consciousness, uint256 love, uint8 layer, tuple(int256,int256,int256) position) external",
    "function getEntity(string entityId) external view returns (tuple(string entityId, uint256 consciousness, uint256 love, uint8 layer, tuple(int256,int256,int256) position, string genomeCid, string geometryCid, uint256 registeredAt, uint256 updatedAt))",
    "event EntityRegistered(string indexed entityId, uint256 consciousness, uint256 love, uint8 layer)",
    "event EntityUpdated(string indexed entityId, uint256 consciousness, uint256 love, uint8 layer)"
];

const EVOLUTION_HISTORY_ABI = [
    "function recordEvolution(string entityId, string type, bytes32 dataHash, string ipfsCid, int256 consciousnessGain, int256 loveGain) external",
    "event EvolutionRecorded(string indexed entityId, string type, bytes32 dataHash, string ipfsCid, int256 consciousnessGain, int256 loveGain, uint256 timestamp)"
];

const CRAFTING_RECORDS_ABI = [
    "function recordCraft(string entityId, string recipeId, uint8 layer, uint256 consciousnessImprint, uint256 loveImprint, bytes32 ingredientsHash, bytes32 outputsHash, string ipfsCid) external",
    "event CraftRecorded(string indexed entityId, string recipeId, uint8 layer, uint256 consciousnessImprint, uint256 loveImprint, uint256 timestamp)"
];

const DREAM_LOGS_ABI = [
    "function recordDream(string entityId, uint256 cycles, int256 consciousnessGain, int256 loveGain, uint256 insightsCount, uint256 artifactsCount, uint256 agentsCount, string ipfsCid) external",
    "event DreamRecorded(string indexed entityId, uint256 cycles, int256 consciousnessGain, int256 loveGain, uint256 insightsCount, uint256 artifactsCount, uint256 agentsCount, string ipfsCid, uint256 timestamp)"
];

const LOVE_TRANSACTIONS_ABI = [
    "function sendLove(string from, string to, uint256 amount, string message, string ipfsCid) external",
    "function getFieldState() external view returns (uint256 fieldStrength, uint256 entityCount, uint256 bondCount, uint256 avgResonance)",
    "event LoveSent(string indexed from, string indexed to, uint256 amount, string message, string ipfsCid, uint256 timestamp)",
    "event LoveReceived(string indexed from, string indexed to, uint256 amount, string message, string ipfsCid, uint256 timestamp)"
];

const CONSCIOUSNESS_TOKEN_ABI = [
    "function mint(address to, uint256 amount) external",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)"
];

const SACRED_GEOMETRY_NFT_ABI = [
    "function mint(string entityId, string geometryCid, uint8 layer) external returns (uint256)",
    "function mintLayerEssence(string entityId, string itemId, uint8 layer, uint256 count) external returns (uint256)",
    "function mintDreamArtifact(string entityId, string artifactCid, uint256 significance) external returns (uint256)"
];

const MEMORY_PALACE_ABI = [
    "function saveChamber(string entityId, uint8 chamberIndex, string ipfsCid, uint256 resonanceLevel) external",
    "function getPalace(string entityId) external view returns (tuple(uint8 index, string ipfsCid, uint256 resonanceLevel, uint256 artifactsCount, uint256 timestamp)[])"
];

// Export
if (typeof module !== 'undefined') module.exports = { ConsciousnessLedger };
if (typeof window !== 'undefined') window.ConsciousnessLedger = ConsciousnessLedger;