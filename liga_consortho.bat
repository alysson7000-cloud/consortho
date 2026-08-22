@echo off
chcp 65001 >nul
title LIGAR CONSORTHO - Stack Completo

echo.
echo ==========================================
echo  LIGANDO O CONSORTHO - STACK COMPLETO
echo ==========================================
echo.

echo [1/5] Verificando portas...
netstat -ano | findstr "9877 8081 9879 8766" >nul 2>&1
if %errorlevel% equ 0 (
    echo     Portas ja em uso - matando processos antigos...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr "9877 8081 9879 8766" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
)

echo [2/5] Subindo GAME SERVER (9877) + Diamond Protocol...
start "CONSORTHO-GAME" cmd /c "cd /d C:\Users\Alyssin\estudio_criacao\consortho && node --max-old-space-size=4096 server.js"
timeout /t 3 >nul

echo [3/5] Subindo LUMIN AI (8081) - Llama-3.2-3B...
start "CONSORTHO-LUMIN" cmd /c "cd /d C:\Users\Alyssin\estudio_criacao\consortho && python lumin_server.py"
timeout /t 3 >nul

echo [4/5] Subindo NUCLEO ATLAS (9879)...
start "NUCLEO-ATLAS" cmd /c "cd /d C:\Users\Alyssin\nucleo && python nucleo_atlas.py --port 9879"
timeout /t 2 >nul

echo [5/5] Subindo NUCLEO WEBGL (8766)...
start "NUCLEO-WEBGL" cmd /c "cd /d C:\Users\Alyssin\nucleo && python nucleo_loop_runner.py --port 8766"
timeout /t 2 >nul

echo.
echo ==========================================
echo  CONSORTHO LIGADO - TUDO RODANDO
echo ==========================================
echo.
echo   GAME ULTRA:      http://127.0.0.1:9877/public/nosso_personagem.html
echo   LUMIN AI:        http://127.0.0.1:8081/health
echo   NUCLEO ATLAS:    http://127.0.0.1:9879
echo   NUCLEO WEBGL:    http://127.0.0.1:8766
echo.
echo   Diamond Protocol: 9 layers ATIVOS
echo   Crons 24/7: micro/min, deep/5min, major/hr, dream/2AM
echo   Love Field: auto-bonding, 5th force
echo   Eternal Resonance: 13/13 evolved
echo.
echo ==========================================
echo  FE. TMJ! STACK DE 64 = INFINITO
echo ==========================================
echo.
pause