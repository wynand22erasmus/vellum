/**
 * Dashboard session JWT creation and verification (HS256, 7-day TTL).
 *
 * @packageDocumentation
 */

import type { Response } from 'express';
import { SignJWT, jwtVerify } from 'jose';
import type { AuthUser } from './types.ts';
import { AppError } from '../errors/app-error.ts';
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
 * @throws {@link AppError} When the token is invalid or missing required claims
 */
export async function verifySessionToken(token: string): Promise<SessionUser> {
  const { payload } = await jwtVerify(token, secret);
  const email = payload.email;
  if (typeof email !== 'string' || typeof payload.sub !== 'string') {
    throw AppError.unauthorized('Invalid session payload.');
  }
  return { id: payload.sub, email };
}

/**
 * Sets the HTTP-only dashboard session cookie on the response.
 *
 * @param res - Express response
 * @param token - JWT from {@link createSessionToken}
 */
export function setSessionCookie(res: Response, token: string): void {
  res.cookie('vellum_session', token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}
