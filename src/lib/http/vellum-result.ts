/**
 * RFC 9457-inspired success result envelope.
 *
 * @packageDocumentation
 */

import type { Rfc9457Document } from './rfc9457.ts';

/** Success envelope with typed `data` payload. */
export interface VellumResult<T = unknown> extends Rfc9457Document {
  data: T;
}

/** Returns true when `doc` is a result envelope (by URI namespace or status). */
export function isVellumResult<T = unknown>(doc: Rfc9457Document): doc is VellumResult<T> {
  if (doc.type.includes('/results/')) {
    return true;
  }
  if (doc.type.includes('/problems/')) {
    return false;
  }
  return doc.status < 400 && 'data' in doc;
}

/** Unwraps payload from a result envelope. */
export function unwrapResult<T>(result: VellumResult<T>): T {
  return result.data;
}
