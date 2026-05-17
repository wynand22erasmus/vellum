#!/bin/sh
set -e

# Bind mounts hide image node_modules; populate the named volume on first run.
if [ ! -f node_modules/.package-lock.json ] && [ ! -d node_modules/@prisma/client ]; then
  echo "[entrypoint] Installing dependencies..."
  npm ci
  npx prisma generate
fi

echo "[entrypoint] Waiting for database..."
until npx prisma migrate deploy; do
  echo "[entrypoint] Database not ready, retrying in 3s..."
  sleep 3
done

echo "[entrypoint] Database migrations applied."
exec "$@"
