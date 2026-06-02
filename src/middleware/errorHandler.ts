/**
 * Global Express error handler — records process errors and sends Problem Details.
 *
 * @packageDocumentation
 */

import type { ErrorRequestHandler } from 'express';
import { problemFromError } from '../lib/errors/problem-from-error.ts';
import { recordProcessError } from '../lib/errors/record-process-error.ts';
import { sendProblem } from '../lib/errors/send-problem.ts';

/**
 * Final middleware: maps errors to RFC 9457 and triple-writes via {@link recordProcessError}.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const requestId = req.requestId;
  const instance = req.originalUrl;
  const { problem, internal } = problemFromError(err, { instance, requestId });
  const extensions = extractExtensions(problem);
  const correlationId =
    req.errorCorrelationId ??
    (typeof extensions.correlationId === 'string' ? extensions.correlationId : undefined);

  recordProcessError({
    problemType: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.detail ?? problem.title,
    instance,
    requestId,
    source: 'http',
    userId: req.user?.id,
    documentId: req.errorDocumentId,
    extensions,
    internal,
    ...(correlationId ? { correlationId } : {}),
  });

  sendProblem(res, problem);
};

function extractExtensions(problem: Record<string, unknown>): Record<string, unknown> {
  const reserved = new Set(['type', 'title', 'status', 'detail', 'instance']);
  const extensions: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(problem)) {
    if (!reserved.has(key)) {
      extensions[key] = value;
    }
  }
  return extensions;
}
