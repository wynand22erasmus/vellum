/**
 * React context provider for dashboard session state (`GET /api/auth/me`).
 *
 * @packageDocumentation
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadAuthSession, resetAuthSessionInFlight } from '@/lib/auth-session';
import type { AuthUser } from '@/lib/auth';

/** Auth context value shared by {@link useAuthContext} and {@link useAuthMe}. */
export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Loads and provides the current session user to the component tree. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    resetAuthSessionInFlight();
    setLoading(true);
    try {
      const nextUser = await loadAuthSession();
      setUser(nextUser);
      return nextUser;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const nextUser = await loadAuthSession(controller.signal);
        if (!cancelled) {
          setUser(nextUser);
        }
      } catch {
        // Aborted by Strict Mode teardown — ignore.
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: user?.kind === 'ADMIN',
      refresh,
    }),
    [user, loading, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Returns auth context; throws when used outside {@link AuthProvider}.
 *
 * @throws {Error} When used outside `AuthProvider`
 */
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}

/** Alias for {@link useAuthContext} — session user and refresh helpers. */
export function useAuthMe(): AuthContextValue {
  return useAuthContext();
}
