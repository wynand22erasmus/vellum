#!/bin/sh
set -eu

POSTGRES_USER="${POSTGRES_USER:-vellum}"
POSTGRES_DB="${POSTGRES_DB:-vellum_db}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-password}"
STUDIO_PORT="${PRISMA_STUDIO_PORT:-5555}"

until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
  sleep 1
done

export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:5432/${POSTGRES_DB}"
cd /opt/vellum-prisma

exec npx prisma studio \
  --config ./prisma.config.ts \
  --port "$STUDIO_PORT" \
  --browser none
