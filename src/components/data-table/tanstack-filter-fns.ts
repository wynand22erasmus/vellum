/**
 * TanStack Table filter functions for typed columns.
 *
 * @packageDocumentation
 */

import type { FilterFn } from '@tanstack/react-table';
import {
  defaultDateOnlyColumnFilter,
  defaultDateTimeColumnFilter,
  defaultMultiSelectColumnFilter,
  defaultNumberColumnFilter,
  defaultTextColumnFilter,
} from '@/lib/data-table-utils';
import type { DataTableColumnMeta } from '@/components/data-table/column-meta';

function cellFilter(
  filterFn: (cellValue: unknown, filterValue: string) => boolean,
): FilterFn<unknown> {
  return (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return filterFn(value, String(filterValue ?? ''));
  };
}

/** Text column filter for data tables. */
export const textFilter = cellFilter(defaultTextColumnFilter);
/** Multi-select enum filter for data tables. */
export const multiSelectFilter = cellFilter(defaultMultiSelectColumnFilter);
/** Date-only filter for data tables. */
export const dateFilter = cellFilter(defaultDateOnlyColumnFilter);
/** Date-time filter for data tables. */
export const dateTimeFilter = cellFilter(defaultDateTimeColumnFilter);
/** Numeric filter for data tables. */
export const numberFilter = cellFilter(defaultNumberColumnFilter);

/** Registered TanStack filter function map for columns. */
export const filterFns = {
  text: textFilter,
  multiSelect: multiSelectFilter,
  date: dateFilter,
  dateTime: dateTimeFilter,
  number: numberFilter,
};

declare module '@tanstack/react-table' {
  interface FilterFns {
    text: FilterFn<unknown>;
    multiSelect: FilterFn<unknown>;
    date: FilterFn<unknown>;
    dateTime: FilterFn<unknown>;
    number: FilterFn<unknown>;
  }
}

/** Maps column data type to a registered TanStack filter fn id. */
export function filterFnIdForDataType(
  dataType: DataTableColumnMeta['dataType'],
  filter?: DataTableColumnMeta['filter'],
): keyof typeof filterFns {
  if (filter !== false && filter?.type === 'multiselect') {
    return 'multiSelect';
  }
  switch (dataType) {
    case 'boolean':
    case 'enum':
      return 'multiSelect';
    case 'date':
      return 'date';
    case 'datetime':
      return 'dateTime';
    case 'number':
      return 'number';
    case 'email':
    case 'text':
    default:
      return 'text';
  }
}
