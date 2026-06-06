/**
 * Resolves column filter UI and display from {@link DataTableColumnMeta}.
 *
 * @packageDocumentation
 */

import type { Column, ColumnDef } from '@tanstack/react-table';
import {
  DATA_TABLE_BOOLEAN_FILTER_OPTIONS,
  resolveDataTableColumnFilter,
} from '@/lib/data-table-column-config';
import { formatDateFilterDisplayValue } from '@/lib/data-table-datetime-filter-value';
import { mergeColumnMetaWithDb } from '@/lib/data-table-db-column-registry';
import type { DataTableColumn, DataTableColumnFilter } from '@/lib/data-table-types';
import {
  isDataTableFilterActive,
  parseMultiSelectFilterValue,
} from '@/lib/data-table-filter-value';
import type { DataTableColumnMeta } from '@/components/data-table/column-meta';

function metaAsColumn<TData>(meta: DataTableColumnMeta | undefined, id: string, header: string): DataTableColumn<TData> {
  return {
    id,
    header,
    accessorFn: () => null,
    dataType: meta?.dataType,
    filter: meta?.filter,
    enumOptions: meta?.enumOptions,
    enableFiltering: meta?.filter === false ? false : undefined,
  };
}

/** Resolve filter control config from a TanStack column definition. */
export function resolveColumnFilter<TData>(
  columnDef: ColumnDef<TData, unknown>,
  columnId: string,
): DataTableColumnFilter | null {
  const rawMeta = columnDef.meta as DataTableColumnMeta | undefined;
  const meta = mergeColumnMetaWithDb(columnId, rawMeta, rawMeta?.rowKind);
  if (meta.filter === false) {
    return null;
  }
  const header = typeof columnDef.header === 'string' ? columnDef.header : columnId;
  const pseudo = metaAsColumn<TData>(meta, columnId, header);
  if (meta.filter) {
    return meta.filter;
  }
  return resolveDataTableColumnFilter(pseudo);
}

/** Whether the serialized filter value is active for this column. */
export function isColumnFilterActive<TData>(
  column: Column<TData, unknown>,
  raw: unknown,
): boolean {
  const rawMeta = column.columnDef.meta as DataTableColumnMeta | undefined;
  const meta = mergeColumnMetaWithDb(column.id, rawMeta, rawMeta?.rowKind);
  const filter = resolveColumnFilter(
    { ...column.columnDef, meta },
    column.id,
  );
  if (!filter) return false;
  const rawStr = String(raw ?? '');
  if (rawStr.length === 0) {
    return false;
  }
  if (filter.type === 'multiselect') {
    return isDataTableFilterActive(rawStr, 'multiselect');
  }
  return isDataTableFilterActive(rawStr, 'text');
}

/** Human-readable filter value for toolbar chips. */
export function formatFilterDisplayValue<TData>(
  column: Column<TData, unknown>,
  raw: unknown,
): string {
  const rawMeta = column.columnDef.meta as DataTableColumnMeta | undefined;
  const meta = mergeColumnMetaWithDb(column.id, rawMeta, rawMeta?.rowKind);
  const filter = resolveColumnFilter(
    { ...column.columnDef, meta },
    column.id,
  );
  const rawStr = String(raw ?? '');
  if (!filter) {
    return rawStr;
  }
  if (filter.type === 'datetime') {
    return formatDateFilterDisplayValue(rawStr, filter.granularity);
  }
  if (filter.type === 'text') {
    return rawStr;
  }
  const selected = parseMultiSelectFilterValue(rawStr);
  return selected
    .map((value) => filter.options.find((option) => option.value === value)?.label ?? value)
    .join(', ');
}

export { DATA_TABLE_BOOLEAN_FILTER_OPTIONS };
