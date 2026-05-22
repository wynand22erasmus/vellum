/**
 * Fetches the current session user from `GET /api/auth/me`.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import type { AuthUser } from '../lib/auth/types.ts';

/** Result payload returned by {@link useAuthMe}. */
export type UseAuthMeResult = {
  /** Current authenticated user (`null` when absent or `/api/auth/me` errors). */
  user: AuthUser | null;
  /** True while fetching or refetching the session user. */
  loading: boolean;
  /** Convenience flag comparing `AuthUser.kind` to ADMIN. */
  isAdmin: boolean;
  /** Bumps hook effect to rerun the fetch pipeline. */
  refresh: () => void;
};

/**
 * Loads the authenticated user once on mount (and when `refresh` is called).
 */
export function useAuthMe(): UseAuthMeResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/api/auth/me');
        if (cancelled) {
          return;
        }
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = (await res.json()) as { user: AuthUser };
        setUser(data.user);
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return {
    user,
    loading,
    isAdmin: user?.kind === 'ADMIN',
    refresh: () => setTick((n) => n + 1),
  };
}
