/**
 * Audit log event type values for admin filter dropdowns.
 *
 * @packageDocumentation
 */

/** Known audit event types plus an empty value meaning “all types”. */
export const ADMIN_AUDIT_EVENT_TYPES = [
  '',
  'USER_LOGIN',
  'EMAIL_INITIAL_SENT',
  'EMAIL_REGENERATE_SENT',
  'FILE_DOWNLOAD_SUCCESS',
  'FILE_DOWNLOAD_FAILED',
  'FILE_SCRUBBED',
  'LINK_REVOKED',
  'CAPTCHA_FAILED',
  'RECIPIENT_OTP_SENT',
  'RECIPIENT_OTP_RESENT',
  'RECIPIENT_OTP_FAILED',
  'RECIPIENT_OTP_VERIFIED',
  'SFTP_FILE_RECEIVED',
  'SFTP_METADATA_VALIDATED',
  'SFTP_VIRUS_SCAN_PASSED',
  'SFTP_DOCUMENT_CREATED',
  'SFTP_STORAGE_UPLOADED',
  'SFTP_EMAIL_QUEUED',
  'SFTP_INGESTION_COMPLETED',
  'SFTP_INGESTION_FAILED',
] as const;

/** Select options derived from {@link ADMIN_AUDIT_EVENT_TYPES}. */
export const ADMIN_AUDIT_EVENT_TYPE_OPTIONS = ADMIN_AUDIT_EVENT_TYPES.map((value) => ({
  value,
  label: value || 'All types',
}));
