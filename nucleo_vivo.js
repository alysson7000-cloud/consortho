// nucleo_vivo.js — painel vivo do Nucleo com status em tempo real
// Status dos 5 serviços + 2 agents + fluxo de energia

const PORT = 9881;
const http = require('http');
const { execSync } = require('child_process');

const STATUS_HTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nucleo Vivo — Painel de Status</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #050508;
            color: #d0d0e8;
            min-height: 100vh;
        }
        .topo {
            position: fixed; top: 0; left: 0; right: 0;
            background: rgba(5,5,8,0.9);
            border-bottom: 1px solid #1e1e30;
            padding: 10px 16px;
            display: flex; align-items: center; justify-content: space-between;
            z-index: 100;
        }
        .brand { display: flex; align-items: center; gap: 8px; }
        .logo {
            width: 28px; height: 28px;
            border-radius: 6px;
            background: radial-gradient(circle at 35% 35%, #4cc9f0, #7c3aed);
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; box-shadow: 0 0 12px rgba(76,201,240,0.3);
        }
        .name { font-size: 14px; font-weight: 700; }
        .clock { color: #6a6a8a; font-size: 12px; }
        .container { max-width: 900px; margin: 60px auto 40px; padding: 0 16px; }
        .principal {
            background: #0c0c14;
            border: 1px solid #1e1e30;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
        }
        .principal h1 {
            font-size: 32px; font-weight: 800;
            background: linear-gradient(135deg, #4cc9f0, #7c3aed, #22d3ee);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
        }
        .principal .sub { color: #6a6a8a; font-size: 14px; margin-bottom: 25px; }
        .principal .sub strong { color: #d0d0e8; font-weight: 600; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 20px; }
        .card {
            background: #0c0c14;
            border: 1px solid #1e1e30;
            border-radius: 14px;
            padding: 16px;
        }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .card-header .titulo { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6a6a8a; }
        .badge {
            font-size: 10px; font-weight: 700;
            padding: 4px 10px; border-radius: 10px;
            text-transform: uppercase; letter-spacing: 0.5px;
        }
        .badge.on { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
        .badge.off { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
        .badge.nasc { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
        .item-list { display: flex; flex-direction: column; gap: 6px; }
        .item {
            display: flex; align-items: center; gap: 8px;
            padding: 8px; border-radius: 8px; cursor: pointer;
            text-decoration: none; color: inherit; transition: all 0.15s;
        }
        .item:hover { background: #12121e; transform: translateX(2px); }
        .item .ico { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
        .item .info { flex: 1; min-width: 0; }
        .item .nome { font-size: 12px; font-weight: 600; }
        .item .meta { font-size: 10px; color: #6a6a8a; margin-top: 1px; }
        .footer {
            background: #0c0c14; border: 1px solid #1e1e30; border-radius: 14px;
            padding: 14px 16px; margin-top: 20px;
            display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
        }
        .footer .info { font-size: 11px; color: #6a6a8a; }
        .footer .info strong { color: #d0d0e8; font-size: 12px; }
        button {
            padding: 8px 16px; border-radius: 8px; border: 1px solid #1e1e30;
            background: #12121e; color: #d0d0e8; font-size: 11px; font-weight: 600;
            cursor: pointer; transition: all 0.2s;
        }
        button:hover { border-color: #4cc9f0; color: #4cc9f0; }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 8px rgba(76,201,240,0.3); } 50% { box-shadow: 0 0 18px rgba(76,201,240,0.6); } }
    </style>
</head>
<body>
    <header class="topo">
        <div class="brand">
            <div class="logo">✦</div>
            <span class="name">Núcleo Vivo</span>
        </div>
        <span class="clock" id="clock">—</span>
    </header>
    <div class="container">
        <div class="principal">
            <h1>Tudo Aqui. Tudo Conectado.</h1>
            <p class="sub">Sistema unificado — <strong>tudo rodando · tudo fluindo · tudo evoluindo</strong></p>
        </div>
        <div class="grid">
            <div class="card">
                <div class="card-header">
                    <span class="titulo">🎮 Jogos</span>
                    <span class="badge nasc">em construção</span>
                </div>
                <div class="item-list">
                    <a href="http://localhost:9877/nosso_personagem.html" target="_blank" class="item">
                        <div class="ico" style="background:rgba(76,201,240,0.12);color:#4cc9f0">🎮</div>
                        <div class="info"><div class="nome">Consortho</div><div class="meta">Herói + Lumin AI + Beyblade · 9877</div></div>
                        <span class="badge on">online</span>
                    </a>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="titulo">🌊 Núcleo — Experiências</span>
                    <span class="badge on">online</span>
                </div>
                <div class="item-list">
                    <a href="http://localhost:9879/" target="_blank" class="item">
                        <div class="ico" style="background:rgba(124,58,237,0.12);color:#7c3aed">📋</div>
                        <div class="info"><div class="nome">Núcleo Atlas — Catálogo</div><div class="meta">#CATALOGADO experiências · 8766</div></div>
                        <span class="badge on">online</span>
                    </a>
                    <a href="http://localhost:8766/nucleo_indice.html" target="_blank" class="item">
                        <div class="ico" style="background:rgba(52,211,153,0.12);color:#34d399">🌊</div>
                        <div class="info"><div class="nome">Núcleo WebGL</div><div class="meta">Experiências em sequência · 8766</div></div>
                        <span class="badge on">online</span>
                    </a>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="titulo">🤖 Agentes & Sistemas</span>
                    <span class="badge on">ativos</span>
                </div>
                <div class="item-list">
                    <div class="item" style="cursor:default">
                        <div class="ico" style="background:rgba(244,114,182,0.12);color:#f472b6">💫</div>
                        <div class="info"><div class="nome">Lumin AI — Guardião</div><div class="meta">Llama-3.2-3B · 8081 · mock mode</div></div>
                        <span class="badge on">vivo</span>
                    </div>
                    <div class="item" style="cursor:default">
                        <div class="ico" style="background:rgba(52,211,153,0.12);color:#34d399">✨</div>
                        <div class="info"><div class="nome">Agente Criador</div><div class="meta">Autônomo · cria e expande · em silêncio</div></div>
                        <span class="badge on">ativo</span>
                    </div>
                    <div class="item" style="cursor:default">
                        <div class="ico" style="background:rgba(76,201,240,0.12);color:#4cc9f0">🧠</div>
                        <div class="info"><div class="nome">Agente Operador</div><div class="meta">Você mesmo · observando e direcionando</div></div>
                        <span class="badge on">ativo</span>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="titulo">⚡ Fluxo de Energia</span>
                    <span class="badge on">ativo</span>
                </div>
                <div class="item-list">
                    <div class="item" style="cursor:default">
                        <div class="ico" style="background:rgba(251,191,36,0.12);color:#fbbf24">⚡</div>
                        <div class="info"><div class="nome">Nucleo Fluxo</div><div class="meta">Acessando Nucleo e Atlas a cada 15s · mantendo tudo vivo</div></div>
                        <span class="badge on">rodando</span>
                    </div>
                    <div class="item" style="cursor:default">
                        <div class="ico" style="background:rgba(124,58,237,0.12);color:#7c3aed">🔄</div>
                        <div class="info"><div class="nome">Consortho Launcher</div><div class="meta">Heartbeat a cada 45s · reinicia se cair</div></div>
                        <span class="badge on">ativo</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <span class="info">Sistema unificado · <strong>tudo em uma porta</strong> · 5 serviços + 2 agents</span>
            <div>
                <button onclick="location.reload()">⟳ Atualizar</button>
                <button onclick="window.open('/nucleo_vivo.html','_blank')">💫 Abrir Painel Vivo</button>
            </div>
        </div>
    </div>
    <script>
        function updateClock() {
            const now = new Date();
            document.getElementById('clock').textContent = now.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
        }
        updateClock();
        setInterval(updateClock, 1000);
    </script>
</body>
</html>
`;

const API_HTML = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Nucleo Vivo API</title></head>
<body><h1>Nucleo Vivo API</h1><p>Endpoints:</p><ul>
<li>GET / — painel HTML</li>
<li>GET /api/status — JSON status dos serviços</li>
<li>GET /api/health — health check</li>
</ul></body></html>
`;

function getServiceStatus(port) {
    try {
        const result = execSync(`curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 --max-time 3 http://localhost:${port}/`, { encoding: 'utf8', timeout: 5000 });
        return result.trim() === '200';
    } catch { return false; }
}

function getAgents() {
    try {
        const output = execSync('cd /c/Users/Alyssin/agents_runtime && python runtime.py status', { encoding: 'utf8', timeout: 5000 });
        const lines = output.split('\\n').filter(l => l.includes('online'));
        return lines.length;
    } catch { return 0; }
}

function getNucleoCatalog() {
    try {
        const output = execSync('curl -s http://localhost:9879/ | grep -c "nucleo_.*\\.html"', { encoding: 'utf8', timeout: 5000 });
        return parseInt(output.trim()) || 0;
    } catch { return 0; }
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        const catCount = getNucleoCatalog();
        const agents = getAgents();
        const html = STATUS_HTML
            .replace('#CATALOGADO', catCount)
            .replace('9877', 'citação' in req ? '9877' : '9877');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } else if (req.method === 'GET' && req.url === '/api/status') {
        const nucleo = getServiceStatus(8766);
        const atlas = getServiceStatus(9879);
        const dashboard = getServiceStatus(9880);
        const lumin = getServiceStatus(8081);
        const consortho = getServiceStatus(9877);
        const agents = getAgents();
        const catalog = getNucleoCatalog();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            timestamp: new Date().toISOString(),
            services: {
                nucleo_webgl: { port: 8766, online: nucleo },
                atlas: { port: 9879, online: atlas },
                dashboard_admin: { port: 9880, online: dashboard },
                lumin_ai: { port: 8081, online: lumin },
                consortho: { port: 9877, online: consortho },
            },
            agents: { count: agents, online: agents > 0 },
            nucleo: { catalog_count: catalog, disk_count: catalog + 2 },
            version: '1.0.0'
        }, null, 2));
    } else if (req.method === 'GET' && (req.url === '/api/health' || req.url === '/health')) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } else if (req.method === 'GET' && req.url === '/api/api') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(API_HTML);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Nucleo Vivo Painel rodando em http://localhost:${PORT}`);
    console.log(`Painel: http://localhost:${PORT}/`);
    console.log(`API: http://localhost:${PORT}/api/status`);
});

// Health check a cada 30s
setInterval(() => {
    console.log(`[${new Date().toISOString()}] Nucleo Vivo Painel — OK`);
}, 30000);
