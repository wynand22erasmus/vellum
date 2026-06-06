/**
 * Browser-side API transport (credentials + dev auth headers).
 *
 * @packageDocumentation
 */

export type {
  /** Union of RFC 9457 problem and Vellum success result envelopes. */
  ApiEnvelope,
  /** RFC 9457 `invalidParams` entry shape. */
  InvalidParam,
  /** Parsed HTTP response — success payload or RFC 9457 problem. */
  ParsedApiResponse,
  ProblemDetails,
  Rfc9457Document,
  VellumResult,
} from '@/lib/http';
export {
  parseApiEnvelope,
  parseProblem,
  parseResult,
  problemActionRequired,
  problemInvalidParams,
  problemMessage,
  unwrapResult,
} from '@/lib/http';

const DEV_EMAIL_KEY = 'vellum_dev_email';

function getDevEmail(): string | null {
  return localStorage.getItem(DEV_EMAIL_KEY);
}

/** Persists the recipient email used for dev dashboard login. */
export function setDevEmail(email: string): void {
  localStorage.setItem(DEV_EMAIL_KEY, email);
}

/** Clears the dev-auth email from `localStorage`. */
export function clearDevEmail(): void {
  localStorage.removeItem(DEV_EMAIL_KEY);
}

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

/** `fetch` to `/api/*` with credentials and dev-auth headers when applicable. */
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
