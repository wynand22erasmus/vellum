# Vellum

## Secure Document Transfer Platform

### Comprehensive Design Document

#### Version 1.0 — May 2026

---

## Table of Contents

1. Project Overview
2. Technology Stack
3. System Architecture
4. Infrastructure & Deployment
5. Database Design
6. Security Architecture
7. API Design
8. Authentication & Authorization
9. Document Lifecycle Management
10. Email System
11. Background Job Processing
12. Audit & Compliance
13. AWS Migration Plan
14. Appendix A: Project Naming
15. Appendix B: Industry Use Cases
16. Appendix C: Known Issues & Recommendations

---

## 1. Project Overview

### 1.1 Purpose

Vellum is a secure, API-first document transfer platform designed for regulated industries. It allows an authorized uploader to securely deliver documents to a specified recipient via a password-protected, time-limited download link delivered by email.

### 1.2 Name

**Vellum** — Named after the high-quality parchment historically used for important legal, financial, and academic documents. The name is intentionally generic, professional, and institution-neutral, making it suitable for use by banks, insurance companies, universities, and fax-to-email services without carrying any specific industry personality.

### 1.3 Target Industries

- Banking & Finance (SOX / Basel III)
- Insurance
- Fax-to-Email Services
- Universities & Academic Institutions

### 1.4 Core Value Proposition

- **API-First:** Designed primarily for machine-to-machine uploads.
- **Two-Key Security:** Every download requires both a possession factor (email link) and a knowledge factor (file password).
- **Self-Cleaning Vault:** Files are automatically scrubbed on expiry while audit records are retained for compliance.
- **Multi-Tier Lifecycle:** Separate, independently configurable TTLs for the link, the file, and the database record.
- **Full Audit Trail:** Every email, login, and file access event is recorded for regulatory compliance.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js + TypeScript | Backend application server |
| **Frontend** | Vite + React + shadcn/ui | User dashboard |
| **Database** | PostgreSQL + Prisma ORM | Metadata & audit records |
| **Object Storage** | MinIO (Dev) / AWS S3 (Prod) | Document storage |
| **Job Queue** | BullMQ + Redis | Background & async processing |
| **Virus Scanning** | ClamAV | Malware detection on upload |
| **Authentication** | WorkOS | SSO / Identity management |
| **Email (Dev)** | Mailpit + Nodemailer | Local SMTP testing & inspection |
| **Email (Prod)** | AWS SES + Nodemailer | Production email delivery |
| **Validation** | Zod | API input validation |
| **Password Hashing** | Argon2 | File password hashing |
| **Orchestration** | Docker Compose | Multi-container management |
| **Reverse Proxy** | Nginx | SSL termination & routing |

---

## 3. System Architecture

### 3.1 High-Level Overview

Vellum is composed of two primary Docker images:

1. **Application Container:** Node.js/TypeScript API, Vite/React frontend, and BullMQ workers.
2. **Storage Container:** MinIO, the S3-compatible self-hosted object store.

These are supported by additional containers (Postgres, Redis, ClamAV, Mailpit, Nginx) all orchestrated via Docker Compose.

### 3.2 Component Diagram

```text
                    ┌────────────────────────────┐
                    │     Nginx (Reverse Proxy)   │
                    │   SSL Termination / Routing │
                    └────────────┬───────────────┘
                                 │
          ┌──────────────────────┼─────────────────────┐
          │                      │                     │
 ┌────────▼───────┐    ┌─────────▼──────┐    ┌────────▼────────┐
 │ React Frontend │    │ Node.js API    │    │  BullMQ Workers │
 │ (Vite/shadcn)  │    │ (TypeScript)   │    │ email-queue     │
 └────────────────┘    └────────┬───────┘    │ audit-queue     │
                                │            │ cleanup-queue   │
          ┌─────────────────────┼────────────└────────┬────────┘
          │                     │                     │
 ┌────────▼───────┐    ┌────────▼───────┐    ┌────────▼────────┐
 │  PostgreSQL    │    │     Redis      │    │     MinIO       │
 │  (Prisma ORM)  │    │   (BullMQ)     │    │  (S3 Storage)   │
 └────────────────┘    └────────────────┘    └─────────────────┘

 ┌────────────────┐    ┌────────────────┐
 │    ClamAV      │    │   Mailpit      │
 │ (Virus Scanner)│    │ (Dev SMTP)     │
 └────────────────┘    └────────────────┘
```

### 3.3 Request Flow Summary

#### Upload Flow

```text
API Client → Nginx → Node.js API → ClamAV Scan
 → MinIO (store file) → Postgres (store metadata)
  → email-queue (BullMQ) → Email Sent to Recipient
```

#### Download Flow (Path A)

