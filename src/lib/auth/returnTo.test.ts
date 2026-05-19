import { describe, expect, it } from 'vitest';
import { safeReturnTo } from './returnTo.ts';

describe('safeReturnTo', () => {
  it('returns the path when it is a same-origin relative URL', () => {
    expect(safeReturnTo('/docs/')).toBe('/docs/');
  });

  it('rejects protocol-relative and off-site targets', () => {
    expect(safeReturnTo('//evil.example/phish')).toBe('/dashboard');
    expect(safeReturnTo('https://evil.example')).toBe('/dashboard');
  });

  it('falls back to the dashboard when missing or empty', () => {
    expect(safeReturnTo(undefined)).toBe('/dashboard');
    expect(safeReturnTo('')).toBe('/dashboard');
  });
});
