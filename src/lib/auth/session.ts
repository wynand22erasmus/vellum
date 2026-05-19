/**
 * Dashboard session JWT creation and verification (HS256, 7-day TTL).
 *
 * @packageDocumentation
 */

import { SignJWT, jwtVerify } from 'jose';
import type { AuthUser } from './types.ts';
import { env } from '../env.ts';

/** Claims stored in the dashboard session JWT. */
export type SessionUser = Pick<AuthUser, 'id' | 'email'>;

/** @internal */
const secret = new TextEncoder().encode(env.sessionSecret);

/**
 * Signs a session cookie value for the authenticated dashboard user.
 *
 * @param user - User id and email from WorkOS or dev login
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

/**
 * Verifies a session JWT and returns the embedded user claims.
 *
 * @param token - Raw cookie value
 * @throws {Error} When the token is invalid or missing required claims
 */
export async function verifySessionToken(token: string): Promise<SessionUser> {
  const { payload } = await jwtVerify(token, secret);
  const email = payload.email;
  if (typeof email !== 'string' || typeof payload.sub !== 'string') {
    throw new Error('Invalid session payload');
  }
  return { id: payload.sub, email };
}
