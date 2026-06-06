/**
 * 404 handler for unmatched API routes.
 *
 * @packageDocumentation
 */

import type { RequestHandler } from 'express';
import { AppError } from '../../lib/errors/app-error.ts';

/**
 * Throws {@link AppError.notFound} for routes that did not match.
 */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(AppError.notFound(`No route for ${req.method} ${req.originalUrl}.`));
};
