/**
 * Recipient dashboard.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn, disableColumnInteractions } from '@/components/data-table/column-helpers';
import { DataTable } from '@/components/data-table/data-table';
import { PageContainer } from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  type DocumentRow,
  useDocumentsQuery,
  useRequestDocumentLinkMutation,
} from '@/lib/queries/documents';

/** Authenticated recipient dashboard at `/dashboard`. */
export function DashboardPage() {
  const { data: documents = [], isLoading, error } = useDocumentsQuery();
  const requestLink = useRequestDocumentLinkMutation();

  async function handleRequestLink(id: string) {
    try {
      const message = await requestLink.mutateAsync(id);
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    }
  }

  const columns = useMemo<ColumnDef<DocumentRow>[]>(
    () => [
      dbColumn<DocumentRow>('Document', 'fileName', 'File'),
      dbColumn<DocumentRow>('Document', 'createdAt', 'Received'),
      dbColumn<DocumentRow>('Document', 'status', 'Status', {
        cell: ({ row }) => (
          <DocumentStatusBadges
            linkActive={row.original.linkActive}
            fileAvailable={row.original.fileAvailable}
            isUsed={row.original.isUsed}
          />
        ),
      }),
      disableColumnInteractions<DocumentRow>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            disabled={!row.original.fileAvailable || requestLink.isPending}
            onClick={() => void handleRequestLink(row.original.id)}
          >
            Send access link
          </Button>
        ),
      }),
    ],
    [requestLink.isPending],
  );

  return (
    <PageContainer
      title={PAGE_LABELS.dashboard.nav}
      description={PAGE_LABELS.dashboard.description}
      variant="wide"
    >
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <TableLoadingSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={documents}
          pageSize={25}
          emptyMessage="No documents yet"
        />
      )}
    </PageContainer>
  );
}
