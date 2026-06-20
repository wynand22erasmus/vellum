/**
 * Failed webhook deliveries admin page.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn } from '@/components/data-table/column-helpers';
import { useAdminPaginationState } from '@/hooks/use-admin-list-state';
import { useAdminListPageQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';

type Row = {
  id: string;
  error: string;
  createdAt: string;
  retried: boolean;
};

/** Admin failed webhook delivery listing. */
export function AdminFailedWebhookDeliveriesPage() {
  const pagination = useAdminPaginationState();
  const query = useAdminListPageQuery<Row>(
    '/api/admin/failed-webhook-deliveries',
    'failedWebhookDeliveries',
    pagination.queryParams,
  );

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      dbColumn<Row>('FailedWebhookDelivery', 'createdAt', 'Created'),
      dbColumn<Row>('FailedWebhookDelivery', 'error', 'Error', {
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      dbColumn<Row>('FailedWebhookDelivery', 'retried', 'Retried', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminFailedWebhookDeliveries.nav}
      description={PAGE_LABELS.adminFailedWebhookDeliveries.description}
      query={query}
      columns={columns}
      pageIndex={pagination.pageIndex}
      onPageChange={pagination.setPageIndex}
      pageSize={pagination.pageSize}
    />
  );
}
