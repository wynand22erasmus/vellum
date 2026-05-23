export const ADMIN_AUDIT_EVENT_TYPES = [
  '',
  'USER_LOGIN',
  'EMAIL_INITIAL_SENT',
  'EMAIL_REGENERATE_SENT',
  'FILE_DOWNLOAD_SUCCESS',
  'FILE_DOWNLOAD_FAILED',
  'FILE_SCRUBBED',
] as const;

export type AdminAuditEventType = (typeof ADMIN_AUDIT_EVENT_TYPES)[number];

export const ADMIN_AUDIT_EVENT_TYPE_OPTIONS = ADMIN_AUDIT_EVENT_TYPES.map((value) => ({
  value,
  label: value || 'All types',
}));
