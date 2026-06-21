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
import { type ProcessError, useAdminListPageQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';

/** Admin process error listing. */
export function AdminProcessErrorsPage() {
  const pagination = useAdminPaginationState();
  const query = useAdminListPageQuery<ProcessError>(
    '/api/admin/process-errors',
    'ProcessError',
    pagination.queryParams,
  );

  const columns = useMemo<ColumnDef<ProcessError>[]>(
    () => [
      dbColumn<ProcessError>('ProcessError', 'createdAt', 'Created'),
      dbColumn<ProcessError>('ProcessError', 'status', 'Status'),
      dbColumn<ProcessError>('ProcessError', 'source', 'Source'),
      dbColumn<ProcessError>('ProcessError', 'detail', 'Detail', {
        cell: ({ getValue }) => String(getValue() ?? '').slice(0, 80),
      }),
      dbColumn<ProcessError>('ProcessError', 'reconciledAt', 'Reconciled', {
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
