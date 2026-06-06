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

/** AuditEventType values for multiselect column filters. */
export const AUDIT_EVENT_TYPE_FILTER_OPTIONS: readonly DataTableFilterOption[] = [
  { value: 'USER_LOGIN', label: 'User login' },
  { value: 'EMAIL_INITIAL_SENT', label: 'Email initial sent' },
  { value: 'EMAIL_REGENERATE_SENT', label: 'Email regenerate sent' },
  { value: 'FILE_DOWNLOAD_SUCCESS', label: 'Download success' },
  { value: 'FILE_DOWNLOAD_FAILED', label: 'Download failed' },
  { value: 'FILE_SCRUBBED', label: 'File scrubbed' },
] as const;
