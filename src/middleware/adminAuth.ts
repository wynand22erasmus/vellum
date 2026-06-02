/**
 * Requires an authenticated {@link UserKind.ADMIN} user.
 *
 * @packageDocumentation
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors/app-error.ts';
import { resolveRequestUser } from '../lib/auth/resolveUser.ts';
import { env } from '../lib/env.ts';

/**
 * Populates `req.user` and rejects non-admin callers. Used for `/docs/` and `/api/admin/*`.
 * Unauthenticated HTML requests redirect to sign-in with `returnTo` preserved.
 */
export async function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await resolveRequestUser(req);
  const acceptsHtml = req.accepts('html') === 'html';

  if (!user) {
    if (acceptsHtml) {
      const returnTo = encodeURIComponent(req.originalUrl);
      if (env.authProvider === 'workos') {
        res.redirect(`/api/auth/login?returnTo=${returnTo}`);
      } else {
        res.redirect(`/login?returnTo=${returnTo}`);
      }
      return;
    }
    next(AppError.unauthorized('Not authenticated.'));
    return;
  }
  if (user.kind !== 'ADMIN') {
    if (acceptsHtml) {
      res.status(403).type('text/plain').send('Admin access required.');
      return;
    }
    next(AppError.forbidden('Admin access required.'));
    return;
  }
  req.user = user;
  next();
}
