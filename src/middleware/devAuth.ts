/**
 * Dashboard authentication: WorkOS session cookie or dev email header.
 *
 * @packageDocumentation
 */

import type { Request, Response, NextFunction } from 'express';
import { resolveRequestUser } from '../lib/auth/resolveUser.ts';

/**
 * Populates `req.user` for protected dashboard routes.
 *
 * @remarks
 * - **All providers:** `vellum_session` cookie (see `/api/auth/callback` and dev `request-login`).
 * - **Dev only:** `X-Dev-User-Email` header from the SPA (see `src/lib/api.ts`) as a fallback for API calls.
 * Mounted on `/api/documents`.
 */
export async function dashboardAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await resolveRequestUser(req);
  if (!user) {
    res.status(401).json({
      error:
        'Not authenticated. Sign in or set X-Dev-User-Email for local development.',
    });
    return;
  }
  req.user = user;
  next();
}