```text
Recipient Email Link → React Frontend (password prompt)
 → POST /api/verify → Postgres (validate token + expiry)
  → Argon2 (verify password) → MinIO (generate 30s presigned URL)
   → Postgres (isUsed = true) → audit-queue (log event)
    → 30s URL returned to browser → Browser downloads from MinIO
```

#### Dashboard Flow (Path B)

```text
User → WorkOS Login → React Dashboard
 → GET /api/documents (filtered by email)
  → "Send Access Link" → POST /api/documents/:id/request-link
   → New token generated → email-queue (BullMQ)
    → New email sent → Recipient follows Path A
```

---

## 4. Infrastructure & Deployment

### 4.1 Docker Compose Configuration

```yaml
version: "3.8"

services:
  app:
    build: .
    env_file: .env
    depends_on:
      clamav:
        condition: service_healthy
      postgres:
        condition: service_started
      redis:
        condition: service_started
      minio:
        condition: service_started

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: vellum_db
      POSTGRES_USER: vellum
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}

  clamav:
    image: clamav/clamav:latest
    volumes:
      - clamav_data:/var/lib/clamav
    healthcheck:
      test: ["CMD", "clamdcheck.sh"]
      interval: 30s
      retries: 10
      start_period: 120s

  mailpit:
    image: axllent/mailpit
    ports:
      - "8025:8025" # Web UI for dev inspection
      - "1025:1025" # SMTP

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs

volumes:
  postgres_data:
  redis_data:
  minio_data:
  clamav_data:
```

### 4.2 Environment Variables

```bash
# Application
NODE_ENV=development
APP_URL=https://vellum.local
PORT=3000

# PostgreSQL
DATABASE_URL=postgresql://vellum:password@postgres:5432/vellum_db

# Redis
REDIS_URL=redis://redis:6379

# MinIO / S3
MINIO_ENDPOINT=http://minio:9000
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_BUCKET_NAME=vellum-documents
AWS_REGION=us-east-1

# ClamAV
CLAMAV_HOST=clamav
CLAMAV_PORT=3310

# WorkOS
WORKOS_API_KEY=sk_xxxxx
WORKOS_CLIENT_ID=client_xxxxx
WORKOS_REDIRECT_URI=https://vellum.local/api/auth/callback

# Email
EMAIL_PROVIDER=local  # 'local' | 'ses'
MAILPIT_HOST=mailpit
MAILPIT_PORT=1025

# AWS SES (Production)
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxx

# Lifecycle Configuration
REPORTING_LIFETIME_YEARS=5
DEFAULT_LINK_TTL_SECONDS=86400
MAX_FILE_RETENTION_DAYS=90
```

---

## 5. Database Design

### 5.1 Prisma Schema

```prisma
enum AuditEventType {
  USER_LOGIN
  EMAIL_INITIAL_SENT
  EMAIL_REGENERATE_SENT
  FILE_DOWNLOAD_SUCCESS
  FILE_DOWNLOAD_FAILED
  FILE_SCRUBBED
}

model Document {
  id             String    @id @default(uuid())
  s3Key          String?   // Nullified once the file is deleted from S3
  fileName       String
  recipientEmail String    @index
  passwordHash   String    // Argon2 hash of the file password
  downloadToken  String    @unique

  // Three-Tier Lifecycle Timestamps
  linkExpiresAt  DateTime  // When the current email token expires
  fileExpiresAt  DateTime  // When the file is scrubbed from S3
  recordExpiresAt DateTime  // When the DB record is purged (default: 5 years)

  isUsed         Boolean   @default(false) // True after a link is consumed
  deletedAt      DateTime? // Populated by the file scrub worker
  createdAt      DateTime  @default(now())

  auditLogs      AuditLog[]
}

model AuditLog {
  id          String         @id @default(uuid())
  eventType   AuditEventType
  timestamp   DateTime       @default(now())

  // Optional relations: not all events relate to both a document and a user
  userId      String?
  documentId  String?
  document    Document?      @relation(fields: [documentId], references: [id])

  // Request context
  ipAddress   String?
  userAgent   String?
  metadata    Json?          // Flexible event-specific data

  expiresAt   DateTime       // Configurable retention (default: 5 years)
}
```

### 5.2 Data Relationships

- One `Document` can have many `AuditLog` entries.
- `AuditLog.documentId` is nullable to support events not tied to a specific document (e.g., `USER_LOGIN`).
- When a `Document` record is purged by the audit scrub worker, its associated `AuditLog` entries should be purged first, or the foreign key must be set to `onDelete: SetNull`.

---

## 6. Security Architecture

### 6.1 The "Two-Key" Access Model

Vellum enforces a mandatory two-factor verification model for every file download, regardless of whether the user is authenticated via WorkOS or not.

