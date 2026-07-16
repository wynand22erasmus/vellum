# Error handling (RFC 9457)

Vellum uses a single standard for every operational failure across HTTP routes, workers, and shared libraries.

## Canonical error type

**`AppError`** (`src/lib/errors/app-error.ts`) is the only operational error class. Routes, middleware, workers, and lib code must throw `AppError` (via static factories) — not ad-hoc `Error` subclasses or plain `Error` for user-facing failures.

Import from `src/lib/errors/index.ts` or `app-error.ts`:

| Factory | Slug | Typical use |
|---------|------|-------------|
| `AppError.badRequest` | `validation-error` | Invalid input, bad tokens |
| `AppError.unauthorized` | `unauthorized` | Missing/invalid session or credentials |
| `AppError.forbidden` | `forbidden` | Access denied |
| `AppError.emailNotVerified` | `forbidden` (+ `reason: EMAIL_NOT_VERIFIED`) | Dashboard sign-in before email verify |
| `AppError.notFound` | `not-found` | Missing resources |
| `AppError.gone` | `gone` | Expired links |
| `AppError.unprocessableContent` | `unprocessable-content` | Virus scan rejection |
| `AppError.tooManyRequests` | `too-many-requests` | Rate limits |
| `AppError.uploadRejected` | `upload-rejected` | Filename / extension policy |
| `AppError.partialFailure` | `partial-failure` | Compensation undo failed (`compensationFailedError`) |
| `AppError.internal` | `internal-error` | Unexpected failures, misconfiguration |
| `AppError.serviceUnavailable` | `service-unavailable` | ClamAV, WorkOS, DB URL missing |

`problemFromError(unknown)` maps **foreign** errors only at boundaries (never thrown from routes as plain `Error`):

| Foreign type | Mapped to |
|--------------|-----------|
| `AppError` | Direct Problem Details (+ orphan extensions) |
| `ZodError` | `validation-error` + `invalidParams` |
| `MulterError` | `validation-error` (size / upload) |
| `Prisma.PrismaClientKnownRequestError` | `internal-error` (code in internal log only) |
| Anything else | `internal-error` (generic detail; message not leaked) |

## Required patterns

| Layer | Approach |
|-------|----------|
| HTTP routes & middleware | `throw AppError…` or `next(err)` — never `res.status().json({ error })` |
| Global handling | `errorHandler` → `recordProcessError()` → `sendProblem()` |
| Async routes | Wrap with `asyncHandler()` |
| Workers | `recordProcessError({ source: 'worker', ... })` on `failed` hooks |
| Frontend | `parseProblem(res)` / `problemMessage(problem)` |
| Multi-step mutations | `CompensationStack` with LIFO undo |

## Intentional exceptions (not `AppError`)

These are programmer errors or client-side control flow, not operational API failures:

| Location | Pattern | Why |
|----------|---------|-----|
| React context hooks (`useTheme`, `useAuthContext`, `useSidebar`, `useRouteChrome`) | `throw new Error('…must be used within…')` | Dev-time invariant; never hits `problemFromError` |
| Frontend pages (`DevLoginPage`, `EmailVerificationPage`) | `throw new Error(problemMessage(problem))` | UI error state after `parseProblem` |
| `studio-pg-executor` `abortError()` | Plain `Error` with `name: 'AbortError'` | Prisma Studio query cancellation tuple |
| `compensation-stack.test.ts` | Plain `Error` in test doubles | Simulates failed undo steps |

Lib modules that previously threw plain `Error` now throw `AppError` (env, clamav, session, email verification tokens, workos, studio pool, email worker, reconcile skip uses early `return` instead of throw).

## Problem Details

All API errors return `Content-Type: application/problem+json` with stable `type` URIs under `PROBLEM_TYPE_BASE_URL` (default `https://vellum.dev/problems`).

Catalog: `src/lib/errors/problem-types.ts`

## Triple-write pipeline

Every handled error is:

1. Appended to `{LOG_DIR}/process-errors.ndjson` (pino NDJSON)
2. Enqueued on `process-errors-queue` → persisted to `ProcessError`
3. Returned as Problem Details on HTTP JSON paths

Enqueue failures go to `DeadLetter` with `pipeline = PROCESS_ERROR`.

## Audit events and webhooks

Full event catalog, `metadata` conventions, logging gaps, and webhook specification: [EVENTS_AND_WEBHOOKS.md](./EVENTS_AND_WEBHOOKS.md).

## Audit ↔ process-error linking

Cross-table fields tie audit pipeline failures and HTTP/process errors to the same incident:

| Table | Field | Set when |
|-------|-------|----------|
| `ProcessError` | `deadLetterId` | Audit enqueue or worker failed after a `DeadLetter` row was written |
| `ProcessError` | `auditLogId` | Successful audit write linked to this error (via `correlationId` or direct id) |
| `ProcessError` | `correlationId` | Same HTTP request triggered audit + process error (e.g. verify wrong password) |
| `DeadLetter` | `linkedTable` / `linkedId` | Back-filled when the linked `ProcessError` row is persisted |
| `DeadLetter.retried` | — | Reserved for future replay worker; filterable in admin UI today |
| `AuditLog` | `processErrorId` | Back-filled when audit worker or process-error worker resolves the pair |

### Verify wrong password

