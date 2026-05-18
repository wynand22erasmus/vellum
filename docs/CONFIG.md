# Environment configuration

Runtime configuration is read in `src/lib/env.ts`. Copy `.env.example` (host) or `.env.docker.example` (Compose) and adjust values.

| Variable | Required | Default (dev) | Description |
|----------|----------|---------------|-------------|
| `NODE_ENV` | No | `development` | `production` enables static SPA serving and stricter logging |
| `APP_URL` | No | `http://localhost:5173` | Public base URL for links in email |
| `PORT` | No | `3000` | HTTP listen port (production Node server) |
| `API_KEY` | No | `dev-api-key-change-in-production` | Bearer token for `POST /api/upload` |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `REDIS_URL` | No | `redis://localhost:6379` | BullMQ and health checks |
| `MINIO_ENDPOINT` | No | `http://localhost:9000` | S3-compatible endpoint (MinIO in dev) |
| `MINIO_ROOT_USER` | No | `minioadmin` | S3 access key |
| `MINIO_ROOT_PASSWORD` | No | `minioadmin` | S3 secret key |
| `MINIO_BUCKET_NAME` | No | `vellum-documents` | Object storage bucket |
| `AWS_REGION` | No | `us-east-1` | Region for SES / S3 in production |
| `CLAMAV_HOST` | No | `localhost` | ClamAV daemon host |
| `CLAMAV_PORT` | No | `3310` | ClamAV INSTREAM port |
| `AUTH_PROVIDER` | No | `dev` | `dev` (mock dashboard) or `workos` |
| `SESSION_SECRET` | No | dev placeholder | Signs dashboard session JWT (32+ chars in prod) |
| `WORKOS_API_KEY` | If WorkOS | — | WorkOS API key |
| `WORKOS_CLIENT_ID` | If WorkOS | — | WorkOS client ID |
| `WORKOS_REDIRECT_URI` | No | localhost callback | OAuth redirect URL |
| `EMAIL_PROVIDER` | No | `local` | `local` (Mailpit) or `ses` |
| `MAILPIT_HOST` | No | `localhost` | SMTP host for local provider |
| `MAILPIT_PORT` | No | `1025` | SMTP port for local provider |
| `REPORTING_LIFETIME_YEARS` | No | `5` | Audit log retention horizon |
| `MAX_UPLOAD_BYTES` | No | `52428800` (50 MiB) | Upload size limit |
| `SKIP_VIRUS_SCAN` | No | `false` | Skip ClamAV on upload in non-production (for E2E when scanner is slow) |

## E2E-only variables

| Variable | Default | Description |
|----------|---------|-------------|
| `E2E_BASE_URL` | `http://localhost:5173` | Target URL for Puppeteer tests |
| `E2E_TIMEOUT_MS` | `30000` | Default Puppeteer timeout |
| `E2E_HEADLESS` | `true` | Set `false` to watch the browser |
| `E2E_SEED_RETRIES` | `3` | Upload retries before DB/MinIO fallback |
| `DATABASE_URL` | localhost default | Used by seed fallback (host: `localhost:5432`) |
| `MINIO_ENDPOINT` | `http://localhost:9000` | Used by seed fallback |

See [README.md](../README.md) for WorkOS and Docker-specific setup.
