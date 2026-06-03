/**
 * Data table with per-column sort and hover-popup filters in headers.
 *
 * @packageDocumentation
 */

import * as React from 'react';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  FilterIcon,
  XIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getDefaultFilterFnForColumn,
  isDataTableColumnFilterable,
  isDataTableColumnSortable,
  resolveDataTableColumnFilter,
} from '@/lib/data-table-column-config';
import { isDataTableFilterActive } from '@/lib/data-table-filter-value';
import {
  cycleSortState,
  filterDataTableRows,
  sortDataTableRows,
  type DataTableSort,
} from '@/lib/data-table-utils';
import type { DataTableColumn, DataTableProps } from '@/lib/data-table-types';
import { cn } from '@/lib/utils';

export type {
  DataTableColumn,
  DataTableColumnDataType,
  DataTableColumnFilter,
  DataTableFilterOption,
  DataTableProps,
  DataTableSort,
} from '@/lib/data-table-types';

function emptyFiltersForColumns<T>(columns: readonly DataTableColumn<T>[]): Record<string, string> {
  return Object.fromEntries(
    columns.filter((column) => isDataTableColumnFilterable(column)).map((column) => [column.id, '']),
  );
}

function mergeFilters<T>(
  columns: readonly DataTableColumn<T>[],
  filters: Record<string, string> | undefined,
): Record<string, string> {
  return { ...emptyFiltersForColumns(columns), ...filters };
}

function shouldApplyClientFilter<T>(
  column: DataTableColumn<T>,
  manualFiltering: boolean,
  clientFilterColumnIds: readonly string[] | undefined,
): boolean {
  if (!isDataTableColumnFilterable(column)) {
    return false;
  }
  if (!manualFiltering) {
    return true;
  }
  return clientFilterColumnIds?.includes(column.id) ?? false;
}

function shouldApplyClientSort(
  manualSorting: boolean,
  clientSortColumnIds: readonly string[] | undefined,
  sort: DataTableSort | null,
): boolean {
  if (!sort) {
    return false;
  }
  if (!manualSorting) {
    return true;
  }
  return clientSortColumnIds?.includes(sort.id) ?? false;
}

type DataTableColumnFilterPopoverProps<T> = {
  column: DataTableColumn<T>;
  filterValue: string;
  onFilterValueChange: (value: string) => void;
  onFilterClear: () => void;
};

