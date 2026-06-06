/**
 * Primary sidebar with brand header and session footer.
 *
 * @packageDocumentation
 */

import { Link, useNavigate } from '@tanstack/react-router';
import { NavGuestFooter } from '@/components/layout/nav-guest-footer';
import { NavUser } from '@/components/layout/nav-user';
import { SidebarUserSkeleton } from '@/components/layout/auth-skeletons';
import { useAuthMe } from '@/providers/auth-provider';
import { clearDevEmail } from '@/lib/api';
import { apiPost } from '@/lib/api-client';
import { BrandLogo } from '@/components/brand/brand-logo';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useSidebarNav } from '@/hooks/use-sidebar-nav';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { useBrand } from '@/providers/brand-provider';
import { toast } from 'sonner';

/** Collapsible sidebar. */
export function AppSidebar() {
  const navigate = useNavigate();
  const brand = useBrand();
  const { user, loading, refresh } = useAuthMe();
  const nav = useSidebarNav();
  const homeHref = user ? normalizeAppPath('/dashboard') : normalizeAppPath('/login');

  async function handleSignOut() {
    clearDevEmail();
    await apiPost('/api/auth/logout');
    await refresh();
    toast.success('Signed out');
    void navigate({ to: normalizeAppPath('/login'), replace: true });
  }

  return (
    <Sidebar variant="inset" collapsible="icon" className="sidebar-surface border-sidebar-border/60">
      <SidebarHeader className="relative border-b border-sidebar-border/60 pb-3">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-brand-accent/70 to-transparent"
          aria-hidden
        />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={homeHref}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl border border-sidebar-border/80 bg-logo-surface shadow-sm ring-1 ring-primary/10">
                  <BrandLogo className="size-7" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{brand.shortName}</span>
                  <span className="truncate text-xs text-muted-foreground">{brand.tagline}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav nav={nav} />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={user} onSignOut={() => void handleSignOut()} />
        ) : loading ? (
          <SidebarUserSkeleton />
        ) : (
          <NavGuestFooter />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
