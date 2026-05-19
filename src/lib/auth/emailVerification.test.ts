import { beforeAll, describe, expect, it } from 'vitest';

beforeAll(() => {
  process.env.SESSION_SECRET ??= 'test-session-secret-at-least-32-characters';
});
import {
  assertEmailVerified,
  createEmailVerificationToken,
  EmailNotVerifiedError,
  isEmailVerificationSatisfied,
  verifyEmailVerificationToken,
} from './emailVerification.ts';
import type { AuthUser } from './types.ts';

const baseUser: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
  emailVerified: false,
  kind: 'CONSUMER',
  firstName: null,
  lastName: null,
  profilePictureUrl: null,
};

describe('assertEmailVerified', () => {
  it('allows verified users', () => {
    expect(() =>
      assertEmailVerified({ ...baseUser, emailVerified: true }),
    ).not.toThrow();
  });

  it('rejects unverified users when checks are enabled', () => {
    expect(() => assertEmailVerified(baseUser)).toThrow(EmailNotVerifiedError);
  });

  it('reports unverified consumers as not satisfied', () => {
    expect(isEmailVerificationSatisfied(baseUser)).toBe(false);
  });

  it('allows unverified admin users', () => {
    expect(isEmailVerificationSatisfied({ ...baseUser, kind: 'ADMIN' })).toBe(true);
    expect(() => assertEmailVerified({ ...baseUser, kind: 'ADMIN' })).not.toThrow();
  });
});

describe('email verification tokens', () => {
  it('round-trips a verification token', async () => {
    const token = await createEmailVerificationToken('dev:user@example.com', 'user@example.com');
    await expect(verifyEmailVerificationToken(token)).resolves.toEqual({
      userId: 'dev:user@example.com',
      email: 'user@example.com',
    });
  });
});
