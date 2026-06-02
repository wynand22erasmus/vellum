/**
 * Public exports for the RFC 9457 error handling module.
 *
 * @packageDocumentation
 */

/** Canonical operational error for routes, workers, and lib code. */
export { AppError, type AppErrorOptions } from './app-error.ts';
export { PROBLEM_TYPE_BASE_URL, PROBLEM_TITLES, PROBLEM_STATUS, problemTypeUri, type ProblemTypeSlug } from './problem-types.ts';
export { problemFromError, type ProblemDetails } from './problem-from-error.ts';
export { sendProblem } from './send-problem.ts';
export { recordProcessError, type RecordProcessErrorInput, type ProcessErrorSource } from './record-process-error.ts';
