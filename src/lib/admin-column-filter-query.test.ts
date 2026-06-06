import { describe, expect, it } from 'vitest';
import {
  columnFiltersToAdminQueryParams,
  splitAdminColumnFilters,
} from './admin-column-filter-query';

describe('columnFiltersToAdminQueryParams', () => {
  it('maps text columns to query params', () => {
    expect(
      columnFiltersToAdminQueryParams([{ id: 'email', value: 'alice@example.com' }]),
    ).toEqual({ email: 'alice@example.com' });
  });

  it('maps enum multiselect to comma-separated values', () => {
    expect(
      columnFiltersToAdminQueryParams([
        { id: 'kind', value: JSON.stringify(['ADMIN', 'USER']) },
      ]),
    ).toEqual({ kind: 'ADMIN,USER' });
  });

  it('maps single emailVerified selection', () => {
    expect(
      columnFiltersToAdminQueryParams([
        { id: 'emailVerified', value: JSON.stringify(['true']) },
      ]),
    ).toEqual({ emailVerified: 'true' });
  });

  it('ignores multi emailVerified selections', () => {
    expect(
      columnFiltersToAdminQueryParams([
        { id: 'emailVerified', value: JSON.stringify(['true', 'false']) },
      ]),
    ).toEqual({});
  });

  it('maps date-only values to from/to range', () => {
    expect(
      columnFiltersToAdminQueryParams([{ id: 'createdAt', value: '2024-06-01' }]),
    ).toEqual({
      from: '2024-06-01T00:00:00.000Z',
      to: '2024-06-01T23:59:59.999Z',
    });
  });

  it('maps datetime values to from param', () => {
    expect(
      columnFiltersToAdminQueryParams([
        { id: 'timestamp', value: '2024-06-01T12:30:00.000Z' },
      ]),
    ).toEqual({ from: '2024-06-01T12:30:00.000Z' });
  });

  it('skips client-only status column', () => {
    expect(
      columnFiltersToAdminQueryParams([
        { id: 'status', value: JSON.stringify(['link_active']) },
        { id: 'fileName', value: 'report' },
      ]),
    ).toEqual({ fileName: 'report' });
  });

  it('ignores empty filter values', () => {
    expect(
      columnFiltersToAdminQueryParams([
        { id: 'email', value: '  ' },
        { id: 'kind', value: '' },
      ]),
    ).toEqual({});
  });
});

describe('splitAdminColumnFilters', () => {
  it('separates server params from client-only filters', () => {
    const filters = [
      { id: 'fileName', value: 'report' },
      { id: 'status', value: JSON.stringify(['link_active']) },
    ];

    expect(splitAdminColumnFilters(filters)).toEqual({
      serverParams: { fileName: 'report' },
      clientFilters: [{ id: 'status', value: JSON.stringify(['link_active']) }],
    });
  });
});
