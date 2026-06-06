/**
 * Generic TanStack Table wrapper for Admin lists.
 *
 * @packageDocumentation
 */

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Header,
  type OnChangeFn,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { elevatedSurfaceClassName, surfaceBandClassName, SurfaceAccentLine } from '@/components/layout/app-surface';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import {
  filterValueForColumn,
  sortDirectionForColumn,
} from '@/components/data-table/table-header-state';
import { filterFns } from '@/components/data-table/tanstack-filter-fns';
import '@/components/data-table/column-meta';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageSize?: number;
  manualPagination?: boolean;
  manualFiltering?: boolean;
  pageIndex?: number;
  pageCount?: number;
  totalCount?: number;
  onPageChange?: (pageIndex: number) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  emptyMessage?: string;
  /** Hide toolbar (column visibility + filter chips). */
  showToolbar?: boolean;
};

function DataTableHeaderCell<TData>({
  header,
  sorting,
  columnFilters,
}: {
  header: Header<TData, unknown>;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
}) {
  if (header.isPlaceholder) return null;

  const columnId = header.column.id;
  const headerDef = header.column.columnDef.header;
  if (typeof headerDef === 'string') {
    if (headerDef === '') return null;
    return (
      <DataTableColumnHeader
        column={header.column}
        title={headerDef}
        sortDirection={sortDirectionForColumn(columnId, sorting)}
        filterValue={filterValueForColumn(columnId, columnFilters)}
      />
    );
  }

  return flexRender(headerDef, header.getContext());
}

/** Sortable, filterable data table for (client or server pagination). */
export function DataTable<TData>({
  columns,
  data,
  pageSize = 50,
  manualPagination = false,
  manualFiltering = false,
  pageIndex = 0,
  pageCount,
  totalCount,
  onPageChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  emptyMessage = 'No results.',
  showToolbar = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columnFilters = controlledColumnFilters ?? internalColumnFilters;

  const setColumnFilters: OnChangeFn<ColumnFiltersState> = (updaterOrValue) => {
    if (onColumnFiltersChange) {
      const next =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(columnFilters)
          : updaterOrValue;
      onColumnFiltersChange(next);
      return;
    }
    setInternalColumnFilters(updaterOrValue);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      ...(manualPagination ? { pagination: { pageIndex, pageSize } } : {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination,
    manualFiltering,
    pageCount: manualPagination ? pageCount : undefined,
    defaultColumn: {
      enableSorting: true,
      enableColumnFilter: true,
      meta: { dataType: 'text' },
      filterFn: 'text',
    },
    filterFns: filterFns,
    enableMultiSort: false,
    enableSortingRemoval: true,
    isMultiSortEvent: () => false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(manualFiltering ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    ...(manualPagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    initialState: manualPagination ? undefined : { pagination: { pageSize } },
  });

  const resolvedPageCount = manualPagination
    ? (pageCount ?? 1)
    : table.getPageCount() || 1;
  const resolvedPageIndex = manualPagination ? pageIndex : table.getState().pagination.pageIndex;
  const canPrevious = manualPagination ? pageIndex > 0 : table.getCanPreviousPage();
  const canNext = manualPagination
    ? pageCount !== undefined && pageIndex + 1 < pageCount
    : table.getCanNextPage();
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const visibleRowCount = manualFiltering ? data.length : table.getFilteredRowModel().rows.length;
  const hasActiveFilters = columnFilters.some(
    (filter) => filter.value != null && String(filter.value).trim().length > 0,
  );

  function goPrevious() {
    if (manualPagination) {
      onPageChange?.(Math.max(0, pageIndex - 1));
      return;
    }
    table.previousPage();
  }

  function goNext() {
    if (manualPagination) {
      onPageChange?.(pageIndex + 1);
      return;
    }
    table.nextPage();
  }

  function clearAllFilters() {
    setColumnFilters([]);
  }

  return (
    <div className="space-y-4">
      {showToolbar ? (
        <DataTableToolbar table={table} onClearAllFilters={clearAllFilters} />
      ) : null}
      <div className={cn('overflow-hidden rounded-2xl', elevatedSurfaceClassName)}>
        <SurfaceAccentLine />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn('border-b border-border/50 hover:bg-transparent', surfaceBandClassName)}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 align-middle">
                    <DataTableHeaderCell
                      header={header}
                      sorting={sorting}
                      columnFilters={columnFilters}
                    />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRowCount ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="font-data text-sm align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={visibleColumnCount || columns.length}
                  className="h-28 text-center"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {hasActiveFilters ? 'No rows match your filters' : emptyMessage}
                    </p>
                    {hasActiveFilters ? (
                      <Button type="button" variant="link" size="sm" onClick={clearAllFilters}>
                        Clear filters
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {totalCount !== undefined ? (
            <>
              {visibleRowCount} shown · {totalCount} total · page {resolvedPageIndex + 1} of{' '}
              {resolvedPageCount}
            </>
          ) : (
            <>
              {visibleRowCount} row{visibleRowCount === 1 ? '' : 's'} · page {resolvedPageIndex + 1}{' '}
              of {resolvedPageCount}
            </>
          )}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goPrevious} disabled={!canPrevious}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goNext} disabled={!canNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
