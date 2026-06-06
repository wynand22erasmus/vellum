/**
 * Tests for table header sort/filter state helpers.
 *
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import {
  filterValueForColumn,
  hasActiveColumnFilter,
  sortDirectionForColumn,
} from './table-header-state';

describe('table-header-state', () => {
  it('returns sort direction only for the active column', () => {
    const sorting = [{ id: 'createdAt', desc: false }];
    expect(sortDirectionForColumn('createdAt', sorting)).toBe('asc');
    expect(sortDirectionForColumn('fileName', sorting)).toBe(false);
  });

  it('returns desc when sorted descending', () => {
    const sorting = [{ id: 'email', desc: true }];
    expect(sortDirectionForColumn('email', sorting)).toBe('desc');
  });

  it('reads filter values by column id', () => {
    const columnFilters = [{ id: 'email', value: 'test@example.com' }];
    expect(filterValueForColumn('email', columnFilters)).toBe('test@example.com');
    expect(hasActiveColumnFilter('kind', columnFilters)).toBe(false);
    expect(hasActiveColumnFilter('email', columnFilters)).toBe(true);
  });

  it('treats cleared filters as inactive', () => {
    const columnFilters = [{ id: 'email', value: '' }];
    expect(hasActiveColumnFilter('email', columnFilters)).toBe(false);
  });
});
