/**
 * Client-side sort and filter helpers for {@link DataTable}.
 *
 * @packageDocumentation
 */

import { parseMultiSelectFilterValue } from './data-table-filter-value.ts';

/** Active sort column and direction for {@link DataTable}. */
export type DataTableSort = {
  id: string;
  desc: boolean;
};

/** Normalized cell values used by default sort comparators. */
export type CompareValues = string | number | boolean | Date | null | undefined;

/**
 * Coerces a cell value into something comparable for default sorting.
 */
export function normalizeSortValue(value: unknown): CompareValues {
  if (value == null) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const asDate = Date.parse(value);
    if (!Number.isNaN(asDate) && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Date(asDate);
    }
    return value.toLocaleLowerCase();
  }
  return String(value).toLocaleLowerCase();
}

/**
 * Default ascending comparator for two comparable cell values.
 */
export function compareSortValues(a: CompareValues, b: CompareValues): number {
  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return 1;
  }
  if (b == null) {
    return -1;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Returns the next sort state when a sortable column header is activated.
 */
export function cycleSortState(
  current: DataTableSort | null,
  columnId: string,
): DataTableSort | null {
  if (current?.id !== columnId) {
    return { id: columnId, desc: false };
  }
  if (!current.desc) {
    return { id: columnId, desc: true };
  }
  return null;
}

/**
 * Case-insensitive substring match for text column filters.
 */
export function defaultTextColumnFilter(cellValue: unknown, filterValue: string): boolean {
  const query = filterValue.trim().toLocaleLowerCase();
  if (!query) {
    return true;
  }
  return String(cellValue ?? '')
    .toLocaleLowerCase()
    .includes(query);
}

/**
 * Multiselect filter: row matches when any selected value matches the cell (or cell tag list).
 */
export function defaultMultiSelectColumnFilter(cellValue: unknown, filterValue: string): boolean {
  const selected = parseMultiSelectFilterValue(filterValue);
  if (selected.length === 0) {
    return true;
  }
  if (Array.isArray(cellValue)) {
    const tags = cellValue.map((entry) => String(entry));
    return selected.some((value) => tags.includes(value));
  }
  const normalized = String(cellValue ?? '');
  return selected.includes(normalized);
}

/**
 * Number filter: equality when filter parses as a number, otherwise substring match.
 */
export function defaultNumberColumnFilter(cellValue: unknown, filterValue: string): boolean {
  const query = filterValue.trim();
  if (!query) {
    return true;
  }
  const asNumber = Number(query);
  if (!Number.isNaN(asNumber) && typeof cellValue === 'number') {
    return cellValue === asNumber;
  }
  return String(cellValue ?? '').includes(query);
}

/**
 * Date / datetime filter via ISO prefix match on the serialized cell value.
 */
export function defaultDateColumnFilter(cellValue: unknown, filterValue: string): boolean {
  const query = filterValue.trim().toLocaleLowerCase();
  if (!query) {
    return true;
  }
  return String(cellValue ?? '')
    .toLocaleLowerCase()
    .includes(query);
}

/** Reads a cell value from a row for sorting or filtering. */
export type DataTableRowAccessor<T> = (row: T) => unknown;

/** Per-column filter wiring passed to {@link filterDataTableRows}. */
export type DataTableColumnFilterConfig<T> = {
  id: string;
  getFilterValue: (row: T) => unknown;
  filterFn?: (cellValue: unknown, filterValue: string) => boolean;
};

/**
 * Filters rows using per-column filter functions and current filter values.
 */
export function filterDataTableRows<T>(
  rows: readonly T[],
  columns: readonly DataTableColumnFilterConfig<T>[],
  columnFilters: Record<string, string>,
): T[] {
  const activeColumns = columns.filter((column) => {
    const value = columnFilters[column.id] ?? '';
    return Boolean(value.trim()) || value.startsWith('\x1e');
  });

  if (activeColumns.length === 0) {
    return [...rows];
  }

  return rows.filter((row) =>
    activeColumns.every((column) => {
      const filterValue = columnFilters[column.id] ?? '';
      const filterFn = column.filterFn ?? defaultTextColumnFilter;
      return filterFn(column.getFilterValue(row), filterValue);
    }),
  );
}

/**
 * Sorts rows by the active column using the provided accessor and optional custom comparator.
 */
export function sortDataTableRows<T>(
  rows: readonly T[],
  sort: DataTableSort | null,
  getValue: (row: T, columnId: string) => unknown,
  compare?: (a: T, b: T, sort: DataTableSort) => number,
): T[] {
  if (!sort) {
    return [...rows];
  }

  const sorted = [...rows];
  sorted.sort((rowA, rowB) => {
    const result =
      compare?.(rowA, rowB, sort) ??
      compareSortValues(
        normalizeSortValue(getValue(rowA, sort.id)),
        normalizeSortValue(getValue(rowB, sort.id)),
      );
    return sort.desc ? -result : result;
  });
  return sorted;
}
