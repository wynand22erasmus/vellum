/**
 * Calendar-based date/datetime picker for column filter popovers.
 *
 * @packageDocumentation
 */

import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import {
  buildDateFilterDraft,
  datetimeLocalToFilterValue,
  filterValueToDatetimeLocal,
  parseDateFilterDraft,
  type DateFilterGranularity,
} from '@/lib/data-table-datetime-filter-value';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

/** Converts draft native input value to stored filter token on apply. */
export function commitDateTimeFilterDraft(
  draft: string,
  granularity: DateFilterGranularity,
): string {
  return datetimeLocalToFilterValue(draft, granularity);
}

/** Converts stored filter token to draft when opening the popover. */
export function openDateTimeFilterDraft(
  committed: string,
  granularity: DateFilterGranularity,
): string {
  return filterValueToDatetimeLocal(committed, granularity);
}

type DateTimeColumnFilterProps = {
  label: string;
  granularity: DateFilterGranularity;
  draft: string;
  onDraftChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
  /** Commit immediately on each change (legacy inline tables). */
  autoApply?: boolean;
  /** Show Apply/Clear action row. Defaults to the inverse of `autoApply`. */
  showActions?: boolean;
  /** Called with the committed filter token when `autoApply` is enabled. */
  onCommit?: (committed: string) => void;
};

const selectClassName = cn(
  'h-9 min-w-0 rounded-3xl border border-transparent bg-input/50 px-2.5 text-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30',
);

function TimeSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  options: readonly number[];
  ariaLabel: string;
}) {
  return (
    <select
      className={selectClassName}
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(Number(event.target.value))}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {String(option).padStart(2, '0')}
        </option>
      ))}
    </select>
  );
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => index);
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => index);

/** Calendar date picker with optional time controls and Apply/Clear actions. */
export function DateTimeColumnFilter({
  label,
  granularity,
  draft,
  onDraftChange,
  onApply,
  onClear,
  autoApply = false,
  showActions,
  onCommit,
}: DateTimeColumnFilterProps) {
  const showActionRow = showActions ?? !autoApply;
  const { selectedDate, hours, minutes } = parseDateFilterDraft(draft, granularity);

  function commitDraft(nextDraft: string) {
    onDraftChange(nextDraft);
    if (autoApply && nextDraft.trim()) {
      const committed = commitDateTimeFilterDraft(nextDraft, granularity);
      onCommit?.(committed);
    }
  }

  function handleDateSelect(date: Date | undefined) {
    commitDraft(buildDateFilterDraft(date, hours, minutes, granularity));
  }

  function handleTimeChange(nextHours: number, nextMinutes: number) {
    if (!selectedDate) {
      return;
    }
    commitDraft(buildDateFilterDraft(selectedDate, nextHours, nextMinutes, granularity));
  }

  const summary =
    selectedDate != null
      ? format(
          selectedDate,
          granularity === 'date' ? 'EEE, MMM d, yyyy' : 'EEE, MMM d, yyyy',
        )
      : null;

  return (
    <div className="space-y-3">
      {summary ? (
        <p className="text-center text-sm font-medium text-foreground">{summary}</p>
      ) : (
        <p className="text-center text-sm text-muted-foreground">Pick a date</p>
      )}

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        defaultMonth={selectedDate}
        className="mx-auto"
        aria-label={`Filter ${label} by ${granularity === 'date' ? 'date' : 'date and time'}`}
      />

      {granularity === 'datetime' ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-muted/30 px-3 py-2">
          <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <TimeSelect
            value={hours}
            onChange={(nextHours) => handleTimeChange(nextHours, minutes)}
            options={HOUR_OPTIONS}
            ariaLabel={`Filter ${label} by hour`}
          />
          <span className="text-sm text-muted-foreground">:</span>
          <TimeSelect
            value={minutes}
            onChange={(nextMinutes) => handleTimeChange(hours, nextMinutes)}
            options={MINUTE_OPTIONS}
            ariaLabel={`Filter ${label} by minute`}
          />
        </div>
      ) : null}

      {showActionRow ? (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button type="button" size="sm" onClick={onApply} disabled={!draft.trim()}>
            Apply
          </Button>
        </div>
      ) : null}
    </div>
  );
}
