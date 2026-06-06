/**
 * Admin API queries for the app.
 *
 * @packageDocumentation
 */

import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api-client';
import { fetchAdminListPage } from '@/lib/queries/fetch-json';
import {
  ADMIN_DEFAULT_PAGE_SIZE,
  queryKeys,
  type AdminListParams,
} from '@/lib/queries/query-keys';

/** Admin users table row from `/api/admin/users`. */
export type AdminUserRow = {
  id: string;
  email: string;
  emailVerified: boolean;
  kind: string;
  firstName: string | null;
  lastName: string | null;
  lastSignInAt: string | null;
  createdAt: string;
};

/** Admin documents table row from `/api/admin/documents`. */
export type AdminDocumentRow = {
  id: string;
  fileName: string;
  recipientEmail: string;
  createdAt: string;
  linkExpiresAt: string;
  fileExpiresAt: string;
  isUsed: boolean;
  deletedAt: string | null;
  linkActive: boolean;
  fileAvailable: boolean;
};

/** Single document detail including audit log entries. */
export type AdminDocumentDetail = AdminDocumentRow & {
  auditLogs: Array<{
    id: string;
    eventType: string;
    timestamp: string;
    ipAddress: string | null;
  }>;
};

const defaultListParams: AdminListParams = {
  limit: ADMIN_DEFAULT_PAGE_SIZE,
  offset: 0,
};

/** Generic admin list hook keyed by endpoint and response field. */
export function useAdminListPageQuery<T>(
  endpoint: string,
  dataKey: string,
  params: AdminListParams = defaultListParams,
) {
  return useQuery({
    queryKey: queryKeys.admin.list(endpoint, dataKey, params),
    queryFn: () => fetchAdminListPage<T>(endpoint, dataKey, params),
  });
}

/** Load paginated admin users. */
export function useAdminUsersQuery(params: AdminListParams = defaultListParams) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => fetchAdminListPage<AdminUserRow>('/api/admin/users', 'users', params),
  });
}

/** Load paginated admin documents. */
export function useAdminDocumentsQuery(params: AdminListParams = defaultListParams) {
  return useQuery({
    queryKey: queryKeys.admin.documents(params),
    queryFn: () =>
      fetchAdminListPage<AdminDocumentRow>('/api/admin/documents', 'documents', params),
  });
}

/** Load a single admin document with audit logs. */
export function useAdminDocumentQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.document(id),
    queryFn: async () => {
      const data = await fetchJson<{ document: AdminDocumentDetail }>(`/api/admin/documents/${id}`);
      return data.document;
    },
    enabled: Boolean(id),
  });
}
