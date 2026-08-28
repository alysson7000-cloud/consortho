#!/usr/bin/env python3
"""Núcleo Hub Lumin — Instalador e launcher."""
import os
import subprocess
import time
import signal
import sys

BASE = '/c/Users/Alyssin/estudio_criacao/consortho'
NUCLEO = '/c/Users/Alyssin/nucleo'

def log(msg, color='white'):
    colors = {
        'green': '\033[92m',
        'red': '\033[91m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'white': '\033[0m',
        'bold': '\033[1m'
    }
    print(f"{colors.get(color, '')}{msg}{colors['white']}")

def start_server(name, cmd, logfile):
    """Start a server process and return PID."""
    log(f"Starting {name}...")
    proc = subprocess.Popen(
        cmd, shell=True, cwd=BASE,
        stdout=open(logfile, 'w'),
        stderr=subprocess.STDOUT,
        preexec_fn=os.setsid
    )
    log(f"  PID: {proc.pid}", 'green')
    return proc

def wait_for_port(port, timeout=15):
    """Wait until a port is listening."""
    import socket
    start = time.time()
    while time.time() - start < timeout:
        try:
            sock = socket.create_connection(('localhost', port), timeout=1)
            sock.close()
            return True
        except:
            time.sleep(0.5)
    return False

def check_port(port):
    import socket
    try:
        sock = socket.create_connection(('localhost', port), timeout=2)
        sock.close()
        return True
    except:
        return False

def main():
    log("╔══════════════════════════════════════════════╗", 'bold')
    log("║     NÚCLEO LUMIN — Hub Jogo Unificado        ║", 'yellow')
    log("║       Launcher — 2026-08-28                  ║", 'bold')
    log("╚══════════════════════════════════════════════╝")
    print()

    # Start all servers
    servers = []
    
    # 1. Consortho (9877) — serves nucleo_hub_unificado.html
    log("[1/6] Consortho (9877) — hub principal...", 'blue')
    servers.append(('consortho', start_server(
        'Consortho', 
        'node server.js > server.log 2>&1',
        f'{BASE}/server.log'
    )))
    
    if wait_for_port(9877):
        log("  ✓ Consortho online", 'green')
    else:
        log("  ✗ Consortho falhou — check server.log", 'red')
    
    # 2. Nucleo HTTP (8766) — WebGL experiences
    log("[2/6] Nucleo HTTP (8766) — WebGL...", 'blue')
    servers.append(('nucleo', start_server(
        'Nucleo HTTP',
        f'cd {NUCLEO} && python3 nucleo_http_server.py > nucleo.log 2>&1',
        f'{NUCLEO}/nucleo.log'
    )))
    
    if wait_for_port(8766):
        log("  ✓ Nucleo HTTP online", 'green')
    else:
        log("  ✗ Tentando levantar...", 'yellow')
        if check_port(8766):
            log("  ✓ Nucleo HTTP online (já estava rodando)", 'green')
    
    # 3. Lumin Cloud (8767)
    log("[3/6] Lumin Cloud (8767) — jogos...", 'blue')
    servers.append(('lumin-cloud', start_server(
        'Lumin Cloud',
        f'cd {NUCLEO} && python3 lumin_cloud_server.py > lumin_cloud.log 2>&1',
        f'{NUCLEO}/lumin_cloud.log'
    )))
    
    if wait_for_port(8767):
        log("  ✓ Lumin Cloud online", 'green')
    
    # 4. Atlas (9879)
    log("[4/6] Nucleo Atlas (9879) — mapa...", 'blue')
    servers.append(('atlas', start_server(
        'Atlas',
        f'cd {NUCLEO} && python3 nucleo_atlas_server.py > atlas.log 2>&1',
        f'{NUCLEO}/atlas.log'
    )))
    
    if wait_for_port(9879):
        log("  ✓ Atlas online", 'green')
    
    # 5. Dashboard Admin (9880)
    log("[5/6] Dashboard Admin (9880) — controle...", 'blue')
    servers.append(('admin', start_server(
        'Admin',
        f'cd {NUCLEO} && python3 nucleo_dashboard_admin.py --port 9880 > dash.log 2>&1',
        f'{NUCLEO}/dash.log'
    )))
    
    if wait_for_port(9880):
        log("  ✓ Admin online", 'green')
    
    # 6. Lumin AI (8081)
    log("[6/6] Lumin AI (8081) — guardião...", 'blue')
    servers.append(('lumin-ai', start_server(
        'Lumin AI',
        f'cd {BASE} && python3 lumin_server.py > lumin.log 2>&1',
        f'{BASE}/lumin.log'
    )))
    
    if wait_for_port(8081):
        log("  ✓ Lumin AI online", 'green')
    else:
        log("  ⚠ Lumin AI não subiu (mock fallback)", 'yellow')
    
    print()
    log("╔══════════════════════════════════════════════╗", 'bold')
    log("║     STATUS FINAL                              ║", 'yellow')
    log("╚══════════════════════════════════════════════╝")
    
    all_ok = True
    for port, name in [(9877, 'Consortho'), (8766, 'Nucleo WebGL'), 
                        (8767, 'Lumin Cloud'), (9879, 'Atlas'),
                        (9880, 'Admin'), (8081, 'Lumin AI')]:
        if check_port(port):
            log(f"  ✓ {name} ({port})", 'green')
        else:
            log(f"  ✗ {name} ({port})", 'red')
            all_ok = False
    
    print()
    log("═" * 55)
    
    if all_ok:
        log("  TODOS OS SERVIÇOS ONLINE ✦", 'green')
        log("  Hub: http://localhost:9877/nucleo_hub_unificado.html", 'yellow')
        log("  Nucleo WebGL: http://localhost:8766/", 'yellow')
        log("  Consortho: http://localhost:9877/", 'yellow')
    else:
        log("  ALGUNS SERVIÇOS FORA — ver logs acima", 'red')
    
    log("═" * 55)
    log("  Para parar: killall python node", 'blue')
    log("  Ou: Ctrl+C no terminal", 'blue')
    
    # Keep running and monitor
    log("")
    log("Monitorando serviços (Ctrl+C para parar)...", 'blue')
    log("")
    
    try:
        while True:
            time.sleep(30)
            all_ok = True
            for port, name in [(9877, 'Consortho'), (8766, 'Nucleo WebGL'),
                                (8767, 'Lumin Cloud'), (9879, 'Atlas'),
                                (9880, 'Admin'), (8081, 'Lumin AI')]:
                if not check_port(port):
                    log(f"  ⚠ {name} ({port}) caiu!", 'red')
                    all_ok = False
            
            if all_ok:
                print(f"  [{time.strftime('%H:%M:%S')}] Todos online ✓", end='\r')
            
    except KeyboardInterrupt:
        log("\nParando servidores...", 'yellow')
        for name, proc in servers:
            try:
                os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
            except:
                pass
        log("Servidores parados.", 'blue')

if __name__ == '__main__':
    main()