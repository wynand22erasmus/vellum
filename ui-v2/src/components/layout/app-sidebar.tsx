import { Link, useNavigate } from 'react-router-dom';
import { NavGuestFooter } from '@/components/layout/nav-guest-footer';
import { NavUser } from '@/components/layout/nav-user';
import { VellumSidebarNav } from '@/components/layout/vellum-sidebar-nav';
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
import { SidebarUserSkeleton } from '@/components/layout/require-auth';
import { useAuthMe } from '@/hooks/use-auth-me';
import { apiFetch, clearDevEmail } from '@/lib/api';
import { useSidebarNavGroups } from '@/hooks/use-sidebar-nav-groups';
import { toast } from 'sonner';

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, loading, refresh } = useAuthMe();
  const nav = useSidebarNavGroups();
  const homeHref = user ? '/dashboard' : '/login';

  async function handleSignOut() {
    clearDevEmail();
    await apiFetch('/api/auth/logout', { method: 'POST' });
    await refresh();
    toast.success('Signed out');
    navigate('/login', { replace: true });
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={homeHref}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-sidebar-border bg-logo-surface">
                  <img src="/favicon.png" alt="" width={28} height={28} className="size-7 object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Vellum</span>
                  <span className="truncate text-xs text-muted-foreground">Secure document transfer</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <VellumSidebarNav nav={nav} />
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
