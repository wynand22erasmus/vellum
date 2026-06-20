/**
 * Shared enum/boolean options for data-table column filters.
 *
 * @packageDocumentation
 */

import type { DataTableFilterOption } from '@/lib/data-table-types';

/** UserKind values for multiselect column filters (no “all” sentinel). */
export const USER_KIND_FILTER_OPTIONS: readonly DataTableFilterOption[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'CONSUMER', label: 'Recipient' },
] as const;

/** RecipientOtpChannel values for multiselect column filters. */
export const RECIPIENT_OTP_CHANNEL_FILTER_OPTIONS: readonly DataTableFilterOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'authenticator', label: 'Authenticator' },
] as const;

/** AuditEventType values for multiselect column filters. */
export const AUDIT_EVENT_TYPE_FILTER_OPTIONS: readonly DataTableFilterOption[] = [
  { value: 'USER_LOGIN', label: 'User login' },
  { value: 'EMAIL_INITIAL_SENT', label: 'Email initial sent' },
  { value: 'EMAIL_REGENERATE_SENT', label: 'Email regenerate sent' },
  { value: 'FILE_DOWNLOAD_SUCCESS', label: 'Download success' },
  { value: 'FILE_DOWNLOAD_FAILED', label: 'Download failed' },
  { value: 'FILE_SCRUBBED', label: 'File scrubbed' },
  { value: 'LINK_REVOKED', label: 'Link revoked' },
  { value: 'CAPTCHA_FAILED', label: 'Captcha failed' },
  { value: 'RECIPIENT_OTP_SENT', label: 'Recipient OTP sent' },
  { value: 'RECIPIENT_OTP_RESENT', label: 'Recipient OTP resent' },
  { value: 'RECIPIENT_OTP_FAILED', label: 'Recipient OTP failed' },
  { value: 'RECIPIENT_OTP_VERIFIED', label: 'Recipient OTP verified' },
  { value: 'SFTP_FILE_RECEIVED', label: 'SFTP file received' },
  { value: 'SFTP_METADATA_VALIDATED', label: 'SFTP metadata validated' },
  { value: 'SFTP_VIRUS_SCAN_PASSED', label: 'SFTP virus scan passed' },
  { value: 'SFTP_DOCUMENT_CREATED', label: 'SFTP document created' },
  { value: 'SFTP_STORAGE_UPLOADED', label: 'SFTP storage uploaded' },
  { value: 'SFTP_EMAIL_QUEUED', label: 'SFTP email queued' },
  { value: 'SFTP_INGESTION_COMPLETED', label: 'SFTP ingestion completed' },
  { value: 'SFTP_INGESTION_FAILED', label: 'SFTP ingestion failed' },
] as const;
