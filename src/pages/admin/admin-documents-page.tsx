/**
 * Admin documents list (delivery envelopes).
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn, disableColumnInteractions } from '@/components/data-table/column-helpers';
import { useAdminListState } from '@/hooks/use-admin-list-state';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { type Document, useAdminDocumentsQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';
import { Button } from '@/components/ui/button';

/** Admin document envelopes at `/admin/documents`. */
export function AdminDocumentsPage() {
  const listState = useAdminListState();
  const query = useAdminDocumentsQuery(listState.queryParams);

  const columns = useMemo<ColumnDef<Document>[]>(
    () => [
      dbColumn<Document>('File', 'fileName', 'File'),
      dbColumn<Document>('Recipient', 'email', 'Recipient', {
        accessorKey: 'recipientEmail',
      }),
      dbColumn<Document>('Document', 'createdAt', 'Created'),
      dbColumn<Document>('Document', 'status', 'Status', {
        cell: ({ row }) => (
          <DocumentStatusBadges
            linkActive={row.original.linkActive}
            fileAvailable={row.original.fileAvailable}
            downloadCount={row.original.downloadCount}
            maxDownloads={row.original.maxDownloads}
            downloadsRemaining={row.original.downloadsRemaining}
            deletedAt={row.original.deletedAt}
          />
        ),
      }),
      disableColumnInteractions<Document>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath(`/admin/documents/${row.original.documentId}`)}>Detail</Link>
          </Button>
        ),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminDocuments.nav}
      description={PAGE_LABELS.adminDocuments.description}
      query={query}
      columns={columns}
      emptyTitle="No documents"
      serverFiltering
      columnFilters={listState.columnFilters}
      clientColumnFilters={listState.clientColumnFilters}
      onColumnFiltersChange={listState.onColumnFiltersChange}
      pageIndex={listState.pageIndex}
      onPageChange={listState.setPageIndex}
      pageSize={listState.pageSize}
    />
  );
}
