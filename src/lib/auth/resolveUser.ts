/**
 * Resolves the authenticated dashboard user from `vellum_session` or dev headers.
 *
 * @packageDocumentation
 */

import type { Request } from 'express';
import { env } from '../env.ts';
import { verifySessionToken } from './session.ts';
import type { AuthUser } from './types.ts';
import { isEmailVerificationSatisfied } from './emailVerification.ts';
import { findUserById, upsertDevUser } from '../users/userService.ts';

/**
 * Returns the current user for the request, or `null` when unauthenticated
 * or when email verification is required but not yet satisfied.
 */
async function userFromSessionCookie(req: Request): Promise<AuthUser | null> {
  const session = req.cookies?.vellum_session;
  if (!session) {
    return null;
  }
  try {
    const sessionUser = await verifySessionToken(session);
    const user = await findUserById(sessionUser.id);
    if (!user || !isEmailVerificationSatisfied(user)) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export async function resolveRequestUser(req: Request): Promise<AuthUser | null> {
  const sessionUser = await userFromSessionCookie(req);
  if (sessionUser) {
    return sessionUser;
  }

  if (env.authProvider !== 'workos') {
    const devEmail = req.headers['x-dev-user-email'];
    if (typeof devEmail === 'string' && devEmail.includes('@')) {
      const user = await upsertDevUser(devEmail);
      if (!isEmailVerificationSatisfied(user)) {
        return null;
      }
      return user;
    }
  }

  return null;
}
