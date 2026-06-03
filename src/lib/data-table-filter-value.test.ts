import { describe, expect, it } from 'vitest';
import {
  booleanMultiSelectForQuery,
  isDataTableFilterActive,
  parseMultiSelectFilterValue,
  serializeMultiSelectFilterValue,
} from './data-table-filter-value';

describe('multiselect filter serialization', () => {
  it('round-trips selected values', () => {
    const raw = serializeMultiSelectFilterValue(['ADMIN', 'CONSUMER']);
    expect(parseMultiSelectFilterValue(raw)).toEqual(['ADMIN', 'CONSUMER']);
  });

  it('treats empty selection as inactive', () => {
    expect(isDataTableFilterActive('', 'multiselect')).toBe(false);
    expect(isDataTableFilterActive(serializeMultiSelectFilterValue([]), 'multiselect')).toBe(
      false,
    );
  });
});

describe('booleanMultiSelectForQuery', () => {
  it('maps a single boolean selection', () => {
    expect(booleanMultiSelectForQuery(['true'])).toBe(true);
    expect(booleanMultiSelectForQuery(['false'])).toBe(false);
    expect(booleanMultiSelectForQuery(['true', 'false'])).toBeUndefined();
  });
});
