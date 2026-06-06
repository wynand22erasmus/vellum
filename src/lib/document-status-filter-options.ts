/**
 * Document status facet values for admin table multiselect filters.
 *
 * @packageDocumentation
 */

import type { DataTableFilterOption } from '@/lib/data-table-types';

/** Status tags derived from admin document row flags. */
export const DOCUMENT_STATUS_FILTER_OPTIONS: readonly DataTableFilterOption[] = [
  { value: 'link-active', label: 'Link active' },
  { value: 'link-expired', label: 'Link expired' },
  { value: 'file-available', label: 'File available' },
  { value: 'file-scrubbed', label: 'File scrubbed' },
  { value: 'downloaded', label: 'Downloaded' },
  { value: 'deleted', label: 'Deleted' },
] as const;

/** Row fields used to derive document status facet tags. */
export type DocumentStatusSource = {
  linkActive: boolean;
  fileAvailable: boolean;
  isUsed: boolean;
  deletedAt?: string | null;
};

/** Builds facet tag ids for multiselect filtering on document rows. */
export function documentStatusFilterTags(doc: DocumentStatusSource): string[] {
  const tags = [
    doc.linkActive ? 'link-active' : 'link-expired',
    doc.fileAvailable ? 'file-available' : 'file-scrubbed',
  ];
  if (doc.isUsed) {
    tags.push('downloaded');
  }
  if (doc.deletedAt) {
    tags.push('deleted');
  }
  return tags;
}
