# Environment configuration

Runtime configuration is read in `src/lib/env.ts`. Copy `.env.example` (host) or `.env.docker.example` (Compose) and adjust values.

## Container images (Compose / Podman / Docker)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VELLUM_PROJECT` | No | `vellum` | Project prefix for built image names and OCI labels (`com.vellum.project`) |
| `VELLUM_ENV` | No | `development` | Environment tag: **`development`** or **`production`** only. Sets image tags (`vellum-app:development`, etc.) and label `com.vellum.environment` |
| `VELLUM_BUILD_TARGET` | No | derived | Dockerfile stage: `dev` when `VELLUM_ENV=development`, `production` when `VELLUM_ENV=production`. Override only if needed |

Built services (`app`, `worker`) publish images named `{VELLUM_PROJECT}-{service}:{VELLUM_ENV}` (for example `vellum-app:development`, `vellum-worker:production`). Third-party images (Postgres, Redis, etc.) keep upstream tags; Compose adds the same `com.vellum.*` labels on those containers for stack identification.

`scripts/compose.sh` validates `VELLUM_ENV` and exports `VELLUM_BUILD_TARGET` before invoking Compose.

## Application runtime

| Variable | Required | Default (dev) | Description |
|----------|----------|---------------|-------------|
| `NODE_ENV` | No | `development` | `production` enables static SPA serving and stricter logging |
| `VELLUM_HOST` | No | `localhost` | Public hostname for links, nginx, and Vite (substitute your domain) |
| `VELLUM_PUBLIC_SCHEME` | No | `http` | URL scheme when deriving `APP_URL` |
| `VELLUM_PUBLIC_PORT` | No | `5174` (localhost) / unset (other hosts) | Public port when deriving `APP_URL` (web UI origin for email links) |
| `APP_URL` | No | derived from `VELLUM_*` | Public base URL for links in email (overrides derivation) |
| `PORT` | No | `3000` | HTTP listen port (production Node server) |
| `API_KEY` | No | `dev-api-key-change-in-production` | Bearer token for `POST /api/upload` |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `REDIS_URL` | No | `redis://localhost:6379` | BullMQ and health checks |
| `MINIO_ENDPOINT` | No | `http://localhost:9000` | S3 endpoint for server-side I/O (upload, delete) |
| `MINIO_PUBLIC_ENDPOINT` | No | derived | Browser-reachable URL for presigned downloads. When `MINIO_ENDPOINT` uses hostname `minio` (Compose), defaults to `http://{VELLUM_HOST}:9000` |
| `MINIO_ROOT_USER` | No | `minioadmin` | S3 access key |
| `MINIO_ROOT_PASSWORD` | No | `minioadmin` | S3 secret key |
| `MINIO_BUCKET_NAME` | No | `vellum-documents` | Object storage bucket |
| `AWS_REGION` | No | `us-east-1` | Region for SES / S3 in production |
| `CLAMAV_HOST` | No | `localhost` | ClamAV daemon host |
| `CLAMAV_PORT` | No | `3310` | ClamAV INSTREAM port |
| `AUTH_PROVIDER` | No | `dev` | `dev` (mock dashboard) or `workos` |
| `DEFAULT_ADMIN_EMAILS` | No | `["wynand22erasmus@gmail.com"]` | JSON array of emails assigned {@link UserKind} `ADMIN` on sign-in |
| `SKIP_EMAIL_VERIFICATION` | No | `false` | Dev/E2E only: allow dashboard access without verified email (ignored in production) |
| `SESSION_SECRET` | No | dev placeholder | Signs dashboard session JWT (`vellum_session` cookie; 32+ chars in prod) |
| `WORKOS_API_KEY` | If WorkOS | — | WorkOS API key |
| `WORKOS_CLIENT_ID` | If WorkOS | — | WorkOS client ID |
| `WORKOS_REDIRECT_URI` | No | `{APP_URL}/api/auth/callback` | OAuth redirect URL |
| `EMAIL_PROVIDER` | No | `local` | `local` (Mailpit) or `ses` |
| `MAILPIT_HOST` | No | `localhost` | SMTP host for local provider |
| `MAILPIT_PORT` | No | `1025` | SMTP port for local provider |
| `PRISMA_STUDIO_PORT` | No | `5555` | Prisma Studio in the **postgres** container |
| `DB_ADMIN_PORT` | No | `8081` | Adminer SQL UI in the **postgres** container |
| `DATABASE_URL_HOST` | No | — | PostgreSQL URL for host-side tools when Compose is not running (`localhost:5432`) |
| `REPORTING_LIFETIME_YEARS` | No | `5` | Audit log retention horizon |
| `MAX_UPLOAD_BYTES` | No | `52428800` (50 MiB) | Upload size limit |
| `ALLOWED_UPLOAD_EXTENSIONS` | No | built-in list (pdf, txt, docx, …) | JSON array of allowed extensions without dots (e.g. `["pdf","txt"]`). Use `["*"]` to allow any extension; misleading trailing types (e.g. `.pdf.exe`) are still stripped from stored filenames |
| `SKIP_VIRUS_SCAN` | No | `false` | Skip ClamAV on upload in non-production (for E2E when scanner is slow) |

