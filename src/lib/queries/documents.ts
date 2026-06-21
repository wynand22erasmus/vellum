/**
 * Recipient dashboard document queries.
 *
 * @packageDocumentation
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '@/lib/api-client';
import type { Document } from '@/lib/db-api-types';
import { queryKeys } from '@/lib/queries/query-keys';

export type { Document } from '@/lib/db-api-types';

/** Load documents for the signed-in recipient. */
export function useDocumentsQuery() {
  return useQuery({
    queryKey: queryKeys.Document.list(),
    queryFn: async () => {
      const data = await fetchJson<{ Document: Document[] }>('/api/documents');
      return data.Document;
    },
  });
}

/** Request a new download link for a document. */
export function useRequestCommunicationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const data = await fetchJson<{ message?: string }>(`/api/documents/${id}/request-link`, {
        method: 'POST',
      });
      return data.message ?? 'Link sent.';
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.Document.all });
    },
  });
}
