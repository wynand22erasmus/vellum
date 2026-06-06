/**
 * Tests for date/datetime column filter value helpers.
 *
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import {
  datetimeLocalToFilterValue,
  filterValueToDatetimeLocal,
  formatDateFilterDisplayValue,
  parseDateFilterDraft,
  buildDateFilterDraft,
} from './data-table-datetime-filter-value';
import {
  defaultDateOnlyColumnFilter,
  defaultDateTimeColumnFilter,
} from './data-table-utils';

describe('data-table-datetime-filter-value', () => {
  it('converts date input to YYYY-MM-DD token', () => {
    expect(datetimeLocalToFilterValue('2026-06-03', 'date')).toBe('2026-06-03');
  });

  it('converts datetime-local input to ISO token', () => {
    const iso = datetimeLocalToFilterValue('2026-06-03T10:30', 'datetime');
    expect(iso).toMatch(/^2026-06-03T/);
    expect(iso.endsWith('Z') || iso.includes('+')).toBe(true);
  });

  it('round-trips stored ISO back to datetime-local draft', () => {
    const stored = '2026-06-03T14:30:00.000Z';
    const local = filterValueToDatetimeLocal(stored, 'datetime');
    expect(local).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('formats display values for toolbar chips', () => {
    expect(formatDateFilterDisplayValue('2026-06-03', 'date')).toContain('2026');
    expect(formatDateFilterDisplayValue('2026-06-03T14:30:00.000Z', 'datetime')).toContain('2026');
  });

  it('parses and builds date-only drafts', () => {
    const parts = parseDateFilterDraft('2026-06-03', 'date');
    expect(parts.selectedDate).toBeDefined();
    expect(buildDateFilterDraft(parts.selectedDate, 0, 0, 'date')).toBe('2026-06-03');
  });

  it('parses and builds datetime drafts', () => {
    const parts = parseDateFilterDraft('2026-06-03T10:30', 'datetime');
    expect(parts.hours).toBe(10);
    expect(parts.minutes).toBe(30);
    expect(buildDateFilterDraft(parts.selectedDate, 10, 45, 'datetime')).toBe('2026-06-03T10:45');
  });
});

describe('defaultDateOnlyColumnFilter', () => {
  it('matches rows on the same calendar day', () => {
    expect(
      defaultDateOnlyColumnFilter('2026-06-03T22:15:00.000Z', '2026-06-03'),
    ).toBe(true);
    expect(
      defaultDateOnlyColumnFilter('2026-06-04T01:00:00.000Z', '2026-06-03'),
    ).toBe(false);
  });
});

describe('defaultDateTimeColumnFilter', () => {
  it('matches rows in the same UTC minute', () => {
    const picked = '2026-06-03T10:30:00.000Z';
    expect(defaultDateTimeColumnFilter('2026-06-03T10:30:45.000Z', picked)).toBe(true);
    expect(defaultDateTimeColumnFilter('2026-06-03T10:31:00.000Z', picked)).toBe(false);
  });
});
