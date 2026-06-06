/**
 * Column filter inference from `DataTable` column data types.
 *
 * @packageDocumentation
 */


import {
  defaultDateOnlyColumnFilter,
  defaultDateTimeColumnFilter,
  defaultMultiSelectColumnFilter,
  defaultNumberColumnFilter,
  defaultTextColumnFilter,
} from '@/lib/data-table-utils';
import type {
  DataTableColumn,
  DataTableColumnFilter,
  DataTableFilterOption,
} from '@/lib/data-table-types';

/** Re-export of {@link DataTableFilterOption} from column types. */
export type { DataTableFilterOption };

/** Yes / no options for boolean column filters. */
export const DATA_TABLE_BOOLEAN_FILTER_OPTIONS: readonly DataTableFilterOption[] = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;

/** Filter UI config after resolving column `dataType` and overrides. */
export type ResolvedDataTableColumnFilter = DataTableColumnFilter;

/** Returns whether the column header should expose a sort control. */
export function isDataTableColumnSortable<T>(
  column: DataTableColumn<T>,
): boolean {
  if (column.id === 'actions' || column.enableSorting === false || column.sortable === false) {
    return false;
  }
  if (column.enableSorting === true || column.sortable === true) {
    return true;
  }
  return column.dataType !== undefined || column.filter !== false;
}

/** Returns whether the column header should expose a filter control. */
export function isDataTableColumnFilterable<T>(
  column: DataTableColumn<T>,
): boolean {
  if (column.filter === false || column.enableFiltering === false) {
    return false;
  }
  if (column.filter != null || column.enableFiltering === true) {
    return true;
  }
  return column.dataType !== undefined;
}

/**
 * Resolves the filter UI and default filter function for a column definition.
 */
export function resolveDataTableColumnFilter<T>(
  column: DataTableColumn<T>,
): ResolvedDataTableColumnFilter | null {
  if (!isDataTableColumnFilterable(column)) {
    return null;
  }

  if (column.filter) {
    return column.filter;
  }

  switch (column.dataType) {
    case 'email':
      return { type: 'text', placeholder: 'email@example.com', inputMode: 'email' };
    case 'number':
      return { type: 'text', placeholder: '0', inputMode: 'numeric' };
    case 'date':
      return { type: 'datetime', granularity: 'date' };
    case 'datetime':
      return { type: 'datetime', granularity: 'datetime' };
    case 'boolean':
      return { type: 'multiselect', options: DATA_TABLE_BOOLEAN_FILTER_OPTIONS };
    case 'enum':
      return {
        type: 'multiselect',
        options: (column.enumOptions ?? []).filter((option) => option.value !== ''),
      };
    case 'text':
    default:
      return { type: 'text', placeholder: 'Filter…', inputMode: 'text' };
  }
}

/**
 * Default row filter for a column based on its resolved filter / data type.
 */
export function getDefaultFilterFnForColumn<T>(column: DataTableColumn<T>) {
  const filter = resolveDataTableColumnFilter(column);
  if (filter?.type === 'multiselect') {
    return defaultMultiSelectColumnFilter;
  }
  if (column.dataType === 'date') {
    return defaultDateOnlyColumnFilter;
  }
  if (column.dataType === 'datetime') {
    return defaultDateTimeColumnFilter;
  }
  if (column.dataType === 'number') {
    return defaultNumberColumnFilter;
  }
  return defaultTextColumnFilter;
}