| Factor | Requirement | Managed By |
| :--- | :--- | :--- |
| **Possession** | Access Link (Token) | Delivered via email, stored in Prisma |
| **Knowledge** | File Password | Known to recipient, stored as Argon2 hash |

Even authenticated WorkOS users (Path B) must complete Path A. They may request a new link from the dashboard, but the download itself is always gated by the email-link + password flow.

### 6.2 Upload Security

1. **API Authentication:** Uploaders must present a valid API Key or WorkOS JWT.
2. **Input Validation:** All request body fields are validated via **Zod** before processing.
3. **Virus Scanning:** Every file is scanned by **ClamAV** before being stored in MinIO. Files that fail scanning are rejected and never stored.
4. **Password Hashing:** File passwords are hashed with **Argon2** before being written to Postgres. Plaintext passwords are never persisted.

### 6.3 Download Security

1. No file bytes ever pass through the Node.js server.
2. After successful Path A validation, a **30-second Presigned URL** is generated.
3. The Presigned URL uses a `Content-Disposition: attachment` header to force a file download rather than browser rendering.
4. `isUsed` is set to `true` immediately after the URL is generated.
5. All access attempts (both successes and failures) are logged asynchronously to the `audit-queue`.

### 6.4 Presigned URL Generation

```typescript
// src/lib/storage/s3Client.ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
  },
  forcePathStyle: true, // Required for MinIO compatibility
});

export const generatePresignedUrl = async (
  s3Key: string,
  fileName: string
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.MINIO_BUCKET_NAME,
    Key: s3Key,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 30 });
};
```

---

## 7. API Design

### 7.1 Endpoints

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | API Key (`Authorization: Bearer`) | Upload a document |
| `POST` | `/api/verify` | None | Validate token + password, receive presigned URL |
| `GET` | `/api/documents` | Session cookie (`vellum_session`) | List documents for authenticated user |
| `POST` | `/api/documents/:id/request-link` | Session cookie | Request a new download link |
| `GET` | `/api/auth/login` | None | Redirect to WorkOS AuthKit (production) |
| `GET` | `/api/auth/callback` | WorkOS | OAuth callback; sets session cookie |
| `POST` | `/api/auth/dev/request-login` | None | Dev sign-in; sets session cookie when verified |
| `GET` | `/docs/` | Session cookie + `ADMIN` | Generated TypeDoc HTML (admin only) |

### 7.2 Upload Endpoint

```typescript
// POST /api/upload
const uploadSchema = zod
  .object({
    recipientEmail: zod.string().email(),
    password: zod.string().min(8),
    linkTtl: zod.number().int().positive(), // Seconds
    fileTtl: zod.number().int().positive(), // Seconds
  })
  .refine((data) => data.linkTtl <= data.fileTtl, {
    message: "linkTtl cannot exceed fileTtl",
  });

router.post("/upload", async (req, res) => {
  const { recipientEmail, password, linkTtl, fileTtl } =
    uploadSchema.parse(req.body);

  // 1. Scan with ClamAV
  // 2. Upload to MinIO → receive s3Key
  const passwordHash = await argon2.hash(password);

  const now = new Date();
  const doc = await prisma.document.create({
    data: {
      s3Key: uploadedS3Key,
      fileName: originalName,
      recipientEmail,
      passwordHash,
      downloadToken: crypto.randomBytes(32).toString("hex"),
      linkExpiresAt: addSeconds(now, linkTtl),
      fileExpiresAt: addSeconds(now, fileTtl),
      recordExpiresAt: addYears(
        now,
        Number(process.env.REPORTING_LIFETIME_YEARS)
      ),
    },
  });

  await emailQueue.add("send-initial-link", { docId: doc.id });

  res.status(201).json({ id: doc.id });
});
```

### 7.3 Verify Endpoint (Path A)

```typescript
// POST /api/verify
router.post("/verify", async (req, res) => {
  const { token, password } = req.body;

  const doc = await prisma.document.findUnique({
    where: { downloadToken: token },
  });

  if (!doc) {
    return res.status(404).json({ error: "Invalid link." });
  }

  if (new Date() > doc.linkExpiresAt) {
    return res.status(410).json({
      error: "This link has expired.",
      actionRequired:
        "Please log in to your Vellum dashboard to request a new link.",
    });
  }

  const isValid = await argon2.verify(doc.passwordHash, password);
  if (!isValid) {
    logEvent({
      eventType: "FILE_DOWNLOAD_FAILED",
      documentId: doc.id,
      metadata: { reason: "Incorrect password" },
      ip: req.ip,
    });
    return res.status(401).json({ error: "Invalid file password." });
  }

  const downloadUrl = await generatePresignedUrl(doc.s3Key!, doc.fileName);

  await prisma.document.update({
    where: { id: doc.id },
    data: { isUsed: true },
  });

  logEvent({
    eventType: "FILE_DOWNLOAD_SUCCESS",
    documentId: doc.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.json({ downloadUrl });
});
```

