/**
 * Dashboard authentication: WorkOS session cookie or dev email header.
 *
 * @packageDocumentation
 */

import type { Request, Response, NextFunction } from 'express';
import { env } from '../lib/env.ts';
import { verifySessionToken } from '../lib/auth/session.ts';

/**
 * Populates `req.user` for protected dashboard routes.
 *
 * @remarks
 * - **WorkOS:** requires `vellum_session` cookie (see `/api/auth/callback`).
 * - **Dev:** requires `X-Dev-User-Email` header (see `src/lib/api.ts`).
 * Mounted on `/api/documents`.
 */
export async function dashboardAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (env.authProvider === 'workos') {
    const session = req.cookies?.vellum_session;
    if (!session) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }
    try {
      req.user = await verifySessionToken(session);
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired session.' });
    }
    return;
  }

  const devEmail = req.headers['x-dev-user-email'];
  if (typeof devEmail !== 'string' || !devEmail.includes('@')) {
    res.status(401).json({
      error: 'Not authenticated. Set X-Dev-User-Email header for local development.',
    });
    return;
  }

  req.user = { id: `dev:${devEmail}`, email: devEmail };
  next();
}
