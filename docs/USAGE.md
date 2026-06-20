# Using Vellum

This guide explains **how to use Vellum after installation**. For setup, stack overview, and deployment, see [README.md](../README.md).

Vellum is a secure document-transfer service. Every download uses a **two-key model**: an email link (possession) plus a file password (knowledge). Even dashboard users must complete the verify flow to download — the dashboard only helps regenerate links.

---

## Who does what

| Role | Typical user | Primary surfaces |
|------|--------------|------------------|
| **Integrator** | Backend system, MFT job, scripts | `POST /api/upload`, `POST /api/documents/:id/revoke`, API key |
| **Recipient** | Person receiving a document | Email link → `/verify/{token}`, optional `/dashboard` |
| **Administrator** | Operator, compliance, engineering | `/admin`, `/docs/`, audit export API, dev tools sidebar |

---

## End-to-end workflow

Typical happy path from upload to download:

```mermaid
sequenceDiagram
  participant Integrator
  participant API
  participant Mailpit as Email (Mailpit dev)
  participant Recipient

  Integrator->>API: POST /api/upload (API key + file + metadata)
  API-->>Integrator: 201 document id + password warning
  Integrator->>Recipient: File password (separate channel — SMS, phone, etc.)
  API->>Mailpit: Download-link email
  Recipient->>Mailpit: Open email
  Recipient->>API: GET /verify/{token} → enter password
  Recipient->>API: POST /api/verify
  API-->>Recipient: Presigned download URL (30s)
  Recipient->>Recipient: Browser downloads file
```

**Important:** Communicate the file password **outside** the download-link email. The upload API response includes an explicit warning about this.

