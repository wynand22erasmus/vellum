/**
 * Admin users list.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn } from '@/components/data-table/column-helpers';
import { Badge } from '@/components/ui/badge';
import { useAdminListState } from '@/hooks/use-admin-list-state';
import { type User, useAdminUsersQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';

/** Admin users at `/admin/users`. */
export function AdminUsersPage() {
  const listState = useAdminListState();
  const query = useAdminUsersQuery(listState.queryParams);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      dbColumn<User>('User', 'email', 'Email'),
      dbColumn<User>('User', 'kind', 'Role', {
        cell: ({ getValue }) => <Badge variant="secondary">{String(getValue())}</Badge>,
      }),
      dbColumn<User>('User', 'emailVerified', 'Verified', {
        cell: ({ row }) => (row.original.emailVerified ? 'Yes' : 'No'),
      }),
      dbColumn<User>('User', 'firstName', 'First'),
      dbColumn<User>('User', 'lastName', 'Last'),
      dbColumn<User>('User', 'createdAt', 'Created'),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.adminUsers.nav}
      description={PAGE_LABELS.adminUsers.description}
      query={query}
      columns={columns}
      emptyTitle="No users"
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
