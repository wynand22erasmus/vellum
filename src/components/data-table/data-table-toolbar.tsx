/**
 * Toolbar for `DataTable`: column visibility and active filter chips.
 *
 * @packageDocumentation
 */

import type { Table } from '@tanstack/react-table';
import { Columns3, SlidersHorizontal } from 'lucide-react';
import { DataTableFilterChip } from '@/components/data-table/data-table-column-header';
import { formatFilterDisplayValue } from '@/components/data-table/column-filter-config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { surfaceBandClassName } from '@/components/layout/app-surface';

function columnTitle<TData>(table: Table<TData>, columnId: string): string {
  const column = table.getColumn(columnId);
  if (!column) return columnId;
  const header = column.columnDef.header;
  return typeof header === 'string' && header ? header : columnId;
}

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  onClearAllFilters: () => void;
  className?: string;
};

/** Column visibility toggle and active column-filter summary. */
export function DataTableToolbar<TData>({
  table,
  onClearAllFilters,
  className,
}: DataTableToolbarProps<TData>) {
  const columnFilters = table.getState().columnFilters;
  const activeColumnFilters = columnFilters.filter((filter) => {
    const column = table.getColumn(filter.id);
    return column && formatFilterDisplayValue(column, filter.value).length > 0;
  });
  const hasActiveFilters = activeColumnFilters.length > 0;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {hasActiveFilters ? (
          <Badge variant="outline" className="gap-1.5 font-normal">
            <SlidersHorizontal className="size-3" aria-hidden />
            {activeColumnFilters.length} filter{activeColumnFilters.length === 1 ? '' : 's'} active
          </Badge>
        ) : null}
        {hasActiveFilters ? (
          <Button type="button" variant="outline" size="sm" onClick={onClearAllFilters}>
            Clear all
          </Button>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="size-4" aria-hidden />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                >
                  {columnTitle(table, column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasActiveFilters ? (
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 rounded-2xl border border-border/50 px-3 py-2',
            surfaceBandClassName,
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">Active filters</span>
          {activeColumnFilters.map((filter) => {
            const column = table.getColumn(filter.id)!;
            return (
              <DataTableFilterChip
                key={filter.id}
                label={columnTitle(table, filter.id)}
                value={formatFilterDisplayValue(column, filter.value)}
                onRemove={() => column.setFilterValue(undefined)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
