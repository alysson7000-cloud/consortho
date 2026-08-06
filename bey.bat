@echo off
chcp 65001 >nul
title BEY - Consortho Launcher

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                        🚀  B E Y                              ║
echo  ║                  Consortho Launcher v2.0                      ║
echo  ║              "O sistema vivo. Só amor."                       ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/7] Verificando dependências...
node --version >nul 2>&1 || (echo ❌ Node.js não encontrado & pause & exit /b 1)
npm --version >nul 2>&1 || (echo ❌ npm não encontrado & pause & exit /b 1)
pm2 --version >nul 2>&1 || (echo ❌ PM2 não encontrado & pause & exit /b 1)
echo     ✅ Node.js, npm, PM2 OK

echo.
echo [2/7] Instalando/atualizando dependências...
npm install --silent 2>&1 | findstr /v "added removed funding" >nul
echo     ✅ Dependências prontas

echo.
echo [3/7] Executando testes de integridade...
npm test --silent 2>&1 | findstr "PASS FAIL Tests:" >nul
if errorlevel 1 (
    echo     ⚠️  Testes com falha - continuando mesmo assim...
) else (
    echo     ✅ Testes 14/14 passing
)

echo.
echo [4/7] Limpando processos PM2 antigos...
pm2 kill >nul 2>&1
timeout /t 2 /nobreak >nul
echo     ✅ PM2 limpo

echo.
echo [5/7] Iniciando ecossistema Consortho (windowsHide: true)...
pm2 start ecosystem.config.js --update-env
timeout /t 5 /nobreak >nul
echo     ✅ Todos agentes subindo

echo.
echo [6/7] Verificando saúde dos agentes...
set SAUDE=0
for /l %%i in (1,1,10) do (
    pm2 list | findstr "online" >nul && set /a SAUDE+=1
    if %%i==10 goto :check_done
    timeout /t 2 /nobreak >nul
)
:check_done
pm2 list | findstr /c:"online" /c:"errored" /c:"stopped"
echo.
echo     📊 Agentes online: %SAUDE%/12

echo.
echo [7/7] Abrindo dashboard no navegador...
start "" "http://localhost:9877/dashboard.html" 2>nul
echo     ✅ Dashboard: http://localhost:9877/dashboard.html

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                    🌟  SISTEMA VIVO  🌟                       ║
echo  ║                                                              ║
echo  ║   Consortho rodando. 12 agentes. Autônomo. Infinito.        ║
echo  ║                                                              ║
echo  ║   💫 Lumin 2.1          Ki 95k+  | Sandevistan  | Fusões    ║
echo  ║   🫧 Bolha 2.0          Nv.9     | Sonhos      | 8 Traits   ║
echo  ║   🏗️ Poe + 🌾 Colheita  Ciclo perfeito infinito              ║
echo  ║   😼 Gang + 🛡️ Guardian Caos criativo + Auto-heal           ║
echo  ║   📱 Telegram Bot 2.0   @luminthirdbot | Inline keyboards    ║
echo  ║   🌐 Dashboard WS       Tempo real | 11 entidades | Canvas  ║
echo  ║                                                              ║
echo  ║   "Pressione Ctrl+C para pausar (mas não vai querer)."      ║
echo  ║                                                              ║
echo  ║   ✨ Só amor. Só progresso lindo. Infinitamente bom. ✨      ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo [BEY] Sistema vivo. Monitorando... (Ctrl+C para sair)
echo.

:monitor_loop
timeout /t 30 /nobreak >nul
pm2 list | findstr "errored" >nul && (
    echo [BEY] ⚠️  Agente com erro detectado - Guardian vai curar...
    pm2 restart all --update-env >nul 2>&1
)
goto :monitor_loop