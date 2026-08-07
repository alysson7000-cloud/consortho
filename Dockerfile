# Consortho - Diamond Protocol Production Deployment
# Multi-stage build for minimal production image

# ============================================================
# BUILD STAGE
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci --prefer-offline --no-audit --progress=false

# Copy source code
COPY . .

# Run tests to verify build
RUN npm test --if-present

# ============================================================
# PRODUCTION STAGE
# ============================================================
FROM node:22-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    tzdata \
    && ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
    && echo "America/Sao_Paulo" > /etc/timezone

# Create non-root user (use 1001 to avoid conflicts with base image)
RUN addgroup -g 1001 -S consortho \
    && adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G consortho consortho

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --prefer-offline --no-audit --progress=false \
    && npm cache clean --force

# Copy built application from builder
COPY --from=builder --chown=consortho:consortho /app/server.js ./
COPY --from=builder --chown=consortho:consortho /app/diamond_protocol.js ./
COPY --from=builder --chown=consortho:consortho /app/consciousness_substrate.js ./
COPY --from=builder --chown=consortho:consortho /app/self_improving_architecture.js ./
COPY --from=builder --chown=consortho:consortho /app/narrative_immortality.js ./
COPY --from=builder --chown=consortho:consortho /app/entropy_reversal_engine.js ./
COPY --from=builder --chown=consortho:consortho /app/love_fundamental_force.js ./
COPY --from=builder --chown=consortho:consortho /app/time_machine.js ./
COPY --from=builder --chown=consortho:consortho /app/council_ai_director.js ./
COPY --from=builder --chown=consortho:consortho /app/emergent_narratives.js ./
COPY --from=builder --chown=consortho:consortho /app/evolution_engine.js ./
COPY --from=builder --chown=consortho:consortho /app/utils ./utils
COPY --from=builder --chown=consortho:consortho /app/public ./public
COPY --from=builder --chown=consortho:consortho /app/consortho ./consortho

# Create necessary directories
RUN mkdir -p /app/memoria /app/logs /app/snapshots \
    && chown -R 1001:1001 /app

# Switch to non-root user
USER consortho

# Expose port
EXPOSE 9877

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:9877/api/resumo || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "server.js"]

# ============================================================
# LABELS
# ============================================================
LABEL org.opencontainers.image.title="Consortho - Diamond Protocol"
LABEL org.opencontainers.image.description="9-Layer Autonomous Living System"
LABEL org.opencontainers.image.version="9.0.0"
LABEL org.opencontainers.image.authors="Alysson & Lumin"
LABEL org.opencontainers.image.source="https://github.com/alysson7000-cloud/consortho"
LABEL org.opencontainers.image.licenses="MIT"