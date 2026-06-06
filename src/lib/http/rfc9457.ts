/**
 * RFC 9457 shared document fields and HTTP content types.
 *
 * @packageDocumentation
 */

/** RFC 9457 §3.1 fields common to Problem Details and Vellum results. */
export interface Rfc9457Document {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}

/** Content-Type for RFC 9457 Problem Details responses. */
export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

/** Content-Type for Vellum success result envelopes. */
export const RESULT_CONTENT_TYPE = 'application/vnd.vellum.result+json';