### 7.4 Request New Link Endpoint (Path B)

```typescript
// POST /api/documents/:id/request-link
router.post("/:id/request-link", async (req, res) => {
  const user = req.user; // WorkOS JWT middleware

  const doc = await prisma.document.findFirst({
    where: { id: req.params.id, recipientEmail: user.email },
  });

  if (!doc) {
    return res.status(404).json({ error: "Document not found." });
  }

  if (!doc.s3Key || new Date() > doc.fileExpiresAt) {
    return res.status(410).json({
      error:
        "The source file has been permanently deleted per the retention policy.",
    });
  }

  // Enforce: new linkExpiresAt must not exceed fileExpiresAt
  const requestedExpiry = addHours(new Date(), 24);
  const newLinkExpiresAt =
    requestedExpiry > doc.fileExpiresAt ? doc.fileExpiresAt : requestedExpiry;

  const updatedDoc = await prisma.document.update({
    where: { id: doc.id },
    data: {
      downloadToken: crypto.randomBytes(32).toString("hex"),
      linkExpiresAt: newLinkExpiresAt,
      isUsed: false,
    },
  });

  await emailQueue.add("send-regenerate-link", {
    docId: updatedDoc.id,
    requestedBy: user.id,
  });

  res.json({ message: "A fresh link has been sent to your email." });
});
```

---

## 8. Authentication & Authorization

### 8.1 Identity providers

| Mode | `AUTH_PROVIDER` | Dashboard sign-in |
| :--- | :--- | :--- |
| **Production** | `workos` | WorkOS AuthKit (`GET /api/auth/login`) |
| **Local / dev** | `dev` | Email + Mailpit verification (`POST /api/auth/dev/request-login`) |

Both modes issue the same **`vellum_session`** HTTP-only cookie (HS256 JWT, 7-day TTL). Dev mode also supports `X-Dev-User-Email` on API `fetch` calls from the SPA.

| User Type | Auth Method | Can Download Directly? |
| :--- | :--- | :--- |
| **Uploader** | API Key | N/A (uploads only) |
| **Guest Recipient** | Email Link + File Password | Yes (via Path A) |
| **Dashboard User** | Session cookie (WorkOS or dev) | No (triggers Path A via email) |
| **Admin** | Session cookie + `UserKind.ADMIN` | No for files; yes for `/docs/` |

### 8.2 WorkOS Callback Handler

```typescript
// GET /api/auth/callback
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  const { user } = await workos.userManagement.authenticateWithCode({
    code: code as string,
    clientId: process.env.WORKOS_CLIENT_ID,
  });

  // upsert user, enforce email verification for consumers, ...

  const token = await createSessionToken({ id: user.id, email: user.email });
  setSessionCookie(res, token);

  const returnTo = safeReturnTo(state); // e.g. /docs/ when opened from API docs
  res.redirect(returnTo);
});
```

### 8.3 Dev sign-in

1. User submits email at `/login` → `POST /api/auth/dev/request-login`.
2. If unverified, Mailpit delivers `GET /api/auth/verify-email?token=…`.
3. When verified, the API sets `vellum_session` and the browser redirects to `/dashboard` or `returnTo` (e.g. `/docs/`).

### 8.4 Dashboard Security Model

1. User authenticates (WorkOS or dev) and receives `vellum_session`.
2. Dashboard calls `GET /api/documents`. Backend queries Prisma `WHERE recipientEmail = user.email`.
3. User sees a list of documents addressed to them.
4. Clicking "Get Access Link" calls `POST /api/documents/:id/request-link`.
5. A new token is generated, emailed to the user — then the user must complete **Path A**.

The user cannot download any file directly from the dashboard. The email inbox acts as a mandatory security checkpoint on every retrieval.

---

## 9. Document Lifecycle Management

### 9.1 The Three-Tier Lifecycle

| Tier | Field | Controls | Set By |
| :--- | :--- | :--- | :--- |
| **Link TTL** | `linkExpiresAt` | How long the emailed token is valid | Uploader at upload time |
| **File TTL** | `fileExpiresAt` | When the S3/MinIO file is permanently purged | Uploader at upload time |
| **Record TTL** | `recordExpiresAt` | When the Postgres row is deleted | System config (default: 5 years) |

### 9.2 File Lifecycle State Machine

```text
[Uploaded] → [Email Sent] → [Link Active]
    ↓                            ↓
[File Expired]           [Downloaded (isUsed=true)]
    ↓                            ↓
[File Scrubbed]          [Link Expired]
    ↓                            ↓
[Record Active]          [Path B: New Link]
    ↓
[Record Purged (5yr)]
```

### 9.3 Example Lifecycle

