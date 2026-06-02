/**
 * Assigns a correlation id to each HTTP request for logging and support.
 *
 * @packageDocumentation
 */

import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * Sets `X-Request-Id` on the response from `X-Request-Id` header or a new UUID.
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string) ?? randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}
