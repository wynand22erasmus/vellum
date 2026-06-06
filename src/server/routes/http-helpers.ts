/**
 * Express route helpers for success result envelopes.
 *
 * @packageDocumentation
 */

import type { Request, Response } from 'express';
import { sendResult } from '../../lib/results/send-result.ts';
import type { ResultTypeSlug } from '../../lib/results/result-types.ts';

function sendOk<T>(
  req: Request,
  res: Response,
  slug: ResultTypeSlug,
  data: T,
  detail?: string,
  status?: number,
): void {
  sendResult(res, {
    slug,
    data,
    detail,
    status,
    instance: req.originalUrl,
  });
}

/** Sends a 200 OK result envelope. */
export function ok<T>(req: Request, res: Response, data: T, detail?: string): void {
  sendOk(req, res, 'ok', data, detail, 200);
}

/** Sends a 201 Created result envelope. */
export function created<T>(req: Request, res: Response, data: T, detail?: string): void {
  sendOk(req, res, 'created', data, detail, 201);
}

/** Sends a 200 OK result with null data (detail-only confirmation). */
export function okMessage(req: Request, res: Response, detail: string): void {
  sendOk(req, res, 'ok', null, detail, 200);
}
