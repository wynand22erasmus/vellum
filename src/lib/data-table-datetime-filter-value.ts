/**
 * Serialization helpers for date/datetime column filter values.
 *
 * Filter values are stored as ISO 8601 strings (`YYYY-MM-DD` for date-only,
 * full ISO for datetime) so they interoperate with API row timestamps.
 *
 * @packageDocumentation
 */

import { format, isValid, parseISO } from 'date-fns';

/** Date-only vs date-time filter granularity. */
export type DateFilterGranularity = 'date' | 'datetime';

/** Parsed calendar date and optional time parts for filter UI drafts. */
export type DateFilterDraftParts = {
  selectedDate: Date | undefined;
  hours: number;
  minutes: number;
};

/** Parses a filter draft into calendar date and optional time parts. */
export function parseDateFilterDraft(
  draft: string,
  granularity: DateFilterGranularity,
): DateFilterDraftParts {
  const trimmed = draft.trim();
  if (!trimmed) {
    return { selectedDate: undefined, hours: 0, minutes: 0 };
  }

  if (granularity === 'date') {
    const parsed = parseISO(trimmed.slice(0, 10));
    return {
      selectedDate: isValid(parsed) ? parsed : undefined,
      hours: 0,
      minutes: 0,
    };
  }

  const localMatch = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(trimmed);
  if (localMatch) {
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        selectedDate: parsed,
        hours: Number(localMatch[2]),
        minutes: Number(localMatch[3]),
      };
    }
  }

  const parsed = parseISO(trimmed);
  if (isValid(parsed)) {
    return {
      selectedDate: parsed,
      hours: parsed.getHours(),
      minutes: parsed.getMinutes(),
    };
  }

  const dateOnly = parseISO(trimmed.slice(0, 10));
  return {
    selectedDate: isValid(dateOnly) ? dateOnly : undefined,
    hours: 0,
    minutes: 0,
  };
}

/** Builds a native-style filter draft from calendar and time parts. */
export function buildDateFilterDraft(
  selectedDate: Date | undefined,
  hours: number,
  minutes: number,
  granularity: DateFilterGranularity,
): string {
  if (!selectedDate) {
    return '';
  }

  if (granularity === 'date') {
    return format(selectedDate, 'yyyy-MM-dd');
  }

  const withTime = new Date(selectedDate);
  withTime.setHours(hours, minutes, 0, 0);
  return format(withTime, "yyyy-MM-dd'T'HH:mm");
}

/** Converts a native date/datetime-local input value to a stored filter token. */
export function datetimeLocalToFilterValue(
  local: string,
  granularity: DateFilterGranularity,
): string {
  const trimmed = local.trim();
  if (!trimmed) {
    return '';
  }

  if (granularity === 'date') {
    return trimmed.slice(0, 10);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }
  return parsed.toISOString();
}

/** Converts a stored filter token back to a native input value. */
export function filterValueToDatetimeLocal(
  stored: string,
  granularity: DateFilterGranularity,
): string {
  const trimmed = stored.trim();
  if (!trimmed) {
    return '';
  }

  if (granularity === 'date') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const parsed = parseISO(trimmed);
    if (!isValid(parsed)) {
      return trimmed.slice(0, 10);
    }
    return format(parsed, 'yyyy-MM-dd');
  }

  const parsed = parseISO(trimmed);
  if (!isValid(parsed)) {
    return trimmed.slice(0, 16);
  }
  return format(parsed, "yyyy-MM-dd'T'HH:mm");
}

/** Human-readable label for active date/datetime filter chips. */
export function formatDateFilterDisplayValue(
  stored: string,
  granularity: DateFilterGranularity,
): string {
  const trimmed = stored.trim();
  if (!trimmed) {
    return '';
  }

  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? parseISO(trimmed) : parseISO(trimmed);
  if (!isValid(parsed)) {
    return trimmed;
  }

  return format(parsed, granularity === 'date' ? 'MMM d, yyyy' : 'MMM d, yyyy h:mm a');
}

/** Native input `type` for the given granularity. */
export function dateFilterInputType(granularity: DateFilterGranularity): 'date' | 'datetime-local' {
  return granularity === 'date' ? 'date' : 'datetime-local';
}