1. Route generates `correlationId` (UUID).
2. `logEvent({ correlationId, metadata: { correlationId, reason } })` enqueues audit.
3. `req.errorCorrelationId` / `req.errorDocumentId` are set; `AppError` is thrown.
4. `errorHandler` → `recordProcessError({ correlationId, documentId })`.
5. Whichever worker runs second links rows: audit worker looks up `ProcessError` by `correlationId`; process-error worker looks up `AuditLog` by `metadata.correlationId`.

### Audit pipeline failure

1. `DeadLetter` (`pipeline = AUDIT`) is created synchronously.
2. `recordProcessError({ deadLetterId })` enqueues the process error.
3. `processErrorWorker` sets `DeadLetter.linkedTable` / `linkedId` after insert.

## Compensation flows

| Flow | Order | Undo on failure |
|------|-------|-----------------|
| Upload | validate → `create(s3Key:null)` → S3 put → `update(s3Key)` → email | delete doc + S3 |
| Request link | snapshot → update token → email | revert link state |
| Verify | presign → update `downloadCount` | N/A (short-lived URL) |
| File purge worker | DB null `s3Key` first → S3 delete | restore DB row |

When undo fails, responses include `orphanedResources`, `compensationAttempted`, and `compensationFailed` extensions via `AppError.partialFailure` / `compensationFailedError`.

## Frontend snippet

```ts
import { apiPost, ApiQueryError } from '@/lib/api-client';

try {
  const data = await apiPost<{ downloadUrl?: string }>('/api/verify', { token, password });
  // use data.downloadUrl
} catch (err) {
  if (err instanceof ApiQueryError) {
    setError(err.message);
  }
}
```

## Success responses (VellumResult)

Successful API responses use `Content-Type: application/vnd.vellum.result+json` with an RFC 9457-inspired envelope:

| Field | Purpose |
|-------|---------|
| `type` | Stable URI under `RESULT_TYPE_BASE_URL` (default `https://vellum.dev/results/<slug>`) |
| `title` | Fixed catalog title (`OK`, `Created`, `Accepted`) |
| `status` | HTTP status (200, 201, 202) |
| `detail` | Optional human-readable confirmation (detail-only responses use `data: null`) |
| `instance` | Request path when sent from Express helpers |
| `data` | Typed payload; business fields live here |

### Result type catalog

| Slug | Status | Use |
|------|--------|-----|
| `ok` | 200 | Lists, reads, confirmations |
| `created` | 201 | Resource creation (upload) |
| `accepted` | 202 | Async acceptance (reserved) |

### Backend

Import helpers from `src/server/routes/http-helpers.ts` or `sendResult()` from `src/lib/results/`:

```ts
import { ok, created, okMessage } from './http-helpers.ts';

ok(req, res, { documents, total, limit, offset });
created(req, res, { id, warning });
okMessage(req, res, 'Logged out.');
```

Throw `AppError` for failures — never bare `res.json()` on success paths.

### Frontend

Use the unified client in `src/lib/api-client.ts` (`apiGet`, `apiPost`, `fetchJson`). Types and parsers live in `src/lib/http/` and are re-exported from `src/lib/api.ts`.

```ts
import { parseApiEnvelope, unwrapResult } from '@/lib/api';

const parsed = await parseApiEnvelope<MyPayload>(res);
if (parsed.ok) {
  const payload = parsed.data; // or unwrapResult(parsed.result)
}
```

### Intentional exceptions

| Location | Pattern | Why |
|----------|---------|-----|
| `src/server/routes/studio.ts` | Tuple `[error, results]` JSON | Prisma Studio query protocol |

## Codebase conventions

| Concern | Canonical import |
|---------|------------------|
| HTTP envelope types | `@/lib/http` or `@/lib/api` re-exports |
| API transport + parsers | `@/lib/api` (`apiFetch`, `parseApiEnvelope`) |
| Dashboard fetch | `@/lib/api-client` (`apiGet`, `apiPost`, `fetchJson`) |
| Route success helpers | `./http-helpers.ts` (`ok`, `created`, `okMessage`) |
| Sidebar nav | `@/lib/sidebar-nav` (`buildSidebarNav`) |
| Auth loading skeletons | `@/components/layout/auth-skeletons` |
| Shared layout / features | `@/components/layout/*`, `@/components/features/*` |
| Providers | `@/providers/*` |
| UI primitives | `@/components/ui/*` |

Do not import from `@/ui/uiv3/*` (removed). CI gates: `npm run check:error-patterns` (includes a `ui/uiv3` path guard in `src/`).

## Orphan reconciliation (optional)

Set `ORPHAN_RECONCILE_ENABLED=true` to schedule daily `reconcile-orphans` jobs on `cleanup-queue`. See `ORPHAN_RECONCILE_CRON`.

## Enforcement

- ESLint `no-restricted-syntax` on inline error JSON in routes/middleware; `no-restricted-imports` blocks `@/ui/uiv3/*`
- `npm run check:error-patterns` — bans inline error JSON, bare `res.json()` in routes (except `studio.ts`), raw `fetch('/api/')` outside the allowlist, and legacy `ui/uiv3` path strings in `src/`
- Completion: `rg 'json\(\s*\{\s*error'` on `src/` returns no matches

See also [CONFIG.md](./CONFIG.md) for `LOG_DIR`, `PROBLEM_TYPE_BASE_URL`, `RESULT_TYPE_BASE_URL`, and orphan reconciliation env vars.
