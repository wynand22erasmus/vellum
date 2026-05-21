/**
 * Layout with left sidebar and main content outlet.
 *
 * @packageDocumentation
 */

import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/app-sidebar.tsx';

/** Renders sidebar + routed page content. */
export function SidebarLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
