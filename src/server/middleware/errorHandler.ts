/**
 * Global Express error handler — records process errors and sends Problem Details.
 *
 * @packageDocumentation
 */

import type { ErrorRequestHandler } from 'express';
import { problemFromError } from '../../lib/errors/problem-from-error.ts';
import { recordProcessErrorFromProblem } from '../../lib/errors/record-process-error.ts';
import { sendProblem } from '../../lib/errors/send-problem.ts';

/**
 * Final middleware: maps errors to RFC 9457 and triple-writes via `recordProcessError`.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const requestId = req.requestId;
  const instance = req.originalUrl;
  const { problem, internal } = problemFromError(err, { instance, requestId });

  recordProcessErrorFromProblem(problem, {
    instance,
    requestId,
    source: 'http',
    userId: req.user?.id,
    communicationId: req.errorCommunicationId,
    internal,
    correlationId: req.errorCorrelationId,
  });

  sendProblem(res, problem);
};
