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
] as const;

/** Select options derived from {@link ADMIN_AUDIT_EVENT_TYPES}. */
export const ADMIN_AUDIT_EVENT_TYPE_OPTIONS = ADMIN_AUDIT_EVENT_TYPES.map((value) => ({
  value,
  label: value || 'All types',
}));
