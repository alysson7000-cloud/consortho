@echo off
REM ============================================
REM CONSORTHO - One Command Install & Setup (Windows)
REM ============================================
REM Usage: install.bat

goto :MAIN

REM ========== SUBROTINAS ==========
:LOG
echo [CONSORTHO] %1
goto :EOF

:SUCCESS
echo [OK] %1
goto :EOF

:WARN
echo [WARN] %1
goto :EOF

:ERROR
echo [ERROR] %1
exit /b 1

:MAIN
cd /d "%~dp0"
setlocal enabledelayedexpansion

echo ============================================
echo CONSORTHO INSTALLER v1.0 (Windows)
echo ============================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :ERROR Node.js nao encontrado. Instale em https://nodejs.org
)
echo [DEBUG] Passou Node check
call :SUCCESS Node.js

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    call :ERROR npm nao encontrado
)
echo [DEBUG] Passou NPM check
call :SUCCESS npm

REM Check PM2
pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    call :WARN PM2 nao encontrado. Instalando globalmente...
    npm install -g pm2
    if %errorlevel% neq 0 call :ERROR Falha ao instalar PM2
)
echo [DEBUG] Passou PM2 check
call :SUCCESS PM2

REM Install deps
call :LOG Instalando dependencias npm...
npm install
if %errorlevel% neq 0 call :ERROR Falha no npm install
call :SUCCESS Dependencias instaladas

REM Setup .env
if not exist .env (
    call :LOG Configurando .env...
    echo # Telegram Bot Config > .env
    echo TELEGRAM_BOT_TOKEN=SEU_TOKEN_AQUI >> .env
    echo TELEGRAM_CHAT_ID=SEU_CHAT_ID_AQUI >> .env
    call :WARN .env criado - EDITE com seu token do @BotFather e chat_id
) else (
    call :SUCCESS .env ja existe
)

REM Create memoria directory
if not exist memoria mkdir memoria
call :SUCCESS Diretorio memoria/ pronto

REM Initialize JSON files
call :LOG Inicializando arquivos JSON...

if not exist estado.json (
    echo {"c":0,"e":[],"recursos":{"madeira":100,"pedra":50,"cristal":10},"construcoes":[],"sementes":[],"lastVisited":{}} > estado.json
    call :SUCCESS estado.json criado
)

if not exist memoria\sementes.json echo [] > memoria\sementes.json & call :SUCCESS sementes.json criado
if not exist memoria\jardim.json echo {} > memoria\jardim.json & call :SUCCESS jardim.json criado
if not exist memoria\construcoes_poe.json echo [] > memoria\construcoes_poe.json & call :SUCCESS construcoes_poe.json criado

REM Setup PM2
call :LOG Configurando PM2...
pm2 start ecosystem.config.js
if %errorlevel% neq 0 call :ERROR Falha ao iniciar PM2

pm2 save
if %errorlevel% neq 0 call :WARN pm2 save falhou (execute 'pm2 startup' como admin)

REM Verify
call :LOG Verificando sistema...
timeout /t 3 /nobreak >nul

curl -s http://localhost:9877/health >nul 2>&1
if %errorlevel% equ 0 (
    call :SUCCESS Server respondendo na porta 9877
) else (
    call :WARN Server nao responde em localhost:9877 (pode estar iniciando)
)

for /f "tokens=3" %%a in ('pm2 list ^| find /c "online"') do set ONLINE=%%a
call :SUCCESS %ONLINE% agents PM2 online

REM Run tests
npm test >nul 2>&1
if %errorlevel% equ 0 (
    call :SUCCESS Test suite passando
) else (
    call :WARN Alguns testes falharam
)

echo.
echo ============================================
echo CONSORTHO INSTALADO COM SUCESSO!
echo ============================================
echo.
echo Proximos passos:
echo   1. Edite .env com seu TELEGRAM_BOT_TOKEN e CHAT_ID
echo   2. Reinicie: pm2 restart telegram-bot
echo   3. Acesse: http://localhost:9877
echo   4. Chat: http://localhost:9877/chat/
echo.
echo Comandos uteis:
echo   pm2 list              - Ver agents
echo   pm2 logs              - Ver logs
echo   pm2 monit             - Monitor interativo
echo   npm test              - Rodar testes
echo.
echo Estrutura:
echo   server.js             - Server principal (porta 9877)
echo   prototipos/           - Agents autonomos
echo   memoria/              - Estado persistente
echo   tests/                - Test suite Jest
echo.
echo Guardian ativo - auto-healing JSON + agents
echo Telegram Bot - /status /construir /lumin /recursos
echo.
echo ============================================
goto :EOF