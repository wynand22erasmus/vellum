/**
 * Wraps async Express handlers so rejections reach the global error handler.
 *
 * @packageDocumentation
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response>;

/**
 * Catches promise rejections from async route handlers and forwards them to `next(err)`.
 *
 * @param fn - Async Express handler
 */
export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
