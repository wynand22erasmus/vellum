import { describe, expect, it } from 'vitest';
import {
  compareSortValues,
  cycleSortState,
  defaultMultiSelectColumnFilter,
  defaultTextColumnFilter,
  filterDataTableRows,
  normalizeSortValue,
  sortDataTableRows,
} from './data-table-utils';
import { serializeMultiSelectFilterValue } from './data-table-filter-value';

type Row = { name: string; role: string; createdAt: string };

const rows: Row[] = [
  { name: 'Beta', role: 'ADMIN', createdAt: '2026-02-01T00:00:00.000Z' },
  { name: 'alpha', role: 'CONSUMER', createdAt: '2026-01-01T00:00:00.000Z' },
];

describe('cycleSortState', () => {
  it('cycles asc, desc, then clears', () => {
    expect(cycleSortState(null, 'name')).toEqual({ id: 'name', desc: false });
    expect(cycleSortState({ id: 'name', desc: false }, 'name')).toEqual({
      id: 'name',
      desc: true,
    });
    expect(cycleSortState({ id: 'name', desc: true }, 'name')).toBeNull();
  });

  it('starts a new column on asc', () => {
    expect(cycleSortState({ id: 'name', desc: true }, 'role')).toEqual({
      id: 'role',
      desc: false,
    });
  });
});

describe('normalizeSortValue', () => {
  it('parses ISO date strings', () => {
    const value = normalizeSortValue('2026-01-15T12:00:00.000Z');
    expect(value).toBeInstanceOf(Date);
  });
});

describe('compareSortValues', () => {
  it('orders nulls last', () => {
    expect(compareSortValues(null, 'a')).toBeGreaterThan(0);
    expect(compareSortValues('a', null)).toBeLessThan(0);
  });
});

describe('defaultTextColumnFilter', () => {
  it('matches case-insensitively', () => {
    expect(defaultTextColumnFilter('Hello World', 'world')).toBe(true);
    expect(defaultTextColumnFilter('Hello', 'zzz')).toBe(false);
    expect(defaultTextColumnFilter('Hello', '')).toBe(true);
  });
});

describe('defaultMultiSelectColumnFilter', () => {
  it('matches any selected enum value', () => {
    const filter = serializeMultiSelectFilterValue(['CONSUMER']);
    expect(defaultMultiSelectColumnFilter('ADMIN', filter)).toBe(false);
    expect(defaultMultiSelectColumnFilter('CONSUMER', filter)).toBe(true);
    expect(defaultMultiSelectColumnFilter('CONSUMER', '')).toBe(true);
  });

  it('matches tag lists on rows', () => {
    const filter = serializeMultiSelectFilterValue(['downloaded']);
    expect(defaultMultiSelectColumnFilter(['link-active', 'downloaded'], filter)).toBe(true);
  });
});

describe('filterDataTableRows', () => {
  it('applies configured column filters', () => {
    const filtered = filterDataTableRows(
      rows,
      [
        {
          id: 'name',
          getFilterValue: (row) => row.name,
          filterFn: defaultTextColumnFilter,
        },
        {
          id: 'role',
          getFilterValue: (row) => row.role,
          filterFn: defaultMultiSelectColumnFilter,
        },
      ],
      {
        name: 'alp',
        role: serializeMultiSelectFilterValue(['CONSUMER']),
      },
    );
    expect(filtered).toEqual([rows[1]]);
  });
});

describe('sortDataTableRows', () => {
  it('sorts ascending and descending', () => {
    const getValue = (row: Row, columnId: string) =>
      columnId === 'name' ? row.name : row.createdAt;

    expect(
      sortDataTableRows(rows, { id: 'name', desc: false }, getValue).map((row) => row.name),
    ).toEqual(['alpha', 'Beta']);

    expect(
      sortDataTableRows(rows, { id: 'name', desc: true }, getValue).map((row) => row.name),
    ).toEqual(['Beta', 'alpha']);
  });
});
