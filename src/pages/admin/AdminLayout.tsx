/**
 * Admin data browser shell: gate on `UserKind.ADMIN` and primary navigation.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { VellumLogo } from '../../components/vellum-logo.tsx';
import { Button } from '../../components/ui/button.tsx';
import { apiFetch, getDevEmail } from '../../lib/api.ts';

function navClassName({ isActive }: { isActive: boolean }): string {
  return [
    'rounded-md px-2 py-1 transition-colors',
    isActive
      ? 'bg-[var(--color-muted)] font-medium text-[var(--color-foreground)]'
      : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]',
  ].join(' ');
}

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
      if (res.status === 401) {
        window.location.href = `/login?returnTo=${encodeURIComponent('/admin')}`;
        return;
      }
      if (!res.ok) {
        navigate('/', { replace: true });
        return;
      }
      const data = (await res.json()) as { user: { kind: string } };
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <p className="text-sm text-[var(--color-muted-foreground)]">Checking access…</p>
      </div>
    );
  }

  const devEmail = getDevEmail();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
            <VellumLogo variant="mark" />
            <nav className="flex flex-wrap gap-1 text-sm" aria-label="Admin sections">
              <NavLink to="/admin" end className={navClassName}>
                Overview
              </NavLink>
              <NavLink to="/admin/documents" className={navClassName}>
                Documents
              </NavLink>
              <NavLink to="/admin/users" className={navClassName}>
                Users
              </NavLink>
              <NavLink to="/admin/audit-logs" className={navClassName}>
                Audit logs
              </NavLink>
              <NavLink to="/admin/failed-audit-logs" className={navClassName}>
                Failed audit
              </NavLink>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {devEmail ? (
              <span className="max-w-[12rem] truncate text-xs text-[var(--color-muted-foreground)]">
                {devEmail}
              </span>
            ) : null}
            <Button variant="outline" size="sm" asChild>
              <a href="/">Home</a>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
