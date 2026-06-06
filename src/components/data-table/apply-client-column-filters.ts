/**
 * Applies client-only column filters to in-memory table rows.
 *
 * @packageDocumentation
 */

import type { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import {
  defaultDateOnlyColumnFilter,
  defaultDateTimeColumnFilter,
  defaultMultiSelectColumnFilter,
  defaultNumberColumnFilter,
  defaultTextColumnFilter,
} from '@/lib/data-table-utils';
import { mergeColumnMetaWithDb } from '@/lib/data-table-db-column-registry';
import { resolveColumnFilter } from '@/components/data-table/column-filter-config';
import { filterFnIdForDataType } from '@/components/data-table/tanstack-filter-fns';

function rowFilterFn<TData>(
  column: ColumnDef<TData, unknown>,
  columnId: string,
): (cellValue: unknown, filterValue: string) => boolean {
  const meta = mergeColumnMetaWithDb(columnId, column.meta as never);
  const filter = resolveColumnFilter({ ...column, meta }, columnId);
  const fnId = filterFnIdForDataType(meta.dataType, meta.filter);

  if (filter?.type === 'datetime' && filter.granularity === 'date') {
    return defaultDateOnlyColumnFilter;
  }

  switch (fnId) {
    case 'multiSelect':
      return defaultMultiSelectColumnFilter;
    case 'date':
      return defaultDateOnlyColumnFilter;
    case 'dateTime':
      return defaultDateTimeColumnFilter;
    case 'number':
      return defaultNumberColumnFilter;
    case 'text':
    default:
      return defaultTextColumnFilter;
  }
}

type ColumnWithAccessor<TData> = ColumnDef<TData, unknown> & {
  accessorFn?: (row: TData, index: number) => unknown;
  accessorKey?: string;
};

function columnIdFor<TData>(column: ColumnDef<TData, unknown>): string {
  const withAccessor = column as ColumnWithAccessor<TData>;
  return column.id ?? String(withAccessor.accessorKey ?? '');
}

function cellValueForColumn<TData>(row: TData, column: ColumnDef<TData, unknown>): unknown {
  const withAccessor = column as ColumnWithAccessor<TData>;
  if (withAccessor.accessorFn) {
    return withAccessor.accessorFn(row, 0);
  }
  if (withAccessor.accessorKey) {
    return row[withAccessor.accessorKey as keyof TData];
  }
  return undefined;
}

/** Filters rows using active client-only column filters and column filter fns. */
export function applyClientColumnFilters<TData>(
  rows: readonly TData[],
  columns: readonly ColumnDef<TData, unknown>[],
  filters: ColumnFiltersState,
): TData[] {
  const activeFilters = filters.filter(({ value }) => value != null && String(value).trim().length > 0);
  if (activeFilters.length === 0) {
    return [...rows];
  }

  const columnById = new Map(columns.map((column) => [columnIdFor(column), column]));

  return rows.filter((row) =>
    activeFilters.every(({ id, value }) => {
      const column = columnById.get(id);
      if (!column) {
        return true;
      }
      const filterFn = rowFilterFn(column, id);
      const cellValue = cellValueForColumn(row, column);
      return filterFn(cellValue, String(value ?? ''));
    }),
  );
}
