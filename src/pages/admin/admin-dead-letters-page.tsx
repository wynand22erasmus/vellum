/**
 * Dead letters admin page.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn } from '@/components/data-table/column-helpers';
import { useAdminPaginationState } from '@/hooks/use-admin-list-state';
import { type DeadLetter, useAdminListPageQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';

/** Admin dead-letter listing across audit, process-error, and webhook pipelines. */
export function AdminDeadLettersPage() {
  const pagination = useAdminPaginationState();
  const query = useAdminListPageQuery<DeadLetter>(
    '/api/admin/dead-letters',
    'DeadLetter',
    pagination.queryParams,
  );

  const columns = useMemo<ColumnDef<DeadLetter>[]>(
    () => [
      dbColumn<DeadLetter>('DeadLetter', 'createdAt', 'Created'),
      dbColumn<DeadLetter>('DeadLetter', 'pipeline', 'Pipeline'),
      dbColumn<DeadLetter>('DeadLetter', 'error', 'Error', {
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      dbColumn<DeadLetter>('DeadLetter', 'retried', 'Retried', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
      dbColumn<DeadLetter>('DeadLetter', 'linkedId', 'Linked id', {
        cell: ({ row }) => row.original.linkedId ?? '—',
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminDeadLetters.nav}
      description={PAGE_LABELS.adminDeadLetters.description}
      query={query}
      columns={columns}
      pageIndex={pagination.pageIndex}
      onPageChange={pagination.setPageIndex}
      pageSize={pagination.pageSize}
    />
  );
}
