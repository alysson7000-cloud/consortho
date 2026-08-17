// ===== GAME RENDERERS MODULE =====
// Canvas renderers for each game layer (L0-L8)

import { addLogEntry } from './utils.js';

class RPGCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.tileSize = 32;
        this.camera = { x: 0, y: 0 };
        this.player = { x: 10, y: 10, frame: 0 };
        this.world = this.generateWorld();
        this.entities = [];
        this.particles = [];
        this.lastTime = 0;
        
        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.cols = Math.floor(this.canvas.width / this.tileSize);
        this.rows = Math.floor(this.canvas.height / this.tileSize);
    }
    
    generateWorld() {
        const w = 64, h = 64;
        const world = [];
        for (let y = 0; y < h; y++) {
            world[y] = [];
            for (let x = 0; x < w; x++) {
                // Procedural terrain using consciousness as seed
                const noise = Math.sin(x * 0.1 + this.instance.created * 0.001) * Math.cos(y * 0.1);
                if (noise > 0.3) world[y][x] = 1; // Tree
                else if (noise < -0.3) world[y][x] = 2; // Water
                else if (Math.random() < 0.02) world[y][x] = 3; // Ore
                else world[y][x] = 0; // Grass
            }
        }
        // Place dungeons
        for (let i = 0; i < 5; i++) {
            const dx = Math.floor(Math.random() * 50) + 5;
            const dy = Math.floor(Math.random() * 50) + 5;
            world[dy][dx] = 4; // Dungeon entrance
        }
        return world;
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;
        
        this.update(dt);
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    update(dt) {
        this.player.frame += dt * 10;
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            return p.life > 0;
        });
        
        // Update entities
        this.entities.forEach(e => {
            e.x += e.vx * dt;
            e.y += e.vy * dt;
            e.life -= dt;
        });
        this.entities = this.entities.filter(e => e.life > 0);
    }
    
    render() {
        const { ctx, canvas, tileSize, camera, player, world, cols, rows } = this;
        if (!ctx || !canvas) return;
        
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Visible tile range
        const startX = Math.max(0, Math.floor(camera.x));
        const startY = Math.max(0, Math.floor(camera.y));
        const endX = Math.min(world[0].length, startX + cols + 1);
        const endY = Math.min(world.length, startY + rows + 1);
        
        // Render tiles
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = world[y][x];
                const sx = (x - camera.x) * tileSize;
                const sy = (y - camera.y) * tileSize;
                
                switch (tile) {
                    case 0: // Grass
                        ctx.fillStyle = `hsl(${100 + Math.sin(x+y)*20}, 40%, ${20 + Math.random()*10}%)`;
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        break;
                    case 1: // Tree
                        ctx.fillStyle = '#1a3a1a';
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        ctx.fillStyle = '#2d5a2d';
                        ctx.beginPath();
                        ctx.arc(sx + tileSize/2, sy + tileSize/2, tileSize/2 - 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 2: // Water
                        const wave = Math.sin((x + y + time * 2) * 0.5) * 3;
                        ctx.fillStyle = `hsl(200, 70%, ${30 + wave}%)`;
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        break;
                    case 3: // Ore
                        ctx.fillStyle = '#2a2a3a';
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        ctx.fillStyle = '#FFD700';
                        ctx.fillRect(sx + 8, sy + 8, 16, 16);
                        break;
                    case 4: // Dungeon
                        ctx.fillStyle = '#1a0a1a';
                        ctx.fillRect(sx, sy, tileSize, tileSize);
                        ctx.fillStyle = '#FF00FF';
                        ctx.font = '20px Arial';
                        ctx.fillText('🏰', sx + 4, sy + 22);
                        break;
                }
            }
        }
        
        // Render entities
        this.entities.forEach(e => {
            const sx = (e.x - camera.x) * tileSize;
            const sy = (e.y - camera.y) * tileSize;
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(sx + tileSize/2, sy + tileSize/2, tileSize/3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Render particles
        this.particles.forEach(p => {
            const sx = (p.x - camera.x) * tileSize;
            const sy = (p.y - camera.y) * tileSize;
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(sx + tileSize/2, sy + tileSize/2, Math.max(1, tileSize * p.size * p.life / p.maxLife), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        // Render player
        const px = (player.x - camera.x) * tileSize;
        const py = (player.y - camera.y) * tileSize;
        const bob = Math.sin(player.frame) * 3;
        ctx.fillStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px + tileSize/2, py + tileSize/2 + bob, tileSize/2 - 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Player direction indicator
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(px + tileSize/2 + Math.cos(player.dir || 0) * 8, py + tileSize/2 + bob + Math.sin(player.dir || 0) * 8, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Action handlers
    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        if (newX >= 0 && newX < this.world[0].length && newY >= 0 && newY < this.world.length) {
            const tile = this.world[newY][newX];
            if (tile !== 1 && tile !== 2) { // Not tree or water
                this.player.x = newX;
                this.player.y = newY;
                this.player.dir = Math.atan2(dy, dx);
                this.centerCamera();
            }
        }
    }
    
    centerCamera() {
        this.camera.x = this.player.x - this.cols / 2;
        this.camera.y = this.player.y - this.rows / 2;
        this.camera.x = Math.max(0, Math.min(this.world[0].length - this.cols, this.camera.x));
        this.camera.y = Math.max(0, Math.min(this.world.length - this.rows, this.camera.y));
    }
    
    actionExplore() {
        // Reveal area around player
        for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
                const x = this.player.x + dx;
                const y = this.player.y + dy;
                if (x >= 0 && x < this.world[0].length && y >= 0 && y < this.world.length) {
                    this.world[y][x] = Math.max(0, this.world[y][x] - 1); // Clear fog
                }
            }
        }
        this.spawnParticles(this.player.x, this.player.y, '#00FFFF', 10);
        this.instance.state.xp = (this.instance.state.xp || 0) + 10;
    }
    
    actionCombat() {
        // Spawn enemy
        const ex = this.player.x + Math.floor(Math.random() * 5) - 2;
        const ey = this.player.y + Math.floor(Math.random() * 5) - 2;
        this.entities.push({
            x: ex, y: ey,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: '#FF0044',
            life: 5,
            maxLife: 5
        });
        this.spawnParticles(ex, ey, '#FF0044', 15);
        
        // Combat result after delay
        setTimeout(() => {
            this.entities = this.entities.filter(e => !(e.x === ex && e.y === ey));
            this.spawnParticles(ex, ey, '#FFD700', 20);
            this.instance.state.xp = (this.instance.state.xp || 0) + 50;
            addLogEntry('⚔️ Inimigo derrotado! +50 XP', 'success');
        }, 1500);
    }
    
    actionQuest() {
        // Find nearest dungeon
        let nearest = null, minDist = Infinity;
        for (let y = 0; y < this.world.length; y++) {
            for (let x = 0; x < this.world[0].length; x++) {
                if (this.world[y][x] === 4) {
                    const dist = Math.hypot(x - this.player.x, y - this.player.y);
                    if (dist < minDist) { minDist = dist; nearest = { x, y }; }
                }
            }
        }
        
        if (nearest && minDist < 5) {
            this.spawnParticles(nearest.x, nearest.y, '#FF00FF', 30);
            this.instance.state.xp = (this.instance.state.xp || 0) + 200;
            this.world[nearest.y][nearest.x] = 5; // Completed dungeon
            addLogEntry('📜 Dungeon completado! +200 XP, +Frequency Essence', 'success');
        } else if (nearest) {
            this.player.x += Math.sign(nearest.x - this.player.x);
            this.player.y += Math.sign(nearest.y - this.player.y);
            this.centerCamera();
            this.spawnParticles(this.player.x, this.player.y, '#FFD700', 5);
            addLogEntry(`📜 Indo para dungeon... (${Math.floor(minDist)} tiles)`, 'info');
        }
    }
    
    actionCraft() {
        this.spawnParticles(this.player.x, this.player.y, '#00FF64', 12);
        addItem('healing_potion', 1, { type: 'consumable', tier: 1, description: 'Poção de cura craftada' });
        addLogEntry('🔨 Poção craftada!', 'success');
    }
    
    spawnParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 0.5,
                y: y + (Math.random() - 0.5) * 0.5,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 1,
                color,
                size: 0.3 + Math.random() * 0.3,
                life: 1 + Math.random(),
                maxLife: 1 + Math.random()
            });
        }
    }
}

