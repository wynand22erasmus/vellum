#!/bin/sh
set -e

# Bind mounts hide image node_modules; populate the named volume on first run
# and re-install when package-lock.json changes.
DEPS_STAMP=node_modules/.package-lock.sha
if [ -f package-lock.json ]; then
  CURRENT_SHA=$(sha256sum package-lock.json | awk '{print $1}')
else
  CURRENT_SHA=""
fi

needs_install=0
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  needs_install=1
elif [ ! -f "$DEPS_STAMP" ] || [ "$(cat "$DEPS_STAMP" 2>/dev/null)" != "$CURRENT_SHA" ]; then
  needs_install=1
fi

if [ "$needs_install" -eq 1 ]; then
  echo "[entrypoint] Installing dependencies..."
  PUPPETEER_SKIP_DOWNLOAD=true npm ci
  if [ -n "$CURRENT_SHA" ]; then
    echo "$CURRENT_SHA" > "$DEPS_STAMP"
  fi
  npx prisma generate
fi

echo "[entrypoint] Waiting for database..."
until npx prisma migrate deploy; do
  echo "[entrypoint] Database not ready, retrying in 3s..."
  sleep 3
done

echo "[entrypoint] Database migrations applied."
exec "$@"
