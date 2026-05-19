/**
 * Email verification tokens and guards for dashboard sign-in.
 *
 * @packageDocumentation
 * @remarks
 * Production users verify through WorkOS ({@link sendWorkOSVerificationEmail}).
 * Development users receive a Mailpit link via {@link sendDevVerificationEmail}.
 * {@link UserKind.ADMIN | Admin} users skip verification. Set `SKIP_EMAIL_VERIFICATION=true`
 * only for local E2E (never in production).
 */

import { SignJWT, jwtVerify } from 'jose';
import type { AuthUser } from './types.ts';
import { env } from '../env.ts';

/** Error code returned when sign-in is blocked pending email verification. */
export const EMAIL_NOT_VERIFIED_CODE = 'EMAIL_NOT_VERIFIED';

/** JWT `purpose` claim for account verification links. */
const VERIFY_PURPOSE = 'email_verify';

/** JWT `purpose` claim for the post-login “check your email” handoff page. */
const PENDING_PURPOSE = 'email_verify_pending';

/** @internal */
const secret = new TextEncoder().encode(env.sessionSecret);

/**
 * Thrown when a user attempts to access the dashboard before verifying email.
 */
export class EmailNotVerifiedError extends Error {
  readonly code = EMAIL_NOT_VERIFIED_CODE;

  constructor(message = 'Email address must be verified before signing in.') {
    super(message);
    this.name = 'EmailNotVerifiedError';
  }
}

/**
 * Returns whether the user may access protected dashboard routes.
 *
 * @remarks Admins (`kind: ADMIN`) may sign in without verifying email.
 *
 * @param user - User loaded from the `users` table
 */
export function isEmailVerificationSatisfied(user: AuthUser): boolean {
  if (user.emailVerified) {
    return true;
  }
  if (user.kind === 'ADMIN') {
    return true;
  }
  return env.skipEmailVerification;
}

/**
 * Ensures the user has verified their email, is an admin, or verification is skipped in dev/E2E.
 *
 * @throws {@link EmailNotVerifiedError} When verification is required but not satisfied
 */
export function assertEmailVerified(user: AuthUser): void {
  if (!isEmailVerificationSatisfied(user)) {
    throw new EmailNotVerifiedError();
  }
}

/**
 * Signs a link token for dev email verification (`GET /api/auth/verify-email`).
 *
 * @param userId - Local user id (`dev:{email}` or WorkOS id)
 * @param email - Normalized recipient address
 */
export async function createEmailVerificationToken(
  userId: string,
  email: string,
): Promise<string> {
  return new SignJWT({ email, purpose: VERIFY_PURPOSE })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

/**
 * Validates a dev verification link and returns the user id and email.
 *
 * @param token - Query parameter from the verification email
 */
export async function verifyEmailVerificationToken(
  token: string,
): Promise<{ userId: string; email: string }> {
  const { payload } = await jwtVerify(token, secret);
  if (payload.purpose !== VERIFY_PURPOSE || typeof payload.sub !== 'string') {
    throw new Error('Invalid verification token');
  }
  const email = payload.email;
  if (typeof email !== 'string') {
    throw new Error('Invalid verification token');
  }
  return { userId: payload.sub, email };
}

/**
 * Signs a short-lived token for the “verify your email” UI (resend / instructions).
 *
 * @param userId - WorkOS or dev user id
 * @param email - Normalized email address
 */
export async function createPendingVerificationToken(
  userId: string,
  email: string,
): Promise<string> {
  return new SignJWT({ email, purpose: PENDING_PURPOSE })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
}

/**
 * Reads a pending-verification token from the login handoff page.
 *
 * @param token - `pending` query parameter
 */
export async function verifyPendingVerificationToken(
  token: string,
): Promise<{ userId: string; email: string }> {
  const { payload } = await jwtVerify(token, secret);
  if (payload.purpose !== PENDING_PURPOSE || typeof payload.sub !== 'string') {
    throw new Error('Invalid pending verification token');
  }
  const email = payload.email;
  if (typeof email !== 'string') {
    throw new Error('Invalid pending verification token');
  }
  return { userId: payload.sub, email };
}