## E2E-only variables

| Variable | Default | Description |
|----------|---------|-------------|
| `E2E_BASE_URL` | derived `APP_URL` | Target URL for Puppeteer tests |
| `E2E_TIMEOUT_MS` | `30000` | Default Puppeteer timeout |
| `E2E_HEADLESS` | `true` | Set `false` to watch the browser |
| `E2E_SEED_RETRIES` | `3` | Upload retries before DB/MinIO fallback |
| `DATABASE_URL` | localhost default | Used by seed fallback (host: `localhost:5432`) |
| `MINIO_ENDPOINT` | `http://localhost:9000` | Used by seed fallback |

## Users table

WorkOS and dev sign-in upsert rows into the Postgres `users` table:

| Column | Description |
|--------|-------------|
| `email` | Normalized lowercase address |
| `emailVerified` | From WorkOS, or dev link at `GET /api/auth/verify-email` — required before sign-in |
| `kind` | `ADMIN` or `CONSUMER` — admins are listed in `DEFAULT_ADMIN_EMAILS` |
| `firstName`, `lastName`, `profilePictureUrl` | From WorkOS profile |

### Dashboard session

After successful sign-in (WorkOS callback or dev `POST /api/auth/dev/request-login` when verified), the API sets an HTTP-only cookie:

| Cookie | Purpose |
|--------|---------|
| `vellum_session` | HS256 JWT (7 days); required for `/docs/`, `/admin`, `/api/documents`, `/api/admin`, and WorkOS mode |

`GET /api/auth/me` and dashboard API calls accept the cookie. In **dev** mode, `X-Dev-User-Email` (set by the SPA after login) is also accepted for API requests, but **not** for full-page routes such as `/docs/` — use the session cookie there. The **Data browser** at `/admin` uses the same session (and dev header for `/api/admin/*` in dev).

`POST /api/auth/logout` clears the cookie.

### Data browser (`/admin`)

Read-only UI for operators with `kind: ADMIN`: documents, users, audit logs, and failed audit rows. Requires the same session as `/docs/`. API: `GET /api/admin/*` (see server `src/routes/admin.ts`).

### API documentation (`/docs/`)

| Step | Action |
|------|--------|
| 1 | `npm run docs:api` (output under `docs/api/html/`) |
| 2 | Sign in as a user with `kind: ADMIN` |
| 3 | Open **`/docs/`** (or use the sidebar **Dev services** / **API documentation** link) |

Unauthenticated browser requests to `/docs/` redirect to sign-in with `returnTo=/docs/` and return after login. Non-admins receive `403`.

### Email verification before login

- **WorkOS:** After OAuth, users with `emailVerified: false` are redirected to `/login/email-verification` and receive a WorkOS verification email. They must verify, then sign in again.
- **Admins:** Users with `kind: ADMIN` (including emails in `DEFAULT_ADMIN_EMAILS`) may sign in without verifying email.
- **Dev:** `POST /api/auth/dev/request-login` sends a Mailpit link to `GET /api/auth/verify-email`. After verifying, return to `/login` and continue. A verified sign-in sets `vellum_session` and optional `returnTo` redirect (e.g. back to `/docs/`).
- **E2E:** Set `SKIP_EMAIL_VERIFICATION=true` in non-production only (same intent as `SKIP_VIRUS_SCAN`).

See [README.md](../README.md) for WorkOS and Docker-specific setup.
