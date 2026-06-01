/**
 * Browser-side API helpers for the dashboard (dev auth header + `fetch` wrapper).
 *
 * @packageDocumentation
 */

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
