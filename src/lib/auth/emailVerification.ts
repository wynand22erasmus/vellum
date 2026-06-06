/**
 * Email verification tokens and guards for dashboard sign-in.
 *
 * @packageDocumentation
 * @remarks
 * Production users verify through WorkOS verification email.
 * Development users receive a Mailpit link via {@link createEmailVerificationToken}.
 * `UserKind` `ADMIN` users skip verification. Set `SKIP_EMAIL_VERIFICATION=true`
 * only for local E2E (never in production).
 */

import { SignJWT, jwtVerify } from 'jose';
import type { AuthUser } from './types.ts';
import { AppError } from '../errors/app-error.ts';
import { appErrorFromJwtVerify } from '../errors/jwt-errors.ts';
import { env } from '../env.ts';

/** Problem Details extension `reason` when sign-in is blocked pending email verification. */
export const EMAIL_NOT_VERIFIED_CODE = 'EMAIL_NOT_VERIFIED';

/** JWT `purpose` claim for account verification links. */
const VERIFY_PURPOSE = 'email_verify';

/** JWT `purpose` claim for the post-login “check your email” handoff page. */
const PENDING_PURPOSE = 'email_verify_pending';

/** @internal */
const secret = new TextEncoder().encode(env.sessionSecret);

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
 * @throws `AppError` With `forbidden` and `reason: EMAIL_NOT_VERIFIED` when verification is required
 */
export function assertEmailVerified(user: AuthUser): void {
  if (!isEmailVerificationSatisfied(user)) {
    throw AppError.emailNotVerified();
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
  let payload;
  try {
    ({ payload } = await jwtVerify(token, secret));
  } catch (err) {
    throw appErrorFromJwtVerify(err, 'email-verification');
  }

  if (payload.purpose !== VERIFY_PURPOSE || typeof payload.sub !== 'string') {
    throw AppError.badRequest(
      'The email verification link is missing required claims or was issued for a different purpose.',
    );
  }
  const email = payload.email;
  if (typeof email !== 'string') {
    throw AppError.badRequest(
      'The email verification link is missing the recipient email claim.',
    );
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
  let payload;
  try {
    ({ payload } = await jwtVerify(token, secret));
  } catch (err) {
    throw appErrorFromJwtVerify(err, 'pending-verification');
  }

  if (payload.purpose !== PENDING_PURPOSE || typeof payload.sub !== 'string') {
    throw AppError.badRequest(
      'The pending verification token is missing required claims or was issued for a different purpose.',
    );
  }
  const email = payload.email;
  if (typeof email !== 'string') {
    throw AppError.badRequest(
      'The pending verification token is missing the recipient email claim.',
    );
  }
  return { userId: payload.sub, email };
}
