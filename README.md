# Vellum

Secure, API-first document transfer platform. Every download requires both an email link (possession) and a file password (knowledge).

## Stack

- **Frontend:** Vite + React + Tailwind
- **API:** Express (via vite-plugin-node in dev)
- **Database:** PostgreSQL + Prisma
- **Storage:** MinIO (dev) / S3 (prod)
- **Jobs:** BullMQ + Redis
- **Virus scan:** ClamAV
- **Email:** Mailpit (dev) / SES (prod)
- **Auth:** API key (upload), dev mock or WorkOS (dashboard)

## Quick start

### 1. Environment

```bash
cp .env.example .env
```

### 2. Docker services

```bash
docker compose up -d postgres redis minio clamav mailpit
```

Wait for ClamAV to become healthy (2–5 minutes on first start).

### 3. Database

```bash
npm install
npm run db:generate
npm run db:migrate:deploy
```

### 4. Run app + workers

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm run worker
```

- App: http://localhost:5173
- Mailpit: http://localhost:8025
- MinIO console: http://localhost:9001

## API usage

### Upload (machine-to-machine)

```bash
curl -X POST http://localhost:5173/api/upload \
  -H "Authorization: Bearer dev-api-key-change-in-production" \
  -F "file=@document.pdf" \
  -F "recipientEmail=recipient@example.com" \
  -F "password=securepass123" \
  -F "linkTtl=86400" \
  -F "fileTtl=604800"
```

The response includes a warning: communicate the file password via a **separate channel** (not the same email as the download link).

### Download (recipient)

1. Open the link from email: `/verify/{token}`
2. Enter the file password
3. Browser redirects to a 30-second presigned MinIO URL

### Dashboard (dev auth)

1. Visit `/login` and enter your recipient email
2. View documents at `/dashboard`
3. Use **Send access link** to regenerate (still requires Path A to download)

### WorkOS (production)

Set in `.env`:

```bash
AUTH_PROVIDER=workos
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=https://your-domain/api/auth/callback
```

Sign in via `/api/auth/login`.

## Health check

```bash
curl http://localhost:5173/api/health
```

Returns status for database, Redis, and ClamAV.

## Design document

See [Vellum_Comprehensive_Design_Document.md](./Vellum_Comprehensive_Design_Document.md) for full architecture.

## AWS migration

See [docs/AWS_MIGRATION.md](./docs/AWS_MIGRATION.md).
