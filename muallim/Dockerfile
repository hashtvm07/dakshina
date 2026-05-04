# Multi-stage Dockerfile for Cloud Run deployment
# Builds NestJS API + single Angular web-ui
# Supports Cloud SQL connections via socket path or DATABASE_URL

# ==============================================================================
# STAGE 1: Build all dependencies and compile projects
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files for all projects
COPY api/package*.json ./api/
COPY web-ui/package*.json ./web-ui/

# Install dependencies for all projects
# Using npm ci for reproducible installs in CI/production
RUN cd api && npm ci --prefer-offline --no-audit && \
    cd /build/web-ui && npm ci --prefer-offline --no-audit

# Copy source code
COPY api ./api
COPY web-ui ./web-ui

# Build Angular UI with error checking
RUN cd web-ui && npm run build 2>&1 && \
    if [ ! -d "dist/web-ui/browser" ]; then echo "ERROR: web-ui build failed"; exit 1; fi && \
    echo "web-ui build successful"

# Build NestJS API with error checking
RUN cd api && npm run build 2>&1 && \
    if [ ! -d "dist" ]; then echo "ERROR: api build failed"; exit 1; fi && \
    echo "api build successful"

# ==============================================================================
# STAGE 2: Runtime image with Cloud SQL Proxy
# ==============================================================================
FROM node:20-alpine AS runtime

WORKDIR /app

# Download and install Cloud SQL Proxy (for socket connections)
# Cloud Run with --add-cloudsql-instances provides automatic socket creation
RUN apk add --no-cache curl ca-certificates && \
    curl -o /app/cloud-sql-proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 && \
    chmod +x /app/cloud-sql-proxy && \
    /app/cloud-sql-proxy --version || echo "Proxy installed" && \
    apk del curl ca-certificates

# Create non-root user for security
# Use higher UID/GID to avoid conflicts with system users
RUN addgroup -g 10001 appuser && \
    adduser -D -u 10001 -G appuser appuser

# Copy API dependencies (production only)
COPY api/package*.json ./
RUN npm ci --omit=dev --prefer-offline --no-audit && \
    npm cache clean --force

# Copy compiled API from builder
COPY --from=builder /build/api/dist ./dist

# Create public directory and copy built UI
RUN mkdir -p public/web-ui

COPY --from=builder /build/web-ui/dist/web-ui/browser ./public/web-ui

# Verify UI build exists
RUN [ -f "public/web-ui/index.html" ] || (echo "ERROR: web-ui index.html not found"; exit 1)

# Set ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# ==============================================================================
# ENVIRONMENT CONFIGURATION
# ==============================================================================
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=512

# ==============================================================================
# HEALTH CHECK
# ==============================================================================
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# ==============================================================================
# STARTUP SCRIPT
# ==============================================================================
COPY --chown=appuser:appuser entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# ==============================================================================
# EXPOSE PORT
# ==============================================================================
EXPOSE 8080

# ==============================================================================
# ENTRYPOINT
# ==============================================================================
ENTRYPOINT ["/app/entrypoint.sh"]
