/**
 * Typed column filter control for data table headers.
 *
 * @packageDocumentation
 */

import type { Column } from '@tanstack/react-table';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import type { DataTableColumnFilter } from '@/lib/data-table-types';
import {
  DateTimeColumnFilter,
} from '@/components/data-table/datetime-column-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ColumnFilterControlProps<TData> = {
  column: Column<TData, unknown>;
  filter: DataTableColumnFilter;
  draft: string;
  onDraftChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

/** Renders text, datetime picker, or multiselect filter UI based on resolved column filter config. */
export function ColumnFilterControl<TData>({
  column,
  filter,
  draft,
  onDraftChange,
  onApply,
  onClear,
}: ColumnFilterControlProps<TData>) {
  const label = typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;

  if (filter.type === 'multiselect') {
    return (
      <div className="space-y-3">
        <MultiSelectCombobox
          options={filter.options}
          value={draft}
          onValueChange={onDraftChange}
          placeholder={`Filter ${label}…`}
          searchPlaceholder="Search options…"
          aria-label={`Filter ${label}`}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button type="button" size="sm" onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>
    );
  }

  if (filter.type === 'datetime') {
    return (
      <DateTimeColumnFilter
        label={label}
        granularity={filter.granularity}
        draft={draft}
        onDraftChange={onDraftChange}
        onApply={onApply}
        onClear={onClear}
      />
    );
  }

  const inputType = filter.inputMode === 'numeric' ? 'number' : 'text';

  return (
    <div className="space-y-3">
      <Input
        type={inputType}
        inputMode={filter.inputMode ?? 'text'}
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        placeholder={filter.placeholder ?? `Filter ${label}…`}
        className="h-9"
        aria-label={`Filter ${label}`}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onApply();
          }
        }}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
        <Button type="button" size="sm" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}
