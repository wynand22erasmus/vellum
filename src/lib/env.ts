/**
 * Typed environment configuration loaded from `process.env`.
 *
 * @packageDocumentation
 * @see docs/CONFIG.md for the full variable reference
 */

import { AppError } from './errors/app-error.ts';
import { parseJsonStringArray } from './env-json.ts';
import { parseAllowedUploadExtensionsFromEnv } from './uploadFilename.ts';
import {
  buildMinioPublicEndpoint,
  buildPublicUrl,
  buildWorkosRedirectUri,
} from './public-url.ts';

const DEFAULT_ADMIN_EMAILS_FALLBACK = ['wynand22erasmus@gmail.com'];

/**
 * @internal
 * @param key - Environment variable name
 * @returns Raw string value
 * @throws `AppError` When the variable is unset or empty
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw AppError.internal(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * @internal
 * @param key - Environment variable name
 * @param fallback - Value used when unset
 */
function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

/** Application configuration derived from environment variables. @see docs/CONFIG.md */
export const env = {
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  appUrl: buildPublicUrl(),
  port: Number(optionalEnv('PORT', '3000')),
  apiKey: optionalEnv('API_KEY', 'dev-api-key-change-in-production'),
  databaseUrl: () => requireEnv('DATABASE_URL'),
  redisUrl: optionalEnv('REDIS_URL', 'redis://localhost:6379'),
  minioEndpoint: optionalEnv('MINIO_ENDPOINT', 'http://localhost:9000'),
  /** Browser-reachable S3 endpoint for presigned download URLs. */
  minioPublicEndpoint: buildMinioPublicEndpoint(),
  minioRootUser: optionalEnv('MINIO_ROOT_USER', 'minioadmin'),
  minioRootPassword: optionalEnv('MINIO_ROOT_PASSWORD', 'minioadmin'),
  minioBucket: optionalEnv('MINIO_BUCKET_NAME', 'vellum-documents'),
  awsRegion: optionalEnv('AWS_REGION', 'us-east-1'),
  clamavHost: optionalEnv('CLAMAV_HOST', 'localhost'),
  clamavPort: Number(optionalEnv('CLAMAV_PORT', '3310')),
  authProvider: optionalEnv('AUTH_PROVIDER', 'dev'),
  sessionSecret: optionalEnv('SESSION_SECRET', 'dev-session-secret-change-in-production'),
  workosApiKey: () => process.env.WORKOS_API_KEY,
  workosClientId: () => process.env.WORKOS_CLIENT_ID,
  workosRedirectUri: buildWorkosRedirectUri(),
  emailProvider: optionalEnv('EMAIL_PROVIDER', 'local'),
  mailpitHost: optionalEnv('MAILPIT_HOST', 'localhost'),
  mailpitPort: Number(optionalEnv('MAILPIT_PORT', '1025')),
  reportingLifetimeYears: Number(optionalEnv('REPORTING_LIFETIME_YEARS', '5')),
  maxUploadBytes: Number(optionalEnv('MAX_UPLOAD_BYTES', '52428800')),
  /**
   * Lowercase extensions without dots (e.g. `pdf`, `docx`). From `ALLOWED_UPLOAD_EXTENSIONS`
   * JSON array; unset uses defaults. Include `"*"` to allow any extension (sanitization still applies).
   */
  allowedUploadExtensions: parseAllowedUploadExtensionsFromEnv(process.env.ALLOWED_UPLOAD_EXTENSIONS),
  isProduction: optionalEnv('NODE_ENV', 'development') === 'production',
  /** Dev/test only — skips ClamAV INSTREAM scans when `SKIP_VIRUS_SCAN=true`. Ignored in production. */
  skipVirusScan:
    optionalEnv('NODE_ENV', 'development') !== 'production' &&
    optionalEnv('SKIP_VIRUS_SCAN', 'false') === 'true',
  /**
   * Dev/E2E only — allows dashboard access without `emailVerified` when `true`.
   * Ignored in production. Never enable in deployed environments.
   */
  skipEmailVerification:
    optionalEnv('NODE_ENV', 'development') !== 'production' &&
    optionalEnv('SKIP_EMAIL_VERIFICATION', 'false') === 'true',
  /** Lowercase emails promoted to `UserKind` `ADMIN` on sign-in. */
  defaultAdminEmails: parseJsonStringArray(
    process.env.DEFAULT_ADMIN_EMAILS,
    DEFAULT_ADMIN_EMAILS_FALLBACK,
  ),
  /** Directory for NDJSON process-error logs (`process-errors.ndjson`). */
  logDir: optionalEnv('LOG_DIR', 'logs'),
  /** Base URL for RFC 9457 Problem Details `type` URIs. */
  problemTypeBaseUrl: optionalEnv('PROBLEM_TYPE_BASE_URL', 'https://vellum.dev/problems'),
  /** Build-time white-label preset id (must match VITE_BRAND_PRESET). */
  brandPreset: optionalEnv('BRAND_PRESET', 'vellum'),
  /** Enable orphan reconciliation cron job (Phase 4.2). */
  orphanReconcileEnabled: optionalEnv('ORPHAN_RECONCILE_ENABLED', 'false') === 'true',
  /** Cron pattern for orphan reconciliation (default: daily 03:00). */
  orphanReconcileCron: optionalEnv('ORPHAN_RECONCILE_CRON', '0 3 * * *'),
  /** Default max downloads when upload omits `maxDownloads`. */
  defaultMaxDownloads: Number(optionalEnv('DEFAULT_MAX_DOWNLOADS', '1')),
  /** Max recipients per batch upload (`POST /api/upload/batch`). */
  maxBatchRecipients: Number(optionalEnv('MAX_BATCH_RECIPIENTS', '50')),
  /** When true, the worker watches the SFTP inbox directory for new files. */
  sftpEnabled: optionalEnv('SFTP_ENABLED', 'false') === 'true',
  /** Host path watched for SFTP drops (shared with atmoz/sftp upload volume). */
  sftpInboxPath: optionalEnv('SFTP_INBOX_PATH', '/sftp'),
  /** Directory for successfully ingested source files and manifests. */
  sftpArchivePath: optionalEnv('SFTP_ARCHIVE_PATH', '/sftp/archive'),
  /** Directory for failed ingestions (file, manifest, and error sidecar). */
  sftpFailedPath: optionalEnv('SFTP_FAILED_PATH', '/sftp/failed'),
  /** Sidecar manifest suffix appended to the data filename (e.g. `report.pdf.json`). */
  sftpManifestSuffix: optionalEnv('SFTP_MANIFEST_SUFFIX', '.json'),
  /** SFTP username label included in audit metadata. */
  sftpUser: optionalEnv('SFTP_USER', 'partner'),
  /** Poll interval for the SFTP inbox watcher (milliseconds). */
  sftpPollIntervalMs: Number(optionalEnv('SFTP_POLL_INTERVAL_MS', '5000')),
  /** How long a file size must remain unchanged before processing (milliseconds). */
  sftpStableFileMs: Number(optionalEnv('SFTP_STABLE_FILE_MS', '2000')),
  /** Re-verify window in ms before a download consumption is finalized. */
  reverifyWindowMs: Number(optionalEnv('REVERIFY_WINDOW_MS', '300000')),
  /** Password successes allowed within {@link reverifyWindowMs} before consuming a download. */
  maxReverifyAttempts: Number(optionalEnv('MAX_REVERIFY_ATTEMPTS', '3')),
  /** Max rows per admin audit export page. */
  auditExportMaxLimit: Number(optionalEnv('AUDIT_EXPORT_MAX_LIMIT', '500')),
  /** Captcha provider for verify page: `off` or `hcaptcha`. */
  captchaProvider: optionalEnv('CAPTCHA_PROVIDER', 'off') as 'off' | 'hcaptcha',
  /** hCaptcha site key (exposed to SPA via `/api/meta`). */
  hcaptchaSiteKey: () => process.env.HCAPTCHA_SITE_KEY,
  /** hCaptcha secret for server-side siteverify. */
  hcaptchaSecretKey: () => process.env.HCAPTCHA_SECRET_KEY,
  /** Dev/E2E only — skip hCaptcha verification (ignored in production). */
  skipCaptcha:
    optionalEnv('NODE_ENV', 'development') !== 'production' &&
    optionalEnv('SKIP_CAPTCHA', 'false') === 'true',
  /** Master switch for per-upload recipient OTP after password verify. */
  recipientOtpEnabled: optionalEnv('RECIPIENT_OTP_ENABLED', 'false') === 'true',
  /** OTP code TTL in seconds (Redis-backed email/SMS/WhatsApp codes). */
  otpTtlSeconds: Number(optionalEnv('OTP_TTL_SECONDS', '600')),
  /** Max wrong OTP attempts per session. */
  otpMaxAttempts: Number(optionalEnv('OTP_MAX_ATTEMPTS', '5')),
  /** Max OTP resend requests per session. */
  otpMaxResends: Number(optionalEnv('OTP_MAX_RESENDS', '3')),
  /** Dev/E2E fixed OTP code when Twilio/Mailpit path is not used. */
  recipientOtpDevCode: () => process.env.RECIPIENT_OTP_DEV_CODE,
  twilioAccountSid: () => process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: () => process.env.TWILIO_AUTH_TOKEN,
  twilioFromNumber: () => process.env.TWILIO_FROM_NUMBER,
  /** Key for encrypting TOTP secrets at rest (defaults to session secret in dev). */
  totpEncryptionKey: () =>
    process.env.TOTP_ENCRYPTION_KEY ??
    optionalEnv('SESSION_SECRET', 'dev-session-secret-change-in-production'),
  /** Master switch for outbound audit webhooks. */
  webhooksEnabled: optionalEnv('WEBHOOKS_ENABLED', 'false') === 'true',
  /** HMAC secret for `X-Vellum-Signature` (required when webhooks are enabled). */
  webhookSecret: () => {
    if (optionalEnv('WEBHOOKS_ENABLED', 'false') !== 'true') {
      return optionalEnv('WEBHOOK_SECRET', 'dev-webhook-secret-change-me');
    }
    return requireEnv('WEBHOOK_SECRET');
  },
  /** BullMQ retry attempts per webhook delivery job. */
  webhookMaxRetries: Number(optionalEnv('WEBHOOK_MAX_RETRIES', '5')),
};
