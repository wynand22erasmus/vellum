/**
 * RFC 9457 Problem Details types and helpers.
 *
 * @packageDocumentation
 */

import type { Rfc9457Document } from './rfc9457.ts';

/** RFC 9457 Problem Details body (with extension members). */
export interface ProblemDetails extends Rfc9457Document {
  [key: string]: unknown;
}

/** RFC 9457 `invalidParams` entry shape. */
export type InvalidParam = {
  name: string;
  reason: string;
};

/** Returns true when `doc` is a problem envelope (by URI namespace or status). */
export function isProblemDetails(doc: Rfc9457Document): doc is ProblemDetails {
  if (doc.type.includes('/problems/')) {
    return true;
  }
  if (doc.type.includes('/results/')) {
    return false;
  }
  return doc.status >= 400;
}

/** User-facing message from a problem body. */
export function problemMessage(problem: ProblemDetails): string {
  return problem.detail ?? problem.title;
}

/** Reads optional `actionRequired` extension. */
export function problemActionRequired(problem: ProblemDetails): string | undefined {
  const value = problem.actionRequired;
  return typeof value === 'string' ? value : undefined;
}

/** Reads optional `invalidParams` extension. */
export function problemInvalidParams(problem: ProblemDetails): InvalidParam[] | undefined {
  const value = problem.invalidParams;
  if (!Array.isArray(value)) {
    return undefined;
  }
  return value.filter(
    (entry): entry is InvalidParam =>
      typeof entry === 'object' &&
      entry !== null &&
      typeof (entry as InvalidParam).name === 'string' &&
      typeof (entry as InvalidParam).reason === 'string',
  );
}
