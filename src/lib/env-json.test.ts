import { describe, expect, it } from 'vitest';
import { parseJsonStringArray } from './env-json.ts';

describe('parseJsonStringArray', () => {
  it('returns fallback when unset', () => {
    expect(parseJsonStringArray(undefined, ['a@example.com'])).toEqual(['a@example.com']);
  });

  it('parses JSON email list', () => {
    expect(parseJsonStringArray('["Admin@Example.com"]', [])).toEqual(['admin@example.com']);
  });

  it('returns fallback on invalid JSON', () => {
    expect(parseJsonStringArray('not-json', ['fallback@example.com'])).toEqual([
      'fallback@example.com',
    ]);
  });
});