In development, open **Mailpit** at `http://$VELLUM_HOST:8025` to read the link email. Messages include a branded **HTML** version (logo, primary color, footer) alongside plain text — use Mailpit’s HTML tab to preview. Service URLs are listed in [README.md](../README.md#3-access).

---

## Integrators (machine upload and control)

Integrators upload documents on behalf of senders and deliver passwords to recipients through their own channels.

### Authentication

| Endpoint | Auth |
|----------|------|
| `POST /api/upload` | `Authorization: Bearer <API_KEY>` |
| `POST /api/upload/batch` | `Authorization: Bearer <API_KEY>` |
| `POST /api/documents/:id/revoke` | API key **or** admin session cookie |

Set `API_KEY` in your environment. See [CONFIG.md](./CONFIG.md) — do not use the dev default in production.

### Upload a document

`POST /api/upload` — multipart form:

| Field | Required | Description |
|-------|----------|-------------|
| `file` | Yes | Document bytes |
| `recipientEmail` | Yes | Recipient inbox for the download link |
| `password` | Yes | File password (min 8 characters); hash stored, never emailed by Vellum |
| `linkTtl` | Yes | Seconds until the verify link expires |
| `fileTtl` | Yes | Seconds until the object may be deleted from storage |
| `maxDownloads` | No | Successful download cap (default from `DEFAULT_MAX_DOWNLOADS`, usually `1`) |
| `otpChannel` | No | When `RECIPIENT_OTP_ENABLED=true`: `email`, `sms`, `whatsapp`, or `authenticator` |
| `recipientPhone` | If sms/whatsapp | E.164 phone for SMS/WhatsApp OTP |

Constraint: `linkTtl` must be ≤ `fileTtl`.

Allowed extensions come from `ALLOWED_UPLOAD_EXTENSIONS` ([CONFIG.md](./CONFIG.md)). Files are virus-scanned before storage (ClamAV).

**Example:**

```bash
curl -X POST http://localhost:5173/api/upload \
  -H "Authorization: Bearer dev-api-key-change-in-production" \
  -F "file=@document.pdf" \
  -F "recipientEmail=recipient@example.com" \
  -F "password=securepass123" \
  -F "linkTtl=86400" \
  -F "fileTtl=604800" \
  -F "maxDownloads=2"
```

Success (`201`) returns `data.id` (recipient link id), `data.linkId`, `data.fileId`, `data.sha256`, `data.maxDownloads`, optional `data.otpChannel`, optional `data.totpProvisioningUri` (authenticator channel), and `data.warning`. Send the password to the recipient separately; Vellum emails only the verify link.

### Batch upload (one file, many recipients)

`POST /api/upload/batch` — multipart form with a single `file` and a `recipients` JSON array. Each entry uses the same fields as single upload (`recipientEmail`, `password`, `linkTtl`, `fileTtl`, optional `maxDownloads`, optional OTP fields). Identical file bytes are stored once (SHA-256 dedup); each recipient gets a separate link row and initial email.

| Field | Required | Description |
|-------|----------|-------------|
| `file` | Yes | Shared document bytes |
| `recipients` | Yes | JSON array (max `MAX_BATCH_RECIPIENTS`, default 50) |

Success (`201`) returns `data.batchId`, `data.fileId`, `data.sha256`, `data.links[]` (each with `id` and `recipientEmail`), and `data.warning`.

### Revoke a document

`POST /api/documents/:id/revoke` — immediately invalidates the recipient download link. Shared S3 objects are retained when other links reference the same file.

- **API key:** same Bearer token as upload.
- **Admin session:** `vellum_session` cookie after admin sign-in.

Audited as `LINK_REVOKED`. See [EVENTS_AND_WEBHOOKS.md](./EVENTS_AND_WEBHOOKS.md).

### Explore the API with Bruno

The [Bruno workspace](../bruno/README.md) mirrors the HTTP surface:

| Folder | Coverage |
|--------|----------|
| `01-health` | Dependency check |
| `02-upload` | Single and batch upload success and validation errors |
| `03-auth` | Session and dev auth |
| `04-documents` | Recipient document list |
| `05-verify` | Password verify and download URL |
| `06-request-link` | Link regeneration |
| `07-revoke` | Revoke by API key |
| `08-admin-export` | Audit CSV export |

```bash
npm run test:api:smoke   # no seed required
npm run test:e2e:seed    # creates a test document, then:
npm run test:api         # full collection
```

API response shapes: success uses `application/vnd.vellum.result+json` (`body.data.*`); errors use Problem Details — [ERROR_HANDLING.md](./ERROR_HANDLING.md).

---

## Recipients (download and dashboard)

### Download with email link + password

1. Open the link from email: **`/verify/{token}`**
2. Complete **hCaptcha** when `CAPTCHA_PROVIDER=hcaptcha` (disabled by default)
3. Enter the **file password** (from the sender, not from the email)
4. When the document has `otpChannel` and `RECIPIENT_OTP_ENABLED=true`, enter the **verification code** (email/SMS/WhatsApp) or authenticator TOTP

SMS and WhatsApp OTP copy is white-labeled via `BRAND_PRESET` — customize `sms.templates.recipientOtp` and `whatsapp.templates.recipientOtp` in [`presets.ts`](../src/lib/brand/presets.ts). See [CONFIG.md](./CONFIG.md#sms-and-whatsapp-otp-templates).
5. On success the browser receives a short-lived presigned URL, the file **SHA-256 checksum** (for integrity verification), and navigates to **`/verify/{token}/complete`**

The complete page shows the checksum with a copy button. After saving the file, compare it locally, for example: `sha256sum your-file.pdf`.

If the download does not start, you may retry on the verify page within a grace window before the link is fully consumed. After that, sign in to the dashboard and request a new link.

Common failure cases (expired link, wrong password, revoked document) return Problem Details with actionable messages. Wrong-password attempts are audited as `FILE_DOWNLOAD_FAILED`.

### Dashboard (`/dashboard`)

Recipients sign in to see documents sent to their email address.

| Action | What it does |
|--------|----------------|
| **View list** | File name, received date, status badges |
| **Status badges** | Link active/expired, file available/scrubbed, download usage (e.g. “1 of 2 downloads used”) |
| **Send access link** | Emails a fresh verify link; does **not** download the file or bypass the password step |

Sign-in modes:

| Mode | How |
|------|-----|
| **Dev** (default) | `/login` → email → verify via Mailpit → sign in again |
| **WorkOS** | `GET /api/auth/login` → SSO → session cookie |

Session cookies, email verification, and admin bypass rules: [CONFIG.md](./CONFIG.md#dashboard-session). WorkOS env setup: [README.md](../README.md#workos-auth_providerworkos).

### Request a new link via API

Authenticated recipients (session cookie or dev `X-Dev-User-Email` header):

```http
POST /api/documents/{id}/request-link
```

Rotates the download token, resets verify counters, and queues a regenerate email. The file must still exist and not be past `fileExpiresAt`.

---

## Administrators

Administrators have `kind: ADMIN` (emails in `DEFAULT_ADMIN_EMAILS` on first sign-in). They use the same session cookie as recipients.

### Data browser (`/admin`)

Read-only UI for every Postgres table. Open **Admin** in the sidebar or visit `/admin` for the overview tiles.

| Table | Route | API |
|-------|-------|-----|
| Document files (`document_files`) | `/admin/document-files` | `GET /api/admin/document-files` |
| Document links (`document_user_links`) | `/admin/documents` | `GET /api/admin/documents` |
| Users (`users`) | `/admin/users` | `GET /api/admin/users` |
| Audit logs | `/admin/audit-logs` | `GET /api/admin/audit-logs` |
| Failed audit logs | `/admin/failed-audit-logs` | `GET /api/admin/failed-audit-logs` |
| Process errors | `/admin/process-errors` | `GET /api/admin/process-errors` |
| Failed process errors | `/admin/failed-process-errors` | `GET /api/admin/failed-process-errors` |
| Webhook deliveries | `/admin/webhook-deliveries` | `GET /api/admin/webhook-deliveries` |
| Failed webhook deliveries | `/admin/failed-webhook-deliveries` | `GET /api/admin/failed-webhook-deliveries` |

List views support pagination (`limit`, `offset`). Document files and document links also expose detail pages (`/admin/document-files/:id`, `/admin/documents/:id`).

Requires admin session. API backing routes live under `GET /api/admin/*`. Secrets (download tokens, password hashes, object keys) are never shown.

### Audit log export

`GET /api/admin/audit-logs` — admin session required.

| Query param | Purpose |
|-------------|------|
| `format=csv` or `Accept: text/csv` | CSV download |
| `limit` | Page size (max `AUDIT_EXPORT_MAX_LIMIT`, default cap 500) |
| `cursor` | Cursor pagination (`nextCursor` in JSON response) |
| `offset` | Offset pagination (JSON only, when no cursor) |
| `eventType` | Filter by one or more event types |
| `documentId`, `userId` | Scope to a document or user |
| `from`, `to` | ISO date range on `timestamp` |
| `includeExpired` | Include rows past retention (`false` by default) |

Event catalog and future webhook hooks: [EVENTS_AND_WEBHOOKS.md](./EVENTS_AND_WEBHOOKS.md).

**Example (CSV):**

```bash
curl -H "Cookie: vellum_session=…" \
  -H "Accept: text/csv" \
  "http://localhost:5173/api/admin/audit-logs?format=csv&limit=100"
```

Bruno: `08-admin-export/Audit Logs CSV.bru` (set `adminSessionCookie` in the Seeded environment).

### API reference (`/docs/`)

1. Run `npm run docs:api` on the server (generates HTML under `docs/api/html/`).
2. Sign in as admin.
3. Open **`/docs/`** in the browser.

Details: [CONFIG.md](./CONFIG.md#api-documentation-docs).

### Development tools sidebar

In non-production, admins see a **Development** section in the left sidebar:

| Tool | Typical URL |
|------|-------------|
| Mailpit | `:8025` |
| MinIO console | `:9001` |
| Prisma Studio | `:5555` |
| DB Admin (Adminer) | `:8081` |
| API documentation | `/docs/` |

Full URL table: [README.md](../README.md#3-access).

---

## Health check

Verify the stack before demos or integration tests:

```bash
curl http://localhost:5173/api/health
```

Expect `data.status: "ok"` and `data.checks` for database, Redis, and ClamAV. Response format: [ERROR_HANDLING.md](./ERROR_HANDLING.md).

---

## API surface reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/health` | None | Dependency status |
| `POST` | `/api/upload` | API key | Upload document (single recipient) |
| `POST` | `/api/upload/batch` | API key | Upload one file to many recipients |
| `POST` | `/api/verify` | None | Token + password (+ optional hCaptcha) → download URL, SHA-256 checksum, or OTP session |
| `POST` | `/api/verify/otp` | None | OTP session + code → download URL and SHA-256 checksum |
| `POST` | `/api/verify/otp/resend` | None | Resend email/SMS/WhatsApp OTP |
| `GET` | `/api/documents` | Session | List recipient documents |
| `POST` | `/api/documents/:id/request-link` | Session | Regenerate link email |
| `POST` | `/api/documents/:id/revoke` | API key or admin | Revoke link + delete file |
| `GET` | `/api/admin/audit-logs` | Admin session | Audit export (JSON/CSV) |
| `GET` | `/api/auth/me` | Session | Current user |
| `POST` | `/api/auth/logout` | Session | Clear session |

Extended test matrix: [e2e-test-plan.md](./e2e-test-plan.md).

---

## Related documentation

| Document | Topic |
|----------|-------|
| [README.md](../README.md) | Installation, stack, URLs, WorkOS setup |
| [CONFIG.md](./CONFIG.md) | Environment variables, sessions, verification |
| [ERROR_HANDLING.md](./ERROR_HANDLING.md) | API error and success response formats |
| [EVENTS_AND_WEBHOOKS.md](./EVENTS_AND_WEBHOOKS.md) | Audit events and webhook specification |
| [e2e-test-plan.md](./e2e-test-plan.md) | Automated test coverage by area |
| [bruno/README.md](../bruno/README.md) | API collection and CLI usage |
| [Vellum_Comprehensive_Design_Document.md](./Vellum_Comprehensive_Design_Document.md) | Architecture and security model (v2.1 — current system) |
