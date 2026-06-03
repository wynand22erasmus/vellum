/**
 * Searchable multiselect combobox for enum-style column filters.
 *
 * @packageDocumentation
 */

import { useMemo, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  parseMultiSelectFilterValue,
  serializeMultiSelectFilterValue,
} from '@/lib/data-table-filter-value';

export type MultiSelectComboboxOption = { value: string; label: string };

type MultiSelectComboboxProps = {
  options: readonly MultiSelectComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  'aria-label'?: string;
};

/**
 * Compact multiselect with search; serializes selection via {@link serializeMultiSelectFilterValue}.
 */
export function MultiSelectCombobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  className,
  'aria-label': ariaLabel,
}: MultiSelectComboboxProps) {
  const [query, setQuery] = useState('');
  const selected = parseMultiSelectFilterValue(value);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(normalized),
    );
  }, [options, query]);

  function toggleOption(optionValue: string) {
    const next = selected.includes(optionValue)
      ? selected.filter((entry) => entry !== optionValue)
      : [...selected, optionValue];
    onValueChange(serializeMultiSelectFilterValue(next));
  }

  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (options.find((option) => option.value === selected[0])?.label ?? selected[0])
        : `${selected.length} selected`;

  return (
    <div className={cn('space-y-2', className)}>
      <Button
        type="button"
        variant="outline"
        className="h-9 w-full justify-between rounded-2xl px-3 font-normal"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
      >
        <span className={cn('truncate', selected.length === 0 && 'text-muted-foreground')}>
          {triggerLabel}
        </span>
        <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </Button>
      <Input
        placeholder={searchPlaceholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-8 rounded-2xl text-xs"
        aria-label={ariaLabel ? `${ariaLabel} search` : 'Search options'}
      />
      <div
        className="max-h-44 space-y-0.5 overflow-y-auto rounded-2xl border border-border/60 p-1"
        role="listbox"
        aria-multiselectable
        aria-label={ariaLabel}
      >
        {filteredOptions.length === 0 ? (
          <p className="px-2 py-3 text-center text-xs text-muted-foreground">No matches</p>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted',
                  isSelected && 'bg-muted/80',
                )}
                onClick={() => toggleOption(option.value)}
              >
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded border border-input',
                    isSelected && 'border-primary bg-primary text-primary-foreground',
                  )}
                >
                  {isSelected ? <CheckIcon className="size-3" /> : null}
                </span>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
