/**
 * Admin API queries for the app.
 *
 * @packageDocumentation
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api-client';
import type {
  Communication,
  CommunicationDetail,
  Document,
  DocumentDetail,
  File,
  FileDetail,
  Recipient,
  RecipientDetail,
  User,
} from '@/lib/db-api-types';
import { fetchAdminListPage } from '@/lib/queries/fetch-json';
import {
  ADMIN_DEFAULT_PAGE_SIZE,
  queryKeys,
  type AdminListParams,
} from '@/lib/queries/query-keys';

export type {
  AuditLog,
  Communication,
  CommunicationAuditLogSummary,
  CommunicationDetail,
  DeadLetter,
  Document,
  DocumentAuditLogSummary,
  DocumentCommunicationSummary,
  DocumentDetail,
  File,
  FileDetail,
  FileDocumentSummary,
  ProcessError,
  Recipient,
  RecipientDetail,
  User,
  WebhookDelivery,
} from '@/lib/db-api-types';

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
    queryKey: queryKeys.admin.User(params),
    queryFn: () => fetchAdminListPage<User>('/api/admin/users', 'User', params),
  });
}

/** Load paginated admin files. */
export function useAdminFilesQuery(params: AdminListParams = defaultListParams) {
  return useQuery({
    queryKey: queryKeys.admin.File(params),
    queryFn: () => fetchAdminListPage<File>('/api/admin/files', 'File', params),
  });
}

/** Load a single file with linked document envelope rows. */
export function useAdminFileQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.FileDetail(id),
    queryFn: async () => {
      const data = await fetchJson<{ File: FileDetail }>(`/api/admin/files/${id}`);
      return data.File;
    },
    enabled: Boolean(id),
  });
}

/** Load paginated admin recipients. */
export function useAdminRecipientsQuery(params: AdminListParams = defaultListParams) {
  return useQuery({
    queryKey: queryKeys.admin.Recipient(params),
    queryFn: () => fetchAdminListPage<Recipient>('/api/admin/recipients', 'Recipient', params),
  });
}

/** Load a single recipient with linked document envelopes. */
export function useAdminRecipientQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.RecipientDetail(id),
    queryFn: async () => {
      const data = await fetchJson<{ Recipient: RecipientDetail }>(`/api/admin/recipients/${id}`);
      return data.Recipient;
    },
    enabled: Boolean(id),
  });
}

/** Load paginated admin communications. */
export function useAdminCommunicationsQuery(params: AdminListParams = defaultListParams) {
  return useQuery({
    queryKey: queryKeys.admin.Communication(params),
    queryFn: () =>
      fetchAdminListPage<Communication>('/api/admin/communications', 'Communication', params),
  });
}

/** Load a single communication with audit logs. */
export function useAdminCommunicationQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.CommunicationDetail(id),
    queryFn: async () => {
      const data = await fetchJson<{ Communication: CommunicationDetail }>(
        `/api/admin/communications/${id}`,
      );
      return data.Communication;
    },
    enabled: Boolean(id),
  });
}

/** Load paginated admin document envelopes. */
export function useAdminDocumentsQuery(params: AdminListParams = defaultListParams) {
  return useQuery({
    queryKey: queryKeys.admin.Document(params),
    queryFn: () => fetchAdminListPage<Document>('/api/admin/documents', 'Document', params),
  });
}

/** Load a single admin document envelope with links and audit logs. */
export function useAdminDocumentQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.DocumentDetail(id),
    queryFn: async () => {
      const data = await fetchJson<{ Document: DocumentDetail }>(`/api/admin/documents/${id}`);
      return data.Document;
    },
    enabled: Boolean(id),
  });
}

/** Revoke all active links on a document envelope (admin session). */
export function useRevokeDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const data = await fetchJson<{ message?: string }>(`/api/documents/${id}/revoke`, {
        method: 'POST',
      });
      return data.message ?? 'All active links revoked.';
    },
    onSuccess: (_message, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.DocumentDetail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}
