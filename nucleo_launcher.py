#!/usr/bin/env python3
"""Nucleo Hub — Launcher inteligente que resolve conflitos de porta automaticamente."""
import subprocess
import time
import socket
import os

def log(msg):
    print(f"[hub] {msg}")

def is_port_free(port):
    try:
        with socket.create_connection(('localhost', port), timeout=1):
            return False
    except (ConnectionRefusedError, OSError):
        return True

def kill_port(port):
    """Find and kill process using port."""
    result = subprocess.run(
        ['cmd', '/c', 'netstat', '-ano', '|', 'findstr', f':{port} ', '|', 'findstr', 'LISTENING'],
        capture_output=True, text=True, timeout=5
    )
    pids = []
    for line in result.stdout.strip().split('\n'):
        parts = line.split()
        if len(parts) >= 5:
            try:
                pids.append(int(parts[-1]))
            except:
                pass
    for pid in pids:
        subprocess.run(['taskkill', '/F', '/PID', str(pid)], capture_output=True, timeout=3)
        log(f"  Matou PID {pid} na porta {port}")
    return len(pids) > 0

def start(cmd, cwd=None):
    """Start process and return PID."""
    if cwd:
        full_cmd = f'cd /d "{cwd}" && {cmd}'
    else:
        full_cmd = cmd
    proc = subprocess.Popen(
        full_cmd, shell=True, 
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    return proc.pid

def wait_port(port, timeout=10):
    """Wait until port is listening."""
    start = time.time()
    while time.time() - start < timeout:
        if is_port_free(port):
            time.sleep(0.5)
        else:
            return True
    return not is_port_free(port)

BASE = '/c/Users/Alyssin/estudio_criacao/consortho'
NUC = '/c/Users/Alyssin/nucleo'

SERVERS = [
    {
        'name': 'Consortho',
        'port': 9877,
        'cmd': 'node server.js > server.log 2>&1',
        'cwd': BASE,
        'log': f'{BASE}/server.log'
    },
    {
        'name': 'Nucleo HTTP',
        'port': 8766,
        'cmd': f'python3 nucleo_http_server.py > nucleo.log 2>&1',
        'cwd': NUC,
        'log': f'{NUC}/nucleo.log'
    },
    {
        'name': 'Lumin Cloud',
        'port': 8767,
        'cmd': f'python3 lumin_cloud_server.py > lumin_cloud.log 2>&1',
        'cwd': NUC,
        'log': f'{NUC}/lumin_cloud.log'
    },
    {
        'name': 'Atlas',
        'port': 9879,
        'cmd': f'python3 nucleo_atlas_server.py > atlas.log 2>&1',
        'cwd': NUC,
        'log': f'{NUC}/atlas.log'
    },
    {
        'name': 'Admin',
        'port': 9880,
        'cmd': f'python3 nucleo_dashboard_admin.py --port 9880 > dash.log 2>&1',
        'cwd': NUC,
        'log': f'{NUC}/dash.log'
    },
    {
        'name': 'Lumin AI',
        'port': 8081,
        'cmd': f'python3 lumin_server.py > lumin.log 2>&1',
        'cwd': BASE,
        'log': f'{BASE}/lumin.log'
    },
]

def main():
    print("╔══════════════════════════════════════════╗")
    print("║    NÚCLEO LUMIN — Hub Launcher           ║")
    print("║    2026-08-28                            ║")
    print("╚══════════════════════════════════════════╝")
    print()
    
    pids = []
    
    for srv in SERVERS:
        name = srv['name']
        port = srv['port']
        log(f"--- {name} (port {port}) ---")
        
        # Kill existing on port
        if not is_port_free(port):
            log(f"  Porta {port} ocupada — matando processo...")
            kill_port(port)
            time.sleep(1)
        
        # Start server
        pid = start(srv['cmd'], srv['cwd'])
        pids.append((name, pid))
        log(f"  Iniciado PID={pid}")
        
        # Esperar porta
        if wait_port(port):
            log(f"  ✓ Online em http://localhost:{port}/")
        else:
            log(f"  ✗ Falha — ver log: {srv['log']}")
    
    print()
    print("╔══════════════════════════════════════════╗")
    print("║    STATUS FINAL                           ║")
    print("╚══════════════════════════════════════════╝")
    
    all_ok = True
    for srv in SERVERS:
        port = srv['port']
        name = srv['name']
        if is_port_free(port):
            log(f"  ✗ {name} — port {port} offline", "red")
            all_ok = False
        else:
            log(f"  ✓ {name} — port {port} online")
    
    print()
    if all_ok:
        log("═" * 50)
        log("  TODOS ONLINE ✦")
        log("  Hub: http://localhost:9877/nucleo_hub_unificado.html")
        log("  WebGL: http://localhost:8766/")
        log("  Consortho: http://localhost:9877/")
        log("═" * 50)
    else:
        log("  ALGUNS FORA — ver logs")
    
    log("")
    log("Para parar todos: taskkill /F /IM python.exe /IM node.exe")
    log("Ou: Ctrl+C")
    
    # Monitor
    log("")
    log("Monitorando (Ctrl+C para parar)...")
    try:
        while True:
            time.sleep(30)
            for srv in SERVERS:
                if is_port_free(srv['port']):
                    log(f"  ⚠ {srv['name']} caiu!")
    except KeyboardInterrupt:
        log("\nParando...")
        for name, pid in pids:
            try:
                os.kill(pid, 9)
            except:
                pass

if __name__ == '__main__':
    main()
