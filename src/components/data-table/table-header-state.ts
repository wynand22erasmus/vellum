/**
 * Helpers for reading TanStack Table sort/filter state in header UI.
 *
 * @packageDocumentation
 */

import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';

/** Sort direction for a column header, or false when unsorted. */
export type ColumnSortDirection = false | 'asc' | 'desc';

/** Active sort direction for a column id, or false when not sorted. */
export function sortDirectionForColumn(
  columnId: string,
  sorting: SortingState,
): ColumnSortDirection {
  const entry = sorting.find((item) => item.id === columnId);
  if (!entry) {
    return false;
  }
  return entry.desc ? 'desc' : 'asc';
}

/** Filter value for a column id from column filter state. */
export function filterValueForColumn(
  columnId: string,
  columnFilters: ColumnFiltersState,
): unknown {
  return columnFilters.find((item) => item.id === columnId)?.value;
}

/** Whether any sort is active. */
export function hasActiveSorting(sorting: SortingState): boolean {
  return sorting.length > 0;
}

/** Whether a column has an active filter value in state. */
export function hasActiveColumnFilter(
  columnId: string,
  columnFilters: ColumnFiltersState,
): boolean {
  const value = filterValueForColumn(columnId, columnFilters);
  if (value == null) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0 || value.startsWith('\x1e');
  }
  return true;
}
