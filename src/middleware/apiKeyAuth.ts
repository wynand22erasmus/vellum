/**
 * Bearer API key authentication for machine-to-machine upload requests.
 *
 * @packageDocumentation
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors/app-error.ts';
import { env } from '../lib/env.ts';

/**
 * Validates `Authorization: Bearer <API_KEY>` against `env.apiKey`.
 *
 * @remarks Mounted on `/api/upload` only.
 */
export function apiKeyAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(AppError.unauthorized('Missing or invalid Authorization header.'));
    return;
  }

  const token = authHeader.slice(7);
  if (token !== env.apiKey) {
    next(AppError.unauthorized('Invalid API key.'));
    return;
  }

  next();
}
