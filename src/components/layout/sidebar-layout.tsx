/**
 * Sidebar shell wrapping header, navigation, and main content outlet.
 *
 * @packageDocumentation
 */

import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { CollapseSidebarForVerify } from '@/components/layout/collapse-sidebar-for-verify';
import { RouteChromeProvider } from '@/components/layout/route-chrome-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { isDevEmbedPath } from '@/lib/dev-embed';
import { isVerifyFlowPath } from '@/lib/verify-routes';
import { cn } from '@/lib/utils';

/** Compose sidebar, header, and scrollable main content for routed pages. */
export function SidebarLayout() {
  const { pathname } = useLocation();
  const isDevEmbed = isDevEmbedPath(pathname);
  const collapseSidebar = isVerifyFlowPath(pathname);

  return (
    <RouteChromeProvider>
      <SidebarProvider defaultOpen={!collapseSidebar}>
        <CollapseSidebarForVerify />
        <AppSidebar />
        <SidebarInset className="min-h-0 min-w-0">
          <AppHeader />
          <div
            className={cn(
              'flex min-h-0 min-w-0 flex-1 flex-col',
              isDevEmbed ? 'overflow-hidden' : 'overflow-x-hidden overflow-y-auto',
            )}
          >
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteChromeProvider>
  );
}
