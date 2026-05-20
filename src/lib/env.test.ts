import { describe, expect, it } from 'vitest';
import { env } from './env.ts';

describe('env', () => {
  it('has sensible defaults for development', () => {
    expect(env.appUrl).toBeTruthy();
    expect(env.reportingLifetimeYears).toBeGreaterThan(0);
    expect(env.allowedUploadExtensions).toContain('txt');
    expect(env.allowedUploadExtensions).toContain('pdf');
  });

  it('does not skip virus scan by default', () => {
    expect(env.skipVirusScan).toBe(false);
  });
});
