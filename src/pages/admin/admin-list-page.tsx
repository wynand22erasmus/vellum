/**
 * Shared admin list page for audit/process error tables.
 *
 * @packageDocumentation
 */

import type { UseQueryResult } from '@tanstack/react-query';
import type { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { applyClientColumnFilters } from '@/components/data-table/apply-client-column-filters';
import { DataTable } from '@/components/data-table/data-table';
import { PageContainer } from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { AdminListResult } from '@/lib/queries/fetch-json';

type AdminListPageProps<T> = {
  title: string;
  description: string;
  query: UseQueryResult<AdminListResult<T>, Error>;
  columns: ColumnDef<T>[];
  emptyTitle?: string;
  pageIndex?: number;
  onPageChange?: (pageIndex: number) => void;
  pageSize?: number;
  columnFilters?: ColumnFiltersState;
  clientColumnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  serverFiltering?: boolean;
};

/** Generic admin list page with column-header filters and optional server pagination. */
export function AdminListPage<T extends object>({
  title,
  description,
  query,
  columns,
  emptyTitle = 'No records',
  pageIndex = 0,
  onPageChange,
  pageSize = 50,
  columnFilters,
  clientColumnFilters = [],
  onColumnFiltersChange,
  serverFiltering = false,
}: AdminListPageProps<T>) {
  const { data, isLoading, error } = query;
  const rawRows = data?.items ?? [];
  const rows = serverFiltering
    ? applyClientColumnFilters(rawRows, columns, clientColumnFilters)
    : rawRows;
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <PageContainer title={title} description={description} variant="wide">
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}
      {isLoading ? (
        <TableLoadingSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          pageSize={pageSize}
          manualPagination
          manualFiltering={serverFiltering}
          pageIndex={pageIndex}
          pageCount={pageCount}
          totalCount={total}
          onPageChange={onPageChange}
          columnFilters={columnFilters}
          onColumnFiltersChange={onColumnFiltersChange}
          emptyMessage={emptyTitle}
        />
      )}
    </PageContainer>
  );
}