/** Hover popup with datatype-matched filter controls for a single column. */
function DataTableColumnFilterPopover<T>({
  column,
  filterValue,
  onFilterValueChange,
  onFilterClear,
}: DataTableColumnFilterPopoverProps<T>) {
  const filter = resolveDataTableColumnFilter(column);
  if (!filter) {
    return null;
  }

  const filterKind = filter.type === 'multiselect' ? 'multiselect' : 'text';
  const hasActiveFilter = isDataTableFilterActive(filterValue, filterKind);
  const headerLabel = String(column.header);

  return (
    <HoverCard openDelay={120} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className={cn(
            'relative shrink-0 text-muted-foreground',
            hasActiveFilter && 'text-foreground',
          )}
          aria-label={
            hasActiveFilter
              ? `Filter ${headerLabel} (active)`
              : `Filter ${headerLabel}`
          }
          aria-pressed={hasActiveFilter}
        >
          <FilterIcon className={cn('size-3.5', hasActiveFilter && 'fill-current')} />
          {hasActiveFilter ? (
            <span
              className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary"
              aria-hidden
            />
          ) : null}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-72 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs text-muted-foreground">Filter {headerLabel}</Label>
          {hasActiveFilter ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="h-6 gap-1 px-2 text-xs text-muted-foreground"
              onClick={onFilterClear}
            >
              <XIcon className="size-3" />
              Clear
            </Button>
          ) : null}
        </div>
        {filter.type === 'multiselect' ? (
          <MultiSelectCombobox
            options={filter.options}
            value={filterValue}
            onValueChange={onFilterValueChange}
            aria-label={`Filter ${headerLabel}`}
          />
        ) : (
          <Input
            type={filter.inputMode === 'email' ? 'email' : filter.inputMode === 'numeric' ? 'number' : 'text'}
            aria-label={`Filter ${headerLabel}`}
            placeholder={filter.placeholder ?? 'Filter…'}
            value={filterValue}
            onChange={(event) => onFilterValueChange(event.target.value)}
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

type DataTableColumnHeaderProps<T> = {
  column: DataTableColumn<T>;
  sort: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  filterValue: string;
  onFilterValueChange: (value: string) => void;
  onFilterClear: () => void;
};

/** Column header with optional sort toggle and hover filter popup. */
function DataTableColumnHeader<T>({
  column,
  sort,
  onSortChange,
  filterValue,
  onFilterValueChange,
  onFilterClear,
}: DataTableColumnHeaderProps<T>) {
  const isSorted = sort?.id === column.id;
  const sortDirection = isSorted ? (sort.desc ? 'desc' : 'asc') : null;
  const sortable = isDataTableColumnSortable(column) && Boolean(onSortChange);
  const filterable = isDataTableColumnFilterable(column);

  function handleSortToggle() {
    if (!sortable || !onSortChange) {
      return;
    }
    onSortChange(cycleSortState(sort, column.id));
  }

  const SortIcon =
    sortDirection === 'asc'
      ? ArrowUpIcon
      : sortDirection === 'desc'
        ? ArrowDownIcon
        : ArrowUpDownIcon;

  return (
    <div className="flex min-w-[6rem] items-center gap-1 py-0.5">
      {sortable ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className={cn('shrink-0 text-muted-foreground', isSorted && 'text-foreground')}
          aria-label={`Sort by ${String(column.header)}`}
          aria-pressed={isSorted}
          onClick={handleSortToggle}
        >
          <SortIcon className="size-3.5" />
        </Button>
      ) : null}
      <span className="truncate font-medium">{column.header}</span>
      {filterable ? (
        <DataTableColumnFilterPopover
          column={column}
          filterValue={filterValue}
          onFilterValueChange={onFilterValueChange}
          onFilterClear={onFilterClear}
        />
      ) : null}
    </div>
  );
}

/**
 * Renders tabular data with sortable headers and optional hover column filters.
 *
 * Set `dataType` on columns to infer matching filter controls. Enum and boolean columns
 * use a multiselect combobox. Use `manualFiltering` / `manualSorting` with
 * `clientFilterColumnIds` / `clientSortColumnIds` for server-backed tables.
 */
export function DataTable<T>({
  data,
  columns,
  getRowKey,
  sort: controlledSort,
  onSortChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  manualSorting = false,
  manualFiltering = false,
  clientFilterColumnIds,
  clientSortColumnIds,
  emptyMessage = 'No results',
  className,
  tableClassName,
}: DataTableProps<T>) {
  const [uncontrolledSort, setUncontrolledSort] = React.useState<DataTableSort | null>(null);
  const [uncontrolledFilters, setUncontrolledFilters] = React.useState(() =>
    emptyFiltersForColumns(columns),
  );

  const sort = controlledSort !== undefined ? controlledSort : uncontrolledSort;
  const setSort = onSortChange ?? setUncontrolledSort;

  const columnFilters = React.useMemo(
    () =>
      mergeFilters(
        columns,
        controlledColumnFilters !== undefined ? controlledColumnFilters : uncontrolledFilters,
      ),
    [columns, controlledColumnFilters, uncontrolledFilters],
  );

  function setColumnFilters(next: Record<string, string>) {
    const merged = mergeFilters(columns, next);
    if (onColumnFiltersChange) {
      onColumnFiltersChange(merged);
      return;
    }
    setUncontrolledFilters(merged);
  }

  function handleFilterChange(columnId: string, value: string) {
    setColumnFilters({ ...columnFilters, [columnId]: value });
  }

  function handleFilterClear(columnId: string) {
    setColumnFilters({ ...columnFilters, [columnId]: '' });
  }

  const getSortValue = React.useCallback(
    (row: T, columnId: string) => {
      const column = columns.find((entry) => entry.id === columnId);
      return column ? column.accessorFn(row) : null;
    },
    [columns],
  );

  const bodyColumns = React.useMemo(
    () => columns.filter((column) => !column.filterOnly),
    [columns],
  );

  const processedRows = React.useMemo(() => {
    let rows = [...data];
    const filters = mergeFilters(columns, filterSource);

    const filterColumns = columns.filter((column) =>
      shouldApplyClientFilter(column, manualFiltering, clientFilterColumnIds),
    );

    if (filterColumns.length > 0) {
      rows = filterDataTableRows(
        rows,
        filterColumns.map((column) => ({
          id: column.id,
          getFilterValue: (row) => column.accessorFn(row),
          filterFn: column.filterFn ?? getDefaultFilterFnForColumn(column),
        })),
        filters,
      );
    }

    if (shouldApplyClientSort(manualSorting, clientSortColumnIds, sort)) {
      const activeColumn = columns.find((column) => column.id === sort?.id);
      rows = sortDataTableRows(
        rows,
        sort,
        getSortValue,
        activeColumn?.sortFn
          ? (rowA, rowB, activeSort) => activeColumn.sortFn!(rowA, rowB, activeSort)
          : undefined,
      );
    }

    return rows;
  }, [
    clientFilterColumnIds,
    clientSortColumnIds,
    columns,
    data,
    filterSource,
    getSortValue,
    manualFiltering,
    manualSorting,
    sort,
  ]);

  return (
    <div className={cn('relative w-full', className)}>
      <Table className={tableClassName}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.headerClassName}>
                <DataTableColumnHeader
                  column={column}
                  sort={sort}
                  onSortChange={setSort}
                  filterValue={columnFilters[column.id] ?? ''}
                  onFilterValueChange={(value) => handleFilterChange(column.id, value)}
                  onFilterClear={() => handleFilterClear(column.id)}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedRows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={Math.max(bodyColumns.length, 1)}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            processedRows.map((row) => (
              <TableRow key={getRowKey(row)}>
                {bodyColumns.map((column) => {
                  const value = column.accessorFn(row);
                  return (
                    <TableCell key={column.id} className={column.className}>
                      {column.cell ? column.cell({ row, value }) : String(value ?? '')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