| Event | Timing | System State |
| :--- | :--- | :--- |
| File Uploaded | Day 0, 10:00 | `s3Key` set, `downloadToken` set, `isUsed = false` |
| Initial Email Sent | Day 0, 10:01 | `EMAIL_INITIAL_SENT` logged |
| Recipient Downloads | Day 1, 14:00 | `isUsed = true`, `FILE_DOWNLOAD_SUCCESS` logged |
| Link Expires | Day 2, 10:00 | Verify endpoint returns 410 |
| User Logs In (Path B) | Day 2, 11:00 | `USER_LOGIN` logged |
| New Link Generated | Day 2, 11:01 | New `downloadToken`, `linkExpiresAt` updated |
| Regeneration Email Sent | Day 2, 11:01 | `EMAIL_REGENERATE_SENT` logged |
| Recipient Downloads Again | Day 2, 11:05 | `isUsed = true` again |
| File Scrubbed from S3 | Day 7, 00:00 | `s3Key = null`, `deletedAt` set, `FILE_SCRUBBED` logged |
| Postgres Record Purged | Year 5 | Full record and associated audit logs deleted |

### 9.4 Constraint Enforcement

The system enforces the following rules:

- **At Upload:** `linkTtl` must be `<= fileTtl` (enforced by Zod).
- **At Regeneration:** New `linkExpiresAt` is capped at `fileExpiresAt` (enforced in the route handler).
- **At Verify:** If `s3Key` is null (file already scrubbed), the system returns a 410 before attempting presigned URL generation.

---

## 10. Email System

### 10.1 Email Provider Interface (Strategy Pattern)

An interface-driven design allows the email provider to be swapped between local development and AWS SES production via a single environment variable, with no application code changes.

```typescript
// src/lib/email/IEmailProvider.ts
export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface IEmailProvider {
  send(payload: EmailPayload): Promise<void>;
}
```

### 10.2 Local Development Provider (Mailpit)

```typescript
// src/lib/email/providers/LocalEmailProvider.ts
import nodemailer from "nodemailer";
import { IEmailProvider, EmailPayload } from "../IEmailProvider";

export class LocalEmailProvider implements IEmailProvider {
  private transporter = nodemailer.createTransport({
    host: process.env.MAILPIT_HOST,
    port: Number(process.env.MAILPIT_PORT),
  });

  async send(payload: EmailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: "noreply@vellum.local",
      ...payload,
    });
  }
}
```

### 10.3 Production Provider (AWS SES)

```typescript
// src/lib/email/providers/SesEmailProvider.ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { IEmailProvider, EmailPayload } from "../IEmailProvider";

export class SesEmailProvider implements IEmailProvider {
  private client = new SESClient({ region: process.env.AWS_SES_REGION });

  async send(payload: EmailPayload): Promise<void> {
    await this.client.send(
      new SendEmailCommand({
        Destination: { ToAddresses: [payload.to] },
        Message: {
          Subject: { Data: payload.subject },
          Body: { Text: { Data: payload.body } },
        },
        Source: "noreply@vellum.app",
      })
    );
  }
}
```

### 10.4 Email Service Factory

```typescript
// src/lib/email/EmailService.ts
import { IEmailProvider } from "./IEmailProvider";
import { LocalEmailProvider } from "./providers/LocalEmailProvider";
import { SesEmailProvider } from "./providers/SesEmailProvider";

export class EmailService {
  private provider: IEmailProvider;

  constructor() {
    this.provider =
      process.env.EMAIL_PROVIDER === "ses"
        ? new SesEmailProvider()
        : new LocalEmailProvider();
  }

  async sendDownloadLink(
    to: string,
    token: string,
    fileName: string
  ): Promise<void> {
    const url = `${process.env.APP_URL}/verify/${token}`;
    await this.provider.send({
      to,
      subject: `Secure Document Ready: ${fileName}`,
      body: `Your document is ready for collection.\n\nVisit the link below and enter your file password to download:\n\n${url}\n\nThis link will expire as scheduled. Do not share this link.`,
    });
  }
}
```

---

## 11. Background Job Processing

### 11.1 Queue Architecture

All non-critical operations are offloaded to BullMQ. This decouples the HTTP request/response cycle from I/O-heavy tasks, ensures fault tolerance through Redis persistence, and allows workers to catch up after a database outage without data loss.

| Queue | Workers | Trigger |
| :--- | :--- | :--- |
| `email-queue` | `emailWorker` | Upload complete, Link regeneration |
| `audit-queue` | `auditWorker` | Any loggable event in the app |
| `cleanup-queue` | `fileScrubWorker`, `recordScrubWorker` | Recurring cron schedule |

### 11.2 The `logEvent` Helper

All audit logging throughout the application calls this single helper. It is intentionally fire-and-forget: the calling code does not block waiting for the log to be written.

