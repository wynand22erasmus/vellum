/**
 * Column filter inference from {@link DataTable} column data types.
 *
 * @packageDocumentation
 */

import { ADMIN_ISO_DATE_PLACEHOLDER } from '@/lib/admin-filter-options';
import {
  defaultDateColumnFilter,
  defaultMultiSelectColumnFilter,
  defaultNumberColumnFilter,
  defaultTextColumnFilter,
} from '@/lib/data-table-utils';
import type {
  DataTableColumn,
  DataTableColumnFilter,
  DataTableFilterOption,
} from '@/lib/data-table-types';

export type { DataTableFilterOption };

/** Yes / no options for boolean column filters. */
export const DATA_TABLE_BOOLEAN_FILTER_OPTIONS: readonly DataTableFilterOption[] = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;

export type ResolvedDataTableColumnFilter = DataTableColumnFilter;

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
    case 'datetime':
      return {
        type: 'text',
        placeholder: ADMIN_ISO_DATE_PLACEHOLDER,
        inputMode: 'text',
      };
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
  if (column.dataType === 'date' || column.dataType === 'datetime') {
    return defaultDateColumnFilter;
  }
  if (column.dataType === 'number') {
    return defaultNumberColumnFilter;
  }
  return defaultTextColumnFilter;
}
