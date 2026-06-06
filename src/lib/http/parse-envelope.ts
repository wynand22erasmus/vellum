/**
 * Parses HTTP responses into unified ApiEnvelope types.
 *
 * @packageDocumentation
 */

import {
  isProblemDetails,
  problemMessage,
  type ProblemDetails,
} from './problem-details.ts';
import { PROBLEM_CONTENT_TYPE, RESULT_CONTENT_TYPE, type Rfc9457Document } from './rfc9457.ts';
import { isVellumResult, type VellumResult } from './vellum-result.ts';

/** Parsed HTTP response — success payload or RFC 9457 problem. */
export type ParsedApiResponse<T> =
  | { ok: true; result: VellumResult<T>; data: T }
  | { ok: false; problem: ProblemDetails };

async function readJsonBody(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function asRfc9457Document(body: unknown, status: number): Rfc9457Document | null {
  if (typeof body !== 'object' || body === null) {
    return null;
  }
  const candidate = body as Rfc9457Document;
  if (
    typeof candidate.type !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.status !== 'number'
  ) {
    return null;
  }
  if (candidate.status !== status) {
    return { ...candidate, status };
  }
  return candidate;
}

function fallbackProblem(res: Response, body: unknown): ProblemDetails {
  if (typeof body === 'object' && body !== null) {
    const partial = body as { detail?: string; title?: string; type?: string };
    return {
      type: partial.type ?? 'about:blank',
      title: partial.title ?? 'Error',
      status: res.status,
      detail: partial.detail,
    };
  }
  return {
    type: 'about:blank',
    title: 'Error',
    status: res.status,
    detail: res.statusText || 'Request failed.',
  };
}

/**
 * Parses JSON body, Content-Type, and status into a typed envelope.
 *
 * @param res - Fetch Response (body consumed once)
 */
export async function parseApiEnvelope<T>(res: Response): Promise<ParsedApiResponse<T>> {
  const contentType = res.headers.get('content-type') ?? '';
  const body = await readJsonBody(res);

  if (res.ok) {
    const doc = asRfc9457Document(body, res.status);
    if (doc && isVellumResult<T>(doc)) {
      return { ok: true, result: doc, data: doc.data };
    }
    if (contentType.includes(RESULT_CONTENT_TYPE) && doc && 'data' in doc) {
      return { ok: true, result: doc as VellumResult<T>, data: (doc as VellumResult<T>).data };
    }
    return {
      ok: false,
      problem: {
        type: 'about:blank',
        title: 'Invalid response',
        status: res.status,
        detail: 'Expected a VellumResult envelope (application/vnd.vellum.result+json).',
      },
    };
  }

  const doc = asRfc9457Document(body, res.status);
  if (doc && isProblemDetails(doc)) {
    return { ok: false, problem: doc };
  }
  if (contentType.includes(PROBLEM_CONTENT_TYPE) && typeof body === 'object' && body !== null) {
    return { ok: false, problem: body as ProblemDetails };
  }
  return { ok: false, problem: fallbackProblem(res, body) };
}

/** Parses a failed response as Problem Details. */
export async function parseProblem(res: Response): Promise<ProblemDetails> {
  const parsed = await parseApiEnvelope(res);
  if (!parsed.ok) {
    return parsed.problem;
  }
  return {
    type: 'about:blank',
    title: 'Error',
    status: res.status,
    detail: 'Expected an error response.',
  };
}

/** Parses a successful response as VellumResult. */
export async function parseResult<T>(res: Response): Promise<VellumResult<T>> {
  const parsed = await parseApiEnvelope<T>(res);
  if (parsed.ok) {
    return parsed.result;
  }
  throw new Error(problemMessage(parsed.problem));
}

export { problemMessage };
