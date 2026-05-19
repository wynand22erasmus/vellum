/**
 * Typed environment configuration loaded from `process.env`.
 *
 * @packageDocumentation
 * @see docs/CONFIG.md for the full variable reference
 */

import { parseJsonStringArray } from './env-json.ts';
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
 * @throws {Error} When the variable is unset or empty
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
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
  /** Lowercase emails promoted to {@link UserKind.ADMIN} on sign-in. */
  defaultAdminEmails: parseJsonStringArray(
    process.env.DEFAULT_ADMIN_EMAILS,
    DEFAULT_ADMIN_EMAILS_FALLBACK,
  ),
};
