#!/bin/sh
set -e

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $@"
}

log "Starting muallim-api service..."

# Database connection is configured via environment variables
# TypeORM will retry automatically if connection fails

if [ -n "$DB_HOST" ]; then
  log "Using direct TCP connection: $DB_HOST:${DB_PORT:-5432}"
elif [ -n "$DB_SOCKET_PATH" ]; then
  log "Using Unix socket: $DB_SOCKET_PATH"
elif [ -n "$DATABASE_URL" ]; then
  log "Using DATABASE_URL"
else
  log "WARNING: No database configuration detected"
fi

log "Database: ${DB_NAME:-muallim_portal}"
log "Starting NestJS API server on port 8080..."
exec node dist/main "$@"
