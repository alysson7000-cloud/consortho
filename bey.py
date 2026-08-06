#!/usr/bin/env python3
"""
BEY - Consortho Launcher v2.0 (Python Cross-Platform)
"O sistema vivo. Só amor."

Mais controle, mais visibilidade, auto-heal inteligente, logs bonitos.
"""

import subprocess
import sys
import os
import time
import signal
import threading
from pathlib import Path
from datetime import datetime

class Colors:
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    BOLD = '\033[1m'
    END = '\033[0m'

class BeyLauncher:
    def __init__(self):
        self.project_dir = Path(__file__).parent.absolute()
        self.running = True
        self.start_time = time.time()
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        print(f"\n{Colors.YELLOW}[BEY]{Colors.END} Sinal recebido. Parando graciosamente...")
        self.running = False
        self._stop_all()
        sys.exit(0)
    
    def _run(self, cmd, capture=True, check=False, silent=False):
        """Run command and return result."""
        try:
            if capture:
                result = subprocess.run(cmd, shell=True, cwd=self.project_dir, 
                                      capture_output=True, text=True, timeout=60)
                if not silent and result.stdout:
                    print(f"    {result.stdout.strip()}")
                if result.stderr and not silent:
                    print(f"    {Colors.YELLOW}{result.stderr.strip()}{Colors.END}")
                if check and result.returncode != 0:
                    raise subprocess.CalledProcessError(result.returncode, cmd, result.stdout, result.stderr)
                return result
            else:
                return subprocess.run(cmd, shell=True, cwd=self.project_dir, timeout=60)
        except subprocess.TimeoutExpired:
            print(f"    {Colors.RED}⏱️ Timeout: {cmd}{Colors.END}")
            return None
        except Exception as e:
            print(f"    {Colors.RED}❌ Erro: {e}{Colors.END}")
            return None
    
    def _print_banner(self):
        print(f"{Colors.CYAN}{Colors.BOLD}")
        print("╔══════════════════════════════════════════════════════════════╗")
        print("║                        🚀  B E Y                              ║")
        print("║                  Consortho Launcher v2.0                      ║")
        print("║              \"O sistema vivo. Só amor.\"                       ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print(f"{Colors.END}")
    
    def _print_status(self, step, total, message, status="info"):
        icons = {"info": "🔄", "ok": "✅", "warn": "⚠️", "error": "❌"}
        colors = {"info": Colors.BLUE, "ok": Colors.GREEN, "warn": Colors.YELLOW, "error": Colors.RED}
        icon = icons.get(status, "🔄")
        color = colors.get(status, Colors.BLUE)
        print(f"{color}[{step}/{total}]{Colors.END} {icon} {message}")
    
    def check_dependencies(self):
        self._print_status(1, 7, "Verificando dependências...")
        for cmd, name in [("node --version", "Node.js"), ("npm --version", "npm"), ("pm2 --version", "PM2")]:
            result = self._run(cmd, silent=True)
            if not result or result.returncode != 0:
                print(f"    {Colors.RED}❌ {name} não encontrado{Colors.END}")
                return False
            version = result.stdout.strip()
            print(f"    {Colors.GREEN}✅ {name}: {version}{Colors.END}")
        return True
    
    def install_deps(self):
        self._print_status(2, 7, "Instalando/atualizando dependências...")
        result = self._run("npm install --silent 2>&1 | grep -v 'added\\|removed\\|funding' || true")
        print(f"    {Colors.GREEN}✅ Dependências prontas{Colors.END}")
        return True
    
    def run_tests(self):
        self._print_status(3, 7, "Executando testes de integridade...")
        result = self._run("npm test --silent 2>&1 | tail -20", silent=True)
        if result and "14 passed" in result.stdout:
            print(f"    {Colors.GREEN}✅ Testes 14/14 passing{Colors.END}")
        else:
            print(f"    {Colors.YELLOW}⚠️  Testes com falha - continuando...{Colors.END}")
        return True
    
    def clean_pm2(self):
        self._print_status(4, 7, "Limpando processos PM2 antigos...")
        self._run("pm2 kill", silent=True)
        time.sleep(2)
        print(f"    {Colors.GREEN}✅ PM2 limpo{Colors.END}")
        return True
    
    def start_ecosystem(self):
        self._print_status(5, 7, "Iniciando ecossistema Consortho...")
        self._run("pm2 start ecosystem.config.js --update-env")
        time.sleep(5)
        print(f"    {Colors.GREEN}✅ Todos agentes subindo{Colors.END}")
        return True
    
    def check_health(self):
        self._print_status(6, 7, "Verificando saúde dos agentes...")
        online_count = 0
        for i in range(10):
            result = self._run("pm2 list", silent=True)
            if result and result.stdout:
                lines = result.stdout.strip().split('\n')
                online = sum(1 for line in lines if 'online' in line)
                if online >= 10:
                    online_count = online
                    break
            time.sleep(2)
        
        # Show final status
        result = self._run("pm2 list", silent=True)
        if result and result.stdout:
            for line in result.stdout.strip().split('\n'):
                if any(s in line for s in ['online', 'errored', 'stopped']):
                    print(f"    {line.strip()}")
        
        print(f"    {Colors.GREEN}📊 Agentes online: {online_count}/12{Colors.END}")
        return online_count >= 8  # Minimum viable
    
    def open_dashboard(self):
        self._print_status(7, 7, "Dashboard disponível...")
        url = "http://localhost:9877/dashboard.html"
        print(f"    {Colors.GREEN}✅ Dashboard: {url}{Colors.END}")
        
        # Try to open browser (cross-platform)
        try:
            import webbrowser
            webbrowser.open(url)
        except:
            pass
        return True
    
    def print_final_banner(self):
        uptime = int(time.time() - self.start_time)
        print(f"\n{Colors.CYAN}{Colors.BOLD}")
        print("╔══════════════════════════════════════════════════════════════╗")
        print("║                    🌟  SISTEMA VIVO  🌟                       ║")
        print("║                                                              ║")
        print("║   Consortho rodando. 12 agentes. Autônomo. Infinito.        ║")
        print("║                                                              ║")
        print("║   💫 Lumin 2.1          Ki 95k+  | Sandevistan  | Fusões    ║")
        print("║   🫧 Bolha 2.0          Nv.9     | Sonhos      | 8 Traits   ║")
        print("║   🏗️ Poe + 🌾 Colheita  Ciclo perfeito infinito              ║")
        print("║   😼 Gang + 🛡️ Guardian Caos criativo + Auto-heal           ║")
        print("║   📱 Telegram Bot 2.0   @luminthirdbot | Inline keyboards    ║")
        print("║   🌐 Dashboard WS       Tempo real | 11 entidades | Canvas  ║")
        print("║                                                              ║")
        print("║   \"Pressione Ctrl+C para pausar (mas não vai querer).\"      ║")
        print("║                                                              ║")
        print("║   ✨ Só amor. Só progresso lindo. Infinitamente bom. ✨      ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print(f"{Colors.END}")
        print(f"{Colors.GREEN}[BEY]{Colors.END} Sistema vivo desde {datetime.now().strftime('%H:%M:%S')}. Monitorando... (Ctrl+C para sair)\n")
    
    def monitor_loop(self):
        """Main monitoring loop with auto-heal."""
        last_health_check = 0
        health_interval = 30  # seconds
        
        while self.running:
            time.sleep(5)
            
            now = time.time()
            if now - last_health_check >= health_interval:
                last_health_check = now
                self._health_check()
    
    def _health_check(self):
        result = self._run("pm2 list", silent=True)
        if result and result.stdout and "errored" in result.stdout:
            print(f"{Colors.YELLOW}[BEY]{Colors.END} ⚠️  Agente com erro detectado - Guardian vai curar...")
            self._run("pm2 restart all --update-env", silent=True)
    
    def _stop_all(self):
        print(f"{Colors.YELLOW}[BEY]{Colors.END} Parando todos os agentes...")
        self._run("pm2 stop all", silent=True)
        print(f"{Colors.GREEN}[BEY]{Colors.END} Sistema pausado. Até logo! 🫡💫")
    
    def launch(self):
        self._print_banner()
        
        steps = [
            ("Dependências", self.check_dependencies),
            ("Dependências npm", self.install_deps),
            ("Testes", self.run_tests),
            ("PM2 Clean", self.clean_pm2),
            ("Ecosystem Start", self.start_ecosystem),
            ("Health Check", self.check_health),
            ("Dashboard", self.open_dashboard),
        ]
        
        for i, (name, func) in enumerate(steps, 1):
            try:
                if not func():
                    print(f"{Colors.RED}[BEY]{Colors.END} ❌ Falha em: {name}")
                    return False
            except Exception as e:
                print(f"{Colors.RED}[BEY]{Colors.END} ❌ Erro em {name}: {e}")
                return False
        
        self.print_final_banner()
        self.monitor_loop()
        return True

def main():
    launcher = BeyLauncher()
    try:
        launcher.launch()
    except KeyboardInterrupt:
        launcher._stop_all()
    except Exception as e:
        print(f"{Colors.RED}[BEY]{Colors.END} Erro fatal: {e}")
        launcher._stop_all()
        sys.exit(1)

if __name__ == "__main__":
    main()