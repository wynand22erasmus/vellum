/**
 * Root layout wrapper with global chrome (dev services menu, theme toggle).
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { DevServicesMenu } from './dev-services-menu.tsx';
import { ThemeToggle } from './theme-toggle.tsx';

/**
 * Page shell: fixed dev services menu, theme toggle, and main content area.
 *
 * @param props.children - Routed page content
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-2 p-4">
        <div className="pointer-events-auto">
          <DevServicesMenu />
        </div>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
      {children}
    </div>
  );
}
