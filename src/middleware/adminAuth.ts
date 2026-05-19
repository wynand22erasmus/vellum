/**
 * Requires an authenticated {@link UserKind.ADMIN} user.
 *
 * @packageDocumentation
 */

import type { Request, Response, NextFunction } from 'express';
import { resolveRequestUser } from '../lib/auth/resolveUser.ts';

/**
 * Populates `req.user` and rejects non-admin callers. Used for `/docs/`.
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
      res.redirect('/login');
      return;
    }
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  if (user.kind !== 'ADMIN') {
    if (acceptsHtml) {
      res.status(403).type('text/plain').send('Admin access required.');
      return;
    }
    res.status(403).json({ error: 'Admin access required.' });
    return;
  }
  req.user = user;
  next();
}
