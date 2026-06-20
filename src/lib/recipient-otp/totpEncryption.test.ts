import { describe, expect, it } from 'vitest';
import { decryptTotpSecret, encryptTotpSecret } from './totpEncryption.ts';

describe('totpEncryption', () => {
  it('round-trips a TOTP secret', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const encrypted = encryptTotpSecret(secret);
    expect(encrypted).not.toContain(secret);
    expect(decryptTotpSecret(encrypted)).toBe(secret);
  });
});
