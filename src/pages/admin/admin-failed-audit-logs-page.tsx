/**
 * Failed audit logs admin page.
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

/** Admin failed audit log listing. */
export function AdminFailedAuditLogsPage() {
  const pagination = useAdminPaginationState();
  const query = useAdminListPageQuery<Row>(
    '/api/admin/failed-audit-logs',
    'failedAuditLogs',
    pagination.queryParams,
  );

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      dbColumn<Row>('FailedAuditLog', 'createdAt', 'Created'),
      dbColumn<Row>('FailedAuditLog', 'error', 'Error', {
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      dbColumn<Row>('FailedAuditLog', 'retried', 'Retried', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminFailedAuditLogs.nav}
      description={PAGE_LABELS.adminFailedAuditLogs.description}
      query={query}
      columns={columns}
      pageIndex={pagination.pageIndex}
      onPageChange={pagination.setPageIndex}
      pageSize={pagination.pageSize}
    />
  );
}
