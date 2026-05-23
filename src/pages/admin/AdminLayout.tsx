/**
 * Admin data browser shell: gate on `UserKind.ADMIN`.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/api.ts';

/** Nested routes under `/admin/*` with an admin-only gate. */
export function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await apiFetch('/api/auth/me');
      if (cancelled) {
        return;
      }
      if (!res.ok) {
        navigate('/', { replace: true });
        return;
      }
      const data = (await res.json()) as { user: { kind: string } | null };
      if (!data.user) {
        window.location.href = `/login?returnTo=${encodeURIComponent('/admin')}`;
        return;
      }
      if (data.user.kind !== 'ADMIN') {
        navigate('/', { replace: true });
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  );
}
