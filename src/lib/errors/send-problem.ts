/**
 * Sends RFC 9457 Problem Details HTTP responses.
 *
 * @packageDocumentation
 */

import type { Response } from 'express';
import type { ProblemDetails } from './problem-from-error.ts';

/**
 * Writes an `application/problem+json` response.
 *
 * @param res - Express response
 * @param problem - RFC 9457 body
 */
export function sendProblem(res: Response, problem: ProblemDetails): void {
  if (res.headersSent) {
    return;
  }
  res
    .status(problem.status)
    .type('application/problem+json')
    .json(problem);
}
