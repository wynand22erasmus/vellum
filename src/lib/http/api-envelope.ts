/**
 * Discriminated union of success and error HTTP envelopes.
 *
 * @packageDocumentation
 */

import type { ProblemDetails } from './problem-details.ts';
import type { Rfc9457Document } from './rfc9457.ts';
import { isProblemDetails } from './problem-details.ts';
import { isVellumResult, type VellumResult } from './vellum-result.ts';

/** Union of RFC 9457 problem and Vellum success result envelopes. */
export type ApiEnvelope<T = unknown> = ProblemDetails | VellumResult<T>;

/** Discriminator for {@link ApiEnvelope} parsing. */
export type ApiEnvelopeKind = 'problem' | 'result';

/** Classifies an envelope by its `type` URI path segment. */
export function apiEnvelopeKind(doc: Rfc9457Document): ApiEnvelopeKind {
  return isProblemDetails(doc) ? 'problem' : 'result';
}

/** Returns true when value looks like a Vellum API envelope. */
export function isApiEnvelope(doc: unknown): doc is ApiEnvelope {
  if (typeof doc !== 'object' || doc === null) {
    return false;
  }
  const candidate = doc as Rfc9457Document;
  return (
    typeof candidate.type === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.status === 'number' &&
    (isProblemDetails(candidate) || isVellumResult(candidate))
  );
}