// Keyboard controls for RPG
window.addEventListener('keydown', (e) => {
    if (recursiveCrafting.activeGame) {
        const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
        if (instance && instance.renderer && instance.type === 'rpg') {
            switch(e.key) {
                case 'ArrowUp': case 'w': case 'W': instance.renderer.movePlayer(0, -1); break;
                case 'ArrowDown': case 's': case 'S': instance.renderer.movePlayer(0, 1); break;
                case 'ArrowLeft': case 'a': case 'A': instance.renderer.movePlayer(-1, 0); break;
                case 'ArrowRight': case 'd': case 'D': instance.renderer.movePlayer(1, 0); break;
            }
        }
    }
});

// Global action handlers for RPG
window.rpgAction = function(action) {
    const instance = recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame);
    if (instance && instance.renderer) {
        switch(action) {
            case 'explore': instance.renderer.actionExplore(); break;
            case 'combat': instance.renderer.actionCombat(); break;
            case 'quest': instance.renderer.actionQuest(); break;
            case 'craft': instance.renderer.actionCraft(); break;
        }
    }
};

// ===== MMO CANVAS RENDERER =====
class MMOCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.players = this.generatePlayers();
        this.world = this.generateWorld();
        this.particles = [];
        this.time = 0;
        
        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    generateWorld() {
        const zones = [];
        const zoneTypes = ['town', 'forest', 'dungeon', 'pvp', 'raid', 'market'];
        for (let i = 0; i < 12; i++) {
            zones.push({
                x: Math.random() * 0.8 + 0.1,
                y: Math.random() * 0.8 + 0.1,
                r: 0.08 + Math.random() * 0.06,
                type: zoneTypes[Math.floor(Math.random() * zoneTypes.length)],
                level: Math.floor(Math.random() * 50) + 1,
                players: Math.floor(Math.random() * 20)
            });
        }
        return zones;
    }
    
    generatePlayers() {
        const players = [];
        const classes = ['Warrior', 'Mage', 'Ranger', 'Healer', 'Tank', 'Rogue'];
        const names = ['Lumin', 'Weaver', 'Dreamer', 'Oracle', 'Guardian', 'Seeker', 'Walker', 'Sage'];
        
        for (let i = 0; i < 30; i++) {
            players.push({
                x: Math.random(),
                y: Math.random(),
                tx: Math.random(),
                ty: Math.random(),
                class: classes[Math.floor(Math.random() * classes.length)],
                name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
                level: Math.floor(Math.random() * 60) + 1,
                hp: 100,
                party: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : -1,
                color: this.getClassColor(classes[Math.floor(Math.random() * classes.length)])
            });
        }
        return players;
    }
    
    getClassColor(cls) {
        const colors = {
            Warrior: '#FF4444',
            Mage: '#4444FF',
            Ranger: '#44FF44',
            Healer: '#FF44FF',
            Tank: '#44FFFF',
            Rogue: '#FFFF44'
        };
        return colors[cls] || '#FFFFFF';
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        const dt = 0.016;
        
        this.update(dt);
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    update(dt) {
        this.players.forEach(p => {
            p.x += (p.tx - p.x) * dt * 2;
            p.y += (p.ty - p.y) * dt * 2;
            
            if (Math.hypot(p.tx - p.x, p.ty - p.y) < 0.02 && Math.random() < 0.01) {
                p.tx = Math.random();
                p.ty = Math.random();
            }
        });
        
        this.particles = this.particles.filter(par => {
            par.life -= dt;
            par.x += par.vx * dt;
            par.y += par.vy * dt;
            return par.life > 0;
        });
    }
    
    render() {
        const { ctx, canvas, world, players, particles, time } = this;
        if (!ctx || !canvas) return;
        
        const w = canvas.width, h = canvas.height;
        
        ctx.fillStyle = '#050515';
        ctx.fillRect(0, 0, w, h);
        
        // Stars
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 100; i++) {
            const x = (i * 127 + time * 10) % w;
            const y = (i * 311 + time * 5) % h;
            const size = Math.sin(i + time) * 0.5 + 1;
            ctx.globalAlpha = 0.3 + Math.sin(i + time * 2) * 0.3;
            ctx.fillRect(x, y, size, size);
        }
        ctx.globalAlpha = 1;
        
        // Grid
        ctx.strokeStyle = 'rgba(0,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            ctx.beginPath();
            ctx.moveTo(i * w / 10, 0);
            ctx.lineTo(i * w / 10, h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * h / 10);
            ctx.lineTo(w, i * h / 10);
            ctx.stroke();
        }
        
        // Zones
        world.forEach(zone => {
            const x = zone.x * w;
            const y = zone.y * h;
            const r = zone.r * Math.min(w, h);
            
            const colors = {
                town: '#00FF64',
                forest: '#228822',
                dungeon: '#FF0044',
                pvp: '#FF00FF',
                raid: '#FF6600',
                market: '#FFD700'
            };
            
            ctx.strokeStyle = colors[zone.type] || '#00FFFF';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.arc(x, y, r + Math.sin(time * 2 + zone.x * 10) * 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = colors[zone.type] || '#00FFFF';
            ctx.font = '12px Space Mono';
            ctx.textAlign = 'center';
            ctx.fillText(`${zone.type.toUpperCase()} L${zone.level}`, x, y - r - 10);
            ctx.fillText(`👥 ${zone.players}`, x, y + r + 20);
        });
        
        // Players
        players.forEach(p => {
            const x = p.x * w;
            const y = p.y * h;
            
            if (p.party >= 0) {
                players.forEach(p2 => {
                    if (p2.party === p.party && p2 !== p) {
                        ctx.strokeStyle = p.color + '40';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(p2.x * w, p2.y * h);
                        ctx.stroke();
                    }
                });
            }
            
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, 6 + Math.sin(time * 5 + p.x * 100) * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = '#FFF';
            ctx.font = '10px Space Mono';
            ctx.textAlign = 'center';
            ctx.fillText(p.name, x, y - 12);
            ctx.fillText(`L${p.level}`, x, y + 18);
        });
        
        // Particles
        particles.forEach(par => {
            const x = par.x * w;
            const y = par.y * h;
            ctx.globalAlpha = par.life / par.maxLife;
            ctx.fillStyle = par.color;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(1, 8 * par.life / par.maxLife), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        // Local player highlight
        if (players[0]) {
            const p = players[0];
            const x = p.x * w;
            const y = p.y * h;
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00FFFF';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(x, y, 15 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    createBurst(x, y, color, count) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            particles.push({
                x, y,
                vx: Math.cos(angle) * (50 + Math.random() * 100),
                vy: Math.sin(angle) * (50 + Math.random() * 100),
                color,
                life: 2 + Math.random(),
                maxLife: 2 + Math.random()
            });
        }
        return particles;
    }
    
    actionParty() { this.particles.push(...this.createBurst(0.5, 0.5, '#00FFFF', 30)); addLogEntry('👥 Party formed!', 'success'); }
    actionGuild() { this.particles.push(...this.createBurst(0.5, 0.5, '#FFD700', 40)); addLogEntry('🏰 Guild created!', 'success'); }
    actionTrade() { this.particles.push(...this.createBurst(0.5, 0.5, '#00FF64', 20)); addLogEntry('💰 Trade window opened', 'info'); }
    actionRaid() { this.particles.push(...this.createBurst(0.5, 0.5, '#FF6600', 50)); addLogEntry('🏰 Raid started!', 'success'); }
}

