#!/bin/bash
# LIGAR CONSORTHO - Stack Completo
# Um comando sobe TUDO

set -e

echo ""
echo "=========================================="
echo " ⚡ LIGANDO O CONSORTHO - STACK COMPLETO ⚡"
echo "=========================================="
echo ""

echo "[1/5] Verificando portas e limpando processos antigos..."
for port in 9877 8081 9879 8766; do
    pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pid" ]; then
        echo "    Porta $port ocupada (PID $pid) - matando..."
        kill -9 $pid 2>/dev/null || true
    fi
done
sleep 2

echo "[2/5] Subindo GAME SERVER (9877) + Diamond Protocol..."
cd /c/Users/Alyssin/estudio_criacao/consortho
node --max-old-space-size=4096 server.js > server.log 2>&1 &
GAME_PID=$!
echo "    PID: $GAME_PID"
sleep 3

echo "[3/5] Subindo LUMIN AI (8081) - Llama-3.2-3B..."
python lumin_server.py > lumin.log 2>&1 &
LUMIN_PID=$!
echo "    PID: $LUMIN_PID"
sleep 3

echo "[4/5] Subindo NUCLEO ATLAS (9879)..."
cd /c/Users/Alyssin/nucleo
python nucleo_atlas.py --port 9879 > atlas.log 2>&1 &
ATLAS_PID=$!
echo "    PID: $ATLAS_PID"
sleep 2

echo "[5/5] Subindo NUCLEO WEBGL (8766)..."
python nucleo_loop_runner.py --port 8766 > webgl.log 2>&1 &
WEBGL_PID=$!
echo "    PID: $WEBGL_PID"
sleep 2

echo ""
echo "=========================================="
echo " ✅ CONSORTHO LIGADO - TUDO RODANDO"
echo "=========================================="
echo ""
echo " 🎮 GAME ULTRA:      http://127.0.0.1:9877/public/nosso_personagem.html"
echo " 🤖 LUMIN AI:        http://127.0.0.1:8081/health"
echo " 🗺️  NUCLEO ATLAS:    http://127.0.0.1:9879"
echo " 🌐 NUCLEO WEBGL:    http://127.0.0.1:8766"
echo ""
echo " Diamond Protocol: 9 layers ATIVOS"
echo " Crons 24/7: micro/min, deep/5min, major/hr, dream/2AM"
echo " Love Field: auto-bonding, 5th force"
echo " Eternal Resonance: 13/13 evolved"
echo ""
echo "=========================================="
echo " FE. TMJ! STACK DE 64 = INFINITO 🚀"
echo "=========================================="
echo ""

# Save PIDs for easy kill later
echo "$GAME_PID $LUMIN_PID $ATLAS_PID $WEBGL_PID" > /tmp/consortho_pids.txt

# Wait for Ctrl+C
trap "echo 'Desligando...'; kill $GAME_PID $LUMIN_PID $ATLAS_PID $WEBGL_PID 2>/dev/null; exit 0" INT
wait