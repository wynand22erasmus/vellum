/**
 * Browser-side API helpers for the dashboard (dev auth header + `fetch` wrapper).
 *
 * @packageDocumentation
 */

/** RFC 9457 Problem Details shape returned by API error responses. */
export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  actionRequired?: string;
  [key: string]: unknown;
};

const DEV_EMAIL_KEY = 'vellum_dev_email';

function getDevEmail(): string | null {
  return localStorage.getItem(DEV_EMAIL_KEY);
}

/**
 * Persists the recipient email used for dev dashboard login.
 *
 * @param email - Recipient address matching an uploaded document
 */
export function setDevEmail(email: string): void {
  localStorage.setItem(DEV_EMAIL_KEY, email);
}

/** Clears the dev-auth email from `localStorage`. */
export function clearDevEmail(): void {
  localStorage.removeItem(DEV_EMAIL_KEY);
}

/** @internal */
function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const devEmail = getDevEmail();
  if (devEmail) {
    headers['X-Dev-User-Email'] = devEmail;
  }
  return headers;
}

/**
 * `fetch` to `/api/*` with credentials and dev-auth headers when applicable.
 *
 * @param path - API path (e.g. `/api/documents`)
 * @param init - Standard `RequestInit` options
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      ...authHeaders(),
      ...(init?.headers as Record<string, string>),
    },
  });
}

/**
 * Parses an RFC 9457 Problem Details body from a failed response.
 *
 * @param res - HTTP response (typically `!res.ok`)
 */
export async function parseProblem(res: Response): Promise<ProblemDetails> {
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/problem+json')) {
    return (await res.json()) as ProblemDetails;
  }
  try {
    const body = (await res.json()) as { detail?: string; title?: string; type?: string };
    return {
      type: body.type ?? 'about:blank',
      title: body.title ?? 'Error',
      status: res.status,
      detail: body.detail,
    };
  } catch {
    return {
      type: 'about:blank',
      title: 'Error',
      status: res.status,
      detail: res.statusText || 'Request failed.',
    };
  }
}

/**
 * Returns the user-facing message from a Problem Details object.
 *
 * @param problem - Parsed problem body
 */
export function problemMessage(problem: ProblemDetails): string {
  return problem.detail ?? problem.title;
}

/**
 * `apiFetch` that parses Problem Details on non-OK responses.
 *
 * @param path - API path
 * @param init - Standard `RequestInit` options
 */
export async function apiFetchProblem(
  path: string,
  init?: RequestInit,
): Promise<{ res: Response; problem?: ProblemDetails }> {
  const res = await apiFetch(path, init);
  if (!res.ok) {
    const problem = await parseProblem(res);
    return { res, problem };
  }
  return { res };
}
