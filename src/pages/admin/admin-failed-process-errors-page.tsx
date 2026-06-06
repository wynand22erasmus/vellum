/**
 * Failed process errors admin page.
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
  createdAt: string;
  error: string | null;
  retried: boolean;
};

/** Admin failed process error listing. */
export function AdminFailedProcessErrorsPage() {
  const pagination = useAdminPaginationState();
  const query = useAdminListPageQuery<Row>(
    '/api/admin/failed-process-errors',
    'failedProcessErrors',
    pagination.queryParams,
  );

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      dbColumn<Row>('FailedProcessError', 'createdAt', 'Created'),
      dbColumn<Row>('FailedProcessError', 'error', 'Error', {
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      dbColumn<Row>('FailedProcessError', 'retried', 'Retried', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminFailedProcessErrors.nav}
      description={PAGE_LABELS.adminFailedProcessErrors.description}
      query={query}
      columns={columns}
      pageIndex={pagination.pageIndex}
      onPageChange={pagination.setPageIndex}
      pageSize={pagination.pageSize}
    />
  );
}
