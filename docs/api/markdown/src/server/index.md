# src/server

Production HTTP server entrypoint (`npm run` via container CMD).

## Remarks

Listens on `env.port` (default 3000). Serves the SPA from `dist/` when `NODE_ENV=production`.
