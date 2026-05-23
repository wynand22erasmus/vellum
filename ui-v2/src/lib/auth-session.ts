import { apiFetch } from '@/lib/api';
import type { AuthUser } from '@/lib/auth';

let inFlight: Promise<AuthUser | null> | null = null;

/** Drop any in-flight session probe so the next load hits the network (after login/logout). */
export function resetAuthSessionInFlight(): void {
  inFlight = null;
}

/**
 * Loads the current session user. Deduplicates concurrent calls (e.g. React Strict Mode).
 * Pass `signal` to cancel; aborted loads reject and do not update shared in-flight state.
 */
export async function loadAuthSession(signal?: AbortSignal): Promise<AuthUser | null> {
  if (!signal && inFlight) {
    return inFlight;
  }

  const task = (async () => {
    try {
      const res = await apiFetch('/api/auth/me', { signal });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as { user: AuthUser | null };
      return data.user ?? null;
    } catch (err) {
      if (signal?.aborted || (err instanceof DOMException && err.name === 'AbortError')) {
        throw err;
      }
      return null;
    }
  })();

  if (!signal) {
    inFlight = task.finally(() => {
      if (inFlight === task) {
        inFlight = null;
      }
    });
    return inFlight;
  }

  return task;
}
