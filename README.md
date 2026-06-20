# Vellum

Secure, API-first document transfer platform. Every download requires both an email link (possession) and a file password (knowledge).

**Using the app (post-install):** [docs/USAGE.md](./docs/USAGE.md) — integrator upload, recipient download, admin audit export.

## Stack

- **Frontend:** Vite + React + Tailwind
- **API:** Express (`dev:api` on :8573) + Vite dev UI (`dev` on :8574); host nginx on :8580/:8680/:8780 (`nginx/vellum-host.conf`)
- **Database:** PostgreSQL + Prisma
- **Storage:** MinIO (dev) / S3 (prod)
- **Jobs:** BullMQ + Redis
- **Virus scan:** ClamAV
- **Email:** Mailpit (dev) / SES (prod)
- **Auth:** API key (upload); session cookie + dev mock or WorkOS (dashboard); admin-only TypeDoc at `/docs/` and read-only **Data browser** at `/admin`

## Quick start (containerized — recommended)

The web app, API, and background worker run in containers. Compose works with **Docker** or **Podman** (see `scripts/compose.sh`).

### 1. Environment

```bash
cp .env.docker.example .env
```

Use `.env.docker.example` so service hostnames (`postgres`, `redis`, `minio`, etc.) resolve inside the stack. For local-only development without containers, use `.env.example` instead.

Set **`VELLUM_HOST`** to your public domain (for example `devman.wtfgang.win`). The app derives email links and OAuth callbacks from `VELLUM_HOST`, `VELLUM_PUBLIC_SCHEME`, and `VELLUM_PUBLIC_PORT`, or you can set **`APP_URL`** explicitly to override. Set **`VELLUM_STAGE`** to `dev`, `test`, or `live` to pick the host port block (**85** / **86** / **87**); see `scripts/host-ports.env`. Set the same hostname as `server_name` in `nginx/vellum-host.conf` on the dev host.

**Container images** are tagged from `.env` using **`VELLUM_PROJECT`** (default `vellum`) and **`VELLUM_ENV`** (`development` or `production`). Examples: `vellum-app:development`, `vellum-worker:development`. For a production stack, set `VELLUM_ENV=production` and `NODE_ENV=production` before `npm run up` (build target `production` is selected automatically). See [docs/CONFIG.md](./docs/CONFIG.md).

### 2. Nginx on the dev host

Install the reverse proxy once on the machine that runs the stack (not in Compose):

```bash
sudo cp nginx/vellum-host.conf /etc/nginx/sites-available/vellum-host
sudo ln -sf /etc/nginx/sites-available/vellum-host /etc/nginx/sites-enabled/
# Edit server_name to match VELLUM_HOST, then:
sudo nginx -t && sudo systemctl reload nginx
```

This defines three entry points on the dev host:

| Stage | Nginx entry | API (direct) | Web UI (direct) |
|-------|-------------|--------------|-------------------|
| **dev** (`VELLUM_STAGE=dev`) | `:8580` | `:8573` | `:8574` |
| **test** | `:8680` | `:8673` | `:8674` |
| **live** | `:8780` | `:8773` | `:8774` |

Backing services use the same prefix (dev **85** example): Postgres `:8532`, Redis `:8579`, MinIO `:8500` / console `:8501`, Mailpit `:8525`, Prisma Studio `:8555`, Adminer `:8581`, SFTP `:8522`, webhooks `:8590`.

### 3. Start the full stack

```bash
npm run up
```

This builds and starts the app, worker, Postgres (with Prisma Studio and Adminer), Redis, MinIO, ClamAV, and Mailpit. Migrations run automatically on app startup.

Wait for ClamAV to become healthy on first start (2–5 minutes). Follow progress:

```bash
npm run up:logs
```

### 4. Access