```typescript
// src/queues/auditQueue.ts
import { Queue } from "bullmq";
import { connection } from "../lib/redis";

export const auditQueue = new Queue("audit-queue", { connection });

export const logEvent = (data: {
  eventType: string;
  documentId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}): void => {
  // Not awaited: true fire-and-forget
  auditQueue.add("log-event", data).catch((err) => {
    // Fallback: surface the error without crashing the request
    console.error("[AuditQueue] Failed to enqueue audit event:", err);
  });
};
```

### 11.3 Email Worker

```typescript
// src/workers/emailWorker.ts
import { Worker } from "bullmq";
import { prisma } from "../lib/prisma";
import { EmailService } from "../lib/email/EmailService";
import { auditQueue } from "../queues/auditQueue";
import { connection } from "../lib/redis";

const emailService = new EmailService();

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { docId, type } = job.data; // type: 'INITIAL' | 'REGENERATE'

    const doc = await prisma.document.findUnique({ where: { id: docId } });
    if (!doc) throw new Error(`Document ${docId} not found`);

    await emailService.sendDownloadLink(
      doc.recipientEmail,
      doc.downloadToken,
      doc.fileName
    );

    await auditQueue.add("log-event", {
      eventType:
        type === "INITIAL" ? "EMAIL_INITIAL_SENT" : "EMAIL_REGENERATE_SENT",
      documentId: docId,
      metadata: { type },
    });
  },
  { connection }
);
```

### 11.4 Audit Worker

```typescript
// src/workers/auditWorker.ts
import { Worker } from "bullmq";
import { prisma } from "../lib/prisma";
import { addYears } from "date-fns";
import { connection } from "../lib/redis";

export const auditWorker = new Worker(
  "audit-queue",
  async (job) => {
    const { eventType, documentId, userId, metadata, ip, userAgent } = job.data;

    await prisma.auditLog.create({
      data: {
        eventType,
        documentId,
        userId,
        metadata,
        ipAddress: ip,
        userAgent,
        expiresAt: addYears(
          new Date(),
          Number(process.env.REPORTING_LIFETIME_YEARS)
        ),
      },
    });
  },
  { connection }
);
```

### 11.5 File Scrub Worker (Recurring: Every Hour)

Deletes files from MinIO that have exceeded their `fileExpiresAt` timestamp.

```typescript
// src/workers/fileScrubWorker.ts
import { Worker } from "bullmq";
import { prisma } from "../lib/prisma";
import { s3Client } from "../lib/storage/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { auditQueue } from "../queues/auditQueue";
import { connection } from "../lib/redis";

export const fileScrubWorker = new Worker(
  "cleanup-queue",
  async (job) => {
    if (job.name !== "scrub-files") return;

    const expiredDocs = await prisma.document.findMany({
      where: {
        fileExpiresAt: { lt: new Date() },
        s3Key: { not: null },
      },
    });

    for (const doc of expiredDocs) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.MINIO_BUCKET_NAME,
          Key: doc.s3Key!,
        })
      );

      await prisma.document.update({
        where: { id: doc.id },
        data: { s3Key: null, deletedAt: new Date() },
      });

      await auditQueue.add("log-event", {
        eventType: "FILE_SCRUBBED",
        documentId: doc.id,
        metadata: { originalS3Key: doc.s3Key },
      });
    }
  },
  { connection }
);
```

### 11.6 Record Scrub Worker (Recurring: Monthly)

Purges Postgres rows that have exceeded their `recordExpiresAt` timestamp.

```typescript
// src/workers/recordScrubWorker.ts
export const recordScrubWorker = new Worker(
  "cleanup-queue",
  async (job) => {
    if (job.name !== "scrub-records") return;

    const now = new Date();

    await prisma.auditLog.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    await prisma.document.deleteMany({
      where: { recordExpiresAt: { lt: now } },
    });
  },
  { connection }
);
```

### 11.7 Operation Classification Summary

| Operation | Handling | Examples |
| :--- | :--- | :--- |
| **Core Path** | Synchronous (Awaited) | DB lookups, Password verification, Presigned URL generation |
| **Communication** | `email-queue` | Initial link, Regeneration link |
| **Compliance** | `audit-queue` | Login, Download success/fail, File scrub |
| **Cleanup** | `cleanup-queue` (Cron) | S3 file deletion, Postgres record purge |

---

## 12. Audit & Compliance

### 12.1 Audit Event Reference

