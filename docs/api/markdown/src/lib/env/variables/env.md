# Variable: env

> `const` **env**: `object`

Defined in: [src/lib/env.ts:43](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/env.ts#L43)

Application configuration derived from environment variables.

## Type Declaration

### allowedUploadExtensions

> **allowedUploadExtensions**: `string`[]

Lowercase extensions without dots (e.g. `pdf`, `docx`). From `ALLOWED_UPLOAD_EXTENSIONS`
JSON array; unset uses defaults. Include `"*"` to allow any extension (sanitization still applies).

### apiKey

> **apiKey**: `string`

### appUrl

> **appUrl**: `string`

### auditExportMaxLimit

> **auditExportMaxLimit**: `number`

Max rows per admin audit export page.

### authProvider

> **authProvider**: `string`

### awsRegion

> **awsRegion**: `string`

### brandPreset

> **brandPreset**: `string`

Build-time white-label preset id (must match VITE_BRAND_PRESET).

### captchaProvider

> **captchaProvider**: `"off"` \| `"hcaptcha"`

Captcha provider for verify page: `off` or `hcaptcha`.

### clamavHost

> **clamavHost**: `string`

### clamavPort

> **clamavPort**: `number`

### databaseUrl

> **databaseUrl**: () => `string`

#### Returns

`string`

### defaultAdminEmails

> **defaultAdminEmails**: `string`[]

Lowercase emails promoted to `UserKind` `ADMIN` on sign-in.

### defaultMaxDownloads

> **defaultMaxDownloads**: `number`

Default max downloads when upload omits `maxDownloads`.

### emailProvider

> **emailProvider**: `string`

### hcaptchaSecretKey

> **hcaptchaSecretKey**: () => `string` \| `undefined`

hCaptcha secret for server-side siteverify.

#### Returns

`string` \| `undefined`

### hcaptchaSiteKey

> **hcaptchaSiteKey**: () => `string` \| `undefined`

hCaptcha site key (exposed to SPA via `/api/meta`).

#### Returns

`string` \| `undefined`

### isProduction

> **isProduction**: `boolean`

### logDir

> **logDir**: `string`

Directory for NDJSON process-error logs (`process-errors.ndjson`).

### mailpitHost

> **mailpitHost**: `string`

### mailpitPort

> **mailpitPort**: `number`

### maxBatchRecipients

> **maxBatchRecipients**: `number`

Max recipients per batch upload (`POST /api/upload/batch`).

### maxReverifyAttempts

> **maxReverifyAttempts**: `number`

Password successes allowed within [reverifyWindowMs](#reverifywindowms) before consuming a download.

### maxUploadBytes

> **maxUploadBytes**: `number`

### minioBucket

> **minioBucket**: `string`

### minioEndpoint

> **minioEndpoint**: `string`

### minioPublicEndpoint

> **minioPublicEndpoint**: `string`

Browser-reachable S3 endpoint for presigned download URLs.

### minioRootPassword

> **minioRootPassword**: `string`

### minioRootUser

> **minioRootUser**: `string`

### nodeEnv

> **nodeEnv**: `string`

### orphanReconcileCron

> **orphanReconcileCron**: `string`

Cron pattern for orphan reconciliation (default: daily 03:00).

### orphanReconcileEnabled

> **orphanReconcileEnabled**: `boolean`

Enable orphan reconciliation cron job (Phase 4.2).

### otpMaxAttempts

> **otpMaxAttempts**: `number`

Max wrong OTP attempts per session.

### otpMaxResends

> **otpMaxResends**: `number`

Max OTP resend requests per session.

### otpTtlSeconds

> **otpTtlSeconds**: `number`

OTP code TTL in seconds (Redis-backed email/SMS/WhatsApp codes).

### port

> **port**: `number`

### problemTypeBaseUrl

> **problemTypeBaseUrl**: `string`

Base URL for RFC 9457 Problem Details `type` URIs.

### recipientOtpDevCode

> **recipientOtpDevCode**: () => `string` \| `undefined`

Dev/E2E fixed OTP code when Twilio/Mailpit path is not used.

#### Returns

`string` \| `undefined`

### recipientOtpEnabled

> **recipientOtpEnabled**: `boolean`

Master switch for per-upload recipient OTP after password verify.

### redisUrl

> **redisUrl**: `string`

### reportingLifetimeYears

> **reportingLifetimeYears**: `number`

### reverifyWindowMs

> **reverifyWindowMs**: `number`

Re-verify window in ms before a download consumption is finalized.

### sessionSecret

> **sessionSecret**: `string`

### sftpArchivePath

> **sftpArchivePath**: `string`

Directory for successfully ingested source files and manifests.

### sftpEnabled

> **sftpEnabled**: `boolean`

When true, the worker watches the SFTP inbox directory for new files.

### sftpFailedPath

> **sftpFailedPath**: `string`

Directory for failed ingestions (file, manifest, and error sidecar).

### sftpInboxPath

> **sftpInboxPath**: `string`

Host path watched for SFTP drops (shared with atmoz/sftp upload volume).

### sftpManifestSuffix

> **sftpManifestSuffix**: `string`

Sidecar manifest suffix appended to the data filename (e.g. `report.pdf.json`).

### sftpPollIntervalMs

> **sftpPollIntervalMs**: `number`

Poll interval for the SFTP inbox watcher (milliseconds).

### sftpStableFileMs

> **sftpStableFileMs**: `number`

How long a file size must remain unchanged before processing (milliseconds).

### sftpUser

> **sftpUser**: `string`

SFTP username label included in audit metadata.

### skipCaptcha

> **skipCaptcha**: `boolean`

Dev/E2E only — skip hCaptcha verification (ignored in production).

### skipEmailVerification

> **skipEmailVerification**: `boolean`

Dev/E2E only — allows dashboard access without `emailVerified` when `true`.
Ignored in production. Never enable in deployed environments.

### skipVirusScan

> **skipVirusScan**: `boolean`

Dev/test only — skips ClamAV INSTREAM scans when `SKIP_VIRUS_SCAN=true`. Ignored in production.

### totpEncryptionKey

> **totpEncryptionKey**: () => `string`

Key for encrypting TOTP secrets at rest (defaults to session secret in dev).

#### Returns

`string`

### twilioAccountSid

> **twilioAccountSid**: () => `string` \| `undefined`

#### Returns

`string` \| `undefined`

### twilioAuthToken

> **twilioAuthToken**: () => `string` \| `undefined`

#### Returns

`string` \| `undefined`

### twilioFromNumber

> **twilioFromNumber**: () => `string` \| `undefined`

#### Returns

`string` \| `undefined`

### webhookMaxRetries

> **webhookMaxRetries**: `number`

BullMQ retry attempts per webhook delivery job.

### webhookSecret

> **webhookSecret**: () => `string`

HMAC secret for `X-Vellum-Signature` (required when webhooks are enabled).

#### Returns

`string`

### webhooksEnabled

> **webhooksEnabled**: `boolean`

Master switch for outbound audit webhooks.

### workosApiKey

> **workosApiKey**: () => `string` \| `undefined`

#### Returns

`string` \| `undefined`

### workosClientId

> **workosClientId**: () => `string` \| `undefined`

#### Returns

`string` \| `undefined`

### workosRedirectUri

> **workosRedirectUri**: `string`

## See

docs/CONFIG.md
