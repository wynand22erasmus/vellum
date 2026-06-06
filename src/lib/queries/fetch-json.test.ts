import { describe, expect, it } from 'vitest';
import { buildAdminListQuery } from './query-keys.js';

describe('buildAdminListQuery', () => {
  it('defaults limit and offset', () => {
    expect(buildAdminListQuery()).toBe('limit=50&offset=0');
  });

  it('accepts custom pagination', () => {
    expect(buildAdminListQuery({ limit: 25, offset: 50 })).toBe('limit=25&offset=50');
  });

  it('includes non-empty filter params', () => {
    expect(
      buildAdminListQuery({
        limit: 50,
        offset: 0,
        recipientEmail: 'user@example.com',
        fileName: '  report  ',
        kind: '',
      }),
    ).toBe('limit=50&offset=0&recipientEmail=user%40example.com&fileName=report');
  });
});
