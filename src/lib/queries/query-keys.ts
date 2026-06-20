/**
 * TanStack Query key factory for list and admin queries.
 *
 * @packageDocumentation
 */

export type ListParams = {
  limit?: number;
  offset?: number;
};

/** Pagination and filter params for admin list endpoints. */
export type AdminListParams = ListParams & {
  [key: string]: string | number | undefined;
};

/** Default page size for admin list queries. */
export const ADMIN_DEFAULT_PAGE_SIZE = 50;

/** Build query string for paginated admin list endpoints. */
export function buildAdminListQuery(params: AdminListParams = {}): string {
  const qs = new URLSearchParams();
  qs.set('limit', String(params.limit ?? ADMIN_DEFAULT_PAGE_SIZE));
  qs.set('offset', String(params.offset ?? 0));

  for (const [key, value] of Object.entries(params)) {
    if (key === 'limit' || key === 'offset') continue;
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (trimmed) {
      qs.set(key, trimmed);
    }
  }

  return qs.toString();
}

/** @deprecated Use {@link buildAdminListQuery} */
export function adminListQuery(params: ListParams = {}): string {
  return buildAdminListQuery(params);
}

/** Query key factory for list and admin queries. */
export const queryKeys = {
  documents: {
    all: ['documents'] as const,
    list: () => [...queryKeys.documents.all, 'list'] as const,
  },
  admin: {
    all: ['admin'] as const,
    users: (params?: AdminListParams) => [...queryKeys.admin.all, 'users', params ?? {}] as const,
    documents: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'documents', params ?? {}] as const,
    documentFiles: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'document-files', params ?? {}] as const,
    document: (id: string) => [...queryKeys.admin.all, 'document', id] as const,
    documentFile: (id: string) => [...queryKeys.admin.all, 'document-file', id] as const,
    auditLogs: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'audit-logs', params ?? {}] as const,
    failedAuditLogs: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'failed-audit-logs', params ?? {}] as const,
    processErrors: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'process-errors', params ?? {}] as const,
    failedProcessErrors: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'failed-process-errors', params ?? {}] as const,
    list: (endpoint: string, dataKey: string, params?: AdminListParams) =>
      [...queryKeys.admin.all, 'list', endpoint, dataKey, params ?? {}] as const,
  },
};