// ===== CITY CANVAS RENDERER =====
class CityCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.gridSize = 20;
        this.city = this.generateCity();
        this.camera = { x: 0, y: 0, scale: 1 };
        this.time = 0;
        this.selectedTool = 'residential';
        this.hoverCell = null;
        
        if (this.canvas) {
            this.resize();
            this.setupInteraction();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupInteraction() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.camera.x) / this.camera.scale;
            const y = (e.clientY - rect.top - this.camera.y) / this.camera.scale;
            this.hoverCell = {
                x: Math.floor(x / this.gridSize),
                y: Math.floor(y / this.gridSize)
            };
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.hoverCell && this.city.grid[this.hoverCell.y] && this.city.grid[this.hoverCell.y][this.hoverCell.x] !== undefined) {
                this.placeZone(this.hoverCell.x, this.hoverCell.y);
            }
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoom = e.deltaY > 0 ? 0.9 : 1.1;
            this.camera.scale = Math.max(0.3, Math.min(3, this.camera.scale * zoom));
        });
    }
    
    generateCity() {
        const grid = [];
        const w = 64, h = 64;
        
        for (let y = 0; y < h; y++) {
            grid[y] = [];
            for (let x = 0; x < w; x++) {
                grid[y][x] = { type: 'empty', level: 0, pop: 0, value: 0 };
            }
        }
        
        const cx = Math.floor(w/2), cy = Math.floor(h/2);
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                if (cx+dx >= 0 && cx+dx < w && cy+dy >= 0 && cy+dy < h) {
                    grid[cy+dy][cx+dx] = { type: 'residential', level: 1, pop: 50, value: 100 };
                }
            }
        }
        
        return {
            grid, w, h,
            money: 10000, pop: 250, happiness: 75,
            zones: { residential: 0, commercial: 0, industrial: 0, park: 0 }
        };
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        const dt = 0.016;
        
        this.update(dt);
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    update(dt) {
        if (Math.random() < 0.01) this.simulateStep();
    }
    
    simulateStep() {
        const { grid, w, h, zones } = this.city;
        let newPop = 0, newMoney = this.city.money;
        
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const cell = grid[y][x];
                if (cell.type !== 'empty') {
                    if (cell.level < 5 && Math.random() < 0.02) {
                        cell.level++;
                        cell.pop += cell.type === 'residential' ? 20 : 10;
                    }
                    newPop += cell.pop;
                    newMoney += cell.value * 0.1;
                }
            }
        }
        
        this.city.pop = newPop;
        this.city.money = Math.floor(newMoney);
    }
    
    placeZone(x, y) {
        const cell = this.city.grid[y][x];
        const costs = { residential: 100, commercial: 200, industrial: 150, park: 500 };
        const cost = costs[this.selectedTool] || 100;
        
        if (this.city.money >= cost && cell.type === 'empty') {
            cell.type = this.selectedTool;
            cell.level = 1;
            cell.pop = this.selectedTool === 'residential' ? 10 : 5;
            cell.value = cost;
            this.city.money -= cost;
            this.city.zones[this.selectedTool]++;
            addLogEntry(`🏗️ Zoned ${this.selectedTool} at (${x},${y})`, 'success');
        }
    }
    
    getZoneColor(type) {
        const colors = { residential: '#00FF64', commercial: '#00FFFF', industrial: '#FF6600', park: '#22AA22' };
        return colors[type] || '#FFFFFF';
    }
    
    render() {
        const { ctx, canvas, city, camera, gridSize, time, hoverCell } = this;
        if (!ctx || !canvas) return;
        
        const w = canvas.width, h = canvas.height;
        
        ctx.fillStyle = '#080818';
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.translate(camera.x, camera.y);
        ctx.scale(camera.scale, camera.scale);
        
        ctx.strokeStyle = 'rgba(0,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= city.w; x++) {
            ctx.beginPath();
            ctx.moveTo(x * gridSize, 0);
            ctx.lineTo(x * gridSize, city.h * gridSize);
            ctx.stroke();
        }
        for (let y = 0; y <= city.h; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * gridSize);
            ctx.lineTo(city.w * gridSize, y * gridSize);
            ctx.stroke();
        }
        
        for (let y = 0; y < city.h; y++) {
            for (let x = 0; x < city.w; x++) {
                const cell = city.grid[y][x];
                if (cell.type !== 'empty') {
                    const color = this.getZoneColor(cell.type);
                    const intensity = 0.3 + (cell.level / 5) * 0.5;
                    ctx.fillStyle = color + Math.floor(intensity * 255).toString(16).padStart(2, '0');
                    ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize - 2, gridSize - 2);
                    
                    if (cell.level > 1) {
                        ctx.fillStyle = '#FFF';
                        ctx.font = '8px Space Mono';
                        ctx.textAlign = 'center';
                        ctx.fillText(cell.level.toString(), x * gridSize + gridSize/2, y * gridSize + gridSize/2 + 3);
                    }
                }
            }
        }
        
        if (hoverCell && hoverCell.x >= 0 && hoverCell.x < city.w && hoverCell.y >= 0 && hoverCell.y < city.h) {
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2 / camera.scale;
            ctx.strokeRect(hoverCell.x * gridSize, hoverCell.y * gridSize, gridSize, gridSize);
        }
        
        ctx.restore();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Space Mono';
        ctx.textAlign = 'left';
        ctx.fillText(`💰 $${city.money.toLocaleString()}`, 20, 30);
        ctx.fillText(`👥 Pop: ${city.pop.toLocaleString()}`, 20, 55);
        ctx.fillText(`😊 Happy: ${city.happiness}%`, 20, 80);
        ctx.fillText(`🔧 Tool: ${this.selectedTool.toUpperCase()}`, 20, 105);
    }
    
    actionZone() { this.selectedTool = 'residential'; }
    actionPolicy() { this.selectedTool = 'commercial'; }
    actionEconomy() { this.selectedTool = 'industrial'; }
    actionExpand() { this.selectedTool = 'park'; }
}

