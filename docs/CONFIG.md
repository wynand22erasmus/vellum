# Environment configuration

Runtime configuration is read in `src/lib/env.ts`. Copy `.env.example` (host) or `.env.docker.example` (Compose) and adjust values.

| Variable | Required | Default (dev) | Description |
|----------|----------|---------------|-------------|
| `NODE_ENV` | No | `development` | `production` enables static SPA serving and stricter logging |
| `VELLUM_HOST` | No | `localhost` | Public hostname for links, nginx, and Vite (substitute your domain) |
| `VELLUM_PUBLIC_SCHEME` | No | `http` | URL scheme when deriving `APP_URL` |
| `VELLUM_PUBLIC_PORT` | No | `5173` (localhost) / unset (other hosts) | Public port when deriving `APP_URL` |
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
| `SESSION_SECRET` | No | dev placeholder | Signs dashboard session JWT (32+ chars in prod) |
| `WORKOS_API_KEY` | If WorkOS | — | WorkOS API key |
| `WORKOS_CLIENT_ID` | If WorkOS | — | WorkOS client ID |
| `WORKOS_REDIRECT_URI` | No | `{APP_URL}/api/auth/callback` | OAuth redirect URL |
| `EMAIL_PROVIDER` | No | `local` | `local` (Mailpit) or `ses` |
| `MAILPIT_HOST` | No | `localhost` | SMTP host for local provider |
| `MAILPIT_PORT` | No | `1025` | SMTP port for local provider |
| `REPORTING_LIFETIME_YEARS` | No | `5` | Audit log retention horizon |
| `MAX_UPLOAD_BYTES` | No | `52428800` (50 MiB) | Upload size limit |
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

Admins can open generated API docs at **`/docs/`** (run `npm run docs:api` first). The home page shows an **API documentation** link when signed in as an admin.

### Email verification before login

- **WorkOS:** After OAuth, users with `emailVerified: false` are redirected to `/login/email-verification` and receive a WorkOS verification email. They must verify, then sign in again.
- **Admins:** Users with `kind: ADMIN` (including emails in `DEFAULT_ADMIN_EMAILS`) may sign in without verifying email.
- **Dev:** `POST /api/auth/dev/request-login` sends a Mailpit link to `GET /api/auth/verify-email`. After verifying, return to `/login` and continue.
- **E2E:** Set `SKIP_EMAIL_VERIFICATION=true` in non-production only (same intent as `SKIP_VIRUS_SCAN`).

See [README.md](../README.md) for WorkOS and Docker-specific setup.
