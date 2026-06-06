/**
 * Unified envelope-aware API client for the dashboard.
 *
 * @packageDocumentation
 */

import { apiFetch, parseApiEnvelope, problemMessage, type ProblemDetails } from '@/lib/api';

/** Thrown when an API request returns a Problem Details envelope. */
export class ApiQueryError extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problemMessage(problem));
    this.name = 'ApiQueryError';
    this.problem = problem;
  }
}

/** GET JSON via unified envelope parsing. */
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  const parsed = await parseApiEnvelope<T>(res);
  if (!parsed.ok) {
    throw new ApiQueryError(parsed.problem);
  }
  return parsed.data;
}

/** POST JSON via unified envelope parsing. */
export async function apiPost<T>(
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const res = await apiFetch(path, {
    method: 'POST',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const parsed = await parseApiEnvelope<T>(res);
  if (!parsed.ok) {
    throw new ApiQueryError(parsed.problem);
  }
  return parsed.data;
}

/** POST and throw a plain Error with the problem message (form pages). */
export async function apiPostOrThrow(path: string, body?: unknown, init?: RequestInit): Promise<void> {
  try {
    await apiPost<unknown>(path, body, init);
  } catch (err) {
    if (err instanceof ApiQueryError) {
      throw new Error(problemMessage(err.problem), { cause: err });
    }
    throw err;
  }
}

/** Alias for react-query hooks — same as {@link apiGet}. */
export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  return apiGet<T>(path, init);
}