| Event | Trigger Point | Key Metadata |
| :--- | :--- | :--- |
| `USER_LOGIN` | WorkOS callback | `email`, `userId`, `provider` |
| `EMAIL_INITIAL_SENT` | Email worker | `documentId`, `type` |
| `EMAIL_REGENERATE_SENT` | Email worker | `documentId`, `requestedBy` |
| `FILE_DOWNLOAD_SUCCESS` | `/api/verify` | `documentId`, `ip`, `userAgent` |
| `FILE_DOWNLOAD_FAILED` | `/api/verify` | `documentId`, `ip`, `reason` |
| `FILE_SCRUBBED` | File scrub worker | `documentId`, `originalS3Key` |

### 12.2 Document Event Timeline (Example)

This timeline view is the basis for an admin compliance report for any given document.

```text
Day 0  10:00  Document Uploaded
Day 0  10:01  EMAIL_INITIAL_SENT
Day 1  14:00  FILE_DOWNLOAD_SUCCESS (IP: 1.2.3.4)
Day 2  09:00  USER_LOGIN (WorkOS, user@example.com)
Day 2  09:05  EMAIL_REGENERATE_SENT
Day 2  09:10  FILE_DOWNLOAD_SUCCESS (IP: 1.2.3.4)
Day 7  00:00  FILE_SCRUBBED (Automated)
Year 5 00:00  Postgres record and associated audit logs purged
```

### 12.3 Compliance Notes by Industry

- **Banking (SOX / Basel III):** Every document dispatch, access, and deletion is logged with IP and timestamp, providing a legally defensible chain of custody.
- **Insurance:** Full chain of custody is preserved from upload through final deletion. Even if an agent uploads to the wrong email, the file password acts as a second barrier.
- **GDPR:** Files are scrubbed at TTL expiry. Records are purged at 5 years. No personal data is retained beyond configured limits.
- **Universities:** The Registrar's office can prove that a transcript was dispatched and accessed, satisfying accreditation audit requirements.

---

## 13. AWS Migration Plan

### 13.1 Service Mapping

| Local Component | AWS Managed Service | Migration Effort |
| :--- | :--- | :--- |
| **Postgres Container** | AWS RDS (Postgres) | Low — Update `DATABASE_URL` |
| **MinIO Container** | AWS S3 | Low — AWS SDK supports both |
| **Redis Container** | AWS ElastiCache (Redis) | Medium — Update connection string, security groups |
| **Node/React App** | AWS ECS (Fargate) | Medium — Push image to ECR, define task |
| **Nginx** | AWS ALB (Application Load Balancer) | Medium — Replace Nginx config with ALB listener rules |
| **Mailpit** | AWS SES | Low — Set `EMAIL_PROVIDER=ses` |
| **WorkOS** | WorkOS (no change) | None — SaaS, already cloud-hosted |
| **ClamAV Container** | AWS Lambda (S3 trigger) | High — Rewrite as Lambda function |

### 13.2 Migration Steps

1. **Secrets:** Move all `.env` values to **AWS Secrets Manager**. Update ECS task definitions to read from Secrets Manager.
2. **Storage:** Sync files from MinIO to S3:

    ```bash
    aws s3 sync s3://vellum-documents s3://vellum-production \
      --source-region us-east-1
    ```

3. **Database:** Migrate from local Postgres to RDS:

    ```bash
    pg_dump $LOCAL_DATABASE_URL | psql $RDS_DATABASE_URL
    ```

4. **Networking:** Create a **VPC** with private subnets for RDS and ElastiCache. The ECS tasks run in public subnets behind the ALB.
5. **Containers:** Build and push Docker images to **ECR**. Define an ECS Fargate service and task definition.
6. **Proxy:** Replace Nginx with an **AWS Application Load Balancer**. Use **AWS Certificate Manager** for SSL.
7. **Email:** No code changes required. Set `EMAIL_PROVIDER=ses` in Secrets Manager.
8. **Virus Scanning:** Replace the ClamAV container with an **AWS Lambda** function triggered by S3 `PutObject` events to scan files asynchronously after upload.

### 13.3 Zero Code Change Principle

By using the AWS SDK for both MinIO (`forcePathStyle: true`) and S3, and by using the Strategy Pattern for email providers, the application code requires **no changes** for the migration. All differences are contained in environment variables.

---

## Appendix A: Project Naming

**Vellum** was selected from a large pool of candidates evaluated across four categories:

| Category | Candidates |
| :--- | :--- |
| **Professional & Functional** | RelayLink, FileParcel, DirectDispatch, SendVault |
| **Modern & Minimalist** | DropPoint, Beam, Fetch, AeroSend |
| **Creative & Playful** | PaperKite, CloudCarrier, SwiftDrop, LinkLoom |
| **Infrastructure-Focused** | DocPort, RelayNode, DocNexus, CoreBridge |
| **Industry-Neutral** | DocRelay, FileTransit, FolioTransfer, VerityPost |

**Vellum** was selected for:

- Premium and trustworthy connotations (historically used for legal deeds and academic charters).
- Industry neutrality — carries no specific sector personality.
- Ease of branding for banks, universities, insurance companies, and fax services.
- Short, memorable, and typeable.

