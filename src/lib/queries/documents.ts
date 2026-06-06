/**
 * Recipient dashboard document queries.
 *
 * @packageDocumentation
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api-client';
import { queryKeys } from '@/lib/queries/query-keys';

/** Recipient dashboard document row. */
export type DocumentRow = {
  id: string;
  fileName: string;
  linkExpiresAt: string;
  fileExpiresAt: string;
  isUsed: boolean;
  linkActive: boolean;
  fileAvailable: boolean;
  createdAt: string;
};

/** Load documents for the signed-in recipient. */
export function useDocumentsQuery() {
  return useQuery({
    queryKey: queryKeys.documents.list(),
    queryFn: async () => {
      const data = await fetchJson<{ documents: DocumentRow[] }>('/api/documents');
      return data.documents;
    },
  });
}

/** Request a new download link for a document. */
export function useRequestDocumentLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const data = await fetchJson<{ message?: string }>(`/api/documents/${id}/request-link`, {
        method: 'POST',
      });
      return data.message ?? 'Link sent.';
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}
