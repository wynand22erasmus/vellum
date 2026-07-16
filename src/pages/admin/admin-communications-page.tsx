/**
 * Admin document links list.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn, disableColumnInteractions } from '@/components/data-table/column-helpers';
import { Badge } from '@/components/ui/badge';
import { useAdminListState } from '@/hooks/use-admin-list-state';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { type Communication, useAdminCommunicationsQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';
import { Button } from '@/components/ui/button';

/** Admin document links at `/admin/communications`. */
export function AdminCommunicationsPage() {
  const listState = useAdminListState();
  const query = useAdminCommunicationsQuery(listState.queryParams);

  const columns = useMemo<ColumnDef<Communication>[]>(
    () => [
      dbColumn<Communication>('File', 'fileName', 'File'),
      dbColumn<Communication>('Recipient', 'email', 'Recipient', {
        accessorKey: 'recipientEmail',
      }),
      dbColumn<Communication>('Communication', 'linkExpiresAt', 'Expires'),
      dbColumn<Communication>('Communication', 'linkActive', 'Active', {
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'default' : 'secondary'}>
            {getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      }),
      dbColumn<Communication>('Communication', 'createdAt', 'Created'),
      disableColumnInteractions<Communication>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath(`/admin/communications/${row.original.communicationId}`)}>Detail</Link>
          </Button>
        ),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminCommunications.nav}
      description={PAGE_LABELS.adminCommunications.description}
      query={query}
      columns={columns}
      emptyTitle="No document links"
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
