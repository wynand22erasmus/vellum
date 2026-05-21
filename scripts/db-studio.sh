#!/usr/bin/env bash
# Prisma Studio runs inside the postgres container (supervisord). Restart postgres to recover.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

PORT="${PRISMA_STUDIO_PORT:-5555}"
ADMIN_PORT="${DB_ADMIN_PORT:-8081}"
HOST="${VELLUM_HOST:-localhost}"
STUDIO_URL="http://${HOST}:${PORT}"
ADMINER_URL="http://${HOST}:${ADMIN_PORT}/?pgsql=127.0.0.1&username=vellum&db=vellum_db"

if bash scripts/compose.sh ps 2>/dev/null | grep -qE 'postgres.*Up'; then
  if curl -sf -o /dev/null --max-time 2 "http://127.0.0.1:${PORT}/"; then
    echo "Prisma Studio: ${STUDIO_URL}"
    echo "DB Admin (Adminer): ${ADMINER_URL}"
    exit 0
  fi
  echo "Restarting postgres (Prisma Studio + Adminer run in this container)..."
  bash scripts/compose.sh up -d --build postgres
else
  echo "Starting postgres with Prisma Studio and Adminer..."
  bash scripts/compose.sh up -d --build postgres
fi

sleep 5
if curl -sf -o /dev/null --max-time 5 "http://127.0.0.1:${PORT}/"; then
  echo "Prisma Studio: ${STUDIO_URL}"
  echo "DB Admin (Adminer): ${ADMINER_URL}"
else
  echo "Postgres is up; waiting for Prisma Studio on port ${PORT}..."
  echo "Check logs: npm run db:studio:logs"
  exit 1
fi