| Service | URL (dev **85** ports; test/live use **86** / **87**) |
|---------|-----|
| **Web UI (via nginx)** | `http://$VELLUM_HOST:8580` |
| Web UI (direct) | `http://$VELLUM_HOST:8574` |
| API (direct) | `http://$VELLUM_HOST:8573/api/…` |
| API docs (admin) | `/docs/` after `npm run docs:api` — sign in as an admin first |
| Data browser (admin) | `/admin` — read-only lists for documents, users, audit logs (session + `ADMIN` role) |
| Prisma Studio | `http://$VELLUM_HOST:8555` (runs in **postgres** container) |
| DB Admin (Adminer) | `http://$VELLUM_HOST:8581` (runs in **postgres** container; user `vellum`, password `password`) |
| Mailpit | `http://$VELLUM_HOST:8525` |
| MinIO console | `http://$VELLUM_HOST:8501` |

In non-production, admins see a **Development** section in the left sidebar for Mailpit, MinIO, API docs, Prisma Studio, and related tools.

```bash
npm run down    # stop all services
```

## Local development (optional)

Run backing services in containers and the app on the host (requires Node.js 24 LTS+):

```bash
cp .env.example .env
npm run infra:up
npm install && npm run db:generate && npm run db:migrate:deploy
# Install host nginx once (see step 2 above), then:
npm run dev:stack   # terminal 1: API :8573 + Vite :8574
npm run worker      # terminal 2
# optional: npm run db:studio
```

Compose helper detection order: `docker compose` → `podman compose` → `docker-compose` → `podman-compose`.

The web UI uses TanStack Router at `/` (`src/routes/`, `src/pages/`, `src/components/`). The Express backend lives under `src/server/` (`create-app.ts`, `routes/`, `middleware/`, `queues/`, `workers/`). Shared hooks and helpers are in `src/hooks/` and `src/lib/`.

### Backend entrypoints

| File | Role |
|------|------|
| `src/server.ts` | Production HTTP server (container CMD). Listens on `env.port` (default 3000), serves the built SPA from `dist/` when `NODE_ENV=production`. |
| `src/api-server.ts` | Development API-only server on `PORT` / `APP_HOST_PORT` (default 8573). Used by `npm run dev:api` and the dev stack; no Vite UI. |
| `src/server/workers/index.ts` | BullMQ worker process (`npm run worker`). Registers cron schedulers and loads email, audit, scrub, and reconciliation workers. |
| `src/server/create-app.ts` | Shared Express factory: middleware, API routers, and production SPA fallback. Imported by both server entrypoints. |

## Deploying

After pulling changes that touch the API, SPA build, or envelope format, rebuild and restart the app container so `create-app.ts` serves the current `dist/` bundle and API responses:

```bash
npm run up          # rebuild + restart app, worker (compose)
# or, for a running stack:
npm run compose -- up -d --build app worker
```

The worker container should be restarted when queue handlers or `src/server/workers/` change. Host nginx proxies to published ports on the dev machine; restart the app container after API or SPA changes so it serves the current bundle and routes.

## API usage

### Upload (machine-to-machine)

```bash
curl -X POST http://localhost:8573/api/upload \
  -H "Authorization: Bearer dev-api-key-change-in-production" \
  -F "file=@document.pdf" \
  -F "recipientEmail=recipient@example.com" \
  -F "password=securepass123" \
  -F "linkTtl=86400" \
  -F "fileTtl=604800"
```

The response includes a warning: communicate the file password via a **separate channel** (not the same email as the download link).

Allowed file types come from `ALLOWED_UPLOAD_EXTENSIONS` (JSON array of extensions without dots; see [docs/CONFIG.md](./docs/CONFIG.md)). The server strips misleading trailing extensions such as `.pdf.exe` from the stored filename, then checks the remaining extension.

### Download (recipient)

1. Open the link from email: `/verify/{token}`
2. Enter the file password
3. Download starts; the tab shows a completion screen (`/verify/{token}/complete`)

### Dashboard sign-in

Dashboard routes use a **`vellum_session` HTTP-only cookie** (7-day JWT). In dev mode, the SPA also stores your email in `localStorage` and sends `X-Dev-User-Email` on `fetch` calls for backward compatibility.

#### Dev auth (`AUTH_PROVIDER=dev`, default)

1. Visit `/login` and enter your email.
2. If the address is not verified, open the link in **Mailpit** (`GET /api/auth/verify-email`), then sign in again.
3. On success you receive a session cookie and land on `/dashboard` (or the page you were trying to open).
4. Use **Send access link** to regenerate a download email (download still requires the email link + file password).

