# Vellum E2E Test Plan

## Testable areas

| # | Area | Surface | Tool |
|---|------|---------|------|
| 1 | Health / dependencies | `GET /api/health` | Bruno + Puppeteer |
| 2 | Upload (M2M) | `POST /api/upload` | Bruno |
| 3 | Verify / download | `POST /api/verify` | Bruno + Puppeteer |
| 4 | Dashboard documents | `GET /api/documents` | Bruno + Puppeteer |
| 5 | Request new link | `POST /api/documents/:id/request-link` | Bruno + Puppeteer |
| 6 | Dev auth | `X-Dev-User-Email`, `/api/auth/me`, logout | Bruno + Puppeteer |
| 7 | WorkOS auth (disabled in dev) | `GET /api/auth/login` | Bruno |
| 8 | Home page | `/` | Puppeteer |
| 9 | Dev login page | `/login` | Puppeteer |
| 10 | Dashboard UI | `/dashboard` | Puppeteer |
| 11 | Verify page UI | `/verify/:token` | Puppeteer |
| 12 | Theme (light/dark/system) | UI toggle + `html.dark` | Puppeteer |
| 13 | Branding assets | Logo, favicon | Puppeteer |
| 14 | SPA routing | Unknown paths → `/` | Puppeteer |

## How each area is tested

| Area | Bruno | Puppeteer |
|------|-------|-----------|
| Health | `01-health/Health Check` | `e2e/tests/health.test.ts` |
| Upload | `02-upload/*` (6 requests) | Seed script (`scripts/e2e-seed.mjs`) |
| Verify | `05-verify/*` (4 requests) | `e2e/tests/verify.test.ts` |
| Documents list | `04-documents/List *` | Dashboard list in `auth-dashboard.test.ts` |
| Request link | `04-documents/Request Link*` | Dashboard button in `auth-dashboard.test.ts` |
| Dev auth | `03-auth/*` | `login.test.ts`, `auth-dashboard.test.ts` |
| WorkOS login | `03-auth/WorkOS Login Disabled` | N/A in default dev stack |
| Home | — | `home.test.ts` |
| Dev login | — | `login.test.ts` |
| Dashboard | — | `auth-dashboard.test.ts` |
| Verify UI | — | `verify.test.ts` |
| Theme | — | `theme-branding.test.ts` |
| Branding | — | `theme-branding.test.ts` |
| Routing | — | `home.test.ts` |

## Positive and negative cases

### 1. Health
- **Positive:** `200`, `status: ok`, all `checks` true — Bruno + Puppeteer.
- **Negative:** Degraded `503` when a dependency is down (stop Redis/ClamAV manually; not automated).

### 2. Upload
- **Positive:** Valid file + API key → `201` — Bruno `Upload Success`, seed script.
- **Negative:** No key, invalid key, missing file, invalid fields — Bruno.

### 3. Verify
- **Positive:** Valid token + password → `downloadUrl` / navigation away — Bruno + Puppeteer.
- **Negative:** Wrong password, invalid token, missing fields — Bruno + Puppeteer.

### 4. Documents list
- **Positive:** Dev header → list includes seeded file — Bruno + Puppeteer.
- **Negative:** No header → `401` — Bruno.

### 5. Request link
- **Positive:** Own document → `200` — Bruno + Puppeteer dashboard click.
- **Negative:** Unknown id, no auth — Bruno.

### 6. Dev auth
- **Positive:** `/api/auth/me` with header — Bruno.
- **Negative:** No header — Bruno.

### 7. WorkOS login (dev mode)
- **Negative:** `GET /api/auth/login` → `400` — Bruno.

### 8–14. UI flows
- Covered in Puppeteer suites listed above.

## Running tests

Prerequisites: stack running (`npm run up`), migrations applied.

```bash
npm run test:e2e:seed    # upload or DB fallback → e2e/.state.json + bruno Seeded env
npm run test:api         # full Bruno collection (Seeded env)
npm run test:api:smoke   # Bruno without seed (health, upload negatives, auth, verify negatives)
npm run test:e2e         # full Puppeteer suite (requires seed)
npm run test:e2e:smoke   # Puppeteer smoke (no seed)
npm run test:e2e:all     # seed + API + UI
```

### Reliability notes

- Set `SKIP_VIRUS_SCAN=true` in `.env` (see `.env.docker.example`) so uploads succeed without waiting on ClamAV INSTREAM scans.
- If upload still fails, `e2e-seed` falls back to direct MinIO + Postgres insert automatically.
- Host seed uses `DATABASE_URL=postgresql://vellum:password@localhost:5432/vellum_db` and `MINIO_ENDPOINT=http://localhost:9000`.

Environment: `E2E_BASE_URL`, `API_KEY`, `E2E_SEED_RETRIES`, `E2E_HEADLESS=false` to debug the browser.
