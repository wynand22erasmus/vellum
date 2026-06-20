/**
 * Admin document files list (shared storage assets).
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn, disableColumnInteractions } from '@/components/data-table/column-helpers';
import { useAdminListState } from '@/hooks/use-admin-list-state';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { type AdminDocumentFileRow, useAdminDocumentFilesQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';
import { Button } from '@/components/ui/button';

/** Admin document files at `/admin/document-files`. */
export function AdminDocumentFilesPage() {
  const listState = useAdminListState();
  const query = useAdminDocumentFilesQuery(listState.queryParams);

  const columns = useMemo<ColumnDef<AdminDocumentFileRow>[]>(
    () => [
      dbColumn<AdminDocumentFileRow>('DocumentFile', 'fileName', 'File'),
      dbColumn<AdminDocumentFileRow>('DocumentFile', 'sha256', 'SHA-256', {
        cell: ({ getValue }) => (
          <span className="font-mono text-xs">{String(getValue()).slice(0, 16)}…</span>
        ),
      }),
      dbColumn<AdminDocumentFileRow>('DocumentFile', 'linkCount', 'Links'),
      dbColumn<AdminDocumentFileRow>('DocumentFile', 'storageAttached', 'Storage', {
        cell: ({ getValue }) => (getValue() ? 'Attached' : 'None'),
      }),
      dbColumn<AdminDocumentFileRow>('DocumentFile', 'fileAvailable', 'Available', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
      dbColumn<AdminDocumentFileRow>('DocumentFile', 'byteSize', 'Bytes', {
        cell: ({ getValue }) => {
          const size = getValue() as number | null;
          return size ?? '—';
        },
      }),
      dbColumn<AdminDocumentFileRow>('DocumentFile', 'createdAt', 'Created'),
      disableColumnInteractions<AdminDocumentFileRow>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath(`/admin/document-files/${row.original.id}`)}>Detail</Link>
          </Button>
        ),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminDocumentFiles.nav}
      description={PAGE_LABELS.adminDocumentFiles.description}
      query={query}
      columns={columns}
      emptyTitle="No document files"
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
