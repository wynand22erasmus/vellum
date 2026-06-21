/**
 * Maps each {@link AuditEventType} to its `WEBHOOK_URL_*` environment variable.
 *
 * @packageDocumentation
 */

import type { AuditEventType } from '../../../generated/client.ts';
import { env } from '../env.ts';

/** Environment variable name for each audit event type webhook target URL. */
export const WEBHOOK_URL_ENV_BY_EVENT_TYPE: Record<AuditEventType, string> = {
  USER_LOGIN: 'WEBHOOK_URL_USER_LOGIN',
  EMAIL_INITIAL_SENT: 'WEBHOOK_URL_EMAIL_INITIAL_SENT',
  EMAIL_REGENERATE_SENT: 'WEBHOOK_URL_EMAIL_REGENERATE_SENT',
  FILE_DOWNLOAD_SUCCESS: 'WEBHOOK_URL_FILE_DOWNLOAD_SUCCESS',
  FILE_DOWNLOAD_FAILED: 'WEBHOOK_URL_FILE_DOWNLOAD_FAILED',
  FILE_PURGED: 'WEBHOOK_URL_FILE_PURGED',
  LINK_REVOKED: 'WEBHOOK_URL_LINK_REVOKED',
  CAPTCHA_FAILED: 'WEBHOOK_URL_CAPTCHA_FAILED',
  RECIPIENT_OTP_SENT: 'WEBHOOK_URL_RECIPIENT_OTP_SENT',
  RECIPIENT_OTP_RESENT: 'WEBHOOK_URL_RECIPIENT_OTP_RESENT',
  RECIPIENT_OTP_FAILED: 'WEBHOOK_URL_RECIPIENT_OTP_FAILED',
  RECIPIENT_OTP_VERIFIED: 'WEBHOOK_URL_RECIPIENT_OTP_VERIFIED',
  SFTP_FILE_RECEIVED: 'WEBHOOK_URL_SFTP_FILE_RECEIVED',
  SFTP_METADATA_VALIDATED: 'WEBHOOK_URL_SFTP_METADATA_VALIDATED',
  SFTP_VIRUS_SCAN_PASSED: 'WEBHOOK_URL_SFTP_VIRUS_SCAN_PASSED',
  SFTP_DOCUMENT_CREATED: 'WEBHOOK_URL_SFTP_DOCUMENT_CREATED',
  SFTP_STORAGE_UPLOADED: 'WEBHOOK_URL_SFTP_STORAGE_UPLOADED',
  SFTP_EMAIL_QUEUED: 'WEBHOOK_URL_SFTP_EMAIL_QUEUED',
  SFTP_INGESTION_COMPLETED: 'WEBHOOK_URL_SFTP_INGESTION_COMPLETED',
  SFTP_INGESTION_FAILED: 'WEBHOOK_URL_SFTP_INGESTION_FAILED',
};

/**
 * Returns the configured webhook target URL for an event type, if delivery is enabled.
 *
 * @param eventType - Audit event that was persisted
 */
export function webhookUrlForEventType(eventType: AuditEventType): string | undefined {
  if (!env.webhooksEnabled) {
    return undefined;
  }

  const envKey = WEBHOOK_URL_ENV_BY_EVENT_TYPE[eventType];
  const url = process.env[envKey]?.trim();
  return url || undefined;
}
