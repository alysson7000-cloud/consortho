@echo off
REM ============================================
REM CONSORTHO - One Command Install & Setup (Windows)
REM ============================================
REM Usage: install.bat

setlocal enabledelayedexpansion

REM Colors (using ANSI if supported)
for /f %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"
set "GREEN=%ESC%[0;32m"
set "YELLOW=%ESC%[1;33m"
set "BLUE=%ESC%[0;34m"
set "RED=%ESC%[0;31m"
set "NC=%ESC%[0m"

:LOG
echo %BLUE%[CONSORTHO]%NC% %1
goto :EOF

:SUCCESS
echo %GREEN%[OK]%NC% %1
goto :EOF

:WARN
echo %YELLOW%[WARN]%NC% %1
goto :EOF

:ERROR
echo %RED%[ERROR]%NC% %1
exit /b 1

echo ============================================
echo %BLUE%🌌 CONSORTHO INSTALLER v1.0 (Windows)%NC%
echo ============================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :ERROR Node.js não encontrado. Instale em https://nodejs.org
)
for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
call :SUCCESS Node.js %NODE_VERSION%

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    call :ERROR npm não encontrado
)
for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a
call :SUCCESS npm %NPM_VERSION%

REM Check PM2
pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    call :WARN PM2 não encontrado. Instalando globalmente...
    npm install -g pm2
    if %errorlevel% neq 0 call :ERROR Falha ao instalar PM2
)
for /f "tokens=*" %%a in ('pm2 --version') do set PM2_VERSION=%%a
call :SUCCESS PM2 %PM2_VERSION%

REM Install deps
call :LOG Instalando dependências npm...
npm install
if %errorlevel% neq 0 call :ERROR Falha no npm install
call :SUCCESS Dependências instaladas

REM Setup .env
if not exist .env (
    call :LOG Configurando .env...
    echo # Telegram Bot Config > .env
    echo TELEGRAM_BOT_TOKEN=SEU_TOKEN_AQUI >> .env
    echo TELEGRAM_CHAT_ID=SEU_CHAT_ID_AQUI >> .env
    call :WARN .env criado - EDITE com seu token do @BotFather e chat_id
) else (
    call :SUCCESS .env já existe
)

REM Create memoria directory
if not exist memoria mkdir memoria
call :SUCCESS Diretório memoria/ pronto

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
    call :WARN Server não responde em localhost:9877 (pode estar iniciando)
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
echo %GREEN%🎉 CONSORTHO INSTALADO COM SUCESSO!%NC%
echo ============================================
echo.
echo 📋 Próximos passos:
echo   1. Edite .env com seu TELEGRAM_BOT_TOKEN e CHAT_ID
echo   2. Reinicie: pm2 restart telegram-bot
echo   3. Acesse: http://localhost:9877
echo   4. Chat: http://localhost:9877/chat/
echo.
echo 🤖 Comandos úteis:
echo   pm2 list              - Ver agents
echo   pm2 logs              - Ver logs
echo   pm2 monit             - Monitor interativo
echo   npm test              - Rodar testes
echo.
echo 📁 Estrutura:
echo   server.js             - Server principal (porta 9877)
echo   prototipos/           - Agents autônomos
echo   memoria/              - Estado persistente
echo   tests/                - Test suite Jest
echo.
echo 🛡️ Guardian ativo - auto-healing JSON + agents
echo 🤖 Telegram Bot - /status /construir /lumin /recursos
echo.
echo ============================================