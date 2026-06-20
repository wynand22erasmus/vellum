import { describe, expect, it, vi, beforeEach } from 'vitest';
import { isRecipientOtpRequired } from './recipientOtpService.ts';

vi.mock('../env.ts', () => ({
  env: {
    recipientOtpEnabled: true,
    otpTtlSeconds: 600,
    otpMaxAttempts: 5,
    otpMaxResends: 3,
    recipientOtpDevCode: () => '123456',
  },
}));

describe('isRecipientOtpRequired', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns true when enabled and channel set', () => {
    expect(isRecipientOtpRequired({ otpChannel: 'email' })).toBe(true);
  });

  it('returns false when channel is null', () => {
    expect(isRecipientOtpRequired({ otpChannel: null })).toBe(false);
  });
});
