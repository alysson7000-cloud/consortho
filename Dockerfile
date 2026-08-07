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
    netcat-openbsd \
    && ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
    && echo "America/Sao_Paulo" > /etc/timezone

# Create non-root user (use 1001 to avoid conflicts with base image)
RUN addgroup -g 1001 -S consortho \
    && adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G consortho consortho

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit --progress=false \
    && npm cache clean --force

# Copy ENTIRE built application from builder (single COPY = never miss files)
COPY --from=builder --chown=1001:1001 /app/ ./

# Create necessary directories
RUN mkdir -p /app/memoria /app/logs /app/snapshots \
    && chown -R 1001:1001 /app

# Switch to non-root user
USER consortho

# Expose port
EXPOSE 9877

# Health check - more generous timing, checks actual JSON response
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
    CMD curl -fsS http://localhost:9877/api/resumo | grep -q '"status"' || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--", "/app/entrypoint.sh"]

# ============================================================
# LABELS
# ============================================================
LABEL org.opencontainers.image.title="Consortho - Diamond Protocol"
LABEL org.opencontainers.image.description="9-Layer Autonomous Living System"
LABEL org.opencontainers.image.version="9.0.0"
LABEL org.opencontainers.image.authors="Alysson & Lumin"
LABEL org.opencontainers.image.source="https://github.com/alysson7000-cloud/consortho"
LABEL org.opencontainers.image.licenses="MIT"