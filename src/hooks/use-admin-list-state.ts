/**
 * Column-filter and pagination state for admin list pages.
 *
 * @packageDocumentation
 */

import type { ColumnFiltersState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import {
  ADMIN_DEFAULT_PAGE_SIZE,
  type AdminListParams,
} from '@/lib/queries/query-keys';
import { splitAdminColumnFilters } from '@/lib/admin-column-filter-query';

/** Manage column header filters (server-backed) and pagination. */
export function useAdminListState(pageSize = ADMIN_DEFAULT_PAGE_SIZE) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const { serverParams, clientFilters } = useMemo(
    () => splitAdminColumnFilters(columnFilters),
    [columnFilters],
  );

  const queryParams = useMemo<AdminListParams>(
    () => ({
      limit: pageSize,
      offset: pageIndex * pageSize,
      ...serverParams,
    }),
    [pageIndex, pageSize, serverParams],
  );

  const onColumnFiltersChange = useCallback((filters: ColumnFiltersState) => {
    setPageIndex(0);
    setColumnFilters(filters);
  }, []);

  const onClearColumnFilters = useCallback(() => {
    setColumnFilters([]);
    setPageIndex(0);
  }, []);

  return {
    columnFilters,
    clientColumnFilters: clientFilters,
    onColumnFiltersChange,
    onClearColumnFilters,
    pageIndex,
    setPageIndex,
    pageSize,
    queryParams,
  };
}

/** Server pagination without column filters. */
export function useAdminPaginationState(pageSize = ADMIN_DEFAULT_PAGE_SIZE) {
  const [pageIndex, setPageIndex] = useState(0);

  const queryParams = useMemo<AdminListParams>(
    () => ({
      limit: pageSize,
      offset: pageIndex * pageSize,
    }),
    [pageIndex, pageSize],
  );

  return { pageIndex, setPageIndex, pageSize, queryParams };
}
