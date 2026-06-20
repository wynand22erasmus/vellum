/**
 * Allows integrator API key or admin session for document revocation.
 *
 * @packageDocumentation
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../lib/errors/app-error.ts';
import { env } from '../../lib/env.ts';
import { adminAuth } from './adminAuth.ts';

declare module 'express-serve-static-core' {
  interface Request {
    /** How the caller authenticated for integrator-only routes. */
    authMode?: 'apiKey' | 'admin';
  }
}

/**
 * Accepts `Authorization: Bearer <API_KEY>` or an admin session cookie.
 */
export async function integratorOrAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token === env.apiKey) {
      req.authMode = 'apiKey';
      next();
      return;
    }
    next(AppError.unauthorized('Invalid API key.'));
    return;
  }

  await adminAuth(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }
    req.authMode = 'admin';
    next();
  });
}
