/**
 * TanStack Query key factory for list and admin queries.
 *
 * Keys use Prisma model / database table names.
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

/** Query key factory for list and admin queries. */
export const queryKeys = {
  Document: {
    all: ['Document'] as const,
    list: () => [...queryKeys.Document.all, 'list'] as const,
  },
  admin: {
    all: ['admin'] as const,
    User: (params?: AdminListParams) => [...queryKeys.admin.all, 'User', params ?? {}] as const,
    Document: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'Document', params ?? {}] as const,
    DocumentDetail: (id: string) => [...queryKeys.admin.all, 'Document', id] as const,
    File: (params?: AdminListParams) => [...queryKeys.admin.all, 'File', params ?? {}] as const,
    FileDetail: (id: string) => [...queryKeys.admin.all, 'File', id] as const,
    Recipient: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'Recipient', params ?? {}] as const,
    RecipientDetail: (id: string) => [...queryKeys.admin.all, 'Recipient', id] as const,
    Communication: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'Communication', params ?? {}] as const,
    CommunicationDetail: (id: string) =>
      [...queryKeys.admin.all, 'Communication', id] as const,
    AuditLog: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'AuditLog', params ?? {}] as const,
    ProcessError: (params?: AdminListParams) =>
      [...queryKeys.admin.all, 'ProcessError', params ?? {}] as const,
    list: (endpoint: string, dataKey: string, params?: AdminListParams) =>
      [...queryKeys.admin.all, 'list', endpoint, dataKey, params ?? {}] as const,
  },
};
