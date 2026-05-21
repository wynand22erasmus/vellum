/**
 * Application sidebar: user panel, collapsible nav groups, theme toggle.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { VellumLogo } from './vellum-logo.tsx';
import { ThemeToggle } from './theme-toggle.tsx';
import { Button } from './ui/button.tsx';
import { SidebarNavGroup, SidebarNavSingleLink } from './sidebar-nav-group.tsx';
import { useAuthMe } from '../hooks/use-auth-me.ts';
import { apiFetch, clearDevEmail } from '../lib/api.ts';
import { buildSidebarNav, displayUserName } from '../lib/sidebar-nav.ts';
import type { DevServiceLink } from '../lib/dev-services.ts';

type MetaResponse = {
  isProduction: boolean;
  devServices: DevServiceLink[];
};

/** Left navigation column for all authenticated and public app routes. */
export function AppSidebar() {
  const { pathname } = useLocation();
  const { user, loading } = useAuthMe();
  const [devServices, setDevServices] = useState<DevServiceLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/meta');
        if (!res.ok) {
          return;
        }
        const data = (await res.json()) as MetaResponse;
        if (!cancelled && !data.isProduction) {
          setDevServices(data.devServices);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = buildSidebarNav({ pathname, user, devServices });

  async function handleSignOut() {
    clearDevEmail();
    await apiFetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <aside
      className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      aria-label="Application navigation"
    >
      <div className="border-b border-sidebar-border px-4 py-4">
        <VellumLogo variant="mark" />
      </div>

      {user ? (
        <div className="border-b border-sidebar-border px-4 py-3">
          <div className="flex items-start gap-3">
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-medium text-sidebar-accent-foreground"
                aria-hidden
              >
                {displayUserName(user).charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{displayUserName(user)}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-sidebar-accent px-2 py-0.5 text-xs text-sidebar-accent-foreground">
                {user.kind === 'ADMIN' ? 'Admin' : 'Recipient'}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => void handleSignOut()}
          >
            Sign out
          </Button>
        </div>
      ) : loading ? (
        <div className="border-b border-sidebar-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Loading…</p>
        </div>
      ) : null}

      <nav className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4">
        {groups.map((group) =>
          group.children ? (
            <SidebarNavGroup
              key={group.id}
              id={group.id}
              label={group.label}
              children={group.children}
              defaultOpen={group.id === 'dev-services' ? pathname === '/' : true}
            />
          ) : group.href ? (
            <div key={group.id}>
              <SidebarNavSingleLink label={group.label} href={group.href} />
            </div>
          ) : null,
        )}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3">
        <ThemeToggle />
      </div>
    </aside>
  );
}
