/**
 * Type definitions for {@link DataTable}.
 *
 * @packageDocumentation
 */

import type * as React from 'react';
import type { DataTableSort } from '@/lib/data-table-utils';

export type { DataTableSort };

export type DataTableColumnDataType =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'enum';

export type DataTableFilterOption = { value: string; label: string };

export type DataTableColumnFilter =
  | { type: 'text'; placeholder?: string; inputMode?: 'text' | 'email' | 'numeric' }
  | { type: 'multiselect'; options: readonly DataTableFilterOption[] };

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  accessorFn: (row: T) => unknown;
  cell?: (context: { row: T; value: unknown }) => React.ReactNode;
  dataType?: DataTableColumnDataType;
  enumOptions?: readonly DataTableFilterOption[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  /** Explicit filter config, `false` to disable, or omit to infer from `dataType`. */
  filter?: DataTableColumnFilter | false;
  /** @deprecated Prefer `enableSorting`. */
  sortable?: boolean;
  filterFn?: (cellValue: unknown, filterValue: string) => boolean;
  sortFn?: (rowA: T, rowB: T, sort: DataTableSort) => number;
  className?: string;
  headerClassName?: string;
  /** When true, column appears in the header only (filter/sort), not in body rows. */
  filterOnly?: boolean;
};

export type DataTableProps<T> = {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  columnFilters?: Record<string, string>;
  onColumnFiltersChange?: (filters: Record<string, string>) => void;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  /** Apply these filters locally even when `manualFiltering` is true (e.g. current page facets). */
  clientFilterColumnIds?: readonly string[];
  /** Apply sort locally for these columns when `manualSorting` is true. */
  clientSortColumnIds?: readonly string[];
  emptyMessage?: React.ReactNode;
  className?: string;
  tableClassName?: string;
};
