import { Outlet, useRouterState } from '@tanstack/react-router';
import { AppSurface } from '@/components/layout/app-surface';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

function isPublicMinimalChrome(pathname: string): boolean {
  return pathname.startsWith('/verify') || pathname.startsWith('/login');
}

function isDevEmbed(pathname: string): boolean {
  return /^\/dev\/[^/]+$/.test(pathname);
}

/** Sidebar + header + scrollable content for the app. */
export function AppShellLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const collapseSidebar = isPublicMinimalChrome(pathname);
  const isDevEmbedRoute = isDevEmbed(pathname);

  if (collapseSidebar) {
    return (
      <div className="app-root flex min-h-svh flex-1 flex-col bg-background">
        <Outlet />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen className="app-root shell-bg">
      <AppSidebar />
      <SidebarInset className="inset-surface min-h-0 min-w-0 border border-border/40 shadow-md shadow-primary/5 backdrop-blur-md md:rounded-2xl md:ring-1 md:ring-primary/10">
        <AppHeader />
        <AppSurface
          className={cn(
            isDevEmbedRoute ? 'overflow-hidden' : 'overflow-x-hidden overflow-y-auto',
          )}
        >
          <Outlet />
        </AppSurface>
      </SidebarInset>
    </SidebarProvider>
  );
}