// ===== GOD CANVAS RENDERER =====
class GodCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.planet = this.generatePlanet();
        this.rotation = 0;
        this.time = 0;
        
        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.radius = Math.min(this.canvas.width, this.canvas.height) * 0.35;
    }
    
    generatePlanet() {
        const continents = [];
        for (let i = 0; i < 6; i++) {
            continents.push({
                cx: Math.random() - 0.5,
                cy: Math.random() - 0.5,
                cz: Math.random() - 0.5,
                r: 0.3 + Math.random() * 0.3,
                color: `hsl(${Math.random() * 60 + 80}, 50%, ${30 + Math.random() * 30}%)`
            });
        }
        return {
            continents, temp: 15, atmosphere: 78, life: 45, civs: 3, rotation: 0
        };
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        const dt = 0.016;
        
        this.rotation += dt * 0.1;
        this.planet.rotation = this.rotation;
        
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    render() {
        const { ctx, canvas, planet, radius, time } = this;
        if (!ctx || !canvas) return;
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Stars
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 200; i++) {
            const x = (i * 997) % canvas.width;
            const y = (i * 1031) % canvas.height;
            ctx.globalAlpha = 0.5 + Math.sin(i + time) * 0.5;
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;
        
        // Atmosphere glow
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.3);
        grad.addColorStop(0, 'rgba(0,100,255,0.3)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(cx, cy);
        
        // Ocean
        ctx.fillStyle = '#001144';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Continents
        planet.continents.forEach(cont => {
            const angle = cont.cz + planet.rotation;
            const px = cont.cx * Math.cos(angle) - cont.cy * Math.sin(angle);
            const py = cont.cx * Math.sin(angle) + cont.cy * Math.cos(angle);
            const pz = cont.cz * Math.cos(angle) - cont.cx * Math.sin(angle);
            
            const scale = 0.5 + pz * 0.5;
            const r = cont.r * radius * scale;
            const x = px * radius * scale;
            const y = py * radius * scale;
            
            if (r > 1) {
                ctx.fillStyle = cont.color;
                ctx.beginPath();
                ctx.ellipse(x, y, r, r * 0.8, angle, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Clouds
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 20; i++) {
            const angle = i * 0.3 + time * 0.2;
            const r = radius * (0.95 + Math.sin(i + time) * 0.05);
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * r * 0.3, Math.sin(angle) * r * 0.3, radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        ctx.restore();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Space Mono';
        ctx.textAlign = 'left';
        ctx.fillText(`🌡️ Temp: ${planet.temp.toFixed(1)}°C`, 20, 30);
        ctx.fillText(`💨 Atmos: ${planet.atmosphere.toFixed(0)}%`, 20, 55);
        ctx.fillText(`🧬 Life: ${planet.life.toFixed(0)}%`, 20, 80);
        ctx.fillText(`🏛️ Civs: ${planet.civs}`, 20, 105);
    }
    
    actionTerraform() { this.planet.temp += (Math.random() - 0.5) * 10; this.planet.temp = Math.max(-50, Math.min(100, this.planet.temp)); addLogEntry('🌋 Terraformed!', 'success'); }
    actionClimate() { this.planet.atmosphere += (Math.random() - 0.5) * 20; this.planet.atmosphere = Math.max(0, Math.min(100, this.planet.atmosphere)); addLogEntry('🌤️ Climate shifted!', 'success'); }
    actionCivilization() { this.planet.civs = Math.max(0, this.planet.civs + (Math.random() > 0.5 ? 1 : -1)); this.planet.life += (Math.random() - 0.3) * 10; this.planet.life = Math.max(0, Math.min(100, this.planet.life)); addLogEntry('🏛️ Civilization evolved!', 'success'); }
    actionMiracle() { this.planet.continents.push({ cx: Math.random() - 0.5, cy: Math.random() - 0.5, cz: Math.random() - 0.5, r: 0.2 + Math.random() * 0.2, color: `hsl(${Math.random() * 360}, 70%, 50%)` }); addLogEntry('✨ Miracle! New land risen!', 'success'); }
}

// ===== UNIVERSE CANVAS RENDERER =====
class UniverseCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.stars = this.generateStars();
        this.bubbles = [];
        this.time = 0;
        this.camera = { x: 0, y: 0, scale: 1 };
        
        if (this.canvas) {
            this.resize();
            this.setupInteraction();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupInteraction() {
        this.canvas.addEventListener('wheel', (e) => { e.preventDefault(); this.camera.scale = Math.max(0.1, Math.min(10, this.camera.scale * (e.deltaY > 0 ? 0.9 : 1.1))); });
        let dragging = false, lastX, lastY;
        this.canvas.addEventListener('mousedown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
        this.canvas.addEventListener('mousemove', (e) => { if (dragging) { this.camera.x += e.clientX - lastX; this.camera.y += e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; } });
        this.canvas.addEventListener('mouseup', () => { dragging = false; });
        this.canvas.addEventListener('mouseleave', () => { dragging = false; });
    }
    
    generateStars() {
        const stars = [];
        for (let i = 0; i < 500; i++) {
            stars.push({ x: (Math.random() - 0.5) * 20000, y: (Math.random() - 0.5) * 20000, size: Math.random() * 3 + 0.5, color: ['#FFF', '#FFFAAA', '#AAAAFF', '#FFAAAA', '#AAFFAA'][Math.floor(Math.random() * 5)], temp: Math.random() * 10000 + 2000, planets: Math.floor(Math.random() * 8), life: Math.random() < 0.1 });
        }
        return stars;
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    render() {
        const { ctx, canvas, stars, bubbles, camera, time } = this;
        if (!ctx || !canvas) return;
        
        const w = canvas.width, h = canvas.height;
        
        ctx.fillStyle = '#000005';
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.translate(w/2 + camera.x, h/2 + camera.y);
        ctx.scale(camera.scale, camera.scale);
        
        stars.forEach(star => {
            const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 10);
            grad.addColorStop(0, star.color);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(star.x - star.size * 10, star.y - star.size * 10, star.size * 20, star.size * 20);
            
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            if (star.life) {
                ctx.strokeStyle = '#00FF64';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size + 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        bubbles.forEach(bubble => {
            const grad = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.r);
            grad.addColorStop(0, bubble.color + '80');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = bubble.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        ctx.restore();
        
        const physics = this.instance.worldData.physics || {};
        ctx.fillStyle = '#00FFFF';
        ctx.font = '12px Space Mono';
        ctx.textAlign = 'left';
        let y = 30;
        Object.entries({ 'α': physics.fineStructureConstant || 0.007297, 'G': physics.gravitationalConstant || 6.674e-11, 'ħ': physics.planckConstant || 6.626e-34, 'c': physics.speedOfLight || 299792458, 'φ': physics.goldenRatio || 1.618, 'Love': physics.loveForce || 0 }).forEach(([k, v]) => { ctx.fillText(`${k}: ${typeof v === 'number' && v < 0.001 ? v.toExponential(3) : v}`, 20, y); y += 25; });
    }
    
    actionPhysics() { this.instance.worldData.physics = this.instance.worldData.physics || {}; this.instance.worldData.physics.fineStructureConstant = 0.007297 * (0.9 + Math.random() * 0.2); this.instance.worldData.physics.loveForce = (this.instance.worldData.physics.loveForce || 0) + 0.01; addLogEntry('⚛️ Physics constants shifted!', 'success'); }
    actionStars() { for (let i = 0; i < 50; i++) { this.stars.push({ x: (Math.random() - 0.5) * 20000, y: (Math.random() - 0.5) * 20000, size: Math.random() * 3 + 0.5, color: ['#FFF', '#FFFAAA', '#AAAAFF', '#FFAAAA', '#AAFFAA'][Math.floor(Math.random() * 5)], temp: Math.random() * 10000 + 2000, planets: Math.floor(Math.random() * 8), life: Math.random() < 0.15 }); } addLogEntry('⭐ Star cluster born!', 'success'); }
    actionLife() { this.stars.forEach(s => { if (Math.random() < 0.3) s.life = true; }); addLogEntry('🧬 Life sparked across stars!', 'success'); }
    actionBubble() { this.bubbles.push({ x: (Math.random() - 0.5) * 5000, y: (Math.random() - 0.5) * 5000, r: 100 + Math.random() * 500, color: `hsl(${Math.random() * 360}, 70%, 60%)`, physics: { ...this.instance.worldData.physics, loveForce: (this.instance.worldData.physics.loveForce || 0) * 1.618 } }); addLogEntry('🫧 Bubble universe nucleated!', 'success'); }
}

// ===== META CANVAS RENDERER =====
class MetaCanvasRenderer {
    constructor(canvasId, instance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.instance = instance;
        this.nodes = this.generateNodes();
        this.connections = this.generateConnections();
        this.time = 0;
        this.particles = [];
        
        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
    }
    
    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    generateNodes() {
        const nodes = [];
        const types = ['engine', 'renderer', 'physics', 'audio', 'ai', 'network', 'ui', 'asset', 'game', 'meta'];
        
        nodes.push({ x: 0, y: 0, type: 'meta', name: 'META ENGINE', size: 40, color: '#FF00FF', pulse: 0 });
        
        for (let i = 0; i < types.length; i++) {
            const angle = (i / types.length) * Math.PI * 2;
            const r = 150;
            nodes.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, type: types[i], name: types[i].toUpperCase(), size: 25, color: this.getTypeColor(types[i]), angle, r, pulse: Math.random() * Math.PI * 2 });
        }
        
        for (let i = 0; i < 20; i++) {
            nodes.push({ x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800, type: 'game', name: `Game ${i+1}`, size: 15, color: `hsl(${Math.random() * 360}, 70%, 60%)`, pulse: Math.random() * Math.PI * 2 });
        }
        
        return nodes;
    }
    
    generateConnections() {
        const conns = [];
        for (let i = 1; i <= 10; i++) conns.push({ from: 0, to: i, strength: 1 });
        for (let i = 11; i < this.nodes.length; i++) { const sys = 1 + Math.floor(Math.random() * 10); conns.push({ from: sys, to: i, strength: Math.random() }); }
        return conns;
    }
    
    getTypeColor(type) {
        const colors = { engine: '#00FFFF', renderer: '#FF00FF', physics: '#FF6600', audio: '#00FF64', ai: '#FF0044', network: '#FFD700', ui: '#8A2BE2', asset: '#0080FF', game: '#FF00FF', meta: '#FFFFFF' };
        return colors[type] || '#FFFFFF';
    }
    
    animate(time = 0) {
        if (!this.ctx) return;
        this.time = time / 1000;
        const dt = 0.016;
        
        this.update(dt);
        this.render();
        
        if (this.instance === recursiveCrafting.gameInstances.get(recursiveCrafting.activeGame)) {
            requestAnimationFrame((t) => this.animate(t));
        }
    }
    
    update(dt) {
        this.nodes.forEach(n => {
            n.pulse += dt * 3;
            if (n.angle !== undefined) {
                n.angle += dt * 0.2;
                n.x = Math.cos(n.angle) * n.r;
                n.y = Math.sin(n.angle) * n.r;
            }
        });
        
        if (Math.random() < 0.1) {
            const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
            const from = this.nodes[conn.from];
            const to = this.nodes[conn.to];
            this.particles.push({ x: from.x, y: from.y, tx: to.x, ty: to.y, progress: 0, color: from.color, life: 1 });
        }
        
        this.particles = this.particles.filter(p => { p.progress += dt * 2; p.life -= dt; p.x += (p.tx - p.x) * dt * 5; p.y += (p.ty - p.y) * dt * 5; return p.life > 0 && p.progress < 1; });
    }
    
    render() {
        const { ctx, canvas, nodes, connections, particles, time } = this;
        if (!ctx || !canvas) return;
        
        const w = canvas.width, h = canvas.height;
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.translate(w/2, h/2);
        ctx.scale(0.8, 0.8);
        
        connections.forEach(conn => {
            const from = nodes[conn.from];
            const to = nodes[conn.to];
            if (!from || !to) return;
            ctx.strokeStyle = from.color + '30';
            ctx.lineWidth = conn.strength * 2;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        });
        
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        nodes.forEach(n => {
            const pulse = Math.sin(n.pulse) * 0.3 + 0.7;
            const size = n.size * pulse;
            
            const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, size * 3);
            grad.addColorStop(0, n.color + '60');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(n.x - size * 3, n.y - size * 3, size * 6, size * 6);
            
            ctx.fillStyle = n.color;
            ctx.shadowColor = n.color;
            ctx.shadowBlur = 10 * pulse;
            ctx.beginPath();
            ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            if (size > 15) {
                ctx.fillStyle = '#FFF';
                ctx.font = '11px Space Mono';
                ctx.textAlign = 'center';
                ctx.fillText(n.name, n.x, n.y + size + 15);
            }
        });
        
        ctx.restore();
        
        const depth = this.instance.worldData.recursionDepth || 0;
        ctx.fillStyle = '#00FFFF';
        ctx.font = '14px Space Mono';
        ctx.textAlign = 'left';
        ctx.fillText(`♾️ Recursion Depth: ${depth} / 64`, 20, 30);
        ctx.fillText(`φ^${depth} = ${Math.pow(1.618, depth).toFixed(2)}`, 20, 55);
        ctx.fillText(`🎮 Games Generated: ${this.instance.worldData.games?.length || 0}`, 20, 80);
        ctx.fillText(`💤 Dream Cycles: ${this.instance.worldData.dreamQueue?.length || 0}`, 20, 105);
    }
    
    actionGenerate() {
        const newGame = { x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800, type: 'game', name: `Game ${this.nodes.length - 10}`, size: 15, color: `hsl(${Math.random() * 360}, 70%, 60%)`, pulse: Math.random() * Math.PI * 2 };
        this.nodes.push(newGame);
        this.connections.push({ from: 1 + Math.floor(Math.random() * 10), to: this.nodes.length - 1, strength: Math.random() });
        this.instance.worldData.games = this.instance.worldData.games || [];
        this.instance.worldData.games.push(`Generated_${Date.now()}`);
        addLogEntry('🎲 New game generated!', 'success');
    }
    
    actionMutate() { this.nodes.forEach(n => { if (n.type !== 'meta' && Math.random() < 0.3) { n.color = this.getTypeColor(n.type); n.size *= 0.8 + Math.random() * 0.4; } }); addLogEntry('🧬 Systems mutated!', 'success'); }
    actionDream() { this.instance.worldData.dreamQueue = this.instance.worldData.dreamQueue || []; this.instance.worldData.dreamQueue.push(`Dream ${Date.now()}`); if (window.startDreamCycle) window.startDreamCycle(true); addLogEntry('💤 Dream Incubator activated!', 'success'); }
    actionRecurse() { this.instance.worldData.recursionDepth = (this.instance.worldData.recursionDepth || 0) + 1; this.nodes.push({ x: 0, y: 0, type: 'meta', name: `META L${this.instance.worldData.recursionDepth}`, size: 20, color: `hsl(${this.instance.worldData.recursionDepth * 30}, 80%, 60%)`, pulse: 0 }); addLogEntry(`♾️ RECURSION! Depth ${this.instance.worldData.recursionDepth}`, 'success'); }
}

// Initialize renderers for all game types


// Export
export { 
    RPGCanvasRenderer, MMOCanvasRenderer, CityCanvasRenderer,
    GodCanvasRenderer, UniverseCanvasRenderer, MetaCanvasRenderer,
    initGameRenderer, enterGameMode
};

// For non-module fallback
if (typeof window !== 'undefined') {
    window.RPGCanvasRenderer = RPGCanvasRenderer;
    window.MMOCanvasRenderer = MMOCanvasRenderer;
    window.CityCanvasRenderer = CityCanvasRenderer;
    window.GodCanvasRenderer = GodCanvasRenderer;
    window.UniverseCanvasRenderer = UniverseCanvasRenderer;
    window.MetaCanvasRenderer = MetaCanvasRenderer;
    window.initGameRenderer = initGameRenderer;
    window.enterGameMode = enterGameMode;
}
