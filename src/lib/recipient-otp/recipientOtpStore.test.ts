import { describe, expect, it, vi } from 'vitest';
import { generateOtpCode } from './recipientOtpStore.ts';

vi.mock('../env.ts', () => ({
  env: {
    recipientOtpDevCode: () => '654321',
    otpTtlSeconds: 600,
    otpMaxAttempts: 5,
    otpMaxResends: 3,
  },
}));

describe('generateOtpCode', () => {
  it('uses RECIPIENT_OTP_DEV_CODE when set', () => {
    expect(generateOtpCode()).toBe('654321');
  });
});
