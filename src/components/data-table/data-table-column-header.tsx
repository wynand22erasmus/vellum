/**
 * Sortable column header with popover filter for `DataTable`.
 *
 * @packageDocumentation
 */

import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, X } from 'lucide-react';
import { useState } from 'react';
import {
  isColumnFilterActive,
  resolveColumnFilter,
} from '@/components/data-table/column-filter-config';
import { type ColumnSortDirection } from '@/components/data-table/table-header-state';
import {
  commitDateTimeFilterDraft,
  openDateTimeFilterDraft,
} from '@/components/data-table/datetime-column-filter';
import { ColumnFilterControl } from '@/components/data-table/column-filter-control';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type ColumnFilterPopoverProps<TData> = {
  column: Column<TData, unknown>;
  title: string;
  filterValue: unknown;
};

/** Filter popover — local draft while open; control type follows column data type. */
function ColumnFilterPopover<TData>({
  column,
  title,
  filterValue,
}: ColumnFilterPopoverProps<TData>) {
  const [open, setOpen] = useState(false);
  const committed = String(filterValue ?? '');
  const [draft, setDraft] = useState(committed);
  const filter = resolveColumnFilter(column.columnDef, column.id);
  const hasActiveFilter = isColumnFilterActive(column, filterValue);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      const stored = String(filterValue ?? '');
      if (filter?.type === 'datetime') {
        setDraft(openDateTimeFilterDraft(stored, filter.granularity));
      } else {
        setDraft(stored);
      }
    }
  }

  function applyFilter() {
    const value =
      filter?.type === 'datetime'
        ? commitDateTimeFilterDraft(draft, filter.granularity)
        : draft;
    column.setFilterValue(value.length > 0 ? value : undefined);
    setOpen(false);
  }

  function clearFilter() {
    setDraft('');
    column.setFilterValue(undefined);
  }

  if (!filter) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className={cn(
            'relative text-muted-foreground',
            hasActiveFilter && 'bg-primary/10 text-primary',
          )}
          aria-label={hasActiveFilter ? `Filter ${title} (active)` : `Filter ${title}`}
          aria-pressed={hasActiveFilter}
        >
          <Filter className={cn('size-3.5', hasActiveFilter && 'fill-current/20')} aria-hidden />
          {hasActiveFilter ? (
            <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-brand-accent" aria-hidden />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn('w-auto', filter?.type === 'datetime' ? 'min-w-[18rem]' : 'w-72')}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <Label className="text-xs text-muted-foreground">Filter {title}</Label>
          {hasActiveFilter ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="h-6 gap-1 px-2 text-xs text-muted-foreground"
              onClick={clearFilter}
            >
              <X className="size-3" aria-hidden />
              Clear
            </Button>
          ) : null}
        </div>
        <ColumnFilterControl
          column={column}
          filter={filter}
          draft={draft}
          onDraftChange={setDraft}
          onApply={applyFilter}
          onClear={clearFilter}
        />
      </PopoverContent>
    </Popover>
  );
}

type DataTableColumnHeaderProps<TData> = {
  column: Column<TData, unknown>;
  title: string;
  className?: string;
  sortDirection: ColumnSortDirection;
  filterValue: unknown;
};

/** Compact column title with sort toggle and filter popover. */
export function DataTableColumnHeader<TData>({
  column,
  title,
  className,
  sortDirection,
  filterValue,
}: DataTableColumnHeaderProps<TData>) {
  const canSort = column.getCanSort();
  const canFilter = column.getCanFilter();

  return (
    <div className={cn('flex min-w-[5rem] items-center justify-between gap-2', className)}>
      <span className="truncate text-sm font-medium">{title}</span>
      <div className="flex shrink-0 items-center gap-0.5">
        {canSort ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              'text-muted-foreground',
              sortDirection && 'bg-primary/10 text-primary',
            )}
            onClick={column.getToggleSortingHandler()}
            aria-label={
              sortDirection === 'asc'
                ? `Sorted by ${title} ascending`
                : sortDirection === 'desc'
                  ? `Sorted by ${title} descending`
                  : `Sort by ${title}`
            }
            aria-pressed={Boolean(sortDirection)}
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="size-3.5" aria-hidden />
            ) : sortDirection === 'desc' ? (
              <ArrowDown className="size-3.5" aria-hidden />
            ) : (
              <ArrowUpDown className="size-3.5 opacity-60" aria-hidden />
            )}
          </Button>
        ) : null}
        {canFilter ? (
          <ColumnFilterPopover column={column} title={title} filterValue={filterValue} />
        ) : null}
      </div>
    </div>
  );
}

/** Chip showing an active column or global filter. */
export function DataTableFilterChip({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string;
  onRemove: () => void;
}) {
  return (
    <Badge variant="secondary" className="gap-1.5 pr-1 font-normal">
      <span className="text-muted-foreground">{label}:</span>
      <span className="max-w-[12rem] truncate font-medium text-foreground">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="size-5 text-muted-foreground hover:text-foreground"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
      >
        <X className="size-3" aria-hidden />
      </Button>
    </Badge>
  );
}
