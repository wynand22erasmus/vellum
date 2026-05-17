const DEV_EMAIL_KEY = 'vellum_dev_email';

export function getDevEmail(): string | null {
  return localStorage.getItem(DEV_EMAIL_KEY);
}

export function setDevEmail(email: string): void {
  localStorage.setItem(DEV_EMAIL_KEY, email);
}

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
