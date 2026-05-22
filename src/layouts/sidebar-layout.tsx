/**
 * Layout with sidebar-08 inset sidebar and main content outlet.
 *
 * @packageDocumentation
 */

import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/app-sidebar.tsx';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx';

/** Renders inset sidebar + routed page content (main area stays beside the sidebar). */
export function SidebarLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