---

## Appendix B: Industry Use Cases

### B.1 Banking

- **File TTL:** 7 days for sensitive mortgage offer letters.
- **Link TTL:** 24–48 hours.
- **Password Strategy:** The file password is a value both the bank and the customer already know (e.g., last 4 digits of account number), removing the need for a separate password communication channel.
- **Compliance Benefit:** Proof-of-dispatch records satisfy SOX audit requirements even after the file is scrubbed.

### B.2 Insurance

- **File TTL:** 30 days for claims-related documents.
- **Record TTL:** 5 years to satisfy legal discovery requirements.
- **Security Benefit:** Even if an agent uploads to the wrong email address, the file password acts as a second barrier preventing unauthorized access.

### B.3 Fax-to-Email Services

- Uploads are automated (machine-to-machine) via the POST API.
- The password is generated programmatically and is a mutually known value (e.g., Tax ID suffix).
- No human interaction is required during upload. The recipient receives the Vellum email and uses the pre-shared password.

### B.4 Universities

- **File TTL:** 30 days for transcript delivery.
- **Link TTL:** 48 hours to prevent links sitting in public-computer inboxes.
- **Dashboard Benefit:** WorkOS SSO allows students to log in with their institutional identity and request a new link without calling the Registrar's office.

---

## Appendix C: Known Issues & Recommendations

### C.1 Brute Force Risk on `/api/verify`

**Issue:** The password verification endpoint has no rate limiting. A malicious actor with valid token in hand could brute-force the file password.
**Recommendation:** Add `express-rate-limit` middleware scoped to the token value. Limit to 5 failed attempts per token per 15 minutes.

```typescript
import rateLimit from "express-rate-limit";

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body.token ?? req.ip,
  message: { error: "Too many attempts. Please try again later." },
});

router.post("/verify", verifyLimiter, async (req, res) => { ... });
```

### C.2 ClamAV Startup Delay

**Issue:** ClamAV downloads virus definitions on container startup. This can take 2–5 minutes. During this window, the application container may be ready before ClamAV is, allowing uploads to bypass scanning.
**Recommendation:** Use Docker Compose `healthcheck` on the ClamAV container and set `condition: service_healthy` in the app's `depends_on`. The application should refuse uploads if ClamAV is unreachable rather than silently skipping the scan.

```yaml
clamav:
  healthcheck:
    test: ["CMD", "clamdcheck.sh"]
    interval: 30s
    retries: 10
    start_period: 120s

app:
  depends_on:
    clamav:
      condition: service_healthy
```

### C.3 Presigned URL Race Condition

**Issue:** The `isUsed = true` flag is set at the moment the presigned URL is generated, not when the download completes. If the user's browser crashes or the connection drops in the 30-second window, the user is locked out and must use Path B to regenerate.
**Recommendation:** This is an acceptable UX trade-off given the security model. Document this behavior clearly in the user-facing UI (e.g., *"If your download did not start, please log in to request a new link."*). Optionally, allow up to 3 re-verifications per token within a 5-minute window before setting `isUsed = true` permanently.

### C.4 File Password Delivery Channel

**Issue:** The API specification does not document that the file password **must** be communicated to the recipient via a separate, out-of-band channel. If an integrating party (e.g., the bank) includes the password in the same email as the download link, the two-key security model is completely defeated.
**Recommendation:** Include an explicit warning in the API documentation and the upload endpoint response:

```json
{
  "id": "doc_uuid",
  "warning": "The file password must be communicated to the recipient via a separate channel (e.g., SMS, phone call). Do not include it in the same email as the download link."
}
```

### C.5 Silent Audit Event Loss

**Issue:** `logEvent` is fire-and-forget. If Redis is temporarily unavailable, audit events are dropped. A `console.error` is emitted but no recovery occurs.
**Recommendation:**

1. Enable Redis persistence in Docker Compose (`appendonly yes`) to prevent queue data loss on restart.
2. For production on AWS, use **ElastiCache with Multi-AZ** to minimize Redis downtime.
3. Consider a fallback where failed queue additions are written synchronously to a `FailedAuditLog` Postgres table for later reconciliation.

### C.6 `linkTtl > fileTtl` Constraint

**Issue:** Without enforcement at the API layer, an uploader could set `linkTtl > fileTtl`, meaning the email link would still be valid even after the file has been deleted from S3. The verify endpoint would then return an unhelpful error.
**Recommendation:** This is already addressed in Section 7.2 with a Zod `.refine()` check. Ensure this constraint is also documented in the external API specification so integrating parties are aware of it.

```typescript
.refine((data) => data.linkTtl <= data.fileTtl, {
  message: "linkTtl cannot exceed fileTtl",
});
```
