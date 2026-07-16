/**
 * Admin files list (shared storage assets).
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
import { type File, useAdminFilesQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';
import { Button } from '@/components/ui/button';

/** Admin files at `/admin/files`. */
export function AdminFilesPage() {
  const listState = useAdminListState();
  const query = useAdminFilesQuery(listState.queryParams);

  const columns = useMemo<ColumnDef<File>[]>(
    () => [
      dbColumn<File>('File', 'fileName', 'File'),
      dbColumn<File>('File', 'sha256', 'SHA-256', {
        cell: ({ getValue }) => (
          <span className="font-mono text-xs">{String(getValue()).slice(0, 16)}…</span>
        ),
      }),
      dbColumn<File>('File', 'documentCount', 'Documents'),
      dbColumn<File>('File', 'storageAttached', 'Storage', {
        cell: ({ getValue }) => (getValue() ? 'Attached' : 'None'),
      }),
      dbColumn<File>('File', 'fileAvailable', 'Available', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
      dbColumn<File>('File', 'byteSize', 'Bytes', {
        cell: ({ getValue }) => {
          const size = getValue() as number | null;
          return size ?? '—';
        },
      }),
      dbColumn<File>('File', 'createdAt', 'Created'),
      disableColumnInteractions<File>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath(`/admin/files/${row.original.fileId}`)}>Detail</Link>
          </Button>
        ),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminFiles.nav}
      description={PAGE_LABELS.adminFiles.description}
      query={query}
      columns={columns}
      emptyTitle="No files"
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
