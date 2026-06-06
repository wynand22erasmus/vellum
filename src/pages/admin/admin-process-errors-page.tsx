/**
 * Process errors admin page.
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
  status: number;
  source: string;
  detail: string | null;
  createdAt: string;
  reconciledAt: string | null;
};

/** Admin process error listing. */
export function AdminProcessErrorsPage() {
  const pagination = useAdminPaginationState();
  const query = useAdminListPageQuery<Row>(
    '/api/admin/process-errors',
    'processErrors',
    pagination.queryParams,
  );

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      dbColumn<Row>('ProcessError', 'createdAt', 'Created'),
      dbColumn<Row>('ProcessError', 'status', 'Status'),
      dbColumn<Row>('ProcessError', 'source', 'Source'),
      dbColumn<Row>('ProcessError', 'detail', 'Detail', {
        cell: ({ getValue }) => String(getValue() ?? '').slice(0, 80),
      }),
      dbColumn<Row>('ProcessError', 'reconciledAt', 'Reconciled', {
        cell: ({ row }) => (row.original.reconciledAt ? 'Yes' : 'No'),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminProcessErrors.nav}
      description={PAGE_LABELS.adminProcessErrors.description}
      query={query}
      columns={columns}
      pageIndex={pagination.pageIndex}
      onPageChange={pagination.setPageIndex}
      pageSize={pagination.pageSize}
    />
  );
}