**Admins** (emails in `DEFAULT_ADMIN_EMAILS`) may sign in without email verification. For automated E2E only, set `SKIP_EMAIL_VERIFICATION=true` in non-production (see `.env.docker.example`).

#### WorkOS (`AUTH_PROVIDER=workos`)

Set in `.env`:

```bash
AUTH_PROVIDER=workos
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=https://your-domain/api/auth/callback
SESSION_SECRET=...   # 32+ random characters
```

- Sign in: `GET /api/auth/login` (or follow the redirect when opening a protected page such as `/docs/`).
- Callback: `GET /api/auth/callback` sets `vellum_session` and redirects to `/dashboard`, or to a same-origin `returnTo` path passed through OAuth `state`.
- Unverified consumers are sent to `/login/email-verification` until they confirm email (admins may sign in without verification).

## Health check

```bash
curl http://localhost:8573/api/health
```

Success responses use the VellumResult envelope (`Content-Type: application/vnd.vellum.result+json`). Read dependency status from `data.status` and `data.checks` (not top-level fields). See [docs/ERROR_HANDLING.md](./docs/ERROR_HANDLING.md).

## E2E tests (Bruno + Puppeteer)

Requires the stack to be up and ClamAV healthy. See [docs/e2e-test-plan.md](./docs/e2e-test-plan.md) for coverage matrix.

On a new machine, install Puppeteer’s Chrome once before browser tests:

```bash
npm run test:e2e:prepare   # first time only — Chrome → .cache/puppeteer
```

```bash
npm run test:e2e:seed    # seed document (upload or DB fallback)
npm run test:api         # Bruno API collection (needs seed)
npm run test:api:smoke   # Bruno smoke tests (no seed)
npm run test:api:remote  # Bruno full suite using Remote env (edit bruno/…/Remote.bru)
npm run test:e2e         # Puppeteer browser tests (needs seed; uses http://localhost:8574)
npm run test:e2e:smoke   # Puppeteer smoke (no seed)
npm run test:e2e:all     # seed + API + UI
```

Bruno workspace: [bruno/README.md](./bruno/README.md). Set `SKIP_VIRUS_SCAN=true` in `.env` for reliable uploads during E2E (see `.env.docker.example`). Optional: `E2E_BASE_URL` (UI default `http://localhost:8574`), `E2E_HEADLESS=false`.

## API reference (TypeDoc)

Generate HTML and Markdown API docs from TSDoc comments:

```bash
npm run docs:api          # docs/api/html + docs/api/markdown
npm run docs:coverage     # coverage gate + docs/doc-inventory.json
```

**Viewing HTML docs**

| Requirement | Detail |
|---------------|--------|
| Generate | Run `npm run docs:api` once (creates `docs/api/html/`) |
| Role | `ADMIN` only (`DEFAULT_ADMIN_EMAILS` on first sign-in) |
| URL | **`/docs/`** (admin-only; uses the same `vellum_session` cookie as the dashboard) |
| Discover | Sidebar when signed in as admin; **Development** section in non-production |

If you open `/docs/` without a session, you are redirected to sign in and then returned to `/docs/`. If HTML has not been generated, the server responds with `503` and instructions to run `docs:api`.

Standards: [docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md). Environment reference: [docs/CONFIG.md](./docs/CONFIG.md). Audit events and webhooks: [docs/EVENTS_AND_WEBHOOKS.md](./docs/EVENTS_AND_WEBHOOKS.md).

## Dashboard users

Sign-in (WorkOS or dev) upserts rows in Postgres (`users` table) with `emailVerified` and `kind` (`ADMIN` or `CONSUMER`). Set default admins via JSON in `.env`:

```bash
DEFAULT_ADMIN_EMAILS=["admin@example.com"]
```

See [docs/CONFIG.md](./docs/CONFIG.md) for verification rules and session settings.

## Design document

See [Vellum_Comprehensive_Design_Document.md](./docs/Vellum_Comprehensive_Design_Document.md) for full architecture.

## AWS migration

See [docs/AWS_MIGRATION.md](./docs/AWS_MIGRATION.md).
