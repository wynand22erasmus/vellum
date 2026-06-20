import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyHcaptcha } from './verifyHcaptcha.ts';

describe('verifyHcaptcha', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns failure when secret is missing', async () => {
    const result = await verifyHcaptcha('token');
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain('missing-secret');
  });

  it('returns success when siteverify succeeds', async () => {
    vi.stubEnv('HCAPTCHA_SECRET_KEY', 'test-secret');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      }),
    );

    const result = await verifyHcaptcha('valid-token', '127.0.0.1');
    expect(result.success).toBe(true);
  });

  it('returns failure when siteverify rejects token', async () => {
    vi.stubEnv('HCAPTCHA_SECRET_KEY', 'test-secret');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
      }),
    );

    const result = await verifyHcaptcha('bad-token');
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain('invalid-input-response');
  });
});
