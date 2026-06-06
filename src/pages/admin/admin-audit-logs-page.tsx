/**
 * Admin audit logs.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn } from '@/components/data-table/column-helpers';
import { useAdminListState } from '@/hooks/use-admin-list-state';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { useAdminListPageQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';

type AuditRow = {
  id: string;
  eventType: string;
  timestamp: string;
  userId: string | null;
  documentId: string | null;
  ipAddress: string | null;
};

/** Admin audit log listing with filters and pagination. */
export function AdminAuditLogsPage() {
  const listState = useAdminListState();
  const query = useAdminListPageQuery<AuditRow>(
    '/api/admin/audit-logs',
    'auditLogs',
    listState.queryParams,
  );

  const columns = useMemo<ColumnDef<AuditRow>[]>(
    () => [
      dbColumn<AuditRow>('AuditLog', 'timestamp', 'Time'),
      dbColumn<AuditRow>('AuditLog', 'eventType', 'Event'),
      dbColumn<AuditRow>('AuditLog', 'documentId', 'Document', {
        cell: ({ getValue }) => {
          const id = getValue() as string | null;
          if (!id) return '—';
          return (
            <Link to={normalizeAppPath(`/admin/documents/${id}`)} className="font-mono text-xs underline">
              {id.slice(0, 8)}…
            </Link>
          );
        },
      }),
      dbColumn<AuditRow>('AuditLog', 'ipAddress', 'IP', {
        cell: ({ getValue }) => getValue() ?? '—',
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminAuditLogs.nav}
      description={PAGE_LABELS.adminAuditLogs.description}
      query={query}
      columns={columns}
      emptyTitle="No audit logs"
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
