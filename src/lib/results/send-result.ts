/**
 * Sends Vellum success result HTTP responses.
 *
 * @packageDocumentation
 */

import type { Response } from 'express';
import { buildResult, type BuildResultInput } from '../http/build-result.ts';
import { RESULT_CONTENT_TYPE } from '../http/rfc9457.ts';
import type { VellumResult } from '../http/vellum-result.ts';

/**
 * Writes an `application/vnd.vellum.result+json` response.
 *
 * @param res - Express response
 * @param result - VellumResult body
 */
export function sendResultEnvelope(res: Response, result: VellumResult): void {
  if (res.headersSent) {
    return;
  }
  res.status(result.status).type(RESULT_CONTENT_TYPE).json(result);
}

/** Builds and sends a result envelope. */
export function sendResult<T>(res: Response, input: BuildResultInput<T>): void {
  sendResultEnvelope(res, buildResult(input));
}
