/**
 * Application sidebar (shadcn sidebar-08 inset variant).
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavGuestFooter } from './nav-guest-footer.tsx';
import { NavUser } from './nav-user.tsx';
import { VellumSidebarNav } from './vellum-sidebar-nav.tsx';
import { PanelLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar.tsx';
import { useAuthMe } from '../hooks/use-auth-me.ts';
import { apiFetch, clearDevEmail } from '../lib/api.ts';
import { buildSidebarNav } from '../lib/sidebar-nav.ts';
import type { DevServiceLink } from '../lib/dev-services.ts';

type MetaResponse = {
  isProduction: boolean;
  devServices: DevServiceLink[];
};

function SidebarCollapseButton() {
  const { toggleSidebar, state } = useSidebar();
  if (state === 'collapsed') {
    return null;
  }
  return (
    <SidebarMenuButton
      type="button"
      tooltip="Collapse sidebar"
      onClick={toggleSidebar}
    >
      <PanelLeft className="size-4" aria-hidden />
      <span>Collapse</span>
    </SidebarMenuButton>
  );
}

/** Left navigation column (sidebar-08 inset, icon collapsible). */
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
  const homeHref = user ? '/dashboard' : '/login';

  async function handleSignOut() {
    clearDevEmail();
    await apiFetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={homeHref}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-sidebar-border bg-logo-surface">
                  <img
                    src="/favicon.png"
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Vellum</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Secure document transfer
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarCollapseButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <VellumSidebarNav groups={groups} />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={user} onSignOut={() => void handleSignOut()} />
        ) : loading ? (
          <p className="px-2 py-1 text-xs text-muted-foreground">Loading…</p>
        ) : (
          <NavGuestFooter />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
