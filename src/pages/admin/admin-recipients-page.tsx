/**
 * Admin recipients list.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn, disableColumnInteractions } from '@/components/data-table/column-helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminListState } from '@/hooks/use-admin-list-state';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { type Recipient, useAdminRecipientsQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';

/** Admin recipients at `/admin/recipients`. */
export function AdminRecipientsPage() {
  const listState = useAdminListState();
  const query = useAdminRecipientsQuery(listState.queryParams);

  const columns = useMemo<ColumnDef<Recipient>[]>(
    () => [
      dbColumn<Recipient>('Recipient', 'email', 'Email'),
      dbColumn<Recipient>('Recipient', 'sourceSystemKey', 'Source key'),
      dbColumn<Recipient>('Recipient', 'phoneNumber', 'Phone', {
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      dbColumn<Recipient>('Recipient', 'otpChannel', 'OTP channel', {
        cell: ({ getValue }) => {
          const value = getValue() as string | null;
          return value ? <Badge variant="secondary">{value}</Badge> : '—';
        },
      }),
      dbColumn<Recipient>('Recipient', 'documentCount', 'Documents'),
      dbColumn<Recipient>('Recipient', 'createdAt', 'Created'),
      disableColumnInteractions<Recipient>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath(`/admin/recipients/${row.original.recipientId}`)}>Detail</Link>
          </Button>
        ),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminRecipients.nav}
      description={PAGE_LABELS.adminRecipients.description}
      query={query}
      columns={columns}
      emptyTitle="No recipients"
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
