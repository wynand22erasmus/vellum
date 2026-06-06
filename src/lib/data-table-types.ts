/**
 * Type definitions for `DataTable`.
 *
 * @packageDocumentation
 */

import type * as React from 'react';
import type { DataTableSort } from '@/lib/data-table-utils';

/** Active sort column and direction for `DataTable`. */
export type { DataTableSort };

/** Inferred or explicit column value type for filter UI defaults. */
export type DataTableColumnDataType =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'enum';

/** Label/value pair for enum and boolean multiselect filters. */
export type DataTableFilterOption = { value: string; label: string };

/** Per-column filter control configuration (text input, datetime picker, or multiselect). */
export type DataTableColumnFilter =
  | { type: 'text'; placeholder?: string; inputMode?: 'text' | 'email' | 'numeric' }
  | { type: 'datetime'; granularity: 'date' | 'datetime' }
  | { type: 'multiselect'; options: readonly DataTableFilterOption[] };

/** Column metadata for `DataTable` headers, sorting, and filtering. */
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

/** Props for `DataTable`. */
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
