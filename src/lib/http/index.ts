/**
 * Public exports for unified HTTP response envelopes.
 *
 * @packageDocumentation
 */

export {
  PROBLEM_CONTENT_TYPE,
  RESULT_CONTENT_TYPE,
  type Rfc9457Document,
} from './rfc9457.ts';
export {
  type ProblemDetails,
  type InvalidParam,
  isProblemDetails,
  problemMessage,
  problemActionRequired,
  problemInvalidParams,
} from './problem-details.ts';
export {
  type VellumResult,
  isVellumResult,
  unwrapResult,
} from './vellum-result.ts';
export {
  type ApiEnvelope,
  type ApiEnvelopeKind,
  apiEnvelopeKind,
  isApiEnvelope,
} from './api-envelope.ts';
export { buildProblem, type BuildProblemInput } from './build-problem.ts';
export { buildResult, type BuildResultInput } from './build-result.ts';
export {
  parseApiEnvelope,
  parseProblem,
  parseResult,
  type ParsedApiResponse,
} from './parse-envelope.ts';
