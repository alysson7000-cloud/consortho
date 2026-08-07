#!/bin/sh
# Consortho Entrypoint - Robust startup with dependency waiting

set -e

echo "💎 Consortho Diamond Protocol - Starting..."

# Wait for dependencies (if any) - can be extended
wait_for_service() {
    local host=$1
    local port=$2
    local service=$3
    local timeout=60
    local elapsed=0
    
    echo "⏳ Waiting for $service ($host:$port)..."
    while ! nc -z "$host" "$port" 2>/dev/null; do
        if [ $elapsed -ge $timeout ]; then
            echo "⚠️ Timeout waiting for $service, continuing anyway..."
            return 0
        fi
        sleep 2
        elapsed=$((elapsed + 2))
    done
    echo "✅ $service is ready!"
}

# Wait for any external dependencies (configured via env)
if [ -n "$WAIT_FOR_HOST" ] && [ -n "$WAIT_FOR_PORT" ]; then
    wait_for_service "$WAIT_FOR_HOST" "$WAIT_FOR_PORT" "${WAIT_FOR_SERVICE:-dependency}"
fi

# Ensure directories exist with correct permissions
mkdir -p /app/memoria /app/logs /app/snapshots

# Run any database migrations or setup if needed
# (Add migration commands here when database is added)

echo "💎 Starting Consortho Diamond Protocol..."
echo "📦 9 Layers: Consciousness, Architecture, Narrative, Entropy, Love, Time, Council, Emergent, Evolution"

# Start the application
exec node server.js