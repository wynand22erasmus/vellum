import { beforeAll, describe, expect, it } from 'vitest';

beforeAll(() => {
  process.env.SESSION_SECRET ??= 'test-session-secret-at-least-32-characters';
});
import { AppError } from '../errors/app-error.ts';
import {
  assertEmailVerified,
  createEmailVerificationToken,
  EMAIL_NOT_VERIFIED_CODE,
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
    expect(() => assertEmailVerified(baseUser)).toThrow(AppError);
    try {
      assertEmailVerified(baseUser);
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).slug).toBe('forbidden');
      expect((err as AppError).extensions.reason).toBe(EMAIL_NOT_VERIFIED_CODE);
    }
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
